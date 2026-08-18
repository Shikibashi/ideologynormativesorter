import type { AnswerMap, Question } from "../types";
import {
  buildSpecialistDispositionSubmission,
  buildSpecialistResearchSubmission,
  type SpecialistDisposition,
} from "../research";
import { submitPendingResearchSubmission } from "../research/pendingSubmission";
import {
  assertSpecialistAssignment,
  assertSpecialistCriterion,
  buildSpecialistQuestionForm,
  scoreSpecialistModule,
  type SpecialistCriterionResponse,
} from "../specialist";
import {
  clearSpecialistProgress,
  loadSpecialistProgress,
  type SpecialistProgressSave,
} from "../specialist/save";
import { announceStatus } from "../status";
import type { AppActionContext } from "./actionTypes";

function answersForQuestions(
  source: AnswerMap,
  questionList: Question[],
): AnswerMap {
  const allowed = new Set(questionList.map((question) => String(question.id)));
  return Object.fromEntries(
    Object.entries(source).filter(([questionId]) => allowed.has(questionId)),
  ) as AnswerMap;
}
function assertSpecialistContext(context: AppActionContext): void {
  if (!context.specialistAssignment && !context.assignedSpecialistModule)
    return;
  if (!context.specialistAssignment || !context.assignedSpecialistModule) {
    throw new Error(
      "The specialist assignment is missing its canonical module context.",
    );
  }
  if (
    context.specialistAssignment.moduleId !==
    context.assignedSpecialistModule.id
  ) {
    throw new Error(
      "The specialist assignment does not match the canonical module context.",
    );
  }
  assertSpecialistAssignment(
    context.specialistAssignment,
    context.assignedSpecialistModule.version,
  );
}

export function refreshSpecialistProgress(
  context: AppActionContext,
): SpecialistProgressSave | null {
  assertSpecialistContext(context);
  if (!context.specialistAssignment) {
    context.setSpecialistProgress(null);
    return null;
  }
  const saved = loadSpecialistProgress(
    context.participantId,
    context.administration,
    context.specialistAssignment.moduleId,
  );
  context.setSpecialistProgress(saved);
  return saved;
}

export function handleStartSpecialist(context: AppActionContext): void {
  assertSpecialistContext(context);
  if (!context.specialistAssignment || !context.assignedSpecialistModule) {
    context.setStage("results");
    return;
  }

  const form = buildSpecialistQuestionForm(
    context.specialistAssignment.moduleId,
    context.participantId,
    context.administration,
  );
  if (form.length === 0) {
    context.setStage("results");
    return;
  }

  const saved = loadSpecialistProgress(
    context.participantId,
    context.administration,
    context.specialistAssignment.moduleId,
  );
  const restoredAnswers = saved ? answersForQuestions(saved.answers, form) : {};
  const firstUnanswered = form.findIndex(
    (question) => restoredAnswers[question.id] === undefined,
  );
  context.setSpecialistQuestions(form);
  context.setSpecialistAnswers(restoredAnswers);
  context.setSpecialistResumeIndex(
    firstUnanswered >= 0 ? firstUnanswered : Math.max(0, form.length - 1),
  );
  context.setSpecialistStartedAt(saved?.startedAt ?? new Date().toISOString());
  context.setSpecialistResuming(Boolean(saved));
  context.setSpecialistOutcome(null);
  context.setSpecialistProgress(saved);
  context.setStage("specialist-quiz");
}

export function handleExitSpecialistQuiz(context: AppActionContext): void {
  refreshSpecialistProgress(context);
  context.setStage("specialist-invite");
}

export async function recordSpecialistDisposition(
  context: AppActionContext,
  disposition: SpecialistDisposition,
  answeredCount: number,
  startedAt?: string,
): Promise<void> {
  assertSpecialistContext(context);
  if (
    !context.researchConsent ||
    !context.specialistAssignment ||
    !context.assignedSpecialistModule
  )
    return;
  const submission = buildSpecialistDispositionSubmission({
    studyId: context.studyId,
    participantId: context.participantId,
    administration: context.administration,
    consent: context.researchConsent,
    moduleId: context.specialistAssignment.moduleId,
    moduleVersion: context.assignedSpecialistModule.version,
    assignment: context.specialistAssignment,
    disposition,
    answeredCount,
    startedAt,
  });
  await submitPendingResearchSubmission(
    submission,
    import.meta.env.VITE_RESEARCH_ENDPOINT,
  );
}

