import type { SemanticCorrection } from "../semanticAuditTypes";

export const semanticCorrectionsPart02: Record<string, SemanticCorrection> = {
  q0347: {
    issue: "construct-mismatch",
    rationale:
      "Deliberation under real tradeoffs indicates democratic confidence and accountability, not lower expert confidence.",
    axisWeights: [
      { axisId: "democratic-confidence", weight: 0.7 },
      { axisId: "public-choice-skepticism", weight: 0.3 },
      { axisId: "expert-confidence", weight: 0.1 },
    ],
  },
  q0353: {
    issue: "sign-inversion",
    rationale:
      "Competing institutions and experimentation are decentralized and exit-compatible.",
    axisWeights: [
      { axisId: "centralization-preference", weight: -0.8 },
      { axisId: "state-action-vs-exit", weight: -0.5 },
      { axisId: "compromise-vs-persistence", weight: 0.2 },
    ],
  },
  q0356: {
    issue: "construct-mismatch",
    rationale:
      "Independent courts protecting liberties are a constraint on administration, not a generic centralization preference.",
    axisWeights: [
      { axisId: "centralization-preference", weight: -0.3 },
      { axisId: "state-action-vs-exit", weight: -0.2 },
      { axisId: "compromise-vs-persistence", weight: -0.1 },
    ],
  },
  q0367: {
    issue: "construct-mismatch",
    rationale:
      "Open independent auditing indicates coordination openness and lower concentration, not public-choice skepticism as such.",
    axisWeights: [
      { axisId: "coordination-optimism", weight: 0.7 },
      { axisId: "expert-confidence", weight: -0.2 },
      { axisId: "state-capacity-confidence", weight: -0.2 },
    ],
  },
  q0374: {
    issue: "construct-mismatch",
    rationale:
      "Targeting demonstrated harms while protecting small research is a narrow-regulation and decentralization preference.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: -0.3 },
      { axisId: "state-action-vs-exit", weight: -0.4 },
      { axisId: "centralization-preference", weight: -0.3 },
    ],
  },
  q0375: {
    issue: "construct-mismatch",
    rationale:
      "Warrants and minimization constrain surveillance coercion rather than indicate support for general regulation.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.7 },
      { axisId: "centralization-preference", weight: -0.3 },
      { axisId: "regulation-vs-deregulation", weight: 0.2 },
    ],
  },
  q0376: {
    issue: "construct-mismatch",
    rationale:
      "Auditability and appeal constrain public algorithms and support accountability rather than broad state action.",
    axisWeights: [
      { axisId: "coercion-strategy", weight: -0.5 },
      { axisId: "centralization-preference", weight: -0.3 },
      { axisId: "regulation-vs-deregulation", weight: 0.2 },
    ],
  },
  q0377: {
    issue: "construct-mismatch",
    rationale:
      "Interoperability mandates are targeted regulation intended to increase exit and reduce concentration.",
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: 0.5 },
      { axisId: "state-action-vs-exit", weight: -0.6 },
      { axisId: "centralization-preference", weight: -0.4 },
    ],
  },
  q0381: {
    issue: "sign-inversion",
    rationale:
      "Constraining unjust means supports anti-domination and liberty, not authority acceptance.",
    axisWeights: [
      { axisId: "anti-domination", weight: 0.6 },
      { axisId: "authority-legitimacy", weight: -0.4 },
      { axisId: "liberty-noninterference", weight: 0.5 },
    ],
  },
  q0385: {
    issue: "construct-mismatch",
    rationale:
      "Rejecting purification of revolutionary coercion is anti-domination and anti-coercion, with no clear acceptance of authority.",
    axisWeights: [
      { axisId: "anti-domination", weight: 0.6 },
      { axisId: "liberty-noninterference", weight: 0.5 },
      { axisId: "authority-legitimacy", weight: -0.3 },
    ],
  },
  q0387: {
    issue: "construct-mismatch",
    rationale:
      "Practical learning from prefigurative institutions indicates coordination optimism rather than its negative pole.",
    axisWeights: [
      { axisId: "coordination-optimism", weight: 0.7 },
      { axisId: "public-choice-skepticism", weight: 0.3 },
      { axisId: "democratic-confidence", weight: 0.3 },
    ],
  },
  q0393: {
    issue: "construct-mismatch",
    rationale:
      "Testing institutions while minimizing domination is plural and gradual rather than clearly reformist or revolutionary.",
    axisWeights: [
      { axisId: "gradualism-vs-immediatism", weight: -0.6 },
      { axisId: "reform-vs-revolution", weight: -0.2 },
      { axisId: "electoralism-vs-direct-action", weight: -0.2 },
    ],
  },
  q0394: {
    issue: "construct-mismatch",
    rationale:
      "Building exit and mutual aid before capture is gradual and direct-action oriented, not simply reformist.",
    axisWeights: [
      { axisId: "gradualism-vs-immediatism", weight: -0.7 },
      { axisId: "electoralism-vs-direct-action", weight: -0.6 },
      { axisId: "reform-vs-revolution", weight: -0.2 },
    ],
  },
  q0396: {
    issue: "sign-inversion",
    rationale:
      "Rejecting revolution under predictable unaccountability supports reform and gradualism.",
    axisWeights: [
      { axisId: "reform-vs-revolution", weight: -0.8 },
      { axisId: "gradualism-vs-immediatism", weight: -0.6 },
      { axisId: "electoralism-vs-direct-action", weight: 0.1 },
    ],
  },
  q0397: {
    issue: "construct-mismatch",
    rationale:
      "Reforms that create further liberalization are reformist and gradual but anti-dependency; the original direct-action loading is unsupported.",
    axisWeights: [
      { axisId: "reform-vs-revolution", weight: -0.8 },
      { axisId: "gradualism-vs-immediatism", weight: -0.6 },
      { axisId: "compromise-vs-persistence", weight: 0.2 },
    ],
  },
  q0409: {
    issue: "construct-mismatch",
    rationale:
      "Worker-managed firms preserving prices indicate market-process and democratic confidence together.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: 0.5 },
      { axisId: "democratic-confidence", weight: 0.5 },
      { axisId: "coordination-optimism", weight: 0.3 },
    ],
  },
  q0410: {
    issue: "construct-mismatch",
    rationale:
      "Local-information loss directly indicates lower state and expert confidence with higher market-process confidence.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: 0.6 },
      { axisId: "state-capacity-confidence", weight: -0.8 },
      { axisId: "expert-confidence", weight: -0.4 },
    ],
  },
};
