import type { ReactElement } from "react";
import type {
  AnswerMap,
  Axis,
  Domain,
  IdeologyLabel,
  Question,
  QuizTier,
  ResultProfile,
} from "../types";
import type {
  ResearchConsent,
  ResearchAdministration,
  ResearchIdentity,
  ResearchSubmission,
  ResearchSubmissionStatus,
  SpecialistResearchSubmission,
} from "../research";
import type {
  SpecialistCriterionResponse,
  SpecialistOutcome,
} from "../specialist";
import type { SpecialistProgressSave } from "../specialist/save";
import type { QuizScreenStatus } from "./QuizScreen";
import { IntroScreen } from "./IntroScreen";
import { MethodologyScreen } from "./MethodologyScreen";
import { QuizScreen } from "./QuizScreen";
import { ResearchConsentScreen } from "./ResearchConsentScreen";
import {
  ResearchReceipt,
  type ResearchRecoveryAction,
} from "./ResearchReceipt";
import { ResultsScreen } from "./ResultsScreen";
import { SelfIdentificationScreen } from "./SelfIdentificationScreen";
import { SpecialistCriterionScreen } from "./SpecialistCriterionScreen";
import { SpecialistModuleInvite } from "./SpecialistModuleInvite";
import { SpecialistModuleResultScreen } from "./SpecialistModuleResultScreen";
import type { Stage } from "../app/types";
import type { SpecialistModuleDefinition } from "../specialist";
import type { LabelWithInfluences } from "./resultsPhilosophy";

export interface AppStageProps {
  stage: Stage;
  questionCounts: Record<QuizTier, number>;
  domainCount: number;
  savedProgress: { tier: QuizTier; answered: number; total: number } | null;
  onResume: () => void;
  onStart: (tier: QuizTier, contribute: boolean) => void;
  onTierChange: (tier: QuizTier) => void;
  onClearSavedProgress: () => void;
  contributionAvailable: boolean;
  loadError: string | null;
  onDismissLoadError: () => void;
  onMethodologyBack: () => void;
  participantId: string;
  administration: ResearchAdministration;
  expectedResearchItemCount: number;
  pendingTier: QuizTier;
  profileLabel: string;
  endpointConfigured: boolean;
  allowOfflinePreview: boolean;
  researchContact?: string;
  retentionNotice?: string;
  onConsent: (consent: ResearchConsent) => void;
  onResearchCancel: () => void;
  activeQuestions: Question[];
  answers: AnswerMap;
  resuming: boolean;
  resumeIndex: number;
  researchEnabled: boolean;
  persistCoreProgress: (input: {
    answers: AnswerMap;
    index: number;
  }) => { saved: true } | { saved: false; reason: string };
  onQuizStatusChange: (status: QuizScreenStatus) => void;
  onComplete: (answers: AnswerMap) => void;
  researchIdentityLabels: IdeologyLabel[];
  onResearchIdentity: (identity: ResearchIdentity) => Promise<void>;
  onSkipResearchSubmission: () => void;
  assignedSpecialistModule: SpecialistModuleDefinition | null;
  specialistProgress: SpecialistProgressSave | null;
  onStartSpecialist: () => void;
  onSkipSpecialist: () => void;
  specialistQuestions: Question[];
  specialistAnswers: AnswerMap;
  specialistResuming: boolean;
  specialistResumeIndex: number;
  persistSpecialistProgress: (input: {
    answers: AnswerMap;
    index: number;
  }) => { saved: true } | { saved: false; reason: string };
  onExitSpecialistQuiz: () => void;
  onSpecialistComplete: (answers: AnswerMap) => void;
  onSpecialistCriterion: (
    criterion: SpecialistCriterionResponse,
  ) => Promise<void>;
  specialistOutcome: SpecialistOutcome | null;
  specialistSubmission: SpecialistResearchSubmission | null;
  specialistStatus: ResearchSubmissionStatus | null;
  onExportResearchSubmission?: ResearchRecoveryAction;
  onDeleteResearchSubmission?: ResearchRecoveryAction;
  onRetryResearchSubmission?: ResearchRecoveryAction;
  onDiscardSpecialistAfterCompletion: () => void;
  onSpecialistResultContinue: () => void;
  researchSubmission: ResearchSubmission | null;
  researchStatus: ResearchSubmissionStatus | null;
  result: ResultProfile | null;
  axes: Axis[];
  domains: Domain[];
  labels: LabelWithInfluences[];
  compareResult: ResultProfile | null;
  onCompare: (answers: AnswerMap) => void;
  onRestart: () => void;
}

function IntroStage(props: AppStageProps): ReactElement {
  return (
    <IntroScreen
      questionCounts={props.questionCounts}
      domainCount={props.domainCount}
      savedProgress={props.savedProgress}
      onResume={props.onResume}
      onStart={props.onStart}
      onTierChange={props.onTierChange}
      onClearSavedProgress={props.onClearSavedProgress}
      contributionAvailable={props.contributionAvailable}
      loadError={props.loadError}
      onDismissLoadError={props.onDismissLoadError}
    />
  );
}

