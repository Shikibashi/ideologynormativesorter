import { describe, expect, it } from 'vitest'
import type { AnswerMap, Question } from '../types'
import { computeIdealNonIdealGaps } from './gap'

const questions: Question[] = [
  {
    id: 'ideal-1',
    prompt: 'a',
    domain: 'state-legitimacy',
    layer: 'normative',
    theoryContext: 'ideal',
    responseType: 'likert7',
    tier: 'extensive',
    axisWeights: [{ axisId: 'authority-legitimacy', weight: 1 }],
  },
  {
    id: 'nonideal-1',
    prompt: 'b',
    domain: 'state-legitimacy',
    layer: 'normative',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    tier: 'extensive',
    axisWeights: [{ axisId: 'authority-legitimacy', weight: 1 }],
  },
  {
    id: 'mixed-1',
    prompt: 'c',
    domain: 'state-legitimacy',
    layer: 'descriptive',
    theoryContext: 'mixed',
    responseType: 'likert7',
    tier: 'extensive',
    axisWeights: [{ axisId: 'market-confidence', weight: 1 }],
  },
  {
    id: 'no-other-context',
    prompt: 'd',
    domain: 'property-ownership',
    layer: 'normative',
    theoryContext: 'ideal',
    responseType: 'likert7',
    tier: 'extensive',
    axisWeights: [{ axisId: 'property-legitimacy', weight: 1 }],
  },
]

describe('computeIdealNonIdealGaps', () => {
  it('omits domains lacking both an ideal and a nonideal answer', () => {
    const answers: AnswerMap = { 'no-other-context': { questionId: 'no-other-context', value: 3 } }
    const gaps = computeIdealNonIdealGaps(questions, answers)
    expect(gaps.find((g) => g.domain === 'property-ownership')).toBeUndefined()
  })

  it('ignores theoryContext mixed items entirely', () => {
    const answers: AnswerMap = {
      'ideal-1': { questionId: 'ideal-1', value: 3 },
      'nonideal-1': { questionId: 'nonideal-1', value: 3 },
      'mixed-1': { questionId: 'mixed-1', value: -3 },
    }
    const gaps = computeIdealNonIdealGaps(questions, answers)
    const gap = gaps.find((g) => g.domain === 'state-legitimacy')!
    expect(gap.idealItemCount).toBe(1)
    expect(gap.nonIdealItemCount).toBe(1)
  })

  it('computes the gap as ideal minus nonIdeal mean', () => {
    const answers: AnswerMap = {
      'ideal-1': { questionId: 'ideal-1', value: 3 },
      'nonideal-1': { questionId: 'nonideal-1', value: -3 },
    }
    const gaps = computeIdealNonIdealGaps(questions, answers)
    const gap = gaps.find((g) => g.domain === 'state-legitimacy')!
    expect(gap.ideal).toBeCloseTo(1)
    expect(gap.nonIdeal).toBeCloseTo(-1)
    expect(gap.gap).toBeCloseTo(2)
  })
})
