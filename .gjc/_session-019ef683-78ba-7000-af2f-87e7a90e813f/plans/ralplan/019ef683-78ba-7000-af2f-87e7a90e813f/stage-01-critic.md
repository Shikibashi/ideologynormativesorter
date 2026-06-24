**OKAY**

**Justification**: The combined Planner+Architect handoff is actionable after approval. Planner principles/options are consistent with the requested narrow calibration: data-only centroid final state, conditional RWP exception absence validated by full scoring pipeline, docs synced, no scorer/questions/fixtures changes. Architect correctly flags baseline drift: current source already has RWP liberty and anti-domination at 0.3, and test already lacks RWP exception; docs no longer list RWP near tie, though two rationale rows still need planned wording cleanup. This is a WATCH note, not a blocker, because plan sequencing requires re-read and acceptance can be executed as final-state criteria. Verification steps are concrete and permitted only after approval: npm run test, npm run lint, npm run build.

**Summary**:
- Clarity: Clear file boundary and exact RWP axis targets. The only ambiguity is baseline wording that describes already-satisfied code/test changes; Architect resolves it by instructing current-baseline-aware execution.
- Verifiability: Strong. Acceptance criteria are observable in `labels.ts`, `archetype-sweep.test.ts`, docs, and the three named npm commands. No validation gates were run during critique.
- Completeness: Complete for target scope. It covers data values, exception state, unrelated exception preservation, docs rationale, diff inspection, and fallback if `npm run test` fails after approval.
- Big Picture: Fits calibration architecture by using the existing archetype sweep rather than altering scoring weights or fixtures.
- Principle/Option Consistency: Preferred Option A follows principles 1-5; Option B and C are fairly rejected against explicit target and blast-radius constraints.
- Alternatives Depth: Adequate for short-mode narrow fix. A current-baseline/no-op-code variant is not named as an option, but Architect covers it sufficiently for execution.
- Risk/Verification Rigor: Risks are concrete and mitigations map to actions: restore only RWP exception if pipeline fails, preserve market/minarchist exceptions, avoid unverified margin claims, run test/lint/build after approval.

**Referenced source checked**:
- `src/data/labels.ts`: current `right-wing-populism` centroid already has `liberty-noninterference: 0.3` and `anti-domination: 0.3`; `ethnonationalist` remains distinct at `-0.4` and `-0.6`.
- `src/scoring/archetype-sweep.test.ts`: no `right-wing-populism` exception exists; `minarchist` still includes both `civil-libertarian-cosmopolitan` and `classical-liberalism`; `market-liberal` still ties only with `classical-liberalism`.
- `docs/ideology-labels-first-batch-rationale.md`: intro and near-ties section currently list only market-liberal/classical-liberalism plus minarchist note; RWP centroid values are already 0.3/0.3 but planned rationale wording still differs and remains a valid docs edit.

**Representative implementation simulation**:
1. Re-reading `labels.ts` before editing yields final values already present; executor should make no labels diff unless values changed concurrently.
2. Re-reading `archetype-sweep.test.ts` yields RWP exception already absent; executor should preserve existing unrelated exceptions exactly.
3. Updating docs can be done by replacing the two RWP rationale rows with the planned scoped wording and leaving the near-ties count/state aligned with the final test exception state.

**Required Planner revision**: None. Optional cleanup only: restate acceptance as final-state rather than requiring a literal two-value diff, to reduce baseline-drift confusion.
