import type { AnswerMap, IdeologyLabel, LabelMatch, Question } from "../types";
import {
  MODIFIER_MEASUREMENT_VERSION,
  modifierMeasurementForLabel,
} from "../data/modifierMeasurement";
import {
  MODIFIER_EVIDENCE_THRESHOLD,
  MODIFIER_FIT_THRESHOLD,
  MODIFIER_MATCH_LIMIT,
} from "./labelMatch";
import { normalizeAnswer, salienceFactor } from "./normalize";

function closeness(distance: number): number {
  return Number.isFinite(distance) ? Math.max(0, 1 - distance / 2) : 0;
}

function directConstructUncertainty(
  evidenceStrength: number,
  measuredItemCount: number,
  totalItemCount: number,
): LabelMatch["uncertaintyBand"] {
  if (evidenceStrength < MODIFIER_EVIDENCE_THRESHOLD || measuredItemCount < 2)
    return "high";
  if (evidenceStrength < 0.7 || measuredItemCount < totalItemCount)
    return "medium";
  return "low";
}

/**
 * Matches cross-cutting modifiers from their declared direct core indicators.
 *
 * This intentionally differs from primary label matching: a modifier is not a
 * complete ideology profile, so it must not inherit every dimension in a broad
 * catalog centroid. Unanswered or absent form items lower evidence and can
 * abstain; they are never imputed as neutral agreement.
 */
export function computeDirectModifierMatches(
  questions: Question[],
  answers: AnswerMap,
  labels: IdeologyLabel[],
): LabelMatch[] {
  const questionsById = new Map(
    questions.map((question) => [question.id, question]),
  );

  const matches = labels.flatMap((label): LabelMatch[] => {
    const definition = modifierMeasurementForLabel(label.id);
    if (definition?.availability !== "core-construct" || !definition.indicators)
      return [];

    let squaredDistance = 0;
    let effectiveWeight = 0;
    let measuredItemCount = 0;
    const answeredQuestionIds: string[] = [];

    for (const indicator of definition.indicators) {
      const question = questionsById.get(indicator.questionId);
      const answer = question ? answers[question.id] : undefined;
      if (!question || !answer) continue;

      const unit = normalizeAnswer(question, answer);
      if (
        unit === null ||
        (answer.salienceSkipped === true && question.layer !== "normative")
      )
        continue;

      const weight = salienceFactor(question, answer);
      const directedUnit = unit * indicator.direction;
      squaredDistance += weight * (directedUnit - 1) ** 2;
      effectiveWeight += weight;
      measuredItemCount += 1;
      answeredQuestionIds.push(indicator.questionId);
    }

    const totalItemCount = definition.indicators.length;
    const evidenceStrength =
      totalItemCount > 0 ? effectiveWeight / totalItemCount : 0;
    const distance =
      effectiveWeight > 0
        ? Math.sqrt(squaredDistance / effectiveWeight)
        : Number.POSITIVE_INFINITY;
    const fit = measuredItemCount > 0 ? closeness(distance) : 0;
    const uncertaintyBand = directConstructUncertainty(
      evidenceStrength,
      measuredItemCount,
      totalItemCount,
    );

    if (measuredItemCount < (definition.minimumAnsweredItems ?? totalItemCount))
      return [];
    if (fit < MODIFIER_FIT_THRESHOLD) return [];
    if (evidenceStrength < MODIFIER_EVIDENCE_THRESHOLD) return [];
    if (uncertaintyBand === "high") return [];

    return [
      {
        labelId: label.id,
        name: label.name,
        description: label.description,
        cautionNote: label.cautionNote,
        usageNote: label.usageNote,
        distance,
        fit,
        evidenceStrength,
        measuredAxisCount: measuredItemCount,
        totalAxisCount: totalItemCount,
        uncertaintyBand,
        modifierConstruct: {
          measurementVersion: MODIFIER_MEASUREMENT_VERSION,
          name: definition.constructName,
          note: definition.note,
          answeredQuestionIds,
          indicatorQuestionIds: definition.indicators.map(
            (indicator) => indicator.questionId,
          ),
          minimumAnsweredItems:
            definition.minimumAnsweredItems ?? totalItemCount,
        },
      },
    ];
  });

  return matches.sort((a, b) => b.fit - a.fit).slice(0, MODIFIER_MATCH_LIMIT);
}
