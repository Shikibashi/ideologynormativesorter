# Stage 05 — Architecture Re-Review: Ideology Label Expansion (Revised Plan)

**Reviewer:** Architect2Agent  
**Plan Reviewed:** `.omp/workflows/ralplan/ideology-expansion/stage-04-revision.md`  
**Critic Findings:** `.omp/workflows/ralplan/ideology-expansion/stage-03-critic.md`  
**Architect (Original):** `.omp/workflows/ralplan/ideology-expansion/stage-02-architect.md`  
**Run ID:** ideology-expansion  
**Date:** 2026-06-24

---

## 1. Overall Verdict: **APPROVE**

| Dimension | Status |
|-----------|--------|
| P0 findings closure | **ALL RESOLVED** — both blocking issues fully addressed |
| P1 findings closure | **ALL RESOLVED** — all three significant issues fully addressed |
| P2 advisory findings | **ALL ADDRESSED** — both optional items implemented |
| Architectural soundness | **CLEAR** — no regressions; improved over original plan |
| Execution readiness | **READY** — dependency graph is sound, no remaining blocking gates |

---

## 2. P0 Findings — Closure Verification

### P0-1: Numeric label count acceptance criterion

**Critic requirement:** Define a floor (minimum acceptable), a target range, and a cap — an actionable stopping rule.

**Revised plan response (Section "Acceptance Criteria — Label Count", lines 27–34):**

| Criterion | Value | Rule |
|-----------|-------|------|
| Floor | 115 | Minimum viable count. Below 115 → expand candidate pool or file follow-up for bank-level discriminating items. |
| Target | 120–130 | Ideal landing range. At 120+ with ≤33% near-tie exception density, expansion is complete. |
| Cap | 150 | Soft cap. Candidates pushing above 150 are downgraded to alias queue automatically. |

Additionally, a composite pass condition is defined: `total label count ≥ 115 AND ≤ 150 AND near-tie exception density ≤ 33%`. A fallback path is documented for sub-floor outcomes.

**Verification:** The plan's acceptance criteria are concrete, numeric, and gated on three independent dimensions (count floor, count cap, exception density). Every outcome has an action. The stopping rule is unambiguous.

**Status: RESOLVED.** The floor/target/cap structure exceeds what the critic asked for — it additionally defines a pass condition and fallback path, making it actionable for the implementer.

---

### P0-2: Centroid distinctness checked too late (pre-screen missing)

**Critic requirement:** Insert a pre-screen step between type definition and data entry — coarse centroid estimate, pairwise cosine distance, cull candidates ≤0.015 before full enrichment.

**Revised plan response:**

- **Step 0b** inserted in the sequence diagram (Section 6, lines 380–389), unambiguously placed after type definition (0) and source inventory (0a) but **before** data entry (1a/1b).
- **Detailed instructions** in Section 2.2 (lines 174–185): coarse centroid estimate (±0.05 approximation on key axes), approximate cosine distance to nearest same-family existing centroid, threshold (distance > 0.03 → survivor; ≤0.03 → alias candidate), recording in working file.
- **Sequence explicitly prohibits** data entry for candidates that fail the pre-screen (line 427: "Both run **only after** the centroid pre-screen has identified survivors").
- **Fallback path**: candidates ≤0.03 can still become independent labels via an evidence-based override (documented justification of semantic separability).

**Threshold calibration note:** The critic suggested ≤0.015 as the culling threshold; the plan uses ≤0.03. This is architecturally sound and **preferable** — the pre-screen uses coarse centroid estimates with ±0.05 approximation error. A threshold of 0.015 would be tighter than the estimation noise, creating false positives (culling separable candidates). The 0.03 threshold sets a wider net, letting more candidates through to the full sweep test (step 3) where production-precision centroids make the final determination. The pre-screen correctly serves as a **coarse filter for non-separable cases**, not a precise measurement.

**Status: RESOLVED.** The pre-screen is correctly positioned, well-thresholded, and properly integrated into the dependency graph. The implementer has a clear procedure, a record-keeping requirement, and an override path.

---

## 3. P1 Findings — Closure Verification

### P1-1: Content accuracy verification (no test for truth)

**Critic requirement:** Add ground-truth assertions in a test block AND a human review gate.

**Revised plan response:**

- **Section 5** (lines 356–362): A `describe('philosophy enrichment accuracy', ...)` block in `dataValidity.test.ts` with per-label ground-truth assertions (e.g., `social-democrat` includes `"Social Democracy"` in `normativePhilosophies`). Implementer populates assertions for labels they enrich.
- **Section 8** (lines 455–465): A complete spot-check protocol:
  1. Author asserts ground truths for 10–15 labels across diverse families.
  2. Human reviewer verifies enrichment for 5 labels from different families — checking ethicalTheory, layer classification, and philosophyInfluences plausibility.
  3. Discrepancies flagged as PR comments and resolved before merge.
