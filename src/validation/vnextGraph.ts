import { vnextConstructRegistry } from "../data/vnextConstructs";
import {
  vnextGraphAdjudicationRecords,
  vnextGraphEdges,
} from "../data/vnextGraph";
import { vnextGraphMigrationLedger } from "../data/vnextGraphMigration";
import { vnextOntologyNodes } from "../data/vnextOntology";
import { vnextSpecialistRelationCoverage } from "../data/vnextSpecialistRelationCoverage";
import { vnextOntologyErrors } from "./vnextOntology";
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

export function vnextSpecialistRelationCoverageErrors(
  nodes: readonly VNextOntologyNode[] = vnextOntologyNodes,
  edges: readonly VNextGraphEdge[] = vnextGraphEdges,
  records = vnextSpecialistRelationCoverage,
): string[] {
  const errors: string[] = [];
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const specialistIds = new Set(
    nodes
      .filter((node) => node.publicRoleView.defaultRole === "specialist")
      .map((node) => node.id),
  );
  const coverageIds = new Set<string>();
  const assertionIds = new Set<string>();
  const coveredSourceIds = new Set<string>();

  for (const record of records) {
    if (coverageIds.has(record.coverageId))
      errors.push(
        `duplicate Specialist relation coverage ${record.coverageId}`,
      );
    coverageIds.add(record.coverageId);
    if (!specialistIds.has(record.sourceId))
      errors.push(
        `${record.coverageId} source ${record.sourceId} is not an authoritative Specialist`,
      );
    coveredSourceIds.add(record.sourceId);
    if (!record.sourceRecordId.startsWith("docs/"))
      errors.push(`${record.coverageId} lacks a document source anchor`);
    if (!record.rationale.trim())
      errors.push(`${record.coverageId} lacks disposition rationale`);

    if (record.status === "represented") {
      if (
        !record.relationType ||
        !record.targetId ||
        !record.targetLabel?.trim() ||
        !record.edgeId
      ) {
        errors.push(
          `${record.coverageId} represented relation lacks type, target, label, or edge ID`,
        );
        continue;
      }
      const expectedEdgeId = `${record.sourceId}:${record.relationType}:${record.targetId}`;
      if (record.edgeId !== expectedEdgeId)
        errors.push(`${record.coverageId} names an incorrect edge ID`);
      if (!nodeById.has(record.targetId))
        errors.push(`${record.coverageId} names an unknown ontology target`);
      const edge = edges.find((candidate) => candidate.id === record.edgeId);
      if (!edge)
        errors.push(
          `${record.coverageId} is represented but its authoritative edge is missing`,
        );
      else if (
        edge.sourceId !== record.sourceId ||
        edge.targetId !== record.targetId ||
        edge.type !== record.relationType
      )
        errors.push(
          `${record.coverageId} does not match its authoritative edge`,
        );
      if (assertionIds.has(expectedEdgeId))
        errors.push(`${record.coverageId} duplicates a represented relation`);
      assertionIds.add(expectedEdgeId);
    } else if (record.status === "dispositioned") {
      if (
        !record.relationType ||
        !record.targetLabel?.trim() ||
        record.targetId ||
        record.edgeId
      )
        errors.push(
          `${record.coverageId} disposition must name a typed phrase without a runtime target or edge`,
        );
    } else if (
      record.relationType ||
      record.targetLabel ||
      record.targetId ||
      record.edgeId
    ) {
      errors.push(
        `${record.coverageId} no-typed-relation record contains typed relation fields`,
      );
    }
  }

  for (const specialistId of specialistIds)
    if (!coveredSourceIds.has(specialistId))
      errors.push(
        `${specialistId} lacks a Specialist family-graph coverage disposition`,
      );
  return [...new Set(errors)];
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
  if (nodes === vnextOntologyNodes) errors.push(...vnextOntologyErrors(nodes));
  const edgeIds = new Set<string>();
  const relationTypes = new Set<VNextGraphRelationType>();
  const adjudications = new Map(
    vnextGraphAdjudicationRecords.map((record) => [
      `${record.sourceId}:${record.type}:${record.targetId}`,
      record,
    ]),
  );
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
    const adjudication = adjudications.get(edge.id);
    if (!adjudication || adjudication.status !== "approved")
      errors.push(`${edge.id} lacks an approved edge adjudication record`);
    else {
      if (
        adjudication.sourceId !== edge.sourceId ||
        adjudication.targetId !== edge.targetId ||
        adjudication.type !== edge.type
      )
        errors.push(`${edge.id} does not match its adjudication identity`);
      if (
        !adjudication.sourceRecordIds.includes(
          `vnext-graph-adjudication:${edge.id}`,
        )
      )
        errors.push(`${edge.id} lacks a unique edge-level adjudication source`);
      if (!adjudication.sourceRecordIds.some((id) => id.startsWith("docs/")))
        errors.push(`${edge.id} lacks a document source anchor`);
      if (adjudication.decisionIds.length === 0)
        errors.push(`${edge.id} lacks a methodological decision reference`);
    }
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
    const sourceNode = nodes.find((node) => node.id === edge.sourceId);
    const targetNode = nodes.find((node) => node.id === edge.targetId);
    if (
      edge.type === "hybrid_of" &&
      ![
        "compound-tradition",
        "bridge-tradition",
        "hybrid-configuration",
        "regime-or-authoritarian-project",
        "strategy-or-program",
        "subtype-tradition",
        "regional-historical-variant",
        "intellectual-current",
      ].includes(sourceNode?.conceptualKind ?? "") &&
      !sourceNode?.secondaryKinds.includes("hybrid-configuration")
    )
      errors.push(
        `${edge.id} hybrid_of source is not a compound/bridge object`,
      );
    if (
      edge.type === "institutionalizes" &&
      sourceNode?.conceptualKind !== "institutional-project"
    )
      errors.push(
        `${edge.id} institutionalizes source is not an institutional project`,
      );
    if (
      edge.type === "context_for" &&
      sourceNode?.publicRoleView.defaultRole !== "context" &&
      ![
        "discourse-frame",
        "intellectual-current",
        "regional-historical-variant",
      ].includes(sourceNode?.conceptualKind ?? "")
    )
      errors.push(`${edge.id} context_for source must be a Context object`);
    if (
      edge.type === "policy_expression_of" &&
      sourceNode?.conceptualKind !== "policy-proposal"
    )
      errors.push(
        `${edge.id} policy_expression_of source must be a policy proposal`,
      );
    if (
      edge.type === "requires" &&
      !targetNode?.evidenceRequirements.requiredConstructIds.length &&
      !targetNode?.modifierMetadata
    )
      errors.push(
        `${edge.id} requires target lacks an approved construct-bearing entity`,
      );
    if (
      edge.type === "alias_of" &&
      nodes.find((node) => node.id === edge.sourceId)?.conceptualStatus !==
        "retired"
    )
      errors.push(`${edge.id} alias source must be retired`);
    if (edge.type === "incompatible_with_core" && edge.scope !== "measurement")
      errors.push(`${edge.id} core-incompatibility must be measurement-scoped`);
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
  const migrationRelationIds = new Set(
    vnextGraphMigrationLedger.flatMap((record) => record.newRelationIds),
  );
  for (const record of vnextGraphMigrationLedger) {
    if (record.disposition === "remove-with-rationale") {
      if (record.newRelationIds.length > 0)
        errors.push(
          `${record.migrationId} removes a relation but names replacement edges`,
        );
      if (!record.rationale.trim() || !record.methodologicalDecision)
        errors.push(
          `${record.migrationId} lacks removal rationale or decision`,
        );
    } else {
      for (const relationId of record.newRelationIds)
        if (!edgeIds.has(relationId))
          errors.push(
            `${record.migrationId} names missing authoritative edge ${relationId}`,
          );
    }
  }
  for (const edgeId of migrationRelationIds)
    if (!edgeIds.has(edgeId))
      errors.push(`migration ledger edge ${edgeId} is absent`);
  if (nodes === vnextOntologyNodes && edges === vnextGraphEdges)
    errors.push(...vnextSpecialistRelationCoverageErrors());
  return [...new Set(errors)];
}

export function assertVNextGraph(): void {
  const errors = vnextGraphErrors();
  if (errors.length > 0)
    throw new Error(`vNext graph violation: ${errors.join("; ")}`);
}
