import { expect, test } from "@playwright/test";

test("label exposure is assigned after substantive responses and leaves the score boundary intact", async ({
  page,
}) => {
  await page.route("**/__e2e/research", async (route) => {
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
  await expect(
    page.getByRole("heading", { name: "Before seeing your result" }),
  ).not.toBeVisible();
});
