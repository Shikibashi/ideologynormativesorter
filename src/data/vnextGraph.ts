import type { VNextGraphEdge, VNextGraphRelationType } from "../types";
import { vnextOntologyNodes } from "./vnextOntology";

const RELATION_MAP: Readonly<
  Record<string, VNextGraphRelationType | undefined>
> = {
  subtype_of: "subtype_of",
  family_member_of: "family_member_of",
  hybrid_of: "hybrid_of",
  configures: "configures",
  often_combines_with: "often_combines_with",
  overlaps_with: "overlaps_with",
  contrasts_with: "contrasts_with",
  requires: "requires",
  regional_variant_of: "regional_variant_of",
  historical_predecessor_of: "historical_predecessor_of",
  influenced_by: "influenced_by",
  institutionalizes: "institutionalizes",
  context_for: "context_for",
  policy_expression_of: "policy_expression_of",
  alias_of: "alias_of",
  not_equivalent_to: "not_equivalent_to",
  incompatible_with_core: "incompatible_with_core",
};

const SYMMETRIC_RELATIONS = new Set<VNextGraphRelationType>([
  "often_combines_with",
  "overlaps_with",
  "contrasts_with",
  "not_equivalent_to",
]);

function edgeId(sourceId: string, type: string, targetId: string): string {
  return `${sourceId}:${type}:${targetId}`;
}

export const vnextGraphEdges: readonly VNextGraphEdge[] = (() => {
  const edges = new Map<string, VNextGraphEdge>();
  for (const node of vnextOntologyNodes) {
    for (const relation of node.compatibility.relations) {
      const type = RELATION_MAP[relation.type];
      if (!type) {
        throw new Error(
          `Unmapped v13 relation ${relation.type} on ${node.id}; compatibility data must not be discarded`,
        );
      }
      if (
        !vnextOntologyNodes.some(
          (candidate) => candidate.id === relation.labelId,
        )
      ) {
        throw new Error(
          `Unknown v13 relation target ${relation.labelId} from ${node.id}`,
        );
      }
      const sourceRecordIds = [`label-taxonomy-v13:${node.id}`];
      edges.set(edgeId(node.id, type, relation.labelId), {
        id: edgeId(node.id, type, relation.labelId),
        sourceId: node.id,
        targetId: relation.labelId,
        type,
        sourceRecordIds,
      });
      if (SYMMETRIC_RELATIONS.has(type)) {
        const derivedId = edgeId(relation.labelId, type, node.id);
        edges.set(derivedId, {
          id: derivedId,
          sourceId: relation.labelId,
          targetId: node.id,
          type,
          sourceRecordIds,
          symmetricDerived: true,
        });
      }
    }
    if (node.compatibility.parentId) {
      const id = edgeId(node.id, "subtype_of", node.compatibility.parentId);
      edges.set(id, {
        id,
        sourceId: node.id,
        targetId: node.compatibility.parentId,
        type: "subtype_of",
        sourceRecordIds: [`label-taxonomy-v13:parent:${node.id}`],
      });
    }
  }
  return [...edges.values()].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
})();

export const vnextGraphEdgesBySource = new Map<
  string,
  readonly VNextGraphEdge[]
>(
  vnextOntologyNodes.map((node) => [
    node.id,
    vnextGraphEdges.filter((edge) => edge.sourceId === node.id),
  ]),
);
