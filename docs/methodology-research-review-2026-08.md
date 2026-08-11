# Survey-methodology review — 2026-08

## Scope

This review compares the instrument’s respondent flow, sampling claims, matrix forms, response options, submission schema, and analysis workflow with public survey-methodology guidance and peer-reviewed measurement research. It does not treat those sources as evidence that this instrument is reliable or valid. No respondent coefficient is inferred from code or synthetic tests.

## Source comparison

| Source | Relevant finding | Decision in this codebase |
|---|---|---|
| [Pew Research Center, Writing Survey Questions](https://www.pewresearch.org/writing-survey-questions/) | Clear, specific, single-concept wording matters; agree/disagree formats are vulnerable to acquiescence; randomization distributes order effects rather than removing them. | Known double-barreled or construct-mismatched items are quarantined. Ordered scales remain stable for comparability. A future item-specific-scale experiment would require a new bank version and split-ballot design. |
| [Pew Research Center, Weighting Online Opt-In Samples](https://www.pewresearch.org/methods/2018/01/26/for-weighting-online-opt-in-samples-what-matters-most/) | Weighting can reduce some opt-in bias but does not reliably remove it; adjustment-variable choice matters. | The public link is recorded and disclosed as open opt-in/nonprobability. The application applies no population weights and makes no prevalence or margin-of-error claim. |
| [Pew Research Center, Probability and Opt-In Samples](https://www.pewresearch.org/methods/2023/09/07/comparing-two-types-of-online-survey-samples/) | In Pew’s benchmark comparison, opt-in samples had materially larger average errors than probability panels. | Sample size is not presented as a remedy for self-selection. Results are limited to instrument behavior in the achieved sample. |
| [YouGov methodology](https://yougov.com/en-us/about/methodology) | YouGov’s population estimates depend on a defined target population, managed panel invitations, sample matching, and benchmark weighting. | An unrestricted public URL is not described as YouGov-like or representative. Privacy-safe recruitment source is captured for achieved-sample diagnostics only. |
| [Yale Program on Climate Change Communication, SASSY](https://climatecommunication.yale.edu/publications/global-warmings-six-americas-short-survey-audience-segmentation-of-climate-change-views-using-a-four-question-instrument/) | Yale’s short form was derived and tested across multiple national samples with cross-validation rather than selected from face validity alone. | Short-form equivalence and label calibration remain unestablished. Synthetic separability cannot promote a short form or justify centroid tuning. |
| [AAPOR Best Practices](https://aapor.org/standards-and-ethics/best-practices/) | Sampling frame, burden, question order, exhaustive options, nonresponse choices, pretesting, and transparent limitations should be addressed. | Consent discloses item count, unknown timing estimate, foreseeable discomfort, transmission state, and governance gaps. Research questions offer distinct uncertainty and refusal; skipped salience is explicit. |
| [AAPOR Disclosure Standards](https://aapor.org/standards-and-ethics/disclosure-standards/) | Exact wording/instructions, recruitment, probability status, weighting, dates, sample sizes, quality checks, and limitations are needed for reproducibility. | Schema v5 snapshots exact prompt/help/options and salience follow-up, form version/fingerprint, sampling design, locale, recruitment source, and quality-rule version. |
| [Krosnick, 1991, Response Strategies for Coping with the Cognitive Demands of Attitude Measures](https://onlinelibrary.wiley.com/doi/pdf/10.1002/acp.2350050305) | High burden can produce satisficing, acquiescence, primacy, straightlining, and no-opinion responses. | Form size and per-assigned-item duration are recorded. Straightlining is a review flag, not proof of invalidity. Completion burden must be learned from actual use rather than asserted. |
| [Weijters and Baumgartner, 2012, Misresponse to Reversed and Negated Items](https://journals.sagepub.com/doi/10.1509/jmr.11.0368) | Reversed or negated wording may reduce acquiescence but can add confusion and method factors. | Directional balance is not repaired by mechanically negating prompts. Opposite-pole replacements require substantive wording and a new item ID. |
| [Bowen and Masa, 2015, Conducting Measurement Invariance Tests with Ordinal Data](https://www.journals.uchicago.edu/doi/10.1086/681607) | Ordinal invariance needs suitable categorical estimators and adequate evidence before cross-group mean interpretation. | The analysis uses an ordinal WLSMV starting model and does not authorize group score comparisons merely because DIF is nonsignificant. Fixed group-size gates are computation gates, not universal adequacy thresholds. |
| [CDC CCQDER](https://www.cdc.gov/nchs/CCQDER/index.html) | Cognitive question evaluation examines how respondents understand and answer survey items. | Proposed replacement wording remains outside scoring. Editorial plausibility alone does not establish respondent comprehension. |

## Implemented corrections

1. Test and retest now use identical participant-specific item membership, with a different deterministic presentation order. The form algorithm version and membership fingerprint are stored.
2. Research progress stores study, participant, administration, bank, form, fingerprint, and original start time so reloads cannot silently become a different session.
3. Schema v5 stores the respondent-visible instrument, statement-option mappings, salience prompts/options, locale, quality-rule version, and a submission identifier.
4. `I don't know`, `Prefer not to answer`, and an explicitly skipped confidence/priority rating are distinct states. None is placed at the neutral midpoint. Explicitly skipped salience excludes that item from the salience-weighted result rather than receiving maximum weight.
5. The final research action explicitly says that it submits or prepares the record.
6. Sixteen items with recorded layer, construct, discrimination, or double-barreling defects are `needs-rewrite` and inactive. Coverage loss is reported rather than repaired with known-defective items.
7. The public label output is called a similarity index rather than a percent fit.
8. Quality review distinguishes duplicate participant-administration records from merely identical answer vectors, reports refusal and skipped-salience rates, and supports a per-assigned-item duration rule.
9. Validation requires a frozen inclusion manifest and fails on unresolved decisions, mixed study/schema/bank/scoring/form cohorts, inconsistent item snapshots, invalid categories, or duplicate core records.
10. The analysis reports item assignment incidence and pairwise co-occurrence, gates coefficients on effective pairwise sample size, and reconstructs the exact multidimensional production score separately from the simpler primary-axis item model.

## Deliberately unresolved

- Agreement scales are not converted in place. Item-specific scale candidates need a new version and direct comparison.
- Random order does not eliminate context effects, and dynamically generated matrix forms do not guarantee balanced achieved position counts. Incidence, position, and pairwise-overlap reports must be inspected before model fitting.
- The post-questionnaire self-label is not independent baseline evidence and may be primed by the preceding questions.
- The checked-in CFA is an internal diagnostic split, not independent confirmation.
- Population weights are not appropriate without a named population, benchmark variables, and an adjustment model.
- Reliability, dimensionality, temporal agreement, invariance, criterion performance, short-form equivalence, and label calibration all remain empirical questions.

## Editorial rule carried forward

Ideology names, aliases, sub-ideologies, question prompts, and generated helpers may be corrected without respondent data only when the issue is documentary or semantic and the change does not invent an empirical score. Centroids, axis weights, calibration thresholds, item retention based on performance, and claims about respondent comprehension remain frozen until suitable evidence exists.
