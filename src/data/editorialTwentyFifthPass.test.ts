import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  descriptiveConstructCorrectionsById,
  EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
} from "./editorialTwentyFifthPass";
import {
  descriptiveConstructCorrectionsById as v26Corrections,
  EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
} from "./editorialTwentySixthPass";

describe("twenty-fifth editorial pass", () => {
  it("versions and applies each construct correction", () => {
    expect(QUESTION_BANK_VERSION).toContain(
      EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
    );

    for (const [id, correction] of Object.entries(
      descriptiveConstructCorrectionsById,
    )) {
      const question = questionById.get(id);
      expect(question, id).toBeDefined();
      expect(question?.active, id).not.toBe(false);
      expect(question?.layer, id).toBe("descriptive");
      expect(question?.axisWeights, id).toEqual(
        v26Corrections[id]?.axisWeights ?? correction.axisWeights,
      );
      expect(question?.version, id).toBe(
        v26Corrections[id]
          ? EDITORIAL_TWENTY_SIXTH_PASS_VERSION
          : EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
      );
      expect(question?.reviewStatus, id).toBe("approved");
      if (v26Corrections[id]?.prompt ?? correction.prompt)
        expect(question?.prompt, id).toBe(
          v26Corrections[id]?.prompt ?? correction.prompt,
        );
    }
  });

  it("does not use empirical mechanisms as unsupported expertise proxies", () => {
    expect(questionById.get("q0048")?.axisWeights).not.toEqual(
      expect.arrayContaining([
        { axisId: "expert-confidence", weight: expect.any(Number) },
      ]),
    );
    expect(questionById.get("q0050")?.axisWeights).toEqual([
      { axisId: "public-choice-skepticism", weight: 1 },
    ]);
    expect(questionById.get("q0350")?.axisWeights).not.toEqual(
      expect.arrayContaining([
        { axisId: "expert-confidence", weight: expect.any(Number) },
      ]),
    );
    expect(questionById.get("q0368")?.axisWeights).toEqual([
      { axisId: "public-choice-skepticism", weight: 1 },
    ]);
  });
});
