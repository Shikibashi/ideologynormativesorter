# Ideology breadth and validation audit v4

This is the pre-migration breadth and measurement record for the sorter. The role and module decisions it records are retained as provenance, while the current taxonomy is defined by [taxonomy-redesign-v1-2026-08.md](./taxonomy-redesign-v1-2026-08.md). The central question is no longer “which names are missing?” It is whether the current constructs are interpretable, sufficiently answered, reliable, fair, and useful before any specialist label is promoted.

## Current decision rule

Academic literature supports a definition or a candidate construct; it does not, by itself, justify a scored respondent result. The production taxonomy therefore separates:

- primary labels, which participate in the ordinary score;
- modifiers and related traditions, which may add context without pretending to be independent measured ideologies;
- specialist labels, which are browsable or available in a focused follow-up but remain provisional until a construct-matched module clears respondent validation;
- candidate role experiments, which are explicitly not public scored endpoints.

Specialist scoring now records answered-item count, ordinary and weighted coverage, effective answered item count, construct-level coverage, and an `insufficient-evidence` state. Unanswered values remain visible as missing evidence rather than becoming substantive zeroes. Candidate-match concordance excludes that state.

## Current family and role review

| Area                                                                                    | Current state                                                                                                                  | Decision                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Liberal, conservative, socialist, anarchist, ecological, and broad religious traditions | Primary and specialist catalog coverage exists                                                                                 | Improve within-family discrimination only when measurement or provenance review identifies a concrete gap                                                                                                                  |
| Feminist traditions                                                                     | Eight-item focused module with legal-equality, structural-patriarchy, class/social-reproduction, and anti-hierarchy constructs | Keep Liberal Feminism, Radical Feminism, Socialist / Marxist Feminism, and Anarcha-Feminism in specialist validation; do not infer a settled subtype taxonomy                                                              |
| Identity, nationalism, and sovereignty                                                  | Twenty-two-item focused module with nine local constructs                                                                      | Validate non-exclusive affinities and role boundaries before promotion                                                                                                                                                     |
| Black political autonomy                                                                | Two candidate profiles                                                                                                         | Display only community-autonomy and separatist self-determination orientations; do not display “Black Nationalism” as a validated identity result                                                                          |
| Pan-African politics                                                                    | Two-item solidarity/unity signal                                                                                               | Display only “Pan-African solidarity and unity”; this does not measure every Pan-African, sovereigntist, or nativist morphology                                                                                            |
| Indigenous sovereignty and decolonization                                               | Institutional recognition and autonomous resurgence are separate constructs, with two profile variants                         | Keep the catalog label `Indigenism` specialist-only while the module uses the narrower descriptive heading “Indigenous sovereignty and resurgence”; conduct a naming review after respondent and community-informed review |
| Multiculturalism                                                                        | Modifier role with separate language/cultural accommodation, conscience-exemption, and representation items                    | Run a role experiment against liberal, communitarian, civic-national, and radical-democratic neighbors; do not treat all accommodation policies as one latent preference                                                   |
| Islamic Democracy, Hindutva, Zionism                                                    | Religious-national politics module is available, but all outputs remain experimental                                           | Validate separate internal variants before promotion                                                                                                                                                                       |
| Accelerationism, Cyberocracy, Techno-Anarchism                                          | Technology-governance module is available, but all outputs remain experimental                                                 | Validate technology intensification, cybernetic authority, privacy/decentralized infrastructure, and market/state/commons coordination                                                                                     |

The authoritative implementation registry is `src/data/specialistMeasurementReview.ts`. `src/data/labelTaxonomy.ts` remains the authority for public scoring roles, aliases, parent relationships, and the current provisional specialist set. The seven experimental waves are described in the taxonomy v1 record.

## Construct revisions implemented in v4

### Feminist measurement

The earlier prototype implicitly made legal reform and structural patriarchy opposites through negative cross-loadings. That is not a defensible general theory: a respondent can support legal equality, diagnose structural patriarchy, and disagree about strategy. The item bank now treats these as separable dimensions. Diagnostic claims, normative objectives, and institutional or anti-hierarchical strategies remain distinct item roles.

