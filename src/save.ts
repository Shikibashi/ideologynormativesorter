import type { AnswerMap, Question, QuizTier } from "./types";
import type { ResearchSubmission, ResearchSubmissionStatus } from "./research";

const SAVE_KEY = "ideology-quiz-save";
const PENDING_RESEARCH_KEY = "political-judgment-pending-research-record-v1";

export interface QuizSave {
  questions: Question[];
  answers: AnswerMap;
  index: number;
  tier: QuizTier;
  startedAt?: string;
  completedAt?: string;
  research?: {
    participantId: string;
    studyId: string;
    administration: "test" | "retest";
    bankVersion: string;
    formVersion: string;
    formFingerprint: string;
    requestedItemCount: number | null;
  };
}

export interface PendingResearchRecord {
  submission: ResearchSubmission;
  status: ResearchSubmissionStatus;
}

export type SaveResult = { saved: true } | { saved: false; reason: string };

export function saveQuizState(state: QuizSave): SaveResult {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return { saved: true };
  } catch {
    return {
      saved: false,
      reason:
        "Your browser storage is full or disabled. Progress won't be saved, but you can still complete the quiz.",
    };
  }
}

export function loadQuizState(): QuizSave | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isQuizSave(parsed)) return parsed;
    clearQuizState();
    return null;
  } catch {
    clearQuizState();
    return null;
  }
}

export function clearQuizState(): boolean {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function savePendingResearchRecord(
  record: PendingResearchRecord,
): SaveResult {
  try {
    localStorage.setItem(PENDING_RESEARCH_KEY, JSON.stringify(record));
    return { saved: true };
  } catch {
    return {
      saved: false,
      reason:
        "The completed research record could not be saved in this browser.",
    };
  }
}

export function loadPendingResearchRecord(): PendingResearchRecord | null {
  try {
    const raw = localStorage.getItem(PENDING_RESEARCH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isPendingResearchRecord(parsed)) return parsed;
    clearPendingResearchRecord();
    return null;
  } catch {
    clearPendingResearchRecord();
    return null;
  }
}

export function clearPendingResearchRecord(): boolean {
  try {
    localStorage.removeItem(PENDING_RESEARCH_KEY);
    return true;
  } catch {
    return false;
  }
}

export function getQuizProgress(): {
  tier: QuizTier;
  answered: number;
  total: number;
} | null {
  const save = loadQuizState();
  if (!save) return null;
  return {
    tier: save.tier,
    answered: Math.min(Object.keys(save.answers).length, save.questions.length),
    total: save.questions.length,
  };
}

function isQuizSave(value: unknown): value is QuizSave {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<QuizSave>;
  const index = candidate.index;
  const completedAtIsValid =
    candidate.completedAt === undefined ||
    (typeof candidate.completedAt === "string" &&
      Number.isFinite(Date.parse(candidate.completedAt)));
  const completedAnswersAreComplete =
    candidate.completedAt === undefined ||
    (Array.isArray(candidate.questions) &&
      candidate.questions.every(
        (question) => candidate.answers?.[question.id] !== undefined,
      ));
  return (
    Array.isArray(candidate.questions) &&
    candidate.questions.length > 0 &&
    candidate.answers !== null &&
    typeof candidate.answers === "object" &&
    !Array.isArray(candidate.answers) &&
    Number.isInteger(index) &&
    typeof index === "number" &&
    index >= 0 &&
    index < candidate.questions.length &&
    (candidate.startedAt === undefined ||
      (typeof candidate.startedAt === "string" &&
        Number.isFinite(Date.parse(candidate.startedAt)))) &&
    completedAtIsValid &&
    completedAnswersAreComplete &&
    (candidate.research === undefined ||
      isResearchSaveContext(candidate.research)) &&
    (candidate.tier === "blitz" ||
      candidate.tier === "quick" ||
      candidate.tier === "moderate" ||
      candidate.tier === "extensive")
  );
}

function isResearchSaveContext(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const candidate = value as NonNullable<QuizSave["research"]>;
  return (
    typeof candidate.participantId === "string" &&
    typeof candidate.studyId === "string" &&
    (candidate.administration === "test" ||
      candidate.administration === "retest") &&
    typeof candidate.bankVersion === "string" &&
    typeof candidate.formVersion === "string" &&
    typeof candidate.formFingerprint === "string" &&
    (candidate.requestedItemCount === null ||
      (Number.isInteger(candidate.requestedItemCount) &&
        candidate.requestedItemCount > 0))
  );
}

function isPendingResearchRecord(
  value: unknown,
): value is PendingResearchRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PendingResearchRecord>;
  if (!candidate.submission || typeof candidate.submission !== "object")
    return false;
  if (!candidate.status || typeof candidate.status !== "object") return false;
  const submission = candidate.submission as Partial<ResearchSubmission>;
  const status = candidate.status as Partial<ResearchSubmissionStatus>;
  return (
    typeof submission.schemaVersion === "string" &&
    typeof submission.submissionId === "string" &&
    typeof submission.studyId === "string" &&
    typeof submission.participantId === "string" &&
    (submission.recordType === "core" ||
      submission.recordType === "specialist" ||
      submission.recordType === "specialist-disposition") &&
    (status.status === "submitted" ||
      status.status === "export-only" ||
      status.status === "failed")
  );
}
