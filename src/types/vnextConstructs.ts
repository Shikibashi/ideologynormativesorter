import type { AxisId, Layer } from "./common";

export type VNextConstructCoverageStatus =
  | "missing"
  | "planned"
  | "effectively-unmeasured"
  | "underrepresented"
  | "adequate"
  | "depth-limited"
  | "overrepresented"
  | "contaminated";

export interface VNextFacetConstruct {
  id: string;
  rootId: AxisId;
  name: string;
  layer: Layer;
  definition: string;
  neighboringRootIds: readonly AxisId[];
  discriminantRoles: readonly string[];
  riskFlags: readonly string[];
  applicableLabelIds: readonly string[];
  applicableModuleIds: readonly string[];
  coverageStatus: VNextConstructCoverageStatus;
  sourceRecordIds: readonly string[];
  implementationIds: readonly string[];
  decisionIds: readonly string[];
}

export interface VNextRootConstruct {
  id: AxisId;
  name: string;
  layer: Layer;
  definition: string;
  facetIds: readonly string[];
  neighboringRootIds: readonly AxisId[];
  expectedConfigurations: readonly string[];
  discriminantRoles: readonly string[];
  riskFlags: readonly string[];
  applicableLabelIds: readonly string[];
  applicableModuleIds: readonly string[];
  coverageStatus: VNextConstructCoverageStatus;
  sourceRecordIds: readonly string[];
  implementationIds: readonly string[];
  decisionIds: readonly string[];
}

export interface VNextConstructRegistry {
  constructsVersion: string;
  facetMapVersion: string;
  roots: readonly VNextRootConstruct[];
  facets: readonly VNextFacetConstruct[];
}
