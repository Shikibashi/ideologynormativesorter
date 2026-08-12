# Ideology Mapping Validation Audit Report

**Status:** Non-empirical delivery complete (WP0–WP8 machine artifacts).  
**Generated:** 2026-07-19  
**Release id pattern:** `release:{bankVersion}:{scoringVersion}`  
**Empirical gate:** `insufficient-data` (no consented respondent pilot).  
**Expert gate:** `in-review` (provisional-agent dual reviews only; qualified-expert spot-checks pending). Not marked `fail` — `releaseGate()` blocks until expert becomes `pass`.

This human report **indexes** machine-readable ledgers under `src/validation/mappingAudit/`. It does **not** replace them.

## Immutable sources

- Spec: `.gjc/_session-019f76f4-550b-7000-9e98-23225e8176ee/specs/deep-interview-ideology-mapping-validation.md`
- Consensus plan: `.gjc/_session-019f76f4-550b-7000-9e98-23225e8176ee/plans/ralplan/019f76f4-550b-7000-9e98-23225e8176ee/pending-approval.md`

## Pipeline identity

Axis-mediated only: selectable responses → signed axis contributions → centroid neighborhood match.  
`IdeologyAffinity` / `question.ideologyAffinities` remain quarantined (type-only / unused).

Inventory sets (no double-count):

| Set | Role |
|---|---|
| `raw` | Unmodified bank exports |
| `overlay` | Semantic correction / needs-rewrite maps |
| `effective-retained` | Overlay applied, includes `active===false` |
| `effective-active` | Public quiz / scoring pool |
| `post-correction-*` | After WP5 mutations (main overlay already applied) |

## Machine artifacts (authoritative)

| Artifact | Path | Stable id |
|---|---|---|
| Types / enums | `src/validation/mappingAudit/types.ts` | n/a |
| Freeze | `src/validation/mappingAudit/inventory/freeze.ts` | `inv:*` |
| Contributions | `src/validation/mappingAudit/manifests/responseContributions.ts` | `rc:{questionId}:{responseKey}:{axisId}` |
| Dossiers | `src/validation/mappingAudit/dossiers/index.ts` | `dossier:{labelId}` |
| Claims | `src/validation/mappingAudit/dossiers/claims.ts` | `claim:{labelId}:{fieldPath}:{n}` |
| Citations | `src/validation/mappingAudit/citations/registry.ts` | `cite:*` |
| Findings | `src/validation/mappingAudit/findings/ledger.ts` | `finding:{issueClass}:{subjectId}:{n}` |
| Reviews | `src/validation/mappingAudit/reviews/records.ts` | `review:{findingId}:{role}:{seq}` |
| Lifecycle | `src/validation/mappingAudit/labels/lifecycle.ts` | `life:{labelId}` |
| Separability | `src/validation/mappingAudit/separability/diagnostics.ts` | `sep:{analysis}:{id}` |
| Release | `src/validation/mappingAudit/release/summary.ts` | `release:{bankVersion}:{scoringVersion}` |

## WP0 Freeze (live recount)

- Main raw / effective-active / retained: see `WP0_FREEZE`
- Module: 123 · Statement: 17 · Labels: 118 · Axes: 26 · Families: 19
- Overlay corrections: 101 · Needs-rewrite deactivated: 80
- Versions: `QUESTION_BANK_VERSION=2026-06-v4`, `SEMANTIC_AUDIT_VERSION=2026-07-semantic-v1`, effective bank `2026-06-v4+2026-07-semantic-v1`, `RESULT_SCORING_VERSION=2026-07-18-semantic-v3`

## WP1–WP3 Audit surface

- **Contributions:** every selectable response×axis row for effective-active main + statement (statement ids also live in main; statement export is a dedicated surface view). The retired legacy faction-module corpus is not part of the current inventory.
- **Signed contribution** matches production `normalizeAnswer × weight × salience` (`src/scoring/normalize.ts`, `aggregate.ts`).
- **Dossiers:** one per live label; claim stubs for `definition`, `family`, and all 26 `centroid.*` axes.
- **Evidence minima:** per-label instrument primary + ≥2 family scholarly baselines; three researched perspectives per claim; `textualStatus: in-review`.
- **Findings:** 183 total, 0 unresolved-active. Seeded from the main `semanticAudit` (corrections → `correct-overlay` applied; needs-rewrite → `deactivate` applied) and statement `statementSemanticAudit` overlay, plus the affinity-quarantine sentinel. The retired legacy module findings are no longer part of the live ledger. Near-duplicate centroid pairs below threshold 0.35: none in live catalog (closest ~0.384).

