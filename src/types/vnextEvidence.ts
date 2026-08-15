import type {
  VNextConceptualKind,
  VNextMeasurementStatus,
  VNextPublicRole,
} from "./vnextOntology";

export const VNEXT_EVIDENCE_COMPONENT_IDS = [
  "contentValidity",
  "responseProcess",
  "internalStructure",
  "separability",
  "incrementalValidity",
  "calibration",
  "temporalStability",
  "fairness",
  "robustness",
] as const;
export type VNextEvidenceComponentId =
  (typeof VNEXT_EVIDENCE_COMPONENT_IDS)[number];

export const VNEXT_EVIDENCE_STATUSES = [
  "not-started",
  "design-ready",
  "insufficient-data",
  "not-estimable",
  "exploratory-signal",
  "conditional-pass",
  "pass",
  "fail",
  "superseded",
] as const;
export type VNextEvidenceStatus = (typeof VNEXT_EVIDENCE_STATUSES)[number];

export type VNextClaimTier =
  | "PC0"
  | "PC1"
  | "PC2"
  | "PC3"
  | "PC4"
  | "PC5"
  | "PC6"
  | "PC7";

export type VNextPromotionState =
  | "catalog-context"
  | "research-candidate"
  | "experimental-display"
  | "compatibility-scored-unvalidated"
  | "respondent-supported-scored"
  | "validated-scoped-public"
  | "held-demoted";

export type VNextPromotionDecision =
  | "not-started"
  | "hold"
  | "promote"
  | "demote"
  | "supersede";

export interface VNextGraphParentRelation {
  relation: string;
  labelId: string;
  direction?: "incoming" | "outgoing";
  note?: string;
}

export interface VNextEvidenceComponent {
  status: VNextEvidenceStatus;
  estimand: string;
  hypothesis: string;
  method: string;
  itemOrConstructScope: readonly string[];
  sampleScope: string;
  usableN?: number;
  effectiveN?: number;
  comparisonSet: readonly string[];
  estimateOrResult?: string;
  uncertainty?: string;
  preregistered: boolean;
  confirmationOrExploration: "not-started" | "exploratory" | "confirmatory";
  replicationStatus: "not-started" | "planned" | "partial" | "complete";
  limitations: readonly string[];
  artifactLinks: readonly string[];
  reviewerDecision: "pending" | "accept" | "revise" | "reject";
}

export interface VNextEvidenceCard {
  cardId: string;
  cardVersion: string;
  labelId: string;
  canonicalName: string;
  productRole: VNextPublicRole;
  conceptualKind: VNextConceptualKind;
  historicalScope: string;
  graphParentsAndRelations: readonly VNextGraphParentRelation[];
  publicMeasurementStatus: VNextMeasurementStatus;
  currentCompatibilityStatus: string;
  constructScope: readonly string[];
  constitutiveConstructIds: readonly string[];
  optionalFacetIds: readonly string[];
  nearestNeighborIds: readonly string[];
  m0HostId?: string;
  m0ModifierOrFacetIds: readonly string[];
  m1ResidualHypothesis?: string;
  moduleId?: string;
  formAndPopulationScope: {
    form: string;
    population: string;
    language: string;
    region: string;
    time: string;
  };
  evidence: Readonly<Record<VNextEvidenceComponentId, VNextEvidenceComponent>>;
  preregistrationIds: readonly string[];
  analysisManifestIds: readonly string[];
  dataSplits: readonly string[];
  versionBundle: Readonly<Record<string, string>>;
  claimTierCeiling: VNextClaimTier;
  publicDisplayState: VNextPromotionState;
  promotionDecision: VNextPromotionDecision;
  decisionRationale: string;
  limitations: readonly string[];
  openQuestions: readonly string[];
  reviewers: readonly string[];
  replicationPlan: readonly string[];
  provenance: readonly string[];
  createdAt: string;
  updatedAt: string;
}

export interface VNextPromotionRecord {
  recordId: string;
  recordVersion: string;
  cardId: string;
  labelId: string;
  priorState: VNextPromotionState;
  decision: VNextPromotionDecision;
  targetState?: VNextPromotionState;
  claimTier: VNextClaimTier;
  scope: VNextEvidenceCard["formAndPopulationScope"];
  requiredEvidenceComponents: readonly VNextEvidenceComponentId[];
  componentStatuses: Readonly<
    Record<VNextEvidenceComponentId, VNextEvidenceStatus>
  >;
  blockers: readonly string[];
  rationale: string;
  migrationNotes: readonly string[];
  evidenceCardVersion: string;
  implementationIds: readonly string[];
  decisionIds: readonly string[];
  decidedAt: string;
}
