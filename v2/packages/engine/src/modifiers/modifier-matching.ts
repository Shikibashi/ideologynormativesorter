import type { ConstructAssessment, ConstructResult } from "../../../contracts/src/constructs";
import type { CanonicalContentBundle, ModifierIndicator, ModifierProfileRecord } from "../../../contracts/src/content";
import type { ConstructId } from "../../../contracts/src/ids";
import type {
  ModifierAssessment,
  ModifierEvidence,
  ModifierIndicatorComparison,
  ModifierResult,
  ModifierResultReason,
  ModifierUncertainty,
} from "../../../contracts/src/modifiers";
import type { ContributionRecordBase } from "../../../contracts/src/scoring";
import type { ResponseState } from "../../../contracts/src/responses";
import { throwScoringError } from "../errors/scoring-error";
import {
  evaluateModifierGates,
  validateModifierGateConfiguration,
} from "./modifier-gates";

export const MODIFIER_DEFAULT_FIT_THRESHOLD = 0.65;
export const MODIFIER_DEFAULT_EVIDENCE_THRESHOLD = 0.4;
export const MODIFIER_MAX_ACTIVE_UNCERTAINTY = "medium" as const;

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (!Object.isFrozen(value)) Object.freeze(value);
  for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
  return value;
}

function clampUnit(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function contributionKey(contribution: ContributionRecordBase): string {
  return [contribution.sourceItemId, contribution.targetConstructId, contribution.optionId ?? ""].join("\u0000");
}

function assertVersionCompatibility(
  assessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
): void {
  const checks: readonly [string, string, string][] = [
    ["responseSchemaVersion", String(bundle.metadata.responseSchemaVersion), String(assessment.responseSchemaVersion)],
    ["scoringVersion", String(bundle.metadata.scoringVersion), String(assessment.scoringVersion)],
    ["contentVersion", String(bundle.metadata.contentVersion), String(assessment.contentVersion)],
    ["contentFingerprint", String(bundle.metadata.contentFingerprint), String(assessment.contentFingerprint)],
    ["resultSchemaVersion", String(bundle.metadata.resultSchemaVersion), String(assessment.resultSchemaVersion)],
  ];
  for (const [field, expected, received] of checks) {
    if (expected === received) continue;
    const code = field === "responseSchemaVersion"
      ? "RESPONSE_SCHEMA_VERSION_MISMATCH"
      : field === "scoringVersion"
        ? "SCORING_VERSION_MISMATCH"
        : field === "contentVersion"
          ? "CONTENT_VERSION_MISMATCH"
          : field === "contentFingerprint"
            ? "CONTENT_FINGERPRINT_MISMATCH"
            : "RESULT_SCHEMA_VERSION_MISMATCH";
    throwScoringError(code, `Construct assessment ${field} does not match canonical content`, { details: { expected, received } });
  }
}

function constructMap(constructs: readonly ConstructResult[]): ReadonlyMap<ConstructId, ConstructResult> {
  const map = new Map<ConstructId, ConstructResult>();
  for (const construct of constructs) {
    if (map.has(construct.constructId)) throwScoringError("INVALID_SCORING_CONFIGURATION", "Construct assessment contains duplicate construct results", { details: { constructId: construct.constructId } });
    map.set(construct.constructId, construct);
  }
  return map;
}

function stateByItem(assessment: ConstructAssessment): ReadonlyMap<string, ResponseState> {
  const states = new Map<string, ResponseState>();
  for (const construct of assessment.constructs) {
    for (const [itemId, state] of Object.entries(construct.evidence.itemStateById)) {
      const existing = states.get(itemId);
      if (existing !== undefined && existing !== state) throwScoringError("INVALID_SCORING_CONFIGURATION", "Construct assessment contains conflicting item evidence states", { itemId, details: { existing, received: state } });
      states.set(itemId, state);
    }
  }
  for (const contribution of assessment.contributions) {
    const existing = states.get(contribution.sourceItemId);
    if (existing !== undefined && existing !== contribution.sourceResponseState) continue;
    states.set(contribution.sourceItemId, contribution.sourceResponseState);
  }
  return states;
}

function contributionsByItem(assessment: ConstructAssessment): ReadonlyMap<string, readonly ContributionRecordBase[]> {
  const grouped = new Map<string, ContributionRecordBase[]>();
  for (const contribution of assessment.contributions) {
    const values = grouped.get(contribution.sourceItemId) ?? [];
    values.push(contribution);
    grouped.set(contribution.sourceItemId, values);
  }
  return new Map([...grouped.entries()].map(([itemId, values]) => [itemId, Object.freeze([...values])]));
}

function finiteOrNull(value: number | null | undefined): value is number {
  return value !== null && value !== undefined && Number.isFinite(value);
}

function exclusionForState(state: ResponseState | null): ModifierIndicatorComparison["exclusionReason"] {
  switch (state) {
    case "missing": return "missing_response";
    case "skipped": return "skipped_response";
    case "abstained": return "explicit_abstention";
    case "refused": return "refused_response";
    default: return "not_in_assessment";
  }
}

function validateModifierConfiguration(
  modifier: ModifierProfileRecord,
  bundle: CanonicalContentBundle,
): string | undefined {
  const itemMap = new Map(bundle.items.map((item) => [item.id, item]));
  if (modifier.availability === "core-construct" && modifier.indicators.length === 0) return "core modifier has no direct indicators";
  if (modifier.availability !== "core-construct" && modifier.indicators.length > 0) return "non-core modifier has ordinary direct indicators";
  const indicatorIds = new Set<string>();
  for (const indicator of modifier.indicators) {
    if (indicatorIds.has(indicator.itemId)) return `duplicate indicator ${indicator.itemId}`;
    indicatorIds.add(indicator.itemId);
    const item = itemMap.get(indicator.itemId);
    if (!item || item.role !== "core" || item.status !== "active") return `indicator ${indicator.itemId} is not an active core item`;
    if (!Number.isFinite(indicator.weight) || indicator.weight <= 0) return `indicator ${indicator.itemId} has invalid weight`;
    if (indicator.targetValue !== undefined && (!Number.isFinite(indicator.targetValue) || indicator.targetValue < -1 || indicator.targetValue > 1)) return `indicator ${indicator.itemId} has invalid target`;
    if (indicator.minimumEvidenceWeight !== undefined && (!Number.isFinite(indicator.minimumEvidenceWeight) || indicator.minimumEvidenceWeight < 0)) return `indicator ${indicator.itemId} has invalid evidence minimum`;
  }
  if (modifier.minimumAnsweredItems !== undefined && (!Number.isInteger(modifier.minimumAnsweredItems) || modifier.minimumAnsweredItems < 0 || modifier.minimumAnsweredItems > modifier.indicators.length)) return "invalid minimum answered item count";
  if (modifier.minimumEvidenceRatio !== undefined && (!Number.isFinite(modifier.minimumEvidenceRatio) || modifier.minimumEvidenceRatio < 0 || modifier.minimumEvidenceRatio > 1)) return "invalid evidence threshold";
  if (modifier.fitThreshold !== undefined && (!Number.isFinite(modifier.fitThreshold) || modifier.fitThreshold < 0 || modifier.fitThreshold > 1)) return "invalid fit threshold";
  return validateModifierGateConfiguration(modifier, new Set(bundle.constructs.map((construct) => String(construct.id))));
}

function emptyEvidence(modifier: ModifierProfileRecord): ModifierEvidence {
  const totalWeight = modifier.indicators.reduce((sum, indicator) => sum + indicator.weight, 0);
  const minimumAnsweredItems = modifier.minimumAnsweredItems ?? modifier.indicators.length;
  return Object.freeze({
    totalIndicatorCount: modifier.indicators.length,
    measuredIndicatorCount: 0,
    minimumAnsweredItems,
    indicatorCoverage: 0,
    minimumEvidenceRatio: modifier.minimumEvidenceRatio ?? MODIFIER_DEFAULT_EVIDENCE_THRESHOLD,
    meetsMinimumEvidence: false,
    totalWeight,
    measuredWeight: 0,
    weightedCoverage: 0,
    answeredIndicatorIds: Object.freeze([]),
    unavailableIndicatorIds: Object.freeze(modifier.indicators.map((indicator) => indicator.itemId).sort()),
  });
}

function unavailableResult(
  modifier: ModifierProfileRecord,
  reason: ModifierResultReason,
): ModifierResult {
  const evidence = emptyEvidence(modifier);
  return {
    modifierId: modifier.modifierId,
    name: modifier.name,
    availability: modifier.availability,
    constructName: modifier.constructName,
    measurementState: "unmeasured",
    status: "unavailable",
    fit: null,
    distance: null,
    fitThreshold: modifier.fitThreshold ?? MODIFIER_DEFAULT_FIT_THRESHOLD,
    evidence,
    uncertainty: Object.freeze({ level: "high", reasons: Object.freeze(["insufficient_indicator_evidence"] as const) }),
    comparisons: Object.freeze([]),
    gates: Object.freeze([]),
    reason,
  };
}

function comparisonForIndicator(
  indicator: ModifierIndicator,
  records: readonly ContributionRecordBase[] | undefined,
  states: ReadonlyMap<string, ResponseState>,
  constructsById: ReadonlyMap<ConstructId, ConstructResult>,
): ModifierIndicatorComparison {
  const sourceResponseState = states.get(indicator.itemId) ?? records?.[0]?.sourceResponseState ?? null;
  const constructIds = [...new Set((records ?? []).map((record) => String(record.targetConstructId)))].sort() as ConstructId[];
  const contributionIds = new Set<string>();
  for (const record of records ?? []) {
    if (!record.included || !finiteOrNull(record.normalizedInput)) continue;
    const key = contributionKey(record);
    if (constructsById.get(record.targetConstructId)?.contributionIds.includes(key)) contributionIds.add(key);
  }
  const answered = (records ?? []).filter((record) => record.sourceResponseState === "answered" && finiteOrNull(record.normalizedInput));
  const observedValues = [...new Set(answered.map((record) => record.normalizedInput as number))];
  if (observedValues.length > 1) throwScoringError("INVALID_SCORING_CONFIGURATION", "Modifier indicator has conflicting normalized contribution values", { itemId: indicator.itemId });
  const eligible = answered.filter((record) => record.included && finiteOrNull(record.normalizedInput));
  const evidenceWeight = eligible.reduce((maximum, record) => Math.max(maximum, record.effectiveWeight), 0);
  const hasMinimumEvidence = indicator.minimumEvidenceWeight === undefined || evidenceWeight >= indicator.minimumEvidenceWeight;
  if (!hasMinimumEvidence) {
    return Object.freeze({ itemId: indicator.itemId, sourceResponseState, observedValue: null, directedValue: null, targetValue: indicator.targetValue ?? 1, weight: indicator.weight, evidenceWeight, squaredError: null, weightedSquaredError: null, included: false, constructIds: Object.freeze(constructIds), contributionIds: Object.freeze([...contributionIds].sort()), exclusionReason: "minimum_evidence_weight" });
  }
  const observedValue = eligible[0]?.normalizedInput ?? null;
  if (observedValue === null) {
    const exclusionReason = answered.length > 0
      ? ((records ?? []).some((record) => record.exclusionReason === "salience_skipped") ? "salience_skipped" : "not_in_assessment")
      : exclusionForState(sourceResponseState);
    return Object.freeze({ itemId: indicator.itemId, sourceResponseState, observedValue: null, directedValue: null, targetValue: indicator.targetValue ?? 1, weight: indicator.weight, evidenceWeight: 0, squaredError: null, weightedSquaredError: null, included: false, constructIds: Object.freeze(constructIds), contributionIds: Object.freeze([...contributionIds].sort()), exclusionReason });
  }
  const directedValue = observedValue * indicator.direction;
  const targetValue = indicator.targetValue ?? 1;
  const squaredError = (directedValue - targetValue) ** 2;
  return Object.freeze({ itemId: indicator.itemId, sourceResponseState, observedValue, directedValue, targetValue, weight: indicator.weight, evidenceWeight, squaredError, weightedSquaredError: indicator.weight * squaredError, included: true, constructIds: Object.freeze(constructIds), contributionIds: Object.freeze([...contributionIds].sort()) });
}

function uncertaintyFor(
  measuredIndicatorCount: number,
  totalIndicatorCount: number,
  minimumEvidenceRatio: number,
): ModifierUncertainty {
  const coverage = totalIndicatorCount > 0 ? measuredIndicatorCount / totalIndicatorCount : 0;
  const reasons: ModifierUncertainty["reasons"][number][] = [];
  if (measuredIndicatorCount < 2 || coverage < minimumEvidenceRatio) reasons.push("insufficient_indicator_evidence");
  if (measuredIndicatorCount > 0 && measuredIndicatorCount < totalIndicatorCount) reasons.push("partial_indicator_coverage");
  const level = reasons.includes("insufficient_indicator_evidence") ? "high" : reasons.length > 0 ? "medium" : "low";
  const uniqueReasons = [...new Set(reasons)].sort() as ModifierUncertainty["reasons"];
  return Object.freeze({ level, reasons: Object.freeze(uniqueReasons) });
}

function scoreModifier(
  modifier: ModifierProfileRecord,
  assessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
  constructsById: ReadonlyMap<ConstructId, ConstructResult>,
): ModifierResult {
  if (modifier.availability !== "core-construct") return unavailableResult(modifier, modifier.availability === "catalog-only" ? "catalog_only" : "focused_follow_up");
  const configError = validateModifierConfiguration(modifier, bundle);
  if (configError) return unavailableResult(modifier, "invalid_modifier_configuration");
  const states = stateByItem(assessment);
  const grouped = contributionsByItem(assessment);
  const comparisons = [...modifier.indicators]
    .sort((left, right) => left.itemId.localeCompare(right.itemId))
    .map((indicator) => comparisonForIndicator(indicator, grouped.get(indicator.itemId), states, constructsById));
  const measured = comparisons.filter((comparison) => comparison.included);
  const totalWeight = comparisons.reduce((sum, comparison) => sum + comparison.weight, 0);
  const measuredWeight = measured.reduce((sum, comparison) => sum + comparison.weight, 0);
  const minimumAnsweredItems = modifier.minimumAnsweredItems ?? comparisons.length;
  const minimumEvidenceRatio = modifier.minimumEvidenceRatio ?? MODIFIER_DEFAULT_EVIDENCE_THRESHOLD;
  const indicatorCoverage = comparisons.length > 0 ? measured.length / comparisons.length : 0;
  const weightedCoverage = totalWeight > 0 ? measuredWeight / totalWeight : 0;
  const meetsMinimumEvidence = measured.length >= minimumAnsweredItems && indicatorCoverage >= minimumEvidenceRatio;
  const evidence: ModifierEvidence = Object.freeze({
    totalIndicatorCount: comparisons.length,
    measuredIndicatorCount: measured.length,
    minimumAnsweredItems,
    indicatorCoverage,
    minimumEvidenceRatio,
    meetsMinimumEvidence,
    totalWeight,
    measuredWeight,
    weightedCoverage,
    answeredIndicatorIds: Object.freeze(measured.map((comparison) => comparison.itemId).sort()),
    unavailableIndicatorIds: Object.freeze(comparisons.filter((comparison) => !comparison.included).map((comparison) => comparison.itemId).sort()),
  });
  const uncertainty = uncertaintyFor(measured.length, comparisons.length, minimumEvidenceRatio);
  const squaredErrorTotal = measured.reduce((sum, comparison) => sum + (comparison.weightedSquaredError ?? 0), 0);
  const distance = measuredWeight > 0 ? Math.sqrt(squaredErrorTotal / measuredWeight) : null;
  const fit = distance === null ? null : clampUnit(1 - distance / 2);
  const fitThreshold = modifier.fitThreshold ?? MODIFIER_DEFAULT_FIT_THRESHOLD;
  const gateResult = evaluateModifierGates(modifier, { constructsById, modifierEvidence: evidence });
  let status: ModifierResult["status"] = "inactive";
  let reason: ModifierResultReason = "no_measured_indicators";
  if (fit !== null && fit < fitThreshold) {
    status = "below-threshold";
    reason = "fit_below_threshold";
  } else if (fit !== null && !meetsMinimumEvidence) {
    status = "inactive";
    reason = measured.length < minimumAnsweredItems ? "minimum_answered_items_not_met" : "evidence_below_threshold";
  } else if (fit !== null && uncertainty.level === "high") {
    status = "inactive";
    reason = "uncertainty_too_high";
  } else if (fit !== null && gateResult.status === "failed") {
    status = "inactive";
    reason = "constitutive_gate_failed";
  } else if (fit !== null && gateResult.status === "unavailable") {
    status = "inactive";
    reason = "constitutive_gate_unavailable";
  } else if (fit !== null) {
    status = "active";
    reason = undefined as never;
  }
  return {
    modifierId: modifier.modifierId,
    name: modifier.name,
    availability: modifier.availability,
    constructName: modifier.constructName,
    measurementState: fit === null ? "unmeasured" : "measured",
    status,
    fit,
    distance,
    fitThreshold,
    evidence,
    uncertainty,
    comparisons: Object.freeze(comparisons),
    gates: gateResult.evaluations,
    ...(reason === undefined ? {} : { reason }),
  };
}

export function scoreModifiers(
  assessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
): ModifierAssessment {
  assertVersionCompatibility(assessment, bundle);
  const constructsById = constructMap(assessment.constructs);
  const modifiers = [...bundle.modifiers]
    .sort((left, right) => String(left.modifierId).localeCompare(String(right.modifierId)))
    .map((modifier) => scoreModifier(modifier, assessment, bundle, constructsById));
  return deepFreeze({
    responseSchemaVersion: assessment.responseSchemaVersion,
    scoringVersion: assessment.scoringVersion,
    contentVersion: assessment.contentVersion,
    contentFingerprint: assessment.contentFingerprint,
    resultSchemaVersion: bundle.metadata.resultSchemaVersion,
    modifiers,
  });
}

export const matchModifiers = scoreModifiers;
