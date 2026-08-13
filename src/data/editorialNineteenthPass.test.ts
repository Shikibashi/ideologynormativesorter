import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  EDITORIAL_NINETEENTH_PASS_VERSION,
  nineteenthPassRewritesById,
} from "./editorialNineteenthPass";
import {
  descriptiveConstructCorrectionsById,
  EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
} from "./editorialTwentyFifthPass";
import {
  descriptiveConstructCorrectionsById as v26Corrections,
  EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
} from "./editorialTwentySixthPass";

describe("nineteenth editorial pass", () => {
  it("registers and applies each source-backed descriptive rewrite", () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_NINETEENTH_PASS_VERSION);
    expect(Object.keys(nineteenthPassRewritesById)).toHaveLength(2);

    for (const [id, rewrite] of Object.entries(nineteenthPassRewritesById)) {
      const question = questionById.get(id)!;
      expect(question.active, id).toBe(true);
      expect(question.layer, id).toBe("descriptive");
      expect(question.prompt, id).toBe(
        v26Corrections[id]?.prompt ??
          descriptiveConstructCorrectionsById[id]?.prompt ??
          rewrite.prompt,
      );
      expect(question.evidenceNote, id).toBe(rewrite.evidenceNote);
      expect(question.version, id).toBe(
        v26Corrections[id]
          ? EDITORIAL_TWENTY_SIXTH_PASS_VERSION
          : descriptiveConstructCorrectionsById[id]
            ? EDITORIAL_TWENTY_FIFTH_PASS_VERSION
            : EDITORIAL_NINETEENTH_PASS_VERSION,
      );
      expect(question.reviewStatus, id).toBe("approved");
      expect(question.sources?.length, id).toBeGreaterThanOrEqual(
        rewrite.sourceIds.length,
      );
      expect(question.contextNote?.length, id).toBeGreaterThan(100);
    }
  });

  it("keeps the descriptive prompts single-construct and non-methodological", () => {
    expect(questionById.get("q0027")?.prompt).not.toMatch(/bargaining power/i);
    expect(questionById.get("q0027")?.prompt).not.toMatch(/while also/i);
    expect(questionById.get("q0308")?.prompt).not.toMatch(/must be measured/i);
    expect(questionById.get("q0308")?.prompt).not.toMatch(
      /often favor large incumbents/i,
    );
  });
});
