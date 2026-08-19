# Source Classification (v1 reuse catalog)

Ledger version: `source-classification-v2.phase10.1`.

Every reusable v1 element is classified into exactly one bucket.

## 1) Classification legend

- MUST_PRESERVE: retained as canonical source-of-authority facts or invariants
- INTENTIONAL_CHANGE: reused for behavior intent, but recreated under v2 contracts/packages
- KNOWN_DEFECT: do not preserve; must not be reproduced
- RESEARCH_ONLY: valuable for governance/research but not runtime implementation
- ARCHIVE_ONLY: historical record; preserved in place but not imported by v2 runtime

## 2) Canonical content and contract foundations

| v1 element | Classification | Rationale |
|---|---|---|
| `research-worker/generated/canonical-manifest.json` | MUST_PRESERVE | Current content artifact with manifest version, schema version, fingerprint |
| `src/domain/canonicalManifest.ts` | INTENTIONAL_CHANGE | Canonical shape definitions and constants are reused as behavioral model, but implementation must be re-authored in v2 content package |
| `src/domain/canonicalMigration.ts` | MUST_PRESERVE | Roster and count invariants are a valid boundary for migration and audit |
| `src/domain/registryValidation.ts` | INTENTIONAL_CHANGE | Validation semantics are preserved but moved behind v2 compiler API |
| `src/domain/canonicalSerialization.ts` | MUST_PRESERVE | Canonical serialization and SHA-256 behavior is authoritative for deterministic content bundles |
| `src/production/contracts.ts` | INTENTIONAL_CHANGE | Reuse contract naming pattern but split into explicit separate version fields in v2 |
| `src/research/contractSnapshot.ts` | MUST_PRESERVE | Research metadata/version model and forbidden-key scan are canonical for research envelope |

## 3) Scoring and behavior components

| v1 element | Classification | Rationale |
|---|---|---|
| `src/scoring/normalize.ts` | INTENTIONAL_CHANGE | Keep numerical normalization semantics, but unify with production and remove parallel interpretation |
| `src/scoring/aggregate.ts` | INTENTIONAL_CHANGE | Formula decomposition is useful but must operate on single authoritative response contract |
| `src/scoring/labelMatch.ts` | INTENTIONAL_CHANGE | Matching logic is reusable conceptually with stricter gates and single-version output |
| `src/scoring/reliability.ts` | RESEARCH_ONLY | Terminology is not stable psychometric reliability yet; keep only for analysis context |
| `src/production/score.ts` | KNOWN_DEFECT | Current mapping fallback logic conflicts with v2 no-fallback rule; do not port directly |
| `src/scoring/index.ts` | KNOWN_DEFECT | Dual-path result assembly (legacy + production) is forbidden in v2 |
| `src/specialist/canonicalAdapter.ts` and `src/specialist/index.ts` | INTENTIONAL_CHANGE | Reusable specialist scoring model and evidence gates, but decouple from v1 module imports and old assignment coupling |

## 4) UI/application and orchestration

| v1 element | Classification | Rationale |
|---|---|---|
| `src/app/useAppController.ts` | KNOWN_DEFECT | Staging/legacy bootstrap, resume, and compatibility branching are not a runtime boundary for v2 |
| `src/app/useApp*State.ts` | INTENTIONAL_CHANGE | Stage-state ideas are useful for new web app, but no scoring in web layer |
| `src/App.tsx` and root UI components | ARCHIVE_ONLY | Preserve as behavior examples and UX references only |

## 5) Research transport

| v1 element | Classification | Rationale |
|---|---|---|
| `research-worker/src/worker.mjs` | INTENTIONAL_CHANGE | Request validation boundary and metadata checks should remain in research service, but scoring logic removed from service |
| `src/research/contractSnapshot.ts` | MUST_PRESERVE | Canonical research contract semantics are authoritative and explicit |
| `src/research/index.ts` and payload wiring | RESEARCH_ONLY | Useful for v1 integration tests and fixtures only |

## 6) Legacy data overlays and editorial stacks

| v1 element | Classification | Rationale |
|---|---|---|
| `src/data/*` | ARCHIVE_ONLY | Finalized text and historical correction layers are provenance; executable overlays must not be imported by v2 engine |
| `docs/` (existing markdown corpus) | ARCHIVE_ONLY | Historical rationale and editorial notes are preserved as reference context |
| `docs/clean-rebuild/reference-lock/*` | RESEARCH_ONLY | Use for reference-lock governance and migration evidence, not scoring runtime |
| `docs/clean-rebuild/cutover-runbook.md` | RESEARCH_ONLY | Useful for operational planning and staging gates only |

## 7) Defect-classified non-reuse list

The following are explicitly excluded from direct reuse:

- v1/legacy aliasing compatibility layers in selectors
- legacy result split and dual scoring exports
- production fallback mapping in `dimensionDefinitions`
- Vite alias `./data/questions` dependency

## 8) Phase 2 extraction authorities

Phase 2 uses the final approved v1 export as the content authority and re-authors
that final state into `v2/content`. Historical v1 overlays remain evidence only.

| Content category | Extraction authority | Secondary evidence | v2 owner |
|---|---|---|---|
| Constructs, item mappings, primary profiles, modifiers, specialist modules, ontology | `research-worker/generated/canonical-manifest.json#manifest` | `src/domain/canonicalData.ts` and bounded v1 data modules | Declarative JSON under `v2/content/` |
| Domains | `src/data/domains.ts` | Domain IDs referenced by the canonical manifest | `v2/content/domains.json` |
| Specialist assignment roster | `src/specialist/index.ts` | Canonical manifest module declarations | `v2/content/specialists/assignment.json` |
| Provenance citations | Citation records embedded in the canonical manifest | Historical review and migration documents | `v2/content/provenance/sources.json` |

The manifest is a bounded extraction input, not a v2 runtime dependency. The
compiler consumes only the declarative v2 source tree.
