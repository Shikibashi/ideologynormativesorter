import {
  buildResearchSubmission,
  type ResearchIdentity,
  type ResearchSubmission,
} from "../research";
import {
  deletePendingResearchSubmission,
  loadPendingResearchSubmission,
  pendingPayload,
  retryPendingResearchSubmission,
  submitPendingResearchSubmission,
} from "../research/pendingSubmission";
import { clearQuizState } from "../save";
import { announceStatus } from "../status";
import type { AppActionContext } from "./actionTypes";
import { refreshSpecialistProgress } from "./specialistActions";

function matchesRecoveryContext(
  context: AppActionContext,
  submission: {
    studyId: string;
    participantId: string;
    administration: "test" | "retest";
  },
): boolean {
  return (
    submission.studyId === context.studyId &&
    submission.participantId === context.participantId &&
    submission.administration === context.administration
  );
}

function currentRecoverySubmission(
  context: AppActionContext,
  submissionId: string,
): ResearchSubmission | null {
  const stored = loadPendingResearchSubmission(submissionId);
  if (stored && matchesRecoveryContext(context, stored.payload))
    return stored.payload;
  if (stored) return null;
  const inMemory = [
    context.researchSubmission,
    context.specialistSubmission,
  ].find(
    (submission) =>
      submission?.submissionId === submissionId &&
      matchesRecoveryContext(context, submission),
  );
  return inMemory ?? null;
}

export function handleExportResearchSubmission(
  context: AppActionContext,
  submissionId: string,
): boolean {
  const submission = currentRecoverySubmission(context, submissionId);
  const urlApi = globalThis.URL;
  if (
    !submission ||
    typeof document === "undefined" ||
    typeof Blob === "undefined" ||
    !urlApi ||
    typeof urlApi.createObjectURL !== "function"
  )
    return false;

  const payload = pendingPayload(submission);
  const blob = new Blob([payload], { type: "application/json" });
  const url = urlApi.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeId = submissionId.replace(/[^a-zA-Z0-9._-]+/g, "-");
  anchor.href = url;
  anchor.download = `research-submission-${safeId}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  urlApi.revokeObjectURL(url);
  announceStatus("The exact contribution payload was exported.");
  return true;
}

export function handleDeleteResearchSubmission(
  context: AppActionContext,
  submissionId: string,
): boolean {
  const stored = loadPendingResearchSubmission(submissionId);
  if (!stored || !matchesRecoveryContext(context, stored.payload)) return false;
  const deleted = deletePendingResearchSubmission(submissionId);
  if (deleted) announceStatus("The selected contribution record was deleted.");
  return deleted;
}

export async function handleRetryResearchSubmission(
  context: AppActionContext,
  submissionId: string,
): Promise<boolean> {
  const stored = loadPendingResearchSubmission(submissionId);
  if (
    !stored ||
    !matchesRecoveryContext(context, stored.payload) ||
    (stored.state !== "pending" &&
      stored.state !== "retryable" &&
      stored.state !== "failed" &&
      stored.state !== "conflict") ||
    stored.route.trim().length === 0
  )
    return false;

  const result = await retryPendingResearchSubmission(submissionId);
  if (!result) return false;
  if (context.researchSubmission?.submissionId === submissionId)
    context.setResearchStatus(result.status);
  if (context.specialistSubmission?.submissionId === submissionId)
    context.setSpecialistStatus(result.status);
  announceStatus(
    result.status.status === "submitted"
      ? "Contribution retry submitted."
      : "Contribution retry did not submit; the record remains stored.",
  );
  return true;
}

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
  const predictedLabelIds = (context.result.production?.labels ?? [])
    .slice(0, 5)
    .map((match) => String(match.labelId));
  const predictedModifierIds = context.result.production
    ? (context.result.modifierMatches ?? [])
        .slice(0, 5)
        .map((match) => String(match.labelId))
    : [];

  const submission = buildResearchSubmission({
    studyId: context.studyId,
    participantId: context.participantId,
    administration: context.administration,
    bankVersion: context.result.bankVersion ?? "unknown-bank",
    scoringVersion:
      context.result.production?.interpretation.scoringVersion ??
      context.result.scoringVersion ??
      "unknown-scoring",
    tier: context.pendingTier,
    consent: context.researchConsent,
    identity,
    predictedLabelIds,
    predictedModifierIds,
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
  const pendingResult = await submitPendingResearchSubmission(
    submission,
    import.meta.env.VITE_RESEARCH_ENDPOINT,
  );
  const status = pendingResult.status;

  if (status.status === "submitted" || pendingResult.persisted) {
    if (status.status === "submitted")
      deletePendingResearchSubmission(submission.submissionId);
    clearQuizState();
    context.setSavedProgress(null);
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
  if (context.researchSubmission) {
    deletePendingResearchSubmission(context.researchSubmission.submissionId);
  }
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
    handleExportResearchSubmission: (submissionId: string) =>
      handleExportResearchSubmission(context, submissionId),
    handleDeleteResearchSubmission: (submissionId: string) =>
      handleDeleteResearchSubmission(context, submissionId),
    handleRetryResearchSubmission: (submissionId: string) =>
      handleRetryResearchSubmission(context, submissionId),
  };
}
