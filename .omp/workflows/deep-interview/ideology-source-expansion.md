# Deep Interview Spec: Ideology Source Expansion

## Metadata
- Interview ID: deep-interview-ideology-expansion-001
- Rounds: 8
- Final Ambiguity Score: 8%
- Type: brownfield
- Generated: 2026-06-23T21:31:00Z
- Threshold: 0.10
- Threshold Source: default (standard)
- Initial Context Summarized: no
- Status: PASSED
- Auto-Researched Rounds: none
- Auto-Answered Rounds: none
- Architect Failures: 0
- Lateral Reviews: 0 (transition `refined→ready` at round 8; panel not convened because threshold was crossed at the same transition — no pre-answer synthesis needed before this crystallization)
- Lateral Panel Failures: 0
- Refined Rounds: none
- Closure Overrides: none
- Restated Goal: Expand the ideology label set to 120-150 by systematically mining Polcompball ideological subcategories as distinct labels, enrich all labels with Philosophyball-sourced philosophies across all main branches, add structured subTheories and ethicalTheory fields, add layer-specific philosophy arrays (normative/descriptive/prescriptive), and add a structured philosophyInfluences field mapping each philosophy to specific axis effects — then deploy with tests passing.

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.95 | 0.35 | 0.3325 |
| Constraint Clarity | 0.90 | 0.25 | 0.2250 |
| Success Criteria | 0.88 | 0.25 | 0.2200 |
| Context Clarity | 0.95 | 0.15 | 0.1425 |
| **Total Clarity** | | | **0.9200** |
| **Ambiguity** | | | **8.0%** |

## Topology
| Component | Status | Description | Coverage Note |
|-----------|--------|-------------|---------------|
| **1. Polcompball label expansion** | active | Mine Category:Ideologies ideological subcategories (Anarchists, Conservatives, Liberals, Nationalists, Religious, Environmentalists, Techno-Progressives/Transhumanists, Populists, Welfarists, Internationalists, Georgists, Monarchists) for every distinct scorable ideology | Every distinct ideology from ideological subcategories = label. Close variants = aliases/sub-theories. Target ~120-150 total labels (currently 88). Excluded: Economic Systems, Government Systems, Fictional, Pejorative, Meme categories, Personality/Regime labels, and Lists of People/Books/Media. |
| **2. Philosophyball philosophy enrichment** | active | Mine Philosophyball's List of Philosophies across all main branches (Ethics, Epistemology, Metaphysics, Logic, Aesthetics, Political Philosophy, Social Philosophy, etc.) to populate philosophies arrays on every label | All main branches. Exclude Lists of People/Books/Media/Fictional Philosophies. |
| **3. Sub/macro/ethical theory layer** | active | Add `subTheories: string[]` and `ethicalTheory: string[]` fields to IdeologyLabel | Sub-theories = sub-ideology variants (e.g. Stalinism under Marxism-Leninism). Ethical theories = normative ethics frameworks (deontology, consequentialism, virtue ethics). |
| **4. Normative/prescriptive/descriptive theory mapping** | active | Add `normativePhilosophies: string[]`, `descriptivePhilosophies: string[]`, `prescriptivePhilosophies: string[]` to IdeologyLabel | Each layer's influencing philosophies listed separately. |
| **5. Philosophy→politics influence mapping** | active | Add `philosophyInfluences: Array<{philosophy: string, description: string, affectedAxes: string[]}>` | Structured mapping explaining how each philosophy affects specific axis scores. |

## Established Facts
| Fact | Source Round | Evidence | Status |
|------|-------------|----------|--------|
| Target 120-150 total labels | R1 | User selected curated-broad | stable |
| Mine ideological Polcompball subcategories only | R2 | Excluding Econ/Govt/Fictional/Pejorative | stable |
| Philosophyball: all main branches | R3 | Ethics, Epistemology, Metaphysics, Logic, Aesthetics, Political Philosophy, Social Philosophy | stable |
| Add both subTheories + ethicalTheory fields | R4 | New structured fields | stable |
| Layer-specific philosophy arrays | R5 | Three new arrays | stable |
| Detailed per-philosophy influence mapping | R6 | Structured Record mapping | stable |
| Every distinct Polcompball ideology = label | R7 | Close variants = alias/sub-theory | stable |
| PhilosophyInfluence format: array with axis refs | R8 | `{philosophy, description, affectedAxes}[]` | stable |

