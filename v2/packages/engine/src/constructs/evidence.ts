import type {
  ConstructEvidence,
} from "../../../contracts/src/constructs";
import type { ContributionRecordBase } from "../../../contracts/src/scoring";
import type { ItemId, ConstructId } from "../../../contracts/src/ids";
import type { NormalizedResponse, ResponseState } from "../../../contracts/src/responses";
import type { EngineContentIndex, EngineItem } from "../content-index";
import {
  getDeclaredItemMappings,
  getEngineConstruct,
} from "../content-index";
import { ScoringError } from "../errors/scoring-error";
import type { PreparedAssessment } from "../types";
import {
  CONSTRUCT_NUMERIC_TOLERANCE,
  isFiniteNumber,
  ratioOrZero,
  stableUnitRatio,
} from "./numeric";

interface EligibilitySlot {
  readonly sourceItemId: string;
  readonly constructId: string;
  readonly mappingWeight: number;
  readonly optionId?: string;
}

function contributionKey(
  sourceItemId: string,
  constructId: string,
  optionId?: string,
): string {
  return [
    sourceItemId,
    constructId,
    optionId ?? "",
  ].join("\u0000");
}

function slotKey(slot: EligibilitySlot): string {
  return contributionKey(slot.sourceItemId, slot.constructId, slot.optionId);
}

function responseByItem(
  prepared: PreparedAssessment,
): ReadonlyMap<string, NormalizedResponse> {
  return new Map(prepared.responses.map((response) => [response.itemId, response]));
}

function statementSlots(
  item: EngineItem,
  response: NormalizedResponse,
): readonly EligibilitySlot[] {
  const selectedOption =
    response.state === "answered" &&
    response.responseType === "statement-choice"
      ? response.optionId
      : undefined;
  const declared = getDeclaredItemMappings(item, selectedOption);
  if (selectedOption !== undefined) {
    return declared.map((mapping) => ({
      sourceItemId: item.id,
      constructId: mapping.constructId,
      mappingWeight: mapping.weight,
      optionId: mapping.optionId,
    }));
  }

  const maximumByConstruct = new Map<string, EligibilitySlot>();
  for (const mapping of declared) {
    const candidate: EligibilitySlot = {
      sourceItemId: item.id,
      constructId: mapping.constructId,
      mappingWeight: mapping.weight,
    };
    const existing = maximumByConstruct.get(mapping.constructId);
    if (
      existing === undefined ||
      candidate.mappingWeight > existing.mappingWeight
    ) {
      maximumByConstruct.set(mapping.constructId, candidate);
    }
  }
  return [...maximumByConstruct.values()].sort((left, right) =>
    left.constructId.localeCompare(right.constructId),
  );
}

function slotsForItem(
  item: EngineItem,
  response: NormalizedResponse,
): readonly EligibilitySlot[] {
  if (item.responseType === "statement-choice") {
    return statementSlots(item, response);
  }
  return getDeclaredItemMappings(item).map((mapping) => ({
    sourceItemId: item.id,
    constructId: mapping.constructId,
    mappingWeight: mapping.weight,
  }));
}

