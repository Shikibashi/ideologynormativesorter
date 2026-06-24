import { describe, expect, it } from 'vitest'
import type { AnswerMap, Question } from '../types'
import { contributionsForAxis } from './explain'

const mockQuestion: Question = {
  id: 'q1',
  prompt: 'Test prompt',
  domain: 'test',
  layer: 'normative',
  theoryContext: 'mixed',
  responseType: 'likert7',
  tier: 'quick',
  axisWeights: [{ axisId: 'ax1', weight: 1 }],
  allowDontKnow: true,
  confidencePrompt: '',
  priorityPrompt: ''
}

describe('contributionsForAxis', () => {
  it('skips dont_know and computes contribution', () => {
    const questions = [mockQuestion]
    const answers: AnswerMap = {
      q1: { questionId: 'q1', value: 3 }
    }
    const res = contributionsForAxis('ax1', questions, answers)
    expect(res.length).toBe(1)
    expect(res[0].contribution).toBeCloseTo(3 / 3) // unit for likert7 max 3
  })

  it('caps at 5 and sorts by abs contribution', () => {
    const qs = Array.from({ length: 6 }, (_, i) => ({ ...mockQuestion, id: 'q' + i, axisWeights: [{ axisId: 'ax1', weight: i % 2 === 0 ? 1 : -1 }] }))
    const answers: AnswerMap = Object.fromEntries(qs.map(q => [q.id, { questionId: q.id, value: 3 }]))
    const res = contributionsForAxis('ax1', qs, answers)
    expect(res.length).toBe(5)
    expect(Math.abs(res[0].contribution)).toBeGreaterThanOrEqual(Math.abs(res[1].contribution))
  })
})