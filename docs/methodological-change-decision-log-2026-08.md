# Methodological Change Decision Log — 2026-08

Decision-log version: `2026-08-methodological-decisions-v4`
Architecture authority: [`measurement-architecture-specification-2026-08.md`](measurement-architecture-specification-2026-08.md)
Implementation authority: [`measurement-architecture-implementation-specification-2026-08.md`](measurement-architecture-implementation-specification-2026-08.md)
Public interpretation authority: [`result-interpretation-public-claims-specification-2026-08.md`](result-interpretation-public-claims-specification-2026-08.md)
Empirical validation authority: [`empirical-validation-architecture-2026-08.md`](empirical-validation-architecture-2026-08.md)
Integrated vNext authority: [`vnext-integrated-system-specification-2026-08.md`](vnext-integrated-system-specification-2026-08.md)
Codex vNext implementation authority: [`vnext-codex-implementation-specification-2026-08.md`](vnext-codex-implementation-specification-2026-08.md)

The Measurement Architecture implementation baseline is frozen at
`f0324dbf27dfc6e35ff557992e4643e3df15ee0e`. Decisions D-30 through D-131 are
cumulative vNext taxonomy and measurement-architecture decisions. They do not
silently modify the frozen production contract; any production consequence
requires a later versioned implementation decision.

The runtime research bundle and quality gate continue to declare
`2026-08-methodological-decisions-v1` until a vNext implementation is
approved. This document version `v4` is the cumulative planning record, not a
retroactive reinterpretation of v1 research records.

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
new label-exposure presentation version. The repository's current
`2026-08-label-exposure-v2` contract is the versioned implementation of this
clarification; the earlier v1 record remains historical and must not be
silently reinterpreted. Any further change requires another presentation
version and a preregistration amendment before field use.

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

## vNext taxonomy and Primary architecture decisions

The full review is recorded in
[`vnext-taxonomy-measurement-architecture-review-2026-08.md`](vnext-taxonomy-measurement-architecture-review-2026-08.md).
The following decisions are the cumulative handoff for the next stage.

| ID   | Decision                                                                                                                      | Authorization                                   | Current disposition                                                                                                                                                                                                           | Dependencies / consequences                                                                                                           |
| ---- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| D-30 | Adjudicate completed taxonomy Deep Research against the frozen Measurement Architecture                                       | Adopted vNext planning decision                 | Adopt all recommendations, with the documented modifications for frozen v13 compatibility, evidence gating, and research-only challenger models                                                                               | No current production role, scorer, question bank, or claim-language change                                                           |
| D-31 | Preserve Primary / Specialist / Modifier / Context as public product roles                                                    | Adopted architecture continuation               | Retain the four roles; do not equate role with conceptual kind or measurement readiness                                                                                                                                       | Existing v13 public behavior remains authoritative until a later role decision                                                        |
| D-32 | Introduce explicit conceptual kinds independently from measurement status                                                     | Adopted vNext ontology                          | Add a controlled conceptual-kind vocabulary covering family anchors, broad traditions, compound/bridge traditions, subtypes, variants, projects, programs, and regime projects                                                | A new ontology registry is required; v13 records remain decodable under their original role/status contract                           |
| D-33 | Represent ideological relationships through a faceted polyhierarchical graph                                                  | Adopted with implementation modification        | Use typed multi-edge relations with domain, layer, historical, and regional facets; preserve current `parentId` and typed relations as v13 history                                                                            | Requires a new graph schema, relation validation, migration mapping, and no in-place reinterpretation of v13                          |
| D-34 | Derive future public roles from conceptual kind, graph relations, measurement status, high-risk policy, and evidence coverage | Adopted with compatibility modification         | Implement only in a versioned vNext resolver; current role arrays remain frozen implementation authority                                                                                                                      | Requires role-policy tests, historical alias handling, and explicit production version bump                                           |
| D-35 | Organize Modifiers into explicit domains and subdimensions                                                                    | Adopted; next implementation stage              | Define economic, authority/institutional, community/sovereignty, culture/recognition, strategy/style, and ecology/technology domains with direct-construct dispositions                                                       | Modifier scores remain direct-indicator-only; no Primary imputation or latent-equivalence claim                                       |
| D-36 | Distinguish heterogeneous Specialist types internally                                                                         | Adopted with modification                       | Add conceptual kinds and module evidence contracts without creating additional public roles by default                                                                                                                        | Module, presentation, community-review, and evidence gates become kind-specific                                                       |
| D-37 | Apply a compositional-residual test to compound Primary candidates                                                            | Adopted conceptual and research rule            | Require historical coherence, non-additive ordering, cross-domain morphology, and a construct residual; apply to every compound candidate                                                                                     | M0/M1 respondent studies are required before independent M1 output; National Conservatism and Liberal Conservatism are priority cases |
| D-38 | Treat constructs/facets as the measurement primitives and traditions as configurations                                        | Adopted with frozen-layer modification          | Use the crossed construct map and layer-specific item metadata; do not present configurations as validated profiles without respondent evidence                                                                               | Question development remains W1/W2 research-only until cognitive, psychometric, criterion, and fairness gates pass                    |
| D-39 | Retain empirical latent-class/profile models as challenger models                                                             | Adopted research-only                           | Permit exploratory profile/class/network comparisons under D-19; do not replace named taxonomy, ordinary scorer, or public language                                                                                           | Requires preregistration, held-out evaluation, criterion comparison, fairness review, and a new promotion decision                    |
| D-40 | Definitive conceptual Primary roster                                                                                          | Adopted conceptual disposition; production hold | Retain all 16 current Primary objects. Retain National Conservatism and Liberal Conservatism as compound/bridge candidates with M1 evidence holds. Promote no Specialist and merge or rename no current Primary in this stage | Current v13 roster remains frozen. Any demotion, merge, or promotion requires a new role/version decision                             |
| D-41 | Primary measurement-status interpretation                                                                                     | Adopted clarification                           | `core-primary` in v13 means ordinary production-contract membership, not respondent validation. vNext status must separately represent content, research, validation, and production readiness                                | Prevents conceptual standing, implementation status, and psychometric claims from being conflated                                     |
| D-42 | Respondent evidence required for M1 beyond M0                                                                                 | Adopted research gate                           | Require response-process distinction, incremental construct value, discriminant behavior, retest stability, criterion interpretation, fairness/scope evidence, and presentation-value review                                  | Failure demotes M1 public role or retains it as a research configuration without erasing conceptual history                           |
| D-43 | Modifier architecture handoff                                                                                                 | Adopted next-stage scope                        | Proceed directly to Modifier domains, subdimensions, host relations, non-equivalence edges, and direct item coverage                                                                                                          | Preserve all existing abstention, version, provenance, layer-separation, and research-record gates                                    |

### Decision-log contradiction and tension record

No genuine contradiction requiring reopening the frozen Measurement Architecture
was found. Two additive implementation tensions are recorded in the vNext
review and must not be silently resolved:

- **T-01:** v13 combines a single `parentId` with typed relations, while vNext
  requires a faceted polyhierarchy. Preserve v13 and add a versioned graph view;
  do not rewrite historical parentage in place.
- **T-02:** v13 derives `core-primary` from the Primary role, while vNext
  requires independent conceptual kind, role, and readiness. Treat v13 status
  as a frozen production-contract value and add independent vNext status
  fields.

