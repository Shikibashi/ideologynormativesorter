# Stage 02 — Architecture Review: Ideology Label Expansion Plan

**Reviewer:** ArchitectAgent  
**Plan Reviewed:** `.omp/workflows/ralplan/ideology-expansion/stage-01-planner.md`  
**Run ID:** ideology-expansion  
**Date:** 2026-06-24

---

## 1. Verdict: **Approve with conditions**

| Dimension | Status |
|-----------|--------|
| Overall recommendation | **APPROVE** (with comments) |
| Architectural soundness | **CLEAR** — no fatal flaws; plan is grounded in actual codebase structures |
| Risk level | **WATCH** — near-tie exception density and data file growth merit monitoring |

---

## 2. Verifications from Source

Every significant structural assertion in the plan was checked against the actual codebase:

| Plan Assertion | Source Evidence | Status |
|---------------|----------------|--------|
| `IdeologyLabel` has 10 fields | `src/types/label.ts` — confirms 10 fields (id, name, family, subfamily, centroid, description, aliases, philosophies) | ✅ Correct |
| `AxisId` exists in common.ts | `src/types/common.ts` — `export type AxisId = string` | ✅ Correct |
| `targetIds` array drives fixtures | `src/scoring/calibration.fixtures.ts` — `allCalibrationFixtures = calibrationFixtures` derived from `targetIds.map(...)` | ✅ Correct |
| Fixture → label lookup via `labelById` | `import { labelById } from '../data/labels'` — Map created in labels.ts line 3281 | ✅ Correct |
| Sweep test iterates all fixtures | `archetype-sweep.test.ts` — `for (const fixture of allCalibrationFixtures)` | ✅ Correct |
| Anti-drift guard exists | `archetype-sweep.test.ts:157-161` — `'every label has a calibration archetype'` | ✅ Correct |
| 24 existing near-tie exceptions | `NEAR_TIE_EXCEPTIONS` record — 24 entries for 88 labels (~27%) | ✅ Correct |
| labels.ts ~3282 lines | `wc -l src/data/labels.ts` — 3281 lines | ✅ Correct (off by 1, trivial) |
| No existing new fields | `search` for all 6 new field names across `src/` — zero matches | ✅ Correct |

---

## 3. Strongest Antithesis (Steelman Requirement)

> "This plan adds 32–62 labels and 6 new display-only fields without changing the scoring engine. If the new fields are display-only and not used by scoring — no centroid recalculation, no weight adjustment, no axis contribution — what real user value do they provide? The team should either (a) consume the new fields in scoring to improve separation accuracy, or (b) reduce scope to the minimal viable enrichment. As written, this is a 5,000+ line documentation exercise masked as an architecture change: it doesn't change a single score, doesn't improve any ranking, and adds significant maintenance surface (528+ field values to calibrate, 15+ new near-tie exceptions, a rapidly-growing `labels.ts` file). Every new label not separable by the 26-axis system is a liability — it dilutes the precision of the existing 88-label system without contributing measurable analytical value."

**Counterpoint that preserves the plan:** The new fields are not scoring inputs but *user-facing interpretive enrichment*. They bridge the gap between "you matched this ideology" and "here's *why* this ideology thinks what it thinks, and which philosophical traditions drive its positions." The philosophy layer classification (normative/descriptive/prescriptive) directly supports the existing three-layer axis architecture — a user who scores strongly on normative axes can see which philosophies drove those scores. The `philosophyInfluences` per-axis mapping is the primary user-facing value: it turns an abstract centroid match into a readable narrative. This is legitimate product value that doesn't require scoring changes.

---

## 4. Real Tradeoff Tension

### Precision vs. Completeness in Label Expansion

**The core tension:** Expanding from 88 to 120–150 labels necessarily packs more labels into the same 26-dimensional space. The proposed Option A (Maximal) would push the near-tie exception rate from its current ~27% (24/88) toward ~30% (36-49/120-150). Each new near-tie exception is effectively an admission that the 26-axis system cannot distinguish the pair at the fixture level — the scoring resolution doesn't justify a separate label.

**The tradeoff manifests concretely:**
- More labels = richer categorization for users who identify with specific sub-ideologies
- More near-tie exceptions = reduced confidence in automatic label assignment for those same sub-ideologies
- The plan's fallback ("if exceptions exceed 20, use Option B") internally acknowledges this tension but doesn't define a hard upper bound on acceptable exception density

**What makes this a genuine tension (not a design error):** Both sides are valid — a label system with 150 entries and 50 near-tie exceptions may still serve users better than 88 entries and 24 exceptions, because the exceptions are *documented* rather than *hidden*. The user sees an accurately uncertain match rather than a confidently wrong one. But the ratio must be monitored as a product metric, not just an implementation detail.

---

## 5. Concerns (Architectural)

### 5.1 `philosophyInfluences.affectedAxes` — No Compile-Time Safety

**Severity:** Low (mitigated by validation test)  
**Detail:** `AxisId` is `type AxisId = string` (common.ts:14). The `philosophyInfluences` inline type uses `affectedAxes: AxisId[]`, which means any string is accepted at compile time. The validation test catches typos against actual axis IDs at runtime, but there's no type-level guard.  
**Recommendation:** Accept as-is — the validation test is sufficient. For future hardening, consider a `validAxisId` branded type if AxisId ever moves to a union.

### 5.2 `labels.ts` File Growth — Maintainability Threshold

