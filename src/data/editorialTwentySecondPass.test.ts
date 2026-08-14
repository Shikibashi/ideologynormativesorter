import { describe, expect, it } from "vitest";
import { QUESTION_BANK_VERSION, questionById } from "./effectiveQuestions";
import {
  EDITORIAL_TWENTY_SECOND_PASS_VERSION,
  twentySecondPassRewritesById,
} from "./editorialTwentySecondPass";
import { questionPromptAfterReview } from "./questionPromptReview";

describe("twenty-second editorial pass", () => {
  it("registers and applies each source-backed correction", () => {
    expect(QUESTION_BANK_VERSION).toContain(
      EDITORIAL_TWENTY_SECOND_PASS_VERSION,
    );
    expect(Object.keys(twentySecondPassRewritesById)).toEqual([
      "q0114",
      "q0123",
      "q0142",
      "q0154",
      "q0158",
      "q0217",
    ]);

    for (const [id, rewrite] of Object.entries(twentySecondPassRewritesById)) {
      const question = questionById.get(id)!;
      expect(question.active, id).toBe(true);
      expect(question.prompt, id).toBe(
        questionPromptAfterReview(id, rewrite.prompt),
      );
      expect(question.evidenceNote, id).toBe(rewrite.evidenceNote);
      expect(question.version, id).toBe(EDITORIAL_TWENTY_SECOND_PASS_VERSION);
      expect(question.reviewStatus, id).toBe("approved");
      expect(question.sources, id).toHaveLength(rewrite.sourceIds.length);
      expect(question.contextNote?.length, id).toBeGreaterThan(140);
    }
  });

  it("preserves the intended layers and removes the audited shorthand", () => {
    expect(questionById.get("q0114")?.layer).toBe("prescriptive");
    expect(questionById.get("q0123")?.layer).toBe("normative");
    expect(questionById.get("q0142")?.layer).toBe("normative");
    expect(questionById.get("q0154")?.layer).toBe("prescriptive");
    expect(questionById.get("q0158")?.layer).toBe("prescriptive");
    expect(questionById.get("q0217")?.layer).toBe("prescriptive");

    expect(questionById.get("q0114")?.prompt).toMatch(
      /supply is constrained|demand/i,
    );
    expect(questionById.get("q0123")?.prompt).toMatch(
      /proportionate safeguards|payment integrity/i,
    );
    expect(questionById.get("q0142")?.prompt).toMatch(
      /attribution|criticism|follow-on/i,
    );
    expect(questionById.get("q0154")?.prompt).toMatch(
      /shorter terms|narrower claims|exceptions/i,
    );
    expect(questionById.get("q0158")?.prompt).toMatch(
      /interoperable|follow-on use/i,
    );
    expect(questionById.get("q0217")?.prompt).toMatch(
      /immigration status|work authorization|due process/i,
    );

    expect(questionById.get("q0123")?.prompt).not.toMatch(
      /unless specific fraud or insolvency risks are shown/i,
    );
    expect(questionById.get("q0217")?.prompt).not.toMatch(
      /ordinary work or residence/i,
    );
    expect(questionById.get("q0158")?.prompt).not.toMatch(
      /monopoly enforcement/i,
    );
  });
});
