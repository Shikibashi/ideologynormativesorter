# v2 Research Missingness and Exclusion Policy

## State mapping

- `answered` is observed.
- `missing`, `skipped`, `abstained`, and `refused` are missing for descriptive and psychometric analyses.
- A specialist item whose module was not requested is `structural_not_applicable`, not missing.
- A malformed, version-drifted, duplicate, or conflicting submission is excluded before long-form projection.

No value is imputed by the Phase 14 pipeline. There is no automatic mean substitution, scale-score repair, pairwise deletion toggle, or reverse-scoring transformation in the analysis layer. Any future real-data analysis must preregister the estimator, unit of exclusion, and sensitivity analysis before opening the claim registry.

## Gate behavior

Each module reports its sample size, required minimum, status, and reason. `NOT_EVALUABLE` means the software ran but the approved data gate was not met. `NOT_EVALUATED` means no empirical claim has been accepted. Neither status is a validity finding.
