import type {
  ConstructResult,
  ConstructEvidence,
} from "../../../contracts/src/constructs";
import type { ConstructId } from "../../../contracts/src/ids";
import type { EngineConstruct } from "../content-index";
import { ScoringError } from "../errors/scoring-error";
import {
  CONSTRUCT_NUMERIC_TOLERANCE,
  isFiniteNumber,
  isNearlyZero,
} from "./numeric";
import { determineConstructScorability } from "./scorability";

export function aggregateConstruct(
  construct: EngineConstruct,
  evidence: ConstructEvidence,
): ConstructResult {
  const decision = determineConstructScorability(evidence);
  const base = {
    constructId: construct.id as ConstructId,
    numerator: evidence.weightedSum,
    denominator: evidence.scoredMappedWeight,
    evidence,
    support: decision.support,
    contributionIds: evidence.contributionIds,
  };

  if (!decision.scorable) {
    return Object.freeze({
      ...base,
      status: "abstained",
      score: null,
      abstentionReason: decision.abstentionReason!,
    });
  }

  if (
    !isFiniteNumber(evidence.weightedSum) ||
    !isFiniteNumber(evidence.scoredMappedWeight) ||
    isNearlyZero(evidence.scoredMappedWeight)
  ) {
    throw new ScoringError([
      {
        code: "NON_FINITE_AGGREGATION",
        message: "Scored construct has invalid numerator or denominator",
        details: { constructId: construct.id },
      },
    ]);
  }
  const rawScore = evidence.weightedSum / evidence.scoredMappedWeight;
  if (!isFiniteNumber(rawScore)) {
    throw new ScoringError([
      {
        code: "NON_FINITE_AGGREGATION",
        message: "Construct score is non-finite",
        details: { constructId: construct.id },
      },
    ]);
  }
  if (
    rawScore < -1 - CONSTRUCT_NUMERIC_TOLERANCE ||
    rawScore > 1 + CONSTRUCT_NUMERIC_TOLERANCE
  ) {
    throw new ScoringError([
      {
        code: "AGGREGATION_OUT_OF_BOUNDS",
        message: "Construct score exceeds the contract bounds",
        details: { constructId: construct.id, rawScore },
      },
    ]);
  }
  const score = Math.max(-1, Math.min(1, rawScore));
  return Object.freeze({
    ...base,
    status: "scored",
    score,
  });
}
