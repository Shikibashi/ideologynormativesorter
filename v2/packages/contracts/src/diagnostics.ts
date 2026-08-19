import type { CanonicalContentBundle, ConstructRole } from "./content";
import type { ConstructAssessment, ConstructResult, ConstructSupportSummary } from "./constructs";
import type { ModifierAssessment, ModifierResult } from "./modifiers";
import type { PrimaryProfileAssessment, PrimaryProfileMatchResult } from "./profiles";
import type { ContributionRecordBase } from "./scoring";
import type { SpecialistAssessment, SpecialistModuleResult, SpecialistProfileMatchResult } from "./specialists";
import type { ResponseState } from "./responses";
import type { ContentFingerprint, ContentVersion, ResponseSchemaVersion, ResultSchemaVersion, ScoringVersion } from "./versions";

export const DIAGNOSTICS_VERSION = "diagnostics-v2.phase8.1" as const;
export const DIAGNOSTIC_MIDPOINT_TOLERANCE = 0.1;

export type DiagnosticSeverity = "info" | "caution" | "blocking";
export type DiagnosticScorePosition = "negative-side" | "near-midpoint" | "positive-side" | "unavailable" | "not-applicable";

export interface ContributionTrace {
  readonly contributionId: string;
  readonly itemId: string;
  readonly constructId: string;
  readonly constructRole: ConstructRole;
  readonly responseState: ResponseState;
  readonly normalizedValue: number | null;
  readonly rawValue?: number;
  readonly optionId?: string;
  readonly mappingWeight: number;
  readonly direction: -1 | 1;
  readonly salienceFactor: number;
  readonly effectiveWeight: number;
  readonly weightedContribution: number;
  readonly included: boolean;
  readonly exclusionReason?: string;
  readonly provenanceRefs: readonly string[];
}

export interface ConstructArithmeticDiagnostic {
  readonly authoritativeNumerator: number;
  readonly authoritativeDenominator: number;
  readonly tracedWeightedContribution: number;
  readonly tracedMappingWeight: number;
  readonly tracedEffectiveWeight: number;
  readonly numeratorReconciles: boolean;
  readonly denominatorReconciles: boolean;
}

export interface ConstructDiagnostic {
  readonly constructId: string;
  readonly status: ConstructResult["status"];
  readonly score: number | null;
  readonly scorePosition: DiagnosticScorePosition;
  readonly nearEvidenceThreshold: boolean;
  readonly nearInterpretiveMidpoint: boolean;
  readonly support: ConstructSupportSummary;
  readonly evidence: ConstructResult["evidence"];
  readonly contributionIds: readonly string[];
  readonly includedContributionIds: readonly string[];
  readonly excludedContributionIds: readonly string[];
  readonly strongestPositiveContributionIds: readonly string[];
  readonly strongestNegativeContributionIds: readonly string[];
  readonly largestAbsoluteContributionIds: readonly string[];
  readonly arithmetic: ConstructArithmeticDiagnostic;
  readonly severity: DiagnosticSeverity;
}

export interface DivergenceRelation {
  readonly id: string;
  readonly type: "cross_dimension_pair";
  readonly constructIds: readonly [string, string];
  readonly dimensionPair: "normative-descriptive" | "normative-prescriptive" | "descriptive-prescriptive";
  readonly secondDirection: -1 | 1;
  readonly provenanceRefs?: readonly string[];
}

export interface DivergenceDiagnostic {
  readonly id: string;
  readonly relationType: DivergenceRelation["type"];
  readonly constructIds: readonly [string, string];
  readonly dimensionPair: DivergenceRelation["dimensionPair"];
  readonly status: "scored" | "unavailable";
  readonly evidenceStatus: "sufficient" | "unavailable";
  readonly firstScore: number | null;
  readonly secondScore: number | null;
  readonly signedDifference?: number;
  readonly magnitude?: number;
  readonly interpretationCode?: "neutral_separation";
  readonly provenanceRefs: readonly string[];
}

export interface DomainSummaryDiagnostic {
  readonly domainId: string;
  readonly constructIds: readonly string[];
  readonly scoredConstructCount: number;
  readonly abstainedConstructCount: number;
  readonly evidence: {
    readonly totalEligibleWeight: number;
    readonly answeredEligibleWeight: number;
    readonly missingWeight: number;
    readonly skippedWeight: number;
    readonly abstainedWeight: number;
    readonly refusedWeight: number;
    readonly coverage: number;
  };
  readonly diagnosticMean: number | null;
  readonly diagnosticMeanIsNotAScore: true;
  readonly divergenceIds: readonly string[];
}

