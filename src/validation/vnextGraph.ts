import type { VNextGraphEdge, VNextOntologyNode } from "../types";
import { vnextGraphEdges } from "../data/vnextGraph";
import { vnextOntologyNodes } from "../data/vnextOntology";

const SYMMETRIC_TYPES = new Set([
  "often_combines_with",
  "overlaps_with",
  "contrasts_with",
  "not_equivalent_to",
]);

function hasSubtypeCycle(edges: readonly VNextGraphEdge[]): boolean {
  const children = new Map<string, string[]>();
  for (const edge of edges) {
    if (edge.type !== "subtype_of") continue;
    children.set(edge.sourceId, [
      ...(children.get(edge.sourceId) ?? []),
      edge.targetId,
    ]);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const next of children.get(id) ?? []) {
      if (visit(next)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  return [...children.keys()].some(visit);
}

export function vnextGraphErrors(
  nodes: readonly VNextOntologyNode[] = vnextOntologyNodes,
  edges: readonly VNextGraphEdge[] = vnextGraphEdges,
): string[] {
  const errors: string[] = [];
  const nodeIds = new Set<string>();
  for (const node of nodes) {
    if (nodeIds.has(node.id)) errors.push(`duplicate node ${node.id}`);
    nodeIds.add(node.id);
    if (
      !node.canonicalName ||
      !node.canonicalDefinition ||
      !node.boundaryStatement
    ) {
      errors.push(`node ${node.id} is missing identity or boundary metadata`);
    }
    if (
      node.compatibility.role === "context" ||
      node.compatibility.role === "retired"
    ) {
      if (
        node.vNextMeasurementStatus !== "catalog-only" &&
        node.vNextMeasurementStatus !== "retired-alias"
      ) {
        errors.push(
          `${node.id} has an invalid Context/retired measurement status`,
        );
      }
    }
  }
  const edgeIds = new Set<string>();
  for (const edge of edges) {
    if (edgeIds.has(edge.id)) errors.push(`duplicate edge ${edge.id}`);
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.sourceId))
      errors.push(`${edge.id} has an unknown source`);
    if (!nodeIds.has(edge.targetId))
      errors.push(`${edge.id} has an unknown target`);
    if (edge.sourceId === edge.targetId)
      errors.push(`${edge.id} is self-referential`);
    if (SYMMETRIC_TYPES.has(edge.type)) {
      const reverse = edges.some(
        (candidate) =>
          candidate.sourceId === edge.targetId &&
          candidate.targetId === edge.sourceId &&
          candidate.type === edge.type,
      );
      if (!reverse) errors.push(`${edge.id} lacks its symmetric reverse edge`);
    }
  }
  if (hasSubtypeCycle(edges))
    errors.push("subtype_of relations contain a cycle");
  return errors;
}

export function assertVNextGraph(): void {
  const errors = vnextGraphErrors();
  if (errors.length > 0) {
    throw new Error(`vNext graph violation: ${errors.join("; ")}`);
  }
}
