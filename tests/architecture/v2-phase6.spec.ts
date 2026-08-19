import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function modifierEngineSource(): string {
  const root = resolve(process.cwd(), "v2/packages/engine/src/modifiers");
  return readdirSync(root)
    .filter((file) => file.endsWith(".ts"))
    .sort()
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n");
}

describe("Phase 6 modifier-engine boundary", () => {
  it("consumes ConstructAssessment evidence without raw responses, primary scores, specialist scoring, or v1 runtime", () => {
    const source = modifierEngineSource();
    expect(source).toMatch(/ConstructAssessment/);
    expect(source).not.toMatch(/RawResponse|PreparedAssessment|normalizeResponse|computeContributions|computeItemContributions/i);
    expect(source).not.toMatch(/src\/(data|domain|scoring|production|specialist|validation|research)\//i);
    expect(source).not.toMatch(/scorePrimaryProfiles|specialistScoring|AssessmentResult/i);
  });
});
