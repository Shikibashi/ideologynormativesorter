import { describe, expect, it } from "vitest";
import { questions } from "./effectiveQuestions";
import { questionContextById } from "./questionContext";
import { specialistModuleDefinitions } from "../specialist";

const specialistQuestions = specialistModuleDefinitions.flatMap(
  (module) => module.questions,
);
const liveQuestions = [...questions, ...specialistQuestions];

describe("effective question source coverage", () => {
  it("keeps every respondent-facing question source-backed", () => {
    expect(questions).toHaveLength(338);
    expect(specialistQuestions).toHaveLength(68);
    expect(new Set(liveQuestions.map((question) => question.id)).size).toBe(
      liveQuestions.length,
    );

    for (const question of liveQuestions) {
      expect(question.prompt, `${question.id} prompt`).toMatch(/\?$/);
      expect(
        question.contextNote?.length,
        `${question.id} context note`,
      ).toBeGreaterThan(100);
      expect(
        question.sources?.length,
        `${question.id} sources`,
      ).toBeGreaterThan(0);

      const contextRecord = questionContextById[question.id];
      expect(contextRecord, `${question.id} source record`).toBeDefined();
      expect(contextRecord?.sourceIds?.length).toBeGreaterThan(0);

      for (const source of question.sources ?? []) {
        expect(
          source.title.length,
          `${question.id} source title`,
        ).toBeGreaterThan(2);
        expect(
          source.publisher?.length ?? 0,
          `${question.id} source publisher`,
        ).toBeGreaterThan(2);
        expect(source.url, `${question.id} source URL`).toMatch(/^https:\/\//);
      }
    }
  });

  it("preserves descriptive evidence and refusal semantics", () => {
    const descriptive = liveQuestions.filter(
      (question) => question.layer === "descriptive",
    );

    expect(descriptive).toHaveLength(64);
    for (const question of descriptive) {
      expect(
        question.evidenceNote,
        `${question.id} evidence note`,
      ).toBeTruthy();
      expect(question.allowDontKnow, `${question.id} refusal`).toBe(true);
      expect(
        question.confidencePrompt,
        `${question.id} confidence prompt`,
      ).toBeTruthy();
    }
  });

  it("keeps high-risk source records on current canonical endpoints", () => {
    const sourceUrls = new Map(
      liveQuestions.map((question) => [
        question.id,
        (question.sources ?? []).map((source) => source.url),
      ]),
    );

    expect(sourceUrls.get("q0067")).toContain(
      "https://www.nber.org/papers/w27311",
    );
    expect(
      sourceUrls
        .get("q0328")
        ?.some((url) =>
          url.includes("/Reports/Article-Display/Article/4020346/"),
        ),
    ).toBe(true);
    expect(
      sourceUrls
        .get("q0355")
        ?.some((url) => url.includes("default.aspx?pdffile=")),
    ).toBe(true);
    expect(
      sourceUrls
        .get("q0478")
        ?.some((url) => url.includes("10.1017/S1744137424000249")),
    ).toBe(true);
    expect(
      sourceUrls
        .get("q0479")
        ?.some((url) => url.includes("10.1017/S1744137424000249")),
    ).toBe(true);
  });
});
