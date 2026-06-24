## Summary
The proposed approach is architecturally sound as a narrow calibration change: keep the scoring pipeline and fixture generation untouched, use the archetype sweep as the decision point for any near-tie exception, and synchronize documentation with the final state. The main review concern is baseline drift: inspected source already has the two `right-wing-populism` centroid values at `0.3` and the sweep test already lacks a `right-wing-populism` exception, while the rationale document still claims that exception exists.

Recommendation: proceed only as a current-baseline-aware execution after approval. Treat the centroid and exception-removal states as already satisfied if they remain true on re-read, update the stale documentation, and run the planned validation gates only after execution approval before claiming self-resolution.

## Analysis
Stage 1 - Spec compliance:
- The planner artifact targets exactly three files and forbids scorer, fixture, question-bank, UI, module, family-tree, and unrelated centroid edits. That matches the requested low-risk centroid/test/docs boundary.
- The requested final centroid values are already present in inspected `src/data/labels.ts`: `right-wing-populism` has `liberty-noninterference: 0.3` and `anti-domination: 0.3` at lines 1598 and 1604 in the current file. The neighboring `ethnonationalist` centroid remains materially distinct, with `liberty-noninterference: -0.4` and `anti-domination: -0.6` at lines 989 and 995.
- The planned conditional exception removal is directionally correct, but the current `src/scoring/archetype-sweep.test.ts` already has no `NEAR_TIE_EXCEPTIONS` entry for `right-wing-populism`. The exception table preserves `minarchist` with both `civil-libertarian-cosmopolitan` and `classical-liberalism` at line 42 and preserves `market-liberal` -> `classical-liberalism` at line 55. This means the plan precondition is stale, not the architecture.
- The current docs are the out-of-sync part: `docs/ideology-labels-first-batch-rationale.md` still says there are two genuine near-ties including `right-wing-populism`/`ethnonationalist` at lines 10-13 and still documents a nonexistent `NEAR_TIE_EXCEPTIONS[right-wing-populism]` entry at line 519, even though the table already contains the updated `0.3` values around lines 486-491.

Stage 2 - Architecture:
- A data-only centroid nudge is the right boundary for this change. It avoids hidden methodology drift and keeps the scoring contract centralized in `buildResultProfile` plus the existing archetype sweep guard.
- The sweep-test architecture is appropriate for this decision because it fails loudly when a target fixture is not the top nearest label and has no documented exception. Since the inspected exception table lacks `right-wing-populism`, post-approval `npm run test` will directly validate whether the current centroid self-resolves without a waiver.
- Preserving unrelated exceptions is important because they encode known dense-family collisions rather than generic tolerances. The planner correctly protects `market-liberal`/`classical-liberalism` and the expanded `minarchist` exception from collateral cleanup.
- The documentation update is not cosmetic: it is part of the calibration contract. A rationale document that claims a nonexistent exception makes future reviewers distrust the sweep as the source of truth.

Stage 3 - Code quality, security, performance:
- No security or performance concerns are introduced by the proposed file-limited data/docs/test plan.
- The chief quality concern is source-of-truth consistency. Current docs and test source disagree about whether the `right-wing-populism` exception exists, and the planner artifact appears to have been written against an earlier baseline.

Strongest steelman antithesis:
- Raising `liberty-noninterference` and `anti-domination` on a strongman, coercive, bounded-national-community label can look semantically incoherent. It risks making right-wing populism appear more like a civic anti-domination ideology than an authoritarian nationalist one, and it could blur distance from labels that treat anti-domination as a universal anti-hierarchy commitment.
- That antithesis is serious because the same centroid still has `authority-legitimacy: 0.5`, `equality-theory: -0.4`, `political-community-boundary: -0.85`, `centralization-preference: 0.5`, and `coercion-strategy: 0.5`. A naive rationale could sanitize or over-liberalize the label.
- The synthesis is to keep the positive values moderate and explicitly scoped: this is anti-elite, anti-technocratic, personal-freedom rhetoric inside a bounded national community, not universal egalitarian anti-hierarchy. The planned docs language mostly does this and should remain precise.

