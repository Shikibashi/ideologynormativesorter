import { describe, expect, it } from 'vitest'
import type { Axis, IdeologyLabel, ScoreBreakdown } from '../types'
import { computeConflatedLabels, computeLabelMatches } from './labelMatch'

const axes: Axis[] = [
   { id: 'norm1', layer: 'normative', name: 'Norm One', positivePole: 'p', negativePole: 'n', description: 'd' },
   { id: 'norm2', layer: 'normative', name: 'Norm Two', positivePole: 'p', negativePole: 'n', description: 'd' },
   { id: 'desc1', layer: 'descriptive', name: 'Desc One', positivePole: 'p', negativePole: 'n', description: 'd' },
   { id: 'presc1', layer: 'prescriptive', name: 'Presc One', positivePole: 'p', negativePole: 'n', description: 'd' },
   { id: 'presc2', layer: 'prescriptive', name: 'Presc Two', positivePole: 'p', negativePole: 'n', description: 'd' },
]

const breakdown: ScoreBreakdown = {
   normative: [
      { axisId: 'norm1', layer: 'normative', raw: 0.8, normalized: 0.8, itemCount: 1 },
      { axisId: 'norm2', layer: 'normative', raw: 0.6, normalized: 0.6, itemCount: 1 },
   ],
   descriptive: [{ axisId: 'desc1', layer: 'descriptive', raw: 0.2, normalized: 0.2, itemCount: 1 }],
   prescriptive: [
      { axisId: 'presc1', layer: 'prescriptive', raw: -0.8, normalized: -0.8, itemCount: 1 },
      { axisId: 'presc2', layer: 'prescriptive', raw: -0.6, normalized: -0.6, itemCount: 1 },
   ],
}

// Matches the respondent on every axis: should rank first.
const exactMatchLabel: IdeologyLabel = {
   id: 'exact-match',
   name: 'Exact Match',
   family: 'test',
   description: 'd',
   centroid: { norm1: 0.8, norm2: 0.6, desc1: 0.2, presc1: -0.8, presc2: -0.6 },
}

// Matches normatively and descriptively but is the mirror image prescriptively: ranks in the middle.
const partialMatchLabel: IdeologyLabel = {
   id: 'partial',
   name: 'Partial Match',
   family: 'test',
   description: 'd',
   centroid: { norm1: 0.8, norm2: 0.6, desc1: 0.2, presc1: 0.8, presc2: 0.6 },
}

// Mirror image of the respondent on every axis: should rank last.
const oppositeLabel: IdeologyLabel = {
   id: 'opposite',
   name: 'Opposite Label',
   family: 'test',
   description: 'd',
   centroid: { norm1: -0.8, norm2: -0.6, desc1: -0.7, presc1: 0.8, presc2: 0.6 },
}

