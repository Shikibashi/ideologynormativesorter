# Deep Interview Spec: Label + Axis Expansion and Family-Tree Output

## Metadata
- Type: brownfield
- Final Ambiguity: ~5% (scope fully resolved via 3 targeted decisions; not a full Socratic interview — input was an already-specified engineering plan)
- Threshold: 0.05
- Threshold Source: default
- Status: PASSED (scope-resolved; routed directly to execution per Do_Not_Use_When — detailed specific request)

## Goal
Expand the ideology instrument across four ordered workstreams: (1) add 8 fully-validated hybrid ideology labels, (2) add Militarism↔Pacifism and Secularism↔Religious axes with item tagging, (3) deepen faction-module question pools for real subtyping, (4) wire a hierarchical family-tree label output. All new user-facing text is original/clean-room; ideology names are generic terms.

## Topology (4 active components, executed in order)

| Component | Status | Description | Coverage / Decision |
|-----------|--------|-------------|---------------------|
| Labels | active | Add 8 hybrid labels each with centroid + calibration archetype + sweep coverage | Narrow scope chosen: geolibertarian, anarcho-capitalist, market-socialist, social-democrat, mutualist, ecomodernist, christian-democrat, fascist-authoritarian. Each fully validated. Defer remaining ~12 to follow-up. |
| Axes | active | Add militarism↔pacifism + secularism↔religious axes | Thorough: add both axes, retro-tag existing foreign-policy + religion-domain items with weights, add 2-3 new dedicated items each. Extend ALL label centroids (old 8 + new 8) to cover the 2 new axes (dataValidity requires full centroid coverage). |
| Modules | active | Deepen faction-module question pools to enable subtyping | Expand the 4-question modules toward ~10-15 discriminating items each. |
| FamilyTree | active | Wire hierarchical family→subfamily→label output | Use existing `family` field; add type + UI; nearest-label output grouped by family. |

## Constraints
- No copied third-party question text, descriptions, or scoring prose. All original/clean-room.
- Ideology names (geolibertarian, anarcho-capitalist, etc.) are generic terms; descriptions written fresh.
- Pure deterministic scoring preserved; no runtime LLM scoring.
- Preserve existing public APIs (buildResultProfile, etc.).
- Adding axes changes centroid vector length: every label centroid (24→26 dims) must be updated or dataValidity test fails.
- Polarity-regression test + archetype-sweep test must stay green (extend, don't weaken).

## Non-Goals
- Remaining ~12 labels beyond the 8 hybrids (deferred follow-up).
- Magnitude/IRT calibration (blocked on pilot data, per prior finding).
- Centroid empirical re-derivation (prior finding: hand-authored separates better).

## Acceptance Criteria
- [ ] 8 new labels added with original descriptions + 26-axis centroids
- [ ] 8 new calibration archetypes; archetype-sweep asserts each resolves to itself (#1 or documented near-tie)
- [ ] All 16 label centroids extended to include militarism + secularism axes
- [ ] 2 new axes defined (poles + descriptions); axisById updated
- [ ] Existing foreign-policy + religion-domain items retro-tagged with militarism/secularism weights
- [ ] 2-3 new dedicated items per new axis
- [ ] dataValidity: every centroid covers every axis; axis count assertion updated (24→26)
- [ ] polarity-regression + archetype-sweep tests green
- [ ] faction-module pools deepened
- [ ] family-tree label output type + UI wired; ResultsScreen groups nearest labels by family
- [ ] Full gate: tests + lint + build pass; browser check

## Execution Handoff
Route to ultragoal (goal-tracked autonomous execution) — spec is implementation-ready, concrete, ordered. Brownfield, single coherent effort.

## Interview Transcript
- Q (label scope): chose "Start narrow: 8 hybrids, each fully validated, defer rest"
- Q (axes scope): chose "Add both + retro-tag existing items + 2-3 new dedicated items each"
- Q (items 3-4 scope): chose "All four items this session, in order, full verification at end"
