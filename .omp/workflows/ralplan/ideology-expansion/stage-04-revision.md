# Stage 04 — Revised Plan: Ideology Label Expansion

**Revision based on:** Planner (stage-01), Architect review (stage-02), Critic findings (stage-03)  
**Run ID:** ideology-expansion  
**Date:** 2026-06-24  

---

## RALPLAN-DR Summary

### Principles
1. **Backward-compatible schema first.** All new interface fields are optional (`?`); existing labels compile with zero changes. No existing data is modified in shape, only enriched with new content.
2. **One pass, all labels.** Every existing label (88) gets the 6 new fields populated in the same commit — not a partial rollout. New labels (32–62) ship with full field population from inception.
3. **Centroid separability, not catalog depth.** A Polcompball entry earns independent label status only if its 26-axis centroid is plausibly distinct from existing labels within the same family. A pre-screen step (0b) checks approximate cosine distance **before** full data entry: candidates within ≤0.03 of an existing centroid are marked alias candidates. Dense clusters within 0.02 cosine similarity get documented near-tie exceptions.
4. **Acceptance criteria gated on label count.** The expansion must meet a numeric floor (115) before it is considered viable; it targets a specific range (120–150); a soft cap (150) prevents unbounded mining. See the acceptance criteria table below.
5. **Existing-validation invariant priority.** No change weakens passing tests. The `dataValidity.test.ts` structural checks and the `archetype-sweep.test.ts` near-tie exception table expand rather than shift.
6. **No new axes, no question-bank changes.** The 26-axis system and question bank are read-only inputs to this work.

### Decision Drivers
1. **Label count gap:** 88 current → 115–150 target = 27–62 new labels, governed by the acceptance criteria below. The Polcompball ideological subcategories (Anarchists, Conservatives, Environmentalists, Georgists, Internationalists, Liberals, Monarchists, Nationalists, Populists, Religious, Techno-Progressives, Welfarists) each contribute 3–8 distinct labels. Actual count depends on centroid pre-screen results.
2. **Philosophy enrichment surface:** All 88 existing labels × 6 new fields = 528 field values minimum to write, plus the ~40 new labels × 6 = ~240 more. Philosophy data must be grounded in the 7 Philosophyball main branches (Ethics, Epistemology, Metaphysics, Logic, Aesthetics, Political Philosophy, Social Philosophy).
3. **Fixture + near-tie burden:** Each new label needs a calibration fixture. Dense clusters (green/eco, anarchist, authoritarian-nationalist) will likely produce near-tie exceptions that must be measured after centroid seeding, not pre-declared.
4. **Data entry scale:** The `labels.ts` file grows from 3282 lines to approximately 5000–5800 lines depending on centroid verbosity and per-label field depth.

### Acceptance Criteria — Label Count

| Criterion | Value | Rule |
|-----------|-------|------|
| **Floor** | **115** | Minimum viable count. If centroid pre-screen culls the candidate pool below 115 total labels, expand the candidate pool (mine additional Polcompball sub-subcategories) or add discriminating axes as a follow-up before accepting the PR. |
| **Target** | **120–130** | The ideal landing range. At 120+ labels with ≤33% near-tie exception density, the expansion is complete and the commit is ready for review. |
| **Cap** | **150** | Soft cap. Candidates that would push the total above 150 are downgraded to alias candidates (require evidence-based override to become full labels). Labels at or above target that exceed the cap enter the alias queue automatically — no new full-label data entry above 150 without explicit approval. |

**Pass condition:** Total label count ≥ 115 AND ≤ 150 AND near-tie exception density ≤ 33%.  
**Fallback:** If after centroid pre-screen the distinct count is < 115, file a follow-up for bank-level discriminating items before accepting the PR.

### Viable Options

| Option | New Labels | Fields | Philosophy Enrichment | Total Effort | Risk |
|--------|-----------|--------|----------------------|-------------|------|
| **A — Maximal** | +62 (reach 150) | All 6 new fields on every label | Full per-label per-branch from Philosophyball | Highest data entry; ~25 new near-tie exceptions likely | Highest fixture density; may find inseparable clusters |
| **B — Curated-broad** | +42 (reach 130) | All 6 new fields on every label | Full per-label but skip philosophyInfluences on ~20 simple labels | Balanced; ~12–18 near-tie exceptions | Manageable; borderline candidates get aliases |
| **C — Minimal** | +32 (reach 120) | 4 new fields (skip layer-specific + philosophyInfluences on initial pass) | Only `philosophies` and `ethicalTheory` | Lowest per-label data burden | Leaves acceptance criteria incomplete per spec |

