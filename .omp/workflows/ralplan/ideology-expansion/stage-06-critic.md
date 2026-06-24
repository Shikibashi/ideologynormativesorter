# Stage 06 — Critical Re-Evaluation: Ideology Label Expansion (Revised Plan)

**Reviewer:** Critic2Agent  
**Plan Reviewed:** `.omp/workflows/ralplan/ideology-expansion/stage-04-revision.md`  
**Architect Re-Review:** `.omp/workflows/ralplan/ideology-expansion/stage-05-architect.md`  
**Original Critic Findings:** `.omp/workflows/ralplan/ideology-expansion/stage-03-critic.md`  
**Run ID:** ideology-expansion  
**Date:** 2026-06-24  

---

## Verdict: **APPROVE**

The revised plan fully resolves all P0 and P1 findings from the original critic review. No new P0 or P1 issues are introduced. The pre-screen step (0b) is correctly sequenced and does not cascade to break any downstream step.

---

## 1. P0 Findings — Closure Verification

### P0-1: Numeric label count acceptance criterion (floor/target/cap)

**Status: RESOLVED** ✅

The revised plan (Section "Acceptance Criteria — Label Count") defines:

| Criterion | Value | Rule |
|-----------|-------|------|
| **Floor** | **115** | Minimum viable count. Below 115 → expand pool or file follow-up for bank-level discriminating items. |
| **Target** | **120–130** | Ideal landing range. At 120+ with ≤33% near-tie exception density, expansion is complete. |
| **Cap** | **150** | Soft cap. Candidates pushing above 150 are downgraded to alias queue automatically. |

A composite pass condition is specified: `total label count ≥ 115 AND ≤ 150 AND near-tie exception density ≤ 33%`. A fallback path exists for sub-floor outcomes. Every outcome has an actionable rule.

The plan goes beyond what the critic required by adding the pass condition and fallback path — this eliminates ambiguity about the stopping rule.

---

### P0-2: Centroid pre-screen step before data entry

**Status: RESOLVED** ✅

The revised plan inserts **Step 0b (Centroid Pre-Screen)** in Section 2.2 (lines 174–185), positioned unambiguously before data entry (steps 1a/1b):

1. Derive coarse centroid estimate (±0.05 approximation on key axes).
2. Compute approximate cosine distance to nearest same-family existing centroid.
3. **Distance > 0.03** → survivor (proceed to full data entry).
   **Distance ≤ 0.03** → alias candidate (downgrade unless evidence-based override filed).
4. Record results in working file for auditability.

The sequence diagram (Section 6) and parallelization rules (lines 424–432) confirm:
```
0 (types) → 0a (sources) → 0b (pre-screen) → 1a/1b (data entry for survivors only) → 2 (fixtures) → 3 (sweep) → 4 (validation) → 5 (build)
```

The threshold calibration (<0.03 → alias) is sound: the pre-screen uses coarse ±0.05 estimates, so a 0.015 threshold (as suggested in the original critic) would be within the noise floor and cause false culls. The 0.03 threshold is conservative, deferring fine-grained decisions to the production-precision sweep test (step 3). The evidence-based override path prevents the pre-screen from being a rigid gate.

---

## 2. P1 Findings — Closure Verification

### P1-1: Content accuracy verification
**RESOLVED** ✅ — Both programmatic spot-check assertions (10–15 labels across diverse families, Section 5) and human review gate (5 labels from different families, Section 8) are defined.

### P1-2: Polcompball/Philosophyball live dependencies
**RESOLVED** ✅ — Source inventory step (0a) with URL snapshots, documented fallback to SEP/IEP secondary sources, and pinned data (not dynamic fetching).

### P1-3: Inconsistent enrichment across 88 labels
**RESOLVED** ✅ — Five data-entry conventions defined (family-consistent base values, empty-arrays rule, similar-labels consistency, layer subset coverage, single-responsibility adjudication).

---

## 3. P2 Findings — Closure Verification

### P2-1: philosophyInfluences display-only ambiguity
**ADDRESSED** ✅ — `@remark` doc-comment added on the field.

