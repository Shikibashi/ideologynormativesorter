/**
 * Versioned, read-only evidence envelope for browser-collected research.
 *
 * This module is deliberately independent from the production scorer and from
 * submission transport.  Canonical registry and serialization metadata are
 * copied into the envelope; browser result values live only under
 * `observations` and are never authority records.
 */

import {
  CANONICAL_JSON_VERSION,
  type CanonicalSerializationSchema,
} from "../domain/canonicalSerialization";
import type { CanonicalRegistry } from "../domain/registry";

export const RESEARCH_CONTRACT_VERSION = "research-contract-v1" as const;

export interface ResearchContractSerializationMetadata {
  readonly version: string;
  readonly fingerprint: string;
  readonly schema?: CanonicalSerializationSchema;
}

export interface ResearchContractSchemaMetadata {
  readonly version: string;
  readonly fingerprint: string;
}

export interface ResearchContractCohortMetadata {
  readonly version: string;
  readonly fingerprint: string;
}

export interface ResearchContractStudy {
  readonly studyId: string;
  readonly cohortId?: string;
  readonly waveId?: string;
}

export interface ResearchContractForm {
  readonly formId: string;
  readonly formVersion: string;
  readonly fingerprint: string;
  /** Immutable route/cohort projection used by clean browser submissions. */
  readonly contractRoute?: string;
  readonly cohort?: string;
}

/** Provenance identifies the browser as the producer of observed values. */
export interface ResearchContractProvenance {
  readonly source: "browser";
  readonly capturedAt: string;
  readonly surface?: string;
  readonly runtimeVersion?: string;
}

/** Consent is intentionally compatible with the existing research consent shape. */
export interface ResearchContractConsent {
  readonly consentedAt: string;
  readonly consentVersion?: string;
  readonly version?: string;
  readonly status?: "consented";
  readonly [key: string]: unknown;
}

export interface ResearchContractRefusal {
  readonly reason: string;
  readonly refusedAt?: string;
  readonly recordedAt?: string;
  readonly status?: "refused";
  readonly [key: string]: unknown;
}

/** A result value produced by the browser, not a canonical or scoring value. */
export interface ResearchObservation<T = unknown> {
  readonly kind: "browser-observation";
  readonly source: "browser";
  readonly value: T;
  readonly observedAt?: string;
}

export type ResearchObservationMap = Readonly<
  Record<string, ResearchObservation>
>;

export interface ResearchContractSnapshotInput {
  readonly registry: CanonicalRegistry;
  readonly serialization: ResearchContractSerializationMetadata;
  readonly schema: ResearchContractSchemaMetadata;
  readonly cohort: ResearchContractCohortMetadata;
  readonly study: ResearchContractStudy;
  readonly form: ResearchContractForm;
  readonly provenance: ResearchContractProvenance;
  readonly consent?: ResearchContractConsent | null;
  readonly refusal?: ResearchContractRefusal | null;
  readonly observations: ResearchObservationMap;
}

export interface ResearchContractSnapshot {
  readonly contractVersion: typeof RESEARCH_CONTRACT_VERSION;
  readonly manifestSchemaVersion: string;
  readonly manifestVersion: string;
  readonly manifestFingerprint: string;
  readonly serializationVersion: string;
  readonly serializationFingerprint: string;
  readonly schemaVersion: string;
  readonly schemaFingerprint: string;
  readonly cohortVersion: string;
  readonly cohortFingerprint: string;
  readonly study: ResearchContractStudy;
  readonly form: ResearchContractForm;
  readonly provenance: ResearchContractProvenance;
  readonly consent: ResearchContractConsent | null;
  readonly refusal: ResearchContractRefusal | null;
  readonly observations: ResearchObservationMap;
  readonly versionBundle: ResearchContractVersionBundle;
}

export interface ResearchContractVersionBundle {
  readonly manifestSchemaVersion: string;
  readonly manifestVersion: string;
  readonly serializationVersion: string;
  readonly schemaVersion: string;
  readonly cohortVersion: string;
}

export type ResearchContractValidationCode =
  | "invalid-shape"
  | "invalid-version"
  | "mixed-version"
  | "missing-fingerprint"
  | "missing-provenance"
  | "invalid-consent"
  | "invalid-refusal"
  | "production-mutation"
  | "context-leakage"
  | "invalid-observation"
  | "unexpected-field";

