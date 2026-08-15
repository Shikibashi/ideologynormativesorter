import type { Layer } from "./common";

export const VNEXT_CONCEPTUAL_KINDS = [
  "family-anchor",
  "broad-tradition",
  "compound-tradition",
  "bridge-tradition",
  "hybrid-configuration",
  "cross-cutting-orientation",
  "subtype-tradition",
  "regional-historical-variant",
  "institutional-project",
  "strategy-or-program",
  "regime-or-authoritarian-project",
  "intellectual-current",
  "discourse-frame",
  "policy-proposal",
  "governance-model",
  "historical-reference",
  "speculative-technological-current",
] as const;
export type VNextConceptualKind = (typeof VNEXT_CONCEPTUAL_KINDS)[number];

export const VNEXT_MEASUREMENT_STATUSES = [
  "not-started",
  "catalog-only",
  "research-candidate",
  "experimental",
  "compatibility-scored-unvalidated",
  "respondent-supported-scored",
  "validated-scoped-public",
  "held",
  "retired-alias",
] as const;
export type VNextMeasurementStatus =
  (typeof VNEXT_MEASUREMENT_STATUSES)[number];

export type VNextPublicRole =
  | "primary"
  | "specialist"
  | "modifier"
  | "context"
  | "retired";

export type VNextGraphRelationType =
  | "subtype_of"
  | "family_member_of"
  | "hybrid_of"
  | "configures"
  | "often_combines_with"
  | "overlaps_with"
  | "contrasts_with"
  | "requires"
  | "regional_variant_of"
  | "historical_predecessor_of"
  | "influenced_by"
  | "institutionalizes"
  | "context_for"
  | "policy_expression_of"
  | "alias_of"
  | "not_equivalent_to"
  | "incompatible_with_core";

export interface VNextRelationFacet {
  domain?: string;
  layers?: readonly Layer[];
  historicalPeriod?: string;
  regions?: readonly string[];
  evidenceScope?: string;
  differentiatingConstructIds?: readonly string[];
}

export interface VNextGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: VNextGraphRelationType;
  facet?: VNextRelationFacet;
  sourceRecordIds: readonly string[];
  symmetricDerived?: boolean;
}

export interface VNextOntologyNode {
  id: string;
  canonicalName: string;
  alternateNames: readonly string[];
  conceptualKind: VNextConceptualKind;
  constitutiveFacetIds: readonly string[];
  associatedFacetIds: readonly string[];
  nonConstitutiveFacetIds: readonly string[];
  layerRelevance: readonly Layer[];
  historicalScope: string;
  geographicScope: string;
  canonicalDefinition: string;
  boundaryStatement: string;
  sourceRecordIds: readonly string[];
  compatibility: {
    role: VNextPublicRole;
    measurementStatus: string;
    parentId?: string;
    aliasOf?: string;
    relations: readonly {
      type: VNextGraphRelationType;
      labelId: string;
      note?: string;
    }[];
  };
  vNextMeasurementStatus: VNextMeasurementStatus;
  highRisk: boolean;
  currentModuleId?: string;
}

export interface VNextOntologyRegistry {
  ontologyVersion: string;
  graphVersion: string;
  nodes: readonly VNextOntologyNode[];
}