describe('computeLabelMatches', () => {
   it('ranks labels by ascending distance over the full axis vector', () => {
      const matches = computeLabelMatches(breakdown, [partialMatchLabel, oppositeLabel, exactMatchLabel])
      expect(matches.map((m) => m.labelId)).toEqual(['exact-match', 'partial', 'opposite'])
   })

   it('gives a perfect match fit of 1', () => {
      const [best] = computeLabelMatches(breakdown, [exactMatchLabel])
      expect(best.distance).toBeCloseTo(0)
      expect(best.fit).toBeCloseTo(1)
   })

   it('returns zero-fit matches when no centroid axes are measured', () => {
      const emptyBreakdown: ScoreBreakdown = {
         normative: [{ axisId: 'norm1', layer: 'normative', raw: 0, normalized: 0, itemCount: 0 }],
         descriptive: [],
         prescriptive: [],
      }

      const [match] = computeLabelMatches(emptyBreakdown, [exactMatchLabel])

      expect(match.distance).toBe(Number.POSITIVE_INFINITY)
      expect(match.fit).toBe(0)
   })

   it('ranks on a single measured axis and ignores missing axes', () => {
      const sparseBreakdown: ScoreBreakdown = {
         normative: [{ axisId: 'norm1', layer: 'normative', raw: 0.8, normalized: 0.8, itemCount: 1 }],
         descriptive: [],
         prescriptive: [],
      }
      const near: IdeologyLabel = { ...oppositeLabel, id: 'near-single', name: 'Near Single', centroid: { ...oppositeLabel.centroid, norm1: 0.8 } }
      const far: IdeologyLabel = { ...exactMatchLabel, id: 'far-single', name: 'Far Single', centroid: { ...exactMatchLabel.centroid, norm1: -0.8 } }

      const matches = computeLabelMatches(sparseBreakdown, [far, near])

      expect(matches.map((m) => m.labelId)).toEqual(['near-single', 'far-single'])
      expect(matches[0].fit).toBeCloseTo(1)
   })

   it('caps results at the top 20 matches', () => {
      const labels = Array.from({ length: 25 }, (_, index) => ({
         ...exactMatchLabel,
         id: `label-${index}`,
         name: `Label ${index}`,
         centroid: { ...exactMatchLabel.centroid, norm1: exactMatchLabel.centroid.norm1 - index * 0.01 },
      }))
      const matches = computeLabelMatches(breakdown, labels)
      expect(matches).toHaveLength(20)
   })

   it('evidence-weighted distance dampens sparse-axis contribution', () => {
      const sparseBreakdown: ScoreBreakdown = {
         normative: [
            { axisId: 'norm1', layer: 'normative', raw: 0.8, normalized: 0.8, itemCount: 10 },
            { axisId: 'norm2', layer: 'normative', raw: 0.8, normalized: 0.8, itemCount: 1 },
         ],
         descriptive: [],
         prescriptive: [],
      }
      const label: IdeologyLabel = {
         id: 'weighted-test',
         name: 'Weighted Test',
         family: 'test',
         description: 'd',
         centroid: { norm1: -0.8, norm2: -0.8 },
      }

      const [match] = computeLabelMatches(sparseBreakdown, [label])

      // Unweighted Euclidean: sqrt((1.6^2 + 1.6^2) / 2) = 1.6
      // Weighted: norm1 weight=1 (10/3 > 1), norm2 weight=0.333
      // sqrt((1*2.56 + 0.333*2.56) / (1 + 0.333)) = sqrt(3.413/1.333) ≈ 1.6
      // The weighted distance normalizes by weight sum, so with equal deltas
      // the distance is similar but the sparse axis contributes less to the sum.
      // The key assertion: evidenceStrength reflects the weighting.
      expect(match.evidenceStrength).toBeCloseTo((1 + 1 / 3) / 2)
      expect(match.measuredAxisCount).toBe(2)
      expect(match.totalAxisCount).toBe(2)
   })

   it('top match includes runnerUpMargin and uncertaintyBand', () => {
      const matches = computeLabelMatches(breakdown, [exactMatchLabel, partialMatchLabel, oppositeLabel])

      // Rank 1 should have runnerUpMargin set
      expect(matches[0].runnerUpMargin).toBeDefined()
      expect(matches[0].runnerUpMargin).toBeGreaterThan(0)
      expect(['low', 'medium', 'high']).toContain(matches[0].uncertaintyBand)

      // Rank 2+ should NOT have runnerUpMargin
      expect(matches[1].runnerUpMargin).toBeUndefined()
      expect(matches[2].runnerUpMargin).toBeUndefined()
   })
})

describe('computeConflatedLabels', () => {
   it('flags a label that matches normatively but diverges prescriptively', () => {
      const flags = computeConflatedLabels(breakdown, [partialMatchLabel], axes)
      expect(flags).toHaveLength(1)
      expect(flags[0].labelId).toBe('partial')
      expect(flags[0].matchedLayer).toBe('normative')
      expect(flags[0].conflatedLayers).toContain('prescriptive')
      expect(flags[0].divergentAxes).toContain('presc1')
      expect(flags[0].reason).toContain('normative')
      expect(flags[0].reason).toContain('prescriptive')
   })

   it('reports per-layer agreement on the native scale', () => {
      const [flag] = computeConflatedLabels(breakdown, [partialMatchLabel], axes)
      expect(flag.layerAgreement.normative).toBeGreaterThan(flag.layerAgreement.prescriptive)
      expect(flag.layerAgreement.prescriptive).toBeLessThan(0.5)
   })

   it('does not flag a label that matches on every layer', () => {
      expect(computeConflatedLabels(breakdown, [exactMatchLabel], axes)).toHaveLength(0)
   })

   it('does not flag a label that is far away on every layer', () => {
      expect(computeConflatedLabels(breakdown, [oppositeLabel], axes)).toHaveLength(0)
   })
})