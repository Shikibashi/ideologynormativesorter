import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  EDITORIAL_EIGHTEENTH_PASS_VERSION,
  eighteenthPassRewritesById,
} from "./editorialEighteenthPass";
import {
  confidenceCoverageTierPromotions,
  EDITORIAL_TWENTY_THIRD_PASS_VERSION,
} from "./editorialTwentyThirdPass";
import {
  descriptiveConstructCorrectionsById,
  EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
} from "./editorialTwentyFifthPass";
import {
  descriptiveConstructCorrectionsById as v26Corrections,
  EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
} from "./editorialTwentySixthPass";

describe("eighteenth editorial pass", () => {
  it("registers and applies each source-backed descriptive rewrite", () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_EIGHTEENTH_PASS_VERSION);
    expect(Object.keys(eighteenthPassRewritesById)).toHaveLength(5);

    for (const [id, rewrite] of Object.entries(eighteenthPassRewritesById)) {
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
            : confidenceCoverageTierPromotions[id]
              ? EDITORIAL_TWENTY_THIRD_PASS_VERSION
              : EDITORIAL_EIGHTEENTH_PASS_VERSION,
      );
      expect(question.reviewStatus, id).toBe("approved");
      expect(question.sources?.length, id).toBeGreaterThanOrEqual(
        rewrite.sourceIds.length,
      );
      expect(question.contextNote?.length, id).toBeGreaterThan(100);
    }
  });

  it("removes directional and motive-imputing shortcuts", () => {
    expect(questionById.get("q0050")?.prompt).not.toMatch(
      /often end up using/i,
    );
    expect(questionById.get("q0089")?.prompt).not.toMatch(
      /protects incumbent workers more than consumers/i,
    );
    expect(questionById.get("q0108")?.prompt).not.toMatch(
      /neighborhood preferences|outsiders/i,
    );
    expect(questionById.get("q0128")?.prompt).not.toMatch(
      /already hold financial assets/i,
    );
    expect(questionById.get("q0130")?.prompt).not.toMatch(
      /tends to favor large financial firms/i,
    );
  });
});
