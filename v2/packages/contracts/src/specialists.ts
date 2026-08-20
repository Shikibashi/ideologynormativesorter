import type { ConstructAssessment } from "./constructs";
import type { RawResponseEnvelope } from "./responses";
import type { ConstitutiveGate } from "./scoring";
import type { VersionFields } from "./versions";

export type SpecialistModuleStatus =
  | "ineligible"
  | "not_activated"
  | "activated_insufficient_evidence"
  | "scored";

export type SpecialistEligibilityStatus = "eligible" | "ineligible";
export type SpecialistActivationStatus = "activated" | "not_activated";
export type SpecialistProfileResultStatus = "scored" | "abstained";
export type SpecialistEvidenceStatus = "sufficient" | "insufficient";

export interface SpecialistAssessmentInput {
  readonly requestedModuleIds: readonly string[];
  readonly responses: RawResponseEnvelope | readonly unknown[];
}

export interface SpecialistModuleEvidence {
  readonly expectedItemCount: number;
  readonly answeredItemCount: number;
  readonly missingItemCount: number;
  readonly skippedItemCount: number;
  readonly abstainedItemCount: number;
  readonly refusedItemCount: number;
  readonly totalItemWeight: number;
  readonly answeredItemWeight: number;
  readonly itemCoverage: number;
  readonly answeredWeightCoverage: number;
  readonly expectedConstructCount: number;
  readonly scoredConstructCount: number;
  readonly constructCoverage: number;
  readonly minimumAnsweredItems: number;
  readonly minimumAnsweredWeightRatio: number;
  readonly minimumConstructCoverageRatio: number;
  readonly status: SpecialistEvidenceStatus;
  readonly insufficientReasons: readonly string[];
}

export interface SpecialistProfileConstructComparison {
  readonly commitmentId: string;
  readonly constructId: string;
  readonly relation: string;
  readonly criterion?: Readonly<Record<string, unknown>>;
  /** Deprecated compatibility field; commitment scoring never reads it. */
  readonly targetValue?: number;
  readonly observedScore: number | null;
  readonly weight: number;
  readonly commitmentSupport: number | null;
  /** Deprecated compatibility fields; commitment scoring never populates them. */
  readonly squaredError?: number | null;
  readonly weightedSquaredError?: number | null;
  readonly included: boolean;
  readonly exclusionReason?: string;
}

export interface SpecialistProfileEvidence {
  readonly requiredConstructCount: number;
  readonly measuredRequiredConstructCount: number;
  readonly unavailableRequiredConstructCount: number;
  readonly totalWeight: number;
  readonly measuredWeight: number;
  readonly unavailableWeight: number;
  readonly comparisonCoverage: number;
  readonly minimumEvidenceRatio: number;
  readonly meetsMinimumEvidence: boolean;
  readonly unavailableConstructIds: readonly string[];
}

export interface SpecialistGateEvaluation {
  readonly gateId: string;
  readonly operator: ConstitutiveGate["operator"];
  readonly constructId?: string;
  readonly status: "passed" | "failed" | "unavailable";
  readonly reason: string;
  readonly observedValue?: number;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly observedEvidenceRatio?: number;
  readonly minimumEvidenceRatio?: number;
  readonly children?: readonly string[];
}

export interface SpecialistProfileMatchResult {
  readonly profileId: string;
  readonly moduleId: string;
  readonly name: string;
  readonly outputType: "primary" | "diagnostic";
  readonly canonicalStatus?: string;
  readonly variantId?: string;
  readonly variant?: string;
  readonly status: SpecialistProfileResultStatus;
  readonly affinity: number | null;
  readonly support: number | null;
  /** Deprecated aliases: distance = 1 - affinity, similarity = affinity. */
  readonly distance: number | null;
  readonly similarity: number | null;
  readonly rank: number | null;
  readonly tieGroup: string | null;
  readonly abstentionReason?: string;
  readonly comparisons: readonly SpecialistProfileConstructComparison[];
  readonly evidence: SpecialistProfileEvidence;
  readonly gates: readonly SpecialistGateEvaluation[];
}

export interface SpecialistProfileRankingEntry {
  readonly profileId: string;
  readonly rank: number;
  readonly affinity: number;
  /** Deprecated alias for affinity. */
  readonly similarity: number;
  readonly tieGroup: string | null;
}

export interface SpecialistModuleResult {
  readonly moduleId: string;
  readonly status: SpecialistModuleStatus;
  readonly eligibilityStatus: SpecialistEligibilityStatus;
  readonly activationStatus: SpecialistActivationStatus;
  readonly eligibilityReason?: string;
  readonly activationReason?: string;
  readonly evidence: SpecialistModuleEvidence;
  readonly constructAssessment: ConstructAssessment | null;
  readonly profiles: readonly SpecialistProfileMatchResult[];
  readonly ranking: readonly SpecialistProfileRankingEntry[];
  readonly topProfileIds: readonly string[];
  readonly topTie: boolean;
}

export interface SpecialistAssessmentSummary {
  readonly moduleCount: number;
  readonly eligibleModuleCount: number;
  readonly activatedModuleCount: number;
  readonly scoredModuleCount: number;
  readonly insufficientEvidenceModuleCount: number;
  readonly notActivatedModuleCount: number;
  readonly ineligibleModuleCount: number;
}

export interface SpecialistAssessment extends VersionFields {
  readonly coreAssessmentContentFingerprint: string;
  readonly modules: readonly SpecialistModuleResult[];
  readonly summary: SpecialistAssessmentSummary;
}
