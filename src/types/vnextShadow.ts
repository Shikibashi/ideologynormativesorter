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
  evidenceStatus: VNextEvidenceStatus;
  uncertaintyStatus: VNextShadowUncertaintyStatus;
  claimTierCeiling: VNextClaimTier;
  abstentionRationale?: string;
  rootEstimates: Readonly<Record<string, number>>;
  facetEstimates: readonly VNextShadowFacetEstimate[];
  facetEstimationRule: string;
  rootWeightReuse: false;
}
