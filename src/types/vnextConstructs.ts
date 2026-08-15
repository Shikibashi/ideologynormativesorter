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
  version: string;
  name: string;
  layer: Layer;
  definition: string;
  neighboringRootIds: readonly AxisId[];
  applicableConfigurationIds: readonly string[];
  discriminantRoles: readonly string[];
  applicablePrimaryIds: readonly string[];
  applicableSpecialistModuleIds: readonly string[];
  applicableModifierDomainIds: readonly string[];
  indicatorRequirementIds: readonly string[];
  measurementStatus: VNextConstructMeasurementStatus;
  validationRequirements: readonly string[];
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
  version: string;
  name: string;
  layer: Layer;
  definition: string;
  facetIds: readonly string[];
  neighboringRootIds: readonly AxisId[];
  expectedConfigurations: readonly string[];
  discriminantRoles: readonly string[];
  applicablePrimaryIds: readonly string[];
  applicableSpecialistModuleIds: readonly string[];
  applicableModifierDomainIds: readonly string[];
  indicatorRequirementIds: readonly string[];
  measurementStatus: VNextConstructMeasurementStatus;
  validationRequirements: readonly string[];
  riskFlags: readonly string[];
  applicableLabelIds: readonly string[];
  applicableModuleIds: readonly string[];
  coverageStatus: VNextConstructCoverageStatus;
  sourceRecordIds: readonly string[];
  implementationIds: readonly string[];
  decisionIds: readonly string[];
}

export type VNextConstructMeasurementStatus =
  | "planned"
  | "effectively-unmeasured"
  | "research-candidate"
  | "experimental"
  | "respondent-supported"
  | "validated-scoped";

export interface VNextLocalConstruct {
  id: string;
  version: string;
  rootId: AxisId;
  applicableRootIds: readonly AxisId[];
  name: string;
  layer: Layer;
  definition: string;
  moduleIds: readonly string[];
  indicatorIds: readonly string[];
  measurementStatus: VNextConstructMeasurementStatus;
  validationRequirements: readonly string[];
  sourceRecordIds: readonly string[];
  implementationIds: readonly string[];
  decisionIds: readonly string[];
}

export interface VNextConstructRegistry {
  constructsVersion: string;
  facetMapVersion: string;
  roots: readonly VNextRootConstruct[];
  facets: readonly VNextFacetConstruct[];
  localConstructs: readonly VNextLocalConstruct[];
}