These tensions authorize documentation and research scaffolding only. They do
not authorize a production roster, scorer, bank, or participant-language
change.

## D-44 through D-54 — Definitive Modifier architecture

The definitive Modifier review is recorded in
[`vnext-modifier-architecture-review-2026-08.md`](vnext-modifier-architecture-review-2026-08.md).
These decisions are cumulative vNext planning and measurement-design
decisions. They do not change the frozen v13 runtime.

| ID   | Decision                                                                                                               | Authorization                                   | Current disposition                                                                                                                                                                                                                                                                                                               | Dependencies / consequences                                                                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-44 | Replace the flat Modifier ontology with domains, construct facets, configuration nodes, and typed Specialist relations | Adopted vNext ontology                          | Use a faceted polyhierarchical graph; preserve v13 IDs, roles, parentage, and historical records                                                                                                                                                                                                                                  | Requires a versioned ontology registry and role resolver; no in-place v13 rewrite                                                                                 |
| D-45 | Define the authoritative Modifier domains                                                                              | Adopted conceptual architecture                 | Use National Orientation and Political Community; Transnational Moral and Political Order; People-versus-Elite and Popular-Sovereignty Frame; Authority and Institutional Order; Economic Order and Public Finance; Social Relations and Cultural Order; Change, Reform, and Social Improvement; Technology and Human Enhancement | Domains organize constructs but are not scores; child facets must retain independent measurement status                                                           |
| D-46 | Treat Nationalism as a structured domain rather than one undifferentiated Modifier score                               | Adopted with measurement hold                   | Preserve `nationalism` for compatibility; vNext canonical display is National Orientation, with separate salience/priority, membership, sovereignty, economic, territorial, and regional facets                                                                                                                                   | Requires direct item families and dimensionality/discriminant evidence; no current public aggregate                                                               |
| D-47 | Treat Populism as a thin, potentially multi-facet domain                                                               | Adopted with measurement hold                   | Preserve `populism` for compatibility; measure people-centrism, anti-elitism, anti-pluralism, popular sovereignty, and style separately before any aggregate                                                                                                                                                                      | Requires direct items and host-separate evidence; distrust, nativism, direct democracy, and Primary scores are not proxies                                        |
| D-48 | Reclassify left/right variants as configurations unless residual evidence supports an endpoint                         | Adopted conceptual and research rule            | `left-wing-nationalism`, `left-wing-populism`, and `right-wing-populism` remain graph nodes but are not independent Modifier scores                                                                                                                                                                                               | Requires direct component measurement, M0/M1 comparison, discriminant evidence, retest, fairness, and presentation-value review                                   |
| D-49 | Reclassify territorial compounds as bounded projects/configurations                                                    | Adopted conceptual architecture                 | `expansionist-nationalism` and `separatist-nationalism` are retained in the graph but are not generic nationalism scalars                                                                                                                                                                                                         | Requires dedicated territorial, autonomy, statehood, force, and non-domination evidence; focused or Specialist routes remain available                            |
| D-50 | Retain the seven current direct Modifier constructs under the frozen matcher                                           | Adopted compatibility decision                  | Keep Anti-imperialism, Cosmopolitanism, Civil-libertarianism, Decentralist Orientation, Feminist Orientation, Multiculturalism, and Technocratic Orientation as current ordinary direct constructs                                                                                                                                | Preserve `2026-08-modifier-construct-v1`, minimum two indicators, fit/evidence/uncertainty gates, and direct-only matching                                        |
| D-51 | Preserve `ethnonationalist` as a sensitive focused-follow-up construct                                                 | Adopted safety and measurement decision         | Do not infer it from nationalism, tradition, immigration, or a Primary; require identity-and-sovereignty follow-up evidence                                                                                                                                                                                                       | Sensitive membership and exclusion variants require scope, response-process, fairness, and community-informed review                                              |
| D-52 | Set the definitive 24-label dispositions                                                                               | Adopted conceptual disposition; production hold | Retain 12 conceptual Modifier/domain entries with measurement holds; retain 5 configuration/project nodes without independent endpoints; add no new Modifier labels; make no current runtime role change                                                                                                                          | Full per-label disposition and current status are in the definitive review; promotion remains separately authorized                                               |
| D-53 | Establish Modifier promotion and display gates                                                                         | Adopted measurement invariant                   | Require direct construct coverage, cognitive evidence, psychometric/discriminant evidence, retest where relevant, criterion interpretation, fairness/scope review, held-out replication, and display-value review                                                                                                                 | Synthetic prototypes, centroid recovery, software tests, sources, and theoretical coherence cannot establish validity                                             |
| D-54 | Propagate Modifier consequences into the approved Primary architecture                                                 | Adopted architecture clarification              | Shared facets do not erase Primary constructs; National Conservatism and Liberal Conservatism remain M1 candidates subject to the approved compositional-residual test; no Modifier imputes a Primary                                                                                                                             | The earlier Primary review's initial domain sketch is superseded by the definitive Modifier hierarchy, while its roster and respondent gates remain authoritative |

### Modifier-specific unresolved questions

U16 whether National Orientation is one construct or a structured profile;
U17 whether Populism is one thin construct or separable subscales; U18 whether
anti-pluralism belongs inside Populism, democratic-authority constructs, or a
typed relation across both; U19 whether regionalism's identity and institutional
components should be separate public facets; U20 whether Progressivism and
Communitarianism add incremental value beyond current Primary constructs; U21
whether expansion orientation can be measured safely as an ordinary construct
or should remain a focused project module; U22 the public display policy for
derived configurations; U23 the vNext graph and role-resolver migration that
preserves v13 records without reinterpretation.

## D-55 through D-64 — Definitive Specialist architecture

The definitive Specialist review is recorded in
[`vnext-specialist-architecture-review-2026-08.md`](vnext-specialist-architecture-review-2026-08.md).
These decisions are cumulative vNext ontology, product-resolution, and
measurement-design decisions. They do not change the frozen v13 runtime.

