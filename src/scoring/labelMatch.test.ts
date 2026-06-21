import { describe, expect, it } from 'vitest'
import type { Axis, IdeologyLabel, ScoreBreakdown } from '../types'
import { computeConfoundedLabels, computeLabelMatches } from './labelMatch'

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

// Matches the respondent on every axis: should rank first and never be confounded.
const exactMatchLabel: IdeologyLabel = {
  id: 'exact-match',
  name: 'Exact Match',
  family: 'test',
  description: 'd',
  centroid: { norm1: 0.8, norm2: 0.6, desc1: 0.2, presc1: -0.8, presc2: -0.6 },
}

// Matches the respondent normatively and descriptively but is the mirror image prescriptively.
const confoundedLabel: IdeologyLabel = {
  id: 'confounded',
  name: 'Confounded Label',
  family: 'test',
  description: 'd',
  centroid: { norm1: 0.8, norm2: 0.6, desc1: 0.2, presc1: 0.8, presc2: 0.6 },
}

// Mirror image of the respondent on every axis: should rank last and not be flagged (no layer is actually close).
const oppositeLabel: IdeologyLabel = {
  id: 'opposite',
  name: 'Opposite Label',
  family: 'test',
  description: 'd',
  centroid: { norm1: -0.8, norm2: -0.6, desc1: -0.7, presc1: 0.8, presc2: 0.6 },
}

describe('computeLabelMatches', () => {
  it('ranks labels by ascending distance over the full axis vector', () => {
    const matches = computeLabelMatches(breakdown, [confoundedLabel, oppositeLabel, exactMatchLabel])
    expect(matches.map((m) => m.labelId)).toEqual(['exact-match', 'confounded', 'opposite'])
  })

  it('gives a perfect match confidence of 1', () => {
    const [best] = computeLabelMatches(breakdown, [exactMatchLabel])
    expect(best.distance).toBeCloseTo(0)
    expect(best.confidence).toBeCloseTo(1)
  })

  it('caps results at the top 3 matches', () => {
    const labels = [exactMatchLabel, confoundedLabel, oppositeLabel, { ...exactMatchLabel, id: 'dup' }]
    const matches = computeLabelMatches(breakdown, labels)
    expect(matches).toHaveLength(3)
  })
})

describe('computeConfoundedLabels', () => {
  it('flags a label that is close normatively but diverges prescriptively', () => {
    const flags = computeConfoundedLabels(breakdown, [confoundedLabel], axes)
    expect(flags).toHaveLength(1)
    expect(flags[0].labelId).toBe('confounded')
    expect(flags[0].reason).toContain('normative')
    expect(flags[0].reason).toContain('prescriptive')
    expect(flags[0].reason).toContain('Presc One')
  })

  it('does not flag a label that matches on every layer', () => {
    const flags = computeConfoundedLabels(breakdown, [exactMatchLabel], axes)
    expect(flags).toHaveLength(0)
  })

  it('does not flag a label that is simply far away on every layer', () => {
    const flags = computeConfoundedLabels(breakdown, [oppositeLabel], axes)
    expect(flags).toHaveLength(0)
  })
})
