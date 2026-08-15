import {
  buildContributionQuestionForm,
  RESEARCH_FORM_VERSION,
  researchFormFingerprint,
} from "../research/forms";
import {
  QUESTION_BANK_VERSION,
  questionById,
  questions,
  questionsForTier,
} from "../data/effectiveQuestions";
import {
  modifierScoringLabels,
  primaryScoringLabels,
} from "../data/labelTaxonomy";
import { buildResultProfile } from "../scoring";
import {
  clearPendingResearchRecord,
  clearQuizState,
  loadQuizState,
  saveQuizState,
  type QuizSave,
} from "../save";
import { announceStatus } from "../status";
import { quizTierLabel } from "../quizTiers";
import { getOrCreateParticipantId, type ResearchConsent } from "../research";
import { clearSpecialistProgress } from "../specialist/save";
import type { AnswerMap, QuizTier } from "../types";
import type { AppActionContext } from "./actionTypes";
import type { RestoreOutcome } from "./types";

export function refreshSavedProgress(context: AppActionContext): void {
  const saved = loadQuizState();
  context.setSavedProgress(
    saved
      ? {
          tier: saved.tier,
          answered: Math.min(
            Object.keys(saved.answers).length,
            saved.questions.length,
          ),
          total: saved.questions.length,
        }
      : null,
  );
}

export function beginQuiz(
  context: AppActionContext,
  tier: QuizTier,
  researchSession: boolean,
): void {
  clearQuizState();
  context.setSavedProgress(null);
  const pool = questionsForTier(tier);
  const assigned = researchSession
    ? buildContributionQuestionForm(
        pool,
        context.participantId,
        context.administration,
        context.formSize,
      )
    : pool;
  context.setActiveQuestions(assigned);
  context.setPendingTier(tier);
  context.setResumeIndex(0);
  context.setQuizStartedAt(new Date().toISOString());
  context.setQuizCompletedAt(null);
  context.setWasResumed(false);
  context.setResuming(false);
  context.setStage("quiz");
  announceStatus(`Started the ${quizTierLabel(tier).toLowerCase()}.`);
}

export function restoreSavedQuiz(
  context: AppActionContext,
  saved: QuizSave,
): RestoreOutcome {
  const expectedResearchQuestions = saved.research
    ? buildContributionQuestionForm(
        questionsForTier(saved.tier),
        context.participantId,
        context.administration,
        context.formSize,
      )
    : [];
  const researchContextMatches =
    saved.research &&
    saved.research.participantId === context.participantId &&
    saved.research.studyId === context.studyId &&
    saved.research.administration === context.administration &&
    saved.research.bankVersion === QUESTION_BANK_VERSION &&
    saved.research.formVersion === RESEARCH_FORM_VERSION &&
    saved.research.requestedItemCount === context.formSize &&
    saved.research.formFingerprint ===
      researchFormFingerprint(saved.questions) &&
    saved.research.formFingerprint ===
      researchFormFingerprint(expectedResearchQuestions) &&
    saved.questions.map((question) => question.id).join("|") ===
      expectedResearchQuestions.map((question) => question.id).join("|");
  if (context.researchEnabled && !researchContextMatches) return false;

  const reviewedQuestions = saved.research
    ? saved.questions
    : saved.questions
        .map((question) => questionById.get(question.id) ?? question)
        .filter((question) => question.active !== false);
  if (reviewedQuestions.length === 0) {
    clearQuizState();
    refreshSavedProgress(context);
    context.setLoadError(
      "The saved quiz used an older question bank and has no active questions to resume.",
    );
    return false;
  }

  const firstUnanswered = reviewedQuestions.findIndex(
    (question) => saved.answers[question.id] === undefined,
  );
  context.setActiveQuestions(reviewedQuestions);
  context.setAnswers(saved.answers);
  context.setPendingTier(saved.tier);
  context.setResumeIndex(
    firstUnanswered >= 0
      ? firstUnanswered
      : Math.max(0, reviewedQuestions.length - 1),
  );
  context.setQuizStartedAt(saved.startedAt ?? new Date().toISOString());
  context.setQuizCompletedAt(saved.completedAt ?? null);
  context.setWasResumed(true);
  context.setResuming(!saved.completedAt);
  if (saved.completedAt) {
    context.setResult(
      buildResultProfile(
        questions,
        saved.answers,
        context.axes,
        primaryScoringLabels,
        modifierScoringLabels,
      ),
    );
    return "completed";
  }
  return "in-progress";
}

export function handleStart(
  context: AppActionContext,
  tier: QuizTier,
  contribute: boolean,
): void {
  context.setLoadError(null);
  context.setPendingTier(tier);
  if (contribute && context.contributionAvailable) {
    if (!context.participantId)
      context.setParticipantId(
        getOrCreateParticipantId(
          window.localStorage,
          undefined,
          context.studyId,
        ),
      );
    context.setResearchEnabled(true);
    context.setStage("consent");
    return;
  }
  context.setResearchEnabled(false);
  context.setResearchConsent(null);
  beginQuiz(context, tier, false);
}

export function handleResume(context: AppActionContext): void {
  context.setLoadError(null);
  const saved = loadQuizState();
  if (!saved) {
    refreshSavedProgress(context);
    return;
  }
  const restored = restoreSavedQuiz(context, saved);
  if (!restored) return;
  if (context.researchEnabled) {
    context.setResumeAfterConsent(
      restored === "completed" ? "self-identification" : "quiz",
    );
    context.setStage("consent");
  } else {
    context.setStage(restored === "completed" ? "results" : "quiz");
    announceStatus("Resumed saved assessment progress.");
  }
}

