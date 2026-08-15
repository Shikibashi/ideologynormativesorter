# External psychometric analysis

The browser application computes descriptive and classical diagnostics only when a dataset supports them. The checked-in R workflows provide reproducible analyses that should not be improvised in the product UI.

## Inputs

Use consented schema `2026-08-v18` records produced by contribution mode. The public flow omits `formSize` and contributes
the complete selected Balanced or Full-depth profile. A controlled `research=1` URL can request a balanced matrix form
with `formSize` for instrument analysis.

```text
https://your-site.example/?research=1&study=community-2026-v5&formSize=120
https://your-site.example/?research=1&study=community-2026-v5&administration=retest&formSize=120
https://your-site.example/?research=1&exposure=1&study=community-2026-v5&formSize=120
```

The same browser keeps a stable random participant code. Test and retest core forms preserve the same participant-specific item membership but use a different deterministic presentation order. The record stores the form algorithm version, membership fingerprint, exact presented wording/options, and open-opt-in recruitment source. Research participants are also deterministically assigned one optional specialist module. The same participant receives the same specialist module at test and retest under the frozen `2026-08-specialist-roster-v1` / `balanced-hash-v2` contract, while specialist item order changes by administration.

Core records and specialist records share `studyId`, `participantId`, and `administration`, so they can be joined without storing names, email addresses, exact ages, or precise locations. The core record includes the assigned specialist module even when the respondent declines it, which provides a denominator for follow-up uptake analysis.

Set `VITE_RESEARCH_ENDPOINT` at build time to transmit records through the website. Without it, the deployed site disables the contribution entry point. The included reference collector accepts the records and keeps core psychometric data separate from specialist follow-ups:

```bash
ALLOWED_ORIGIN=http://localhost:5173 \
RESEARCH_STUDY_ID=community-2026-v5 \
RESEARCH_TAXONOMY_VERSION=2026-08-taxonomy-v13 \
RESEARCH_PRIMARY_MEASUREMENT_VERSION=2026-08-primary-core-v1 \
RESEARCH_MODIFIER_MEASUREMENT_VERSION=2026-08-modifier-construct-v1 \
RESEARCH_PRIMARY_LABEL_ROSTER_FINGERPRINT=lr_3cc0f435 \
RESEARCH_MODIFIER_LABEL_ROSTER_FINGERPRINT=lr_eb26ed76 \
RESEARCH_SPECIALIST_ASSIGNMENT_STRATEGY=balanced-hash-v2 \
RESEARCH_SPECIALIST_ASSIGNMENT_ROSTER_VERSION=2026-08-specialist-roster-v1 \
RESEARCH_SPECIALIST_ASSIGNMENT_MODULE_IDS=feminist-faction-module,identity-sovereignty-module,anarchist-families-module,green-morphology-module,socialist-families-module,conservative-variants-module,religious-national-politics-module,technology-governance-module,monarchist-municipal-module \
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

On the Bluefin development image used for this repository, R is installed in
the dedicated Toolbx container `ideologynormativesorter-r`. Run the commands
below through that container and set `R_LIBS_USER=/home/tcs/R/library` when
using the user-installed packages. The host shell does not need a system-wide
R installation.

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

## Research-only analysis entrypoints

The implementation specification's W3/W4 entrypoints all use the same
fail-closed contract loader in `analysis/research_contracts.R`. Each requires
`<records> <output-directory> <analysis-inclusion-manifest.csv>`, verifies
unique record IDs, exact manifest coverage, explicit `include`/`exclude`
decisions, a single version bundle, and an analysis fingerprint, then writes
`analysis-metadata.json`, `analysis-results.json`, `analysis-status.json`, and
`observation-summary.csv`. An insufficient sample is reported as
`insufficient-data`; it is never converted into a fabricated estimate.

The current entrypoints are:

- `run_descriptive_calibration.R` — `2026-08-descriptive-calibration-v1`
- `run_strategy_conjoint.R` — `2026-08-strategy-task-bank-v2`
- `run_normative_tradeoffs.R` — `2026-08-normative-tradeoff-v1`
- `run_model_comparison.R` — `2026-08-model-comparison-v1`
- `run_perception_geometry.R` — `2026-08-perception-geometry-v1`
- `run_profiles.R` — `2026-08-profile-discovery-v1`
- `run_prototype_calibration.R` — `2026-08-prototype-calibration-v1`
- `run_linking.R` — `2026-08-unfolding-analysis-v1`

Before a field run, set `ANALYSIS_CODE_REVISION`, `ANALYSIS_STUDY_ID`,
`ANALYSIS_SEED`, and `ANALYSIS_FINGERPRINT` to the preregistered values. A
fixture smoke run is checked in under `analysis/fixtures/`:

```bash
toolbox run --container ideologynormativesorter-r bash -lc \
  'ANALYSIS_CODE_REVISION=fixture-revision \
   ANALYSIS_STUDY_ID=fixture-study \
   ANALYSIS_FINGERPRINT=fixture-form-v1 \
   R_LIBS_USER=/home/tcs/R/library \
   Rscript /var/home/tcs/Code/ideologynormativesorter/analysis/run_descriptive_calibration.R \
   /var/home/tcs/Code/ideologynormativesorter/analysis/fixtures/research-contract-fixture.ndjson \
   /tmp/descriptive-calibration-output \
   /var/home/tcs/Code/ideologynormativesorter/analysis/fixtures/research-contract-manifest.csv'
