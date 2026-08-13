import { expect, test } from "@playwright/test";
import { resultPath } from "../fixtures/states";

test("reduced motion, transparency, and data remove optional effects", async ({
  page,
  context,
}) => {
  const session = await context.newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-motion", value: "reduce" },
      { name: "prefers-reduced-transparency", value: "reduce" },
      { name: "prefers-reduced-data", value: "reduce" },
    ],
  });
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname))
      externalRequests.push(request.url());
  });
  await page.goto("/");
  const styles = await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundImage,
    transition: getComputedStyle(
      document.querySelector(".progress-fill") ?? document.body,
    ).transitionDuration,
    transparency: matchMedia("(prefers-reduced-transparency: reduce)").matches,
    data: matchMedia("(prefers-reduced-data: reduce)").matches,
  }));
  if (styles.transparency || styles.data) {
    expect(styles.background).toBe("none");
  } else {
    test.info().annotations.push({
      type: "browser-capability",
      description:
        "This Chromium build cannot emulate prefers-reduced-transparency or prefers-reduced-data; source guards remain unit-tested.",
    });
  }
  expect(Number.parseFloat(styles.transition) || 0).toBeLessThanOrEqual(0.001);
  expect(externalRequests).toEqual([]);
});

test("forced colors and increased contrast preserve required structure without decoration dependence", async ({
  page,
}) => {
  await page.emulateMedia({
    forcedColors: "active",
    contrast: "more",
    reducedMotion: "reduce",
  });
  await page.goto(resultPath());
  const block = await page.locator("#profile").evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      border: style.borderStyle,
      backgroundImage: style.backgroundImage,
      boxShadow: style.boxShadow,
    };
  });
  expect(block.border).not.toBe("none");
  expect(block.backgroundImage).toBe("none");
  expect(block.boxShadow).toBe("none");
});

test("compass redraws for theme, contrast, DPR, and container size changes", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(resultPath());
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-ecw-draw-count", /\d+/);
  const initialCount = Number(await canvas.getAttribute("data-ecw-draw-count"));

  await page.locator(".display-control > summary").click();
  await page.getByRole("radio", { name: "Dark" }).check();
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-ecw-draw-count")))
    .toBeGreaterThan(initialCount);
  const themeCount = Number(await canvas.getAttribute("data-ecw-draw-count"));
  await page.getByRole("radio", { name: "More" }).check();
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-ecw-draw-count")))
    .toBeGreaterThan(themeCount);

  const originalSize = Number(await canvas.getAttribute("data-ecw-draw-size"));
  await page.locator(".compass-plot").evaluate((element) => {
    (element as HTMLElement).style.width = "300px";
  });
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-ecw-draw-size")))
    .not.toBe(originalSize);

  const dprCount = Number(await canvas.getAttribute("data-ecw-draw-count"));
  const session = await context.newCDPSession(page);
  await session.send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 800,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-ecw-draw-count")))
    .toBeGreaterThan(dprCount);
  await expect(canvas).toHaveAttribute("data-ecw-draw-dpr", "2");
  await expect(canvas).toHaveAttribute(
    "data-ecw-ui-font",
    /Verdana|DejaVu Sans/,
  );
  await expect(canvas).toHaveAttribute(
    "data-ecw-system-font",
    /Courier New|Liberation Mono/,
  );
});
