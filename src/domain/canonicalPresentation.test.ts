import { describe, expect, it } from "vitest";
import { questions as reviewedQuestions } from "../data/effectiveQuestions";
import { coreQuestions } from "./selectors";

describe("clean-runtime question presentation", () => {
  it("projects the reviewed wording and theory context into every active core item", () => {
    const runtimeById = new Map(coreQuestions.map((question) => [question.id, question]));

    for (const reviewed of reviewedQuestions) {
      const runtime = runtimeById.get(reviewed.id);
      expect(runtime, reviewed.id).toBeDefined();
      expect(runtime?.prompt).toBe(reviewed.prompt);
      expect(runtime?.theoryContext).toBe(reviewed.theoryContext);
      expect(runtime?.evidenceNote).toBe(reviewed.evidenceNote);
      expect(runtime?.confidencePrompt).toBe(reviewed.confidencePrompt);
      expect(runtime?.priorityPrompt).toBe(reviewed.priorityPrompt);
    }
  });

  it("keeps all active core descriptive items operationally scoped and sourced", () => {
    const descriptive = coreQuestions.filter(
      (question) =>
        question.active !== false && question.layer === "descriptive",
    );

    expect(descriptive).toHaveLength(58);
    expect(
      descriptive.every(
        (question) =>
          Boolean(question.evidenceNote?.trim()) &&
          (question.sources?.length ?? 0) > 0,
      ),
    ).toBe(true);
  });
});