```

These entrypoints serialize analysis provenance and comparison status only;
they do not alter `buildResultProfile`, production labels, or the current
scoring version. Optional estimators such as `mirt` remain an explicit
environment prerequisite for the existing DIF workflow rather than a reason
to emit an unvalidated result.

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
PSYCH_REQUIRED_TAXONOMY_VERSION=2026-08-taxonomy-v13
PSYCH_REQUIRED_PRIMARY_MEASUREMENT_VERSION=2026-08-primary-core-v1
PSYCH_REQUIRED_MODIFIER_MEASUREMENT_VERSION=2026-08-modifier-construct-v1
PSYCH_REQUIRED_PRIMARY_LABEL_ROSTER_FINGERPRINT=lr_3cc0f435
PSYCH_REQUIRED_MODIFIER_LABEL_ROSTER_FINGERPRINT=lr_eb26ed76
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

## Research estimator comparison contract

Layer-specific estimators are research outputs only. The current production
score remains the comparison baseline and is never replaced implicitly by an
estimator result. Every estimator output must identify the respondent, study,
axis, layer, estimator ID/version, estimand, observed and missing counts, and
precision status. Missing responses are retained with explicit reasons; they
are not converted to observed midpoints.

| Estimator path                | Estimand                                   | Input                                           | Missingness                                                                       | Criterion                                  | Release status                                  |
| ----------------------------- | ------------------------------------------ | ----------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| Current scorer                | Versioned weighted axis/result contract    | Production answer map                           | Existing production response rules                                                | Baseline score and label fixture stability | Production baseline                             |
| Research layer mean           | Observed normalized mean by axis and layer | Research observations with explicit missingness | Pairwise observed responses; insufficient-data state below the configured minimum | Held-out criterion and precision report    | Research-only, `2026-08-research-estimators-v1` |
| Forecast calibration          | Resolved probability/forecast accuracy     | Versioned research task and outcome records     | Unresolved outcome remains unresolved                                             | Resolution-specific Brier/log score        | Research-only; preregister before fielding      |
| Strategy/trade-off estimators | Task-specific attribute or value effects   | Frozen choice/allocation task records           | Incomplete task handling is format-specific                                       | Held-out task and criterion performance    | Research-only; production hold                  |

Estimator comparisons must freeze the item/task bank, split seed, development
and confirmation membership, eligibility rules, criterion timing, and code
revision before inspecting outcomes. A candidate production path requires a
new scoring version, compatibility decision, and methodological decision
record. The estimator version is carried in the research version bundle.

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