### P2-2: Philosophy layer coverage gaps invisible
**ADDRESSED** ✅ — `.todo` test added for unclassified philosophy detection.

---

## 4. New Issues Introduced by the Revision

The re-evaluation did not uncover any new P0, P1, or P2 issues. The revision is structurally sound and correctly addresses every original finding.

### Advisory: Minor Sequencing Conservatism

The parallelization rules (line 428) gate **both** 1a (enrich existing 88 labels) **and** 1b (add new labels) behind the pre-screen (0b). Strictly speaking, 1a does not depend on 0b — existing label enrichment could start in parallel with the pre-screen. The current sequencing is conservative but not incorrect; the forced serialization adds negligible overhead relative to the total effort (~528 field values vs ~528 + ~240).

**Recommendation:** This is a minor optimization opportunity, not a defect. No change required.

### Advisory: Post-Pre-Screen Sweep Failure Not Explicitly Remediated

Edge Case 7 (Section 11, line 505) acknowledges that a candidate passing the pre-screen may still fail the production-precision sweep test (step 3). The plan calls this "acceptable" but does not specify what to do with the fully enriched data entry for such candidates. In practice, the implementer would demote the candidate to an alias and remove its independent label entry — a straightforward operation. The pre-screen recording file provides the audit trail.

**Recommendation:** Add a sentence to Edge Case 7: "If a pre-screen survivor fails the full sweep test, demote to alias under the nearest existing label and remove the independent entry from `labels.ts`. The enrichment fields may be preserved as comments for reference."

---

## 5. Pre-Screen Cascade Analysis

I traced every downstream dependency of the new Step 0b to verify that adding it doesn't break sequencing or introduce deadlock:

| Step | Depends On | Why It Works |
|------|-----------|-------------|
| 0 (types) | Nothing | First step |
| 0a (sources) | 0 (types) | Can run in parallel with 0 |
| **0b (pre-screen)** | 0a (sources) | Candidates and centroids known after sources captured |
| 1a (enrich existing) | 0b (pre-screen) | Conservative but safe; enrichment independent of pre-screen outcome |
| 1b (add new labels) | **0b (pre-screen)** | **Critical** — only survivors of pre-screen get full enrichment |
| 2 (fixtures) | 1b | Only new label IDs need fixture entries |
| 3 (sweep test) | 1b + 2 | Both data and fixtures must exist before measurement |
| 4 (validation tests) | 0 + 1a + 1b | Types exist, data populated |
| 5 (full suite) | All above | Final gate |

**Cascade conclusion:** The pre-screen (0b) is a one-way gate that feeds into 1b (new labels). It does not create cycles, orphaned steps, or ordering reversals. Steps that don't need to wait for 0b could be parallelized (advisory above), but the serialization is safe.

---

## 6. Summary

| Finding | Severity | Original Status | Current Status |
|---------|----------|-----------------|----------------|
| **P0-1:** No numeric label count criterion | P0 | Open | **RESOLVED** |
| **P0-2:** Centroid distinctness checked too late | P0 | Open | **RESOLVED** |
| **P1-1:** No content-accuracy verification | P1 | Open | **RESOLVED** |
| **P1-2:** Unstated live wiki dependencies | P1 | Open | **RESOLVED** |
| **P1-3:** Inconsistent enrichment conventions | P1 | Open | **RESOLVED** |
| **P2-1:** philosophyInfluences ambiguity | P2 | Open | **ADDRESSED** |
| **P2-2:** Partition coverage gaps invisible | P2 | Open | **ADDRESSED** |
| **New issues from revision** | — | — | **None (P0-P2)** |

---

## Final Recommendation

**APPROVE** — Both P0 findings are fully resolved. The centroid pre-screen (step 0b, threshold ≤0.03) is correctly positioned and does not cascade into sequencing problems. No new P0, P1, or P2 issues are introduced. The revised plan is ready for execution. The two advisory notes above are optional refinements, not blocking conditions.

---

*Generated: 2026-06-24 | Critic2Agent | Run ID: ideology-expansion*
