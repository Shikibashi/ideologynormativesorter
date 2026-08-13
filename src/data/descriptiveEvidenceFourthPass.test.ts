import { describe, expect, it } from "vitest";
import {
  coreQuestions,
  QUESTION_BANK_VERSION,
  questionById,
} from "./effectiveQuestions";
import {
  DESCRIPTIVE_EVIDENCE_FOURTH_PASS_VERSION,
  descriptiveEvidenceFourthPassById,
} from "./descriptiveEvidenceFourthPass";

describe("fourth descriptive evidence pass", () => {
  it("attaches evidence to every new descriptive confidence item", () => {
    expect(QUESTION_BANK_VERSION).toContain(
      DESCRIPTIVE_EVIDENCE_FOURTH_PASS_VERSION,
    );

    for (const [id, evidence] of Object.entries(
      descriptiveEvidenceFourthPassById,
    )) {
      const question = questionById.get(id);
      expect(question?.active, `${id} should not be inactive`).not.toBe(false);
      expect(question?.layer, `${id} should remain descriptive`).toBe(
        "descriptive",
      );
      expect(question?.evidenceNote).toBe(evidence.evidenceNote);
      expect(question?.sources?.slice(0, evidence.sources.length)).toEqual(
        evidence.sources,
      );
      expect(question?.sources?.length).toBeGreaterThanOrEqual(
        evidence.sources.length,
      );
      expect(evidence.evidenceNote.length).toBeGreaterThan(100);
      expect(evidence.sources[0].url).toMatch(/^https:\/\//);
    }
  });

  it("keeps the active descriptive bank fully scoped and sourced", () => {
    const activeDescriptive = coreQuestions.filter(
      (question) =>
        question.active !== false && question.layer === "descriptive",
    );

    expect(activeDescriptive).toHaveLength(58);
    expect(
      activeDescriptive.every((question) =>
        Boolean(question.evidenceNote?.trim()),
      ),
    ).toBe(true);
    expect(
      activeDescriptive.every(
        (question) => (question.sources?.length ?? 0) > 0,
      ),
    ).toBe(true);
  });
});
