import { labelTaxonomyById } from "./labelTaxonomy";
import { specialistModuleDefinitions } from "../specialist";
import type {
  VNextOntologyNode,
  VNextOntologyRecord,
  VNextOntologyRegistry,
} from "../types";
import { VNEXT_GRAPH_VERSION } from "../validation/vnextVersions";
import {
  vnextOntologyRecordById,
  vnextOntologyRecords,
} from "./vnextOntologyRecords";

/**
 * Join the explicit vNext record to v13 only for compatibility decoding.
 * No authoritative conceptual, measurement, role, construct, facet, or
 * module field is derived from the legacy taxonomy in this module.
 */
function buildNode(record: VNextOntologyRecord): VNextOntologyNode {
  const taxonomy = labelTaxonomyById.get(record.id);
  if (!taxonomy)
    throw new Error(`Missing compatibility source record for ${record.id}`);
  return {
    ...record,
    compatibility: {
      role: taxonomy.role,
      measurementStatus: taxonomy.measurementStatus,
      ...(taxonomy.parentId ? { parentId: taxonomy.parentId } : {}),
      ...(taxonomy.aliasOf ? { aliasOf: taxonomy.aliasOf } : {}),
      relations: taxonomy.relations,
    },
  };
}

const recordIds = vnextOntologyRecords.map((record) => record.id);
if (new Set(recordIds).size !== recordIds.length)
  throw new Error("vNext ontology records contain duplicate canonical IDs");

export const vnextOntologyNodes: readonly VNextOntologyNode[] =
  vnextOntologyRecords.map(buildNode);
export const vnextOntologyById = new Map(
  vnextOntologyNodes.map((node) => [node.id, node]),
);
export const vnextOntologyRegistry: VNextOntologyRegistry = {
  ontologyVersion: vnextOntologyRecords[0]?.version ?? "",
  graphVersion: VNEXT_GRAPH_VERSION,
  nodes: vnextOntologyNodes,
};
export const vnextAuthoritativeRoleById = new Map(
  vnextOntologyRecords.map((record) => [
    record.id,
    record.publicRoleView.defaultRole,
  ]),
);
export const vnextKnownModuleIds = new Set(
  specialistModuleDefinitions.map((module) => module.id),
);

export { vnextOntologyRecordById };
