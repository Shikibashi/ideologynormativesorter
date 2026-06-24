import { describe, expect, it } from 'vitest'
import type { AxisScore, LabelMatch } from '../types'
import { reliabilityForAxis, reliabilityForLabel } from './reliability'

describe('reliabilityForAxis', () => {
  it('returns insufficient for 0 items', () => {
    const score: AxisScore = { axisId: 'test', layer: 'normative', raw: 0, normalized: 0, itemCount: 0 }
    const r = reliabilityForAxis(score)
    expect(r.band).toBe('insufficient')
    expect(r.itemCount).toBe(0)
  })

  it('returns high for many items', () => {
    const score: AxisScore = { axisId: 'test', layer: 'normative', raw: 5, normalized: 0.8, itemCount: 12 }
    const r = reliabilityForAxis(score)
    expect(r.band).toBe('high')
  })

  it('respects minItems option', () => {
    const score: AxisScore = { axisId: 'test', layer: 'normative', raw: 1, normalized: 0.5, itemCount: 4 }
    const r = reliabilityForAxis(score, { minItems: 5 })
    expect(r.band).toBe('insufficient')
  })
})

describe('reliabilityForLabel', () => {
  it('computes evidenceCount from centroid axes', () => {
    const match: LabelMatch = { labelId: 'test-label', name: 'Test', distance: 0, confidence: 0.9 }
    const axisScores = new Map([
      ['ax1', { axisId: 'ax1', layer: 'normative', raw: 0, normalized: 0, itemCount: 5 } as AxisScore],
      ['ax2', { axisId: 'ax2', layer: 'normative', raw: 0, normalized: 0, itemCount: 7 } as AxisScore],
    ])
    const r = reliabilityForLabel(match.labelId, axisScores, ['ax1', 'ax2'])
    expect(r.evidenceCount).toBe(12)
    expect(r.band).toBe('high')
  })
})