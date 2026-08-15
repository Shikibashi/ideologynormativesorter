import type { VNextClaimTier, VNextEvidenceStatus } from "./vnextEvidence";

export type VNextShadowMissingnessStatus =
  | "complete"
  | "partial"
  | "missing"
  | "refused"
  | "not-administered";

export type VNextShadowUncertaintyStatus =
  | "not-estimable"
  | "exploratory"
  | "estimated"
  | "held";

export interface VNextShadowVersionTuple {
  vnextOntologyVersion: string;
  vnextGraphVersion: string;
  vnextRolePolicyVersion: string;
  vnextConstructsVersion: string;
  vnextFacetMapVersion: string;
  vnextItemAnnotationsVersion: string;
  vnextSurfaceManifestVersion: string;
  vnextChallengerModelsVersion: string;
  vnextShadowScoringVersion: string;
  scoringVersion: string;
  codeRevision: string;
  frozenProductionBaselineRevision: string;
}

export interface VNextShadowFacetEstimate {
  facetId: string;
  status: "estimated" | "abstained";
  value?: number;
  uncertainty?: string;
  abstentionRationale?: string;
}

export interface VNextShadowEstimate {
  id: string;
  layer: import("./common").Layer;
  measured: boolean;
  score?: number;
  answeredItemIds: readonly string[];
  eligibleItemCount: number;
  answeredItemCount: number;
  weightSum: number;
  coverage: number;
  missingness: Readonly<Record<string, number>>;
  evidenceStatus: "unmeasured" | "partial" | "measured" | "abstained";
  uncertainty: Readonly<{
    kind: "not-estimable" | "unquantified";
    reason: string;
  }>;
  claimCeiling: "PC0" | "PC1";
  abstentionRationale?: string;
}

export interface VNextShadowResult {
  resultId: string;
  researchOnly: true;
  productionConsumed: false;
  failClosed: true;
  versionTuple: VNextShadowVersionTuple;
  surfaceManifestId: string;
  itemFingerprint: string;
  missingnessStatus: VNextShadowMissingnessStatus;
  refusalHandling: string;
  evidenceStatus: VNextEvidenceStatus | "design-only" | "partial" | "measured";
  uncertaintyStatus: VNextShadowUncertaintyStatus;
  claimTierCeiling: VNextClaimTier;
  abstentionRationale?: string | readonly string[];
  rootEstimates: Readonly<Record<string, number>>;
  facetEstimates: readonly VNextShadowFacetEstimate[];
  facetEstimationRule: string;
  rootWeightReuse: false;
  scoringVersion: string;
  questionIds: readonly string[];
  rootScores: readonly VNextShadowEstimate[];
  facetScores: readonly VNextShadowEstimate[];
  measuredLayerMask: Readonly<Record<import("./common").Layer, boolean>>;
  excludedItemIds: readonly string[];
  warnings: readonly string[];
  claimCeiling: "PC0" | "PC1";
}
