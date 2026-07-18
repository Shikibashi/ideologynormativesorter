import type { AxisWeight, Question } from '../types'

export type SemanticIssueType =
  | 'sign-inversion'
  | 'construct-mismatch'
  | 'template-carryover'
  | 'double-barreled'
  | 'non-discriminating'
  | 'underspecified'

export interface SemanticCorrection {
  issue: SemanticIssueType
  rationale: string
  axisWeights: AxisWeight[]
}

export interface SemanticReviewEntry {
  questionId: string
  status: 'corrected' | 'needs-rewrite'
  issue: SemanticIssueType
  rationale: string
}

export const SEMANTIC_AUDIT_VERSION = '2026-07-semantic-v1'
export const SEMANTIC_AUDIT_DATE = '2026-07-18'

/**
 * High-confidence corrections from a full prompt-to-axis review of the core bank.
 * Ambiguous items are not silently reweighted; they are listed in needsRewriteById.
 */
export const semanticCorrections: Record<string, SemanticCorrection> = {
  q0007: {
    issue: 'construct-mismatch',
    rationale: 'Competitive provision under exit measures decentralized coordination and market confidence, not confidence in state administration.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.5 },
      { axisId: 'state-capacity-confidence', weight: -0.4 },
      { axisId: 'coordination-optimism', weight: 0.8 },
    ],
  },
  q0011: {
    issue: 'construct-mismatch',
    rationale: 'Switchable competing legal systems primarily test coordination and exit rather than state capacity.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.4 },
      { axisId: 'state-capacity-confidence', weight: -0.3 },
      { axisId: 'coordination-optimism', weight: 0.7 },
    ],
  },
  q0012: {
    issue: 'sign-inversion',
    rationale: 'Order through decentralized norms is evidence for coordination optimism and against dependence on a sovereign center.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.6 },
      { axisId: 'coordination-optimism', weight: 0.8 },
    ],
  },
  q0016: {
    issue: 'sign-inversion',
    rationale: 'Sequencing abolition around replacement institutions is gradualist and exit-oriented.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.6 },
      { axisId: 'centralization-preference', weight: -0.5 },
      { axisId: 'gradualism-vs-immediatism', weight: -0.8 },
    ],
  },
  q0019: {
    issue: 'sign-inversion',
    rationale: 'Constitutional limits on rulers express anti-domination rather than acceptance of domination.',
    axisWeights: [
      { axisId: 'authority-legitimacy', weight: 0.2 },
      { axisId: 'anti-domination', weight: 0.8 },
      { axisId: 'liberty-noninterference', weight: 0.6 },
    ],
  },
  q0021: {
    issue: 'sign-inversion',
    rationale: 'Rejecting privileges created by law or conquest is anti-dominating.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: 0.6 },
      { axisId: 'anti-domination', weight: 0.5 },
    ],
  },
  q0023: {
    issue: 'sign-inversion',
    rationale: 'Requiring defensible ownership rather than state-recognized title is an anti-domination constraint.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: 0.3 },
      { axisId: 'anti-domination', weight: 0.6 },
      { axisId: 'liberty-noninterference', weight: 0.3 },
    ],
  },
  q0024: {
    issue: 'sign-inversion',
    rationale: 'Rectifying privilege-created wealth weakens unconditional title and strengthens equality and anti-domination.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: -0.3 },
      { axisId: 'anti-domination', weight: 0.7 },
      { axisId: 'equality-theory', weight: 0.6 },
    ],
  },
  q0026: {
    issue: 'sign-inversion',
    rationale: 'Conditioning property legitimacy on livelihood and exit is anti-dominating and substantively egalitarian.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: -0.4 },
      { axisId: 'anti-domination', weight: 0.8 },
      { axisId: 'equality-theory', weight: 0.4 },
    ],
  },
  q0027: {
    issue: 'sign-inversion',
    rationale: 'Clear transferable rules reducing conflict support market-process confidence when artificial scarcity is absent.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.6 },
      { axisId: 'public-choice-skepticism', weight: 0.4 },
    ],
  },
  q0030: {
    issue: 'construct-mismatch',
    rationale: 'Political managers reproducing hierarchy is principally public-choice skepticism and lower state-capacity confidence.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.8 },
      { axisId: 'state-capacity-confidence', weight: -0.5 },
    ],
  },
  q0033: {
    issue: 'sign-inversion',
    rationale: 'Changing ownership rules before distribution is predistribution, the negative pole of this axis.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.8 },
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
      { axisId: 'state-action-vs-exit', weight: 0.2 },
    ],
  },
  q0034: {
    issue: 'sign-inversion',
    rationale: 'Removing monopoly privilege and entry barriers is predistributive and deregulatory.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.9 },
      { axisId: 'regulation-vs-deregulation', weight: -0.6 },
      { axisId: 'state-action-vs-exit', weight: 0.2 },
    ],
  },
  q0036: {
    issue: 'sign-inversion',
    rationale: 'Facilitating cooperatives and small firms changes market-entry rules before outcomes and expands exit.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.7 },
      { axisId: 'regulation-vs-deregulation', weight: -0.5 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
    ],
  },
  q0038: {
    issue: 'sign-inversion',
    rationale: 'Making ownership contestable changes underlying rules rather than redistributing after outcomes.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.8 },
      { axisId: 'regulation-vs-deregulation', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: -0.4 },
    ],
  },
  q0047: {
    issue: 'construct-mismatch',
    rationale: 'Price coordination among strangers directly measures market confidence and decentralized coordination.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.9 },
      { axisId: 'expert-confidence', weight: -0.3 },
      { axisId: 'coordination-optimism', weight: 0.7 },
    ],
  },
  q0050: {
    issue: 'template-carryover',
    rationale: 'Regulators relying on incumbent information indicates capture and expert limitations more than market performance.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.2 },
      { axisId: 'expert-confidence', weight: -0.6 },
      { axisId: 'public-choice-skepticism', weight: 0.8 },
    ],
  },
  q0057: {
    issue: 'sign-inversion',
    rationale: 'Automatic subsidy expiration and adversarial review reduce regulatory and centralized discretion.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.5 },
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
    ],
  },
  q0068: {
    issue: 'sign-inversion',
    rationale: 'Benefit cliffs and behavioral penalties indicate lower administrative capacity and greater institutional skepticism.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.8 },
      { axisId: 'public-choice-skepticism', weight: 0.5 },
    ],
  },
  q0074: {
    issue: 'sign-inversion',
    rationale: 'Cash assistance remains public redistribution even when it is less paternalistic.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: 0.8 },
      { axisId: 'state-action-vs-exit', weight: 0.5 },
      { axisId: 'regulation-vs-deregulation', weight: -0.3 },
    ],
  },
  q0075: {
    issue: 'sign-inversion',
    rationale: 'Removing cost-raising rules before adding transfers is predistribution and deregulation.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.9 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
      { axisId: 'regulation-vs-deregulation', weight: -0.6 },
    ],
  },
  q0077: {
    issue: 'construct-mismatch',
    rationale: 'Local welfare experimentation primarily measures decentralization and exit.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.7 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
      { axisId: 'regulation-vs-deregulation', weight: -0.2 },
    ],
  },
  q0080: {
    issue: 'sign-inversion',
    rationale: 'Permanent bureaucratic constituencies are evidence for public-choice skepticism even if poverty falls.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: 0.3 },
      { axisId: 'public-choice-skepticism', weight: 0.7 },
    ],
  },
  q0081: {
    issue: 'sign-inversion',
    rationale: 'Freedom to organize, refuse, bargain, exit, or compete is positive liberty-as-noninterference and anti-domination.',
    axisWeights: [
      { axisId: 'anti-domination', weight: 0.7 },
      { axisId: 'liberty-noninterference', weight: 0.8 },
      { axisId: 'property-legitimacy', weight: 0.3 },
    ],
  },
  q0097: {
    issue: 'sign-inversion',
    rationale: 'Simplifying cooperative law is deregulatory and expands organizational exit options.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.7 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0104: {
    issue: 'sign-inversion',
    rationale: 'Rejecting incumbent exclusion weakens absolute property claims and strengthens equality and anti-domination.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: -0.5 },
      { axisId: 'equality-theory', weight: 0.6 },
      { axisId: 'anti-domination', weight: 0.7 },
    ],
  },
  q0106: {
    issue: 'sign-inversion',
    rationale: 'Rejecting permanent private capture of land rents weakens title and strengthens egalitarian claims.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: -0.4 },
      { axisId: 'equality-theory', weight: 0.5 },
      { axisId: 'anti-domination', weight: 0.4 },
    ],
  },
  q0114: {
    issue: 'sign-inversion',
    rationale: 'Legalizing supply before demand subsidies is deregulatory and predistributive.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.9 },
      { axisId: 'redistribution-vs-predistribution', weight: -0.8 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0118: {
    issue: 'sign-inversion',
    rationale: 'Reducing incumbent veto points changes pre-distribution rules and decentralizes permission.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.8 },
      { axisId: 'redistribution-vs-predistribution', weight: -0.6 },
      { axisId: 'centralization-preference', weight: -0.4 },
    ],
  },
  q0119: {
    issue: 'sign-inversion',
    rationale: 'Rejecting exclusion from high-opportunity places weakens absolute title and supports equality and anti-domination.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: -0.4 },
      { axisId: 'equality-theory', weight: 0.7 },
      { axisId: 'anti-domination', weight: 0.6 },
    ],
  },
  q0133: {
    issue: 'sign-inversion',
    rationale: 'Competing money and no privileged issuer are exit-oriented, decentralized, and deregulatory.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.9 },
      { axisId: 'regulation-vs-deregulation', weight: -0.8 },
      { axisId: 'centralization-preference', weight: -0.6 },
    ],
  },
  q0136: {
    issue: 'sign-inversion',
    rationale: 'Permission to use alternative currencies is an exit-oriented and deregulatory policy.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.9 },
      { axisId: 'regulation-vs-deregulation', weight: -0.8 },
      { axisId: 'centralization-preference', weight: -0.4 },
    ],
  },
  q0137: {
    issue: 'construct-mismatch',
    rationale: 'Narrow, disclosed, sunsetted emergency powers reduce centralization and coercive discretion.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.7 },
      { axisId: 'coercion-strategy', weight: -0.6 },
      { axisId: 'regulation-vs-deregulation', weight: 0.3 },
    ],
  },
  q0147: {
    issue: 'construct-mismatch',
    rationale: 'Open standards lowering experimentation costs measure decentralized coordination and innovation.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.5 },
      { axisId: 'coordination-optimism', weight: 0.8 },
      { axisId: 'expert-confidence', weight: 0.2 },
    ],
  },
  q0156: {
    issue: 'sign-inversion',
    rationale: 'Mandating open access for publicly funded research is an affirmative public rule, not exit from state action.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.7 },
      { axisId: 'state-action-vs-exit', weight: 0.5 },
      { axisId: 'centralization-preference', weight: 0.2 },
    ],
  },
  q0167: {
    issue: 'construct-mismatch',
    rationale: 'Correction through open debate measures democratic and decentralized epistemic confidence.',
    axisWeights: [
      { axisId: 'democratic-confidence', weight: 0.8 },
      { axisId: 'coordination-optimism', weight: 0.3 },
    ],
  },
  q0173: {
    issue: 'sign-inversion',
    rationale: 'Default civil-liberty protections constrain coercion rather than endorse it.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: 0.4 },
      { axisId: 'coercion-strategy', weight: -0.8 },
    ],
  },
  q0174: {
    issue: 'sign-inversion',
    rationale: 'Narrowly limiting speech restrictions is anti-coercive and deregulatory.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.5 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
      { axisId: 'coercion-strategy', weight: -0.8 },
    ],
  },
  q0175: {
    issue: 'sign-inversion',
    rationale: 'Warrants and adversarial review regulate state surveillance while reducing coercive discretion.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.6 },
      { axisId: 'state-action-vs-exit', weight: 0.4 },
      { axisId: 'coercion-strategy', weight: -0.7 },
    ],
  },
  q0176: {
    issue: 'sign-inversion',
    rationale: 'Automatic sunset of emergency limits reduces centralization and coercion.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
      { axisId: 'centralization-preference', weight: -0.5 },
      { axisId: 'coercion-strategy', weight: -0.8 },
    ],
  },
  q0177: {
    issue: 'construct-mismatch',
    rationale: 'Disclosure of state suppression requests regulates government-platform conduct and constrains coercion.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.5 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
      { axisId: 'coercion-strategy', weight: -0.5 },
    ],
  },
  q0178: {
    issue: 'sign-inversion',
    rationale: 'Designing for hostile future rulers is a constraint on centralized coercive power.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
      { axisId: 'coercion-strategy', weight: -0.8 },
    ],
  },
  q0193: {
    issue: 'sign-inversion',
    rationale: 'Restitution and prevention with only necessary incapacitation imply lower coercion.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: 0.4 },
      { axisId: 'regulation-vs-deregulation', weight: -0.2 },
      { axisId: 'coercion-strategy', weight: -0.6 },
    ],
  },
  q0194: {
    issue: 'sign-inversion',
    rationale: 'Decriminalizing victimless conduct reduces regulation and coercion.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.6 },
      { axisId: 'regulation-vs-deregulation', weight: -0.7 },
      { axisId: 'coercion-strategy', weight: -0.8 },
    ],
  },
  q0195: {
    issue: 'sign-inversion',
    rationale: 'Narrowing official immunity adds accountability rules while constraining coercive discretion.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: 0.4 },
      { axisId: 'regulation-vs-deregulation', weight: 0.6 },
      { axisId: 'coercion-strategy', weight: -0.6 },
    ],
  },
  q0196: {
    issue: 'sign-inversion',
    rationale: 'Requiring conviction or abolishing forfeiture reduces state coercion and enforcement scope.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'regulation-vs-deregulation', weight: -0.5 },
      { axisId: 'coercion-strategy', weight: -0.8 },
    ],
  },
  q0197: {
    issue: 'sign-inversion',
    rationale: 'Limiting pretrial detention is an anti-coercive constraint.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: 0.2 },
      { axisId: 'regulation-vs-deregulation', weight: -0.2 },
      { axisId: 'coercion-strategy', weight: -0.8 },
    ],
  },
  q0198: {
    issue: 'sign-inversion',
    rationale: 'Reducing official discretion decentralizes authority and constrains coercion.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.5 },
      { axisId: 'regulation-vs-deregulation', weight: 0.4 },
      { axisId: 'coercion-strategy', weight: -0.7 },
    ],
  },
  q0206: {
    issue: 'sign-inversion',
    rationale: 'Preserving institutions without treating outsiders as rightless supports liberty rather than restricting it.',
    axisWeights: [
      { axisId: 'political-community-boundary', weight: 0.5 },
      { axisId: 'liberty-noninterference', weight: 0.7 },
      { axisId: 'equality-theory', weight: 0.4 },
    ],
  },
  q0207: {
    issue: 'construct-mismatch',
    rationale: 'Migration-enabled cooperation tests cultural adaptation and decentralized coordination.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.4 },
      { axisId: 'cultural-plasticity', weight: 0.7 },
      { axisId: 'coordination-optimism', weight: 0.6 },
    ],
  },
  q0208: {
    issue: 'construct-mismatch',
    rationale: 'Restrictions benefiting domestic insiders are a public-choice claim.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.4 },
      { axisId: 'public-choice-skepticism', weight: 0.7 },
    ],
  },
  q0209: {
    issue: 'construct-mismatch',
    rationale: 'Vulnerability caused by illegal status measures institutional abuse and weak state protection.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.5 },
      { axisId: 'state-capacity-confidence', weight: -0.4 },
    ],
  },
  q0217: {
    issue: 'construct-mismatch',
    rationale: 'Restricting interior enforcement to violence and fraud narrows regulation and coercion.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.6 },
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'coercion-strategy', weight: -0.8 },
    ],
  },
  q0220: {
    issue: 'construct-mismatch',
    rationale: 'Employer sanctions driving off-book exploitation indicate policy failure and public-choice effects.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: -0.2 },
      { axisId: 'state-capacity-confidence', weight: -0.4 },
      { axisId: 'public-choice-skepticism', weight: 0.5 },
    ],
  },
  q0221: {
    issue: 'sign-inversion',
    rationale: 'Voluntary national belonging without rule or exclusion is anti-dominating.',
    axisWeights: [
      { axisId: 'political-community-boundary', weight: 0.4 },
      { axisId: 'anti-domination', weight: 0.7 },
      { axisId: 'moral-traditionalism', weight: -0.3 },
    ],
  },
  q0223: {
    issue: 'sign-inversion',
    rationale: 'Local self-government valued for exit and pluralism is anti-dominating.',
    axisWeights: [
      { axisId: 'political-community-boundary', weight: 0.2 },
      { axisId: 'anti-domination', weight: 0.7 },
      { axisId: 'liberty-noninterference', weight: 0.4 },
    ],
  },
  q0226: {
    issue: 'sign-inversion',
    rationale: 'Rejecting national ownership of persons is anti-dominating.',
    axisWeights: [
      { axisId: 'political-community-boundary', weight: 0.3 },
      { axisId: 'anti-domination', weight: 0.7 },
      { axisId: 'moral-traditionalism', weight: -0.2 },
    ],
  },
  q0227: {
    issue: 'sign-inversion',
    rationale: 'Plural civic rituals building trust support cultural adaptability, coordination, and democratic confidence.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: 0.6 },
      { axisId: 'democratic-confidence', weight: 0.3 },
      { axisId: 'coordination-optimism', weight: 0.5 },
    ],
  },
  q0228: {
    issue: 'construct-mismatch',
    rationale: 'Politicians defining rivals as internal foreigners is elite incentive/capture plus cultural rigidity.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: -0.6 },
      { axisId: 'democratic-confidence', weight: -0.5 },
      { axisId: 'public-choice-skepticism', weight: 0.8 },
    ],
  },
  q0230: {
    issue: 'construct-mismatch',
    rationale: 'Elite capture of secession movements primarily measures public-choice skepticism.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: -0.2 },
      { axisId: 'democratic-confidence', weight: -0.2 },
      { axisId: 'public-choice-skepticism', weight: 0.7 },
    ],
  },
  q0237: {
    issue: 'construct-mismatch',
    rationale: 'Avoiding ancestry privilege while permitting association is a modest public-rule and decentralization preference, not strong centralization.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.2 },
      { axisId: 'state-action-vs-exit', weight: 0.3 },
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
    ],
  },
  q0240: {
    issue: 'construct-mismatch',
    rationale: 'Patriotism becoming executive compliance measures public-choice incentives and democratic erosion.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.2 },
      { axisId: 'public-choice-skepticism', weight: 0.8 },
      { axisId: 'democratic-confidence', weight: -0.5 },
    ],
  },
  q0247: {
    issue: 'construct-mismatch',
    rationale: 'Religious institutions sustaining charity without state power measures voluntary coordination.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.2 },
      { axisId: 'cultural-plasticity', weight: -0.2 },
      { axisId: 'coordination-optimism', weight: 0.7 },
    ],
  },
  q0248: {
    issue: 'construct-mismatch',
    rationale: 'Clerical enforcement turning theological disputes into legal conflict is capture and lower democratic confidence.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.8 },
      { axisId: 'democratic-confidence', weight: -0.4 },
    ],
  },
  q0249: {
    issue: 'construct-mismatch',
    rationale: 'Dogmatic secular bureaucracy measures public-choice and expert skepticism.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.7 },
      { axisId: 'expert-confidence', weight: -0.5 },
    ],
  },
  q0255: {
    issue: 'sign-inversion',
    rationale: 'Refusing state funding or enforcement of doctrine is exit-oriented, deregulatory, and anti-coercive.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.8 },
      { axisId: 'regulation-vs-deregulation', weight: -0.6 },
      { axisId: 'coercion-strategy', weight: -0.7 },
    ],
  },
  q0256: {
    issue: 'sign-inversion',
    rationale: 'Equal rules for publicly funded organizations require affirmative public oversight.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: 0.4 },
      { axisId: 'regulation-vs-deregulation', weight: 0.6 },
      { axisId: 'centralization-preference', weight: 0.1 },
    ],
  },
  q0258: {
    issue: 'sign-inversion',
    rationale: 'Secularism as a limit on state power over conscience is exit-oriented and anti-coercive.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.8 },
      { axisId: 'regulation-vs-deregulation', weight: -0.4 },
      { axisId: 'coercion-strategy', weight: -0.6 },
    ],
  },
  q0263: {
    issue: 'construct-mismatch',
    rationale: 'Social respect for unpaid care primarily measures substantive equality and anti-domination.',
    axisWeights: [
      { axisId: 'equality-theory', weight: 0.8 },
      { axisId: 'anti-domination', weight: 0.4 },
    ],
  },
  q0264: {
    issue: 'construct-mismatch',
    rationale: 'Consent under blocked exit is directly an anti-domination and liberty issue.',
    axisWeights: [
      { axisId: 'anti-domination', weight: 0.9 },
      { axisId: 'liberty-noninterference', weight: 0.6 },
      { axisId: 'equality-theory', weight: 0.4 },
    ],
  },
  q0266: {
    issue: 'sign-inversion',
    rationale: 'Protecting dependents without criminalizing adult difference supports liberty and pluralism.',
    axisWeights: [
      { axisId: 'moral-traditionalism', weight: -0.5 },
      { axisId: 'liberty-noninterference', weight: 0.6 },
      { axisId: 'equality-theory', weight: 0.3 },
    ],
  },
  q0267: {
    issue: 'construct-mismatch',
    rationale: 'Plural family coexistence under clear rules measures cultural adaptability and decentralized coordination.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: 0.7 },
      { axisId: 'state-capacity-confidence', weight: 0.1 },
      { axisId: 'coordination-optimism', weight: 0.5 },
    ],
  },
  q0268: {
    issue: 'sign-inversion',
    rationale: 'Persistence of disparities after legal change is evidence for cultural persistence, the negative pole.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: -0.8 },
      { axisId: 'state-capacity-confidence', weight: -0.2 },
    ],
  },
  q0269: {
    issue: 'construct-mismatch',
    rationale: 'Administrative favoritism toward household forms is a public-choice and capacity concern.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: -0.3 },
      { axisId: 'state-capacity-confidence', weight: -0.2 },
      { axisId: 'public-choice-skepticism', weight: 0.7 },
    ],
  },
  q0270: {
    issue: 'sign-inversion',
    rationale: 'Policy failing because complementary constraints remain indicates lower state capacity and institutional persistence.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: -0.3 },
      { axisId: 'state-capacity-confidence', weight: -0.6 },
      { axisId: 'public-choice-skepticism', weight: 0.2 },
    ],
  },
  q0271: {
    issue: 'construct-mismatch',
    rationale: 'Moral panic expanding surveillance is a public-choice and institutional-persistence claim.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: -0.3 },
      { axisId: 'state-capacity-confidence', weight: -0.2 },
      { axisId: 'public-choice-skepticism', weight: 0.6 },
    ],
  },
  q0273: {
    issue: 'sign-inversion',
    rationale: 'A family-law system protecting consent, children, dependents, and exit requires public rules while constraining coercion.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.3 },
      { axisId: 'state-action-vs-exit', weight: 0.6 },
      { axisId: 'coercion-strategy', weight: -0.5 },
    ],
  },
  q0275: {
    issue: 'construct-mismatch',
    rationale: 'Restricting intervention to concrete abuse narrows regulation and coercion.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.3 },
      { axisId: 'state-action-vs-exit', weight: 0.2 },
      { axisId: 'coercion-strategy', weight: -0.7 },
    ],
  },
  q0276: {
    issue: 'sign-inversion',
    rationale: 'Caregiver support is an affirmative redistributive/public provision even when designed to preserve exit.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: 0.7 },
      { axisId: 'state-action-vs-exit', weight: 0.5 },
      { axisId: 'regulation-vs-deregulation', weight: 0.1 },
    ],
  },
  q0277: {
    issue: 'sign-inversion',
    rationale: 'Reducing artificial scarcity changes underlying rules and is therefore predistributive.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.7 },
      { axisId: 'regulation-vs-deregulation', weight: 0.3 },
      { axisId: 'state-action-vs-exit', weight: 0.4 },
    ],
  },
  q0280: {
    issue: 'construct-mismatch',
    rationale: 'Licensing operating as a cartel is public-choice skepticism and lower state-capacity confidence.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: -0.2 },
      { axisId: 'state-capacity-confidence', weight: -0.5 },
      { axisId: 'public-choice-skepticism', weight: 0.8 },
    ],
  },
  q0283: {
    issue: 'construct-mismatch',
    rationale: 'The prompt explicitly prioritizes anti-domination, which should be the dominant loading.',
    axisWeights: [
      { axisId: 'equality-theory', weight: 0.4 },
      { axisId: 'political-community-boundary', weight: 0.2 },
      { axisId: 'anti-domination', weight: 1 },
    ],
  },
  q0285: {
    issue: 'sign-inversion',
    rationale: 'Targeting continuing institutional restrictions rather than collective guilt remains universalist and anti-dominating.',
    axisWeights: [
      { axisId: 'equality-theory', weight: 0.3 },
      { axisId: 'political-community-boundary', weight: 0.3 },
      { axisId: 'anti-domination', weight: 0.6 },
    ],
  },
  q0286: {
    issue: 'sign-inversion',
    rationale: 'Combining universal rights with group-conscious remedies supports broad obligations rather than a narrow community boundary.',
    axisWeights: [
      { axisId: 'equality-theory', weight: 0.7 },
      { axisId: 'political-community-boundary', weight: 0.5 },
      { axisId: 'anti-domination', weight: 0.5 },
    ],
  },
  q0287: {
    issue: 'construct-mismatch',
    rationale: 'Plural coexistence through rights and exit measures cultural adaptability and coordination.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: 0.6 },
      { axisId: 'democratic-confidence', weight: 0.2 },
      { axisId: 'coordination-optimism', weight: 0.5 },
    ],
  },
  q0288: {
    issue: 'sign-inversion',
    rationale: 'Cumulative institutional effects imply persistence rather than rapid cultural plasticity.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: -0.6 },
      { axisId: 'state-capacity-confidence', weight: -0.2 },
      { axisId: 'public-choice-skepticism', weight: 0.2 },
    ],
  },
  q0289: {
    issue: 'construct-mismatch',
    rationale: 'Patronage incentives created by quotas are primarily a public-choice claim.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.3 },
      { axisId: 'public-choice-skepticism', weight: 0.8 },
    ],
  },
  q0291: {
    issue: 'construct-mismatch',
    rationale: 'Politicians exploiting ethnic categories is elite incentive/capture and lower democratic confidence.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: -0.2 },
      { axisId: 'democratic-confidence', weight: -0.4 },
      { axisId: 'public-choice-skepticism', weight: 0.8 },
    ],
  },
  q0293: {
    issue: 'construct-mismatch',
    rationale: 'Equal rights plus voluntary cultural association does not directly imply post-outcome redistribution.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: 0.3 },
      { axisId: 'regulation-vs-deregulation', weight: -0.2 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0294: {
    issue: 'sign-inversion',
    rationale: 'Removing institutional barriers before permanent administrative sorting is predistributive.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.8 },
      { axisId: 'regulation-vs-deregulation', weight: -0.3 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0296: {
    issue: 'sign-inversion',
    rationale: 'Changing school and housing boundaries alters underlying opportunity rules before distribution.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.8 },
      { axisId: 'regulation-vs-deregulation', weight: 0.5 },
      { axisId: 'state-action-vs-exit', weight: 0.4 },
    ],
  },
  q0298: {
    issue: 'construct-mismatch',
    rationale: 'Pluralism without caste is a public-rule design claim, not specifically redistribution.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: 0.3 },
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0300: {
    issue: 'sign-inversion',
    rationale: 'Persistence of injustice from a historically discriminatory baseline implies institutional persistence.',
    axisWeights: [
      { axisId: 'cultural-plasticity', weight: -0.6 },
      { axisId: 'state-capacity-confidence', weight: -0.3 },
      { axisId: 'public-choice-skepticism', weight: 0.3 },
    ],
  },
  q0308: {
    issue: 'sign-inversion',
    rationale: 'Rules favoring large incumbents indicate capture and lower state capacity, not high state capacity.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.5 },
      { axisId: 'market-process-confidence', weight: 0.2 },
      { axisId: 'public-choice-skepticism', weight: 0.8 },
    ],
  },
  q0310: {
    issue: 'construct-mismatch',
    rationale: 'Rationing authority becoming entrenched is primarily a public-choice concern.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.2 },
      { axisId: 'market-process-confidence', weight: -0.2 },
      { axisId: 'public-choice-skepticism', weight: 0.7 },
    ],
  },
  q0313: {
    issue: 'sign-inversion',
    rationale: 'Internalizing harms requires some regulation while the prompt explicitly rejects open-ended central control.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.5 },
      { axisId: 'centralization-preference', weight: -0.7 },
      { axisId: 'state-action-vs-exit', weight: 0.2 },
    ],
  },
  q0315: {
    issue: 'construct-mismatch',
    rationale: 'Technology-neutral rules add oversight but do not imply centralized technology selection.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.6 },
      { axisId: 'centralization-preference', weight: -0.2 },
      { axisId: 'state-action-vs-exit', weight: 0.2 },
    ],
  },
  q0317: {
    issue: 'sign-inversion',
    rationale: 'Sunset and anti-capture review constrain centralized subsidy discretion.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
    ],
  },
  q0326: {
    issue: 'sign-inversion',
    rationale: 'Solidarity abroad without military control is universalist, anti-dominating, and anti-militarist.',
    axisWeights: [
      { axisId: 'anti-domination', weight: 0.6 },
      { axisId: 'political-community-boundary', weight: 0.5 },
      { axisId: 'authority-legitimacy', weight: -0.2 },
      { axisId: 'militarism-pacifism', weight: -0.8 },
    ],
  },
  q0327: {
    issue: 'construct-mismatch',
    rationale: 'Trade and migration reducing conflict measures market and decentralized coordination confidence.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.5 },
      { axisId: 'democratic-confidence', weight: 0.2 },
      { axisId: 'coordination-optimism', weight: 0.7 },
    ],
  },
  q0328: {
    issue: 'construct-mismatch',
    rationale: 'Intervention knowledge failures measure lower state and expert confidence.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.7 },
      { axisId: 'expert-confidence', weight: -0.6 },
      { axisId: 'public-choice-skepticism', weight: 0.2 },
    ],
  },
  q0329: {
    issue: 'construct-mismatch',
    rationale: 'Threat inflation by contractors and agencies is a direct public-choice claim.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.3 },
      { axisId: 'public-choice-skepticism', weight: 0.9 },
      { axisId: 'democratic-confidence', weight: -0.2 },
    ],
  },
  q0333: {
    issue: 'sign-inversion',
    rationale: 'Peace, refuge, and exchange over national glory imply exit, decentralization, and low coercion.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'coercion-strategy', weight: -0.9 },
    ],
  },
  q0334: {
    issue: 'sign-inversion',
    rationale: 'Defensive purpose, exit criteria, and cost accounting constrain rather than endorse coercion.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: 0.3 },
      { axisId: 'centralization-preference', weight: -0.5 },
      { axisId: 'coercion-strategy', weight: -0.4 },
    ],
  },
  q0335: {
    issue: 'sign-inversion',
    rationale: 'Liberalization instead of nation-building is exit-oriented, decentralized, and anti-coercive.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'coercion-strategy', weight: -0.9 },
    ],
  },
  q0336: {
    issue: 'sign-inversion',
    rationale: 'Legislative authorization and sunset constrain centralized coercive power.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: 0.5 },
      { axisId: 'centralization-preference', weight: -0.7 },
      { axisId: 'coercion-strategy', weight: -0.5 },
    ],
  },
  q0337: {
    issue: 'sign-inversion',
    rationale: 'Scrutinizing arms transfers for harm constrains coercive strategy.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: 0.2 },
      { axisId: 'centralization-preference', weight: -0.3 },
      { axisId: 'coercion-strategy', weight: -0.6 },
    ],
  },
  q0338: {
    issue: 'sign-inversion',
    rationale: 'Assuming planners lack local knowledge supports decentralization, exit, and lower coercive confidence.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'centralization-preference', weight: -0.6 },
      { axisId: 'coercion-strategy', weight: -0.4 },
    ],
  },
  q0342: {
    issue: 'sign-inversion',
    rationale: 'Expert advice without replacing consent supports liberty and anti-domination.',
    axisWeights: [
      { axisId: 'authority-legitimacy', weight: -0.2 },
      { axisId: 'liberty-noninterference', weight: 0.4 },
      { axisId: 'anti-domination', weight: 0.7 },
    ],
  },
  q0346: {
    issue: 'sign-inversion',
    rationale: 'Combining voice, exit, rights, expertise, and competition supports liberty and anti-domination.',
    axisWeights: [
      { axisId: 'authority-legitimacy', weight: -0.2 },
      { axisId: 'liberty-noninterference', weight: 0.4 },
      { axisId: 'anti-domination', weight: 0.6 },
    ],
  },
  q0348: {
    issue: 'sign-inversion',
    rationale: 'Low voter information is evidence against democratic confidence.',
    axisWeights: [
      { axisId: 'democratic-confidence', weight: -0.8 },
      { axisId: 'expert-confidence', weight: 0.1 },
      { axisId: 'public-choice-skepticism', weight: 0.2 },
    ],
  },
  q0353: {
    issue: 'sign-inversion',
    rationale: 'Competing institutions and experimentation imply decentralization rather than strong centralization.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.7 },
      { axisId: 'state-action-vs-exit', weight: 0.2 },
      { axisId: 'compromise-vs-persistence', weight: 0.2 },
    ],
  },
  q0357: {
    issue: 'construct-mismatch',
    rationale: 'Local experimentation with portable rights is decentralized but still uses public safeguards.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.5 },
      { axisId: 'state-action-vs-exit', weight: 0.3 },
      { axisId: 'compromise-vs-persistence', weight: 0.2 },
    ],
  },
  q0367: {
    issue: 'construct-mismatch',
    rationale: 'Open ecosystems enabling independent audits measure coordination and distributed expertise.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.3 },
      { axisId: 'expert-confidence', weight: 0.2 },
      { axisId: 'coordination-optimism', weight: 0.8 },
    ],
  },
  q0375: {
    issue: 'construct-mismatch',
    rationale: 'Warrants and minimization add oversight while constraining coercive data access.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.6 },
      { axisId: 'state-action-vs-exit', weight: 0.4 },
      { axisId: 'coercion-strategy', weight: -0.8 },
    ],
  },
  q0377: {
    issue: 'sign-inversion',
    rationale: 'Interoperability mandates are affirmative regulation, even when used to reduce lock-in.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.8 },
      { axisId: 'state-action-vs-exit', weight: 0.3 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0387: {
    issue: 'sign-inversion',
    rationale: 'Prefigurative institutions revealing practical knowledge support coordination optimism.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.1 },
      { axisId: 'coordination-optimism', weight: 0.8 },
      { axisId: 'democratic-confidence', weight: 0.2 },
    ],
  },
  q0388: {
    issue: 'construct-mismatch',
    rationale: 'Emergency authority persisting after victory is chiefly a public-choice and accountability claim.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.8 },
      { axisId: 'coordination-optimism', weight: -0.3 },
      { axisId: 'democratic-confidence', weight: -0.2 },
    ],
  },
}

