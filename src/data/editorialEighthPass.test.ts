import { describe, expect, it } from 'vitest'
import { axes } from './axes'
import {
  EDITORIAL_EIGHTH_PASS_VERSION,
  eighthPassReplacementRequiredById,
  eighthPassRewritesById,
} from './editorialEighthPass'
import { QUESTION_BANK_VERSION, questionById, questionsForTier } from './effectiveQuestions'
import { EDITORIAL_TWENTY_THIRD_PASS_VERSION } from './editorialTwentyThirdPass'

describe('eighth editorial pass', () => {
  it('quarantines the three independently identified evidence-to-construct mismatches', () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_EIGHTH_PASS_VERSION)
    expect(Object.keys(eighthPassReplacementRequiredById)).toEqual(['q0049', 'q0168', 'q0210'])

    for (const [id, finding] of Object.entries(eighthPassReplacementRequiredById)) {
      const question = questionById.get(id)
      expect(question, `${id} references a missing item`).toBeDefined()
      expect(question!.active).toBe(false)
      expect(question!.reviewStatus).toBe('needs-rewrite')
      expect(question!.version).toBe(EDITORIAL_EIGHTH_PASS_VERSION)
      expect(question!.deprecationReason).toBe(finding.rationale)
    }
  })

  it('restores direct democratic-confidence and compromise items', () => {
    expect(Object.keys(eighthPassRewritesById)).toEqual(['q0347', 'q0423'])
    const rewrite = eighthPassRewritesById.q0347
    const question = questionById.get('q0347')

    expect(question?.active).toBe(true)
    expect(question?.reviewStatus).toBe('approved')
    expect(question?.version).toBe(EDITORIAL_EIGHTH_PASS_VERSION)
    expect(question?.prompt).toBe(rewrite.prompt)
    expect(question?.axisWeights).toEqual([{ axisId: 'democratic-confidence', weight: 1 }])

    const compromise = questionById.get('q0423')
    expect(compromise?.active).toBe(true)
    expect(compromise?.reviewStatus).toBe('approved')
    expect(compromise?.version).toBe(EDITORIAL_TWENTY_THIRD_PASS_VERSION)
    expect(compromise?.prompt).toBe(eighthPassRewritesById.q0423.prompt)
    expect(compromise?.axisWeights).toEqual([{ axisId: 'compromise-vs-persistence', weight: 1 }])
  })

  it('keeps every full-depth axis above the runtime minimum coverage', () => {
    const fullDepth = questionsForTier('extensive')
    const sparseAxes = axes.map((axis) => ({
      axisId: axis.id,
      itemCount: fullDepth.filter((question) =>
        question.axisWeights.some((weight) => weight.axisId === axis.id),
      ).length,
    })).filter(({ itemCount }) => itemCount < 3)

    expect(sparseAxes).toEqual([])
  })

  it('updates the exact versioned profile cardinalities', () => {
    expect(questionsForTier('blitz')).toHaveLength(17)
    expect(questionsForTier('quick')).toHaveLength(50)
    expect(questionsForTier('moderate')).toHaveLength(206)
    expect(questionsForTier('extensive')).toHaveLength(338)
  })
})
