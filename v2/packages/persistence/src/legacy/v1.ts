import type { AssessmentInput, CanonicalContentBundle, ItemRecord, RawResponse, StatementOptionId } from "../../../contracts/src";
import type { MigrationClassification, MigrationLoss, SaveMigrationReport } from "../types";

export const LEGACY_V1_FORMATS = Object.freeze({
  quizSave: "ideology-quiz-save",
  specialistProgress: "political-judgment-specialist-progress-v1:<participant>:<administration>:<module>",
  answerShare: "#r=<base64url-v2-or-v3-payload>",
  compareShare: "#r=<payload>&c=<payload>",
  pendingResearch: "political-judgment-pending-research-record-v1",
  participantIdentity: "political-judgment-research-participant-v1:<study>",
  displayPreferences: "political-judgment-*-v1",
} as const);

interface LegacyAnswer {
  readonly questionId: string;
  readonly value: number | "dont_know" | "prefer_not_to_answer" | string;
  readonly confidence?: number;
  readonly priority?: number;
  readonly salienceSkipped?: boolean;
}

interface LegacyQuizSave {
  readonly questions: readonly unknown[];
  readonly answers: Readonly<Record<string, LegacyAnswer>>;
  readonly index: number;
  readonly tier: string;
}

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }

function parseLegacyAnswer(value: unknown, questionId: string): LegacyAnswer | null {
  if (!isRecord(value) || value.questionId !== questionId || (typeof value.value !== "number" && typeof value.value !== "string")) return null;
  return { questionId, value: value.value as LegacyAnswer["value"], ...(typeof value.confidence === "number" ? { confidence: value.confidence } : {}), ...(typeof value.priority === "number" ? { priority: value.priority } : {}), ...(value.salienceSkipped === true ? { salienceSkipped: true } : {}) };
}

function parseLegacyQuizSave(value: unknown): LegacyQuizSave | null {
  if (!isRecord(value) || !Array.isArray(value.questions) || !isRecord(value.answers) || typeof value.index !== "number" || typeof value.tier !== "string") return null;
  const answers: Record<string, LegacyAnswer> = {};
  for (const [questionId, answer] of Object.entries(value.answers)) {
    const parsed = parseLegacyAnswer(answer, questionId);
    if (!parsed) return null;
    answers[questionId] = parsed;
  }
  return { questions: value.questions, answers, index: value.index, tier: value.tier };
}

function asResponse(item: ItemRecord, answer: LegacyAnswer): { response?: RawResponse; transformed: boolean; issue?: string } {
  if (answer.salienceSkipped === true) return { transformed: false, issue: `${answer.questionId}: legacy salienceSkipped cannot be reconstructed safely` };
  if (answer.value === "dont_know") return { response: { state: "abstained", itemId: item.id }, transformed: true };
  if (answer.value === "prefer_not_to_answer") return { response: { state: "refused", itemId: item.id }, transformed: true };
  if (item.responseType === "statement-choice") {
    if (typeof answer.value === "string" && item.options.some((option) => option.id === answer.value)) return { response: { state: "answered", itemId: item.id, responseType: "statement-choice", optionId: answer.value as StatementOptionId, ...(answer.confidence === undefined ? {} : { confidence: answer.confidence as 1 | 3 | 5 }), ...(answer.priority === undefined ? {} : { priority: answer.priority as 1 | 3 | 5 }) }, transformed: false };
    return { transformed: false, issue: `${answer.questionId}: statement-choice response has no explicit option mapping` };
  }
  if (typeof answer.value !== "number" || answer.value < item.scaleMin || answer.value > item.scaleMax) return { transformed: false, issue: `${answer.questionId}: value is outside the canonical response scale` };
  return { response: { state: "answered", itemId: item.id, responseType: item.responseType, value: answer.value, ...(answer.confidence === undefined ? {} : { confidence: answer.confidence as 1 | 3 | 5 }), ...(answer.priority === undefined ? {} : { priority: answer.priority as 1 | 3 | 5 }) }, transformed: false };
}

function report(sourceFormat: string, classification: MigrationClassification, loss: MigrationLoss, migratedResponses: number, droppedResponses: number, transformedResponses: number, warnings: readonly string[], blockingIssues: readonly string[]): SaveMigrationReport {
  return { sourceFormat, sourceVersion: "v1", targetVersion: "v2-input-v1", classification, loss, migratedResponses, droppedResponses, transformedResponses, warnings, blockingIssues };
}

export interface LegacyMigrationResult {
  readonly input?: AssessmentInput;
  readonly report: SaveMigrationReport;
}

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    if (typeof globalThis.atob !== "function") return null;
    return new TextDecoder().decode(Uint8Array.from(globalThis.atob(padded), (character) => character.charCodeAt(0)));
  } catch {
    return null;
  }
}

function legacyAnswersFromShare(encoded: string): Readonly<Record<string, LegacyAnswer>> | null {
  const decodedText = decodeBase64Url(encoded);
  if (!decodedText) return null;
  let decoded: unknown;
  try { decoded = JSON.parse(decodedText); } catch { return null; }
  const entries = Array.isArray(decoded) ? decoded : isRecord(decoded) && (decoded.v === 2 || decoded.v === 3) && Array.isArray(decoded.a) ? decoded.a : null;
  if (!entries) return null;
  const answers: Record<string, LegacyAnswer> = {};
  for (const entry of entries) {
    if (!Array.isArray(entry) || typeof entry[0] !== "string") return null;
    const answer = parseLegacyAnswer({ questionId: entry[0], value: entry[1], confidence: entry[2], priority: entry[3], salienceSkipped: entry[4] }, entry[0]);
    if (!answer) return null;
    answers[entry[0]] = answer;
  }
  return answers;
}

