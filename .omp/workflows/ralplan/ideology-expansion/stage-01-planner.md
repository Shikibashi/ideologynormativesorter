# Stage 01 — Planner: Ideology Label Expansion (32–62 new labels + 6 new fields)

## RALPLAN-DR Summary

### Principles
1. **Backward-compatible schema first.** All new interface fields are optional (`?`); existing labels compile with zero changes. No existing data is modified in shape, only enriched with new content.
2. **One pass, all labels.** Every existing label (88) gets the 6 new fields populated in the same commit — not a partial rollout. New labels (32–62) ship with full field population from inception.
3. **Centroid separability, not catalog depth.** A Polcompball entry earns independent label status only if its 26-axis centroid is plausibly distinct from existing labels within the same family. Dense clusters within 0.02 cosine similarity get documented near-tie exceptions.
4. **Existing-validation invariant priority.** No change weakens passing tests. The `dataValidity.test.ts` structural checks and the `archetype-sweep.test.ts` near-tie exception table expand rather than shift.
5. **No new axes, no question-bank changes.** The 26-axis system and question bank are read-only inputs to this work.

### Decision Drivers
1. **Label count gap:** 88 current → 120–150 target = 32–62 new labels. The Polcompball ideological subcategories (Anarchists, Conservatives, Environmentalists, Georgists, Internationalists, Liberals, Monarchists, Nationalists, Populists, Religious, Techno-Progressives, Welfarists) each contribute 3–8 distinct labels.
2. **Philosophy enrichment surface:** All 88 existing labels × 6 new fields = 528 field values minimum to write, plus the ~40 new labels × 6 = ~240 more. Philosophy data must be grounded in the 7 Philosophyball main branches (Ethics, Epistemology, Metaphysics, Logic, Aesthetics, Political Philosophy, Social Philosophy).
3. **Fixture + near-tie burden:** Each new label needs a calibration fixture. Dense clusters (green/eco, anarchist, authoritarian-nationalist) will likely produce near-tie exceptions that must be measured after centroid seeding, not pre-declared.
4. **Data entry scale:** The `labels.ts` file grows from 3282 lines to approximately 5000–5800 lines depending on centroid verbosity and per-label field depth.

### Viable Options

| Option | New Labels | Fields | Philosophy Enrichment | Total Effort | Risk |
|--------|-----------|--------|----------------------|-------------|------|
| **A — Maximal** | +62 (reach 150) | All 6 new fields on every label | Full per-label per-branch from Philosophyball | Highest data entry; ~25 new near-tie exceptions likely | Highest fixture density; may find inseparable clusters |
| **B — Curated-broad** | +42 (reach 130) | All 6 new fields on every label | Full per-label but skip philosophyInfluences on ~20 simple labels | Balanced; ~12–18 near-tie exceptions | Manageable; borderline candidates get aliases |
| **C — Minimal** | +32 (reach 120) | 4 new fields (skip layer-specific + philosophyInfluences on initial pass) | Only `philosophies` and `ethicalTheory` | Lowest per-label data burden | Leaves acceptance criteria incomplete per spec |

**Recommendation: Option A — Maximal**, provisionally. The spec requires all 6 fields on all labels. If centroid seeding reveals 5–8 candidates too close to existing labels, those become aliases (not independent labels), keeping the total count more realistic. If near-tie exceptions exceed 20, Option B governs as fallback: skip `philosophyInfluences` on the 20 simplest labels (those with only 2–3 philosophies).

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

  /** Structured mapping from each influencing philosophy to specific axis-score effects. */
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

### 2.2 New Labels from Polcompball Ideological Subcategories

**Target range: 32–62 new labels (88 → 120–150 total)**

