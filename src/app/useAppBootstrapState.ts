import { useMemo, useState } from "react";
import { QUESTION_BANK_VERSION } from "../data/effectiveQuestions";
import { RESULT_SCORING_VERSION } from "../scoring";
import {
  getOrCreateParticipantId,
  isResearchMode,
  researchAdministration,
  researchRecruitmentSource,
  buildLabelExposureAssignment,
  researchLabelExposureEnabled,
  researchStudyId,
  researchTaskArm,
} from "../research";
import type { ResearchTaskArm } from "../types";
import type { LabelExposureAssignment } from "../types";
import { researchFormSize } from "../research/forms";
import { loadPendingResearchRecord, loadQuizState } from "../save";
import { readSharedResult, type ShareMeta } from "../share";
import type { Setter } from "./actionTypes";

export interface AppBootstrapState {
  administration: ReturnType<typeof researchAdministration>;
  contributionAvailable: boolean;
  formSize: number | null;
  initialResearchMode: boolean;
  initialResearchTaskArm: Exclude<ResearchTaskArm, "all"> | null;
  labelExposureAssignment: LabelExposureAssignment | null;
  loadedInitialQuiz: ReturnType<typeof loadQuizState>;
  loadedPendingResearch: ReturnType<typeof loadPendingResearchRecord>;
  participantId: string;
  setParticipantId: Setter<string>;
  recruitmentSource: string | undefined;
  shareLoad: ReturnType<typeof readSharedResult>;
  shareMeta: ShareMeta;
  sharedAnswers: NonNullable<ReturnType<typeof readSharedResult>>["answers"];
  studyId: string;
}

export function useAppBootstrapState(): AppBootstrapState {
  const shareMeta = useMemo(
    () => ({
      bankVersion: QUESTION_BANK_VERSION,
      scoringVersion: RESULT_SCORING_VERSION,
    }),
    [],
  );
  const [shareLoad] = useState(() => readSharedResult(shareMeta));
  const initialResearchMode = useMemo(() => isResearchMode(), []);
  const initialResearchTaskArm = useMemo(() => researchTaskArm(), []);
  const administration = useMemo(() => researchAdministration(), []);
  const studyId = useMemo(() => researchStudyId(), []);
  const recruitmentSource = useMemo(() => researchRecruitmentSource(), []);
  const formSize = useMemo(() => researchFormSize(), []);
  const labelExposureEnabled = useMemo(
    () => researchLabelExposureEnabled(),
    [],
  );
  const contributionAvailable =
    Boolean(import.meta.env.VITE_RESEARCH_ENDPOINT?.trim()) ||
    import.meta.env.DEV;
  const [loadedInitialQuiz] = useState(loadQuizState);
  const [loadedPendingResearch] = useState(loadPendingResearchRecord);
  const [participantId, setParticipantId] = useState(() => {
    if (loadedInitialQuiz?.research?.participantId)
      return loadedInitialQuiz.research.participantId;
    if (loadedPendingResearch?.submission.recordType === "core")
      return loadedPendingResearch.submission.participantId;
    return initialResearchMode
      ? getOrCreateParticipantId(window.localStorage, undefined, studyId)
      : "";
  });
  const labelExposureAssignment = useMemo(
    () =>
      labelExposureEnabled && participantId
        ? buildLabelExposureAssignment(studyId, participantId)
        : null,
    [labelExposureEnabled, participantId, studyId],
  );

  return {
    administration,
    contributionAvailable,
    formSize,
    initialResearchMode,
    initialResearchTaskArm,
    labelExposureAssignment,
    loadedInitialQuiz,
    loadedPendingResearch,
    participantId,
    setParticipantId,
    recruitmentSource,
    shareLoad,
    shareMeta,
    sharedAnswers: shareLoad.answers,
    studyId,
  };
}