export function migrateLegacyQuizSave(value: unknown, bundle: CanonicalContentBundle): LegacyMigrationResult {
  const legacy = parseLegacyQuizSave(value);
  if (!legacy) return { report: report(LEGACY_V1_FORMATS.quizSave, "UNRECOVERABLE", "IMPOSSIBLE", 0, 0, 0, [], ["The v1 quiz save shape is invalid."]) };
  const itemById = new Map(bundle.items.filter((item) => item.role === "core").map((item) => [String(item.id), item]));
  const responses: RawResponse[] = [];
  const warnings: string[] = [];
  let transformed = 0;
  for (const answer of Object.values(legacy.answers)) {
    const item = itemById.get(answer.questionId);
    if (!item) { warnings.push(`${answer.questionId}: no exact canonical v2 item ID`); continue; }
    const converted = asResponse(item, answer);
    if (converted.response) { responses.push(converted.response); if (converted.transformed) transformed += 1; } else if (converted.issue) warnings.push(converted.issue);
  }
  const dropped = Object.keys(legacy.answers).length - responses.length;
  const lossy = transformed > 0 || warnings.length > 0;
  return {
    input: { responseSchemaVersion: bundle.metadata.responseSchemaVersion, contentFingerprint: bundle.metadata.contentFingerprint, coreResponses: responses, specialistResponses: [], requestedSpecialistModuleIds: [] },
    report: report(LEGACY_V1_FORMATS.quizSave, lossy ? "PARTIALLY_MIGRATABLE" : "SAFE_TO_MIGRATE", lossy ? "LOSSY" : "LOSSLESS", responses.length, dropped, transformed, warnings, []),
  };
}

export function migrateLegacyAnswerShare(encoded: string, bundle: CanonicalContentBundle): LegacyMigrationResult {
  const answers = legacyAnswersFromShare(encoded);
  if (!answers) return { report: report(LEGACY_V1_FORMATS.answerShare, "UNRECOVERABLE", "IMPOSSIBLE", 0, 0, 0, [], ["The v1 answer share could not be decoded."]) };
  const migrated = migrateLegacyQuizSave({ questions: [], answers, index: 0, tier: "moderate" }, bundle);
  return { input: migrated.input, report: { ...migrated.report, sourceFormat: LEGACY_V1_FORMATS.answerShare } };
}

export function migrateLegacySpecialistProgress(value: unknown, bundle: CanonicalContentBundle): LegacyMigrationResult {
  if (!isRecord(value) || typeof value.moduleId !== "string" || !isRecord(value.answers) || typeof value.index !== "number") return { report: report(LEGACY_V1_FORMATS.specialistProgress, "UNRECOVERABLE", "IMPOSSIBLE", 0, 0, 0, [], ["The v1 specialist progress shape is invalid."]) };
  const module = bundle.specialistModules.find((entry) => String(entry.id) === value.moduleId);
  if (!module) return { report: report(LEGACY_V1_FORMATS.specialistProgress, "PARTIALLY_MIGRATABLE", "IMPOSSIBLE", 0, Object.keys(value.answers).length, 0, [], [`${value.moduleId}: no exact canonical v2 specialist module ID`]) };
  const itemById = new Map(bundle.items.filter((item) => item.role === "specialist" && String(item.moduleId) === value.moduleId).map((item) => [String(item.id), item]));
  const responses: RawResponse[] = [];
  const warnings: string[] = ["Legacy participant identity is not migrated into v2 session state."];
  let transformed = 0;
  for (const [questionId, rawAnswer] of Object.entries(value.answers)) {
    const answer = parseLegacyAnswer(rawAnswer, questionId);
    const item = itemById.get(questionId);
    if (!answer || !item) { warnings.push(`${questionId}: no exact specialist response mapping`); continue; }
    const converted = asResponse(item, answer);
    if (converted.response) { responses.push(converted.response); if (converted.transformed) transformed += 1; } else if (converted.issue) warnings.push(converted.issue);
  }
  const dropped = Object.keys(value.answers).length - responses.length;
  const lossy = transformed > 0 || warnings.length > 1;
  return {
    input: { responseSchemaVersion: bundle.metadata.responseSchemaVersion, contentFingerprint: bundle.metadata.contentFingerprint, coreResponses: [], specialistResponses: responses, requestedSpecialistModuleIds: [module.id] },
    report: report(LEGACY_V1_FORMATS.specialistProgress, lossy ? "PARTIALLY_MIGRATABLE" : "SAFE_TO_MIGRATE", lossy ? "LOSSY" : "LOSSLESS", responses.length, dropped, transformed, warnings, []),
  };
}

export function classifyLegacyResultOnly(value: unknown): SaveMigrationReport {
  return isRecord(value) && ("result" in value || "profiles" in value || "labels" in value) ? report("v1-result-only", "RESULT_ONLY", "IMPOSSIBLE", 0, 0, 0, ["Result-only v1 data cannot be replayed through v2 scoring."], []) : report("unknown-v1-payload", "UNRECOVERABLE", "IMPOSSIBLE", 0, 0, 0, [], ["The legacy payload is not a recognized v1 assessment format."]);
}
