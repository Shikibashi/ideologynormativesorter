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
import {
  EDITORIAL_THIRTEENTH_PASS_VERSION,
  thirteenthPassRewritesById,
} from './editorialThirteenthPass'
import {
  EDITORIAL_FOURTEENTH_PASS_VERSION,
  fourteenthPassRewritesById,
} from './editorialFourteenthPass'
import {
  EDITORIAL_FIFTEENTH_PASS_VERSION,
  fifteenthPassRewritesById,
} from './editorialFifteenthPass'
import {
  EDITORIAL_SIXTEENTH_PASS_VERSION,
  sixteenthPassRewritesById,
} from './editorialSixteenthPass'
import {
  EDITORIAL_SEVENTEENTH_PASS_VERSION,
  seventeenthPassRewritesById,
} from './editorialSeventeenthPass'
import {
  EDITORIAL_EIGHTEENTH_PASS_VERSION,
  eighteenthPassRewritesById,
} from './editorialEighteenthPass'
import {
  EDITORIAL_NINETEENTH_PASS_VERSION,
  nineteenthPassRewritesById,
} from './editorialNineteenthPass'
import {
  EDITORIAL_TWENTIETH_PASS_VERSION,
  twentiethPassRewritesById,
} from './editorialTwentiethPass'
import {
  EDITORIAL_TWENTY_FIRST_PASS_VERSION,
  twentyFirstPassRewritesById,
} from './editorialTwentyFirstPass'
import { confidenceCoverageTierPromotions, EDITORIAL_TWENTY_THIRD_PASS_VERSION } from './editorialTwentyThirdPass'
import {
  descriptiveConstructCorrectionsById,
  EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
} from './editorialTwentyFifthPass'
import {
  descriptiveConstructCorrectionsById as v26Corrections,
  EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
} from './editorialTwentySixthPass'
import {
  EDITORIAL_TWENTY_EIGHTH_PASS_VERSION,
  precisionRewritesById as v28Rewrites,
} from './editorialTwentyEighthPass'

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
      const thirteenthPassRewrite = thirteenthPassRewritesById[questionId]
      const fourteenthPassRewrite = fourteenthPassRewritesById[questionId]
      const fifteenthPassRewrite = fifteenthPassRewritesById[questionId]
      const sixteenthPassRewrite = sixteenthPassRewritesById[questionId]
      const seventeenthPassRewrite = seventeenthPassRewritesById[questionId]
      const eighteenthPassRewrite = eighteenthPassRewritesById[questionId]
      const nineteenthPassRewrite = nineteenthPassRewritesById[questionId]
      const twentiethPassRewrite = twentiethPassRewritesById[questionId]
      const twentyFirstPassRewrite = twentyFirstPassRewritesById[questionId]
      const twentyFifthCorrection = descriptiveConstructCorrectionsById[questionId]
      const twentySixthCorrection = v26Corrections[questionId]
      const twentyEighthRewrite = v28Rewrites[questionId]
      const expectedWeights = twentySixthCorrection
        ? twentySixthCorrection.axisWeights
        : twentyFifthCorrection
        ? twentyFifthCorrection.axisWeights
        : eighthPassRewrite
        ? eighthPassRewrite.axisWeights
        : seventhPassRewrite
        ? seventhPassRewrite.axisWeights
        : !respondentReplacement && !fifthPassReplacement && fifthPassMapping
          ? fifthPassMapping.axisWeights
          : correction.axisWeights
      expect(question!.axisWeights).toEqual(expectedWeights)

      if (twentyEighthRewrite) {
        expect(question!.version).toBe(EDITORIAL_TWENTY_EIGHTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (twentySixthCorrection) {
        expect(question!.version).toBe(EDITORIAL_TWENTY_SIXTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (twentyFifthCorrection) {
        expect(question!.version).toBe(EDITORIAL_TWENTY_FIFTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (confidenceCoverageTierPromotions[questionId]) {
        expect(question!.version).toBe(EDITORIAL_TWENTY_THIRD_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (twentyFirstPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_TWENTY_FIRST_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (twentiethPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_TWENTIETH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (nineteenthPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_NINETEENTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (eighteenthPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_EIGHTEENTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (seventeenthPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_SEVENTEENTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (sixteenthPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_SIXTEENTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (fifteenthPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_FIFTEENTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (fourteenthPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_FOURTEENTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (thirteenthPassRewrite) {
        expect(question!.version).toBe(EDITORIAL_THIRTEENTH_PASS_VERSION)
        expect(question!.reviewStatus).toBe('approved')
      } else if (tenthPassRewrite) {
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

  it('keeps every respondent-visible core item approved after the review overlays', () => {
    const unapproved = questions
      .filter((question) => question.reviewStatus !== 'approved')
      .map((question) => `${question.id}:${question.reviewStatus ?? 'missing'}`)
    expect(unapproved).toEqual([])
  })

  it('corrects known sign inversions', () => {
    const decentralizedOrder = questionById.get('q0012')!
    expect(decentralizedOrder.axisWeights).toEqual([
      { axisId: 'coordination-optimism', weight: 0.8 },
    ])

    const narrowSpeechRestrictions = questionById.get('q0174')!
    expect(narrowSpeechRestrictions.axisWeights).toContainEqual({ axisId: 'coercion-strategy', weight: -0.8 })

    const competingMoney = questionById.get('q0133')!
    expect(competingMoney.axisWeights).toContainEqual({ axisId: 'state-action-vs-exit', weight: -0.9 })
  })
})
