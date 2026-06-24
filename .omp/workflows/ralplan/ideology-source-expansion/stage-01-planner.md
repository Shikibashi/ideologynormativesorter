# Pending Approval Plan: Ideology Source Expansion

## RALPLAN-DR Summary

### Principles
1. **Centroid distinctiveness over source recognizability.** A candidate earns independent label status only when its 26-axis centroid is separable from existing labels — not because it appears in Polcompball or Philosophyball.
2. **Existing-validation invariant priority.** No change may weaken passing data validity tests, archetype-sweep coverage, or scoring invariants to accommodate a new label.
3. **Smallest additive unit.** Each label + fixture lands as the smallest independently testable addition; dense clusters get extra fixtures.
4. **Fail gracefully, document explicitly.** P1 candidates that fail separability or validation under the moderate gate are downgraded to P2 aliases with a parent link, or deferred with written rationale — never silently dropped.
5. **P2 alias-first scope.** P2 candidates are display-only aliases unless representative fixture evidence justifies a full module-resolved outcome, which is out of scope for this first pass.

### Decision Drivers
1. **Backlog gap completeness** — 25 P1 candidates from the curated backlog remain absent from `src/data/labels.ts`; the first-order decision is which pass the independent-label test.
2. **Annotation burden** — Each independent label needs a 26-axis centroid (normative, descriptive, prescriptive) seeded by LLM from wiki descriptions, plus manual review per axis for correctness and separability.
3. **Dense cluster risk** — Several clusters (green/eco, authoritarian/nationalist, democratic/municipalist) will see multiple new entries that risk near-ties requiring registered exceptions and extra fixtures.

### Viable Options
- **Option A — Add all 25 as independent P1 labels** (maximal). Pros: complete coverage, no deferral debt. Cons: likely forces 5–8 near-tie exceptions; high fixture burden; some candidates (Fourth Theory, Strasserism, Cyberocracy) may lack sufficient axis-separability from existing labels.
- **Option B — Add ~18 P1 labels, downgrade 7 to P2 aliases** (recommended). Pros: defensible centroid distinctiveness for the strong candidates; weaker or too-close candidates become cheap aliases under sensible parents. Cons: requires defensible per-candidate rationale for each downgrade; some users familiar with these ideologies may question downgrade decisions.
- **Option C — Add only the 7 most-distant candidates, defer the rest** (minimal). Pros: lowest validation risk, smallest fixture load. Cons: leaves the remaining backlog gap unresolved for another pass; acceptance criteria would not be met.

**Recommendation: Option B.** The interview spec explicitly requires "remaining high-confidence P1 gaps" to be processed, with a downgrade/defer escape hatch for candidates that fail separability. The plan below implements that hybrid — independent labels for defensibly distinct entries, aliases for borderline cases.

---

## Objective
Implement a bounded expansion of `src/data/labels.ts` that adds ~18 new independent P1 ideology labels with full 26-axis centroids, adds their baseline archetype/calibration coverage, adds 7 P2 alias entries under existing or new parent labels, and records rationales for any downgrades or deferrals — all without weakening existing validation invariants.

## Current Evidence
- `src/data/labels.ts`: 53 existing `IdeologyLabel` entries with id, name, family, subfamily, description, centroid (26 axes), and optional aliases. Every label has a unique centroid that enables nearest-label distance matching.
- `src/types/label.ts`: `IdeologyLabel` interface — centroid is `Record<AxisId, number>`, aliases are `string[]`.
- `src/data/axes.ts`: 26 axes across 3 layers — 10 normative, 7 descriptive, 9 prescriptive.
- `src/scoring/calibration.fixtures.ts`: `CalibrationFixture[]` with `createCentroidAlignedFixture` helper. 53 fixtures covering all existing labels. Test helper `targetIds` array.
- `src/scoring/archetype-sweep.test.ts`: Iterates `allCalibrationFixtures`, asserts each label's archetype resolves to itself or is in a documented near-tie. Also asserts every label has a fixture (anti-drift guard: `labels.map(l => l.id).filter(id => !covered.has(id))` must be empty).
- `src/data/dataValidity.test.ts`: Validates label structure — no duplicate IDs, all axes referenced, valid centroids, valid family/subfamily strings.
- `docs/ideology-expansion-backlog.md`: Curated source boundary. 25 P1 candidates not yet in labels.ts, 7 P2 alias/subtype entries.
- `src/data/factionModules.ts`: 14 modules with triggerLabelIds and subtypeLabelIds. Existing P2 entries like `technocracy` are already aliases under `technocratic-centralist`.

## Non-Goals
- No new scoring axes or modifications to the 26-axis structure.
- No broad UI redesign, question-bank changes, or share/meta changes.
- No Philosophyball or Polcompball raw import — backlog is the sole source boundary.
- No P2 module-resolved outcomes unless triggered by strong fixture evidence (deferred to a later pass).
- No changes to `src/data/questions.ts` or `src/data/moduleQuestions.ts`.
- No changes to `src/scoring/labelMatch.ts` or `src/scoring/index.ts`.
- No new validation tests beyond those needed for the new data.
- No weakening of existing `NEAR_TIE_EXCEPTIONS` or `MAX_MARGIN` values.

