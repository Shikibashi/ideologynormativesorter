import type { Question } from "../types";
import {
  profileDistanceConstructIds,
  profileEvidence,
  summarizeSpecialistEvidence,
  type SpecialistEvidenceSummary,
  type SpecialistProfileEvidence,
} from "./specialistEvidence";

export const FEMINIST_MODULE_ID = "feminist-faction-module";

export type FeministConstructId =
  | "legal-equality-reform"
  | "structural-patriarchy"
  | "class-social-reproduction"
  | "anti-hierarchy-strategy";

export interface FeministModuleItem {
  question: Question;
  constructWeights: Partial<Record<FeministConstructId, number>>;
}

export interface FeministSpecialistCandidate {
  id: string;
  name: string;
  status: "existing-primary" | "existing-specialist" | "candidate-specialist";
  aliases?: string[];
  description: string;
  centroid: Record<FeministConstructId, number>;
}

export interface FeministSpecialistMatch {
  id: string;
  name: string;
  status: FeministSpecialistCandidate["status"];
  distance: number;
  fit: number;
  evidence: SpecialistProfileEvidence;
}

export const FEMINIST_CONSTRUCT_IDS: readonly FeministConstructId[] = [
  "legal-equality-reform",
  "structural-patriarchy",
  "class-social-reproduction",
  "anti-hierarchy-strategy",
];

const commonQuestionFields = {
  domain: "family-gender-feminism",
  theoryContext: "mixed" as const,
  responseType: "likert7" as const,
  tier: "extensive" as const,
  module: FEMINIST_MODULE_ID,
};

/**
 * Specialist-only measurement items. These deliberately stay outside the main
 * questionnaire until a faction-module UI exists. Global axis weights preserve
 * compatibility with the existing audit/scoring model; constructWeights carry
 * the additional distinctions needed for feminist subtype classification.
 */
