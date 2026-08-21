import {
  computeContentFingerprint,
  validateContentSchema,
  validateContentSemantics,
} from "../../../content/src";
import type { CanonicalContentBundle } from "../../../contracts/src/content";
import type { RawResponse } from "../../../contracts/src/responses";
import type {
  AssessmentInput,
  AssessmentResult,
  AssessmentSpecialistModuleResult,
  AssessmentSpecialistResult,
  AssessmentStatus,
} from "../../../contracts/src/results";
import type {
  ContentFingerprint,
  ContentSchemaVersion,
  ResultSchemaVersion,
  ResponseSchemaVersion,
} from "../../../contracts/src/versions";
import type { ConstructAssessment } from "../../../contracts/src/constructs";
import type { PrimaryProfileAssessment } from "../../../contracts/src/profiles";
import type { ModifierAssessment } from "../../../contracts/src/modifiers";
import type { SpecialistAssessment } from "../../../contracts/src/specialists";
import type { AssessmentDiagnostics, ContributionTrace } from "../../../contracts/src/diagnostics";
import {
  buildAssessmentDiagnostics,
  buildContributionTrace,
} from "../diagnostics";
import { throwScoringError } from "../errors/scoring-error";
import { prepareAssessmentResponses } from "../responses/prepare-assessment";
import { prepareSpecialistAssessment, scoreSpecialists } from "../specialists";
import { scoreConstructLayer } from "../constructs/score-constructs";
import { scorePrimaryProfiles } from "../profiles/profile-matching";
import { scoreModifiers } from "../modifiers/modifier-matching";
import type { PreparedAssessment, SpecialistPreparedAssessment } from "../types";
import { validateAssessmentResult } from "./result-validation";

export const SUPPORTED_CONTENT_SCHEMA_VERSION = "content-schema-v3.commitments.1" as const;
export const SUPPORTED_RESPONSE_SCHEMA_VERSION = "response-v2.phase1.1" as const;
export const SUPPORTED_SCORING_VERSION = "scoring-v3.commitment-1" as const;
export const SUPPORTED_RESULT_SCHEMA_VERSION = "result-v2.phase9.1" as const;

export interface AssessmentLayers {
  readonly prepared: PreparedAssessment;
  readonly constructs: ConstructAssessment;
  readonly primary: PrimaryProfileAssessment;
  readonly modifiers: ModifierAssessment;
  readonly specialistPrepared: SpecialistPreparedAssessment;
  readonly specialists: SpecialistAssessment;
  readonly diagnostics: AssessmentDiagnostics;
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
  return value;
}

function normalizeJsonNumbers(value: unknown): unknown {
  if (typeof value === "number") return Object.is(value, -0) ? 0 : value;
  if (Array.isArray(value)) return value.map(normalizeJsonNumbers);
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeJsonNumbers(entry)]),
    );
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalidInput(message: string, details?: Record<string, unknown>): never {
  throwScoringError("INVALID_ASSESSMENT_INPUT", message, { details });
}

function assertExactKeys(value: Record<string, unknown>): void {
  const allowed = new Set([
    "responseSchemaVersion",
    "contentFingerprint",
    "coreResponses",
    "specialistResponses",
    "requestedSpecialistModuleIds",
  ]);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key)).sort();
  if (unknown.length > 0) invalidInput("Assessment input contains unsupported fields", { unknownKeys: unknown });
}

function assertString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) invalidInput(`Assessment input ${field} must be a non-empty string`);
}

function assertSupportedVersion(
  actual: unknown,
  expected: string,
  field: string,
  code: "RESPONSE_SCHEMA_VERSION_MISMATCH" | "CONTENT_SCHEMA_VERSION_MISMATCH" | "SCORING_VERSION_MISMATCH" | "RESULT_SCHEMA_VERSION_MISMATCH",
): void {
  if (String(actual) !== expected) {
    throwScoringError(code, `Unsupported ${field}`, { details: { expected, received: actual } });
  }
}

