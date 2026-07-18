import type { AxisWeight, Question } from '../types'

export const SEMANTIC_AUDIT_VERSION = '2026-07-semantic-v1'
export const SEMANTIC_AUDIT_DATE = '2026-07-18'

export type SemanticIssue =
  | 'sign-inversion'
  | 'construct-mismatch'
  | 'template-carryover'
  | 'double-barreled'
  | 'non-discriminating'
  | 'underspecified'

export interface SemanticCorrection {
  issue: Exclude<SemanticIssue, 'double-barreled' | 'non-discriminating' | 'underspecified'>
  rationale: string
  axisWeights: AxisWeight[]
}

export interface SemanticRewriteReview {
  issue: Extract<SemanticIssue, 'double-barreled' | 'non-discriminating' | 'underspecified'>
  rationale: string
}

export interface SemanticReviewEntry {
  questionId: string
  status: 'corrected' | 'needs-rewrite'
  issue: SemanticIssue
  rationale: string
}

/**
 * Manual prompt-to-axis review of the full core bank.
 *
 * Corrections are intentionally separated from the original source bank so the
 * original mapping remains inspectable. Only high-confidence sign/construct
 * corrections are encoded here. Ambiguous items are marked needs-rewrite and
 * deactivated rather than assigned a speculative interpretation.
 */
