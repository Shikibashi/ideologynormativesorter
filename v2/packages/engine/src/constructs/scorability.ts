import type {
  ConstructAbstentionReason,
  ConstructEvidence,
  ConstructSupportSummary,
} from "../../../contracts/src/constructs";
import { CONSTRUCT_NUMERIC_TOLERANCE, isNearlyZero } from "./numeric";
import { summarizeConstructSupport } from "./uncertainty";

export interface ConstructScorability {
  readonly scorable: boolean;
  readonly abstentionReason?: ConstructAbstentionReason;
  readonly support: ConstructSupportSummary;
}

function allState(
  evidence: ConstructEvidence,
  countKey:
    | "missingItemCount"
    | "skippedItemCount"
    | "abstainedItemCount"
    | "refusedItemCount",
): boolean {
  return (
    evidence.expectedItemCount > 0 &&
    evidence[countKey] === evidence.expectedItemCount
  );
}

export function determineConstructScorability(
  evidence: ConstructEvidence,
): ConstructScorability {
  const support = summarizeConstructSupport(evidence);
  if (evidence.expectedItemCount === 0) {
    return {
      scorable: false,
      abstentionReason: "no_eligible_items",
      support,
    };
  }
  if (allState(evidence, "missingItemCount")) {
    return {
      scorable: false,
      abstentionReason: "all_responses_missing",
      support,
    };
  }
  if (allState(evidence, "skippedItemCount")) {
    return {
      scorable: false,
      abstentionReason: "all_responses_skipped",
      support,
    };
  }
  if (allState(evidence, "abstainedItemCount")) {
    return {
      scorable: false,
      abstentionReason: "all_responses_abstained",
      support,
    };
  }
  if (allState(evidence, "refusedItemCount")) {
    return {
      scorable: false,
      abstentionReason: "all_responses_refused",
      support,
    };
  }
  if (
    support.evidenceStatus !== "sufficient" ||
    isNearlyZero(evidence.scoredMappedWeight) ||
    Math.abs(evidence.weightedSum) > Number.MAX_VALUE
  ) {
    return {
      scorable: false,
      abstentionReason: "insufficient_evidence",
      support,
    };
  }
  return { scorable: true, support };
}

export { CONSTRUCT_NUMERIC_TOLERANCE };

