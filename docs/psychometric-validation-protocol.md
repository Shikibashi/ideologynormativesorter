# Psychometric validation protocol

## Status

Empirical validation has not yet been established. Synthetic centroid fixtures are software regression tests, not respondent evidence. No reliability, validity, fairness, or accuracy coefficient should be published until a consented respondent dataset has been analyzed.

The repository now includes `src/validation/psychometrics.ts`. It calculates only what the supplied data supports and otherwise returns `insufficient-data` or `not-applicable`.

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
- whether any wording is likely to have different meanings across political groups.

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

Use matrix sampling so respondents are not required to answer the entire bank. Aim for at least 150 usable observations per item, with a larger total sample where feasible. The default code threshold of 50 complete cases is only a minimum for producing a provisional coefficient, not a publication standard.

Capture:

- anonymous study respondent ID;
- bank and scoring versions;
- randomized item order or block assignment;
- answer and optional confidence/priority;
- optional pre-result self-label from the instrument's label set;
- optional free-text self-description;
- completion time and skipped items;
- consent to research use;
- optional coarse demographic fields only when necessary for a preregistered fairness analysis.

Do not collect names, email addresses, precise location, employer, political-party registration, or other directly identifying information in the validation dataset.

### Stage 4 — independent confirmation sample

Freeze the revised item bank and scoring model before collecting a separate confirmation sample. Use the holdout sample for confirmatory factor analysis, short-form evaluation, label calibration, and final criterion checks.

Do not repeatedly tune the model against the holdout sample.

### Stage 5 — test-retest study

Invite a voluntary subsample to retake the unchanged instrument after a preregistered interval, such as two to four weeks. Target at least 100 matched respondents where feasible. Record major political events or personal changes that could reasonably alter beliefs during the interval.

## Required analyses

### Data quality

Report:

- completion and dropout rates;
- missing and “I don't know” rates by item;
- response-time distributions;
- floor and ceiling rates;
- straight-line or invariant response patterns;
- duplicate or suspicious submissions under a documented rule.

### Directional balance

For each axis, report positive- and negative-keyed Likert item counts. Balance is a diagnostic, not a quota: exact equality should not override content validity. Statement-choice options are reported separately because they are ipsative.

### Internal consistency

For each axis:

- Cronbach alpha;
- preferably McDonald's omega from an external statistical workflow;
- corrected item-total correlations;
- odd-even split-half reliability with Spearman-Brown correction;
- coefficient confidence intervals by bootstrap.

Do not interpret a high alpha as proof of one-dimensionality. Very high alpha may indicate redundant wording.

### Dimensionality

Use exploratory factor analysis on the development sample and confirmatory factor analysis on the holdout sample. Compare:

- the proposed 26-axis structure;
- correlated-factor alternatives;
- higher-order or bifactor models where theoretically justified;
- simpler models that may explain the data with fewer dimensions.

Because responses are ordinal, use methods appropriate for ordinal data rather than assuming normal continuous measurements without checking.

### Temporal stability

For each axis, report test-retest correlations and score-change distributions. Separate temporal instability from low internal consistency.

### Criterion and convergent evidence

Capture optional self-identification before results are shown and report top-1 and top-3 label concordance. Treat this as imperfect criterion evidence because self-labels are themselves ambiguous.

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

Only run subgroup analyses when there is adequate, voluntarily supplied sample size and a clear research purpose. Examine differential item functioning rather than comparing raw group means alone.

Report uncertainty and multiple-testing controls. Do not infer that score differences are bias without item-level evidence, and do not infer fairness from an absence of statistically significant results in small samples.

## Provisional decision gates

These are planning gates, not universal scientific laws:

- no item returns to scoring after a `needs-rewrite` status without cognitive testing;
- no axis receives a public “reliable” label from item count alone;
- no coefficient is shown when the configured minimum sample is not met;
- no final factor claim is made from the development sample alone;
- no label is called accurate solely because a centroid-generated synthetic profile maps back to itself;
- no historical person, political party, or country is placed on the map without a documented and reviewable response-scoring procedure;
- no short form is promoted until its score agreement and uncertainty are compared with the full form on a holdout sample.

## Dataset interchange format

The TypeScript analysis expects records equivalent to:

```json
{
  "respondentId": "random-study-id",
  "administration": "test",
  "answers": {
    "q0001": { "questionId": "q0001", "value": 2 }
  },
  "selfLabelId": "optional-label-id",
  "group": "optional-preregistered-group"
}
```

A retest uses the same `respondentId` and `administration: "retest"`. Study IDs should be randomly generated and stored separately from any recruitment contact information.

## Current code coverage

`analyzePsychometricStudy` currently provides:

- Cronbach alpha from complete, directionally aligned Likert cases;
- corrected item-total correlations;
- odd-even split-half reliability;
- test-retest Pearson correlations;
- missingness, floor, and ceiling rates;
- directional item balance;
- descriptive-item source and operational-scope coverage;
- optional pre-result self-label top-1/top-3 concordance;
- explicit exclusion of statement-choice and `needs-rewrite` items.

Exploratory/confirmatory factor analysis, omega, bootstrap intervals, and differential item functioning should be implemented in a dedicated R or Python research workflow and checked into the repository with reproducible inputs and outputs.