- **Verification steps** (Section 9, steps 7–8): explicit commands to run the content spot-check tests and execute the human review gate.

**Concern:** The plan describes a non-exhaustive test — only 10–15 of 88+ labels get ground-truth assertions. This is appropriate. An exhaustive content assertion suite would be ~528 assertions (88 × 6 fields) and would duplicate the already-specified data-entry work. The spot-check correctly targets **regression guards** for the most subjective enrichment decisions, not full coverage.

**Status: RESOLVED.** The combination of programmatic assertions and human review provides quality gating without mandating an impractical exhaustive assertion suite.

---

### P1-2: Polcompball/Philosophyball as unstated live dependencies

**Critic requirement:** Either capture explicit source inventory with URL snapshots, or acknowledge the risk with fallback.

**Revised plan response:**

- **Section 2.4** (lines 258–264): Explicit dependency acknowledgment with three mitigations:
  1. **Before data entry**, capture specific URLs and snapshot relevant pages — recorded in `local://ideology-expansion/source-inventory.md`.
  2. **If source is unavailable**, fill from secondary sources (Stanford Encyclopedia of Philosophy, Internet Encyclopedia of Philosophy) and mark the substitution in comments (`// source: SEP 2026-06`).
  3. **Data is pinned**, not dynamically fetched — source unavailability after data entry is not a runtime risk.
- **Step 0a** (source inventory) appears in the sequence diagram as a required predecessor to data entry.
- **Edge case** (line 450): explicit remediation if wiki is unavailable.

**Status: RESOLVED.** The plan correctly addresses both the operational risk (source unavailability during implementation) and the maintenance risk (changing sources after data entry). The URL-snapshotting and comment-convention requirements are concrete and actionable.

---

### P1-3: Inconsistent enrichment across 88 labels

**Critic requirement:** Produce a convention doc specifying family-consistent base values, default for undefined, and single-responsibility adjudication.

**Revised plan response:**

- **Section 2.1** (lines 157–168): Five data-entry conventions:
  1. **Family-consistent base values**: Each family has default philosophies every label inherits (e.g., `socialist` → `Marxism` in philosophies and normativePhilosophies).
  2. **Empty arrays, not omission**: Use `[]` (not `undefined`) when a field has no known entries. Only use `undefined` when genuinely unknown.
  3. **Similar labels, similar values**: Identical labels across families must have consistent field values. Borderline cases flagged with `// TODO: verify`.
  4. **Layer arrays are subsets, then coverage**: Every entry in layer arrays must exist in `philosophies`. Aim for full coverage but subset-only is valid initially.
  5. **Single-responsibility adjudication**: Author makes the call on borderline cases; reviewer challenges or accepts.

**Status: RESOLVED.** The conventions are specific, actionable, and cover the three types of inconsistency the critic identified: cross-family consistency (rule 1), undefined-value consistency (rule 2), and inter-implementer consistency (rules 3 + 5). The conventions further add layer-coverage guidance (rule 4) beyond the critic's request, which strengthens the result.

---

## 4. P2 Advisory Findings — Closure Verification

### P2-1: `philosophyInfluences` ambiguity (display-only vs scorable)

**Plan response:** Added `@remark This is display-only; not consumed by the scoring engine.` doc comment to the `philosophyInfluences` field.

**Status: ADDRESSED.**

### P2-2: Partition semantics weakly enforced (coverage gaps invisible)

**Plan response:** Added `it.todo('philosophy layer classification coverage — every philosophy in philosophies appears in at least one layer array')` in the validation test section.

**Status: ADDRESSED.** The `.todo` test provides visibility without blocking CI, exactly as the architect recommended in stage-02 (Section 5.4).

---

## 5. Architectural Soundness Assessment

### 5.1 Structural integrity

The revised plan preserves all architectural properties of the original:

| Property | Original | Revised | Assessment |
|----------|----------|---------|------------|
| Backward-compatible schema | All new fields optional (`?`) | Same | Maintained |
| One-pass enrichment | 88 labels enriched in one commit | Same | Maintained |
| Existing tests pass unchanged | Structural change only | Same | Maintained |
| Sweep test auto-covers new labels | Via `targetIds` + `createCentroidAlignedFixture` | Same | Maintained |
| No new axes / no question-bank changes | Explicit constraint | Same | Maintained |

### 5.2 Improvements over original

The revised plan corrects the original's two architectural weaknesses:

1. **Data entry before separability check** → Now has pre-screen step 0b. Prevents ~528–1240 field values of wasted effort on non-separable candidates.
2. **No stopping rule for label mining** → Now has floor/target/cap acceptance criteria. Prevents unbounded mining or premature acceptance of sub-viable counts.