function validateContribution(
  contribution: ContributionRecordBase,
  contentIndex: EngineContentIndex,
): void {
  if (!contentIndex.items.has(contribution.sourceItemId)) {
    throw new ScoringError([
      {
        code: "INVALID_CONTRIBUTION",
        message: "Contribution references an unknown source item",
        itemId: contribution.sourceItemId,
      },
    ]);
  }
  if (!contentIndex.constructs.has(contribution.targetConstructId)) {
    throw new ScoringError([
      {
        code: "UNKNOWN_CONSTRUCT",
        message: "Contribution references an unknown target construct",
        details: { constructId: contribution.targetConstructId },
      },
    ]);
  }
  if (contribution.constructId !== contribution.targetConstructId) {
    throw new ScoringError([
      {
        code: "INVALID_CONTRIBUTION",
        message: "Contribution construct identifiers disagree",
        itemId: contribution.sourceItemId,
        details: {
          constructId: contribution.constructId,
          targetConstructId: contribution.targetConstructId,
        },
      },
    ]);
  }
  const numericFields = [
    contribution.weight,
    contribution.salienceFactor,
    contribution.effectiveWeight,
    contribution.weightedContribution,
    ...(contribution.normalizedInput === null
      ? []
      : [contribution.normalizedInput]),
  ];
  if (
    numericFields.some((value) => !isFiniteNumber(value)) ||
    contribution.weight <= 0 ||
    contribution.salienceFactor < 0 ||
    contribution.effectiveWeight < 0
  ) {
    throw new ScoringError([
      {
        code: "INVALID_CONTRIBUTION",
        message: "Contribution contains invalid numeric arithmetic",
        itemId: contribution.sourceItemId,
        details: { constructId: contribution.targetConstructId },
      },
    ]);
  }
}

function indexContributions(
  contributions: readonly ContributionRecordBase[],
  contentIndex: EngineContentIndex,
): ReadonlyMap<string, ContributionRecordBase> {
  const byKey = new Map<string, ContributionRecordBase>();
  for (const contribution of contributions) {
    validateContribution(contribution, contentIndex);
    const key = contributionKey(
      contribution.sourceItemId,
      contribution.targetConstructId,
      contribution.optionId,
    );
    if (byKey.has(key)) {
      throw new ScoringError([
        {
          code: "DUPLICATE_CONTRIBUTION",
          message: "Prepared assessment contains a duplicate contribution",
          itemId: contribution.sourceItemId,
          details: { constructId: contribution.targetConstructId },
        },
      ]);
    }
    byKey.set(key, contribution);
  }
  return byKey;
}

function freezeEvidence(evidence: ConstructEvidence): ConstructEvidence {
  return Object.freeze({
    ...evidence,
    contributionIds: Object.freeze([...evidence.contributionIds]),
    itemStateById: Object.freeze({ ...evidence.itemStateById }),
  });
}

