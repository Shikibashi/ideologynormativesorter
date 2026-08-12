# External psychometric analysis

The browser application computes descriptive and classical diagnostics only when a dataset supports them. The checked-in R workflows provide reproducible analyses that should not be improvised in the product UI.

## Inputs

Use consented schema `2026-08-v9` records produced by contribution mode. The public flow omits `formSize` and contributes
the complete selected Balanced or Full-depth profile. A controlled `research=1` URL can request a balanced matrix form
with `formSize` for instrument analysis.

```text
https://your-site.example/?research=1&study=pilot-2026&formSize=120
https://your-site.example/?research=1&study=pilot-2026&administration=retest&formSize=120
```

The same browser keeps a stable random participant code. Test and retest core forms preserve the same participant-specific item membership but use a different deterministic presentation order. The record stores the form algorithm version, membership fingerprint, exact presented wording/options, and open-opt-in recruitment source. Research participants are also deterministically assigned one optional specialist module. The same participant receives the same specialist module at test and retest, while specialist item order changes by administration.

Core records and specialist records share `studyId`, `participantId`, and `administration`, so they can be joined without storing names, email addresses, exact ages, or precise locations. The core record includes the assigned specialist module even when the respondent declines it, which provides a denominator for follow-up uptake analysis.

Set `VITE_RESEARCH_ENDPOINT` at build time to transmit records through the website. Without it, the deployed site disables the contribution entry point. The included reference collector accepts the records and keeps core psychometric data separate from specialist follow-ups:

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
QUALITY_MINIMUM_MS_PER_ITEM=0 \
QUALITY_MAXIMUM_MISSING_RATE=0.40 \
QUALITY_MAXIMUM_INVARIANT_RATE=0.95 \
QUALITY_REQUIRED_CONSENT_VERSION=2026-08-12-v8 \
Rscript analysis/run_data_quality.R private-data/submissions.ndjson analysis/output
```

Set absolute or per-assigned-item duration thresholds from the frozen cognitive-pilot rule before examining ideological outcomes. Straightlining is computed only across observed five- and seven-point Likert items; categorical statement-choice indices are excluded. The quality workflow writes `analysis-inclusion-manifest.csv`, keyed by `submission_id`; explicitly resolve every `review-required` decision and freeze the manifest. For duplicate participant administrations with different IDs, include at most the documented valid record and exclude the others. Exact duplicate `submissionId` values must be deduplicated before validation. Then run the core workflow:

```bash
Rscript analysis/run_validation.R \
  private-data/submissions.ndjson \
  analysis/output \
  analysis/output/analysis-inclusion-manifest.csv
```

Optional core psychometric environment variables:

```bash
PSYCH_BOOTSTRAP_REPLICATES=1000
PSYCH_MINIMUM_AXIS_N=100
PSYCH_MINIMUM_FACTOR_N=300
PSYCH_MINIMUM_DIF_GROUP_N=100
PSYCH_RANDOM_SEED=20260718
PSYCH_REQUIRED_CONSENT_VERSION=2026-08-12-v8
PSYCH_REQUIRED_FORM_VERSION=profile-form-v3
PSYCH_REQUIRED_QUALITY_RULE_VERSION=data-quality-v2
# Also set PSYCH_REQUIRED_BANK_VERSION and PSYCH_REQUIRED_SCORING_VERSION
# to the frozen cohort values for field analysis.
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
- post-questionnaire, pre-result-display self-identification concordance;
- multi-affinity precision, recall, F1, Jaccard, label-specific counts, false positives, and co-identification;
- construct score distributions;
- evidence-aware coverage and abstention states for sparse specialist responses;
- construct-level internal consistency when enough respondents exist;
- construct-level test-retest correlations when enough paired respondents exist.

A respondent may fit more than one specialist tradition. Criterion analysis therefore preserves multi-select self-identification and, where relevant, both tradition-level and variant-level concordance rather than forcing every respondent into one exclusive class.

## Outputs

The data-quality workflow writes:

