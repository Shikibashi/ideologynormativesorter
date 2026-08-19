import type { AssessmentInput } from "../../../contracts/src";
import { canonicalJson, hasForbiddenKeys, utf8ByteLength } from "../canonical-json";
import { sha256Hex } from "../integrity";
import {
  MAX_PRIVATE_SAVE_BYTES,
  SAVE_SCHEMA_VERSION,
  type IntegrityMetadata,
  type ParsedSaveResult,
  type PrivateAssessmentSave,
  type SaveSession,
} from "../types";

const ROOT_KEYS = new Set(["kind", "saveSchemaVersion", "appVersion", "contentVersion", "contentFingerprint", "responseSchemaVersion", "scoringVersion", "session", "assessmentInput", "cachedResult", "integrity"]);
const INPUT_KEYS = new Set(["responseSchemaVersion", "contentFingerprint", "coreResponses", "specialistResponses", "requestedSpecialistModuleIds"]);
const SESSION_KEYS = new Set(["stage", "currentItemId", "currentSpecialistModuleId", "presentationProgress"]);
const INTEGRITY_KEYS = new Set(["algorithm", "digest"]);
const STAGES = new Set(["landing", "core-questionnaire", "specialist-routing", "specialist-questionnaire", "ready-to-score", "results", "error"]);
const RESPONSE_STATES = new Set(["answered", "missing", "skipped", "abstained", "refused"]);

function exactKeys(value: Record<string, unknown>, allowed: Set<string>): boolean {
  return Object.keys(value).every((key) => allowed.has(key));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validResponse(value: unknown): boolean {
  if (!isRecord(value) || typeof value.itemId !== "string" || typeof value.state !== "string" || !RESPONSE_STATES.has(value.state)) return false;
  if (value.state !== "answered") return exactKeys(value, new Set(["state", "itemId"]));
  if (value.responseType === "statement-choice") return typeof value.optionId === "string" && exactKeys(value, new Set(["state", "itemId", "responseType", "optionId", "confidence", "priority"]));
  if (value.responseType !== "likert5" && value.responseType !== "likert7") return false;
  return typeof value.value === "number" && Number.isFinite(value.value) && exactKeys(value, new Set(["state", "itemId", "responseType", "value", "confidence", "priority"]));
}

function validInput(value: unknown): value is AssessmentInput {
  if (!isRecord(value) || !exactKeys(value, INPUT_KEYS) || typeof value.responseSchemaVersion !== "string" || typeof value.contentFingerprint !== "string" || !Array.isArray(value.coreResponses) || !Array.isArray(value.requestedSpecialistModuleIds)) return false;
  if (value.specialistResponses !== undefined && !Array.isArray(value.specialistResponses)) return false;
  if (value.coreResponses.some((response) => !validResponse(response)) || (value.specialistResponses ?? []).some((response) => !validResponse(response))) return false;
  if (value.requestedSpecialistModuleIds.some((moduleId) => typeof moduleId !== "string")) return false;
  return true;
}

function validSession(value: unknown): value is SaveSession {
  if (!isRecord(value) || !exactKeys(value, SESSION_KEYS) || typeof value.stage !== "string" || !STAGES.has(value.stage)) return false;
  if (value.currentItemId !== undefined && typeof value.currentItemId !== "string") return false;
  if (value.currentSpecialistModuleId !== undefined && typeof value.currentSpecialistModuleId !== "string") return false;
  if (value.presentationProgress === undefined) return true;
  if (!isRecord(value.presentationProgress) || !exactKeys(value.presentationProgress, new Set(["coreIndex", "specialistModuleIndex", "specialistItemIndex"]))) return false;
  const progress = value.presentationProgress;
  return ["coreIndex", "specialistModuleIndex", "specialistItemIndex"].every((key) => typeof progress[key] === "number" && Number.isSafeInteger(progress[key]) && progress[key] >= 0);
}

function validIntegrity(value: unknown): value is IntegrityMetadata {
  return isRecord(value) && exactKeys(value, INTEGRITY_KEYS) && value.algorithm === "sha256" && typeof value.digest === "string" && /^[a-f0-9]{64}$/u.test(value.digest);
}

function withoutIntegrity(value: PrivateAssessmentSave): Omit<PrivateAssessmentSave, "integrity"> {
  return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "integrity")) as Omit<PrivateAssessmentSave, "integrity">;
}

