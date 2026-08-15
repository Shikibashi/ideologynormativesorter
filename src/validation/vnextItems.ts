import { questions } from "../data/effectiveQuestions";
import {
  vnextEffectiveItemIds,
  vnextHistoricalCoreItemIds,
  vnextItemDispositionCounts,
} from "../data/vnextItemDispositions";
import {
  vnextItemAnnotationById,
  vnextItemAnnotations,
} from "../data/vnextItemAnnotations";
import { vnextFacetById, vnextRootById } from "../data/vnextConstructs";
import { specialistModuleDefinitions } from "../specialist";
import type { VNextItemAnnotation } from "../types";

const EXPECTED_DISPOSITION_COUNTS = {
  "empirical review required": 328,
  retain: 49,
  rewrite: 16,
  replace: 10,
  "retain with minor edit": 3,
} as const;

function effectiveQuestions() {
  return [
    ...questions,
    ...specialistModuleDefinitions.flatMap((module) => module.questions),
  ];
}

export function vnextItemErrors(
  annotations: readonly VNextItemAnnotation[] = vnextItemAnnotations,
): string[] {
  const errors: string[] = [];
  const effective = effectiveQuestions();
  const effectiveIds = effective.map((question) => question.id);
  if (annotations.length !== effective.length) {
    errors.push(
      `expected ${effective.length} item annotations, found ${annotations.length}`,
    );
  }
  const seen = new Set<string>();
  for (const annotation of annotations) {
    if (seen.has(annotation.itemId))
      errors.push(`duplicate item ${annotation.itemId}`);
    seen.add(annotation.itemId);
    if (!effectiveIds.includes(annotation.itemId)) {
      errors.push(`${annotation.itemId} is not an effective item`);
    }
    for (const rootId of annotation.intendedRootIds) {
      if (!vnextRootById.has(rootId))
        errors.push(`${annotation.itemId} has unknown root ${rootId}`);
    }
    for (const facetId of annotation.facetIds) {
      if (!vnextFacetById.has(facetId)) {
        errors.push(`${annotation.itemId} has unknown facet ${facetId}`);
      }
    }
    if (annotation.surface === "core" && annotation.moduleId) {
      errors.push(`${annotation.itemId} incorrectly declares a core module`);
    }
    if (annotation.surface === "specialist" && !annotation.moduleId) {
      errors.push(`${annotation.itemId} is missing its Specialist module`);
    }
    if (
      annotation.replacementRequired &&
      !["rewrite", "replace"].includes(annotation.disposition)
    ) {
      errors.push(`${annotation.itemId} has an invalid replacement flag`);
    }
    if (annotation.itemId.startsWith("sq")) {
      if (annotation.optionRecords?.length !== 4) {
        errors.push(
          `${annotation.itemId} must have four option-level audit records`,
        );
      }
      if (annotation.analysisEligibility !== "ipsative-only") {
        errors.push(`${annotation.itemId} must remain ipsative-only`);
      }
    }
  }
  for (const itemId of effectiveIds) {
    if (!seen.has(itemId)) errors.push(`missing audit record for ${itemId}`);
  }
  for (const [disposition, expected] of Object.entries(
    EXPECTED_DISPOSITION_COUNTS,
  )) {
    if (
      vnextItemDispositionCounts[
        disposition as keyof typeof vnextItemDispositionCounts
      ] !== expected
    ) {
      errors.push(`${disposition} count expected ${expected}`);
    }
  }
  if (vnextEffectiveItemIds.length !== 406) {
    errors.push("effective vNext item ID inventory is not 406 items");
  }
  if (
    vnextHistoricalCoreItemIds.some((itemId) =>
      vnextItemAnnotationById.has(itemId),
    )
  ) {
    errors.push(
      "inactive historical item entered the effective annotation manifest",
    );
  }
  return errors;
}

export function assertVNextItems(): void {
  const errors = vnextItemErrors();
  if (errors.length > 0)
    throw new Error(`vNext item manifest violation: ${errors.join("; ")}`);
}
