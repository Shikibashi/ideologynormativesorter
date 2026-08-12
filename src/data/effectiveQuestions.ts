import type { Question } from '../types'
import {
  allQuestions as rawAllQuestions,
  coreQuestions as rawCoreQuestions,
  getBankFingerprint as getRawBankFingerprint,
  QUESTION_BANK_VERSION as RAW_QUESTION_BANK_VERSION,
  SCORING_VERSION,
} from './questions'
import { applySemanticReview, SEMANTIC_AUDIT_VERSION } from './semanticAudit'
import {
  applyStatementSemanticReview,
  STATEMENT_SEMANTIC_AUDIT_VERSION,
} from './statementSemanticAudit'
import {
  applyRespondentQuestionReview,
  RESPONDENT_QUESTION_REVIEW_VERSION,
} from './respondentQuestionReview'
import {
  applyEditorialFifthPass,
  EDITORIAL_FIFTH_PASS_VERSION,
} from './editorialFifthPass'
import {
  applyEditorialSeventhPass,
  EDITORIAL_SEVENTH_PASS_VERSION,
} from './editorialSeventhPass'
import {
  applyEditorialEighthPass,
  EDITORIAL_EIGHTH_PASS_VERSION,
} from './editorialEighthPass'
import {
  applyDescriptiveEvidence,
  DESCRIPTIVE_EVIDENCE_VERSION,
} from './descriptiveEvidence'
import {
  applyDescriptiveEvidenceSecondPass,
  DESCRIPTIVE_EVIDENCE_SECOND_PASS_VERSION,
} from './descriptiveEvidenceSecondPass'
import {
  applyDescriptiveEvidenceThirdPass,
  DESCRIPTIVE_EVIDENCE_THIRD_PASS_VERSION,
} from './descriptiveEvidenceThirdPass'
import {
  applyEditorialNinthPass,
  EDITORIAL_NINTH_PASS_VERSION,
} from './editorialNinthPass'
import {
  applyEditorialTenthPass,
  EDITORIAL_TENTH_PASS_VERSION,
} from './editorialTenthPass'
import { SPECIALIST_DESCRIPTIVE_EVIDENCE_VERSION } from './specialistDescriptiveEvidence'
import { applyQuestionContext, QUESTION_CONTEXT_VERSION } from './questionContext'

export const QUESTION_BANK_VERSION = [
  RAW_QUESTION_BANK_VERSION,
  SEMANTIC_AUDIT_VERSION,
  STATEMENT_SEMANTIC_AUDIT_VERSION,
  RESPONDENT_QUESTION_REVIEW_VERSION,
  EDITORIAL_FIFTH_PASS_VERSION,
  EDITORIAL_SEVENTH_PASS_VERSION,
  EDITORIAL_EIGHTH_PASS_VERSION,
  DESCRIPTIVE_EVIDENCE_VERSION,
  DESCRIPTIVE_EVIDENCE_SECOND_PASS_VERSION,
  DESCRIPTIVE_EVIDENCE_THIRD_PASS_VERSION,
  SPECIALIST_DESCRIPTIVE_EVIDENCE_VERSION,
  EDITORIAL_NINTH_PASS_VERSION,
  EDITORIAL_TENTH_PASS_VERSION,
  QUESTION_CONTEXT_VERSION,
].join('+')
export { SCORING_VERSION }

export function getBankFingerprint(): string {
  return [
    getRawBankFingerprint(),
    SEMANTIC_AUDIT_VERSION,
    STATEMENT_SEMANTIC_AUDIT_VERSION,
    RESPONDENT_QUESTION_REVIEW_VERSION,
    EDITORIAL_FIFTH_PASS_VERSION,
    EDITORIAL_SEVENTH_PASS_VERSION,
    EDITORIAL_EIGHTH_PASS_VERSION,
    DESCRIPTIVE_EVIDENCE_VERSION,
    DESCRIPTIVE_EVIDENCE_SECOND_PASS_VERSION,
    DESCRIPTIVE_EVIDENCE_THIRD_PASS_VERSION,
    SPECIALIST_DESCRIPTIVE_EVIDENCE_VERSION,
    EDITORIAL_NINTH_PASS_VERSION,
    EDITORIAL_TENTH_PASS_VERSION,
    QUESTION_CONTEXT_VERSION,
  ].join('+')
}

function applyEffectiveReview(question: Question): Question {
  return applyQuestionContext(
    applyEditorialTenthPass(
      applyEditorialNinthPass(
        applyDescriptiveEvidenceThirdPass(
          applyDescriptiveEvidenceSecondPass(
            applyDescriptiveEvidence(
              applyEditorialEighthPass(
                applyEditorialSeventhPass(
                  applyEditorialFifthPass(
                    applyRespondentQuestionReview(
                      applyStatementSemanticReview(applySemanticReview(question)),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  )
}

/** All reviewed core items, including deactivated items retained for traceability. */
export const coreQuestions: Question[] = rawCoreQuestions.map(applyEffectiveReview)
/** Active reviewed items used by the public quiz and result scoring. */
export const questions: Question[] = coreQuestions.filter((question) => question.active !== false)
export const allQuestions: Question[] = rawAllQuestions.map(applyEffectiveReview)
export const questionById = new Map(allQuestions.map((question) => [question.id, question]))

const TIER_RANK: Record<Question['tier'], number> = {
  blitz: 0,
  quick: 1,
  moderate: 2,
  extensive: 3,
}

function diversifyQuickOrder(selectedQuestions: Question[]): Question[] {
  const domainOrder = [...new Set(selectedQuestions.map((question) => question.domain))]
  const byDomain = new Map(
    domainOrder.map((domain) => [
      domain,
      selectedQuestions.filter((question) => question.domain === domain),
    ]),
  )
  const maxDomainDepth = Math.max(
    ...[...byDomain.values()].map((domainQuestions) => domainQuestions.length),
  )
  const diversified: Question[] = []

  for (let depth = 0; depth < maxDomainDepth; depth += 1) {
    for (const domain of domainOrder) {
      const question = byDomain.get(domain)?.[depth]
      if (question) diversified.push(question)
    }
  }

  return diversified
}

export function questionsForTier(tier: Question['tier']): Question[] {
  const selectedQuestions = questions.filter(
    (question) => TIER_RANK[question.tier] <= TIER_RANK[tier],
  )
  return tier === 'quick' ? diversifyQuickOrder(selectedQuestions) : selectedQuestions
}