## Trigger Metadata
None — no round triggered bidirectional scoring (no contradictions, inconsistencies, evasions, or scope expansions).

## Lateral Review Panel
Not required — ambiguity transitioned from `refined` to `ready` at round 8 with no pre-answer synthesis needed before crystallization. All 8 rounds answered directly by user with high confidence.

## Goal
Expand the ideology label set to 120-150 by systematically mining Polcompball ideological subcategories (Anarchists, Conservatives, Liberals, Nationalists, Religious, Environmentalists, etc.) as distinct labels, enrich all labels with Philosophyball-sourced philosophies across all main branches, add structured subTheories and ethicalTheory fields, add layer-specific philosophy arrays (normative/descriptive/prescriptive), and add a structured philosophyInfluences field mapping each philosophy to specific axis effects — then deploy with tests passing.

## Constraints
- Exclude Polcompball's Economic Systems, Government Systems, Fictional, Pejorative, Meme categories
- Exclude Philosophyball's Lists of People/Books/Media/Fictional Philosophies
- All new fields optional (backward-compatible with existing data)
- Centroids must be plausible and internally consistent per ideology
- All calibration fixtures and near-tie exceptions kept up to date
- Full test suite (vitest) must pass before deployment
- TypeScript strict mode must compile cleanly
- Current 26-axis centroid system remains unchanged (no new axes)

## Non-Goals
- No new scoring axes
- No question-bank changes
- No UI redesign
- No chart/visualization work (deferred)
- No compare/share changes (already complete)
- No architectural changes beyond IdeologyLabel type expansion

## Acceptance Criteria
- [ ] `src/types/label.ts` updated with 6 new optional fields
- [ ] All 88 existing labels updated with complete philosophy enrichments
- [ ] ~32-62 new labels added from Polcompball (reaching 120-150 total)
- [ ] Each new label has `philosophies`, `normativePhilosophies`, `descriptivePhilosophies`, `prescriptivePhilosophies`, `ethicalTheory`, and `philosophyInfluences` populated
- [ ] `subTheories` populated for applicable labels
- [ ] Calibration fixtures added for all new labels
- [ ] Near-tie exceptions documented for any fixture ties
- [ ] `dataValidity.test.ts` validation covers new fields
- [ ] 256+ tests passing (current baseline + new label fixtures)
- [ ] `npx tsc -b` compiles cleanly
- [ ] `npm run build` produces clean production build
- [ ] Deployment to GitHub Pages via existing workflow

