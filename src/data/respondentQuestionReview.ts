import type { Question } from '../types'
import { DEFAULT_CONFIDENCE_PROMPT, DEFAULT_PRIORITY_PROMPT } from '../questionPresentation'

export const RESPONDENT_QUESTION_REVIEW_VERSION = '2026-08-respondent-v4'
export const RESPONDENT_QUESTION_REVIEW_DATE = '2026-08-10'

export interface TierPromotion {
  tier: Question['tier']
  rationale: string
}

export interface ReplacementRequiredFinding {
  issue: 'layer-mismatch' | 'double-barreled' | 'forced-choice-mismatch' | 'construct-mismatch' | 'non-discriminating' | 'duplicate'
  rationale: string
  proposedReplacement: string
}

export interface WordingCorrection {
  prompt: string
  rationale: string
}

export interface NearDuplicateFinding {
  questionIds: readonly [string, string]
  rationale: string
  recommendedAction: string
}

/**
 * High-confidence defects quarantined from public scoring and respondent
 * research. Proposed replacements remain review notes until expert and
 * cognitive testing supports new, separately versioned items.
 */
export const replacementRequiredById: Record<string, ReplacementRequiredFinding> = {
  q0002: {
    issue: 'layer-mismatch',
    rationale: 'An empirical claim about whether order can emerge without final authority is classified as normative.',
    proposedReplacement: 'No single institution needs final authority over every dispute for a political order to be legitimate.',
  },
  q0078: {
    issue: 'double-barreled',
    rationale: 'The prompt requires support for both direct relief and scarcity-reducing institutional reform.',
    proposedReplacement: 'Housing rules that restrict new construction should be reduced as an anti-poverty measure.',
  },
  q0103: {
    issue: 'layer-mismatch',
    rationale: 'Calling land value a better tax base leaves moral legitimacy, efficiency, incidence, and administration unresolved inside a normative item.',
    proposedReplacement: 'A community has a stronger moral claim to increases in land value that it collectively creates than an individual landowner does.',
  },
  q0109: {
    issue: 'double-barreled',
    rationale: 'The item combines protection for current tenants with distinct mobility and supply costs.',
    proposedReplacement: 'Rent control tends to protect incumbent tenants more than it expands housing access for newcomers.',
  },
  q0143: {
    issue: 'layer-mismatch',
    rationale: 'A descriptive claim about how knowledge grows is classified as normative.',
    proposedReplacement: 'Creators should not have a moral right to prevent others from recombining published knowledge.',
  },
  q0196: {
    issue: 'double-barreled',
    rationale: 'Requiring a conviction and abolishing civil asset forfeiture are different policies presented as one answer.',
    proposedReplacement: 'Civil asset forfeiture should require a criminal conviction.',
  },
  q0277: {
    issue: 'double-barreled',
    rationale: 'The prompt packages anti-discrimination law with separate scarcity reforms across work and housing.',
    proposedReplacement: 'Occupational licensing rules that restrict access to paid work should generally be reduced.',
  },
  q0409: {
    issue: 'double-barreled',
    rationale: 'The prompt combines preservation of price signals with reduced workplace domination.',
    proposedReplacement: 'Worker-managed firms can coordinate production effectively through market prices.',
  },
  sq11: {
    issue: 'layer-mismatch',
    rationale: 'A descriptive causal claim about gender roles appears inside a normative forced-choice item.',
    proposedReplacement: 'Public institutions should not presume fixed social roles for people based on gender.',
  },
  sq12: {
    issue: 'forced-choice-mismatch',
    rationale: 'The stem asks how change happens while the item is scored as a strategy preference.',
    proposedReplacement: 'Political change should generally prioritize durable reform within existing institutions over replacing them.',
  },
  q0297: {
    issue: 'construct-mismatch',
    rationale: 'A general caution about group data does not cleanly locate the respondent on the listed redistribution, regulation, or centralization axes.',
    proposedReplacement: 'Eligibility for public programs should generally be based on individual circumstances rather than group membership.',
  },
  q0306: {
    issue: 'non-discriminating',
    rationale: 'Treating human flourishing and ecological limits as simultaneous constraints does not force a choice on the human-nature priority axis.',
    proposedReplacement: 'Ecological limits may legitimately constrain projects that would otherwise increase human prosperity.',
  },
  q0346: {
    issue: 'non-discriminating',
    rationale: 'Endorsing voice, exit, rights, expertise, and competition together is broadly inclusive and does not isolate a directional legitimacy judgment.',
    proposedReplacement: 'Political authority is more legitimate when people retain meaningful exit options.',
  },
  q0211: {
    issue: 'double-barreled',
    rationale: 'The causal comparison bundles legal status, labor access, education, and housing into one side of the item.',
    proposedReplacement: 'Secure legal status tends to make immigrant assimilation more likely.',
  },
  q0238: {
    issue: 'double-barreled',
    rationale: 'A respondent may reject cultural homogenization without rejecting every form of durable group-specific legal protection, or vice versa.',
    proposedReplacement: 'National law should assign the same legal status to citizens regardless of cultural group membership.',
  },
  q0298: {
    issue: 'double-barreled',
    rationale: 'Permitting cultural difference and rejecting unequal legal status are separable commitments presented as one answer.',
    proposedReplacement: 'Cultural pluralism does not justify unequal legal status between groups.',
  },
  q0086: {
    issue: 'double-barreled',
    rationale: 'Rejecting managerial authority and rejecting compulsory union membership are separable labor-freedom judgments.',
    proposedReplacement: 'Workers should be free to refuse compulsory union membership.',
  },
  q0113: {
    issue: 'double-barreled',
    rationale: 'Permitting abundant housing and socializing land rents are independent policies presented as one answer.',
    proposedReplacement: 'An ideal city should permit abundant housing construction.',
  },
  q0118: {
    issue: 'double-barreled',
    rationale: 'Reducing incumbent veto points and preserving nuisance remedies are separable institutional choices.',
    proposedReplacement: 'Housing policy should reduce incumbent veto points over new construction.',
  },
  q0218: {
    issue: 'double-barreled',
    rationale: 'National legal-admission pathways and local restrictions affecting newcomer costs are different interventions.',
    proposedReplacement: 'Immigration reform should expand lawful admission pathways.',
  },
  q0237: {
    issue: 'construct-mismatch',
    rationale: 'Ancestry-based legal privilege and voluntary cultural association do not cleanly identify the listed centralization, state-action, or regulation constructs.',
    proposedReplacement: 'Public institutions should not assign legal privilege based on ancestry.',
  },
  q0273: {
    issue: 'double-barreled',
    rationale: 'Consent, children, dependents, exit, and official household recognition are distinct family-law judgments.',
    proposedReplacement: 'An ideal family-law system should not privilege one household model over other consensual adult arrangements.',
  },
  q0286: {
    issue: 'non-discriminating',
    rationale: 'Saying universal rights and group-conscious remedies can both matter is broadly inclusive and does not isolate a directional judgment.',
    proposedReplacement: 'When institutions discriminate by ancestry, group-conscious remedies can be justified.',
  },
  q0333: {
    issue: 'double-barreled',
    rationale: 'Free exchange, refuge, peace, and national glory are separable foreign-policy priorities.',
    proposedReplacement: 'An ideal foreign policy should prioritize peace over national glory.',
  },
  q0353: {
    issue: 'double-barreled',
    rationale: 'Rights protection and decentralized institutional competition are separate constitutional commitments.',
    proposedReplacement: 'An ideal constitutional order should allow multiple institutions to compete and experiment.',
  },
  q0393: {
    issue: 'double-barreled',
    rationale: 'Testing alternative institutions and minimizing domination during a transition are separate strategic judgments, while “liberatory” presumes the item’s evaluation.',
    proposedReplacement: 'Political movements should build and test alternative institutions during a transition.',
  },
  'fm-green-6': {
    issue: 'forced-choice-mismatch',
    rationale: 'Local land management and global carbon markets are different instruments at different scales, not mutually exclusive alternatives.',
    proposedReplacement: 'Environmental land-management authority should be local rather than national.',
  },
  'fm-market-4': {
    issue: 'double-barreled',
    rationale: 'The item combines an empirical performance claim with willingness to accept more bank failures and bundles multiple banking rules.',
    proposedReplacement: 'Banking should face fewer capital-reserve mandates than it does now.',
  },
  'fm-geolib-3': {
    issue: 'double-barreled',
    rationale: 'Free trade, open migration, and land-value taxation are three separable policy commitments, while “natural complements” is not a prescriptive choice.',
    proposedReplacement: 'Migration rules should remain open in an economy funded by land-value taxation.',
  },
  'fm-fasc-3': {
    issue: 'layer-mismatch',
    rationale: 'The stem asks whether coercion is morally legitimate, not which strategy should be used, and leaves “internal enemies” undefined.',
    proposedReplacement: 'Government should be permitted to suppress organized violent threats by force when necessary to preserve public order.',
  },
  'fm-green-8': {
    issue: 'duplicate',
    rationale: 'The same retained faction-module corpus already asks the substantively equivalent intrinsic-value claim in fm-green-1.',
    proposedReplacement: 'No replacement is required; retain fm-green-1 as the single intrinsic-value item.',
  },
}

