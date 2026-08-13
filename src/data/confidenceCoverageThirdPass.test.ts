import { describe, expect, it } from 'vitest'
import { questionsForTier, questionById, QUESTION_BANK_VERSION } from './effectiveQuestions'
import {
  confidenceCoverageThirdPassQuestions,
  CONFIDENCE_COVERAGE_THIRD_PASS_VERSION,
} from './confidenceCoverageThirdPass'

describe('third confidence coverage pass', () => {
  it('adds sourced, single-axis descriptive items with explicit evidence ratings', () => {
    expect(QUESTION_BANK_VERSION).toContain(CONFIDENCE_COVERAGE_THIRD_PASS_VERSION)
    expect(confidenceCoverageThirdPassQuestions).toHaveLength(6)

    for (const question of confidenceCoverageThirdPassQuestions) {
      const effective = questionById.get(question.id)
      expect(effective, `${question.id} must be in the effective bank`).toBeDefined()
      expect(effective?.layer).toBe('descriptive')
      expect(effective?.tier).toBe('moderate')
      expect(effective?.active).not.toBe(false)
      expect(effective?.reviewStatus).toBe('approved')
      expect(effective?.allowDontKnow).toBe(true)
      expect(effective?.confidencePrompt).toBeTruthy()
      expect(effective?.evidenceNote).toBeTruthy()
      expect(effective?.sources?.length).toBeGreaterThanOrEqual(2)
      expect(effective?.sources?.every((source) => source.url.startsWith('https://'))).toBe(true)
      expect(effective?.axisWeights).toHaveLength(1)
    }
  })

  it('moves the three previously sparse moderate axes into the medium coverage band', () => {
    const questions = questionsForTier('moderate')
    const expectedCounts = {
      'state-capacity-confidence': 8,
      'expert-confidence': 8,
      'cultural-plasticity': 9,
    }

    for (const [axisId, expected] of Object.entries(expectedCounts)) {
      expect(questions.filter((question) => question.axisWeights.some((weight) => weight.axisId === axisId)), axisId).toHaveLength(expected)
    }
  })
})
