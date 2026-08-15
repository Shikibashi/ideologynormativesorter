# Methodological Change Decision Log — 2026-08

Decision-log version: `2026-08-methodological-decisions-v1`
Architecture authority: [`measurement-architecture-specification-2026-08.md`](measurement-architecture-specification-2026-08.md)
Implementation authority: [`measurement-architecture-implementation-specification-2026-08.md`](measurement-architecture-implementation-specification-2026-08.md)

This log records authorization and disposition. A research authorization does
not authorize a participant-facing scoring change. Production promotion
requires a new decision record with semantic, cognitive, psychometric,
criterion, fairness, and reproducibility evidence.

## Decision status

| ID   | Decision                                            | Authorization               | Current disposition                                         |
| ---- | --------------------------------------------------- | --------------------------- | ----------------------------------------------------------- |
| D-00 | Synchronize live repository contract                | Documentation sync, P0      | Implement documentation and version checks; preserve code   |
| D-01 | Formal crossed construct map                        | Adopted architecture, P0    | Add map metadata and coverage validation                    |
| D-02 | Matched normative/descriptive/prescriptive families | Research-approved           | Map first; new items remain research-only until review      |
| D-03 | Layer-specific estimators                           | Research-approved           | Compare parallel estimators; keep current scorer            |
| D-04 | Multi-item calibrated banks and sampling            | Partial, research           | Add roles/manifests only; do not promote calibration claims |
| D-05 | Response-format diversification                     | Partial, research           | Add opt-in task formats with separate validators            |
| D-06 | Epistemic uncertainty for descriptive beliefs       | Adopted invariant           | Preserve distinct nonresponse and salience states           |
| D-07 | Probability and forecast tasks                      | Research-approved           | Research-only resolved-outcome analysis                     |
| D-08 | Constrained-choice/conjoint strategy                | Research-approved           | Research-only randomized task and estimand                  |
| D-09 | Normative trade-off/allocation tasks                | Research-approved           | Research-only ipsative/value-weight analysis                |
| D-10 | Self-identification as criterion                    | Adopted invariant           | Keep post-questionnaire and outside scoring                 |
| D-11 | Traditions as narrower-construct profiles           | Production hold             | Keep current scopes and provisional prototypes              |
| D-12 | Probabilistic prototypes/calibrated affinity        | Production hold             | Research adapter only; retain similarity language           |
| D-13 | External political-psychology validators            | Research-approved           | Separate criterion records and consent                      |
| D-14 | Layer-specific criterion validity                   | Research-approved           | Frozen criterion matrix and held-out evaluation             |
| D-15 | Reliability/information/precision                   | Partial, research           | Keep participant coverage fields; add research outputs      |
| D-16 | IRT/CFA/model comparison                            | Research-approved           | Parallel analysis; no production replacement                |
| D-17 | Unfolding models                                    | Research-approved           | Candidate annotations and pilot comparison                  |
| D-18 | Perception geometry                                 | Research-approved           | Exploratory similarity/sort tasks                           |
| D-19 | Latent profiles/classes/networks                    | Research-approved           | Exploratory outputs only                                    |
| D-20 | DIF and invariance                                  | P0 design, P1 analysis      | Scope- and sample-gated group analysis                      |
| D-21 | Wording/order experiments                           | P0 review gate, P1 research | Version exact prompts and deterministic arms                |
| D-22 | Expert content review                               | Adopted release gate        | Require aggregate review records before activation          |
| D-23 | Cognitive interviews                                | Adopted release gate        | Require response-process evidence before activation         |
| D-24 | Expert-coded traditions/bridge respondents          | Research-approved           | Scope-bounded prototype study                               |
| D-25 | Geographic/language/historical versioning           | Research-approved           | No cross-scope claims without linking evidence              |
| D-26 | Longitudinal anchors/rotating items                 | Research-approved           | Freeze rotation manifest and linking plan                   |
| D-27 | Randomized label exposure                           | Research-approved           | Research arm after substantive responses only               |
| D-28 | Balanced/Full-depth equivalence                     | Partial, research           | Compare forms; do not promote Balanced from counts alone    |
| D-29 | Open-opt-in/version-linked data management          | Adopted contract, P0        | Preserve consent, provenance, inclusion, and version gates  |

## Unresolved production decisions

U1 primary roster/Fascism; U2 production estimator; U3 empirical axis
structure; U4 cross-layer label construction; U5 prescriptive strategy model;
U6 confidence/priority meaning; U7 label calibration/posterior language; U8
Specialist promotion; U9 populism; U10 state-capitalism/regime descriptors;
U11 technology/future labels; U12 geography/language/translation; U13 public
ranking depth/tie rule; U14 coverage API naming; U15 population estimands.

These unresolved decisions permit documentation and research scaffolding. They
keep production taxonomy, scoring, ranking, public probabilities, subgroup
claims, cross-national claims, and population claims at the current evidence
boundary.

## D-27A — Label-exposure presentation contract

**Status:** adopted methodological clarification; research-only. This decision
does not alter `buildResultProfile`, axis aggregation, label matching, ordinary
result language, or the deterministic post-response assignment in D-27. It
defines the presentation that must be implemented before collecting data under a
new label-exposure presentation version. The existing `2026-08-label-exposure-v1`
contract must not be silently reinterpreted; implementation of this clarification
requires a presentation-version bump and a preregistration amendment before
field use.

### Design invariant

All three randomized arms receive the same substantive profile. The profile is
computed once from the completed core answers and the frozen production
question-bank, taxonomy, and scoring versions. It is rendered through one common
presentation component with the same axis set, layer grouping, axis order,
axis names, qualitative positions, evidence-coverage wording, uncertainty note,
and rating questions in every arm.

