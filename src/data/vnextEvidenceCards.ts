import {
  CONTEXT_LABEL_IDS,
  RETIRED_LABEL_IDS,
  SPECIALIST_LABEL_IDS,
  labelTaxonomyById,
  primaryScoringLabels,
  specialistModuleByLabel,
} from "./labelTaxonomy";
import { labels } from "./labels";
import { specialistModuleDefinitions } from "../specialist";
import { vnextOntologyById } from "./vnextOntology";
import { CURRENT_RESEARCH_VERSION_BUNDLE } from "../validation/researchContracts";
import {
  VNEXT_EVIDENCE_CARD_VERSION,
  VNEXT_IMPLEMENTATION_DECISION_IDS,
  VNEXT_PROMOTION_RECORD_VERSION,
} from "../validation/vnextVersions";
import type {
  VNextEvidenceCard,
  VNextEvidenceComponent,
  VNextEvidenceComponentId,
  VNextPromotionRecord,
  VNextPromotionState,
} from "../types";
import { VNEXT_EVIDENCE_COMPONENT_IDS } from "../types";

const CARD_DATE = "2026-08-15";
const CONTEXT_LABEL_SET = new Set<string>(CONTEXT_LABEL_IDS);
const RETIRED_LABEL_SET = new Set<string>(RETIRED_LABEL_IDS);
const SPECIALIST_LABEL_SET = new Set<string>(SPECIALIST_LABEL_IDS);

function initialComponent(scope: readonly string[]): VNextEvidenceComponent {
  return {
    status: "not-started",
    estimand:
      "No respondent estimand has been authorized before preregistration.",
    hypothesis: "No respondent hypothesis is approved for this initial card.",
    method: "No respondent data collection or inferential method has been run.",
    itemOrConstructScope: scope,
    sampleScope: "No respondent sample attached.",
    comparisonSet: [],
    preregistered: false,
    confirmationOrExploration: "not-started",
    replicationStatus: "not-started",
    limitations: [
      "Synthetic, expert, source, or compatibility data cannot satisfy this respondent evidence component.",
      "The component must remain unresolved until its object-specific validation gate is run.",
    ],
    artifactLinks: [],
    reviewerDecision: "pending",
  };
}

function componentSet(scope: readonly string[]) {
  return Object.fromEntries(
    VNEXT_EVIDENCE_COMPONENT_IDS.map((id) => [id, initialComponent(scope)]),
  ) as Record<VNextEvidenceComponentId, VNextEvidenceComponent>;
}

function publicState(labelId: string): VNextPromotionState {
  if (CONTEXT_LABEL_SET.has(labelId) || RETIRED_LABEL_SET.has(labelId)) {
    return "catalog-context";
  }
  if (SPECIALIST_LABEL_SET.has(labelId)) {
    return specialistModuleByLabel[labelId]
      ? "experimental-display"
      : "catalog-context";
  }
  return "compatibility-scored-unvalidated";
}

function constructScope(labelId: string, role: string): string[] {
  if (role === "primary") {
    return [
      ...(primaryScoringLabels.find((label) => label.id === labelId)
        ?.scoringScope?.axisIds ?? []),
    ];
  }
  const moduleId = specialistModuleByLabel[labelId];
  const module = specialistModuleDefinitions.find(
    (candidate) => candidate.id === moduleId,
  );
  if (!module) return [];
  return [
    ...new Set(
      Object.values(module.constructWeightsByQuestionId).flatMap((weights) =>
        Object.keys(weights),
      ),
    ),
  ];
}

