# Stage 03 — Critical Evaluation: Ideology Label Expansion Plan

**Reviewer:** CriticAgent  
**Run ID:** ideology-expansion  
**Date:** 2026-06-24  
**Plan:** stage-01-planner.md  
**Architect Review:** stage-02-architect.md  

---

## Verdict: **REVISE** (2 P0, 3 P1 before execution)

The plan is structurally sound and architecturally verified, but it contains two blocking issues (P0) that must be resolved before execution and three significant issues (P1) that will otherwise cause wasted work or undetected quality problems.

---

## Blocking (P0)

### P0-1: No definition of "done" — 120 labels vs 150 labels vs "need more"

**Where:** Section 1 (Decision Drivers), Section 2.2, Principle 3  
**Evidence:** The plan repeatedly states "32–62 new labels (88 → 120–150 total)" but never defines the minimum viable count or the success gate. The Option A→B fallback governs data-entry scope (whether to skip `philosophyInfluences` on simple labels), not label count. The centroid distinctness filter could cull 10+ candidates. If only 115 labels survive distinctness filtering: is the work complete? What if 118 survive? What if 156 exist in the expanded candidate pool?  
**Why it matters:** Without a clear success criterion, the implementer has no actionable stopping rule. They could over-mine sub-subcategories to inflate the count past 150, or stop at 119 and call it "close enough." The decision about whether to add discriminating questions to the bank (improving resolution) vs. consolidate labels vs. accept fewer labels needs a trigger.  

**Fix required:** Define:
- A **floor** (minimum acceptable label count, e.g. 115) — if distinctness filtering drops below this, expand the candidate pool or add bank items.
- A **target range** (120–150) — if the count lands here with structurally sound centroids and ≤33% near-tie density, it's done.
- A **cap** (e.g. 155) above which the marginal benefit of another label must be demonstrated beyond "it exists on Polcompball."

---

### P0-2: Centroid distinctness evaluated too late in the sequence

**Where:** Section 6 (Sequence & Dependencies), step 1b → 2 → 3  
**Evidence:** The plan's dependency graph runs: type definition → enrich existing + add new labels → add fixtures → run sweep to measure margins → register exceptions. The label count decision (32–62) happens BEFORE any centroid measurement. The sweep test (step 3) is where "oops, this one isn't separable" emerges — but by then the full data entry has been done (~240 field values × 6 fields). The plan's Principle 3 says a label "earns independent status only if its 26-axis centroid is plausibly distinct" but the distinctness check doesn't happen until step 3, after all the labor. If 10–20 candidates collapse into aliases, all those field values are wasted.  
**Why it matters:** Data entry is the dominant cost (~2000+ new lines in labels.ts). Doing a centroid distinctness pre-screen (before full field enrichment) would let the implementer cheaply filter out non-viable candidates, then invest in enrichment only for labels that survive.  

**Fix required:** Insert a pre-screen step between type definition (step 0) and data entry (steps 1a/1b):
- 0a. For each candidate label, derive a coarse centroid estimate (from Polcompball category metadata or manual assignment on a subset of axes).
- 0b. Compute pairwise cosine distances vs the 88 existing centroids.
- 0c. Cull candidates within ≤0.015 of an existing label (downgrade to alias).
- 0d. Only then proceed to full data entry for survivors.

---

## Significant (P1)

### P1-1: No content-accuracy verification — tests validate shape, not truth

