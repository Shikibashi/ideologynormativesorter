import type { PrimaryProfileConstructComparison } from "../../../contracts/src/profiles";

export const PROFILE_MAX_DISTANCE = 2;

export interface ProfileDistanceResult {
  readonly distance: number;
  readonly similarity: number;
  readonly measuredConstructCount: number;
  readonly measuredWeight: number;
}

/**
 * Legacy compatibility calculation for synthetic/migration fixtures only.
 * Production primary ideology profiles use computeCommitmentAffinity instead.
 */
export function computeProfileDistance(
  comparisons: readonly PrimaryProfileConstructComparison[],
): ProfileDistanceResult {
  const included = comparisons.filter((comparison) => comparison.included);
  const measuredWeight = included.reduce((sum, comparison) => sum + comparison.weight, 0);
  const weightedSquaredDistance = included.reduce(
    (sum, comparison) => sum + (comparison.weightedSquaredError ?? 0),
    0,
  );
  if (
    included.length === 0 ||
    measuredWeight <= 0 ||
    !Number.isFinite(weightedSquaredDistance)
  ) {
    return {
      distance: Number.POSITIVE_INFINITY,
      similarity: 0,
      measuredConstructCount: 0,
      measuredWeight: 0,
    };
  }
  const distance = Math.sqrt(weightedSquaredDistance / measuredWeight);
  const similarity = Number.isFinite(distance)
    ? Math.max(0, Math.min(1, 1 - distance / PROFILE_MAX_DISTANCE))
    : 0;
  return {
    distance,
    similarity,
    measuredConstructCount: included.length,
    measuredWeight,
  };
}

/**
 * Commitment affinity is the weighted share of evaluated core/characteristic
 * commitments whose explicit criteria are supported. There is no target vector,
 * Euclidean/RMS location, or expectation that every ideology takes a position on
 * every construct.
 *
 * The `distance` field is retained only as a result-contract compatibility alias
 * for `1 - affinity`; it is not geometric distance from an ideology centroid.
 */
export function computeCommitmentAffinity(
  comparisons: readonly PrimaryProfileConstructComparison[],
): ProfileDistanceResult {
  const included = comparisons.filter(
    (comparison) =>
      comparison.included &&
      comparison.weight > 0 &&
      comparison.weightedSquaredError !== null,
  );
  const measuredWeight = included.reduce((sum, comparison) => sum + comparison.weight, 0);
  if (included.length === 0 || measuredWeight <= 0) {
    return {
      distance: Number.POSITIVE_INFINITY,
      similarity: 0,
      measuredConstructCount: 0,
      measuredWeight: 0,
    };
  }
  const mismatchWeight = included.reduce(
    (sum, comparison) => sum + (comparison.weightedSquaredError ?? 0),
    0,
  );
  const mismatchRatio = Math.max(0, Math.min(1, mismatchWeight / measuredWeight));
  const affinity = 1 - mismatchRatio;
  return {
    distance: mismatchRatio,
    similarity: affinity,
    measuredConstructCount: included.length,
    measuredWeight,
  };
}
