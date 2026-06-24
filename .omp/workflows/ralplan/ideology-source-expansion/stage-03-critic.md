# Critic Review: Ideology Source Expansion — Stage 03

**Critic:** Independent quality review
**Plan:** `.omp/workflows/ralplan/ideology-source-expansion/stage-01-planner.md`
**Architect Review:** `.omp/workflows/ralplan/ideology-source-expansion/stage-02-architect.md`
**Spec:** `.omp/workflows/deep-interview/ideology-source-expansion.md`
**Status:** **ITERATE** — 3 blocking issues, 3 warnings, 2 observations

---

## Summary

The plan is structurally sound (correct files, correct patterns, sensible ordering of work) and the architect's analysis correctly identifies the three primary blockers. My critique independently validates the architect's findings, adds additional uncovered gaps, and provides concrete remediation criteria.

---

## 1. Spec Constraint Coverage

| Spec Constraint | In Plan? | Assessment |
|---|---|---|
| Curated backlog as source boundary | ✅ | Non-Goals, Steps 1-2 reference backlog |
| High-confidence P1 gaps only | ⚠️ | Step 1 lists 23 as independent, but objective says ~18; unresolved scope mismatch (see B-1) |
| No wholesale Polcompball/Philosophball import | ✅ | Non-Goals |
| Full 26-axis centroid per label | ✅ | Step 2 requires centroid; every axis required |
| Baseline archetype/calibration coverage | ✅ | Steps 4-5 |
| Dense clusters get extra fixtures | ✅ | Step 4 mentions clusters; Step 5 near-tie registration |
| P2 aliases by default; module-resolved only with evidence | ✅ | Step 3 aliases only; Non-Goals defers module outcomes |
| Module-resolved P2 requires reachable trigger | ❌ | Architect BLOCKING-2: no module-trigger impact analysis for new P1 labels |
| Failed P1 → P2 downgrade or defer with rationale | ⚠️ | Step 1 mentions downgrade/defer but only 2 of 25 have explicit decisions; rest pre-judged independent |
| Do not weaken existing validation | ✅ | Principle 2; verification plan references invariants |
| Candidate independence requires distinct centroid + validation | ❌ | Step 1 pre-declares 23 independent without centroid measurement (Architect BLOCKING-1) |

**Verdict:** 8/10 constraints addressed. Two spec-required operationalizations are absent: module-trigger impact (BLOCKING-2) and the centroid-revision loop (BLOCKING-3).

---

## 2. Verification Concreteness and Testability

### Strengths
- Every verification command is a concrete `vitest run` invocation — no hand-wavy "run tests."
- The anti-drift guard (`every label has a calibration archetype`) in the existing sweep test is explicitly referenced.
- The plan acknowledges the existing `NEAR_TIE_EXCEPTIONS` pattern and defers registration until after actual sweep runs.

### Gaps

**V-1: Missing module-trigger verification.**
Adding 23 labels to `labels.ts` changes the label-space landscape for `factionModules.ts`. For example:
- `Eco-Authoritarianism` and `Eco-Fascism` — do they trigger the `authoritarian-faction-module`? The `triggerLabelIds` includes `technocratic-centralist` and `national-traditionalist` — neither matches these eco-authoritarian labels. But should they? If a user labeled Eco-Authoritarian takes the authoritarian module, do the subtype resolution results make sense?
- `Hindutva`, `Religious Nationalism`, `Zionism` — do they trigger any module? None of the existing `triggerLabelIds` will match them (unless family-based matching exists elsewhere).
- `Cyberocracy`, `Accelerationism` — the `technocracy-faction-module` triggers on `technocratic-centralist`; these new labels won't trigger it. Is that intended?

The verification plan must include a check that every new label's module-trigger behavior is documented and correct.

**V-2: "Manual check" is underspecified.**
Step 4 says "manually verify that centroid-aligned fixtures resolve to the correct label. If they near-tie, register NEAR_TIE_EXCEPTIONS." This should be tightened: "For each cluster's fixtures, run `npx vitest run src/scoring/archetype-sweep.test.ts -t <targetLabel>` and document the top-3 nearest labels and confidence margins."

**V-3: No verification for the `labelById` map.**
The architect's WARNING-3 identifies this: `labelById` must be regenerated after adding labels. The data validity test checks structural integrity but doesn't explicitly verify `labelById` has all new entries. Plan Step 6 should add `labelById` verification.