export interface ProfileDiagnostic {
  readonly profileId: string;
  readonly status: PrimaryProfileMatchResult["status"];
  readonly similarity: number | null;
  readonly distance: number | null;
  readonly rank: number | null;
  readonly tieGroup: number | null;
  readonly assessmentTie: PrimaryProfileAssessment["topTie"];
  readonly assessmentUncertainty: PrimaryProfileAssessment["uncertainty"];
  readonly closestConstructIds: readonly string[];
  readonly largestDepartureConstructIds: readonly string[];
  readonly highestWeightConstructIds: readonly string[];
  readonly comparisons: PrimaryProfileMatchResult["comparisons"];
  readonly gates: PrimaryProfileMatchResult["gates"];
  readonly evidence: PrimaryProfileMatchResult["evidence"];
  readonly abstentionReason?: string;
}

export interface ModifierDiagnostic {
  readonly modifierId: string;
  readonly status: ModifierResult["status"];
  readonly fit: number | null;
  readonly distance: number | null;
  readonly supportingConstructIds: readonly string[];
  readonly opposingConstructIds: readonly string[];
  readonly comparisons: ModifierResult["comparisons"];
  readonly gates: ModifierResult["gates"];
  readonly evidence: ModifierResult["evidence"];
  readonly abstentionReason?: string;
}

export interface SpecialistProfileDiagnostic {
  readonly profileId: SpecialistProfileMatchResult["profileId"];
  readonly status: SpecialistProfileMatchResult["status"];
  readonly distance: number | null;
  readonly similarity: number | null;
  readonly rank: number | null;
  readonly tieGroup: string | null;
  readonly closestConstructIds: readonly string[];
  readonly largestDepartureConstructIds: readonly string[];
  readonly comparisons: SpecialistProfileMatchResult["comparisons"];
  readonly gates: SpecialistProfileMatchResult["gates"];
  readonly evidence: SpecialistProfileMatchResult["evidence"];
  readonly abstentionReason?: string;
}

export interface SpecialistDiagnostic {
  readonly moduleId: string;
  readonly status: SpecialistModuleResult["status"];
  readonly activation: {
    readonly moduleId: string;
    readonly activationRuleId: string;
    readonly status: SpecialistModuleResult["activationStatus"];
    readonly eligibilityStatus: SpecialistModuleResult["eligibilityStatus"];
    readonly requestedModule: boolean;
    readonly reason?: string;
  };
  readonly evidence: SpecialistModuleResult["evidence"];
  readonly constructDiagnostics: readonly ConstructDiagnostic[];
  readonly profileDiagnostics: readonly SpecialistProfileDiagnostic[];
}

export interface AssessmentDiagnostics {
  readonly diagnosticsVersion: typeof DIAGNOSTICS_VERSION;
  readonly responseSchemaVersion: ResponseSchemaVersion;
  readonly scoringVersion: ScoringVersion;
  readonly contentVersion: ContentVersion;
  readonly contentFingerprint: ContentFingerprint;
  readonly resultSchemaVersion: ResultSchemaVersion;
  readonly contributions: readonly ContributionTrace[];
  readonly constructs: readonly ConstructDiagnostic[];
  readonly divergences: readonly DivergenceDiagnostic[];
  readonly domains: readonly DomainSummaryDiagnostic[];
  readonly profiles: readonly ProfileDiagnostic[];
  readonly modifiers: readonly ModifierDiagnostic[];
  readonly specialists: readonly SpecialistDiagnostic[];
  readonly evidence: {
    readonly constructCoverage: number;
    readonly scoredConstructCount: number;
    readonly abstainedConstructCount: number;
    readonly missingResponseCount: number;
    readonly skippedResponseCount: number;
    readonly abstainedResponseCount: number;
    readonly refusedResponseCount: number;
  };
}

export interface DiagnosticsInput {
  readonly bundle: CanonicalContentBundle;
  readonly constructs: ConstructAssessment;
  readonly profiles?: PrimaryProfileAssessment;
  readonly modifiers?: ModifierAssessment;
  readonly specialists?: SpecialistAssessment;
  readonly divergenceRelations?: readonly DivergenceRelation[];
}

export type DiagnosticContributionSource = ContributionRecordBase;
