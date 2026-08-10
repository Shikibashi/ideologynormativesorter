# External psychometric analysis

The browser application computes descriptive and classical diagnostics only when a dataset supports them. The checked-in R workflows provide reproducible analyses that should not be improvised in the product UI.

## Inputs

Use consented schema-v3 records produced by research mode. A balanced matrix form can be requested with `formSize`; omit it to administer every eligible core item in the chosen tier.

```text
https://your-site.example/?research=1&study=pilot-2026&formSize=120
https://your-site.example/?research=1&study=pilot-2026&administration=retest&formSize=120
```

The same browser keeps a stable random participant code. Test and retest core forms preserve eligible coverage but use a different deterministic presentation order. Research participants are also deterministically assigned one optional specialist module. The same participant receives the same specialist module at test and retest, while specialist item order changes by administration.

Core records and specialist records share `studyId`, `participantId`, and `administration`, so they can be joined without storing names, email addresses, exact ages, or precise locations. The core record includes the assigned specialist module even when the respondent declines it, which provides a denominator for follow-up uptake analysis.

Set `VITE_RESEARCH_ENDPOINT` at build time to transmit records. Without it, participants can download submitted core or completed specialist JSON records. The included reference collector accepts the records and keeps core psychometric data separate from specialist follow-ups:

```bash
ALLOWED_ORIGIN=http://localhost:5173 \
RESEARCH_OUTPUT_FILE=./private-data/submissions.ndjson \
SPECIALIST_RESEARCH_OUTPUT_FILE=./private-data/specialist-submissions.ndjson \
node research-collector/server.mjs
```

`submissions.ndjson` contains core records. `specialist-submissions.ndjson` contains completed specialist records plus explicit specialist disposition records such as declined-before-start and declined-after-partial. Keeping these files separate prevents topic-specific items from entering the ordinary axis reliability/factor pipeline by accident.

The reference collector is deliberately small. Deploy it only behind HTTPS, origin restrictions, rate limiting, access controls, encrypted storage, retention rules, and the ethics/privacy review appropriate to the study. It does not replace an institutional research platform.

## R dependencies

```r
install.packages(c("jsonlite", "psych", "lavaan", "mirt", "boot"))
```

## Run core validation

First generate quality flags without deleting any records:

```bash
QUALITY_MINIMUM_DURATION_MS=0 \
QUALITY_MAXIMUM_MISSING_RATE=0.40 \
QUALITY_MAXIMUM_INVARIANT_RATE=0.95 \
Rscript analysis/run_data_quality.R private-data/submissions.ndjson analysis/output
```

Set the duration threshold from the preregistered cognitive-pilot timing distribution before examining ideological outcomes. Then run the core psychometric workflow on the frozen analysis input:

```bash
Rscript analysis/run_validation.R private-data/submissions.ndjson analysis/output
```

Optional core psychometric environment variables:

```bash
PSYCH_BOOTSTRAP_REPLICATES=1000
PSYCH_MINIMUM_AXIS_N=100
PSYCH_MINIMUM_FACTOR_N=300
PSYCH_MINIMUM_DIF_GROUP_N=100
PSYCH_RANDOM_SEED=20260718
```

## Run specialist validation

Run the specialist workflow with both files so assignment denominators from the core record can be joined to follow-up completions and dispositions:

```bash
Rscript analysis/run_specialist_validation.R \
  private-data/submissions.ndjson \
  private-data/specialist-submissions.ndjson \
  analysis/specialist-output
```

The specialist analysis deliberately treats insufficient sample sizes as insufficient data rather than fabricating estimates. Defaults can be changed only when the study plan justifies it:

```bash
SPECIALIST_MINIMUM_RELIABILITY_N=30
SPECIALIST_MINIMUM_RETEST_N=30
```

The specialist workflow currently evaluates:

- assignment uptake by module and administration;
- explicit decline versus unresolved attrition;
- pre-result self-identification criterion concordance;
- construct score distributions;
- construct-level internal consistency when enough respondents exist;
- construct-level test-retest correlations when enough paired respondents exist.

A respondent may fit more than one specialist tradition. Criterion analysis therefore preserves multi-select self-identification and, where relevant, both tradition-level and variant-level concordance rather than forcing every respondent into one exclusive class.

## Outputs

The data-quality workflow writes:

- `data-quality-summary.json`
- `submission-quality.csv`
- `item-response-quality.csv`
- `exclusion-candidates.csv`

The core psychometric workflow writes:

- `validation-summary.json`
- `axis-reliability.csv` with alpha, omega total, and percentile bootstrap intervals
- `item-total-correlations.csv`
- `test-retest.csv` with bootstrap intervals
- `criterion-concordance.csv`
- `source-coverage.csv`
- `efa-loadings.csv` when the development split is estimable
- `cfa-fit.csv` with held-out CFI, TLI, RMSEA, and SRMR
- `dif-results.csv` when preregistered groups meet the minimum sample requirement

The specialist workflow writes:

- `specialist-module-uptake.csv`
- `specialist-dispositions.csv`
- `specialist-disposition-summary.csv`
- `specialist-criterion-response.csv`
- `specialist-criterion-concordance.csv`
- `specialist-construct-scores.csv`
- `specialist-construct-summary.csv`
- `specialist-construct-reliability.csv`
- `specialist-test-retest.csv`

Core Likert items are oriented toward their primary axis. Statement-choice items and items marked `needs-rewrite` are excluded from common-scale reliability and factor analyses. CFA uses the primary-axis specification and WLSMV on a held-out split. DIF uses graded-response multiple-group models with multiplicity adjustment.

Specialist reliability is computed only inside each module and construct. Specialist items never enter the core axis reliability or factor models.

## Study governance

Use these files together:

- `docs/psychometric-validation-protocol.md`
- `docs/pilot-preregistration.md`
- `docs/recruitment-and-retest-operations.md`

Freeze the preregistration, bank/scoring versions, module versions, quality rules, and code revision before outcome analysis. Any decision to promote a specialist candidate into the production ideology taxonomy should be made from a preregistered validation rule, not by inspecting which result looks appealing after data collection.

## Interpretation limits

The scripts do not turn a convenience sample into a representative population estimate. Factor solutions require substantive review, bootstrap intervals do not correct sampling bias, and DIF flags require item-level interpretation. Specialist fit scores and criterion concordance are validation evidence for the instrument, not population prevalence estimates and not clinical-style diagnoses. Results should remain version-specific and should not be pooled across changed banks or module versions without an explicit linking study.
