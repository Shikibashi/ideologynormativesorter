import { describe, expect, it } from 'vitest'
import { axisById } from './axes'
import { questionById, questions, questionsForTier } from './effectiveQuestions'
import {
  RESPONDENT_QUESTION_REVIEW_VERSION,
  replacementRequiredById,
  wordingCorrectionsById,
} from './respondentQuestionReview'
import {
  EDITORIAL_FIFTH_PASS_VERSION,
  fifthPassMappingCorrectionsById,
  fifthPassReplacementRequiredById,
  fifthPassWordingCorrectionsById,
} from './editorialFifthPass'
import {
  EDITORIAL_SEVENTH_PASS_VERSION,
  seventhPassReplacementRequiredById,
  seventhPassRewritesById,
} from './editorialSeventhPass'
import {
  EDITORIAL_EIGHTH_PASS_VERSION,
  eighthPassReplacementRequiredById,
  eighthPassRewritesById,
} from './editorialEighthPass'
import { needsRewriteById, semanticCorrections, SEMANTIC_AUDIT_VERSION } from './semanticAudit'
import {
  EDITORIAL_NINTH_PASS_VERSION,
  ninthPassRewritesById,
  ninthPassStatementRewritesById,
} from './editorialNinthPass'
import {
  EDITORIAL_TENTH_PASS_VERSION,
  tenthPassRewritesById,
} from './editorialTenthPass'

describe('semantic question audit', () => {
  it('does not both correct and deactivate an item in the same semantic-review pass', () => {
    const overlap = Object.keys(semanticCorrections).filter((questionId) => needsRewriteById[questionId])
    expect(overlap).toEqual([])
  })

  it('applies every correction to an existing same-layer question', () => {
    for (const [questionId, correction] of Object.entries(semanticCorrections)) {
      const question = questionById.get(questionId)
      expect(question, `${questionId} correction references a missing question`).toBeDefined()
      const respondentReplacement = replacementRequiredById[questionId]
      const fifthPassReplacement = fifthPassReplacementRequiredById[questionId]
      const fifthPassMapping = fifthPassMappingCorrectionsById[questionId]
      const fifthPassWording = fifthPassWordingCorrectionsById[questionId]
      const seventhPassReplacement = seventhPassReplacementRequiredById[questionId]
      const seventhPassRewrite = seventhPassRewritesById[questionId]
      const eighthPassReplacement = eighthPassReplacementRequiredById[questionId]
      const eighthPassRewrite = eighthPassRewritesById[questionId]
      const ninthPassRewrite = ninthPassRewritesById[questionId] ?? ninthPassStatementRewritesById[questionId]
      const tenthPassRewrite = tenthPassRewritesById[questionId]
      const expectedWeights = eighthPassRewrite
        ? eighthPassRewrite.axisWeights
        : seventhPassRewrite
        ? seventhPassRewrite.axisWeights
        : !respondentReplacement && !fifthPassReplacement && fifthPassMapping
          ? fifthPassMapping.axisWeights
          : correction.axisWeights
      expect(question!.axisWeights).toEqual(expectedWeights)

      if (tenthPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_TENTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (ninthPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_NINTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (eighthPassReplacement) {
        expect(question!.version).toBe(EDITORIAL_EIGHTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('needs-rewrite')
        expect(question!.active).toBe(false)
      } else if (eighthPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_EIGHTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (seventhPassReplacement) {
        expect(question!.version).toBe(EDITORIAL_SEVENTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('needs-rewrite')
        expect(question!.active).toBe(false)
      } else if (seventhPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_SEVENTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (fifthPassReplacement) {
        expect(question!.version).toBe(EDITORIAL_FIFTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('needs-rewrite')
        expect(question!.active).toBe(false)
      } else if (respondentReplacement) {
        expect(question!.version).toBe(RESPONDENT_QUESTION_REVIEW_VERSION)
        expect(question!.reviewStatus).toBe('needs-rewrite')
        expect(question!.active).toBe(false)
      } else if (fifthPassMapping || fifthPassWording) {
        expect(question!.version).toBe(EDITORIAL_FIFTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (wordingCorrectionsById[questionId]) {
        expect(question!.version).toBe(RESPONDENT_QUESTION_REVIEW_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (question!.layer !== 'normative') {
        expect(question!.version).toBe(RESPONDENT_QUESTION_REVIEW_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else {
        expect(question!.version).toBe(SEMANTIC_AUDIT_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      }

      for (const weight of correction.axisWeights) {
        const axis = axisById.get(weight.axisId)
        expect(axis, `${questionId} references unknown axis ${weight.axisId}`).toBeDefined()
        expect(axis!.layer, `${questionId} correction crosses layers`).toBe(question!.layer)
        expect(weight.weight).toBeGreaterThanOrEqual(-1)
        expect(weight.weight).toBeLessThanOrEqual(1)
      }
    }
  })

  it('deactivates ambiguous items without silently assigning new weights', () => {
    for (const questionId of Object.keys(needsRewriteById)) {
      const question = questionById.get(questionId)
      expect(question, `${questionId} review references a missing question`).toBeDefined()
      expect(question!.reviewStatus).toBe('needs-rewrite')
      expect(question!.active).toBe(false)
      const expectedVersion = seventhPassReplacementRequiredById[questionId]
        ? EDITORIAL_SEVENTH_PASS_VERSION
        : fifthPassReplacementRequiredById[questionId]
          ? EDITORIAL_FIFTH_PASS_VERSION
          : replacementRequiredById[questionId]
            ? RESPONDENT_QUESTION_REVIEW_VERSION
            : SEMANTIC_AUDIT_VERSION
      expect(question!.version).toBe(expectedVersion)
      expect(question!.deprecationReason).toBeTruthy()
      expect(questions.some((activeQuestion) => activeQuestion.id === questionId)).toBe(false)
      expect(questionsForTier(question!.tier).some((activeQuestion) => activeQuestion.id === questionId)).toBe(false)
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
