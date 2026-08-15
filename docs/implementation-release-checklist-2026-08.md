# Measurement Architecture Release Checklist — 2026-08

This checklist is the handoff gate for the implementation specification. It
keeps research artifacts traceable without implying that a calibration result
has changed the participant-facing scorer.

## Before analysis

- [ ] Confirm the study ID, consent/schema version, question/task bank,
      taxonomy, measurement versions, form fingerprint, and label roster
      fingerprints.
- [ ] Freeze the inclusion manifest. Every input record has exactly one
      `include` or `exclude` decision; `review-required` is not an analysis
      state.
- [ ] Record the exact code revision, random seed, estimand, denominator
      description, and item/task/form fingerprint.
- [ ] Separate core, specialist, research-task, expert-code, and bridge
      records before analysis. Specialist and task records must not enter the
      ordinary axis reliability model by accident.
- [ ] Confirm any DIF groups are preregistered observed groups. Do not infer
      groups from the target score or outcome.

## Required implementation surfaces

| Surface                                 | Evidence                                                                                        | Promotion status            |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------- |
| Construct families and item metadata    | `src/data/constructFamilies.ts`, item audit metadata, focused tests                             | Research-only               |
| Task tiers and collector/Worker path    | `src/data/researchTaskBank.ts`, `src/research/tasks.ts`, Worker schema/migration, browser tests | Opt-in research-only        |
| Precision, comparison, DIF, equivalence | `src/validation/analysisContracts.ts`, `analysis/` entrypoints                                  | Research-only               |
| Anchors, rotation, deployment scope     | `src/data/anchorItems.ts`, `src/research/linking.ts`                                            | Calibration-only            |
| Expert/prototype/bridge/linking         | `src/types/research.ts`, `src/research/linking.ts`                                              | Calibration-only            |
| Production scoring and labels           | Existing `src/scoring/` and taxonomy modules                                                    | Unchanged by research waves |

## Validation commands

Run the complete repository gate from the repository root:

```text
npm test
npm run lint
npm run build
npm run research:check
npm run test:collector
npm run test:worker
npm run worker:check
npm run research:r-syntax
npm run test:e2e
npm run test:a11y
npm run test:ecw
git diff --check
```

Run the task-specific contract and R smoke checks as well:

```text
npm test -- --run src/validation/analysisContracts.test.ts src/data/anchorItems.test.ts src/research/linking.test.ts
npm run test:collector
```

The R smoke command and fixture are documented in
`analysis/README.md`. If `mirt` is unavailable, the DIF workflow must stop or
report an explicit missing-environment state; it must not substitute a weaker
model silently.

## Promotion gate

- [ ] Analysis output metadata passes the TypeScript contract and contains a
      single version bundle, resolved manifest, sample counts, estimand, seed,
      code revision, and fingerprint.
- [ ] Model comparison includes the frozen production baseline, held-out
      evaluation, convergence state, and nonconvergence handling.
- [ ] Precision and uncertainty are reported with observed denominators and
      explicit insufficient-data states.
- [ ] Short/full form equivalence, anchors, rotation, and longitudinal links
      have a frozen bridge design before pooling versions.
- [ ] Prototype labels have source-unit provenance, independent coding, and
      separate respondent-bridge evidence.
- [ ] Deployment scope has translation/back-translation and invariance
      evidence for each locale; unsupported locales remain out of scope.
- [ ] A new methodological decision record explicitly approves any proposed
      production change, including a new production scoring/taxonomy version.

Until every applicable box is checked, release only the existing production
scorer and clearly marked opt-in research surfaces.

## Candidate e298 remediation contract

The candidate-specific release record is
`release-manifest/vnext-release-manifest.json`. The source-of-truth typed
manifest is `src/data/vnextReleaseManifest.ts`; the committed JSON is checked
for candidate, baseline, version-tuple, fingerprint, P1, implementation-unit,
and outstanding-gate completeness.

Before any future merge or production decision, run the complete contract:

```text
npm run vnext:items:check
npm run vnext:release:check
npm test
npm run lint
npm run build
npm run research:check
npm run test:collector
npm run test:worker
npm run worker:check
npm run research:r-syntax
npm run test:browser
git diff --check
```

The contract must fail if a generated artifact drifts, if a manifest names a
different candidate or frozen baseline, if any surface leaks across its
declared boundary, or if a v13 production regression is detected. Passing the
contract does not satisfy respondent, governance, deployment, or cutover gates.
