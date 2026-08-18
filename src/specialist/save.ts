import type { AnswerMap } from "../types";
import type { ResearchAdministration } from "../research";
import { specialistModuleById, type SpecialistModuleId } from "./index";
const SAVE_PREFIX = "political-judgment-specialist-progress-v1";

export interface SpecialistProgressSave {
  participantId: string;
  administration: ResearchAdministration;
  moduleId: SpecialistModuleId;
  answers: AnswerMap;
  index: number;
  startedAt: string;
}

export type SpecialistSaveResult =
  | { saved: true }
  | { saved: false; reason: string };

function storageKey(
  participantId: string,
  administration: ResearchAdministration,
  moduleId: SpecialistModuleId,
): string {
  return `${SAVE_PREFIX}:${participantId}:${administration}:${moduleId}`;
}

export function saveSpecialistProgress(
  state: SpecialistProgressSave,
): SpecialistSaveResult {
  if (
    !state ||
    typeof state !== "object" ||
    !isSpecialistProgressSave(
      state,
      state.participantId,
      state.administration,
      state.moduleId,
    )
  ) {
    return { saved: false, reason: "The specialist progress is invalid." };
  }
  try {
    localStorage.setItem(
      storageKey(state.participantId, state.administration, state.moduleId),
      JSON.stringify(state),
    );
    return { saved: true };
  } catch {
    return {
      saved: false,
      reason:
        "Your browser storage is full or disabled. Follow-up progress won't be saved, but you can still complete the module.",
    };
  }
}

export function loadSpecialistProgress(
  participantId: string,
  administration: ResearchAdministration,
  moduleId: SpecialistModuleId,
): SpecialistProgressSave | null {
  try {
    const raw = localStorage.getItem(
      storageKey(participantId, administration, moduleId),
    );
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      isSpecialistProgressSave(parsed, participantId, administration, moduleId)
    )
      return parsed;
    clearSpecialistProgress(participantId, administration, moduleId);
    return null;
  } catch {
    clearSpecialistProgress(participantId, administration, moduleId);
    return null;
  }
}

export function clearSpecialistProgress(
  participantId: string,
  administration: ResearchAdministration,
  moduleId: SpecialistModuleId,
): boolean {
  try {
    localStorage.removeItem(
      storageKey(participantId, administration, moduleId),
    );
    return true;
  } catch {
    return false;
  }
}

function validSpecialistTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function isSpecialistProgressSave(
  value: unknown,
  participantId: string,
  administration: ResearchAdministration,
  moduleId: SpecialistModuleId,
): value is SpecialistProgressSave {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SpecialistProgressSave>;
  const module = specialistModuleById.get(moduleId);
  if (
    !module ||
    candidate.participantId !== participantId ||
    candidate.administration !== administration ||
    candidate.moduleId !== moduleId ||
    !candidate.answers ||
    typeof candidate.answers !== "object" ||
    Array.isArray(candidate.answers) ||
    typeof candidate.index !== "number" ||
    !Number.isSafeInteger(candidate.index) ||
    candidate.index < 0 ||
    candidate.index >= module.questions.length ||
    !validSpecialistTimestamp(candidate.startedAt)
  )
    return false;

  const questionIds = new Set<string>();
  for (const question of module.questions) {
    if (questionIds.has(question.id)) return false;
    questionIds.add(question.id);
  }
  for (const [questionId, answer] of Object.entries(candidate.answers)) {
    if (!questionIds.has(questionId) || !answer || typeof answer !== "object")
      return false;
    const saved = answer as {
      questionId?: unknown;
      value?: unknown;
      confidence?: unknown;
      priority?: unknown;
      salienceSkipped?: unknown;
    };
    const valueValid =
      (typeof saved.value === "number" && Number.isFinite(saved.value)) ||
      saved.value === "dont_know" ||
      saved.value === "prefer_not_to_answer";
    const ratingValid = (rating: unknown) =>
      rating === undefined ||
      (typeof rating === "number" &&
        Number.isInteger(rating) &&
        rating >= 1 &&
        rating <= 5);
    if (
      saved.questionId !== questionId ||
      !valueValid ||
      !ratingValid(saved.confidence) ||
      !ratingValid(saved.priority) ||
      (saved.salienceSkipped !== undefined && saved.salienceSkipped !== true)
    )
      return false;
  }
  return true;
}
