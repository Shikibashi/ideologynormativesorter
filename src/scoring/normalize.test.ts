import { describe, expect, it } from 'vitest'
import type { Question } from '../types'
import { normalizeAnswer, salienceFactor } from './normalize'

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'q1',
    prompt: 'test',
    domain: 'state-legitimacy',
    layer: 'normative',
    theoryContext: 'ideal',
    responseType: 'likert7',
    tier: 'extensive',
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

describe('salienceFactor', () => {
  it('scales descriptive items by confidence', () => {
    const question = makeQuestion({ layer: 'descriptive' })
    expect(salienceFactor(question, { questionId: 'q1', value: 1, confidence: 5 })).toBeCloseTo(1)
    expect(salienceFactor(question, { questionId: 'q1', value: 1, confidence: 1 })).toBeCloseTo(0.2)
  })

  it('scales prescriptive items by priority', () => {
    const question = makeQuestion({ layer: 'prescriptive' })
    expect(salienceFactor(question, { questionId: 'q1', value: 1, priority: 5 })).toBeCloseTo(1)
    expect(salienceFactor(question, { questionId: 'q1', value: 1, priority: 1 })).toBeCloseTo(0.2)
  })

  it('defaults to full weight when unrated or normative', () => {
    const descriptive = makeQuestion({ layer: 'descriptive' })
    expect(salienceFactor(descriptive, { questionId: 'q1', value: 1 })).toBe(1)

    const normative = makeQuestion({ layer: 'normative' })
    expect(salienceFactor(normative, { questionId: 'q1', value: 1, confidence: 1 })).toBe(1)
  })
})
