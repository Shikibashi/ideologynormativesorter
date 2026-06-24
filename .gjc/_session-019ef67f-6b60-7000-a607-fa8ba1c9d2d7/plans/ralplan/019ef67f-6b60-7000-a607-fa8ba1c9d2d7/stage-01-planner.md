# RALPLAN-DR short-mode planner artifact: right-wing-populism centroid near-tie fix

## Summary
Plan a low-risk, pending-approval update limited to `src/data/labels.ts`, `src/scoring/archetype-sweep.test.ts`, and `docs/ideology-labels-first-batch-rationale.md`. The behavioral target is to move only the `right-wing-populism` centroid values `anti-domination: -0.2 -> 0.3` and `liberty-noninterference: -0.1 -> 0.3`, then remove the matching `right-wing-populism` near-tie exception only when the actual scoring pipeline validates that the archetype self-resolves without it.

## In scope / out of scope
In scope:
- Two centroid value changes for `right-wing-populism` in `src/data/labels.ts`.
- Conditional removal of only `NEAR_TIE_EXCEPTIONS["right-wing-populism"]` and its explanatory comment in `src/scoring/archetype-sweep.test.ts`.
- Clean-room rationale updates for the changed axes and the documented near-ties section in `docs/ideology-labels-first-batch-rationale.md`.

Out of scope:
- Any scoring algorithm, fixture-generation, axis-weight, question-bank, family-tree, module, UI, or unrelated centroid changes.
- Removing or weakening the `market-liberal` / `classical-liberalism` exception.
- Removing or weakening the `minarchist` exception with `civil-libertarian-cosmopolitan` and `classical-liberalism` unless separately proven unnecessary by tests in a different approved task.
- Running validation gates during planning.

## Principles
1. Make the smallest data change that resolves the documented ambiguity.
2. Let the scoring pipeline decide whether the near-tie exception can be deleted.
3. Preserve unrelated documented exceptions and their comments exactly unless directly affected.
4. Keep documentation synchronized with shipped centroid values and exception state.
5. Avoid hidden methodology drift: no scorer, question, or fixture edits for this fix.

## Top decision drivers
1. Archetype self-resolution: the `right-wing-populism` fixture should rank itself first after the centroid nudge.
2. Semantic separation: the updated positive `liberty-noninterference` and `anti-domination` values distinguish populist anti-elite rhetoric from ethnonationalist hierarchy acceptance without broadening scope.
3. Blast radius control: only one centroid, one possible exception entry, and one rationale document should change.

## Options considered
### Option A: targeted centroid nudge plus conditional exception removal (preferred)
Pros:
- Directly implements the requested values and addresses the documented near-tie at its source.
- Keeps scoring logic and fixtures stable.
- Allows the test suite to prove whether the exception is obsolete.
Cons:
- May still require retaining the exception if full-pipeline scoring does not self-resolve.
- Documentation must branch based on the verified exception outcome.
Invalidation rationale:
- Invalid only if `npm run test` still shows `right-wing-populism` ranked behind `ethnonationalist` after the two value changes and removal attempt, or if unrelated regressions appear. In that case, keep the centroid nudge but restore the right-wing-populism exception and document it as still necessary.

### Option B: leave centroid as-is and keep/document the near-tie
Pros:
- Zero behavioral risk.
- No chance of accidental downstream label movement.
Cons:
- Does not satisfy the target change.
- Leaves the known ambiguity documented rather than fixed.
Invalidation rationale:
- Invalidated by the explicit requirement to change `anti-domination` and `liberty-noninterference` to `0.3`.

### Option C: alter scoring weights, fixtures, or broader nationalist centroids
Pros:
- Could solve deeper calibration issues if the bank is under-weighting separating axes.
Cons:
- Broad, higher risk, and outside the exact-file planning boundary.
- Would entangle methodology changes with a narrow data nudge.
Invalidation rationale:
- Invalidated by the file-limited request and low-risk planning boundary.

## File-level changes
### `src/data/labels.ts`
- Locate the `right-wing-populism` label entry.
- Change only:
  - `liberty-noninterference`: `-0.1` to `0.3`
  - `anti-domination`: `-0.2` to `0.3`
- Do not alter `ethnonationalist`, `market-liberal`, `classical-liberalism`, `minarchist`, label ordering, descriptions, families, aliases, or any other axis values.

### `src/scoring/archetype-sweep.test.ts`
- After the centroid update, tentatively remove only this exception and its directly attached explanatory comment:
  - `right-wing-populism`: `{ tiesWith: "ethnonationalist", maxMargin: 0.02 }`
