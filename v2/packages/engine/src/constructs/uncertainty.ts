import type {
  ConstructEvidence,
  ConstructSupportSummary,
  ConstructUncertaintyReason,
} from "../../../contracts/src/constructs";
import { DEFAULT_CONSTRUCT_MINIMUM_EVIDENCE_RATIO } from "../../../contracts/src/scoring";
import {
  CONSTRUCT_NUMERIC_TOLERANCE,
  isNearlyZero,
} from "./numeric";

function addReason(
  reasons: ConstructUncertaintyReason[],
  reason: ConstructUncertaintyReason,
): void {
  if (!reasons.includes(reason)) reasons.push(reason);
}

export function summarizeConstructSupport(
  evidence: ConstructEvidence,
): ConstructSupportSummary {
  const evidenceRatio = evidence.structuralCoverage;
  const reasons: ConstructUncertaintyReason[] = [];

  if (evidence.missingWeight > CONSTRUCT_NUMERIC_TOLERANCE) {
    addReason(reasons, "missingness");
  }
  if (evidence.skippedWeight > CONSTRUCT_NUMERIC_TOLERANCE) {
    addReason(reasons, "skipped");
  }
  if (evidence.abstainedWeight > CONSTRUCT_NUMERIC_TOLERANCE) {
    addReason(reasons, "abstention");
  }
  if (evidence.refusedWeight > CONSTRUCT_NUMERIC_TOLERANCE) {
    addReason(reasons, "refusal");
  }
  if (evidence.salienceSkippedWeight > CONSTRUCT_NUMERIC_TOLERANCE) {
    addReason(reasons, "salience_skipped");
  }
  if (evidenceRatio < DEFAULT_CONSTRUCT_MINIMUM_EVIDENCE_RATIO) {
    addReason(reasons, "insufficient_evidence");
  }
  if (isNearlyZero(evidence.scoredMappedWeight)) {
    addReason(reasons, "no_scored_weight");
  }

  const evidenceStatus =
    evidence.expectedItemCount === 0 ||
    isNearlyZero(evidence.scoredMappedWeight)
      ? "none"
      : evidenceRatio >= DEFAULT_CONSTRUCT_MINIMUM_EVIDENCE_RATIO
        ? "sufficient"
        : "partial";
  const highReasons =
    evidence.abstainedWeight > CONSTRUCT_NUMERIC_TOLERANCE ||
    evidence.refusedWeight > CONSTRUCT_NUMERIC_TOLERANCE;
  const uncertaintyLevel =
    evidenceStatus === "none" || highReasons
      ? "high"
      : evidenceStatus === "partial" ||
          evidence.missingWeight > CONSTRUCT_NUMERIC_TOLERANCE ||
          evidence.skippedWeight > CONSTRUCT_NUMERIC_TOLERANCE ||
          evidence.salienceSkippedWeight > CONSTRUCT_NUMERIC_TOLERANCE
        ? "medium"
        : "low";

  return Object.freeze({
    evidenceStatus,
    minimumEvidenceRatio: DEFAULT_CONSTRUCT_MINIMUM_EVIDENCE_RATIO,
    evidenceRatio,
    nearThreshold:
      Math.abs(evidenceRatio - DEFAULT_CONSTRUCT_MINIMUM_EVIDENCE_RATIO) <=
      CONSTRUCT_NUMERIC_TOLERANCE,
    uncertaintyLevel,
    uncertaintyReasons: Object.freeze(reasons.sort()),
  });
}

