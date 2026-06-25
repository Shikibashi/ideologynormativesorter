import type { Axis, AxisId, IdeologyLabel, LabelConflationFlag, LabelMatch, Layer, ScoreBreakdown } from '../types'

const NEAREST_LABEL_COUNT = 20
/** A layer must agree at least this well to count as the "matched" layer. */
const MATCH_FLOOR = 0.7
/** Spread between best and worst layer agreement that counts as conflation. */
const DIVERGENCE_DELTA = 0.18
/** Per-axis gap (native -1..1 scale) above which an axis is "divergent". */
const AXIS_DIVERGENCE_GAP = 0.8
/** Maximum divergent axes named per flag. */
const MAX_DIVERGENT_AXES = 3

interface MeasuredScore {
   normalized: number
   itemCount: number
}

function measuredScoreMap(breakdown: ScoreBreakdown): Map<AxisId, MeasuredScore> {
   const all = [...breakdown.normative, ...breakdown.descriptive, ...breakdown.prescriptive]
   return new Map(all.map((s) => [s.axisId, { normalized: s.normalized, itemCount: s.itemCount }]))
}

function closeness(distance: number, axisCount: number): number {
   if (axisCount === 0) return 0
   const maxDistance = Math.sqrt(axisCount * 4)
   return Math.max(0, 1 - distance / maxDistance)
}

function distanceOver(scoreMap: Map<AxisId, MeasuredScore>, label: IdeologyLabel, axisIds: AxisId[]): { distance: number; measuredAxisCount: number } {
   let sumSquares = 0
   let measuredAxisCount = 0
   for (const axisId of axisIds) {
      const score = scoreMap.get(axisId)
      if (!score || score.itemCount === 0) continue
      const respondent = score.normalized
      const target = label.centroid[axisId] ?? 0
      sumSquares += (respondent - target) ** 2
      measuredAxisCount++
   }
   return { distance: measuredAxisCount > 0 ? Math.sqrt(sumSquares) : Number.POSITIVE_INFINITY, measuredAxisCount }
}

/**
 * Ranks ideology labels by Euclidean distance over the full axis vector.
 * This is a secondary, illustrative output, not the primary score.
 */
export function computeLabelMatches(breakdown: ScoreBreakdown, labels: IdeologyLabel[]): LabelMatch[] {
   const scoreMap = measuredScoreMap(breakdown)

   const matches = labels.map((label) => {
      const axisIds = Object.keys(label.centroid) as AxisId[]
      const { distance, measuredAxisCount } = distanceOver(scoreMap, label, axisIds)
      return {
         labelId: label.id,
         name: label.name,
         distance,
         confidence: measuredAxisCount > 0 ? closeness(distance, measuredAxisCount) : 0,
      }
   })

   matches.sort((a, b) => a.distance - b.distance)
   return matches.slice(0, NEAREST_LABEL_COUNT)
}

const LAYERS: Layer[] = ['normative', 'descriptive', 'prescriptive']

const LAYER_NOUN: Record<Layer, string> = {
   normative: 'moral commitments',
   descriptive: 'empirical beliefs',
   prescriptive: 'policy and strategy',
}

const LAYER_ADJ: Record<Layer, string> = {
   normative: 'normative',
   descriptive: 'descriptive',
   prescriptive: 'prescriptive',
}

/**
 * Per-layer agreement on the native -1..1 score scale.
 * Mean absolute per-axis gap mapped to [0,1]: gap 0 -> 1 (identical),
 * gap 2 -> 0 (maximally opposed). Unlike full-vector closeness, this does
 * not divide by the theoretical maximum distance, so realistic divergences
 * remain visible instead of being compressed toward 1.
 */
