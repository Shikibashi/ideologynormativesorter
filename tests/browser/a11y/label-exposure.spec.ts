import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

async function expectNoViolations(page: Page, testInfo: TestInfo) {
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  await testInfo.attach("axe-results", {
    body: JSON.stringify(scan, null, 2),
    contentType: "application/json",
  });
  expect(scan.violations).toEqual([]);
}

test("label-exposure consent screen is accessible", async ({
  page,
}, testInfo) => {
  await page.goto("/?research=1&exposure=1&study=exposure-a11y&formSize=12");
  await expectNoViolations(page, testInfo);
});
