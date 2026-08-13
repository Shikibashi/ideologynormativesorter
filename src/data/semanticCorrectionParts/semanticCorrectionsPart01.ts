import type { SemanticCorrection } from "../semanticAuditTypes";

export const semanticCorrectionsPart01: Record<string, SemanticCorrection> = {
  q0007: {
    issue: "sign-inversion",
    rationale:
      "Competitive provision is evidence for decentralized coordination and against dependence on centralized state capacity.",
    axisWeights: [
      { axisId: "coordination-optimism", weight: 0.8 },
      { axisId: "state-capacity-confidence", weight: -0.6 },
      { axisId: "public-choice-skepticism", weight: 0.4 },
    ],
  },
  q0012: {
    issue: "sign-inversion",
    rationale:
      "Decentralized norms and reputation support coordination optimism while reducing the implied need for state capacity.",
    axisWeights: [
      { axisId: "coordination-optimism", weight: 0.8 },
      { axisId: "state-capacity-confidence", weight: -0.6 },
      { axisId: "public-choice-skepticism", weight: 0.3 },
    ],
  },
  q0016: {
    issue: "sign-inversion",
    rationale:
      "Sequencing abolition through intermediate institutions is gradualist, while the positive pole of this axis is immediatism.",
    axisWeights: [
      { axisId: "gradualism-vs-immediatism", weight: -0.8 },
      { axisId: "state-action-vs-exit", weight: -0.4 },
      { axisId: "centralization-preference", weight: -0.3 },
    ],
  },
  q0019: {
    issue: "sign-inversion",
    rationale:
      "Constitutional barriers to domination point toward anti-domination, not its negative pole.",
    axisWeights: [
      { axisId: "anti-domination", weight: 0.8 },
      { axisId: "authority-legitimacy", weight: -0.4 },
      { axisId: "liberty-noninterference", weight: 0.3 },
    ],
  },
  q0047: {
    issue: "construct-mismatch",
    rationale:
      "Price coordination is market-process confidence and coordination optimism; it does not directly indicate confidence in experts.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: 1 },
      { axisId: "coordination-optimism", weight: 0.7 },
      { axisId: "expert-confidence", weight: -0.2 },
    ],
  },
  q0049: {
    issue: "construct-mismatch",
    rationale:
      "The prompt describes institutional prerequisites for market performance rather than expert failure.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: 0.5 },
      { axisId: "state-capacity-confidence", weight: 0.3 },
      { axisId: "coordination-optimism", weight: -0.2 },
    ],
  },
  q0050: {
    issue: "construct-mismatch",
    rationale:
      "Regulatory dependence on incumbent information primarily indicates public-choice and capture skepticism.",
    axisWeights: [
      { axisId: "public-choice-skepticism", weight: 1 },
      { axisId: "expert-confidence", weight: -0.5 },
      { axisId: "state-capacity-confidence", weight: -0.4 },
    ],
  },
  q0051: {
    issue: "construct-mismatch",
    rationale:
      "Legally protected corporate planning indicates public-choice skepticism and lower market-process confidence under restricted competition.",
    axisWeights: [
      { axisId: "public-choice-skepticism", weight: 0.7 },
      { axisId: "market-process-confidence", weight: -0.5 },
      { axisId: "coordination-optimism", weight: -0.2 },
    ],
  },
  q0053: {
    issue: "sign-inversion",
    rationale:
      "Decentralized experimentation indicates deregulation, decentralization, and exit rather than state action.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.8 },
      { axisId: "centralization-preference", weight: -0.8 },
      { axisId: "state-action-vs-exit", weight: -0.6 },
    ],
  },
  q0055: {
    issue: "template-carryover",
    rationale:
      "Narrow reversible remedies support limited regulation and lower centralization, not broad regulatory centralization.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: 0.4 },
      { axisId: "centralization-preference", weight: -0.4 },
      { axisId: "state-action-vs-exit", weight: 0.2 },
    ],
  },
  q0057: {
    issue: "template-carryover",
    rationale:
      "Automatic sunset and adversarial review constrain subsidy programs rather than supporting centralization.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.5 },
      { axisId: "centralization-preference", weight: -0.5 },
      { axisId: "state-action-vs-exit", weight: -0.2 },
    ],
  },
  q0067: {
    issue: "sign-inversion",
    rationale:
      "Ease of evaluating simple transfers implies lower administrative-capacity requirements and more skepticism toward complex administration.",
    axisWeights: [
      { axisId: "state-capacity-confidence", weight: -0.5 },
      { axisId: "public-choice-skepticism", weight: 0.4 },
      { axisId: "expert-confidence", weight: -0.3 },
    ],
  },
  q0068: {
    issue: "sign-inversion",
    rationale:
      "Benefit cliffs and household penalties are evidence against administrative design capacity and for institutional skepticism.",
    axisWeights: [
      { axisId: "state-capacity-confidence", weight: -0.8 },
      { axisId: "public-choice-skepticism", weight: 0.6 },
      { axisId: "expert-confidence", weight: -0.3 },
    ],
  },
  q0073: {
    issue: "sign-inversion",
    rationale:
      "A basic agency floor is redistribution, while minimized paternalism points toward exit rather than state management.",
    axisWeights: [
      { axisId: "redistribution-vs-predistribution", weight: 0.8 },
      { axisId: "state-action-vs-exit", weight: -0.5 },
      { axisId: "regulation-vs-deregulation", weight: -0.3 },
    ],
  },
  q0075: {
    issue: "sign-inversion",
    rationale:
      "Removing scarcity-producing rules before tax-and-transfer expansion is predistribution, the negative pole of this axis.",
    axisWeights: [
      { axisId: "redistribution-vs-predistribution", weight: -0.9 },
      { axisId: "regulation-vs-deregulation", weight: -0.7 },
      { axisId: "state-action-vs-exit", weight: -0.3 },
    ],
  },
  q0077: {
    issue: "sign-inversion",
    rationale:
      "Local experimentation with exit is decentralized and exit-oriented rather than redistribution-oriented.",
    axisWeights: [
      { axisId: "centralization-preference", weight: -0.7 },
      { axisId: "state-action-vs-exit", weight: -0.7 },
      { axisId: "regulation-vs-deregulation", weight: -0.2 },
    ],
  },
  q0078: {
    issue: "sign-inversion",
    rationale:
      "Combining relief with removal of state-created scarcity mixes redistribution with predistribution and should not score only toward redistribution.",
    axisWeights: [
      { axisId: "redistribution-vs-predistribution", weight: -0.4 },
      { axisId: "regulation-vs-deregulation", weight: -0.5 },
      { axisId: "state-action-vs-exit", weight: -0.2 },
    ],
  },
  q0081: {
    issue: "sign-inversion",
    rationale:
      "Freedom to organize, refuse, bargain, exit, and compete points toward noninterference and anti-domination.",
    axisWeights: [
      { axisId: "liberty-noninterference", weight: 0.8 },
      { axisId: "anti-domination", weight: 0.7 },
      { axisId: "property-legitimacy", weight: 0.2 },
    ],
  },
  q0087: {
    issue: "construct-mismatch",
    rationale:
      "Cooperative discipline through information and exit indicates democratic and coordination confidence, not public-choice skepticism.",
    axisWeights: [
      { axisId: "democratic-confidence", weight: 0.6 },
      { axisId: "coordination-optimism", weight: 0.5 },
      { axisId: "market-process-confidence", weight: 0.3 },
    ],
  },
  q0090: {
    issue: "construct-mismatch",
    rationale:
      "Exit restrictions producing monopsony indicate public-choice skepticism and lower market-process performance under legal barriers.",
    axisWeights: [
      { axisId: "public-choice-skepticism", weight: 0.7 },
      { axisId: "market-process-confidence", weight: -0.4 },
      { axisId: "state-capacity-confidence", weight: -0.2 },
    ],
  },
  q0093: {
    issue: "sign-inversion",
    rationale:
      "Equal legal footing among plural labor forms is deregulatory, decentralized, and exit-oriented.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.7 },
      { axisId: "state-action-vs-exit", weight: -0.6 },
      { axisId: "centralization-preference", weight: -0.4 },
    ],
  },
  q0097: {
    issue: "sign-inversion",
    rationale:
      "Simplifying cooperative law without mandating one form is deregulation and pluralism, not regulation.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.6 },
      { axisId: "state-action-vs-exit", weight: -0.4 },
      { axisId: "centralization-preference", weight: -0.3 },
    ],
  },
  q0102: {
    issue: "construct-mismatch",
    rationale:
      "Freedom to build is a strong property and noninterference claim; equality is not the same-direction secondary construct.",
    axisWeights: [
      { axisId: "property-legitimacy", weight: 0.9 },
      { axisId: "liberty-noninterference", weight: 0.7 },
      { axisId: "anti-domination", weight: 0.2 },
    ],
  },
  q0104: {
    issue: "construct-mismatch",
    rationale:
      "Rejecting incumbent exclusion supports outsider equality and anti-domination, while the property implication is mixed.",
    axisWeights: [
      { axisId: "equality-theory", weight: 0.7 },
      { axisId: "anti-domination", weight: 0.6 },
      { axisId: "property-legitimacy", weight: 0.3 },
    ],
  },
  q0106: {
    issue: "sign-inversion",
    rationale:
      "Conditioning landholding on noncapture of land rents weakens unconditional property legitimacy and supports equality.",
    axisWeights: [
      { axisId: "property-legitimacy", weight: -0.5 },
      { axisId: "equality-theory", weight: 0.4 },
      { axisId: "anti-domination", weight: 0.3 },
    ],
  },
  q0107: {
    issue: "construct-mismatch",
    rationale:
      "Supply response under clear rules indicates market-process and coordination confidence, not public-choice skepticism.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: 0.7 },
      { axisId: "coordination-optimism", weight: 0.5 },
      { axisId: "state-capacity-confidence", weight: 0.2 },
    ],
  },
  q0109: {
    issue: "construct-mismatch",
    rationale:
      "The rent-control tradeoff concerns market-process effects and state intervention rather than generic public-choice incentives.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: -0.5 },
      { axisId: "state-capacity-confidence", weight: -0.2 },
      { axisId: "public-choice-skepticism", weight: 0.2 },
    ],
  },
  q0113: {
    issue: "sign-inversion",
    rationale:
      "Abundant housing plus socialized land rents combines deregulation with predistributive land-value capture.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.6 },
      { axisId: "redistribution-vs-predistribution", weight: -0.7 },
      { axisId: "centralization-preference", weight: -0.2 },
    ],
  },
  q0115: {
    issue: "sign-inversion",
    rationale:
      "Replacing taxes on production with land-value taxation is predistribution rather than post-outcome redistribution.",
    axisWeights: [
      { axisId: "redistribution-vs-predistribution", weight: -0.8 },
      { axisId: "regulation-vs-deregulation", weight: 0.2 },
      { axisId: "centralization-preference", weight: 0.2 },
    ],
  },
  q0116: {
    issue: "construct-mismatch",
    rationale:
      "Avoiding supply freezes is a mixed protection-and-market design claim rather than a clear regulatory-direction item.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.3 },
      { axisId: "redistribution-vs-predistribution", weight: 0.2 },
      { axisId: "centralization-preference", weight: -0.2 },
    ],
  },
  q0127: {
    issue: "construct-mismatch",
    rationale:
      "Competitive currencies disciplining issuers is market-process and exit confidence, not public-choice skepticism as the primary construct.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: 0.8 },
      { axisId: "coordination-optimism", weight: 0.5 },
      { axisId: "state-capacity-confidence", weight: -0.4 },
    ],
  },
  q0133: {
    issue: "sign-inversion",
    rationale:
      "Competing monies with no privileged issuer is strongly exit-oriented and decentralized.",
    axisWeights: [
      { axisId: "state-action-vs-exit", weight: -0.9 },
      { axisId: "regulation-vs-deregulation", weight: -0.7 },
      { axisId: "centralization-preference", weight: -0.7 },
    ],
  },
  q0135: {
    issue: "construct-mismatch",
    rationale:
      "Loss allocation to investors and managers is a liability rule, not acceptance of general state action.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: 0.4 },
      { axisId: "state-action-vs-exit", weight: -0.2 },
      { axisId: "centralization-preference", weight: -0.2 },
    ],
  },
  q0136: {
    issue: "sign-inversion",
    rationale:
      "Permission to use alternative currencies is an exit and deregulation preference.",
    axisWeights: [
      { axisId: "state-action-vs-exit", weight: -0.9 },
      { axisId: "regulation-vs-deregulation", weight: -0.7 },
      { axisId: "centralization-preference", weight: -0.5 },
    ],
  },
  q0137: {
    issue: "construct-mismatch",
    rationale:
      "Narrow, disclosed, sunsetted emergency powers constrain centralized state discretion rather than support it.",
    axisWeights: [
      { axisId: "state-action-vs-exit", weight: -0.5 },
      { axisId: "centralization-preference", weight: -0.6 },
      { axisId: "regulation-vs-deregulation", weight: 0.2 },
    ],
  },
  q0146: {
    issue: "sign-inversion",
    rationale:
      "Restricting information control to fraud prevention weakens broad information-property claims and supports noninterference.",
    axisWeights: [
      { axisId: "property-legitimacy", weight: -0.5 },
      { axisId: "liberty-noninterference", weight: 0.5 },
      { axisId: "anti-domination", weight: 0.3 },
    ],
  },
  q0147: {
    issue: "construct-mismatch",
    rationale:
      "Open standards lowering experimentation cost indicates coordination and innovation confidence, not market skepticism.",
    axisWeights: [
      { axisId: "coordination-optimism", weight: 0.7 },
      { axisId: "market-process-confidence", weight: 0.5 },
      { axisId: "expert-confidence", weight: -0.2 },
    ],
  },
  q0156: {
    issue: "construct-mismatch",
    rationale:
      "Open-access conditions on public funding are a targeted public rule and openness preference, not generic regulatory expansion.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: 0.3 },
      { axisId: "state-action-vs-exit", weight: -0.3 },
      { axisId: "gradualism-vs-immediatism", weight: 0.1 },
    ],
  },
  q0167: {
    issue: "construct-mismatch",
    rationale:
      "Corrective open debate indicates coordination and democratic learning, not public-choice skepticism.",
    axisWeights: [
      { axisId: "democratic-confidence", weight: 0.6 },
      { axisId: "coordination-optimism", weight: 0.5 },
      { axisId: "expert-confidence", weight: -0.2 },
    ],
  },
  q0173: {
    issue: "sign-inversion",
    rationale:
      "Default protection of speech and encryption is deregulatory and exit-protective, not state-action oriented.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.8 },
      { axisId: "state-action-vs-exit", weight: -0.6 },
      { axisId: "coercion-strategy", weight: -0.5 },
    ],
  },
  q0174: {
    issue: "sign-inversion",
    rationale:
      "Narrowing speech restrictions to direct rights violations indicates lower coercion and regulation.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.8 },
      { axisId: "state-action-vs-exit", weight: -0.5 },
      { axisId: "coercion-strategy", weight: -0.8 },
    ],
  },
  q0175: {
    issue: "construct-mismatch",
    rationale:
      "Warrants and adversarial review are procedural restraints on coercion, not general support for regulation and state action.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.6 },
      { axisId: "centralization-preference", weight: -0.3 },
      { axisId: "regulation-vs-deregulation", weight: 0.2 },
    ],
  },
  q0176: {
    issue: "construct-mismatch",
    rationale:
      "Automatic sunset constrains emergency coercion and centralized discretion.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.7 },
      { axisId: "centralization-preference", weight: -0.4 },
      { axisId: "regulation-vs-deregulation", weight: -0.2 },
    ],
  },
  q0178: {
    issue: "construct-mismatch",
    rationale:
      "Assuming hostile future rulers indicates anti-coercion and decentralization, not support for state action.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.7 },
      { axisId: "centralization-preference", weight: -0.5 },
      { axisId: "state-action-vs-exit", weight: -0.4 },
    ],
  },
  q0193: {
    issue: "construct-mismatch",
    rationale:
      "Restitution and necessary incapacitation describe lower coercion and narrower state action than the original template.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.6 },
      { axisId: "state-action-vs-exit", weight: 0.2 },
      { axisId: "regulation-vs-deregulation", weight: -0.2 },
    ],
  },
  q0195: {
    issue: "sign-inversion",
    rationale:
      "Narrowing official immunity is an accountability constraint on state coercion, not support for more state action.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.6 },
      { axisId: "state-action-vs-exit", weight: -0.4 },
      { axisId: "regulation-vs-deregulation", weight: 0.2 },
    ],
  },
  q0198: {
    issue: "sign-inversion",
    rationale:
      "Reducing weakly supervised discretion indicates lower coercion and decentralization.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.7 },
      { axisId: "centralization-preference", weight: -0.5 },
      { axisId: "state-action-vs-exit", weight: -0.3 },
    ],
  },
  q0206: {
    issue: "sign-inversion",
    rationale:
      "Rejecting rightless treatment of outsiders supports cosmopolitan boundaries and liberty.",
    axisWeights: [
      { axisId: "political-community-boundary", weight: 0.6 },
      { axisId: "liberty-noninterference", weight: 0.5 },
      { axisId: "equality-theory", weight: 0.3 },
    ],
  },
  q0210: {
    issue: "construct-mismatch",
    rationale:
      "Service strain under constrained supply is chiefly a state-capacity and institutional-bottleneck claim.",
    axisWeights: [
      { axisId: "state-capacity-confidence", weight: -0.5 },
      { axisId: "market-process-confidence", weight: -0.2 },
      { axisId: "cultural-plasticity", weight: -0.2 },
    ],
  },
  q0213: {
    issue: "construct-mismatch",
    rationale:
      "Peaceful migration is directly an exit and deregulation preference; immediatism is secondary at most.",
    axisWeights: [
      { axisId: "state-action-vs-exit", weight: -0.8 },
      { axisId: "regulation-vs-deregulation", weight: -0.7 },
      { axisId: "centralization-preference", weight: -0.4 },
    ],
  },
  q0221: {
    issue: "sign-inversion",
    rationale:
      "Voluntary belonging without rule or exclusion supports anti-domination rather than its negative pole.",
    axisWeights: [
      { axisId: "political-community-boundary", weight: 0.4 },
      { axisId: "anti-domination", weight: 0.6 },
      { axisId: "moral-traditionalism", weight: -0.3 },
    ],
  },
  q0223: {
    issue: "sign-inversion",
    rationale:
      "Local self-government justified by exit and pluralism supports anti-domination and decentralization.",
    axisWeights: [
      { axisId: "anti-domination", weight: 0.6 },
      { axisId: "political-community-boundary", weight: 0.3 },
      { axisId: "moral-traditionalism", weight: -0.2 },
    ],
  },
  q0226: {
    issue: "sign-inversion",
    rationale:
      "Denying national ownership of persons supports anti-domination and weaker inherited authority.",
    axisWeights: [
      { axisId: "anti-domination", weight: 0.6 },
      { axisId: "political-community-boundary", weight: 0.3 },
      { axisId: "moral-traditionalism", weight: -0.3 },
    ],
  },
  q0227: {
    issue: "construct-mismatch",
    rationale:
      "Plural-compatible civic rituals directly indicate coordination and cultural adaptability rather than lower democratic confidence.",
    axisWeights: [
      { axisId: "coordination-optimism", weight: 0.6 },
      { axisId: "cultural-plasticity", weight: 0.5 },
      { axisId: "democratic-confidence", weight: 0.2 },
    ],
  },
  q0234: {
    issue: "construct-mismatch",
    rationale:
      "Exit rights and minority protection are conditional decentralization and anti-coercion, not a centralization preference.",
    axisWeights: [
      { axisId: "centralization-preference", weight: -0.4 },
      { axisId: "state-action-vs-exit", weight: -0.5 },
      { axisId: "regulation-vs-deregulation", weight: 0.1 },
    ],
  },
  q0237: {
    issue: "sign-inversion",
    rationale:
      "Rejecting ancestry privilege while allowing voluntary association does not imply centralized rule; it implies equality with exit.",
    axisWeights: [
      { axisId: "centralization-preference", weight: -0.3 },
      { axisId: "state-action-vs-exit", weight: -0.4 },
      { axisId: "regulation-vs-deregulation", weight: -0.2 },
    ],
  },
  q0238: {
    issue: "construct-mismatch",
    rationale:
      "Civic equality between homogenization and group spoils is not a clear direction on centralization or state action.",
    axisWeights: [
      { axisId: "compromise-vs-persistence", weight: 0.5 },
      { axisId: "centralization-preference", weight: 0.1 },
      { axisId: "regulation-vs-deregulation", weight: 0.1 },
    ],
  },
  q0247: {
    issue: "construct-mismatch",
    rationale:
      "Voluntary religious charity and meaning indicate non-state coordination rather than state capacity.",
    axisWeights: [
      { axisId: "coordination-optimism", weight: 0.5 },
      { axisId: "state-capacity-confidence", weight: -0.3 },
      { axisId: "cultural-plasticity", weight: -0.2 },
    ],
  },
  q0253: {
    issue: "construct-mismatch",
    rationale:
      "Equal civil-liberty protection for belief and dissent is anti-coercion and neutral legal protection, not generic state action.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.5 },
      { axisId: "regulation-vs-deregulation", weight: -0.3 },
      { axisId: "state-action-vs-exit", weight: -0.2 },
    ],
  },
  q0255: {
    issue: "sign-inversion",
    rationale:
      "Rejecting state funding and enforcement of doctrine indicates deregulation and exit, not regulation.",
    axisWeights: [
      { axisId: "state-action-vs-exit", weight: -0.8 },
      { axisId: "regulation-vs-deregulation", weight: -0.7 },
      { axisId: "centralization-preference", weight: -0.4 },
    ],
  },
  q0256: {
    issue: "sign-inversion",
    rationale:
      "Equal treatment of publicly funded religious and secular organizations rejects special regulation and privilege.",
    axisWeights: [
      { axisId: "state-action-vs-exit", weight: -0.5 },
      { axisId: "regulation-vs-deregulation", weight: -0.4 },
      { axisId: "centralization-preference", weight: -0.2 },
    ],
  },
  q0266: {
    issue: "sign-inversion",
    rationale:
      "Protecting dependents without criminalizing adult difference supports noninterference and less traditionalism.",
    axisWeights: [
      { axisId: "moral-traditionalism", weight: -0.5 },
      { axisId: "liberty-noninterference", weight: 0.5 },
      { axisId: "equality-theory", weight: 0.3 },
    ],
  },
  q0269: {
    issue: "construct-mismatch",
    rationale:
      "Administrative recognition of household forms indicates state-capacity limits and public-choice design effects rather than cultural plasticity alone.",
    axisWeights: [
      { axisId: "state-capacity-confidence", weight: -0.5 },
      { axisId: "public-choice-skepticism", weight: 0.4 },
      { axisId: "cultural-plasticity", weight: 0.2 },
    ],
  },
  q0273: {
    issue: "construct-mismatch",
    rationale:
      "Plural family law focused on consent and exit is deregulatory and exit-oriented.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.7 },
      { axisId: "state-action-vs-exit", weight: -0.7 },
      { axisId: "redistribution-vs-predistribution", weight: 0.1 },
    ],
  },
  q0275: {
    issue: "construct-mismatch",
    rationale:
      "Targeting concrete harm rather than cultural deviation is a narrow intervention and anti-coercion preference.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.6 },
      { axisId: "regulation-vs-deregulation", weight: -0.4 },
      { axisId: "state-action-vs-exit", weight: -0.3 },
    ],
  },
  q0276: {
    issue: "construct-mismatch",
    rationale:
      "Avoiding dependency on employers or spouses is primarily an exit and anti-domination strategy.",
    axisWeights: [
      { axisId: "state-action-vs-exit", weight: -0.5 },
      { axisId: "redistribution-vs-predistribution", weight: 0.3 },
      { axisId: "regulation-vs-deregulation", weight: -0.2 },
    ],
  },
  q0277: {
    issue: "construct-mismatch",
    rationale:
      "Pairing enforcement with scarcity reform is mixed regulation plus predistribution rather than uniform deregulation.",
    axisWeights: [
      { axisId: "redistribution-vs-predistribution", weight: -0.6 },
      { axisId: "regulation-vs-deregulation", weight: 0.2 },
      { axisId: "state-action-vs-exit", weight: 0.1 },
    ],
  },
  q0280: {
    issue: "sign-inversion",
    rationale:
      "Licensing as cartelization indicates public-choice skepticism and lower state-capacity confidence, not high state confidence.",
    axisWeights: [
      { axisId: "public-choice-skepticism", weight: 0.8 },
      { axisId: "state-capacity-confidence", weight: -0.6 },
      { axisId: "market-process-confidence", weight: -0.2 },
    ],
  },
  q0283: {
    issue: "construct-mismatch",
    rationale:
      "The item explicitly prioritizes anti-domination and should load primarily on that construct.",
    axisWeights: [
      { axisId: "anti-domination", weight: 0.9 },
      { axisId: "equality-theory", weight: 0.4 },
      { axisId: "political-community-boundary", weight: 0.2 },
    ],
  },
  q0293: {
    issue: "construct-mismatch",
    rationale:
      "Equal rights plus voluntary association is a plural legal-order preference, not primarily redistribution.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.4 },
      { axisId: "centralization-preference", weight: -0.3 },
      { axisId: "state-action-vs-exit", weight: -0.3 },
    ],
  },
  q0294: {
    issue: "sign-inversion",
    rationale:
      "Removing institutional barriers before permanent sorting is predistribution and decentralization.",
    axisWeights: [
      { axisId: "redistribution-vs-predistribution", weight: -0.7 },
      { axisId: "regulation-vs-deregulation", weight: -0.5 },
      { axisId: "centralization-preference", weight: -0.3 },
    ],
  },
  q0295: {
    issue: "construct-mismatch",
    rationale:
      "Conduct-focused enforcement is narrower regulation and anti-coercion rather than redistribution.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.3 },
      { axisId: "coercion-strategy", weight: -0.3 },
      { axisId: "centralization-preference", weight: -0.2 },
    ],
  },
  q0307: {
    issue: "construct-mismatch",
    rationale:
      "Liability enforced through claims indicates legal capacity and market-compatible coordination rather than broad state capacity alone.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: 0.6 },
      { axisId: "state-capacity-confidence", weight: 0.4 },
      { axisId: "coordination-optimism", weight: 0.3 },
    ],
  },
  q0308: {
    issue: "sign-inversion",
    rationale:
      "Incumbent advantage from compliance costs indicates public-choice skepticism and lower state confidence.",
    axisWeights: [
      { axisId: "public-choice-skepticism", weight: 0.8 },
      { axisId: "state-capacity-confidence", weight: -0.5 },
      { axisId: "market-process-confidence", weight: -0.2 },
    ],
  },
  q0313: {
    issue: "construct-mismatch",
    rationale:
      "Internalizing harms without open-ended control is a targeted-rule and decentralization preference, not blanket deregulation.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: 0.3 },
      { axisId: "centralization-preference", weight: -0.6 },
      { axisId: "state-action-vs-exit", weight: -0.2 },
    ],
  },
  q0315: {
    issue: "sign-inversion",
    rationale:
      "Technology-neutral rules are less discretionary and centralized than technology-specific mandates.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: 0.2 },
      { axisId: "centralization-preference", weight: -0.4 },
      { axisId: "state-action-vs-exit", weight: 0.1 },
    ],
  },
  q0317: {
    issue: "construct-mismatch",
    rationale:
      "Sunset and anti-capture review constrain subsidies rather than indicate broad regulation and centralization.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.3 },
      { axisId: "centralization-preference", weight: -0.4 },
      { axisId: "state-action-vs-exit", weight: -0.2 },
    ],
  },
  q0327: {
    issue: "construct-mismatch",
    rationale:
      "Cross-border interests reducing conflict indicates market coordination and cosmopolitan interdependence, not state-capacity skepticism.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: 0.6 },
      { axisId: "coordination-optimism", weight: 0.5 },
      { axisId: "democratic-confidence", weight: 0.2 },
    ],
  },
  q0333: {
    issue: "sign-inversion",
    rationale:
      "Exchange, refuge, and peace rather than glory are exit-oriented, decentralized, and anti-coercive.",
    axisWeights: [
      { axisId: "state-action-vs-exit", weight: -0.7 },
      { axisId: "centralization-preference", weight: -0.5 },
      { axisId: "coercion-strategy", weight: -0.7 },
    ],
  },
  q0334: {
    issue: "construct-mismatch",
    rationale:
      "Defensive purpose and exit criteria constrain intervention and coercion.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.5 },
      { axisId: "centralization-preference", weight: -0.4 },
      { axisId: "state-action-vs-exit", weight: -0.2 },
    ],
  },
  q0336: {
    issue: "construct-mismatch",
    rationale:
      "Legislative authorization and expiration constrain centralized war powers rather than support state action.",
    axisWeights: [
      { axisId: "centralization-preference", weight: -0.6 },
      { axisId: "coercion-strategy", weight: -0.5 },
      { axisId: "state-action-vs-exit", weight: -0.3 },
    ],
  },
  q0337: {
    issue: "construct-mismatch",
    rationale:
      "Scrutinizing arms transfers is an anti-coercion and accountability preference, not generic state action.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.5 },
      { axisId: "centralization-preference", weight: -0.3 },
      { axisId: "state-action-vs-exit", weight: -0.2 },
    ],
  },
  q0342: {
    issue: "sign-inversion",
    rationale:
      "Expert advice constrained by consent and accountability supports limited expert input without reducing liberty.",
    axisWeights: [
      { axisId: "authority-legitimacy", weight: -0.2 },
      { axisId: "liberty-noninterference", weight: 0.4 },
      { axisId: "anti-domination", weight: 0.5 },
    ],
  },
  q0346: {
    issue: "construct-mismatch",
    rationale:
      "Combining mechanisms is pluralism and anti-domination, not acceptance of authority or lower liberty.",
    axisWeights: [
      { axisId: "anti-domination", weight: 0.5 },
      { axisId: "liberty-noninterference", weight: 0.3 },
      { axisId: "authority-legitimacy", weight: -0.2 },
    ],
  },
};