Mine these Polcompball category pages:
- **Anarchists** — 9 existing. Potential additions: Queer Anarchism, Green Anarchism, Anarcho-Syndicalism (distinct from Syndicalist?), Platformism, Synthesis Anarchism. *Estimate: +3–5.*
- **Conservatives** — 8 existing. Potential additions: Fiscal Conservatism, Social Conservatism, National Conservatism (distinct from Paleoconservative?), Liberal Conservatism, Green Conservatism. *Estimate: +2–4.*
- **Environmentalists** — 4 existing (Green family). Potential additions: Ecomodernism (under technocratic, already exists), Green Capitalism, Eco-Socialism (exists), Bright Green Environmentalism. *Estimate: +2–3.*
- **Georgists** — 1 existing (Geolibertarian). Potential additions: Georgism (standalone label), Geonomics, Geoism. *Estimate: +1–2.*
- **Internationalists** — existing coverage via World Federalism, Cosmopolitanism. Potential additions: Internationalism, Anti-Imperialism. *Estimate: +1–2.*
- **Liberals** — 11 existing. Potential additions: Bleeding-Heart Libertarianism, Basic Income Liberalism, Neoclassical Liberalism, Radical Centrism. *Estimate: +2–4.*
- **Monarchists** — 2 existing (Absolute Monarchist, Neoreactionary). Potential additions: Constitutional Monarchist, Traditional Monarchist, Elective Monarchy. *Estimate: +2–3.*
- **Nationalists** — 8 existing. Potential additions: Expansionist Nationalism, Separatist Nationalism, Regionalism, Diaspora Nationalism. *Estimate: +2–4.*
- **Populists** — 2 existing. Potential additions: Agrarian Populism, Fiscal Populism, Cultural Populism. *Estimate: +1–2.*
- **Religious** — covered under conservative. Potential additions: Fundamentalist Theocracy, Liberation Theology, Political Islam (distinct from Islamic Democracy), Christian Reconstructionism. *Estimate: +3–5.*
- **Techno-Progressives/Transhumanists** — 5 existing (technocratic family). Potential additions: Dataism, Singularitarianism, Effective Accelerationism (e/acc), Futurism. *Estimate: +2–3.*
- **Welfarists** — limited existing (Social-Democratic family). Potential additions: Universal Basic Income Advocacy, Social Investment State, Post-Scarcity Welfare, Welfare Liberalism (existing under social-liberalism?). *Estimate: +2–3.*
- **Additionally**: Cross-cutting labels like Latvian? No — stick to scorable categories.

**Total estimate: ~23–42 from the above categories.** Possibly 32–62 if secondary Polcompball sub-subcategories are mined. The exact count depends on:
1. How many truly distinct centroids can be carved from each subcategory
2. Whether borderline entries become aliases vs independent labels
3. Whether cross-category entries (e.g., Green Anarchism sits in both Anarchist and Environmentalist) merge

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

*Note: The above is a pre-research target list. Actual label creation MUST verify centroid distinctiveness via the 26-axis system before committing to independent-label status.*

### 2.3 New Family Assessment

Existing families cover the current 88 labels well. For the expansion:
- **No new families needed for the first wave** — all candidate labels fit within existing 16 families.
- If a genuinely new ideological branch emerges (e.g., Zoroastrian Environmentalism), a new family could be added, but this is improbable.

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
```

---

## 6. Sequence & Dependencies

```
                          ┌──────────────────────┐
                          │ 0. Type definition    │
                          │ (label.ts — 6 fields) │
                          └──────────┬───────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                      ▼
  ┌──────────────────────┐ ┌──────────────────┐ ┌──────────────────────┐
  │ 1a. Enrich 88        │ │ 1b. Add new       │ │ 2. Add calibration  │
  │ existing labels      │ │ labels (32–62)    │ │ fixtures            │
  │ with all 6 fields    │ │ with all 6 fields │ │ (targetIds append)  │
  └──────────────────────┘ └──────────────────┘ └──────────┬───────────┘
            │                        │                      │
            └──────────┬─────────────┘                      │
                       ▼                                    │
              ┌──────────────────────┐                      │
              │ 3. Run sweep test    │◄─────────────────────┘
              │ → measure margins    │
              │ → register exceptions│
              └──────────┬───────────┘
                         ▼
              ┌──────────────────────┐
              │ 4. Add validation    │
              │ tests for new fields │
              └──────────┬───────────┘
                         ▼
              ┌──────────────────────┐
              │ 5. Full suite:       │
              │   tsc -b + vitest    │
              │   + npm run build    │
              └──────────────────────┘
