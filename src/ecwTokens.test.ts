import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/index.css"), "utf8");
const tokens = readFileSync(
  join(process.cwd(), "src/styles/ecw-tokens.css"),
  "utf8",
);
const appCss = readFileSync(join(process.cwd(), "src/App.css"), "utf8");
const compass = readFileSync(
  join(process.cwd(), "src/components/CompassPlot.tsx"),
  "utf8",
);
const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
const prepaint = readFileSync(
  join(process.cwd(), "public/ecw-prepaint.js"),
  "utf8",
);

function channel(value: string): number {
  const normalized = value.length === 1 ? `${value}${value}` : value;
  const numeric = Number.parseInt(normalized, 16) / 255;
  return numeric <= 0.03928
    ? numeric / 12.92
    : ((numeric + 0.055) / 1.055) ** 2.4;
}

function contrast(first: string, second: string): number {
  const toRgb = (hex: string) =>
    [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(channel);
  const firstLuminance = toRgb(first).reduce(
    (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
    0,
  );
  const secondLuminance = toRgb(second).reduce(
    (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
    0,
  );
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("ECW token contracts", () => {
  it("declares named fallbacks before generic families", () => {
    expect(tokens).toMatch(
      /--ecw-font-display:\s*Georgia,\s*"Noto Serif".*serif;/s,
    );
    expect(tokens).toMatch(
      /--ecw-font-ui:\s*Verdana,\s*"DejaVu Sans".*sans-serif;/s,
    );
    expect(tokens).toMatch(
      /--ecw-font-system:\s*"Courier New",\s*"Liberation Mono".*monospace;/s,
    );
  });

  it("keeps the ECW hit-target floor above 24 CSS pixels at the default root size", () => {
    const compactHitMin = 1.875 * 16;
    expect(compactHitMin).toBeGreaterThanOrEqual(24);
    expect(tokens).toContain("--ecw-hit-min: 1.875rem");
  });

  it("uses a fluid shell and demotes the masthead before tablet widths", () => {
    expect(tokens).toContain("--ecw-shell-max: clamp(92rem, 80vw, 160rem)");
    expect(css).toMatch(/width:\s*min\(\s*var\(--ecw-shell-max\)/);
    expect(appCss).toMatch(
      /@media \(max-width: 900px\) \{[\s\S]*?\.site-masthead \{[\s\S]*?grid-template-columns: 1fr;/,
    );
    expect(appCss).toMatch(
      /\.results-screen \{[\s\S]*?max-width: none;[\s\S]*?padding-block-start: clamp\(1rem, 2vw, 1\.5rem\);/,
    );
    expect(css).not.toMatch(
      /(?:html|body)\s*\{[^}]*overflow-x:\s*(?:hidden|clip)/s,
    );
  });

  it("keeps the compass square and redraws at the current device pixel ratio", () => {
    expect(compass).toContain("Math.round(size * dpr)");
    expect(compass).toContain("ctx.setTransform(dpr, 0, 0, dpr, 0, 0)");
    expect(compass).toContain("new ResizeObserver(draw)");
    expect(compass).toMatch(
      /attributeFilter:\s*\[\s*["']data-theme["']\s*,\s*["']data-contrast["']\s*\]/,
    );
    expect(compass).toContain("window.matchMedia(");
    expect(compass).toContain(
      "`(resolution: ${window.devicePixelRatio || 1}dppx)`",
    );
    expect(compass).toMatch(
      /cssLengthPx\(\s*["']--ecw-font-size-micro["']\s*,\s*12\s*\)/,
    );
    expect(compass).toMatch(
      /width:\s*["']100%["'][\s\S]*maxWidth:\s*SIZE[\s\S]*height:\s*["']auto["'][\s\S]*aspectRatio:\s*["']1["']/,
    );
    expect(appCss).toMatch(
      /\.compass-plot canvas \{[\s\S]*?height: auto;[\s\S]*?aspect-ratio: 1;/,
    );
  });

  it("keeps the two focus colors above the ECW 9:1 contrast rule", () => {
    expect(contrast("#ffd45c", "#050719")).toBeGreaterThanOrEqual(9);
    expect(contrast("#522598", "#ffffff")).toBeGreaterThanOrEqual(9);
    expect(tokens).toContain("--ecw-focus-outer");
    expect(tokens).toContain("--ecw-focus-inner");
    expect(css).toMatch(
      /:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--ecw-focus-inner\);[^}]*box-shadow:\s*0 0 0 4px var\(--ecw-focus-outer\);/s,
    );
  });

  it("defines explicit status foregrounds for accent fills", () => {
    for (const status of ["warning", "success", "info", "error"]) {
      expect(tokens).toContain(`--ecw-status-${status}-text`);
      expect(tokens).toContain(`--ecw-status-${status}-accent`);
      expect(tokens).toContain(`--ecw-status-${status}-border`);
      expect(tokens).toContain(`--ecw-status-${status}-on-accent`);
    }
    expect(tokens).toContain("--ecw-selection-text");
  });

  it("keeps status accent foreground pairs above the normal text contrast floor", () => {
    const darkPairs = [
      ["#23d5a6", "#050719"],
      ["#ffd45c", "#050719"],
      ["#ff76a8", "#050719"],
      ["#6ff4ff", "#050719"],
    ] as const;
    const lightPairs = [
      ["#23d5a6", "#11132d"],
      ["#ffd45c", "#11132d"],
      ["#ff76a8", "#11132d"],
      ["#6ff4ff", "#11132d"],
    ] as const;

    for (const [accent, foreground] of [...darkPairs, ...lightPairs]) {
      expect(contrast(accent, foreground)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("resolves appearance before first paint using the canonical preference keys", () => {
    expect(html).toContain('<meta name="color-scheme" content="light dark" />');
    expect(html).toContain('<script src="/ecw-prepaint.js"></script>');
    expect(html).not.toMatch(/<script>\s*[\s\S]+?<\/script>/);
    expect(prepaint).toContain("political-judgment-appearance-v1");
    expect(prepaint).toContain("political-judgment-density-v1");
    expect(prepaint).toContain("political-judgment-contrast-v1");
    expect(prepaint).toContain("root.dataset.theme");
    expect(prepaint).toContain("root.dataset.density");
    expect(prepaint).toContain("root.dataset.contrast");
  });

  it("preserves selected-focus handling when forced colors replaces authored colors", () => {
    expect(css).toContain("@media (forced-colors: active)");
    expect(css).toContain(".scale-button.selected:focus-visible");
    expect(css).toContain("outline-color: HighlightText");
  });

  it("keeps compatibility aliases out of active component rules", () => {
    expect(tokens).toContain("--web99-bg: var(--ecw-canvas)");
    expect(appCss).not.toContain("--web99-");
    expect(css).not.toContain("--web99-");
    const legacyRoleUse =
      /var\(--(?:surface(?:-raised|-sunken)?|workspace|text(?:-m|-h)?|border(?:-light|-dark)?|code-bg|accent(?:-hover|-bg|-border)?|highlight-text|danger|shadow|sans|heading|mono)\)/;
    expect(appCss).not.toMatch(legacyRoleUse);
    expect(css).not.toMatch(legacyRoleUse);
  });

  it("does not generate navigator text or use ten-pixel functional text", () => {
    expect(appCss).not.toMatch(/\.results-navigator\s+a::before/);
    expect(appCss).not.toMatch(/font(?:-size|):[^;{}]*10px/);
    expect(compass).not.toMatch(/font\s*=\s*['"`]10px/);
  });
});