**Recommendation: Option A — Maximal**, provisionally. The spec requires all 6 fields on all labels. If centroid seeding reveals 5–8 candidates too close to existing labels, those become aliases (not independent labels), keeping the total count more realistic. If near-tie exceptions exceed 20, Option B governs as fallback: skip `philosophyInfluences` on the 20 simplest labels (those with only 2–3 philosophies). If centroid pre-screen (step 0b) drops the distinct count below 115, file a follow-up for additional items before PR acceptance.

---

## 1. Schema Changes — `src/types/label.ts`

### Current Interface (10 fields)
```typescript
export interface IdeologyLabel {
  id: LabelId
  name: string
  family: string
  subfamily?: string
  centroid: Record<AxisId, number>
  description: string
  aliases?: string[]
  philosophies?: string[]
}
```

### New Interface (16 fields — 6 additions, all optional)
```typescript
export interface IdeologyLabel {
  id: LabelId
  name: string
  family: string
  subfamily?: string
  centroid: Record<AxisId, number>
  description: string
  aliases?: string[]
  philosophies?: string[]

  // NEW FIELDS (all optional, backward-compatible)
  /** Sub-ideology variants (e.g. Stalinism under Marxism-Leninism, Third Positionism under Fascism). Display-only. */
  subTheories?: string[]

  /** Normative ethics frameworks (deontology, consequentialism, virtue ethics, etc.). Display-only. */
  ethicalTheory?: string[]

  /** Philosophies primarily influencing normative (ought-to-be) commitments. Subset of `philosophies` with layer classification. */
  normativePhilosophies?: string[]

  /** Philosophies primarily influencing descriptive (what-is) beliefs about how the world works. */
  descriptivePhilosophies?: string[]

  /** Philosophies primarily influencing prescriptive (what-to-do) strategic and policy commitments. */
  prescriptivePhilosophies?: string[]

  /** Structured mapping from each influencing philosophy to specific axis-score effects.
   *  @remark This is display-only; not consumed by the scoring engine. */
  philosophyInfluences?: Array<{
    philosophy: string
    description: string
    /** Axis IDs this philosophy affects, with directional hint in description. */
    affectedAxes: AxisId[]
  }>
}
```

**Key design decisions:**
- `AxisId` is imported from `../types/common` (already exists).
- `philosophyInfluences` uses inline tuple-like object, not a named type — keeps the type file compact; only one interface is modified.
- `normativePhilosophies`, `descriptivePhilosophies`, `prescriptivePhilosophies` are subsets of `philosophies` with layer classification — they SHOULD be proper subsets (enforced in validation test).
- `subTheories` overlaps with `aliases` conceptually but captures sub-ideology *variants* (closely related) vs `aliases` capturing *cross-referenced names* (same label). Implementation note: `subTheories` = intra-family children, `aliases` = same-entity alternate names.

---

## 2. Label Data Expansion — `src/data/labels.ts`

### 2.1 Philosophy Enrichment of All 88 Existing Labels

Every existing label gets these fields populated:

| Field | Source | Content Pattern |
|-------|--------|-----------------|
| `subTheories` | Polcompball sub-category pages | Array of sub-ideology names that are distinct but closely related (e.g. `Stalinism`, `Maoism`, `Hoxhaism`, `Titoism` under Marxism-Leninism) |
| `ethicalTheory` | Philosophyball Ethics branch | `['Deontology']`, `['Consequentialism']`, `['Virtue Ethics']`, or combinations; sourced from the label's philosophical tradition |
| `normativePhilosophies` | Philosophyball Political Philosophy + Ethics | Subset of philosophies array indicating which shape normative commitments |
| `descriptivePhilosophies` | Philosophyball Epistemology + Social Philosophy | Subset of philosophies array indicating which shape empirical beliefs |
| `prescriptivePhilosophies` | Philosophyball Aesthetics + Logic + Applied Philosophy | Subset of philosophies array indicating which shape strategic/policy preferences |
| `philosophyInfluences` | All Philosophyball branches | 2–5 entries per label mapping philosophy → description → affected axes |

