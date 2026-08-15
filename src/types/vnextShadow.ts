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
}

export interface VNextShadowResult {
  scoringVersion: string;
  questionIds: readonly string[];
  rootScores: readonly VNextShadowEstimate[];
  facetScores: readonly VNextShadowEstimate[];
  measuredLayerMask: Readonly<Record<Layer, boolean>>;
  excludedItemIds: readonly string[];
  warnings: readonly string[];
}
