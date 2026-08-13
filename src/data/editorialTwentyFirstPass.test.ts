import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  EDITORIAL_TWENTY_FIRST_PASS_VERSION,
  twentyFirstPassRewritesById,
} from "./editorialTwentyFirstPass";

describe("twenty-first editorial pass", () => {
  it("registers and applies each source-backed prescriptive rewrite", () => {
    expect(QUESTION_BANK_VERSION).toContain(
      EDITORIAL_TWENTY_FIRST_PASS_VERSION,
    );
    expect(Object.keys(twentyFirstPassRewritesById)).toEqual([
      "q0135",
      "q0136",
      "q0318",
    ]);

    for (const [id, rewrite] of Object.entries(twentyFirstPassRewritesById)) {
      const question = questionById.get(id)!;
      expect(question.active, id).toBe(true);
      expect(question.layer, id).toBe("prescriptive");
      expect(question.prompt, id).toBe(rewrite.prompt);
      expect(question.evidenceNote, id).toBe(rewrite.evidenceNote);
      expect(question.version, id).toBe(EDITORIAL_TWENTY_FIRST_PASS_VERSION);
      expect(question.reviewStatus, id).toBe("approved");
      expect(question.sources, id).toHaveLength(rewrite.sourceIds.length);
      expect(question.contextNote?.length, id).toBeGreaterThan(100);
    }
  });

  it("removes inaccurate categories and loaded shorthand", () => {
    expect(questionById.get("q0135")?.prompt).toMatch(
      /insured depositors|unsecured or uninsured creditors/i,
    );
    expect(questionById.get("q0135")?.prompt).not.toMatch(
      /currency holders|managers/i,
    );
    expect(questionById.get("q0136")?.prompt).toMatch(
      /consumer protection|payment-system stability/i,
    );
    expect(questionById.get("q0318")?.prompt).not.toMatch(
      /abundance|austerity|bureaucracy/i,
    );
    expect(questionById.get("q0318")?.contextNote).toMatch(
      /absolute emissions|decoupling/i,
    );
  });
});
