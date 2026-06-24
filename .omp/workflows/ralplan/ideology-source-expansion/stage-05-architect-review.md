# Architecture Re-Review: Ideology Source Expansion — Stage 05

**Reviewer:** Architect (re-review pass)
**Plan under review:** `.omp/workflows/ralplan/ideology-source-expansion/stage-04-revision.md`
**Prior review:** `.omp/workflows/ralplan/ideology-source-expansion/stage-02-architect.md` (APPROVE WITH BLOCKING FLAGS)
**Date:** 2026-06-23
**Status:** APPROVE (with advisory notes for execution)

---

## 1. Blocker Resolution Audit

### BLOCKING-1: 23 vs ~18 scope contradiction

**Original finding:** Objective claimed "~18 independent P1 labels" but Step 1 listed 23 candidates as independent. The plan could not explain which 5 would be downgraded, making the scope unbounded.

**Revision resolution (§1, §2):** Wave-based cluster-then-sweep execution. All 23 candidates are processed, but independence is determined by measured sweep results, not pre-declaration. The count emerges from measurement.

**Assessment: RESOLVED.** The contradiction evaporates because the plan no longer pre-declares an independence count. The wave structure (§1) processes each candidate through a sweep gate. Labels that fail are downgraded or deferred with rationale. The scope boundary is now "process these 25 entries" (23 P1 candidates + Fourth Theory pre-resolved to P2 + a conditional Paleolibertarianism-adjacent entry), with the independence count being an output, not an input.

**Audit trace:**
- Wave 1: 6 distant anchors — high probability of clean pass → independent
- Wave 2a-c: 9 family-clustered labels — expected near-ties, documented per cluster
- Wave 3: 10 borderline candidates — failure-triage protocol applied, downgrade/defer as needed
- Wave 4: P2 aliases added mechanically after sweep evidence exists

The plan could be clearer about the arithmetic (25 listed entries vs. 23 P1 candidates), but since the wave model makes exact counts advisory, this does not affect architectural soundness. I recommend the execution phase begin the plan document with a concise candidate accounting: "25 entries considered: 23 P1 candidates + Fourth Theory (pre-resolved to P2) + Paleolibertarianism-adjacent (conditional)."

---

### BLOCKING-2: No module-trigger impact analysis

**Original finding:** Adding 23 labels changes the label-space landscape for `factionModules.ts`. No analysis existed of which existing modules' `triggerLabelIds` or `subtypeLabelIds` would match new labels.

**Revision resolution (§6):** Comprehensive 23-row table auditing each new label against existing module triggers.

**Assessment: RESOLVED.** The table is thorough and honest:

- **21 of 23 labels assessed as "Safe — no silent behavior change"** because no existing `triggerLabelIds` list includes them.
- **2 flagged as "Unlikely module match, but verify during sweep"** (nationalist-faction-module for Hindutva, Religious Nationalism, Zionism — and technocracy-faction-module for Cyberocracy, Accelerationism). These are correctly identified as borderline cases where the centroid might be close enough to an existing trigger label to produce false `suggestModules` results.
- **Conclusion correctly identifies the gap:** `triggerLabelIds` won't false-trigger, but `suggestModules` (which performs label-based filtering) could. The verification plan (§7) calls for testing this.

**Structural soundness check:** The analysis is correct about the namespace separation between `triggerLabelIds` (exact match) and `suggestModules` (heuristic proximity). The verification plan's remediation — "run `buildResultProfile` with centroid-aligned fixture and inspect `moduleSuggestions`" — is the right approach because it exercises the full suggestion pipeline end to end.

**One advisory note:** The verification should define "false-positive" concretely before execution. Suggested criteria:
  - A module is a false-positive if it appears in `moduleSuggestions` for a label whose family is not the module's target family AND the user would not plausibly want that module's subtype questions.

---

### BLOCKING-3: No centroid revision loop

**Original finding:** The only paths for sweep failure were "register exception" or "downgrade to P2." No mechanism existed to revise a poorly-seeded centroid and re-test — incentivizing exception registration over label quality.

