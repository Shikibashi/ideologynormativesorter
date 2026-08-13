import type { Question } from '../types'

export const EDITORIAL_TENTH_PASS_VERSION = '2026-08-editorial-v11'
export const EDITORIAL_TENTH_PASS_DATE = '2026-08-12'

export interface TenthPassRewrite {
  prompt: string
  rationale: string
}

/**
 * The live religion/public-law pair is retained, but its two questions now
 * target different principles: public justification versus final institutional
 * authority. This pass also narrows four descriptive prompts to the cases
 * covered by their evidence records. The existing layer and axis weights remain
 * unchanged.
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
  q0248: {
    prompt: 'In jurisdictions that give religious authorities formal coercive legal power, disagreements over doctrine can become disputes over enforceable law.',
    rationale: 'Replace the universal-sounding claim about clerics with a conditional claim scoped to jurisdictions where religious authority has formal coercive legal standing.',
  },
  q0328: {
    prompt: 'In the Afghanistan reconstruction, intervention planners often underestimated local political, security, and institutional knowledge.',
    rationale: 'Align the visible prompt with the Afghanistan reconstruction evidence record instead of generalizing from one intervention to military interventions as a class.',
  },
  q0350: {
    prompt: 'In documented democratic backsliding episodes, governing actors have sometimes weakened constitutional constraints through flexible interpretation by courts, parties, or agencies.',
    rationale: 'Scope the claim to documented backsliding episodes and avoid presenting a contextual mechanism as an unconditional law of constitutional politics.',
  },
  q0368: {
    prompt: 'Federal agencies use detection and monitoring technologies for multiple purposes, creating privacy risks when policies do not specify collection, access, retention, and oversight limits.',
    rationale: 'Replace an unsupported general claim about repurposing with the directly sourced observation that federal agencies use these technologies across purposes and do not always specify privacy protections.',
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