## Deferrals
- Philosophyball entry-level page scraping (labels themselves won't get individual philosophy pages — just the philosophy names and explanations)
- Philosophyball sub-category listing beyond the main branches
- Layer-specific philosophy arrays can be inferred from the full philosophies list + description for an initial version

## Assumptions
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| Polcompball category page lists all relevant ideologies | Verified live browsing — ~250+ entries plus subcategory pages | Confirmed |
| Philosophyball lists are comprehensive enough | Verified live browsing — main + applied branches visible | Accept for first pass |
| A distinct centroid can be assigned to each new label | Assumes 26-axis space has enough dimensionality to separate ~150 labels | Validated by earlier 88-label density (many near-ties already documented with exceptions) |
| 120-150 labels are achievable from ideological subcategories | Based on counting ~8 subcategories × 4-8 distinct labels each = 32-62 new labels | Conservative estimate; may end up closer to 120 than 150 |

## Technical Context
- **Codebase**: Single-page React app, pure TypeScript, no router/database
- **Key files**:
  - `src/types/label.ts` — IdeologyLabel interface (add new fields)
  - `src/data/labels.ts` — 3282-line label data file (add new entries, enrich existing)
  - `src/scoring/calibration.fixtures.ts` — centroid-aligned fixtures
  - `src/scoring/archetype-sweep.test.ts` — near-tie exception table
  - `src/data/dataValidity.test.ts` — data integrity validation
  - `src/data/audit.test.ts` — audit coverage checks
- **Label structure**: Each entry has `id`, `name`, `family`, `description`, `centroid` (26-axis map), optional `aliases[]`, optional `philosophies[]`
- **Family consistency**: Existing 16 families should be reused; new ones added only if a label genuinely doesn't fit
- **Nearest-label matching**: Uses cosine similarity against centroids; new labels must not cause existing fixtures to mis-match without documented exceptions

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| PolcompballLabel | core domain | id, name, family, subfamily, description, centroid, aliases, philosophies | belongs-to PolcompballSubcategory |
| PolcompballSubcategory | supporting | name, ideology type filter | contains PolcompballLabel entries |
| PhilosophyballEntry | core domain | name, branch (ethics/epistemology/etc.) | influences IdeologyLabel via philosophies fields |
| SubTheory | supporting | name, parentLabelId | child-of IdeologyLabel |
| EthicalTheory | supporting | name (deontology/consequentialism/virtue ethics) | applies-to IdeologyLabel |
| LayerPhilosophy | supporting | philosophy name, layer (normative/descriptive/prescriptive) | mapped-on IdeologyLabel via per-layer arrays |
| PhilosophyInfluence | relationship | philosophy, description, affectedAxes | links PhilosophyballEntry to IdeologyLabel centroid dimensions |

## Ontology Convergence
| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 1 | 1 | - | - | N/A |
| 2 | 2 | 1 | 0 | 1 | 100% |
| 3 | 3 | 1 | 0 | 2 | 100% |
| 4 | 5 | 2 | 0 | 3 | 100% |
| 5 | 6 | 1 | 0 | 5 | 100% |
| 6 | 7 | 1 | 0 | 6 | 100% |
| 7 | 7 | 0 | 0 | 7 | 100% |
| 8 | 7 | 0 | 0 | 7 | 100% |

## Interview Transcript
<details><summary>Full Q&A (8 rounds)</summary>

### Round 1
**Q:** Polcompball Category:Ideologies has ~250+ entries. What scale of label expansion do you want?
**A:** B — Curated broad (120–150 labels)
**Ambiguity:** 68% → 50%

### Round 2
**Q:** Which Polcompball subcategories should we mine?
**A:** Ideological subcats only (skip Economic/Government Systems, Fictional/Pejorative/Memes)
**Ambiguity:** 50% → 40%

### Round 3
**Q:** What scope from Philosophyball?
**A:** C — All main branches (Ethics, Epistemology, Metaphysics, Logic, Aesthetics, Political Philosophy, etc.)
**Ambiguity:** 40% → 34%

### Round 4
**Q:** What does sub/macro/ethical theory layer mean structurally?
**A:** C — Both subTheories + ethicalTheory as structured fields
**Ambiguity:** 34% → 29%

### Round 5
**Q:** How to map theories to normative/descriptive/prescriptive layers?
**A:** A — Layer-specific philosophy arrays (normativePhilosophies, descriptivePhilosophies, prescriptivePhilosophies)
**Ambiguity:** 29% → 24%

### Round 6
**Q:** What level of detail for philosophy→politics influence mapping?
**A:** B — Detailed per-philosophy mapping with axis references
**Ambiguity:** 24% → 19%

### Round 7
**Q:** How to decide which Polcompball entries become labels vs aliases?
**A:** A — Every distinct ideology with a scorable axis profile = label
**Ambiguity:** 19% → 13%

### Round 8
**Q:** What format for philosophyInfluences field?
**A:** B — Array with philosophy name, description, and affectedAxes
**Ambiguity:** 13% → 8%

</details>
