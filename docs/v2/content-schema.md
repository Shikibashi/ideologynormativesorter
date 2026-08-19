# v2 Content Schema (Phase 1)

`v2/packages/content` owns schema and semantic validation for declarative content.

## JSON schemas

- `manifest.schema.json`
- `content-schema.schema.json`
- `domain.schema.json`
- `construct.schema.json`
- `item.schema.json`
- `diagnostic-relation.schema.json`
- `profile.schema.json`
- `modifier.schema.json`
- `specialist.schema.json`
- `ontology-node.schema.json`
- `ontology-relation.schema.json`
- `contribution.schema.json`
- `requirement.schema.json`
- `gate.schema.json`
- `specialist-module.schema.json`
- `specialist-candidate.schema.json`
- `specialist-assignment.schema.json`
- `provenance-source.schema.json`
- `manifest.schema.json`

The schemas define:

- namespace boundaries (`domains`, `constructs`, `items`, `profiles`, `modifiers`, `specialists`, `ontology*`),
- allowed response types,
- required metadata fields,
- minimal type constraints (weights, IDs, enum domains, and required lists).

## Validation pipeline

Phase 1 validation has two layers:

1. `validateContentSchema`
   - structural validation from schema-driven expectations,
   - shape checks and basic field-type checks,
   - explicit empty/required array enforcement.
2. `validateContentSemantics`
   - cross-reference integrity (construct/domain/item/profile/node/gate references),
   - duplicate identifier checks by namespace,
   - cross-namespace ID collision checks,
   - profile gate topology checks and specialist-item linkage checks,
   - explicit statement-choice mapping enforcement.

Validation intentionally fails if any required mapping or reference is missing.

## Phase 2 source layout

The audited source of truth is split into `v2/content/manifest.json` plus the
construct, domain, item, profile, specialist, ontology, and provenance records
named by that manifest. The Phase 2 compiler executes the declared JSON schemas
with AJV before applying the cross-record semantic validator. It emits only
derived artifacts under `v2/generated/`; those artifacts are never authoritative.
