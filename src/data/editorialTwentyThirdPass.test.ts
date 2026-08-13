import { describe, expect, it } from 'vitest'
import { questionById, QUESTION_BANK_VERSION, questionsForTier } from './effectiveQuestions'
import {
  confidenceCoverageTierPromotions,
  EDITORIAL_TWENTY_THIRD_PASS_VERSION,
} from './editorialTwentyThirdPass'
import { descriptiveConstructCorrectionsById, EDITORIAL_TWENTY_FIFTH_PASS_VERSION } from './editorialTwentyFifthPass'

describe('twenty-third editorial pass', () => {
  it('promotes only direct construct matches into the balanced profile', () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_TWENTY_THIRD_PASS_VERSION)

    for (const id of Object.keys(confidenceCoverageTierPromotions)) {
      const question = questionById.get(id)
      expect(question, `${id} must exist`).toBeDefined()
      expect(question?.tier, `${id} should be balanced`).toBe('moderate')
      expect(question?.active).toBe(true)
      expect(question?.reviewStatus).toBe('approved')
      expect(question?.version).toBe(descriptiveConstructCorrectionsById[id]
        ? EDITORIAL_TWENTY_FIFTH_PASS_VERSION
        : EDITORIAL_TWENTY_THIRD_PASS_VERSION)
    }
  })

  it('raises every audited sparse axis to at least six balanced items', () => {
    const balanced = questionsForTier('moderate')
    const sparseAxes = [
      'human-nature-priority',
      'militarism-pacifism',
      'democratic-confidence',
      'expert-confidence',
      'cultural-plasticity',
      'reform-vs-revolution',
      'gradualism-vs-immediatism',
      'electoralism-vs-direct-action',
      'compromise-vs-persistence',
    ]

    for (const axisId of sparseAxes) {
      const count = balanced.filter((question) =>
        question.axisWeights.some((weight) => weight.axisId === axisId),
      ).length
      expect(count, `${axisId} should have six or more balanced items`).toBeGreaterThanOrEqual(6)
    }
  })

  it('updates the public profile cardinalities', () => {
    expect(questionsForTier('blitz')).toHaveLength(19)
    expect(questionsForTier('quick')).toHaveLength(52)
    expect(questionsForTier('moderate')).toHaveLength(206)
    expect(questionsForTier('extensive')).toHaveLength(338)
  })
})
