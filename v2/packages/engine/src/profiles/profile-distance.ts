import type { PrimaryProfileConstructComparison } from "../../../contracts/src/profiles";

export const PROFILE_MAX_DISTANCE = 2;

export interface ProfileDistanceResult {
  readonly distance: number;
  readonly similarity: number;
  readonly measuredConstructCount: number;
  readonly measuredWeight: number;
}

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
