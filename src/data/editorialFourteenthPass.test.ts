import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  EDITORIAL_FOURTEENTH_PASS_VERSION,
  fourteenthPassRewritesById,
} from "./editorialFourteenthPass";
import {
  descriptiveConstructCorrectionsById,
  EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
} from "./editorialTwentyFifthPass";

describe("fourteenth editorial pass", () => {
  it("keeps the reviewed descriptive items within their source scope", () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_FOURTEENTH_PASS_VERSION);
    expect(Object.keys(fourteenthPassRewritesById)).toEqual([
      "q0147",
      "q0248",
      "q0307",
      "q0368",
    ]);

    for (const [id, rewrite] of Object.entries(fourteenthPassRewritesById)) {
      const question = questionById.get(id)!;
      expect(question.active).toBe(true);
      expect(question.layer).toBe("descriptive");
      expect(question.prompt).toBe(rewrite.prompt);
      expect(question.evidenceNote).toBe(rewrite.evidenceNote);
      expect(question.sources?.length).toBeGreaterThanOrEqual(
        rewrite.sourceIds.length,
      );
      expect(
        question.sources?.every((source) => source.url.startsWith("https://")),
      ).toBe(true);
      expect(question.version).toBe(
        descriptiveConstructCorrectionsById[id]
          ? EDITORIAL_TWENTY_FIFTH_PASS_VERSION
          : EDITORIAL_FOURTEENTH_PASS_VERSION,
      );
      expect(question.reviewStatus).toBe("approved");
    }
  });

  it("removes the unsupported broad mechanisms from the reviewed prompts", () => {
    expect(questionById.get("q0147")?.prompt).not.toMatch(
      /increase innovation|shared knowledge/i,
    );
    expect(questionById.get("q0248")?.prompt).not.toMatch(
      /doctrin|enforceable law|cleric/i,
    );
    expect(questionById.get("q0307")?.prompt).not.toMatch(
      /reduce harm|victims|pollution/i,
    );
    expect(questionById.get("q0368")?.prompt).toMatch(/DHS|GAO|privacy/i);
  });
});
