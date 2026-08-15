import { useMemo } from "react";
import type { AppStageProps } from "../components/AppStage";
import type { ShellContext } from "../components/SiteShell";
import { axes } from "../data/axes";
import { domains } from "../data/domains";
import {
  publicCatalogLabels,
  researchIdentityLabels,
} from "../data/labelTaxonomy";
import { quizTierLabel } from "../quizTiers";
import { useAppActions } from "./useAppActions";
import type { AppActionContext } from "./actionTypes";
import { buildShellContext } from "./buildShellContext";
import { useAppBootstrapState } from "./useAppBootstrapState";
import { useAppHistorySync } from "./useAppHistorySync";
import { useAppQuizState } from "./useAppQuizState";
import { useAppResearchState } from "./useAppResearchState";
import { useAppSpecialistState } from "./useAppSpecialistState";

interface ControllerState {
  bootstrap: ReturnType<typeof useAppBootstrapState>;
  research: ReturnType<typeof useAppResearchState>;
  quiz: ReturnType<typeof useAppQuizState>;
  specialist: ReturnType<typeof useAppSpecialistState>;
}

function buildActionContext({
  bootstrap,
  research,
  quiz,
  specialist,
}: ControllerState): AppActionContext {
  return {
    activeQuestions: quiz.activeQuestions,
    administration: bootstrap.administration,
    answers: quiz.answers,
    axes,
    contributionAvailable: bootstrap.contributionAvailable,
    assignedSpecialistModule: specialist.assignedSpecialistModule,
    formSize: bootstrap.formSize,
    participantId: bootstrap.participantId,
    studyId: bootstrap.studyId,
    pendingTier: quiz.pendingTier,
    quizCompletedAt: quiz.quizCompletedAt,
    quizStartedAt: quiz.quizStartedAt,
    researchConsent: research.researchConsent,
    researchEnabled: research.researchEnabled,
    researchSubmission: research.researchSubmission,
    researchStatus: research.researchStatus,
    researchTaskArm: bootstrap.initialResearchTaskArm,
    labelExposureEnabled: bootstrap.labelExposureEnabled,
    labelExposureAssignment: research.labelExposureAssignment,
    labelExposureOutcome: research.labelExposureOutcome,
    recruitmentSource: bootstrap.recruitmentSource,
    result: quiz.result,
    resumeAfterConsent: quiz.resumeAfterConsent,
    specialistAnswers: specialist.specialistAnswers,
    specialistAssignment: specialist.specialistAssignment,
    specialistOutcome: specialist.specialistOutcome,
    specialistProgress: specialist.specialistProgress,
    specialistQuestions: specialist.specialistQuestions,
    specialistResuming: specialist.specialistResuming,
    specialistResumeIndex: specialist.specialistResumeIndex,
    specialistStartedAt: specialist.specialistStartedAt,
    specialistSubmission: specialist.specialistSubmission,
    specialistStatus: specialist.specialistStatus,
    wasResumed: quiz.wasResumed,
    setActiveQuestions: quiz.setActiveQuestions,
    setAnswers: quiz.setAnswers,
    setCompareResult: quiz.setCompareResult,
    setLoadError: quiz.setLoadError,
    setParticipantId: bootstrap.setParticipantId,
    setPendingTier: quiz.setPendingTier,
    setQuizCompletedAt: quiz.setQuizCompletedAt,
    setQuizStartedAt: quiz.setQuizStartedAt,
    setResearchConsent: research.setResearchConsent,
    setResearchEnabled: research.setResearchEnabled,
    setResearchSubmission: research.setResearchSubmission,
    setResearchStatus: research.setResearchStatus,
    setLabelExposureOutcome: research.setLabelExposureOutcome,
    setLabelExposureAssignment: research.setLabelExposureAssignment,
    setResult: quiz.setResult,
    setResumeAfterConsent: quiz.setResumeAfterConsent,
    setResumeIndex: quiz.setResumeIndex,
    setResuming: quiz.setResuming,
    setSavedProgress: quiz.setSavedProgress,
    setSpecialistAnswers: specialist.setSpecialistAnswers,
    setSpecialistOutcome: specialist.setSpecialistOutcome,
    setSpecialistProgress: specialist.setSpecialistProgress,
    setSpecialistQuestions: specialist.setSpecialistQuestions,
    setSpecialistResumeIndex: specialist.setSpecialistResumeIndex,
    setSpecialistResuming: specialist.setSpecialistResuming,
    setSpecialistStartedAt: specialist.setSpecialistStartedAt,
    setSpecialistStatus: specialist.setSpecialistStatus,
    setSpecialistSubmission: specialist.setSpecialistSubmission,
    setStage: quiz.setStage,
    setWasResumed: quiz.setWasResumed,
  };
}

