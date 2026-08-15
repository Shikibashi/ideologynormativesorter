import type { ReactElement } from "react";
import type {
  AnswerMap,
  Axis,
  Domain,
  IdeologyLabel,
  Question,
  QuizTier,
  ResultProfile,
  LabelExposureAssignment,
  LabelExposureOutcome,
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
import { ResearchReceipt } from "./ResearchReceipt";
import { ResearchTaskScreen } from "./ResearchTaskScreen";
import { LabelExposureScreen } from "./LabelExposureScreen";
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
  studyId: string;
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
  researchTaskArm: Exclude<import("../types").ResearchTaskArm, "all"> | null;
  onResearchTaskComplete: (input: {
    assignment: import("../research/tasks").ResearchTaskAssignment;
    tasks: import("../types").ResearchTask[];
    responses: import("../types").ResearchTaskResponse[];
    startedAt: string;
    completedAt: string;
  }) => Promise<void>;
  labelExposureAssignment: LabelExposureAssignment | null;
  onLabelExposureComplete: (outcome: LabelExposureOutcome) => void;
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
      researchTaskArm={props.researchTaskArm}
    />
  );
}

function ResearchTasksStage(props: AppStageProps): ReactElement | null {
  if (!props.researchTaskArm) return null;
  return (
    <ResearchTaskScreen
      arm={props.researchTaskArm}
      participantId={props.participantId}
      studyId={props.studyId}
      submission={props.researchSubmission}
      status={props.researchStatus}
      onComplete={props.onResearchTaskComplete}
      onRestart={props.onRestart}
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

function LabelExposureStage(props: AppStageProps): ReactElement | null {
  if (!props.labelExposureAssignment || !props.result) return null;
  return (
    <LabelExposureScreen
      assignment={props.labelExposureAssignment}
      result={props.result}
      axes={props.axes}
      onComplete={props.onLabelExposureComplete}
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
        />
      )}{" "}
      {props.specialistSubmission && props.specialistStatus && (
        <ResearchReceipt
          submission={props.specialistSubmission}
          status={props.specialistStatus}
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
  if (props.stage === "research-tasks")
    return <ResearchTasksStage {...props} />;
  if (props.stage === "label-exposure")
    return <LabelExposureStage {...props} />;
  if (props.stage === "quiz") return <QuizStage {...props} />;
  if (props.stage === "self-identification")
    return <SelfIdentificationStage {...props} />;
  if (props.stage.startsWith("specialist"))
    return <SpecialistStage {...props} />;
  return <ResultsStage {...props} />;
}