/** Items that need rewritten prompts or separate items before their weights can be defended. */
export const needsRewriteById: Record<string, { issue: SemanticIssueType; rationale: string }> = {
  q0031: { issue: 'underspecified', rationale: 'The prompt lists several cooperative failure conditions without a single falsifiable construct.' },
  q0032: { issue: 'non-discriminating', rationale: 'Saying different assets require different rules does not identify a directional empirical belief.' },
  q0052: { issue: 'non-discriminating', rationale: 'The item states that both markets and planning can fail under missing information or accountability.' },
  q0070: { issue: 'double-barreled', rationale: 'The item combines lower stigma with transfers to non-needy recipients, which can produce conflicting answers.' },
  q0072: { issue: 'non-discriminating', rationale: 'The item says many causes of poverty can coexist and does not identify a directional construct.' },
  q0092: { issue: 'non-discriminating', rationale: 'The item lists multiple determinants of workplace power without a directional empirical claim.' },
  q0112: { issue: 'non-discriminating', rationale: 'The item lists determinants of housing affordability without a directional empirical claim.' },
  q0132: { issue: 'non-discriminating', rationale: 'The item lists components of monetary systems without a directional empirical claim.' },
  q0151: { issue: 'double-barreled', rationale: 'The item combines a benefit of trademark law with a separate censorship risk.' },
  q0152: { issue: 'non-discriminating', rationale: 'The item lists many causes of creative production without a directional empirical claim.' },
  q0172: { issue: 'non-discriminating', rationale: 'The item lists several supports for free institutions without distinguishing an axis position.' },
  q0192: { issue: 'non-discriminating', rationale: 'The item lists determinants of crime rates without a directional empirical claim.' },
  q0212: { issue: 'non-discriminating', rationale: 'The item says migration effects vary by context but does not identify a directional belief.' },
  q0229: { issue: 'double-barreled', rationale: 'The item combines abuse prevention with remoteness and unaccountability.' },
  q0231: { issue: 'double-barreled', rationale: 'The item combines solidarity benefits with concealment of conflict and exclusion.' },
  q0232: { issue: 'non-discriminating', rationale: 'The item says identity politics can produce nearly any outcome depending on institutions.' },
  q0250: { issue: 'double-barreled', rationale: 'The item permits both humane and coercive religious welfare depending on conditions.' },
  q0252: { issue: 'non-discriminating', rationale: 'The item lists sources of public morality without a directional empirical claim.' },
  q0272: { issue: 'non-discriminating', rationale: 'The item lists determinants of family stability without a directional empirical claim.' },
  q0290: { issue: 'double-barreled', rationale: 'The item combines conflict reduction with loss of minority autonomy.' },
  q0292: { issue: 'underspecified', rationale: 'The item combines social power, contested boundaries, and historical change without a clear target axis.' },
  q0309: { issue: 'double-barreled', rationale: 'The item combines efficiency with political instability.' },
  q0312: { issue: 'non-discriminating', rationale: 'The item says environmental problems require different tools without a directional construct.' },
  q0320: { issue: 'double-barreled', rationale: 'The item combines ecosystem protection with veto abuse.' },
  q0331: { issue: 'non-discriminating', rationale: 'The item says humanitarian rhetoric can coexist with several motives without a directional claim.' },
  q0332: { issue: 'non-discriminating', rationale: 'The item lists drivers of foreign policy without a directional empirical claim.' },
  q0349: { issue: 'double-barreled', rationale: 'The item combines expert benefits with class interests and institutional blind spots.' },
  q0351: { issue: 'double-barreled', rationale: 'The item combines bypassing captured legislatures with passion and spending risks.' },
  q0352: { issue: 'non-discriminating', rationale: 'The item states a general limitation shared by all decision rules.' },
  q0358: { issue: 'non-discriminating', rationale: 'The item recommends comparison among flawed institutions but does not select an axis direction.' },
  q0371: { issue: 'double-barreled', rationale: 'The item combines access improvement with more total exclusion when errors occur.' },
  q0372: { issue: 'non-discriminating', rationale: 'The item lists determinants of technological risk without a directional claim.' },
  q0390: { issue: 'double-barreled', rationale: 'The item combines direct-action benefits with backlash risk.' },
  q0392: { issue: 'non-discriminating', rationale: 'The item lists conditions for successful change without a directional empirical claim.' },
  q0416: { issue: 'underspecified', rationale: 'Reliability of religious identity versus constitutional patriotism lacks population, timeframe, and cohesion metric.' },
  q0419: { issue: 'double-barreled', rationale: 'The item combines a technology forecast, expert governance, ecological decoupling, prosperity, and an undefined deadline.' },
  q0422: { issue: 'underspecified', rationale: 'The word strongly is not operationalized and law, education, and incentives are bundled together.' },
  q0426: { issue: 'underspecified', rationale: 'Mainstream institutions and protecting status are too broad to be falsifiable as written.' },
  sq03: { issue: 'double-barreled', rationale: 'Forced options cover different economic constructs and are not mutually exclusive.' },
  sq08: { issue: 'double-barreled', rationale: 'Forced options cover expert confidence and decentralized coordination rather than one common scale.' },
  sq10: { issue: 'double-barreled', rationale: 'Forced options mix state capacity and market forecasting on different constructs.' },
  sq16: { issue: 'double-barreled', rationale: 'Forced ecological-transition options span expert, market, state-capacity, coordination, and cultural constructs.' },
}

export function applySemanticReview(question: Question): Question {
  const correction = semanticCorrections[String(question.id)]
  if (correction) {
    return {
      ...question,
      axisWeights: correction.axisWeights,
      reviewStatus: 'approved',
      version: SEMANTIC_AUDIT_VERSION,
      updatedAt: SEMANTIC_AUDIT_DATE,
    }
  }

  if (needsRewriteById[String(question.id)]) {
    return {
      ...question,
      reviewStatus: 'needs-rewrite',
      version: SEMANTIC_AUDIT_VERSION,
      updatedAt: SEMANTIC_AUDIT_DATE,
    }
  }

  return question
}

export function semanticReviewEntries(): SemanticReviewEntry[] {
  const corrected = Object.entries(semanticCorrections).map(([questionId, correction]) => ({
    questionId,
    status: 'corrected' as const,
    issue: correction.issue,
    rationale: correction.rationale,
  }))
  const rewrites = Object.entries(needsRewriteById).map(([questionId, review]) => ({
    questionId,
    status: 'needs-rewrite' as const,
    issue: review.issue,
    rationale: review.rationale,
  }))
  return [...corrected, ...rewrites].sort((a, b) => a.questionId.localeCompare(b.questionId))
}
