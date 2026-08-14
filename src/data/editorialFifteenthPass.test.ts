import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  EDITORIAL_FIFTEENTH_PASS_VERSION,
  fifteenthPassRewritesById,
} from "./editorialFifteenthPass";
import { questionContextSources } from "./questionContext";
import { questionPromptAfterReview } from "./questionPromptReview";

describe("fifteenth editorial pass", () => {
  it("narrows six high-risk prescriptive items and preserves their layer", () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_FIFTEENTH_PASS_VERSION);
    expect(Object.keys(fifteenthPassRewritesById)).toEqual([
      "q0033",
      "q0036",
      "q0193",
      "q0354",
      "q0375",
      "q0376",
    ]);

    for (const [id, rewrite] of Object.entries(fifteenthPassRewritesById)) {
      const question = questionById.get(id)!;
      expect(question.active).toBe(true);
      expect(question.layer).toBe("prescriptive");
      expect(question.prompt).toBe(
        questionPromptAfterReview(id, rewrite.prompt),
      );
      expect(question.evidenceNote).toBe(rewrite.evidenceNote);
      expect(question.sources?.map((source) => source.url)).toEqual(
        rewrite.sourceIds.map(
          (sourceId) => questionContextSources[sourceId]?.url,
        ),
      );
      expect(
        question.sources?.every((source) => source.url.startsWith("https://")),
      ).toBe(true);
      expect(question.version).toBe(EDITORIAL_FIFTEENTH_PASS_VERSION);
      expect(question.reviewStatus).toBe("approved");
    }
  });

  it("removes the earlier compound or overbroad wording", () => {
    expect(questionById.get("q0033")?.prompt).not.toMatch(
      /land rents|state-created privileges/i,
    );
    expect(questionById.get("q0036")?.prompt).not.toMatch(
      /small firms|mutual-aid|independent work/i,
    );
    expect(questionById.get("q0193")?.prompt).not.toMatch(
      /restitution|prevention/i,
    );
    expect(questionById.get("q0354")?.prompt).not.toMatch(
      /sunset review|competitive alternatives/i,
    );
    expect(questionById.get("q0375")?.prompt).not.toMatch(
      /warrants|minimization|adversarial/i,
    );
    expect(questionById.get("q0376")?.prompt).not.toMatch(
      /benefits|policing|immigration/i,
    );
  });
});
