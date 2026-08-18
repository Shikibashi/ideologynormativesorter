import type {
  Answer,
  AnswerMap,
  Axis,
  IdeologyLabel,
  LabelMatch,
  Question,
  QuestionId,
  ResultProfile,
  AxisReliability,
  LabelReliability,
  Contribution,
} from "../types";
import { canonicalRegistry } from "../domain/registry";
import type { CanonicalRegistry } from "../domain/registry";
import type {
  ProductionLabelEndpoint,
  ProductionResponse,
} from "../production";
import { canonicalProductionLabels, scoreProduction } from "../production";
import { QUESTION_BANK_VERSION } from "../domain/selectors";
import { domains } from "../domain/selectors";
import { computeScoreBreakdown } from "./aggregate";
import { detectDivergencesAndContradictions } from "./divergence";
import { computeDomainMiniResults } from "./domainResults";
import { contributionsForAxis } from "./explain";
import { computeIdealNonIdealGaps } from "./gap";
import { computeConflatedLabels, computeLabelMatches } from "./labelMatch";
import { computeDirectModifierMatches } from "./modifierConstructMatch";
import { computeReasonBreakdowns } from "./reasonDecomposition";
import { reliabilityForAxis, reliabilityForLabel } from "./reliability";
import { normalizeAnswer } from "./normalize";

/** Bumped when ordinary output eligibility changes or research cohorts must remain distinct. */
export const RESULT_SCORING_VERSION = "2026-08-13-taxonomy-v8";

export { normalizeAnswer, salienceFactor } from "./normalize";
export {
  computeAxisScores,
  computeScoreBreakdown,
  axisScoreMap,
} from "./aggregate";
export { computeIdealNonIdealGaps } from "./gap";
export {
  computeConflatedLabels,
  computeLabelMatches,
  computeModifierMatches,
} from "./labelMatch";
export { computeDirectModifierMatches } from "./modifierConstructMatch";
export { reliabilityForAxis, reliabilityForLabel } from "./reliability";
export { contributionsForAxis } from "./explain";
export { detectDivergencesAndContradictions } from "./divergence";
export { computeDomainMiniResults } from "./domainResults";
export { computeReasonBreakdowns } from "./reasonDecomposition";
export interface CanonicalProductionInput {
  readonly responses: readonly ProductionResponse[];
  readonly labels?: readonly ProductionLabelEndpoint[];
  readonly registry?: CanonicalRegistry;
}

/**
 * Convert UI answers into canonical production evidence. Canonical item
 * mappings remain authoritative for dimensions; this function only translates
 * response controls into the production response contract.
 */
export function canonicalProductionResponses(
  questions: readonly Question[],
  answers: AnswerMap,
  registry: CanonicalRegistry = canonicalRegistry,
): readonly ProductionResponse[] {
  const responses: ProductionResponse[] = [];
  for (const question of questions) {
    const item = registry.get("item", question.id);
    const answer = answers[question.id];
    if (!item || !answer) continue;

    if (answer.value === "dont_know") {
      responses.push({ itemId: item.id, status: "abstained" });
      continue;
    }
    if (answer.value === "prefer_not_to_answer") {
      responses.push({ itemId: item.id, status: "refused" });
      continue;
    }

    if (question.responseType === "statementChoice") {
      const optionIndex =
        typeof answer.value === "number" && Number.isInteger(answer.value)
          ? answer.value
          : -1;
      const option = item.statementOptions?.[optionIndex];
      if (!option) {
        responses.push({ itemId: item.id, status: "abstained" });
        continue;
      }
      responses.push({
        itemId: item.id,
        value: 1,
        constructValues: option.rootConstructWeights,
      });
      continue;
    }

    const value = normalizeAnswer(question, answer);
    if (value === null) {
      responses.push({ itemId: item.id, status: "abstained" });
      continue;
    }
    responses.push({ itemId: item.id, value });
  }
  return responses;
}

export function scoreCanonicalProduction(input?: CanonicalProductionInput) {
  const registry = input?.registry ?? canonicalRegistry;
  return scoreProduction(
    {
      responses: input?.responses ?? [],
      labels: input?.labels ?? canonicalProductionLabels(registry),
    },
    { registry },
  );
}

export function buildResultProfile(
  questions: Question[],
  answers: AnswerMap,
  axes: Axis[],
  labels: IdeologyLabel[],
  modifierLabels: IdeologyLabel[] = [],
  productionInput?: CanonicalProductionInput,
): ResultProfile {
  const scores = computeScoreBreakdown(questions, answers, axes);
  const gaps = computeIdealNonIdealGaps(questions, answers);
  const nearestLabels = computeLabelMatches(scores, labels, axes);
  const modifierMatches = computeDirectModifierMatches(
    questions,
    answers,
    modifierLabels,
  );
  const conflatedLabels = computeConflatedLabels(scores, labels, axes);

  const axisScoresMap = new Map(
    [...scores.normative, ...scores.descriptive, ...scores.prescriptive].map(
      (s) => [s.axisId, s],
    ),
  );

  const axisReliabilities: Record<string, AxisReliability> = {};
  for (const s of [
    ...scores.normative,
    ...scores.descriptive,
    ...scores.prescriptive,
  ]) {
    axisReliabilities[s.axisId] = reliabilityForAxis(s);
  }

  const labelReliabilities: Record<string, LabelReliability> = {};
  for (const l of labels) {
    const centroidAxes =
      l.scoringScope?.axisIds ?? Object.keys(l.centroid || {});
    labelReliabilities[l.id] = reliabilityForLabel(
      l.id,
      axisScoresMap,
      centroidAxes,
    );
  }

  const divergences = detectDivergencesAndContradictions(scores, gaps);
  const domainMiniResults = computeDomainMiniResults(
    questions,
    answers,
    domains,
  );
  const reasonBreakdowns = computeReasonBreakdowns(questions, answers, axes);

  const production = scoreCanonicalProduction(
    productionInput ?? {
      responses: canonicalProductionResponses(questions, answers),
    },
  );

  const familyTree: Record<string, LabelMatch[]> = {};
  const familySubtree: Record<string, Record<string, LabelMatch[]>> = {};
  for (const match of nearestLabels) {
    const label = labels.find((l) => l.id === match.labelId);
    if (!label) continue;
    const family = label.family;
    if (!familyTree[family]) familyTree[family] = [];
    familyTree[family].push(match);

    const subfamily = label.subfamily ?? label.family;
    if (!familySubtree[family]) familySubtree[family] = {};
    if (!familySubtree[family][subfamily])
      familySubtree[family][subfamily] = [];
    familySubtree[family][subfamily].push(match);
  }

  const contributions: Record<string, Contribution[]> = {};
  for (const ax of axes) {
    contributions[ax.id] = contributionsForAxis(ax.id, questions, answers);
  }

  return {
    scores,
    gaps,
    nearestLabels,
    modifierMatches,
    conflatedLabels,
    axisReliabilities,
    labelReliabilities,
    contributions,
    divergences,
    domainMiniResults,
    reasonBreakdowns,
    bankVersion: QUESTION_BANK_VERSION,
    scoringVersion: RESULT_SCORING_VERSION,
    production,
    familyTree,
    familySubtree,
  };
}

export function answeredCount(answers: AnswerMap): number {
  return Object.keys(answers).length;
}

export function setAnswer(
  answers: AnswerMap,
  questionId: QuestionId,
  answer: Answer,
): AnswerMap {
  return { ...answers, [questionId]: answer };
}
