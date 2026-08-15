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

export const VNEXT_CONCEPTUAL_STATUSES = [
  "current",
  "historical",
  "proposed",
  "contested",
  "compatibility",
  "retired",
] as const;
export type VNextConceptualStatus = (typeof VNEXT_CONCEPTUAL_STATUSES)[number];

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

export type VNextRelationDirectionality = "directed" | "symmetric";
export type VNextRelationScope =
  | "conceptual"
  | "historical"
  | "institutional"
  | "measurement"
  | "catalog";

export interface VNextEvidenceRequirements {
  requiredConstructIds: readonly string[];
  requiredFacetIds: readonly string[];
  requiredEvidenceComponents: readonly string[];
  prerequisiteModuleIds: readonly string[];
  minimumEvidenceState:
    | "none"
    | "content-ready"
    | "respondent-supported"
    | "validated-scoped";
  abstentionRule: string;
}

export interface VNextPublicRoleView {
  eligibleRoles: readonly VNextPublicRole[];
  defaultRole: VNextPublicRole;
  ordinarySurface: "core" | "specialist" | "modifier" | "context" | "none";
  moduleId?: string;
  activationState: "compatibility" | "research-only" | "gated" | "retired";
  derivationInputs: readonly string[];
}

export interface VNextSemanticConstraint {
  code: string;
  statement: string;
}

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
  graphVersion: string;
  directionality: VNextRelationDirectionality;
  scope: VNextRelationScope;
  facet: VNextRelationFacet;
  sourceRecordIds: readonly string[];
  provenance: readonly string[];
  note: string;
  semanticConstraints: readonly VNextSemanticConstraint[];
  symmetricDerived?: boolean;
}

export interface VNextOntologyNode {
  id: string;
  canonicalName: string;
  alternateNames: readonly string[];
  aliases: readonly string[];
  conceptualKind: VNextConceptualKind;
  secondaryKinds: readonly VNextConceptualKind[];
  conceptualStatus: VNextConceptualStatus;
  constitutiveFacetIds: readonly string[];
  associatedFacetIds: readonly string[];
  nonConstitutiveFacetIds: readonly string[];
  layerRelevance: readonly Layer[];
  historicalScope: string;
  geographicScope: string;
  canonicalDefinition: string;
  boundaryStatement: string;
  sourceRecordIds: readonly string[];
  version: string;
  evidenceRequirements: VNextEvidenceRequirements;
  publicRoleView: VNextPublicRoleView;
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
