import type { Question } from '../types'

export const EDITORIAL_TENTH_PASS_VERSION = '2026-08-editorial-v10'
export const EDITORIAL_TENTH_PASS_DATE = '2026-08-12'

export interface TenthPassRewrite {
  prompt: string
  rationale: string
}

/**
 * The live religion/public-law pair is retained, but its two questions now
 * target different principles: public justification versus final institutional
 * authority. The existing layer and axis weights remain unchanged.
 */
export const tenthPassRewritesById: Readonly<Record<string, TenthPassRewrite>> = {
  q0242: {
    prompt: 'Coercive civil laws should be justifiable to citizens without requiring them to accept one religious authority.',
    rationale: 'Separate the public-justification principle from institutional control over law; this item now asks how coercive laws must be justified, not who may hold final authority.',
  },
  q0406: {
    prompt: 'No religious institution should have final legal authority over citizens who do not accept its doctrines.',
    rationale: 'Separate institutional authority from public justification; this item now asks whether a religious institution may exercise final legal power over dissenters.',
  },
}

export function applyEditorialTenthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined) return question

  const rewrite = tenthPassRewritesById[String(question.id)]
  if (!rewrite) return question

  return {
    ...question,
    prompt: rewrite.prompt,
    active: true,
    reviewStatus: 'approved',
    version: EDITORIAL_TENTH_PASS_VERSION,
    updatedAt: EDITORIAL_TENTH_PASS_DATE,
    deprecationReason: undefined,
  }
}
