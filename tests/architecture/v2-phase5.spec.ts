import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function profileEngineSource(): string {
  const root = resolve(process.cwd(), "v2/packages/engine/src/profiles");
  return readdirSync(root)
    .filter((file) => file.endsWith(".ts"))
    .sort()
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n");
}

describe("Phase 5 profile-engine boundary", () => {
  it("consumes construct results without raw responses, v1 runtime, or later-phase scoring", () => {
    const source = profileEngineSource();
    expect(source).not.toMatch(/RawResponse|PreparedAssessment|normalizeResponse|computeContributions|computeItemContributions/i);
    expect(source).not.toMatch(/src\/(data|domain|scoring|production|specialist|validation|research)\//i);
    expect(source).not.toMatch(/modifierMatching|specialistScoring|AssessmentResult/i);
  });
});
