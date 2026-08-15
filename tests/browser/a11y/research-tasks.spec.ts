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

test("research task consent and response screen pass automated accessibility checks", async ({
  page,
}, testInfo) => {
  await page.goto("/?research=1&arm=allocation&study=task-a11y");
  await expectNoViolations(page, testInfo);
  for (const checkbox of await page.getByRole("checkbox").all())
    await checkbox.check();
  await page
    .getByRole("button", { name: /continue to research task/i })
    .click();
  await expect(
    page.getByRole("progressbar", { name: "Research task progress" }),
  ).toBeVisible();
  await expectNoViolations(page, testInfo);
});
