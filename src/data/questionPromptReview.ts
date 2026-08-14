import type { Question } from "../types";
import { coreDescriptivePromptRewrites } from "./questionPromptReviewCoreDescriptive";
import { coreNormativePromptRewrites } from "./questionPromptReviewCoreNormative";
import { corePrescriptivePromptRewrites } from "./questionPromptReviewCorePrescriptive";
import { specialistPromptRewrites } from "./questionPromptReviewSpecialist";
import type { PromptRewrites } from "./questionPromptReviewTypes";

export const QUESTION_PROMPT_REVIEW_VERSION = "2026-08-question-prompts-v1";
export const QUESTION_PROMPT_REVIEW_DATE = "2026-08-13";

export const questionPromptRewrites: PromptRewrites = {
  ...coreNormativePromptRewrites,
  ...coreDescriptivePromptRewrites,
  ...corePrescriptivePromptRewrites,
  ...specialistPromptRewrites,
};

export function questionPromptAfterReview(
  id: string,
  fallback: string,
): string {
  return questionPromptRewrites[id] ?? fallback;
}

/**
 * Final respondent-facing wording overlay. It changes only the prompt text;
 * raw and quarantined historical items retain their original wording.
 */
export function applyQuestionPromptReview(question: Question): Question {
  if (question.active === false || question.responseType === "statementChoice")
    return question;

  const prompt = questionPromptRewrites[String(question.id)];
  if (!prompt) return question;

  return {
    ...question,
    prompt,
    updatedAt: QUESTION_PROMPT_REVIEW_DATE,
  };
}
