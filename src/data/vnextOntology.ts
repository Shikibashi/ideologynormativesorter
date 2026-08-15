import {
  CONTEXT_LABEL_IDS,
  MODIFIER_LABEL_IDS,
  PRIMARY_LABEL_IDS,
  RETIRED_LABEL_IDS,
  SPECIALIST_LABEL_IDS,
  labelTaxonomyById,
  primaryScoringLabels,
  specialistModuleByLabel,
} from "./labelTaxonomy";
import { labels } from "./labels";
import { modifierMeasurementDefinitions } from "./modifierMeasurement";
import { specialistModuleDefinitions } from "../specialist";
import { vnextConstructRegistry } from "./vnextConstructs";
import { vnextItemAnnotations } from "./vnextItemAnnotations";
import type {
  VNextConceptualKind,
  VNextConceptualStatus,
  VNextEvidenceRequirements,
  VNextOntologyNode,
  VNextOntologyRegistry,
  VNextPublicRole,
  VNextPublicRoleView,
} from "../types";
import {
  VNEXT_GRAPH_VERSION,
  VNEXT_ONTOLOGY_VERSION,
} from "../validation/vnextVersions";

/**
 * Authoritative vNext conceptual metadata. The v13 roster is used only to
 * enumerate compatibility IDs; it is not used as the vNext role or graph.
 */
const PRIMARY_KINDS: Readonly<Record<string, VNextConceptualKind>> = {
  conservative: "family-anchor",
  "christian-democrat": "bridge-tradition",
  "classical-liberalism": "broad-tradition",
  "democratic-socialist": "compound-tradition",
  "green-politics": "family-anchor",
  "liberal-conservatism": "bridge-tradition",
  "libertarian-socialism": "family-anchor",
  "market-liberal": "broad-tradition",
  "market-right-libertarianism": "family-anchor",
  "marxian-socialism": "family-anchor",
  "marxist-leninist": "compound-tradition",
  "national-conservatism": "compound-tradition",
  "radical-democracy": "broad-tradition",
  republicanism: "broad-tradition",
  "social-democrat": "broad-tradition",
  "social-liberalism": "broad-tradition",
};

const REGIONAL_OR_HISTORICAL = new Set([
  "arab-socialism",
  "black-nationalism",
  "confucian-political-revival",
  "developmentalism",
  "hindutva",
  "indigenism",
  "islamic-democracy",
  "juche",
  "kemalism",
  "national-bolshevism",
  "pan-africanism",
  "pan-arabism",
  "political-islam",
  "religious-nationalism",
  "zionism",
]);
const INSTITUTIONAL_PROJECTS = new Set([
  "democratic-confederalism",
  "libertarian-municipalism",
  "constitutional-monarchism",
  "liquid-democracy",
  "panarchism",
  "platformism",
  "world-federalism",
]);
const REGIME_PROJECTS = new Set([
  "christian-reconstructionism",
  "developmental-authoritarianism",
  "eco-authoritarianism",
  "eco-fascism",
  "fascist-authoritarian",
  "fundamentalist-theocracy",
  "integralism",
  "national-socialism",
  "neoreactionary",
  "strasserism",
  "theocrat",
]);
const INTELLECTUAL_CURRENTS = new Set([
  "fourth-theory",
  "neoliberalism",
  "objectivism",
  "ordoliberalism",
  "stirnerism",
  "techno-anarchism",
  "technocratic-centralist",
  "voluntaryism",
]);
const STRATEGY_OR_PROGRAMS = new Set([
  "distributism",
  "geolibertarian",
  "georgism",
  "participism",
  "third-way",
  "universal-basic-income",
]);
const COMPOUND_OR_BRIDGES = new Set([
  "anarcha-feminism",
  "anarcho-capitalist",
  "arab-socialism",
  "bleeding-heart-libertarianism",
  "black-feminism",
  "christian-socialism",
  "eco-fascism",
  "ecosocialist",
  "left-wing-market-anarchism",
  "market-socialist",
  "queer-anarchism",
  "queer-politics",
  "religious-nationalism",
  "socialist-feminism",
  "welfare-chauvinism",
]);
const CONTEXT_KINDS: Readonly<Record<string, VNextConceptualKind>> = {
  accelerationism: "speculative-technological-current",
  "asian-values": "discourse-frame",
  baathism: "regional-historical-variant",
  "constitutional-monarchism": "institutional-project",
  corporatism: "governance-model",
  cyberocracy: "governance-model",
  dataism: "speculative-technological-current",
  "developmental-authoritarianism": "regime-or-authoritarian-project",
  "fourth-theory": "intellectual-current",
  "fundamentalist-theocracy": "regime-or-authoritarian-project",
  "liquid-democracy": "institutional-project",
  "radical-centrism": "discourse-frame",
  singularitarianism: "speculative-technological-current",
  "social-investment-state": "governance-model",
  platformism: "institutional-project",
  panarchism: "governance-model",
  "universal-basic-income": "policy-proposal",
  "utopian-socialism": "historical-reference",
  "world-federalism": "institutional-project",
};
const CONTEXT_ROOTS: Readonly<Record<string, string>> = {
  accelerationism: "reform-vs-revolution",
  "asian-values": "political-community-boundary",
  baathism: "political-community-boundary",
  corporatism: "state-capacity-confidence",
  cyberocracy: "centralization-preference",
  dataism: "expert-confidence",
  "radical-centrism": "democratic-confidence",
  singularitarianism: "expert-confidence",
  "social-investment-state": "redistribution-vs-predistribution",
  "utopian-socialism": "property-legitimacy",
};
const HIGH_RISK_IDS = new Set([
  "christian-reconstructionism",
  "eco-authoritarianism",
  "eco-fascism",
  "fascist-authoritarian",
  "fundamentalist-theocracy",
  "integralism",
  "national-socialism",
  "neoreactionary",
  "religious-nationalism",
  "strasserism",
  "theocrat",
]);

