# v2 Statistical Modules

The R pipeline provides deterministic code paths for:

- data-quality and version audits;
- item-level observed counts and descriptive statistics;
- reliability matrices for reflective root constructs;
- dimensionality gate evaluation with a declared future polychoric/PCA route;
- invariance gate evaluation;
- test-retest gate evaluation;
- profile-analysis gate evaluation from an approved separate result export.

Phase 14 runs these modules on a synthetic regression fixture. The fixture has 40 submissions and 338 core items per submission; it is intentionally below the real-data gates for reliability, dimensionality, invariance, retest, and profile analysis. The resulting status is `NOT_EVALUATED`, and all claims are ineligible for production language.

The pipeline records R package versions in `v2/research/generated/phase14-r-output/r-environment.json` and uses `v2/research/renv.lock` as the dependency lock declaration.
