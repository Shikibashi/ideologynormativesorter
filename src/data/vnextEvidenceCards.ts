import { vnextGraphEdges } from "./vnextGraph";
import { vnextSurfaceManifestBySurface } from "./vnextSurfaceManifests";
import { vnextOntologyById, vnextOntologyNodes } from "./vnextOntology";
import { CURRENT_RESEARCH_VERSION_BUNDLE } from "../validation/researchContracts";
import {
  VNEXT_EVIDENCE_CARD_VERSION,
  VNEXT_IMPLEMENTATION_DECISION_IDS,
  VNEXT_PROMOTION_RECORD_VERSION,
  VNEXT_CONSTRUCTS_VERSION,
  VNEXT_FACET_MAP_VERSION,
  VNEXT_GRAPH_VERSION,
  VNEXT_ITEM_ANNOTATIONS_VERSION,
  VNEXT_ONTOLOGY_VERSION,
  VNEXT_ROLE_POLICY_VERSION,
  VNEXT_CHALLENGER_MODELS_VERSION,
  VNEXT_SHADOW_SCORING_VERSION,
  VNEXT_SURFACE_MANIFEST_VERSION,
  VNEXT_RELEASE_CANDIDATE_COMMIT,
  VNEXT_FROZEN_BASELINE_COMMIT,
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
const CONTEXT_LABEL_SET = new Set(
  vnextOntologyNodes
    .filter((node) => node.publicRoleView.defaultRole === "context")
    .map((node) => node.id),
);
const RETIRED_LABEL_SET = new Set(
  vnextOntologyNodes
    .filter((node) => node.publicRoleView.defaultRole === "retired")
    .map((node) => node.id),
);
const SPECIALIST_LABEL_SET = new Set(
  vnextOntologyNodes
    .filter((node) => node.publicRoleView.defaultRole === "specialist")
    .map((node) => node.id),
);

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
    return vnextOntologyById.get(labelId)?.currentModuleId
      ? "experimental-display"
      : "catalog-context";
  }
  return "compatibility-scored-unvalidated";
}

function constructScope(labelId: string): string[] {
  const node = vnextOntologyById.get(labelId);
  if (!node) return [];
  return [
    ...node.evidenceRequirements.requiredConstructIds,
    ...node.evidenceRequirements.requiredFacetIds,
    ...node.evidenceRequirements.prerequisiteModuleIds,
  ];
}

const COMPOUND_HOSTS: Readonly<Record<string, string>> = {
  "christian-democrat": "social-democrat",
  "democratic-socialist": "social-democrat",
  "national-conservatism": "conservative",
  "liberal-conservatism": "classical-liberalism",
  "marxist-leninist": "marxian-socialism",
  "anarcho-capitalist": "market-right-libertarianism",
  "anarcha-feminism": "social-anarchism",
  "bleeding-heart-libertarianism": "market-right-libertarianism",
  "christian-socialism": "social-democrat",
  ecosocialist: "green-politics",
  "left-wing-market-anarchism": "market-anarchism",
  "market-socialist": "social-democrat",
  "socialist-feminism": "feminist-orientation",
  "black-feminism": "feminist-orientation",
  "queer-politics": "feminist-orientation",
  "queer-anarchism": "social-anarchism",
  "welfare-chauvinism": "social-democrat",
  geolibertarian: "georgism",
  "religious-nationalism": "national-conservatism",
  "cultural-populism": "populism",
  "bright-green-environmentalism": "green-politics",
  "civil-libertarian-cosmopolitan": "civil-libertarianism",
  "decentralist-market-skeptic-of-state": "decentralist-orientation",
  "egalitarian-statist": "social-democrat",
  "national-traditionalist": "national-conservatism",
  "revolutionary-collectivist": "marxian-socialism",
};