**Where:** Section 5 (Validation Tests), Section 8 (Verification Steps)  
**Evidence:** Every validation test in the plan checks **structural** properties: type of field, subset relationship, axis reference validity. Verification step 7 says "spot-check 5 existing labels and 5 new labels in the scoring output for sanity" — "sanity" is undefined and unmeasurable. There is no test or verification step that answers "Is 'Marxism' actually the correct `ethicalTheory` for 'egalitarian-statist'?" or "Are the `descriptivePhilosophies` for this label accurate per Philosophyball scholarship?"  
**Why it matters:** The primary value proposition (per the architect's counterpoint) is user-facing interpretive enrichment. If the data is structurally valid but factually wrong — e.g., "Libertarianism" is listed as `ethicalTheory` for a label whose tradition is actually Virtue Ethics — users get a confidently wrong narrative. This undermines the product value and, worse, the structural tests will all pass.  

**Fix required:** Add a spot-check protocol:
- A `describe('philosophy enrichment accuracy', ...)` block that samples 10–15 diverse labels and programmatically asserts known ground truths (e.g., `'social-democrat'.ethicalTheory` should include `'Social Democracy'`).
- Define a review gate: a human (or documented source reference) must verify the enrichment for 5 labels from different families before the PR is accepted.

---

### P1-2: Polcompball and Philosophyball as unstated live dependencies

**Where:** Section 2.1 (Philosophy Enrichment), Section 2.2 (New Labels)  
**Evidence:** The plan repeatedly references "Polcompball sub-category pages" and "Philosophyball Ethics branch" as data sources — but never describes how these are accessed, whether they're stable, or what happens if they're unavailable. No caching strategy, no offline fallback, no explicit acknowledgment that these are external wiki pages that could change or go down. The data entry plan depends entirely on these sources being accessible during implementation.  
**Why it matters:** If the Polcompball wiki is down during the implementation window, the work is blocked. If Philosophyball restructures its page hierarchy, the data sources become unreliable. An implementer starting the work needs to know: "I must scrape these today and pin versions."

**Fix required:** Either:
- Add an explicit "source inventory" step that captures specific URLs and snapshots the relevant pages before data entry begins, OR
- Acknowledge this as a risk with the mitigation: "If primary sources are unavailable, fill from secondary sources (SEP, IEP) and mark in comments."

---

### P1-3: 88-label enrichment consistency — no authoring conventions documented

**Where:** Section 2.1 (Philosophy Enrichment)  
**Evidence:** The plan treats enriching all 88 existing labels as a mechanical data-entry task. But assigning `ethicalTheory`, `normativePhilosophies`, etc. requires judgment calls — especially for labels that sit at intersection of traditions. What consistency rule governs across labels? E.g., if `Social Democracy` appears in `normativePhilosophies` for `egalitarian-statist`, should it also appear for `social-democrat`? If `neo-classical-liberalism` gets `Consequentialism` as `ethicalTheory`, should `classical-liberalism` also get it? Without documented conventions, two different implementers (or the same implementer on different days) will make inconsistent choices for structurally similar labels.  
**Why it matters:** Inconsistency across similar labels creates the exact failure mode described in P1-1: structurally valid but factually irregular data. The user sees "Social Democracy has ethicalTheory: [X]" but "Social Liberalism" doesn't, for no principled reason.

**Fix required:** Before data entry, produce a short convention doc (can be local://ideology-expansion/data-conventions.md) specifying:
- Which field values are family-consistent (e.g., "all socialist-family labels get Marxism in philosophies and normativePhilosophies").
- Default for undefined cases (e.g., "if a label has no known ethical tradition → `[]`, not omission").
- A single-responsibility rule for adjudicating borderline cases (author, reviewer, or tiebreaker).

---

## Watch Items (P2–P3)

### P2-1: `philosophyInfluences` is structurally half-way to scorable but explicitly un-scorable

**Where:** Section 1 (Schema), 5 (Validation)  
**Evidence:** `philosophyInfluences` maps philosophies to `affectedAxes[]` but not to directional weights or effect magnitudes. The description is free text. The Architect calls it display-only. The plan's Principle 5 says "no new axes, no question-bank changes" — so this is intentionally non-scoring. But structurally, it looks like it could be. A future dev might read the type and assume it's half-implemented scoring data.  
**Why it matters:** This creates an ambiguity trap for the next maintainer.  
**Fix:** Add a `@remark This is display-only; not consumed by the scoring engine.` doc comment to the `philosophyInfluences` field. Low-effort, eliminates ambiguity.

---

### P2-2: Partition semantics weakly enforced — coverage gaps invisible

**Where:** 5 (Validation), Edge Case 3  
**Evidence:** The plan says "normative + descriptive + prescriptive should be a partition of philosophies" but the validation test only enforces subset, not coverage. A philosophy in `philosophies` but unclassified into any layer array passes all tests. The Architect flagged this (5.4) and recommended a `.todo` warning — but it's advisory and likely won't be written.  
**Why it matters:** Over time, unclassified philosophies accumulate silently. The data grows structurally valid but increasingly incomplete in its layer classification.  
**Fix:** Add a non-blocking `it.each` that logs which `philosophies` items lack layer classification. This creates visibility without blocking CI.

---

### P2-3: No discussion of existing-label fixture degradation risk

**Where:** Section 4, Edge Case 6  
**Evidence:** Edge case 6 says "new label passes sweep but causes existing label's fixture to rank below #1 → investigate; existing near-tie exception may need broadening." This is a real risk: adding 32–62 new centroids into the same 26D space shifts the nearest-neighbor field. An existing label that previously ranked #1 for its own fixture could slip to #2 if a new centroid lands closer. The plan acknowledges this but provides no automated check — just "investigate."  
**Why it matters:** This could silently degrade scoring resolution for existing labels. A fix is simple: the sweep test should already catch this because `allCalibrationFixtures` includes existing-label fixtures. If an existing fixture fails (its own label no longer #1 or within its documented near-tie margin), the test fails. So this is actually **covered by the existing sweep test** — I confirmed in archetype-sweep.test.ts that all fixtures are iterated. Downgrading to P2 since the test catches it, but the plan doesn't explicitly call this out as protected.

---

### P3-1: "Manual spot-check 5 labels" is vague

**Where:** Section 8, Step 7  
**Evidence:** "Spot-check 5 existing labels and 5 new labels in the scoring output for sanity" — what constitutes "sanity"? A pass? A specific score range? Visual inspection of nearest-labels output? This is the only non-command verification step and it provides no oracle.  
**Fix:** Either delete it or make it concrete: "For 5 new labels, confirm `buildResultProfile(fixture, axes, labels).nearestLabels[0].labelId === fixture.expectedLabelIds[0]` except where a documented near-tie exception exists."

---

### P3-2: Candidate count estimate is optimistic, secondary sources unspecified

**Where:** Section 2.2  
**Evidence:** The plan estimates "~23–42 from listed categories; possibly 32–62 from secondary Polcompball sub-subcategories" — the "secondary sub-subcategories" are never named or listed. The range's upper bound (+20) is speculative.  
**Fix:** Name the sub-subcategories or cap the range at 42 until centroid pre-screening proves more exist.

---

## Summary: Pre-mortem Risk Matrix

| Risk | Severity | Likelihood | Mitigated? | Gap |
|------|----------|------------|------------|-----|
| Centroid culls push count below minimum | P0 | Medium | No target floor defined | Must add floor |
| Full data entry done before separability known | P0 | High | Fallback exists but triggers too late | Pre-screen missing |
| Structurally valid but factually wrong enrichment | P1 | Medium | Structural tests pass, no content check | Need spot-check |
| Polcompball/Philosophyball source unavailable | P1 | Low | Not acknowledged | Need source inventory |
| Inconsistent enrichment across similar labels | P1 | Medium | No conventions defined | Need convention doc |
| Existing fixture degradation | P2 | Low | Sweep test catches it automatically | Already works |
| Partition coverage gap accumulates silently | P2 | Medium | Validated as subset only | Add coverage warning |

---

## Conditions for Approval (Post-Revise)

1. Define a numeric acceptance criterion for label count (floor / target / cap). *(P0-1)*
2. Insert a centroid pre-screen step before full data entry. *(P0-2)*
3. Add a content-accuracy spot-check (test protocol + human review gate). *(P1-1)*
4. Document source dependency (URLs, snapshots, fallback). *(P1-2)*
5. Write data-entry conventions doc before enrichment begins. *(P1-3)*
6. Add `@remark display-only` doc-comment on `philosophyInfluences`. *(P2-1, optional)*
7. Add coverage-warning `.todo` test for philosophy layer classification gaps. *(P2-2, optional)*

---

*Generated: 2026-06-24 | CriticAgent | Run ID: ideology-expansion*
