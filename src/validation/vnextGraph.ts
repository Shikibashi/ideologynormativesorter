import { vnextConstructRegistry } from "../data/vnextConstructs";
import { vnextGraphEdges } from "../data/vnextGraph";
import { vnextOntologyNodes } from "../data/vnextOntology";
import { VNEXT_GRAPH_VERSION } from "./vnextVersions";
import {
  VNEXT_CONCEPTUAL_KINDS,
  VNEXT_CONCEPTUAL_STATUSES,
  VNEXT_MEASUREMENT_STATUSES,
} from "../types";
import type {
  VNextGraphEdge,
  VNextGraphRelationType,
  VNextOntologyNode,
} from "../types";

const RELATION_TYPES: readonly VNextGraphRelationType[] = [
  "subtype_of",
  "family_member_of",
  "hybrid_of",
  "configures",
  "often_combines_with",
  "overlaps_with",
  "contrasts_with",
  "requires",
  "regional_variant_of",
  "historical_predecessor_of",
  "influenced_by",
  "institutionalizes",
  "context_for",
  "policy_expression_of",
  "alias_of",
  "not_equivalent_to",
  "incompatible_with_core",
];
const RELATION_SET = new Set(RELATION_TYPES);
const SYMMETRIC_TYPES = new Set<VNextGraphRelationType>([
  "often_combines_with",
  "overlaps_with",
  "contrasts_with",
  "not_equivalent_to",
]);
const DIRECTED_TYPES = new Set(
  RELATION_TYPES.filter((type) => !SYMMETRIC_TYPES.has(type)),
);
const ALLOWED_SCOPES_BY_RELATION: Readonly<
  Record<VNextGraphRelationType, readonly string[]>
> = {
  subtype_of: ["conceptual", "historical"],
  family_member_of: ["conceptual"],
  hybrid_of: ["conceptual", "historical"],
  configures: ["conceptual", "institutional"],
  often_combines_with: ["conceptual"],
  overlaps_with: ["conceptual"],
  contrasts_with: ["conceptual", "measurement"],
  requires: ["conceptual", "measurement"],
  regional_variant_of: ["historical", "conceptual"],
  historical_predecessor_of: ["historical"],
  influenced_by: ["historical", "conceptual"],
  institutionalizes: ["institutional", "conceptual"],
  context_for: ["catalog", "conceptual"],
  policy_expression_of: ["measurement", "institutional"],
  alias_of: ["catalog"],
  not_equivalent_to: ["conceptual", "measurement"],
  incompatible_with_core: ["measurement"],
};
const REQUIRED_CONSTRAINT_PREFIX: Readonly<
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

function hasCycle(
  edges: readonly VNextGraphEdge[],
  types: ReadonlySet<VNextGraphRelationType>,
): boolean {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    if (!types.has(edge.type)) continue;
    adjacency.set(edge.sourceId, [
      ...(adjacency.get(edge.sourceId) ?? []),
      edge.targetId,
    ]);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const next of adjacency.get(id) ?? []) if (visit(next)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  return [...adjacency.keys()].some(visit);
}

function nodeErrors(
  node: VNextOntologyNode,
  nodeIds: ReadonlySet<string>,
): string[] {
  const errors: string[] = [];
  if (
    !node.id.trim() ||
    !node.canonicalName.trim() ||
    !node.canonicalDefinition.trim() ||
    !node.boundaryStatement.trim()
  )
    errors.push(
      `${node.id} is missing canonical identity or boundary metadata`,
    );
  if (!VNEXT_CONCEPTUAL_KINDS.includes(node.conceptualKind))
    errors.push(`${node.id} has an unknown conceptual kind`);
  for (const kind of node.secondaryKinds)
    if (!VNEXT_CONCEPTUAL_KINDS.includes(kind))
      errors.push(`${node.id} has an unknown secondary kind ${kind}`);
  if (!VNEXT_CONCEPTUAL_STATUSES.includes(node.conceptualStatus))
    errors.push(`${node.id} has an unknown conceptual status`);
  if (!VNEXT_MEASUREMENT_STATUSES.includes(node.vNextMeasurementStatus))
    errors.push(`${node.id} has an unknown measurement status`);
  if (node.version !== "2026-08-vnext-ontology-v1")
    errors.push(`${node.id} has a stale ontology version`);
  if (node.sourceRecordIds.length === 0)
    errors.push(`${node.id} lacks source/provenance metadata`);
  if (
    node.publicRoleView.eligibleRoles.length === 0 ||
    !node.publicRoleView.derivationInputs.length
  )
    errors.push(`${node.id} lacks an independent public-role view`);
  if (
    node.evidenceRequirements.requiredConstructIds.length === 0 &&
    node.publicRoleView.defaultRole !== "context" &&
    node.publicRoleView.defaultRole !== "retired"
  )
    errors.push(`${node.id} lacks structural evidence requirements`);
  if (node.compatibility.parentId && !nodeIds.has(node.compatibility.parentId))
    errors.push(`${node.id} has an unknown compatibility parent`);
  const facetIds = new Set(
    vnextConstructRegistry.facets.map((facet) => facet.id),
  );
  for (const facetId of [
    ...node.constitutiveFacetIds,
    ...node.associatedFacetIds,
    ...node.nonConstitutiveFacetIds,
    ...node.evidenceRequirements.requiredFacetIds,
  ])
    if (!facetIds.has(facetId))
      errors.push(`${node.id} references unknown canonical facet ${facetId}`);
  if (
    node.conceptualStatus === "retired" &&
    node.publicRoleView.defaultRole !== "retired"
  )
    errors.push(
      `${node.id} retired conceptual status is not retired in public role view`,
    );
  return errors;
}

