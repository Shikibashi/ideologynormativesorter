# v2 Implementation Plan

## Current status

Phases 0 through 10 are complete when the generated Phase 10 behavioral receipt
is GO. Phase 11 is the next permitted implementation phase, and only after the
Phase 10 receipt is current.

## Proposed sequence

1. Phase 1 `packages/contracts` and `packages/content`: define v2 contracts, schemas, and compiler boundary. Complete.
2. Phase 2 `v2/content` and `packages/content`: extract audited final canonical content and generate reports. Complete.
3. Phase 3 `packages/engine`: normalize responses and emit explicit item contribution records. Complete.
4. Phase 4 `packages/engine`: aggregate constructs, calculate evidence/support/uncertainty, and abstain explicitly. Complete.
5. Phase 5 `packages/engine`: match primary profiles and apply constitutive gates. Next.
6. Phase 6 `packages/engine`: match modifiers from construct results.
7. Phase 7 `packages/engine`: score specialist profiles and module outputs.
8. Phase 8 `packages/contracts` and `packages/engine`: add downstream diagnostics and traceability.
9. Phase 9: compose the unified assessment result contract.
9. Phase 9 `packages/engine`: compose the unified assessment result contract. Complete.
10. Phase 10 `reference/v1`, scripts, and tests: freeze the behavioral oracle, run differential gates, and issue the migration receipt. Complete when the receipt is current.
11. Phase 11: follow the next authorized phase specification after this receipt is current. Do not infer UI, scoring, or deployment work from Phase 10.

## Phase 0 required artifacts produced

- `docs/v2/architecture.md`
- `docs/v2/measurement-contract.md`
- `docs/v2/source-classification.md`
- `docs/v2/migration-decisions.md`
- `docs/v2/known-defects.md`

## Required per-phase evidence

Each completed phase must update `docs/v2/implementation-plan.md` and include

- concrete file list
- contract/fixtures generated
- invariants proven
- unresolved gaps

## Implementation constraints

- No v1 code imports from `src/*` into deployable v2 runtime.
- No editorials or overlays in runtime scoring.
- No partial scoring in web app.
- No silent coercion of unknown status.

## Dependency graph to enforce

```text
contracts
  ↑
content → engine → view-model → web
contracts ← research-worker
```

## Deviation handling

Any decision that alters an already finalized source behavior requires explicit entry under:

- `docs/v2/migration-decisions.md`
- `docs/v2/known-defects.md`

## Historical Phase 0 blockers

1. Extract canonical TS authority into v2 JSON source format.
2. Formalize response/abstention status enums with exhaustive test vectors.
3. Build authoritative fixture strategy for score/abstention tie and gating behavior.

## Phase 1 status

Completed scope:

- Added `v2/packages/contracts` contract surface for IDs, versions, responses, content records, scoring gates, uncertainty, and result envelopes.
- Added `v2/packages/content` schema + semantic validation utilities and deterministic serialization/fingerprint helpers.
- Added machine-readable JSON schema artifacts under `v2/packages/content/schemas`.
- Added synthetic fixture in `v2/packages/content/fixtures/synthetic/manifest.json` for deterministic contract tests.
- Added architecture-enforcement test `tests/architecture/v2-phase1.spec.ts` for schema/semantics/fingerprint and clean-room import checks.
- Added documentation additions for phase-1 contracts, content schema, and versioning in `docs/v2`.

Phase 1 invariants proven:

- Distinct version contracts are separated and typed.
- Invalid references/mappings fail semantic validation.
- Deterministic serialization and fingerprint are stable under reordering of semantic arrays and sensitive to scoring-change edits.
- v2 package import graph includes no direct references to forbidden legacy `src/*` runtime paths.

## Phase 2 status

Phase 2 audited extraction is complete: the generated source tree, inventory,
mapping audit, compatibility classification, reconciliation report, and
determinism tests pass. The extracted bundle is an input contract for Phase 3;
no scoring kernel, result calculation, UI, or deployment path belongs in this phase.

