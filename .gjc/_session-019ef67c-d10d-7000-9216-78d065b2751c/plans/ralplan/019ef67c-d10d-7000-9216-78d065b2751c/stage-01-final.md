# Pending approval plan: right-wing-populism centroid near-tie fix

Status: pending approval. No product source changes have been made under this ralplan run.

## Consensus receipts

- Planner: `/var/home/tcs/Code/ideologynormativesorter/.gjc/_session-019ef67f-6b60-7000-a607-fa8ba1c9d2d7/plans/ralplan/019ef67f-6b60-7000-a607-fa8ba1c9d2d7/stage-01-planner.md`, sha256 `378ce272755a3d6926c2bfffe116f77be782988f83d407fa16eeaf9d967b7d1b`, subagent `18-CentroidNudgePlanner`.
- Architect: WATCH / COMMENT, `/var/home/tcs/Code/ideologynormativesorter/.gjc/_session-019ef681-5bec-7000-9d19-839bcb315508/plans/ralplan/019ef681-5bec-7000-9d19-839bcb315508/stage-01-architect.md`, sha256 `e7b7bbb0681ce283c9e623364f4d3387389ce20ab5a1eaffabd76da90c0d5321`.
- Critic: OKAY, `/var/home/tcs/Code/ideologynormativesorter/.gjc/_session-019ef683-78ba-7000-af2f-87e7a90e813f/plans/ralplan/019ef683-78ba-7000-af2f-87e7a90e813f/stage-01-critic.md`, sha256 `b1331e7f9bc1090e92f091964f6dbc45f74a4690620060adf3771d180b2005c8`.

## RALPLAN-DR summary

### Principles

1. Make the smallest data change that resolves the documented ambiguity.
2. Let the actual scoring pipeline, not axis-sign intuition, decide whether the near-tie exception can be deleted.
3. Preserve unrelated documented exceptions and comments unless directly affected.
4. Keep documentation synchronized with shipped centroid values and exception state.
5. Avoid methodology drift: no scorer, question-bank, fixture-generation, UI, or alias-rendering changes.

### Decision drivers

1. `right-wing-populism` should self-resolve as nearest label after the two-value nudge.
2. The centroid semantics must remain honest: personal liberty and anti-elite anti-domination, not a distorted ideology centroid.
3. Blast radius should stay limited to three files.

### Options considered

#### Option A: targeted centroid nudge plus conditional exception removal — chosen

Pros: implements the requested values, addresses the near-tie at the data source, leaves scoring logic stable, and lets tests verify exception removal. Cons: if scoring still near-ties, the exception must stay documented.

#### Option B: keep the centroid and retain the exception

Pros: zero behavioral risk. Cons: fails the stated objective to fix the documented right-wing-populism / ethnonationalist near-tie.

#### Option C: change scoring weights, fixtures, or broader nationalist centroids

Pros: could address deeper calibration density. Cons: broad methodology drift outside this narrow fix; invalid for this task.

## Approved implementation scope after explicit execution approval

### `src/data/labels.ts`

In the `right-wing-populism` centroid, change exactly these two values:

- `liberty-noninterference: -0.1` -> `0.3`
- `anti-domination: -0.2` -> `0.3`

Do not alter other centroid values, label metadata, label descriptions, aliases, families, ordering, or neighboring labels.

### `src/scoring/archetype-sweep.test.ts`

After the centroid update, tentatively remove only the `right-wing-populism` near-tie exception for `ethnonationalist` and its directly attached explanatory comment. Keep:

- `market-liberal` -> `classical-liberalism` near-tie exception.
- `minarchist` exception including `civil-libertarian-cosmopolitan` and `classical-liberalism`.

If `npm run test` proves the right-wing-populism archetype still needs the exception, restore only that exception/comment and update docs to keep the caveat honest.

### `docs/ideology-labels-first-batch-rationale.md`

Update the rationale document to match the final verified state:

- Change the right-wing-populism table rows:
  - `liberty-noninterference | 0.3 | Non-interference positive (pos) — anti-elite personal freedom rhetoric within a bounded national community.`
  - `anti-domination | 0.3 | Unaccountable power suspect (pos) — anti-elite and anti-technocratic domination, not ethnonational hierarchy acceptance.`
- Remove the right-wing-populism / ethnonationalist documented near-tie only if the test exception is removed and tests pass.
- Preserve the market-liberal / classical-liberalism rationale as an intentional near-tie.
- Preserve the minarchist note unless a separate validated change proves it obsolete.
- Do not copy external ideology descriptions or rewrite the 15 label descriptions.

## Verification after implementation approval

Run, in order:

1. `npm run test`
2. `npm run lint`
3. `npm run build`

Expected result: tests pass; lint is clean; build succeeds, allowing only the pre-existing chunk-size warning if unchanged. Final diff should be limited to the three files above.

## Acceptance criteria

- Exactly two `right-wing-populism` centroid values change: `liberty-noninterference` and `anti-domination`, both to `0.3`.
- No scoring algorithm, fixture-generation, question, module, UI, type, alias-rendering, or unrelated centroid changes are present.
- The RWP/ethnonationalist exception is removed only if the actual scoring pipeline passes without it.
- The market-liberal/classical-liberalism exception remains documented and retained.
- The minarchist/classical-liberalism exception remains retained unless direct validation proves otherwise.
- Documentation reflects the verified exception state without overstating unverified numeric margins.
- `npm run test`, `npm run lint`, and `npm run build` pass after execution.

## ADR

### Decision

Use the targeted two-axis right-wing-populism centroid nudge, then remove the right-wing-populism / ethnonationalist near-tie exception only when the real archetype sweep passes without it.

### Drivers

- The requested values better represent right-wing populism as personal-liberty rhetoric plus suspicion of dominant elites, rather than generalized suspicion of the people.
- The change separates right-wing populism from ethnonationalism without distorting market-liberal, classical-liberalism, minarchist, or broader nationalist centroids.
- The risk profile is low when guarded by the existing archetype sweep and full validation gates.

### Alternatives considered

- Retain the current exception without changing centroid values: rejected because it leaves the documented issue unresolved.
- Broaden the fix into scoring weights, fixtures, or additional centroids: rejected because it would conflate a narrow data correction with methodology change.

### Why chosen

The two-value nudge is the smallest semantically defensible intervention that can resolve the known near-tie while preserving the integrity of other ideology centroids and documented exceptions.

### Consequences

- If validation confirms self-resolution, the code and docs no longer need the RWP/ethnonationalist exception.
- If validation does not confirm self-resolution, the centroid nudge can still stand while the exception remains documented honestly.
- The implementation remains a small, reviewable three-file patch.

### Follow-ups

None required for this narrow fix. Broader calibration density work should be planned separately.
