import type { NormalizedResponse } from "../../../contracts/src/responses";
import type {
  ContributionRecordBase,
  SalienceKind,
} from "../../../contracts/src/scoring";
import type { EngineContentIndex, EngineItem, EngineMapping } from "../content-index";
import {
  getDeclaredItemMappings,
  getEngineConstruct,
  getEngineItem,
} from "../content-index";
import { exclusionReasonForState } from "../responses/response-state";
import type { SalienceComputation } from "../types";

function itemLayer(item: EngineItem): SalienceKind {
  const value = item.raw.layer ?? item.raw.role ?? item.raw.constructRole;
  if (value === "descriptive") {
    return "confidence";
  }
  if (value === "prescriptive") {
    return "priority";
  }
  return "neutral";
}

function ratingForResponse(
  response: Extract<NormalizedResponse, { state: "answered" }>,
  kind: SalienceKind,
): number | undefined {
  if (kind === "confidence") {
    return response.confidence;
  }
  if (kind === "priority") {
    return response.priority;
  }
  return undefined;
}

export function computeSalienceFactor(
  item: EngineItem,
  response: NormalizedResponse,
): SalienceComputation {
  const kind = itemLayer(item);
  if (response.state !== "answered") {
    return {
      kind,
      factor: 0,
      skipped: false,
    };
  }
  if (kind === "neutral") {
    return {
      kind,
      factor: 1,
      skipped: false,
    };
  }
  const rating = ratingForResponse(response, kind);
  if (rating === undefined) {
    return {
      kind,
      factor: 0,
      skipped: true,
    };
  }
  return {
    kind,
    factor: rating / 5,
    skipped: false,
  };
}

function normalizedInputFor(
  response: NormalizedResponse,
): {
  readonly value: number | null;
  readonly rawValue?: number;
  readonly optionId?: string;
} {
  if (response.state !== "answered") {
    return { value: null };
  }
  if (response.responseType === "statement-choice") {
    return { value: 1, optionId: response.optionId };
  }
  return {
    value: response.normalizedValue,
    rawValue: response.rawValue,
  };
}

export function computeItemContributions(
  response: NormalizedResponse,
  contentIndex: EngineContentIndex,
): readonly ContributionRecordBase[] {
  const item = getEngineItem(contentIndex, response.itemId);
  const mappings: readonly EngineMapping[] =
    item.responseType === "statement-choice" &&
    (response.state !== "answered" || response.responseType !== "statement-choice")
      ? []
      : getDeclaredItemMappings(
          item,
          response.state === "answered" && response.responseType === "statement-choice"
            ? response.optionId
            : undefined,
        );
  if (mappings.length === 0) {
    return Object.freeze([]);
  }

  const salience = computeSalienceFactor(item, response);
  const input = normalizedInputFor(response);
  const stateExclusion =
    response.state === "answered"
      ? undefined
      : exclusionReasonForState(response.state);
  const exclusionReason =
    stateExclusion ?? (salience.skipped ? "salience_skipped" : undefined);
  const included = response.state === "answered" && !salience.skipped;

  const records = mappings.map((entry) => {
    const construct = getEngineConstruct(contentIndex, entry.constructId);
    const effectiveWeight = included ? entry.weight * salience.factor : 0;
    const weightedContribution =
      included && input.value !== null
        ? input.value * entry.polarity * effectiveWeight
        : 0;
    const record = {
      sourceItemId: item.id,
      sourceResponseState: response.state,
      constructId: construct.id,
      targetConstructId: construct.id,
      constructRole: construct.role,
      ...(input.rawValue === undefined ? {} : { rawValue: input.rawValue }),
      ...(input.optionId === undefined ? {} : { optionId: input.optionId }),
      normalizedInput: input.value,
      direction: entry.polarity,
      weight: entry.weight,
      salienceFactor: salience.factor,
      salienceKind: salience.kind,
      effectiveWeight,
      weightedContribution,
      included,
      ...(exclusionReason === undefined ? {} : { exclusionReason }),
    } as ContributionRecordBase;
    return Object.freeze(record);
  });
  return Object.freeze(records);
}