export const semanticCorrections: Record<string, SemanticCorrection> = {
  q0007: {
    issue: 'sign-inversion',
    rationale: 'Competitive provision is evidence for decentralized coordination and against dependence on centralized state capacity.',
    axisWeights: [
      { axisId: 'coordination-optimism', weight: 0.8 },
      { axisId: 'state-capacity-confidence', weight: -0.6 },
      { axisId: 'public-choice-skepticism', weight: 0.4 },
    ],
  },
  q0012: {
    issue: 'sign-inversion',
    rationale: 'Decentralized norms and reputation support coordination optimism while reducing the implied need for state capacity.',
    axisWeights: [
      { axisId: 'coordination-optimism', weight: 0.8 },
      { axisId: 'state-capacity-confidence', weight: -0.6 },
      { axisId: 'public-choice-skepticism', weight: 0.3 },
    ],
  },
  q0016: {
    issue: 'sign-inversion',
    rationale: 'Sequencing abolition through intermediate institutions is gradualist, while the positive pole of this axis is immediatism.',
    axisWeights: [
      { axisId: 'gradualism-vs-immediatism', weight: -0.8 },
      { axisId: 'state-action-vs-exit', weight: -0.4 },
      { axisId: 'centralization-preference', weight: -0.3 },
    ],
  },
  q0019: {
    issue: 'sign-inversion',
    rationale: 'Constitutional barriers to domination point toward anti-domination, not its negative pole.',
    axisWeights: [
      { axisId: 'anti-domination', weight: 0.8 },
      { axisId: 'authority-legitimacy', weight: -0.4 },
      { axisId: 'liberty-noninterference', weight: 0.3 },
    ],
  },
  q0047: {
    issue: 'construct-mismatch',
    rationale: 'Price coordination is market-process confidence and coordination optimism; it does not directly indicate confidence in experts.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 1 },
      { axisId: 'coordination-optimism', weight: 0.7 },
      { axisId: 'expert-confidence', weight: -0.2 },
    ],
  },
  q0049: {
    issue: 'construct-mismatch',
    rationale: 'The prompt describes institutional prerequisites for market performance rather than expert failure.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.5 },
      { axisId: 'state-capacity-confidence', weight: 0.3 },
      { axisId: 'coordination-optimism', weight: -0.2 },
    ],
  },
  q0050: {
    issue: 'construct-mismatch',
    rationale: 'Regulatory dependence on incumbent information primarily indicates public-choice and capture skepticism.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 1 },
      { axisId: 'expert-confidence', weight: -0.5 },
      { axisId: 'state-capacity-confidence', weight: -0.4 },
    ],
  },
  q0051: {
    issue: 'construct-mismatch',
    rationale: 'Legally protected corporate planning indicates public-choice skepticism and lower market-process confidence under restricted competition.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.7 },
      { axisId: 'market-process-confidence', weight: -0.5 },
      { axisId: 'coordination-optimism', weight: -0.2 },
    ],
  },
  q0053: {
    issue: 'sign-inversion',
    rationale: 'Decentralized experimentation indicates deregulation, decentralization, and exit rather than state action.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.8 },
      { axisId: 'centralization-preference', weight: -0.8 },
      { axisId: 'state-action-vs-exit', weight: -0.6 },
    ],
  },
  q0055: {
    issue: 'template-carryover',
    rationale: 'Narrow reversible remedies support limited regulation and lower centralization, not broad regulatory centralization.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.4 },
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: 0.2 },
    ],
  },
  q0057: {
    issue: 'template-carryover',
    rationale: 'Automatic sunset and adversarial review constrain subsidy programs rather than supporting centralization.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.5 },
      { axisId: 'centralization-preference', weight: -0.5 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
    ],
  },
  q0067: {
    issue: 'sign-inversion',
    rationale: 'Ease of evaluating simple transfers implies lower administrative-capacity requirements and more skepticism toward complex administration.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.5 },
      { axisId: 'public-choice-skepticism', weight: 0.4 },
      { axisId: 'expert-confidence', weight: -0.3 },
    ],
  },
  q0068: {
    issue: 'sign-inversion',
    rationale: 'Benefit cliffs and household penalties are evidence against administrative design capacity and for institutional skepticism.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.8 },
      { axisId: 'public-choice-skepticism', weight: 0.6 },
      { axisId: 'expert-confidence', weight: -0.3 },
    ],
  },
  q0073: {
    issue: 'sign-inversion',
    rationale: 'A basic agency floor is redistribution, while minimized paternalism points toward exit rather than state management.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: 0.8 },
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'regulation-vs-deregulation', weight: -0.3 },
    ],
  },
  q0075: {
    issue: 'sign-inversion',
    rationale: 'Removing scarcity-producing rules before tax-and-transfer expansion is predistribution, the negative pole of this axis.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.9 },
      { axisId: 'regulation-vs-deregulation', weight: -0.7 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
    ],
  },
  q0077: {
    issue: 'sign-inversion',
    rationale: 'Local experimentation with exit is decentralized and exit-oriented rather than redistribution-oriented.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.7 },
      { axisId: 'state-action-vs-exit', weight: -0.7 },
      { axisId: 'regulation-vs-deregulation', weight: -0.2 },
    ],
  },
  q0078: {
    issue: 'sign-inversion',
    rationale: 'Combining relief with removal of state-created scarcity mixes redistribution with predistribution and should not score only toward redistribution.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.4 },
      { axisId: 'regulation-vs-deregulation', weight: -0.5 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
    ],
  },
  q0081: {
    issue: 'sign-inversion',
    rationale: 'Freedom to organize, refuse, bargain, exit, and compete points toward noninterference and anti-domination.',
    axisWeights: [
      { axisId: 'liberty-noninterference', weight: 0.8 },
      { axisId: 'anti-domination', weight: 0.7 },
      { axisId: 'property-legitimacy', weight: 0.2 },
    ],
  },
  q0087: {
    issue: 'construct-mismatch',
    rationale: 'Cooperative discipline through information and exit indicates democratic and coordination confidence, not public-choice skepticism.',
    axisWeights: [
      { axisId: 'democratic-confidence', weight: 0.6 },
      { axisId: 'coordination-optimism', weight: 0.5 },
      { axisId: 'market-process-confidence', weight: 0.3 },
    ],
  },
  q0090: {
    issue: 'construct-mismatch',
    rationale: 'Exit restrictions producing monopsony indicate public-choice skepticism and lower market-process performance under legal barriers.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.7 },
      { axisId: 'market-process-confidence', weight: -0.4 },
      { axisId: 'state-capacity-confidence', weight: -0.2 },
    ],
  },
  q0093: {
    issue: 'sign-inversion',
    rationale: 'Equal legal footing among plural labor forms is deregulatory, decentralized, and exit-oriented.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.7 },
      { axisId: 'state-action-vs-exit', weight: -0.6 },
      { axisId: 'centralization-preference', weight: -0.4 },
    ],
  },
  q0097: {
    issue: 'sign-inversion',
    rationale: 'Simplifying cooperative law without mandating one form is deregulation and pluralism, not regulation.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.6 },
      { axisId: 'state-action-vs-exit', weight: -0.4 },
      { axisId: 'centralization-preference', weight: -0.3 },
    ],
  },
  q0102: {
    issue: 'construct-mismatch',
    rationale: 'Freedom to build is a strong property and noninterference claim; equality is not the same-direction secondary construct.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: 0.9 },
      { axisId: 'liberty-noninterference', weight: 0.7 },
      { axisId: 'anti-domination', weight: 0.2 },
    ],
  },
  q0104: {
    issue: 'construct-mismatch',
    rationale: 'Rejecting incumbent exclusion supports outsider equality and anti-domination, while the property implication is mixed.',
    axisWeights: [
      { axisId: 'equality-theory', weight: 0.7 },
      { axisId: 'anti-domination', weight: 0.6 },
      { axisId: 'property-legitimacy', weight: 0.3 },
    ],
  },
  q0106: {
    issue: 'sign-inversion',
    rationale: 'Conditioning landholding on noncapture of land rents weakens unconditional property legitimacy and supports equality.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: -0.5 },
      { axisId: 'equality-theory', weight: 0.4 },
      { axisId: 'anti-domination', weight: 0.3 },
    ],
  },
  q0107: {
    issue: 'construct-mismatch',
    rationale: 'Supply response under clear rules indicates market-process and coordination confidence, not public-choice skepticism.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.7 },
      { axisId: 'coordination-optimism', weight: 0.5 },
      { axisId: 'state-capacity-confidence', weight: 0.2 },
    ],
  },
  q0109: {
    issue: 'construct-mismatch',
    rationale: 'The rent-control tradeoff concerns market-process effects and state intervention rather than generic public-choice incentives.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: -0.5 },
      { axisId: 'state-capacity-confidence', weight: -0.2 },
      { axisId: 'public-choice-skepticism', weight: 0.2 },
    ],
  },
  q0113: {
    issue: 'sign-inversion',
    rationale: 'Abundant housing plus socialized land rents combines deregulation with predistributive land-value capture.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.6 },
      { axisId: 'redistribution-vs-predistribution', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0115: {
    issue: 'sign-inversion',
    rationale: 'Replacing taxes on production with land-value taxation is predistribution rather than post-outcome redistribution.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.8 },
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
      { axisId: 'centralization-preference', weight: 0.2 },
    ],
  },
  q0116: {
    issue: 'construct-mismatch',
    rationale: 'Avoiding supply freezes is a mixed protection-and-market design claim rather than a clear regulatory-direction item.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.3 },
      { axisId: 'redistribution-vs-predistribution', weight: 0.2 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0127: {
    issue: 'construct-mismatch',
    rationale: 'Competitive currencies disciplining issuers is market-process and exit confidence, not public-choice skepticism as the primary construct.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.8 },
      { axisId: 'coordination-optimism', weight: 0.5 },
      { axisId: 'state-capacity-confidence', weight: -0.4 },
    ],
  },
  q0133: {
    issue: 'sign-inversion',
    rationale: 'Competing monies with no privileged issuer is strongly exit-oriented and decentralized.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.9 },
      { axisId: 'regulation-vs-deregulation', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.7 },
    ],
  },
  q0135: {
    issue: 'construct-mismatch',
    rationale: 'Loss allocation to investors and managers is a liability rule, not acceptance of general state action.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.4 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0136: {
    issue: 'sign-inversion',
    rationale: 'Permission to use alternative currencies is an exit and deregulation preference.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.9 },
      { axisId: 'regulation-vs-deregulation', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.5 },
    ],
  },
  q0137: {
    issue: 'construct-mismatch',
    rationale: 'Narrow, disclosed, sunsetted emergency powers constrain centralized state discretion rather than support it.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'centralization-preference', weight: -0.6 },
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
    ],
  },
  q0146: {
    issue: 'sign-inversion',
    rationale: 'Restricting information control to fraud prevention weakens broad information-property claims and supports noninterference.',
    axisWeights: [
      { axisId: 'property-legitimacy', weight: -0.5 },
      { axisId: 'liberty-noninterference', weight: 0.5 },
      { axisId: 'anti-domination', weight: 0.3 },
    ],
  },
  q0147: {
    issue: 'construct-mismatch',
    rationale: 'Open standards lowering experimentation cost indicates coordination and innovation confidence, not market skepticism.',
    axisWeights: [
      { axisId: 'coordination-optimism', weight: 0.7 },
      { axisId: 'market-process-confidence', weight: 0.5 },
      { axisId: 'expert-confidence', weight: -0.2 },
    ],
  },
  q0156: {
    issue: 'construct-mismatch',
    rationale: 'Open-access conditions on public funding are a targeted public rule and openness preference, not generic regulatory expansion.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.3 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
      { axisId: 'gradualism-vs-immediatism', weight: 0.1 },
    ],
  },
  q0167: {
    issue: 'construct-mismatch',
    rationale: 'Corrective open debate indicates coordination and democratic learning, not public-choice skepticism.',
    axisWeights: [
      { axisId: 'democratic-confidence', weight: 0.6 },
      { axisId: 'coordination-optimism', weight: 0.5 },
      { axisId: 'expert-confidence', weight: -0.2 },
    ],
  },
  q0173: {
    issue: 'sign-inversion',
    rationale: 'Default protection of speech and encryption is deregulatory and exit-protective, not state-action oriented.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.8 },
      { axisId: 'state-action-vs-exit', weight: -0.6 },
      { axisId: 'coercion-strategy', weight: -0.5 },
    ],
  },
  q0174: {
    issue: 'sign-inversion',
    rationale: 'Narrowing speech restrictions to direct rights violations indicates lower coercion and regulation.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.8 },
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'coercion-strategy', weight: -0.8 },
    ],
  },
  q0175: {
    issue: 'construct-mismatch',
    rationale: 'Warrants and adversarial review are procedural restraints on coercion, not general support for regulation and state action.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.6 },
      { axisId: 'centralization-preference', weight: -0.3 },
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
    ],
  },
  q0176: {
    issue: 'construct-mismatch',
    rationale: 'Automatic sunset constrains emergency coercion and centralized discretion.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'regulation-vs-deregulation', weight: -0.2 },
    ],
  },
  q0178: {
    issue: 'construct-mismatch',
    rationale: 'Assuming hostile future rulers indicates anti-coercion and decentralization, not support for state action.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.5 },
      { axisId: 'state-action-vs-exit', weight: -0.4 },
    ],
  },
  q0193: {
    issue: 'construct-mismatch',
    rationale: 'Restitution and necessary incapacitation describe lower coercion and narrower state action than the original template.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.6 },
      { axisId: 'state-action-vs-exit', weight: 0.2 },
      { axisId: 'regulation-vs-deregulation', weight: -0.2 },
    ],
  },
  q0195: {
    issue: 'sign-inversion',
    rationale: 'Narrowing official immunity is an accountability constraint on state coercion, not support for more state action.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.6 },
      { axisId: 'state-action-vs-exit', weight: -0.4 },
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
    ],
  },
  q0198: {
    issue: 'sign-inversion',
    rationale: 'Reducing weakly supervised discretion indicates lower coercion and decentralization.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.5 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
    ],
  },
  q0206: {
    issue: 'sign-inversion',
    rationale: 'Rejecting rightless treatment of outsiders supports cosmopolitan boundaries and liberty.',
    axisWeights: [
      { axisId: 'political-community-boundary', weight: 0.6 },
      { axisId: 'liberty-noninterference', weight: 0.5 },
      { axisId: 'equality-theory', weight: 0.3 },
    ],
  },
  q0210: {
    issue: 'construct-mismatch',
    rationale: 'Service strain under constrained supply is chiefly a state-capacity and institutional-bottleneck claim.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.5 },
      { axisId: 'market-process-confidence', weight: -0.2 },
      { axisId: 'cultural-plasticity', weight: -0.2 },
    ],
  },
  q0213: {
    issue: 'construct-mismatch',
    rationale: 'Peaceful migration is directly an exit and deregulation preference; immediatism is secondary at most.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.8 },
      { axisId: 'regulation-vs-deregulation', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.4 },
    ],
  },
  q0221: {
    issue: 'sign-inversion',
    rationale: 'Voluntary belonging without rule or exclusion supports anti-domination rather than its negative pole.',
    axisWeights: [
      { axisId: 'political-community-boundary', weight: 0.4 },
      { axisId: 'anti-domination', weight: 0.6 },
      { axisId: 'moral-traditionalism', weight: -0.3 },
    ],
  },
  q0223: {
    issue: 'sign-inversion',
    rationale: 'Local self-government justified by exit and pluralism supports anti-domination and decentralization.',
    axisWeights: [
      { axisId: 'anti-domination', weight: 0.6 },
      { axisId: 'political-community-boundary', weight: 0.3 },
      { axisId: 'moral-traditionalism', weight: -0.2 },
    ],
  },
  q0226: {
    issue: 'sign-inversion',
    rationale: 'Denying national ownership of persons supports anti-domination and weaker inherited authority.',
    axisWeights: [
      { axisId: 'anti-domination', weight: 0.6 },
      { axisId: 'political-community-boundary', weight: 0.3 },
      { axisId: 'moral-traditionalism', weight: -0.3 },
    ],
  },
  q0227: {
    issue: 'construct-mismatch',
    rationale: 'Plural-compatible civic rituals directly indicate coordination and cultural adaptability rather than lower democratic confidence.',
    axisWeights: [
      { axisId: 'coordination-optimism', weight: 0.6 },
      { axisId: 'cultural-plasticity', weight: 0.5 },
      { axisId: 'democratic-confidence', weight: 0.2 },
    ],
  },
  q0234: {
    issue: 'construct-mismatch',
    rationale: 'Exit rights and minority protection are conditional decentralization and anti-coercion, not a centralization preference.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'regulation-vs-deregulation', weight: 0.1 },
    ],
  },
  q0237: {
    issue: 'sign-inversion',
    rationale: 'Rejecting ancestry privilege while allowing voluntary association does not imply centralized rule; it implies equality with exit.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.3 },
      { axisId: 'state-action-vs-exit', weight: -0.4 },
      { axisId: 'regulation-vs-deregulation', weight: -0.2 },
    ],
  },
  q0238: {
    issue: 'construct-mismatch',
    rationale: 'Civic equality between homogenization and group spoils is not a clear direction on centralization or state action.',
    axisWeights: [
      { axisId: 'compromise-vs-persistence', weight: 0.5 },
      { axisId: 'centralization-preference', weight: 0.1 },
      { axisId: 'regulation-vs-deregulation', weight: 0.1 },
    ],
  },
  q0247: {
    issue: 'construct-mismatch',
    rationale: 'Voluntary religious charity and meaning indicate non-state coordination rather than state capacity.',
    axisWeights: [
      { axisId: 'coordination-optimism', weight: 0.5 },
      { axisId: 'state-capacity-confidence', weight: -0.3 },
      { axisId: 'cultural-plasticity', weight: -0.2 },
    ],
  },
  q0253: {
    issue: 'construct-mismatch',
    rationale: 'Equal civil-liberty protection for belief and dissent is anti-coercion and neutral legal protection, not generic state action.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.5 },
      { axisId: 'regulation-vs-deregulation', weight: -0.3 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
    ],
  },
  q0255: {
    issue: 'sign-inversion',
    rationale: 'Rejecting state funding and enforcement of doctrine indicates deregulation and exit, not regulation.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.8 },
      { axisId: 'regulation-vs-deregulation', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.4 },
    ],
  },
  q0256: {
    issue: 'sign-inversion',
    rationale: 'Equal treatment of publicly funded religious and secular organizations rejects special regulation and privilege.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'regulation-vs-deregulation', weight: -0.4 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0266: {
    issue: 'sign-inversion',
    rationale: 'Protecting dependents without criminalizing adult difference supports noninterference and less traditionalism.',
    axisWeights: [
      { axisId: 'moral-traditionalism', weight: -0.5 },
      { axisId: 'liberty-noninterference', weight: 0.5 },
      { axisId: 'equality-theory', weight: 0.3 },
    ],
  },
  q0269: {
    issue: 'construct-mismatch',
    rationale: 'Administrative recognition of household forms indicates state-capacity limits and public-choice design effects rather than cultural plasticity alone.',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: -0.5 },
      { axisId: 'public-choice-skepticism', weight: 0.4 },
      { axisId: 'cultural-plasticity', weight: 0.2 },
    ],
  },
  q0273: {
    issue: 'construct-mismatch',
    rationale: 'Plural family law focused on consent and exit is deregulatory and exit-oriented.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.7 },
      { axisId: 'state-action-vs-exit', weight: -0.7 },
      { axisId: 'redistribution-vs-predistribution', weight: 0.1 },
    ],
  },
  q0275: {
    issue: 'construct-mismatch',
    rationale: 'Targeting concrete harm rather than cultural deviation is a narrow intervention and anti-coercion preference.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.6 },
      { axisId: 'regulation-vs-deregulation', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
    ],
  },
  q0276: {
    issue: 'construct-mismatch',
    rationale: 'Avoiding dependency on employers or spouses is primarily an exit and anti-domination strategy.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'redistribution-vs-predistribution', weight: 0.3 },
      { axisId: 'regulation-vs-deregulation', weight: -0.2 },
    ],
  },
  q0277: {
    issue: 'construct-mismatch',
    rationale: 'Pairing enforcement with scarcity reform is mixed regulation plus predistribution rather than uniform deregulation.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.6 },
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
      { axisId: 'state-action-vs-exit', weight: 0.1 },
    ],
  },
  q0280: {
    issue: 'sign-inversion',
    rationale: 'Licensing as cartelization indicates public-choice skepticism and lower state-capacity confidence, not high state confidence.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.8 },
      { axisId: 'state-capacity-confidence', weight: -0.6 },
      { axisId: 'market-process-confidence', weight: -0.2 },
    ],
  },
  q0283: {
    issue: 'construct-mismatch',
    rationale: 'The item explicitly prioritizes anti-domination and should load primarily on that construct.',
    axisWeights: [
      { axisId: 'anti-domination', weight: 0.9 },
      { axisId: 'equality-theory', weight: 0.4 },
      { axisId: 'political-community-boundary', weight: 0.2 },
    ],
  },
  q0293: {
    issue: 'construct-mismatch',
    rationale: 'Equal rights plus voluntary association is a plural legal-order preference, not primarily redistribution.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.4 },
      { axisId: 'centralization-preference', weight: -0.3 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
    ],
  },
  q0294: {
    issue: 'sign-inversion',
    rationale: 'Removing institutional barriers before permanent sorting is predistribution and decentralization.',
    axisWeights: [
      { axisId: 'redistribution-vs-predistribution', weight: -0.7 },
      { axisId: 'regulation-vs-deregulation', weight: -0.5 },
      { axisId: 'centralization-preference', weight: -0.3 },
    ],
  },
  q0295: {
    issue: 'construct-mismatch',
    rationale: 'Conduct-focused enforcement is narrower regulation and anti-coercion rather than redistribution.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.3 },
      { axisId: 'coercion-strategy', weight: -0.3 },
      { axisId: 'centralization-preference', weight: -0.2 },
    ],
  },
  q0307: {
    issue: 'construct-mismatch',
    rationale: 'Liability enforced through claims indicates legal capacity and market-compatible coordination rather than broad state capacity alone.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.6 },
      { axisId: 'state-capacity-confidence', weight: 0.4 },
      { axisId: 'coordination-optimism', weight: 0.3 },
    ],
  },
  q0308: {
    issue: 'sign-inversion',
    rationale: 'Incumbent advantage from compliance costs indicates public-choice skepticism and lower state confidence.',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.8 },
      { axisId: 'state-capacity-confidence', weight: -0.5 },
      { axisId: 'market-process-confidence', weight: -0.2 },
    ],
  },
  q0313: {
    issue: 'construct-mismatch',
    rationale: 'Internalizing harms without open-ended control is a targeted-rule and decentralization preference, not blanket deregulation.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.3 },
      { axisId: 'centralization-preference', weight: -0.6 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
    ],
  },
  q0315: {
    issue: 'sign-inversion',
    rationale: 'Technology-neutral rules are less discretionary and centralized than technology-specific mandates.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: 0.1 },
    ],
  },
  q0317: {
    issue: 'construct-mismatch',
    rationale: 'Sunset and anti-capture review constrain subsidies rather than indicate broad regulation and centralization.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.3 },
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
    ],
  },
  q0327: {
    issue: 'construct-mismatch',
    rationale: 'Cross-border interests reducing conflict indicates market coordination and cosmopolitan interdependence, not state-capacity skepticism.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.6 },
      { axisId: 'coordination-optimism', weight: 0.5 },
      { axisId: 'democratic-confidence', weight: 0.2 },
    ],
  },
  q0333: {
    issue: 'sign-inversion',
    rationale: 'Exchange, refuge, and peace rather than glory are exit-oriented, decentralized, and anti-coercive.',
    axisWeights: [
      { axisId: 'state-action-vs-exit', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.5 },
      { axisId: 'coercion-strategy', weight: -0.7 },
    ],
  },
  q0334: {
    issue: 'construct-mismatch',
    rationale: 'Defensive purpose and exit criteria constrain intervention and coercion.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.5 },
      { axisId: 'centralization-preference', weight: -0.4 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
    ],
  },
  q0336: {
    issue: 'construct-mismatch',
    rationale: 'Legislative authorization and expiration constrain centralized war powers rather than support state action.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.6 },
      { axisId: 'coercion-strategy', weight: -0.5 },
      { axisId: 'state-action-vs-exit', weight: -0.3 },
    ],
  },
  q0337: {
    issue: 'construct-mismatch',
    rationale: 'Scrutinizing arms transfers is an anti-coercion and accountability preference, not generic state action.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.5 },
      { axisId: 'centralization-preference', weight: -0.3 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
    ],
  },
  q0342: {
    issue: 'sign-inversion',
    rationale: 'Expert advice constrained by consent and accountability supports limited expert input without reducing liberty.',
    axisWeights: [
      { axisId: 'authority-legitimacy', weight: -0.2 },
      { axisId: 'liberty-noninterference', weight: 0.4 },
      { axisId: 'anti-domination', weight: 0.5 },
    ],
  },
  q0346: {
    issue: 'construct-mismatch',
    rationale: 'Combining mechanisms is pluralism and anti-domination, not acceptance of authority or lower liberty.',
    axisWeights: [
      { axisId: 'anti-domination', weight: 0.5 },
      { axisId: 'liberty-noninterference', weight: 0.3 },
      { axisId: 'authority-legitimacy', weight: -0.2 },
    ],
  },
  q0347: {
    issue: 'construct-mismatch',
    rationale: 'Deliberation under real tradeoffs indicates democratic confidence and accountability, not lower expert confidence.',
    axisWeights: [
      { axisId: 'democratic-confidence', weight: 0.7 },
      { axisId: 'public-choice-skepticism', weight: 0.3 },
      { axisId: 'expert-confidence', weight: 0.1 },
    ],
  },
  q0353: {
    issue: 'sign-inversion',
    rationale: 'Competing institutions and experimentation are decentralized and exit-compatible.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.8 },
      { axisId: 'state-action-vs-exit', weight: -0.5 },
      { axisId: 'compromise-vs-persistence', weight: 0.2 },
    ],
  },
  q0356: {
    issue: 'construct-mismatch',
    rationale: 'Independent courts protecting liberties are a constraint on administration, not a generic centralization preference.',
    axisWeights: [
      { axisId: 'centralization-preference', weight: -0.3 },
      { axisId: 'state-action-vs-exit', weight: -0.2 },
      { axisId: 'compromise-vs-persistence', weight: -0.1 },
    ],
  },
  q0367: {
    issue: 'construct-mismatch',
    rationale: 'Open independent auditing indicates coordination openness and lower concentration, not public-choice skepticism as such.',
    axisWeights: [
      { axisId: 'coordination-optimism', weight: 0.7 },
      { axisId: 'expert-confidence', weight: -0.2 },
      { axisId: 'state-capacity-confidence', weight: -0.2 },
    ],
  },
  q0374: {
    issue: 'construct-mismatch',
    rationale: 'Targeting demonstrated harms while protecting small research is a narrow-regulation and decentralization preference.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: -0.3 },
      { axisId: 'state-action-vs-exit', weight: -0.4 },
      { axisId: 'centralization-preference', weight: -0.3 },
    ],
  },
  q0375: {
    issue: 'construct-mismatch',
    rationale: 'Warrants and minimization constrain surveillance coercion rather than indicate support for general regulation.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.7 },
      { axisId: 'centralization-preference', weight: -0.3 },
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
    ],
  },
  q0376: {
    issue: 'construct-mismatch',
    rationale: 'Auditability and appeal constrain public algorithms and support accountability rather than broad state action.',
    axisWeights: [
      { axisId: 'coercion-strategy', weight: -0.5 },
      { axisId: 'centralization-preference', weight: -0.3 },
      { axisId: 'regulation-vs-deregulation', weight: 0.2 },
    ],
  },
  q0377: {
    issue: 'construct-mismatch',
    rationale: 'Interoperability mandates are targeted regulation intended to increase exit and reduce concentration.',
    axisWeights: [
      { axisId: 'regulation-vs-deregulation', weight: 0.5 },
      { axisId: 'state-action-vs-exit', weight: -0.6 },
      { axisId: 'centralization-preference', weight: -0.4 },
    ],
  },
  q0381: {
    issue: 'sign-inversion',
    rationale: 'Constraining unjust means supports anti-domination and liberty, not authority acceptance.',
    axisWeights: [
      { axisId: 'anti-domination', weight: 0.6 },
      { axisId: 'authority-legitimacy', weight: -0.4 },
      { axisId: 'liberty-noninterference', weight: 0.5 },
    ],
  },
  q0385: {
    issue: 'construct-mismatch',
    rationale: 'Rejecting purification of revolutionary coercion is anti-domination and anti-coercion, with no clear acceptance of authority.',
    axisWeights: [
      { axisId: 'anti-domination', weight: 0.6 },
      { axisId: 'liberty-noninterference', weight: 0.5 },
      { axisId: 'authority-legitimacy', weight: -0.3 },
    ],
  },
  q0387: {
    issue: 'construct-mismatch',
    rationale: 'Practical learning from prefigurative institutions indicates coordination optimism rather than its negative pole.',
    axisWeights: [
      { axisId: 'coordination-optimism', weight: 0.7 },
      { axisId: 'public-choice-skepticism', weight: 0.3 },
      { axisId: 'democratic-confidence', weight: 0.3 },
    ],
  },
  q0393: {
    issue: 'construct-mismatch',
    rationale: 'Testing institutions while minimizing domination is plural and gradual rather than clearly reformist or revolutionary.',
    axisWeights: [
      { axisId: 'gradualism-vs-immediatism', weight: -0.6 },
      { axisId: 'reform-vs-revolution', weight: -0.2 },
      { axisId: 'electoralism-vs-direct-action', weight: -0.2 },
    ],
  },
  q0394: {
    issue: 'construct-mismatch',
    rationale: 'Building exit and mutual aid before capture is gradual and direct-action oriented, not simply reformist.',
    axisWeights: [
      { axisId: 'gradualism-vs-immediatism', weight: -0.7 },
      { axisId: 'electoralism-vs-direct-action', weight: -0.6 },
      { axisId: 'reform-vs-revolution', weight: -0.2 },
    ],
  },
  q0396: {
    issue: 'sign-inversion',
    rationale: 'Rejecting revolution under predictable unaccountability supports reform and gradualism.',
    axisWeights: [
      { axisId: 'reform-vs-revolution', weight: -0.8 },
      { axisId: 'gradualism-vs-immediatism', weight: -0.6 },
      { axisId: 'electoralism-vs-direct-action', weight: 0.1 },
    ],
  },
  q0397: {
    issue: 'construct-mismatch',
    rationale: 'Reforms that create further liberalization are reformist and gradual but anti-dependency; the original direct-action loading is unsupported.',
    axisWeights: [
      { axisId: 'reform-vs-revolution', weight: -0.8 },
      { axisId: 'gradualism-vs-immediatism', weight: -0.6 },
      { axisId: 'compromise-vs-persistence', weight: 0.2 },
    ],
  },
  q0409: {
    issue: 'construct-mismatch',
    rationale: 'Worker-managed firms preserving prices indicate market-process and democratic confidence together.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.5 },
      { axisId: 'democratic-confidence', weight: 0.5 },
      { axisId: 'coordination-optimism', weight: 0.3 },
    ],
  },
  q0410: {
    issue: 'construct-mismatch',
    rationale: 'Local-information loss directly indicates lower state and expert confidence with higher market-process confidence.',
    axisWeights: [
      { axisId: 'market-process-confidence', weight: 0.6 },
      { axisId: 'state-capacity-confidence', weight: -0.8 },
      { axisId: 'expert-confidence', weight: -0.4 },
    ],
  },
}

