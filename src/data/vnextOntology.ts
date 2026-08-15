import {
  CONTEXT_LABEL_IDS,
  MODIFIER_LABEL_IDS,
  PRIMARY_LABEL_IDS,
  RETIRED_LABEL_IDS,
  SPECIALIST_LABEL_IDS,
  labelTaxonomyById,
  specialistModuleByLabel,
} from "./labelTaxonomy";
import { labels } from "./labels";
import type {
  VNextConceptualKind,
  VNextMeasurementStatus,
  VNextOntologyNode,
  VNextOntologyRegistry,
  VNextPublicRole,
} from "../types";
import {
  VNEXT_GRAPH_VERSION,
  VNEXT_ONTOLOGY_VERSION,
} from "../validation/vnextVersions";

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

function roleFor(id: string): VNextPublicRole {
  if (PRIMARY_LABEL_IDS.includes(id as (typeof PRIMARY_LABEL_IDS)[number])) {
    return "primary";
  }
  if (
    SPECIALIST_LABEL_IDS.includes(id as (typeof SPECIALIST_LABEL_IDS)[number])
  ) {
    return "specialist";
  }
  if (MODIFIER_LABEL_IDS.includes(id as (typeof MODIFIER_LABEL_IDS)[number])) {
    return "modifier";
  }
  if (CONTEXT_LABEL_IDS.includes(id as (typeof CONTEXT_LABEL_IDS)[number])) {
    return "context";
  }
  if (RETIRED_LABEL_IDS.includes(id as (typeof RETIRED_LABEL_IDS)[number])) {
    return "retired";
  }
  throw new Error(`Unknown v13 label role for ${id}`);
}

function measurementStatusFor(
  id: string,
  role: VNextPublicRole,
): VNextMeasurementStatus {
  if (role === "retired") return "retired-alias";
  if (role === "primary") return "compatibility-scored-unvalidated";
  if (role === "specialist") {
    return specialistModuleByLabel[id] ? "experimental" : "catalog-only";
  }
  if (role === "modifier") {
    const status = labelTaxonomyById.get(id)?.measurementStatus;
    if (status === "modifier-scored" || status === "modifier-follow-up") {
      return "experimental";
    }
    return "catalog-only";
  }
  return "catalog-only";
}

function buildNode(id: string): VNextOntologyNode {
  const label = labels.find((candidate) => candidate.id === id);
  const taxonomy = labelTaxonomyById.get(id);
  if (!label || !taxonomy)
    throw new Error(`Missing v13 label record for ${id}`);
  const role = roleFor(id);
  return {
    id,
    canonicalName: label.name,
    alternateNames: [
      ...(label.aliases ?? []),
      ...(taxonomy.aliasOf ? [taxonomy.aliasOf] : []),
    ],
    conceptualKind: conceptualKindFor(id, role),
    constitutiveFacetIds: [],
    associatedFacetIds: [],
    nonConstitutiveFacetIds: [],
    layerRelevance: ["normative", "descriptive", "prescriptive"],
    historicalScope:
      "Current v13 catalog scope; exact historical boundaries remain source-scoped.",
    geographicScope:
      "Not generalized beyond the label's documented source and respondent scope.",
    canonicalDefinition: label.description,
    boundaryStatement: taxonomy.rationale,
    sourceRecordIds: (label.sources ?? []).map((source) => source.sourceId),
    compatibility: {
      role,
      measurementStatus: taxonomy.measurementStatus,
      ...(taxonomy.parentId ? { parentId: taxonomy.parentId } : {}),
      ...(taxonomy.aliasOf ? { aliasOf: taxonomy.aliasOf } : {}),
      relations: taxonomy.relations,
    },
    vNextMeasurementStatus: measurementStatusFor(id, role),
    highRisk:
      role === "retired" ||
      id.includes("fascist") ||
      id.includes("national-socialist") ||
      id.includes("ethno") ||
      id.includes("theocrat") ||
      id.includes("religious"),
    ...(specialistModuleByLabel[id]
      ? { currentModuleId: specialistModuleByLabel[id] }
      : {}),
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
