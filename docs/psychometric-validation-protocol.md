# Psychometric validation protocol

## Status

The collection and analysis apparatus is implemented, but empirical validation has not been established. This is a single-maintainer project; no external expert panel, cognitive-interview program, independent confirmation sample, or test-retest study is currently scheduled. The stages below state what stronger evidence would require, not a promised fieldwork program. Synthetic fixtures and software tests are not respondent evidence. No reliability, validity, fairness, or accuracy coefficient should be published until an appropriate consented respondent dataset has been collected and analyzed.

The repository now includes:

- `src/validation/psychometrics.ts` for respondent-grounded classical diagnostics;
- an opt-in browser research mode with consent and post-questionnaire, pre-result-display self-identification;
- deterministic balanced matrix forms with fixed test/retest item membership and changed presentation order;
- a pseudonymous versioned submission/export schema;
- a dependency-free reference collector;
- `analysis/run_data_quality.R` for draft-rule quality flags and a resolvable inclusion manifest;
- `analysis/run_validation.R` for an item measurement model, exact production-score reconstruction, internal EFA/CFA diagnostics, test-retest agreement, criterion concordance, and DIF;
- a preregistration and recruitment/retest operations plan.

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
4. Do results agree, within expected limits, with post-questionnaire self-identification and established external measures?
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

Contribution mode is enabled explicitly. The public flow omits `formSize` and uses the complete selected consumer
profile. A controlled `research=1` URL may request a balanced matrix form with `formSize`.

```text
?research=1&study=community-2026-v5&formSize=120
```

A retest administration uses:

```text
?research=1&study=community-2026-v5&administration=retest&formSize=120
```

The flow requires consent before the quiz, captures optional self-identification and broad demographic groups after the questionnaire but before showing results, and assigns a stable random participant code in the same browser. Test and retest preserve identical participant-specific item membership while using different deterministic presentation orders. It does not request names, email addresses, exact age, precise location, employer, party registration, or contact information.

The reference collector validates the frozen method contract before append: exact schema, consent, quality-rule, form, and taxonomy versions; internally consistent timestamps and duration; ordered item/answer membership; recomputed form fingerprint; layer-appropriate confidence, priority, refusal, and skipped-salience states; and, when present, a deterministic specialist assignment with the configured strategy, roster version, and module list. Optional deployment variables can additionally pin the study, bank, scoring, taxonomy, and specialist-assignment contract.

Capture:

- pseudonymous participant ID;
- test or retest administration;
- bank, scoring, schema, and consent versions;
- selected test length and assigned presentation order;
- start, completion, and submission timestamps;
- total duration and resume status;
- item responses and confidence/priority values;
- optional post-questionnaire, pre-result-display self-label from the instrument label set;
- optional respondent-supplied ideology or tradition names for a private candidate-discovery report;
- optional broad age band and gender group for preregistered DIF analysis;
- exact respondent-visible item text, help, response options, item mappings, and form fingerprint;
- separate `dont_know`, `prefer_not_to_answer`, and skipped-salience states;
- open-opt-in sampling design and privacy-safe recruitment source;
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
- response-time distributions;
- floor and ceiling rates;
- straight-line or invariant response patterns;
- duplicate participant-administration records, shared answer-vector diagnostics, and suspicious submissions under a documented rule;
- resumed-session counts and version incompatibilities.

`analysis/run_data_quality.R` writes quality flags but does not delete records. Exclusions must follow the frozen preregistration and should be reported with sensitivity analyses.

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

Use exploratory factor analysis on a development split and confirmatory factor analysis on an internally held-out split for exploratory software output only. A separately recruited frozen cohort would be needed for independent confirmation. The checked-in R workflow uses ordinal polychoric correlations and minimum-residual EFA, then WLSMV CFA with pairwise planned-missing handling on a primary-axis specification.

The primary-axis factor model is an item measurement model; it does not reproduce the multidimensional score shown to users. The workflow therefore emits a separate production score using every axis weight, statement-option weight, and confidence/priority multiplier. Evidence about one model must not be presented as evidence about the other.

Compare, where sample size permits:

- the proposed axis structure;
- correlated-factor alternatives;
- higher-order or bifactor models where theoretically justified;
- simpler models that may explain the data with fewer dimensions.

Report loadings, cross-loadings, factor correlations, CFI, TLI, RMSEA, SRMR, convergence problems, and item exclusions. The primary-axis model is a starting specification, not evidence that cross-loadings are zero.

### Temporal stability

For each axis, report rank-order test-retest correlation, concordance, bootstrap intervals where defined, and score-change distributions. Report the primary-axis item model separately from the exact production score. Separate temporal instability from low internal consistency.

### Criterion and convergent evidence

Capture optional self-identification after the questionnaire but before results are shown and report top-1 and top-3 label concordance. Treat this only as post-questionnaire convergent evidence: the preceding questions may prime self-description, self-labels are ambiguous, and the label set is not exhaustive.

Where licensing and respondent burden permit, compare relevant axes with established external scales. Predefine expected convergent and discriminant relationships before analysis.

### Label calibration

Labels should be calibrated only after the axis measurement model is supported. Report:

- nearest-label stability under bootstrap resampling;
- top-label changes when low-information items are removed;
- runner-up margins;
- confusion matrices against post-questionnaire, pre-result-display self-labels;
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
  "schemaVersion": "2026-08-v15",
  "submissionId": "random-idempotency-key",
  "studyId": "community-2026-v5",
  "participantId": "p_random-code",
  "administration": "test",
  "submittedAt": "2026-07-18T12:31:00.000Z",
  "startedAt": "2026-07-18T12:00:00.000Z",
  "completedAt": "2026-07-18T12:30:00.000Z",
  "durationMs": 1800000,
  "resumed": false,
  "presentationOrder": ["q0001", "q0037"],
  "form": {
    "algorithmVersion": "profile-form-v3",
    "requestedItemCount": 120,
    "assignedItemCount": 120,
    "fingerprint": "rf_example"
  },
  "sampling": {
    "design": "open-opt-in-nonprobability",
    "populationInference": false,
    "weighting": "none",
    "recruitmentSource": "direct-or-unknown",
    "recruitmentSourceProvenance": "url-parameter-unverified"
  },
  "bankVersion": "2026-06-v4+2026-08-confidence-coverage-v1+2026-08-confidence-coverage-v3+2026-08-confidence-coverage-v4+2026-07-semantic-v1+2026-07-statement-semantic-v1+2026-08-respondent-v5+2026-08-editorial-v5+2026-08-editorial-v7.1+2026-08-editorial-v8+2026-08-descriptive-evidence-v1+2026-08-descriptive-evidence-v2+2026-08-descriptive-evidence-v3+2026-08-specialist-descriptive-v3+2026-08-editorial-v9+2026-08-editorial-v11+2026-08-editorial-v12+2026-08-editorial-v13+2026-08-editorial-v14+2026-08-editorial-v15+2026-08-editorial-v16+2026-08-editorial-v17+2026-08-editorial-v18+2026-08-editorial-v19+2026-08-editorial-v20+2026-08-editorial-v21+2026-08-editorial-v22+2026-08-editorial-v23+2026-08-editorial-v24+2026-08-editorial-v25+2026-08-editorial-v26+2026-08-editorial-v27+2026-08-editorial-v28+2026-08-descriptive-evidence-v4+2026-08-descriptive-evidence-v5+2026-08-question-context-v33",
  "scoringVersion": "2026-08-13-taxonomy-v8",
  "taxonomyVersion": "2026-08-taxonomy-v13",
  "primaryMeasurementVersion": "2026-08-primary-core-v1",
  "modifierMeasurementVersion": "2026-08-modifier-construct-v1",
  "primaryLabelRosterFingerprint": "lr_3cc0f435",
  "modifierLabelRosterFingerprint": "lr_eb26ed76",
  "tier": "moderate",
  "consent": {
    "ageConfirmed": true,
    "voluntaryParticipation": true,
    "dataUseAccepted": true,
    "consentVersion": "2026-08-12-v8",
    "consentedAt": "2026-07-18T11:59:00.000Z",
    "disclosureSnapshot": {
      "endpointConfigured": true,
      "transferAndWithdrawalNotice": "the exact notice shown",
      "retentionNotice": "the exact retention notice shown",
      "contactNotice": "the exact contact notice shown"
    }
  },
  "identity": {
    "selfLabelId": "optional-label-id",
    "selfReportedIdeologies": "optional, comma-separated respondent wording",
    "ageBand": "optional-broad-band",
    "genderGroup": "optional-broad-group"
  },
  "predictedLabelIds": ["top-label", "runner-up"],
  "predictedModifierIds": ["modifier-label"],
  "specialistAssignment": {
    "moduleId": "identity-sovereignty-module",
    "strategy": "balanced-hash-v2",
    "rosterVersion": "2026-08-specialist-roster-v1"
  },
  "answers": {
    "q0001": { "questionId": "q0001", "value": 2 }
  },
  "locale": "en-US",
  "qualityRuleVersion": "data-quality-v2",
  "itemMap": [
    {
      "questionId": "q0001",
      "prompt": "Exact presented prompt",
      "responseOptions": []
    }
  ]
}
```

`submissionId` is the immutable record key. The collector loads prior IDs from both NDJSON stores at startup, acknowledges an exact retry without appending it again, and rejects reuse of an ID for different content. Quality and inclusion manifests retain this ID so a documented technical replacement with a different ID can be adjudicated without conflating both records.

A retest uses the same participant code and `administration: "retest"`. Same-browser linkage is automatic. Any cross-device linkage system must avoid exposing recruitment identity in the response dataset.

## Reproducible workflow

Run quality flags and the external analysis with:

```bash
Rscript analysis/run_data_quality.R private-data/submissions.ndjson analysis/output
Rscript analysis/run_validation.R private-data/submissions.ndjson analysis/output analysis/output/analysis-inclusion-manifest.csv
```

The workflows write version-specific JSON and CSV outputs for quality flags, reliability, omega, bootstrap intervals, item-total correlations, test-retest stability, criterion concordance, source coverage, EFA loadings, held-out CFA fit, and DIF. See `analysis/README.md` for dependencies and thresholds.

## Current limitation

The software can prepare and analyze consented exploratory records, but the repository contains no real pilot sample and the study template is not an immutable preregistration. Public results must continue to describe the instrument as unvalidated. Any future diagnostics are version-specific evidence about the achieved opt-in sample, not population estimates.
