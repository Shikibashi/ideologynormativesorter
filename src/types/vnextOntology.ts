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

export type VNextHighRiskClassification = "ordinary" | "high-risk";

export interface VNextModifierMetadata {
  domainId: string;
  subdimensionId: string;
  crossHost: boolean;
  availability: "core-construct" | "focused-follow-up" | "catalog-only";
  scoringState: "direct-indicator" | "follow-up-only" | "catalog-only";
  evidenceRequirements: readonly string[];
}

export interface VNextContextMetadata {
  contextKind: VNextConceptualKind;
  route: "catalog" | "explainer" | "graph" | "research";
  ordinaryScoring: false;
  futureRoute?: string;
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

export type VNextGraphMigrationDisposition =
  | "retain-unchanged"
  | "replace"
  | "split"
  | "supersede"
  | "remove-with-rationale";

export interface VNextGraphMigrationRecord {
  migrationId: string;
  oldSourceId: string;
  oldTargetId: string;
  oldRelation: string;
  disposition: VNextGraphMigrationDisposition;
  newRelationIds: readonly string[];
  methodologicalDecision: string;
  sourceRecordIds: readonly string[];
  rationale: string;
}

export interface VNextGraphAdjudicationRecord {
  adjudicationId: string;
  sourceId: string;
  targetId: string;
  type: VNextGraphRelationType;
  status: "approved";
  sourceRecordIds: readonly string[];
  decisionIds: readonly string[];
  rationale: string;
}

export type VNextSpecialistRelationCoverageStatus =
  | "represented"
  | "dispositioned"
  | "no_typed_relation_declared";

/**
 * Machine-readable coverage of the approved Specialist family-graph column.
 * A disposition is intentional: it records why an approved phrase could not
 * become a graph edge without inventing an ontology anchor or resolving an
 * ambiguity that the architecture has not decided.
 */
export interface VNextSpecialistRelationCoverageRecord {
  coverageId: string;
  sourceId: string;
  sourceRecordId: string;
  relationType?: VNextGraphRelationType;
  targetLabel?: string;
  targetId?: string;
  edgeId?: string;
  status: VNextSpecialistRelationCoverageStatus;
  rationale: string;
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
  highRiskClassification: VNextHighRiskClassification;
  specialistKind?: string;
  modifierMetadata?: VNextModifierMetadata;
  contextMetadata?: VNextContextMetadata;
  currentModuleId?: string;
}

/**
 * The specification-owned ontology record. Compatibility decoding is
 * intentionally absent: the v13 taxonomy is joined only after this record
 * has been selected and validated.
 */
export type VNextOntologyRecord = Omit<VNextOntologyNode, "compatibility">;

export interface VNextOntologyRegistry {
  ontologyVersion: string;
  graphVersion: string;
  nodes: readonly VNextOntologyNode[];
}
