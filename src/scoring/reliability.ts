import type {
  AxisId,
  AxisScore,
  AxisReliability,
  LabelId,
  LabelReliability,
} from "../types";

/**
 * Pragmatic evidence-coverage band for an axis score.
 * Bands are heuristics based on item count. They are not estimates of internal
 * consistency, test-retest stability, measurement error, or psychometric reliability.
 * The existing `consistency` field is retained for API compatibility but contains
 * only the normalized item-count coverage score defined here.
 */
export function reliabilityForAxis(
  score: AxisScore,
  options: { minItems?: number } = {},
): AxisReliability {
  const minItems = options.minItems ?? 3;
  const itemCount = score.itemCount || 0;
  const coverage = itemCount > 0 ? Math.min(1, itemCount / 12) : 0;

  let band: AxisReliability["band"] = "insufficient";
  if (itemCount < minItems || coverage < 0.5) {
    band = "insufficient";
  } else if (itemCount > 10 && coverage >= 0.65) {
    band = "high";
  } else if (
    (itemCount <= 10 && coverage >= 0.65) ||
    (itemCount >= 5 && coverage >= 0.8)
  ) {
    band = "medium";
  } else if (itemCount <= 5 || coverage < 0.65) {
    band = "low";
  }

  const reason =
    itemCount === 0
      ? "unmeasured"
      : `${itemCount} answered items; coverage ${coverage.toFixed(2)}`;

  return {
    axisId: score.axisId,
    band,
    consistency: coverage,
    itemCount,
    reason,
  };
}

/**
 * Evidence coverage for a label match, based on the number of answered items
 * across the label's centroid axes. This is not a validated reliability estimate.
 */
export function reliabilityForLabel(
  labelId: LabelId,
  axisScores: Map<AxisId, AxisScore>,
  labelCentroidAxes: readonly AxisId[],
): LabelReliability {
  let evidenceCount = 0;
  let measuredAxisCount = 0;
  let sufficientAxisCount = 0;
  const sparseAxes: AxisId[] = [];

  for (const axisId of labelCentroidAxes) {
    const itemCount = axisScores.get(axisId)?.itemCount ?? 0;
    evidenceCount += itemCount;
    if (itemCount > 0) measuredAxisCount += 1;
    if (itemCount >= 3) {
      sufficientAxisCount += 1;
    } else {
      sparseAxes.push(axisId);
    }
  }

  const axisCoverage =
    labelCentroidAxes.length > 0
      ? sufficientAxisCount / labelCentroidAxes.length
      : 0;

  let band: LabelReliability["band"];
  if (evidenceCount < 3 || axisCoverage < 0.4) {
    band = "insufficient";
  } else if (axisCoverage < 0.65) {
    band = "low";
  } else if (axisCoverage < 0.85 || evidenceCount <= 40) {
    band = "medium";
  } else {
    band = "high";
  }

  const sparseNote =
    sparseAxes.length > 0
      ? `; sparse axes: ${sparseAxes.slice(0, 3).join(", ")}`
      : "";

  return {
    labelId: labelId,
    band,
    evidenceCount,
    reason: `${evidenceCount} contributing answers; ${sufficientAxisCount}/${labelCentroidAxes.length} axes sufficiently measured (${measuredAxisCount} measured at all)${sparseNote}`,
  };
}
