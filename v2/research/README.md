# v2 Offline Research Analysis

Phase 14 is an offline, research-only analysis boundary. R 4.6.1 is the primary inferential environment. The TypeScript research package owns input version validation, privacy-safe projection contracts, and regression tests; it does not import the scoring engine. The R pipeline owns descriptive statistics, item analysis, reliability, dimensionality gate evaluation, invariance/retest/profile gate evaluation, and machine-readable reports.

## Input

The input is newline-delimited Phase 13 research envelopes. Every record must match the exact versions in `config/analysis-config.json`, carry explicit consent, and contain only accepted response records. The canonical bundle is used only to resolve item scope, response types, scales, and specialist module membership. It is not a research scoring authority.

## Missingness

`answered` is observed. `missing`, `skipped`, `abstained`, and `refused` remain missing for analysis and are never silently imputed. A specialist item belonging to a module that was not requested is `structural_not_applicable`, not missing. Any imputation, pairwise rule, or scale-specific exclusion must be named in a future preregistered analysis configuration.

## Commands

```text
npm run v2:research:analysis:synthetic
npm run v2:research:analysis:r
npm run v2:research:analysis:test
```

The synthetic fixture is a software regression input only. Its output is marked `NOT_EVALUATED`; it cannot support population, reliability, validity, dimensionality, invariance, retest, or profile claims.

The legacy v1 analysis scripts remain archive-only and are not imported into this v2 pipeline.

## Privacy

Analysis outputs contain subject ordinals, never submission IDs. Raw prompts, labels, demographics, identity fields, private saves, shares, and result profiles are not accepted by this pipeline. Access to real consented exports remains restricted and separate from production scoring.
