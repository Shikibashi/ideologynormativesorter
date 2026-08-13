import type { IdeologyLabel } from "../../types";

export const labelsPart10: IdeologyLabel[] = [
  {
    id: "queer-anarchism",
    name: "Queer Anarchism",
    family: "anarchist",
    subfamily: "social-anarchist",
    description:
      "A diverse theoretical and activist current connecting anarchist opposition to domination with queer resistance to institutions and norms that enforce sexual or gender conformity.",
    usageNote:
      "Queer anarchists do not share one required position on identity, family, gender abolition, or organization; the label identifies a shared anti-authoritarian orientation rather than a single program.",
    philosophies: [
      "Anarchism",
      "Queer Anarchism",
      "Queer Theory",
      "Queer Liberation",
    ],
    subTheories: [],
    ethicalTheory: ["Deontology"],
    normativePhilosophies: ["Anarchism", "Queer Liberation"],
    descriptivePhilosophies: ["Queer Theory"],
    prescriptivePhilosophies: ["Queer Anarchism", "Queer Liberation"],
    philosophyInfluences: [
      {
        philosophy: "Anarchism",
        description:
          "Subjects coercive hierarchy—including heteronormative and patriarchal institutions—to radical criticism.",
        affectedAxes: [
          "authority-legitimacy",
          "anti-domination",
          "centralization-preference",
        ],
      },
      {
        philosophy: "Queer Theory",
        description:
          "Analysis of how norms and institutions produce and police gender and sexual categories.",
        affectedAxes: [
          "moral-traditionalism",
          "cultural-plasticity",
          "liberty-noninterference",
        ],
      },
    ],
    centroid: {
      "authority-legitimacy": -0.75,
      "property-legitimacy": -0.5,
      "liberty-noninterference": 0.6,
      "equality-theory": 0.6,
      "political-community-boundary": 0.4,
      "moral-traditionalism": -0.85,
      "anti-domination": 0.9,
      "human-nature-priority": 0.2,
      "market-process-confidence": -0.4,
      "state-capacity-confidence": -0.6,
      "public-choice-skepticism": 0.4,
      "democratic-confidence": 0.3,
      "expert-confidence": 0,
      "cultural-plasticity": 0.7,
      "coordination-optimism": 0.4,
      "centralization-preference": -0.8,
      "reform-vs-revolution": 0.3,
      "gradualism-vs-immediatism": 0.2,
      "state-action-vs-exit": -0.5,
      "electoralism-vs-direct-action": -0.2,
      "compromise-vs-persistence": -0.1,
      "coercion-strategy": -0.6,
      "regulation-vs-deregulation": 0.2,
      "redistribution-vs-predistribution": 0.5,
      "militarism-pacifism": -0.4,
      "secularism-religious": -0.7,
    },
  },
];
