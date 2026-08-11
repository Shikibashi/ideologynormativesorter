import { describe, expect, it } from 'vitest'
import { domains } from './domains'
import {
  allQuestions,
  QUESTION_BANK_VERSION,
  questionById,
  questionsForTier,
} from './effectiveQuestions'
import {
  applyRespondentQuestionReview,
  nearDuplicateFindings,
  RESPONDENT_QUESTION_REVIEW_VERSION,
  replacementRequiredById,
  tierPromotionsById,
  wordingCorrectionsById,
} from './respondentQuestionReview'
import { questionById as rawQuestionById } from './questions'
import {
  applyStatementSemanticReview,
  STATEMENT_SEMANTIC_AUDIT_VERSION,
  statementNeedsRewriteById,
} from './statementSemanticAudit'
import { applySemanticReview } from './semanticAudit'
import { DEFAULT_CONFIDENCE_PROMPT, DEFAULT_PRIORITY_PROMPT } from '../questionPresentation'
import { fifthPassReplacementRequiredById } from './editorialFifthPass'
import { seventhPassReplacementRequiredById } from './editorialSeventhPass'
import { eighthPassReplacementRequiredById } from './editorialEighthPass'

const LAYERS = ['normative', 'descriptive', 'prescriptive'] as const

describe('respondent-facing question review', () => {
  it('applies every reviewed tier promotion before any later-pass quarantine', () => {
    for (const [questionId, promotion] of Object.entries(tierPromotionsById)) {
      const question = questionById.get(questionId)
      expect(question, `${questionId} promotion references a missing item`).toBeDefined()
      if (seventhPassReplacementRequiredById[questionId] || eighthPassReplacementRequiredById[questionId]) {
        expect(question!.active).toBe(false)
      } else {
        expect(question!.active, `${questionId} promotion references an inactive item`).not.toBe(false)
      }
      expect(question!.tier).toBe(promotion.tier)
      expect(promotion.rationale).toBeTruthy()
    }
  })

  it('quarantines replacement-required defects from public and research forms', () => {
    expect(Object.keys(replacementRequiredById)).toHaveLength(31)
    for (const [questionId, finding] of Object.entries(replacementRequiredById)) {
      const question = questionById.get(questionId)
      const raw = rawQuestionById.get(questionId)
      expect(question, `${questionId} finding references a missing item`).toBeDefined()
      expect(raw, `${questionId} finding references a missing raw item`).toBeDefined()
      expect(question!.active, `${questionId} must be excluded until a replacement is reviewed`).toBe(false)
      expect(question!.reviewStatus).toBe('needs-rewrite')
      expect(question!.version).toBe(RESPONDENT_QUESTION_REVIEW_VERSION)
      const beforeRespondentReview = applyStatementSemanticReview(applySemanticReview(raw!))
      expect(question!.axisWeights).toEqual(beforeRespondentReview.axisWeights)
      expect(questionsForTier(question!.tier).some((item) => item.id === questionId)).toBe(false)
      expect(finding.rationale).toBeTruthy()
      expect(finding.proposedReplacement).toBeTruthy()
    }

    expect(
      Object.keys(replacementRequiredById).filter(
        (questionId) => wordingCorrectionsById[questionId],
      ),
    ).toEqual([])
  })

  it('applies neutral wording corrections without changing scoring metadata', () => {
    expect(Object.keys(wordingCorrectionsById)).toHaveLength(12)

    for (const [questionId, correction] of Object.entries(wordingCorrectionsById)) {
      const raw = rawQuestionById.get(questionId)
      const effective = questionById.get(questionId)
      expect(raw, `${questionId} wording correction references a missing raw item`).toBeDefined()
      expect(effective).toBeDefined()

      const reviewed = applyRespondentQuestionReview(raw!)
      expect(reviewed.prompt).toBe(correction.prompt)
      expect(reviewed.prompt).not.toBe(raw!.prompt)
      expect(reviewed.axisWeights).toEqual(raw!.axisWeights)
      expect(reviewed.layer).toBe(raw!.layer)
      expect(reviewed.domain).toBe(raw!.domain)
      expect(reviewed.theoryContext).toBe(raw!.theoryContext)
      expect(reviewed.version).toBe(RESPONDENT_QUESTION_REVIEW_VERSION)
      expect(reviewed.reviewStatus).toBe('approved')
      expect(effective!.prompt).toBe(correction.prompt)
    }
  })

  it('records near-duplicate pairs and preserves any independent quarantine decision', () => {
    expect(nearDuplicateFindings).toHaveLength(6)
    for (const finding of nearDuplicateFindings) {
      for (const questionId of finding.questionIds) {
        if (replacementRequiredById[questionId] || fifthPassReplacementRequiredById[questionId]) {
          expect(questionById.get(questionId)?.active).toBe(false)
        } else {
          expect(questionById.get(questionId)?.active).not.toBe(false)
        }
      }
      expect(finding.rationale).toBeTruthy()
      expect(finding.recommendedAction).toBeTruthy()
    }
  })

  it('uses unambiguous confidence and priority prompts throughout the effective bank', () => {
    for (const question of allQuestions.filter((item) => item.active !== false)) {
      if (question.layer === 'descriptive') {
        expect(question.confidencePrompt, question.id).toBe(DEFAULT_CONFIDENCE_PROMPT)
      }
      if (question.layer === 'prescriptive') {
        expect(question.priorityPrompt, question.id).toBe(DEFAULT_PRIORITY_PROMPT)
      }
    }
  })

  it('keeps the Blitz form cross-layer without reintroducing quarantined items', () => {
    const blitz = questionsForTier('blitz')

    for (const layer of LAYERS) {
      expect(blitz.some((question) => question.layer === layer), layer).toBe(true)
    }
    expect(blitz.every((question) => question.reviewStatus !== 'needs-rewrite')).toBe(true)
  })

  it('reports rather than conceals any Quick coverage lost to quarantine', () => {
    const quick = questionsForTier('quick')
    const gaps: string[] = []

    for (const domain of domains) {
      for (const layer of LAYERS) {
        if (!quick.some((question) => question.domain === domain.id && question.layer === layer)) {
          gaps.push(`${domain.id}/${layer}`)
        }
      }
    }
    expect(quick.every((question) => question.reviewStatus !== 'needs-rewrite')).toBe(true)
    expect(gaps).toEqual([
      'redistribution-welfare/prescriptive',
      'labor-unions-workplace/normative',
      'labor-unions-workplace/descriptive',
      'land-housing-georgism/prescriptive',
      'civil-liberties-speech/descriptive',
      'immigration-borders/prescriptive',
      'national-identity-sovereignty/prescriptive',
      'race-ethnicity-multiculturalism/normative',
      'race-ethnicity-multiculturalism/descriptive',
      'race-ethnicity-multiculturalism/prescriptive',
      'democracy-expertise-constitutionalism/normative',
      'technology-ai-surveillance/descriptive',
      'strategy-change/descriptive',
    ])
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
