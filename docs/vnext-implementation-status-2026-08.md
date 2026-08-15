# Ideology Normative Sorter vNext implementation status

Status: candidate-specific additive remediation for the dependency-ordered
Codex Implementation Specification, I-001 through I-018, at candidate
`e298ccd5588708528db4b63e3e33ce6f19230d69`. The approved v13 runtime, active
item bank, public wording, Specialist routing, and production result bundle
remain unchanged. Release activation remains gated by respondent evidence,
governance, deployment, and explicit cutover approval.

## Completed compatibility-preserving units

| ID    | Implementation                                                     | Status and proof                                                                                                                                                                                                                                                                                            | Version / decision trace                                                                                     |
| ----- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| I-001 | Frozen baseline manifest and executable baseline check             | Complete. Counts active/historical/effective items, statement-choice records, roots, rosters, Specialist modules, and current IDs; rejects a non-frozen code baseline.                                                                                                                                      | `VNEXT_BASELINE_CHECK_VERSION`; frozen baseline `f0324db...`, candidate `e298ccd...`; D-01, D-02, D-26, D-28 |
| I-002 | Conceptual ontology and typed graph                                | Complete. Registers all 145 v13 nodes, all 17 approved conceptual kinds, all 17 approved relation types, parent/alias provenance, graph targets, symmetry, and subtype acyclicity.                                                                                                                          | `VNEXT_ONTOLOGY_VERSION`, `VNEXT_GRAPH_VERSION`; D-70, D-71, D-72, D-73, D-74                                |
| I-003 | Measurement status and derived role policy                         | Complete. Keeps conceptual kind, measurement state, compatibility role, evidence, high-risk policy, and ordinary/public eligibility separate; no respondent evidence or promotion is supplied.                                                                                                              | `VNEXT_ROLE_POLICY_VERSION`; D-75, D-91, D-92, D-93                                                          |
| I-004 | Root/facet construct registry                                      | Complete. Registers all 26 roots and the canonical integrated-spec facet IDs, including regulation and distribution replacements; records planned coverage only.                                                                                                                                            | `VNEXT_CONSTRUCTS_VERSION`, `VNEXT_FACET_MAP_VERSION`; D-76–D-85                                             |
| I-005 | Item annotations and dispositions                                  | Complete. Generates 406 effective item records from the approved audit, preserves source/disposition/coverage consequences, stores option-level records for six statement-choice items, and maps legacy facet tokens to canonical IDs.                                                                      | `VNEXT_ITEM_ANNOTATIONS_VERSION`, `VNEXT_ITEM_DISPOSITIONS_VERSION`; D-38, D-86–D-90, D-115–D-117            |
| I-006 | Roster, alias, graph, and module integrity                         | Complete. Verifies the 16/78/24/19/8 role bijection, 16 Primary scopes, seven direct and one focused Modifier dispositions, 39 mapped and 39 provisional Specialists, nine-module order, Context exclusion, and retired mappings.                                                                           | `VNEXT_ROSTER_INTEGRITY_VERSION`; D-63, D-64, D-69, D-95, D-96                                               |
| I-007 | Evidence cards and promotion records                               | Complete as a held design registry. Creates 94 label-specific cards and 94 promotion records with all nine components `not-started`; no missing evidence is marked `pass`.                                                                                                                                  | `VNEXT_EVIDENCE_CARD_VERSION`, `VNEXT_PROMOTION_RECORD_VERSION`; D-112–D-114                                 |
| I-008 | Validation manifest and respondent-data contracts                  | Complete as a V0 design manifest. Freezes V0–V13 vocabulary, respondent-level splits, raw/coded/state response separation, item/option/form fingerprints, criterion timing/exposure, inclusion linkage, code revision, seed, and card linkage.                                                              | `VNEXT_VALIDATION_MANIFEST_VERSION`; D-118, D-119                                                            |
| I-009 | Challenger-model adapters                                          | Complete as research contracts only. Declares frozen baseline, theory-led multidimensional, LCA, LPA, profile-clustering, and network alternatives with held-out split, seed, provenance, missingness, convergence, and disagreement review.                                                                | `VNEXT_CHALLENGER_MODELS_VERSION`; D-120                                                                     |
| I-010 | Calibration, uncertainty, fairness, form, and robustness artifacts | Complete as design contracts only. Rejects item-count-only reliability, invalid intervals, missing multiplicity, unsafe subgroup inference, and item-count-only form equivalence; current claim ceiling remains PC0.                                                                                        | `VNEXT_CALIBRATION_VERSION`, `VNEXT_UNCERTAINTY_VERSION`, `VNEXT_ROBUSTNESS_VERSION`; D-120–D-123            |
| I-011 | Shadow vNext construct/facet scorer                                | Complete as a research-only scorer. Computes layer-specific root/facet estimates from declared annotations and measured answers, preserves reverse signs and statement-choice weights, and emits `score: undefined` plus missingness when unmeasured. It is not imported by production result construction. | `VNEXT_SHADOW_SCORING_VERSION`; D-124, D-125                                                                 |

