import { describe, expect, it } from 'vitest'
import type { Axis, IdeologyLabel, ScoreBreakdown } from '../types'
import { computeConflatedLabels, computeLabelMatches, computeModifierMatches } from './labelMatch'

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

   it('attaches reasoning breakdowns for the top matches', () => {
      const [best, partial, opposite] = computeLabelMatches(breakdown, [exactMatchLabel, partialMatchLabel, oppositeLabel])
      
      // Exact match should have strong shared extreme axes and no divergent axes.
      expect(best.reasoning).toBeDefined()
      expect(best.reasoning?.sharedExtremeAxes.length).toBeGreaterThan(0)
      expect(best.reasoning?.divergentAxes).toHaveLength(0)
      
      // Partial match has some shared extremes (norm1, norm2) and some strong divergences (presc1, presc2)
      expect(partial.reasoning).toBeDefined()
      expect(partial.reasoning?.sharedExtremeAxes.map(a => a.axisId)).toEqual(expect.arrayContaining(['norm1', 'norm2']))
      expect(partial.reasoning?.divergentAxes.map(a => a.axisId)).toEqual(expect.arrayContaining(['presc1', 'presc2']))

      // Opposite has only divergences and no shared extremes.
      expect(opposite.reasoning).toBeDefined()
      expect(opposite.reasoning?.sharedExtremeAxes).toHaveLength(0)
      expect(opposite.reasoning?.divergentAxes.length).toBeGreaterThan(0)
   })

   it('reports independent layer evidence without changing the overall ranking', () => {
      const ranked = computeLabelMatches(breakdown, [partialMatchLabel, oppositeLabel, exactMatchLabel], axes)
      const partial = ranked.find((match) => match.labelId === 'partial')

      expect(ranked.map((match) => match.labelId)).toEqual(['exact-match', 'partial', 'opposite'])
      expect(partial?.layerEvidence?.normative.fit).toBeCloseTo(1)
      expect(partial?.layerEvidence?.descriptive.fit).toBeCloseTo(1)
      expect(partial?.layerEvidence?.prescriptive.fit).toBeLessThan(0.3)
      expect(partial?.layerEvidence?.normative).toMatchObject({ measuredAxisCount: 2, totalAxisCount: 2 })
      expect(partial?.layerEvidence?.prescriptive).toMatchObject({ measuredAxisCount: 2, totalAxisCount: 2 })
   })

   it('marks a layer as unmeasured instead of treating it as neutral evidence', () => {
      const sparseBreakdown: ScoreBreakdown = {
         normative: [{ axisId: 'norm1', layer: 'normative', raw: 0.8, normalized: 0.8, itemCount: 1 }],
         descriptive: [],
         prescriptive: [],
      }

      const [match] = computeLabelMatches(sparseBreakdown, [exactMatchLabel], axes)

      expect(match.layerEvidence?.normative.fit).toBeCloseTo(1)
      expect(match.layerEvidence?.descriptive.fit).toBeNull()
      expect(match.layerEvidence?.prescriptive.fit).toBeNull()
   })

   it('gives a maximally opposite profile a zero fit regardless of axis count', () => {
      const oppositeBreakdown: ScoreBreakdown = {
         normative: [
            { axisId: 'norm1', layer: 'normative', raw: 1, normalized: 1, itemCount: 3 },
            { axisId: 'norm2', layer: 'normative', raw: 1, normalized: 1, itemCount: 3 },
         ],
         descriptive: [{ axisId: 'desc1', layer: 'descriptive', raw: 1, normalized: 1, itemCount: 3 }],
         prescriptive: [
            { axisId: 'presc1', layer: 'prescriptive', raw: 1, normalized: 1, itemCount: 3 },
            { axisId: 'presc2', layer: 'prescriptive', raw: 1, normalized: 1, itemCount: 3 },
         ],
      }
      const label: IdeologyLabel = {
         id: 'max-opposite',
         name: 'Max Opposite',
         family: 'test',
         description: 'd',
         centroid: { norm1: -1, norm2: -1, desc1: -1, presc1: -1, presc2: -1 },
      }

      const [match] = computeLabelMatches(oppositeBreakdown, [label])

      expect(match.distance).toBeCloseTo(2)
      expect(match.fit).toBe(0)
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

   it('uses a label scoring scope and withholds it until every required core construct is measured', () => {
      const scoped: IdeologyLabel = {
         ...exactMatchLabel,
         id: 'scoped',
         centroid: { ...exactMatchLabel.centroid, norm1: 0.8, desc1: -1 },
         scoringScope: {
            version: 'test',
            axisIds: ['norm1'],
            requiredAxisIds: ['norm1'],
            sourceIds: ['test-source'],
            rationale: 'Test-only scope.',
         },
      }

      const unmeasured = computeLabelMatches({
         normative: [{ axisId: 'norm1', layer: 'normative', raw: 0, normalized: 0, itemCount: 0 }],
         descriptive: [{ axisId: 'desc1', layer: 'descriptive', raw: -1, normalized: -1, itemCount: 3 }],
         prescriptive: [],
      }, [scoped], axes)
      expect(unmeasured).toEqual([])

      const measured = computeLabelMatches({
         normative: [{ axisId: 'norm1', layer: 'normative', raw: 0.8, normalized: 0.8, itemCount: 3 }],
         descriptive: [{ axisId: 'desc1', layer: 'descriptive', raw: -1, normalized: -1, itemCount: 3 }],
         prescriptive: [],
      }, [scoped], axes)
      expect(measured[0]).toMatchObject({
         labelId: 'scoped',
         coreGateStatus: 'passed',
         measuredAxisCount: 1,
         totalAxisCount: 1,
         fit: 1,
      })
      expect(measured[0].reasoning?.sharedExtremeAxes.map((axis) => axis.axisId)).toEqual(['norm1'])
      expect(measured[0].layerEvidence?.descriptive.fit).toBeNull()
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

   it('does not penalize blitz results for axes that were not measured', () => {
      const sparseBreakdown: ScoreBreakdown = {
         normative: [
            { axisId: 'norm1', layer: 'normative', raw: 0.8, normalized: 0.8, itemCount: 1 },
            { axisId: 'norm2', layer: 'normative', raw: 0, normalized: 0, itemCount: 0 },
         ],
         descriptive: [{ axisId: 'desc1', layer: 'descriptive', raw: 0, normalized: 0, itemCount: 0 }],
         prescriptive: [
            { axisId: 'presc1', layer: 'prescriptive', raw: 0, normalized: 0, itemCount: 0 },
            { axisId: 'presc2', layer: 'prescriptive', raw: 0, normalized: 0, itemCount: 0 },
         ],
      }
      const measuredMatch: IdeologyLabel = {
         ...exactMatchLabel,
         id: 'measured-match',
         centroid: { norm1: 0.8, norm2: -1, desc1: -1, presc1: -1, presc2: -1 },
      }
      const measuredMiss: IdeologyLabel = {
         ...exactMatchLabel,
         id: 'measured-miss',
         centroid: { norm1: -0.8, norm2: 0, desc1: 0, presc1: 0, presc2: 0 },
      }

      const matches = computeLabelMatches(sparseBreakdown, [measuredMiss, measuredMatch])

      expect(matches[0].labelId).toBe('measured-match')
      expect(matches[0].distance).toBeCloseTo(0)
   })

   it('withholds compound labels when a constitutive commitment is absent or contradicted', () => {
      const label: IdeologyLabel = {
         id: 'fascist-authoritarian',
         name: 'Fascist Authoritarianism',
         family: 'test',
         description: 'd',
         centroid: {
            'authority-legitimacy': 0.8,
            'liberty-noninterference': -0.8,
            'political-community-boundary': -0.8,
            'democratic-confidence': -0.8,
            'centralization-preference': 0.8,
            'coercion-strategy': 0.8,
         },
      }
      const score = (axisId: string, normalized: number) => ({
         axisId: axisId as Axis['id'],
         layer: 'normative' as const,
         raw: normalized,
         normalized,
         itemCount: 3,
      })

      const complete = computeLabelMatches({
         normative: [
            score('authority-legitimacy', 0.8),
            score('liberty-noninterference', -0.8),
            score('political-community-boundary', -0.8),
            score('democratic-confidence', -0.8),
            score('centralization-preference', 0.8),
            score('coercion-strategy', 0.8),
         ],
         descriptive: [],
         prescriptive: [],
      }, [label])
      expect(complete[0]?.compoundGateStatus).toBe('passed')

      const contradicted = computeLabelMatches({
         normative: [
            score('authority-legitimacy', 0.8),
            score('liberty-noninterference', -0.8),
            score('political-community-boundary', 0.8),
            score('democratic-confidence', -0.8),
            score('centralization-preference', 0.8),
            score('coercion-strategy', 0.8),
         ],
         descriptive: [],
         prescriptive: [],
      }, [label])
      expect(contradicted).toEqual([])

      const sparse = computeLabelMatches({
         normative: [score('authority-legitimacy', 0.8)],
         descriptive: [],
         prescriptive: [],
      }, [label])
      expect(sparse).toEqual([])
   })
})

describe('computeModifierMatches', () => {
   it('keeps only sufficiently supported modifiers and caps the public list at five', () => {
      const strongBreakdown: ScoreBreakdown = {
         normative: breakdown.normative.map((score) => ({ ...score, itemCount: 3 })),
         descriptive: breakdown.descriptive.map((score) => ({ ...score, itemCount: 3 })),
         prescriptive: breakdown.prescriptive.map((score) => ({ ...score, itemCount: 3 })),
      }
      const labels: IdeologyLabel[] = Array.from({ length: 7 }, (_, index) => ({
         id: `modifier-${index}`,
         name: `Modifier ${index}`,
         family: 'modifier',
         description: 'd',
         centroid: { ...exactMatchLabel.centroid, norm1: 0.8 - index * 0.17 },
      }))

      const matches = computeModifierMatches(strongBreakdown, labels)

      expect(matches).toHaveLength(5)
      expect(matches.map((match) => match.labelId)).toEqual([
         'modifier-0',
         'modifier-1',
         'modifier-2',
         'modifier-3',
         'modifier-4',
      ])
      expect(matches.every((match) => match.fit >= 0.65)).toBe(true)
      expect(matches.every((match) => match.evidenceStrength >= 0.4)).toBe(true)
      expect(matches.every((match) => match.uncertaintyBand !== 'high')).toBe(true)
   })

   it('abstains when a modifier has sparse evidence even if its measured fit is exact', () => {
      const sparseExact = computeModifierMatches(
         {
            normative: [{ axisId: 'norm1', layer: 'normative', raw: 0.8, normalized: 0.8, itemCount: 1 }],
            descriptive: [],
            prescriptive: [],
         },
         [{ ...exactMatchLabel, id: 'sparse-modifier' }],
      )

      expect(sparseExact).toEqual([])
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
      expect(flags[0].reason).not.toContain('Your sharpest divergences are.')
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

   it('does not turn a scoped label’s unmeasured layer into a false divergence', () => {
      const sparseBreakdown: ScoreBreakdown = {
         normative: [{ axisId: 'norm1', layer: 'normative', raw: 0.8, normalized: 0.8, itemCount: 1 }],
         descriptive: [],
         prescriptive: [],
      }
      const scopedLabel: IdeologyLabel = {
         id: 'scoped-one-layer',
         name: 'Scoped one-layer label',
         family: 'test',
         description: 'd',
         centroid: { norm1: 0.8, presc1: 0.8 },
         scoringScope: {
            version: 'test-primary-scope',
            axisIds: ['norm1', 'presc1'],
            requiredAxisIds: ['norm1'],
            sourceIds: ['test-source'],
            rationale: 'Test only.',
         },
      }

      expect(computeConflatedLabels(sparseBreakdown, [scopedLabel], axes)).toEqual([])
   })
})
