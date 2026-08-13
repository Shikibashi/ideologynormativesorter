import type { Question } from "../types";

export const SEMANTIC_AUDIT_VERSION = "2026-07-semantic-v1";
export const SEMANTIC_AUDIT_DATE = "2026-07-18";

import type {
  SemanticCorrection,
  SemanticRewriteReview,
} from "./semanticAuditTypes";
export type {
  SemanticCorrection,
  SemanticRewriteReview,
} from "./semanticAuditTypes";
import { semanticCorrectionsPart01 } from "./semanticCorrectionParts/semanticCorrectionsPart01";
import { semanticCorrectionsPart02 } from "./semanticCorrectionParts/semanticCorrectionsPart02";

export const semanticCorrections: Record<string, SemanticCorrection> = {
  ...semanticCorrectionsPart01,
  ...semanticCorrectionsPart02,
};

export const needsRewriteById: Record<string, SemanticRewriteReview> = {
  q0008: {
    issue: "underspecified",
    rationale:
      "Emergency powers are heterogeneous; the prompt lacks jurisdiction, timeframe, and a measurable outcome.",
  },
  q0010: {
    issue: "non-discriminating",
    rationale:
      "The prompt says several mechanisms matter without locating the respondent on a directional construct.",
  },
  q0011: {
    issue: "double-barreled",
    rationale:
      "It combines voluntary order and coercive-order comparison in one claim.",
  },
  q0013: {
    issue: "double-barreled",
    rationale:
      "It combines service provision, legal pluralism, and institutional transition.",
  },
  q0014: {
    issue: "double-barreled",
    rationale:
      "It bundles voluntary funding, transparency, and exit conditions.",
  },
  q0020: {
    issue: "non-discriminating",
    rationale:
      "The item merely states that informal and formal power may substitute.",
  },
  q0032: {
    issue: "non-discriminating",
    rationale:
      "The item lists multiple determinants of ownership concentration without a directional proposition.",
  },
  q0040: {
    issue: "double-barreled",
    rationale:
      "Licensing, zoning, subsidies, ownership concentration, and productive ability form several claims.",
  },
  q0052: {
    issue: "non-discriminating",
    rationale:
      "The claim criticizes both markets and planning under absent information and consequence conditions.",
  },
  q0056: {
    issue: "non-discriminating",
    rationale:
      "Comparing actual institutions rather than idealizations is a methodological rule, not a policy direction.",
  },
  q0060: {
    issue: "underspecified",
    rationale:
      "Black markets cover very different goods, legal regimes, and welfare effects.",
  },
  q0070: {
    issue: "double-barreled",
    rationale:
      "The prompt combines stigma reduction and transfers to non-needy recipients.",
  },
  q0071: {
    issue: "double-barreled",
    rationale:
      "The item conditions mutual-aid performance on both local knowledge and exit.",
  },
  q0072: {
    issue: "non-discriminating",
    rationale:
      "The statement that poverty has many causes is too inclusive to locate a respondent.",
  },
  q0080: {
    issue: "double-barreled",
    rationale:
      "The prompt asserts poverty reduction and bureaucratic constituency formation simultaneously.",
  },
  q0091: {
    issue: "double-barreled",
    rationale:
      "The item combines member wage effects with exclusion of outsiders.",
  },
  q0092: {
    issue: "non-discriminating",
    rationale:
      "The prompt lists determinants of workplace power without a directional proposition.",
  },
  q0100: {
    issue: "double-barreled",
    rationale:
      "The item combines worker protection with automation and exclusion effects.",
  },
  q0110: {
    issue: "double-barreled",
    rationale:
      "The item combines tax evasion advantages with politicized assessment.",
  },
  q0112: {
    issue: "non-discriminating",
    rationale:
      "The prompt lists multiple housing-affordability determinants without a directional proposition.",
  },
  q0120: {
    issue: "double-barreled",
    rationale:
      "The prompt combines access expansion with maintenance-backlog vulnerability.",
  },
  q0129: {
    issue: "double-barreled",
    rationale:
      "The item combines panic reduction with weakened bank discipline.",
  },
  q0132: {
    issue: "non-discriminating",
    rationale:
      "The prompt lists monetary-system determinants without a directional proposition.",
  },
  q0140: {
    issue: "underspecified",
    rationale:
      "Political credit allocation and expected rescue require an operational comparison and timeframe.",
  },
  q0151: {
    issue: "double-barreled",
    rationale: "The prompt contains both a benefit and a speech-control risk.",
  },
  q0152: {
    issue: "non-discriminating",
    rationale:
      "The item lists sources of creative production without a directional claim.",
  },
  q0160: {
    issue: "underspecified",
    rationale:
      "The frequency and scale of platform removals functioning as censorship are undefined.",
  },
  q0172: {
    issue: "non-discriminating",
    rationale:
      "The prompt lists conditions for free institutions without locating a directional belief.",
  },
  q0187: {
    issue: "double-barreled",
    rationale:
      "Voluntariness and power-balance controls are separate conditions.",
  },
  q0192: {
    issue: "non-discriminating",
    rationale:
      "The prompt lists crime determinants without a directional proposition.",
  },
  q0200: {
    issue: "underspecified",
    rationale:
      "The shift in discretion from judges to prosecutors needs a jurisdiction, offense class, and comparison.",
  },
  q0212: {
    issue: "non-discriminating",
    rationale:
      "The prompt says migration effects vary by many institutions without specifying a direction.",
  },
  q0229: {
    issue: "double-barreled",
    rationale:
      "The item combines constraints on local abuse with remoteness and accountability costs.",
  },
  q0230: {
    issue: "double-barreled",
    rationale:
      "The item combines real grievances with elite state-capture attempts.",
  },
  q0231: {
    issue: "double-barreled",
    rationale:
      "The prompt combines solidarity benefits with obscuring multiple harms.",
  },
  q0232: {
    issue: "non-discriminating",
    rationale:
      "Identity politics is said to produce almost any outcome depending on context.",
  },
  q0249: {
    issue: "underspecified",
    rationale:
      "Secular bureaucracy, dogmatism, dissent, and pathology require operational definitions.",
  },
  q0250: {
    issue: "non-discriminating",
    rationale:
      "The item says provision can be humane or coercive depending on conditions.",
  },
  q0252: {
    issue: "non-discriminating",
    rationale:
      "The prompt lists influences on morality without a directional proposition.",
  },
  q0267: {
    issue: "underspecified",
    rationale:
      "Coexistence of plural family forms and clear legal rules lacks a measurable population and outcome.",
  },
  q0268: {
    issue: "underspecified",
    rationale:
      "Persistence of gender disparities is broad and not tied to a population, outcome, or timeframe.",
  },
  q0270: {
    issue: "double-barreled",
    rationale:
      "The item combines equality-policy effects with four separate constraints.",
  },
  q0272: {
    issue: "non-discriminating",
    rationale: "The prompt lists many determinants of family stability.",
  },
  q0287: {
    issue: "double-barreled",
    rationale:
      "The item combines pluralism, exit, property, speech, and legal equality.",
  },
  q0288: {
    issue: "underspecified",
    rationale:
      "Group disparities and cumulative institutional effects require population, outcome, and timeframe.",
  },
  q0290: {
    issue: "double-barreled",
    rationale:
      "The prompt combines conflict reduction with loss of autonomy and memory.",
  },
  q0292: {
    issue: "double-barreled",
    rationale:
      "The item combines social power, contested boundaries, and historical change.",
  },
  q0300: {
    issue: "underspecified",
    rationale:
      "Colorblind rules, baseline injustice, and preservation effects require a specific policy context.",
  },
  q0309: {
    issue: "double-barreled",
    rationale:
      "The item combines efficiency with political instability and consumer cost perception.",
  },
  q0310: {
    issue: "double-barreled",
    rationale:
      "The prompt combines reduced consumption with entrenched rationing authority.",
  },
  q0312: {
    issue: "non-discriminating",
    rationale:
      "The item states that different environmental problems require different tools.",
  },
  q0320: {
    issue: "double-barreled",
    rationale:
      "The prompt combines ecosystem protection with veto abuse against development.",
  },
  q0330: {
    issue: "double-barreled",
    rationale:
      "The item combines civilian punishment and ruling-coalition persistence.",
  },
  q0331: {
    issue: "non-discriminating",
    rationale:
      "The claim that rhetoric can coexist with several motives does not locate a directional belief.",
  },
  q0332: {
    issue: "non-discriminating",
    rationale:
      "The prompt lists foreign-policy determinants without a directional proposition.",
  },
  q0349: {
    issue: "double-barreled",
    rationale:
      "The item combines expert improvement with several forms of bias and incentive.",
  },
  q0351: {
    issue: "double-barreled",
    rationale:
      "The item combines bypassing capture with amplification of passions and spending.",
  },
  q0352: {
    issue: "non-discriminating",
    rationale:
      "The statement that no rule removes distributional questions is not an axis-direction belief.",
  },
  q0358: {
    issue: "non-discriminating",
    rationale:
      "The prompt is a methodological comparison rule rather than a directional prescription.",
  },
  q0366: {
    issue: "double-barreled",
    rationale:
      "The item combines institutional burden of proof with individual privacy.",
  },
  q0370: {
    issue: "underspecified",
    rationale:
      "Algorithmic neutrality and encoded assumptions need a defined system, outcome, and benchmark.",
  },
  q0371: {
    issue: "double-barreled",
    rationale:
      "The prompt combines access benefits with severe exclusion from errors.",
  },
  q0372: {
    issue: "non-discriminating",
    rationale:
      "The prompt lists technological-risk determinants without a directional proposition.",
  },
  q0378: {
    issue: "double-barreled",
    rationale:
      "State lock-in, incumbent lock-in, and individual misuse are separate policy objectives.",
  },
  q0386: {
    issue: "non-discriminating",
    rationale:
      "The item validates all three strategies under unspecified conditions.",
  },
  q0389: {
    issue: "underspecified",
    rationale:
      "When incremental reform becomes a trap needs a population, timeframe, and observable criterion.",
  },
  q0390: {
    issue: "double-barreled",
    rationale: "The item combines exposing injustice with backlash risk.",
  },
  q0391: {
    issue: "underspecified",
    rationale:
      "Movement moderation, coalition discipline, and donor access need an operational comparison.",
  },
  q0392: {
    issue: "non-discriminating",
    rationale:
      "The prompt lists determinants of successful change without directional discrimination.",
  },
  q0395: {
    issue: "double-barreled",
    rationale:
      "The item combines selective electoral use with refusal to let electoralism define a movement.",
  },
  q0398: {
    issue: "non-discriminating",
    rationale:
      "The claim endorses a broad plural strategy rather than locating the respondent on one axis.",
  },
  q0400: {
    issue: "underspecified",
    rationale:
      "Online agreement and institutional capacity require definitions, a population, and outcome measure.",
  },
  q0416: {
    issue: "underspecified",
    rationale:
      "Religious identity and constitutional patriotism are heterogeneous, and social cohesion is undefined.",
  },
  q0419: {
    issue: "double-barreled",
    rationale:
      "The item combines a technology forecast, expert governance, ecological decoupling, prosperity, and an undefined deadline.",
  },
  q0422: {
    issue: "underspecified",
    rationale:
      "The word strongly is not operationalized and law, education, and incentives are bundled together.",
  },
  q0426: {
    issue: "underspecified",
    rationale:
      "Mainstream institutions and protecting status are too broad to be falsifiable as written.",
  },
  sq03: {
    issue: "double-barreled",
    rationale:
      "Forced options cover different economic constructs and are not mutually exclusive.",
  },
  sq08: {
    issue: "double-barreled",
    rationale:
      "Forced options cover expert confidence and decentralized coordination rather than one common scale.",
  },
  sq10: {
    issue: "double-barreled",
    rationale:
      "Forced options mix state capacity and market forecasting on different constructs.",
  },
  sq16: {
    issue: "double-barreled",
    rationale:
      "Forced ecological-transition options span expert, market, state-capacity, coordination, and cultural constructs.",
  },
};

export function applySemanticReview(question: Question): Question {
  const correction = semanticCorrections[String(question.id)];
  if (correction) {
    return {
      ...question,
      axisWeights: correction.axisWeights,
      reviewStatus: "approved",
      version: SEMANTIC_AUDIT_VERSION,
      updatedAt: SEMANTIC_AUDIT_DATE,
    };
  }

  const rewrite = needsRewriteById[String(question.id)];
  if (rewrite) {
    return {
      ...question,
      active: false,
      reviewStatus: "needs-rewrite",
      version: SEMANTIC_AUDIT_VERSION,
      updatedAt: SEMANTIC_AUDIT_DATE,
      deprecatedAt: SEMANTIC_AUDIT_DATE,
      deprecationReason: `${rewrite.issue}: ${rewrite.rationale}`,
    };
  }

  return question;
}
