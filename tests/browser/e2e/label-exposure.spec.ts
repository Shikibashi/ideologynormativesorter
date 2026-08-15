import { expect, test, type Browser, type Page } from "@playwright/test";
import { LABEL_EXPOSURE_VERSION } from "../../../src/research/versions";

type ExposureArm = "dimension-only" | "unlabeled-profile" | "named-label";

interface SubmittedExposure {
  assignment: {
    version: string;
    studyId: string;
    participantId: string;
    arm: ExposureArm;
    seed: string;
    assignedAfterSubstantiveResponses: boolean;
  };
  exposureShown: boolean;
  presentation: {
    version: string;
    fingerprint: string;
    axes: Array<Record<string, unknown>>;
  };
  exposedLabelIds: string[];
  ratings: Record<string, unknown>;
}

interface SubmittedCore {
  recordType: "core";
  participantId: string;
  predictedLabelIds: string[];
  labelExposure?: SubmittedExposure;
}

interface CommonProfileSnapshot {
  heading: string;
  summary: string;
  dimensionsHeading: string;
  dimensions: string[];
}

interface ArmSnapshot {
  arm: ExposureArm;
  commonProfile: CommonProfileSnapshot;
  serializedProfile: SubmittedExposure["presentation"];
  exposedLabelIds: string[];
  receiptStatus: number;
}

const NAMED_LABEL_EXPLANATION =
  "These ideological names describe similarity to your measured political profile; they do not identify you or establish your ideological identity.";
const ARM_FIXTURES: Array<{
  studyId: string;
  participantId: string;
  arm: ExposureArm;
}> = [
  {
    studyId: "exposure-pilot-1",
    participantId: "p_test",
    arm: "dimension-only",
  },
  {
    studyId: "exposure-pilot-0",
    participantId: "p_test",
    arm: "unlabeled-profile",
  },
  {
    studyId: "exposure-pilot-4",
    participantId: "p_test",
    arm: "named-label",
  },
];

async function answerSubstantiveForm(page: Page): Promise<void> {
  for (let questionIndex = 0; questionIndex < 12; questionIndex += 1) {
    await page.locator(".scale-button, .statement-button").first().click();
    const salience = page.getByRole("button", { name: /^(low|medium|high)$/i });
    if (await salience.first().isVisible()) await salience.first().click();
  }
}