export function vnextGraphErrors(
  nodes: readonly VNextOntologyNode[] = vnextOntologyNodes,
  edges: readonly VNextGraphEdge[] = vnextGraphEdges,
): string[] {
  const errors: string[] = [];
  const nodeIds = new Set(nodes.map((node) => node.id));
  for (const node of nodes) {
    if (nodes.filter((candidate) => candidate.id === node.id).length > 1)
      errors.push(`duplicate node ${node.id}`);
    errors.push(...nodeErrors(node, nodeIds));
  }
  const edgeIds = new Set<string>();
  const relationTypes = new Set<VNextGraphRelationType>();
  const facetIds = new Set(
    vnextConstructRegistry.facets.map((facet) => facet.id),
  );
  for (const edge of edges) {
    if (edgeIds.has(edge.id)) errors.push(`duplicate edge ${edge.id}`);
    edgeIds.add(edge.id);
    relationTypes.add(edge.type);
    if (!RELATION_SET.has(edge.type))
      errors.push(`${edge.id} has an unknown relation type`);
    if (!nodeIds.has(edge.sourceId))
      errors.push(`${edge.id} has an unknown source`);
    if (!nodeIds.has(edge.targetId))
      errors.push(`${edge.id} has an unknown target`);
    if (edge.sourceId === edge.targetId)
      errors.push(`${edge.id} is self-referential`);
    if (edge.graphVersion !== VNEXT_GRAPH_VERSION)
      errors.push(`${edge.id} has a stale graph version`);
    if (
      !edge.note.trim() ||
      edge.provenance.length === 0 ||
      edge.sourceRecordIds.length === 0 ||
      edge.semanticConstraints.length === 0
    )
      errors.push(`${edge.id} lacks note, provenance, or semantic constraints`);
    if (
      edge.semanticConstraints.some(
        (constraint) => !constraint.code.trim() || !constraint.statement.trim(),
      ) ||
      !edge.semanticConstraints.some((constraint) =>
        constraint.code.startsWith(REQUIRED_CONSTRAINT_PREFIX[edge.type]),
      )
    )
      errors.push(
        `${edge.id} lacks the required relation-specific semantic constraint`,
      );
    if (!edge.facet.differentiatingConstructIds?.some((id) => facetIds.has(id)))
      errors.push(`${edge.id} lacks a canonical facet reference`);
    if (SYMMETRIC_TYPES.has(edge.type) && edge.directionality !== "symmetric")
      errors.push(`${edge.id} must declare symmetric directionality`);
    if (DIRECTED_TYPES.has(edge.type) && edge.directionality !== "directed")
      errors.push(`${edge.id} must declare directed directionality`);
    if (!ALLOWED_SCOPES_BY_RELATION[edge.type]?.includes(edge.scope))
      errors.push(`${edge.id} has an invalid scope for ${edge.type}`);
    if (
      edge.type === "alias_of" &&
      nodes.find((node) => node.id === edge.sourceId)?.conceptualStatus !==
        "retired"
    )
      errors.push(`${edge.id} alias source must be retired`);
    if (edge.type === "incompatible_with_core" && edge.scope !== "measurement")
      errors.push(`${edge.id} core-incompatibility must be measurement-scoped`);
    if (
      edge.type === "context_for" &&
      nodes.find((node) => node.id === edge.sourceId)?.publicRoleView
        .defaultRole !== "context"
    )
      errors.push(`${edge.id} context_for source must be a Context object`);
    if (SYMMETRIC_TYPES.has(edge.type)) {
      const reverse = edges.find(
        (candidate) =>
          candidate.sourceId === edge.targetId &&
          candidate.targetId === edge.sourceId &&
          candidate.type === edge.type,
      );
      if (!reverse) errors.push(`${edge.id} lacks its symmetric reverse edge`);
    }
  }
  for (const relationType of RELATION_TYPES)
    if (!relationTypes.has(relationType))
      errors.push(
        `approved relation type ${relationType} is absent from the authoritative graph`,
      );
  if (hasCycle(edges, new Set(["subtype_of", "alias_of"])))
    errors.push("subtype_of/alias_of relations contain a cycle");
  return [...new Set(errors)];
}

export function assertVNextGraph(): void {
  const errors = vnextGraphErrors();
  if (errors.length > 0)
    throw new Error(`vNext graph violation: ${errors.join("; ")}`);
}
