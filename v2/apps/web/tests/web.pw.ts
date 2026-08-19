import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const bundle = (globalThis as { __V2_BUNDLE__?: unknown }).__V2_BUNDLE__;
    void bundle;
  });
});

test("landing and questionnaire support start, answer, back, and explicit non-answer states", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Map the principles/i })).toBeVisible();
  await page.getByRole("button", { name: /Start the core/i }).click();
  await expect(page.getByTestId("question-card")).toBeVisible();
  await page.getByTestId("question-control").locator("button").first().click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Back" }).last().click();
  await expect(page.getByTestId("question-card")).toBeVisible();
  await page.getByRole("button", { name: "Abstain" }).click();
  await expect(page.getByRole("button", { name: "Abstain" })).toHaveClass(/active/);
});

test("complete fixture scores through the public result boundary", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  await expect(page.getByRole("heading", { name: /Complete evidence set|Partially scored|More evidence/i })).toBeVisible();
  await expect(page.getByText("Closest matches")).toBeVisible();
  await expect(page.getByText("Optional module results")).toBeVisible();
  await expect(page.getByText("Substantive tie at the top")).toBeVisible();
  await page.getByRole("button", { name: "Start over" }).click();
  await expect(page.getByRole("heading", { name: /Map the principles/i })).toBeVisible();
});

test("resumes a saved assessment after reload and can reach the final score", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Resume saved assessment" })).toBeVisible();
  await page.getByRole("button", { name: "Resume saved assessment" }).click();
  await expect(page.getByRole("button", { name: "View results" })).toBeVisible();
  await page.getByRole("button", { name: "View results" }).click();
  await expect(page.getByText("Closest matches")).toBeVisible();
});

test("resumes specialist progress with its selected module and cursor", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Start the core/i }).click();
  for (let index = 0; index < 338; index += 1) await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("heading", { name: /Choose a specialist module/i })).toBeVisible();
  await page.locator('input[type="checkbox"]').first().check();
  await page.getByRole("button", { name: /Continue to selected modules/i }).click();
  await expect(page.getByTestId("question-card")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Resume saved assessment" }).click();
  await expect(page.getByText(/Specialist module 1 of 1/)).toBeVisible();
  await expect(page.getByTestId("question-card")).toBeVisible();
});

test("exports, clears, imports, and rescoring preserves the private result flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export private save" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  await page.getByRole("button", { name: "Start over" }).click();
  await expect(page.getByRole("button", { name: "Resume saved assessment" })).not.toBeVisible();
  await page.locator('input[type="file"]').setInputFiles(path!);
  await expect(page.getByRole("button", { name: "View results" })).toBeVisible();
  await page.getByRole("button", { name: "View results" }).click();
  await expect(page.getByText("Closest matches")).toBeVisible();
});

test("rejects a corrupted private import without changing active state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Start the core/i }).click();
  await page.locator('input[type="file"]').setInputFiles({ name: "corrupt.v2-save.json", mimeType: "application/json", buffer: Buffer.from("{\"kind\":\"private-save\"}") });
  await expect(page.getByTestId("question-card")).toBeVisible();
  await expect(page.getByRole("status")).toContainText(/rejected|invalid/i);
});

test("shows an explicit stale-save warning and a privacy-minimized public share", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.evaluate(() => {
    const key = "ideology-sorter:v2:saves:current";
    const raw = localStorage.getItem(key);
    if (!raw) throw new Error("expected v2 save");
    const value = JSON.parse(raw) as { contentFingerprint?: string };
    value.contentFingerprint = "stale-content";
    localStorage.setItem(key, JSON.stringify(value));
  });
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(/cannot be resumed|clear/i);

  await page.getByRole("button", { name: "Clear saved assessment" }).click();
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  await page.getByRole("button", { name: "Generate public share preview" }).click();
  const share = page.getByLabel("Public share JSON");
  await expect(share).toBeVisible();
  expect(await share.inputValue()).not.toMatch(/coreResponses|specialistResponses|contributions|itemId/);
});

test("research is unavailable or can be declined without a network request", async ({ page }) => {
  let requests = 0;
  await page.route("https://research.local/submit", async (route) => { requests += 1; await route.abort(); });
  await page.goto("/");
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  await expect(page.getByRole("heading", { name: /Complete evidence set|Partially scored|More evidence/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "I consent to optional research" })).not.toBeVisible();
  expect(requests).toBe(0);

  await page.addInitScript(() => { window.__V2_RESEARCH_CONFIG__ = { enabled: true, endpoint: "https://research.local/submit" }; });
  await page.reload();
  await expect(page.getByRole("button", { name: "Resume saved assessment" })).toBeVisible();
  await page.getByRole("button", { name: "Resume saved assessment" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  await page.getByRole("button", { name: "Review optional research consent" }).click();
  await page.getByRole("button", { name: "Decline research" }).click();
  expect(requests).toBe(0);
  await expect(page.getByText("No research data was sent.")).toBeVisible();
});

test("explicit consent sends one version-bound raw-response envelope", async ({ page }) => {
  await page.addInitScript(() => { window.__V2_RESEARCH_CONFIG__ = { enabled: true, endpoint: "https://research.local/submit" }; });
  let requestCount = 0;
  let payload: Record<string, unknown> | undefined;
  await page.route("https://research.local/submit", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": "http://127.0.0.1:4174", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
      return;
    }
    requestCount += 1;
    payload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ accepted: true, deduplicated: false, submissionId: (payload.submissionId as string) }) });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  await page.getByRole("button", { name: "Review optional research consent" }).click();
  const heading = await page.getByRole("heading", { name: /Complete evidence set|Partially scored|More evidence/i }).innerText();
  await page.getByRole("button", { name: "I consent to optional research" }).click();
  await page.getByRole("button", { name: "Send research submission" }).click();
  await expect(page.getByRole("status")).toContainText("accepted");
  expect(requestCount).toBe(1);
  expect(payload?.researchSchemaVersion).toBe("research-v2.phase13.1");
  expect(payload?.consentVersion).toBe("consent-v2.phase13.1");
  expect(payload).not.toHaveProperty("participantId");
  expect(payload).not.toHaveProperty("email");
  expect(payload).not.toHaveProperty("result");
  expect(payload).not.toHaveProperty("diagnostics");
  expect(await page.getByRole("heading", { name: /Complete evidence set|Partially scored|More evidence/i }).innerText()).toBe(heading);
});

