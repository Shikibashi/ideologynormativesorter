import { vnextOntologyNodes } from "./vnextOntology";
import { vnextConstructRecords } from "./vnextConstructRecords";

/**
 * The Measurement Blueprint is materialized as an explicit registry. Runtime
 * consumers only index these approved records; no facet definition, neighbor,
 * applicability, or local-construct meaning is generated from a label roster.
 */
export const vnextConstructRegistry = vnextConstructRecords;

export const vnextRootById = new Map(
  vnextConstructRegistry.roots.map((root) => [root.id, root]),
);
export const vnextFacetById = new Map(
  vnextConstructRegistry.facets.map((facet) => [facet.id, facet]),
);
export const vnextLocalConstructById = new Map(
  vnextConstructRegistry.localConstructs.map((construct) => [
    construct.id,
    construct,
  ]),
);

export const vnextKnownOntologyLabelIds = new Set(
  vnextOntologyNodes.map((node) => node.id),
);
