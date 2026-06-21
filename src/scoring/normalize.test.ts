import { describe, expect, it } from 'vitest'
import type { Question } from '../types'
import { normalizeAnswer } from './normalize'

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'q1',
    prompt: 'test',
    domain: 'state-legitimacy',
    layer: 'normative',
    theoryContext: 'ideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'authority-legitimacy', weight: 1 }],
    ...overrides,
  }
}

describe('normalizeAnswer', () => {
  it('maps a likert7 value to -1..1', () => {
    const question = makeQuestion()
    expect(normalizeAnswer(question, { questionId: 'q1', value: 3 })).toBeCloseTo(1)
    expect(normalizeAnswer(question, { questionId: 'q1', value: 0 })).toBe(0)
    expect(normalizeAnswer(question, { questionId: 'q1', value: -3 })).toBeCloseTo(-1)
  })

  it('maps a likert5 value to -1..1', () => {
    const question = makeQuestion({ responseType: 'likert5' })
    expect(normalizeAnswer(question, { questionId: 'q1', value: 2 })).toBeCloseTo(1)
    expect(normalizeAnswer(question, { questionId: 'q1', value: -2 })).toBeCloseTo(-1)
  })

  it('inverts the unit value when reverseScored is set', () => {
    const question = makeQuestion({ reverseScored: true })
    expect(normalizeAnswer(question, { questionId: 'q1', value: 3 })).toBeCloseTo(-1)
    expect(normalizeAnswer(question, { questionId: 'q1', value: -3 })).toBeCloseTo(1)
  })

  it('returns null for dont_know answers', () => {
    const question = makeQuestion()
    expect(normalizeAnswer(question, { questionId: 'q1', value: 'dont_know' })).toBeNull()
  })

  it('clamps out-of-range raw values', () => {
    const question = makeQuestion()
    expect(normalizeAnswer(question, { questionId: 'q1', value: 99 })).toBe(1)
    expect(normalizeAnswer(question, { questionId: 'q1', value: -99 })).toBe(-1)
  })
})
