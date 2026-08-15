import { expect, test } from "@playwright/test";

test("explicit research task arms require consent and preserve task records", async ({
  page,
}) => {
  await page.route("**/__e2e/research", async (route) => {
    await route.fulfill({ status: 202, body: "{}" });
  });
  await page.goto("/?research=1&arm=choice&study=task-pilot");

  await expect(
    page.getByRole("heading", { name: "Optional research task" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /continue to research task/i }),
  ).toBeDisabled();
  for (const checkbox of await page.getByRole("checkbox").all())
    await checkbox.check();
  await page
    .getByRole("button", { name: /continue to research task/i })
    .click();

  await expect(
    page.getByRole("progressbar", { name: "Research task progress" }),
  ).toHaveAttribute("aria-valuemax", "1");
  await expect(page.locator("[data-research-task-id]")).toHaveAttribute(
    "data-research-task-id",
    "conjoint-strategy-001",
  );
  await page
    .getByRole("button", { name: "work through existing institutions" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Research task module" }),
  ).toBeVisible();
  await expect(page.getByText(/task wording, assignment seed/i)).toBeVisible();
  await expect(page.locator(".site-shell")).toHaveAttribute(
    "data-stage",
    "research-tasks",
  );
});
