import type {
  ConstructId,
  DomainId,
  ItemId,
  ModifierId,
  OntologyNodeId,
  OntologyRelationId,
  ProfileId,
  SpecialistCandidateId,
  SpecialistId,
  SpecialistModuleId,
  StatementOptionId,
} from "./ids";
import type {
  ContentFingerprint,
  ContentSchemaVersion,
  ContentVersion,
  ResearchSchemaVersion,
  ResponseSchemaVersion,
  ResultSchemaVersion,
  ScoringVersion,
} from "./versions";
import type { ConstitutiveGate } from "./scoring";

export const ITEM_RESPONSE_TYPES = [
  "likert5",
  "likert7",
  "statement-choice",
] as const;
export type ItemResponseType = (typeof ITEM_RESPONSE_TYPES)[number];

export const CONSTRUCT_ROLES = [
  "normative",
  "descriptive",
  "prescriptive",
  "specialist",
] as const;
export type ConstructRole = (typeof CONSTRUCT_ROLES)[number];

export const CONSTRUCT_SCOPES = ["root", "specialist"] as const;
export type ConstructScope = (typeof CONSTRUCT_SCOPES)[number];

export const ITEM_ROLES = ["core", "specialist"] as const;
export type ItemRole = (typeof ITEM_ROLES)[number];

export const ITEM_LAYERS = [
  "normative",
  "descriptive",
  "prescriptive",
] as const;
export type ItemLayer = (typeof ITEM_LAYERS)[number];

export const ITEM_TIERS = ["blitz", "quick", "moderate", "extensive"] as const;
export type ItemTier = (typeof ITEM_TIERS)[number];

export const ITEM_STATUSES = ["active", "inactive"] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export interface DisplayMetadata {
  shortLabel?: string;
  longLabel?: string;
}

export interface DomainRecord {
  id: DomainId;
  label: string;
  description?: string;
  poles?: {
    negative?: string;
    positive?: string;
  };
  display?: DisplayMetadata;
  provenanceRefs?: string[];
}

export interface ConstructRecord {
  id: ConstructId;
  name: string;
  role: ConstructRole;
  scope: ConstructScope;
  domainId?: DomainId;
  moduleId?: SpecialistModuleId;
  family?: string;
  description?: string;
  poles?: { negative: string; positive: string };
  boundaryStatement?: string;
  sourceKey?: string;
  lifecycle?: {
    conceptualStatus?: string;
    measurementStatus?: string;
    publicRoleStatus?: string;
  };
  display?: DisplayMetadata;
  provenanceRefs?: string[];
}

export interface ScoringContribution {
  constructId: ConstructId;
  /** Absolute coefficient magnitude. Sign is explicit in polarity. */
  weight: number;
  polarity: -1 | 1;
}

export interface ItemScoring {
  /** Option-only statement-choice records intentionally have no item-level mapping. */
  mappingMode: "item" | "options";
  contributions: ScoringContribution[];
}

interface BaseItem {
  id: ItemId;
  domainId: DomainId;
  prompt: string;
  responseType: ItemResponseType;
  scoring: ItemScoring;
  role: ItemRole;
  layer: ItemLayer;
  tier: ItemTier;
  status: ItemStatus;
  moduleId?: SpecialistModuleId;
  reverseScored: boolean;
  allowDontKnow?: boolean;
  confidencePrompt?: string;
  priorityPrompt?: string;
  contextNote?: string;
  evidenceNote?: string;
  reviewStatus?: string;
  version?: string;
  sourceKey?: string;
  provenanceRefs?: string[];
  display?: DisplayMetadata;
}

export interface Likert5Item extends BaseItem {
  responseType: "likert5";
  scaleMin: -2;
  scaleMax: 2;
  scaleStep: 1;
}

export interface Likert7Item extends BaseItem {
  responseType: "likert7";
  scaleMin: -3;
  scaleMax: 3;
  scaleStep: 1;
}

export interface StatementChoiceOption {
  id: StatementOptionId;
  text: string;
  contributions: ScoringContribution[];
}

