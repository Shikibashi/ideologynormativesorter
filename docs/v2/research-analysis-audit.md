# v2 Research Analysis Source Audit

## Decision

Phase 14 uses the Phase 13 validated research envelope and the Phase 12 canonical bundle as its only v2 input authorities. R 4.6.1 is the primary inferential environment. The TypeScript research package owns structural validation, version binding, privacy-safe projection, deterministic fixture checks, and replay-contract tests; it is not an inferential or scoring authority.

## Historical v1 sources

| Source | Classification | Use in v2 |
| --- | --- | --- |
| `analysis/run_data_quality.R` | ARCHIVE / HISTORICAL_REFERENCE | Not imported. Reviewed only to identify legacy fields and exclusion rules that cannot cross the v2 boundary. |
| `analysis/run_validation.R` | ARCHIVE / HISTORICAL_REFERENCE | Not imported. Its v1 participant, study, instrument, and result assumptions are not v2 input fields. |
| `analysis/run_specialist_validation.R` | ARCHIVE / HISTORICAL_REFERENCE | Not imported. Specialist analysis starts from explicit v2 module membership and raw response states. |
| `analysis/run_known_groups.R` | ARCHIVE / HISTORICAL_REFERENCE | Not imported. No group variable is present in the v2 research envelope; invariance is therefore gated as not evaluable. |
| `analysis/README.md` | ARCHIVE / HISTORICAL_REFERENCE | Historical operational notes only; it does not define v2 evidence or claim status. |
| `src/validation/psychometrics.ts` | ARCHIVE / HISTORICAL_REFERENCE | Not imported. It is a v1 validation helper, not an empirical analysis authority. |
| `docs/psychometric-validation-protocol.md` | GOVERNANCE / SECONDARY_EVIDENCE | Preserves the distinction between planned analyses and established validity evidence. |

## v2 authorities

| Category | Authority | Secondary evidence | Resolution |
| --- | --- | --- | --- |
| Response shape and consent | Phase 13 research contract and acceptance registry | Phase 13 tests and Worker validation | Exact version validation; no identity or result fields. |
| Item scope and module membership | `v2/research-worker/generated/acceptance-registry.json` | `v2/generated/content.bundle.json` | Registry validates raw input; bundle supplies scope metadata for offline projection. |
| Construct and scoring semantics | `v2/generated/content.bundle.json` and Phase 1-12 contracts | Phase 13 research registry deliberately excludes them | Analysis never becomes scoring authority. |
| Missingness | `v2/research/config/analysis-config.json` | Phase 13 response-state contract | Explicit observed, missing, and structural-not-applicable states; no silent imputation. |
| Statistical methods | `v2/research/R/analysis-lib.R` | `v2/research/renv.lock` | R is primary; every module emits a sample gate and evidence status. |
| Empirical claims | `v2/research/generated/phase14-r-output/claims.json` | Phase 0 measurement governance | Synthetic output is never eligible to support a production claim. |

## Non-authorities

The v2 analysis layer does not read the v1 runtime, overlays, selectors, `canonicalData.ts`, browser state, private saves, share payloads, labels, demographics, self-identification, or result projections. It does not mutate D1 or enable production collection.