export function computeConstructEvidence(
  constructId: string,
  prepared: PreparedAssessment,
  contentIndex: EngineContentIndex,
): ConstructEvidence {
  const construct = getEngineConstruct(contentIndex, constructId);
  const responses = responseByItem(prepared);
  const contributions = indexContributions(prepared.contributions, contentIndex);
  const slots: EligibilitySlot[] = [];
  for (const item of contentIndex.activeItems) {
    const response = responses.get(item.id);
    if (response === undefined) {
      throw new ScoringError([
        {
          code: "INVALID_CONTRIBUTION",
          message: "Prepared assessment is missing an active normalized response",
          itemId: item.id,
        },
      ]);
    }
    for (const slot of slotsForItem(item, response)) {
      if (slot.constructId === construct.id) slots.push(slot);
    }
  }

  const itemStateById: Record<ItemId, ResponseState> = {};
  let answeredItemCount = 0;
  let missingItemCount = 0;
  let skippedItemCount = 0;
  let abstainedItemCount = 0;
  let refusedItemCount = 0;
  let totalEligibleWeight = 0;
  let answeredEligibleWeight = 0;
  let missingWeight = 0;
  let skippedWeight = 0;
  let abstainedWeight = 0;
  let refusedWeight = 0;
  let scoredMappedWeight = 0;
  let scoredEffectiveWeight = 0;
  let weightedSum = 0;
  let salienceSkippedWeight = 0;
  const contributionIds: string[] = [];
  const salienceSkippedItems = new Set<string>();
  const supportingItems = new Set<string>();

  for (const slot of slots.sort(
    (left, right) =>
      left.sourceItemId.localeCompare(right.sourceItemId) ||
      left.constructId.localeCompare(right.constructId) ||
      (left.optionId ?? "").localeCompare(right.optionId ?? ""),
  )) {
    const response = responses.get(slot.sourceItemId)!;
    const state = response.state;
    itemStateById[slot.sourceItemId as ItemId] = state;
    totalEligibleWeight += slot.mappingWeight;
    switch (state) {
      case "answered":
        answeredItemCount += 1;
        answeredEligibleWeight += slot.mappingWeight;
        break;
      case "missing":
        missingItemCount += 1;
        missingWeight += slot.mappingWeight;
        break;
      case "skipped":
        skippedItemCount += 1;
        skippedWeight += slot.mappingWeight;
        break;
      case "abstained":
        abstainedItemCount += 1;
        abstainedWeight += slot.mappingWeight;
        break;
      case "refused":
        refusedItemCount += 1;
        refusedWeight += slot.mappingWeight;
        break;
    }

    const contribution = contributions.get(slotKey(slot));
    if (contribution === undefined) {
      if (state === "answered" && response.responseType !== "statement-choice") {
        throw new ScoringError([
          {
            code: "INVALID_CONTRIBUTION",
            message: "Answered item mapping has no Phase 3 contribution",
            itemId: slot.sourceItemId,
            details: { constructId: slot.constructId },
          },
        ]);
      }
      continue;
    }
    if (Math.abs(contribution.weight - slot.mappingWeight) > CONSTRUCT_NUMERIC_TOLERANCE) {
      throw new ScoringError([
        {
          code: "INVALID_CONTRIBUTION",
          message: "Contribution weight differs from canonical mapping weight",
          itemId: slot.sourceItemId,
          details: { constructId: slot.constructId },
        },
      ]);
    }
    if (contribution.included) {
      scoredMappedWeight += slot.mappingWeight;
      scoredEffectiveWeight += contribution.effectiveWeight;
      weightedSum += contribution.weightedContribution;
      contributionIds.push(slotKey(slot));
      supportingItems.add(slot.sourceItemId);
    }
    if (contribution.exclusionReason === "salience_skipped") {
      salienceSkippedWeight += slot.mappingWeight;
      salienceSkippedItems.add(slot.sourceItemId);
    }
  }

  const supportingItemCount = supportingItems.size;
  const salienceSkippedItemCount = salienceSkippedItems.size;
  if (
    ![
      totalEligibleWeight,
      answeredEligibleWeight,
      missingWeight,
      skippedWeight,
      abstainedWeight,
      refusedWeight,
      scoredMappedWeight,
      scoredEffectiveWeight,
      weightedSum,
      salienceSkippedWeight,
    ].every(isFiniteNumber)
  ) {
    throw new ScoringError([
      {
        code: "NON_FINITE_AGGREGATION",
        message: "Construct evidence arithmetic is non-finite",
        details: { constructId: construct.id },
      },
    ]);
  }

  const evidence = {
    constructId: construct.id as ConstructId,
    expectedItemCount: slots.length,
    answeredItemCount,
    missingItemCount,
    skippedItemCount,
    abstainedItemCount,
    refusedItemCount,
    supportingItemCount,
    totalEligibleWeight,
    answeredEligibleWeight,
    missingWeight,
    skippedWeight,
    abstainedWeight,
    refusedWeight,
    scoredMappedWeight,
    scoredEffectiveWeight,
    weightedSum,
    structuralCoverage: stableUnitRatio(answeredItemCount, slots.length),
    answeredWeightCoverage: stableUnitRatio(
      answeredEligibleWeight,
      totalEligibleWeight,
    ),
    scoredWeightCoverage: stableUnitRatio(
      scoredMappedWeight,
      totalEligibleWeight,
    ),
    effectiveWeightCoverage: stableUnitRatio(
      scoredEffectiveWeight,
      totalEligibleWeight,
    ),
    salienceCoverage: ratioOrZero(
      scoredEffectiveWeight,
      scoredMappedWeight,
    ),
    salienceSkippedWeight,
    salienceSkippedItemCount,
    contributionIds: contributionIds.sort(),
    itemStateById,
  };
  return freezeEvidence(evidence);
}
