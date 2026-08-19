import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Phase 8 diagnostics boundary", () => {
  it("keeps diagnostics out of core scoring primitives", () => {
    const root = resolve(process.cwd(), "v2/packages/engine/src");
    const files = readdirSync(root, { recursive: true }).filter((file): file is string => file.endsWith(".ts") && file !== "index.ts" && !file.startsWith("diagnostics/") && !file.startsWith("assessment/"));
    const source = files.map((file) => readFileSync(join(root, file), "utf8")).join("\n");
    expect(source).not.toMatch(/from ["'][^"']*diagnostics/);
    expect(source).not.toMatch(/buildAssessmentDiagnostics|buildConstructDiagnostics|analyzeConstructDivergences/);
  });

  it("does not contain user-facing or psychological diagnostic claims", () => {
    const source = readFileSync(resolve(process.cwd(), "v2/packages/contracts/src/diagnostics.ts"), "utf8");
    expect(source).not.toMatch(/You are|Because you answered|cognitive dissonance|irrationality|extremism|authoritarian personality|inconsistency/gi);
  });
});