function roleSeedFor(id: string): VNextPublicRole {
  if (PRIMARY_LABEL_IDS.includes(id as (typeof PRIMARY_LABEL_IDS)[number]))
    return "primary";
  if (
    SPECIALIST_LABEL_IDS.includes(id as (typeof SPECIALIST_LABEL_IDS)[number])
  )
    return "specialist";
  if (MODIFIER_LABEL_IDS.includes(id as (typeof MODIFIER_LABEL_IDS)[number]))
    return "modifier";
  if (CONTEXT_LABEL_IDS.includes(id as (typeof CONTEXT_LABEL_IDS)[number]))
    return "context";
  if (RETIRED_LABEL_IDS.includes(id as (typeof RETIRED_LABEL_IDS)[number]))
    return "retired";
  throw new Error(`Unknown vNext ontology roster ID ${id}`);
}

function conceptualKindFor(
  id: string,
  role: VNextPublicRole,
): VNextConceptualKind {
  if (PRIMARY_KINDS[id]) return PRIMARY_KINDS[id];
  if (role === "modifier") return "cross-cutting-orientation";
  if (role === "context") return CONTEXT_KINDS[id] ?? "intellectual-current";
  if (role === "retired") return "hybrid-configuration";
  if (REGIONAL_OR_HISTORICAL.has(id)) return "regional-historical-variant";
  if (INSTITUTIONAL_PROJECTS.has(id)) return "institutional-project";
  if (REGIME_PROJECTS.has(id)) return "regime-or-authoritarian-project";
  if (INTELLECTUAL_CURRENTS.has(id)) return "intellectual-current";
  if (STRATEGY_OR_PROGRAMS.has(id)) return "strategy-or-program";
  if (COMPOUND_OR_BRIDGES.has(id)) return "compound-tradition";
  return "subtype-tradition";
}

function secondaryKindsFor(
  kind: VNextConceptualKind,
  role: VNextPublicRole,
): VNextConceptualKind[] {
  if (role === "modifier") return ["cross-cutting-orientation"];
  if (kind === "compound-tradition" || kind === "bridge-tradition")
    return ["subtype-tradition", "hybrid-configuration"];
  if (kind === "family-anchor") return ["broad-tradition"];
  if (kind === "institutional-project") return ["governance-model"];
  return [];
}

function conceptualStatusFor(role: VNextPublicRole): VNextConceptualStatus {
  if (role === "retired") return "retired";
  if (role === "context") return "proposed";
  return "compatibility";
}

