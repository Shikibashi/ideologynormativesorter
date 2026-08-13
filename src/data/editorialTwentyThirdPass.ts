import type { Question } from '../types'

export const EDITORIAL_TWENTY_THIRD_PASS_VERSION = '2026-08-editorial-v23'
export const EDITORIAL_TWENTY_THIRD_PASS_DATE = '2026-08-12'

/**
 * Full-depth items promoted into the public Balanced profile after the
 * coverage audit. Each item already measures the named construct directly;
 * this pass changes only its public tier and provenance metadata.
 */
export const confidenceCoverageTierPromotions: Readonly<Record<string, string>> = {
  q0302: 'Nonhuman standing is a direct human-nature-priority item, not merely a growth preference.',
  q0303: 'Ecological limits on the value of growth directly measure nonhuman moral priority.',
  q0322: 'The item directly tests opposition to using people for prestige, empire, or crusade.',
  q0323: 'The item directly distinguishes defensive force from regime transformation abroad.',
  q0339: 'The item directly tests whether forced domestic burdens can justify military claims.',
  q0402: 'The item directly tests conditional acceptance of anticipatory military force.',
  q0350: 'Institutional backsliding is a direct test of confidence in democratic and expert constraints.',
  q0050: 'Incumbent-supplied regulatory information directly tests the accountability risks of expertise.',
  q0396: 'Rejecting a revolution that produces less accountable rule directly measures reform preference.',
  q0397: 'Designing reforms for further change directly measures reformist strategy.',
  q0412: 'Centralizing authority during a revolutionary transition directly measures rupture-oriented strategy.',
  q0016: 'Sequencing abolition around replacement institutions directly measures gradualist strategy.',
  q0423: 'Accepting a partial welfare reform directly measures willingness to compromise for material gains.',
}

export function applyEditorialTwentyThirdPass(question: Question): Question {
  const id = String(question.id)
  const rationale = confidenceCoverageTierPromotions[id]
  if (!rationale || question.active === false || question.module !== undefined) return question

  return {
    ...question,
    tier: 'moderate',
    active: true,
    reviewStatus: 'approved',
    version: EDITORIAL_TWENTY_THIRD_PASS_VERSION,
    updatedAt: EDITORIAL_TWENTY_THIRD_PASS_DATE,
    deprecatedAt: undefined,
    deprecationReason: undefined,
  }
}
