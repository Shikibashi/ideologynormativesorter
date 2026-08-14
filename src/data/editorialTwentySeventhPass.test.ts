import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  applyEditorialTwentySeventhPass,
  EDITORIAL_TWENTY_SEVENTH_PASS_VERSION,
  precisionRewritesById,
} from "./editorialTwentySeventhPass";
import { questionPromptAfterReview } from "./questionPromptReview";

describe("twenty-seventh editorial pass", () => {
  it("versions and applies each normative precision rewrite", () => {
    expect(QUESTION_BANK_VERSION).toContain(
      EDITORIAL_TWENTY_SEVENTH_PASS_VERSION,
    );

    for (const [id, rewrite] of Object.entries(precisionRewritesById)) {
      const question = questionById.get(id);
      expect(question, id).toBeDefined();
      expect(question?.active, id).not.toBe(false);
      expect(question?.layer, id).toBe("normative");
      expect(question?.prompt, id).toBe(
        questionPromptAfterReview(id, rewrite.prompt),
      );
      expect(question?.version, id).toBe(EDITORIAL_TWENTY_SEVENTH_PASS_VERSION);
      expect(question?.reviewStatus, id).toBe("approved");
    }
  });

  it("removes the conflated mechanisms from the live wording", () => {
    expect(questionById.get("q0085")?.prompt).not.toMatch(
      /licensing, immigration controls, or zoning/i,
    );
    expect(questionById.get("q0085")?.prompt).toMatch(
      /enter or leave employment/i,
    );
    expect(questionById.get("q0407")?.prompt).not.toMatch(
      /ownership or governance/i,
    );
    expect(questionById.get("q0407")?.prompt).toMatch(
      /direct governance claim/i,
    );
  });

  it("does not change the layer or score fields while applying a prompt rewrite", () => {
    const original = questionById.get("q0407")!;
    const reapplied = applyEditorialTwentySeventhPass(original);
    expect(reapplied.layer).toBe(original.layer);
    expect(reapplied.domain).toBe(original.domain);
    expect(reapplied.axisWeights).toEqual(original.axisWeights);
    expect(reapplied.responseType).toBe(original.responseType);
  });
});