function measurementStatusFor(
  id: string,
  role: VNextPublicRole,
): VNextOntologyNode["vNextMeasurementStatus"] {
  if (role === "retired") return "retired-alias";
  if (role === "primary") return "compatibility-scored-unvalidated";
  if (role === "specialist")
    return specialistModuleByLabel[id] ? "experimental" : "catalog-only";
  if (role === "modifier") {
    const direct = modifierMeasurementDefinitions.some(
      (definition) =>
        definition.labelId === id && Boolean(definition.indicators?.length),
    );
    return direct ? "experimental" : "catalog-only";
  }
  return "catalog-only";
}

function rootIdsFor(id: string, role: VNextPublicRole): string[] {
  const primary = primaryScoringLabels.find((label) => label.id === id);
  if (primary?.scoringScope?.axisIds.length)
    return [...primary.scoringScope.axisIds];
  const moduleId = specialistModuleByLabel[id];
  const itemRoots = vnextItemAnnotations
    .filter(
      (annotation) =>
        annotation.moduleId === moduleId ||
        annotation.localConstructIds.includes(id),
    )
    .flatMap((annotation) => annotation.intendedRootIds);
  if (itemRoots.length) return [...new Set(itemRoots)];
  const modifier = modifierMeasurementDefinitions.find(
    (definition) => definition.labelId === id,
  );
  if (modifier) {
    return [
      ...new Set(
        vnextItemAnnotations
          .filter((annotation) =>
            modifier.indicators?.some(
              (indicator) => indicator.questionId === annotation.itemId,
            ),
          )
          .flatMap((annotation) => annotation.intendedRootIds),
      ),
    ];
  }
  if (role === "context") return [CONTEXT_ROOTS[id] ?? "authority-legitimacy"];
  const aliasOf = labelTaxonomyById.get(id)?.aliasOf;
  if (aliasOf) return rootIdsFor(aliasOf, "primary");
  return ["authority-legitimacy"];
}

function facetIdsFor(id: string, rootIds: readonly string[]): string[] {
  const scoped = vnextItemAnnotations
    .filter(
      (annotation) =>
        annotation.moduleId === specialistModuleByLabel[id] ||
        annotation.localConstructIds.includes(id),
    )
    .flatMap((annotation) => annotation.facetIds);
  const rootFacets = rootIds.flatMap(
    (rootId) =>
      vnextConstructRegistry.roots.find((root) => root.id === rootId)
        ?.facetIds ?? [],
  );
  const facets = [...new Set([...scoped, ...rootFacets])];
  return facets.length ? facets : [vnextConstructRegistry.facets[0]!.id];
}

function evidenceRequirementsFor(
  role: VNextPublicRole,
  rootIds: readonly string[],
  facetIds: readonly string[],
  moduleId: string | undefined,
): VNextEvidenceRequirements {
  const gated = role !== "context" && role !== "retired";
  return {
    requiredConstructIds: gated ? [...rootIds] : [],
    requiredFacetIds: gated ? [...facetIds] : [],
    requiredEvidenceComponents: gated
      ? [
          "contentValidity",
          "responseProcess",
          "internalStructure",
          "separability",
          "incrementalValidity",
          "calibration",
          "temporalStability",
          "fairness",
          "robustness",
        ]
      : [],
    prerequisiteModuleIds: moduleId ? [moduleId] : [],
    minimumEvidenceState: !gated
      ? "none"
      : role === "primary"
        ? "respondent-supported"
        : "content-ready",
    abstentionRule: gated
      ? "Abstain when a required construct, facet, or scoped evidence component is absent."
      : "Never enter ordinary scoring.",
  };
}

function publicRoleViewFor(
  id: string,
  role: VNextPublicRole,
  kind: VNextConceptualKind,
  status: VNextConceptualStatus,
  moduleId: string | undefined,
): VNextPublicRoleView {
  const ordinarySurface =
    role === "primary"
      ? "core"
      : role === "specialist"
        ? "specialist"
        : role === "modifier"
          ? "modifier"
          : role === "context"
            ? "context"
            : "none";
  return {
    eligibleRoles: [role],
    defaultRole: role,
    ordinarySurface,
    ...(moduleId ? { moduleId } : {}),
    activationState:
      status === "retired"
        ? "retired"
        : role === "context"
          ? "research-only"
          : "compatibility",
    derivationInputs: [
      `conceptual-kind:${kind}`,
      `conceptual-status:${status}`,
      `module:${moduleId ?? "none"}`,
      `role-policy-roster:${id}`,
    ],
  };
}