/** Neutral wording edits that preserve each item's construct, layer, and score mapping. */
export const wordingCorrectionsById: Record<string, WordingCorrection> = {
  q0318: {
    prompt: 'Policy should favor abundance that reduces land, energy, and material intensity over mandatory consumption limits administered by public agencies.',
    rationale: 'Replace the loaded phrase “austerity imposed by bureaucracy” while retaining the policy contrast.',
  },
  q0380: {
    prompt: 'Regulatory agencies can turn uncertain technological risks into durable barriers to entry that protect incumbent firms.',
    rationale: 'Replace “safety bureaucracies” and isolate the public-choice claim about incumbent protection.',
  },
  q0165: {
    prompt: 'Due process should protect guilty and innocent people alike.',
    rationale: 'Remove the separate empirical premise about official trustworthiness from the normative due-process judgment.',
  },
  'fm-left-1': {
    prompt: 'Left movements should build new worker-controlled institutions rather than rely primarily on reforming current state institutions.',
    rationale: 'Ask for a strategy preference rather than predicting that reform cannot work.',
  },
  'fm-left-2': {
    prompt: 'Economic coordination should rely on federated elected workplace councils rather than a single centralized planning ministry.',
    rationale: 'Ask for an institutional preference rather than making an empirical “works best” claim.',
  },
  'fm-left-4': {
    prompt: 'Left-wing movements should prioritize elections and formal office over strikes, occupations, and other direct action.',
    rationale: 'Ask for a strategy preference rather than comparative empirical reliability.',
  },
  'fm-auth-1': {
    prompt: 'Local police and courts should answer to a single national chain of command rather than independent local authorities.',
    rationale: 'Ask for centralization preference rather than claiming centralized enforcement is most effective.',
  },
  'fm-anar-3': {
    prompt: 'Communities should meet material needs through self-run mutual-aid networks rather than a state welfare agency.',
    rationale: 'Ask for an institutional preference rather than comparative empirical reliability.',
  },
  'fm-market-3': {
    prompt: 'Dispute resolution should be open to competing private providers and arbitration rather than reserved to a state monopoly.',
    rationale: 'Ask for a single institutional policy preference rather than bundling security with an empirical performance claim.',
  },
  'fm-socdem-1': {
    prompt: 'Universal public services should be favored over means-tested welfare.',
    rationale: 'Ask for a welfare-policy preference rather than asserting a comparative effect on stigma.',
  },
  'fm-georgist-8': {
    prompt: 'Natural-resource rents should be used to fund a universal basic income.',
    rationale: 'Ask for a funding policy preference rather than mere feasibility.',
  },
  'fm-eco-3': {
    prompt: 'Climate policy should rely more on national or global coordination than on localism.',
    rationale: 'Ask for a coordination preference rather than asserting that localism is too slow.',
  },
}