**Revision resolution (§5):** Failure-triage protocol with 4-step decision tree and up to 2 centroid revision iterations.

**Assessment: RESOLVED.** The protocol is well-structured:

| Step | Condition | Action |
|------|-----------|--------|
| 1 | Margin > 0.05 | Revise centroid, re-run sweep (up to 2×) |
| 2 | Tie with same-wave label | Investigate separation, consider merge/downgrade |
| 3 | Weak question-bank coverage on distinguishing axes | Register near-tie exception with root cause note |
| 4 | None of the above resolves | Downgrade to P2 alias under sensible parent |

**Additional elements that satisfy the original concern:**
- **Deferral criteria (§5):** Distinct from downgrade. Named condition: "NO sensible parent exists." Rationale must name considered-and-rejected parent labels. Deferred candidates recorded in backlog with status.
- **Fourth Theory resolution (§5):** Explicitly resolved as P2 alias under Integralism with rationale. This was WARNING-2 from the prior review.
- **Bound on loop iterations:** 2 revision attempts bound the quality-vs-time tradeoff, preventing infinite revision.

The protocol is complete and structurally sound. It preserves the spec's requirement that every independent label have a distinct centroid, while allowing the revision loop to fix seeding errors before reaching for exception registration.

---

## 2. Prior Warning-Level Issues

### W-1: Family fragmentation (`indigenist`)
**Revised plan response (§4):** Notes the risk, flags `buildResultProfile` verification, and offers contingency (existing family or mapping guard).

**Assessment: RESOLVED with timing concern.** The verification must happen **before** Wave 1 executes, since Indigenism is in Wave 1 (distant anchors). If `buildResultProfile` string-matches on family names, Indigenism would break before any other label is added. This is covered in the advisory notes below but does not block approval.

### W-2: Fourth Theory parent ambiguity
**Revised plan response (§5, §9):** Explicitly resolved as P2 alias under Integralism with rationale.

**Assessment: RESOLVED.** Documented rationale: "anti-liberal, anti-communist, anti-fascist framing is closest to Integralism's Catholic-integralist structure." If sweep shows no clean separation, downgrade with rationale.

### W-3: `labelById` map completeness
**Revised plan response (§7):** Explicit verification step: assert that each new wave's IDs exist in the `labelById` map.

**Assessment: RESOLVED.** Concrete code provided in verification plan.

### W-4: Module-question fixture dependency
**Revised plan response (§9, Q5):** Notes that distinguishing axes must be covered by base questions, not exclusively module questions. Labels dependent on module-covered axes should be flagged.

**Assessment: PARTIALLY RESOLVED.** The plan acknowledges the issue but does not mandate a specific pre-commit check. The current resolution is "verify during centroid assignment and note in documentation." Given that:
- The 23 candidates are from established political ideologies with broad question-bank coverage
- Base questions cover all 26 axes (module questions add *weight*, not exclusive coverage)
- The centroid revision loop provides a fallback if sweep fails due to insufficient axis weight

...this is acceptable for approval. I recommend the execution phase add a concrete check: "Before committing a centroid, identify the 3-5 most distinguishing axes and confirm each has at least one base question with non-zero `axisWeights`."

---

## 3. Wave-Based Execution Model — Architectural Soundness Review

### Model Overview

```
Wave 1 (6 anchors) ──blocking gate──→ Wave 2a (3 eco) → Wave 2b (3 nationalist)
                                           → Wave 2c (3 authoritarian)
                                             └─→ Wave 3 (10 borderline)
                                                    └─→ Wave 4 (aliases + verify)
```

### Wave 1: Distant Anchors — Panarchism, World Federation, Indigenism, Guild Socialism, Multiculturalism, Cyberocracy

**Evaluation: Sound.** These labels inhabit sparse family space (anarchist, liberal, indigenist, socialist, technocratic) where few existing neighbors exist. High probability of clean sweep. If they pass, the fixture pipeline is validated. If they fail, the issue is mechanistic (centroid seeding or fixture generation) and fixable before 15+ more labels depend on it.

