import type { Question } from '../types'

export const EDITORIAL_TWENTY_EIGHTH_PASS_VERSION = '2026-08-editorial-v28'
export const EDITORIAL_TWENTY_EIGHTH_PASS_DATE = '2026-08-13'

interface PrecisionRewrite {
  prompt: string
  rationale: string
}

/**
 * Separates the remaining labor-rights and post-capitalist governance
 * compounds identified by the active-question semantic audit. This pass
 * changes wording only; score fields remain under their existing review.
 */
export const precisionRewritesById: Readonly<Record<string, PrecisionRewrite>> = {
  q0081: {
    prompt: 'Workers should be free to form organizations of their choice and bargain collectively without legal favoritism.',
    rationale: 'The previous item bundled organizing, refusal, bargaining, exit, rival-firm formation, and legal favoritism. The revised wording isolates freedom of association and collective bargaining, which are closely related labor-rights constructs with direct ILO framing; refusal, exit, competitive entry, and property rules remain separate questions.',
  },
  q0411: {
    prompt: 'Production in a post-capitalist economy should be governed through federated workers’ councils rather than a party-state bureaucracy.',
    rationale: 'The previous item combined workplace governance, neighborhood councils, territorial federation, and transition strategy. The revised wording isolates the proposed worker-council governance of production; neighborhood administration and transition sequencing remain distinct institutional and strategic questions.',
  },
}

export function applyEditorialTwentyEighthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined) return question

  const rewrite = precisionRewritesById[String(question.id)]
  if (!rewrite) return question

  return {
    ...question,
    prompt: rewrite.prompt,
    reviewStatus: 'approved',
    version: EDITORIAL_TWENTY_EIGHTH_PASS_VERSION,
    updatedAt: EDITORIAL_TWENTY_EIGHTH_PASS_DATE,
  }
}
