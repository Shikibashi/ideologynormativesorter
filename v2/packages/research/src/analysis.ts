import type { RawResponse, ResponseState } from "../../contracts/src/responses";
import { canonicalize } from "./canonical-json";
import type { ResearchSubmissionEnvelope } from "./contract";

export const RESEARCH_ANALYSIS_SCHEMA_VERSION = "research-analysis-v2.phase14.1" as const;
export const SYNTHETIC_DATASET_ID = "synthetic-phase14" as const;

export type AnalysisState = "observed" | "missing" | "structural_not_applicable" | "excluded";
export type AnalysisEvidenceStatus = "NOT_EVALUATED" | "NOT_EVALUABLE" | "PRELIMINARY" | "SUPPORTED" | "CONCERN";

export interface AnalysisItemDefinition {
  readonly id: string;
  readonly scope: "core" | "specialist";
  readonly responseType: "likert5" | "likert7" | "statement-choice";
  readonly moduleId?: string;
  readonly scaleMin?: number;
  readonly scaleMax?: number;
  readonly optionIds?: readonly string[];
}

export interface AnalysisVersionBinding {
  readonly researchSchemaVersion: string;
  readonly researchProtocolVersion: string;
  readonly consentVersion: string;
  readonly contentSchemaVersion: string;
  readonly contentVersion: string;
  readonly contentFingerprint: string;
  readonly scoringVersion: string;
  readonly responseSchemaVersion: string;
  readonly resultSchemaVersion: string;
}

export interface AnalysisValidationIssue {
  readonly code: string;
  readonly path: string;
  readonly message: string;
  readonly submissionId?: string;
}

export interface AnalysisLongRow {
  readonly subjectOrdinal: number;
  readonly scope: "core" | "specialist";
  readonly moduleId: string | null;
  readonly itemId: string;
  readonly responseType: AnalysisItemDefinition["responseType"];
  readonly state: ResponseState | "structural_not_applicable";
  readonly analysisState: AnalysisState;
  readonly rawValue: number | null;
  readonly optionId: string | null;
  readonly contentFingerprint: string;
  readonly contentVersion: string;
  readonly scoringVersion: string;
}

export interface PreparedAnalysisDataset {
  readonly envelopes: readonly ResearchSubmissionEnvelope[];
  readonly rows: readonly AnalysisLongRow[];
  readonly issues: readonly AnalysisValidationIssue[];
  readonly duplicateSubmissionCount: number;
  readonly conflictingSubmissionCount: number;
}

export interface DataQualitySummary {
  readonly acceptedSubmissions: number;
  readonly rejectedSubmissions: number;
  readonly duplicateSubmissions: number;
  readonly conflictingSubmissions: number;
  readonly rows: number;
  readonly observedRows: number;
  readonly missingRows: number;
  readonly structuralNotApplicableRows: number;
  readonly stateCounts: Readonly<Record<string, number>>;
}

export interface ClaimRecord {
  readonly id: string;
  readonly claim: string;
  readonly status: AnalysisEvidenceStatus;
  readonly evidenceSource: "none" | "synthetic-fixture" | "real-consented-dataset";
  readonly eligibleForProductionClaim: false;
  readonly reason: string;
}