export interface ResearchContractValidationIssue {
  readonly code: ResearchContractValidationCode;
  readonly message: string;
  readonly path?: string;
}

export interface ResearchContractValidationResult {
  readonly valid: boolean;
  readonly ok: boolean;
  readonly issues: readonly ResearchContractValidationIssue[];
}

const PRODUCTION_MUTATION_KEYS = new Set([
  "production",
  "productionMutation",
  "productionMutations",
  "productionOverride",
  "productionOverrides",
  "registryMutation",
  "registryMutations",
  "registryPatch",
  "registryPatches",
  "registryOverride",
  "registryOverrides",
  "scoringMutation",
  "scoringMutations",
  "scoringOverride",
  "scoringOverrides",
  "canonicalMutation",
  "canonicalMutations",
  "canonicalPatch",
  "canonicalPatches",
  "canonicalOverride",
  "canonicalOverrides",
  "promoteToProduction",
  "promotedToProduction",
]);

const CONTEXT_KEYS = new Set([
  "context",
  "contexts",
  "contextId",
  "contextIds",
  "contextRef",
  "contextRefs",
  "contextReference",
  "contextReferences",
]);
const TOP_LEVEL_KEYS = new Set([
  "contractVersion",
  "manifestSchemaVersion",
  "manifestVersion",
  "manifestFingerprint",
  "serializationVersion",
  "serializationFingerprint",
  "schemaVersion",
  "schemaFingerprint",
  "cohortVersion",
  "cohortFingerprint",
  "versionBundle",
  "study",
  "form",
  "provenance",
  "consent",
  "refusal",
  "observations",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validTimestamp(value: unknown): value is string {
  if (!nonEmptyString(value)) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function issue(
  issues: ResearchContractValidationIssue[],
  code: ResearchContractValidationCode,
  message: string,
  path?: string,
): void {
  issues.push({ code, message, ...(path ? { path } : {}) });
}

function scanForbiddenKeys(
  value: unknown,
  path: string,
  issues: ResearchContractValidationIssue[],
  active: Set<object>,
): void {
  if (!value || typeof value !== "object") return;
  if (active.has(value)) {
    issue(issues, "invalid-shape", "Snapshot contains a cyclic value", path);
    return;
  }
  active.add(value);
  try {
    if (Array.isArray(value)) {
      value.forEach((entry, index) =>
        scanForbiddenKeys(entry, `${path}[${index}]`, issues, active),
      );
      return;
    }
    for (const [key, nested] of Object.entries(value)) {
      const nestedPath = path ? `${path}.${key}` : key;
      if (
        PRODUCTION_MUTATION_KEYS.has(key) ||
        /(?:mutation|override|patch|promot)/i.test(key) ||
        /^production(?:$|[A-Z_])/u.test(key)
      ) {
        issue(
          issues,
          "production-mutation",
          `Production mutation field ${key} is not allowed`,
          nestedPath,
        );
      }
      if (
        CONTEXT_KEYS.has(key) ||
        /^context(?:$|[A-Z_])/u.test(key) ||
        key === "publicRole"
      ) {
        issue(
          issues,
          "context-leakage",
          `Context field ${key} cannot appear in a research contract snapshot`,
          nestedPath,
        );
      }
      if (
        (key === "publicRoleStatus" ||
          key === "publicRole" ||
          key === "role" ||
          key === "kind") &&
        nested === "context"
      ) {
        issue(
          issues,
          "context-leakage",
          "Context-role values cannot appear in a research contract snapshot",
          nestedPath,
        );
      }
      scanForbiddenKeys(nested, nestedPath, issues, active);
    }
  } finally {
    active.delete(value);
  }
}

function cloneValue<T>(value: T, active = new Map<object, unknown>()): T {
  if (!value || typeof value !== "object") return value;
  const existing = active.get(value);
  if (existing !== undefined) return existing as T;
  if (Array.isArray(value)) {
    const result: unknown[] = [];
    active.set(value, result);
    for (const entry of value) result.push(cloneValue(entry, active));
    return result as T;
  }
  const result: Record<string, unknown> = {};
  active.set(value, result);
  for (const [key, nested] of Object.entries(value)) {
    result[key] = cloneValue(nested, active);
  }
  return result as T;
}

function deepFreeze<T>(value: T, active = new Set<object>()): T {
  if (!value || typeof value !== "object" || active.has(value)) return value;
  active.add(value);
  Object.freeze(value);
  if (Array.isArray(value)) {
    value.forEach((entry) => deepFreeze(entry, active));
  } else {
    Object.values(value as Record<string, unknown>).forEach((entry) =>
      deepFreeze(entry, active),
    );
  }
  return value;
}

/**
 * Build an immutable snapshot from the canonical registry and versioned
 * serialization metadata.  The factory fails closed rather than returning an
 * envelope which the validator would reject.
 */
export function createResearchContractSnapshot(
  input: ResearchContractSnapshotInput,
): ResearchContractSnapshot {
  const manifestMetadata = input.registry.manifest.metadata;
  if (!nonEmptyString(manifestMetadata.fingerprint)) {
    throw new Error(
      "Cannot create a research contract without a manifest fingerprint",
    );
  }
  const snapshot = cloneValue({
    contractVersion: RESEARCH_CONTRACT_VERSION,
    manifestSchemaVersion: manifestMetadata.schemaVersion,
    manifestVersion: manifestMetadata.version,
    manifestFingerprint: manifestMetadata.fingerprint,
    serializationVersion: input.serialization.version,
    serializationFingerprint: input.serialization.fingerprint,
    schemaVersion: input.schema.version,
    schemaFingerprint: input.schema.fingerprint,
    cohortVersion: input.cohort.version,
    cohortFingerprint: input.cohort.fingerprint,
    study: input.study,
    form: input.form,
    provenance: input.provenance,
    consent: input.consent ?? null,
    refusal: input.refusal ?? null,
    observations: input.observations,
    versionBundle: {
      manifestSchemaVersion: manifestMetadata.schemaVersion,
      manifestVersion: manifestMetadata.version,
      serializationVersion: input.serialization.version,
      schemaVersion: input.schema.version,
      cohortVersion: input.cohort.version,
    },
  }) as ResearchContractSnapshot;
  const frozen = deepFreeze(snapshot);
  const result = validateResearchContractSnapshot(frozen);
  if (!result.valid) {
    throw new Error(
      `Invalid research contract snapshot: ${result.issues
        .map((entry) => `${entry.code}${entry.path ? ` (${entry.path})` : ""}`)
        .join(", ")}`,
    );
  }
  return frozen;
}

/** Validate a snapshot without consulting or mutating production scoring. */
export function validateResearchContractSnapshot(
  value: unknown,
): ResearchContractValidationResult {
  const issues: ResearchContractValidationIssue[] = [];
  if (!isRecord(value)) {
    issue(
      issues,
      "invalid-shape",
      "Research contract snapshot must be an object",
    );
    return { valid: false, ok: false, issues };
  }
  for (const key of Object.keys(value)) {
    if (!TOP_LEVEL_KEYS.has(key)) {
      issue(
        issues,
        "unexpected-field",
        `Top-level field ${key} is not part of the research contract`,
        key,
      );
    }
  }

  if (value.contractVersion !== RESEARCH_CONTRACT_VERSION) {
    issue(
      issues,
      "invalid-version",
      `Expected contractVersion ${RESEARCH_CONTRACT_VERSION}`,
      "contractVersion",
    );
  }

  const requiredVersionFields = [
    "manifestSchemaVersion",
    "manifestVersion",
    "serializationVersion",
    "schemaVersion",
    "cohortVersion",
  ] as const;
  for (const field of requiredVersionFields) {
    if (!nonEmptyString(value[field])) {
      issue(
        issues,
        "mixed-version",
        `${field} must be a non-empty version`,
        field,
      );
    }
  }
  if (value.serializationVersion !== CANONICAL_JSON_VERSION) {
    issue(
      issues,
      "mixed-version",
      `serializationVersion must be ${CANONICAL_JSON_VERSION}`,
      "serializationVersion",
    );
  }
  if (!isRecord(value.versionBundle)) {
    issue(
      issues,
      "mixed-version",
      "versionBundle is required to bind all metadata versions",
      "versionBundle",
    );
  } else {
    for (const field of [
      "manifestSchemaVersion",
      "manifestVersion",
      "serializationVersion",
      "schemaVersion",
      "cohortVersion",
    ] as const) {
      if (value.versionBundle[field] !== value[field]) {
        issue(
          issues,
          "mixed-version",
          `${field} disagrees with versionBundle`,
          field,
        );
      }
    }
  }

  const fingerprintFields = [
    "manifestFingerprint",
    "serializationFingerprint",
    "schemaFingerprint",
    "cohortFingerprint",
  ] as const;
  for (const field of fingerprintFields) {
    if (!nonEmptyString(value[field])) {
      issue(issues, "missing-fingerprint", `${field} is required`, field);
    }
  }

  if (!isRecord(value.study) || !nonEmptyString(value.study.studyId)) {
    issue(issues, "invalid-shape", "study.studyId is required", "study");
  }
  if (
    !isRecord(value.form) ||
    !nonEmptyString(value.form.formId) ||
    !nonEmptyString(value.form.formVersion) ||
    !nonEmptyString(value.form.fingerprint)
  ) {
    issue(issues, "invalid-shape", "form metadata is incomplete", "form");
  }
  if (
    isRecord(value.form) &&
    ((value.form.contractRoute !== undefined &&
      !nonEmptyString(value.form.contractRoute)) ||
      (value.form.cohort !== undefined && !nonEmptyString(value.form.cohort)))
  ) {
    issue(
      issues,
      "invalid-shape",
      "form route/cohort projections must be non-empty when present",
      "form",
    );
  }

  if (!isRecord(value.provenance)) {
    issue(
      issues,
      "missing-provenance",
      "Browser provenance is required",
      "provenance",
    );
  } else {
    if (value.provenance.source !== "browser") {
      issue(
        issues,
        "missing-provenance",
        "provenance.source must be browser",
        "provenance.source",
      );
    }
    if (!validTimestamp(value.provenance.capturedAt)) {
      issue(
        issues,
        "missing-provenance",
        "provenance.capturedAt must be an ISO timestamp",
        "provenance.capturedAt",
      );
    }
  }

  const consent = value.consent;
  const refusal = value.refusal;
  if (consent !== null && consent !== undefined) {
    if (
      !isRecord(consent) ||
      !validTimestamp(consent.consentedAt) ||
      (!nonEmptyString(consent.consentVersion) &&
        !nonEmptyString(consent.version))
    ) {
      issue(
        issues,
        "invalid-consent",
        "Consent metadata is incomplete",
        "consent",
      );
    }
  }
  if (refusal !== null && refusal !== undefined) {
    if (
      !isRecord(refusal) ||
      !nonEmptyString(refusal.reason) ||
      (!validTimestamp(refusal.refusedAt) &&
        !validTimestamp(refusal.recordedAt))
    ) {
      issue(
        issues,
        "invalid-refusal",
        "Refusal metadata is incomplete",
        "refusal",
      );
    }
  }
  if (
    (consent === null || consent === undefined) ===
    (refusal === null || refusal === undefined)
  ) {
    issue(
      issues,
      "invalid-consent",
      "Exactly one of consent or refusal is required",
    );
  }

  if (!isRecord(value.observations)) {
    issue(
      issues,
      "invalid-observation",
      "observations must be an object",
      "observations",
    );
  } else {
    for (const [field, observation] of Object.entries(value.observations)) {
      if (
        !isRecord(observation) ||
        observation.kind !== "browser-observation" ||
        observation.source !== "browser" ||
        !("value" in observation)
      ) {
        issue(
          issues,
          "invalid-observation",
          "Every browser result must be explicitly marked as an observation",
          `observations.${field}`,
        );
      }
      if (
        isRecord(observation) &&
        observation.observedAt !== undefined &&
        !validTimestamp(observation.observedAt)
      ) {
        issue(
          issues,
          "invalid-observation",
          "observation.observedAt must be an ISO timestamp",
          `observations.${field}.observedAt`,
        );
      }
    }
  }

  scanForbiddenKeys(value, "", issues, new Set<object>());
  const uniqueIssues = issues.filter(
    (entry, index) =>
      issues.findIndex(
        (candidate) =>
          candidate.code === entry.code &&
          candidate.path === entry.path &&
          candidate.message === entry.message,
      ) === index,
  );
  return {
    valid: uniqueIssues.length === 0,
    ok: uniqueIssues.length === 0,
    issues: uniqueIssues,
  };
}

export function isValidResearchContractSnapshot(
  value: unknown,
): value is ResearchContractSnapshot {
  return validateResearchContractSnapshot(value).valid;
}
