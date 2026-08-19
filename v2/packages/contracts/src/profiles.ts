import type { ConstructId, ProfileId } from "./ids";
import type { ConstructResult } from "./constructs";
import type { ConstitutiveGateOperator } from "./scoring";
import type {
  ContentFingerprint,
  ContentVersion,
  ResponseSchemaVersion,
  ResultSchemaVersion,
  ScoringVersion,
} from "./versions";

export const PROFILE_ABSTENTION_REASONS = [
  "invalid_profile_configuration",
  "required_construct_unavailable",
  "constitutive_gate_failed",
  "constitutive_gate_unavailable",
  "insufficient_evidence",
  "no_comparable_constructs",
] as const;
export type ProfileAbstentionReason = (typeof PROFILE_ABSTENTION_REASONS)[number];

export const PROFILE_GATE_STATUSES = ["passed", "failed", "unavailable"] as const;
export type ProfileGateStatus = (typeof PROFILE_GATE_STATUSES)[number];

export const PROFILE_GATE_REASONS = [
  "value_meets_threshold",
  "value_below_minimum",
  "value_above_maximum",
  "value_in_interval",
  "value_outside_interval",
  "evidence_meets_threshold",
  "evidence_below_threshold",
  "item_count_meets_threshold",
  "item_count_below_threshold",
  "construct_unavailable",
  "children_passed",
  "child_failed",
  "child_unavailable",
] as const;
export type ProfileGateReason = (typeof PROFILE_GATE_REASONS)[number];

export interface ProfileGateEvaluation {
  readonly gateId: string;
  readonly operator: ConstitutiveGateOperator;
  readonly status: ProfileGateStatus;
  readonly reason: ProfileGateReason;
  readonly constructId?: ConstructId;
  readonly observedValue?: number;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly observedEvidenceRatio?: number;
  readonly minimumEvidenceRatio?: number;
  readonly observedItemCount?: number;
  readonly minimumItemCount?: number;
  readonly children?: readonly string[];
}

export const PROFILE_COMPARISON_EXCLUSION_REASONS = [
  "construct_unavailable",
  "minimum_answered_items_not_met",
] as const;
export type ProfileComparisonExclusionReason =
  (typeof PROFILE_COMPARISON_EXCLUSION_REASONS)[number];

export interface PrimaryProfileConstructComparison {
  readonly constructId: ConstructId;
  readonly targetValue: number;
  readonly observedScore: number | null;
  readonly weight: number;
  readonly squaredError: number | null;
  readonly weightedSquaredError: number | null;
  readonly included: boolean;
  readonly exclusionReason?: ProfileComparisonExclusionReason;
}

export interface PrimaryProfileEvidence {
  readonly requiredConstructCount: number;
  readonly measuredRequiredConstructCount: number;
  readonly unavailableRequiredConstructCount: number;
  readonly totalWeight: number;
  readonly measuredWeight: number;
  readonly unavailableWeight: number;
  readonly comparisonCoverage: number;
  readonly minimumEvidenceRatio: number;
  readonly meetsMinimumEvidence: boolean;
  readonly unavailableConstructIds: readonly ConstructId[];
}

export const PROFILE_UNCERTAINTY_REASONS = [
  "partial_profile_evidence",
  "required_construct_unavailable",
  "insufficient_profile_evidence",
  "constitutive_gate_failed",
  "constitutive_gate_unavailable",
  "near_profile_tie",
  "no_comparable_constructs",
] as const;
export type ProfileUncertaintyReason = (typeof PROFILE_UNCERTAINTY_REASONS)[number];

export interface PrimaryProfileSupportSummary {
  readonly evidenceStatus: "sufficient" | "partial" | "none";
  readonly evidenceRatio: number;
  readonly minimumEvidenceRatio: number;
  readonly uncertaintyLevel: "low" | "medium" | "high";
  readonly uncertaintyReasons: readonly ProfileUncertaintyReason[];
}

export interface PrimaryProfileMatchBase {
  readonly profileId: ProfileId;
  readonly name: string;
  readonly comparisons: readonly PrimaryProfileConstructComparison[];
  readonly evidence: PrimaryProfileEvidence;
  readonly gates: readonly ProfileGateEvaluation[];
  readonly support: PrimaryProfileSupportSummary;
}

export interface ScoredPrimaryProfile extends PrimaryProfileMatchBase {
  readonly status: "scored";
  readonly distance: number;
  readonly similarity: number;
  readonly rank: number | null;
  readonly tieGroup: number | null;
  readonly abstentionReason?: never;
}

export interface AbstainedPrimaryProfile extends PrimaryProfileMatchBase {
  readonly status: "abstained";
  readonly distance: null;
  readonly similarity: null;
  readonly rank: null;
  readonly tieGroup: null;
  readonly abstentionReason: ProfileAbstentionReason;
}

export type PrimaryProfileMatchResult =
  | ScoredPrimaryProfile
  | AbstainedPrimaryProfile;

export interface PrimaryProfileRankingEntry {
  readonly profileId: ProfileId;
  readonly similarity: number;
  readonly distance: number;
  readonly rank: number;
  readonly tieGroup: number;
}

export interface PrimaryProfileTieSummary {
  readonly isTie: boolean;
  readonly profileIds: readonly ProfileId[];
  readonly similarityDelta: number | null;
  readonly tolerance: number;
  readonly reason?: "label-tie";
}

export interface PrimaryProfileAssessmentUncertainty {
  readonly level: "low" | "medium" | "high";
  readonly reasons: readonly ("label-tie" | "no_eligible_profiles" | "partial_profile_evidence")[];
}

export interface PrimaryProfileAssessment {
  readonly responseSchemaVersion: ResponseSchemaVersion;
  readonly scoringVersion: ScoringVersion;
  readonly contentVersion: ContentVersion;
  readonly contentFingerprint: ContentFingerprint;
  readonly resultSchemaVersion: ResultSchemaVersion;
  readonly constructs: readonly ConstructResult[];
  readonly profiles: readonly PrimaryProfileMatchResult[];
  readonly ranking: readonly PrimaryProfileRankingEntry[];
  readonly topProfileIds: readonly ProfileId[];
  readonly topTie: PrimaryProfileTieSummary;
  readonly uncertainty: PrimaryProfileAssessmentUncertainty;
}
