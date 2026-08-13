import { describe, expect, it } from "vitest";
import type { Question } from "../types";
import {
  buildContributionQuestionForm,
  buildResearchQuestionForm,
  researchFormFingerprint,
  researchFormSize,
} from "./forms";

function question(
  id: string,
  layer: Question["layer"],
  axisId: string,
  reviewStatus: Question["reviewStatus"] = "approved",
): Question {
  return {
    id,
    prompt: id,
    domain: `domain-${axisId}`,
    layer,
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "extensive",
    axisWeights: [{ axisId, weight: 1 }],
    reviewStatus,
  };
}

const pool = [
  question("n-a-1", "normative", "a"),
  question("n-a-2", "normative", "a"),
  question("n-b-1", "normative", "b"),
  question("d-a-1", "descriptive", "a"),
  question("d-b-1", "descriptive", "b"),
  question("p-a-1", "prescriptive", "a"),
  question("p-b-1", "prescriptive", "b"),
  question("rewrite", "normative", "c", "needs-rewrite"),
];

describe("research forms", () => {
  it("parses only defensible matrix-form sizes", () => {
    expect(researchFormSize("?research=1&formSize=24")).toBe(24);
    expect(researchFormSize("?research=1&formSize=5")).toBeNull();
    expect(researchFormSize("?research=1&formSize=abc")).toBeNull();
    expect(researchFormSize("?contribute=1&formSize=24")).toBeNull();
  });

  it("uses the exact selected profile when no controlled matrix size is requested", () => {
    const form = buildContributionQuestionForm(pool, "p_1", "test", null);
    expect(form).toEqual(pool);
    expect(form).not.toBe(pool);
  });

  it("is stable for the same participant and administration", () => {
    const first = buildResearchQuestionForm(pool, "p_1", "test", 6).map(
      (item) => item.id,
    );
    const second = buildResearchQuestionForm(pool, "p_1", "test", 6).map(
      (item) => item.id,
    );
    expect(second).toEqual(first);
  });

  it("changes presentation order for a retest while preserving eligible coverage", () => {
    const testForm = buildResearchQuestionForm(pool, "p_1", "test", 6).map(
      (item) => item.id,
    );
    const retestForm = buildResearchQuestionForm(pool, "p_1", "retest", 6).map(
      (item) => item.id,
    );
    expect(new Set(retestForm)).toEqual(new Set(testForm));
    expect(retestForm).not.toEqual(testForm);
    expect(testForm).not.toContain("rewrite");
  });

  it("fingerprints item membership independently of presentation order", () => {
    const testForm = buildResearchQuestionForm(pool, "p_1", "test", 6);
    const retestForm = buildResearchQuestionForm(pool, "p_1", "retest", 6);
    expect(researchFormFingerprint(retestForm)).toBe(
      researchFormFingerprint(testForm),
    );
  });

  it("round-robins across layer and primary-axis groups before taking second items", () => {
    const form = buildResearchQuestionForm(pool, "p_balanced", "test", 6);
    const keys = new Set(
      form.map((item) => `${item.layer}:${item.axisWeights[0].axisId}`),
    );
    expect(form).toHaveLength(6);
    expect(keys.size).toBe(6);
  });
});
