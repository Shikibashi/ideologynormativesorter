import type { Question, QuestionSource } from '../types'
import { questionContextSources } from './questionContext'

export const EDITORIAL_SIXTEENTH_PASS_VERSION = '2026-08-editorial-v16'
export const EDITORIAL_SIXTEENTH_PASS_DATE = '2026-08-12'

export interface SixteenthPassRewrite {
  prompt: string
  rationale: string
  evidenceNote: string
  sourceIds: readonly string[]
}

/** This pass isolates referendum rights review from separate fiscal safeguards. */
export const sixteenthPassRewritesById: Readonly<Record<string, SixteenthPassRewrite>> = {
  q0355: {
    prompt: 'Referendum proposals should be reviewable for compatibility with fundamental rights before the vote.',
    rationale: 'Replace a three-part bundle about fiscal notes, rights constraints, and anti-minority targeting with one pre-vote rights-compatibility review construct supported by comparative referendum standards.',
    evidenceNote: 'Scope to pre-vote review of referendum proposals for compatibility with fundamental rights. Fiscal notes, question clarity, campaign fairness, and rules against targeting minorities are related but distinct safeguards; agreement with this item does not specify one review body or imply that fiscal analysis is unnecessary.',
    sourceIds: ['referendumSafeguards', 'civilPoliticalRights'],
  },
}

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }))
}

export function applyEditorialSixteenthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined) return question

  const rewrite = sixteenthPassRewritesById[String(question.id)]
  if (!rewrite) return question

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: 'approved',
    version: EDITORIAL_SIXTEENTH_PASS_VERSION,
    updatedAt: EDITORIAL_SIXTEENTH_PASS_DATE,
    deprecationReason: undefined,
  }
}
