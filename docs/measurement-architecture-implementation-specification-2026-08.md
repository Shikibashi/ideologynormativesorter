# Measurement Architecture Implementation Specification — 2026-08

Implementation-specification version: `2026-08-implementation-spec-v1`
Status: approved implementation plan; production promotions remain evidence-gated.

This repository mirror records the executable batch order from the approved
implementation specification. The architecture and decision-log documents
define meaning and authorization; this document defines file boundaries,
version behavior, tests, and release gates.

## Batch order

| Wave | Scope                                                        | Production effect                              |
| ---- | ------------------------------------------------------------ | ---------------------------------------------- |
| W0   | Documentation and invariant synchronization                  | Documentation and tests only                   |
| W1   | Construct families, item audit, form metadata                | Research metadata and audit                    |
| W2   | Probability, choice, trade-off, validator, similarity tasks  | Explicit opt-in research modules               |
| W3   | Validation, estimator comparison, DIF, profiles, equivalence | Analysis outputs only                          |
| W4   | Prototype, bridge, geographic, and longitudinal calibration  | Calibration outputs only                       |
| W5   | Promotion review                                             | Requires a new evidence-backed decision record |

## W0 deliverables

- Co-located architecture, decision-log, and implementation documents.
- Versioned research-contract invariants for layers, theory contexts, roles,
  gates, claim language, and version bundles.
- Baseline fixtures proving production scores, label order, gates, and public
  wording remain stable.
- Quality-gate metadata tied to the current baseline commit and validation.

## Research-only surfaces

W1 now provides `src/types/research.ts`, `src/data/constructFamilies.ts`,
item metadata, and form manifests. W2 provides
`src/data/researchTaskBank.ts`, `src/research/tasks.ts`,
`src/research/criterion.ts`, `src/research/prototypeCalibration.ts`, and the
explicit `ResearchTaskScreen`/Worker path. Research task responses, criterion
records, expert codes, and prototypes must not enter `buildResultProfile` or
production label matching. Anchor/rotating item registries, calibrated
estimators, and analysis scripts remain research-only scaffolding; production
use remains a later-wave evidence gate.

The task-specific protocol is documented in
[`docs/research-task-protocol-2026-08.md`](research-task-protocol-2026-08.md).

## Version policy

Current production identifiers remain unchanged during research waves:

- bank: composite `QUESTION_BANK_VERSION`;
- scoring: `2026-08-13-taxonomy-v8`;
- taxonomy: `2026-08-taxonomy-v13`;
- primary measurement: `2026-08-primary-core-v1`;
- modifier measurement: `2026-08-modifier-construct-v1`;
- research schema: `2026-08-v18`;
- consent: `2026-08-12-v8`;
- quality rules: `data-quality-v2`;
- form: `profile-form-v3`;
- research task bank/form: `2026-08-research-task-bank-v3` /
  `2026-08-research-task-form-v2`;
- study: `community-2026-v5`;
- specialist roster/assignment: `2026-08-specialist-roster-v1` /
  `balanced-hash-v2`.

Research contracts use dedicated identifiers such as
`2026-08-construct-family-map-v1`, `2026-08-research-task-bank-v3`,
`2026-08-descriptive-calibration-v1`, `2026-08-strategy-task-bank-v2`,
`2026-08-normative-tradeoff-v1`, `2026-08-research-estimators-v1`,
`2026-08-model-comparison-v1`, `2026-08-unfolding-analysis-v1`,
`2026-08-perception-geometry-v1`, `2026-08-profile-discovery-v1`,
`2026-08-criterion-plan-v1`,
`2026-08-validator-battery-v1`, `2026-08-prototype-calibration-v1`,
`2026-08-prototype-coding-v1`, `2026-08-deployment-scope-v1`,
`2026-08-dif-plan-v1`, `2026-08-content-review-v1`,
`2026-08-cognitive-review-v1`, `2026-08-label-exposure-v1`,
`2026-08-form-equivalence-v1`, `2026-08-anchor-rotation-v1`, and
`2026-08-validation-report-v1`. Exposing any of these as production meaning
requires the corresponding approval and production version bump.

W3 now provides research-only precision/model/DIF/equivalence contracts in
`src/validation/analysisContracts.ts`, versioned analysis metadata, and
fail-closed R entrypoints in `analysis/`. W4 provides anchor/rotation,
deployment-scope, expert-code, bridge-response, label-exposure, and
longitudinal-linking contracts in `src/data/anchorItems.ts` and
`src/research/linking.ts`. These are comparison and calibration surfaces only;
they are not replacements for `computeScoreBreakdown` or label matching.
Production routing remains blocked until the evidence and decision-record gate
in W5 is satisfied.

## Required validation

Every implementation batch runs the relevant focused tests and the complete
repository gate:

```text
npm test
npm run lint
npm run build
npm run research:check
npm run test:worker
npm run test:e2e
npm run test:a11y
npm run test:ecw
```

Research analysis scripts additionally require frozen input, output, manifest,
version, inclusion, response-state, and sample checks. R analyses fail closed
on unresolved inclusion decisions, duplicate IDs, incompatible versions,
incomplete form fingerprints, invalid response states, or missing
preregistered configuration.