function createCard(labelId: string): VNextEvidenceCard {
  const node = vnextOntologyById.get(labelId);
  if (!node) throw new Error(`Cannot build evidence card for ${labelId}`);
  const role = node.publicRoleView.defaultRole;
  const scope = constructScope(labelId);
  const graphParentsAndRelations = vnextGraphEdges
    .filter((edge) => edge.sourceId === labelId || edge.targetId === labelId)
    .map((edge) => ({
      relation: edge.type,
      labelId: edge.sourceId === labelId ? edge.targetId : edge.sourceId,
      direction:
        edge.sourceId === labelId
          ? ("outgoing" as const)
          : ("incoming" as const),
      ...(edge.note ? { note: edge.note } : {}),
    }));
  const nearestNeighborIds = [
    ...new Set([
      ...graphParentsAndRelations.map((relation) => relation.labelId),
    ]),
  ].filter((id) => vnextOntologyById.has(id));
  const state = publicState(labelId);
  const claimTierCeiling = state === "catalog-context" ? "PC0" : "PC1";
  const compound = [
    "compound-tradition",
    "bridge-tradition",
    "hybrid-configuration",
  ].includes(node.conceptualKind);
  const m0HostId = compound ? COMPOUND_HOSTS[labelId] : undefined;
  const m0ModifierOrFacetIds = compound
    ? [...node.constitutiveFacetIds, ...node.associatedFacetIds.slice(0, 2)]
    : [];
  const versionBundle = {
    ...CURRENT_RESEARCH_VERSION_BUNDLE,
    vnextEvidenceCardVersion: VNEXT_EVIDENCE_CARD_VERSION,
    vnextOntologyVersion: VNEXT_ONTOLOGY_VERSION,
    vnextGraphVersion: VNEXT_GRAPH_VERSION,
    vnextRolePolicyVersion: VNEXT_ROLE_POLICY_VERSION,
    vnextConstructsVersion: VNEXT_CONSTRUCTS_VERSION,
    vnextFacetMapVersion: VNEXT_FACET_MAP_VERSION,
    vnextItemAnnotationsVersion: VNEXT_ITEM_ANNOTATIONS_VERSION,
    vnextSurfaceManifestVersion: VNEXT_SURFACE_MANIFEST_VERSION,
    vnextChallengerModelsVersion: VNEXT_CHALLENGER_MODELS_VERSION,
    vnextShadowScoringVersion: VNEXT_SHADOW_SCORING_VERSION,
    codeRevision: VNEXT_RELEASE_CANDIDATE_COMMIT,
    frozenProductionBaselineRevision: VNEXT_FROZEN_BASELINE_COMMIT,
  };
  return {
    cardId: `${role}:${labelId}:validation-v1`,
    cardVersion: VNEXT_EVIDENCE_CARD_VERSION,
    labelId,
    canonicalName: node.canonicalName,
    productRole: role,
    conceptualKind: node.conceptualKind,
    historicalScope: node.historicalScope,
    graphParentsAndRelations,
    publicMeasurementStatus: node.vNextMeasurementStatus,
    currentCompatibilityStatus: node.compatibility.measurementStatus,
    constructScope: scope,
    constitutiveConstructIds: scope,
    optionalFacetIds: [...node.associatedFacetIds],
    nearestNeighborIds,
    ...(m0HostId ? { m0HostId } : {}),
    m0ModifierOrFacetIds,
    ...(m0HostId
      ? {
          m1ResidualHypothesis: `After controlling for ${m0HostId} and the declared facets ${m0ModifierOrFacetIds.join(", ") || "in scope"}, ${node.canonicalName} must show preregistered held-out incremental residual value before any promotion.`,
        }
      : {}),
    ...(node.currentModuleId ? { moduleId: node.currentModuleId } : {}),
    formAndPopulationScope: {
      form: "vNext surface manifest scope; respondent validation not started",
      population: "not authorized",
      language: "not authorized",
      region: "not authorized",
      time: "not authorized",
    },
    evidence: componentSet(scope),
    preregistrationIds: [],
    analysisManifestIds: [
      (role === "specialist"
        ? vnextSurfaceManifestBySurface.get("specialist")
        : vnextSurfaceManifestBySurface.get("core"))!.manifestId,
    ],
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

const CARD_LABEL_IDS = vnextOntologyNodes
  .filter((node) =>
    ["primary", "specialist"].includes(node.publicRoleView.defaultRole),
  )
  .map((node) => node.id);

export const vnextEvidenceCards: readonly VNextEvidenceCard[] =
  CARD_LABEL_IDS.map(createCard);
export const vnextEvidenceCardById = new Map(
  vnextEvidenceCards.map((card) => [card.labelId, card]),
);
export const vnextEvidenceCardByCardId = new Map(
  vnextEvidenceCards.map((card) => [card.cardId, card]),
);

export const vnextEvidenceCardByLegacyId = new Map<string, VNextEvidenceCard>(
  [...RETIRED_LABEL_SET].flatMap((legacyId) => {
    const aliasOf = vnextOntologyById.get(legacyId)?.compatibility.aliasOf;
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
