# Architecture Review: Ideology Source Expansion — Stage 02

**Reviewer:** Architect
**Plan:** `.omp/workflows/ralplan/ideology-source-expansion/stage-01-planner.md`
**Spec:** `.omp/workflows/deep-interview/ideology-source-expansion.md`
**Status:** APPROVE WITH BLOCKING FLAGS (see Section 4)

---

## 1. Strongest Antithesis

### The plan assumes centroid viability can be assessed before fixture validation — this is architecturally unsound.

The plan sequences work as:
```
Step 1: Assess candidate → independent vs downgrade  (aspirational)
Step 2: Create labels with centroids                   (binding)
Step 3: Add P2 aliases                                 (mechanical)
Step 4: Generate calibration fixtures                  (fabrication)
Step 5: Run archetype sweep → register exceptions      (reality check)
```

The architectural flaw is that **Steps 1–2 commit to a label's independence before the only test that proves it (the archetype sweep)**. The `createCentroidAlignedFixture` function (`src/scoring/calibration.fixtures.ts:13-37`) converts centroid values to answer signals by computing a per-question weighted average over each question's `axisWeights`. A label's centroid can be sharply distinct in 26-axis space, yet its fixture can near-tie because the existing question bank does not weight the distinguishing axes strongly enough.

This means the "23 independent labels" listed in Step 1 are aspirational, not determinable in advance. The real number is a function of:
- The centroid values (which are seeded by LLM and manually reviewed — inherently imprecise)
- The question bank's axis weight distribution (fixed for this pass)
- The fixture generation algorithm (fixed)

Since the plan's Option A/B/C decision drivers and the ~18 target are based on *backlog rationale* (which is semantic/political analysis), not on *measured axis separation* (which is a numerical property of centroids in the 26-axis space), the **entire Option framework is built on the wrong evidence**. The recommended Option B assumes 7 downgrades, but the actual downgrade count is unknowable until Steps 4–5 execute.

