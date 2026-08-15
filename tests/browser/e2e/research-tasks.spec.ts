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
  await expect(page.getByLabel("Frozen task stimulus")).toContainText(
    "fixed political and administrative context",
  );
  await expect(page.getByLabel("Frozen task stimulus")).toContainText(
    "Constraints",
  );
  await expect(page.getByLabel("Choice metadata")).toContainText(
    "Presented attribute profile",
  );
  await expect(page.getByLabel("Presented attribute levels")).toContainText(
    "Resources available",
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

test("an absent task arm remains ordinary contribution routing", async ({
  page,
}) => {
  await page.goto("/?research=1&study=ordinary-routing");

  await expect(
    page.getByRole("heading", { name: "Optional profile contribution" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Optional research task" }),
  ).toHaveCount(0);
});

test("an invalid task arm fails closed instead of entering collection", async ({
  page,
}) => {
  await page.goto("/?research=1&arm=unsupported&study=invalid-routing");

  await expect(page.getByRole("alert")).toContainText(
    "research task link is not supported",
  );
  await expect(
    page.getByRole("heading", { name: "Optional profile contribution" }),
  ).toHaveCount(0);
});

test("declining a task arm clears the route before ordinary contribution", async ({
  page,
}) => {
  await page.goto("/?research=1&arm=choice&study=declined-routing");
  await expect(
    page.getByRole("heading", { name: "Optional research task" }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Continue without contributing" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Political Judgment Decomposition" }),
  ).toBeVisible();
  await expect(page).not.toHaveURL(/arm=choice/);
  await page
    .getByRole("checkbox", { name: /optionally contribute this/i })
    .check();
  await page
    .getByRole("button", { name: "Review contribution details" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Optional profile contribution" }),
  ).toBeVisible();
});
