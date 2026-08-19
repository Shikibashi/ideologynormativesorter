import type { NormalizedResponse } from "../../../contracts/src/responses";
import type { ContributionRecordBase } from "../../../contracts/src/scoring";
import type { EngineContentIndex } from "../content-index";
import { computeItemContributions } from "./compute-item-contribution";

export function computeContributions(
  responses: readonly NormalizedResponse[],
  contentIndex: EngineContentIndex,
): readonly ContributionRecordBase[] {
  const sortedResponses = [...responses].sort((left, right) =>
    left.itemId.localeCompare(right.itemId),
  );
  const contributions = sortedResponses.flatMap((response) =>
    computeItemContributions(response, contentIndex),
  );
  return Object.freeze(contributions);
}

