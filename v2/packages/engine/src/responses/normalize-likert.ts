import type {
  NormalizedLikertResponse,
  RawResponse,
} from "../../../contracts/src/responses";
import type { EngineItem } from "../content-index";

function isReverseScored(item: EngineItem): boolean {
  return item.raw.reverseScored === true;
}

export function normalizeLikertResponse(
  response: Extract<
    RawResponse,
    { state: "answered"; responseType: "likert5" | "likert7" }
  >,
  item: EngineItem,
): NormalizedLikertResponse {
  const maximum = response.responseType === "likert5" ? 2 : 3;
  const unitValue = response.value / maximum;
  const reverseScored = isReverseScored(item);
  const normalizedValue = Math.max(
    -1,
    Math.min(1, reverseScored ? -unitValue : unitValue),
  );
  return Object.freeze({
    state: "answered",
    itemId: response.itemId,
    responseType: response.responseType,
    rawValue: response.value,
    normalizedValue,
    reverseScored,
    ...(response.confidence === undefined
      ? {}
      : { confidence: response.confidence }),
    ...(response.priority === undefined ? {} : { priority: response.priority }),
  });
}

