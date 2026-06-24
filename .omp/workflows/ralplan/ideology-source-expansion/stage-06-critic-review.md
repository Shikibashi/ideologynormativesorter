# Critic Re-Review: Ideology Source Expansion — Stage 06

**Reviewer:** Critic (second re-review pass)
**Plan under review:** `.omp/workflows/ralplan/ideology-source-expansion/stage-04-revision.md`
**Prior reviews:** stage-02-architect.md (REVISE), stage-03-critic.md (ITERATE), stage-05-architect-review.md (APPROVE)
**Status:** **APPROVE** (with 3 minor documentation-level observations)

---

## 1. Blocker Resolution Audit

### BLOCKING-1: 23 vs ~18 scope contradiction

**Prior finding:** Objective claimed "~18 independent P1 labels" but Step 1 listed 23 candidates.

**Revision resolution (§1, §3):** Wave-based cluster-then-sweep execution. All 23 P1 candidates are attempted, but independence is proven by sweep results, not pre-declaration. The final count is an output, not an input.

**Verdict: RESOLVED.** The wave-based model makes the contradiction moot. The three-tier classification (Solid ~10, Probable ~8, At-risk ~5) provides useful planning guidance without pre-judging outcomes. The pre-flag table (§1) gives explicit rationale for 2 pre-committed P2 downgrades, bringing total scope to 25 entries (23 attempted + 2 pre-downgraded), consistent with the decision driver's "25 P1 candidates" reference.

### BLOCKING-2: No module-trigger impact analysis

**Prior finding:** 23 new labels in families with existing modules (authoritarian, green, nationalist) could silently change module trigger behavior.

**Revision resolution (§4):** 23-row per-label module trigger audit table. Each label is assessed against every `triggerLabelIds` and `subtypeLabelIds` list.

**Verdict: RESOLVED.** Comprehensive audit. The key architectural insight — existing modules use exact `triggerLabelIds` matches, not family-based matching — means no inadvertent triggering is possible. The conclusion ("no changes to `factionModules.ts` needed") is structurally sound. Verification step referencing `dataValidity.test.ts` is correct.

### BLOCKING-3: No centroid revision loop

**Prior finding:** Only binary options: register exception or downgrade. No revision path for poorly-seeded centroids.

**Revision resolution (§2, §5):** Three-step revision loop (Classify → Revise → Retest) with maximum 2 revisions, 4-axis limit per revision. Integrated with failure-triage protocol.

**Verdict: RESOLVED.** The loop is well-bounded and correctly sequenced. Key design choices are sound:
- 4-axis limit prevents chasing the sweep metric
- 2 revision limit prevents infinite iteration while allowing genuine improvement
- Retest-after-revision before exception registration preserves the spec's quality requirement

---

## 2. Prior Must-Fix Item Audit (from stage-03-critic.md)

| # | Item | Resolution | Verdict |
|---|---|---|---|
| 1 | Scope contradiction | §1 wave-based model | RESOLVED |
| 2 | Module-trigger impact | §4 audit table | RESOLVED |
| 3 | Centroid revision loop | §2 revision protocol | RESOLVED |
| 4 | Wave-based execution | §3 four-wave model | RESOLVED |
| 5 | Deferral criteria + Fourth Theory parent | §6 "sensible parent" criteria; §10 Q1 Integralism | RESOLVED |
| 6 | Failure-triage rules | §5 T1-T4 protocol | RESOLVED |

### Prior Should-Fix Audit

| # | Item | Resolution | Verdict |
|---|---|---|---|
| 7 | Tighten "manual verification" | §8 concrete `vitest -t <labelId>` commands | RESOLVED |
| 8 | labelById completeness check | §8 explicit TypeScript assertion | RESOLVED |
| 9 | Module-question fixture coverage | §11 E-1 audit result | RESOLVED |
| 10 | buildResultProfile family-tree check | §11 E-4 search command | RESOLVED |
| 11 | Open Questions 2-4 | §10 fully resolved | RESOLVED |

### Prior Architect Warning Audit

