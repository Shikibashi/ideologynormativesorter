import type { ConstructAssessment } from "./constructs";
import type { ModifierProfileRecord } from "./content";
import type { ConstructId, ItemId, ModifierId } from "./ids";
import type { ResponseState } from "./responses";
import type {
  ContentFingerprint,
  ContentVersion,
  ResponseSchemaVersion,
  ResultSchemaVersion,
  ScoringVersion,
} from "./versions";
import type { ConstitutiveGateOperator } from "./scoring";

export const MODIFIER_STATUSES = [
  "active",
  "inactive",
  "below-threshold",
  "unavailable",
] as const;
export type ModifierStatus = (typeof MODIFIER_STATUSES)[number];

export const MODIFIER_MEASUREMENT_STATES = ["measured", "unmeasured"] as const;
export type ModifierMeasurementState = (typeof MODIFIER_MEASUREMENT_STATES)[number];

export const MODIFIER_UNCERTAINTY_LEVELS = ["low", "medium", "high"] as const;
export type ModifierUncertaintyLevel = (typeof MODIFIER_UNCERTAINTY_LEVELS)[number];

export const MODIFIER_UNCERTAINTY_REASONS = [
  "insufficient_indicator_evidence",
  "partial_indicator_coverage",
] as const;
export type ModifierUncertaintyReason = (typeof MODIFIER_UNCERTAINTY_REASONS)[number];

export const MODIFIER_RESULT_REASONS = [
  "fit_below_threshold",
  "minimum_answered_items_not_met",
  "evidence_below_threshold",
  "uncertainty_too_high",
  "constitutive_gate_failed",
  "constitutive_gate_unavailable",
  "no_measured_indicators",
  "catalog_only",
  "focused_follow_up",
  "invalid_modifier_configuration",
] as const;
export type ModifierResultReason = (typeof MODIFIER_RESULT_REASONS)[number];

export const MODIFIER_GATE_STATUSES = ["passed", "failed", "unavailable"] as const;
export type ModifierGateStatus = (typeof MODIFIER_GATE_STATUSES)[number];

export const MODIFIER_GATE_REASONS = [
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
export type ModifierGateReason = (typeof MODIFIER_GATE_REASONS)[number];

export const MODIFIER_INDICATOR_EXCLUSION_REASONS = [
  "not_in_assessment",
  "missing_response",
  "skipped_response",
  "explicit_abstention",
  "refused_response",
  "salience_skipped",
  "minimum_evidence_weight",
] as const;
export type ModifierIndicatorExclusionReason =
  (typeof MODIFIER_INDICATOR_EXCLUSION_REASONS)[number];

export interface ModifierIndicatorComparison {
  readonly itemId: ItemId;
  readonly sourceResponseState: ResponseState | null;
  readonly observedValue: number | null;
  /** Value after the modifier's explicit indicator direction is applied. */
  readonly directedValue: number | null;
  readonly targetValue: number;
  readonly weight: number;
  readonly evidenceWeight: number;
  readonly squaredError: number | null;
  readonly weightedSquaredError: number | null;
  readonly included: boolean;
  readonly constructIds: readonly ConstructId[];
  readonly contributionIds: readonly string[];
  readonly exclusionReason?: ModifierIndicatorExclusionReason;
}

export interface ModifierEvidence {
  readonly totalIndicatorCount: number;
  readonly measuredIndicatorCount: number;
  readonly minimumAnsweredItems: number;
  readonly indicatorCoverage: number;
  readonly minimumEvidenceRatio: number;
  readonly meetsMinimumEvidence: boolean;
  readonly totalWeight: number;
  readonly measuredWeight: number;
  readonly weightedCoverage: number;
  readonly answeredIndicatorIds: readonly ItemId[];
  readonly unavailableIndicatorIds: readonly ItemId[];
}

export interface ModifierUncertainty {
  readonly level: ModifierUncertaintyLevel;
  readonly reasons: readonly ModifierUncertaintyReason[];
}

export interface ModifierGateEvaluation {
  readonly gateId: string;
  readonly operator: ConstitutiveGateOperator;
  readonly status: ModifierGateStatus;
  readonly reason: ModifierGateReason;
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

export interface ModifierResult {
  readonly modifierId: ModifierId;
  readonly name: string;
  readonly availability: ModifierProfileRecord["availability"];
  readonly constructName: string;
  readonly measurementState: ModifierMeasurementState;
  readonly status: ModifierStatus;
  /** The v1-compatible continuous fit score in [0, 1], when measured. */
  readonly fit: number | null;
  readonly distance: number | null;
  readonly fitThreshold: number;
  readonly evidence: ModifierEvidence;
  readonly uncertainty: ModifierUncertainty;
  readonly comparisons: readonly ModifierIndicatorComparison[];
  readonly gates: readonly ModifierGateEvaluation[];
  readonly reason?: ModifierResultReason;
}

export interface ModifierAssessment {
  readonly responseSchemaVersion: ResponseSchemaVersion;
  readonly scoringVersion: ScoringVersion;
  readonly contentVersion: ContentVersion;
  readonly contentFingerprint: ContentFingerprint;
  readonly resultSchemaVersion: ResultSchemaVersion;
  readonly modifiers: readonly ModifierResult[];
}

export type ModifierConstructAssessmentInput = ConstructAssessment;
