import type {
  PrimaryProfileConstructComparison,
  PrimaryProfileEvidence,
} from "../../../contracts/src/profiles";
import type { ConstructResult } from "../../../contracts/src/constructs";
import type { ConstructRequirement, PrimaryProfileRecord } from "../../../contracts/src/content";
import type { ConstructId } from "../../../contracts/src/ids";

export interface ProfileEvidenceEvaluation {
  readonly comparisons: readonly PrimaryProfileConstructComparison[];
  readonly evidence: PrimaryProfileEvidence;
}

function sortedRequirements(
  profile: PrimaryProfileRecord,
): readonly ConstructRequirement[] {
  return [...(profile.requirements ?? [])].sort((left, right) =>
    String(left.constructId).localeCompare(String(right.constructId)),
  );
}

function validConstructScore(score: number): boolean {
  return Number.isFinite(score) && score >= -1 && score <= 1;
}

export function emptyProfileEvidence(
  profile: PrimaryProfileRecord,
): ProfileEvidenceEvaluation {
  const requirements = sortedRequirements(profile);
  const minimumEvidenceRatio = profile.minimumEvidenceRatio ?? 1;
  const totalWeight = requirements.reduce(
    (sum, requirement) =>
      sum + (Number.isFinite(requirement.weight) && requirement.weight > 0 ? requirement.weight : 0),
    0,
  );
  return {
    comparisons: Object.freeze([]),
    evidence: Object.freeze({
      requiredConstructCount: requirements.length,
      measuredRequiredConstructCount: 0,
      unavailableRequiredConstructCount: requirements.length,
      totalWeight,
      measuredWeight: 0,
      unavailableWeight: totalWeight,
      comparisonCoverage: 0,
      minimumEvidenceRatio,
      meetsMinimumEvidence: false,
      unavailableConstructIds: Object.freeze(
        requirements.map((requirement) => requirement.constructId),
      ),
    }),
  };
}

export function evaluatePrimaryProfileEvidence(
  profile: PrimaryProfileRecord,
  constructsById: ReadonlyMap<ConstructId, ConstructResult>,
): ProfileEvidenceEvaluation {
  const requirements = sortedRequirements(profile);
  const minimumEvidenceRatio = profile.minimumEvidenceRatio ?? 1;
  const comparisons: PrimaryProfileConstructComparison[] = [];
  const unavailableConstructIds: ConstructId[] = [];
  let measuredWeight = 0;
  let totalWeight = 0;

  for (const requirement of requirements) {
    const construct = constructsById.get(requirement.constructId);
    totalWeight += requirement.weight;
    if (
      !construct ||
      construct.status !== "scored" ||
      !validConstructScore(construct.score)
    ) {
      unavailableConstructIds.push(requirement.constructId);
      comparisons.push({
        constructId: requirement.constructId,
        targetValue: requirement.targetValue,
        observedScore: null,
        weight: requirement.weight,
        squaredError: null,
        weightedSquaredError: null,
        included: false,
        exclusionReason: "construct_unavailable",
      });
      continue;
    }

    if (
      requirement.minimumAnsweredItems !== undefined &&
      construct.evidence.answeredItemCount < requirement.minimumAnsweredItems
    ) {
      unavailableConstructIds.push(requirement.constructId);
      comparisons.push({
        constructId: requirement.constructId,
        targetValue: requirement.targetValue,
        observedScore: construct.score,
        weight: requirement.weight,
        squaredError: null,
        weightedSquaredError: null,
        included: false,
        exclusionReason: "minimum_answered_items_not_met",
      });
      continue;
    }

    const squaredError = (construct.score - requirement.targetValue) ** 2;
    measuredWeight += requirement.weight;
    comparisons.push({
      constructId: requirement.constructId,
      targetValue: requirement.targetValue,
      observedScore: construct.score,
      weight: requirement.weight,
      squaredError,
      weightedSquaredError: requirement.weight * squaredError,
      included: true,
    });
  }

  const comparisonCoverage = totalWeight > 0 ? measuredWeight / totalWeight : 0;
  return {
    comparisons: Object.freeze(comparisons),
    evidence: Object.freeze({
      requiredConstructCount: requirements.length,
      measuredRequiredConstructCount: comparisons.filter((comparison) => comparison.included)
        .length,
      unavailableRequiredConstructCount: unavailableConstructIds.length,
      totalWeight,
      measuredWeight,
      unavailableWeight: totalWeight - measuredWeight,
      comparisonCoverage,
      minimumEvidenceRatio,
      meetsMinimumEvidence:
        requirements.length > 0 && comparisonCoverage >= minimumEvidenceRatio,
      unavailableConstructIds: Object.freeze(
        [...new Set(unavailableConstructIds)].sort((left, right) =>
          String(left).localeCompare(String(right)),
        ),
      ),
    }),
  };
}