export const feministModuleItems: FeministModuleItem[] = [
  {
    question: {
      id: "fm-fem-1",
      prompt:
        "The main political task of feminism is to secure equal individual rights, equal opportunity, and equal protection under law; deeper changes to social structure are secondary.",
      layer: "normative",
      ...commonQuestionFields,
      axisWeights: [
        { axisId: "liberty-noninterference", weight: 0.7 },
        { axisId: "equality-theory", weight: 0.5 },
      ],
    },
    constructWeights: {
      "legal-equality-reform": 1,
    },
  },
  {
    question: {
      id: "fm-fem-2",
      prompt:
        "A society can have formally sex-neutral laws while still maintaining a durable system of male dominance in everyday institutions and relationships.",
      layer: "descriptive",
      ...commonQuestionFields,
      allowDontKnow: true,
      confidencePrompt: "How confident are you in this empirical claim?",
      axisWeights: [{ axisId: "cultural-plasticity", weight: 0.5 }],
    },
    constructWeights: {
      "structural-patriarchy": 1,
      "legal-equality-reform": -0.2,
    },
  },
  {
    question: {
      id: "fm-fem-3",
      prompt:
        "Power over sexuality, reproduction, and family roles is a central political structure of gender domination rather than merely a collection of private choices.",
      layer: "normative",
      ...commonQuestionFields,
      axisWeights: [
        { axisId: "anti-domination", weight: 1 },
        { axisId: "moral-traditionalism", weight: -0.5 },
      ],
    },
    constructWeights: {
      "structural-patriarchy": 1,
    },
  },
  {
    question: {
      id: "fm-fem-4",
      prompt:
        "Women's economic dependence is reproduced in substantial part through unpaid care work, household labor, and the organization of paid employment.",
      layer: "descriptive",
      ...commonQuestionFields,
      allowDontKnow: true,
      confidencePrompt: "How confident are you in this empirical claim?",
      axisWeights: [{ axisId: "cultural-plasticity", weight: -0.4 }],
    },
    constructWeights: {
      "class-social-reproduction": 1,
      "structural-patriarchy": 0.3,
    },
  },
  {
    question: {
      id: "fm-fem-5",
      prompt:
        "Gender liberation requires changing the organization of paid and unpaid labor, not only strengthening anti-discrimination law.",
      layer: "prescriptive",
      ...commonQuestionFields,
      priorityPrompt:
        "How important is this structural question to your overall outlook?",
      axisWeights: [
        { axisId: "state-action-vs-exit", weight: 0.4 },
        { axisId: "reform-vs-revolution", weight: 0.3 },
      ],
    },
    constructWeights: {
      "class-social-reproduction": 1,
    },
  },
  {
    question: {
      id: "fm-fem-6",
      prompt:
        "Feminist movements should normally use legislation, courts, and public institutions as durable tools for securing autonomy and equal citizenship.",
      layer: "prescriptive",
      ...commonQuestionFields,
      priorityPrompt:
        "How important is this strategic question to your overall outlook?",
      axisWeights: [
        { axisId: "state-action-vs-exit", weight: 0.8 },
        { axisId: "electoralism-vs-direct-action", weight: 0.5 },
        { axisId: "reform-vs-revolution", weight: -0.5 },
      ],
    },
    constructWeights: {
      "legal-equality-reform": 0.8,
      "anti-hierarchy-strategy": -1,
    },
  },
  {
    question: {
      id: "fm-fem-7",
      prompt:
        "A feminist politics should treat permanent centralized state hierarchy as a source of domination to be dismantled rather than as a durable vehicle for liberation.",
      layer: "prescriptive",
      ...commonQuestionFields,
      priorityPrompt:
        "How important is this strategic question to your overall outlook?",
      axisWeights: [
        { axisId: "centralization-preference", weight: -0.8 },
        { axisId: "state-action-vs-exit", weight: -0.8 },
        { axisId: "reform-vs-revolution", weight: 0.4 },
      ],
    },
    constructWeights: {
      "anti-hierarchy-strategy": 1,
    },
  },
  {
    question: {
      id: "fm-fem-8",
      prompt:
        "Long-run feminist organization should favor decentralized, self-governing associations over centralized leadership structures.",
      layer: "prescriptive",
      ...commonQuestionFields,
      priorityPrompt:
        "How important is this organizational question to your overall outlook?",
      axisWeights: [
        { axisId: "centralization-preference", weight: -1 },
        { axisId: "electoralism-vs-direct-action", weight: -0.4 },
      ],
    },
    constructWeights: {
      "anti-hierarchy-strategy": 1,
      "structural-patriarchy": 0.2,
    },
  },
];

export const feministModuleQuestions: Question[] = feministModuleItems.map(
  (item) => item.question,
);

/**
 * Specialist construct profiles are hypotheses for follow-up scoring. Marxist
 * and socialist feminism are intentionally grouped at this stage to avoid an
 * unsupported subtype split; the combined tradition is cataloged as a specialist,
 * not promoted into the ordinary questionnaire's primary scoring pool.
 */
export const feministSpecialistCandidates: FeministSpecialistCandidate[] = [
  {
    id: "liberal-feminism",
    name: "Liberal Feminism",
    status: "existing-primary",
    description:
      "Centers individual autonomy, equal citizenship, equal opportunity, and legal-institutional reform within a liberal-democratic framework.",
    centroid: {
      "legal-equality-reform": 0.9,
      "structural-patriarchy": 0.15,
      "class-social-reproduction": 0,
      "anti-hierarchy-strategy": -0.7,
    },
  },
  {
    id: "radical-feminism",
    name: "Radical Feminism",
    status: "candidate-specialist",
    description:
      "Treats patriarchy and male dominance as a distinct structural system, with sexuality, reproduction, and family relations central sites of political power.",
    centroid: {
      "legal-equality-reform": -0.1,
      "structural-patriarchy": 0.95,
      "class-social-reproduction": 0.15,
      "anti-hierarchy-strategy": 0,
    },
  },
  {
    id: "socialist-feminism",
    name: "Socialist / Marxist Feminism",
    status: "existing-specialist",
    aliases: [
      "Marxist Feminism",
      "Socialist Feminism",
      "Social Reproduction Feminism",
    ],
    description:
      "Explains gender domination through the interaction of patriarchy with class, property, paid labor, unpaid care work, and social reproduction.",
    centroid: {
      "legal-equality-reform": 0,
      "structural-patriarchy": 0.65,
      "class-social-reproduction": 0.95,
      "anti-hierarchy-strategy": -0.1,
    },
  },
  {
    id: "anarcha-feminism",
    name: "Anarcha-Feminism",
    status: "existing-specialist",
    description:
      "Treats patriarchy as intertwined with state and other hierarchical domination and favors decentralized, anti-authoritarian forms of liberation and organization.",
    centroid: {
      "legal-equality-reform": -0.45,
      "structural-patriarchy": 0.8,
      "class-social-reproduction": 0.45,
      "anti-hierarchy-strategy": 0.95,
    },
  },
];

