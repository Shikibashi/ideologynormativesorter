import type { Question } from '../types'
import {
  allQuestions as rawAllQuestions,
  coreQuestions as rawCoreQuestions,
  getBankFingerprint as getRawBankFingerprint,
  QUESTION_BANK_VERSION as RAW_QUESTION_BANK_VERSION,
  questionsForTier as rawQuestionsForTier,
  SCORING_VERSION,
} from './questions'
import { applySemanticReview, SEMANTIC_AUDIT_VERSION } from './semanticAudit'

export const QUESTION_BANK_VERSION = `${RAW_QUESTION_BANK_VERSION}+${SEMANTIC_AUDIT_VERSION}`
export { SCORING_VERSION }

export function getBankFingerprint(): string {
  return `${getRawBankFingerprint()}+${SEMANTIC_AUDIT_VERSION}`
}

export const coreQuestions: Question[] = rawCoreQuestions.map(applySemanticReview)
export const questions: Question[] = coreQuestions
export const allQuestions: Question[] = rawAllQuestions.map(applySemanticReview)
export const questionById = new Map(allQuestions.map((question) => [question.id, question]))

export function questionsForTier(tier: Question['tier']): Question[] {
  return rawQuestionsForTier(tier).map(applySemanticReview)
}
