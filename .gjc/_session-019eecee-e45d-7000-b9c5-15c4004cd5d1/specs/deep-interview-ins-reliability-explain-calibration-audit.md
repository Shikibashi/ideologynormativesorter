# Deep Interview Spec: Political Judgment Decomposition Test — Reliability, Explainability, Calibration, Audit

## Metadata
- Interview ID: 019eecee-e45d-7000-b9c5-15c4004cd5d1
- Rounds: 0 (short-circuit: user provided a complete, unambiguous feature spec matching a verified existing repo state)
- Final Ambiguity Score: 0.0%
- Type: brownfield
- Generated: 2026-06-22T01:30:00.000Z
- Threshold: 0.05
- Threshold Source: default
- Initial Context Summarized: no
- Status: PASSED
- Auto-Researched Rounds: []
- Auto-Answered Rounds: []
- Architect Failures: 0
- Lateral Reviews: []
- Lateral Panel Failures: 0
- Refined Rounds: []
- Closure Overrides: 0
- Restated Goal: Add reliability indicators and top-contributing-question explanations to the existing political judgment decomposition scoring engine, plus calibration fixture tests and a reusable corpus audit, so results are no longer overconfident and scoring regressions are caught automatically.

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 1.00 | 0.35 | 0.35 |
| Constraint Clarity | 1.00 | 0.25 | 0.25 |
| Success Criteria | 1.00 | 0.25 | 0.25 |
| Context Clarity | 1.00 | 0.15 | 0.15 |
| **Total Clarity** | | | **1.00** |
| **Ambiguity** | | | **0.00** |

## Topology
| Component | Status | Description | Coverage / Deferral Note |
|-----------|--------|-------------|--------------------------|
| Reliability indicators | active | Per-axis band (insufficient/low/medium/high) + per-label reliability | New `scoring/reliability.ts`; surfaced in ResultsScreen and AxisBar |
| Explainability | active | "Why this score" pane: top contributing questions per axis | New `scoring/explain.ts`; expandable section in AxisBar |
| Calibration fixtures | active | Synthetic answer profiles for 6 archetypes asserting expected labels | New `scoring/calibration.fixtures.ts` + `calibration.test.ts` |
| Corpus audit | active | Reusable typed `AuditReport` covering coverage/balance/shape problems | New `data/audit.ts` + `audit.test.ts` |
| Question versioning | deferred | Adding `version`/`active`/`review_status` to every entry in the 203 KB `questions.ts` and 572-line `moduleQuestions.ts` is unrelated-cleanup risk and belongs in a separate PR. | Deferred: separate PR once bank stabilizes. |
| Methodology page | deferred | Requires integration routing and original copy; out of scope. | Deferred. |
| Result-reproducibility metadata in share URL | deferred | Depends on question-bank versioning; adds binary-compat risk to the share codec. | Deferred. |

## Established Facts
- Stack is Vite 8 + React 19 + TS 6 + Vitest 4 + ESLint 10, npm. No new deps allowed unless justified.
- The repo already implements: 20 domains, 24 axes (8/7/9 split), 8 label centroids (each covers all 24 axes), 11 faction modules with 4 questions each, statementChoice questions, full scoring engine, tiered quiz flow, results page, AxisBar, share codec.
- Verification at time of spec: `npm test` 62/62 green, `npm run lint` clean, `npm run build` succeeds (422 kB bundle).
- `AxisScore` already carries `itemCount` and `avgSalience` — sufficient signal for reliability banding without changing the public type shape for existing callers.
- `LabelMatch` already carries `confidence` (0..1) but does not expose the underlying evidence count; reliability must compute label reliability from the centroid axes' answered-item counts.

## Trigger Metadata
None — this is a short-circuit spec; no interview rounds were run.

## Lateral Review Panel
None convened.

## Goal
Add four coherent, independent, additive features to the already-working scoring/data layer of the political judgment decomposition test: (1) per-axis and per-label pragmatic reliability bands derived from item count, salience, and direction consistency, surfaced in the UI so results cannot be shown as overconfident when the evidence is thin; (2) a "why this score" explanation layer listing the top contributing questions per axis; (3) calibration fixture tests for six distinct archetypes proving the scoring engine produces the expected label sets and catching regressions as the 400-item bank grows; (4) a reusable, typed corpus-audit function plus tests that codify the ad-hoc data-validity checks so balance drift is detectable mechanically.

