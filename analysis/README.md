# External psychometric analysis

The browser application computes descriptive and classical diagnostics only when a dataset supports them. The checked-in R workflows provide reproducible analyses that should not be improvised in the product UI.

## Inputs

Use consented schema-v2 records produced by research mode. A balanced matrix form can be requested with `formSize`; omit it to administer every eligible item in the chosen tier.

```text
https://your-site.example/?research=1&study=pilot-2026&formSize=120
https://your-site.example/?research=1&study=pilot-2026&administration=retest&formSize=120
```

The same browser keeps a stable random participant code. Test and retest forms preserve eligible coverage but use a different deterministic presentation order. Records include total duration, resume status, and presentation order.

Set `VITE_RESEARCH_ENDPOINT` at build time to transmit records. Without it, participants can download their JSON record. The included reference collector accepts those records and appends newline-delimited JSON:

```bash
ALLOWED_ORIGIN=http://localhost:5173 \
RESEARCH_OUTPUT_FILE=./private-data/submissions.ndjson \
node research-collector/server.mjs
```

The reference collector is deliberately small. Deploy it only behind HTTPS, origin restrictions, rate limiting, access controls, encrypted storage, retention rules, and the ethics/privacy review appropriate to the study. It does not replace an institutional research platform.

## R dependencies

```r
install.packages(c("jsonlite", "psych", "lavaan", "mirt", "boot"))
```

## Run

First generate quality flags without deleting any records:

```bash
QUALITY_MINIMUM_DURATION_MS=0 \
QUALITY_MAXIMUM_MISSING_RATE=0.40 \
QUALITY_MAXIMUM_INVARIANT_RATE=0.95 \
Rscript analysis/run_data_quality.R private-data/submissions.ndjson analysis/output
```

Set the duration threshold from the preregistered cognitive-pilot timing distribution before examining ideological outcomes. Then run the psychometric workflow on the frozen analysis input:

```bash
Rscript analysis/run_validation.R private-data/submissions.ndjson analysis/output
```

Optional psychometric environment variables:

```bash
PSYCH_BOOTSTRAP_REPLICATES=1000
PSYCH_MINIMUM_AXIS_N=100
PSYCH_MINIMUM_FACTOR_N=300
PSYCH_MINIMUM_DIF_GROUP_N=100
PSYCH_RANDOM_SEED=20260718
```

## Outputs

The data-quality workflow writes:

- `data-quality-summary.json`
- `submission-quality.csv`
- `item-response-quality.csv`
- `exclusion-candidates.csv`

The psychometric workflow writes:

- `validation-summary.json`
- `axis-reliability.csv` with alpha, omega total, and percentile bootstrap intervals
- `item-total-correlations.csv`
- `test-retest.csv` with bootstrap intervals
- `criterion-concordance.csv`
- `source-coverage.csv`
- `efa-loadings.csv` when the development split is estimable
- `cfa-fit.csv` with held-out CFI, TLI, RMSEA, and SRMR
- `dif-results.csv` when preregistered groups meet the minimum sample requirement

Likert items are oriented toward their primary axis. Statement-choice items and items marked `needs-rewrite` are excluded from common-scale reliability and factor analyses. CFA uses the primary-axis specification and WLSMV on a held-out split. DIF uses graded-response multiple-group models with multiplicity adjustment.

## Study governance

Use these files together:

- `docs/psychometric-validation-protocol.md`
- `docs/pilot-preregistration.md`
- `docs/recruitment-and-retest-operations.md`

Freeze the preregistration, bank/scoring versions, quality rules, and code revision before outcome analysis.

## Interpretation limits

The scripts do not turn a convenience sample into a representative population estimate. Factor solutions require substantive review, bootstrap intervals do not correct sampling bias, and DIF flags require item-level interpretation. Results should remain version-specific and should not be pooled across changed banks without an explicit linking study.