function verifyEnvelope(value: unknown): value is PrivateAssessmentSave {
  if (!isRecord(value) || !exactKeys(value, ROOT_KEYS) || (value.kind !== "private-save" && value.kind !== "private-export") || value.saveSchemaVersion !== SAVE_SCHEMA_VERSION || typeof value.contentVersion !== "string" || typeof value.contentFingerprint !== "string" || typeof value.responseSchemaVersion !== "string" || typeof value.scoringVersion !== "string" || !validSession(value.session) || !validInput(value.assessmentInput)) return false;
  if (value.appVersion !== undefined && typeof value.appVersion !== "string") return false;
  if (value.cachedResult !== undefined && !isRecord(value.cachedResult)) return false;
  return value.integrity === undefined || validIntegrity(value.integrity);
}

export function createPrivateAssessmentSave(input: {
  readonly kind?: "private-save" | "private-export";
  readonly appVersion?: string;
  readonly contentVersion: string;
  readonly contentFingerprint: string;
  readonly responseSchemaVersion: string;
  readonly scoringVersion: string;
  readonly session: SaveSession;
  readonly assessmentInput: AssessmentInput;
  readonly cachedResult?: PrivateAssessmentSave["cachedResult"];
}): PrivateAssessmentSave {
  const base = {
    kind: input.kind ?? "private-save",
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    ...(input.appVersion === undefined ? {} : { appVersion: input.appVersion }),
    contentVersion: input.contentVersion,
    contentFingerprint: input.contentFingerprint,
    responseSchemaVersion: input.responseSchemaVersion,
    scoringVersion: input.scoringVersion,
    session: input.session,
    assessmentInput: input.assessmentInput,
    ...(input.cachedResult === undefined ? {} : { cachedResult: input.cachedResult }),
  } satisfies Omit<PrivateAssessmentSave, "integrity">;
  const save = { ...base, integrity: { algorithm: "sha256", digest: sha256Hex(canonicalJson(base)) } } satisfies PrivateAssessmentSave;
  if (!verifyEnvelope(save)) throw new Error("Unable to create a valid private assessment save");
  if (utf8ByteLength(canonicalJson(save)) > MAX_PRIVATE_SAVE_BYTES) throw new Error("Private assessment save exceeds the size limit");
  return save;
}

export function serializePrivateAssessmentSave(value: PrivateAssessmentSave): string {
  if (!verifyEnvelope(value)) throw new Error("Invalid private assessment save");
  const base = withoutIntegrity(value);
  const normalized = { ...base, integrity: { algorithm: "sha256", digest: sha256Hex(canonicalJson(base)) } } satisfies PrivateAssessmentSave;
  const serialized = canonicalJson(normalized);
  if (utf8ByteLength(serialized) > MAX_PRIVATE_SAVE_BYTES) throw new Error("Private assessment save exceeds the size limit");
  return serialized;
}

export function parsePrivateAssessmentSave(serialized: string): ParsedSaveResult {
  if (utf8ByteLength(serialized) > MAX_PRIVATE_SAVE_BYTES) return { status: "corrupted", freshness: { kind: "corrupted", reason: "malformed_json" }, warnings: [], error: "The private save exceeds the supported size limit." };
  let parsed: unknown;
  try { parsed = JSON.parse(serialized); } catch { return { status: "corrupted", freshness: { kind: "corrupted", reason: "malformed_json" }, warnings: [], error: "The private save is not valid JSON." }; }
  if (hasForbiddenKeys(parsed) || !verifyEnvelope(parsed)) return { status: "corrupted", freshness: { kind: "corrupted", reason: "malformed_json" }, warnings: [], error: "The private save schema is invalid or contains unsupported fields." };
  if (parsed.integrity) {
    const expected = sha256Hex(canonicalJson(withoutIntegrity(parsed)));
    if (parsed.integrity.digest !== expected) return { status: "corrupted", freshness: { kind: "corrupted", reason: "integrity_failed" }, warnings: [], error: "The private save integrity check failed." };
    return { status: "loaded", save: parsed, freshness: { kind: "exact_match", reason: "exact_versions" }, warnings: [] };
  }
  return { status: "loaded", save: parsed, freshness: { kind: "replay_required", reason: "integrity_missing" }, warnings: ["This save has no integrity digest and will be recomputed before use."] };
}

export function validatePrivateSaveShape(value: unknown): value is PrivateAssessmentSave {
  return !hasForbiddenKeys(value) && verifyEnvelope(value);
}
