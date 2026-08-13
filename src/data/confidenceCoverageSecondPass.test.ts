import { describe, expect, it } from 'vitest'
import { questionsForTier, questionById, QUESTION_BANK_VERSION } from './effectiveQuestions'
import {
  confidenceCoverageSecondPassQuestions,
  CONFIDENCE_COVERAGE_SECOND_PASS_VERSION,
} from './confidenceCoverageSecondPass'

describe('second confidence coverage pass', () => {
  it('versions and activates only single-axis direct-construct items', () => {
    expect(QUESTION_BANK_VERSION).toContain(CONFIDENCE_COVERAGE_SECOND_PASS_VERSION)
    expect(confidenceCoverageSecondPassQuestions).toHaveLength(28)

    for (const question of confidenceCoverageSecondPassQuestions) {
      const effective = questionById.get(question.id)
      expect(effective, `${question.id} must be in the effective bank`).toBeDefined()
      expect(effective?.tier).toBe(
        question.id === 'q0418' || question.id === 'q0447' ? 'blitz' : 'moderate',
      )
      expect(effective?.active).not.toBe(false)
      expect(effective?.axisWeights).toHaveLength(1)
      if (effective?.layer === 'descriptive') {
        expect(effective.allowDontKnow).toBe(true)
        expect(effective.confidencePrompt).toBeTruthy()
        expect(effective.evidenceNote).toBeTruthy()
        expect(effective.sources?.length).toBeGreaterThan(0)
      }
      if (effective?.layer === 'prescriptive') {
        expect(effective.priorityPrompt).toBeTruthy()
      }
    }
  })

  it('raises the previously sparse balanced axes and restores ecological standing to short forms', () => {
    expect(questionsForTier('blitz')).toHaveLength(19)
    expect(questionsForTier('quick')).toHaveLength(52)

    const balanced = questionsForTier('moderate')
    const expectedCounts: Record<string, number> = {
      'human-nature-priority': 10,
      'militarism-pacifism': 10,
      'secularism-religious': 8,
      'democratic-confidence': 9,
      'expert-confidence': 8,
      'cultural-plasticity': 9,
      'reform-vs-revolution': 9,
      'electoralism-vs-direct-action': 9,
      'compromise-vs-persistence': 9,
    }

    for (const [axisId, expected] of Object.entries(expectedCounts)) {
      expect(
        balanced.filter((question) => question.axisWeights.some((weight) => weight.axisId === axisId)),
        axisId,
      ).toHaveLength(expected)
    }
  })
})
