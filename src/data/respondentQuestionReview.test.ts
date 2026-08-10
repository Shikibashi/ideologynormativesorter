import { describe, expect, it } from 'vitest'
import { domains } from './domains'
import {
  QUESTION_BANK_VERSION,
  questionById,
  questionsForTier,
} from './effectiveQuestions'
import {
  RESPONDENT_QUESTION_REVIEW_VERSION,
  replacementRequiredById,
  tierPromotionsById,
} from './respondentQuestionReview'
import {
  STATEMENT_SEMANTIC_AUDIT_VERSION,
  statementNeedsRewriteById,
} from './statementSemanticAudit'

const LAYERS = ['normative', 'descriptive', 'prescriptive'] as const

describe('respondent-facing question review', () => {
  it('applies every reviewed tier promotion to an active existing item', () => {
    for (const [questionId, promotion] of Object.entries(tierPromotionsById)) {
      const question = questionById.get(questionId)
      expect(question, `${questionId} promotion references a missing item`).toBeDefined()
      expect(question!.active, `${questionId} promotion references an inactive item`).not.toBe(false)
      expect(question!.tier).toBe(promotion.tier)
      expect(promotion.rationale).toBeTruthy()
    }
  })

  it('tracks replacement-required defects without silently changing their scores', () => {
    expect(Object.keys(replacementRequiredById)).toHaveLength(10)
    for (const [questionId, finding] of Object.entries(replacementRequiredById)) {
      const question = questionById.get(questionId)
      expect(question, `${questionId} finding references a missing item`).toBeDefined()
      expect(question!.active, `${questionId} must remain visible until a replacement is reviewed`).not.toBe(false)
      expect(finding.rationale).toBeTruthy()
    }
  })

  it('keeps Blitz at 21 items with equal layer representation', () => {
    const blitz = questionsForTier('blitz')
    expect(blitz).toHaveLength(21)

    for (const layer of LAYERS) {
      expect(blitz.filter((question) => question.layer === layer), layer).toHaveLength(7)
    }
  })

  it('keeps at least one active Quick item for every domain and layer', () => {
    const quick = questionsForTier('quick')

    for (const domain of domains) {
      for (const layer of LAYERS) {
        expect(
          quick.some((question) => question.domain === domain.id && question.layer === layer),
          `${domain.id}/${layer} is absent from the respondent-facing Quick form`,
        ).toBe(true)
      }
    }
  })

  it('applies statement-only deactivations to the public bank', () => {
    for (const questionId of Object.keys(statementNeedsRewriteById)) {
      const question = questionById.get(questionId)
      expect(question, `${questionId} statement review references a missing item`).toBeDefined()
      expect(question!.active).toBe(false)
      expect(question!.reviewStatus).toBe('needs-rewrite')
      expect(question!.version).toBe(STATEMENT_SEMANTIC_AUDIT_VERSION)
      expect(questionsForTier(question!.tier).some((item) => item.id === questionId)).toBe(false)
    }
  })

  it('versions the public bank with both statement and tier reviews', () => {
    expect(QUESTION_BANK_VERSION).toContain(STATEMENT_SEMANTIC_AUDIT_VERSION)
    expect(QUESTION_BANK_VERSION).toContain(RESPONDENT_QUESTION_REVIEW_VERSION)
  })
})
