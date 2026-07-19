import type { AxisWeight, Question } from '../types'

/**
 * Module-corpus semantic overlay (WP2 fills corrections).
 * Empty at WP0/WP1 freeze — version still tracked for inventory identity.
 */
export const MODULE_SEMANTIC_AUDIT_VERSION = '2026-07-module-semantic-v1'
export const MODULE_SEMANTIC_AUDIT_DATE = '2026-07-19'

export type ModuleSemanticCorrection = {
  axisWeights: AxisWeight[]
  rationale: string
}

export const moduleSemanticCorrections: Record<string, ModuleSemanticCorrection> = {
  'fm-tech-1': {
    rationale: 'The prompt contrasts technical expert rule with democratic popular control, which is the definition of expert-confidence vs democratic-confidence. It does not measure the general legitimacy of centralized coercive state authority.',
    axisWeights: [
      { axisId: 'expert-confidence', weight: 0.8 },
      { axisId: 'democratic-confidence', weight: -0.6 }
    ]
  },
  'fm-nat-3': {
    rationale: 'Immigration controls define the boundaries of the political community and limit freedom of movement. Loading immigration restriction on general economic regulation/deregulation is a construct mismatch.',
    axisWeights: [
      { axisId: 'political-community-boundary', weight: -0.8 },
      { axisId: 'liberty-noninterference', weight: -0.6 }
    ]
  },
  'fm-market-7': {
    rationale: 'Arguing that regulatory compliance costs are barriers to entry is a critique of state intervention, indicating higher market-process confidence and preference for deregulation, not lower market confidence.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.6 },
      { axisId: 'regulation-vs-deregulation', weight: -0.5 },
      { axisId: 'market-process-confidence', weight: 0.3 }
    ]
  },
  'fm-georgist-7': {
    rationale: 'Critique of unearned private land rents is a rejection of absolute private property in land and a claim of market inefficiency in land markets. It does not measure skepticism toward state officials (public-choice).',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: -0.7 },
      { axisId: 'market-process-confidence', weight: -0.4 }
    ]
  },
  'fm-geolib-4': {
    rationale: 'Land speculation is a private market activity and rent-seeking behavior, challenging the legitimacy of land property and market allocation. It does not indicate public-choice skepticism of state agents.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: -0.7 },
      { axisId: 'market-process-confidence', weight: -0.4 }
    ]
  },
  'fm-christ-3': {
    rationale: 'Subsidiarity is a principle of federalism/decentralization (centralization-preference). It does not prescribe whether those local or central decisions should impose more or fewer regulations (regulation-vs-deregulation).',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.8 }
    ]
  }
}

export const moduleNeedsRewriteById: Record<
  string,
  { issue: string; rationale: string }
> = {
  'fm-tech-5': {
    issue: 'double-barreled',
    rationale: 'Combines prediction markets (decentralized market processes) with algorithmic forecasts (typically expert-driven models), which can receive opposing responses from market-oriented vs expert-oriented individuals.'
  }
}

export function applyModuleSemanticReview(question: Question): Question {
  const correction = moduleSemanticCorrections[String(question.id)]
  if (correction) {
    return {
      ...question,
      axisWeights: correction.axisWeights,
      reviewStatus: 'approved',
      version: MODULE_SEMANTIC_AUDIT_VERSION,
      updatedAt: MODULE_SEMANTIC_AUDIT_DATE,
    }
  }

  const rewrite = moduleNeedsRewriteById[String(question.id)]
  if (rewrite) {
    return {
      ...question,
      active: false,
      reviewStatus: 'needs-rewrite',
      version: MODULE_SEMANTIC_AUDIT_VERSION,
      updatedAt: MODULE_SEMANTIC_AUDIT_DATE,
      deprecatedAt: MODULE_SEMANTIC_AUDIT_DATE,
      deprecationReason: `${rewrite.issue}: ${rewrite.rationale}`,
    }
  }

  return question
}
