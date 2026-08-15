import { expect, test } from "@playwright/test";
import { LABEL_EXPOSURE_VERSION } from "../../../src/research/versions";

interface SubmittedExposure {
  assignment: {
    version: string;
    assignedAfterSubstantiveResponses: boolean;
  };
  exposureShown: boolean;
  presentation: {
    version: string;
    axes: Array<Record<string, unknown>>;
  };
  exposedLabelIds: unknown[];
  ratings: Record<string, unknown>;
}

test("label exposure is assigned after substantive responses and leaves the score boundary intact", async ({
  page,
}) => {
  let submittedPayload: { labelExposure?: SubmittedExposure } | null = null;
  await page.route("**/__e2e/research", async (route) => {
    if (route.request().method() === "POST")
      submittedPayload = route.request().postDataJSON();
    await route.fulfill({ status: 202, body: "{}" });
  });
  await page.goto("/?research=1&exposure=1&study=exposure-pilot&formSize=12");

  await expect(
    page.getByRole("heading", { name: "Optional profile contribution" }),
  ).toBeVisible();
  for (const checkbox of await page.getByRole("checkbox").all())
    await checkbox.check();
  await page
    .getByRole("button", { name: /continue to balanced profile/i })
    .click();

  for (let questionIndex = 0; questionIndex < 12; questionIndex += 1) {
    await page.locator(".scale-button, .statement-button").first().click();
    const salience = page.getByRole("button", { name: /^(low|medium|high)$/i });
    if (await salience.first().isVisible()) await salience.first().click();
  }

  await expect(page.locator(".site-shell")).toHaveAttribute(
    "data-stage",
    "label-exposure",
  );
  await expect(
    page.getByRole("heading", { name: "How does this presentation land?" }),
  ).toBeVisible();
  await expect(page.locator(".results-screen")).toHaveCount(0);
  await expect(page.locator("[data-exposure-profile]")).not.toContainText(
    /normalized|posterior|probabilit(?:y|ies)|margin|%/i,
  );
  await expect(page.locator("[data-exposure-profile]")).toContainText(
    /near midpoint|slightly toward|leans toward|strongly toward|unmeasured/,
  );
  await expect(
    page.getByText(/This is a profile-similarity comparison/),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Continue to optional profile fields" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Before seeing your result" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Submit contribution and see result" })
    .click();
  await expect.poll(() => submittedPayload, { timeout: 10_000 }).not.toBeNull();

  const exposure = submittedPayload?.labelExposure;
  expect(exposure).toMatchObject({
    assignment: {
      version: LABEL_EXPOSURE_VERSION,
      assignedAfterSubstantiveResponses: true,
    },
    exposureShown: true,
    presentation: { version: LABEL_EXPOSURE_VERSION },
  });
  expect(Array.isArray(exposure.exposedLabelIds)).toBe(true);
  expect(Object.keys(exposure.ratings).sort()).toEqual([
    "affect",
    "confidence",
    "followUpStability",
    "identityAcceptance",
    "perceivedAccuracy",
  ]);
  expect(exposure.presentation.axes.length).toBeGreaterThan(0);
  expect(exposure.presentation.axes[0]).not.toHaveProperty("normalized");
});
