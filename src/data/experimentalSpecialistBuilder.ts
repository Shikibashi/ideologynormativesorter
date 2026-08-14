import type { Question } from "../types";

export interface ExperimentalSpecialistCandidate {
  id: string;
  name: string;
  description: string;
  signals: Record<string, number>;
  /** Construct-level requirements that must be measured and satisfied before this candidate is displayed. */
  gates?: readonly SpecialistConstructGate[];
}

export interface SpecialistConstructGate {
  constructId: string;
  min?: number;
  max?: number;
}

export interface ExperimentalSpecialistModuleSpec {
  id: string;
  version: string;
  title: string;
  shortTitle: string;
  description: string;
  invitationNote: string;
  estimatedMinutes: number;
  questions: Question[];
  constructWeightsByQuestionId: Record<string, Record<string, number>>;
  constructIds: string[];
  candidates: ExperimentalSpecialistCandidate[];
}

type ExperimentalQuestion = {
  id: string;
  prompt: string;
  domain: string;
  layer: Question["layer"];
  constructs: Record<string, number>;
  axisWeights: Question["axisWeights"];
};

// The wave roster and construct bank changed after v3. Keep the version
// explicit so prior cohort records are never interpreted as this bank.
export const EXPERIMENTAL_SPECIALIST_VERSION = "2026-08-specialist-v11";

export function buildQuestions(
  moduleId: string,
  items: ExperimentalQuestion[],
): Question[] {
  return items.map((item) => ({
    id: item.id,
    prompt: item.prompt,
    domain: item.domain,
    layer: item.layer,
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "extensive",
    module: moduleId,
    axisWeights: item.axisWeights,
    allowDontKnow: item.layer === "descriptive",
    confidencePrompt:
      item.layer === "descriptive"
        ? "How confident are you in this empirical claim?"
        : undefined,
    priorityPrompt:
      item.layer === "prescriptive"
        ? "How important is this strategic distinction to your outlook?"
        : undefined,
    reviewStatus: "approved",
    version: EXPERIMENTAL_SPECIALIST_VERSION,
    updatedAt: "2026-08-12",
    evidenceNote:
      item.layer === "descriptive"
        ? "This experimental descriptive item is scoped to the institutional mechanism named in the prompt; it is not a universal claim about every society or every technological or political context."
        : undefined,
    contextNote:
      "This experimental follow-up separates a focused construct from neighboring traditions. Its sources provide interpretive background and do not validate a respondent identity claim.",
    sources: [],
  }));
}

export function spec(
  id: string,
  title: string,
  shortTitle: string,
  description: string,
  items: ExperimentalQuestion[],
  candidates: ExperimentalSpecialistCandidate[],
): ExperimentalSpecialistModuleSpec {
  const questions = buildQuestions(id, items);
  const constructWeightsByQuestionId = Object.fromEntries(
    items.map((item) => [item.id, item.constructs]),
  );
  return {
    id,
    version: EXPERIMENTAL_SPECIALIST_VERSION,
    title,
    shortTitle,
    description,
    invitationNote:
      "This is an opt-in experimental follow-up. You may skip it without affecting your primary result or research participation.",
    estimatedMinutes: 3,
    questions,
    constructWeightsByQuestionId,
    constructIds: [
      ...new Set(items.flatMap((item) => Object.keys(item.constructs))),
    ],
    candidates,
  };
}

export const candidate = (
  id: string,
  name: string,
  description: string,
  signals: Record<string, number>,
  gates?: readonly SpecialistConstructGate[],
): ExperimentalSpecialistCandidate => ({
  id,
  name,
  description,
  signals,
  ...(gates ? { gates } : {}),
});

export const gate = (
  constructId: string,
  min?: number,
  max?: number,
): SpecialistConstructGate => ({
  constructId,
  ...(min !== undefined ? { min } : {}),
  ...(max !== undefined ? { max } : {}),
});