function createCard(labelId: string): VNextEvidenceCard {
  const label = labels.find((candidate) => candidate.id === labelId);
  const node = vnextOntologyById.get(labelId);
  const taxonomy = labelTaxonomyById.get(labelId);
  if (!label || !node || !taxonomy)
    throw new Error(`Cannot build evidence card for ${labelId}`);
  const scope = constructScope(labelId, taxonomy.role);
  const graphParentsAndRelations = [
    ...(node.compatibility.parentId
      ? [{ relation: "subtype_of", labelId: node.compatibility.parentId }]
      : []),
    ...node.compatibility.relations.map((relation) => ({
      relation: relation.type,
      labelId: relation.labelId,
      ...(relation.note ? { note: relation.note } : {}),
    })),
  ];
  const nearestNeighborIds = [
    ...new Set([
      ...graphParentsAndRelations.map((relation) => relation.labelId),
      ...(primaryScoringLabels.find((candidate) => candidate.id === labelId)
        ?.scoringScope?.sourceIds ?? []),
    ]),
  ].filter((id) => vnextOntologyById.has(id));
  const state = publicState(labelId);
  const claimTierCeiling = state === "catalog-context" ? "PC0" : "PC1";
  const versionBundle = {
    ...CURRENT_RESEARCH_VERSION_BUNDLE,
    vnextEvidenceCardVersion: VNEXT_EVIDENCE_CARD_VERSION,
  };
  return {
    cardId: `${taxonomy.role}:${labelId}:validation-v1`,
    cardVersion: VNEXT_EVIDENCE_CARD_VERSION,
    labelId,
    canonicalName: label.name,
    productRole: taxonomy.role,
    conceptualKind: node.conceptualKind,
    historicalScope: node.historicalScope,
    graphParentsAndRelations,
    publicMeasurementStatus: node.vNextMeasurementStatus,
    currentCompatibilityStatus: taxonomy.measurementStatus,
    constructScope: scope,
    constitutiveConstructIds: scope,
    optionalFacetIds: node.associatedFacetIds,
    nearestNeighborIds,
    m0ModifierOrFacetIds: [],
    ...(specialistModuleByLabel[labelId]
      ? { moduleId: specialistModuleByLabel[labelId] }
      : {}),
    formAndPopulationScope: {
      form: "current-v13-compatibility-scope; respondent validation not started",
      population: "not authorized",
      language: "not authorized",
      region: "not authorized",
      time: "not authorized",
    },
    evidence: componentSet(scope),
    preregistrationIds: [],
    analysisManifestIds: [],
    dataSplits: [],
    versionBundle,
    claimTierCeiling: claimTierCeiling as "PC0" | "PC1",
    publicDisplayState: state,
    promotionDecision: "not-started",
    decisionRationale:
      "This card is an additive research record. No missing respondent evidence is treated as a pass or as a promotion.",
    limitations: [
      "Compatibility status is not respondent validity.",
      "Current role and source-backed conceptual metadata do not authorize psychometric or identity claims.",
    ],
    openQuestions: [
      "Which respondent constructs and facets are understood and separable in the declared scope?",
      "What uncertainty, fairness, robustness, and criterion evidence supports any later promotion?",
    ],
    reviewers: [],
    replicationPlan: [
      "Define a preregistered confirmation or prospective replication wave before promotion.",
    ],
    provenance: [
      "docs/empirical-validation-architecture-2026-08.md",
      "docs/vnext-integrated-system-specification-2026-08.md",
      "I-007",
      ...VNEXT_IMPLEMENTATION_DECISION_IDS.filter((id) =>
        ["I-002", "I-003", "I-006"].includes(id),
      ),
    ],
    createdAt: CARD_DATE,
    updatedAt: CARD_DATE,
  };
}

const CARD_LABEL_IDS = [
  ...primaryScoringLabels.map((label) => label.id),
  ...SPECIALIST_LABEL_IDS,
];

export const vnextEvidenceCards: readonly VNextEvidenceCard[] =
  CARD_LABEL_IDS.map(createCard);
export const vnextEvidenceCardById = new Map(
  vnextEvidenceCards.map((card) => [card.labelId, card]),
);
export const vnextEvidenceCardByCardId = new Map(
  vnextEvidenceCards.map((card) => [card.cardId, card]),
);

export const vnextEvidenceCardByLegacyId = new Map<string, VNextEvidenceCard>(
  RETIRED_LABEL_IDS.flatMap((legacyId) => {
    const aliasOf = labelTaxonomyById.get(legacyId)?.aliasOf;
    const card = aliasOf ? vnextEvidenceCardById.get(aliasOf) : undefined;
    return card ? [[legacyId, card] as const] : [];
  }),
);

export const vnextPromotionRecords: readonly VNextPromotionRecord[] =
  vnextEvidenceCards.map((card) => ({
    recordId: `${card.cardId}:promotion-v1`,
    recordVersion: VNEXT_PROMOTION_RECORD_VERSION,
    cardId: card.cardId,
    labelId: card.labelId,
    priorState: card.publicDisplayState,
    decision: "not-started",
    claimTier: card.claimTierCeiling,
    scope: card.formAndPopulationScope,
    requiredEvidenceComponents: VNEXT_EVIDENCE_COMPONENT_IDS,
    componentStatuses: Object.fromEntries(
      VNEXT_EVIDENCE_COMPONENT_IDS.map((id) => [id, card.evidence[id].status]),
    ) as VNextPromotionRecord["componentStatuses"],
    blockers: [
      "Respondent evidence is not collected or validated.",
      "Promotion must remain label-specific and scope-specific.",
    ],
    rationale:
      "Initial additive record only; no promotion decision is authorized.",
    migrationNotes: [
      "Historical aliases decode to canonical cards and never create a second evidence record.",
    ],
    evidenceCardVersion: card.cardVersion,
    implementationIds: ["I-007"],
    decisionIds: ["D-112", "D-113", "D-114"],
    decidedAt: CARD_DATE,
  }));
