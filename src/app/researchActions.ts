import {
  buildResearchSubmission,
  submitResearchSubmission,
  type ResearchIdentity,
} from "../research";
import {
  clearPendingResearchRecord,
  clearQuizState,
  savePendingResearchRecord,
} from "../save";
import { announceStatus } from "../status";
import type { AppActionContext } from "./actionTypes";
import { refreshSpecialistProgress } from "./specialistActions";

export async function handleResearchIdentity(
  context: AppActionContext,
  identity: ResearchIdentity,
): Promise<void> {
  if (
    !context.result ||
    !context.researchConsent ||
    !context.quizStartedAt ||
    !context.quizCompletedAt
  ) {
    throw new Error(
      "The contribution is missing its consent, timing, or result context.",
    );
  }

  const submission = buildResearchSubmission({
    studyId: context.studyId,
    participantId: context.participantId,
    administration: context.administration,
    bankVersion: context.result.bankVersion ?? "unknown-bank",
    scoringVersion: context.result.scoringVersion ?? "unknown-scoring",
    tier: context.pendingTier,
    consent: context.researchConsent,
    identity,
    predictedLabelIds: context.result.nearestLabels
      .slice(0, 5)
      .map((match) => String(match.labelId)),
    predictedModifierIds: (context.result.modifierMatches ?? [])
      .slice(0, 5)
      .map((match) => String(match.labelId)),
    specialistAssignment: context.specialistAssignment ?? undefined,
    answers: context.answers,
    questions: context.activeQuestions,
    startedAt: context.quizStartedAt,
    completedAt: context.quizCompletedAt,
    resumed: context.wasResumed,
    requestedFormSize: context.formSize,
    recruitmentSource: context.recruitmentSource,
    locale: navigator.language,
  });
  const status = await submitResearchSubmission(
    submission,
    import.meta.env.VITE_RESEARCH_ENDPOINT,
  );

  if (status.status === "submitted") {
    clearPendingResearchRecord();
    clearQuizState();
    context.setSavedProgress(null);
  } else {
    const pendingSave = savePendingResearchRecord({ submission, status });
    if (pendingSave.saved) {
      clearQuizState();
      context.setSavedProgress(null);
    }
  }

  context.setResearchSubmission(submission);
  context.setResearchStatus(status);
  announceStatus(
    status.status === "failed"
      ? "Contribution could not be submitted."
      : "Contribution prepared.",
  );

  if (context.specialistAssignment && context.assignedSpecialistModule) {
    refreshSpecialistProgress(context);
    context.setStage("specialist-invite");
  } else {
    context.setStage("results");
  }
}

export function handleSkipResearchSubmission(context: AppActionContext): void {
  clearQuizState();
  clearPendingResearchRecord();
  context.setSavedProgress(null);
  context.setResearchEnabled(false);
  context.setResearchConsent(null);
  context.setResearchSubmission(null);
  context.setResearchStatus(null);
  context.setStage("results");
  announceStatus("Contribution skipped. Results are ready.");
}

export function createResearchActions(context: AppActionContext) {
  return {
    handleResearchIdentity: (identity: ResearchIdentity) =>
      handleResearchIdentity(context, identity),
    handleSkipResearchSubmission: () => handleSkipResearchSubmission(context),
  };
}
