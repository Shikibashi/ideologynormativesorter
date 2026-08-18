import type { AnswerMap, IdeologyLabel, LabelMatch, Question } from "../types";
import { canonicalProductionModifierMatches } from "../production";
import type { ProductionResponse } from "../production";
import type { CanonicalRegistry } from "../domain/registry";
import { canonicalRegistry } from "../domain/registry";
import {
  MODIFIER_EVIDENCE_THRESHOLD,
  MODIFIER_FIT_THRESHOLD,
  MODIFIER_MATCH_LIMIT,
} from "./labelMatch";
import { normalizeAnswer } from "./normalize";

function productionResponsesFromAnswers(
  questions: readonly Question[],
  answers: AnswerMap,
  registry: CanonicalRegistry,
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
    responses.push(
      value === null
        ? { itemId: item.id, status: "abstained" }
        : { itemId: item.id, value },
    );
  }
  return responses;
}

/** Adapt the canonical production modifier contract to the existing UI shape. */
export function computeCanonicalModifierMatches(
  responses: readonly ProductionResponse[],
  labels: readonly IdeologyLabel[],
  registry: CanonicalRegistry = canonicalRegistry,
): LabelMatch[] {
  const metadataById = new Map(labels.map((label) => [label.id, label]));
  return canonicalProductionModifierMatches(responses, registry)
    .filter((match) => metadataById.has(match.labelId))
    .map((match) => {
      const metadata = metadataById.get(match.labelId);
      return {
        labelId: match.labelId,
        name: metadata?.name ?? match.name,
        description: metadata?.description,
        cautionNote: metadata?.cautionNote,
        usageNote: metadata?.usageNote,
        distance: match.distance,
        fit: match.fit,
        evidenceStrength: match.evidenceStrength,
        measuredAxisCount: match.measuredItemCount,
        totalAxisCount: match.totalItemCount,
        uncertaintyBand: match.uncertaintyBand,
        modifierConstruct: {
          measurementVersion: match.modifierConstruct.measurementVersion,
          name: match.modifierConstruct.name,
          note: match.modifierConstruct.note,
          answeredQuestionIds: [...match.modifierConstruct.answeredQuestionIds],
          indicatorQuestionIds: [...match.modifierConstruct.indicatorQuestionIds],
          minimumAnsweredItems: match.modifierConstruct.minimumAnsweredItems,
        },
      };
    });
}

/**
 * Compatibility adapter for callers that still hold UI answers. The matching
 * authority is canonical item responses and modifier contracts, not legacy
 * measurement tables.
 */
export function computeDirectModifierMatches(
  questions: Question[],
  answers: AnswerMap,
  labels: IdeologyLabel[],
  registry: CanonicalRegistry = canonicalRegistry,
): LabelMatch[] {
  return computeCanonicalModifierMatches(
    productionResponsesFromAnswers(questions, answers, registry),
    labels,
    registry,
  )
    .filter((match) => match.fit >= MODIFIER_FIT_THRESHOLD)
    .filter((match) => match.evidenceStrength >= MODIFIER_EVIDENCE_THRESHOLD)
    .filter((match) => match.uncertaintyBand !== "high")
    .slice(0, MODIFIER_MATCH_LIMIT);
}