| ID   | Decision                                                                                           | Authorization                                   | Current disposition                                                                                                                                                                                                                                                                                           | Dependencies / consequences                                                                                                        |
| ---- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| D-55 | Separate the Specialist product-resolution role from the underlying ideological object             | Adopted vNext ontology                          | Retain Specialist as a public focused-resolution role; add independent `specialistKind`, graph relations, module status, prerequisites, and display policy                                                                                                                                                    | Prevents a Specialist role from being mistaken for a subtype, a latent level, or respondent validity                               |
| D-56 | Definitive Specialist roster                                                                       | Adopted conceptual disposition; production hold | Retain all 78 current Specialist IDs; promote none to Primary or Modifier; demote, merge, retire, and add none in this stage                                                                                                                                                                                  | Current v13 role/status and historical records remain frozen; full per-label dispositions are in the definitive review             |
| D-57 | Controlled Specialist kind vocabulary                                                              | Adopted vNext ontology                          | Use family-anchor, subtype-tradition, compound-tradition, bridge-tradition, historical-regional-variant, identity-sovereignty-tradition, institutional-project, economic-doctrinal-tradition, strategic-organizational-current, intellectual-current, regime-or-authoritarian-project, and sensitive-compound | Kind is independent from public role, module assignment, and respondent readiness                                                  |
| D-58 | Formalize a faceted polyhierarchical Specialist graph                                              | Adopted with compatibility modification         | Add `subtype_of`, `hybrid_of`, `requires`, `overlaps_with`, `often_combines_with`, `regional_variant_of`, `influenced_by`, and `institutionalizes`; preserve v13 `parentId` and relations                                                                                                                     | Requires graph validation and migration metadata; no in-place reinterpretation of historical edges                                 |
| D-59 | Preserve the nine-module assignment surface                                                        | Adopted compatibility decision                  | Retain `balanced-hash-v2`, `2026-08-specialist-roster-v1`, nine module IDs, and 68 active Specialist questions                                                                                                                                                                                                | Any roster/module change requires a new strategy or research cohort; assignment is not a conceptual fit claim                      |
| D-60 | Classify current module status separately from validity                                            | Adopted measurement clarification               | 39 labels remain module-assigned experimental; 39 remain catalog-only; four high-risk catalog entries are candidate-module priorities; no label is validated-specialist                                                                                                                                       | Requires versioned module status and respondent evidence; passing module code or synthetic fixtures is insufficient                |
| D-61 | Use hierarchy, multiple parents, within-family comparison, and configuration relations selectively | Adopted conceptual architecture                 | Use `subtype_of` only for genuine inheritance, `hybrid_of` for synthesis, and within-family modules for local morphology; do not force a single tree                                                                                                                                                          | Requires relation-specific validators and non-equivalence notes                                                                    |
| D-62 | Preserve prerequisite construct gates and evidence-based abstention                                | Adopted measurement invariant                   | Missing defining constructs abstain; measured contradictions block gated candidates; no Primary/Modifier/source/criterion substitution                                                                                                                                                                        | Preserves local evidence accounting and the frozen respondent-validation boundary                                                  |
| D-63 | Apply family-specific architecture                                                                 | Adopted conceptual and research design          | Use morphology for anarchist and green families, economic/strategy separation for socialist traditions, variant comparison for conservative families, identity/sovereignty safeguards, religious-authority separation, and technology/authority separation                                                    | Requires module-local constructs, historical scope, fairness, language, and community-informed review where appropriate            |
| D-64 | Propagate Specialist consequences downstream                                                       | Adopted architecture clarification              | Specialist edges reference approved Primary and Modifier registries without replacing their constructs; no Specialist score imputes a Primary or Modifier                                                                                                                                                     | The Primary roster, Modifier domain hierarchy, M0/M1 gates, direct-indicator gates, and frozen role contracts remain authoritative |

### Specialist-specific unresolved questions

U24 whether family anchors require a distinct family-resolution layer; U25
whether module output should be multi-affinity by default; U26 whether
Mutualism, Individualist Anarchism, Market Anarchism, and Anarcho-Capitalism
can be separated without contaminating property and authority constructs; U27
whether a non-Leninist Marxian Specialist should be added or remain a related
tradition; U28 whether green morphology can avoid a generic green-intensity
score; U29 which identity-sovereignty labels require community-informed review
before display; U30 how religious-political modules can compare traditions
across religious contexts; U31 whether the 68-item module surface supports any
validated-specialist decision; U32 how historical influence should be encoded
when contemporary adherents reject a lineage; U33 which institutional projects
should ultimately move to Context; U34 how graph and module changes preserve
historical assignment records.

## D-65 through D-75 — Definitive Context architecture

The definitive Context review is recorded in
[`vnext-context-architecture-review-2026-08.md`](vnext-context-architecture-review-2026-08.md).
These decisions are cumulative vNext ontology, product-resolution, and
measurement-design decisions. They do not change the frozen v13 runtime.

| ID   | Decision                                                                  | Authorization                                      | Current disposition                                                                                                                                                                                                                                                      | Dependencies / consequences                                                                                                                                                                 |
| ---- | ------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-65 | Separate Context product role from conceptual kind and measurement status | Adopted vNext ontology                             | Context is a presentation/catalog role; an entry may be a policy, institution, governance model, tradition, intellectual current, discourse frame, historical reference, or regime project                                                                               | Every vNext record needs independent `conceptualKind`, `contextStatus`, `measurementStatus`, graph relations, source scope, and future route                                                |
| D-66 | Definitive Context roster                                                 | Adopted conceptual disposition; production hold    | Retain all 19 current Context IDs; promote, demote, merge, rename, retire, and add none in this review                                                                                                                                                                   | Frozen v13 role arrays and `context-only` status remain authoritative; no historical records are reinterpreted                                                                              |
| D-67 | Adopt controlled Context conceptual-kind vocabulary                       | Adopted vNext ontology                             | Use compound-tradition, regional-tradition, institutional-model, institutional-mechanism, policy-proposal, governance-model, regime-project, organizational-current, intellectual-current, discourse-frame, speculative-technological-current, and historical-reference  | A record may have one primary kind and secondary graph facets; `unmeasured-tradition-candidate` is a future/status value, not a conceptual kind                                             |
| D-68 | Preserve typed Context graph relations                                    | Adopted with compatibility modification            | Use `context_for`, `subtype_of`, `hybrid_of`, `regional_variant_of`, `institutionalizes`, `policy_expression_of`, `historical_predecessor_of`, `overlaps_with`, `often_combines_with`, `requires`, and `contrasts_with`; preserve v13 parentage and relations as history | Requires a versioned faceted graph and relation validation; an edge is not a respondent score or inheritance claim                                                                          |
| D-69 | Keep policy proposals and institutional models distinct from ideologies   | Adopted conceptual and measurement-design decision | Universal Basic Income, Social Investment State, Liquid Democracy, Panarchism, Constitutional Monarchism, World Federalism, and Corporatism remain Context objects; future measurement should normally use direct policy or governance tasks                             | Prevents one policy or institution from becoming a proxy for a Primary, Modifier, or Specialist; requires mechanism-specific construct definitions                                          |
| D-70 | Preserve Context public-result boundary                                   | Adopted compatibility decision                     | Context entries remain browsable and source-backed but are excluded from ordinary scores, nearest-label rankings, respondent identity prompts, and public confidence claims                                                                                              | Current catalog behavior remains; relations may be displayed only with explicit context/influence/institutional-expression/overlap wording                                                  |
| D-71 | Define documentation and research use                                     | Adopted research-design decision                   | Documentation may explain history, theory, mechanisms, and non-equivalence; research may pre-register treatments, direct policy/institutional batteries, focused modules, or challenger models                                                                           | Research use requires separate versions, consent and provenance, direct construct coverage, and no source/centroid/software substitute for respondent validity                              |
| D-72 | Treat adjacent coverage as non-equivalent to Context-label coverage       | Adopted measurement invariant                      | Primary, Modifier, Specialist, source, and unanswered-question information cannot impute a Context label                                                                                                                                                                 | Missing required constructs produce abstention; no latent-equivalence or host-plus-facet shortcut is permitted                                                                              |
| D-73 | Set priority future routes                                                | Adopted research prioritization                    | Baʿthism, Developmental Authoritarianism, Platformism, and Utopian Socialism are future tradition/module candidates; institutional and policy candidates follow direct choice/battery routes; intellectual/speculative entries remain Context                            | Future route does not authorize current roster addition; each candidate requires conceptual, cognitive, psychometric, criterion, retest, fairness, scope, replication, and display evidence |
| D-74 | Preserve moved, split, aliased, and retired histories                     | Adopted compatibility decision                     | Retired composites and aliases remain retired/compatibility metadata; they are not revived as Context. Labels moved into Specialist remain governed by the Specialist roster; Context is not a catch-all demotion                                                        | Requires legacy mapping and historical-record preservation in any future ontology registry                                                                                                  |
| D-75 | Propagate Context consequences downstream                                 | Adopted architecture clarification                 | Approved Primary and Modifier architectures are unchanged; Specialist roster is unchanged; no Context items enter the ordinary bank under this review; next implementation is a versioned registry and graph migration view                                              | The next stage may proceed to implementation planning without reopening the frozen Measurement Architecture unless a genuine contradiction is documented                                    |

