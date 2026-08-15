import type {
  VNextGraphAdjudicationRecord,
  VNextGraphEdge,
  VNextGraphRelationType,
  VNextGraphMigrationRecord,
  VNextRelationDirectionality,
  VNextRelationScope,
} from "../types";
import { vnextConstructRegistry } from "./vnextConstructs";
import { vnextOntologyNodes } from "./vnextOntology";
import { vnextGraphMigrationLedger } from "./vnextGraphMigration";
import { VNEXT_GRAPH_VERSION } from "../validation/vnextVersions";

type RelationSeed = {
  sourceId: string;
  targetId: string;
  type: VNextGraphRelationType;
  scope: VNextRelationScope;
  facetId: string;
  note: string;
  sourceRecordIds: readonly string[];
  decisionIds: readonly string[];
  semanticConstraints: readonly { code: string; statement: string }[];
};

function seed(
  sourceId: string,
  targetId: string,
  type: VNextGraphRelationType,
  scope: VNextRelationScope,
  facetId: string,
  note: string,
  constraint: string,
): RelationSeed {
  const adjudicationId = `vnext-graph-adjudication:${sourceId}:${type}:${targetId}`;
  return {
    sourceId,
    targetId,
    type,
    scope,
    facetId,
    note,
    sourceRecordIds: [
      adjudicationId,
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/vnext-specialist-architecture-review-2026-08.md:6",
    ],
    decisionIds: ["D-132"],
    semanticConstraints: [{ code: constraint, statement: note }],
  };
}

/**
 * The graph is authored as a vNext relation registry. Legacy v13 parent and
 * relation fields remain available on nodes for decoding only and are not
 * read when this graph is built.
 */