### 5.3 Dependency graph integrity

The sequence diagram (Section 6) and parallelization rules (lines 424–432) correctly express:

```
0 (types) ─┬─→ 0a (sources) ──→ 0b (pre-screen) ──→ 1a/1b (data entry) ──→ 2 (fixtures) ──→ 3 (sweep) ──→ 4 (validation) ──→ 5 (build)
            │                                                                                     │
            └──────────────────────────────────────────────────────────────────────────────────────┘
```

No cyclic dependencies, no premature parallelization across gated steps. The pre-screen (0b) correctly gates data entry (1a/1b). The sweep test (3) correctly gates after both data entry and fixtures exist.

### 5.4 Threshold calibration check

The pre-screen uses `distance > 0.03 → survivor` while the critic suggested `0.015`. This is sound:

- Pre-screen uses **coarse centroid estimates** (±0.05 approximation on key axes). A 0.015 threshold would be within the noise floor of the estimation method, creating false culls.
- The 0.03 threshold is conservative: it lets through candidates that are plausibly separable, deferring the fine-grained decision to the full sweep test (step 3) which uses production-precision centroids.
- The override path (evidence-based override for candidates ≤0.03) prevents the pre-screen from being a rigid gate.

### 5.5 Risk analysis

| Risk | Revised plan mitigation | Residual | Assessment |
|------|------------------------|----------|------------|
| Wasted data entry on non-separable candidates | Pre-screen (step 0b) | Low — candidate must pass coarse filter before enrichment | Acceptable |
| Label count too low to be useful | Floor + fallback (mine more or add bank items) | Low — documented escalation path | Acceptable |
| Label count too high (quality dilution) | Cap (150) + near-tie density gate (≤33%) | Low — dual constraint prevents unbounded growth | Acceptable |
| Factually wrong enrichment detected after PR | Spot-check protocol + human review gate | Low — not exhaustive but catches systematic errors | Acceptable |
| Inconsistent enrichment across similar labels | Data-entry conventions (5 rules) | Low — conventions are actionable and reviewable | Acceptable |
| Source wiki unavailable during implementation | Source inventory + fallback to SEP/IEP | Low — two fallback tiers | Acceptable |
| Existing fixture degradation from new centroids | Sweep test iterates ALL fixtures automatically | Negligible — already protected | Acceptable |

### 5.6 No new architectural issues introduced

The revised plan does not introduce any new architectural concerns:

- No additional structural complexity beyond original
- No new external dependencies
- No changes to the scoring engine
- No type-system weakening
- No new coupling between subsystems
- No compile-time safety regressions (the `AxisId` string-type concern from stage-02 remains unchanged and already mitigated)

---

## 6. Summary: Findings Closure Table

| Finding | Severity | Disposition | Status |
|---------|----------|-------------|--------|
| **P0-1:** No numeric acceptance criterion for label count | P0 | Floor (115), target (120-130), cap (150), pass condition, fallback | **RESOLVED** |
| **P0-2:** Centroid distinctness checked too late | P0 | Step 0b pre-screen (≤0.03 → alias) before data entry | **RESOLVED** |
| **P1-1:** No content-accuracy verification | P1 | Spot-check assertions + human review gate (5 labels) | **RESOLVED** |
| **P1-2:** Unstated live dependencies on wikis | P1 | Source inventory, URL snapshots, secondary fallback | **RESOLVED** |
| **P1-3:** Inconsistent enrichment across 88 labels | P1 | 5 data-entry conventions (family-consistent, empty arrays, etc.) | **RESOLVED** |
| **P2-1:** `philosophyInfluences` display-only ambiguity | P2 | `@remark` doc-comment added | **ADDRESSED** |
| **P2-2:** Philosophy layer coverage gaps invisible | P2 | `.todo` test for unclassified philosophies | **ADDRESSED** |

---

## 7. Execution Advisory

One observation that does not block approval but may improve implementation quality:

**Pre-screen threshold calibration** — The plan uses `distance > 0.03` to admit candidates. If the implementer finds that the coarse estimation (±0.05) yields many false passes (candidates that pass pre-screen but fail the full sweep test), they should reduce the threshold to 0.02 or document the over-admission pattern. Conversely, if too many candidates are falsely culled (distance ≤0.03 but demonstrably separable), they should use the evidence-based override path. The 0.03 threshold is a reasonable starting calibration, not a hard constraint.

---

## 8. Final Recommendation

**APPROVE** — The revised plan fully addresses all P0 and P1 findings from the critic review, addresses both P2 advisory items, and remains architecturally sound. No regressions detected. The plan is ready for execution.

---

*Generated: 2026-06-24 | Architect2Agent | Run ID: ideology-expansion*