### Context-specific unresolved questions

U35 whether Baʿthism and Developmental Authoritarianism require separate
focused modules or a comparative regional/developmental module; U36 whether
Platformism can be separated from neighboring anarchist traditions without
construct contamination; U37 whether Utopian Socialism has respondent-relevant
recognition outside historical knowledge tasks; U38 which institutional models
are best measured through choice tasks; U39 whether technology and future
currents have stable cross-language respondent boundaries; U40 the safety and
community-informed review required for sensitive religious-authority Context;
U41 which Context-to-construct edges are safe for public display; U42 how to
encode contested historical influence; U43 the public wording distinction
between policy, mechanism, model, and intellectual current; U44 which future
Context route has sufficient incremental value to justify a new bank and role
decision.

## D-76 through D-85 — Definitive construct architecture and measurement blueprint

The authoritative construct and facet architecture is recorded in
[`vnext-construct-architecture-measurement-blueprint-2026-08.md`](vnext-construct-architecture-measurement-blueprint-2026-08.md).
These decisions are cumulative vNext ontology, measurement-design, empirical,
and implementation decisions. They do not change the frozen v13 runtime,
question bank, scoring, or respondent-validation gates.

| ID   | Decision                                                                             | Authorization                                  | Current disposition                                                                                                                                                                                                                                                                                                                                                                                                 | Dependencies / consequences                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| D-76 | Preserve the 26 frozen axis IDs as root construct identifiers                        | Adopted compatibility and ontology decision    | Treat the existing normative, descriptive, and prescriptive axis roots as the stable root layer; add semantic facets and research-only local constructs beneath them without replacing IDs or changing axis polarity                                                                                                                                                                                                | Preserves v13 provenance and historical score interpretation; requires root-to-facet versioning and explicit non-equivalence notes            |
| D-77 | Separate construct level, theory layer, and measurement status                       | Adopted construct ontology                     | Every record distinguishes root, facet, and local Specialist construct level; normative, descriptive, and prescriptive role; and coverage/validation status. A construct's conceptual status is not inferred from present measurement readiness                                                                                                                                                                     | Prevents a sparse or unvalidated measure from demoting a concept; supports Context and Specialist records without score leakage               |
| D-78 | Classify current root coverage from the effective bank                               | Adopted measurement audit; validation pending  | The 26 roots remain represented in the bank. Liberty, anti-domination, centralization, state-action, and regulation are structurally overrepresented; human-nature, democratic confidence, expert confidence, cultural plasticity, electoralism, and compromise are structurally adequate; militarism and state capacity are underrepresented; the remaining roots are contaminated and require discriminant repair | Item counts are content inventory only, not psychometric evidence; respondent validation remains mandatory                                    |
| D-79 | Model named labels as construct configurations rather than source constructs         | Adopted taxonomy-measurement bridge            | Primaries are affinity configurations over measured constructs; Specialists are conditional, module-scoped analyses; Modifiers are cross-host construct views; Context entries remain outside ordinary scoring. No named label receives a construct solely from adjacency or history                                                                                                                                | Requires explicit configuration manifests and abstention when defining evidence is missing                                                    |
| D-80 | Preserve item-level provenance in the construct map                                  | Adopted implementation and audit decision      | Map active items through existing `axisWeights`, statement options, layer, domain, tier, item metadata, direct Modifier indicator IDs, and Specialist-local `constructWeightsByQuestionId`; retain the W1 domain-derived family map as an audit inventory, not as semantic construct equivalence                                                                                                                    | Enables reproducible migration and coverage audits; no source/runtime changes in this stage                                                   |
| D-81 | Treat direct Modifier and Specialist-local counts as structural coverage only        | Adopted measurement-design decision            | The seven direct Modifier constructs retain their current indicator contracts provisionally; 54 Specialist-local constructs are classified by item occurrence for planning only. Neither direct coverage nor module tests establishes reliability, validity, or respondent assignment accuracy                                                                                                                      | Requires construct-specific batteries, module prerequisites, cognitive review, and respondent validation before scored/displayed use          |
| D-82 | Make scoring compensation visible and non-imputational                               | Adopted measurement invariant                  | Existing Primary scopes sometimes use broad roots as proxies for missing facets, including community/moral/cultural composition, institutional and participatory distinctions, ecological morphology, and economic/strategy distinctions. Document these limitations; do not impute missing constructs or silently broaden claims                                                                                   | Missing required evidence must abstain; future M0/M1 and Specialist gates must use direct construct coverage                                  |
| D-83 | Prioritize discriminant item development before label expansion                      | Adopted research prioritization                | P0 repairs overloaded roots and missing facets; P1 fills national, populist, fiscal, class, popular-sovereignty, institutional, ecological, and strategy gaps; P2 strengthens conditional Specialist modules. New labels require demonstrated incremental measurement value                                                                                                                                         | Requires diverse indicators, balanced directional wording, contamination review, cognitive testing, and pre-registered validation             |
| D-84 | Preserve respondent-data gates and leave latent structure unresolved                 | Adopted empirical and methodological invariant | EFA/CFA, IRT or ordinal models, invariance, reliability, retest, criterion, predictive or consequential validity, fairness, and replication remain future respondent-data questions. Synthetic recovery, centroid recovery, software tests, and theoretical coherence cannot validate constructs                                                                                                                    | Challenger profile/latent-class models remain exploratory until respondent evidence supports them                                             |
| D-85 | Use a versioned research-only construct registry as the next implementation boundary | Adopted implementation decision                | The next implementation may add typed construct/facet metadata, relations, coverage, provenance, and validation status without creating a new score path. It must preserve the frozen production contract and require explicit versioning for any migration                                                                                                                                                         | Enables Modifier-architecture follow-on and later item development; genuine contradictions with the frozen baseline must be logged explicitly |

### Construct-architecture unresolved questions

U45 whether authority, liberty, and anti-domination are separable latent
constructs after domain and wording controls; U46 which equality facets
(formal status, distributive equality, relational equality, class analysis,
and recognition) require separate indicators; U47 how market-process,
state-capacity, public-choice, expert-confidence, and coordination beliefs
interrelate without collapsing descriptive and normative content; U48 whether
democratic confidence is legitimacy, procedural efficacy, or institutional
trust; U49 whether cultural plasticity and moral traditionalism are separable
across domains and languages; U50 how centralization, state action, exit,
decentralism, and institutional scale should be modeled; U51 whether strategy
roots are stable dispositions or context-sensitive prescriptions; U52 which
national-community facets are invariant enough for ordinary measurement;
U53 whether secularism/religious authority is one dimension or multiple
institutional and epistemic dimensions; U54 how green morphology separates
ecological standing, growth orientation, technology, and ownership; U55 which
direct Modifier indicators are invariant across ideological hosts; U56 whether
Specialist-local constructs need module-specific latent models or a shared
cross-module measurement model; U57 how much label recognition can be
separated from ideological affinity; U58 how cumulative quiz depth should
handle missing high-value facets without creating depth-specific construct
meaning.

