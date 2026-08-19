import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { AssessmentResult, CanonicalContentBundle } from "../../v2/packages/contracts/src";
import { buildAssessmentViewModel, buildQuestionnaireViewModel, formatPercent, selectTopProfiles } from "../../v2/packages/view-model/src";

const bundle = JSON.parse(readFileSync(resolve(process.cwd(), "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;

describe("Phase 11 view-model boundary", () => {
  it("builds every active question from canonical content without fallback text", () => {
    const core = buildQuestionnaireViewModel(bundle, "core");
    const activeCore = bundle.items.filter((item) => item.role === "core" && item.status === "active");
    expect(core.questions).toHaveLength(activeCore.length);
    expect(core.questions.every((question) => question.prompt.length > 0 && question.domainLabel.length > 0)).toBe(true);
    expect(core.questions.filter((question) => question.responseType === "statement-choice").every((question) => question.options.length > 0)).toBe(true);
  });

  it("does not mutate canonical content while formatting", () => {
    const snapshot = structuredClone(bundle);
    buildQuestionnaireViewModel(bundle, "core");
    expect(bundle).toEqual(snapshot);
  });

  it("formats unavailable evidence distinctly from zero", () => {
    expect(formatPercent(null)).toBe("Unavailable");
    expect(formatPercent(0)).toBe("0%");
  });

  it("retains the complete tie group at the top-N cutoff", () => {
    const result = { primary: { profiles: [
      { profileId: "a", name: "A", status: "scored", similarity: 0.9, distance: 0.1, rank: 1, tieGroup: 1, comparisons: [], evidence: { comparisonCoverage: 1 }, gates: [], support: { uncertaintyLevel: "low" } },
      { profileId: "b", name: "B", status: "scored", similarity: 0.8, distance: 0.2, rank: 2, tieGroup: 2, comparisons: [], evidence: { comparisonCoverage: 1 }, gates: [], support: { uncertaintyLevel: "low" } },
      { profileId: "c", name: "C", status: "scored", similarity: 0.8, distance: 0.2, rank: 2, tieGroup: 2, comparisons: [], evidence: { comparisonCoverage: 1 }, gates: [], support: { uncertaintyLevel: "low" } },
    ], ranking: [{ profileId: "a", rank: 1, tieGroup: 1, similarity: 0.9, distance: 0.1 }, { profileId: "b", rank: 2, tieGroup: 2, similarity: 0.8, distance: 0.2 }, { profileId: "c", rank: 2, tieGroup: 2, similarity: 0.8, distance: 0.2 }] } } as unknown as AssessmentResult;
    expect(selectTopProfiles(result, 2).map((profile) => profile.profileId)).toEqual(["a", "b", "c"]);
  });

  it("projects the real result without creating score fields", () => {
    const result = JSON.parse(readFileSync(resolve(process.cwd(), "v2/reference/v2/cases/complete-core/expected-result.json"), "utf8")) as AssessmentResult;
    const viewModel = buildAssessmentViewModel(result, bundle);
    expect(viewModel.primary.profiles.length).toBeGreaterThan(0);
    expect(viewModel.version.contentFingerprint).toBe(bundle.metadata.contentFingerprint);
    expect(Object.keys(viewModel.primary.profiles[0]).sort()).not.toContain("distance");
  });
});
