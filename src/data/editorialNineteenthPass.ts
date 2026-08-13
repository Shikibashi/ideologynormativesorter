import type { Question, QuestionSource } from '../types'
import { questionContextSources } from './questionContext'

export const EDITORIAL_NINETEENTH_PASS_VERSION = '2026-08-editorial-v19'
export const EDITORIAL_NINETEENTH_PASS_DATE = '2026-08-12'

export interface NineteenthPassRewrite {
  prompt: string
  rationale: string
  evidenceNote: string
  sourceIds: readonly string[]
}

/**
 * This pass removes the last two reviewed descriptive prompts that combined
 * an empirical mechanism with a separate distributional or methodological
 * claim. The raw wording remains available for historical inspection.
 */
export const nineteenthPassRewritesById: Readonly<Record<string, NineteenthPassRewrite>> = {
  q0027: {
    prompt: 'In documented land-tenure systems, clear rules for possession, transfer, and dispute resolution can reduce overlapping claims.',
    rationale: 'Keep the respondent-facing item on the source-supported conflict-reduction mechanism. Access, bargaining power, and the fairness of a tenure system are related outcomes that require separate evidence rather than a bundled Likert judgment.',
    evidenceNote: 'Scope to land and resource-tenure systems: compare documented use, possession, transfer, and dispute-resolution rules with the incidence of overlapping claims and conflicts. Distribution of access or bargaining power is a separate institutional outcome; this item does not imply that clear rules are fair, universally effective, or equivalent to one title system.',
    sourceIds: ['property', 'landTenure'],
  },
  q0308: {
    prompt: 'Command-and-control environmental rules can impose different compliance-cost burdens across firms of different sizes, industries, and facilities, with the pattern varying by rule and sector.',
    rationale: 'Remove the methodological instruction to measure effects from the descriptive claim and preserve the source-supported uncertainty about which firms bear greater costs.',
    evidenceNote: 'Scope to a named command-and-control environmental rule and compare compliance costs by firm size, industry, and facility. Research finds that incidence can run in different directions across rules and sectors; the item does not claim that regulation generally favors incumbents, burdens small firms, or produces one fixed entry or concentration outcome.',
    sourceIds: ['environmentalComplianceCosts'],
  },
}

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }))
}

export function applyEditorialNineteenthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined) return question

  const rewrite = nineteenthPassRewritesById[String(question.id)]
  if (!rewrite) return question

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: 'approved',
    version: EDITORIAL_NINETEENTH_PASS_VERSION,
    updatedAt: EDITORIAL_NINETEENTH_PASS_DATE,
    deprecationReason: undefined,
  }
}
