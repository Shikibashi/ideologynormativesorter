import type {
  NormalizedResponse,
  RawResponse,
} from "../../contracts/src/responses";
import type {
  ContentVersion,
  ResponseSchemaVersion,
  ScoringVersion,
} from "../../contracts/src/versions";
import type { CanonicalContentBundle } from "../../contracts/src/content";
import type {
  ContributionRecordBase,
  SalienceKind,
} from "../../contracts/src/scoring";
import type { ResultSchemaVersion } from "../../contracts/src/versions";

export interface SpecialistAssessmentScope {
  readonly itemIds?: readonly string[];
  readonly constructIds?: readonly string[];
}

export interface ValidatedAssessmentResponses {
  readonly responseSchemaVersion: ResponseSchemaVersion;
  readonly contentFingerprint: string;
  readonly responses: readonly RawResponse[];
}

export interface PreparedResponseSummary {
  readonly answeredCount: number;
  readonly missingCount: number;
  readonly skippedCount: number;
  readonly abstainedCount: number;
  readonly refusedCount: number;
}

export interface PreparedAssessment {
  readonly responseSchemaVersion: ResponseSchemaVersion;
  readonly scoringVersion: ScoringVersion;
  readonly contentVersion: ContentVersion;
  readonly contentFingerprint: string;
  readonly responses: readonly NormalizedResponse[];
  readonly contributions: readonly ContributionRecordBase[];
  readonly responseSummary: PreparedResponseSummary;
  readonly scope?: SpecialistAssessmentScope;
}

export interface SpecialistPreparedModule {
  readonly moduleId: string;
  readonly itemIds: readonly string[];
  readonly constructIds: readonly string[];
  readonly prepared: PreparedAssessment;
}

export interface SpecialistPreparedAssessment {
  readonly responseSchemaVersion: ResponseSchemaVersion;
  readonly scoringVersion: ScoringVersion;
  readonly contentVersion: ContentVersion;
  readonly contentFingerprint: string;
  readonly resultSchemaVersion: ResultSchemaVersion;
  readonly requestedModuleIds: readonly string[];
  readonly modules: readonly SpecialistPreparedModule[];
}

export interface SalienceComputation {
  readonly kind: SalienceKind;
  readonly factor: number;
  readonly skipped: boolean;
}

export type ContentInput = CanonicalContentBundle;
