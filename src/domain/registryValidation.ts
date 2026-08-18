import {
  CONTEXT_NAMESPACES,
  type CanonicalEntityKind,
  type CanonicalManifest,
  type CanonicalReference,
  type CanonicalReferenceKind,
  type ContextNamespace,
  type IdeologyNode,
  type StableId,
} from "./canonicalManifest";
import {
  createCanonicalRegistry,
  type CanonicalEntity,
  type CanonicalRegistry,
} from "./registry";

export type RegistryValidationCode =
  | "duplicate-id"
  | "missing-reference"
  | "invalid-mapping"
  | "role-leakage"
  | "context-namespace"
  | "duplicate-authority"
  | "invalid-shape";

export interface RegistryValidationIssue {
  readonly code: RegistryValidationCode;
  readonly message: string;
  readonly kind?: CanonicalEntityKind;
  readonly id?: StableId;
  readonly path?: string;
}

export interface RegistryValidationResult {
  readonly valid: boolean;
  /** `ok` is a short alias useful at call sites. */
  readonly ok: boolean;
  readonly issues: readonly RegistryValidationIssue[];
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
const CONCEPTUAL_STATUSES = new Set(["canonical", "provisional", "deprecated"]);
const MEASUREMENT_STATUSES = new Set([
  "unmeasured",
  "candidate",
  "validated",
  "deprecated",
  "not-started",
  "catalog-only",
  "research-candidate",
  "experimental",
  "compatibility-scored-unvalidated",
  "respondent-supported-scored",
  "validated-scoped-public",
  "held",
  "retired-alias",
]);
const PUBLIC_ROLE_STATUSES = new Set([
  "primary",
  "modifier",
  "specialist",
  "context",
  "retired",
  "internal",
]);
const MAPPING_RELATIONS = new Set([
  "measures",
  "supports",
  "contrasts",
  "composes",
  "aliases",
  "subtype_of",
  "family_member_of",
  "hybrid_of",
  "configures",
  "requires",
  "overlaps_with",
  "contrasts_with",
  "often_combines_with",
  "regional_variant_of",
  "historical_predecessor_of",
  "influenced_by",
  "institutionalizes",
  "context_for",
  "policy_expression_of",
  "alias_of",
  "not_equivalent_to",
  "incompatible_with_core",
]);
const REFERENCE_KINDS = new Set([...ENTITY_KINDS, "node"]);
const ROOT_LAYERS = new Set(["normative", "descriptive", "prescriptive"]);
const ITEM_ROLES = new Set(["core", "specialist"]);
const CONTEXT_NAMES = new Set(CONTEXT_NAMESPACES);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function shapeIssue(
  issues: RegistryValidationIssue[],
  path: string,
  message: string,
): void {
  issue(issues, {
    code: "invalid-shape",
    path,
    message: `${path} ${message}`,
  });
}

function shapeArray(
  value: Record<string, unknown>,
  path: string,
  issues: RegistryValidationIssue[],
): boolean {
  if (!Array.isArray(value[path])) {
    shapeIssue(issues, path, "must be an array");
    return false;
  }
  return true;
}

function shapeStatus(
  entity: Record<string, unknown>,
  path: string,
  issues: RegistryValidationIssue[],
): void {
  if (!nonEmptyString(entity.id))
    shapeIssue(issues, `${path}.id`, "must be a non-empty string");
  if (!CONCEPTUAL_STATUSES.has(entity.conceptualStatus as string))
    shapeIssue(issues, `${path}.conceptualStatus`, "is not a known status");
  if (!MEASUREMENT_STATUSES.has(entity.measurementStatus as string))
    shapeIssue(issues, `${path}.measurementStatus`, "is not a known status");
  if (!PUBLIC_ROLE_STATUSES.has(entity.publicRoleStatus as string))
    shapeIssue(issues, `${path}.publicRoleStatus`, "is not a known status");
  for (const field of ["authorityKey", "description"] as const) {
    if (entity[field] !== undefined && typeof entity[field] !== "string")
      shapeIssue(issues, `${path}.${field}`, "must be a string when present");
  }
}

function shapeReference(
  value: unknown,
  path: string,
  issues: RegistryValidationIssue[],
): void {
  if (!isRecord(value)) {
    shapeIssue(issues, path, "must be an object");
    return;
  }
  if (!REFERENCE_KINDS.has(value.kind as string))
    shapeIssue(issues, `${path}.kind`, "is not a known reference kind");
  if (!nonEmptyString(value.id))
    shapeIssue(issues, `${path}.id`, "must be a non-empty string");
}

function shapeStringArray(
  value: unknown,
  path: string,
  issues: RegistryValidationIssue[],
): void {
  if (!Array.isArray(value)) {
    shapeIssue(issues, path, "must be an array");
    return;
  }
  value.forEach((entry, index) => {
    if (!nonEmptyString(entry))
      shapeIssue(issues, `${path}[${index}]`, "must be a non-empty string");
  });
}

function shapeWeights(
  value: unknown,
  path: string,
  issues: RegistryValidationIssue[],
): void {
  if (!isRecord(value)) {
    shapeIssue(issues, path, "must be an object");
    return;
  }
  for (const [key, weight] of Object.entries(value)) {
    if (!nonEmptyString(key) || !finiteNumber(weight))
      shapeIssue(
        issues,
        `${path}.${key}`,
        "must contain finite numeric weights",
      );
  }
}
function shapeRecordArray(
  value: unknown,
  path: string,
  issues: RegistryValidationIssue[],
): void {
  if (!Array.isArray(value)) {
    shapeIssue(issues, path, "must be an array");
    return;
  }
  value.forEach((entry, index) => {
    if (!isRecord(entry))
      shapeIssue(issues, `${path}[${index}]`, "must be an object");
  });
}

function shapeContexts(
  value: unknown,
  path: string,
  expectedNamespace: ContextNamespace,
  issues: RegistryValidationIssue[],
): void {
  void expectedNamespace;
  if (!Array.isArray(value)) {
    shapeIssue(issues, path, "must be an array");
    return;
  }
  value.forEach((entry, index) => {
    const entryPath = `${path}[${index}]`;
    if (!isRecord(entry)) {
      shapeIssue(issues, entryPath, "must be an object");
      return;
    }
    shapeStatus(entry, entryPath, issues);
    if (
      !nonEmptyString(entry.name) &&
      entry.label !== undefined &&
      typeof entry.label !== "string"
    )
      shapeIssue(issues, `${entryPath}.label`, "must be a string when present");
    if (!CONTEXT_NAMES.has(entry.namespace as ContextNamespace))
      shapeIssue(issues, `${entryPath}.namespace`, "is not a known namespace");
    if (entry.ownerId !== undefined && !nonEmptyString(entry.ownerId))
      shapeIssue(
        issues,
        `${entryPath}.ownerId`,
        "must be a string when present",
      );
  });
}

function validateManifestShape(
  value: unknown,
  issues: RegistryValidationIssue[],
): value is CanonicalManifest {
  if (!isRecord(value)) {
    shapeIssue(issues, "manifest", "must be an object");
    return false;
  }
  const metadata = value.metadata;
  if (!isRecord(metadata)) {
    shapeIssue(issues, "metadata", "must be an object");
  } else {
    if (!nonEmptyString(metadata.schemaVersion))
      shapeIssue(
        issues,
        "metadata.schemaVersion",
        "must be a non-empty string",
      );
    if (!nonEmptyString(metadata.version))
      shapeIssue(issues, "metadata.version", "must be a non-empty string");
    if (metadata.fingerprint !== null && !nonEmptyString(metadata.fingerprint))
      shapeIssue(issues, "metadata.fingerprint", "must be a string or null");
    for (const field of ["sourceCommit", "methodologyCommit"] as const) {
      if (metadata[field] !== undefined && typeof metadata[field] !== "string")
        shapeIssue(
          issues,
          `metadata.${field}`,
          "must be a string when present",
        );
    }
    if (metadata.counts !== undefined && !isRecord(metadata.counts))
      shapeIssue(issues, "metadata.counts", "must be an object when present");
    if (isRecord(metadata.counts)) {
      for (const [key, count] of Object.entries(metadata.counts)) {
        if (!Number.isInteger(count) || (count as number) < 0)
          shapeIssue(
            issues,
            `metadata.counts.${key}`,
            "must be a non-negative integer",
          );
      }
    }
  }

  const arrays: Array<[string, string]> = [
    ["taxonomy", "taxonomy"],
    ["ontology", "ontology"],
    ["constructs", "construct"],
    ["facets", "facet"],
    ["items", "item"],
    ["mappings", "mapping"],
  ];
  const validArrays = new Set<string>();
  for (const [field] of arrays) {
    if (shapeArray(value, field, issues)) validArrays.add(field);
  }

  for (const [field, kind] of arrays) {
    if (!validArrays.has(field)) continue;
    for (const [index, raw] of (value[field] as unknown[]).entries()) {
      const path = `${field}[${index}]`;
      if (!isRecord(raw)) {
        shapeIssue(issues, path, "must be an object");
        continue;
      }
      shapeStatus(raw, path, issues);
      if (
        kind === "taxonomy" ||
        kind === "ontology" ||
        kind === "construct" ||
        kind === "facet"
      ) {
        if (!nonEmptyString(raw.name))
          shapeIssue(issues, `${path}.name`, "must be a non-empty string");
      }
      if (
        kind === "taxonomy" &&
        raw.ontologyId !== undefined &&
        !nonEmptyString(raw.ontologyId)
      )
        shapeIssue(
          issues,
          `${path}.ontologyId`,
          "must be a string when present",
        );
      if (kind === "construct") {
        if (!nonEmptyString(raw.taxonomyId))
          shapeIssue(
            issues,
            `${path}.taxonomyId`,
            "must be a non-empty string",
          );
        for (const fieldName of [
          "ontologyId",
          "layer",
          "negativePole",
          "positivePole",
        ] as const) {
          if (
            raw[fieldName] !== undefined &&
            typeof raw[fieldName] !== "string"
          )
            shapeIssue(
              issues,
              `${path}.${fieldName}`,
              "must be a string when present",
            );
        }
        if (raw.layer !== undefined && !ROOT_LAYERS.has(raw.layer as string))
          shapeIssue(issues, `${path}.layer`, "is not a known layer");
        if (raw.facetIds !== undefined)
          shapeStringArray(raw.facetIds, `${path}.facetIds`, issues);
      }
      if (kind === "facet" && !nonEmptyString(raw.constructId))
        shapeIssue(issues, `${path}.constructId`, "must be a non-empty string");
      if (kind === "item") {
        if (!nonEmptyString(raw.prompt))
          shapeIssue(issues, `${path}.prompt`, "must be a non-empty string");
        shapeStringArray(raw.constructIds, `${path}.constructIds`, issues);
        for (const fieldName of ["facetIds", "contextRefs"] as const) {
          if (raw[fieldName] !== undefined && !Array.isArray(raw[fieldName]))
            shapeIssue(
              issues,
              `${path}.${fieldName}`,
              "must be an array when present",
            );
        }
        if (raw.rootConstructWeights !== undefined)
          shapeWeights(
            raw.rootConstructWeights,
            `${path}.rootConstructWeights`,
            issues,
          );
        if (raw.localConstructWeights !== undefined)
          shapeWeights(
            raw.localConstructWeights,
            `${path}.localConstructWeights`,
            issues,
          );
        if (raw.role !== undefined && !ITEM_ROLES.has(raw.role as string))
          shapeIssue(issues, `${path}.role`, "is not a known item role");
        if (
          raw.responseType !== undefined &&
          typeof raw.responseType !== "string"
        )
          shapeIssue(
            issues,
            `${path}.responseType`,
            "must be a string when present",
          );
        if (raw.tier !== undefined && typeof raw.tier !== "string")
          shapeIssue(issues, `${path}.tier`, "must be a string when present");
        if (raw.moduleId !== undefined && !nonEmptyString(raw.moduleId))
          shapeIssue(
            issues,
            `${path}.moduleId`,
            "must be a string when present",
          );
        if (raw.facetIds !== undefined)
          shapeStringArray(raw.facetIds, `${path}.facetIds`, issues);
        for (const [refIndex, ref] of (Array.isArray(raw.contextRefs)
          ? raw.contextRefs
          : []
        ).entries()) {
          const refPath = `${path}.contextRefs[${refIndex}]`;
          if (
            !isRecord(ref) ||
            !CONTEXT_NAMES.has(ref.namespace as ContextNamespace) ||
            !nonEmptyString(ref.id)
          )
            shapeIssue(
              issues,
              refPath,
              "must contain a namespace and stable ID",
            );
        }
        if (raw.statementOptions !== undefined) {
          if (!Array.isArray(raw.statementOptions))
            shapeIssue(issues, `${path}.statementOptions`, "must be an array");
          else
            for (const [
              optionIndex,
              option,
            ] of raw.statementOptions.entries()) {
              const optionPath = `${path}.statementOptions[${optionIndex}]`;
              if (!isRecord(option))
                shapeIssue(issues, optionPath, "must be an object");
              else {
                if (!nonEmptyString(option.id) || !nonEmptyString(option.text))
                  shapeIssue(
                    issues,
                    optionPath,
                    "must contain non-empty id and text",
                  );
                shapeWeights(
                  option.rootConstructWeights,
                  `${optionPath}.rootConstructWeights`,
                  issues,
                );
              }
            }
        }
      }
      if (kind === "mapping") {
        shapeReference(raw.source, `${path}.source`, issues);
        shapeReference(raw.target, `${path}.target`, issues);
        if (!MAPPING_RELATIONS.has(raw.relation as string))
          shapeIssue(
            issues,
            `${path}.relation`,
            "is not a known mapping relation",
          );
        if (raw.weight !== undefined && !finiteNumber(raw.weight))
          shapeIssue(issues, `${path}.weight`, "must be finite when present");
        if (raw.contextRefs !== undefined) {
          if (!Array.isArray(raw.contextRefs))
            shapeIssue(issues, `${path}.contextRefs`, "must be an array");
          else
            for (const [refIndex, ref] of raw.contextRefs.entries()) {
              if (
                !isRecord(ref) ||
                !CONTEXT_NAMES.has(ref.namespace as ContextNamespace) ||
                !nonEmptyString(ref.id)
              )
                shapeIssue(
                  issues,
                  `${path}.contextRefs[${refIndex}]`,
                  "must contain a namespace and stable ID",
                );
            }
        }
      }
    }
  }

  const contexts = value.contexts;
  if (!isRecord(contexts)) {
    shapeIssue(issues, "contexts", "must be an object");
  } else {
    shapeContexts(contexts.taxonomy, "contexts.taxonomy", "taxonomy", issues);
    shapeContexts(contexts.question, "contexts.question", "question", issues);
  }

  for (const field of [
    "nodes",
    "relations",
    "productionProfiles",
    "modifierContracts",
    "specialistModules",
    "specialistCandidates",
  ] as const) {
    if (value[field] !== undefined)
      shapeRecordArray(value[field], field, issues);
  }
  if (Array.isArray(value.nodes)) {
    for (const [index, raw] of value.nodes.entries()) {
      const path = `nodes[${index}]`;
      if (!isRecord(raw)) {
        shapeIssue(issues, path, "must be an object");
        continue;
      }
      shapeStatus(raw, path, issues);
      for (const field of [
        "canonicalName",
        "conceptualKind",
        "canonicalDefinition",
        "version",
      ] as const)
        if (!nonEmptyString(raw[field]))
          shapeIssue(issues, `${path}.${field}`, "must be a non-empty string");
    }
  }
  if (Array.isArray(value.productionProfiles)) {
    for (const [index, raw] of value.productionProfiles.entries()) {
      const path = `productionProfiles[${index}]`;
      if (!isRecord(raw)) {
        shapeIssue(issues, path, "must be an object");
        continue;
      }
      for (const field of ["id", "nodeId", "labelId", "version"] as const)
        if (!nonEmptyString(raw[field]))
          shapeIssue(issues, `${path}.${field}`, "must be a non-empty string");
      shapeStringArray(
        raw.rootConstructIds,
        `${path}.rootConstructIds`,
        issues,
      );
      shapeStringArray(
        raw.requiredRootConstructIds,
        `${path}.requiredRootConstructIds`,
        issues,
      );
      shapeWeights(raw.centroid, `${path}.centroid`, issues);
      if (!MEASUREMENT_STATUSES.has(raw.status as string))
        shapeIssue(issues, `${path}.status`, "is not a known status");
    }
  }
  for (const field of [
    "activeCoreItemIds",
    "conditionalSpecialistItemIds",
  ] as const)
    if (value[field] !== undefined)
      shapeStringArray(value[field], field, issues);

  return issues.every((entry) => entry.code !== "invalid-shape");
}

function issue(
  issues: RegistryValidationIssue[],
  value: RegistryValidationIssue,
): void {
  issues.push(value);
}

function allEntities(manifest: CanonicalManifest): readonly CanonicalEntity[] {
  const result: CanonicalEntity[] = [];
  for (const kind of ENTITY_KINDS) {
    if (kind === "context") {
      result.push(...manifest.contexts.taxonomy, ...manifest.contexts.question);
    } else if (kind === "taxonomy") {
      result.push(...manifest.taxonomy);
    } else if (kind === "ontology") {
      result.push(...manifest.ontology);
    } else if (kind === "construct") {
      result.push(...manifest.constructs);
    } else if (kind === "facet") {
      result.push(...manifest.facets);
    } else if (kind === "item") {
      result.push(...manifest.items);
    } else {
      result.push(...manifest.mappings);
    }
  }
  return result;
}

function checkDuplicateIds(
  manifest: CanonicalManifest,
  issues: RegistryValidationIssue[],
): void {
  const seen = new Map<StableId, { kind: CanonicalEntityKind; path: string }>();
  for (const [kind, entities] of [
    ["taxonomy", manifest.taxonomy],
    ["ontology", manifest.ontology],
    ["construct", manifest.constructs],
    ["facet", manifest.facets],
    ["item", manifest.items],
    ["mapping", manifest.mappings],
    ["context", [...manifest.contexts.taxonomy, ...manifest.contexts.question]],
  ] as const) {
    for (const [index, entity] of entities.entries()) {
      const path = `${kind}[${index}]`;
      if (!entity.id.trim()) {
        issue(issues, {
          code: "duplicate-id",
          kind,
          path,
          message: `${path} has an empty stable ID`,
        });
        continue;
      }
      const prior = seen.get(entity.id);
      if (prior) {
        issue(issues, {
          code: "duplicate-id",
          kind,
          id: entity.id,
          path,
          message: `Stable ID ${entity.id} is declared by ${prior.path} and ${path}`,
        });
      } else {
        seen.set(entity.id, { kind, path });
      }
    }
  }
}

function checkDuplicateAuthority(
  manifest: CanonicalManifest,
  issues: RegistryValidationIssue[],
): void {
  const seen = new Map<string, { kind: CanonicalEntityKind; id: StableId }>();
  for (const entity of allEntities(manifest)) {
    const authorityKey = entity.authorityKey;
    if (!authorityKey) continue;
    const prior = seen.get(authorityKey);
    if (prior) {
      issue(issues, {
        code: "duplicate-authority",
        kind: entityKindOf(manifest, entity),
        id: entity.id,
        message: `Authority key ${authorityKey} is claimed by ${prior.kind}/${prior.id} and ${entity.id}`,
      });
    } else {
      seen.set(authorityKey, {
        kind: entityKindOf(manifest, entity),
        id: entity.id,
      });
    }
  }
}

function entityKindOf(
  manifest: CanonicalManifest,
  entity: CanonicalEntity,
): CanonicalEntityKind {
  if (manifest.taxonomy.includes(entity as never)) return "taxonomy";
  if (manifest.ontology.includes(entity as never)) return "ontology";
  if (manifest.constructs.includes(entity as never)) return "construct";
  if (manifest.facets.includes(entity as never)) return "facet";
  if (manifest.items.includes(entity as never)) return "item";
  if (manifest.mappings.includes(entity as never)) return "mapping";
  return "context";
}
function isCanonicalEntityKind(
  kind: CanonicalReferenceKind,
): kind is CanonicalEntityKind {
  return ENTITY_KINDS.includes(kind as CanonicalEntityKind);
}

function lookupReference(
  registry: CanonicalRegistry,
  reference: CanonicalReference,
): CanonicalEntity | IdeologyNode | undefined {
  if (reference.kind === "node")
    return registry.manifest.nodes?.find((node) => node.id === reference.id);
  if (!isCanonicalEntityKind(reference.kind)) return undefined;
  return registry.get(reference.kind, reference.id);
}

function checkReference(
  registry: CanonicalRegistry,
  reference: CanonicalReference,
  issues: RegistryValidationIssue[],
  ownerKind: CanonicalEntityKind,
  ownerId: StableId,
  path: string,
): void {
  if (reference.kind !== "node" && !isCanonicalEntityKind(reference.kind)) {
    issue(issues, {
      code: "missing-reference",
      kind: ownerKind,
      id: ownerId,
      path,
      message: `Reference ${reference.kind}/${reference.id} uses an unknown entity kind`,
    });
    return;
  }
  if (!lookupReference(registry, reference)) {
    issue(issues, {
      code: "missing-reference",
      kind: ownerKind,
      id: ownerId,
      path,
      message: `Reference ${reference.kind}/${reference.id} does not resolve`,
    });
  }
}

function checkContextReference(
  registry: CanonicalRegistry,
  reference: { readonly namespace: ContextNamespace; readonly id: StableId },
  issues: RegistryValidationIssue[],
  ownerKind: CanonicalEntityKind,
  ownerId: StableId,
  path: string,
): void {
  if (!CONTEXT_NAMESPACES.includes(reference.namespace)) {
    issue(issues, {
      code: "context-namespace",
      kind: ownerKind,
      id: ownerId,
      path,
      message: `Context reference ${reference.id} uses an unknown namespace`,
    });
    return;
  }
  const context = registry
    .list("context")
    .find((candidate) => candidate.id === reference.id);
  if (!context) {
    issue(issues, {
      code: "missing-reference",
      kind: ownerKind,
      id: ownerId,
      path,
      message: `Context reference ${reference.namespace}/${reference.id} does not resolve`,
    });
  } else if (context.namespace !== reference.namespace) {
    issue(issues, {
      code: "context-namespace",
      kind: ownerKind,
      id: ownerId,
      path,
      message: `Context reference ${reference.id} belongs to ${context.namespace}, not ${reference.namespace}`,
    });
  }
}

function checkReferences(
  manifest: CanonicalManifest,
  registry: CanonicalRegistry,
  issues: RegistryValidationIssue[],
): void {
  for (const taxonomy of manifest.taxonomy) {
    if (taxonomy.ontologyId) {
      checkReference(
        registry,
        { kind: "ontology", id: taxonomy.ontologyId },
        issues,
        "taxonomy",
        taxonomy.id,
        `taxonomy/${taxonomy.id}/ontologyId`,
      );
    }
  }
  for (const construct of manifest.constructs) {
    checkReference(
      registry,
      { kind: "taxonomy", id: construct.taxonomyId },
      issues,
      "construct",
      construct.id,
      `construct/${construct.id}/taxonomyId`,
    );
    if (construct.ontologyId) {
      checkReference(
        registry,
        { kind: "ontology", id: construct.ontologyId },
        issues,
        "construct",
        construct.id,
        `construct/${construct.id}/ontologyId`,
      );
    }
    for (const facetId of construct.facetIds ?? []) {
      checkReference(
        registry,
        { kind: "facet", id: facetId },
        issues,
        "construct",
        construct.id,
        `construct/${construct.id}/facetIds`,
      );
    }
  }
  for (const facet of manifest.facets) {
    checkReference(
      registry,
      { kind: "construct", id: facet.constructId },
      issues,
      "facet",
      facet.id,
      `facet/${facet.id}/constructId`,
    );
  }
  for (const item of manifest.items) {
    for (const constructId of item.constructIds) {
      checkReference(
        registry,
        { kind: "construct", id: constructId },
        issues,
        "item",
        item.id,
        `item/${item.id}/constructIds`,
      );
    }
    for (const facetId of item.facetIds ?? []) {
      checkReference(
        registry,
        { kind: "facet", id: facetId },
        issues,
        "item",
        item.id,
        `item/${item.id}/facetIds`,
      );
    }
    for (const [index, contextRef] of (item.contextRefs ?? []).entries()) {
      checkContextReference(
        registry,
        contextRef,
        issues,
        "item",
        item.id,
        `item/${item.id}/contextRefs[${index}]`,
      );
    }
  }
  for (const mapping of manifest.mappings) {
    checkReference(
      registry,
      mapping.source,
      issues,
      "mapping",
      mapping.id,
      `mapping/${mapping.id}/source`,
    );
    checkReference(
      registry,
      mapping.target,
      issues,
      "mapping",
      mapping.id,
      `mapping/${mapping.id}/target`,
    );
    for (const [index, contextRef] of (mapping.contextRefs ?? []).entries()) {
      checkContextReference(
        registry,
        contextRef,
        issues,
        "mapping",
        mapping.id,
        `mapping/${mapping.id}/contextRefs[${index}]`,
      );
    }
  }
  for (const [namespace, contexts] of [
    ["taxonomy", manifest.contexts.taxonomy],
    ["question", manifest.contexts.question],
  ] as const) {
    for (const context of contexts) {
      if (context.namespace !== namespace) {
        issue(issues, {
          code: "context-namespace",
          kind: "context",
          id: context.id,
          path: `contexts.${namespace}`,
          message: `Context ${context.id} is stored in ${namespace} but declares ${context.namespace}`,
        });
      }
      if (context.ownerId) {
        const owner = allEntities(manifest).some(
          (candidate) => candidate.id === context.ownerId,
        );
        if (!owner) {
          issue(issues, {
            code: "missing-reference",
            kind: "context",
            id: context.id,
            path: `context/${context.id}/ownerId`,
            message: `Context owner ${context.ownerId} does not resolve`,
          });
        }
      }
    }
  }
}

function checkMappings(
  manifest: CanonicalManifest,
  registry: CanonicalRegistry,
  issues: RegistryValidationIssue[],
): void {
  for (const mapping of manifest.mappings) {
    if (!mapping.relation) {
      issue(issues, {
        code: "invalid-mapping",
        kind: "mapping",
        id: mapping.id,
        path: `mapping/${mapping.id}/relation`,
        message: "Mapping relation is required",
      });
    }
    if (mapping.weight !== undefined && !Number.isFinite(mapping.weight)) {
      issue(issues, {
        code: "invalid-mapping",
        kind: "mapping",
        id: mapping.id,
        path: `mapping/${mapping.id}/weight`,
        message: "Mapping weight must be finite",
      });
    }
    const source = lookupReference(registry, mapping.source);
    const target = lookupReference(registry, mapping.target);
    if (mapping.relation === "measures") {
      const validShape =
        mapping.source.kind === "item" &&
        (mapping.target.kind === "construct" ||
          mapping.target.kind === "facet");
      if (!validShape) {
        issue(issues, {
          code: "invalid-mapping",
          kind: "mapping",
          id: mapping.id,
          path: `mapping/${mapping.id}`,
          message:
            "A measures mapping must run from an item to a construct or facet",
        });
      }
      if (mapping.weight === 0) {
        issue(issues, {
          code: "invalid-mapping",
          kind: "mapping",
          id: mapping.id,
          path: `mapping/${mapping.id}/weight`,
          message: "A measures mapping cannot have zero weight",
        });
      }
    }
    if (!source || !target) continue;
  }
}

function checkRoleLeakage(
  manifest: CanonicalManifest,
  registry: CanonicalRegistry,
  issues: RegistryValidationIssue[],
): void {
  for (const entity of allEntities(manifest)) {
    if (
      entity.publicRoleStatus === "context" &&
      (entity.measurementStatus === "validated" ||
        entity.measurementStatus === "candidate")
    ) {
      issue(issues, {
        code: "role-leakage",
        kind: entityKindOf(manifest, entity),
        id: entity.id,
        message: `Context entry ${entity.id} cannot claim ${entity.measurementStatus} measurement status`,
      });
    }
  }
  for (const mapping of manifest.mappings) {
    if (mapping.relation !== "measures") continue;
    const source = lookupReference(registry, mapping.source);
    const target = lookupReference(registry, mapping.target);
    if (
      source?.publicRoleStatus === "context" ||
      target?.publicRoleStatus === "context"
    ) {
      issue(issues, {
        code: "role-leakage",
        kind: "mapping",
        id: mapping.id,
        path: `mapping/${mapping.id}`,
        message:
          "Context entries cannot participate in scored measures mappings",
      });
    }
  }
}

export function validateCanonicalManifest(
  manifest: CanonicalManifest,
): RegistryValidationResult {
  const issues: RegistryValidationIssue[] = [];
  if (!validateManifestShape(manifest, issues)) {
    return { valid: false, ok: false, issues };
  }
  let registry: CanonicalRegistry;
  try {
    registry = createCanonicalRegistry(manifest);
    checkDuplicateIds(manifest, issues);
    checkDuplicateAuthority(manifest, issues);
    checkReferences(manifest, registry, issues);
    checkMappings(manifest, registry, issues);
    checkRoleLeakage(manifest, registry, issues);
  } catch (error) {
    shapeIssue(
      issues,
      "manifest",
      `could not be validated safely (${error instanceof Error ? error.message : "unknown error"})`,
    );
  }
  return { valid: issues.length === 0, ok: issues.length === 0, issues };
}

export function validateCanonicalRegistry(
  registry: CanonicalRegistry,
): RegistryValidationResult {
  if (!isRecord(registry)) {
    const issues: RegistryValidationIssue[] = [];
    shapeIssue(issues, "registry", "must be an object");
    return { valid: false, ok: false, issues };
  }
  return validateCanonicalManifest(registry.manifest);
}

export const validateManifest = validateCanonicalManifest;

export function isValidCanonicalManifest(manifest: CanonicalManifest): boolean {
  return validateCanonicalManifest(manifest).valid;
}

export function assertValidCanonicalManifest(
  manifest: CanonicalManifest,
): asserts manifest is CanonicalManifest {
  const result = validateCanonicalManifest(manifest);
  if (!result.valid) {
    throw new Error(
      `Invalid canonical manifest:\n${result.issues
        .map((entry) => `${entry.code}: ${entry.message}`)
        .join("\n")}`,
    );
  }
}
