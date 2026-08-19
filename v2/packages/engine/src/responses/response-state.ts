import type { ContributionExclusionReason } from "../../../contracts/src/scoring";
import type { ResponseState } from "../../../contracts/src/responses";

export const RESPONSE_STATES = [
  "answered",
  "missing",
  "skipped",
  "abstained",
  "refused",
] as const;

export function isNonAnswerState(state: ResponseState): boolean {
  return state !== "answered";
}

export function exclusionReasonForState(
  state: Exclude<ResponseState, "answered">,
): ContributionExclusionReason {
  switch (state) {
    case "missing":
      return "missing_response";
    case "skipped":
      return "skipped_response";
    case "abstained":
      return "explicit_abstention";
    case "refused":
      return "refused_response";
  }
}

