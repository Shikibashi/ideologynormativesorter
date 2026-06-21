import type { Axis, AxisId, ConfoundedLabelFlag, IdeologyLabel, Layer, LabelMatch, ScoreBreakdown } from '../types'

const NEAREST_LABEL_COUNT = 3
const CLOSENESS_FLOOR = 0.6
const LAYER_DIVERGENCE_THRESHOLD = 0.35

function normalizedScoreMap(breakdown: ScoreBreakdown): Map<AxisId, number> {
  const all = [...breakdown.normative, ...breakdown.descriptive, ...breakdown.prescriptive]
  return new Map(all.map((s) => [s.axisId, s.normalized]))
}

function closeness(distance: number, axisCount: number): number {
  if (axisCount === 0) return 0
  const maxDistance = Math.sqrt(axisCount * 4)
  return Math.max(0, 1 - distance / maxDistance)
}

function distanceOver(scoreMap: Map<AxisId, number>, label: IdeologyLabel, axisIds: AxisId[]): number {
  let sumSquares = 0
  for (const axisId of axisIds) {
    const respondent = scoreMap.get(axisId) ?? 0
    const target = label.centroid[axisId] ?? 0
    sumSquares += (respondent - target) ** 2
  }
  return Math.sqrt(sumSquares)
}

/**
 * Ranks ideology labels by Euclidean distance over the full axis vector.
 * This is a secondary, illustrative output, not the primary score.
 */
export function computeLabelMatches(breakdown: ScoreBreakdown, labels: IdeologyLabel[]): LabelMatch[] {
  const scoreMap = normalizedScoreMap(breakdown)

  const matches = labels.map((label) => {
    const axisIds = Object.keys(label.centroid) as AxisId[]
    const distance = distanceOver(scoreMap, label, axisIds)
    return {
      labelId: label.id,
      name: label.name,
      distance,
      confidence: closeness(distance, axisIds.length),
    }
  })

  matches.sort((a, b) => a.distance - b.distance)
  return matches.slice(0, NEAREST_LABEL_COUNT)
}

function layerClosenessFor(scoreMap: Map<AxisId, number>, label: IdeologyLabel, axes: Axis[], layer: Layer): number {
  const axisIds = axes.filter((a) => a.layer === layer).map((a) => a.id)
  const distance = distanceOver(scoreMap, label, axisIds)
  return closeness(distance, axisIds.length)
}

function mostDivergentAxis(scoreMap: Map<AxisId, number>, label: IdeologyLabel, axes: Axis[], layer: Layer): Axis | null {
  let worst: Axis | null = null
  let worstGap = -Infinity
  for (const axis of axes.filter((a) => a.layer === layer)) {
    const respondent = scoreMap.get(axis.id) ?? 0
    const target = label.centroid[axis.id] ?? 0
    const gap = Math.abs(respondent - target)
    if (gap > worstGap) {
      worstGap = gap
      worst = axis
    }
  }
  return worst
}

/**
 * Flags labels that look like a close match in one layer (e.g. normative
 * values) but diverge sharply in another (e.g. prescriptive remedies),
 * so a respondent isn't reduced to a single label that hides that split.
 */
export function computeConfoundedLabels(breakdown: ScoreBreakdown, labels: IdeologyLabel[], axes: Axis[]): ConfoundedLabelFlag[] {
  const scoreMap = normalizedScoreMap(breakdown)
  const layers: Layer[] = ['normative', 'descriptive', 'prescriptive']
  const flags: ConfoundedLabelFlag[] = []

  for (const label of labels) {
    const closenessByLayer = new Map(layers.map((layer) => [layer, layerClosenessFor(scoreMap, label, axes, layer)]))

    let closestLayer: Layer | null = null
    let closestValue = -Infinity
    let farthestLayer: Layer | null = null
    let farthestValue = Infinity
    for (const layer of layers) {
      const value = closenessByLayer.get(layer)!
      if (value > closestValue) {
        closestValue = value
        closestLayer = layer
      }
      if (value < farthestValue) {
        farthestValue = value
        farthestLayer = layer
      }
    }

    if (!closestLayer || !farthestLayer) continue
    if (closestValue < CLOSENESS_FLOOR) continue
    if (closestValue - farthestValue < LAYER_DIVERGENCE_THRESHOLD) continue

    const divergentAxis = mostDivergentAxis(scoreMap, label, axes, farthestLayer)
    const axisPhrase = divergentAxis ? ` particularly on "${divergentAxis.name}"` : ''
    flags.push({
      labelId: label.id,
      name: label.name,
      reason: `Closely matches ${label.name} on ${closestLayer} grounds, but diverges on ${farthestLayer} grounds${axisPhrase}, so this label alone would overstate the match.`,
    })
  }

  return flags
}