test("transient failure is retryable and keeps the same submission ID", async ({ page }) => {
  await page.addInitScript(() => { window.__V2_RESEARCH_CONFIG__ = { enabled: true, endpoint: "https://research.local/submit" }; });
  let postCount = 0;
  const ids: string[] = [];
  await page.route("https://research.local/submit", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": "http://127.0.0.1:4174", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
      return;
    }
    postCount += 1;
    ids.push((route.request().postDataJSON() as { submissionId: string }).submissionId);
    if (postCount <= 3) { await route.abort(); return; }
    await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ accepted: true, deduplicated: false, submissionId: ids[0] }) });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  await page.getByRole("button", { name: "Review optional research consent" }).click();
  const resultHeading = await page.getByRole("heading", { name: /Complete evidence set|Partially scored|More evidence/i }).innerText();
  await page.getByRole("button", { name: "I consent to optional research" }).click();
  await page.getByRole("button", { name: "Send research submission" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  expect(postCount).toBe(3);
  await page.getByRole("button", { name: "Try sending again" }).click();
  await expect(page.getByRole("status")).toContainText("accepted");
  expect(postCount).toBe(4);
  expect(new Set(ids).size).toBe(1);
  expect(await page.getByRole("heading", { name: /Complete evidence set|Partially scored|More evidence/i }).innerText()).toBe(resultHeading);
  await page.reload();
  expect(postCount).toBe(4);
});

test("importing an assessment does not auto-submit research", async ({ page }) => {
  await page.addInitScript(() => { window.__V2_RESEARCH_CONFIG__ = { enabled: true, endpoint: "https://research.local/submit" }; });
  let requests = 0;
  await page.route("https://research.local/submit", async (route) => { requests += 1; await route.abort(); });
  await page.goto("/");
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export private save" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  await page.getByRole("button", { name: "Start over" }).click();
  await page.locator('input[type="file"]').setInputFiles(path!);
  await page.getByRole("button", { name: "View results" }).click();
  expect(requests).toBe(0);
  await expect(page.getByRole("button", { name: "Review optional research consent" })).toBeVisible();
});

test("@a11y the landing and result states have no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const landing = await new AxeBuilder({ page }).analyze();
  expect(landing.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious")).toEqual([]);
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious")).toEqual([]);
});

test("@visual stable landing, question, and results screenshots", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("v2-landing.png", { fullPage: true });
  await page.getByRole("button", { name: /Start the core/i }).click();
  await expect(page).toHaveScreenshot("v2-core-question.png", { fullPage: true });
  await page.getByRole("button", { name: "Back" }).first().click();
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  await expect(page).toHaveScreenshot("v2-results.png", { fullPage: true });
  await expect(page).toHaveScreenshot("v2-tied-results.png", { fullPage: true });
});

test("@visual renders the question responsively", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /Start the core/i }).click();
  await expect(page).toHaveScreenshot("v2-core-question-mobile.png", { fullPage: true });
});

test("@visual renders the canonical statement-choice control", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Start the core/i }).click();
  for (let index = 0; index < 400; index += 1) {
    if (await page.locator('[role="radiogroup"][aria-label^="Statements for"]').count()) break;
    await page.getByRole("button", { name: "Next" }).click();
  }
  await expect(page.locator('[role="radiogroup"][aria-label^="Statements for"]')).toBeVisible();
  await expect(page).toHaveScreenshot("v2-statement-choice.png", { fullPage: true });
});

test("@visual captures insufficient evidence and each result section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Use insufficient test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  await expect(page.getByRole("heading", { name: "More evidence is needed" })).toBeVisible();
  await expect(page).toHaveScreenshot("v2-insufficient-results.png", { fullPage: true });

  await page.goto("/");
  await page.getByRole("button", { name: "Use complete test fixture" }).click();
  await page.getByRole("button", { name: "View results" }).click();
  const sections = page.locator(".result-section");
  await expect(sections.nth(0)).toHaveScreenshot("v2-primary-results.png");
  await expect(sections.nth(1)).toHaveScreenshot("v2-modifiers-results.png");
  await expect(sections.nth(2)).toHaveScreenshot("v2-specialist-results.png");
  await expect(sections.nth(3)).toHaveScreenshot("v2-construct-detail.png");
  await expect(sections.nth(4)).toHaveScreenshot("v2-diagnostics.png");
});