export function handleConsent(
  context: AppActionContext,
  consent: ResearchConsent,
): void {
  context.setResearchConsent(consent);
  if (context.researchTaskArm) {
    context.setResumeAfterConsent(null);
    context.setStage("research-tasks");
    announceStatus("Research task arm ready.");
    return;
  }
  if (context.resumeAfterConsent) {
    const destination = context.resumeAfterConsent;
    context.setResumeAfterConsent(null);
    context.setStage(destination);
    return;
  }
  const saved = loadQuizState();
  const restored = saved?.research ? restoreSavedQuiz(context, saved) : false;
  if (restored) {
    context.setStage(restored === "completed" ? "self-identification" : "quiz");
    announceStatus("Resumed saved research assessment progress.");
    return;
  }
  beginQuiz(context, context.pendingTier, true);
}

export function handleResearchCancel(context: AppActionContext): void {
  context.setResearchEnabled(false);
  context.setResearchConsent(null);
  if (context.researchTaskArm) {
    context.setStage("intro");
    announceStatus("Research task arm declined.");
    return;
  }
  if (context.resumeAfterConsent) {
    const destination =
      context.resumeAfterConsent === "self-identification" ? "results" : "quiz";
    context.setResumeAfterConsent(null);
    context.setStage(destination);
    return;
  }
  beginQuiz(context, context.pendingTier, false);
}

export function handleComplete(
  context: AppActionContext,
  newAnswers: AnswerMap,
): void {
  const completedAt = new Date().toISOString();
  if (
    context.researchEnabled &&
    context.researchConsent &&
    context.quizStartedAt
  ) {
    saveQuizState({
      questions: context.activeQuestions,
      answers: newAnswers,
      index: Math.max(0, context.activeQuestions.length - 1),
      tier: context.pendingTier,
      startedAt: context.quizStartedAt,
      completedAt,
      research: {
        participantId: context.participantId,
        studyId: context.studyId,
        administration: context.administration,
        bankVersion: QUESTION_BANK_VERSION,
        formVersion: RESEARCH_FORM_VERSION,
        formFingerprint: researchFormFingerprint(context.activeQuestions),
        requestedItemCount: context.formSize,
      },
    });
    refreshSavedProgress(context);
  } else {
    clearQuizState();
    context.setSavedProgress(null);
  }
  context.setAnswers(newAnswers);
  context.setQuizCompletedAt(completedAt);
  context.setResult(
    buildResultProfile(
      questions,
      newAnswers,
      context.axes,
      primaryScoringLabels,
      modifierScoringLabels,
    ),
  );
  context.setStage(
    context.researchEnabled && context.researchConsent
      ? context.labelExposureAssignment
        ? "label-exposure"
        : "self-identification"
      : "results",
  );
  announceStatus("Assessment complete. Results are ready.");
}

export function handleCompare(
  context: AppActionContext,
  compareAnswers: AnswerMap,
): void {
  context.setCompareResult(
    buildResultProfile(
      questions,
      compareAnswers,
      context.axes,
      primaryScoringLabels,
      modifierScoringLabels,
    ),
  );
}

export function handleClearSavedProgress(context: AppActionContext): void {
  clearQuizState();
  clearPendingResearchRecord();
  context.setSavedProgress(null);
  announceStatus("Saved assessment progress cleared.");
}

export function handleMethodologyBack(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("view");
  window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function handleRestart(context: AppActionContext): void {
  if (window.location.hash)
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  clearQuizState();
  clearPendingResearchRecord();
  if (context.specialistAssignment) {
    clearSpecialistProgress(
      context.participantId,
      context.administration,
      context.specialistAssignment.moduleId,
    );
  }
  context.setSpecialistProgress(null);
  context.setSavedProgress(null);
  context.setResult(null);
  context.setAnswers({});
  context.setResearchConsent(null);
  context.setResearchSubmission(null);
  context.setResearchStatus(null);
  context.setLabelExposureOutcome(null);
  context.setSpecialistSubmission(null);
  context.setSpecialistStatus(null);
  context.setSpecialistProgress(null);
  context.setSpecialistQuestions([]);
  context.setSpecialistAnswers({});
  context.setSpecialistResumeIndex(0);
  context.setSpecialistStartedAt(null);
  context.setSpecialistResuming(false);
  context.setSpecialistOutcome(null);
  context.setResumeIndex(0);
  context.setQuizStartedAt(null);
  context.setQuizCompletedAt(null);
  context.setWasResumed(false);
  context.setResuming(false);
  context.setStage("intro");
  announceStatus("Assessment reset. Start page ready.");
  requestAnimationFrame(() => document.getElementById("app-content")?.focus());
}

export function createCoreActions(context: AppActionContext) {
  return {
    handleClearSavedProgress: () => handleClearSavedProgress(context),
    handleComplete: (answers: AnswerMap) => handleComplete(context, answers),
    handleCompare: (answers: AnswerMap) => handleCompare(context, answers),
    handleConsent: (consent: ResearchConsent) =>
      handleConsent(context, consent),
    handleMethodologyBack,
    handleResearchCancel: () => handleResearchCancel(context),
    handleResume: () => handleResume(context),
    handleRestart: () => handleRestart(context),
    handleStart: (tier: QuizTier, contribute: boolean) =>
      handleStart(context, tier, contribute),
  };
}