## Candidate remediation units I-012 through I-018

The following units are implemented as versioned, fail-closed contracts. A
unit marked complete below means its specification-to-code surface, metadata,
validation, provenance, and reproducibility controls are present; it does not
mean that its respondent-dependent activation gate has passed.

| ID    | Candidate implementation status                                       | Evidence and remaining gate                                                                                                                                  |
| ----- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I-012 | Complete as a validation-manifest and surface-partition contract      | Core, Specialist, task, expert-review, and bridge manifests are explicit; respondent waves remain external.                                                  |
| I-013 | Complete as held M0/M1 evidence-card metadata                         | National Conservatism, Liberal Conservatism, and compound candidates carry compositional-residual hypotheses; held-out respondent analysis remains required. |
| I-014 | Complete as fail-closed Modifier eligibility metadata                 | Direct-indicator and host-portability gates remain evidence-dependent.                                                                                       |
| I-015 | Complete as module-local Specialist metadata and challenger contracts | Current routing is preserved; module promotion, local separation, and fairness gates remain external.                                                        |
| I-016 | Complete as shadow result claim/status metadata                       | No public v13 wording or result adapter changed; interpretation migration remains gated.                                                                     |
| I-017 | Complete as a non-production shadow boundary                          | Frozen v13 scoring remains the only production scorer; cutover requires a new approved tuple and evidence.                                                   |
| I-018 | Complete as candidate release provenance and CI contract              | Release manifest, revision checks, generated-artifact checks, and rollback reference are present; signoff and deployment approval remain pending.            |

## P1 remediation closure

| Finding                        | Resolution                                                                                                                                      | Governing units / decisions      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| P1-01 ontology and graph       | Independent faceted node metadata, explicit polyhierarchical relation registry, relation semantics, and strict graph validation                 | I-002; D-70–D-74, D-127          |
| P1-02 role derivation          | Typed vNext policy derives role from conceptual, graph, measurement, risk, evidence, and module inputs; legacy role is compatibility trace only | I-003; D-75, D-91–D-93           |
| P1-03 construct/facet registry | Canonical 26-root registry, deterministic facet relationships, local constructs, applicability, measurement, provenance, and validation         | I-004; D-76–D-85                 |
| P1-04 item mapping             | Unicode/ASCII/hyphenated direction parsing, canonical option mappings, strict reference validation, and byte-reproducible generation            | I-005; D-86–D-90, D-115–D-117    |
| P1-05 surface partitioning     | Five versioned manifests partition core, Specialist, task, expert-review, and bridge surfaces; challengers consume declared manifests           | I-008–I-009; D-118–D-120         |
| P1-06 provenance and CI        | Candidate/baseline-separated manifests, release manifest, quality-gate metadata, CI contract, and revision/fingerprint checks                   | I-001, I-006, I-018; D-125–D-131 |

## Evidence-gated roadmap units

I-012 respondent validation waves, I-013 M0/M1 promotion analysis, I-014
Modifier promotion, I-015 Specialist promotion, I-016 versioned interpretation
and public-claim adapter, I-017 production scorer migration, and I-018 release,
reassessment, and rollback controls remain gated or not activated. Their
remaining dependencies are respondent data, preregistered confirmation and
replication, cognitive/response-process evidence, construct and neighbor
separation, criterion calibration, retest, fairness/invariance, uncertainty,
robustness, form equivalence, public wording review, and an explicit release
decision. Code correctness and synthetic fixtures cannot satisfy those gates.

## Validation surface

The targeted vNext tests cover baseline counts, ontology/graph integrity,
role policy, root/facet registration, the 406-item audit, roster/alias
integrity, evidence-card completeness, V0 manifest leakage checks, challenger
contracts, calibration/robustness contracts, and shadow-score missingness.
The repository-wide gates and browser/worker/collector/R checks remain the
release validation surface and are reported separately from this design status.