## D-86 through D-90 — Full effective item audit

The complete item-level audit is recorded in
[`full-effective-item-audit-2026-08.md`](full-effective-item-audit-2026-08.md).
It audits every effective scored item against the approved construct blueprint
without changing the frozen bank or production contract.

| ID   | Decision                                                                        | Authorization                                 | Current disposition                                                                                                                                                                                                                                                                | Dependencies / consequences                                                                                                          |
| ---- | ------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| D-86 | Treat the full effective item audit as the item-level construct coverage record | Adopted measurement-design and audit decision | Audit all 338 active core and 68 active conditional Specialist items; preserve stable IDs, effective wording, layer, domain, axis mapping, facet/local construct, direction, risks, depth, source/provenance, disposition, and coverage consequence                                | The audit is the authoritative bridge from the construct blueprint to item development; it does not establish psychometric validity  |
| D-87 | Adopt the six content dispositions as non-production statuses                   | Adopted measurement-design decision           | Current counts: 49 `retain`, 3 `retain with minor edit`, 16 `rewrite`, 10 `replace`, and 328 `empirical review required`                                                                                                                                                           | `retain` is not validated; `rewrite`/`replace` items remain in the frozen bank until a separately authorized implementation wave     |
| D-88 | Make replacement coverage explicit                                              | Adopted construct and measurement invariant   | No current item may be removed before a versioned replacement preserves its root/facet and layer coverage or documents an approved gap; neighboring roots, labels, sources, centroids, and software tests cannot impute a removed construct                                        | Prevents the P0/P1 queue from deepening existing national, ecological, technology, class, institutional, and strategy gaps           |
| D-89 | Require respondent evidence for escalated item dispositions                     | Adopted empirical-methodological invariant    | Dimensionality, item functioning, local dependence, response styles, retest, criterion, DIF/invariance, fairness, and module-selection evidence are required for escalated items, especially descriptive, multi-root, statement-choice, sensitive, redundant, and Specialist items | Preserves the frozen respondent-validation gates and keeps empirical uncertainty explicit                                            |
| D-90 | Preserve source/provenance and implementation boundaries                        | Adopted implementation decision               | Every audited item remains source/context-backed in the effective bank; the audit changes documentation only. A future research-only registry may store audit metadata but may not create a new score path or reinterpret v13 records                                              | Requires versioned migration and explicit new decision before any prompt, weight, tier, role, assignment, scoring, or display change |

### Full-audit unresolved questions

U59 whether the high-loading Authority, Liberty, Anti-Domination, Regulation,
State Action, and Centralization items separate into the blueprint facets or a
smaller respondent-level structure; U60 whether the agree-format creates
systematic acquiescence or valence effects after layer and ideology controls;
U61 which redundancy and parallel-form clusters should be shortened or retained
after local-dependence, retest, and criterion evidence; U62 whether
statement-choice options form interpretable ipsative profiles across languages
and subgroups; U63 whether current `PROXY` items add incremental information
once direct National Orientation, ecological morphology, technology, class, and
institutional items are fielded; U64 which sensitive items require subgroup
invariance, DIF, community-informed review, or non-display even if their
content and response-process evidence are acceptable.

## D-91 through D-102 — Authoritative scoring architecture

The definitive scoring review is recorded in
[`scoring-architecture-specification-2026-08.md`](scoring-architecture-specification-2026-08.md).
These decisions are cumulative and preserve the frozen v13 implementation
contract. They separate conceptual/political-theory decisions,
measurement-design decisions, empirical questions, and implementation
decisions. They do not authorize a new participant-facing scorer without a
later versioned implementation decision.

| ID    | Category                                  | Decision                                                                                                                                      | Authorization                                   | Current disposition                                                                                                                                                                                                                | Dependencies / consequences                                                                                                                            |
| ----- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D-91  | Conceptual / measurement                  | Keep the theory-led construct model, production prototype/configuration model, and empirical challenger models as separate analytical objects | Adopted architecture invariant                  | Named traditions remain configurations over constructs; LCA/LPA, IRT, covariance, unfolding, and learned classifiers remain research-only challengers                                                                              | Prevents theoretical coherence, prototype recovery, or latent classes from being treated as respondent validity                                        |
| D-92  | Measurement design                        | Preserve explicit response states and layer separation                                                                                        | Adopted measurement invariant                   | Valid numeric/option responses contribute; `dont_know`, refusal, omission, not-presented, invalid, and skipped salience remain distinct non-substantive states; normative, descriptive, and prescriptive estimates remain separate | Requires raw response-state provenance and prevents missingness from becoming neutral evidence                                                         |
| D-93  | Measurement design / empirical            | Preserve current v13 salience semantics as compatibility behavior while keeping salience meaning unresolved                                   | Adopted with research hold                      | Root scoring retains current numerator/denominator behavior; direct Modifier scoring retains its current effective-weight behavior; no new salience model is promoted                                                              | Requires a preregistered comparison of point-weight, evidence-only, and response-process models before vNext changes                                   |
| D-94  | Measurement design                        | Define root, facet, profile, and coverage estimation without imputation                                                                       | Adopted architecture                            | Preserve the 26 root IDs and current normalized weighted means; add direct facet estimates only through versioned indicator sets; report measured masks and coverage separately from validity                                      | Facet-parent aggregation, empirical weights, and dimensionality require respondent evidence; v13 zero placeholders cannot be displayed as neutral      |
| D-95  | Measurement design / implementation       | Retain scoped Primary RMS similarity, constitutive gates, and evidence abstention                                                             | Adopted compatibility and measurement invariant | Use current `scoringScope`, `compoundGates`, `min(n/3)` evidence heuristic, fit transform, and gate states; no centroid or neighboring-axis imputation                                                                             | Primary fit remains similarity, not probability; calibrated display cutoffs and covariance remain open                                                 |
| D-96  | Conceptual / measurement                  | Apply the M0/M1 compositional-residual test inside scoring architecture                                                                       | Adopted research gate                           | National Conservatism and Liberal Conservatism remain priority M1 candidates; every other applicable compound receives the same residual test; no independent M1 promotion occurs here                                             | Requires direct residual facets, held-out incremental discrimination, retest, criterion, fairness, and display-value evidence                          |
| D-97  | Measurement design                        | Keep ordinary Modifier output direct-indicator-only                                                                                           | Adopted compatibility decision                  | Preserve the seven current direct constructs, minimum-two-indicator rule, current fit/evidence gates, and five-result cap; catalog-only/focused-follow-up/configuration nodes abstain                                              | No Primary, host, source, centroid, or theoretical relation can substitute for direct Modifier evidence                                                |
| D-98  | Conceptual / measurement / implementation | Keep Specialist eligibility, local scoring, assignment, and evidence abstention distinct                                                      | Adopted architecture invariant                  | `balanced-hash-v2` is routing, not ideology eligibility; local module constructs and candidate gates produce experimental, blocked, insufficient, or not-administered states; criterion self-description remains separate          | Requires module-local validation, prerequisites, module versioning, and no forced subtype under close fits                                             |
| D-99  | Measurement design / implementation       | Make uncertainty, margins, depth, and final display explicit                                                                                  | Adopted display invariant; calibration hold     | Preserve current qualitative evidence/margin bands; add conceptual-neighbor margins, explicit form masks, and display statuses; high/insufficient evidence cannot support an exclusive named claim in vNext                        | Requires respondent-calibrated cutoffs, depth linking, and public-language review before new display rules                                             |
| D-100 | Implementation                            | Require a complete version tuple and migration boundary                                                                                       | Adopted implementation decision                 | Store bank, form, taxonomy, construct, scope/prototype, Modifier, Specialist, scoring, calibration, presentation, and response-coding versions; historical results remain under original versions                                  | Any coding, weight, denominator, scope, gate, threshold, covariance, depth, assignment, or language change requires a new scoring/presentation version |
| D-101 | Empirical / measurement                   | Preserve respondent-validation gates for every parameter and promotion decision                                                               | Adopted empirical invariant                     | Require cognitive, dimensionality, item-functioning, retest, criterion, DIF/invariance, fairness, replication, and display-value evidence; item counts and software tests are structural evidence only                             | The full item-audit queues and all prior gates remain binding; synthetic and theoretical tests cannot promote a construct or label                     |
| D-102 | Implementation / research                 | Define Codex-ready acceptance criteria as the implementation handoff                                                                          | Adopted implementation boundary                 | Implementations must prove response, aggregation, gates, abstention, Specialist, depth, uncertainty, versioning, and challenger isolation invariants before public migration                                                       | Allows metadata/evidence-mask scaffolding first; no new score path is implied by the documentation update                                              |

