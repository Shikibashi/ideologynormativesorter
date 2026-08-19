import type {
  NormalizedResponse,
  RawResponse,
} from "../../../contracts/src/responses";
import type { ItemId } from "../../../contracts/src/ids";
import type { EngineContentIndex } from "../content-index";
import { getEngineItem } from "../content-index";
import type { ValidatedAssessmentResponses } from "../types";
import { normalizeLikertResponse } from "./normalize-likert";
import { normalizeStatementChoiceResponse } from "./normalize-statement-choice";

export function normalizeResponse(
  response: RawResponse,
  contentIndex: EngineContentIndex,
): NormalizedResponse {
  const item = getEngineItem(contentIndex, response.itemId);
  if (response.state !== "answered") {
    return Object.freeze({
      state: response.state,
      itemId: response.itemId,
    }) as NormalizedResponse;
  }
  if (response.responseType === "statement-choice") {
    return normalizeStatementChoiceResponse(response);
  }
  return normalizeLikertResponse(response, item);
}

export function normalizeResponses(
  validated: ValidatedAssessmentResponses,
  contentIndex: EngineContentIndex,
): readonly NormalizedResponse[] {
  const providedByItem = new Map(
    validated.responses.map((response) => [response.itemId, response]),
  );
  const normalized = contentIndex.activeItems.map((item) => {
    const response = providedByItem.get(item.id as ItemId);
    return normalizeResponse(
      response ?? {
        state: "missing",
        itemId: item.id as ItemId,
      },
      contentIndex,
    );
  });
  return Object.freeze(normalized);
}
