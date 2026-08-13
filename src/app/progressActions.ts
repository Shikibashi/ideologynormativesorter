import { QUESTION_BANK_VERSION } from "../data/effectiveQuestions";
import {
  RESEARCH_FORM_VERSION,
  researchFormFingerprint,
} from "../research/forms";
import { saveQuizState } from "../save";
import { saveSpecialistProgress } from "../specialist/save";
import type { AnswerMap } from "../types";
import type { AppActionContext } from "./actionTypes";

export function persistCoreProgress(
  context: AppActionContext,
  { answers, index }: { answers: AnswerMap; index: number },
) {
  if (!context.quizStartedAt) {
    return {
      saved: false as const,
      reason:
        "Progress could not be saved because the session start time is missing.",
    };
  }
  return saveQuizState({
    questions: context.activeQuestions,
    answers,
    index,
    tier: context.pendingTier,
    startedAt: context.quizStartedAt,
    research: context.researchEnabled
      ? {
          participantId: context.participantId,
          studyId: context.studyId,
          administration: context.administration,
          bankVersion: QUESTION_BANK_VERSION,
          formVersion: RESEARCH_FORM_VERSION,
          formFingerprint: researchFormFingerprint(context.activeQuestions),
          requestedItemCount: context.formSize,
        }
      : undefined,
  });
}

export function persistSpecialistProgress(
  context: AppActionContext,
  { answers, index }: { answers: AnswerMap; index: number },
) {
  if (!context.specialistAssignment || !context.specialistStartedAt) {
    return {
      saved: false as const,
      reason:
        "Follow-up progress could not be saved because its session context is missing.",
    };
  }
  return saveSpecialistProgress({
    participantId: context.participantId,
    administration: context.administration,
    moduleId: context.specialistAssignment.moduleId,
    answers,
    index,
    startedAt: context.specialistStartedAt,
  });
}
