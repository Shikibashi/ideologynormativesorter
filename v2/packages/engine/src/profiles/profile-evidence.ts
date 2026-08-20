import type {
  PrimaryProfileConstructComparison,
  PrimaryProfileEvidence,
} from "../../../contracts/src/profiles";
import type { ConstructResult } from "../../../contracts/src/constructs";
import type { ConstructRequirement, PrimaryProfileRecord } from "../../../contracts/src/content";
import type { ConstructId } from "../../../contracts/src/ids";
import {
  commitmentAffinityWeight,
  commitmentCriterionAnchor,
  commitmentCriterionSatisfied,
  getPrimaryIdeologyCommitmentSpec,
  isAffinityCommitment,
  isDecisiveCommitment,
  type PrimaryIdeologyCommitment,
} from "./ideology-commitments";

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

function legacyEmptyProfileEvidence(
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

function legacyEvaluatePrimaryProfileEvidence(
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

function evidenceCommitments(
  commitments: readonly PrimaryIdeologyCommitment[],
): readonly PrimaryIdeologyCommitment[] {
  return commitments.filter(
    (commitment) => isAffinityCommitment(commitment) || isDecisiveCommitment(commitment),
  );
}

function commitmentEvidenceAvailable(
  commitment: PrimaryIdeologyCommitment,
  construct: ConstructResult | undefined,
): construct is Extract<ConstructResult, { status: "scored" }> {
  return Boolean(
    construct &&
      construct.status === "scored" &&
      validConstructScore(construct.score) &&
      (commitment.minimumAnsweredItems === undefined ||
        construct.evidence.answeredItemCount >= commitment.minimumAnsweredItems),
  );
}

function evaluateCommitmentProfileEvidence(
  profile: PrimaryProfileRecord,
  constructsById: ReadonlyMap<ConstructId, ConstructResult>,
): ProfileEvidenceEvaluation {
  const spec = getPrimaryIdeologyCommitmentSpec(String(profile.id));
  if (!spec) return legacyEvaluatePrimaryProfileEvidence(profile, constructsById);

  const minimumEvidenceRatio = profile.minimumEvidenceRatio ?? 0.6;
  const measurable = evidenceCommitments(spec.commitments);
  const affinity = spec.commitments.filter(isAffinityCommitment);
  const requiredConstructIds = [...new Set(measurable.map((entry) => entry.constructId))].sort();
  const unavailableConstructIds = requiredConstructIds.filter((constructId) => {
    const commitments = measurable.filter((entry) => entry.constructId === constructId);
    const construct = constructsById.get(constructId as ConstructId);
    return !commitments.some((entry) => commitmentEvidenceAvailable(entry, construct));
  });
  const measuredConstructCount = requiredConstructIds.length - unavailableConstructIds.length;
  const comparisonCoverage =
    requiredConstructIds.length > 0 ? measuredConstructCount / requiredConstructIds.length : 0;

  const comparisons: PrimaryProfileConstructComparison[] = affinity.map((commitment) => {
    const constructId = commitment.constructId as ConstructId;
    const construct = constructsById.get(constructId);
    const weight = commitmentAffinityWeight(commitment.relation);
    const criterion = commitment.criterion!;
    if (!commitmentEvidenceAvailable(commitment, construct)) {
      return {
        constructId,
        targetValue: commitmentCriterionAnchor(criterion),
        observedScore:
          construct?.status === "scored" && validConstructScore(construct.score)
            ? construct.score
            : null,
        weight,
        squaredError: null,
        weightedSquaredError: null,
        included: false,
        exclusionReason:
          construct?.status === "scored"
            ? "minimum_answered_items_not_met"
            : "construct_unavailable",
      };
    }
    const supported = commitmentCriterionSatisfied(construct.score, criterion);
    const mismatch = supported ? 0 : 1;
    return {
      constructId,
      targetValue: commitmentCriterionAnchor(criterion),
      observedScore: construct.score,
      weight,
      squaredError: mismatch,
      weightedSquaredError: weight * mismatch,
      included: true,
    };
  });

  return {
    comparisons: Object.freeze(
      comparisons.sort((left, right) => String(left.constructId).localeCompare(String(right.constructId))),
    ),
    evidence: Object.freeze({
      requiredConstructCount: requiredConstructIds.length,
      measuredRequiredConstructCount: measuredConstructCount,
      unavailableRequiredConstructCount: unavailableConstructIds.length,
      totalWeight: requiredConstructIds.length,
      measuredWeight: measuredConstructCount,
      unavailableWeight: unavailableConstructIds.length,
      comparisonCoverage,
      minimumEvidenceRatio,
      meetsMinimumEvidence:
        requiredConstructIds.length > 0 && comparisonCoverage >= minimumEvidenceRatio,
      unavailableConstructIds: Object.freeze(
        unavailableConstructIds.map((id) => id as ConstructId),
      ),
    }),
  };
}

export function emptyProfileEvidence(
  profile: PrimaryProfileRecord,
): ProfileEvidenceEvaluation {
  const spec = getPrimaryIdeologyCommitmentSpec(String(profile.id));
  if (!spec) return legacyEmptyProfileEvidence(profile);
  const constructIds = [...new Set(evidenceCommitments(spec.commitments).map((entry) => entry.constructId))].sort();
  const minimumEvidenceRatio = profile.minimumEvidenceRatio ?? 0.6;
  return {
    comparisons: Object.freeze([]),
    evidence: Object.freeze({
      requiredConstructCount: constructIds.length,
      measuredRequiredConstructCount: 0,
      unavailableRequiredConstructCount: constructIds.length,
      totalWeight: constructIds.length,
      measuredWeight: 0,
      unavailableWeight: constructIds.length,
      comparisonCoverage: 0,
      minimumEvidenceRatio,
      meetsMinimumEvidence: false,
      unavailableConstructIds: Object.freeze(constructIds.map((id) => id as ConstructId)),
    }),
  };
}

export function evaluatePrimaryProfileEvidence(
  profile: PrimaryProfileRecord,
  constructsById: ReadonlyMap<ConstructId, ConstructResult>,
): ProfileEvidenceEvaluation {
  return evaluateCommitmentProfileEvidence(profile, constructsById);
}