const ROOT_KEYS = new Set([
  "researchSchemaVersion", "researchProtocolVersion", "consentVersion", "submissionId",
  "contentSchemaVersion", "contentVersion", "contentFingerprint", "scoringVersion",
  "responseSchemaVersion", "resultSchemaVersion", "consent", "responses",
]);
const CONSENT_KEYS = new Set(["granted", "consentVersion", "consentedAt", "purpose", "identityLinkage"]);
const RESPONSE_KEYS = new Set(["state", "itemId", "responseType", "value", "optionId", "confidence", "priority"]);
const RESPONSE_STATES = new Set<ResponseState>(["answered", "missing", "skipped", "abstained", "refused"]);
const NUMERIC_SCALES = new Set([1, 3, 5]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function issue(code: string, path: string, message: string, submissionId?: string): AnalysisValidationIssue {
  return { code, path, message, ...(submissionId ? { submissionId } : {}) };
}

function checkExactKeys(value: Record<string, unknown>, allowed: ReadonlySet<string>, path: string, issues: AnalysisValidationIssue[], submissionId?: string): void {
  for (const key of Object.keys(value)) if (!allowed.has(key)) issues.push(issue("UNKNOWN_FIELD", `${path}.${key}`, "Field is not part of the v2 analysis input contract", submissionId));
}

function checkVersion(value: unknown, expected: string, path: string, issues: AnalysisValidationIssue[], submissionId?: string): void {
  if (value !== expected) issues.push(issue("VERSION_MISMATCH", path, `Expected ${expected} but received ${String(value)}`, submissionId));
}

function validateResponse(value: unknown, definition: AnalysisItemDefinition, path: string, issues: AnalysisValidationIssue[], submissionId: string): void {
  if (!isRecord(value)) {
    issues.push(issue("INVALID_RESPONSE", path, "Response must be an object", submissionId));
    return;
  }
  checkExactKeys(value, RESPONSE_KEYS, path, issues, submissionId);
  if (value.itemId !== definition.id) issues.push(issue("ITEM_MISMATCH", `${path}.itemId`, "Response item does not match its routed item", submissionId));
  if (typeof value.state !== "string" || !RESPONSE_STATES.has(value.state as ResponseState)) {
    issues.push(issue("INVALID_STATE", `${path}.state`, "Response state is not recognized", submissionId));
    return;
  }
  if (value.state === "answered") {
    if (definition.responseType === "statement-choice") {
      if (value.responseType !== "statement-choice" || typeof value.optionId !== "string" || !(definition.optionIds ?? []).includes(value.optionId)) {
        issues.push(issue("INVALID_STATEMENT_CHOICE", path, "Answered statement-choice response lacks a valid explicit option", submissionId));
      }
    } else if (value.responseType !== definition.responseType || typeof value.value !== "number" || !Number.isInteger(value.value) || value.value < (definition.scaleMin ?? 0) || value.value > (definition.scaleMax ?? 0)) {
      issues.push(issue("INVALID_LIKERT_VALUE", path, "Answered Likert response does not match the canonical scale", submissionId));
    }
  } else if ("value" in value || "optionId" in value || "responseType" in value) {
    issues.push(issue("NON_ANSWERED_PAYLOAD", path, "Non-answered responses may not carry answer fields", submissionId));
  }
  for (const key of ["confidence", "priority"] as const) if (key in value && !NUMERIC_SCALES.has(value[key] as number)) issues.push(issue("INVALID_RESPONSE_META", `${path}.${key}`, "Confidence and priority must be one of 1, 3, or 5", submissionId));
}

export function buildAnalysisItemDefinitions(bundle: {
  readonly items: ReadonlyArray<{
    readonly id: string;
    readonly role: "core" | "specialist";
    readonly responseType: "likert5" | "likert7" | "statement-choice";
    readonly scaleMin?: number;
    readonly scaleMax?: number;
    readonly moduleId?: string;
    readonly options?: readonly { readonly id: string }[];
  }>;
}): readonly AnalysisItemDefinition[] {
  return [...bundle.items]
    .filter((item) => item.role === "core" || item.role === "specialist")
    .map((item) => ({
      id: String(item.id),
      scope: item.role,
      responseType: item.responseType,
      ...(item.moduleId ? { moduleId: String(item.moduleId) } : {}),
      ...(item.scaleMin === undefined ? {} : { scaleMin: item.scaleMin }),
      ...(item.scaleMax === undefined ? {} : { scaleMax: item.scaleMax }),
      ...(item.options ? { optionIds: item.options.map((option) => String(option.id)).sort() } : {}),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function validateSubmissionEnvelope(value: unknown, binding: AnalysisVersionBinding, definitions: readonly AnalysisItemDefinition[]): readonly AnalysisValidationIssue[] {
  const issues: AnalysisValidationIssue[] = [];
  if (!isRecord(value)) return [issue("INVALID_ENVELOPE", "$", "Submission must be an object")];
  const submissionId = typeof value.submissionId === "string" ? value.submissionId : undefined;
  checkExactKeys(value, ROOT_KEYS, "$", issues, submissionId);
  for (const key of ["researchSchemaVersion", "researchProtocolVersion", "consentVersion", "contentSchemaVersion", "contentVersion", "contentFingerprint", "scoringVersion", "responseSchemaVersion", "resultSchemaVersion"] as const) checkVersion(value[key], binding[key], key, issues, submissionId);
  if (typeof value.submissionId !== "string" || value.submissionId.length < 8) issues.push(issue("INVALID_SUBMISSION_ID", "submissionId", "Submission ID must be a non-empty stable identifier", submissionId));
  if (!isRecord(value.consent)) issues.push(issue("INVALID_CONSENT", "consent", "Consent object is required", submissionId));
  else {
    checkExactKeys(value.consent, CONSENT_KEYS, "consent", issues, submissionId);
    if (value.consent.granted !== true || value.consent.consentVersion !== binding.consentVersion || value.consent.purpose !== "instrument-research" || value.consent.identityLinkage !== "none") issues.push(issue("INVALID_CONSENT", "consent", "Consent must be explicit, version-bound, and non-identifying", submissionId));
  }
  if (!isRecord(value.responses)) issues.push(issue("INVALID_RESPONSES", "responses", "Responses object is required", submissionId));
  else {
    if (!Array.isArray(value.responses.core) || !Array.isArray(value.responses.specialist) || !Array.isArray(value.responses.requestedSpecialistModuleIds)) issues.push(issue("INVALID_RESPONSES", "responses", "Core, specialist, and requested module arrays are required", submissionId));
    const byId = new Map(definitions.map((definition) => [definition.id, definition]));
    const seen = new Set<string>();
    for (const scope of ["core", "specialist"] as const) {
      const responses = value.responses[scope];
      if (!Array.isArray(responses)) continue;
      for (const [index, response] of responses.entries()) {
        const itemId = isRecord(response) && typeof response.itemId === "string" ? response.itemId : "";
        const definition = byId.get(itemId);
        if (!definition) issues.push(issue("UNKNOWN_ITEM", `responses.${scope}[${index}]`, "Response item is not in the accepted content registry", submissionId));
        else {
          if (definition.scope !== scope) issues.push(issue("SCOPE_MISMATCH", `responses.${scope}[${index}]`, "Response is routed to the wrong scope", submissionId));
          if (seen.has(itemId)) issues.push(issue("DUPLICATE_ITEM_RESPONSE", `responses.${scope}[${index}]`, "Each item may occur only once per submission", submissionId));
          seen.add(itemId);
          validateResponse(response, definition, `responses.${scope}[${index}]`, issues, submissionId ?? "unknown");
        }
      }
    }
  }
  return issues;
}

export function prepareAnalysisDataset(
  envelopes: readonly unknown[],
  binding: AnalysisVersionBinding,
  definitions: readonly AnalysisItemDefinition[],
): PreparedAnalysisDataset {
  const valid: ResearchSubmissionEnvelope[] = [];
  const rows: AnalysisLongRow[] = [];
  const issues: AnalysisValidationIssue[] = [];
  const byId = new Map<string, ResearchSubmissionEnvelope>();
  let duplicateSubmissionCount = 0;
  let conflictingSubmissionCount = 0;
  for (const value of envelopes) {
    const validation = validateSubmissionEnvelope(value, binding, definitions);
    issues.push(...validation);
    if (validation.length > 0 || !isRecord(value) || typeof value.submissionId !== "string") continue;
    const envelope = value as unknown as ResearchSubmissionEnvelope;
    const prior = byId.get(envelope.submissionId);
    if (prior) {
      if (canonicalize(prior) === canonicalize(envelope)) duplicateSubmissionCount += 1;
      else {
        conflictingSubmissionCount += 1;
        issues.push(issue("CONFLICTING_DUPLICATE_SUBMISSION", "submissionId", "Same submission ID has divergent payloads", envelope.submissionId));
      }
      continue;
    }
    byId.set(envelope.submissionId, envelope);
    valid.push(envelope);
  }
  const definitionById = new Map(definitions.map((definition) => [definition.id, definition]));
  for (const [subjectIndex, envelope] of valid.entries()) {
    const responseById = new Map<string, RawResponse>();
    for (const response of [...envelope.responses.core, ...envelope.responses.specialist]) responseById.set(response.itemId, response);
    const requested = new Set(envelope.responses.requestedSpecialistModuleIds);
    for (const definition of definitions) {
      if (definition.scope === "specialist" && definition.moduleId && !requested.has(definition.moduleId)) {
        rows.push({ subjectOrdinal: subjectIndex + 1, scope: definition.scope, moduleId: definition.moduleId, itemId: definition.id, responseType: definition.responseType, state: "structural_not_applicable", analysisState: "structural_not_applicable", rawValue: null, optionId: null, contentFingerprint: envelope.contentFingerprint, contentVersion: envelope.contentVersion, scoringVersion: envelope.scoringVersion });
        continue;
      }
      const response = responseById.get(definition.id);
      if (!response) {
        issues.push(issue("MISSING_REGISTRY_RESPONSE", `responses.${definition.scope}`, "Accepted export omits an expected item response", envelope.submissionId));
        rows.push({ subjectOrdinal: subjectIndex + 1, scope: definition.scope, moduleId: definition.moduleId ?? null, itemId: definition.id, responseType: definition.responseType, state: "missing", analysisState: "missing", rawValue: null, optionId: null, contentFingerprint: envelope.contentFingerprint, contentVersion: envelope.contentVersion, scoringVersion: envelope.scoringVersion });
        continue;
      }
      const answered = response.state === "answered";
      rows.push({ subjectOrdinal: subjectIndex + 1, scope: definition.scope, moduleId: definition.moduleId ?? null, itemId: definition.id, responseType: definition.responseType, state: response.state, analysisState: answered ? "observed" : "missing", rawValue: answered && "value" in response ? response.value : null, optionId: answered && "optionId" in response ? response.optionId : null, contentFingerprint: envelope.contentFingerprint, contentVersion: envelope.contentVersion, scoringVersion: envelope.scoringVersion });
    }
  }
  void definitionById;
  return Object.freeze({ envelopes: Object.freeze(valid), rows: Object.freeze(rows), issues: Object.freeze(issues), duplicateSubmissionCount, conflictingSubmissionCount });
}

export function summarizeDataQuality(dataset: PreparedAnalysisDataset): DataQualitySummary {
  const stateCounts: Record<string, number> = {};
  for (const row of dataset.rows) stateCounts[row.state] = (stateCounts[row.state] ?? 0) + 1;
  return {
    acceptedSubmissions: dataset.envelopes.length,
    rejectedSubmissions: dataset.issues.filter((entry) => entry.code !== "MISSING_REGISTRY_RESPONSE").filter((entry, index, all) => all.findIndex((candidate) => candidate.submissionId === entry.submissionId) === index && entry.submissionId !== undefined).length,
    duplicateSubmissions: dataset.duplicateSubmissionCount,
    conflictingSubmissions: dataset.conflictingSubmissionCount,
    rows: dataset.rows.length,
    observedRows: dataset.rows.filter((row) => row.analysisState === "observed").length,
    missingRows: dataset.rows.filter((row) => row.analysisState === "missing").length,
    structuralNotApplicableRows: dataset.rows.filter((row) => row.analysisState === "structural_not_applicable").length,
    stateCounts,
  };
}

export function cronbachAlpha(matrix: readonly (readonly (number | null)[])[]): number | null {
  const complete = matrix.filter((row) => row.length > 1 && row.every((value) => value !== null && Number.isFinite(value)));
  if (complete.length < 3 || complete[0].length < 2) return null;
  const numericRows = complete as readonly (readonly number[])[];
  const itemVariances = numericRows[0].map((_, column) => variance(numericRows.map((row) => row[column])));
  const totalVariance = variance(numericRows.map((row) => row.reduce((sum, value) => sum + value, 0)));
  if (totalVariance <= 0) return null;
  return (complete[0].length / (complete[0].length - 1)) * (1 - itemVariances.reduce((sum, value) => sum + value, 0) / totalVariance);
}

function variance(values: readonly number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
}

export function createClaimRegistry(ids: readonly string[], source: "none" | "synthetic-fixture" | "real-consented-dataset"): readonly ClaimRecord[] {
  return ids.map((id) => ({ id, claim: "Empirical measurement claim requires an approved real-data analysis", status: source === "real-consented-dataset" ? "NOT_EVALUATED" : "NOT_EVALUABLE", evidenceSource: source, eligibleForProductionClaim: false, reason: source === "synthetic-fixture" ? "Synthetic data can exercise code paths but cannot establish population or psychometric claims" : "No approved empirical result has been evaluated" }));
}

export function assertNoUnsupportedClaims(claims: readonly ClaimRecord[]): void {
  for (const claim of claims) if (claim.eligibleForProductionClaim !== false || claim.status === "SUPPORTED") throw new Error(`Unsupported empirical claim: ${claim.id}`);
}
