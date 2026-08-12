import type { AxisWeight, Question, StatementOption } from '../types'

export const EDITORIAL_NINTH_PASS_VERSION = '2026-08-editorial-v9'
export const EDITORIAL_NINTH_PASS_DATE = '2026-08-12'

export interface NinthPassRewrite {
  prompt?: string
  statementOptions?: StatementOption[]
  rationale: string
}

const w = (axisId: AxisWeight['axisId'], weight: number): AxisWeight => ({ axisId, weight })

const specialistModules = new Set([
  'feminist-faction-module',
  'identity-sovereignty-module',
])

/**
 * Items in the respondent-facing core and specialist registries are checked
 * here. Previously unversioned active items receive explicit sign-off metadata;
 * items that already carry an earlier review record retain that provenance.
 * Legacy data-only module items remain outside this pass until a real registry
 * consumes them.
 */
export function isEditorialNinthPassTarget(question: Question): boolean {
  return question.module === undefined || specialistModules.has(String(question.module))
}

export const ninthPassRewritesById: Readonly<Record<string, NinthPassRewrite>> = {
  q0075: {
    prompt: 'Before adding new tax-funded benefits, governments should remove legal barriers that make essential goods and services unnecessarily expensive.',
    rationale: 'Replace the earlier housing, healthcare, and work bundle with one policy-sequencing preference about supply-side barriers and tax-funded benefits.',
  },
  q0215: {
    prompt: 'Lawful immigration pathways should expand even when housing and labor markets need time to adjust.',
    rationale: 'Replace the earlier three-policy bottleneck bundle with one immigration-openness preference under adjustment constraints.',
  },
  q0274: {
    prompt: 'Family policy should expand adults’ ability to exit unwanted legal or economic dependency.',
    rationale: 'Replace the list of divorce, contraception, adoption, and work policies with the single underlying exit principle.',
  },
  q0314: {
    prompt: 'Climate policy should reduce legal barriers to deploying low-carbon technologies and infrastructure.',
    rationale: 'Replace the list of nuclear, transmission, housing, and innovation policies with one regulatory stance toward low-carbon deployment.',
  },
}

export const ninthPassStatementRewritesById: Readonly<Record<string, NinthPassRewrite>> = {
  sq02: {
    statementOptions: [
      {
        id: 'a',
        text: 'Whoever first transforms or improves a resource should normally hold the strongest claim to it.',
        axisWeights: [w('property-legitimacy', 1), w('equality-theory', -0.4)],
      },
      {
        id: 'b',
        text: 'Productive assets should be governed by workers or other collective institutions to narrow material gaps.',
        axisWeights: [w('property-legitimacy', -0.6), w('equality-theory', 1)],
      },
      {
        id: 'c',
        text: 'Private ownership is legitimate for personal-use property, but its scope should not extend to all productive capital.',
        axisWeights: [w('property-legitimacy', -0.2), w('equality-theory', 0.3)],
      },
      {
        id: 'd',
        text: 'The ownership form matters less than guaranteeing everyone a secure material baseline.',
        axisWeights: [w('property-legitimacy', -0.8), w('equality-theory', 0.8)],
      },
    ],
    rationale: 'Separate collective governance, limited private ownership, and baseline-security priorities so the distributive options are not near-paraphrases.',
  },
  sq13: {
    prompt: 'Which single principle should take priority when property and markets conflict?',
    statementOptions: [
      {
        id: 'a',
        text: 'Strong private title should be the normal baseline for productive property.',
        axisWeights: [w('property-legitimacy', 0.9), w('equality-theory', -0.4)],
      },
      {
        id: 'b',
        text: 'Markets are legitimate only when state-backed privilege, rent, and monopoly are removed.',
        axisWeights: [w('property-legitimacy', -0.2), w('anti-domination', 0.8)],
      },
      {
        id: 'c',
        text: 'Land and natural opportunities should follow a different moral rule from things people produce.',
        axisWeights: [w('property-legitimacy', -0.5), w('equality-theory', 0.4)],
      },
      {
        id: 'd',
        text: 'Productive capital should generally be owned or governed collectively by the people who work with it.',
        axisWeights: [w('property-legitimacy', -0.9), w('equality-theory', 0.8), w('anti-domination', 0.4)],
      },
    ],
    rationale: 'Make the ipsative instruction explicit and distinguish title, anti-privilege, land, and collective-capital principles.',
  },
}

export function applyEditorialNinthPass(question: Question): Question {
  if (
    !isEditorialNinthPassTarget(question)
    || question.active === false
    || question.reviewStatus === 'needs-rewrite'
  ) return question

  const id = String(question.id)
  const rewrite = ninthPassRewritesById[id]
  const statementRewrite = ninthPassStatementRewritesById[id]

  if (!rewrite && !statementRewrite && question.reviewStatus !== undefined && question.version !== undefined) {
    return question
  }

  return {
    ...question,
    ...(rewrite?.prompt ? { prompt: rewrite.prompt } : {}),
    ...(statementRewrite?.prompt ? { prompt: statementRewrite.prompt } : {}),
    ...(statementRewrite?.statementOptions
      ? { statementOptions: statementRewrite.statementOptions.map((option) => ({
          ...option,
          axisWeights: option.axisWeights.map((axisWeight) => ({ ...axisWeight })),
        })) }
      : {}),
    active: true,
    reviewStatus: 'approved',
    version: EDITORIAL_NINTH_PASS_VERSION,
    updatedAt: EDITORIAL_NINTH_PASS_DATE,
    deprecationReason: undefined,
  }
}