- `data-quality-summary.json`
- `submission-quality.csv`
- `item-response-quality.csv`
- `self-reported-ideology-candidates.csv` — private aggregate counts of optional respondent-supplied ideology names from initial administrations; this is a discovery queue, not an automatic taxonomy update.
- `exclusion-candidates.csv`
- `analysis-inclusion-manifest.csv` — keyed by `submission_id`; clean rows start as `include`, and flagged rows must be explicitly resolved before validation runs.

The core psychometric workflow writes:

- `validation-summary.json`
- `axis-reliability.csv` with alpha, omega total, and percentile bootstrap intervals
- `item-total-correlations.csv` with the observed pair count and a corrected correlation against the respondent's available mean across the remaining axis items
- `test-retest.csv` with rank-order correlation, concordance, and change distributions for the primary-axis item model
- `production-axis-scores.csv` reconstructed with every production weight and confidence/priority multiplier
- `production-score-test-retest.csv` with agreement and change distributions for the exact production score contract
- `form-incidence-summary.csv`, `item-assignment-counts.csv`, `item-pair-overlap.csv`, and `item-position-distribution.csv` for auditing achieved matrix-form connectivity and order balance
- `criterion-concordance.csv`
- `source-coverage.csv`
- `efa-loadings.csv` when the development split is estimable
- `cfa-fit.csv` with internally held-out CFI, TLI, RMSEA, and SRMR; this is not a substitute for a separately recruited confirmation sample
- `dif-results.csv` when preregistered groups meet the minimum sample requirement

The specialist workflow writes:

- `specialist-module-uptake.csv`
- `specialist-dispositions.csv`
- `specialist-disposition-summary.csv`
- `specialist-criterion-response.csv`
- `specialist-criterion-concordance.csv`
- `specialist-criterion-multilabel.csv`
- `specialist-label-metrics.csv`
- `specialist-criterion-coidentification.csv`
- `specialist-construct-scores.csv`
- `specialist-construct-summary.csv`
- `specialist-construct-reliability.csv`
- `specialist-test-retest.csv`
- `specialist-evidence.csv` with answered coverage, weighted coverage, and effective item count

Core Likert items are oriented toward their primary axis for an item measurement model. That model is not the production result score. Statement-choice items and items marked `needs-rewrite` are excluded from common-scale reliability and factor analyses. The production-score outputs separately retain every axis weight, statement-option weight, and salience multiplier. CFA uses the primary-axis specification, pairwise planned-missing handling, and WLSMV on an internal split. DIF uses graded-response multiple-group models with multiplicity adjustment.

The validation script fails closed on unresolved inclusion decisions, duplicate submission IDs, more than one included record per participant administration, incompatible method versions, inconsistent form fingerprints or item snapshots, invalid response/salience states, and test/retest fingerprint mismatches. Analyze changed versions separately unless a linking design was frozen in advance.

Specialist reliability is computed only inside each module and construct. The reliability workflow uses each item's
largest-absolute-loading construct as its primary indicator; secondary cross-loadings are reported but are not treated
as independent evidence. Specialist items never enter the core axis reliability or factor models. Sparse specialist
responses are retained for audit but excluded from candidate-match concordance when the browser marks them
`insufficient-evidence`.

## Study governance

Use these files together:

- `docs/psychometric-validation-protocol.md`
- `docs/pilot-preregistration.md`
- `docs/recruitment-and-retest-operations.md`

Freeze the preregistration, bank/scoring versions, module versions, quality rules, and code revision before outcome analysis. Any decision to promote a specialist candidate into the production ideology taxonomy should be made from a preregistered validation rule, not by inspecting which result looks appealing after data collection.

## Interpretation limits

The scripts do not turn a convenience sample into a representative population estimate. Factor solutions require substantive review, bootstrap intervals do not correct sampling bias, and DIF flags require item-level interpretation. Specialist fit scores and criterion concordance are validation evidence for the instrument, not population prevalence estimates and not clinical-style diagnoses. Results should remain version-specific and should not be pooled across changed banks or module versions without an explicit linking study.
