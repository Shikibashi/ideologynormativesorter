# Known Defects to document and avoid in v2

## 1) Incompatible scoring semantics

- Location: `src/scoring/normalize.ts`, `src/scoring/aggregate.ts`, `src/production/score.ts`
- Defect: legacy and production semantics differ on salience handling and result exposure.
- v2 treatment: enforce single salience model in one result path.

## 2) Implicit mapping fallbacks

- Location: `dimensionDefinitions` in `src/production/score.ts`
- Defect: item-to-construct mapping can be inferred from multiple fallback sources (`constructIds`, taxonomy relationships, labels, statement options), weakening content authority.
- v2 treatment: compilation failure if explicit mapping is missing.

## 3) Dual result architecture

- Location: `src/scoring/index.ts` and legacy `ResultProfile` export
- Defect: one execution path emits legacy diagnostics and a nested production result (`production` field), causing interpretation drift.
- v2 treatment: single `AssessmentResult` contract only.

## 4) Compatibility-compatibility scaffolding in domain projections

- Location: `src/domain/selectors.ts`
- Defect: old version compatibility, aliases, and legacy status fields are mixed into core runtime projections.
- v2 treatment: move compatibility into `reference/v1` only.

## 5) Runtime dependence on legacy TS authority

- Location: `src/domain/canonicalManifest.ts` importing `canonicalData.ts`
- Defect: generated TypeScript is treated as runtime authority and coupled to app imports.
- v2 treatment: compile pure JSON manifest as input and freeze generated artifact.

## 6) Research contract coupling to runtime scoring logic

- Location: research worker and v1 result contracts
- Defect: partial overlap between scoring and transport concerns in historical workflow.
- v2 treatment: keep contracts versioned and transport-only in worker/service.

## 7) Alias and legacy import coupling

- Location: `vite.config.ts` and selector import surface
- Defect: legacy import alias to `./data/questions` can bypass intended content boundary.
- v2 treatment: remove alias in v2 app config.

## 8) Reliability label misuse

- Location: `src/scoring/reliability.ts` and UI text paths
- Defect: current UX may imply reliability statistics from a single administration.
- v2 treatment: use evidence-coverage terminology; reserve psychometric reliability terms for formal studies.

## 9) Ambiguous abstention handling

- Location: answer conversion flow in `src/scoring/index.ts` and production normalization
- Defect: some missing or skipped states are collapsed into neutral values in places.
- v2 treatment: missing/refused/abstain must be first-class, persistent reason codes.

## 10) Specialist fallback behavior

- Location: specialist module selection and assignment
- Defect: assignment and evidence gating rely on v1 control-state assumptions (participant/resume behavior) and can drift from content-only definitions.
- v2 treatment: isolate specialist module assignment and gating in contracts+engine and use explicit persisted provenance.

## Phase 2 content corrections

## Phase 10 lockout

The Phase 10 behavior ledger and `docs/v2/known-defect-lockout.md` turn these
defects into release-gate lockouts. A legacy behavior cannot be restored merely
to obtain differential parity. The v2 reference oracle remains outside the
runtime dependency graph.

- Statement-choice fallback mappings were removed. Every scored option now owns an explicit mapping; incomplete option mappings are rejected.
- Specialist-local constructs are explicit, module-scoped records rather than inferred from overlay filenames or unqualified IDs.
- The historical seven-module experimental specialist overlay was not extracted. The approved nine-module canonical export is authoritative; the excluded overlay remains historical evidence.