**Severity:** Medium  
**Detail:** The file is currently 3281 lines. The plan estimates 5000–5800 lines after expansion. This is approaching the threshold where single-file editing becomes cumbersome (scrolling, merge conflicts, readability). Labels array entries are verbose due to 26-axis centroids.  
**Recommendation:** Strongly consider splitting `labels.ts` into family-grouped files (e.g., `labels/anarchist.ts`, `labels/social-democratic.ts`, etc.) after the expansion lands, importing and re-exporting from an index. This is a *post-expansion* refactor — do not scope-creep it into this work. The plan correctly does not propose it.

### 5.3 Near-Tie Exception Density — No Hard Cap

**Severity:** Watch (not blocker)  
**Detail:** 24 exceptions for 88 labels (~27%). Adding 32–62 labels at similar cluster density could yield 12–25 new exceptions, bringing the total to 36–49 out of 120–150 (~30%). The plan's Option A→B fallback (skip `philosophyInfluences` on 20 simplest labels) does not meaningfully reduce the *clustering* problem — it only reduces *data entry* burden.  
**Recommendation:** Define a post-expansion review metric: if label-pairs with near-tie exceptions exceed 30% of total labels, consider either (a) adding discriminating questions to the question bank, or (b) consolidating the tightest clusters into composite labels. Do not block this work on it — but measure it.

### 5.4 Philosophy Layer Semantics — Overlap vs. Partition Ambiguity

**Severity:** Low  
**Detail:** The plan says (edge case 3) the three layer-specific arrays should be "a partition of philosophies (each philosophy appears in at least one layer, possibly multiple)" but the validation test only enforces *subset*, not *partition* or *coverage*. A philosophy could be in `philosophies` but not in any layer array, and the test passes. The plan explicitly accepts this for backward compatibility.  
**Consequence:** Implementers may leave a philosophy unclassified, and the data will be incomplete but valid. The validation test should eventually warn on coverage gaps, but starting with subset-only is the right incremental approach.  
**Recommendation:** Add a non-blocking `it.each(...)` warning (`.todo` or a separate audit) that tracks which philosophies lack layer classification, for future hardening. Not required for this expansion.

### 5.5 `philosophyInfluences` Object — Named Type Would Improve Reusability

**Severity:** Low  
**Detail:** The plan uses an inline `{philosophy: string; description: string; affectedAxes: AxisId[]}` to keep the type file compact. While this works, the type is likely to be referenced in validation tests, fixture builders, and potentially a future UI component.  
**Recommendation:** Extract to a named type `PhilosophyInfluence` in `label.ts` — it costs one line and buys documentation + reuse.  
**Required change:** No (advisory improvement only).

### 5.6 Axis String Literal Typo Risk in `philosophyInfluences`

**Severity:** Low (validated at test time)  
**Detail:** Values in `affectedAxes` are hand-typed strings like `'property-legitimacy'`. There are 26 valid axis IDs; a single character typo breaks the fixture silently until validation runs.  
**Recommendation:** The validation test already catches this (line 281-295 of the plan). Acceptable.

---

## 6. Required Changes

**None.**

The plan is architecturally sound. Every structural assumption was verified against actual source:
- Type definitions match the described surfaces
- Fixture generation and sweep test mechanics are correctly understood
- Validation test extensibility is accurate
- The sequence/dependency graph is correct
- Edge case mitigations are appropriate

No blocking architectural issues were found.

---

## 7. Conditions on Approval

1. **Measure near-tie exception density after seeding.** If the rate exceeds 33% (exceptions ÷ total labels), file a follow-up issue for cluster resolution — do not block this PR on it.
2. **Populate empty arrays, not absent fields, for clarity.** The plan recommends this (edge case 1); enforce it consistently.
3. **Run the sweep test to measure actual margins before registering a single near-tie exception.** The plan correctly mandates this. Ensure implementers follow it — no pre-registration.

---

## 8. Synthesis

The plan earns approval because it demonstrates strong architectural hygiene:

- **Backward compatibility first**: All new fields are optional, existing labels compile unchanged, existing tests pass without modification.
- **Measurement over declaration**: New label count and near-tie exceptions are post-measurement, not pre-committed. The Option A→B fallback is data-dependent.
- **Validation covers the gaps**: Every structural constraint the type system cannot enforce (subset relationships, axis reference validity) is covered by a validation test.
- **Sequence is correct**: The type definition → data → fixture → measurement → validation → verification order cannot produce false passes.

The display-only nature of the new fields is the correct architectural choice for this phase. Making these fields affect scoring would require recentroiding every label and revalidating every fixture — a separate, riskier project. For now, the enrichment provides user-facing interpretive value without risk to scoring reliability.

The single metric to watch post-landing is the near-tie exception ratio. At ~27% today, it's already non-trivial. If the expansion pushes it past 33%, the team should invest in either bank-level discriminating items or label consolidation — but that's a separate workstream, not a blocker on this one.

---

## Files Examined

| File | Purpose |
|------|---------|
| `.omp/workflows/ralplan/ideology-expansion/stage-01-planner.md` | Plan under review (full file, 401 lines) |
| `src/types/label.ts` | IdeologyLabel interface (17 lines) |
| `src/types/common.ts` | AxisId type definition (17 lines) |
| `src/scoring/calibration.fixtures.ts` | targetIds array + fixture generation (142 lines) |
| `src/scoring/archetype-sweep.test.ts` | NEAR_TIE_EXCEPTIONS + sweep test (163 lines) |
| `src/data/dataValidity.test.ts` | Existing validation test structure (163 lines) |
| `src/data/labels.ts` | Label data file (3281 lines) |
