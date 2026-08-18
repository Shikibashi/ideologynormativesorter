import { useMemo, useState } from "react";
import { QUESTION_BANK_VERSION } from "../domain/selectors";
import { RESULT_SCORING_VERSION } from "../scoring";
import {
  getOrCreateParticipantId,
  isResearchMode,
  researchAdministration,
  researchRecruitmentSource,
  researchStudyId,
} from "../research";
import { researchFormSize } from "../research/forms";
import { loadPendingResearchRecord, loadQuizState } from "../save";
import { readSharedResult, type ShareMeta } from "../share";
import type { Setter } from "./actionTypes";

export interface AppBootstrapState {
  administration: ReturnType<typeof researchAdministration>;
  contributionAvailable: boolean;
  formSize: number | null;
  initialResearchMode: boolean;
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
  const administration = useMemo(() => researchAdministration(), []);
  const studyId = useMemo(() => researchStudyId(), []);
  const recruitmentSource = useMemo(() => researchRecruitmentSource(), []);
  const formSize = useMemo(() => researchFormSize(), []);
  const contributionAvailable =
    Boolean(import.meta.env.VITE_RESEARCH_ENDPOINT?.trim()) ||
    import.meta.env.DEV;
  const [loadedInitialQuiz] = useState(loadQuizState);
  const [loadedPendingResearch] = useState(() =>
    loadPendingResearchRecord({
      studyId,
      administration,
      participantId: loadedInitialQuiz?.research?.participantId,
      bankVersion: QUESTION_BANK_VERSION,
      formVersion: "profile-form-v3",
    }),
  );
  const [participantId, setParticipantId] = useState(() => {
    if (loadedInitialQuiz?.research?.participantId)
      return loadedInitialQuiz.research.participantId;
    if (loadedPendingResearch?.submission.recordType === "core")
      return loadedPendingResearch.submission.participantId;
    return initialResearchMode
      ? getOrCreateParticipantId(window.localStorage, undefined, studyId)
      : "";
  });

  return {
    administration,
    contributionAvailable,
    formSize,
    initialResearchMode,
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