Liberal Feminism remains a single provisional specialist profile, but its internal variants are an explicit next item-development question rather than an untested split. Socialist / Marxist Feminism remains combined at the current resolution. Radical Feminism remains a candidate specialist and Anarcha-Feminism remains specialist-only.

### Identity, sovereignty, and recognition

The previous `recognition-vs-refusal` bipolar construct forced institutional recognition and autonomous resurgence into one axis. These are now independent constructs. The module also splits the prior multiculturalism compound prompt into:

- language and cultural accommodation;
- conscience or religious exemptions;
- guaranteed or reserved political representation.

This permits a respondent to support one policy without being assigned the entire multiculturalism bundle. The module continues to include ascriptive membership, dominant-nation congruence, pluralist accommodation, minority self-government, community autonomy, territorial separatism, decolonial land sovereignty, the two Indigenous constructs, and Pan-African solidarity.

## Validation that is still required

The repository currently has construct coverage and hand-authored archetype tests, not human validation findings. The next analysis release should add:

1. label-specific precision, recall, PR curves, Brier scores, calibration, multilabel F-scores, co-identification, and false-positive analysis;
2. incremental validity against the ordinary global axes and nearest-neighbor labels;
3. response-process review: comprehension, interpretation, confidence, perceived relevance, and completion burden;
4. internal-structure review using primary indicators or an explicitly weighted/latent model, rather than treating every nonzero cross-loading as equally diagnostic;
5. test-retest stability for construct scores and evidence coverage, including attrition and module-selection patterns;
6. fairness review across preregistered demographic groups, including item-level DIF and measurement invariance where sample sizes permit;
7. community-informed review for Black, Pan-African, Indigenous, religious, and emerging technology-governance content before any public role change.

Top-1 and top-3 concordance remain descriptive diagnostics only. They are insufficient for multi-affinity political traditions and must not become a promotion rule by themselves.

## Specialist promotion gates

A candidate specialist may be promoted only after a preregistered gate specifies minimum sample size, item-level quality rules, construct reliability or alternative measurement evidence, test-retest behavior, calibration/false-positive tolerances, criterion evidence, and fairness review. The gate must also permit “retain as modifier,” “retain as related tradition,” and “insufficient evidence.” A high fit score with sparse answers is not evidence of a valid label.

## Provenance audit

Scored label cards now expose curated source records through `src/data/labelSources.ts` and `ResultsScreen`. The records support definition, normative, descriptive, prescriptive, or boundary claims; they do not validate the numeric centroid, respondent identity, or promotion decision. The methodology screen discloses that boundary explicitly.

The global provenance audit should be rerun before the next instrument freeze. It must confirm for every active core and specialist item:

- a neutral context note where interpretation could drift;
- a public source record with a stable HTTPS URL;
- a claim scope matching the source, rather than a citation used as decoration;
- explicit review metadata for unchanged items;
- no retired legacy module item entering the effective bank or research schema.

## Recommended sequence

1. Treat the taxonomy v1 registry and source/context register as the current implementation baseline.
2. Validate evidence-aware scoring and specialist output schemas on synthetic missingness cases.
3. Complete feminist, identity, religious-national, technology, and other module response-process review.
4. Collect a larger matrix-sampled specialist dataset with preregistered role decisions and held-out criterion analysis.
5. Run reliability, calibration, multilabel, response-process, DIF/invariance, and attrition analyses.
6. Reassess public names and roles only after those results are available.

## Research anchors

- Stanford Encyclopedia of Philosophy, [Feminist Political Philosophy](https://plato.stanford.edu/entries/feminism-political/)
- Stanford Encyclopedia of Philosophy, [Multiculturalism](https://plato.stanford.edu/entries/multiculturalism/)
- Stanford Encyclopedia of Philosophy, [Nationalism](https://plato.stanford.edu/entries/nationalism/)
- Andrew Valls, “A Liberal Defense of Black Nationalism,” [American Political Science Review](https://doi.org/10.1017/S0003055410000249)
- Dean E. Robinson, [Black Nationalism in American Politics and Thought](https://doi.org/10.1017/CBO9780511606038)
- Valentin Clavé-Mercier, “Indigenous political theory, metaphysical revolt, and the decolonial rearticulation of political ordering,” [International Theory](https://doi.org/10.1017/S1752971924000137)
