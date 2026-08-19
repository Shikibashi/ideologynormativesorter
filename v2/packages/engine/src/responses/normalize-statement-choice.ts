import type {
  NormalizedStatementChoiceResponse,
  RawResponse,
} from "../../../contracts/src/responses";

export function normalizeStatementChoiceResponse(
  response: Extract<
    RawResponse,
    { state: "answered"; responseType: "statement-choice" }
  >,
): NormalizedStatementChoiceResponse {
  return Object.freeze({
    state: "answered",
    itemId: response.itemId,
    responseType: "statement-choice",
    optionId: response.optionId,
    ...(response.confidence === undefined
      ? {}
      : { confidence: response.confidence }),
    ...(response.priority === undefined ? {} : { priority: response.priority }),
  });
}

