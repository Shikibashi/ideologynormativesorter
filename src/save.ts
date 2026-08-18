import type { AnswerMap, Question, QuizTier } from "./types";
import type { ResearchSubmission, ResearchSubmissionStatus } from "./research";
import {
  clearAllPendingResearchSubmissions,
  deletePendingResearchSubmission,
  listPendingResearchSubmissions,
  savePendingResearchSubmission,
  transitionPendingResearchSubmission,
} from "./research/pendingSubmission";

const SAVE_KEY = "ideology-quiz-save";

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
  if (!isQuizSave(state)) {
    return { saved: false, reason: "The saved quiz progress is invalid." };
  }
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
  if (!record || !record.status || typeof record.status !== "object") {
    return {
      saved: false,
      reason: "The completed research record is invalid.",
    };
  }
  if (!record.submission || typeof record.submission !== "object") {
    return {
      saved: false,
      reason: "The completed research record is invalid.",
    };
  }
  const status = record.status;
  if (
    status.status !== "export-only" &&
    status.status !== "failed" &&
    status.status !== "submitted"
  ) {
    return {
      saved: false,
      reason: "The completed research status is invalid.",
    };
  }
  if (
    (status.status === "submitted" &&
      (typeof status.endpoint !== "string" || status.endpoint.trim() === "")) ||
    (status.status === "failed" && typeof status.reason !== "string")
  ) {
    return {
      saved: false,
      reason: "The completed research status is invalid.",
    };
  }
  const route = status.status === "submitted" ? status.endpoint : "";
  const result = savePendingResearchSubmission(
    record.submission,
    route,
    record.submission.studyId,
  );
  if (!result.saved) return { saved: false, reason: result.reason };
  if (record.status.status === "export-only") {
    const transitioned = transitionPendingResearchSubmission(
      record.submission.submissionId,
      "export-only",
    );
    if (!transitioned.saved)
      return { saved: false, reason: transitioned.reason };
  } else if (record.status.status === "failed") {
    const transitioned = transitionPendingResearchSubmission(
      record.submission.submissionId,
      "failed",
      { error: record.status.reason },
    );
    if (!transitioned.saved)
      return { saved: false, reason: transitioned.reason };
  } else if (record.status.status === "submitted") {
    const transitioned = transitionPendingResearchSubmission(
      record.submission.submissionId,
      "submitted",
    );
    if (!transitioned.saved)
      return { saved: false, reason: transitioned.reason };
  }
  return { saved: true };
}

export function loadPendingResearchRecord(): PendingResearchRecord | null {
  const records = listPendingResearchSubmissions();
  const record = records
    .filter((candidate) => candidate.payload.recordType === "core")
    .sort((left, right) =>
      left.submissionId.localeCompare(right.submissionId),
    )[0];
  if (!record) return null;
  const status: ResearchSubmissionStatus =
    record.state === "export-only"
      ? { status: "export-only" }
      : record.state === "submitted"
        ? { status: "submitted", endpoint: record.route }
        : record.state === "retention-expired"
          ? {
              status: "failed",
              reason:
                "The contribution is no longer eligible for retry because its retention period has expired.",
            }
          : {
              status: "failed",
              reason:
                record.lastError ??
                "The contribution is waiting for an explicit retry.",
            };
  return { submission: record.payload, status };
}

export function clearPendingResearchRecord(submissionId?: string): boolean {
  return submissionId
    ? deletePendingResearchSubmission(submissionId)
    : clearAllPendingResearchSubmissions();
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

function validSaveTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function validSavedAnswer(value: unknown, questionId: string): boolean {
  if (!value || typeof value !== "object") return false;
  const candidate = value as {
    questionId?: unknown;
    value?: unknown;
    confidence?: unknown;
    priority?: unknown;
    salienceSkipped?: unknown;
  };
  const valueValid =
    (typeof candidate.value === "number" && Number.isFinite(candidate.value)) ||
    candidate.value === "dont_know" ||
    candidate.value === "prefer_not_to_answer";
  const ratingValid = (rating: unknown) =>
    rating === undefined ||
    (typeof rating === "number" &&
      Number.isInteger(rating) &&
      rating >= 1 &&
      rating <= 5);
  return (
    candidate.questionId === questionId &&
    valueValid &&
    ratingValid(candidate.confidence) &&
    ratingValid(candidate.priority) &&
    (candidate.salienceSkipped === undefined ||
      candidate.salienceSkipped === true)
  );
}

function isQuizSave(value: unknown): value is QuizSave {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<QuizSave>;
  if (
    !Array.isArray(candidate.questions) ||
    candidate.questions.length === 0 ||
    !candidate.answers ||
    typeof candidate.answers !== "object" ||
    Array.isArray(candidate.answers) ||
    typeof candidate.index !== "number" ||
    !Number.isSafeInteger(candidate.index) ||
    candidate.index < 0 ||
    candidate.index >= candidate.questions.length ||
    (candidate.startedAt !== undefined &&
      !validSaveTimestamp(candidate.startedAt)) ||
    (candidate.completedAt !== undefined &&
      !validSaveTimestamp(candidate.completedAt)) ||
    (candidate.research !== undefined &&
      !isResearchSaveContext(candidate.research)) ||
    (candidate.tier !== "blitz" &&
      candidate.tier !== "quick" &&
      candidate.tier !== "moderate" &&
      candidate.tier !== "extensive")
  )
    return false;

  const questionIds = new Set<string>();
  for (const question of candidate.questions) {
    if (
      !question ||
      typeof question !== "object" ||
      typeof question.id !== "string" ||
      question.id.trim().length === 0 ||
      questionIds.has(question.id)
    )
      return false;
    questionIds.add(question.id);
  }

  const answers = candidate.answers as Record<string, unknown>;
  for (const [questionId, answer] of Object.entries(answers)) {
    if (!questionIds.has(questionId) || !validSavedAnswer(answer, questionId))
      return false;
  }

  if (candidate.completedAt !== undefined) {
    for (const questionId of questionIds) {
      if (!validSavedAnswer(answers[questionId], questionId)) return false;
    }
  }
  return true;
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
