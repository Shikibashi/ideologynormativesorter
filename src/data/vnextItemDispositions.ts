import { coreQuestions } from "./effectiveQuestions";
import { specialistModuleDefinitions } from "../specialist";
import type { VNextItemDisposition } from "../types";
import {
  VNEXT_ITEM_DISPOSITIONS_VERSION,
  VNEXT_ITEM_ANNOTATIONS_VERSION,
} from "../validation/vnextVersions";
import {
  vnextItemAnnotations,
  vnextItemAnnotationById,
} from "./vnextItemAnnotations";

export const vnextItemDispositionsVersion = VNEXT_ITEM_DISPOSITIONS_VERSION;
export const vnextItemDispositionSourceVersion = VNEXT_ITEM_ANNOTATIONS_VERSION;

export const vnextItemDispositionById = new Map(
  vnextItemAnnotations.map((annotation) => [
    annotation.itemId,
    annotation.disposition,
  ]),
);

export const vnextItemDispositionCounts = vnextItemAnnotations.reduce(
  (counts, annotation) => {
    counts[annotation.disposition] = (counts[annotation.disposition] ?? 0) + 1;
    return counts;
  },
  {} as Partial<Record<VNextItemDisposition, number>>,
);

export const vnextHistoricalCoreItemIds = coreQuestions
  .filter((question) => question.active === false)
  .map((question) => question.id);

export const vnextEffectiveItemIds = [
  ...vnextItemAnnotations.map((annotation) => annotation.itemId),
  ...specialistModuleDefinitions
    .flatMap((module) => module.questions.map((question) => question.id))
    .filter((itemId) => !vnextItemAnnotationById.has(itemId)),
];
