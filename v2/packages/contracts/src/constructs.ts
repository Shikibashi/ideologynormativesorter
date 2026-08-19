import type {
  ConstructId,
  ItemId,
} from "./ids";
import type {
  ContentFingerprint,
  ContentVersion,
  ResponseSchemaVersion,
  ResultSchemaVersion,
  ScoringVersion,
} from "./versions";
import type { ResponseState } from "./responses";
import type { ContributionRecordBase } from "./scoring";

export const CONSTRUCT_ABSTENTION_REASONS = [
  "no_eligible_items",
  "all_responses_missing",
  "all_responses_skipped",
  "all_responses_abstained",
  "all_responses_refused",
  "insufficient_evidence",
] as const;
export type ConstructAbstentionReason =
  (typeof CONSTRUCT_ABSTENTION_REASONS)[number];

export const CONSTRUCT_EVIDENCE_STATUSES = [
  "sufficient",
  "partial",
  "none",
] as const;
export type ConstructEvidenceStatus =
  (typeof CONSTRUCT_EVIDENCE_STATUSES)[number];

export const CONSTRUCT_UNCERTAINTY_REASONS = [
  "missingness",
  "skipped",
  "abstention",
  "refusal",
  "insufficient_evidence",
  "no_scored_weight",
  "salience_skipped",
] as const;
export type ConstructUncertaintyReason =
  (typeof CONSTRUCT_UNCERTAINTY_REASONS)[number];

export type ConstructUncertaintyLevel = "low" | "medium" | "high";

export interface ConstructEvidence {
  readonly constructId: ConstructId;
  readonly expectedItemCount: number;
  readonly answeredItemCount: number;
  readonly missingItemCount: number;
  readonly skippedItemCount: number;
  readonly abstainedItemCount: number;
  readonly refusedItemCount: number;
  readonly supportingItemCount: number;
  readonly totalEligibleWeight: number;
  readonly answeredEligibleWeight: number;
  readonly missingWeight: number;
  readonly skippedWeight: number;
  readonly abstainedWeight: number;
  readonly refusedWeight: number;
  readonly scoredMappedWeight: number;
  readonly scoredEffectiveWeight: number;
  readonly weightedSum: number;
  readonly structuralCoverage: number;
  readonly answeredWeightCoverage: number;
  readonly scoredWeightCoverage: number;
  readonly effectiveWeightCoverage: number;
  readonly salienceCoverage: number;
  readonly salienceSkippedWeight: number;
  readonly salienceSkippedItemCount: number;
  readonly contributionIds: readonly string[];
  readonly itemStateById: Readonly<Record<ItemId, ResponseState>>;
}

export type OverallConstructEvidence = Omit<ConstructEvidence, "constructId"> & {
  readonly constructCount: number;
};

export interface ConstructSupportSummary {
  readonly evidenceStatus: ConstructEvidenceStatus;
  readonly minimumEvidenceRatio: number;
  readonly evidenceRatio: number;
  readonly nearThreshold: boolean;
  readonly uncertaintyLevel: ConstructUncertaintyLevel;
  readonly uncertaintyReasons: readonly ConstructUncertaintyReason[];
}

export interface ConstructResultBase {
  readonly constructId: ConstructId;
  readonly numerator: number;
  readonly denominator: number;
  readonly evidence: ConstructEvidence;
  readonly support: ConstructSupportSummary;
  readonly contributionIds: readonly string[];
}

export interface ScoredConstructResult extends ConstructResultBase {
  readonly status: "scored";
  readonly score: number;
  readonly abstentionReason?: never;
}

export interface AbstainedConstructResult extends ConstructResultBase {
  readonly status: "abstained";
  readonly score: null;
  readonly abstentionReason: ConstructAbstentionReason;
}

export type ConstructResult =
  | ScoredConstructResult
  | AbstainedConstructResult;

export interface ConstructResponseSummary {
  readonly answeredCount: number;
  readonly missingCount: number;
  readonly skippedCount: number;
  readonly abstainedCount: number;
  readonly refusedCount: number;
}

export interface ConstructAssessment {
  readonly responseSchemaVersion: ResponseSchemaVersion;
  readonly scoringVersion: ScoringVersion;
  readonly contentVersion: ContentVersion;
  readonly contentFingerprint: ContentFingerprint;
  readonly resultSchemaVersion: ResultSchemaVersion;
  readonly responseSummary: ConstructResponseSummary;
  readonly contributions: readonly ContributionRecordBase[];
  readonly constructs: readonly ConstructResult[];
  readonly evidence: {
    readonly overall: OverallConstructEvidence;
    readonly byConstruct: readonly ConstructEvidence[];
  };
}