`dimension-only` and `unlabeled-profile` remain separate assignment values for
the preregistered randomization and analysis record, but they are the same
participant-facing no-label control. Their headings or arm metadata must not
create a substantive-information difference. The study must not compare them as
different presentation treatments unless a later preregistration explicitly
authorizes and versions a framing experiment.

### Common participant-facing information

Every arm may display:

- the fixed heading `Substantive profile`;
- the same three layer sections: `Normative`, `Descriptive`, and `Prescriptive`;
- every axis in the frozen result profile, in the same deterministic order;
- each axis name and pole names;
- one qualitative axis-position phrase from the existing result-language
  contract: `near the midpoint`, `slightly toward [pole]`, `leans toward
[pole]`, or `strongly toward [pole]`;
- one qualitative evidence-coverage phrase from the existing coverage contract:
  `broad answer coverage`, `moderate answer coverage`, `limited answer
coverage`, or `too little answer coverage`; an axis with `itemCount = 0` is
  shown as `unmeasured`;
- the same fixed notice: `This is a profile-similarity comparison, not a
diagnosis, probability, validated identity, or population claim. Some
dimensions are more tentative when answer coverage is limited.`;
- the same five optional post-exposure rating questions and the same explicit
  `Prefer not to answer` path.

The common profile must not omit an axis because it is unmeasured, and it must
not impute or substitute a value for an unmeasured axis. Evidence coverage is a
descriptive disclosure of observed answer coverage, not a reliability,
accuracy, posterior, or validity claim.

### Exact arm difference

| Arm                 | Participant-facing content                                                                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dimension-only`    | The common substantive profile only. No ideology, tradition, family, or label name is shown.                                                                                            |
| `unlabeled-profile` | Exactly the same visible content as `dimension-only`. The distinction exists only in the randomized assignment and persisted arm field.                                                 |
| `named-label`       | The common substantive profile plus an ordered list of up to three `nearestLabels` names, using the frozen current roster. The list is introduced as `Closest current profile matches`. |

The named-label arm may add only the label names and their frozen order. It must
not add label descriptions, family or subfamily names, fit scores, distances,
runner-up margins, percentages, probabilities, posteriors, or label-specific
confidence/uncertainty numbers. Its explanatory notice must say that the names
describe similarity in the measured profile and do not identify the participant.

### Numeric precision and terminology

Raw and normalized axis values are computation-only. Neither may appear in the
participant-facing label-exposure screen, including as decimals, percentages,
tooltips, ARIA text, data labels, bars with numeric equivalents, or serialized
presentation text intended for display. No axis score is rounded for display;
there is therefore no permitted display precision for axis scores.

The qualitative position and coverage phrases above are the complete permitted
display precision. The 1–5 response options for the post-exposure rating
questions remain allowed because they are outcome-response scales, not axis
scores. Participant-facing copy must use `profile`, `profile similarity`,
`profile match`, `evidence coverage`, `unmeasured`, and `tentative` language.
It must not use `you are [label]`, `identity`, `diagnosis`, `probability`,
`posterior`, `population`, `representative`, or numeric `confidence` language.
The existing self-report prompt about confidence in the participant's reaction
and its 1–5 response scale remain permitted; that response is an outcome
measure, not a claim about profile or label certainty.

### Persisted outcome contract

Every completed or explicitly unshown outcome must persist:

- the assignment object, including presentation version, study ID, participant
  code, arm, deterministic seed, and the fact that assignment occurred after
  substantive responses;
- `exposureShown` and, when applicable, `missingReason`;
- the common-profile presentation fingerprint plus the ordered axis IDs,
  layer values, qualitative position tokens, and evidence-coverage bands that
  were rendered;
- `exposedLabelIds` as an ordered list matching the displayed names in the
  `named-label` arm, and an empty list for both no-label arms;
- the existing perceived-accuracy, identity-acceptance, reaction-confidence,
  affect, and expected-follow-up-stability responses, preserving omitted and
  refused values as missing rather than midpoint values.

The persisted presentation snapshot must contain no raw or normalized axis
values. Core answers and frozen version metadata remain the source for later
recomputation; the snapshot records what was actually presented.

### Implementation acceptance criteria

Codex implementation is accepted only when:

1. all three arms render the same common-profile component from the same result
   object and have identical axis IDs, layer grouping, ordering, qualitative
   position tokens, coverage bands, notice text, and rating-field order;
2. the two no-label arms render no ideology/tradition/family/label names and
   differ only in the persisted arm assignment, not visible content;
3. the named-label arm renders exactly the ordered top-three-or-fewer label
   names and persists the same ordered label IDs;
4. no raw/normalized axis number, percentage, fit, distance, margin,
   posterior, or probability appears in rendered text, accessible text,
   tooltips, or presentation snapshots;
5. unmeasured axes remain visible as `unmeasured`, and coverage wording is
   identical across arms;
6. outcome validation rejects label IDs in either no-label arm, rejects a
   missing or reordered named-label list, rejects a missing common-profile
   fingerprint/snapshot, and preserves explicit missingness for all ratings;
7. browser tests visit all three arms, compare the common-profile DOM/content
   snapshots, assert the exact named-label-only difference, scan accessible
   text for forbidden numeric/result-language terms, complete each arm, and
   verify the serialized outcome and receipt;
8. unit tests prove deterministic arm assignment, qualitative position/coverage
   formatting, exact top-label selection, and versioned presentation-fingerprint
   validation.
