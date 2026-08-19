import type { CanonicalContentBundle } from "../../../contracts/src/content";
import type { ConstructAssessment, ConstructResult } from "../../../contracts/src/constructs";
import type { ConstructDiagnostic, ContributionTrace } from "../../../contracts/src/diagnostics";
import { DIAGNOSTIC_MIDPOINT_TOLERANCE } from "../../../contracts/src/diagnostics";
import { DIAGNOSTIC_NUMERIC_TOLERANCE, deepFreeze } from "./common";

function position(result: ConstructResult, bundle: CanonicalContentBundle): ConstructDiagnostic["scorePosition"] {
  if (result.status !== "scored") return "unavailable";
  const construct = bundle.constructs.find((entry) => String(entry.id) === String(result.constructId));
  const domain = bundle.domains.find((entry) => entry.id === construct?.domainId);
  const bipolar = Boolean(domain?.poles?.negative || domain?.poles?.positive);
  if (!bipolar) return "not-applicable";
  if (Math.abs(result.score) <= DIAGNOSTIC_MIDPOINT_TOLERANCE) return "near-midpoint";
  return result.score < 0 ? "negative-side" : "positive-side";
}

export function buildConstructDiagnostics(
  assessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
  traces: readonly ContributionTrace[],
): readonly ConstructDiagnostic[] {
  const byConstruct = new Map<string, ContributionTrace[]>();
  for (const trace of traces) {
    const list = byConstruct.get(trace.constructId) ?? [];
    list.push(trace);
    byConstruct.set(trace.constructId, list);
  }
  const results = [...assessment.constructs].sort((left, right) => left.constructId.localeCompare(right.constructId));
  return deepFreeze(results.map((result) => {
    const records = [...(byConstruct.get(result.constructId) ?? [])].sort((left, right) => Math.abs(right.weightedContribution) - Math.abs(left.weightedContribution) || left.itemId.localeCompare(right.itemId) || left.contributionId.localeCompare(right.contributionId));
    const included = records.filter((record) => record.included);
    const excluded = records.filter((record) => !record.included);
    const positive = included.filter((record) => record.weightedContribution > 0).map((record) => record.contributionId);
    const negative = included.filter((record) => record.weightedContribution < 0).map((record) => record.contributionId);
    const tracedWeightedContribution = included.reduce((sum, record) => sum + record.weightedContribution, 0);
    const tracedMappingWeight = included.reduce((sum, record) => sum + record.mappingWeight, 0);
    const tracedEffectiveWeight = included.reduce((sum, record) => sum + record.effectiveWeight, 0);
    const arithmetic = {
      authoritativeNumerator: result.numerator,
      authoritativeDenominator: result.denominator,
      tracedWeightedContribution,
      tracedMappingWeight,
      tracedEffectiveWeight,
      numeratorReconciles: Math.abs(tracedWeightedContribution - result.numerator) <= DIAGNOSTIC_NUMERIC_TOLERANCE,
      denominatorReconciles: Math.abs(tracedMappingWeight - result.denominator) <= DIAGNOSTIC_NUMERIC_TOLERANCE,
    };
    return {
      constructId: result.constructId,
      status: result.status,
      score: result.score,
      scorePosition: position(result, bundle),
      nearEvidenceThreshold: result.support.nearThreshold,
      nearInterpretiveMidpoint: position(result, bundle) === "near-midpoint",
      support: result.support,
      evidence: result.evidence,
      contributionIds: Object.freeze(records.map((record) => record.contributionId)),
      includedContributionIds: Object.freeze(included.map((record) => record.contributionId)),
      excludedContributionIds: Object.freeze(excluded.map((record) => record.contributionId)),
      strongestPositiveContributionIds: Object.freeze(positive),
      strongestNegativeContributionIds: Object.freeze(negative),
      largestAbsoluteContributionIds: Object.freeze(records.map((record) => record.contributionId)),
      arithmetic,
      severity: result.status === "abstained" ? "blocking" : result.support.evidenceStatus === "partial" ? "caution" : "info",
    };
  }));
}

export function contributionIdsForConstruct(result: ConstructResult): readonly string[] {
  return Object.freeze(result.contributionIds.length > 0 ? [...result.contributionIds] : []);
}