| # | Item | Resolution | Verdict |
|---|---|---|---|
| W-1 | Family fragmentation | §11 E-4 verification step | RESOLVED (timing caveat cleared by approval) |
| W-2 | Fourth Theory parent ambiguity | §10 Q1: Integralism with rationale | RESOLVED |
| W-3 | labelById map completeness | §8 verification code | RESOLVED |
| W-4 | Module-question fixture dependency | §11 E-1 audit confirms no dependency | RESOLVED (formalized as pre-commit check per architect advisory, but acceptable as-is) |

---

## 3. Spec Constraint Coverage

Comparing against the spec document and prior constraint matrix:

| Spec Constraint | Status |
|---|---|
| Curated backlog as source boundary | Covered — Non-Goals + wave-based candidate selection |
| High-confidence P1 gaps only | Covered — scope explicitly bounded to 25 entries |
| No wholesale Polcompball/Philosophball import | Covered — Non-Goals unchanged |
| Full 26-axis centroid per label | Covered — every axis required, centroid per label |
| Baseline archetype/calibration coverage | Covered — sweep after each wave |
| Dense clusters get extra fixtures | Covered — near-tie exception documentation per cluster |
| P2 aliases by default; module-resolved only with evidence | Covered — Wave 4 executes this; module audit confirms no changes needed |
| Module-resolved P2 requires reachable trigger | Covered — module audit table confirms reachability behavior |
| Failed P1 → P2 downgrade or defer with rationale | Covered — full deferral criteria, decision tree, documentation template |
| Do not weaken existing validation | Covered — Principle 2, per-wave sweep gate |
| Candidate independence requires distinct centroid + validation | Covered — sweep gate after each wave determines independence |

**Verdict: COMPLETE.** All 11 spec constraints are operationalized.

---

## 4. Verification Plan Assessment

### Strengths

- Every verification step is a concrete `npx vitest run` invocation — no hand-wavy instructions remain
- Per-wave verification is sequenced: each wave runs structural integrity + archetype sweep
- Wave 1 additionally runs full scoring suite as a pipeline validation gate
- `labelById` completeness check provides actual TypeScript code, not just a note
- Module-trigger verification references the existing `dataValidity.test.ts` mechanism (correct)
- Final verification covers typecheck, data integrity, and full scoring suite

### Gaps (minor, non-blocking)

**V-1: Wave 1 "pause and fix" escalation path undefined.** If Wave 1 produces systemic failures (≥3 of 5 labels fail with margin > 0.05), the plan says "pause and investigate fixture pipeline integrity" — but the investigation criteria, success threshold, and escalation path are not defined. The architect's advisory N1 offers concrete triage criteria; this should be adopted before execution.

**V-2: suggestModules false-positive criteria undefined.** The verification plan says "inspect `moduleSuggestions`" but provides no automated assertion or concrete definition of a false-positive. The architect's advisory N4 provides suggested acceptance criteria. Adding these before execution would prevent subjective interpretation during manual verification.

---

## 5. New Observations (Documentation-Level)

### O-1: Fourth Theory omitted from Wave 4 P2 alias table (Minor)

The plan resolves Fourth Theory as a P2 alias under Integralism in two separate locations:
- §1 pre-flag table: `Fourth Theory → Integralism`
- §10 Q1: `Downgrade to P2 alias under Integralism`

However, the Wave 4 execution table (§3) lists `Clerical Fascism → integralism` but **does not list Fourth Theory** as another P2 alias under Integralism. Since both would be P2 aliases added to Integralism's `aliases` array in the same wave, the table should include Fourth Theory for implementation completeness.

If Fourth Theory is deliberately excluded from Wave 4 (e.g., because it's considered a label variant that doesn't require an alias entry, or because it would be handled via a different mechanism), this rationale should be noted. Otherwise, it will be missed during execution.

### O-2: Pre-flagged downgrades bypass sweep gate — no fallback documented (Minor)

Libertarian Municipalism and Fourth Theory are pre-committed to P2 downgrade before any sweep evidence exists. The plan's rationale is sound (both are structurally inseparable given the current axis set). However, the plan does not address the edge case: what if the archetype sweep shows clear separation? The logical conclusion is "still downgrade, because the separation is coincidental given the axis coverage gap" — but this should be stated explicitly to avoid confusion during Wave 4 execution.

### O-3: Eco-Fascism risk tier mismatch between §1 and Wave 2a (Trivial)