**Example enrichment for `egalitarian-statist`:**
```typescript
{
  // ... existing fields unchanged ...
  subTheories: ['Fabian Socialism', 'Bernsteinian Revisionism'],
  ethicalTheory: ['Consequentialism', 'Welfare Utilitarianism'],
  normativePhilosophies: ['Marxism', 'Socialism', 'Social Democracy'],
  descriptivePhilosophies: ['Marxism', 'Reformism'],
  prescriptivePhilosophies: ['Reformism', 'Social Democracy'],
  philosophyInfluences: [
    {
      philosophy: 'Marxism',
      description: 'Provides the critique of capitalist exploitation and the framework for collective ownership of production.',
      affectedAxes: ['property-legitimacy', 'equality-theory', 'redistribution-vs-predistribution']
    },
    {
      philosophy: 'Social Democracy',
      description: 'Provides the reformist institutional strategy and commitment to parliamentary transformation.',
      affectedAxes: ['reform-vs-revolution', 'electoralism-vs-direct-action', 'gradualism-vs-immediatism']
    },
    {
      philosophy: 'Reformism',
      description: 'Rejects revolutionary rupture in favor of incremental institutional change through existing structures.',
      affectedAxes: ['reform-vs-revolution', 'compromise-vs-persistence', 'coercion-strategy']
    }
  ]
}
```

> **Note on content accuracy:** Enrichment values represent plausible centroid-aligned interpretations drawn from Polcompball and Philosophyball wiki content, not polled empirical truth. Inaccurate assignments (e.g., a label with wrong `ethicalTheory`) would pass all structural validation tests — only human review can catch this. See Section 9 (Verification) for the spot-check protocol.

#### Data-Entry Conventions for Enrichment Consistency

To ensure consistency across all 88 existing labels (and new labels), follow these conventions:

1. **Family-consistent base values**: Each family has a default set of philosophies that every label in that family inherits. For example:
   - All `socialist`-family labels include `'Marxism'` in `philosophies` and `normativePhilosophies`.
   - All `conservative`-family labels include `'Conservatism'` in `philosophies`.
   - These defaults expand per label with additional specific entries.
2. **Empty arrays, not omission**: When a label has no known entries for a field, use `[]` (not `undefined`). Only use `undefined` when the field is genuinely unknown/unresearched. This makes consistent which labels have been reviewed vs. not.
3. **Similar labels, similar values**: If `neo-classical-liberalism` gets `ethicalTheory: ['Consequentialism']`, then `classical-liberalism` must also get a consistent value (either the same or a documented deviation in comment). Borderline cases: author flags with `// TODO: verify` for reviewer resolution.
4. **Layer arrays are subsets, then coverage**: Every entry in `normativePhilosophies`, `descriptivePhilosophies`, `prescriptivePhilosophies` must exist in the label's `philosophies` array (validated). Aim for full coverage (every philosophy assigned to at least one layer), but subset-only is valid for the initial pass.
5. **Single-responsibility adjudication**: The author enriches, the reviewer verifies. If a label presents a borderline case (e.g., a philosophy that could be normative or prescriptive), the author makes the call and the reviewer challenges or accepts. Document the rationale in a PR comment.

### 2.2 New Labels from Polcompball Ideological Subcategories

**Target range: 27–62 new labels (88 → 115–150 total) governed by acceptance criteria above.**

#### Step 0b — Centroid Pre-Screen (mandatory before full data entry)

For each candidate label from the pool below, perform this pre-screen **before** investing in full field enrichment:

1. **Derive a coarse centroid estimate** from Polcompball category metadata or by assigning approximate values on the 26 axes. This does not require the full centroid precision of a production label — a ±0.05 approximation on key axes is sufficient.
2. **Compute approximate cosine distance** between the candidate's coarse centroid and the nearest existing label centroid within the same family.
3. **Decision:**
   - **Distance > 0.03** → proceed to full data entry (potential new full label).
   - **Distance ≤ 0.03** → mark as **alias candidate** (downgrade to alias under the nearest existing label unless an evidence-based override is filed — a documented justification that the candidate is semantically separable despite centroid proximity).
4. **Record pre-screen results** in a working file (`local://ideology-expansion/centroid-pre-screen.md`) so that the rationale for alias-vs-label decisions is auditable.

> **Why this step exists:** Data entry is the dominant cost (~2000+ new lines in labels.ts). Without a pre-screen, the implementer invests in full enrichment (528+ field values) for candidates that later fail the sweep test's distinctness check. The pre-screen uses coarse estimation to filter non-viable candidates cheaply.

**Mining targets (candidate pool):**

