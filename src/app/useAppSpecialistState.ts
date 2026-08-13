import { useMemo, useState } from "react";
import type { AnswerMap, Question } from "../types";
import {
  assignSpecialistModule,
  specialistModuleById,
  type SpecialistModuleAssignment,
  type SpecialistModuleDefinition,
  type SpecialistOutcome,
} from "../specialist";
import type {
  ResearchSubmissionStatus,
  SpecialistResearchSubmission,
} from "../research";
import type { SpecialistProgressSave } from "../specialist/save";
import type { Setter } from "./actionTypes";

export interface AppSpecialistState {
  assignedSpecialistModule: SpecialistModuleDefinition | null;
  specialistAnswers: AnswerMap;
  setSpecialistAnswers: Setter<AnswerMap>;
  specialistAssignment: SpecialistModuleAssignment | null;
  specialistOutcome: SpecialistOutcome | null;
  setSpecialistOutcome: Setter<SpecialistOutcome | null>;
  specialistProgress: SpecialistProgressSave | null;
  setSpecialistProgress: Setter<SpecialistProgressSave | null>;
  specialistQuestions: Question[];
  setSpecialistQuestions: Setter<Question[]>;
  specialistResumeIndex: number;
  setSpecialistResumeIndex: Setter<number>;
  specialistResuming: boolean;
  setSpecialistResuming: Setter<boolean>;
  specialistStartedAt: string | null;
  setSpecialistStartedAt: Setter<string | null>;
  specialistStatus: ResearchSubmissionStatus | null;
  setSpecialistStatus: Setter<ResearchSubmissionStatus | null>;
  specialistSubmission: SpecialistResearchSubmission | null;
  setSpecialistSubmission: Setter<SpecialistResearchSubmission | null>;
}

export function useAppSpecialistState(
  participantId: string,
  studyId: string,
  researchEnabled: boolean,
): AppSpecialistState {
  const specialistAssignment = useMemo(
    () =>
      researchEnabled && participantId
        ? assignSpecialistModule(participantId, studyId)
        : null,
    [participantId, researchEnabled, studyId],
  );
  const assignedSpecialistModule = useMemo(
    () =>
      specialistAssignment
        ? (specialistModuleById.get(specialistAssignment.moduleId) ?? null)
        : null,
    [specialistAssignment],
  );
  const [specialistProgress, setSpecialistProgress] =
    useState<SpecialistProgressSave | null>(null);
  const [specialistQuestions, setSpecialistQuestions] = useState<Question[]>(
    [],
  );
  const [specialistAnswers, setSpecialistAnswers] = useState<AnswerMap>({});
  const [specialistResumeIndex, setSpecialistResumeIndex] = useState(0);
  const [specialistStartedAt, setSpecialistStartedAt] = useState<string | null>(
    null,
  );
  const [specialistResuming, setSpecialistResuming] = useState(false);
  const [specialistOutcome, setSpecialistOutcome] =
    useState<SpecialistOutcome | null>(null);
  const [specialistSubmission, setSpecialistSubmission] =
    useState<SpecialistResearchSubmission | null>(null);
  const [specialistStatus, setSpecialistStatus] =
    useState<ResearchSubmissionStatus | null>(null);

  return {
    assignedSpecialistModule,
    specialistAnswers,
    setSpecialistAnswers,
    specialistAssignment,
    specialistOutcome,
    setSpecialistOutcome,
    specialistProgress,
    setSpecialistProgress,
    specialistQuestions,
    setSpecialistQuestions,
    specialistResumeIndex,
    setSpecialistResumeIndex,
    specialistResuming,
    setSpecialistResuming,
    specialistStartedAt,
    setSpecialistStartedAt,
    specialistStatus,
    setSpecialistStatus,
    specialistSubmission,
    setSpecialistSubmission,
  };
}