function assertCompatibleContent(bundle: CanonicalContentBundle): void {
  if (!isRecord(bundle) || !isRecord(bundle.metadata)) invalidInput("Canonical content bundle must contain metadata");
  const schema = validateContentSchema(bundle);
  if (!schema.success) {
    throwScoringError("INVALID_CONTENT_BUNDLE", "Canonical content schema validation failed", { details: { issues: schema.issues } });
  }
  const semantics = validateContentSemantics(schema.value!);
  if (!semantics.success) {
    throwScoringError("INVALID_CONTENT_BUNDLE", "Canonical content semantic validation failed", { details: { issues: semantics.issues } });
  }
  assertSupportedVersion(bundle.metadata.contentSchemaVersion, SUPPORTED_CONTENT_SCHEMA_VERSION, "content schema version", "CONTENT_SCHEMA_VERSION_MISMATCH");
  assertSupportedVersion(bundle.metadata.responseSchemaVersion, SUPPORTED_RESPONSE_SCHEMA_VERSION, "response schema version", "RESPONSE_SCHEMA_VERSION_MISMATCH");
  assertSupportedVersion(bundle.metadata.scoringVersion, SUPPORTED_SCORING_VERSION, "scoring version", "SCORING_VERSION_MISMATCH");
  assertSupportedVersion(bundle.metadata.resultSchemaVersion, SUPPORTED_RESULT_SCHEMA_VERSION, "result schema version", "RESULT_SCHEMA_VERSION_MISMATCH");
  let fingerprint: string;
  try {
    fingerprint = computeContentFingerprint(bundle);
  } catch (error) {
    throwScoringError("INVALID_CONTENT_BUNDLE", "Canonical content fingerprint could not be computed", { details: { cause: error instanceof Error ? error.message : String(error) } });
  }
  if (fingerprint !== String(bundle.metadata.contentFingerprint)) {
    throwScoringError("CONTENT_FINGERPRINT_MISMATCH", "Canonical content fingerprint does not match canonical bytes", { details: { expected: fingerprint, received: bundle.metadata.contentFingerprint } });
  }
}

function assertItemRouting(
  responses: readonly unknown[],
  bundle: CanonicalContentBundle,
  kind: "core" | "specialist",
  requestedModuleIds: ReadonlySet<string>,
): void {
  const items = new Map(bundle.items.map((item) => [String(item.id), item]));
  for (const [index, response] of responses.entries()) {
    if (!isRecord(response) || typeof response.itemId !== "string") {
      invalidInput(`${kind} response ${index} must contain an itemId`);
    }
    const item = items.get(response.itemId);
    if (!item) throwScoringError("UNKNOWN_ITEM", `Response references unknown item ${response.itemId}`, { itemId: response.itemId });
    if (kind === "core" && item.role !== "core") invalidInput("Core response set contains a non-core item", { itemId: response.itemId });
    if (kind === "specialist") {
      if (item.role !== "specialist" || !item.moduleId) invalidInput("Specialist response set contains a core item", { itemId: response.itemId });
      if (!requestedModuleIds.has(String(item.moduleId))) {
        invalidInput("Specialist response belongs to a module that was not explicitly requested", { itemId: response.itemId, moduleId: item.moduleId });
      }
    }
  }
}

export function validateAssessmentInput(input: unknown, bundle: CanonicalContentBundle): AssessmentInput {
  assertCompatibleContent(bundle);
  if (!isRecord(input)) invalidInput("Assessment input must be an object");
  assertExactKeys(input);
  assertString(input.responseSchemaVersion, "responseSchemaVersion");
  assertString(input.contentFingerprint, "contentFingerprint");
  assertSupportedVersion(input.responseSchemaVersion, SUPPORTED_RESPONSE_SCHEMA_VERSION, "response schema version", "RESPONSE_SCHEMA_VERSION_MISMATCH");
  if (input.contentFingerprint !== bundle.metadata.contentFingerprint) {
    throwScoringError("CONTENT_FINGERPRINT_MISMATCH", "Assessment input content fingerprint does not match canonical content", { details: { expected: bundle.metadata.contentFingerprint, received: input.contentFingerprint } });
  }
  if (!Array.isArray(input.coreResponses)) invalidInput("coreResponses must be an array");
  if (input.specialistResponses !== undefined && !Array.isArray(input.specialistResponses)) invalidInput("specialistResponses must be an array when provided");
  if (!Array.isArray(input.requestedSpecialistModuleIds)) invalidInput("requestedSpecialistModuleIds must be an array");
  const requested = input.requestedSpecialistModuleIds;
  if (requested.some((moduleId) => typeof moduleId !== "string" || moduleId.length === 0)) invalidInput("requestedSpecialistModuleIds must contain non-empty strings");
  if (new Set(requested).size !== requested.length) invalidInput("requestedSpecialistModuleIds cannot contain duplicates");
  const knownModules = new Set(bundle.specialistModules.map((module) => String(module.id)));
  for (const moduleId of requested) {
    if (!knownModules.has(moduleId)) invalidInput("requestedSpecialistModuleIds contains an unknown module", { moduleId });
  }
  const specialistResponses = (input.specialistResponses ?? []) as readonly unknown[];
  assertItemRouting(input.coreResponses, bundle, "core", new Set(requested));
  assertItemRouting(specialistResponses, bundle, "specialist", new Set(requested));
  return Object.freeze({
    responseSchemaVersion: input.responseSchemaVersion as ResponseSchemaVersion,
    contentFingerprint: input.contentFingerprint as ContentFingerprint,
    coreResponses: Object.freeze([...input.coreResponses] as RawResponse[]),
    ...(input.specialistResponses === undefined ? {} : { specialistResponses: Object.freeze([...specialistResponses] as RawResponse[]) }),
    requestedSpecialistModuleIds: Object.freeze([...requested].sort()),
  });
}

