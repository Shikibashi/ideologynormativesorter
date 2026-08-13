import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  EDITORIAL_SEVENTEENTH_PASS_VERSION,
  seventeenthPassRewritesById,
} from "./editorialSeventeenthPass";
import {
  descriptiveConstructCorrectionsById,
  EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
} from "./editorialTwentyFifthPass";
import {
  descriptiveConstructCorrectionsById as v26Corrections,
  EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
} from "./editorialTwentySixthPass";
import {
  EDITORIAL_NINETEENTH_PASS_VERSION,
  nineteenthPassRewritesById,
} from "./editorialNineteenthPass";
import { questionContextSources } from "./questionContext";

describe("seventeenth editorial pass", () => {
  it("registers and applies the source-backed descriptive narrowing pass", () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_SEVENTEENTH_PASS_VERSION);

    const expectedIds = Object.keys(seventeenthPassRewritesById);
    expect(expectedIds).toHaveLength(12);

    for (const id of expectedIds) {
      const rewrite = seventeenthPassRewritesById[id];
      const question = questionById.get(id)!;
      expect(question.active, id).toBe(true);
      expect(question.layer, id).toBe("descriptive");
      const laterRewrite = nineteenthPassRewritesById[id];
      expect(question.prompt, id).toBe(
        v26Corrections[id]?.prompt ??
          descriptiveConstructCorrectionsById[id]?.prompt ??
          laterRewrite?.prompt ??
          rewrite.prompt,
      );
      expect(question.evidenceNote, id).toBe(
        laterRewrite?.evidenceNote ?? rewrite.evidenceNote,
      );
      expect(question.version, id).toBe(
        v26Corrections[id]
          ? EDITORIAL_TWENTY_SIXTH_PASS_VERSION
          : descriptiveConstructCorrectionsById[id]
            ? EDITORIAL_TWENTY_FIFTH_PASS_VERSION
            : laterRewrite
              ? EDITORIAL_NINETEENTH_PASS_VERSION
              : EDITORIAL_SEVENTEENTH_PASS_VERSION,
      );
      expect(question.reviewStatus, id).toBe("approved");
      expect(
        question.sources
          ?.slice(0, rewrite.sourceIds.length)
          .map((source) => source.url),
        id,
      ).toEqual(
        rewrite.sourceIds.map(
          (sourceId) => questionContextSources[sourceId].url,
        ),
      );
      expect(question.sources?.length, id).toBeGreaterThanOrEqual(
        rewrite.sourceIds.length,
      );
      expect(question.contextNote?.length, id).toBeGreaterThan(100);
    }
  });

  it("removes the reviewed overclaiming and rhetorical shortcuts", () => {
    expect(questionById.get("q0012")?.prompt).not.toMatch(
      /depends less on a single sovereign/i,
    );
    expect(questionById.get("q0027")?.prompt).not.toMatch(
      /artificial scarcity/i,
    );
    expect(questionById.get("q0171")?.prompt).not.toMatch(/public panic/i);
    expect(questionById.get("q0269")?.prompt).not.toMatch(
      /administratively invisible/i,
    );
    expect(questionById.get("q0308")?.prompt).not.toMatch(
      /often favor large incumbents/i,
    );
  });
});
