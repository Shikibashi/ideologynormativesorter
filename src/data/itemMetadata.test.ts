// Decision IDs: D-02, D-04, D-21, D-26.
import { describe, expect, it } from "vitest";
import { questions } from "./effectiveQuestions";
import { ITEM_METADATA_VERSION, researchItemMetadata } from "./itemMetadata";

describe("research item metadata", () => {
  it("annotates every active item without changing its scoring identity", () => {
    for (const question of questions) {
      const metadata = researchItemMetadata(question);
      expect(metadata.familyId).toBe(`domain:${question.domain}`);
      expect(question.familyId).toBe(metadata.familyId);
      expect(question.wordingFormId).toBe(metadata.wordingFormId);
      expect(metadata.calibrationEligibility).toBe("pending-review");
      expect(metadata.wordingFormId).toBe(
        `${ITEM_METADATA_VERSION}:${question.id}`,
      );
      expect(metadata.responseProcessTags).toContain(question.responseType);
      expect(metadata.responseProcessTags).toContain(
        question.layer === "descriptive"
          ? "epistemic-confidence"
          : question.layer === "prescriptive"
            ? "priority-salience"
            : question.responseType,
      );
    }
  });
});
