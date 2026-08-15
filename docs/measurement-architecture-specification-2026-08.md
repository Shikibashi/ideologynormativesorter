# Measurement Architecture Specification — 2026-08

Status: approved architecture; production promotions remain evidence-gated.

Architecture version: `2026-08-measurement-architecture-v1`
Approval authority: [`docs/methodological-change-decision-log-2026-08.md`](methodological-change-decision-log-2026-08.md)
Implementation authority: [`docs/measurement-architecture-implementation-specification-2026-08.md`](measurement-architecture-implementation-specification-2026-08.md)
Integrated vNext authority: [`vnext-integrated-system-specification-2026-08.md`](vnext-integrated-system-specification-2026-08.md)

This document remains the frozen baseline. The integrated vNext authority
extends it without reopening or silently changing its production contract.

## Purpose and precedence

This document defines the measurement boundary for the Ideology Normative
Sorter. The live executable registries and current effective question bank are
the operational source of truth. This specification defines what those
surfaces may claim and how future research extensions must remain separated
from ordinary participant results.

The production scorer remains the reproducible baseline in:

- `src/scoring/aggregate.ts`
- `src/scoring/labelMatch.ts`
- `src/scoring/modifierConstructMatch.ts`
- `src/scoring/divergence.ts`
- `src/scoring/reliability.ts`

The implementation specification supplies mechanics, tests, and release gates.
The decision log records the authorization class and unresolved status of each
decision. Neither research output nor synthetic fixtures authorizes a
production promotion by itself.

## Current baseline

| Surface                                | Current contract                                                  |
| -------------------------------------- | ----------------------------------------------------------------- |
| Active core questions                  | 338                                                               |
| Respondent-facing specialist questions | 68                                                                |
| Live effective questions               | 406                                                               |
| Public core forms                      | Balanced 206; Full-depth 338                                      |
| Axes                                   | 26: 10 normative, 7 descriptive, 9 prescriptive                   |
| Taxonomy                               | `2026-08-taxonomy-v13`                                            |
| Primary measurement                    | `2026-08-primary-core-v1`                                         |
| Modifier measurement                   | `2026-08-modifier-construct-v1`                                   |
| Production scoring                     | `2026-08-13-taxonomy-v8`                                          |
| Research schema                        | `2026-08-v19`                                                     |
| Research study                         | `community-2026-v5`                                               |
| Research form                          | `profile-form-v3`                                                 |
| Research task bank/form                | `2026-08-research-task-bank-v3` / `2026-08-research-task-form-v2` |
| Specialist roster                      | `2026-08-specialist-roster-v1`                                    |
| Specialist assignment                  | `balanced-hash-v2`                                                |

The earlier 400-question, 24-axis, 8-label framing is historical and is not a
current implementation target.

## Measurement invariants

1. Normative, descriptive, and prescriptive layers remain separate vectors in
   collection, scoring, storage, estimation, and reporting.
2. `ideal`, `nonideal`, and `mixed` are theory-context values, not layers.
3. Unmeasured axes retain `itemCount = 0`. Missing responses, planned matrix
   omission, `dont_know`, `prefer_not_to_answer`, skipped confidence, and
   skipped priority remain distinct states.
4. Primary labels use source-backed scope gates. Direct modifiers require
   direct construct indicators. Specialist and Context entries do not become
   ordinary scoring endpoints without a new approved role decision.
5. Self-identification, external validators, expert codes, forecasts, and
   novel scenarios are criterion data. They remain outside production axis
   aggregation and label matching.
6. Research records carry explicit record type, task/form/study metadata,
   version bundle, inclusion state, and exact presented content where relevant.
7. Participant-facing language is limited to profile similarity, evidence
   coverage, and uncertainty. Probability, posterior, population, and
   representative claims require a later calibrated release decision.
8. Sources support definitions, boundaries, and context; they do not establish
   psychometric validity or answer keys.
9. W1 construct-family metadata is a planning and coverage map, not empirical
   evidence that constructs are equivalent across normative, descriptive, and
   prescriptive layers.

## Role boundary

| Role       | Ordinary route                                   | Research extension                            |
| ---------- | ------------------------------------------------ | --------------------------------------------- |
| Primary    | Scope-aware similarity after required-core gates | Prototype, bridge, and profile studies        |
| Modifier   | Direct core indicators only                      | Validator and calibrated construct studies    |
| Specialist | Explicit module assignment and evidence gates    | Module validation and invariance studies      |
| Context    | Catalog and explanation                          | Perception, historical, and geographic coding |
| Retired    | Compatibility metadata only                      | Historical linking only                       |

Any role, scope, estimator, item, wording, form, or claim-language change must
follow the version-bump policy in the implementation specification and the
authorization in the decision log.

## Evidence boundary

The open public contribution channel is a voluntary, nonprobability sample. It
supports description of instrument behavior in the achieved sample, not
population prevalence, representative opinion, or a sampling margin of error.
Reliability, dimensionality, temporal stability, criterion performance,
invariance, short-form equivalence, and label calibration remain empirical
questions until the specified data and review gates are met.