### Scoring compatibility tensions and contradiction record

No genuine contradiction requiring reopening the frozen Measurement Architecture
was discovered. The following are additive compatibility tensions, not silent
baseline changes:

- **T-03:** v13 serializes an unmeasured root as numeric `normalized: 0` while
  separately exposing `itemCount: 0`. The evidence mask, not the numeric
  placeholder, is authoritative; a vNext result must make that distinction
  explicit.
- **T-04:** v13 applies confidence/priority differently in root and direct
  Modifier aggregation. This is preserved for historical reproducibility while
  salience semantics remain an empirical decision.
- **T-05:** v13 similarity uses independent-axis RMS distance and heuristic
  evidence bands. No covariance correction, calibrated probability, or
  respondent-estimated threshold is implied; any addition requires a new
  scoring version.

These tensions authorize documentation and research scaffolding only. They do
not authorize a production scorer, question-bank, taxonomy, assignment, or
public-language change.

### Scoring-specific unresolved questions

U65 salience semantics; U66 facet dimensionality; U67 empirical item and
construct weights; U68 covariance-adjusted similarity; U69 respondent-
calibrated thresholds and margins; U70 missingness and `dont_know` mechanisms;
U71 M0/M1 incremental residual value; U72 depth linking; U73 Specialist-local
structure; U74 cross-language and subgroup invariance; U75 whether
respondent-derived latent profiles add value without replacing the theory-led
taxonomy.

## D-103 through D-112 — Authoritative result interpretation and public claims

The definitive result-interpretation review is recorded in
[result-interpretation-public-claims-specification-2026-08.md](result-interpretation-public-claims-specification-2026-08.md).
These decisions define the outward interpretation layer over the approved
scoring architecture. They do not silently change the frozen scorer, question
bank, taxonomy, Specialist assignment, research records, or current UI.

| ID    | Category                                  | Decision                                                                                                                               | Authorization                               | Current disposition                                                                                                                                                                     | Dependencies / consequences                                                                                                                           |
| ----- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-103 | Conceptual / implementation               | Treat public interpretation as a distinct versioned layer over scoring                                                                 | Adopted architecture invariant              | The profile, Primary neighborhood, Modifiers, Specialists, Context, evidence, uncertainty, and public claims have separate meanings and statuses                                        | A wording or status change requires an interpretation/presentation version; scoring semantics remain governed by D-91 through D-102                   |
| D-104 | Conceptual / measurement                  | Define a Primary neighborhood as graded family resemblance among scoped reference profiles plus separately marked conceptual neighbors | Adopted interpretation rule                 | Affinity and similarity describe closeness in measured construct space; they do not assign identity, membership, probability, or latent-class status                                    | Requires visible scope, measured mask, prototype version, graph-relation source, and neighbor margin                                                  |
| D-105 | Measurement design / empirical            | Preserve multiple affinities, close-result states, and layer divergence rather than forcing an exclusive winner                        | Adopted display invariant; calibration hold | The frozen scorer may rank nearest profiles; exclusive or best-supported display waits for respondent-calibrated margins and validation                                                 | Requires separation evidence, tie policy, depth linking, and display-value testing                                                                    |
| D-106 | Measurement design                        | Interpret Modifiers only through their own direct construct and indicator evidence                                                     | Adopted compatibility and abstention rule   | Primary proximity, sources, self-labels, and Specialist results cannot substitute for direct Modifier measurement; Modifier conjunctions need a residual gate                           | Preserves the seven direct Modifier contracts and prevents host-plus-Modifier identity claims without respondent evidence                             |
| D-107 | Conceptual / measurement / implementation | Keep Specialist product role separate from underlying specialistKind and make eligibility/status explicit                              | Adopted architecture invariant              | Assignment is routing; not-administered, insufficient, blocked, experimental, provisional, and validated states are distinct; current experimental modules do not alter the main result | Requires module-local prerequisites, evidence coverage, status badges, and promotion evidence                                                         |
| D-108 | Measurement design / implementation       | Separate evidence coverage, uncertainty sources, missingness, and abstention from psychometric confidence                              | Adopted public-language invariant           | Use answer/evidence coverage and named uncertainty sources; current “Result confidence” wording is compatibility debt, not a validity claim                                             | Requires visible measured masks, refusal/dont_know/not-presented/salience states, and future wording migration                                        |
| D-109 | Empirical / measurement                   | Keep self-identification outside scoring and treat it as an exposure-aware criterion                                                   | Adopted empirical invariant                 | Self-description may be compared with a result but cannot certify or disprove identity; criterion claims require preregistered, held-out calibration                                    | Preserves post-questionnaire timing, label-exposure records, and the separation of identity acceptance from label recognition                         |
| D-110 | Measurement design / implementation       | Make depth, shared-link recomputation, and result versioning part of interpretation                                                    | Adopted implementation boundary             | Short forms report their own evidence scope; cross-depth comparison requires linking; shared results declare recomputation versus snapshot semantics                                    | Requires form/depth, presented-item, bank/scoring, interpretation, presentation, and research-exposure versions                                       |
| D-111 | Empirical / implementation                | Establish PC0–PC7 evidence-dependent claim tiers                                                                                       | Adopted release gate                        | Current public ceiling is PC0 plus qualified PC1 content/profile-similarity language; reliability, validity, criterion, retest, invariance, and transport claims remain held            | Each outward claim needs a scoped evidence tier; source coverage and software tests cannot promote respondent claims                                  |
| D-112 | Implementation / research                 | Standardize reusable language, machine-readable statuses, and Codex-ready acceptance criteria                                          | Adopted handoff boundary                    | Results, methodology, documentation, shared links, research materials, exports, and APIs must carry role/status/evidence/version language                                               | Legacy fields remain interpretable; migration requires semantic notes and version bumps; no runtime change is authorized by this documentation update |

