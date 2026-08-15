// Decision IDs: D-01, D-02, D-20, D-22, D-23.
import { axes } from "./axes";
import { domains } from "./domains";
import { questions } from "./effectiveQuestions";
import {
  CONSTRUCT_FAMILY_MAP_VERSION,
  MEASUREMENT_ARCHITECTURE_VERSION,
} from "../validation/researchContracts";
import { constructFamilyIdForDomain } from "./itemMetadata";
import type {
  ConstructFamily,
  ConstructFamilyCell,
  ConstructFamilyMap,
  FamilyCoverage,
  Layer,
  Question,
} from "../types";

const LAYERS: readonly Layer[] = ["normative", "descriptive", "prescriptive"];
const STRUCTURAL_COMPLETE_ITEM_COUNT = 3;

export function classifyFamilyCoverage(itemCount: number): FamilyCoverage {
  if (itemCount === 0) return "missing";
  return itemCount >= STRUCTURAL_COMPLETE_ITEM_COUNT ? "complete" : "partial";
}

function questionAxisIds(question: Question): string[] {
  const weights =
    question.responseType === "statementChoice"
      ? (question.statementOptions?.flatMap((option) => option.axisWeights) ??
        [])
      : question.axisWeights;
  return [...new Set(weights.map((weight) => String(weight.axisId)))];
}

function expectedCriteria(layer: Layer): string[] {
  if (layer === "normative") return ["values-or-self-label-criterion"];
  if (layer === "descriptive") {
    return ["belief-or-resolved-forecast-criterion"];
  }
  return ["strategy-or-behavior-criterion"];
}

function buildCell(
  domainId: string,
  layer: Layer,
  domainQuestions: Question[],
): ConstructFamilyCell {
  const items = domainQuestions.filter((question) => question.layer === layer);
  return {
    layer,
    domainId,
    axisIds: [
      ...new Set(items.flatMap((question) => questionAxisIds(question))),
    ],
    theoryContexts: [
      ...new Set(items.map((question) => question.theoryContext)),
    ],
    itemIds: items.map((question) => question.id),
    responseFormats: [
      ...new Set(items.map((question) => question.responseType)),
    ],
    expectedCriteria: expectedCriteria(layer),
    coverage: classifyFamilyCoverage(items.length),
    reviewRecordIds: [],
  };
}

function buildFamily(domain: (typeof domains)[number]): ConstructFamily {
  const domainQuestions = questions.filter(
    (question) => String(question.domain) === domain.id,
  );
  const cells = Object.fromEntries(
    LAYERS.map((layer) => [
      layer,
      buildCell(domain.id, layer, domainQuestions),
    ]),
  ) as Partial<Record<Layer, ConstructFamilyCell>>;
  return {
    id: constructFamilyIdForDomain(domain.id),
    name: domain.name,
    substantiveProblem: domain.description,
    domainId: domain.id,
    axisIds: [
      ...new Set(Object.values(cells).flatMap((cell) => cell?.axisIds ?? [])),
    ],
    cells,
    status: "active",
  };
}

export const constructFamilyMap: ConstructFamilyMap = {
  version: CONSTRUCT_FAMILY_MAP_VERSION,
  architectureVersion: MEASUREMENT_ARCHITECTURE_VERSION,
  families: domains.map(buildFamily),
};

export const constructFamilyById = new Map(
  constructFamilyMap.families.map((family) => [family.id, family]),
);

export function constructFamilyMapErrors(
  map: ConstructFamilyMap = constructFamilyMap,
  familyQuestions: readonly Question[] = questions,
): string[] {
  const errors: string[] = [];
  if (map.version !== CONSTRUCT_FAMILY_MAP_VERSION) {
    errors.push("construct-family map version is not current");
  }
  if (map.architectureVersion !== MEASUREMENT_ARCHITECTURE_VERSION) {
    errors.push("construct-family map architecture version is not current");
  }

  const domainIds = new Set(domains.map((domain) => domain.id));
  const axisIds = new Set(axes.map((axis) => axis.id));
  const questionById = new Map(
    familyQuestions.map((question) => [question.id, question]),
  );
  const seenFamilyIds = new Set<string>();
  const seenQuestionIds = new Set<string>();

  for (const family of map.families) {
    if (seenFamilyIds.has(family.id))
      errors.push(`duplicate family ${family.id}`);
    seenFamilyIds.add(family.id);
    if (!domainIds.has(family.domainId)) {
      errors.push(`${family.id} references an unknown domain`);
    }
    for (const axisId of family.axisIds) {
      if (!axisIds.has(axisId)) {
        errors.push(`${family.id} references unknown axis ${axisId}`);
      }
    }
    for (const [layer, cell] of Object.entries(family.cells)) {
      if (!cell) continue;
      if (cell.layer !== layer) {
        errors.push(`${family.id} has a mismatched ${layer} cell`);
      }
      if (cell.domainId !== family.domainId) {
        errors.push(`${family.id} cell has the wrong domain`);
      }
      for (const axisId of cell.axisIds) {
        if (!axisIds.has(axisId)) {
          errors.push(
            `${family.id}/${layer} references unknown axis ${axisId}`,
          );
        }
      }
      if (
        (cell.coverage === "complete" || cell.coverage === "partial") &&
        cell.itemIds.length === 0
      ) {
        errors.push(`${family.id}/${layer} claims coverage without items`);
      }
      for (const itemId of cell.itemIds) {
        if (seenQuestionIds.has(itemId)) {
          errors.push(`question ${itemId} appears in multiple family cells`);
        }
        seenQuestionIds.add(itemId);
        const question = questionById.get(itemId);
        if (!question) {
          errors.push(
            `${family.id}/${layer} references unknown question ${itemId}`,
          );
          continue;
        }
        if (question.domain !== family.domainId || question.layer !== layer) {
          errors.push(`${itemId} does not match its family cell domain/layer`);
        }
      }
    }
  }

  for (const domain of domains) {
    if (!map.families.some((family) => family.domainId === domain.id)) {
      errors.push(`missing family for domain ${domain.id}`);
    }
  }
  for (const question of familyQuestions) {
    if (!seenQuestionIds.has(question.id)) {
      errors.push(`unmapped question ${question.id}`);
    }
  }
  return errors;
}

export function assertConstructFamilyMap(
  map: ConstructFamilyMap = constructFamilyMap,
): void {
  const errors = constructFamilyMapErrors(map);
  if (errors.length > 0) {
    throw new Error(`Construct-family map violation: ${errors.join("; ")}`);
  }
}