async function exerciseArm(
  browser: Browser,
  fixture: (typeof ARM_FIXTURES)[number],
): Promise<ArmSnapshot> {
  const context = await browser.newContext();
  const page = await context.newPage();
  let submittedPayload: SubmittedCore | null = null;
  let receiptStatus: number | null = null;
  let receivedCoreRequestCount = 0;

  try {
    await page.route("**/__e2e/research", async (route) => {
      if (route.request().method() === "POST") {
        const payload = route.request().postDataJSON() as {
          recordType?: string;
        };
        if (payload.recordType === "core") {
          receivedCoreRequestCount += 1;
          submittedPayload = payload as SubmittedCore;
        }
      }
      receiptStatus = 202;
      await route.fulfill({ status: 202, body: "{}" });
    });
    await page.addInitScript(
      ({ participantId, studyId }) => {
        localStorage.setItem(
          `political-judgment-research-participant-v1:${studyId}`,
          participantId,
        );
      },
      { participantId: fixture.participantId, studyId: fixture.studyId },
    );
    await page.goto(
      `/?research=1&exposure=1&study=${fixture.studyId}&formSize=12`,
    );

    await expect(
      page.getByRole("heading", { name: "Optional profile contribution" }),
    ).toBeVisible();
    for (const checkbox of await page.getByRole("checkbox").all())
      await checkbox.check();
    await page
      .getByRole("button", { name: /continue to balanced profile/i })
      .click();
    await answerSubstantiveForm(page);

    await expect(page.locator(".site-shell")).toHaveAttribute(
      "data-stage",
      "label-exposure",
    );
    await expect(
      page.getByRole("heading", { name: "How does this presentation land?" }),
    ).toBeVisible();

    const profile = page.locator("[data-exposure-profile]");
    await expect(
      profile.getByRole("heading", { name: "Substantive profile" }),
    ).toBeVisible();
    await expect(profile).not.toContainText(
      /raw|normalized|posterior|probabilit(?:y|ies)|margin|%|-?\d+\.\d+/i,
    );
    const commonProfile: CommonProfileSnapshot = {
      heading: (await profile
        .getByRole("heading", { name: "Substantive profile" })
        .textContent())!,
      summary: (await profile.locator("p").first().textContent())!,
      dimensionsHeading: (await profile
        .getByRole("heading", { name: "Profile dimensions" })
        .textContent())!,
      dimensions: await profile
        .getByRole("list", { name: "Profile dimensions" })
        .getByRole("listitem")
        .allTextContents(),
    };

    const namedExplanation = page.getByText(NAMED_LABEL_EXPLANATION, {
      exact: true,
    });
    const namedMatches = profile.getByRole("heading", {
      name: "Closest current profile matches",
    });
    if (fixture.arm === "named-label") {
      await expect(namedExplanation).toBeVisible();
      await expect(namedMatches).toBeVisible();
      await expect(
        profile
          .getByRole("list", { name: "Closest current profile matches" })
          .getByRole("listitem"),
      ).toHaveCount(3);
    } else {
      await expect(namedExplanation).toHaveCount(0);
      await expect(namedMatches).toHaveCount(0);
      await expect(profile).not.toContainText(
        "Closest current profile matches",
      );
    }

    await page
      .getByRole("button", { name: "Continue to optional profile fields" })
      .click();
    await expect(
      page.getByRole("heading", { name: "Before seeing your result" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Submit contribution and see result" })
      .click();
    await expect
      .poll(() => submittedPayload, { timeout: 10_000 })
      .not.toBeNull();

    const specialistInvite = page.getByRole("heading", {
      name: "Optional specialist follow-up",
    });
    const resultsHeading = page.getByRole("heading", { name: "Your results" });
    await expect
      .poll(
        async () =>
          (await specialistInvite.isVisible()) ||
          (await resultsHeading.isVisible()),
      )
      .toBe(true);
    if (await specialistInvite.isVisible()) {
      await page
        .getByRole("button", { name: "Skip follow-up and view main results" })
        .click();
    }
    await expect(resultsHeading).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Contribution submission status" }),
    ).toContainText("Your pseudonymous contribution was received");

    const payload = submittedPayload!;
    const exposure = payload.labelExposure!;
    expect(receivedCoreRequestCount).toBe(1);
    expect(receiptStatus).toBe(202);
    expect(payload.recordType).toBe("core");
    expect(exposure).toMatchObject({
      assignment: {
        version: LABEL_EXPOSURE_VERSION,
        studyId: fixture.studyId,
        participantId: fixture.participantId,
        arm: fixture.arm,
        assignedAfterSubstantiveResponses: true,
      },
      exposureShown: true,
      presentation: { version: LABEL_EXPOSURE_VERSION },
    });
    expect(exposure.exposedLabelIds).toEqual(
      fixture.arm === "named-label"
        ? payload.predictedLabelIds.slice(0, 3)
        : [],
    );
    expect(exposure.ratings).toEqual({
      affect: "prefer_not_to_answer",
      confidence: "prefer_not_to_answer",
      followUpStability: "prefer_not_to_answer",
      identityAcceptance: "prefer_not_to_answer",
      perceivedAccuracy: "prefer_not_to_answer",
    });
    expect(exposure.presentation.axes.length).toBeGreaterThan(0);
    expect(JSON.stringify(exposure.presentation)).not.toMatch(
      /raw|normalized|-?\d+\.\d+/i,
    );

    return {
      arm: fixture.arm,
      commonProfile,
      serializedProfile: exposure.presentation,
      exposedLabelIds: exposure.exposedLabelIds,
      receiptStatus: receiptStatus!,
    };
  } finally {
    await context.close();
  }
}

test("D-27A label exposure preserves common content and completes all three arms", async ({
  browser,
}) => {
  const snapshots: ArmSnapshot[] = [];
  for (const fixture of ARM_FIXTURES)
    snapshots.push(await exerciseArm(browser, fixture));

  expect(snapshots.map((snapshot) => snapshot.arm)).toEqual([
    "dimension-only",
    "unlabeled-profile",
    "named-label",
  ]);
  expect(snapshots[0].commonProfile).toEqual(snapshots[1].commonProfile);
  expect(snapshots[0].commonProfile).toEqual(snapshots[2].commonProfile);
  expect(snapshots[0].serializedProfile).toEqual(
    snapshots[1].serializedProfile,
  );
  expect(snapshots[0].serializedProfile).toEqual(
    snapshots[2].serializedProfile,
  );
  expect(snapshots[0].exposedLabelIds).toEqual([]);
  expect(snapshots[1].exposedLabelIds).toEqual([]);
  expect(snapshots[2].exposedLabelIds).toHaveLength(3);
  expect(snapshots.every((snapshot) => snapshot.receiptStatus === 202)).toBe(
    true,
  );
});