### Public-claims compatibility tensions and contradiction record

No genuine contradiction requiring reopening the frozen Measurement Architecture
was discovered. The following are additive presentation and serialization
tensions:

- **T-06:** the current AxisBar says “Result confidence” for answer-coverage
  bands. Preserve the frozen behavior for historical compatibility, but treat
  the phrase as non-authoritative and migrate to answer/evidence coverage in a
  future presentation version.
- **T-07:** current share links encode answers and compatible bank/scoring
  metadata and recompute results rather than carrying immutable result
  snapshots. Preserve that behavior, state it explicitly, and do not present a
  recomputed result as a permanent historical claim.
- **T-08:** historical research payloads use fields such as predictedLabelIds.
  Preserve the field for compatibility while documenting its meaning as ranked
  affinity/reference-profile IDs; a semantic rename requires a versioned API
  migration.

These tensions authorize documentation, metadata, and research scaffolding only.
They do not authorize a scorer, bank, taxonomy, assignment, or participant
language change in the frozen runtime.

### Result-interpretation unresolved questions

U76 coverage vocabulary migration; U77 respondent-calibrated neighborhood,
margin, tie, and exclusive-display policy; U78 Primary claim tier; U79
respondent interpretation of direct Modifiers; U80 Specialist promotion;
U81 M0/M1 public language; U82 self-identification recognition versus identity
acceptance; U83 depth linking and form-specific neighborhoods; U84 cross-scope
transport; U85 semantic migration of legacy affinity, confidence, and stability
fields.

## D-113 through D-124 — Authoritative empirical validation architecture

The definitive respondent-validation review is recorded in
[empirical-validation-architecture-2026-08.md](empirical-validation-architecture-2026-08.md).
These decisions translate the approved theoretical, taxonomy, construct, item,
scoring, and interpretation architecture into staged respondent-grounded
validation. They do not change the frozen runtime or retroactively promote any
current label.

| ID    | Category                             | Decision                                                                                                                                            | Authorization                     | Current disposition                                                                                                                                                                                                      | Dependencies / consequences                                                                                                          |
| ----- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| D-113 | Measurement design / empirical       | Use a staged V0–V13 respondent-validation program from preregistration through replication and promotion                                            | Adopted validation architecture   | Expert/content review, cognitive interviews, pilot, item/structure, confirmation, reliability, retest, criterion, neighbor, fairness, form, robustness, and promotion stages are distinct                                | A later-stage result cannot silently backfill a failed earlier gate; every stage is versioned and scope-specific                     |
| D-114 | Empirical / implementation           | Freeze respondent records, sample splits, quality rules, and estimands before confirmatory analysis                                                 | Adopted preregistration invariant | Preserve raw response states, exact forms/items, exposure, criteria, consent, inclusion manifests, code revisions, and split membership; prevent respondent/retest leakage                                               | Existing research version bundles remain historical compatibility records; new validation waves require explicit manifests           |
| D-115 | Conceptual / measurement             | Require independent expert/content review and cognitive response-process evidence before item or label promotion                                    | Adopted release gate              | Content review establishes meaning and boundaries; cognitive interviews establish interpretive readiness; neither establishes psychometric validity                                                                      | Rewrites, sensitive constructs, M0/M1 residuals, and public label wording require fresh review                                       |
| D-116 | Measurement design / empirical       | Validate constructs through item functioning, dimensionality, cross-loading, missingness, and response-process analysis                             | Adopted construct gate            | Root IDs and facets remain theoretical until respondent structure and item behavior support the declared scope                                                                                                           | Alpha/item counts are diagnostics only; contaminated or unidirectional constructs remain held                                        |
| D-117 | Measurement design / empirical       | Treat reliability, information, test-retest, and criterion evidence as separate properties                                                          | Adopted evidence separation       | Report precision, information, temporal stability, and criterion relationships with their own estimands and uncertainty                                                                                                  | No reliability statistic substitutes for dimensionality, validity, fairness, or criterion calibration                                |
| D-118 | Measurement design / empirical       | Require one label-specific evidence card for every current Primary and Specialist                                                                   | Adopted promotion architecture    | Instantiate cards for all 16 Primaries and all 78 Specialists; card components cover content, response process, internal structure, separability, incremental validity, calibration, stability, fairness, and robustness | Compatibility-scored labels remain respondent-validation holds until their own cards support promotion                               |
| D-119 | Conceptual / measurement / empirical | Apply nearest-neighbor, M0/M1 compositional-residual, and incremental-validity tests to named configurations                                        | Adopted named-label gate          | National Conservatism and Liberal Conservatism remain priority M1 cases; every applicable compound receives the same held-out residual test                                                                              | A label requires respondent-measured residual value beyond host-plus-facets, not a theoretical or synthetic residual alone           |
| D-120 | Measurement design / empirical       | Keep theory-led multidimensional models, production prototype scoring, and LCA/LPA/person-centered models as separate challengers                   | Adopted challenger boundary       | Model disagreement triggers structured construct/taxonomy review; person-centered profiles cannot automatically become ideological names                                                                                 | Requires preregistered comparisons, holdout/replication, criterion, fairness, and historical/morphological review                    |
| D-121 | Empirical / implementation           | Make calibration, uncertainty, DIF/invariance, form equivalence, and robustness promotion gates                                                     | Adopted scoped-release gate       | Thresholds, margins, qualitative uncertainty, form claims, and subgroup/language claims require respondent evidence for the exact scope                                                                                  | Current heuristic fit/coverage bands and form contracts are not calibrated public validity claims                                    |
| D-122 | Empirical / measurement              | Treat self-identification as one exposure-aware criterion source among several                                                                      | Adopted criterion invariant       | Self-label concordance may inform calibration, but cannot be a scoring input, ground truth, or sole promotion criterion                                                                                                  | Requires timing, exposure arm, independent/held-out evaluation, and distinction between recognition and identity acceptance          |
| D-123 | Measurement design / implementation  | Define promotion states and object-specific gates from catalog/research through experimental, respondent-supported, and validated-scoped public use | Adopted release architecture      | No automatic family/module promotion; critical holds require restriction, abstention, demotion, or revision                                                                                                              | Public claim ceiling is the minimum supported evidence tier and must be attached to the decision record                              |
| D-124 | Implementation / research            | Require versioned evidence cards, analysis manifests, promotion records, null-result reporting, and reassessment dates                              | Adopted implementation boundary   | Existing research validators remain scaffolding; a release requires reproducible card artifacts, reviewers, scope, migration, wording, and reassessment metadata                                                         | No documentation, code test, synthetic prototype, expert agreement, or schema-valid artifact alone establishes respondent validation |

### Empirical-validation compatibility tensions and contradiction record

No genuine contradiction requiring reopening the frozen Measurement Architecture
was discovered. The following additive boundaries are recorded:

- **T-09:** current psychometric estimator floors make analyses
  estimable/diagnostic at small sample sizes, while the validation architecture
  requires power, precision, confirmation, replication, and scope evidence.
  Preserve the floors as tooling checks; never treat them as promotion
  thresholds.
- **T-10:** the cumulative planning log has advanced beyond the runtime
  research version bundle. Preserve historical version declarations and require
  a new research release before attaching new validation claims to production
  records.