- **Anarchists** — 9 existing. Candidates: Queer Anarchism, Green Anarchism, Anarcho-Syndicalism (distinct from Syndicalist?), Platformism, Synthesis Anarchism. *Estimate: +3–5.*
- **Conservatives** — 8 existing. Candidates: Fiscal Conservatism, Social Conservatism, National Conservatism (distinct from Paleoconservative?), Liberal Conservatism, Green Conservatism. *Estimate: +2–4.*
- **Environmentalists** — 4 existing (Green family). Candidates: Ecomodernism (under technocratic, already exists), Green Capitalism, Eco-Socialism (exists), Bright Green Environmentalism. *Estimate: +2–3.*
- **Georgists** — 1 existing (Geolibertarian). Candidates: Georgism (standalone label), Geonomics, Geoism. *Estimate: +1–2.*
- **Internationalists** — existing coverage via World Federalism, Cosmopolitanism. Candidates: Internationalism, Anti-Imperialism. *Estimate: +1–2.*
- **Liberals** — 11 existing. Candidates: Bleeding-Heart Libertarianism, Basic Income Liberalism, Neoclassical Liberalism, Radical Centrism. *Estimate: +2–4.*
- **Monarchists** — 2 existing (Absolute Monarchist, Neoreactionary). Candidates: Constitutional Monarchist, Traditional Monarchist, Elective Monarchy. *Estimate: +2–3.*
- **Nationalists** — 8 existing. Candidates: Expansionist Nationalism, Separatist Nationalism, Regionalism, Diaspora Nationalism. *Estimate: +2–4.*
- **Populists** — 2 existing. Candidates: Agrarian Populism, Fiscal Populism, Cultural Populism. *Estimate: +1–2.*
- **Religious** — covered under conservative. Candidates: Fundamentalist Theocracy, Liberation Theology, Political Islam (distinct from Islamic Democracy), Christian Reconstructionism. *Estimate: +3–5.*
- **Techno-Progressives/Transhumanists** — 5 existing (technocratic family). Candidates: Dataism, Singularitarianism, Effective Accelerationism (e/acc), Futurism. *Estimate: +2–3.*
- **Welfarists** — limited existing (Social-Democratic family). Candidates: Universal Basic Income Advocacy, Social Investment State, Post-Scarcity Welfare, Welfare Liberalism (existing under social-liberalism?). *Estimate: +2–3.*

**Total candidate pool: ~23–42 from listed categories.** The range can expand to 32–62 if:
1. Centroid pre-screen confirms most candidates are distinct (distance > 0.03)
2. Secondary Polcompball sub-subcategories are mined after exhausting the primary targets
3. Cross-category entries (e.g., Green Anarchism sits in both Anarchist and Environmentalist) remain separable

**Family assignment for new labels:**

| Candidate Label | Family | Subfamily | Note |
|----------------|--------|-----------|------|
| Anarcho-Syndicalism | anarchist | social-anarchist | Split from Syndicalist if centroid distinct |
| Platformism | anarchist | social-anarchist | |
| Synthesis Anarchism | anarchist | pluralist-anarchist | |
| Queer Anarchism | anarchist | social-anarchist | |
| Green Anarchism | anarchist | anti-civilization | |
| Fiscal Conservatism | conservative | fiscal-conservative | |
| Social Conservatism | conservative | social-conservative | |
| National Conservatism | conservative | national-conservative | New subfamily |
| Liberal Conservatism | conservative | conservative-liberal | |
| Green Conservatism | conservative | green-conservative | |
| Bright Green Environmentalism | green | techno-green | |
| Green Capitalism | green | market-green | |
| Georgism | libertarian-leaning | geoist-market | Split from Geolibertarian |
| Geonomics | libertarian-leaning | geoist-market | |
| Internationalism | liberal | internationalist | |
| Anti-Imperialism | socialist | internationalist | |
| Bleeding-Heart Libertarianism | libertarian-leaning | civil-libertarian | |
| Basic Income Liberalism | liberal | welfare-liberal | |
| Radical Centrism | liberal | centrist | |
| Constitutional Monarchist | authoritarian | monarchist-reactionary | |
| Traditional Monarchist | authoritarian | monarchist-reactionary | |
| Elective/Mixed Monarchy | conservative | traditional-monarchist | |
| Separatist Nationalism | nationalist | subnational | |
| Expansionist Nationalism | nationalist | imperial-national | |
| Regionalism | nationalist | subnational | |
| Agrarian Populism | populist | left-populist | |
| Cultural Populism | populist | right-populist | |
| Fundamentalist Theocracy | conservative | religious-conservative | |
| Liberation Theology | socialist | democratic-market-socialist | |
| Political Islam | conservative | islamic-democratic | |
| Christian Reconstructionism | conservative | religious-conservative | |
| Dataism | technocratic | cyberocratic | |
| Singularitarianism | technocratic | techno-progressive | |
| Effective Accelerationism (e/acc) | technocratic | accelerationist | |
| Universal Basic Income Advocacy | social-democratic | welfare-liberal | |
| Social Investment State | social-democratic | reformist-welfare | |
| Post-Scarcity Welfare | technocratic | techno-progressive | |

