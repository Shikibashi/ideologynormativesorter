import { useState } from "react";
import {
  RESEARCH_SCHEMA_VERSION,
  type CoreResearchSubmission,
  type ResearchConsent,
  type ResearchSubmission,
  type ResearchSubmissionStatus,
} from "../research";
import { QUESTION_BANK_VERSION } from "../domain/selectors";
import { RESULT_SCORING_VERSION } from "../scoring";
import type { AppBootstrapState } from "./useAppBootstrapState";
import type { Setter } from "./actionTypes";

export interface AppResearchState {
  pendingCoreResearch: NonNullable<
    AppBootstrapState["loadedPendingResearch"]
  > | null;
  pendingCoreSubmission: CoreResearchSubmission | null;
  researchConsent: ResearchConsent | null;
  setResearchConsent: Setter<ResearchConsent | null>;
  researchEnabled: boolean;
  setResearchEnabled: Setter<boolean>;
  researchStatus: ResearchSubmissionStatus | null;
  setResearchStatus: Setter<ResearchSubmissionStatus | null>;
  researchSubmission: ResearchSubmission | null;
  setResearchSubmission: Setter<ResearchSubmission | null>;
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
  const initialContributionMode =
    !bootstrap.sharedAnswers &&
    (bootstrap.initialResearchMode ||
      Boolean(bootstrap.loadedInitialQuiz?.research) ||
      pendingCoreSubmission !== null);
  const [researchEnabled, setResearchEnabled] = useState(
    initialContributionMode,
  );
  const [researchConsent, setResearchConsent] =
    useState<ResearchConsent | null>(null);
  const [researchSubmission, setResearchSubmission] =
    useState<ResearchSubmission | null>(pendingCoreSubmission);
  const [researchStatus, setResearchStatus] =
    useState<ResearchSubmissionStatus | null>(
      pendingCoreResearch?.status ?? null,
    );

  return {
    pendingCoreResearch,
    pendingCoreSubmission,
    researchConsent,
    setResearchConsent,
    researchEnabled,
    setResearchEnabled,
    researchStatus,
    setResearchStatus,
    researchSubmission,
    setResearchSubmission,
  };
}