**Gate structure:** "Wave 1 must pass before Wave 2 begins." This is a correct fail-fast gate. If Wave 1 has *systemic* failures (all 6 labels fail similarly), the issue is not individual centroids but the fixture pipeline definition (`createCentroidAlignedFixture` behavior, question-bank coverage, or the sweep test's baseline assumptions). The plan's "pause and fix" response for this case is appropriate but undefined — see advisory notes.

### Wave 2: Family Clusters — 3 sub-clusters (eco, nationalist, authoritarian)

**Evaluation: Sound.** Clustering by family so near-ties surface within the group is the right approach. Each sub-cluster is 3 labels, small enough that failure analysis is tractable. Running the sweep after each sub-cluster (not after all 9) keeps the isolation benefit.

The plan correctly anticipates near-ties within clusters and commits to documenting them per cluster with rationale.

### Wave 3: Borderline Candidates — 10 labels

**Evaluation: Sound with minor structural looseness.** The flat list of 10 labels is less structured than Wave 2's sub-clusters. Some candidates (Democratic Confederalism, Liquid Democracy) share the `democratic` family but aren't sub-clustered. This is acceptable because:
- These are genuinely borderline labels where sweep behavior is less predictable
- The failure-triage protocol (§5) provides clear escape paths
- Sub-clustering 10 heterogeneous labels would be artificial

### Wave 4: P2 Aliases, Documentation, Final Verification

**Evaluation: Sound.** The P2 alias table (§3) is pre-verified. The verification suite (§7) is comprehensive. The wave ordering correctly defers alias creation until after sweep evidence exists for their parent labels.

### Gate Dependencies

```
None → Wave 1 → Wave 2a → Wave 2b → Wave 2c → Wave 3 → Wave 4
```

The serial chain is correct. Each wave's labels must exist in `labels.ts` before the next wave's labels can be checked for same-wave near-ties. The per-wave rollback (revert labels + targetIds + exceptions) is independently executable.

---

## 4. Structural Risks and Mitigation Assessment

| Risk | Malignancy | Plan Mitigation | Adequate? |
|------|-----------|----------------|-----------|
| Centroid overfitting | Inaccurate labels | Manual per-axis review + cross-validation | Yes — best available without sweep data |
| Validation invariant weakening | Silent quality loss | Hard constraint: downgrade instead of weakening | Yes |
| Module false-positive | Wrong subtype questions | §6 table + integration test in §7 | Yes — with execution-phase clarification |
| Family fragmentation | Display/crash bug | `buildResultProfile` verification before `indigenist` | Advisory — must be pre-Wave-1 |
| Batch failure (original blocker) | Unrecoverable state | Wave isolation + per-wave sweep | Yes — resolved |
| Poor centroid seeding (original blocker) | Sweep failures | Revision loop (§5) | Yes — resolved |
| Multi-label near-tie | Test noise | Per-cluster exception documentation | Yes — resolved |

---

## 5. New Issues Introduced by the Revision

### N1: Wave 1 "pause and fix" is underspecified (Warning-level)

§1 states: "If Wave 1 systemic failures indicate a fixture mechanism problem, pause and fix before proceeding." This is architecturally correct as a gate, but "pause and fix" is vague about:
- Who determines it's a "fixture mechanism problem" vs. individual centroid seeding errors?
- What is the escalation path for fixture mechanism bugs (is this a blocker for the whole expansion pass)?
- How long should "pause" last before the plan escalates or re-scopes?

**Recommendation for execution phase:** Before Wave 1 begins, define a concrete triage path for systemic failure:
1. If ≥3 of 6 Wave 1 labels fail with margin > 0.05 → inspect `createCentroidAlignedFixture` mapping for consistent bias (e.g., question-bank axis weights are systematically low for those families).
2. If the fixture generator is confirmed biased → file an issue for the scoring system and re-scope Wave 1 to the labels that pass; proceed with a reduced pass.
3. If the fixture generator is correct → individual centroid revision via §5.

### N2: No automated centroid sanity check (Warning-level)

23 labels × 26 axes = 598 axis values to manually review. The plan relies entirely on manual "sign consistency" and "plausibility" checks. No automated sanity check is described (e.g., "verify centroid is within 2 standard deviations of family centroid mean" or "verify no axis value exceeds family bounds").

**Recommendation for execution phase:** Add a lightweight automated check:
```
For each new label's centroid:
  - Compute L2 distance to each existing label in the same family/subfamily
  - Flag if nearest same-family label is farther than nearest different-family label (suggests wrong family)
  - Flag if any axis exceeds the family's observed range by >50%
```

### N3: Question-bank coverage check not systematized

§9 Q5 correctly identifies the module-question fixture dependency risk but resolves it with a documentation note rather than a mandatory pre-commit check. The current check ("verify that distinguishing axes for new labels are covered by base questions") has no assertion boundary.

**Recommendation for execution phase:** Formalize as: "Before committing each wave, list the 3 most distinguishing axes for each label. Run: for each axis, does at least one base question (not module question) have `axisWeights[axis] !== 0`? If not, the label may systematically underperform in the sweep — flag in documentation."

### N4: `suggestModules` false-positive assertion undefined

§7 says "inspect `moduleSuggestions` field" but does not define what constitutes a false-positive or provide an automated assertion.

**Recommendation for execution phase:** Add acceptance criteria to the `buildResultProfile` integration test:
- A new label in family `technocratic` should not trigger `authoritarian-faction-module` suggestions even if its centroid is proximity-close to `technocratic-centralist`.
- A new label in family `nationalist` should not trigger modules outside the nationalist family.

---

## 6. Summary Assessment

### Blocker Closure

| Blocker | Status | Evidence |
|---------|--------|----------|
| B-1: 23 vs ~18 scope contradiction | **RESOLVED** | Wave-based execution makes independence count emergent |
| B-2: No module-trigger impact analysis | **RESOLVED** | §6 comprehensive audit table + integration test |
| B-3: No centroid revision loop | **RESOLVED** | §5 failure-triage protocol with 2-step revision |

### Prior Warnings Closure

| Warning | Status | Evidence |
|---------|--------|----------|
| W-1: Family fragmentation | **RESOLVED** (timing caveat) | §4 flags `indigenist` verification — must be pre-Wave-1 |
| W-2: Fourth Theory parent | **RESOLVED** | §5: P2 alias under Integralism with rationale |
| W-3: `labelById` completeness | **RESOLVED** | §7: explicit verification step |
| W-4: Module-question fixture dependency | **PARTIALLY RESOLVED** | §9 Q5 acknowledges; not formalized as pre-commit check |

### Structural Integrity

The wave-based execution model is architecturally sound. The serial gate chain (Wave 1 → 2a → 2b → 2c → 3 → 4) correctly isolates failure modes and makes each wave independently revertible. The centroid revision loop provides the missing quality iteration path. The module-trigger analysis closes the behavioral regression gap.

### New Advisory Notes (4)

1. **Wave 1 "pause and fix" path needs concrete triage criteria** before execution begins.
2. **Automated centroid sanity check** (family-relative distance bounds) would reduce manual review risk.
3. **Question-bank coverage check** should be formalized as a mandatory pre-commit assertion, not a documentation note.
4. **`suggestModules` false-positive criteria** should be defined before integration testing begins.

These are execution-phase recommendations, not blockers. None of them invalidate the plan's architectural correctness.

---

## 7. Verdict

**APPROVE**

**Rationale:** The revised plan addresses all three blocking architectural issues:
1. Wave-based execution replaces the contradictory "~18 from 23" with an emergent count determined by measurement.
2. Module-trigger impact analysis (§6) provides the missing safety audit.
3. Centroid revision loop (§5) provides the missing quality iteration path.

The prior warnings are resolved. The wave-based execution model is structurally sound, correctly gated, and independently revertible per wave. The four advisory notes document practical execution guidance — they tighten the execution surface but do not invalidate the plan's architecture.

**Pre-condition for execution:** Resolve the `buildResultProfile` family-string-matching check before Wave 1 begins (Indigenism is in Wave 1).

**Next step:** Hand off to the execution phase. Recommended to use ultragoal (4 stories, serially gated) as the plan recommends in §10.
