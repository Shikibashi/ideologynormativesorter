import type { AxisWeight, Question } from '../types'

export const EDITORIAL_EIGHTH_PASS_VERSION = '2026-08-editorial-v8'
export const EDITORIAL_EIGHTH_PASS_DATE = '2026-08-11'

interface EighthPassRewrite {
  prompt: string
  axisWeights: AxisWeight[]
  theoryContext: Question['theoryContext']
  rationale: string
}

interface EighthPassReplacementFinding {
  issue: 'construct-mismatch' | 'non-discriminating' | 'unsupported-inference'
  rationale: string
  proposedReplacement: string
}

const w = (axisId: AxisWeight['axisId'], weight: number): AxisWeight => ({ axisId, weight })

/** Corrections produced by the independent review of editorial v7. */
export const eighthPassRewritesById: Readonly<Record<string, EighthPassRewrite>> = {
  q0347: {
    prompt: 'Across a meta-analysis of 100 studies in established democracies, participating in deliberative mini-publics increased participants\' political knowledge on average.',
    axisWeights: [w('democratic-confidence', 1)],
    theoryContext: 'nonideal',
    rationale: 'Restore minimum democratic-confidence coverage with one scoped, directly observed participant outcome rather than the earlier compound claim about tradeoffs and externalized costs.',
  },
  q0423: {
    prompt: 'When a welfare reform cannot pass in full, accepting a partial negotiated expansion is preferable to waiting for the complete policy.',
    axisWeights: [w('compromise-vs-persistence', 1)],
    theoryContext: 'nonideal',
    rationale: 'Replace the earlier universal-versus-targeted construct mismatch with one direct policy-domain tradeoff between negotiated partial gains and holding out for the complete reform.',
  },
}

export const eighthPassReplacementRequiredById: Readonly<Record<string, EighthPassReplacementFinding>> = {
  q0049: {
    issue: 'construct-mismatch',
    rationale: 'The Superfund study estimates price changes attributable to one tax design; it does not directly test whether decentralized market processes generally incorporate environmental costs.',
    proposedReplacement: 'Ask about a named market institution and a directly measured coordination or price-discovery outcome before mapping the item to market-process confidence.',
  },
  q0168: {
    issue: 'construct-mismatch',
    rationale: 'The UN evidence documents restrictions on expression, but the available public-choice axis concerns insider interests, lobbying, and capture rather than civil-liberties enforcement.',
    proposedReplacement: 'Add a descriptive civil-liberties enforcement construct before scoring this documented expression-restriction claim.',
  },
  q0210: {
    issue: 'non-discriminating',
    rationale: 'Service pressure when funding and capacity fail to expand is compatible with both high and low confidence in state capacity and therefore does not identify the assigned construct.',
    proposedReplacement: 'Ask one observed service outcome with a defined inflow, funding response, capacity baseline, and comparison group.',
  },
}

export function applyEditorialEighthPass(question: Question): Question {
  const id = String(question.id)
  const replacement = eighthPassReplacementRequiredById[id]
  if (replacement) {
    return {
      ...question,
      active: false,
      reviewStatus: 'needs-rewrite',
      version: EDITORIAL_EIGHTH_PASS_VERSION,
      updatedAt: EDITORIAL_EIGHTH_PASS_DATE,
      deprecationReason: replacement.rationale,
    }
  }

  const rewrite = eighthPassRewritesById[id]
  if (!rewrite) return question

  return {
    ...question,
    prompt: rewrite.prompt,
    axisWeights: rewrite.axisWeights.map((axisWeight) => ({ ...axisWeight })),
    theoryContext: rewrite.theoryContext,
    active: true,
    reviewStatus: 'approved',
    version: EDITORIAL_EIGHTH_PASS_VERSION,
    updatedAt: EDITORIAL_EIGHTH_PASS_DATE,
    deprecationReason: undefined,
  }
}
