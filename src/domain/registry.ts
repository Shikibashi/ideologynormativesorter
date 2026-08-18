/** Read-only access to the clean canonical manifest. */

import {
  CANONICAL_MANIFEST,
  type CanonicalConstruct,
  type CanonicalContext,
  type CanonicalEntityKind,
  type CanonicalFacet,
  type CanonicalItem,
  type CanonicalManifest,
  type CanonicalMapping,
  type CanonicalOntology,
  type CanonicalTaxonomy,
  type StableId,
} from "./canonicalManifest";

export interface CanonicalEntityByKind {
  readonly taxonomy: CanonicalTaxonomy;
  readonly ontology: CanonicalOntology;
  readonly construct: CanonicalConstruct;
  readonly facet: CanonicalFacet;
  readonly item: CanonicalItem;
  readonly mapping: CanonicalMapping;
  readonly context: CanonicalContext;
}

export type CanonicalEntity = CanonicalEntityByKind[CanonicalEntityKind];

export interface CanonicalRegistry {
  readonly manifest: CanonicalManifest;
  get<K extends CanonicalEntityKind>(
    kind: K,
    id: StableId,
  ): CanonicalEntityByKind[K] | undefined;
  list<K extends CanonicalEntityKind>(
    kind: K,
  ): readonly CanonicalEntityByKind[K][];
  /** Iterate in manifest order without exposing mutable registry state. */
  iterate<K extends CanonicalEntityKind>(
    kind: K,
  ): IterableIterator<CanonicalEntityByKind[K]>;
}

const ENTITY_KINDS: readonly CanonicalEntityKind[] = [
  "taxonomy",
  "ontology",
  "construct",
  "facet",
  "item",
  "mapping",
  "context",
];

function entitiesForKind(
  manifest: CanonicalManifest,
  kind: CanonicalEntityKind,
): readonly CanonicalEntity[] {
  switch (kind) {
    case "taxonomy":
      return manifest.taxonomy;
    case "ontology":
      return manifest.ontology;
    case "construct":
      return manifest.constructs;
    case "facet":
      return manifest.facets;
    case "item":
      return manifest.items;
    case "mapping":
      return manifest.mappings;
    case "context":
      return [...manifest.contexts.taxonomy, ...manifest.contexts.question];
  }
}

function buildLookup(
  manifest: CanonicalManifest,
): ReadonlyMap<CanonicalEntityKind, ReadonlyMap<StableId, CanonicalEntity>> {
  const lookup = new Map<
    CanonicalEntityKind,
    ReadonlyMap<StableId, CanonicalEntity>
  >();
  for (const kind of ENTITY_KINDS) {
    const byId = new Map<StableId, CanonicalEntity>();
    for (const entity of entitiesForKind(manifest, kind)) {
      // Validation reports duplicate IDs.  Keeping the first record here makes
      // an invalid registry deterministic without silently declaring it valid.
      if (!byId.has(entity.id)) byId.set(entity.id, entity);
    }
    lookup.set(kind, byId);
  }
  return lookup;
}

export function createCanonicalRegistry(
  manifest: CanonicalManifest = CANONICAL_MANIFEST,
): CanonicalRegistry {
  const lookup = buildLookup(manifest);

  return {
    manifest,
    get<K extends CanonicalEntityKind>(kind: K, id: StableId) {
      return lookup.get(kind)?.get(id) as CanonicalEntityByKind[K] | undefined;
    },
    list<K extends CanonicalEntityKind>(kind: K) {
      return entitiesForKind(
        manifest,
        kind,
      ) as readonly CanonicalEntityByKind[K][];
    },
    *iterate<K extends CanonicalEntityKind>(kind: K) {
      yield* entitiesForKind(
        manifest,
        kind,
      ) as readonly CanonicalEntityByKind[K][];
    },
  };
}

export const canonicalRegistry = createCanonicalRegistry(CANONICAL_MANIFEST);

/** Small convenience function for callers that do not need a registry object. */
export function lookupCanonical<K extends CanonicalEntityKind>(
  kind: K,
  id: StableId,
  registry: CanonicalRegistry = canonicalRegistry,
): CanonicalEntityByKind[K] | undefined {
  return registry.get(kind, id);
}
