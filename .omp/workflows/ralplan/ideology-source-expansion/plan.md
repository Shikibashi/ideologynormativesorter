# Pending Approval Plan: Ideology Source Expansion

## Objective
Implement a bounded ideology expansion of `src/data/labels.ts` that processes the remaining high-confidence P1 candidates from the curated backlog through a wave-based cluster-then-sweep execution model. Each label's independence is determined by measured archetype sweep results, not pre-declaration. Labels that pass become independent `IdeologyLabel` entries with 26-axis centroids, baseline archetype/calibration coverage, and documented module-trigger behavior. Candidates that fail separability are downgraded to P2 aliases under sensible parents or deferred with rationale. All work preserves existing validation invariants.

**Candidate accounting:** 25 entries considered — 23 P1 candidates + Fourth Theory (pre-resolved to P2) + Libertarian Municipalism (pre-resolved to P2 alias under Democratic Confederalism). Independence count is an output of the sweep process, not an input.

## RALPLAN-DR Summary

### Principles
1. **Centroid distinctiveness over source recognizability.** A candidate earns independent label status only when its 26-axis centroid passes the archetype sweep — not because it appears on a wiki.
2. **Existing-validation invariant priority.** No change may weaken passing data validity tests, archetype-sweep coverage, or scoring invariants to accommodate a new label.
3. **Smallest additive unit with per-wave gates.** Each wave is independently testable and revertible; waves are serially gated so failures are isolated before downstream work accumulates.
4. **Fail gracefully, document explicitly.** P1 candidates that fail sweep are downgraded to P2 aliases with a parent link, or deferred with written rationale — never silently dropped or registered as exceptions to hide poor separation.
5. **P2 alias-first scope.** P2 candidates are display-only aliases. No module-resolved subtype outcomes in this pass.

### Decision Drivers
1. **Backlog gap completeness** — 25 candidates from the curated backlog absent from `labels.ts`.
2. **Annotation burden** — each independent label needs LLM-seeded + manually reviewed 26-axis centroid.
3. **Dense cluster risk** — green/eco, authoritarian/nationalist, democratic/municipalist clusters need per-cluster sweep isolation.

### Viable Options
- **Option A — Bulk add 23 as independent** (rejected) — no failure isolation; batch failure is unrecoverable; violates spec's "distinct centroid + validation gate" constraint.
- **Option B — Wave-based cluster-then-sweep** (selected) — each wave sweep-tested before the next begins; failures are isolated and revertible. Independence count emerges from measurement.
- **Option C — Minimal, add only 7 most-distant** (rejected) — leaves most of the backlog gap unresolved.

## Implementation Plan

### Wave 1: Architecturally Distant Anchors (5-6 labels)
*Sparse families — high probability of clean sweep. Proves fixture pipeline works.*

**Labels:** Panarchism, World Federalism, Indigenism, Guild Socialism, Multiculturalism, Cyberocracy

**Steps:**
1. Verify `buildResultProfile` family-string matching before adding Indigenism (`indigenist` family).
2. Assign families/subfamilies (see Proposed Families table below).
3. Seed 26-axis centroids via LLM from Polcompball descriptions; manually review per axis.
4. Run automated sanity check: flag any axis value exceeding family's observed range by >50%; flag if nearest same-family label is farther than nearest different-family label.
5. Add entries to `src/data/labels.ts`; append IDs to `calibration.fixtures.ts` `targetIds`.
6. Run `npx vitest run src/scoring/archetype-sweep.test.ts`.
7. **Gate:** Wave 1 must pass (possibly with exceptions) before Wave 2. If ≥3 of 6 fail with margin > 0.05, pause and inspect `createCentroidAlignedFixture` for systematic bias.

### Wave 2: Family Clusters (up to 9 labels, 3 sub-clusters)
*Cluster-by-family so near-ties surface within the group.*

