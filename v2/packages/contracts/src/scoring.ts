import { ConstructId, StatementOptionId } from "./ids";
import type { ConstructRole } from "./content";
import type { ResponseState } from "./responses";

export type SalienceModel = "descriptive" | "prescriptive" | "normative";
export type SalienceFactor = number;
export type SalienceKind = "confidence" | "priority" | "neutral";

/** Phase 0 minimum required construct evidence ratio; equality is sufficient. */
export const DEFAULT_CONSTRUCT_MINIMUM_EVIDENCE_RATIO = 0.5;

export type ConstitutiveGateOperator =
  | "minimum"
  | "maximum"
  | "interval"
  | "evidenceMinimum"
  | "conjunction"
  | "disjunction";

export const GATE_OPERATORS = [
  "minimum",
  "maximum",
  "interval",
  "evidenceMinimum",
  "conjunction",
  "disjunction",
] as const;

export interface GateBase {
  id: string;
  operator: ConstitutiveGateOperator;
}

export interface MinimumGate extends GateBase {
  operator: "minimum";
  constructId: ConstructId;
  minimum: number;
}

export interface MaximumGate extends GateBase {
  operator: "maximum";
  constructId: ConstructId;
  maximum: number;
}

export interface IntervalGate extends GateBase {
  operator: "interval";
  constructId: ConstructId;
  minimum: number;
  maximum: number;
}

export interface EvidenceMinimumGate extends GateBase {
  operator: "evidenceMinimum";
  constructId?: ConstructId;
  minimumEvidenceRatio: number;
  minimumItemCount?: number;
}

export interface ConjunctionGate extends GateBase {
  operator: "conjunction";
  children: string[];
}

export interface DisjunctionGate extends GateBase {
  operator: "disjunction";
  children: string[];
}

export type ConstitutiveGate =
  | MinimumGate
  | MaximumGate
  | IntervalGate
  | EvidenceMinimumGate
  | ConjunctionGate
  | DisjunctionGate;

export const ABSTENTION_REASONS = [
  "insufficient_evidence",
  "required_construct_missing",
  "constitutive_gate_failed",
  "specialist_not_activated",
  "invalid_input",
  "policy_filtered",
] as const;

export type AbstentionReason = (typeof ABSTENTION_REASONS)[number];

export const CONTRIBUTION_EXCLUSION_REASONS = [
  "missing_response",
  "skipped_response",
  "explicit_abstention",
  "refused_response",
  "salience_skipped",
] as const;
export type ContributionExclusionReason =
  (typeof CONTRIBUTION_EXCLUSION_REASONS)[number];

export interface ContributionRecordBase {
  sourceItemId: string;
  sourceResponseState: ResponseState;
  constructId: ConstructId;
  targetConstructId: ConstructId;
  constructRole: ConstructRole;
  rawValue?: number;
  optionId?: StatementOptionId;
  normalizedInput: number | null;
  direction: -1 | 1;
  /** The explicit canonical mapping magnitude. */
  weight: number;
  /** The numeric salience multiplier applied to the mapping. */
  salienceFactor: SalienceFactor;
  salienceKind: SalienceKind;
  effectiveWeight: number;
  weightedContribution: number;
  included: boolean;
  exclusionReason?: ContributionExclusionReason;
}

export interface EvidenceSummaryBase {
  answeredWeight: number;
  totalEligibleWeight: number;
  missingWeight: number;
  abstainedWeight: number;
  refusedWeight: number;
  supportingItemCount: number;
  coveredConstructIds: ConstructId[];
}

export type UncertaintyLevel = "low" | "medium" | "high";

export interface UncertaintySummary {
  level: UncertaintyLevel;
  reasons: string[];
  profileAmbiguity: boolean;
  nearThresholdScoreDelta?: number;
}
