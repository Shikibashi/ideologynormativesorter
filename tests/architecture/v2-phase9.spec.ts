import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function runtimeFiles(): string[] {
  const root = resolve(process.cwd(), "v2/packages");
  return readdirSync(root, { recursive: true })
    .filter((file): file is string => file.endsWith(".ts") && file.includes("/src/"))
    .map((file) => resolve(root, file));
}

describe("Phase 9 unified-result boundary", () => {
  it("has one top-level scoring entrypoint and no v1 runtime imports", () => {
    const files = runtimeFiles();
    const source = files.map((file) => readFileSync(file, "utf8")).join("\n");
    expect(source.match(/export function scoreAssessment/g)?.length).toBe(1);
    expect(source).not.toMatch(/from ["'][^"']*src\/(data|domain|scoring|production|specialist|validation|research)\//i);
    expect(source).not.toMatch(/scoreAssessmentFast|scoreAssessmentSimple|scoreAssessmentForUI/);
    expect(source).not.toMatch(/effectiveQuestions|applySemanticCorrections|mergeCanonicalOverlay/);
  });

  it("keeps scoring formulas in the established layer owners", () => {
    const assessment = readFileSync(resolve(process.cwd(), "v2/packages/engine/src/assessment/score-assessment.ts"), "utf8");
    expect(assessment).not.toMatch(/weightedMean|weightedRMS|computeProfileDistance|normalizeResponse|computeItemContributions/);
    expect(assessment).toMatch(/scoreConstructLayer/);
    expect(assessment).toMatch(/scorePrimaryProfiles/);
    expect(assessment).toMatch(/scoreModifiers/);
    expect(assessment).toMatch(/scoreSpecialists/);
  });
});