## Constraints
- Do not copy any third-party question text, UI text, code, or assets. All new fixture prompts and audit diagnostics are original.
- No new runtime dependencies. Pure TS/Vitest only.
- Preserve existing public APIs: `buildResultProfile`, `computeAxisScores`, `computeLabelMatches`, `computeConfoundedLabels`, `suggestModules`, `encodeAnswers`/`decodeAnswers`, `App`, `IntroScreen`, `QuizScreen`, `AxisBar` (extend, don't break).
- Keep scoring and audit logic pure and unit-testable, separate from UI.
- Follow existing file organization: scoring under `src/scoring/` with colocated `*.test.ts`, data under `src/data/` with colocated `*.test.ts`, types under `src/types/`, components under `src/components/`.
- Do not introduce a database. No persistence beyond the existing localStorage-less, share-by-URL model.
- No runtime LLM scoring. No adaptive routing in this PR.
- Do not touch `src/data/questions.ts`, `src/data/moduleQuestions.ts`, or `src/data/statementQuestions.ts` item bodies — bank content is frozen for this PR.

## Non-Goals
- Per-question `version`/`active`/`review_status` metadata fields (bank-touching; separate PR).
- Methodology page (wants routing + original copy; separate deliverable).
- Result-reproducibility metadata in the share URL (depends on bank versioning).
- Adaptive testing, coalition finder, pairwise comparison, theory mode, custom ideology builder, localization/context packs, anti-gaming detection beyond what reliability already surfaces, item analytics dashboard, admin question editor.
- Reshaping existing `AxisScore`/`ScoreBreakdown`/`ResultProfile`/`LabelMatch` field shapes.

## Acceptance Criteria
- [ ] New pure module `src/scoring/reliability.ts` exports `reliabilityForAxis(axisScore, options)` returning `AxisReliability` and `reliabilityForLabel(labelMatch, contributingAxes, options)` returning `AxisReliability` keyed by label.
- [ ] Bands `insufficient` (<3 items or consistency <0.5), `low` (3–5 items or consistency 0.5–0.65), `medium` (6–10 items with consistency ≥0.65, or 5 items with consistency ≥0.8), `high` (>10 items with consistency ≥0.65). Bands include a human-readable `reason` string.
- [ ] New pure module `src/scoring/explain.ts` exports `contributionsForAxis(axisId, questions, answers, axes)` returning `Contribution[]` sorted by `|contribution|` descending, capped at a configurable top-N (default 5).
- [ ] New data module `src/data/audit.ts` exports `auditCorpus()` returning a typed `AuditReport` with sections: totals, domain coverage, layer coverage, theory-context coverage, axis coverage, label centroid coverage, module coverage, problems[].
- [ ] New fixtures module `src/scoring/calibration.fixtures.ts` imports the real `questions`, `axes`, and `labels` and exports ≥6 synthetic `AnswerMap` profiles (market-liberal, egalitarian-statist, democratic-socialist, revolutionary-collectivist, national-traditionalist, technocratic-centralist) authored by writing answer values to the questions whose `axisWeights` align with each label's `centroid`.
- [ ] New test `src/scoring/reliability.test.ts` covers insufficient, low, medium, high bands for both axis and label reliability; includes a high-skip-rate case that demotes the band.
- [ ] New test `src/scoring/explain.test.ts` covers contribution ordering, salience weighting, dont_know exclusion, and statementChoice handling.
- [ ] New test `src/data/audit.test.ts` asserts the real corpus audit returns zero `problems` and that synthetic malformed corpora trip each diagnostic; covers at least missing domain, duplicate id, unknown axis, centroid gap, and missing layer-per-domain.
- [ ] New test `src/scoring/calibration.test.ts` runs `buildResultProfile` against each fixture and asserts each fixture's expected label id appears in `nearestLabels` (top-3 list) with `confidence` above a fixture-specific floor.
- [ ] `AxisBar` gains an expandable "Why this score" affordance (toggle button) that lists the top-N contributions for that axis, using `explain.ts` and reading questions via a new optional prop. When `score.itemCount === 0`, the affordance is suppressed.
- [ ] `ResultsScreen` shows each axis's reliability band next to its score (e.g., "0.82 · high") and shows "unreliable" nearest labels (label-band `insufficient` or `low`) with a clearly differentiated visual treatment and an inline rationale.
- [ ] `App.tsx` threads the real `questions` (or `ALL_SCORABLE_QUESTIONS`) into `ResultsScreen` so the explanation pane can render.
- [ ] `npm test` remains all-green with the new tests added; `npm run lint` clean; `npm run build` succeeds.
- [ ] No existing test is modified in a way that weakens its assertion (only additive changes to existing files where necessary to thread new props).

## Deferrals
- Question-bank versioning, methodology page, result-reproducibility metadata in the share URL: see Non-Goals.
- Convergence Pacing: no min-round floor, score-drop cap, or dampening applied during this synthetic spec pass.

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| The repo is a blank slate needing scaffold + first feature | The user's own planning doc says "empty GitHub repository — no commits, no branches, no files" | Inspection proves the repo has a complete core: 400 questions, 24 axes, 8 labels, 11 faction modules, scoring engine, UI, share codec. The plan treats it as brownfield and extends rather than rebuilds. |
| The whole feature architecture from the prompt must ship in one PR | Prompt scope spans versioning, methodology page, comparison, coalition finder, adaptive testing, etc. — all much larger than a coherent reviewable PR | Ship the user's own stated top-2 priorities (reliability + explainability) plus the prompt-required calibration fixtures and corpus audit. Defer everything that depends on bank versioning or new routing. |
| Reliability requires psychometric validation | The user explicitly says "do not overclaim psychometric precision" | Bands are pragmatic heuristics from item count + consistency; `reason` strings say "pragmatic" not "validated". |

## Technical Context
- `src/scoring/aggregate.ts` `computeAxisScores` already produces `raw`, `normalized`, `itemCount`, `avgSalience` per `AxisScore`. Reliability composition reuses these without re-deriving from raw answers.
- `src/scoring/normalize.ts` `normalizeAnswer` returns `null` for `dont_know`; explain.ts must skip nulls the same way.
- `src/scoring/labelMatch.ts` `computeLabelMatches` returns top-3 `LabelMatch` with `confidence` already computed as closeness. Label reliability layers on top of the centroid axes' answered-item counts.
- `src/data/dataValidity.test.ts` already asserts the green corpus (20 domains, 24 axes, no dup ids, every domain has an item per layer, etc.). `audit.ts` codifies the same checks into a runtime-callable `AuditReport` plus additional diagnostics (extreme weights, missing axis weights, missing dont_know on descriptive, etc.).
- `src/components/AxisBar.tsx` currently renders a marker track, poles, and salience line. It takes `{ axis, score }`; extend with an optional `contributions?: Contribution[]` prop so the expandable section can render server-side-computed contributions without the component reaching into scoring utilities.
- `src/components/ResultsScreen.tsx` calls `AxisBar` for each score; add a reliability badge line and pass the contributions array.
- `src/App.tsx` already imports `questions` and `moduleQuestionById`; thread `ALL_SCORABLE_QUESTIONS` (and `axes`) into `ResultsScreen` props for the explanation pane.

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| AxisScore | core domain | axisId, layer, raw, normalized, itemCount, avgSalience | computed per Axis |
| AxisReliability | core domain | axisId, band, consistency, itemCount, reason | derived from AxisScore |
| Contribution | core domain | questionId, prompt, layer, theoryContext, unit, axleWeight, salienceFactor, contribution, toward | per Question + Answer + Axis |
| AuditReport | core domain | totals, coverage maps, problems[] | derived from questions[], axes[], labels[], modules[] |
| CalibrationFixture | core domain | id, description, answers, expectedLabelIds, minConfidence | references Question and IdeologyLabel |

## Ontology Convergence
| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 (synthetic) | 5 | 5 | - | - | - |

## Interview Transcript
<details>
<summary>Full Q&A (0 rounds)</summary>

No interview rounds were run. The user's turn contained a fully elaborated feature specification that resolved every required clarity dimension against the verified existing repository state. Ambiguity was measured at 0.0% by direct inspection of the repo and the user's explicit priority list ("The single most important missing feature is result reliability. The second most important is explainability.").

</details>
