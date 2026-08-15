import {
  buildResearchTaskSubmission,
  buildResearchSubmission,
  submitResearchSubmission,
  type ResearchIdentity,
} from "../research";
import { RESULT_SCORING_VERSION } from "../scoring";
import type { ResearchTask, ResearchTaskResponse } from "../types";
import type { LabelExposureOutcome } from "../types";
import type { ResearchTaskAssignment } from "../research/tasks";
import {
  clearPendingResearchRecord,
  clearQuizState,
  savePendingResearchRecord,
} from "../save";
import { announceStatus } from "../status";
import type { AppActionContext } from "./actionTypes";
import { refreshSpecialistProgress } from "./specialistActions";
import { labelExposureOutcomeErrors } from "../research/linking";

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
    labelExposureOutcome: context.labelExposureOutcome ?? undefined,
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

export function handleLabelExposureComplete(
  context: AppActionContext,
  outcome: LabelExposureOutcome,
): void {
  if (!context.labelExposureAssignment || !context.result) {
    throw new Error("The label-exposure arm is missing its result context.");
  }
  if (
    outcome.assignment.participantId !== context.participantId ||
    outcome.assignment.studyId !== context.studyId ||
    outcome.assignment.arm !== context.labelExposureAssignment.arm
  ) {
    throw new Error(
      "The label-exposure assignment does not match this session.",
    );
  }
  const errors = labelExposureOutcomeErrors(outcome);
  if (errors.length > 0) {
    throw new Error(`Label exposure response violation: ${errors.join("; ")}`);
  }
  context.setLabelExposureOutcome(outcome);
  context.setStage("self-identification");
  announceStatus("Exposure response recorded. Optional profile fields ready.");
}

export async function handleResearchTaskComplete(
  context: AppActionContext,
  input: {
    assignment: ResearchTaskAssignment;
    tasks: ResearchTask[];
    responses: ResearchTaskResponse[];
    startedAt: string;
    completedAt: string;
  },
): Promise<boolean> {
  if (!context.researchConsent || !context.researchTaskArm) {
    throw new Error("The research task arm is missing consent or arm context.");
  }
  const submission = buildResearchTaskSubmission({
    studyId: context.studyId,
    participantId: context.participantId,
    administration: context.administration,
    consent: context.researchConsent,
    scoringVersion: RESULT_SCORING_VERSION,
    arm: context.researchTaskArm,
    assignment: input.assignment,
    tasks: input.tasks,
    responses: input.responses,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    locale: navigator.language,
  });
  const status = await submitResearchSubmission(
    submission,
    import.meta.env.VITE_RESEARCH_ENDPOINT,
  );
  if (status.status === "submitted") {
    clearPendingResearchRecord();
  }
  const pendingSave =
    status.status === "submitted"
      ? { saved: true }
      : savePendingResearchRecord({ submission, status });
  if (pendingSave.saved) {
    context.setResearchSubmission(submission);
    context.setResearchStatus(status);
    context.setStage("research-tasks");
  } else {
    context.setResearchSubmission(null);
    context.setResearchStatus(null);
  }
  announceStatus(
    status.status === "failed"
      ? "Research task responses could not be submitted."
      : "Research task responses prepared.",
  );
  return pendingSave.saved;
}

export function createResearchActions(context: AppActionContext) {
  return {
    handleLabelExposureComplete: (outcome: LabelExposureOutcome) =>
      handleLabelExposureComplete(context, outcome),
    handleResearchIdentity: (identity: ResearchIdentity) =>
      handleResearchIdentity(context, identity),
    handleResearchTaskComplete: (input: {
      assignment: ResearchTaskAssignment;
      tasks: ResearchTask[];
      responses: ResearchTaskResponse[];
      startedAt: string;
      completedAt: string;
    }) => handleResearchTaskComplete(context, input),
    handleSkipResearchSubmission: () => handleSkipResearchSubmission(context),
  };
}