function layerAgreement(scoreMap: Map<AxisId, MeasuredScore>, label: IdeologyLabel, axes: Axis[], layer: Layer): number {
   const layerAxes = axes.filter((a) => a.layer === layer && label.centroid[a.id] !== undefined)
   let sumAbs = 0
   let measuredAxisCount = 0
   for (const axis of layerAxes) {
      const score = scoreMap.get(axis.id)
      if (!score || score.itemCount === 0) continue
      const respondent = score.normalized
      const target = label.centroid[axis.id] ?? 0
      sumAbs += Math.abs(respondent - target)
      measuredAxisCount++
   }
   if (measuredAxisCount === 0) return 0
   const meanAbsGap = sumAbs / measuredAxisCount
   return Math.max(0, 1 - meanAbsGap / 2)
}

function divergentAxesFor(scoreMap: Map<AxisId, MeasuredScore>, label: IdeologyLabel, axes: Axis[], layers: Layer[]): AxisId[] {
   const scored = axes
      .filter((a) => layers.includes(a.layer) && label.centroid[a.id] !== undefined)
      .flatMap((axis) => {
         const score = scoreMap.get(axis.id)
         if (!score || score.itemCount === 0) return []
         const respondent = score.normalized
         const target = label.centroid[axis.id] ?? 0
         return [{ id: axis.id, name: axis.name, gap: Math.abs(respondent - target) }]
      })
      .filter((a) => a.gap >= AXIS_DIVERGENCE_GAP)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, MAX_DIVERGENT_AXES)
   return scored.map((a) => a.id)
}

/**
 * Flags nearest-fitting labels that match the respondent on one layer (e.g.
 * moral commitments) but diverge on another (e.g. policy and strategy).
 * Such a label, taken alone, would conflate the respondent's normative,
 * descriptive, and prescriptive positions into one, hiding exactly the
 * cross-layer divergence this test exists to surface.
 */
export function computeConflatedLabels(breakdown: ScoreBreakdown, labels: IdeologyLabel[], axes: Axis[]): LabelConflationFlag[] {
   const scoreMap = measuredScoreMap(breakdown)
   const axisName = new Map(axes.map((a) => [a.id, a.name]))
   const flags: LabelConflationFlag[] = []

   for (const label of labels) {
      const agreement = {
         normative: layerAgreement(scoreMap, label, axes, 'normative'),
         descriptive: layerAgreement(scoreMap, label, axes, 'descriptive'),
         prescriptive: layerAgreement(scoreMap, label, axes, 'prescriptive'),
      } as Record<Layer, number>

      let matchedLayer: Layer = 'normative'
      for (const layer of LAYERS) {
         if (agreement[layer] > agreement[matchedLayer]) matchedLayer = layer
      }
      const best = agreement[matchedLayer]
      if (best < MATCH_FLOOR) continue

      const conflatedLayers = LAYERS.filter((l) => l !== matchedLayer && best - agreement[l] >= DIVERGENCE_DELTA)
      if (conflatedLayers.length === 0) continue

      const divergentAxes = divergentAxesFor(scoreMap, label, axes, conflatedLayers)

      const conflatedPhrase = conflatedLayers.map((l) => `${LAYER_ADJ[l]} (${LAYER_NOUN[l]})`).join(' and ')
      const axisPhrase = divergentAxes.length > 0
         ? ` Your sharpest divergences are on ${divergentAxes.map((id) => `"${axisName.get(id) ?? id}"`).join(', ')}.`
         : ''
      const reason = `You match ${label.name} on ${LAYER_ADJ[matchedLayer]} grounds (${LAYER_NOUN[matchedLayer]}), but a test that assigned this label would conflate that with your ${conflatedPhrase}, where you diverge from it.${axisPhrase}`

      flags.push({
         labelId: label.id,
         name: label.name,
         matchedLayer,
         conflatedLayers,
         layerAgreement: agreement,
         divergentAxes,
         reason,
      })
   }

   flags.sort((a, b) => (b.layerAgreement[b.matchedLayer] - Math.min(...b.conflatedLayers.map((l) => b.layerAgreement[l]))) - (a.layerAgreement[a.matchedLayer] - Math.min(...a.conflatedLayers.map((l) => a.layerAgreement[l]))))
   return flags
}
