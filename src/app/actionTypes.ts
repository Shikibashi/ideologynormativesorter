import type { Dispatch, SetStateAction } from "react";
import type {
  Axis,
  AnswerMap,
  Question,
  QuizTier,
  ResultProfile,
} from "../types";
import type {
  ResearchAdministration,
  ResearchConsent,
  ResearchSubmission,
  ResearchSubmissionStatus,
  SpecialistResearchSubmission,
} from "../research";
import type { ResearchTaskArm } from "../types";
import type { LabelExposureOutcome } from "../types";
import type {
  SpecialistModuleAssignment,
  SpecialistModuleDefinition,
  SpecialistOutcome,
} from "../specialist";
import type { SpecialistProgressSave } from "../specialist/save";
import type { Stage } from "./types";

export type Setter<T> = Dispatch<SetStateAction<T>>;

export interface AppActionContext {
  activeQuestions: Question[];
  administration: ResearchAdministration;
  answers: AnswerMap;
  axes: Axis[];
  contributionAvailable: boolean;
  assignedSpecialistModule: SpecialistModuleDefinition | null;
  formSize: number | null;
  participantId: string;
  pendingTier: QuizTier;
  quizCompletedAt: string | null;
  quizStartedAt: string | null;
  researchConsent: ResearchConsent | null;
  researchEnabled: boolean;
  researchSubmission: ResearchSubmission | null;
  researchStatus: ResearchSubmissionStatus | null;
  researchTaskArm: ResearchTaskArm | null;
  labelExposureAssignment: import("../types").LabelExposureAssignment | null;
  labelExposureOutcome: LabelExposureOutcome | null;
  recruitmentSource: string | undefined;
  result: ResultProfile | null;
  resumeAfterConsent: "quiz" | "self-identification" | null;
  specialistAnswers: AnswerMap;
  specialistAssignment: SpecialistModuleAssignment | null;
  specialistOutcome: SpecialistOutcome | null;
  specialistProgress: SpecialistProgressSave | null;
  specialistQuestions: Question[];
  specialistResuming: boolean;
  specialistResumeIndex: number;
  specialistStartedAt: string | null;
  specialistSubmission: SpecialistResearchSubmission | null;
  specialistStatus: ResearchSubmissionStatus | null;
  studyId: string;
  wasResumed: boolean;
  setActiveQuestions: Setter<Question[]>;
  setAnswers: Setter<AnswerMap>;
  setCompareResult: Setter<ResultProfile | null>;
  setLoadError: Setter<string | null>;
  setParticipantId: Setter<string>;
  setPendingTier: Setter<QuizTier>;
  setQuizCompletedAt: Setter<string | null>;
  setQuizStartedAt: Setter<string | null>;
  setResearchConsent: Setter<ResearchConsent | null>;
  setResearchEnabled: Setter<boolean>;
  setResearchSubmission: Setter<ResearchSubmission | null>;
  setResearchStatus: Setter<ResearchSubmissionStatus | null>;
  setLabelExposureOutcome: Setter<LabelExposureOutcome | null>;
  setResult: Setter<ResultProfile | null>;
  setResumeAfterConsent: Setter<"quiz" | "self-identification" | null>;
  setResumeIndex: Setter<number>;
  setResuming: Setter<boolean>;
  setSavedProgress: Setter<{
    tier: QuizTier;
    answered: number;
    total: number;
  } | null>;
  setSpecialistAnswers: Setter<AnswerMap>;
  setSpecialistOutcome: Setter<SpecialistOutcome | null>;
  setSpecialistProgress: Setter<SpecialistProgressSave | null>;
  setSpecialistQuestions: Setter<Question[]>;
  setSpecialistResumeIndex: Setter<number>;
  setSpecialistResuming: Setter<boolean>;
  setSpecialistStartedAt: Setter<string | null>;
  setSpecialistStatus: Setter<ResearchSubmissionStatus | null>;
  setSpecialistSubmission: Setter<SpecialistResearchSubmission | null>;
  setStage: Setter<Stage>;
  setWasResumed: Setter<boolean>;
}
