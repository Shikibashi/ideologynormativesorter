import { describe, expect, it } from 'vitest'
import type { Answer, AnswerMap, Axis, Question } from '../types'
import { axisScoreMap, computeAxisScores, computeScoreBreakdown } from './aggregate'

const axes: Axis[] = [
  { id: 'norm-axis', layer: 'normative', name: 'N', positivePole: 'p', negativePole: 'n', description: 'd' },
  { id: 'desc-axis', layer: 'descriptive', name: 'D', positivePole: 'p', negativePole: 'n', description: 'd' },
  { id: 'presc-axis', layer: 'prescriptive', name: 'P', positivePole: 'p', negativePole: 'n', description: 'd' },
]

const questions: Question[] = [
  {
    id: 'q-norm-a',
    prompt: 'a',
    domain: 'state-legitimacy',
    layer: 'normative',
    theoryContext: 'ideal',
    responseType: 'likert7',
    tier: 'extensive',
    axisWeights: [{ axisId: 'norm-axis', weight: 1 }],
  },
  {
    id: 'q-norm-b',
    prompt: 'b',
    domain: 'state-legitimacy',
    layer: 'normative',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    tier: 'extensive',
    axisWeights: [{ axisId: 'norm-axis', weight: 0.5 }],
  },
  {
    id: 'q-desc-a',
    prompt: 'c',
    domain: 'state-legitimacy',
    layer: 'descriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    tier: 'extensive',
    axisWeights: [{ axisId: 'desc-axis', weight: 1 }],
    allowDontKnow: true,
  },
  {
    id: 'q-presc-a',
    prompt: 'd',
    domain: 'state-legitimacy',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    tier: 'extensive',
    axisWeights: [{ axisId: 'presc-axis', weight: 1 }],
  },
]

function answer(questionId: string, value: Answer['value']): AnswerMap {
  return { [questionId]: { questionId, value } }
}

describe('computeAxisScores', () => {
  it('returns normalized 0 and itemCount 0 for an unanswered axis', () => {
    const scores = computeAxisScores(questions, {}, axes)
    const normAxis = scores.find((s) => s.axisId === 'norm-axis')!
    expect(normAxis.normalized).toBe(0)
    expect(normAxis.itemCount).toBe(0)
  })

  it('weights contributions and clamps to -1..1', () => {
    const answers: AnswerMap = {
      ...answer('q-norm-a', 3),
      ...answer('q-norm-b', 3),
    }
    const scores = computeAxisScores(questions, answers, axes)
    const normAxis = scores.find((s) => s.axisId === 'norm-axis')!
    expect(normAxis.itemCount).toBe(2)
    expect(normAxis.normalized).toBeCloseTo(1)
  })

  it('excludes dont_know answers from the aggregate', () => {
    const answers = answer('q-desc-a', 'dont_know')
    const scores = computeAxisScores(questions, answers, axes)
    const descAxis = scores.find((s) => s.axisId === 'desc-axis')!
    expect(descAxis.itemCount).toBe(0)
    expect(descAxis.normalized).toBe(0)
  })

  it('only contributes to axes referenced by the question, regardless of other layers', () => {
    const answers: AnswerMap = {
      ...answer('q-norm-a', 3),
      ...answer('q-desc-a', 3),
      ...answer('q-presc-a', -3),
    }
    const scores = computeAxisScores(questions, answers, axes)
    expect(scores.find((s) => s.axisId === 'norm-axis')!.itemCount).toBe(1)
    expect(scores.find((s) => s.axisId === 'desc-axis')!.itemCount).toBe(1)
    expect(scores.find((s) => s.axisId === 'presc-axis')!.itemCount).toBe(1)
  })
})

describe('computeScoreBreakdown', () => {
  it('separates axis scores by layer', () => {
    const answers: AnswerMap = {
      ...answer('q-norm-a', 3),
      ...answer('q-desc-a', 3),
      ...answer('q-presc-a', 3),
    }
    const breakdown = computeScoreBreakdown(questions, answers, axes)
    expect(breakdown.normative.map((s) => s.axisId)).toEqual(['norm-axis'])
    expect(breakdown.descriptive.map((s) => s.axisId)).toEqual(['desc-axis'])
    expect(breakdown.prescriptive.map((s) => s.axisId)).toEqual(['presc-axis'])
  })

  it('axisScoreMap indexes all layers by axisId', () => {
    const breakdown = computeScoreBreakdown(questions, {}, axes)
    const map = axisScoreMap(breakdown)
    expect(map.size).toBe(3)
    expect(map.get('desc-axis')?.layer).toBe('descriptive')
  })
})
