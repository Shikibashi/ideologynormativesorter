# Psychometric validation protocol

## Status

The collection and analysis apparatus is implemented, but empirical validation has not yet been established. Synthetic fixtures and software tests are not respondent evidence. No reliability, validity, fairness, or accuracy coefficient should be published until a consented respondent dataset has been collected and analyzed.

The repository now includes:

- `src/validation/psychometrics.ts` for respondent-grounded classical diagnostics;
- an opt-in browser research mode with consent and pre-result self-identification;
- a pseudonymous submission/export schema;
- a dependency-free reference collector;
- `analysis/run_validation.R` for omega, bootstrap intervals, held-out EFA/CFA, test-retest, criterion concordance, and DIF.

All analysis paths report insufficient data rather than manufacturing coefficients when sample thresholds are not met.

## Design principles

The study design takes product inspiration from Find My Politics in five limited ways:

1. capture optional ideology self-identification before showing results;
2. monitor positive/negative item direction by axis;
3. provide context and public sources for empirical questions;
4. support multiple test lengths;
5. describe labels as nearby neighborhoods rather than definitive identities.

These are design practices, not borrowed validation evidence. Historical-figure and country comparisons should not be added without independently documented scoring data.

## Research questions

1. Do items assigned to an axis behave as a coherent scale among real respondents?
2. Does the proposed 26-axis structure fit better than simpler or alternative structures?
3. Are scores stable when the same respondent retakes the instrument after a reasonable interval?
4. Do results agree, within expected limits, with pre-result self-identification and established external measures?
5. Do items behave differently across groups after controlling for the underlying trait?
6. Are short forms sufficiently precise for their intended low-stakes use?
7. Are ideology-label matches stable under resampling, item omission, and modest scoring perturbations?

## Study stages

### Stage 1 — expert content review

Use at least three independent reviewers with relevant political-theory, survey-methodology, or psychometric experience and meaningfully different political priors.

For every item, reviewers record:

- intended construct and layer;
- expected sign on each axis;
- relevance and clarity ratings;
- whether the item is double-barreled or leading;
- whether a descriptive item is falsifiable and adequately scoped;
- whether wording is likely to have different meanings across political groups.

Report agreement and all unresolved disagreements. Do not resolve disagreement by majority vote alone when the axis definition itself is unclear.

### Stage 2 — cognitive interviews

Conduct approximately 20–30 interviews across diverse ideological backgrounds. Ask participants to explain what each sampled item means in their own words and why they selected an answer.

Use this stage to detect:

- unintended interpretations;
- unfamiliar terminology;
- social-desirability pressure;
- response options that do not fit;
- items where agreement can arise for opposing reasons;
- forced-choice options that are not mutually exclusive.

### Stage 3 — pilot field study

Use matrix sampling so respondents are not required to answer the entire bank. Aim for at least 150 usable observations per item, with a larger total sample where feasible. The software's lower thresholds are provisional computation gates, not publication standards.

Research mode is enabled explicitly:

```text
?research=1&study=pilot-2026
```

A retest administration uses:

```text
?research=1&study=pilot-2026&administration=retest
```

The flow requires consent before the quiz, captures optional self-identification and broad demographic groups before showing results, and assigns a stable random participant code in the same browser. It does not request names, email addresses, exact age, precise location, employer, party registration, or contact information.

Capture:

- pseudonymous participant ID;
- test or retest administration;
- bank, scoring, schema, and consent versions;
- selected test length;
- item responses and confidence/priority values;
- optional pre-result self-label from the instrument label set;
- optional broad age band and gender group for preregistered DIF analysis;
- item metadata required to reproduce orientation and exclusions;
- consent timestamp and version.

Recruitment contact information, when needed for retest invitations, must be stored separately from response data and linked through a different protected system.

### Stage 4 — independent confirmation sample

Freeze the revised item bank and scoring model before collecting a separate confirmation sample. Use the holdout sample for confirmatory factor analysis, short-form evaluation, label calibration, and final criterion checks.

Do not repeatedly tune the model against the holdout sample.

### Stage 5 — test-retest study

Invite a voluntary subsample to retake the unchanged instrument after a preregistered interval, such as two to four weeks. Target at least 100 matched respondents where feasible. Record major political events or personal changes that could reasonably alter beliefs during the interval in a separate study log, not as identifying response fields.

## Required analyses

### Data quality

Report:

- completion and dropout rates;
- missing and “I don't know” rates by item;
- response-time distributions when timing is collected under the consent protocol;
- floor and ceiling rates;
- straight-line or invariant response patterns;
- duplicate or suspicious submissions under a documented rule.

### Directional balance

For each axis, report positive- and negative-keyed Likert item counts. Balance is a diagnostic, not a quota: exact equality should not override content validity. Statement-choice options are reported separately because they are ipsative.