- Preserve the `market-liberal` exception for `classical-liberalism` exactly.
- Preserve the `minarchist` exception array including both `civil-libertarian-cosmopolitan` and `classical-liberalism` exactly.
- If `npm run test` proves `right-wing-populism` does not self-resolve without the exception, restore the exception and leave the test file otherwise unchanged.

### `docs/ideology-labels-first-batch-rationale.md`
- Update the introduction so the documented genuine near-tie count no longer lists `right-wing-populism` / `ethnonationalist` if the exception is removed.
- Update the `right-wing-populism` table values and rationales:
  - `liberty-noninterference | 0.3 | Non-interference positive (pos) — anti-elite personal freedom rhetoric within a bounded national community.`
  - `anti-domination | 0.3 | Unaccountable power suspect (pos) — anti-elite and anti-technocratic domination, not ethnonational hierarchy acceptance.`
- Update the `Documented near-ties` section to remove the right-wing-populism bullet only if the test exception is removed.
- Keep the `market-liberal` / `classical-liberalism` bullet and the `minarchist` note intact, with wording adjusted only for grammar if the count changes.

## Sequencing and dependencies
1. Re-read the three target files immediately before editing to avoid overwriting concurrent work.
2. Apply the two centroid value changes in `src/data/labels.ts`.
3. Tentatively remove the right-wing-populism near-tie exception and its comment in `src/scoring/archetype-sweep.test.ts`.
4. Update the rationale document to match the changed centroid and tentative exception state.
5. Run `npm run test`.
6. If the test suite fails because right-wing-populism still needs the exception, restore only that exception/comment and revise the docs to keep the near-tie documented with the new centroid values.
7. Run `npm run lint`.
8. Run `npm run build`.
9. Inspect the final diff to confirm only the three approved files changed.

## Acceptance criteria
- `src/data/labels.ts` changes exactly two `right-wing-populism` centroid values: `anti-domination` to `0.3` and `liberty-noninterference` to `0.3`.
- No other centroid, label metadata, scoring algorithm, fixture, question, module, UI, or type changes are present.
- The right-wing-populism near-tie exception is absent only when `npm run test` passes without it.
- The `market-liberal` / `classical-liberalism` exception remains present.
- The `minarchist` exception remains present and still includes `classical-liberalism`.
- The rationale document reflects the final exception state and changed axis rationales without claiming unverified margins.
- `npm run test`, `npm run lint`, and `npm run build` all pass during implementation after approval.

## Verification
Run these commands after implementation approval, in this order:
1. `npm run test`
2. `npm run lint`
3. `npm run build`

No validation gates were run during this planning step.

## Risks and mitigations
- Risk: The centroid nudge does not fully self-resolve under the actual end-to-end sweep. Mitigation: restore only the right-wing-populism exception and keep docs honest about the remaining near-tie.
- Risk: The nudge affects another label margin unexpectedly. Mitigation: rely on the full `npm run test` sweep before removing any exception.
- Risk: Documentation overstates a resolved margin. Mitigation: avoid numeric margin claims unless produced by the implementation verification run.
- Risk: Unrelated near-tie exceptions are accidentally removed. Mitigation: final diff review must verify `market-liberal` and `minarchist` exceptions are preserved.

## ADR
### Title
Targeted centroid nudge for right-wing-populism versus ethnonationalist near-tie.

### Status
Proposed, pending explicit execution approval and fresh Architect/Critic consensus review.

### Context
Current inspected source shows `right-wing-populism` at `liberty-noninterference: -0.1` and `anti-domination: -0.2`, while `ethnonationalist` is more hierarchy-accepting and bounded-community focused. The archetype sweep currently documents a `right-wing-populism` / `ethnonationalist` near-tie with max margin `0.02`; the rationale doc also lists it as a genuine near-tie.

### Decision
Change only the two requested `right-wing-populism` centroid values to `0.3`, then remove the matching near-tie exception only if the unmodified scoring pipeline passes the sweep without it. Preserve other exceptions.

### Consequences
- If self-resolution succeeds, the code and docs stop carrying the right-wing-populism near-tie as a known exception.
- If self-resolution fails, the new centroid still lands, but the exception remains documented and no false self-resolution claim is made.
- The change remains reviewable as a three-file, data/test-docs-only patch.

## Handoff guidance
- Proceed to fresh Architect review, then fresh Critic review, then stop for explicit approval before implementation.
- Executor is appropriate after approval because this is a bounded three-file edit.
- Team and ultragoal are unnecessary for this low-risk short-mode task unless later bundled into a broader calibration initiative.