*Note: The above is a pre-research target list. Actual label creation MUST pass the centroid pre-screen (step 0b) before committing to independent-label status.*

### 2.3 New Family Assessment

Existing families cover the current 88 labels well. For the expansion:
- **No new families needed for the first wave** — all candidate labels fit within existing 16 families.
- If a genuinely new ideological branch emerges (e.g., Zoroastrian Environmentalism), a new family could be added, but this is improbable.

### 2.4 External Dependency: Polcompball and Philosophyball

> **Acknowledged live dependencies:** The data sources for both label candidates and philosophy enrichment are the Polcompball wiki (for ideological subcategories) and Philosophyball wiki (for philosophical tradition mapping). These are external wiki pages that could change, restructure, or become unavailable.
>
> **Mitigations:**
> 1. **Before data entry begins**, capture specific URLs and snapshot the relevant pages (save as local markdown or archive). A source inventory file (`local://ideology-expansion/source-inventory.md`) records the exact URLs, access date, and page structure notes.
> 2. **If a primary source is unavailable** during implementation, use secondary sources (Stanford Encyclopedia of Philosophy, Internet Encyclopedia of Philosophy) and mark the substitution in comments with a `// source: SEP 2026-06` convention.
> 3. These sources are **read once** during enrichment — the data entered into `labels.ts` is pinned, not dynamically fetched. Source unavailability after data entry is not a runtime risk.

---

## 3. Calibration Fixtures — `src/scoring/calibration.fixtures.ts`

