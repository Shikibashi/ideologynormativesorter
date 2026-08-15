import { useState } from "react";
import {
  RESEARCH_SCHEMA_VERSION,
  type CoreResearchSubmission,
  type ResearchConsent,
  type ResearchSubmission,
  type ResearchSubmissionStatus,
} from "../research";
import { QUESTION_BANK_VERSION } from "../data/effectiveQuestions";
import { RESULT_SCORING_VERSION } from "../scoring";
import { RESEARCH_TASK_BANK_VERSION } from "../research/versions";
import type { AppBootstrapState } from "./useAppBootstrapState";
import type { Setter } from "./actionTypes";
import type { LabelExposureOutcome } from "../types";

export interface AppResearchState {
  pendingCoreResearch: NonNullable<
    AppBootstrapState["loadedPendingResearch"]
  > | null;
  pendingCoreSubmission: CoreResearchSubmission | null;
  pendingTaskResearch: NonNullable<
    AppBootstrapState["loadedPendingResearch"]
  > | null;
  researchConsent: ResearchConsent | null;
  setResearchConsent: Setter<ResearchConsent | null>;
  researchEnabled: boolean;
  setResearchEnabled: Setter<boolean>;
  researchStatus: ResearchSubmissionStatus | null;
  setResearchStatus: Setter<ResearchSubmissionStatus | null>;
  researchSubmission: ResearchSubmission | null;
  setResearchSubmission: Setter<ResearchSubmission | null>;
  labelExposureOutcome: LabelExposureOutcome | null;
  setLabelExposureOutcome: Setter<LabelExposureOutcome | null>;
}

export function useAppResearchState(
  bootstrap: AppBootstrapState,
): AppResearchState {
  const pendingCoreResearch =
    !bootstrap.sharedAnswers &&
    bootstrap.loadedPendingResearch?.submission.recordType === "core" &&
    bootstrap.loadedPendingResearch.submission.schemaVersion ===
      RESEARCH_SCHEMA_VERSION &&
    bootstrap.loadedPendingResearch.submission.studyId === bootstrap.studyId &&
    bootstrap.loadedPendingResearch.submission.participantId ===
      bootstrap.participantId &&
    bootstrap.loadedPendingResearch.submission.administration ===
      bootstrap.administration &&
    bootstrap.loadedPendingResearch.submission.bankVersion ===
      QUESTION_BANK_VERSION &&
    bootstrap.loadedPendingResearch.submission.scoringVersion ===
      RESULT_SCORING_VERSION
      ? bootstrap.loadedPendingResearch
      : null;
  const pendingCoreSubmission: CoreResearchSubmission | null =
    pendingCoreResearch?.submission.recordType === "core"
      ? pendingCoreResearch.submission
      : null;
  const pendingTaskResearch =
    !bootstrap.sharedAnswers &&
    bootstrap.loadedPendingResearch?.submission.recordType ===
      "research-task" &&
    bootstrap.loadedPendingResearch.submission.schemaVersion ===
      RESEARCH_SCHEMA_VERSION &&
    bootstrap.loadedPendingResearch.submission.studyId === bootstrap.studyId &&
    bootstrap.loadedPendingResearch.submission.participantId ===
      bootstrap.participantId &&
    bootstrap.loadedPendingResearch.submission.taskBankVersion ===
      RESEARCH_TASK_BANK_VERSION &&
    bootstrap.loadedPendingResearch.submission.arm ===
      bootstrap.initialResearchTaskArm
      ? bootstrap.loadedPendingResearch
      : null;
  const initialContributionMode =
    !bootstrap.sharedAnswers &&
    (bootstrap.initialResearchMode ||
      Boolean(bootstrap.loadedInitialQuiz?.research) ||
      pendingCoreSubmission !== null ||
      pendingTaskResearch !== null);
  const [researchEnabled, setResearchEnabled] = useState(
    initialContributionMode,
  );
  const [researchConsent, setResearchConsent] =
    useState<ResearchConsent | null>(null);
  const [researchSubmission, setResearchSubmission] =
    useState<ResearchSubmission | null>(
      pendingCoreSubmission ?? pendingTaskResearch?.submission ?? null,
    );
  const [researchStatus, setResearchStatus] =
    useState<ResearchSubmissionStatus | null>(
      pendingCoreResearch?.status ?? pendingTaskResearch?.status ?? null,
    );
  const [labelExposureOutcome, setLabelExposureOutcome] =
    useState<LabelExposureOutcome | null>(null);

  return {
    pendingCoreResearch,
    pendingCoreSubmission,
    pendingTaskResearch,
    researchConsent,
    setResearchConsent,
    researchEnabled,
    setResearchEnabled,
    researchStatus,
    setResearchStatus,
    researchSubmission,
    setResearchSubmission,
    labelExposureOutcome,
    setLabelExposureOutcome,
  };
}