export const needsRewriteById: Record<string, SemanticRewriteReview> = {
  q0008: { issue: 'underspecified', rationale: 'Emergency powers are heterogeneous; the prompt lacks jurisdiction, timeframe, and a measurable outcome.' },
  q0010: { issue: 'non-discriminating', rationale: 'The prompt says several mechanisms matter without locating the respondent on a directional construct.' },
  q0011: { issue: 'double-barreled', rationale: 'It combines voluntary order and coercive-order comparison in one claim.' },
  q0013: { issue: 'double-barreled', rationale: 'It combines service provision, legal pluralism, and institutional transition.' },
  q0014: { issue: 'double-barreled', rationale: 'It bundles voluntary funding, transparency, and exit conditions.' },
  q0020: { issue: 'non-discriminating', rationale: 'The item merely states that informal and formal power may substitute.' },
  q0032: { issue: 'non-discriminating', rationale: 'The item lists multiple determinants of ownership concentration without a directional proposition.' },
  q0040: { issue: 'double-barreled', rationale: 'Licensing, zoning, subsidies, ownership concentration, and productive ability form several claims.' },
  q0052: { issue: 'non-discriminating', rationale: 'The claim criticizes both markets and planning under absent information and consequence conditions.' },
  q0056: { issue: 'non-discriminating', rationale: 'Comparing actual institutions rather than idealizations is a methodological rule, not a policy direction.' },
  q0060: { issue: 'underspecified', rationale: 'Black markets cover very different goods, legal regimes, and welfare effects.' },
  q0070: { issue: 'double-barreled', rationale: 'The prompt combines stigma reduction and transfers to non-needy recipients.' },
  q0071: { issue: 'double-barreled', rationale: 'The item conditions mutual-aid performance on both local knowledge and exit.' },
  q0072: { issue: 'non-discriminating', rationale: 'The statement that poverty has many causes is too inclusive to locate a respondent.' },
  q0080: { issue: 'double-barreled', rationale: 'The prompt asserts poverty reduction and bureaucratic constituency formation simultaneously.' },
  q0091: { issue: 'double-barreled', rationale: 'The item combines member wage effects with exclusion of outsiders.' },
  q0092: { issue: 'non-discriminating', rationale: 'The prompt lists determinants of workplace power without a directional proposition.' },
  q0100: { issue: 'double-barreled', rationale: 'The item combines worker protection with automation and exclusion effects.' },
  q0110: { issue: 'double-barreled', rationale: 'The item combines tax evasion advantages with politicized assessment.' },
  q0112: { issue: 'non-discriminating', rationale: 'The prompt lists multiple housing-affordability determinants without a directional proposition.' },
  q0120: { issue: 'double-barreled', rationale: 'The prompt combines access expansion with maintenance-backlog vulnerability.' },
  q0129: { issue: 'double-barreled', rationale: 'The item combines panic reduction with weakened bank discipline.' },
  q0132: { issue: 'non-discriminating', rationale: 'The prompt lists monetary-system determinants without a directional proposition.' },
  q0140: { issue: 'underspecified', rationale: 'Political credit allocation and expected rescue require an operational comparison and timeframe.' },
  q0151: { issue: 'double-barreled', rationale: 'The prompt contains both a benefit and a speech-control risk.' },
  q0152: { issue: 'non-discriminating', rationale: 'The item lists sources of creative production without a directional claim.' },
  q0160: { issue: 'underspecified', rationale: 'The frequency and scale of platform removals functioning as censorship are undefined.' },
  q0172: { issue: 'non-discriminating', rationale: 'The prompt lists conditions for free institutions without locating a directional belief.' },
  q0187: { issue: 'double-barreled', rationale: 'Voluntariness and power-balance controls are separate conditions.' },
  q0192: { issue: 'non-discriminating', rationale: 'The prompt lists crime determinants without a directional proposition.' },
  q0200: { issue: 'underspecified', rationale: 'The shift in discretion from judges to prosecutors needs a jurisdiction, offense class, and comparison.' },
  q0212: { issue: 'non-discriminating', rationale: 'The prompt says migration effects vary by many institutions without specifying a direction.' },
  q0229: { issue: 'double-barreled', rationale: 'The item combines constraints on local abuse with remoteness and accountability costs.' },
  q0230: { issue: 'double-barreled', rationale: 'The item combines real grievances with elite state-capture attempts.' },
  q0231: { issue: 'double-barreled', rationale: 'The prompt combines solidarity benefits with obscuring multiple harms.' },
  q0232: { issue: 'non-discriminating', rationale: 'Identity politics is said to produce almost any outcome depending on context.' },
  q0249: { issue: 'underspecified', rationale: 'Secular bureaucracy, dogmatism, dissent, and pathology require operational definitions.' },
  q0250: { issue: 'non-discriminating', rationale: 'The item says provision can be humane or coercive depending on conditions.' },
  q0252: { issue: 'non-discriminating', rationale: 'The prompt lists influences on morality without a directional proposition.' },
  q0267: { issue: 'underspecified', rationale: 'Coexistence of plural family forms and clear legal rules lacks a measurable population and outcome.' },
  q0268: { issue: 'underspecified', rationale: 'Persistence of gender disparities is broad and not tied to a population, outcome, or timeframe.' },
  q0270: { issue: 'double-barreled', rationale: 'The item combines equality-policy effects with four separate constraints.' },
  q0272: { issue: 'non-discriminating', rationale: 'The prompt lists many determinants of family stability.' },
  q0287: { issue: 'double-barreled', rationale: 'The item combines pluralism, exit, property, speech, and legal equality.' },
  q0288: { issue: 'underspecified', rationale: 'Group disparities and cumulative institutional effects require population, outcome, and timeframe.' },
  q0290: { issue: 'double-barreled', rationale: 'The prompt combines conflict reduction with loss of autonomy and memory.' },
  q0292: { issue: 'double-barreled', rationale: 'The item combines social power, contested boundaries, and historical change.' },
  q0300: { issue: 'underspecified', rationale: 'Colorblind rules, baseline injustice, and preservation effects require a specific policy context.' },
  q0309: { issue: 'double-barreled', rationale: 'The item combines efficiency with political instability and consumer cost perception.' },
  q0310: { issue: 'double-barreled', rationale: 'The prompt combines reduced consumption with entrenched rationing authority.' },
  q0312: { issue: 'non-discriminating', rationale: 'The item states that different environmental problems require different tools.' },
  q0320: { issue: 'double-barreled', rationale: 'The prompt combines ecosystem protection with veto abuse against development.' },
  q0330: { issue: 'double-barreled', rationale: 'The item combines civilian punishment and ruling-coalition persistence.' },
  q0331: { issue: 'non-discriminating', rationale: 'The claim that rhetoric can coexist with several motives does not locate a directional belief.' },
  q0332: { issue: 'non-discriminating', rationale: 'The prompt lists foreign-policy determinants without a directional proposition.' },
  q0349: { issue: 'double-barreled', rationale: 'The item combines expert improvement with several forms of bias and incentive.' },
  q0351: { issue: 'double-barreled', rationale: 'The item combines bypassing capture with amplification of passions and spending.' },
  q0352: { issue: 'non-discriminating', rationale: 'The statement that no rule removes distributional questions is not an axis-direction belief.' },
  q0358: { issue: 'non-discriminating', rationale: 'The prompt is a methodological comparison rule rather than a directional prescription.' },
  q0366: { issue: 'double-barreled', rationale: 'The item combines institutional burden of proof with individual privacy.' },
  q0370: { issue: 'underspecified', rationale: 'Algorithmic neutrality and encoded assumptions need a defined system, outcome, and benchmark.' },
  q0371: { issue: 'double-barreled', rationale: 'The prompt combines access benefits with severe exclusion from errors.' },
  q0372: { issue: 'non-discriminating', rationale: 'The prompt lists technological-risk determinants without a directional proposition.' },
  q0378: { issue: 'double-barreled', rationale: 'State lock-in, incumbent lock-in, and individual misuse are separate policy objectives.' },
  q0386: { issue: 'non-discriminating', rationale: 'The item validates all three strategies under unspecified conditions.' },
  q0389: { issue: 'underspecified', rationale: 'When incremental reform becomes a trap needs a population, timeframe, and observable criterion.' },
  q0390: { issue: 'double-barreled', rationale: 'The item combines exposing injustice with backlash risk.' },
  q0391: { issue: 'underspecified', rationale: 'Movement moderation, coalition discipline, and donor access need an operational comparison.' },
  q0392: { issue: 'non-discriminating', rationale: 'The prompt lists determinants of successful change without directional discrimination.' },
  q0395: { issue: 'double-barreled', rationale: 'The item combines selective electoral use with refusal to let electoralism define a movement.' },
  q0398: { issue: 'non-discriminating', rationale: 'The claim endorses a broad plural strategy rather than locating the respondent on one axis.' },
  q0400: { issue: 'underspecified', rationale: 'Online agreement and institutional capacity require definitions, a population, and outcome measure.' },
  q0416: { issue: 'underspecified', rationale: 'Religious identity and constitutional patriotism are heterogeneous, and social cohesion is undefined.' },
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

  const rewrite = needsRewriteById[String(question.id)]
  if (rewrite) {
    return {
      ...question,
      active: false,
      reviewStatus: 'needs-rewrite',
      version: SEMANTIC_AUDIT_VERSION,
      updatedAt: SEMANTIC_AUDIT_DATE,
      deprecatedAt: SEMANTIC_AUDIT_DATE,
      deprecationReason: `${rewrite.issue}: ${rewrite.rationale}`,
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
