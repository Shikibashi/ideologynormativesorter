# Empirical validation operations, 2026-08

Status: respondent-only protocol and collection packet. No participant, reliability, validity, or DIF evidence is claimed by this file. Expert review and cognitive interviews are intentionally out of scope for this study.

This packet is the operational bridge between the existing [`psychometric-validation-protocol.md`](psychometric-validation-protocol.md), [`pilot-preregistration.md`](pilot-preregistration.md), and analysis scripts. It keeps the instrument research-only until qualified reviewers and real participants provide data.

## Respondent-only scope decision

This study will collect empirical evidence from consenting respondents. It will not recruit an expert panel or conduct cognitive interviews. Those omissions must remain visible in every report: respondent evidence can support `respondent-supported-scored`, but it cannot establish full content validity. `validated-scoped-public` remains blocked unless a later study supplies the missing content-validity evidence.

## Evidence standard

The score interpretation, not the questionnaire in isolation, is the object of validation. Every claim must identify the construct, population, administration, score, intended use, and evidence supporting that use.

The program uses these content-validity dimensions:

- Relevance: the item represents the intended construct and layer.
- Comprehensiveness: the item set covers the construct without avoidable gaps.
- Comprehensibility: intended respondents and reviewers understand the item as specified.

The program does not convert source coverage or editorial agreement into empirical validity. Source-backed definitions are necessary content evidence, not respondent evidence.

## Workstream 1: qualified expert review, out of scope

No expert panel will be recruited for this study. The reviewer fields below are retained as a future-use template only and must not be reported as completed evidence.

### Future-use template: panel and independence

Recruit at least three qualified reviewers, with a larger and ideologically diverse panel preferred. The panel should cover political theory, ideology measurement, survey methodology, and the relevant specialist domains. Record qualification, domain, conflicts, compensation, and recusal before review.

Reviewers must work from a frozen item and label manifest. Do not show predicted results, score maps, or outcome data while collecting item judgments. One coordinator may manage the manifest but must not rewrite reviewer judgments.

### Reviewer record

The minimum de-identified reviewer table is:

```text
reviewer_id,item_id,label_id,layer,construct,axis_sign,relevance,clarity,comprehensibility,double_barreled,leading,descriptive_scope,group_meaning,notes,decision
```

Use pre-specified ordinal scales for relevance, clarity, and comprehensibility. Use explicit flags for double-barreled wording, leading language, ambiguous group referents, and descriptive scope. `decision` must be one of `retain`, `revise`, `remove`, or `escalate`.

The adjudication record must preserve every original judgment and add:

```text
item_id,adjudication_id,reviewer_ids,disagreement_type,decision,rationale,revision_required,manifest_version
```

Do not average away a construct disagreement. Escalate disagreements about whether an item is normative, descriptive, prescriptive, ideal, or non-ideal. A revision creates a new item version and requires fresh review.

### Expert-review gate

The expert workstream is complete only when every active item has a decision, every `escalate` record has an adjudication disposition, the frozen manifest identifies the reviewed version, and the report distinguishes panel agreement from expert qualification. It is not complete because a researcher has read the labels.

## Workstream 2: cognitive interviews, out of scope

No cognitive interviews will be conducted for this study. The interpretation of normative, descriptive, prescriptive, ideal, and non-ideal prompts therefore remains a content-validity limitation.

### Future-use template: sampling and procedure

Use a purposive cognitive sample, normally 20 to 50 people, selected to vary across age, education, political self-description, response style, and any groups whose interpretation could differ. The existing pilot target of 24 to 30 is an appropriate first wave, not a population estimate.

Use think-aloud and verbal-probe interviews. Probe four response stages:

- Comprehension: what does the item mean in the respondent's own words?
- Retrieval: what information or experience did the respondent recall?
- Judgment: what comparison or standard did the respondent apply?
- Response: why did the selected option fit, and what alternative was considered?

Probe at least one item from each construct layer and the ideal/non-ideal pair. Do not coach respondents toward the intended ideology or disclose the expected endpoint.

### Interview record and coding

Keep recordings and direct identifiers outside the response dataset. The de-identified coding table is:

```text
interview_id,respondent_stratum,item_id,layer,probe_stage,interpretation,observed_problem,problem_code,impact,corrective_action,coder_id
```

`problem_code` is one or more of `construct-mismatch`, `scope-error`, `recall-failure`, `judgment-uncertainty`, `response-option-gap`, `social-desirability`, `double-barrel`, `leading`, `ideal-nonideal-confusion`, or `none`. `impact` is `low`, `medium`, or `high`.

Use two independent coders for a subset, adjudicate disagreements, and compare problem rates across respondent strata. A cognitive interview finding is a response-process finding; it is not a reliability coefficient or a population prevalence estimate.