## Root Cause
The fundamental issue is baseline drift between the persisted planner artifact and the inspected repository. The artifact describes a future two-value centroid edit and a future test exception removal, but current source already reflects those final code/test states while the rationale document still reflects the old exception narrative.

## Findings
1. Severity: MEDIUM - Stale planner baseline can misdirect execution.
   - File/reference: `stage-01-planner.md` file-level changes for `src/data/labels.ts` and `src/scoring/archetype-sweep.test.ts`; current `src/data/labels.ts:1598` and `src/data/labels.ts:1604`; current `src/scoring/archetype-sweep.test.ts:20-77`.
   - Impact: An executor following the artifact literally may look for changes that no longer exist, produce an acceptance mismatch by requiring a future diff in `labels.ts`, or claim to remove an exception that is already absent. This is especially risky because the docs still claim the exception exists.
   - Fix suggestion: After approval, re-read the three files and reinterpret the acceptance criteria as final-state criteria: `right-wing-populism` centroid values are `0.3`/`0.3`; no `right-wing-populism` near-tie exception exists unless post-approval tests prove it must be restored; unrelated exceptions remain intact; docs match the observed final exception state.

2. Severity: LOW - Documentation is currently inconsistent with the sweep test.
   - File/reference: `docs/ideology-labels-first-batch-rationale.md:10-13` and `docs/ideology-labels-first-batch-rationale.md:518-519`; `src/scoring/archetype-sweep.test.ts:20-77`.
   - Impact: The rationale document says `right-wing-populism`/`ethnonationalist` is documented in `NEAR_TIE_EXCEPTIONS`, but the inspected exception table contains no such entry. Future calibration work may rely on the wrong source of truth.
   - Fix suggestion: As the approved execution patch, remove the `right-wing-populism` near-tie count and bullet from the docs if the post-approval test run passes with the current exception table. Keep `market-liberal` and `minarchist` wording intact except for grammar/count changes.

## Recommendations
1. Approve the architecture with a watch note for stale baseline handling, not as a literal instruction to create already-present label/test changes.
2. On execution, re-read the three files first and protect concurrent/user work. If the current source remains as inspected, the likely product-code delta is documentation cleanup only.
3. Run `npm run test` only after explicit execution approval and use it as the sole authority for whether a `right-wing-populism` exception must be restored.
4. Keep the docs rationale semantically narrow: positive `anti-domination` means anti-elite and anti-technocratic domination, not rejection of hierarchy as such; positive `liberty-noninterference` means in-group personal-freedom rhetoric, not liberal universalism.
5. Preserve all unrelated near-tie exceptions exactly, especially `market-liberal` -> `classical-liberalism` and `minarchist` with both allowed ties.

## Architectural Status
WATCH

## Code Review Recommendation
COMMENT

## Trade-offs
| Option | Benefit | Cost / risk | Review position |
|---|---|---|---|
| Targeted centroid/final-state docs cleanup | Small blast radius, keeps scorer stable, fixes semantic separator from ethnonationalist | Baseline drift means the final diff may not match the artifact literally | Preferred, with current-baseline handling |
| Keep the near-tie narrative | Avoids claiming resolution before validation | Conflicts with the current test table and leaves docs stale if tests pass | Reject unless post-approval tests fail and force restoration |
| Broader scoring or question-bank change | Could address deeper under-weighting of populist separators | High methodology risk, outside requested files, harder to review | Reject for this task |
| Treat anti-domination as negative for right-wing populism | Maintains authoritarian semantic purity | Recreates the ethnonationalist ambiguity and misses anti-elite rhetoric | Not preferred; synthesis is moderate positive with narrow rationale |