## Implementation Plan

### Step 1: P1 Candidate Assessment — Independent vs Downgrade vs Defer

For each of the 25 remaining P1 backlog candidates, assess centroid distinctiveness by evaluating the 26-axis profile relative to the nearest existing label(s). Use the following decision framework:

**P1 → Independent Label** (when the centroid is plausibly distinct from any existing label):
Eco-Authoritarianism, Eco-Fascism, Bioregionalism, Democratic Confederalism, Paleoconservatism, One-Nation Conservatism, National Bolshevism, Strasserism, Integralism, Islamic Democracy, Hindutva, Religious Nationalism, Zionism, Panarchism, Liquid Democracy, Cyberocracy, Accelerationism, Juche, Guild Socialism, Techno-Anarchism, World Federalism, Multiculturalism, Indigenism
*Assessment:* All 23 of the above have plausible centroid distinctiveness per the backlog rationale. Eco-Fascism and Strasserism may be borderline (close to Fascist-Authoritarian); defer to centroid seeding review.

**P1 → P2 downgrade** (when centroid too close to an existing anchor):
Libertarian Municipalism — very close to Democratic Confederalism (same intellectual tradition, Bookchin). Suggested: add as `aliases: ['Libertarian Municipalism']` on the Democratic Confederalism label.

Fourth Theory — extremely close to integralist/neoreactionary/imperial-authoritarian space; may not carve cleanly. Suggested: downgrade to P2 alias under Integralism or defer.

**P1 → Defer** (when no sensible parent exists and centroid fails separability):
*Note: to be determined during centroid seeding review; documented with rationale if needed.*

### Step 2: Create New Independent Labels — Labels with Centroid Data

Add each independent P1 candidate as a full `IdeologyLabel` entry in `src/data/labels.ts`. For each entry:
- `id`: kebab-case derived from name (e.g., `'eco-authoritarianism'`)
- `name`: Human-readable display name
- `family`: One of existing families or a new family (see Proposed Families below)
- `subfamily`: New subfamily string for each label
- `description`: 1–2 sentence norm/descriptive/prescriptive distillation
- `centroid`: All 26 axis values, seeded by LLM from Polcompball/Philosophball wiki descriptions, then manually reviewed per axis
- `aliases`: Include any documented P2 aliases that fall under this parent

**Proposed families and subfamilies:**

| New Label | Family | Subfamily |
|---|---|---|
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

### Step 3: Add P2 Aliases Under Parent Labels

For P2 backlog entries, add aliases array entries to existing or newly-created parent labels:

| P2 Name | Parent Label | Mechanism |
|---|---|---|
| Libertarian Municipalism | democratic-confederalism | `aliases: ['Libertarian Municipalism']` on the Democratic Confederalism entry |
| National Communism | national-bolshevism | `aliases: ['National Communism']` on National Bolshevism |
| National Syndicalism | strasserism or fascist-authoritarian | `aliases: ['National Syndicalism']` on Strasserism |
| Clerical Fascism | integralism or fascist-authoritarian | `aliases: ['Clerical Fascism']` on Integralism |
| Islamic Theocracy | theocrat | `aliases: ['Islamic Theocracy']` on existing Theocrat |
| Labour Zionism | zionism | `aliases: ['Labour Zionism']` on Zionism |
| Noocracy | technocratic-centralist | `aliases: ['Noocracy']` on existing Technocratic Centralist |
| Scientocracy | technocratic-centralist | `aliases: ['Scientocracy']` on existing Technocratic Centralist |

Existing aliases to verify already present:
- [ ] Georgism → alias on Geolibertarian (check if exists)
- [ ] Liberal Conservatism → alias under Conservative Liberalism (already done)

### Step 4: Generate Calibration Fixtures

In `src/scoring/calibration.fixtures.ts`:
1. Append new label IDs to the `targetIds` array.
2. The existing `createCentroidAlignedFixture` helper and the `calibrationFixtures` map will automatically generate fixtures for the new entries.
3. For dense clusters (eco-authoritarianism / eco-fascism / green cluster; national-bolshevism / strasserism / integralism cluster; democratic-confederalism / guild-socialism cluster), manually verify that centroid-aligned fixtures resolve to the correct label. If they near-tie, register `NEAR_TIE_EXCEPTIONS`.

### Step 5: Register Near-Tie Exceptions (if needed)

In `src/scoring/archetype-sweep.test.ts`, add entries to the `NEAR_TIE_EXCEPTIONS` record for any new label whose centroid-aligned fixture does not rank #1. Use existing patterns:

```typescript
'eco-authoritarianism': { tiesWith: 'ecofascism' | 'fascist-authoritarian', maxMargin: 0.02 },
```

Only add exceptions after running the sweep and observing actual margins — never pre-register hypothetical ties.