**Sub-cluster 2a — Green/Eco:** Bioregionalism, Eco-Authoritarianism, Eco-Fascism
**Sub-cluster 2b — Nationalist:** Hindutva, Religious Nationalism, Zionism
**Sub-cluster 2c — Authoritarian:** National Bolshevism, Strasserism, Integralism

**Steps (per sub-cluster):**
1. Assign centroids (same process as Wave 1).
2. Add entries and fixture IDs.
3. Run sweep. Document near-ties per cluster with rationale.
4. Before next sub-cluster, verify `suggestModules` does not produce false-positive module suggestions for any new label (run `buildResultProfile` with centroid-aligned fixture and inspect `moduleSuggestions`).

### Wave 3: Borderline Candidates (remaining labels)
*Failure-triage protocol applied here.*

**Labels:** Democratic Confederalism, Paleoconservatism, One-Nation Conservatism, Islamic Democracy, Liquid Democracy, Accelerationism, Juche, Techno-Anarchism, plus any deferred-clarify labels from previous waves.

**Steps:**
1. Assign centroids; add entries and fixture IDs.
2. Run sweep.
3. For each failure, apply the Centroid Revision Loop (§ below).
4. If revision fails: downgrade to P2 alias under sensible parent, or defer with rationale.

### Wave 4: P2 Aliases, Documentation, Final Verification
1. Add P2 alias entries per the P2 Aliases table.
2. Document all downgrades and deferrals with written rationale in `docs/ideology-expansion-backlog.md`.
3. Run full verification suite.

---

## Centroid Revision Loop (Failure-Triage Protocol)

When a label fails the archetype sweep:

1. **Check margin.** If > 0.05 → the centroid likely needs revision, not exception registration. Revise centroid values, re-run sweep. Loop up to 2 times.
2. **Check tying label.** If the tie is with a label added in the same wave, investigate separation. Consider merging one into a P2 alias under the other.
3. **Check distinguishing-axis coverage.** Before committing each label's centroid, check: do the 3 most distinguishing axes each have at least one base question with `axisWeights[axis] !== 0`? If not, flag as fixture limitation.
4. **Default: downgrade.** If none of the above resolves, downgrade to P2 alias under a sensible parent with rationale.

**Deferral criteria** (distinct from downgrade):
- Use deferral only when NO sensible parent exists (no label in the same family or axis-profile neighborhood).
- Deferral rationale must name: candidate, why no parent exists, and which labels were considered and rejected.
- Deferred candidates recorded in `docs/ideology-expansion-backlog.md` with status: "deferred".

---

## Proposed Families and Subfamilies

| New Label | Family | Subfamily |
|-----------|--------|-----------|
| Eco-Authoritarianism | authoritarian | eco-authoritarian |
| Eco-Fascism | authoritarian | eco-fascist |
| Bioregionalism | green | bioregional |
| Democratic Confederalism | democratic | confederal-democratic |
| Paleoconservatism | conservative | paleoconservative |
| One-Nation Conservatism | conservative | one-nation-conservative |
| National Bolshevism | authoritarian | national-bolshevist |
| Strasserism | authoritarian | strasserist |
| Integralism | conservative | integralist |
| Islamic Democracy | conservative | islamic-democratic |
| Hindutva | nationalist | hindutva |
| Religious Nationalism | nationalist | religious-nationalist |
| Zionism | nationalist | zionist |
| Panarchism | anarchist | panarchist |
| Liquid Democracy | democratic | liquid-democratic |
| Cyberocracy | technocratic | cyberocratic |
| Accelerationism | technocratic | accelerationist |
| Juche | socialist | juche |
| Guild Socialism | socialist | guild-socialist |
| Techno-Anarchism | anarchist | techno-anarchist |
| World Federalism | liberal | world-federalist |
| Multiculturalism | liberal | multiculturalist |
| Indigenism | indigenist | indigenist |

---

## P2 Aliases (added in Wave 4)