export interface StatementChoiceItem extends BaseItem {
  responseType: "statement-choice";
  options: StatementChoiceOption[];
}

export type ItemRecord = Likert5Item | Likert7Item | StatementChoiceItem;

export interface ConstructRequirement {
  constructId: ConstructId;
  targetValue: number;
  weight: number;
  minimumAnsweredItems?: number;
}

export const COMMITMENT_RELATIONS = [
  "constitutive",
  "core",
  "characteristic",
  "contested",
  "compatible",
  "peripheral",
  "incompatible",
] as const;
export type CommitmentRelation = (typeof COMMITMENT_RELATIONS)[number];

export type CommitmentCriterion =
  | { operator: "minimum"; minimum: number }
  | { operator: "maximum"; maximum: number }
  | { operator: "interval"; minimum: number; maximum: number };

export interface SpecialistCommitmentRecord {
  id: string;
  constructId: ConstructId;
  relation: CommitmentRelation;
  criterion?: CommitmentCriterion;
  weight?: number;
  minimumAnsweredItems?: number;
  rationale: string;
}

export interface BaseProfileRecord {
  id: ProfileId;
  name: string;
  role: "primary" | "modifier" | "specialist";
  requirements?: ConstructRequirement[];
  gates: ConstitutiveGate[];
  minimumEvidenceRatio?: number;
  status?: string;
  version?: string;
  targetNodeId?: OntologyNodeId;
  rationale?: string;
  provenanceRefs?: string[];
}

export interface PrimaryProfileRecord extends BaseProfileRecord {
  role: "primary";
}

export interface ModifierIndicator {
  itemId: ItemId;
  direction: -1 | 1;
  weight: number;
  targetValue?: number;
  rationale?: string;
  minimumEvidenceWeight?: number;
}

export interface ModifierProfileRecord extends BaseProfileRecord {
  role: "modifier";
  modifierId: ModifierId;
  availability: "core-construct" | "focused-follow-up" | "catalog-only";
  constructName: string;
  note: string;
  indicators: ModifierIndicator[];
  minimumAnsweredItems?: number;
  /** Minimum continuous fit required for an ordinarily active modifier match. */
  fitThreshold?: number;
}

export interface SpecialistActivationCriteria {
  minimumAnsweredItems?: number;
  minimumItemWeight?: number;
  requiredConstructCount?: number;
}

/** Module activation is explicit input, with its evidence policy versioned in content. */
export interface SpecialistModuleActivationPolicy {
  strategy: "explicit-request";
  minimumAnsweredItems: number;
  minimumAnsweredWeightRatio: number;
  minimumConstructCoverageRatio: number;
}

export interface SpecialistVariantRecord {
  id: string;
  sourceKey: string;
  name: string;
  description: string;
  variant?: string;
  status: string;
  commitments: SpecialistCommitmentRecord[];
  gates: ConstitutiveGate[];
  provenanceRefs?: string[];
}

export interface SpecialistProfileRecord extends BaseProfileRecord {
  role: "specialist";
  specialistId: SpecialistId;
  itemIds: ItemId[];
  activation: SpecialistActivationCriteria;
  outputType: "primary" | "diagnostic";
  moduleId?: SpecialistModuleId;
  commitments?: SpecialistCommitmentRecord[];
  variants?: SpecialistVariantRecord[];
}

export type ProfileRecord =
  | PrimaryProfileRecord
  | ModifierProfileRecord
  | SpecialistProfileRecord;

export interface SpecialistCandidateRecord {
  id: SpecialistCandidateId;
  sourceKey: string;
  nodeId?: OntologyNodeId;
  moduleId: SpecialistModuleId;
  name: string;
  description: string;
  status: string;
  variant?: string;
  commitments: SpecialistCommitmentRecord[];
  gates: ConstitutiveGate[];
  provenanceRefs?: string[];
}

