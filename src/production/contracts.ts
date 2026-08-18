/** Public contracts for the deterministic production scoring boundary. */

import type { CanonicalRegistry } from "../domain/registry";
import type { StableId } from "../domain/canonicalManifest";

export const PRODUCTION_CONTRACT_VERSION = "production-response-v1";
export const PRODUCTION_PROFILE_VERSION = "production-profile-v1";
export const PRODUCTION_RESULT_VERSION = "production-result-v1";
/** Canonical production scoring version used by result metadata and the Worker. */
export const PRODUCTION_SCORING_VERSION = "production-score-v1";

export type ProductionResponseStatus =
  | "answered"
  | "missing"
  | "refused"
  | "abstained";

/** A response is deliberately independent from UI Answer/AnswerMap records. */
export interface ProductionResponse {
  readonly itemId: StableId;
  /** Production values use a signed, normalized scale from -1 through 1. */
  readonly value?: number;
  /**
   * Optional direct construct contributions for canonical statement-choice
   * responses. Values are already normalized and keyed by construct ID.
   */
  readonly constructValues?: Readonly<Record<StableId, number>>;
  readonly status?: ProductionResponseStatus;
  /** Stable, non-participant evidence references supplied by a caller. */
  readonly evidenceRefs?: readonly string[];
}

export interface ProductionResponseEnvelope {
  readonly contractVersion: typeof PRODUCTION_CONTRACT_VERSION;
  readonly responses: readonly ProductionResponse[];
}

export type ProductionAbstentionCode =
  | "no-responses"
  | "missing-response"
  | "refused-response"
  | "abstained-response"
  | "invalid-response"
  | "unknown-item"
  | "duplicate-response"
  | "insufficient-evidence"
  | "canonical-registry-unavailable"
  | "adapter-refused";

export interface ProductionAbstention {
  readonly code: ProductionAbstentionCode;
  readonly itemIds: readonly StableId[];
  readonly message: string;
}

export type ProductionEvidenceStatus = "none" | "partial" | "sufficient";

export interface ProductionEvidenceCoverage {
  readonly answeredItems: number;
  readonly expectedItems: number;
  /** A deterministic value in the closed interval [0, 1]. */
  readonly coverage: number;
  readonly status: ProductionEvidenceStatus;
}

export type ProductionUncertaintyBand = "low" | "medium" | "high";

export type ProductionUncertaintyReason =
  | "missingness"
  | "refusal"
  | "abstention"
  | "insufficient-evidence"
  | "adapter-output"
  | "label-tie";

export interface ProductionUncertainty {
  readonly band: ProductionUncertaintyBand;
  readonly reasons: readonly ProductionUncertaintyReason[];
}

export interface ProductionDimensionScore {
  readonly dimensionId: StableId;
  /** Null means that no usable evidence measured this dimension. */
  readonly value: number | null;
  readonly evidenceCoverage: ProductionEvidenceCoverage;
  readonly uncertainty: ProductionUncertainty;
  readonly abstentions: readonly ProductionAbstention[];
}

export interface ProductionProfile {
  readonly contractVersion: typeof PRODUCTION_PROFILE_VERSION;
  readonly scoringVersion: typeof PRODUCTION_SCORING_VERSION;
  readonly scores: readonly ProductionDimensionScore[];
  readonly evidenceCoverage: ProductionEvidenceCoverage;
  readonly uncertainty: ProductionUncertainty;
  readonly abstentions: readonly ProductionAbstention[];
}

/**
 * Labels are public configuration endpoints. They are never inferred from a
 * participant record or read from research infrastructure.
 */
export interface ProductionLabelEndpoint {
  readonly id: StableId;
  readonly name: string;
  readonly centroid: Readonly<Record<StableId, number>>;
  readonly description?: string;
  readonly interpretation?: string;
}

export interface ProductionLabelMatch {
  readonly labelId: StableId;
  readonly name: string;
  readonly similarity: number;
  readonly evidenceCoverage: ProductionEvidenceCoverage;
  readonly uncertainty: ProductionUncertainty;
  readonly rank: number;
  readonly runnerUpMargin?: number;
  readonly interpretation?: string;
}

export interface ProductionInterpretationMetadata {
  readonly mode: "profile-similarity";
  readonly labelSource: "configuration";
  readonly contractVersion: typeof PRODUCTION_CONTRACT_VERSION;
  readonly profileVersion: typeof PRODUCTION_PROFILE_VERSION;
  readonly scoringVersion: typeof PRODUCTION_SCORING_VERSION;
  readonly registryVersion: string;
  /** Identifies the pure transform and avoids timestamps/random IDs. */
  readonly transform: "weighted-mean-v1";
  readonly adapterId: string;
}

export type ProductionDecision = "scored" | "abstain";

export interface ProductionResult {
  readonly contractVersion: typeof PRODUCTION_RESULT_VERSION;
  readonly profile: ProductionProfile;
  readonly labels: readonly ProductionLabelMatch[];
  readonly decision: ProductionDecision;
  readonly evidenceCoverage: ProductionEvidenceCoverage;
  readonly uncertainty: ProductionUncertainty;
  readonly abstentions: readonly ProductionAbstention[];
  readonly interpretation: ProductionInterpretationMetadata;
}

/** Normalized evidence handed to an explicit primitive adapter boundary. */
export interface ProductionScoredResponse {
  readonly itemId: StableId;
  readonly value: number;
  readonly constructValues?: Readonly<Record<StableId, number>>;
}

export interface ProductionDimensionDefinition {
  readonly id: StableId;
  readonly itemWeights: Readonly<Record<StableId, number>>;
}

export interface ProductionPrimitiveRequest {
  readonly responses: readonly ProductionScoredResponse[];
  readonly dimensions: readonly ProductionDimensionDefinition[];
}

export interface ProductionPrimitiveOutput {
  readonly values: Readonly<Record<StableId, number | null>>;
}

/**
 * Adapter boundary for reusing a separately-owned scoring primitive. The
 * production layer supplies only canonical, normalized evidence and consumes
 * only normalized dimension values.
 */
export interface ProductionScoringAdapter {
  readonly id: string;
  readonly score: (
    request: ProductionPrimitiveRequest,
  ) => ProductionPrimitiveOutput;
}

export interface ProductionScoreRequest {
  readonly responses:
    | readonly ProductionResponse[]
    | ProductionResponseEnvelope;
  readonly labels?: readonly ProductionLabelEndpoint[];
}

export interface ProductionScoreOptions {
  readonly registry?: CanonicalRegistry;
  readonly adapter?: ProductionScoringAdapter;
  /** Defaults to 0.5; values outside [0, 1] are rejected. */
  readonly minimumEvidenceCoverage?: number;
}
