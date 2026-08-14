import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  EDITORIAL_TWELFTH_PASS_VERSION,
  twelfthPassRewritesById,
} from "./editorialTwelfthPass";
import { questionPromptAfterReview } from "./questionPromptReview";

describe("twelfth editorial pass", () => {
  it("narrows the intergroup-contact claim to the reviewed evidence scope", () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_TWELFTH_PASS_VERSION);
    expect(Object.keys(twelfthPassRewritesById)).toEqual(["q0207"]);

    const question = questionById.get("q0207")!;
    const rewrite = twelfthPassRewritesById.q0207;

    expect(question.layer).toBe("descriptive");
    expect(question.prompt).toBe(
      questionPromptAfterReview("q0207", rewrite.prompt),
    );
    expect(question.evidenceNote).toBe(rewrite.evidenceNote);
    expect(question.sources?.map((source) => source.title)).toEqual([
      "The Contact Hypothesis Re-evaluated",
      "A Meta-Analytic Test of Intergroup Contact Theory",
    ]);
    expect(question.version).toBe(EDITORIAL_TWELFTH_PASS_VERSION);
    expect(question.reviewStatus).toBe("approved");
    expect(question.axisWeights).toEqual([
      { axisId: "cultural-plasticity", weight: 1 },
    ]);
    expect(question.prompt).not.toMatch(
      /weaker for ethnic, racial, religious, and immigrant/i,
    );
  });
});