export type FeministModuleAnswers = Readonly<
  Record<string, number | undefined>
>;

export function scoreFeministConstructs(
  answers: FeministModuleAnswers,
): Record<FeministConstructId, number> {
  const scores = Object.fromEntries(
    FEMINIST_CONSTRUCT_IDS.map((constructId) => [
      constructId,
      { numerator: 0, denominator: 0 },
    ]),
  ) as Record<FeministConstructId, { numerator: number; denominator: number }>;

  for (const item of feministModuleItems) {
    const raw = answers[item.question.id];
    if (raw === undefined || !Number.isFinite(raw)) continue;
    const normalized = Math.max(-1, Math.min(1, raw / 3));

    for (const constructId of FEMINIST_CONSTRUCT_IDS) {
      const weight = item.constructWeights[constructId];
      if (weight === undefined || weight === 0) continue;
      scores[constructId].numerator += normalized * weight;
      scores[constructId].denominator += Math.abs(weight);
    }
  }

  return Object.fromEntries(
    FEMINIST_CONSTRUCT_IDS.map((constructId) => {
      const score = scores[constructId];
      return [
        constructId,
        score.denominator === 0 ? 0 : score.numerator / score.denominator,
      ];
    }),
  ) as Record<FeministConstructId, number>;
}

export function feministConstructDistance(
  left: Record<FeministConstructId, number>,
  right: Record<FeministConstructId, number>,
  constructIds: readonly FeministConstructId[] = FEMINIST_CONSTRUCT_IDS,
): number {
  if (constructIds.length === 0) return 2;
  const meanSquared =
    constructIds.reduce((sum, constructId) => {
      const delta = left[constructId] - right[constructId];
      return sum + delta * delta;
    }, 0) / constructIds.length;
  return Math.sqrt(meanSquared);
}

export function feministSpecialistEvidence(
  answers: FeministModuleAnswers,
): SpecialistEvidenceSummary {
  return summarizeSpecialistEvidence(
    feministModuleItems,
    answers,
    FEMINIST_CONSTRUCT_IDS,
  );
}

export function scoreFeministSpecialists(
  answers: FeministModuleAnswers,
): FeministSpecialistMatch[] {
  const profile = scoreFeministConstructs(answers);
  const evidence = feministSpecialistEvidence(answers);

  return feministSpecialistCandidates
    .map((candidate) => {
      const candidateEvidence = profileEvidence(evidence, candidate.centroid);
      const distanceConstructIds = profileDistanceConstructIds(
        evidence,
        candidate.centroid,
      );
      const distance = candidateEvidence.insufficientEvidence
        ? 2
        : feministConstructDistance(
            profile,
            candidate.centroid,
            distanceConstructIds as FeministConstructId[],
          );
      return {
        id: candidate.id,
        name: candidate.name,
        status: candidate.status,
        distance,
        fit: candidateEvidence.insufficientEvidence
          ? 0
          : Math.max(0, Math.min(1, 1 - distance / 2)),
        evidence: candidateEvidence,
      };
    })
    .sort((left, right) => left.distance - right.distance);
}