### Step 6: Update Validation Data Integrity

Ensure `src/data/dataValidity.test.ts` continues to pass with the new labels:
- No duplicate IDs (enforced by existing test).
- All 26 centroid axes present (enforced by existing test — `Object.keys(centroid).length === 26`).
- All referenced axes exist (enforced by existing test).
- Valid family/subfamily strings (enforced by existing test).
- `labelById` map completeness (automatic via `new Map(labels.map(...))`).

### Step 7: Integration — Verify Label Resolution and Archetype Sweep

Run the full test suite:
- `npx vitest run src/data/dataValidity.test.ts` — structural data integrity.
- `npx vitest run src/scoring/archetype-sweep.test.ts` — every label resolves to itself or a documented near-tie.
- Selective manual verification for dense clusters.

### Step 8: Document Downgrades and Deferrals

Append rationale documentation to the backlog or a new rationale doc for any P1 candidate that was downgraded or deferred. Include:
- Candidate name
- Decision (downgrade to P2 / defer)
- Reason (which existing label makes it inseparable, or why centroid modeling failed)
- Parent label (for downgrades)
- Date and reviewer

---

## File Impact

| Path | Change | Risk |
|---|---|---|
| `src/data/labels.ts` | Add ~23 new `IdeologyLabel` entries with full centroids; add aliases to ~7 existing or new labels | Medium — large data entry file, risk of syntax errors; centroid values need review |
| `src/scoring/calibration.fixtures.ts` | Append ~23 new IDs to `targetIds` array | Low — mechanical addition |
| `src/scoring/archetype-sweep.test.ts` | Add `NEAR_TIE_EXCEPTIONS` entries for any clusters that need them | Low — well-followed existing pattern |
| `docs/ideology-expansion-backlog.md` | Covering note: potential status updates for implemented entries | Low — documentation only |

## Verification Plan

- **Static/lint/typecheck:** `npx tsc --noEmit` — no new type errors from additional `IdeologyLabel` entries.
- **Unit — data validity:** `npx vitest run src/data/dataValidity.test.ts` — all structural checks pass (duplicate IDs, axis coverage, centroid completeness, family/subfamily validity).
- **Unit — archetype sweep:** `npx vitest run src/scoring/archetype-sweep.test.ts` — every label resolves correctly; any new near-tie exceptions are registered and margins respected.
- **Integration — label matching:** Run a manual check on each dense cluster's centroid-aligned fixture to verify distance ordering is reasonable.
- **Behavioral — full scoring pipeline:** `npx vitest run src/scoring/` — ensure `labelMatch.ts` and `buildResultProfile` still produce correct results with expanded corpus.

## Risk and Rollback

- **Risk: Centroid overfitting.** Seeding centroids from wiki descriptions may produce vectors that look good in isolation but cluster poorly in the existing 26-axis space. *Mitigation:* Manual per-axis review and cross-validation against nearest existing label; add near-tie exceptions where needed.
- **Risk: Validation invariant weakening.** A new label that fails archetype sweep could tempt relaxing existing margins. *Mitigation:* Hard constraint — never reduce margins or remove coverage. Downgrade the label instead of weakening invariants.
- **Risk: Family/subfamily fragmentation.** New families may proliferate beyond the current convention. *Mitigation:* Reuse existing families where possible; only create new families when the label genuinely doesn't fit (e.g., Indigenism, Democratic Confederalism).
- **Rollback:** Remove added labels from `labels.ts`, revert `calibration.fixtures.ts` targetIds, revert archetype-sweep exceptions, and restore `labelById` map. All changes are data-only — no schema or behavioral rollback needed.

## Open Questions
1. Should Fourth Theory be upgraded to independent P1? Its "anti-liberal, anti-communist, anti-fascist" framing may distinguish it from Integralism/Neoreactionary, but the axis profile needs examination.
2. Should Eco-Fascism and Eco-Authoritarianism share a parent-child relationship (Eco-Authoritarianism as the broader parent, Eco-Fascism as the ethnic-exclusionary subtype)?
3. Should Democratic Confederalism and Guild Socialism get separate labels or be aliases under a broader "council-democratic" parent? The backlog lists both as P1 independent candidates.
4. What is the exact `family` value for Democratic Confederalism — should it be a new `'democratic-confederalist'` family or under `'democratic'`?

## Execution Recommendation
**ultragoal** — durable multi-story execution with ledger and checkpoints. The work decomposes naturally into:
1. **Story 1: P1 labels** — data entry of 18-23 new labels (Step 2)
2. **Story 2: P2 aliases** — alias additions (Step 3)
3. **Story 3: Fixtures + validation** — calibration fixtures, near-tie registration, test pass (Steps 4-5)
4. **Story 4: Final verification and documentation** — full test suite, downgrade/defer documentation (Steps 6-8)

Stories 1 and 2 can run in parallel (independent files). Story 3 must follow Story 1. Story 4 is the final gate.

Status: pending approval