---

## 3. Risk Identification and Mitigations

### Risks the plan addresses well:
- **Centroid overfitting** — mitigation: manual per-axis review and cross-validation
- **Validation invariant weakening** — hard constraint stated
- **Family/subfamily fragmentation** — reuse convention stated
- **Rollback plan** — clear revert path defined

### Risks the plan misses (shared with architect):

**R-1: Batch failure risk (architect's strongest antithesis).**
Adding 23 labels before running the sweep means simultaneous multi-label failures. Plan provides no triage protocol. The architect's failure-triage rules (check margin, check tying label, check question-bank coverage, default to downgrade) should be adopted.

**R-2: Fixture generation loses gradient (architect §2 tradeoff tension).**
`createCentroidAlignedFixture` uses `Math.sign(avg) * 3`, which is a ternary mapping (+3, 0, -3). Two labels differing by 0.3 on an axis but sharing sign per weighted average produce identical fixture responses. The fixture system only tests separation along well-weighted dimensions. The plan should systematically check which distinguishing axes for the 23 new labels are well-covered vs. poorly-covered by the existing question bank before committing centroids.

**R-3: Module behavior change from new labels.**
No module-trigger analysis means silent changes to `FactionModule` reachability once labels exist in the lookup map.

### Risk I add beyond the architect:

**R-4: Backlog scope drift.**
The plan lists 23 labels as independent P1 candidates (Step 1 table). But the interview spec named exactly 25 missing P1 names (listed at spec §117). Some labels in the backlog (e.g., Distributism, Classical Liberalism, Ordoliberalism, Communitarianism, Republicanism, etc. — lines 25-37 of the backlog) are also P1 but were NOT among the 25 interview-identified missing names. The plan's Step 1 list matches the interview-identified 25 (minus Libertarian Municipalism and Fourth Theory), which is correct for the first pass. However, the objective's "~18 independent labels" introduces an unresolved scope compression. This must be resolved: either the pass targets all 23 as independent, or 5 are explicitly downgraded with rationale.

**R-5: Deferral documentation is empty.**
Step 1 says deferrals are "to be determined during centroid seeding review" with no criteria for when deferral vs. downgrade applies. The spec distinguishes: downgrade = P2 under a sensible parent; defer = P2 under NO sensible parent (with rationale). The plan needs decision criteria for this fork before execution.

---

## 4. Work Decomposition (Smallest-Safe Steps)

### Current decomposition:
8 sequential steps with 23 labels created in bulk (Step 2), then fixtures generated (Step 4), then sweep run (Step 5). This is a **big-bang integration model** — maximum batch size before the first validation signal.

### Architect's recommendation:
A wave-based cluster-then-sweep model. I **strongly endorse** this recommendation. The plan should be restructured as:

1. **Wave 1 — Distant anchors** (5-6 labels from sparse families: Panarchism, World Federalism, Indigenism, Guild Socialism, Multiculturalism, Cyberocracy) → add → sweep → confirm pipeline works
2. **Wave 2 — By-family clusters** (6-8 labels per cluster: green/eco, nationalist, authoritarian) → add cluster → sweep → document near-ties per cluster
3. **Wave 3 — Borderline candidates** (remaining: Democratic Confederalism, Paleoconservatism, One-Nation Conservatism, Islamic Democracy, Liquid Democracy, Accelerationism, Juche, Techno-Anarchism) → add → sweep → apply downgrade/defer escape hatch at this point
4. **Wave 4 — P2 aliases + doc + final verification**

This sequence:
- Gives earliest possible validation signal (Wave 1)
- Isolates near-tie discovery within clusters (Wave 2)
- Defers downgrade decisions until measured evidence exists (Wave 3)
- Makes rollback per-wave instead of per-23

### Additional decomposition gap:
**Deferral decisions are deferred.** The criteria for "is this a downgrade vs. deferral?" are not stated. The spec says downgrade = P2 under a sensible parent; defer = no sensible parent exists. The plan should define "sensible parent" (same family? same axis profile?) before execution.

---

## 5. Edge Case Coverage

### Downgraded P1s
- Libertarian Municipalism → P2 alias under Democratic Confederalism ⚠️ *Good, but single candidate only*
- Fourth Theory → "downgrade to P2 alias under Integralism or defer" ⚠️ *Ambiguous — two parent candidates, no resolution rule*
- **Missing:** The architect's WARNING-2 notes the Fourth Theory rationale cites THREE possible parents without resolving which one

### Deferred candidates
- **No deferred candidates are named in Step 1** beyond "to be determined during centroid seeding review"
- Missing: explicit criteria for when deferral is chosen over downgrade
- Missing: documentation format/template for deferral rationale

### Other edge cases the plan misses:

**E-1: Module question fixture dependency.** If a new label's distinguishing axis is only covered by module questions (not base questions), `createCentroidAlignedFixture` will never detect that axis — it only iterates base `questions`. Labels whose distinctiveness relies on module-covered axes will systematically fail the sweep. None of the 23 candidates have been checked for this.

**E-2: Eco-Fascism vs. Eco-Authoritarianism vs. Fascist-Authoritarian.** The plan's Open Question 2 notes this but doesn't resolve it. If Eco-Fascism near-ties with both Eco-Authoritarianism and Fascist-Authoritarian, the 3-way tie needs explicit exception registration.

**E-3: Democratic Confederalism vs. Guild Socialism.** Open Question 3 — both are listed as independent but may be indistinguishable in 26-axis space. The plan acknowledges this as an open question but has no decision rule.

**E-4: Family proliferation side-effects.** `indigenist` (new family) and `democratic-confederalist` (potentially new family) could affect `buildResultProfile` family-tree rendering if it uses string matching. The plan should verify this before introducing new families.

---

## 6. Verdict on Architect's Blocking Flags

| Flag | Valid? | Severity |
|---|---|---|
| BLOCKING-1: 23 vs ~18 contradiction | ✅ **Valid** — objective and Step 1 contradict | Critical — makes scope unbounded |
| BLOCKING-2: No module-trigger impact analysis | ✅ **Valid** — labels change module landscape silently | Critical — can cause silent behavioral regression |
| BLOCKING-3: No centroid revision loop | ✅ **Valid** — plan offers exception vs downgrade, never revision | High — incentivizes quality degradation |

All three architect-identified blockers are independently validated by this review. They must be resolved before approval.

### Architect's Warnings

| Warning | Valid? | Assessment |
|---|---|---|
| W-1: Family fragmentation | ⚠️ **Yes** — low severity, plan acknowledges reuse convention | Accept if `buildResultProfile` verified |
| W-2: Fourth Theory parent ambiguity | ✅ **Yes** — three possible parents, no resolved name | Must fix for ITERATE |
| W-3: `labelById` map completeness | ✅ **Yes** — easy to miss, easy to fix | Must fix for ITERATE |
| W-4: Module question fixture dependency | ✅ **Yes** — systematic sweep failure if label depends on module-covered axes | Must fix for ITERATE |

---

## 7. Final Verdict

### ITERATE

The plan is well-structured and uses the right codebase patterns. But three blocking issues and several uncovered gaps prevent approval.

### Must fix before re-review:

1. **Resolve scope contradiction.** Objective must match Step 1. Either commit to ~18 independent labels with 5 explicitly named downgrades, or commit to 23 with rationale for each.

2. **Add module-trigger impact analysis.** Audit each proposed label against `factionModules.ts` `triggerLabelIds` and `subtypeLabelIds`. Document which modules trigger (or don't) for each new label and whether the behavior is correct.

3. **Add centroid revision loop.** Define: if sweep fails with margin > 0.05, revise centroid and re-test before reaching for exception registration.

4. **Adopt wave-based cluster-then-sweep execution.** Replace the 23-label bulk add with 3 waves (distant anchors → family clusters → borderline) with sweep after each wave.

5. **Define deferral criteria and Fourth Theory parent resolution.** "Sensible parent" must be operationalized.

6. **Add failure-triage rules** (adopt architect's four-step protocol).

### Should fix:

7. Tighten "manual verification" to specific test commands.
8. Add `labelById` completeness check to Step 6 verification.
9. Check module-question fixture coverage for each new label's distinguishing axes.
10. Verify `buildResultProfile` family-tree rendering compatibility with new families.
11. Resolve Open Questions 2-4 (Eco-Fascism parent, DemConf/Guild separate, DemConf family value).

---

*Critic review written 2026-06-23. Plan status: pending iteration.*
