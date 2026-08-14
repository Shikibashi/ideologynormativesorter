import { describe, expect, it } from "vitest";
import type { Question } from "../types";
import { specialistModuleDefinitions } from "../specialist";
import {
  applyQuestionPromptReview,
  QUESTION_PROMPT_REVIEW_VERSION,
  questionPromptRewrites,
} from "./questionPromptReview";
import {
  allQuestions,
  QUESTION_BANK_VERSION,
  questions,
} from "./effectiveQuestions";
import { coreDescriptivePromptRewrites } from "./questionPromptReviewCoreDescriptive";
import { coreNormativePromptRewrites } from "./questionPromptReviewCoreNormative";
import { corePrescriptivePromptRewrites } from "./questionPromptReviewCorePrescriptive";
import { specialistPromptRewrites } from "./questionPromptReviewSpecialist";

const corePromptRewrites = {
  ...coreNormativePromptRewrites,
  ...coreDescriptivePromptRewrites,
  ...corePrescriptivePromptRewrites,
};

function metadataWithoutWording(question: Question) {
  const metadata = { ...question };
  Reflect.deleteProperty(metadata, "prompt");
  Reflect.deleteProperty(metadata, "updatedAt");
  return metadata;
}

describe("respondent-facing question prompt review", () => {
  it("versions the effective bank and registers exactly the live Likert prompts", () => {
    expect(QUESTION_BANK_VERSION).toContain(QUESTION_PROMPT_REVIEW_VERSION);

    const liveCoreLikertIds = questions
      .filter((question) => question.responseType !== "statementChoice")
      .map((question) => String(question.id))
      .sort();
    const registeredCoreIds = Object.keys(corePromptRewrites).sort();

    expect(liveCoreLikertIds).toHaveLength(332);
    expect(registeredCoreIds).toEqual(liveCoreLikertIds);
    expect(Object.keys(questionPromptRewrites)).toHaveLength(400);
  });

  it("makes every live core and specialist prompt an interrogative", () => {
    expect(
      questions.every((question) => question.prompt.trim().endsWith("?")),
    ).toBe(true);

    const specialistQuestions = specialistModuleDefinitions.flatMap(
      (module) => module.questions,
    );
    expect(specialistQuestions).toHaveLength(68);
    expect(
      specialistQuestions.every((question) =>
        question.prompt.trim().endsWith("?"),
      ),
    ).toBe(true);
    expect(
      specialistQuestions.map((question) => String(question.id)).sort(),
    ).toEqual(Object.keys(specialistPromptRewrites).sort());
  });

  it("leaves quarantined historical core wording outside the live rewrite map", () => {
    const inactive = allQuestions.filter(
      (question) => question.active === false,
    );
    expect(inactive.length).toBeGreaterThan(0);
    expect(
      inactive.every(
        (question) => !Object.hasOwn(questionPromptRewrites, question.id),
      ),
    ).toBe(true);
  });

  it("uses natural agreement-compatible questions for descriptive and non-ideal items", () => {
    expect(questions.find((question) => question.id === "q0067")?.prompt).toBe(
      "Do you agree that, in a U.S. SNAP study, later recertification interview assignments reduced successful recertification and subsequent participation among affected cases?",
    );
    expect(questions.find((question) => question.id === "q0394")?.prompt).toBe(
      "Do you agree that movements should build exit options and mutual aid before relying on a single moment of political capture?",
    );
    expect(
      questions
        .filter((question) => question.layer === "descriptive")
        .every((question) => question.allowDontKnow === true),
    ).toBe(true);
  });

  it("changes only wording metadata when the overlay is applied", () => {
    const source = questions.find((question) => question.id === "q0067")!;
    const reviewed = applyQuestionPromptReview({
      ...source,
      prompt: "An older statement.",
      updatedAt: "older-review-date",
    });

    expect(reviewed.prompt).toBe(questionPromptRewrites.q0067);
    expect(reviewed.updatedAt).toBe("2026-08-13");
    expect(metadataWithoutWording(reviewed)).toEqual(
      metadataWithoutWording(source),
    );
  });

  it("does not rewrite statement-choice stems or their scoring options", () => {
    const choices = questions.filter(
      (question) => question.responseType === "statementChoice",
    );
    expect(choices).toHaveLength(6);
    expect(
      choices.every(
        (question) => !Object.hasOwn(questionPromptRewrites, question.id),
      ),
    ).toBe(true);
    expect(
      choices.every((question) => question.statementOptions?.length === 4),
    ).toBe(true);
  });
});
