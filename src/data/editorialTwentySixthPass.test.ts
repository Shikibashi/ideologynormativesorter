import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  descriptiveConstructCorrectionsById,
  EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
} from "./editorialTwentySixthPass";

describe("twenty-sixth editorial pass", () => {
  it("versions and applies each source-bounded correction", () => {
    expect(QUESTION_BANK_VERSION).toContain(
      EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
    );

    for (const [id, correction] of Object.entries(
      descriptiveConstructCorrectionsById,
    )) {
      const question = questionById.get(id);
      expect(question, id).toBeDefined();
      expect(question?.active, id).not.toBe(false);
      expect(question?.layer, id).toBe("descriptive");
      expect(question?.axisWeights, id).toEqual(correction.axisWeights);
      expect(question?.version, id).toBe(EDITORIAL_TWENTY_SIXTH_PASS_VERSION);
      expect(question?.reviewStatus, id).toBe("approved");
      if (correction.prompt)
        expect(question?.prompt, id).toBe(correction.prompt);
    }
  });

  it("removes unsupported institutional and directional implications", () => {
    expect(questionById.get("q0089")?.prompt).not.toMatch(
      /protects incumbent workers more than consumers/i,
    );
    expect(questionById.get("q0108")?.axisWeights).toEqual([
      { axisId: "market-process-confidence", weight: 0.8 },
    ]);
    expect(questionById.get("q0127")?.axisWeights).toEqual([
      { axisId: "market-process-confidence", weight: 1 },
    ]);
    expect(questionById.get("q0171")?.axisWeights).toEqual([
      { axisId: "public-choice-skepticism", weight: 1 },
    ]);
    expect(questionById.get("q0308")?.prompt).toMatch(
      /competitive conditions/i,
    );
    expect(questionById.get("q0348")?.axisWeights).toEqual([
      { axisId: "democratic-confidence", weight: -1 },
    ]);
  });
});