function coreScope(bundle: CanonicalContentBundle): { readonly itemIds: readonly string[]; readonly constructIds: readonly string[] } {
  return {
    itemIds: bundle.items.filter((item) => item.role === "core" && item.status === "active").map((item) => String(item.id)).sort(),
    constructIds: bundle.constructs.filter((construct) => construct.scope === "root").map((construct) => String(construct.id)).sort(),
  };
}

function sumResponseCounts(responses: readonly PreparedAssessment["responses"][number][]) {
  const result = { answeredCount: 0, missingCount: 0, skippedCount: 0, abstainedCount: 0, refusedCount: 0 };
  for (const response of responses) {
    if (response.state === "answered") result.answeredCount += 1;
    else if (response.state === "missing") result.missingCount += 1;
    else if (response.state === "skipped") result.skippedCount += 1;
    else if (response.state === "abstained") result.abstainedCount += 1;
    else result.refusedCount += 1;
  }
  return result;
}

function responseSummary(prepared: PreparedAssessment, specialistPrepared: SpecialistPreparedAssessment) {
  const specialistResponses = specialistPrepared.modules.flatMap((module) => module.prepared.responses);
  const specialist = sumResponseCounts(specialistResponses);
  return Object.freeze({
    coreExpectedCount: prepared.responses.length,
    coreAnsweredCount: prepared.responseSummary.answeredCount,
    coreMissingCount: prepared.responseSummary.missingCount,
    coreSkippedCount: prepared.responseSummary.skippedCount,
    coreAbstainedCount: prepared.responseSummary.abstainedCount,
    coreRefusedCount: prepared.responseSummary.refusedCount,
    specialistExpectedCount: specialistResponses.length,
    specialistAnsweredCount: specialist.answeredCount,
    specialistMissingCount: specialist.missingCount,
    specialistSkippedCount: specialist.skippedCount,
    specialistAbstainedCount: specialist.abstainedCount,
    specialistRefusedCount: specialist.refusedCount,
  });
}

function assessmentStatus(prepared: PreparedAssessment, constructs: ConstructAssessment): AssessmentStatus {
  const expected = prepared.responses.length;
  const nonAnswered = prepared.responseSummary.missingCount + prepared.responseSummary.skippedCount + prepared.responseSummary.abstainedCount + prepared.responseSummary.refusedCount;
  const scored = constructs.constructs.filter((construct) => construct.status === "scored").length;
  if (expected === 0 || scored === 0) return "insufficient_core_evidence";
  if (nonAnswered === 0 && constructs.constructs.every((construct) => construct.status === "scored")) return "complete";
  return "partially_scored";
}

function assessmentEvidence(prepared: PreparedAssessment, constructs: ConstructAssessment): AssessmentResult["assessment"]["evidence"] {
  const scoredConstructCount = constructs.constructs.filter((construct) => construct.status === "scored").length;
  const abstainedConstructCount = constructs.constructs.length - scoredConstructCount;
  const reasons = new Set<string>();
  if (prepared.responseSummary.missingCount > 0) reasons.add("missingness");
  if (prepared.responseSummary.skippedCount > 0) reasons.add("skipped");
  if (prepared.responseSummary.abstainedCount > 0) reasons.add("abstention");
  if (prepared.responseSummary.refusedCount > 0) reasons.add("refusal");
  if (abstainedConstructCount > 0) reasons.add("insufficient-evidence");
  const evidenceStatus = constructs.evidence.overall.answeredWeightCoverage === 0
    ? "none"
    : abstainedConstructCount > 0 || constructs.evidence.overall.answeredWeightCoverage < 1
      ? "partial"
      : "sufficient";
  return Object.freeze({
    status: evidenceStatus,
    coreCoverage: constructs.evidence.overall.answeredWeightCoverage,
    core: constructs.evidence.overall,
    scoredConstructCount,
    abstainedConstructCount,
    uncertaintyLevel: abstainedConstructCount > 0 || reasons.size > 0 ? "high" : "low",
    uncertaintyReasons: Object.freeze([...reasons].sort()),
  });
}

