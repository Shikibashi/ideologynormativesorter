import type { AssessmentInput, AssessmentResult, CanonicalContentBundle } from "../../contracts/src";

export const SAVE_SCHEMA_VERSION = "save-v2.phase12.1" as const;
export const SHARE_SCHEMA_VERSION = "share-v2.phase12.1" as const;
export const PRIVATE_SAVE_STORAGE_KEY = "ideology-sorter:v2:saves:current" as const;
export const MAX_PRIVATE_SAVE_BYTES = 2 * 1024 * 1024;
export const MAX_PUBLIC_SHARE_BYTES = 64 * 1024;

export type SaveEnvelopeKind = "private-save" | "private-export";
export type SaveSessionStage =
  | "landing"
  | "core-questionnaire"
  | "specialist-routing"
  | "specialist-questionnaire"
  | "ready-to-score"
  | "results"
  | "error";

export interface SaveSessionProgress {
  readonly coreIndex: number;
  readonly specialistModuleIndex: number;
  readonly specialistItemIndex: number;
}

export interface SaveSession {
  readonly stage: SaveSessionStage;
  readonly currentItemId?: string;
  readonly currentSpecialistModuleId?: string;
  readonly presentationProgress?: SaveSessionProgress;
}

export interface IntegrityMetadata {
  readonly algorithm: "sha256";
  readonly digest: string;
}

export interface PrivateAssessmentSave {
  readonly kind: SaveEnvelopeKind;
  readonly saveSchemaVersion: typeof SAVE_SCHEMA_VERSION;
  readonly appVersion?: string;
  readonly contentVersion: string;
  readonly contentFingerprint: string;
  readonly responseSchemaVersion: string;
  readonly scoringVersion: string;
  readonly session: SaveSession;
  readonly assessmentInput: AssessmentInput;
  readonly cachedResult?: AssessmentResult;
  readonly integrity?: IntegrityMetadata;
}

export type SaveFreshnessKind =
  | "exact_match"
  | "replay_required"
  | "incompatible"
  | "corrupted";

export interface SaveFreshness {
  readonly kind: SaveFreshnessKind;
  readonly reason:
    | "exact_versions"
    | "scoring_version_changed"
    | "content_fingerprint_mismatch"
    | "response_schema_version_mismatch"
    | "save_schema_version_mismatch"
    | "integrity_failed"
    | "integrity_missing"
    | "malformed_json"
    | "missing_save";
  readonly savedContentFingerprint?: string;
  readonly currentContentFingerprint?: string;
}

export type CachedResultDisposition =
  | "not_present"
  | "ignored_and_recomputed"
  | "not_eligible_for_reuse";

export type MigrationLoss = "LOSSLESS" | "LOSSY" | "IMPOSSIBLE";
export type MigrationClassification =
  | "SAFE_TO_MIGRATE"
  | "PARTIALLY_MIGRATABLE"
  | "RESULT_ONLY"
  | "UNRECOVERABLE"
  | "ARCHIVE_ONLY";

export interface SaveMigrationReport {
  readonly sourceFormat: string;
  readonly sourceVersion: string;
  readonly targetVersion: string;
  readonly classification: MigrationClassification;
  readonly loss: MigrationLoss;
  readonly migratedResponses: number;
  readonly droppedResponses: number;
  readonly transformedResponses: number;
  readonly warnings: readonly string[];
  readonly blockingIssues: readonly string[];
}

export interface ParsedSaveResult {
  readonly status: "missing" | "loaded" | "corrupted";
  readonly save?: PrivateAssessmentSave;
  readonly freshness: SaveFreshness;
  readonly warnings: readonly string[];
  readonly error?: string;
}

export interface AssessmentSaveStore {
  save(save: PrivateAssessmentSave): { readonly saved: true } | { readonly saved: false; readonly reason: string };
  load(): ParsedSaveResult;
  remove(): boolean;
}

export interface PersistenceBundleContext {
  readonly bundle: CanonicalContentBundle;
}

export class PersistenceError extends Error {
  readonly code: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(code: string, message: string, details?: Readonly<Record<string, unknown>>) {
    super(message);
    this.name = "PersistenceError";
    this.code = code;
    this.details = details;
  }
}