export interface SpecialistModuleRecord {
  id: SpecialistModuleId;
  version: string;
  title: string;
  shortTitle: string;
  description: string;
  invitationNote: string;
  estimatedMinutes: number;
  activation: SpecialistModuleActivationPolicy;
  itemIds: ItemId[];
  constructIds: ConstructId[];
  candidateIds: SpecialistCandidateId[];
  outputProfileIds: ProfileId[];
  provenanceRefs?: string[];
}

export interface SpecialistAssignmentConfig {
  strategy: string;
  rosterVersion: string;
  orderedModuleIds: SpecialistModuleId[];
}

export const ONTOLOGY_RELATION_TYPES = [
  "supports",
  "contradicts",
  "related",
  "subtypeOf",
  "contextOf",
  "overlaps_with",
  "contrasts_with",
  "often_combines_with",
  "hybrid_of",
  "influenced_by",
  "subtype_of",
  "context_for",
  "requires",
  "regional_variant_of",
  "incompatible_with_core",
  "alias_of",
  "not_equivalent_to",
  "family_member_of",
] as const;
export type OntologyRelationType = (typeof ONTOLOGY_RELATION_TYPES)[number];

export interface OntologyNodeRecord {
  id: OntologyNodeId;
  label: string;
  domainId?: DomainId;
  nodeScope?:
    | "primary"
    | "specialist"
    | "modifier"
    | "context"
    | "retired"
    | "internal";
  parentId?: OntologyNodeId;
  canonicalDefinition?: string;
  boundaryStatement?: string;
  aliases?: string[];
  family?: string;
  subfamily?: string;
  legacyDisposition?: string;
  conceptualStatus?: string;
  measurementStatus?: string;
  publicRoleStatus?: string;
  weight?: number;
  metadata?: Record<string, unknown>;
  provenanceRefs?: string[];
}

export interface OntologyRelationRecord {
  id: OntologyRelationId;
  sourceNodeId: OntologyNodeId;
  targetNodeId: OntologyNodeId;
  relationType: OntologyRelationType;
  evidence?: number;
  note?: string;
  provenanceRefs?: string[];
}

export const DIAGNOSTIC_RELATION_TYPES = ["cross_dimension_pair"] as const;
export type DiagnosticRelationType = (typeof DIAGNOSTIC_RELATION_TYPES)[number];

export interface DiagnosticRelationRecord {
  id: string;
  type: DiagnosticRelationType;
  constructIds: [ConstructId, ConstructId];
  dimensionPair: "normative-descriptive" | "normative-prescriptive" | "descriptive-prescriptive";
  secondDirection: -1 | 1;
  provenanceRefs?: string[];
}

export interface ProvenanceSourceRecord {
  id: string;
  kind: "authority" | "citation" | "decision" | "artifact" | "archive";
  title: string;
  location: string;
  url?: string;
  publisher?: string;
  recordId?: string;
  note?: string;
}

export interface CanonicalContentMetadata {
  contentSchemaVersion: ContentSchemaVersion;
  contentVersion: ContentVersion;
  contentFingerprint: ContentFingerprint;
  scoringVersion: ScoringVersion;
  resultSchemaVersion: ResultSchemaVersion;
  responseSchemaVersion: ResponseSchemaVersion;
  researchSchemaVersion: ResearchSchemaVersion;
  sourceCommit?: string;
  methodologyCommit?: string;
  extractionVersion?: string;
  sourceArtifact?: string;
  counts?: Record<string, number>;
}

export interface CanonicalContentBundle {
  metadata: CanonicalContentMetadata;
  domains: DomainRecord[];
  constructs: ConstructRecord[];
  items: ItemRecord[];
  profiles: PrimaryProfileRecord[];
  modifiers: ModifierProfileRecord[];
  specialists: SpecialistProfileRecord[];
  specialistModules: SpecialistModuleRecord[];
  specialistCandidates: SpecialistCandidateRecord[];
  specialistAssignment: SpecialistAssignmentConfig;
  ontologyNodes: OntologyNodeRecord[];
  ontologyRelations: OntologyRelationRecord[];
  diagnosticRelations?: DiagnosticRelationRecord[];
  provenanceSources: ProvenanceSourceRecord[];
}
