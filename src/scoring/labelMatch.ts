import type { Axis, AxisId, IdeologyLabel, LabelConflationFlag, LabelMatch, Layer, ScoreBreakdown } from '../types'

const NEAREST_LABEL_COUNT = 3
/** A layer must agree at least this well to count as the "matched" layer. */
const MATCH_FLOOR = 0.7
/** Spread between best and worst layer agreement that counts as conflation. */
const DIVERGENCE_DELTA = 0.18
/** Per-axis gap (native -1..1 scale) above which an axis is "divergent". */
const AXIS_DIVERGENCE_GAP = 0.8
/** Maximum divergent axes named per flag. */
const MAX_DIVERGENT_AXES = 3
const SUFFICIENT_AXIS_ITEMS = 3

function axisScoreMap(breakdown: ScoreBreakdown): Map<AxisId, { normalized: number; itemCount: number }> {
   const all = [...breakdown.normative, ...breakdown.descriptive, ...breakdown.prescriptive]
   return new Map(all.map((s) => [s.axisId, { normalized: s.normalized, itemCount: s.itemCount }]))
}

function normalizedScoreMap(breakdown: ScoreBreakdown): Map<AxisId, number> {
   return new Map([...axisScoreMap(breakdown)].map(([axisId, score]) => [axisId, score.normalized]))
}

function measuredAxisIds(breakdown: ScoreBreakdown, label: IdeologyLabel): AxisId[] {
   const scores = axisScoreMap(breakdown)
   const measured = (Object.keys(label.centroid) as AxisId[]).filter((axisId) => (scores.get(axisId)?.itemCount ?? 0) > 0)
   return measured.length > 0 ? measured : Object.keys(label.centroid) as AxisId[]
}

function evidenceFactor(breakdown: ScoreBreakdown, label: IdeologyLabel): number {
   const scores = axisScoreMap(breakdown)
   const axisIds = Object.keys(label.centroid) as AxisId[]
   if (axisIds.length === 0) return 0

   const sufficientlyMeasured = axisIds.filter((axisId) => (scores.get(axisId)?.itemCount ?? 0) >= SUFFICIENT_AXIS_ITEMS).length
   return Math.sqrt(sufficientlyMeasured / axisIds.length)
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
 * Ranks ideology labels by Euclidean distance over the axes actually measured
 * by the respondent's answers. This avoids treating unasked blitz-mode axes as
 * neutral evidence against labels with non-neutral centroids.
 */
export function computeLabelMatches(breakdown: ScoreBreakdown, labels: IdeologyLabel[]): LabelMatch[] {
   const scoreMap = normalizedScoreMap(breakdown)

   const matches = labels.map((label) => {
      const axisIds = measuredAxisIds(breakdown, label)
      const distance = distanceOver(scoreMap, label, axisIds)
      return {
         labelId: label.id,
         name: label.name,
         description: label.description,
         cautionNote: label.cautionNote,
         usageNote: label.usageNote,
         distance,
         confidence: closeness(distance, axisIds.length) * evidenceFactor(breakdown, label),
      }
   })

   matches.sort((a, b) => a.distance - b.distance)
   return matches.slice(0, NEAREST_LABEL_COUNT)
}

/**
 * Resolves a faction module to its nearest sub-label. Given the
 * module-enriched score breakdown and the module's candidate subtypeLabelIds,
 * this ranks ONLY those candidate labels by full-vector centroid distance and
 * returns the best match plus the runner-up margin. This is what turns a broad
 * cluster match (e.g. "socialist") into a resolved subtype (e.g. "Council
 * Communist") using the extra signal from the module's own questions.
 */
export function computeModuleSubtype(
   breakdown: ScoreBreakdown,
   subtypeLabelIds: string[],
   labels: IdeologyLabel[],
): { labelId: string; name: string; confidence: number; runnerUpId: string | null; margin: number } | null {
   const candidates = labels.filter((l) => subtypeLabelIds.includes(l.id))
   if (candidates.length === 0) return null

   const ranked = computeAllMatches(breakdown, candidates)
   const best = ranked[0]
   const runnerUp = ranked[1] ?? null
   return {
      labelId: best.labelId,
      name: best.name,
      confidence: best.confidence,
      runnerUpId: runnerUp ? runnerUp.labelId : null,
      margin: runnerUp ? best.confidence - runnerUp.confidence : best.confidence,
   }
}

/** Ranks every supplied label by ascending distance (no top-N slice). */
function computeAllMatches(breakdown: ScoreBreakdown, labels: IdeologyLabel[]): LabelMatch[] {
   const scoreMap = normalizedScoreMap(breakdown)
   return labels
      .map((label) => {
         const axisIds = measuredAxisIds(breakdown, label)
         const distance = distanceOver(scoreMap, label, axisIds)
         return {
            labelId: label.id,
            name: label.name,
            description: label.description,
            cautionNote: label.cautionNote,
            usageNote: label.usageNote,
            distance,
            confidence: closeness(distance, axisIds.length) * evidenceFactor(breakdown, label),
         }
      })
      .sort((a, b) => a.distance - b.distance)
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
function layerAgreement(scoreMap: Map<AxisId, number>, label: IdeologyLabel, axes: Axis[], layer: Layer): number {
   const layerAxes = axes.filter((a) => a.layer === layer)
   if (layerAxes.length === 0) return 0
   let sumAbs = 0
   for (const axis of layerAxes) {
      const respondent = scoreMap.get(axis.id) ?? 0
      const target = label.centroid[axis.id] ?? 0
      sumAbs += Math.abs(respondent - target)
   }
   const meanAbsGap = sumAbs / layerAxes.length
   return Math.max(0, 1 - meanAbsGap / 2)
}

function divergentAxesFor(scoreMap: Map<AxisId, number>, label: IdeologyLabel, axes: Axis[], layers: Layer[]): AxisId[] {
   const scored = axes
      .filter((a) => layers.includes(a.layer))
      .map((axis) => {
         const respondent = scoreMap.get(axis.id) ?? 0
         const target = label.centroid[axis.id] ?? 0
         return { id: axis.id, name: axis.name, gap: Math.abs(respondent - target) }
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
   const scoreMap = normalizedScoreMap(breakdown)
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
         : ' No single divergent axis was strong enough to name.'
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