- **T-11:** existing analysis contracts cover model comparison, DIF, form
  equivalence, prototype distributions, and psychometric summaries, but do not
  constitute a complete label evidence card or promotion decision. Add the
  card/decision layer without reinterpreting existing analysis artifacts.

These tensions authorize research metadata, evidence-card schemas, and
analysis scaffolding only. They do not authorize a scorer, taxonomy, question
bank, assignment, or participant-language change in the frozen runtime.

### Empirical-validation unresolved questions

U86 validation sample design; U87 construct dimensionality; U88
response-process thresholds; U89 item and construct weights; U90 covariance and
cross-loading; U91 neighbor separation; U92 M0/M1 residual value; U93
Specialist local structure; U94 criterion interpretation; U95 retest design;
U96 DIF/invariance; U97 form equivalence; U98 uncertainty calibration; U99
person-centered challenge; U100 label exposure; U101 promotion thresholds.

## D-125 through D-131 — Final vNext integration

The authoritative integrated system is recorded in
[vnext-integrated-system-specification-2026-08.md](vnext-integrated-system-specification-2026-08.md).
The dependency-ordered Codex execution contract is recorded in
[vnext-codex-implementation-specification-2026-08.md](vnext-codex-implementation-specification-2026-08.md).
These decisions integrate stages 1–9 without activating a new scorer, bank,
role, label, claim, or respondent-validation result.

| ID    | Category                                  | Decision                                                                                                  | Authorization                 | Current disposition                                                                                                                                                                                                                   | Dependencies / consequences                                                                           |
| ----- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| D-125 | Conceptual / measurement / implementation | Establish one authoritative integrated vNext system over the frozen architecture and nine approved stages | Adopted integration authority | The integrated specification is the entry point; component documents remain scoped authorities for their respective details                                                                                                           | All future work must resolve through the integrated precedence table and preserve the frozen baseline |
| D-126 | Implementation / measurement              | Resolve mechanical repository/document inconsistencies found by the final audit                           | Adopted consistency decision  | Correct the stale label-exposure reference to current `2026-08-label-exposure-v2`; distinguish 338 active core + 68 Specialist items from 496 retained core records; distinguish local Specialist sufficiency from display thresholds | No political-theory, scorer, item, roster, or public-claim change is authorized                       |
| D-127 | Conceptual / implementation               | Implement vNext graph, conceptual-kind, measurement-status, and derived-role registries as overlays       | Adopted architecture boundary | Preserve v13 `parentId`, role arrays, and status fields; add versioned multi-edge and independent readiness views                                                                                                                     | Requires ontology/graph validators and no production import until a future role/version decision      |
| D-128 | Measurement design / implementation       | Make roster, construct, facet, item, and evidence-card integrity explicit                                 | Adopted integration invariant | All 16 Primaries, 78 Specialists, 24 Modifiers, 19 Context entries, 8 retired IDs, 26 roots, and 406 effective items require resolvable manifests; facet annotations remain research-only until implemented                           | Prevents orphan labels, undefined constructs, unsupported items, and silent coverage loss             |
| D-129 | Measurement / empirical                   | Separate immediate compatibility-preserving scaffolding from respondent-evidence-gated activation         | Adopted release boundary      | Documentation, registries, validators, manifests, and shadow/challenger artifacts may proceed; facet scores, label promotion, calibrated thresholds, new Modifiers, Specialist promotion, and public claims remain gated              | Codex must not infer unresolved political or psychometric decisions                                   |
| D-130 | Implementation                            | Adopt implementation units I-001 through I-018 as the dependency-ordered Codex roadmap                    | Adopted handoff boundary      | Each unit names decision IDs, files, behavior, versions, migration, tests, documentation, and acceptance criteria                                                                                                                     | A blocked prerequisite stops dependents; no independent taxonomy or measurement design by Codex       |
| D-131 | Implementation / migration                | Preserve versioned v13 compatibility and require an explicit vNext tuple for any production cutover       | Adopted migration invariant   | Proposed vNext versions remain inactive until evidence and release records pass; old links, records, aliases, and result decoders remain supported                                                                                    | No mixed-version analyses or silent semantic renames; rollback to v13 remains required                |

### Final-integration compatibility tensions and contradiction record

No genuine contradiction requiring reopening the frozen Measurement Architecture
was found. The following additive tensions are explicit:

- **T-12:** the current `Question` and construct-family runtime metadata carry
  roots/axes and domain families, while the approved item audit carries planned
  facet/local-construct intentions. Add a research-only annotation manifest;
  do not treat the documentation mapping as an implemented facet score.
- **T-13:** compatibility API fields named `reliability`, `consistency`, or
  `confidence` currently contain item-count/evidence coverage heuristics in
  some paths. Preserve them for old records, document their limits, and require
  a presentation/API migration before semantic renaming.
- **T-14:** the cumulative planning log is now v4 while the runtime research
  bundle remains `2026-08-methodological-decisions-v1`. Preserve both scopes;
  a runtime bundle bump requires an implementation and release decision.
- **T-15:** v13 role arrays are operational registries, while vNext roles are
  derived views. Keep both during migration and never compare their values as
  if they were the same ontology layer.

### Final-integration unresolved questions

U102 facet annotation adjudication; U103 exact vNext role-policy resolver
behavior; U104 production activation tuple; U105 API migration for legacy
confidence/reliability/affinity fields; U106 shadow/prod equivalence standard;
U107 release rollback and reassessment cadence. These are implementation,
measurement, or empirical questions, not permissions to change the frozen
baseline.

## D-132 — Candidate e298 vNext conformance remediation

On 2026-08-15, candidate `e298ccd5588708528db4b63e3e33ce6f19230d69` was
remediated against the approved integrated specification, Codex
Implementation Specification, empirical validation architecture, release
checklist, and latest release-readiness audit. The frozen production baseline
is `f0324dbf27dfc6e35ff557992e4643e3df15ee0e`.

| Decision                               | Adopted implementation boundary                                                                                                                                                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Authoritative vNext ontology and graph | Add independent node metadata, canonical facets, polyhierarchical typed edges, provenance, semantic constraints, scope, directionality, and validation. Preserve v13 taxonomy and parent/relation fields as compatibility metadata only.                           |
| Independent role policy                | Derive public/product role from conceptual kind, secondary kinds, graph relations, measurement state, explicit high-risk policy, evidence requirements/coverage, module prerequisites, and promotion input. Legacy `currentRole` cannot redefine the derived role. |
| Construct and item contracts           | Replace placeholder construct metadata and permissive item parsing with canonical root/facet/local-construct registries, strict option-level reference checks, Unicode direction handling, and byte-reproducible generation.                                       |
| Analysis surfaces                      | Separate core, Specialist, research-task, expert-review, and bridge manifests. Challenger specifications must name their surface and may not inherit the combined 406-item set.                                                                                    |
| Evidence and shadow boundaries         | Add compositional-residual M0/M1 metadata for compound candidates and preserve respondent-dependent states. Shadow facet estimates fail closed rather than reusing root weights and never enter production.                                                        |
| Release provenance and CI              | Record candidate and frozen baseline independently, bind all version/fingerprint tuples to the candidate, validate generated artifacts and surface partitioning, and retain the frozen baseline as rollback reference.                                             |

This decision closes the six P1 implementation findings. It does not promote a
label, facet, Modifier, Specialist, interpretation, scorer, public claim, or
deployment. Those states remain subject to the evidence and governance gates
listed in the release manifest.