function buildStageProps(
  state: ControllerState,
  actions: ReturnType<typeof useAppActions>,
): AppStageProps {
  const { bootstrap, research, quiz, specialist } = state;
  return {
    stage: quiz.stage,
    questionCounts: quiz.questionCounts,
    domainCount: quiz.domainCount,
    savedProgress: quiz.savedProgress,
    onResume: actions.handleResume,
    onStart: actions.handleStart,
    onTierChange: quiz.setPendingTier,
    onClearSavedProgress: actions.handleClearSavedProgress,
    contributionAvailable: bootstrap.contributionAvailable,
    loadError: quiz.loadError,
    onDismissLoadError: () => quiz.setLoadError(null),
    onMethodologyBack: actions.handleMethodologyBack,
    participantId: bootstrap.participantId,
    studyId: bootstrap.studyId,
    administration: bootstrap.administration,
    expectedResearchItemCount: quiz.expectedResearchItemCount,
    pendingTier: quiz.pendingTier,
    profileLabel: quizTierLabel(quiz.pendingTier),
    endpointConfigured: Boolean(import.meta.env.VITE_RESEARCH_ENDPOINT?.trim()),
    allowOfflinePreview: import.meta.env.DEV,
    researchContact: import.meta.env.VITE_RESEARCH_CONTACT,
    retentionNotice: import.meta.env.VITE_RESEARCH_RETENTION_NOTICE,
    onConsent: actions.handleConsent,
    onResearchCancel: actions.handleResearchCancel,
    activeQuestions: quiz.activeQuestions,
    answers: quiz.answers,
    resuming: quiz.resuming,
    resumeIndex: quiz.resumeIndex,
    researchEnabled: research.researchEnabled,
    persistCoreProgress: actions.persistCoreProgress,
    onQuizStatusChange: quiz.setQuizShellStatus,
    onComplete: actions.handleComplete,
    researchIdentityLabels,
    onResearchIdentity: actions.handleResearchIdentity,
    onSkipResearchSubmission: actions.handleSkipResearchSubmission,
    assignedSpecialistModule: specialist.assignedSpecialistModule,
    specialistProgress: specialist.specialistProgress,
    onStartSpecialist: actions.handleStartSpecialist,
    onSkipSpecialist: actions.handleSkipSpecialist,
    specialistQuestions: specialist.specialistQuestions,
    specialistAnswers: specialist.specialistAnswers,
    specialistResuming: specialist.specialistResuming,
    specialistResumeIndex: specialist.specialistResumeIndex,
    persistSpecialistProgress: actions.persistSpecialistProgress,
    onExitSpecialistQuiz: actions.handleExitSpecialistQuiz,
    onSpecialistComplete: actions.handleSpecialistComplete,
    onSpecialistCriterion: actions.handleSpecialistCriterion,
    specialistOutcome: specialist.specialistOutcome,
    specialistSubmission: specialist.specialistSubmission,
    specialistStatus: specialist.specialistStatus,
    onDiscardSpecialistAfterCompletion:
      actions.handleDiscardSpecialistAfterCompletion,
    onSpecialistResultContinue: () => quiz.setStage("results"),
    researchSubmission: research.researchSubmission,
    researchStatus: research.researchStatus,
    researchTaskArm: bootstrap.initialResearchTaskArm,
    labelExposureAssignment: research.labelExposureAssignment,
    onLabelExposureComplete: actions.handleLabelExposureComplete,
    onResearchTaskComplete: actions.handleResearchTaskComplete,
    result: quiz.result,
    axes,
    domains,
    labels: publicCatalogLabels,
    compareResult: quiz.compareResult,
    onCompare: actions.handleCompare,
    onRestart: actions.handleRestart,
  };
}

export interface AppController {
  shellContext: ShellContext;
  stageProps: AppStageProps;
}

export function useAppController(): AppController {
  const bootstrap = useAppBootstrapState();
  const research = useAppResearchState(bootstrap);
  const specialist = useAppSpecialistState(
    bootstrap.participantId,
    bootstrap.studyId,
    research.researchEnabled,
  );
  const quiz = useAppQuizState({
    bootstrap,
    research,
    axes,
    shareMeta: bootstrap.shareMeta,
  });
  const state = { bootstrap, research, quiz, specialist };
  const actionContext = buildActionContext(state);
  const actions = useAppActions(actionContext);

  useAppHistorySync({
    axes,
    result: quiz.result,
    setAnswers: quiz.setAnswers,
    setCompareResult: quiz.setCompareResult,
    setLoadError: quiz.setLoadError,
    setResult: quiz.setResult,
    setStage: quiz.setStage,
    shareMeta: bootstrap.shareMeta,
    stage: quiz.stage,
  });

  const shellContext = useMemo(
    () =>
      buildShellContext({
        stage: quiz.stage,
        administration: bootstrap.administration,
        assignedSpecialistTitle:
          specialist.assignedSpecialistModule?.shortTitle,
        compareActive: Boolean(quiz.compareResult),
        expectedResearchItemCount: quiz.expectedResearchItemCount,
        pendingTier: quiz.pendingTier,
        quizShellStatus: quiz.quizShellStatus,
        researchEnabled: research.researchEnabled,
        researchStatus: research.researchStatus?.status,
        savedProgress: Boolean(quiz.savedProgress),
        specialistProgress: Boolean(specialist.specialistProgress),
        specialistStatus: specialist.specialistStatus?.status,
        researchTaskArm: bootstrap.initialResearchTaskArm,
        studyId: bootstrap.studyId,
      }),
    [
      bootstrap.administration,
      bootstrap.initialResearchTaskArm,
      bootstrap.studyId,
      quiz.compareResult,
      quiz.expectedResearchItemCount,
      quiz.pendingTier,
      quiz.quizShellStatus,
      quiz.savedProgress,
      quiz.stage,
      research.researchEnabled,
      research.researchStatus?.status,
      specialist.assignedSpecialistModule?.shortTitle,
      specialist.specialistProgress,
      specialist.specialistStatus?.status,
    ],
  );

  return { shellContext, stageProps: buildStageProps(state, actions) };
}