const AUTHORITATIVE_RELATIONS: readonly RelationSeed[] = [
  seed(
    "anarcho-communist",
    "social-anarchism",
    "subtype_of",
    "conceptual",
    "authority-legitimacy",
    "Anarcho-communism is a narrower communal tendency within social anarchism.",
    "subtype-acyclic",
  ),
  seed(
    "social-anarchism",
    "libertarian-socialism",
    "subtype_of",
    "conceptual",
    "property-legitimacy",
    "Social anarchism is a constitutive branch of libertarian socialism.",
    "subtype-acyclic",
  ),
  seed(
    "anarcho-communist",
    "individualist-anarchism",
    "family_member_of",
    "conceptual",
    "property-legitimacy",
    "The two are family members in the anarchist registry without subtype inheritance.",
    "family-membership-not-inheritance",
  ),
  seed(
    "national-conservatism",
    "conservative",
    "hybrid_of",
    "conceptual",
    "political-community-boundary",
    "National conservatism combines a conservative host with a distinct political-community morphology.",
    "hybrid-requires-distinct-facet",
  ),
  seed(
    "religious-nationalism",
    "national-conservatism",
    "hybrid_of",
    "conceptual",
    "political-community-boundary",
    "Religious nationalism is a compound configuration, not a synonym for national conservatism.",
    "hybrid-requires-distinct-facet",
  ),
  seed(
    "georgism",
    "market-liberal",
    "configures",
    "institutional",
    "property-legitimacy",
    "Georgist land-rent rules configure a market-liberal property program without becoming identical to it.",
    "configuration-not-equivalence",
  ),
  seed(
    "market-anarchism",
    "individualist-anarchism",
    "often_combines_with",
    "conceptual",
    "coordination-optimism",
    "The traditions frequently co-occur in the market-anarchist field but are not constitutively identical.",
    "symmetric-cooccurrence",
  ),
  seed(
    "market-anarchism",
    "left-wing-market-anarchism",
    "overlaps_with",
    "conceptual",
    "property-legitimacy",
    "The labels share a field while differing over privilege and distributive commitments.",
    "symmetric-overlap",
  ),
  seed(
    "anarcho-capitalist",
    "anarcho-communist",
    "contrasts_with",
    "conceptual",
    "property-legitimacy",
    "The edge marks a property and institutional boundary, not a score polarity or equivalence.",
    "symmetric-boundary",
  ),
  seed(
    "christian-democrat",
    "social-democrat",
    "requires",
    "conceptual",
    "authority-legitimacy",
    "The comparison requires an explicit account of social-market and democratic institutional commitments.",
    "required-interpretive-condition",
  ),
  seed(
    "arab-socialism",
    "marxian-socialism",
    "regional_variant_of",
    "historical",
    "political-community-boundary",
    "Arab socialism is a regionally bounded historical morphology with partially shared socialist roots.",
    "regional-retains-local-morphology",
  ),
  seed(
    "social-democrat",
    "marxian-socialism",
    "historical_predecessor_of",
    "historical",
    "reform-vs-revolution",
    "The historical relationship is recorded without making contemporary social democracy a subtype.",
    "historical-no-present-inheritance",
  ),
  seed(
    "marxist-leninist",
    "marxian-socialism",
    "influenced_by",
    "historical",
    "authority-legitimacy",
    "Marxism-Leninism is historically influenced by Marxian socialism without inheriting a single uniform program.",
    "influence-not-subtype",
  ),
  seed(
    "democratic-confederalism",
    "social-anarchism",
    "institutionalizes",
    "institutional",
    "centralization-preference",
    "Democratic confederalism gives institutional form to decentralist and anti-domination commitments.",
    "institutional-form-not-identity",
  ),
  seed(
    "asian-values",
    "national-conservatism",
    "context_for",
    "catalog",
    "political-community-boundary",
    "Asian-values is a discourse frame that can contextualize but does not parent national conservatism.",
    "context-not-parent",
  ),
  seed(
    "universal-basic-income",
    "social-democrat",
    "policy_expression_of",
    "measurement",
    "redistribution-vs-predistribution",
    "Universal basic income is a policy expression that can be compared with, but does not identify, a social-democratic configuration.",
    "policy-not-identity",
  ),
  seed(
    "conservative-liberalism",
    "liberal-conservatism",
    "alias_of",
    "catalog",
    "authority-legitimacy",
    "The retired label decodes to the canonical liberal-conservatism endpoint.",
    "alias-single-endpoint",
  ),
  seed(
    "dataism",
    "technocratic-centralist",
    "not_equivalent_to",
    "conceptual",
    "expert-confidence",
    "Dataism and technocratic centralism may share technological language but are not equivalent political objects.",
    "symmetric-non-equivalence",
  ),
  seed(
    "dataism",
    "technocratic-centralist",
    "incompatible_with_core",
    "measurement",
    "expert-confidence",
    "Neither object may enter ordinary core measurement without direct construct evidence and an approved scope.",
    "core-entry-requires-direct-evidence",
  ),
  seed(
    "anarcho-syndicalism",
    "social-anarchism",
    "subtype_of",
    "conceptual",
    "centralization-preference",
    "Anarcho-syndicalism is a strategic-organizational subtype of social anarchism.",
    "subtype-acyclic",
  ),
  seed(
    "minarchist",
    "market-right-libertarianism",
    "subtype_of",
    "conceptual",
    "authority-legitimacy",
    "Minarchism is a bounded state-minimum branch within the right-libertarian family.",
    "subtype-acyclic",
  ),
  seed(
    "hindutva",
    "religious-nationalism",
    "subtype_of",
    "historical",
    "political-community-boundary",
    "Hindutva is a regionally bounded civilizational-national expression with its own membership and public-law questions.",
    "subtype-acyclic",
  ),
  seed(
    "strasserism",
    "national-socialism",
    "subtype_of",
    "historical",
    "authority-legitimacy",
    "Strasserism is a historically situated fascist subtype and is not an ordinary socialist endpoint.",
    "subtype-acyclic",
  ),
  seed(
    "anarcha-feminism",
    "social-anarchism",
    "hybrid_of",
    "conceptual",
    "centralization-preference",
    "Anarcha-feminism joins anti-hierarchical anarchist analysis with a direct gender-power construct.",
    "hybrid-host-remains-interpretable",
  ),
  seed(
    "anarcha-feminism",
    "feminist-orientation",
    "hybrid_of",
    "conceptual",
    "equality.formal-status",
    "The feminist orientation is a distinct host relation, not an inferred synonym for anarchism.",
    "hybrid-host-remains-interpretable",
  ),
  seed(
    "anarcho-capitalist",
    "market-right-libertarianism",
    "hybrid_of",
    "conceptual",
    "property-legitimacy",
    "Anarcho-capitalism combines a right-libertarian host with a private-provision and stateless-order configuration.",
    "hybrid-host-remains-interpretable",
  ),
  seed(
    "bleeding-heart-libertarianism",
    "market-right-libertarianism",
    "hybrid_of",
    "conceptual",
    "equality.distribution",
    "Bleeding-heart libertarianism combines market liberty with a distinct disadvantage and meaningful-freedom concern.",
    "hybrid-host-remains-interpretable",
  ),
  seed(
    "social-anarchism",
    "green-politics",
    "often_combines_with",
    "conceptual",
    "ecology.intrinsic-standing",
    "Social-anarchist and green commitments can co-occur without either becoming constitutive of the other.",
    "symmetric-cooccurrence",
  ),
  seed(
    "pan-africanism",
    "internationalism",
    "often_combines_with",
    "conceptual",
    "political-community-boundary",
    "Pan-African solidarity often combines with cross-border international cooperation while retaining its own scale and history.",
    "symmetric-cooccurrence",
  ),
  seed(
    "black-nationalism",
    "pan-africanism",
    "overlaps_with",
    "conceptual",
    "political-community-boundary",
    "Black nationalism and Pan-Africanism share identity-sovereignty space but differ over community and transnational scale.",
    "symmetric-overlap",
  ),
  seed(
    "mutualist",
    "market-anarchism",
    "overlaps_with",
    "conceptual",
    "property-legitimacy",
    "Mutualism overlaps with market anarchism while retaining distinct reciprocity, possession, and mutual-credit commitments.",
    "symmetric-overlap",
  ),
  seed(
    "national-socialism",
    "marxist-leninist",
    "contrasts_with",
    "conceptual",
    "political-community-boundary",
    "The two sensitive regime projects require a named boundary around national-racial hierarchy versus class-party-state organization.",
    "symmetric-boundary",
  ),
  seed(
    "technocratic-centralist",
    "civil-libertarianism",
    "contrasts_with",
    "conceptual",
    "centralization-preference",
    "Centralized expert authority and civil-libertarian constraint are a boundary comparison, not opposing score poles.",
    "symmetric-boundary",
  ),
  seed(
    "utopian-socialism",
    "marxian-socialism",
    "historical_predecessor_of",
    "historical",
    "reform-vs-revolution",
    "Early socialist projects are retained as historical predecessors without collapsing their internal diversity into Marxian socialism.",
    "historical-no-present-inheritance",
  ),
  seed(
    "stirnerism",
    "individualist-anarchism",
    "influenced_by",
    "historical",
    "authority-legitimacy",
    "Stirnerian thought is a historical/intellectual influence relation, not a subtype shortcut.",
    "influence-not-subtype",
  ),
  seed(
    "libertarian-municipalism",
    "radical-democracy",
    "institutionalizes",
    "institutional",
    "centralization-preference",
    "Libertarian municipalism gives institutional form to direct and confederal democratic commitments.",
    "institutional-form-not-identity",
  ),
  seed(
    "democratic-confederalism",
    "radical-democracy",
    "institutionalizes",
    "institutional",
    "democratic-confidence",
    "Democratic confederalism is an institutional expression of participatory and distributed authority.",
    "institutional-form-not-identity",
  ),
  seed(
    "radical-centrism",
    "social-democrat",
    "context_for",
    "catalog",
    "reform-vs-revolution",
    "Radical centrism frames reform and anti-polarization debates without becoming a social-democratic endpoint.",
    "context-not-parent",
  ),
];

