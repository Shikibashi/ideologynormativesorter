# Draft pilot validation preregistration

This document is a study template. It must be dated, assigned an immutable version, and registered before inspecting outcome-dependent pilot results.

## Instrument versions

- Research schema: `2026-08-v14`
- Consent text: `2026-08-12-v8`
- Form algorithm: `profile-form-v3`
- Question bank: `2026-06-v4+2026-08-confidence-coverage-v1+2026-08-confidence-coverage-v3+2026-07-semantic-v1+2026-07-statement-semantic-v1+2026-08-respondent-v4+2026-08-editorial-v5+2026-08-editorial-v7.1+2026-08-editorial-v8+2026-08-descriptive-evidence-v1+2026-08-descriptive-evidence-v2+2026-08-descriptive-evidence-v3+2026-08-specialist-descriptive-v3+2026-08-editorial-v9+2026-08-editorial-v11+2026-08-editorial-v12+2026-08-editorial-v13+2026-08-editorial-v14+2026-08-editorial-v15+2026-08-editorial-v16+2026-08-editorial-v17+2026-08-editorial-v18+2026-08-editorial-v19+2026-08-editorial-v20+2026-08-editorial-v21+2026-08-editorial-v22+2026-08-editorial-v23+2026-08-editorial-v24+2026-08-editorial-v25+2026-08-editorial-v26+2026-08-editorial-v27+2026-08-editorial-v28+2026-08-descriptive-evidence-v4+2026-08-descriptive-evidence-v5+2026-08-question-context-v33`
- Experimental specialist waves: `2026-08-specialist-v10`; the revised feminist breadth module is `2026-08-v5`, while identity/sovereignty remains `2026-08-v4`.
- Specialist assignment roster: `2026-08-specialist-roster-v1`
- Specialist assignment strategy: `balanced-hash-v2`
- Scoring: `2026-08-13-taxonomy-v7`
- Taxonomy registry: `2026-08-taxonomy-v12`
- Modifier measurement registry: `2026-08-modifier-construct-v1`; ordinary modifier output is limited to declared direct core indicators, while catalog-only and focused-follow-up modifiers must abstain.
- Study cohort: `community-2026-v4`

Any change to item wording, item-to-axis mapping, eligibility, label centroid, or scoring creates a new analysis cohort unless a linking design is specified in advance.
The ordered specialist assignment roster is likewise frozen within a cohort. A module addition, removal, or reordering requires a new study cohort or assignment strategy; it must never be silently applied to a retest cohort.
The previous `community-2026`, `community-2026-v2`, and `community-2026-v3` cohorts remain historical and must not be pooled with this cohort without a preregistered linking decision.

## Study stages and targets

### Cognitive pilot

Target 24–30 adults spanning substantially different self-described political traditions. Use think-aloud interviews on a stratified item subset. No psychometric coefficient from this stage is confirmatory.

### Development sample

Target 1,500 completed test administrations. Use balanced matrix forms of approximately 120 items where respondent burden requires it. The arithmetic target is at least 300 usable responses per retained item after exclusions; recruitment may continue until this item-level target is met.

### Confirmation sample

Target 1,500 new completed administrations collected after freezing revisions from the development sample. Do not use this sample to rewrite items or choose the factor count.

### Test-retest sample

Target at least 300 matched respondents from the frozen-bank cohort, with a planned interval of 14–28 days. The same participant code and bank/scoring versions are required.

### DIF minimums

Do not run a preregistered group comparison unless every included group has at least 100 usable respondents for the relevant axis. Treat 200 per group as the preferred minimum for graded-response DIF. Collapse categories only when the collapse rule was specified before examining item results.

## Recruitment and sampling

Recruit across multiple channels rather than a single political community. Record a privacy-safe recruitment source in the response record and keep invitation/contact operations separate. The open public link is a nonprobability convenience channel. Quotas or targeted supplementation may improve heterogeneity but do not make it representative.

The study estimates instrument behavior in its achieved sample. It does not claim population prevalence or representative political distributions unless probability sampling and weights are separately justified.

## Inclusion criteria

- age 18 or older;
- explicit consent to pseudonymous research use;
- completion of the assigned form;
- compatible schema, bank, and scoring versions;
- no duplicate completed record for the same participant and administration, except a documented replacement caused by technical failure; adjudication is keyed by the immutable `submissionId`, with at most one included record per administration.

