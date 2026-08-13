import { describe, expect, it } from "vitest";
import {
  QUESTION_BANK_VERSION,
  coreQuestions,
  questionById,
} from "./effectiveQuestions";
import {
  DESCRIPTIVE_EVIDENCE_FIFTH_PASS_VERSION,
  descriptiveEvidenceFifthPassById,
} from "./descriptiveEvidenceFifthPass";

describe("fifth descriptive evidence pass", () => {
  it("versions and attaches a second triangulating source to every targeted empirical item", () => {
    expect(QUESTION_BANK_VERSION).toContain(
      DESCRIPTIVE_EVIDENCE_FIFTH_PASS_VERSION,
    );
    expect(Object.keys(descriptiveEvidenceFifthPassById)).toHaveLength(40);

    for (const [id, additional] of Object.entries(
      descriptiveEvidenceFifthPassById,
    )) {
      const question = questionById.get(id);
      expect(question, `${id} must exist in the effective bank`).toBeDefined();
      expect(question?.active, `${id} must remain active`).not.toBe(false);
      expect(question?.layer, `${id} must remain descriptive`).toBe(
        "descriptive",
      );
      expect(
        question?.sources?.length,
        `${id} must have at least two sources`,
      ).toBeGreaterThanOrEqual(2);
      expect(
        question?.sources?.some((source) => source.url === additional.url),
      ).toBe(true);
      expect(additional.url).toMatch(/^https:\/\//);
      expect(additional.title.length).toBeGreaterThan(5);
      expect(additional.publisher?.length ?? 0).toBeGreaterThan(2);
    }
  });

  it("leaves no active core descriptive item dependent on a single source", () => {
    const activeDescriptive = coreQuestions.filter(
      (question) =>
        question.active !== false && question.layer === "descriptive",
    );

    expect(activeDescriptive).toHaveLength(58);
    expect(
      activeDescriptive.every(
        (question) => (question.sources?.length ?? 0) >= 2,
      ),
    ).toBe(true);
  });
});