function specialistResult(specialists: SpecialistAssessment): AssessmentSpecialistResult {
  const modules: AssessmentSpecialistModuleResult[] = specialists.modules.map((module) => {
    const constructAssessment = module.constructAssessment;
    const constructs = constructAssessment?.constructs ?? [];
    const contributionIds = constructAssessment?.evidence.overall.contributionIds ?? [];
    const withoutAssessment = Object.fromEntries(
      Object.entries(module).filter(([key]) => key !== "constructAssessment"),
    ) as Omit<typeof module, "constructAssessment">;
    return {
      ...withoutAssessment,
      constructs: Object.freeze([...constructs]),
      contributionIds: Object.freeze([...contributionIds].sort()),
    };
  });
  return Object.freeze({
    contentSchemaVersion: specialists.contentSchemaVersion,
    contentVersion: specialists.contentVersion,
    contentFingerprint: specialists.contentFingerprint as ContentFingerprint,
    scoringVersion: specialists.scoringVersion,
    responseSchemaVersion: specialists.responseSchemaVersion,
    resultSchemaVersion: specialists.resultSchemaVersion,
    researchSchemaVersion: specialists.researchSchemaVersion,
    coreAssessmentContentFingerprint: specialists.coreAssessmentContentFingerprint as ContentFingerprint,
    modules: Object.freeze(modules),
    summary: specialists.summary,
  });
}

function mergeSpecialistTraces(
  diagnostics: AssessmentDiagnostics,
  specialists: SpecialistAssessment,
  bundle: CanonicalContentBundle,
): AssessmentDiagnostics {
  const traces = specialists.modules.flatMap((module) => module.constructAssessment ? buildContributionTrace(module.constructAssessment, bundle) : []);
  const byId = new Map<string, ContributionTrace>();
  for (const trace of [...diagnostics.contributions, ...traces]) byId.set(trace.contributionId, trace);
  return deepFreeze({
    ...diagnostics,
    contributions: [...byId.values()].sort((left, right) => left.contributionId.localeCompare(right.contributionId)),
  });
}

export function assembleAssessmentResult(
  layers: AssessmentLayers,
  bundle: CanonicalContentBundle,
): AssessmentResult {
  const diagnostics = mergeSpecialistTraces(layers.diagnostics, layers.specialists, bundle);
  const result = {
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    resultSchemaVersion: bundle.metadata.resultSchemaVersion as ResultSchemaVersion,
    contentSchemaVersion: bundle.metadata.contentSchemaVersion as ContentSchemaVersion,
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    scoringVersion: bundle.metadata.scoringVersion,
    researchSchemaVersion: bundle.metadata.researchSchemaVersion,
    assessment: {
      status: assessmentStatus(layers.prepared, layers.constructs),
      responseSummary: responseSummary(layers.prepared, layers.specialistPrepared),
      evidence: assessmentEvidence(layers.prepared, layers.constructs),
    },
    constructs: layers.constructs.constructs,
    primary: {
      profiles: layers.primary.profiles,
      ranking: layers.primary.ranking,
      topProfileIds: layers.primary.topProfileIds,
      topTie: layers.primary.topTie,
      uncertainty: layers.primary.uncertainty,
    },
    modifiers: layers.modifiers.modifiers,
    specialists: specialistResult(layers.specialists),
    diagnostics,
  };
  return deepFreeze(normalizeJsonNumbers(result) as AssessmentResult);
}

export function scoreAssessment(input: AssessmentInput, bundle: CanonicalContentBundle): AssessmentResult {
  const validated = validateAssessmentInput(input, bundle);
  const scope = coreScope(bundle);
  const prepared = prepareAssessmentResponses(validated.coreResponses, bundle, scope);
  const constructs = scoreConstructLayer(prepared, bundle, scope);
  const primary = scorePrimaryProfiles(constructs, bundle);
  const modifiers = scoreModifiers(constructs, bundle);
  const specialistPrepared = prepareSpecialistAssessment({
    requestedModuleIds: validated.requestedSpecialistModuleIds,
    responses: validated.specialistResponses ?? [],
  }, bundle);
  const specialists = scoreSpecialists(constructs, specialistPrepared, bundle);
  const diagnostics = buildAssessmentDiagnostics({ bundle, constructs, profiles: primary, modifiers, specialists });
  const result = assembleAssessmentResult({ prepared, constructs, primary, modifiers, specialistPrepared, specialists, diagnostics }, bundle);
  return validateAssessmentResult(result, bundle);
}

export { serializeAssessmentResult } from "./serialization";
export { validateAssessmentResult } from "./result-validation";
