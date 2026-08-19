import type { ConstructId, ItemId } from "./ids";
import type { RawResponse, ResponseState } from "./responses";
import type { ConstructResult, OverallConstructEvidence } from "./constructs";
import type { ModifierResult } from "./modifiers";
import type {
  PrimaryProfileMatchResult,
  PrimaryProfileRankingEntry,
  PrimaryProfileTieSummary,
  PrimaryProfileAssessmentUncertainty,
} from "./profiles";
import type { AssessmentDiagnostics } from "./diagnostics";
import type {
  SpecialistModuleResult,
  SpecialistAssessmentSummary,
  SpecialistProfileMatchResult,
} from "./specialists";
import type {
  ContentFingerprint,
  ContentSchemaVersion,
  ContentVersion,
  ResearchSchemaVersion,
  ResponseSchemaVersion,
  ResultSchemaVersion,
  ScoringVersion,
  VersionFields,
} from "./versions";

export type {
  AbstainedConstructResult,
  ConstructAssessment,
  ConstructEvidence,
  ConstructResponseSummary,
  ConstructResult,
  ConstructSupportSummary,
  OverallConstructEvidence,
  ScoredConstructResult,
} from "./constructs";
export type {
  AbstainedPrimaryProfile,
  PrimaryProfileAssessment,
  PrimaryProfileAssessmentUncertainty,
  PrimaryProfileConstructComparison,
  PrimaryProfileEvidence,
  PrimaryProfileMatchResult,
  PrimaryProfileRankingEntry,
  PrimaryProfileSupportSummary,
  PrimaryProfileTieSummary,
  ProfileAbstentionReason,
  ProfileComparisonExclusionReason,
  ProfileGateEvaluation,
  ProfileGateReason,
  ProfileGateStatus,
  ProfileUncertaintyReason,
  ScoredPrimaryProfile,
} from "./profiles";
export type {
  ModifierAssessment,
  ModifierEvidence,
  ModifierGateEvaluation,
  ModifierIndicatorComparison,
  ModifierResult,
  ModifierUncertainty,
} from "./modifiers";
export type {
  SpecialistAssessment,
  SpecialistAssessmentInput,
  SpecialistAssessmentSummary,
  SpecialistGateEvaluation,
  SpecialistModuleEvidence,
  SpecialistModuleResult,
  SpecialistProfileConstructComparison,
  SpecialistProfileEvidence,
  SpecialistProfileMatchResult,
  SpecialistProfileRankingEntry,
} from "./specialists";

export const ASSESSMENT_STATUSES = [
  "complete",
  "partially_scored",
  "insufficient_core_evidence",
  "invalid",
] as const;
export type AssessmentStatus = (typeof ASSESSMENT_STATUSES)[number];

export interface AssessmentInput {
  readonly responseSchemaVersion: ResponseSchemaVersion;
  readonly contentFingerprint: ContentFingerprint;
  readonly coreResponses: readonly RawResponse[];
  readonly specialistResponses?: readonly RawResponse[];
  /** An empty array is the explicit, deterministic no-specialist choice. */
  readonly requestedSpecialistModuleIds: readonly string[];
}

export interface AssessmentResponseSummary {
  readonly coreExpectedCount: number;
  readonly coreAnsweredCount: number;
  readonly coreMissingCount: number;
  readonly coreSkippedCount: number;
  readonly coreAbstainedCount: number;
  readonly coreRefusedCount: number;
  readonly specialistExpectedCount: number;
  readonly specialistAnsweredCount: number;
  readonly specialistMissingCount: number;
  readonly specialistSkippedCount: number;
  readonly specialistAbstainedCount: number;
  readonly specialistRefusedCount: number;
}

export interface AssessmentEvidenceSummary {
  readonly status: "sufficient" | "partial" | "none";
  readonly coreCoverage: number;
  readonly core: OverallConstructEvidence;
  readonly scoredConstructCount: number;
  readonly abstainedConstructCount: number;
  readonly uncertaintyLevel: "low" | "medium" | "high";
  readonly uncertaintyReasons: readonly string[];
}

export interface AssessmentSummary {
  readonly status: AssessmentStatus;
  readonly responseSummary: AssessmentResponseSummary;
  readonly evidence: AssessmentEvidenceSummary;
}

export interface AssessmentPrimaryResult {
  readonly profiles: readonly PrimaryProfileMatchResult[];
  readonly ranking: readonly PrimaryProfileRankingEntry[];
  readonly topProfileIds: readonly string[];
  readonly topTie: PrimaryProfileTieSummary;
  readonly uncertainty: PrimaryProfileAssessmentUncertainty;
}

export interface AssessmentSpecialistModuleResult
  extends Omit<SpecialistModuleResult, "constructAssessment"> {
  readonly constructs: readonly ConstructResult[];
  readonly contributionIds: readonly string[];
}

export interface AssessmentSpecialistResult extends VersionFields {
  readonly coreAssessmentContentFingerprint: ContentFingerprint;
  readonly modules: readonly AssessmentSpecialistModuleResult[];
  readonly summary: SpecialistAssessmentSummary;
}

export interface AssessmentResult extends VersionFields {
  readonly assessment: AssessmentSummary;
  /** Core construct results are the only top-level construct score authority. */
  readonly constructs: readonly ConstructResult[];
  readonly primary: AssessmentPrimaryResult;
  readonly modifiers: readonly ModifierResult[];
  readonly specialists: AssessmentSpecialistResult;
  /** diagnostics.contributions is the single canonical contribution table. */
  readonly diagnostics: AssessmentDiagnostics;
}

export interface AssessmentVersionBinding {
  readonly responseSchemaVersion: ResponseSchemaVersion;
  readonly resultSchemaVersion: ResultSchemaVersion;
  readonly contentSchemaVersion: ContentSchemaVersion;
  readonly contentVersion: ContentVersion;
  readonly contentFingerprint: ContentFingerprint;
  readonly scoringVersion: ScoringVersion;
  readonly researchSchemaVersion: ResearchSchemaVersion;
}

export type AssessmentItemStateCounts = Readonly<Record<ResponseState, number>>;

export interface AssessmentContributionReference {
  readonly contributionId: string;
  readonly sourceItemId: ItemId;
  readonly targetConstructId: ConstructId;
}

export type AssessmentSpecialistProfile = SpecialistProfileMatchResult;