```

**Parallelization:**
- `0` (type definition) must precede everything.
- `1a` (enrich existing) and `1b` (add new labels) are data-entry tasks that can be parallelized via sub-agents.
- `2` (fixtures) can run after `1b` is complete.
- `3` (sweep test) requires `1b` + `2`.
- `4` (validation tests) can run after `0` (the type exists) and be finalized after `1a` + `1b`.
- `5` (full suite) is the final gate.

---

## 7. Edge Cases & Pitfalls

| Pitfall | Mitigation |
|---------|-----------|
| New label centroid is nearly identical (≤0.01 cosine distance) to an existing label | Downgrade to alias under the existing label; document rationale |
| `philosophyInfluences.affectedAxes` contains a typo'd axis ID | Validation test catches this (must reference existent axes) |
| Layer-specific arrays include a philosophy not in `philosophies` | Validation test catches subset violation |
| `subTheories` duplicates `aliases` content | Acceptable overlap — `subTheories` = child variants, `aliases` = same-entity alternate names. Validation warns but does not fail |
| A new label passes sweep but causes an EXISTING label's fixture to no longer rank #1 | Investigate centroid proximity; the existing near-tie exception may need broadening |
| `tsc -b` reveals a type error in the new `philosophyInfluences` tuple type | Use inline `{philosophy: string; description: string; affectedAxes: AxisId[]}` (no named type needed) |
| 88 existing → 150 labels causes the `archtype-sweep.test.ts` iteration to slow down | Acceptable — each sweep is a single vitest describe block with ~150 `it()` calls; performance impact is negligible |
| Philosophyball enrichment yields 0 applicable entries for a given label | Use empty arrays `[]` consistently rather than omitting the field |
| A label's `ethicalTheory` list grows to 5+ items (many traditions blend multiple frameworks) | Acceptable — ethics frameworks can coexist; validation only checks array type |

---

## 8. Verification Steps

1. `npx tsc -b` — zero type errors with the expanded interface.
2. `npx vitest run src/data/dataValidity.test.ts` — all existing + new validation checks pass.
3. `npx vitest run src/scoring/archetype-sweep.test.ts` — every label resolves to #1 or documented near-tie exception.
4. `npx vitest run src/scoring/` — all scoring tests pass.
5. `npx vitest run src/data/` — all data validity + audit tests pass.
6. `npm run build` — clean production build.
7. Manual: spot-check 5 existing labels and 5 new labels in the scoring output for sanity.

---

## 9. Critical Files for Implementation

| File | Why It's Critical | What to Read |
|------|-------------------|-------------|
| `src/types/label.ts` | Interface definition — add 6 optional fields | Full file (32 lines) |
| `src/types/common.ts` | `AxisId` type import | Full file (15 lines) |
| `src/data/labels.ts` | All 3282 lines of label data — both enrichment target and insertion point | Full file; pattern: label entries are an array, each with `philosophies`, `centroid` (26 axes) |
| `src/scoring/calibration.fixtures.ts` | `targetIds` array + `createCentroidAlignedFixture` helper | Full file (142 lines) |
| `src/scoring/archetype-sweep.test.ts` | `NEAR_TIE_EXCEPTIONS` record + sweep iteration + anti-drift guard | Full file (163 lines) |
| `src/data/dataValidity.test.ts` | Validation tests — add new field checks | Full file (163 lines) |
| `src/data/audit.test.ts` | Corpus audit hook | Full file (11 lines) |
| `src/data/audit.ts` | Audit implementation (relies on labels length) | Full file (45 lines) |

---

## 10. Edge Cases for Implementers

1. **Empty arrays vs absent fields**: Be consistent. Prefer `subTheories: []` over absent field when the label has no known sub-theories. But `undefined` is also valid per optional typing. Recommendation: populate as `[]` for all labels (explicit) and only omit when the field is genuinely unknown.
2. **philosophyInfluences.affectedAxes**: Must reference real axis IDs from the 26-axis system. Use `AxisId` type (string literal union or branded type from `src/types/common.ts`). Validation test checks this.
3. **Layer separation**: `normativePhilosophies + descriptivePhilosophies + prescriptivePhilosophies` should be a partition of `philosophies` (each philosophy appears in at least one layer, possibly multiple). The validation test enforces subset but NOT partition — a philosophy can be in `philosophies` but not yet classified into a layer (backward-compatible).
4. **Family consistency**: All labels within a family share structural properties. A new label using a family name must be semantically consistent with existing entries in that family.
5. **Sub-theories vs aliases overlap**: Some entries may be in both (e.g., "Trotskyism" might be an alias of Marxist-Leninist AND a sub-theory). This is valid — aliases capture the same-entity relationship; subTheories capture child-of relationship.
6. **Near-tie exception registration timing**: Run the sweep test AFTER all labels + fixtures exist, measure actual margins, THEN register exceptions. Never pre-register.

---

*Generated: 2026-06-24 | PlannerAgent | Run ID: ideology-expansion*
