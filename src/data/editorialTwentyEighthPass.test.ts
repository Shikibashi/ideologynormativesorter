import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  EDITORIAL_TWENTY_EIGHTH_PASS_VERSION,
  applyEditorialTwentyEighthPass,
  precisionRewritesById,
} from "./editorialTwentyEighthPass";

describe("twenty-eighth editorial pass", () => {
  it("versions and applies the remaining high-confidence compound rewrites", () => {
    expect(QUESTION_BANK_VERSION).toContain(
      EDITORIAL_TWENTY_EIGHTH_PASS_VERSION,
    );

    expect(questionById.get("q0081")?.layer).toBe("normative");
    expect(questionById.get("q0411")?.layer).toBe("prescriptive");

    for (const [id, rewrite] of Object.entries(precisionRewritesById)) {
      const question = questionById.get(id);
      expect(question, id).toBeDefined();
      expect(question?.active, id).not.toBe(false);
      expect(question?.prompt, id).toBe(rewrite.prompt);
      expect(question?.reviewStatus, id).toBe("approved");
      expect(question?.version, id).toBe(EDITORIAL_TWENTY_EIGHTH_PASS_VERSION);
    }
  });

  it("removes the bundled constructs without changing score fields", () => {
    const q0081 = questionById.get("q0081")!;
    const q0411 = questionById.get("q0411")!;

    expect(q0081.prompt).not.toMatch(/refuse|exit|rival firms/i);
    expect(q0081.prompt).toMatch(/form organizations.*bargain collectively/i);
    expect(q0411.prompt).not.toMatch(/neighborhood councils|transition/i);
    expect(q0411.prompt).toMatch(/production.*governed.*workers’ councils/i);

    for (const id of Object.keys(precisionRewritesById)) {
      const question = questionById.get(id)!;
      const reapplied = applyEditorialTwentyEighthPass(question);
      expect(reapplied.layer).toBe(question.layer);
      expect(reapplied.domain).toBe(question.domain);
      expect(reapplied.responseType).toBe(question.responseType);
      expect(reapplied.tier).toBe(question.tier);
      expect(reapplied.axisWeights).toEqual(question.axisWeights);
    }
  });
});
