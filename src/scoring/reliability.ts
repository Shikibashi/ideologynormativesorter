import type { AxisId, AxisScore, AxisReliability, LabelId, LabelReliability } from '../types'

/**
 * Pragmatic reliability band for an axis score.
 * Bands are heuristics based on itemCount (which scales consistency).
 * Not a validated psychometric measure.
 */
export function reliabilityForAxis(score: AxisScore, options: { minItems?: number } = {}): AxisReliability {
  const minItems = options.minItems ?? 3
  const itemCount = score.itemCount || 0
  const consistency = itemCount > 0 ? Math.min(1, itemCount / 12) : 0

  let band: AxisReliability['band'] = 'insufficient'
  if (itemCount < minItems || consistency < 0.5) {
    band = 'insufficient'
  } else if (itemCount > 10 && consistency >= 0.65) {
    band = 'high'
  } else if ((itemCount <= 10 && consistency >= 0.65) || (itemCount >= 5 && consistency >= 0.8)) {
    band = 'medium'
  } else if (itemCount <= 5 || consistency < 0.65) {
    band = 'low'
  }

  const reason = itemCount === 0
    ? 'unmeasured'
    : `${itemCount} items (consistency ${consistency.toFixed(2)})`

  return {
    axisId: score.axisId,
    band,
    consistency,
    itemCount,
    reason
  }
}

/**
 * Reliability for a label match, based on total evidence count across the label's centroid axes.
 */
export function reliabilityForLabel(
  labelId: LabelId,
  axisScores: Map<AxisId, AxisScore>,
  labelCentroidAxes: AxisId[]
): LabelReliability {
  let evidenceCount = 0
  for (const axisId of labelCentroidAxes) {
    const s = axisScores.get(axisId)
    if (s) evidenceCount += s.itemCount || 0
  }

  let band: LabelReliability['band']
  if (evidenceCount < 3) {
    band = 'insufficient'
  } else if (evidenceCount <= 5) {
    band = 'low'
  } else if (evidenceCount <= 10) {
    band = 'medium'
  } else {
    band = 'high'
  }

  return {
    labelId: labelId,
    band,
    evidenceCount,
    reason: `${evidenceCount} contributing answers across centroid axes`
  }
}