**Impact:** If 23 labels are created and 10 fail the sweep, either:
- 10 near-tie exceptions are registered (weakening the test's discriminative power)
- 10 centroids need revision (no loop defined for this)
- 10 labels are downgraded after creation (wasted effort)

The plan addresses none of these scenarios structurally.

### The plan's "batch size" compounds this risk.

Adding 23 labels in one pass means the first sweep run will produce multiple failures simultaneously. Since failures can be caused by:
- Genuinely inseparable centroids (label is architecturally P2)
- Poor centroid seeding (label needs centroid revision, not downgrade)
- Fixture generation artifact (the fixture algorithm clips to -3/0/+3, losing separation)

...triaging a multi-label failure batch is strictly harder than triaging single-label failures. The plan provides no failure-triage protocol.

---

## 2. Tradeoff Tension

### Batch size vs. incremental validation

| Dimension | Single Batch (plan) | Incremental Clusters |
|---|---|---|
| **Speed** | Fast — one pass, one review | Slower — N passes, N reviews |
| **Failure isolation** | Poor — can't tell if label A near-ties with B due to centroid values or fixture aliasing | Clean — each cluster's failures are independent |
| **Near-tie discovery** | Batch-introduced near-ties (label A from Step 1 near-ties with label B from Step 1) only surface after both are added | Near-ties are discovered within the cluster, before the next cluster is committed |
| **Centroid revision cost** | High — all centroids are already in `labels.ts` | Low — only the current cluster's centroids exist |
| **Spec compliance** | Requires downgrading failed labels — but downgrading after creation means deleting from `labels.ts` and adding as alias, which is double work | Labels only enter `labels.ts` after passing the sweep — cleaner contract |

The plan implicitly chooses speed over isolation without acknowledging the cost of batch failure.

### Question-bank resolution vs. axis-space separation

The `createCentroidAlignedFixture` function maps centroids to answers via `sign(weightedAverage) * 3`. This is a ternary mapping (+3, 0, -3) that loses intermediate gradient. Two labels that differ by 0.3 on an axis but have the same sign on their weighted average per question will produce identical fixture responses. The plan treats "centroid distinctiveness" as a property of the 26-axis vector, but **the fixture system only tests separation along dimensions the question bank actually weights**. This is a known architectural constraint, but the plan doesn't analyze which distinguishing axes for the 23 new labels are well-covered vs. poorly-covered by the existing question bank.

---

## 3. Synthesis / Compromise Recommendation

### Adopt a layered cluster-then-sweep execution model

Replace the single-pass sequential model with:

**Wave 1 (5-6 labels): Architecturally distant anchors.** Add labels that cut across sparsely-represented families first: Panarchism, World Federalism, Indigenism, Guild Socialism, Multiculturalism, Cyberocracy. These are likely to pass the sweep cleanly because their family space has few existing neighbors. Run the sweep. If they pass, the fixture pipeline is confirmed for this pass. If they fail, the issue is in the fixture mechanism or the centroid seeding — fixable before 17 more labels depend on it.

**Wave 2 (6-8 labels): Cluster by family.** Add the green/eco cluster (Bioregionalism, Eco-Authoritarianism, Eco-Fascism) together, then the nationalist cluster (Hindutva, Religious Nationalism, Zionism) together, then the authoritarian cluster (National Bolshevism, Strasserism, Integralism) together. Run the sweep after each sub-cluster. Near-ties are expected within clusters; document exceptions per cluster.

**Wave 3 (5-7 labels): Borderline candidates.** Add the remaining candidates (Democratic Confederalism, Paleoconservatism, One-Nation Conservatism, Islamic Democracy, Liquid Democracy, Accelerationism, Juche, Techno-Anarchism). After entering, if any fail the sweep, apply the spec's downgrade/defer escape hatch with concrete rationale.

**Wave 4 (mechanical): P2 aliases, documentation, final verification.**

### Add failure-triage rules to the execution plan

For each label that fails the archetype sweep:
1. **Check the margin.** If margin > 0.05, the centroid likely needs revision, not an exception. Pause and reassign the centroid values.
2. **Check the tying label.** If the tie is with a label added in the same wave, investigate centroid separation and consider downgrading one to P2 alias under the other.
3. **Check question-bank coverage.** If the distinguishing axes are weakly weighted, register a near-tie exception with a note that question-bank coverage is the root cause.
4. **Default: downgrade to P2 alias.** If none of the above applies, apply the spec's default rule — downgrade under a sensible parent with rationale.

### Analyze module reachability impact

Before creating labels, audit each new label's family against existing `factionModules.ts` `triggerLabelIds` and `subtypeLabelIds`:
- Will Eco-Authoritarianism or Eco-Fascism trigger the authoritarian or green module? If yes, does the module's subtype resolution produce sensible results for these labels?
- Will National Bolshevism or Strasserism trigger the nationalist module?
- Will Zionism trigger any module?

Document the expected module-trigger behavior for each new label. If a new label would trigger a module that produces nonsensical subtypes, either suppress the trigger (by not adding the label to `triggerLabelIds`) or note the behavior for a later module revision pass.

---

## 4. Principle Violations

### Blocking

**BLOCKING-1: Plan objective contradicts plan detail — 23 independent labels vs. "~18" claim.**

The Objective section says "adds ~18 new independent P1 ideology labels." The Step 1 table lists **23** candidates marked as independent P1 (all except Libertarian Municipalism and Fourth Theory). The ~18 number from Option B does not match the detailed assessment. This is not a typo — it represents an unresolved architectural decision about which 5 of the 23 will actually be downgraded. Without resolving this, the plan does not bound its own scope.

*Spec rule violated:* "A candidate becomes an independent base result only if it can be modeled as a distinct 26-axis centroid and satisfy validation gates." Listing 23 labels as independent without evidence of distinctness violates this.

**BLOCKING-2: No module-trigger impact analysis.**

Adding 23 labels to `labels.ts` changes the label-space landscape. `computeModuleSubtype` and `suggestModules` operate on `labelById` and `triggerLabelIds`. New labels in families with existing modules (authoritarian, green, nationalist) will change which modules trigger and how subtype resolution works. The plan states "No changes to factionModules.ts" but never analyzes whether new labels should be added as triggers or subtypes.

*Spec rule violated:* "Module-resolved P2 outcomes require a reachable trigger path and subtype-resolution evidence." The plan doesn't verify existing module reachability for new P1 labels.

**BLOCKING-3: No centroid revision loop.**

If a label fails the sweep due to poor centroid seeding (not due to genuine inseparability), the plan provides no mechanism to revise the centroid and re-test. The only options are "register an exception" or "downgrade." This incentivizes exception registration over centroid quality.

*Spec rule violated:* "Every independent label must have a full 26-axis centroid across the existing normative, descriptive, prescriptive, and cross-cutting axes." Registering a near-tie exception because the centroid was poorly seeded does not satisfy this requirement in spirit.

### Warning-level

**WARNING-1: Family fragmentation without architectural rationale.** New families ('indigenist') and subfamilies are proposed without analyzing their effect on the `buildResultProfile` family-tree display or `computeConflatedLabels`. Currently families are display-only, so this is not a data integrity risk. But the plan should validate that proposed families don't inadvertently match code paths that use string-matching on family names.

**WARNING-2: Downgrade rationale is insufficiently specific.** The plan's rationale for downgrading Fourth Theory ("extremely close to integralist/neoreactionary/imperial-authoritarian space") cites *three* possible parent labels without naming which one. The spec requires downgrade rationale to name "which existing label makes it inseparable." The plan should resolve this before execution.

**WARNING-3: `labelById` map completeness.** The `labelById` map (`export const labelById = new Map(labels.map((l) => [l.id, l]))`) must be regenerated after new labels are added. This is automatic if labels.ts is correct, but the plan should explicitly verify the map is complete as part of Step 6, especially since `computeModuleSubtype` filters `labels` against `subtypeLabelIds` — a missing label would silently produce no subtype candidate.

**WARNING-4: Fixture generation for labels not yet committed.** The `createCentroidAlignedFixture` function iterates `questions`, not `moduleQuestions`. If a new label's centroid is only resolvable via module questions (which won't have fixtures until a module pass), the label may systematically fail the sweep. The plan should check which axes are exclusively covered by module questions and flag labels dependent on them.

---

## 5. Summary Assessment

**Verdict:** REVISE

**Rationale:** The plan makes solid ordering decisions about which P1 candidates are strongest and has correct instincts about batch sequencing. However, three blocking architectural issues prevent approval:

1. **23 vs ~18 contradiction** must be resolved with explicit per-candidate downgrade/defer rationale.
2. **Module-trigger impact analysis** is entirely absent and required for safe execution.
3. **No centroid revision loop** means the plan structurally encourages exception registration over label quality iteration.

The layered cluster-then-sweep model (Section 3) and failure-triage rules address all three blockers without requiring a full rewrite. I recommend the Planner adopt the wave-based execution model and add the missing analyses.
