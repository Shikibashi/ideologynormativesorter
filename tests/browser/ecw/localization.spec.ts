import { expect, test, type Page } from "@playwright/test";
import { resultPath } from "../fixtures/states";

async function overflowAmount(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
}

test("expanded prose, long compounds, and section bands wrap without loss", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await page.evaluate(() => {
    const expand = (selector: string, repetitions: number) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        element.textContent = Array.from(
          { length: repetitions },
          () => element.textContent,
        ).join(" · ");
      });
    };
    expand(".section-band span", 3);
    expand(".lede, .tier-option-label", 2);
    const first = document.querySelector<HTMLElement>(".tier-option-label");
    if (first)
      first.textContent +=
        " SupercalifragilisticexpialidociousInstitutionalInterdependence";
  });
  expect(await overflowAmount(page)).toBeLessThanOrEqual(1);
  const band = page.locator(".section-band").first();
  expect((await band.boundingBox())?.height ?? 0).toBeGreaterThan(30);
});

for (const fixture of [
  {
    lang: "ja",
    dir: "ltr",
    text: "政治的判断と制度的相互依存についての長い説明文です",
  },
  {
    lang: "ko",
    dir: "ltr",
    text: "정치적 판단과 제도적 상호의존성에 관한 긴 설명문입니다",
  },
  {
    lang: "ar",
    dir: "rtl",
    text: "هذا وصف طويل للحكم السياسي والترابط المؤسسي",
  },
]) {
  test(`${fixture.lang} and ${fixture.dir} layout uses logical reflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(resultPath());
    await page.evaluate(({ lang, dir, text }) => {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
      document
        .querySelectorAll<HTMLElement>("h2, summary, button")
        .forEach((element, index) => {
          if (index < 18) element.textContent = `${text} ${text}`;
        });
      const input =
        document.querySelector<HTMLInputElement>(".compare-url-input");
      if (input) input.value = `report-${text}-ABC-123-ملف.txt`;
    }, fixture);
    expect(await overflowAmount(page)).toBeLessThanOrEqual(1);
    await expect(
      page.getByRole("heading", { name: "Your results" }),
    ).toBeVisible();
  });
}

test("named fallback configuration keeps UI, metadata, targets, and canvas readable", async ({
  page,
}) => {
  await page.goto(resultPath());
  await page.evaluate(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--ecw-font-ui",
      '"DejaVu Sans", "Noto Sans", sans-serif',
    );
    root.style.setProperty(
      "--ecw-font-system",
      '"Liberation Mono", "DejaVu Sans Mono", monospace',
    );
    root.dataset.contrast =
      root.dataset.contrast === "more" ? "standard" : "more";
  });
  const metadataFont = await page
    .locator(".site-meta")
    .evaluate((element) => getComputedStyle(element).fontFamily);
  expect(metadataFont).toContain("Liberation Mono");
  const bodyFont = await page
    .locator("body")
    .evaluate((element) => getComputedStyle(element).fontFamily);
  expect(bodyFont).toContain("DejaVu Sans");
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-ecw-ui-font",
    /DejaVu Sans/,
  );
  const button = await page
    .getByRole("button", { name: "Start over" })
    .boundingBox();
  expect(button?.height ?? 0).toBeGreaterThanOrEqual(24);
});