export async function handleSkipSpecialist(
  context: AppActionContext,
): Promise<void> {
  assertSpecialistContext(context);
  let answeredCount = 0;
  let startedAt: string | undefined;
  if (context.specialistAssignment) {
    const saved = loadSpecialistProgress(
      context.participantId,
      context.administration,
      context.specialistAssignment.moduleId,
    );
    answeredCount = saved ? Object.keys(saved.answers).length : 0;
    startedAt = saved?.startedAt;
    clearSpecialistProgress(
      context.participantId,
      context.administration,
      context.specialistAssignment.moduleId,
    );
  }
  await recordSpecialistDisposition(
    context,
    answeredCount > 0 ? "declined-after-partial" : "declined-before-start",
    answeredCount,
    startedAt,
  );
  context.setSpecialistProgress(null);
  context.setSpecialistQuestions([]);
  context.setSpecialistAnswers({});
  context.setSpecialistResumeIndex(0);
  context.setSpecialistStartedAt(null);
  context.setSpecialistResuming(false);
  context.setSpecialistOutcome(null);
  context.setStage("results");
}

export function handleSpecialistComplete(
  context: AppActionContext,
  newAnswers: AnswerMap,
): void {
  assertSpecialistContext(context);
  if (!context.specialistAssignment) {
    context.setStage("results");
    return;
  }
  clearSpecialistProgress(
    context.participantId,
    context.administration,
    context.specialistAssignment.moduleId,
  );
  context.setSpecialistProgress(null);
  context.setSpecialistAnswers(newAnswers);
  context.setSpecialistOutcome(
    scoreSpecialistModule(context.specialistAssignment.moduleId, newAnswers),
  );
  context.setSpecialistResuming(false);
  context.setStage("specialist-criterion");
  announceStatus("Specialist follow-up complete. Self-description is ready.");
}

export async function handleSpecialistCriterion(
  context: AppActionContext,
  criterion: SpecialistCriterionResponse,
): Promise<void> {
  assertSpecialistContext(context);
  if (
    !context.result ||
    !context.researchConsent ||
    !context.specialistAssignment ||
    !context.assignedSpecialistModule ||
    !context.specialistStartedAt ||
    context.specialistQuestions.length === 0
  ) {
    throw new Error(
      "The topic contribution is missing its consent, assignment, timing, or module context.",
    );
  }
  assertSpecialistCriterion(context.specialistAssignment.moduleId, criterion);

  const outcome =
    context.specialistOutcome ??
    scoreSpecialistModule(
      context.specialistAssignment.moduleId,
      context.specialistAnswers,
    );
  const submission = buildSpecialistResearchSubmission({
    studyId: context.studyId,
    participantId: context.participantId,
    administration: context.administration,
    consent: context.researchConsent,
    moduleId: context.specialistAssignment.moduleId,
    moduleVersion: context.assignedSpecialistModule.version,
    assignment: context.specialistAssignment,
    bankVersion: context.result.bankVersion ?? "unknown-bank",
    scoringVersion: context.result.scoringVersion ?? "unknown-scoring",
    criterion,
    answers: context.specialistAnswers,
    questions: context.specialistQuestions,
    constructWeightsByQuestionId:
      context.assignedSpecialistModule.constructWeightsByQuestionId,
    outcome,
    startedAt: context.specialistStartedAt,
    completedAt: new Date().toISOString(),
    locale: navigator.language,
  });
  const pendingResult = await submitPendingResearchSubmission(
    submission,
    import.meta.env.VITE_RESEARCH_ENDPOINT,
  );
  const status = pendingResult.status;
  context.setSpecialistOutcome(outcome);
  context.setSpecialistSubmission(submission);
  context.setSpecialistStatus(status);
  context.setStage("specialist-result");
  announceStatus(
    status.status === "failed"
      ? "Specialist follow-up could not be submitted."
      : "Specialist follow-up submitted.",
  );
}

export async function handleDiscardSpecialistAfterCompletion(
  context: AppActionContext,
): Promise<void> {
  await recordSpecialistDisposition(
    context,
    "declined-after-completion",
    Object.keys(context.specialistAnswers).length,
    context.specialistStartedAt ?? undefined,
  );
  context.setSpecialistQuestions([]);
  context.setSpecialistAnswers({});
  context.setSpecialistResumeIndex(0);
  context.setSpecialistStartedAt(null);
  context.setSpecialistResuming(false);
  context.setSpecialistOutcome(null);
  context.setStage("results");
}

export function createSpecialistActions(context: AppActionContext) {
  return {
    handleDiscardSpecialistAfterCompletion: () =>
      handleDiscardSpecialistAfterCompletion(context),
    handleExitSpecialistQuiz: () => handleExitSpecialistQuiz(context),
    handleSkipSpecialist: () => handleSkipSpecialist(context),
    handleSpecialistComplete: (answers: AnswerMap) =>
      handleSpecialistComplete(context, answers),
    handleSpecialistCriterion: (criterion: SpecialistCriterionResponse) =>
      handleSpecialistCriterion(context, criterion),
    handleStartSpecialist: () => handleStartSpecialist(context),
  };
}