function buildNode(id: string): VNextOntologyNode {
  const label = labels.find((candidate) => candidate.id === id);
  const taxonomy = labelTaxonomyById.get(id);
  if (!label || !taxonomy)
    throw new Error(`Missing canonical source record for ${id}`);
  const role = roleSeedFor(id);
  const kind = conceptualKindFor(id, role);
  const status = conceptualStatusFor(role);
  const rootIds = rootIdsFor(id, role);
  const facetIds = facetIdsFor(id, rootIds);
  const moduleId = specialistModuleByLabel[id];
  const aliases = [
    ...new Set([
      ...(label.aliases ?? []),
      ...(taxonomy.aliasOf ? [taxonomy.aliasOf] : []),
    ]),
  ];
  const nonConstitutiveFacetIds = rootIds.flatMap((rootId) => {
    const neighbor = vnextConstructRegistry.roots.find(
      (root) => root.id === rootId,
    )?.neighboringRootIds[0];
    return neighbor
      ? (vnextConstructRegistry.roots
          .find((root) => root.id === neighbor)
          ?.facetIds.slice(0, 1) ?? [])
      : [];
  });
  return {
    id,
    canonicalName: label.name,
    alternateNames: aliases,
    aliases,
    conceptualKind: kind,
    secondaryKinds: secondaryKindsFor(kind, role),
    conceptualStatus: status,
    constitutiveFacetIds: facetIds.slice(
      0,
      Math.max(1, Math.min(2, facetIds.length)),
    ),
    associatedFacetIds: facetIds.slice(2),
    nonConstitutiveFacetIds,
    layerRelevance: [
      ...new Set(
        rootIds.flatMap((rootId) => {
          const layer = vnextConstructRegistry.roots.find(
            (root) => root.id === rootId,
          )?.layer;
          return layer ? [layer] : [];
        }),
      ),
    ],
    historicalScope:
      "Canonical vNext catalog scope is limited to the cited source records and declared compatibility roster.",
    geographicScope:
      "Geographic and historical generalization remains source-scoped and is not inferred from the label name.",
    canonicalDefinition: label.description,
    boundaryStatement: taxonomy.rationale,
    sourceRecordIds: [
      ...new Set([
        ...(label.sources ?? []).map((source) => source.sourceId),
        "vnext-integrated-system-specification-2026-08",
        "vnext-taxonomy-measurement-architecture-review-2026-08",
      ]),
    ],
    version: VNEXT_ONTOLOGY_VERSION,
    evidenceRequirements: evidenceRequirementsFor(
      role,
      rootIds,
      facetIds,
      moduleId,
    ),
    publicRoleView: publicRoleViewFor(id, role, kind, status, moduleId),
    // Compatibility metadata is retained solely for decoding old v13 records.
    compatibility: {
      role,
      measurementStatus: taxonomy.measurementStatus,
      ...(taxonomy.parentId ? { parentId: taxonomy.parentId } : {}),
      ...(taxonomy.aliasOf ? { aliasOf: taxonomy.aliasOf } : {}),
      relations: taxonomy.relations,
    },
    vNextMeasurementStatus: measurementStatusFor(id, role),
    highRisk: HIGH_RISK_IDS.has(id),
    ...(moduleId ? { currentModuleId: moduleId } : {}),
  };
}

const ALL_IDS = [
  ...PRIMARY_LABEL_IDS,
  ...SPECIALIST_LABEL_IDS,
  ...MODIFIER_LABEL_IDS,
  ...CONTEXT_LABEL_IDS,
  ...RETIRED_LABEL_IDS,
];
export const vnextOntologyNodes: readonly VNextOntologyNode[] =
  ALL_IDS.map(buildNode);
export const vnextOntologyById = new Map(
  vnextOntologyNodes.map((node) => [node.id, node]),
);
export const vnextOntologyRegistry: VNextOntologyRegistry = {
  ontologyVersion: VNEXT_ONTOLOGY_VERSION,
  graphVersion: VNEXT_GRAPH_VERSION,
  nodes: vnextOntologyNodes,
};
export const vnextAuthoritativeRoleById = new Map(
  vnextOntologyNodes.map((node) => [node.id, node.publicRoleView.defaultRole]),
);
export const vnextKnownModuleIds = new Set(
  specialistModuleDefinitions.map((module) => module.id),
);