## Phase 3 status

Phase 3 is complete in `v2/packages/engine`: strict response validation,
deterministic duplicate rejection, missingness preservation, Likert and
statement-choice normalization, salience handling, and explicit per-item
contribution generation are complete. The generated Phase 2 bundle is used by
real-content smoke tests and no v1 runtime module is imported by the engine.

Phase 4 consumes these contribution records. Profile, modifier, specialist,
result assembly, UI, and deployment remain out of scope for Phase 3.

## Phase 4 completion

Phase 4 construct aggregation is implemented in
v2/packages/engine/src/constructs/. The layer computes explicit construct
numerators, raw mapping-weight denominators, evidence partitions, support,
uncertainty, and construct-level abstention. It is covered by synthetic,
full-corpus, determinism, bounds, evidence-balance, salience, reverse,
multi-construct, statement-choice, and v1 answered-arithmetic tests.

The next permitted work is Phase 5 profile matching and primary result
composition. Do not add modifiers, specialist final scoring, UI, deployment,
or a final assessment result to the Phase 4 layer.

## Phase 5 completion

Phase 5 primary profile matching is implemented in
\`v2/packages/engine/src/profiles/\`. It consumes only \`ConstructAssessment\`,
evaluates explicit profile requirements and constitutive gates, computes
weighted RMS distance and bounded similarity, preserves profile abstention,
and emits deterministic ranking and tie metadata. Modifier matching,
specialist scoring, UI, deployment, and final assessment composition remain
out of scope.
## Phase 6 completion note

Phase 6 modifier matching is implemented in `v2/packages/engine/src/modifiers`.
It consumes only Phase 4 `ConstructAssessment` plus canonical modifier content,
returns all 24 canonical modifiers with explicit availability/status, and does
not activate specialist scoring or UI work. The next authorized phase was Phase
7 specialist scoring and module activation; Phase 8 is now the active completed
diagnostics boundary and Phase 9 is the next authorized result-assembly phase.

## Phase 8 completion target

Phase 8 adds downstream-only contribution traces, construct diagnostics,
explicit-relation divergence analysis, domain summaries, and structured
profile/modifier/specialist explanations. It must not add a scoring path or
change any Phase 3-7 numeric or ranking output.

## Phase 9 completion target

Phase 9 establishes `scoreAssessment()` as the only supported end-to-end v2
scoring entrypoint. It composes the Phase 3-8 authorities without duplicate
scoring math, binds every result to the canonical version tuple, emits one
immutable `AssessmentResult`, validates references and numeric bounds, and
serializes results deterministically. UI, persistence, deployment, and v1
traffic remain out of scope.

## Phase 11 status

Phase 11 is implemented as an isolated web application and view-model boundary. The Phase 10 behavioral receipt remains current; the web build consumes the existing canonical fingerprint without changing content or scoring. Browser, accessibility, visual, component, architecture, claim-boundary, typecheck, lint, and frozen Phase 1-10 v2 verification gates are recorded in the Phase 11 completion report.

## Phase 12 status

Phase 12 adds the versioned local save envelope, explicit private import/export,
result-only public share projection, exact-ID legacy persistence migration
boundaries, corruption handling, storage adapters, browser resume/import/export
controls, and persistence architecture tests. It does not alter canonical
content or implement a second scoring path. Generated size measurements are in
`docs/v2/persistence-size-report.md`; the next authorized phase is Phase 13
research and operational integration only after the Phase 12 receipt is GO.
The Phase 12 completion receipt is `docs/v2/persistence-completion-report.md`.

## Phase 13 status

Phase 13 adds research-only infrastructure: explicit consent, a versioned raw-response envelope, isolated Worker validation, local D1 idempotency, and replay/export contracts. It does not alter scoring, result schemas, UI fielding defaults, deployment, or production writes. The next phase is Phase 14 offline analysis.