const SYMMETRIC_TYPES = new Set<VNextGraphRelationType>([
  "often_combines_with",
  "overlaps_with",
  "contrasts_with",
  "not_equivalent_to",
]);

const MIGRATION_SCOPE_BY_RELATION: Readonly<
  Record<VNextGraphRelationType, VNextRelationScope>
> = {
  subtype_of: "conceptual",
  family_member_of: "conceptual",
  hybrid_of: "conceptual",
  configures: "institutional",
  often_combines_with: "conceptual",
  overlaps_with: "conceptual",
  contrasts_with: "conceptual",
  requires: "measurement",
  regional_variant_of: "historical",
  historical_predecessor_of: "historical",
  influenced_by: "historical",
  institutionalizes: "institutional",
  context_for: "catalog",
  policy_expression_of: "measurement",
  alias_of: "catalog",
  not_equivalent_to: "conceptual",
  incompatible_with_core: "measurement",
};
const MIGRATION_CONSTRAINT_PREFIX: Readonly<
  Record<VNextGraphRelationType, string>
> = {
  subtype_of: "subtype-",
  family_member_of: "family-",
  hybrid_of: "hybrid-",
  configures: "configuration-",
  often_combines_with: "symmetric-",
  overlaps_with: "symmetric-",
  contrasts_with: "symmetric-",
  requires: "required-",
  regional_variant_of: "regional-",
  historical_predecessor_of: "historical-",
  influenced_by: "influence-",
  institutionalizes: "institutional-",
  context_for: "context-",
  policy_expression_of: "policy-",
  alias_of: "alias-",
  not_equivalent_to: "symmetric-",
  incompatible_with_core: "core-entry-",
};