export const nearDuplicateFindings: NearDuplicateFinding[] = [
  {
    questionIds: ['q0048', 'q0410'],
    rationale: 'Both descriptive items test the local-information problem in central economic planning with substantially overlapping confidence axes.',
    recommendedAction: 'Retain both only for a planned parallel-form or reliability study; otherwise retire one after respondent evidence identifies the clearer item.',
  },
  {
    questionIds: ['q0242', 'q0406'],
    rationale: 'Both normative items ask whether coercive civil law should be justified through reasons accessible outside a religious tradition.',
    recommendedAction: 'Retain both only for a planned reliability study; otherwise retire the less comprehensible item after cognitive interviews.',
  },
  {
    questionIds: ['q0238', 'q0298'],
    rationale: 'Both prescriptive items substantially overlap on equal legal status across cultural groups while bundling that principle with a second pluralism claim.',
    recommendedAction: 'Replace them with distinct single-construct items, then retain both only if pilot evidence shows that national civic status and cultural pluralism are empirically separable.',
  },
  {
    questionIds: ['q0089', 'fm-market-5'],
    rationale: 'Both descriptive items claim that occupational licensing protects incumbents more than consumers.',
    recommendedAction: 'Do not administer both to the same respondent unless they are intentionally designated as a repeated-item study.',
  },
  {
    questionIds: ['fm-green-1', 'fm-green-8'],
    rationale: 'Both items ask whether ecosystems have intrinsic value independent of human use.',
    recommendedAction: 'Retain fm-green-1 and quarantine the later duplicate fm-green-8 in the retained faction-module corpus.',
  },
  {
    questionIds: ['q0408', 'fm-geolib-1'],
    rationale: 'Both items assign the moral claim to unimproved land value to the community rather than the individual improver.',
    recommendedAction: 'Avoid co-administration unless the pair is intentionally designated for repeated-item analysis.',
  },
]

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
  const wording = wordingCorrectionsById[String(question.id)]
  const replacementRequired = replacementRequiredById[String(question.id)]
  const previouslyQuarantined = question.active === false || question.reviewStatus === 'needs-rewrite'
  const confidencePrompt = !previouslyQuarantined && question.layer === 'descriptive' ? DEFAULT_CONFIDENCE_PROMPT : undefined
  const priorityPrompt = !previouslyQuarantined && question.layer === 'prescriptive' ? DEFAULT_PRIORITY_PROMPT : undefined
  const responsePromptChanged = confidencePrompt !== undefined
    ? question.confidencePrompt !== confidencePrompt
    : priorityPrompt !== undefined && question.priorityPrompt !== priorityPrompt

  if (!promotion && !wording && !replacementRequired && !responsePromptChanged) return question

  return {
    ...question,
    ...(promotion ? { tier: promotion.tier } : {}),
    ...(wording ? { prompt: wording.prompt } : {}),
    ...(confidencePrompt ? { confidencePrompt } : {}),
    ...(priorityPrompt ? { priorityPrompt } : {}),
    ...(replacementRequired
      ? {
          active: false,
          reviewStatus: 'needs-rewrite' as const,
          version: RESPONDENT_QUESTION_REVIEW_VERSION,
          updatedAt: RESPONDENT_QUESTION_REVIEW_DATE,
          deprecationReason: replacementRequired.rationale,
        }
      : wording || responsePromptChanged
      ? {
          reviewStatus: 'approved' as const,
          version: RESPONDENT_QUESTION_REVIEW_VERSION,
          updatedAt: RESPONDENT_QUESTION_REVIEW_DATE,
        }
      : {}),
  }
}