### Internal consistency

For each axis report:

- Cronbach alpha;
- McDonald's omega total;
- corrected item-total correlations;
- odd-even split-half reliability with Spearman-Brown correction;
- percentile bootstrap confidence intervals.

Do not interpret a high alpha as proof of one-dimensionality. Very high alpha may indicate redundant wording.

### Dimensionality

Use exploratory factor analysis on a development split and confirmatory factor analysis on a held-out split. The checked-in R workflow uses ordinal polychoric correlations and minimum-residual EFA, then WLSMV CFA on a primary-axis specification.

Compare, where sample size permits:

- the proposed axis structure;
- correlated-factor alternatives;
- higher-order or bifactor models where theoretically justified;
- simpler models that may explain the data with fewer dimensions.

Report loadings, cross-loadings, factor correlations, CFI, TLI, RMSEA, SRMR, convergence problems, and item exclusions. The primary-axis model is a starting specification, not evidence that cross-loadings are zero.

### Temporal stability

For each axis, report test-retest correlations, bootstrap intervals, and score-change distributions. Separate temporal instability from low internal consistency.

### Criterion and convergent evidence

Capture optional self-identification before results are shown and report top-1 and top-3 label concordance. Treat this as imperfect criterion evidence because self-labels are ambiguous and the label set is not exhaustive.

Where licensing and respondent burden permit, compare relevant axes with established external scales. Predefine expected convergent and discriminant relationships before analysis.

### Label calibration

Labels should be calibrated only after the axis measurement model is supported. Report:

- nearest-label stability under bootstrap resampling;
- top-label changes when low-information items are removed;
- runner-up margins;
- confusion matrices against pre-result self-labels;
- performance by test length;
- labels that remain empirically indistinguishable.

Merge, split, or remove labels that cannot be discriminated reliably. Do not compensate for poor item discrimination by making centroids more extreme without evidence.

### Fairness and differential item functioning

Only run subgroup analyses when there is adequate, voluntarily supplied sample size and a clear preregistered research purpose. The external workflow uses graded-response multiple-group models and multiplicity adjustment when each group meets the configured minimum.

Report uncertainty and multiple-testing controls. A DIF flag is a prompt for substantive item review, not proof of bias. An absence of significant flags in a small sample is not evidence of fairness.

## Provisional decision gates

These are planning gates, not universal scientific laws:

- no item returns to scoring after a `needs-rewrite` status without cognitive testing;
- no axis receives a public “reliable” label from item count alone;
- no coefficient is shown when the configured minimum sample is not met;
- no final factor claim is made from the development sample alone;
- no label is called accurate solely because a centroid-generated synthetic profile maps back to itself;
- no historical person, political party, or country is placed on the map without a documented and reviewable response-scoring procedure;
- no short form is promoted until its score agreement and uncertainty are compared with the full form on a holdout sample;
- no datasets from changed bank versions are pooled without a linking design.

## Dataset interchange format

Research mode produces a versioned record equivalent to:

```json
{
  "schemaVersion": "2026-07-v1",
  "studyId": "pilot-2026",
  "participantId": "p_random-code",
  "administration": "test",
  "bankVersion": "2026-06-v4+2026-07-semantic-v1",
  "scoringVersion": "2026-07-18-semantic-v3",
  "tier": "moderate",
  "consent": {
    "ageConfirmed": true,
    "voluntaryParticipation": true,
    "dataUseAccepted": true,
    "consentVersion": "2026-07-18-v1",
    "consentedAt": "2026-07-18T12:00:00.000Z"
  },
  "identity": {
    "selfLabelId": "optional-label-id",
    "ageBand": "optional-broad-band",
    "genderGroup": "optional-broad-group"
  },
  "predictedLabelIds": ["top-label", "runner-up"],
  "answers": {
    "q0001": { "questionId": "q0001", "value": 2 }
  },
  "itemMap": []
}
```

A retest uses the same participant code and `administration: "retest"`. Same-browser linkage is automatic. Any cross-device linkage system must avoid exposing recruitment identity in the response dataset.

## Reproducible workflow

Run the external analysis with:

```bash
Rscript analysis/run_validation.R private-data/submissions.ndjson analysis/output
```

The workflow writes version-specific JSON and CSV outputs for reliability, omega, bootstrap intervals, item-total correlations, test-retest stability, criterion concordance, source coverage, EFA loadings, held-out CFA fit, and DIF. See `analysis/README.md` for dependencies and thresholds.

## Current limitation

The repository is ready to collect and analyze consented records, but it contains no real pilot sample. Until respondents are recruited and the preregistered analyses are run, all public results must continue to describe the instrument as under empirical validation rather than validated.