function ConsentStage(props: AppStageProps): ReactElement {
  return (
    <ResearchConsentScreen
      participantId={props.participantId}
      administration={props.administration}
      expectedCoreItemCount={props.expectedResearchItemCount}
      profileLabel={props.profileLabel}
      endpointConfigured={props.endpointConfigured}
      allowOfflinePreview={props.allowOfflinePreview}
      researchContact={props.researchContact}
      retentionNotice={props.retentionNotice}
      onConsent={props.onConsent}
      onCancel={props.onResearchCancel}
    />
  );
}

function QuizStage(props: AppStageProps): ReactElement {
  return (
    <QuizScreen
      questions={props.activeQuestions}
      tier={props.pendingTier}
      initialAnswers={props.resuming ? props.answers : undefined}
      initialIndex={props.resuming ? props.resumeIndex : undefined}
      progressSaver={props.persistCoreProgress}
      allowRefusal={props.researchEnabled}
      onStatusChange={props.onQuizStatusChange}
      onComplete={props.onComplete}
    />
  );
}

function SelfIdentificationStage(props: AppStageProps): ReactElement {
  return (
    <SelfIdentificationScreen
      labels={props.researchIdentityLabels}
      onContinue={props.onResearchIdentity}
      onSkip={props.onSkipResearchSubmission}
    />
  );
}

function SpecialistStage(props: AppStageProps): ReactElement | null {
  if (props.stage === "specialist-invite" && props.assignedSpecialistModule)
    return (
      <SpecialistModuleInvite
        module={props.assignedSpecialistModule}
        answeredCount={
          props.specialistProgress
            ? Object.keys(props.specialistProgress.answers).length
            : 0
        }
        totalCount={props.assignedSpecialistModule.questions.length}
        onStart={props.onStartSpecialist}
        onSkip={props.onSkipSpecialist}
      />
    );
  if (
    props.stage === "specialist-quiz" &&
    props.assignedSpecialistModule &&
    props.specialistQuestions.length > 0
  )
    return (
      <QuizScreen
        questions={props.specialistQuestions}
        initialAnswers={
          props.specialistResuming ? props.specialistAnswers : undefined
        }
        initialIndex={
          props.specialistResuming ? props.specialistResumeIndex : undefined
        }
        contextLabel={props.assignedSpecialistModule.shortTitle}
        progressSaver={props.persistSpecialistProgress}
        allowRefusal
        onStatusChange={props.onQuizStatusChange}
        onExit={props.onExitSpecialistQuiz}
        onComplete={props.onSpecialistComplete}
      />
    );
  if (props.stage === "specialist-criterion" && props.assignedSpecialistModule)
    return (
      <SpecialistCriterionScreen
        module={props.assignedSpecialistModule}
        onContinue={props.onSpecialistCriterion}
        onSkip={props.onDiscardSpecialistAfterCompletion}
      />
    );
  if (
    props.stage === "specialist-result" &&
    props.assignedSpecialistModule &&
    props.specialistOutcome
  )
    return (
      <>
        {props.specialistSubmission && props.specialistStatus && (
          <ResearchReceipt
            submission={props.specialistSubmission}
            status={props.specialistStatus}
            onExport={props.onExportResearchSubmission}
            onDelete={props.onDeleteResearchSubmission}
            onRetry={props.onRetryResearchSubmission}
          />
        )}
        <SpecialistModuleResultScreen
          module={props.assignedSpecialistModule}
          outcome={props.specialistOutcome}
          onContinue={props.onSpecialistResultContinue}
        />
      </>
    );
  return null;
}

function ResultsStage(props: AppStageProps): ReactElement | null {
  if (!props.result) return null;
  return (
    <>
      {props.researchSubmission && props.researchStatus && (
        <ResearchReceipt
          submission={props.researchSubmission}
          status={props.researchStatus}
          onExport={props.onExportResearchSubmission}
          onDelete={props.onDeleteResearchSubmission}
          onRetry={props.onRetryResearchSubmission}
        />
      )}{" "}
      {props.specialistSubmission && props.specialistStatus && (
        <ResearchReceipt
          submission={props.specialistSubmission}
          status={props.specialistStatus}
          onExport={props.onExportResearchSubmission}
          onDelete={props.onDeleteResearchSubmission}
          onRetry={props.onRetryResearchSubmission}
        />
      )}
      <ResultsScreen
        result={props.result}
        axes={props.axes}
        domains={props.domains}
        labels={props.labels}
        answers={props.answers}
        compareResult={props.compareResult}
        onCompare={props.onCompare}
        onRestart={props.onRestart}
      />
    </>
  );
}

export function AppStage(props: AppStageProps): ReactElement | null {
  if (props.stage === "intro") return <IntroStage {...props} />;
  if (props.stage === "methodology")
    return <MethodologyScreen onBack={props.onMethodologyBack} />;
  if (props.stage === "consent") return <ConsentStage {...props} />;
  if (props.stage === "quiz") return <QuizStage {...props} />;
  if (props.stage === "self-identification")
    return <SelfIdentificationStage {...props} />;
  if (props.stage.startsWith("specialist"))
    return <SpecialistStage {...props} />;
  return <ResultsStage {...props} />;
}