## Exclusion rules

Apply rules without reference to ideology-label outcome:

- invalid or missing consent fields;
- impossible timestamps or negative duration;
- completion faster than the preregistered lower bound established from cognitive-pilot timing;
- invariant responding on at least 95% of non-missing Likert items, unless the response pattern is substantively plausible and passes manual review under a blinded identifier;
- more than 40% missing or `dont_know` responses on the assigned form;
- incompatible item metadata or unknown question IDs;
- duplicate `submissionId` values, and duplicate completed records for the same study, participant code, and administration; distinct-ID technical replacements are resolved in the frozen manifest, while identical answer patterns from different respondents are diagnostic rather than automatic duplicates.

Report counts under every exclusion rule and repeat primary analyses with and without timing/response-pattern exclusions.

## Primary hypotheses

1. Retained items assigned to the same primary axis will show positive corrected item-total correlations after directional alignment.
2. Each retained axis with at least three functioning items will have omega total and alpha estimates above the preregistered minimum for low-stakes group description; coefficients will not be used as proof of unidimensionality.
3. A held-out correlated-factor CFA based on the frozen primary-axis specification will fit better than a one-factor model within each layer.
4. Test-retest rank-order correlation and absolute agreement will be evaluated separately for the primary-axis item model and exact production score.
5. The post-questionnaire, pre-result-display self-label will appear in the model's top three nearby labels more often than a frequency-matched null assignment; it is convergent evidence, not an independent baseline.
6. Shorter forms will preserve rank-order axis scores relative to the extensive form, with uncertainty reported by axis.

Numeric decision thresholds for retention must be registered before outcome analysis. Borderline items should be reviewed using confidence intervals, loadings, content coverage, and cross-group behavior rather than one coefficient alone.

## Primary analyses

- item missingness, `dont_know`, floor, ceiling, and duration distributions;
- directional item balance;
- corrected item-total correlations using the observed item and the respondent's available mean across remaining same-axis items under planned matrix missingness;
- alpha, omega total, odd-even split-half, and percentile bootstrap intervals;
- ordinal EFA on the development split using polychoric correlations and parallel analysis;
- WLSMV CFA on the untouched confirmation or holdout sample;
- test-retest correlations, concordance, mean change, and score-difference distributions;
- top-1 and top-3 self-label concordance;
- graded-response multiple-group DIF with multiplicity adjustment;
- short-form/full-form agreement and score uncertainty;
- label stability under respondent and item bootstrap resampling.

## Factor-analysis decisions

The proposed axis map is the confirmatory model. EFA is allowed to identify alternatives in the development sample. Record factor-retention methods, rotation, excluded items, Heywood cases, non-convergence, cross-loading thresholds, and all model modifications.

No modification index from the confirmation sample may be used to change the primary model. Any revised model becomes exploratory and requires a new confirmation sample.

## Missing data

Treat `dont_know` and `prefer_not_to_answer` as distinct nonresponse categories and as missing for common-scale factor and reliability estimates. Do not numerically place either at the neutral midpoint. Report explicitly skipped confidence/priority ratings separately and exclude those items from salience-weighted production scores. Distinguish planned matrix-form omission from respondent nonresponse. Use a frozen ordinal missing-data strategy and sensitivity analysis; do not select an approach based on which improves fit.

## DIF interpretation

A statistically adjusted DIF flag is not automatically bias. Review wording, construct relevance, category use, effect magnitude, and whether the item measures a genuinely different construct across groups. Report both flagged and non-estimable items.

## Label calibration

Freeze axis scoring before label calibration. Evaluate confusion, runner-up margins, bootstrap stability, and indistinguishable labels. Do not move centroids merely to maximize agreement with self-labels. Self-label evidence is criterion information, not ground truth.

## Data management

Store recruitment contacts separately from response records. Encrypt data at rest, restrict access, maintain a deletion and retention schedule, and publish only aggregate cells that meet the disclosure threshold. Never publish participant codes or raw answer vectors.

## Reporting

Release the preregistration, exact instrument versions, flow diagram, exclusions, analysis code, coefficient intervals, convergence failures, alternative models, and known limitations. A null or poor result is reportable and should not be hidden by silently changing the bank version.