### Future-use gate, not part of this study

Before pilot scoring, resolve every high-impact problem, document retained wording with rationale, and create a new frozen item version when wording changes. Re-interview changed items when the change could alter the construct, scope, layer, or ideal/non-ideal interpretation.

## Workstream 3: pilot, reliability, and test-retest

Use the existing consented pilot and retest contracts. Keep development and confirmation samples separate, freeze item membership before outcome inspection, and collect a matched retest 14 to 28 days after the first administration.

Report, by unidimensional score and with the intended missing-data rule:

- Internal consistency with alpha and omega, including uncertainty intervals.
- Item-total information and floor/ceiling behavior.
- Test-retest association and absolute agreement, not correlation alone.
- Standard error of measurement and mean change with uncertainty.
- Any exclusions, missingness, attrition, and retest timing deviations.

The existing R pipeline remains the source of these estimates. This packet does not lower its minimum sample gates.

## Workstream 4: known-groups validity

Known-groups validity requires an external criterion established independently of this instrument. Do not use `selfLabelId`, predicted ideology labels, or a post-hoc interpretation of the instrument as the known group.

Before collecting outcomes, register each contrast in a plan table with:

```text
hypothesis_id,group_variable,score_id,higher_group,lower_group,expected_direction,min_group_n
```

The external group table must be separately protected and contain only:

```text
participant_id,group_variable,group_level
```

The score table supplied to the runner must contain frozen test scores only:

```text
participant_id,administration,score_id,score
```

Run:

```bash
Rscript analysis/run_known_groups.R scores.csv known-groups.csv known-groups-plan.csv output/known-groups
```

`analysis/run_known_groups.R` fails closed for missing columns, duplicate assignments, duplicate scores, missing score IDs, non-numeric scores, and absent test administrations. It reports no estimate when either group is below its pre-specified minimum. Estimable contrasts include group means, the higher-minus-lower difference, Welch confidence intervals and p-values, Hedges g, and directional support. These are research outputs, not an automatic validity pass.

Use at least 100 participants per group for a preliminary contrast and prefer 200 or more where subgroup inference is intended. Register the eligibility rule, recruitment source, exclusion rule, expected direction, score family, multiplicity adjustment, and sensitivity analyses before inspecting results. Do not collapse groups or change directions because of observed scores.

## Workstream 5: subgroup and DIF analysis

Use voluntary, ethically collected subgroup variables and the existing minimum gates. Analyze measurement invariance or graded-response DIF with the pre-specified age and gender group definitions, multiplicity adjustment, effect-size or impact thresholds, and content review of flagged items.

A statistically flagged item is not automatically biased. Review whether the difference is construct-relevant, a translation or comprehension issue, a response-style artifact, or a genuine lack of invariance. A subgroup result is not publishable as a fairness conclusion until sample adequacy, missingness, model fit, multiplicity, and substantive impact have all been reported.

## Release gates

The following statuses must remain separate:

- `protocol-ready`: collection and analysis procedures are specified.
- `collection-ready`: consent, recruitment, version, privacy, and operator checks are complete.
- `data-collected`: the required real records exist and pass data-quality checks.
- `analysis-complete`: pre-specified estimates and uncertainty are reproducible.
- `interpretation-supported`: the evidence supports the stated score interpretation for the stated population and use.

Only `respondent-supported-scored` may be assigned from the respondent-only program, and only after the registered respondent analyses pass. `validated-scoped-public` remains unavailable because expert and cognitive content-validity evidence was not collected. None of these workstreams may silently promote a specialist label, an ordinary result card, or the frozen production scorer.

## Ethics and privacy

Collect only the attributes needed for the registered question. Keep consent, contact, incentive, interview recordings, external group eligibility, and response data in separate access-controlled stores. Use participant codes, not names or email addresses, in analysis files. Permit withdrawal before analysis according to the approved protocol and preserve a withdrawal audit without retaining unnecessary identity data.

## Research basis

- [AERA, APA, and NCME Standards for Educational and Psychological Testing](https://www.apa.org/science/programs/testing/standards?clearcache=true)
- [COSMIN measurement properties and reporting guidance](https://www.cosmin.nl/research-publications/)
- [COSMIN reporting guideline](https://www.cosmin.nl/wp-content/uploads/EE-document_final-version-website.pdf)
- [CDC CCQDER cognitive interviewing guidance](https://www.cdc.gov/nchs/ccqder/question-evaluation/cognitive-interviewing.html)
- [COSMIN methodology for evaluating measurement properties](https://pmc.ncbi.nlm.nih.gov/articles/PMC2852520/)
