import type { Layer } from "./common";

export interface VNextShadowEstimate {
  id: string;
  layer: Layer;
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
  scoringVersion: string;
  questionIds: readonly string[];
  rootScores: readonly VNextShadowEstimate[];
  facetScores: readonly VNextShadowEstimate[];
  measuredLayerMask: Readonly<Record<Layer, boolean>>;
  excludedItemIds: readonly string[];
  warnings: readonly string[];
  evidenceStatus: "design-only" | "partial" | "measured";
  claimCeiling: "PC0" | "PC1";
  versionTuple: Readonly<Record<string, string>>;
  surfaceManifestId: string;
  abstentionRationale: readonly string[];
}