## WP4 Review

- Dual **provisional-agent** domain + measurement reviews stamped on every seeded finding.
- Provisional reviews **cannot** flip expert gate to `pass`.
- Adjudication unused where domain/measurement dispositions already agree.

## WP5 Apply

- Main corpus overlays already applied via `src/data/semanticAudit.ts` (`applySemanticReview` in `effectiveQuestions.ts`).
- The retired legacy module corpus and its seven module-only findings were removed from the source tree, contribution manifest, inventory freeze, wave partition, and finding ledger. The current feminist and identity/sovereignty specialist registries remain separate respondent-facing surfaces and are not affected.
- Statement overlay (`statementSemanticAudit.ts`, `STATEMENT_SEMANTIC_AUDIT_VERSION=2026-07-statement-semantic-v1`): 1 needs-rewrite (`sq04`, double-barreled) recorded. Statement ids already flagged in the main needs-rewrite set (`sq03`, `sq08`, `sq10`, `sq16`) are authoritatively handled by the main overlay (statement questions fold into `coreQuestions` through `applySemanticReview`, which **is** wired), so they are intentionally not mirrored here to avoid divergent duplicate records. `sq04` is recorded in the statement overlay; `applyStatementSemanticReview` is likewise unwired (statement corrections map is empty), so this is a staged record, not a live scoring change.
- No forced centroid spreading. No merges/splits required at current separability threshold.

## WP6 Robustness (coherence-only)

- Separability diagnostics for all match-pool labels.
- Synthetic calibration fixtures cover all 118 labels (`src/scoring/calibration.fixtures.ts`).
- Fixtures are **coherence / reflexivity** checks — **not** respondent accuracy.

## WP7 Share / copy

- Version matrix asserts bank / overlay / scoring / share constants.
- Methodology + Results copy scanned for forbidden empirical overclaim phrases.
- Psychometrics empty-study path → insufficient-data style status.

## WP8 Release

- `releaseGate()` requires: fingerprint freshness, scoring version match, zero unresolved actives, no `fail` gates, expert gate present and `pass` (qualified-expert), empirical may remain `insufficient-data`/`deferred`, summary not older than last applied disposition. Live overall release is currently **FAIL** because expert is `in-review`.
- **Textual gate** is computed live from the real per-claim `textualStatus` rollup across all dossier claims (never hardcoded) and is currently `in-review`: `claim-fill-v1` replaced all `PENDING_CLAIM_STUB` scaffolds with instrument-framed definition/family/centroid statements, family scholarly cite links (`citations/familyCatalog.ts`), and three researched perspectives per claim. Textual status is **not** `pass` (qualified-expert textual review still pending). `releaseGate()` does not block on `textual` (only `expert`/`fail` gates block per plan); overall release remains FAIL because expert is `in-review`.
- Pre-existing repo research (`docs/labels-academic-audit.md`, `docs/ideology-label-review.md`, `docs/contested-label-research-verification.md`, `docs/ideology-family-research-verification.md`) is now linked into family-level `scholarlyCiteIds` via `citations/familyCatalog.ts`. Family baselines justify tradition boundaries; they do **not** validate exact numeric centroids. Niche/contested labels still warrant specialist follow-up before textual `pass`.
- Weak family baselines (`green`, `indigenist`, `technocratic`, `communitarian`) and the liberal/libertarian boundary have been strengthened with direct SEP conceptual sources, maintaining honest non-numeric evidence notes.
- Linked tests live under `src/validation/mappingAudit/**/*.test.ts`.

## Explicit non-claims

- No empirical validity / respondent accuracy claims.
- No activation of `ideologyAffinities`.
- Expert gate remains `in-review` until qualified-expert review (overall release blocked; status is not falsely marked `fail` or `pass`).
- Claim perspectives now carry researched sympathetic/critical/neutral text (no `PENDING_PERSPECTIVE`); expert and empirical honesty unchanged.

## How to verify

```bash
npm test -- src/validation/mappingAudit
npm test -- src/data/semanticAudit src/scoring/labelMatch src/scoring/normalize src/scoring/aggregate
npm test -- src/share src/validation/psychometrics
npm run lint
npm run build
```