| P2 Name | Parent Label | Mechanism |
|---------|-------------|-----------|
| Libertarian Municipalism | democratic-confederalism | `aliases: ['Libertarian Municipalism']` |
| Fourth Theory | integralism | `aliases: ['Fourth Theory']` |
| National Communism | national-bolshevism | `aliases: ['National Communism']` |
| National Syndicalism | strasserism | `aliases: ['National Syndicalism']` |
| Clerical Fascism | integralism | `aliases: ['Clerical Fascism']` |
| Islamic Theocracy | theocrat | `aliases: ['Islamic Theocracy']` |
| Labour Zionism | zionism | `aliases: ['Labour Zionism']` |
| Noocracy | technocratic-centralist | `aliases: ['Noocracy']` |
| Scientocracy | technocratic-centralist | `aliases: ['Scientocracy']` |

---

## Module-Trigger Impact Analysis

None of the 23 new labels are in any existing `triggerLabelIds` list. The `suggestModules` function performs heuristic proximity filtering — verify during integration testing that no new label produces a false-positive `moduleSuggestions` entry for a module outside its target family.

**Verification criterion:** A module is a false-positive if it appears in `moduleSuggestions` for a label whose family is not the module's target family AND the user would not plausibly want that module's subtype questions.

---

## Verification Plan

- **Static/lint/typecheck:** `npx tsc --noEmit`
- **Data validity:** `npx vitest run src/data/dataValidity.test.ts` (per wave)
- **Archetype sweep:** `npx vitest run src/scoring/archetype-sweep.test.ts` (after each wave/sub-cluster)
- **Per-label verification (after each wave):**
  ```
  # Document top-3 nearest labels and confidence margins
  npx vitest run src/scoring/archetype-sweep.test.ts -t <targetLabel>
  ```
- **Module reachability (Wave 2+):** Run `buildResultProfile` with a centroid-aligned fixture for each new label; inspect `moduleSuggestions` for false-positives.
- **`labelById` map:** Assert each new wave's IDs exist.
- **Family compatibility (pre-Wave-1):** Verify `buildResultProfile` does not crash with Indigenism's `indigenist` family.

## File Impact

| Path | Change | Risk |
|------|--------|------|
| `src/data/labels.ts` | Add ~18-23 new `IdeologyLabel` entries; add aliases to ~5-9 entries | Medium |
| `src/scoring/calibration.fixtures.ts` | Append new IDs to `targetIds` array | Low |
| `src/scoring/archetype-sweep.test.ts` | Add `NEAR_TIE_EXCEPTIONS` entries per sweep results | Low |
| `docs/ideology-expansion-backlog.md` | Status updates for implemented/downgraded/deferred entries | Low |

## Risk and Rollback

- **Risk: Centroid overfitting.** Mitigation: manual per-axis review + automated sanity check + sweep validation.
- **Risk: Validation invariant weakening.** Hard constraint: downgrade label instead of weakening invariants.
- **Risk: Module false-positive.** Mitigation: `suggestModules` integration test per wave.
- **Risk: Family fragmentation.** Verfied pre-Wave-1.
- **Risk: Batch failure.** Mitigated by wave isolation + per-wave sweep.
- **Rollback:** Per-wave rollback — revert labels from `labels.ts`, revert `targetIds`, revert exceptions. Each wave is independently revertible.

## Open Questions
- **None remaining.** All resolved during Architect + Critic review.

## Execution Recommendation
**ultragoal** — 4 serially-gated stories (one per wave) with checkpoints between each.

| Story | Description | Dependencies |
|-------|-------------|-------------|
| Story 1 | Wave 1 — distant anchors (add + sweep + gate) | None |
| Story 2 | Wave 2 — 3 family sub-clusters sequentially | Story 1 |
| Story 3 | Wave 3 — borderline candidates + failure-triage | Story 2 |
| Story 4 | Wave 4 — P2 aliases, documentation, final verification | Story 3 |

Status: **pending approval**