### Change
1. Append new label IDs to the `targetIds` array (after the last existing entry, `'anarcha-feminism'`).
2. The existing `createCentroidAlignedFixture(targetLabel)` function automatically generates fixtures for any ID in `targetIds`.
3. `allCalibrationFixtures` (the test suite's fixture source) is computed from `targetIds` → the sweep test auto-covers new labels.

### Potential near-tie hotspots requiring post-seeding exception registration:
- Anarchist cluster: new entries near existing anarcho-communist, mutualist, individualist-anarchism
- Green cluster: Bright Green near Ecomodernist, Green Capitalism near Market Socialist
- Religious cluster: Fundamentalist Theocracy near Theocrat, Political Islam near Islamic Democracy
- Monarchist cluster: Constitutional Monarchist between Christian Democrat and Absolute Monarchist
- Conservative cluster: National Conservatism near Paleoconservatism

---

## 4. Near-Tie Exceptions — `src/scoring/archetype-sweep.test.ts`

### Change
Add entries to `NEAR_TIE_EXCEPTIONS` for any new label whose centroid-aligned fixture does not rank #1. Follow the existing pattern:

```typescript
'green-capitalism': { tiesWith: ['market-socialist', 'ecomodernist'], maxMargin: 0.02 },
'political-islam': { tiesWith: ['islamic-democracy', 'theocrat'], maxMargin: 0.02 },
```

Note: `NEAR_TIE_EXCEPTIONS` is registered at the END, after running the sweep test and measuring actual margins. NEVER pre-register hypothetical ties.

Also: add the existing `'every label has a calibration archetype'` anti-drift guard in the sweep test, which already prevents a label from existing without a fixture. This guard automatically extends to new labels.

---

## 5. Validation Tests — `src/data/dataValidity.test.ts`

### New validation blocks to add inside the existing `describe('labels', ...)` block

```typescript
it('each label has valid subTheories (non-null own-property if present)', () => {
  for (const label of labels) {
    if (label.subTheories !== undefined) {
      expect(Array.isArray(label.subTheories)).toBe(true)
      for (const t of label.subTheories) expect(typeof t).toBe('string')
    }
  }
})

it('each label has valid ethicalTheory entries (non-null own-property if present)', () => {
  for (const label of labels) {
    if (label.ethicalTheory !== undefined) {
      expect(Array.isArray(label.ethicalTheory)).toBe(true)
      for (const e of label.ethicalTheory) expect(typeof e).toBe('string')
    }
  }
})

it('layer-specific philosophy arrays are proper subsets of philosophies', () => {
  for (const label of labels) {
    const philosophies = label.philosophies ?? []
    for (const layer of ['normativePhilosophies', 'descriptivePhilosophies', 'prescriptivePhilosophies'] as const) {
      const arr = label[layer] ?? []
      for (const p of arr) {
        expect(philosophies.includes(p),
          `${label.id}: ${p} in ${layer} but not in philosophies`
        ).toBe(true)
      }
    }
  }
})

it('philosophyInfluences entries reference valid philosophies and existent axes', () => {
  const axisIds = new Set(axes.map(a => a.id))
  for (const label of labels) {
    for (const influence of label.philosophyInfluences ?? []) {
      expect(typeof influence.philosophy).toBe('string')
      expect(typeof influence.description).toBe('string')
      expect(Array.isArray(influence.affectedAxes)).toBe(true)
      for (const axisId of influence.affectedAxes) {
        expect(axisIds.has(axisId),
          `${label.id}: philosophyInfluence ${influence.philosophy} references unknown axis ${axisId}`
        ).toBe(true)
      }
    }
  }
})

it.todo('philosophy layer classification coverage — every philosophy in philosophies appears in at least one layer array')
```

> **Content accuracy spot-check** (added per P1-1): Add a separate test block `describe('philosophy enrichment accuracy', ...)` that samples 10–15 labels from diverse families and asserts known ground-truth values. Example:
> ```typescript
> it('social-democrat includes "Social Democracy" in normativePhilosophies', () => {
>   expect(labelById('social-democrat').normativePhilosophies).toContain('Social Democracy')
> })
> ```
> These are not exhaustive — they serve as regression guards against accidental field drift. The implementer populates assertions for labels they enrich. A human reviewer verifies enrichment for 5 labels from different families before PR acceptance.

---

## 6. Sequence & Dependencies

```
                          ┌──────────────────────────────────┐
                          │ 0. Type definition               │
                          │ (label.ts — 6 fields)            │
                          └────────────────┬─────────────────┘
                                           │
                          ┌────────────────┴─────────────────┐
                          │ 0a. Source inventory             │
                          │ (snapshot Polcompball +          │
                          │  Philosophyball URLs)            │
                          └────────────────┬─────────────────┘
                                           │
                          ┌────────────────┴─────────────────┐
                          │ 0b. CENTROID PRE-SCREEN          │ ◄── NEW: P0-2
                          │ For each candidate label:        │
                          │ 1. Coarse centroid estimate      │
                          │ 2. Cosine distance to nearest    │
                          │    existing same-family centroid │
                          │ 3. Distance > 0.03 → survivor    │
                          │    Distance ≤ 0.03 → alias       │
                          │ 4. Record results in             │
                          │    centroid-pre-screen.md        │
                          └────────────────┬─────────────────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              ▼                            ▼                            ▼
  ┌────────────────────────┐ ┌────────────────────────┐ ┌──────────────────────────┐
  │ 1a. Enrich 88          │ │ 1b. Add new labels     │ │ 2. Add calibration       │
  │ existing labels        │ │ (survivors of pre-     │ │ fixtures (targetIds      │
  │ with all 6 fields      │ │ screen only) with      │ │ append)                  │
  │                        │ │ all 6 fields           │ │                          │
  └────────────────────────┘ └────────────────────────┘ └───────────┬──────────────┘
            │                              │                         │
            └──────────────┬───────────────┘                         │
                           ▼                                         │
              ┌────────────────────────────┐                         │
              │ 3. Run sweep test          │◄────────────────────────┘
              │ → measure margins          │
              │ → register exceptions      │
              │ → verify existing fixtures │
              │   still rank #1            │
              └──────────────┬─────────────┘
                             ▼
              ┌────────────────────────────┐
              │ 4. Add validation tests    │
              │ for new fields             │
              │ + content spot-check       │
              └──────────────┬─────────────┘
                             ▼
              ┌────────────────────────────┐
              │ 5. Full suite:             │
              │   tsc -b + vitest          │
              │   + npm run build          │
              └────────────────────────────┘
```

**Parallelization:**
- `0` (type definition) must precede everything.
- `0a` (source inventory) can run in parallel with `0`.
- `0b` (centroid pre-screen) must follow `0a` (sources known) and proceed before `1a`/`1b`.
- `1a` (enrich existing) and `1b` (add new labels) are data-entry tasks that can be parallelized via sub-agents. Both run **only after** the centroid pre-screen has identified survivors.
- `2` (fixtures) can run after `1b` is complete.
- `3` (sweep test) requires `1b` + `2`.
- `4` (validation tests) can run after `0` (the type exists) and be finalized after `1a` + `1b`.
- `5` (full suite) is the final gate.

---

## 7. Edge Cases & Pitfalls

| Pitfall | Mitigation |
|---------|-----------|
| New label centroid is nearly identical (≤0.03 cosine distance) to an existing label → culled by pre-screen | Downgrade to alias under the existing label; document rationale in pre-screen record. Evidence-based override available. |
| Centroid pre-screen culls too many candidates, pushing total below floor (115) | Expand candidate pool by mining secondary sub-subcategories, OR file follow-up for bank-level discriminating items. Do not accept the PR below floor. |
| `philosophyInfluences.affectedAxes` contains a typo'd axis ID | Validation test catches this (must reference existent axes) |
| Layer-specific arrays include a philosophy not in `philosophies` | Validation test catches subset violation |
| `subTheories` duplicates `aliases` content | Acceptable overlap — `subTheories` = child variants, `aliases` = same-entity alternate names. Validation warns but does not fail |
| A new label passes sweep but causes an EXISTING label's fixture to no longer rank #1 | The sweep test iterates ALL fixtures including existing ones — this is automatically caught. The existing near-tie exception may need broadening |
| `tsc -b` reveals a type error in the new `philosophyInfluences` tuple type | Use inline `{philosophy: string; description: string; affectedAxes: AxisId[]}` (no named type needed) |
| 88 existing → 150 labels causes the `archetype-sweep.test.ts` iteration to slow down | Acceptable — each sweep is a single vitest describe block with ~150 `it()` calls; performance impact is negligible |
| Philosophyball enrichment yields 0 applicable entries for a given label | Use empty arrays `[]` consistently rather than omitting the field |
| A label's `ethicalTheory` list grows to 5+ items (many traditions blend multiple frameworks) | Acceptable — ethics frameworks can coexist; validation only checks array type |
| Polcompball or Philosophyball wiki is unavailable during implementation | Fall back to secondary sources (SEP, IEP); mark substitutions in comments (`// source: SEP 2026-06`) |
| Inconsistent enrichment values across similar labels (e.g., two liberal labels diverge on `ethicalTheory` for no principled reason) | Follow data-entry conventions (Section 2.1): family-consistent base values, similar-labels rule, reviewer challenge |

---

## 8. Content Accuracy — Spot-Check Protocol

The validation tests in Section 5 verify structural correctness (types, subsets, axis references) but cannot verify semantic accuracy. To guard against "structurally valid but factually wrong" enrichment:

1. **Author asserts ground-truth values** for 10–15 labels across diverse families in `dataValidity.test.ts` (see content spot-check example in Section 5).
2. **Human reviewer verifies enrichment** for 5 labels from different families before PR acceptance. The reviewer checks:
   - Does the `ethicalTheory` value match the label's philosophical tradition?
   - Are the layer-classified philosophies (`normative`/`descriptive`/`prescriptive`) reasonably assigned?
   - Do `philosophyInfluences` descriptions plausibly connect the philosophy to the stated axes?
3. **Discrepancies** are flagged as PR comments and resolved before merge. This is not an exhaustive audit — it is a quality gate for the most subjective enrichment decisions.

---

## 9. Verification Steps

1. `npx tsc -b` — zero type errors with the expanded interface.
2. `npx vitest run src/data/dataValidity.test.ts` — all existing + new validation checks pass.
3. `npx vitest run src/scoring/archetype-sweep.test.ts` — every label resolves to #1 or documented near-tie exception.
4. `npx vitest run src/scoring/` — all scoring tests pass.
5. `npx vitest run src/data/` — all data validity + audit tests pass.
6. `npm run build` — clean production build.
7. Content spot-check: run `npx vitest run src/data/dataValidity.test.ts -t "philosophy enrichment accuracy"` — the ground-truth assertions pass.
8. Review gate: human verifies enrichment for 5 labels from different families.
9. Final count check: total label count ≥ 115 AND ≤ 150 AND near-tie exception density ≤ 33%.

---

## 10. Critical Files for Implementation

| File | Why It's Critical | What to Read |
|------|-------------------|-------------|
| `src/types/label.ts` | Interface definition — add 6 optional fields | Full file (32 lines) |
| `src/types/common.ts` | `AxisId` type import | Full file (15 lines) |
| `src/data/labels.ts` | All 3282 lines of label data — both enrichment target and insertion point | Full file; pattern: label entries are an array, each with `philosophies`, `centroid` (26 axes) |
| `src/scoring/calibration.fixtures.ts` | `targetIds` array + `createCentroidAlignedFixture` helper | Full file (142 lines) |
| `src/scoring/archetype-sweep.test.ts` | `NEAR_TIE_EXCEPTIONS` record + sweep iteration + anti-drift guard | Full file (163 lines) |
| `src/data/dataValidity.test.ts` | Validation tests — add new field checks + content spot-check | Full file (163 lines) |
| `src/data/audit.test.ts` | Corpus audit hook | Full file (11 lines) |
| `src/data/audit.ts` | Audit implementation (relies on labels length) | Full file (45 lines) |

---

## 11. Edge Cases for Implementers

1. **Empty arrays vs absent fields**: Be consistent. Prefer `subTheories: []` over absent field when the label has no known sub-theories. But `undefined` is also valid per optional typing. Recommendation: populate as `[]` for all labels (explicit) and only omit when the field is genuinely unknown.
2. **philosophyInfluences.affectedAxes**: Must reference real axis IDs from the 26-axis system. Use `AxisId` type (string literal union or branded type from `src/types/common.ts`). Validation test checks this.
3. **Layer separation**: `normativePhilosophies + descriptivePhilosophies + prescriptivePhilosophies` should be a partition of `philosophies` (each philosophy appears in at least one layer, possibly multiple). The validation test enforces subset but NOT partition — a philosophy can be in `philosophies` but not yet classified into a layer (backward-compatible). A `.todo` test tracks coverage gaps for future hardening.
4. **Family consistency**: All labels within a family share structural properties. A new label using a family name must be semantically consistent with existing entries in that family.
5. **Sub-theories vs aliases overlap**: Some entries may be in both (e.g., "Trotskyism" might be an alias of Marxist-Leninist AND a sub-theory). This is valid — aliases capture the same-entity relationship; subTheories capture child-of relationship.
6. **Near-tie exception registration timing**: Run the sweep test AFTER all labels + fixtures exist, measure actual margins, THEN register exceptions. Never pre-register.
7. **Centroid pre-screen recording**: Keep the pre-screen results in a working file so the alias-vs-label decisions are auditable. The pre-screen uses coarse estimates — a candidate that passes pre-screen may still fail the full sweep test (which uses production-precision centroids). That is acceptable: the pre-screen filters the obvious non-separable cases cheaply, and the sweep test catches the borderline ones.
8. **Existing fixture non-regression**: The sweep test automatically validates that existing labels still rank #1 (or within documented near-tie margins) after new centroids are added. If an existing fixture fails, investigate and broaden its near-tie exception.

---

## 12. P0-P1 Findings Closure Summary

| Finding | Severity | Disposition |
|---------|----------|-------------|
| **P0-1: No numeric acceptance criterion for label count** | P0 | **RESOLVED.** Added floor (115), target (120–130), cap (150) with explicit pass condition and fallback. See Acceptance Criteria table in RALPLAN-DR Summary. |
| **P0-2: Centroid distinctness checked too late** | P0 | **RESOLVED.** Added step 0b (Centroid Pre-Screen) before full data entry. Approximate cosine distance threshold (≤0.03 → alias candidate). Sequence diagram updated. |
| **P1-1: No content-accuracy verification** | P1 | **RESOLVED.** Added content spot-check protocol: ground-truth assertions in `dataValidity.test.ts` + human review gate for 5 labels from different families. See Section 8. |
| **P1-2: Polcompball/Philosophyball as unstated live dependencies** | P1 | **RESOLVED.** Added explicit acknowledgment with source inventory step, fallback to secondary sources, and URL-snapshotting requirement. See Section 2.4. |
| **P1-3: Inconsistent enrichment across 88 labels** | P1 | **RESOLVED.** Added data-entry conventions: family-consistent base values, empty-arrays rule, similar-labels rule, adjudication process. See Section 2.1 (Data-Entry Conventions). |
| P2-1: philosophyInfluences ambiguity | P2 | **ADDRESSED.** Added `@remark display-only` doc comment on the field. See Section 1. |
| P2-2: Partition semantics weakly enforced | P2 | **ADDRESSED.** Added `.todo` test for coverage gaps. See Section 5. |

---

*Generated: 2026-06-24 | ReviserAgent | Run ID: ideology-expansion*
