import type { Question } from '../types'

export const RESPONDENT_QUESTION_REVIEW_VERSION = '2026-08-respondent-v1'
export const RESPONDENT_QUESTION_REVIEW_DATE = '2026-08-10'

export interface TierPromotion {
  tier: Question['tier']
  rationale: string
}

export interface ReplacementRequiredFinding {
  issue: 'layer-mismatch' | 'double-barreled' | 'forced-choice-mismatch'
  rationale: string
}

/**
 * High-confidence second-pass defects that need a reviewed replacement before
 * removal. Deactivating all ten without replacements regressed the primary
 * separability guard, so they remain explicit debt rather than being silently
 * deleted from an already sparse construct bank.
 */
export const replacementRequiredById: Record<string, ReplacementRequiredFinding> = {
  q0002: { issue: 'layer-mismatch', rationale: 'An empirical claim about whether order can emerge without final authority is classified as normative.' },
  q0078: { issue: 'double-barreled', rationale: 'The prompt requires support for both direct relief and scarcity-reducing institutional reform.' },
  q0103: { issue: 'layer-mismatch', rationale: 'Calling land value a better tax base leaves moral legitimacy, efficiency, incidence, and administration unresolved inside a normative item.' },
  q0109: { issue: 'double-barreled', rationale: 'The item combines protection for current tenants with distinct mobility and supply costs.' },
  q0143: { issue: 'layer-mismatch', rationale: 'A descriptive claim about how knowledge grows is classified as normative.' },
  q0196: { issue: 'double-barreled', rationale: 'Requiring a conviction and abolishing civil asset forfeiture are different policies presented as one answer.' },
  q0277: { issue: 'double-barreled', rationale: 'The prompt packages anti-discrimination law with separate scarcity reforms across work and housing.' },
  q0409: { issue: 'double-barreled', rationale: 'The prompt combines preservation of price signals with reduced workplace domination.' },
  sq11: { issue: 'layer-mismatch', rationale: 'A descriptive causal claim about gender roles appears inside a normative forced-choice item.' },
  sq12: { issue: 'forced-choice-mismatch', rationale: 'The stem asks how change happens while the item is scored as a strategy preference.' },
}

/**
 * The July semantic review correctly removed ambiguous short-form items, but
 * that left the respondent-facing Blitz and Quick forms without meaningful
 * descriptive coverage. These promotions use already-approved active items;
 * they do not alter prompts, axis mappings, or scoring weights.
 */
export const tierPromotionsById: Record<string, TierPromotion> = {
  q0029: { tier: 'quick', rationale: 'Restore property/ownership descriptive coverage in Quick.' },
  q0047: { tier: 'blitz', rationale: 'Restore market-process descriptive coverage in Blitz and Quick.' },
  q0067: { tier: 'quick', rationale: 'Restore welfare-administration descriptive coverage in Quick.' },
  q0087: { tier: 'blitz', rationale: 'Restore workplace-governance descriptive coverage in Blitz and Quick.' },
  q0108: { tier: 'quick', rationale: 'Restore land-use descriptive coverage in Quick.' },
  q0128: { tier: 'quick', rationale: 'Restore monetary-policy descriptive coverage in Quick.' },
  q0147: { tier: 'blitz', rationale: 'Restore information-policy descriptive coverage in Blitz and Quick.' },
  q0168: { tier: 'quick', rationale: 'Restore civil-liberties descriptive coverage in Quick.' },
  q0188: { tier: 'quick', rationale: 'Restore justice-system descriptive coverage in Quick.' },
  q0207: { tier: 'quick', rationale: 'Restore migration descriptive coverage in Quick.' },
  q0227: { tier: 'blitz', rationale: 'Restore national-identity descriptive coverage in Blitz and Quick.' },
  q0248: { tier: 'quick', rationale: 'Restore religion-and-state descriptive coverage in Quick.' },
  q0269: { tier: 'quick', rationale: 'Restore family-policy descriptive coverage in Quick.' },
  q0291: { tier: 'quick', rationale: 'Restore race-and-ethnicity descriptive coverage in Quick.' },
  q0307: { tier: 'blitz', rationale: 'Restore environmental descriptive coverage in Blitz and Quick.' },
  q0328: { tier: 'quick', rationale: 'Restore foreign-policy descriptive coverage in Quick.' },
  q0348: { tier: 'quick', rationale: 'Restore democratic-process descriptive coverage in Quick.' },
  q0367: { tier: 'blitz', rationale: 'Restore technology-governance descriptive coverage in Blitz and Quick.' },
  q0388: { tier: 'quick', rationale: 'Restore political-strategy descriptive coverage in Quick.' },
  q0361: { tier: 'quick', rationale: 'Restore technology-governance normative coverage in Quick.' },
  q0381: { tier: 'quick', rationale: 'Restore political-strategy normative coverage in Quick.' },
  q0354: { tier: 'blitz', rationale: 'Restore institutional-design prescriptive coverage in Blitz and Quick.' },
  q0374: { tier: 'blitz', rationale: 'Restore technology-governance prescriptive coverage in Blitz and Quick.' },
  q0394: { tier: 'quick', rationale: 'Restore political-strategy prescriptive coverage in Quick.' },
}

export function applyRespondentQuestionReview(question: Question): Question {
  const promotion = tierPromotionsById[String(question.id)]
  return promotion ? { ...question, tier: promotion.tier } : question
}
