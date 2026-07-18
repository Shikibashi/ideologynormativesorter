import { describe, expect, it } from 'vitest'
import { axisById } from './axes'
import { questionById } from './effectiveQuestions'
import { needsRewriteById, semanticCorrections, SEMANTIC_AUDIT_VERSION } from './semanticAudit'

describe('semantic question audit', () => {
  it('applies every correction to an existing same-layer question', () => {
    for (const [questionId, correction] of Object.entries(semanticCorrections)) {
      const question = questionById.get(questionId)
      expect(question, `${questionId} correction references a missing question`).toBeDefined()
      expect(question!.version).toBe(SEMANTIC_AUDIT_VERSION)
      expect(question!.reviewStatus).toBe('approved')
      expect(question!.axisWeights).toEqual(correction.axisWeights)

      for (const weight of correction.axisWeights) {
        const axis = axisById.get(weight.axisId)
        expect(axis, `${questionId} references unknown axis ${weight.axisId}`).toBeDefined()
        expect(axis!.layer, `${questionId} correction crosses layers`).toBe(question!.layer)
        expect(weight.weight).toBeGreaterThanOrEqual(-1)
        expect(weight.weight).toBeLessThanOrEqual(1)
      }
    }
  })

  it('marks ambiguous items for rewrite without silently assigning new weights', () => {
    for (const questionId of Object.keys(needsRewriteById)) {
      const question = questionById.get(questionId)
      expect(question, `${questionId} review references a missing question`).toBeDefined()
      expect(question!.reviewStatus).toBe('needs-rewrite')
      expect(question!.version).toBe(SEMANTIC_AUDIT_VERSION)
    }
  })

  it('corrects known sign inversions', () => {
    const decentralizedOrder = questionById.get('q0012')!
    expect(decentralizedOrder.axisWeights).toContainEqual({ axisId: 'coordination-optimism', weight: 0.8 })
    expect(decentralizedOrder.axisWeights).toContainEqual({ axisId: 'state-capacity-confidence', weight: -0.6 })

    const narrowSpeechRestrictions = questionById.get('q0174')!
    expect(narrowSpeechRestrictions.axisWeights).toContainEqual({ axisId: 'coercion-strategy', weight: -0.8 })

    const competingMoney = questionById.get('q0133')!
    expect(competingMoney.axisWeights).toContainEqual({ axisId: 'state-action-vs-exit', weight: -0.9 })
  })
})