The §1 tier table lists only 5 At-risk labels: National Bolshevism, Strasserism, Integralism, Islamic Democracy, Juche. But the Wave 2a sub-cluster table labels Eco-Fascism as "At-risk" — a tier not assigned to it in §1. The tier table explicitly says tiers are "planning labels, not commitments," so this is not a structural problem, but the tier tracker reading §1's table then encountering a differently-assigned risk in §3 may find it confusing.

**Remediation for all three:** Simple documentation clarifications. None affect execution correctness.

---

## 6. Risk Analysis Completeness

### Risk register (existing)
| Risk | Assessment |
|---|---|
| Centroid revision loop exhausted | Adequately mitigated — per-wave isolation limits blast radius |
| Module-trigger side effect | Adequately mitigated — audit + integration test |
| Family string collision | Adequately mitigated — display-only property |
| Question-bank coverage gap | Adequately mitigated — manual check per cluster; revision loop fallback |
| Fixture gradient loss | Adequately mitigated — accepted as existing constraint |

### Risks not in the register but identified

| Risk | Severity | Reason |
|---|---|---|
| Centroid seeding quality (598 axis values manual review) | Low-Medium | 23 labels × 26 axes = 598 manually-reviewed values. High volume increases error probability. Mitigated by the centroid revision loop (catches bad seeding) and fixed manual review protocol. NOTED but not blocking. |
| Cross-wave sweep regression | Low | Labels added in Wave 2 could create near-ties with Wave 1 labels by shifting the nearest-neighbor landscape. The failure-triage protocol's Step T3 handles this ("Is tying label in same wave?" → if no, register exception). The plan's serial gate structure (Wave 1 → 2a → 2b → 2c → 3) also limits exposure because later waves are built on proven labels. Mitigation is adequate. |

The plan's risk register is adequate for a deliberate, low-risk expansion. No additional risks rise to blocking level.

---

## 7. Edge Case Coverage

### Previously identified (from stage-03-critic.md)

| Edge Case | Status |
|---|---|
| E-1: Module question fixture dependency | Resolved (§11 E-1) — audit confirms no label depends on module-covered axes |
| E-2: 3-way eco tie (Eco-Authoritarianism, Eco-Fascism, Fascist-Authoritarian) | Resolved (§11 E-2) — explicit 3-way exception pattern documented |
| E-3: DemConf/Guild indistinguishability | Resolved (§11 E-3) — tie investigation path specified |
| E-4: Family proliferation side-effects | Resolved (§11 E-4) — search verification command provided |

### No new edge cases at blocking severity.

---

## 8. Architect Advisory Endorsement

The architect re-review (stage-05-architect-review.md) identified 4 advisory notes. I independently concur with all 4:

1. **N1: Wave 1 "pause and fix" triage path** — should define concrete criteria before execution (≥3 of 5 failing with margin > 0.05 → inspect fixture pipeline; etc.). This is the single highest-value execution improvement.

2. **N2: Automated centroid sanity check** — would reduce risk of manual review error for 598 axis values. Recommended but not blocking.

3. **N3: Question-bank coverage formalization** — would strengthen E-1's "no label depends on module-covered axes" claim. A mandatory per-wave assertion would be stronger than a documentation note.

4. **N4: suggestModules false-positive criteria** — would make the verification plan's "inspect `moduleSuggestions`" step measurable.

---

## 9. Final Verdict

### APPROVE

**Rationale:** The revised plan resolves all 3 prior blocking issues, all 6 must-fix items, all 5 should-fix items, and all 4 architect warnings. Spec constraint coverage is complete. The verification plan is concrete and executable. Risk analysis is adequate for a deliberate expansion pass. Edge cases are identified and resolved.

The 3 new observations (O-1 through O-3) are documentation-level gaps — not structural defects. They should be noted for the execution phase but do not constitute iteration triggers.

The 4 architect advisories (N1-N4) are endorsed as execution-phase improvements but do not invalidate plan approval.

### Recommended execution ordering

Per the plan's §12 recommendation, use **ultragoal** with 7 goals (G1-G7). Before executing G1 (Wave 1), resolve:
1. Define Wave 1 "pause and fix" triage criteria (architect N1)
2. Ensure `buildResultProfile` family-string-matching check runs before Indigenism is created (architect pre-condition)
3. Add Fourth Theory to the Wave 4 P2 alias table (observation O-1)