function migrationSeed(record: VNextGraphMigrationRecord): RelationSeed {
  const type = record.oldRelation as VNextGraphRelationType;
  const source = vnextOntologyNodes.find(
    (node) => node.id === record.oldSourceId,
  );
  const facetId =
    source?.constitutiveFacetIds[0] ??
    source?.evidenceRequirements.requiredFacetIds[0] ??
    "authority.accountability";
  const note = record.rationale;
  return {
    sourceId: record.oldSourceId,
    targetId: record.oldTargetId,
    type,
    scope: MIGRATION_SCOPE_BY_RELATION[type],
    facetId,
    note,
    sourceRecordIds: [
      ...record.sourceRecordIds,
      `vnext-graph-adjudication:${record.oldSourceId}:${type}:${record.oldTargetId}`,
    ],
    decisionIds: [record.methodologicalDecision],
    semanticConstraints: [
      {
        code: `${MIGRATION_CONSTRAINT_PREFIX[type]}migration-retained`,
        statement: note,
      },
    ],
  };
}

function edgeId(sourceId: string, type: string, targetId: string): string {
  return `${sourceId}:${type}:${targetId}`;
}

function directionalityFor(
  type: VNextGraphRelationType,
): VNextRelationDirectionality {
  return SYMMETRIC_TYPES.has(type) ? "symmetric" : "directed";
}

function buildEdge(
  relation: RelationSeed,
  symmetricDerived = false,
): VNextGraphEdge {
  const id = edgeId(relation.sourceId, relation.type, relation.targetId);
  const canonicalFacetId = relation.facetId.includes(".")
    ? relation.facetId
    : (vnextConstructRegistry.roots.find((root) => root.id === relation.facetId)
        ?.facetIds[0] ?? relation.facetId);
  return {
    id,
    sourceId: relation.sourceId,
    targetId: relation.targetId,
    type: relation.type,
    graphVersion: VNEXT_GRAPH_VERSION,
    directionality: directionalityFor(relation.type),
    scope: relation.scope,
    facet: {
      domain: canonicalFacetId.split(".")[0],
      layers: ["normative", "descriptive", "prescriptive"],
      evidenceScope: "conceptual graph provenance; not respondent validity",
      differentiatingConstructIds: [canonicalFacetId],
    },
    sourceRecordIds: [
      ...relation.sourceRecordIds,
      ...(symmetricDerived ? [`vnext-graph-adjudication:${id}`] : []),
    ],
    provenance: [...relation.sourceRecordIds, ...relation.decisionIds],
    note: relation.note,
    semanticConstraints: relation.semanticConstraints,
    ...(symmetricDerived ? { symmetricDerived: true } : {}),
  };
}

const graphEdges = new Map<string, VNextGraphEdge>();
for (const relation of AUTHORITATIVE_RELATIONS) {
  const edge = buildEdge(relation);
  graphEdges.set(edge.id, edge);
  if (SYMMETRIC_TYPES.has(relation.type)) {
    const reverse = buildEdge(
      { ...relation, sourceId: relation.targetId, targetId: relation.sourceId },
      true,
    );
    graphEdges.set(reverse.id, reverse);
  }
}
for (const record of vnextGraphMigrationLedger) {
  const relation = migrationSeed(record);
  const edge = buildEdge(relation);
  if (!graphEdges.has(edge.id)) graphEdges.set(edge.id, edge);
}

export const vnextGraphEdges: readonly VNextGraphEdge[] = [
  ...graphEdges.values(),
].sort((a, b) => a.id.localeCompare(b.id));
export const vnextGraphAdjudicationRecords: readonly VNextGraphAdjudicationRecord[] =
  vnextGraphEdges.map((edge) => ({
    adjudicationId: `vnext-graph-adjudication:${edge.id}`,
    sourceId: edge.sourceId,
    targetId: edge.targetId,
    type: edge.type,
    status: "approved",
    sourceRecordIds: edge.sourceRecordIds,
    decisionIds: edge.provenance.filter((record) => /^D-\d+/.test(record)),
    rationale: edge.note,
  }));
export const vnextGraphEdgesBySource = new Map<
  string,
  readonly VNextGraphEdge[]
>(
  vnextOntologyNodes.map((node) => [
    node.id,
    vnextGraphEdges.filter((edge) => edge.sourceId === node.id),
  ]),
);

export const vnextGraphRelationTypes = [
  ...new Set(vnextGraphEdges.map((edge) => edge.type)),
].sort();
export const vnextGraphFacetIds = new Set(
  vnextGraphEdges.flatMap(
    (edge) => edge.facet.differentiatingConstructIds ?? [],
  ),
);
export const vnextGraphConstructRegistry = vnextConstructRegistry;
