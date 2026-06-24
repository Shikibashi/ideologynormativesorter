# Architecture/Code Review — Label/Axis Expansion + Family-Tree

## Summary
The brownfield expansion (8 new labels → 16 total, 2 new normative axes militarism-pacifism + secularism-religious → 26 total, deeper faction-module pools, and a family-tree label output) integrates cleanly with the deterministic scoring pipeline. New axes/labels flow through the existing layer-filtered aggregate path without special-casing; data-validity, polarity, and archetype-sweep guard tests enforce coverage and ranking stability. No CRITICAL/HIGH issues; all findings are LOW/polish. Recommendation: APPROVE with non-blocking comments.

## Analysis
- **Pipeline integration (architecture):** computeScoreBreakdown (src/scoring/aggregate.ts) partitions axes purely by a.layer, so the two new normative axes appear in the normative layer with zero code change. buildResultProfile (src/scoring/index.ts) passes the full 26-axis list everywhere. Centroid distance (labelMatch.ts distanceOver/closeness) iterates Object.keys(label.centroid); since every centroid now has all 26 axes (enforced by dataValidity.test 'every centroid covers every axis'), axisCount=26 is consistent across labels. No layer-model violation, no boundary leak.
- **Family-tree output (product):** buildResultProfile groups the top-3 nearestLabels by label.family into ResultProfile.familyTree (Record<family, LabelMatch[]>). ResultsScreen renders familyTree when present, sorted by best per-family confidence, else falls back to flat nearestLabels. Family ids are consistent across labels (8 families, no typos), so grouping is sound.
- **Regression risk:** Adding 2 axes shifts absolute confidence magnitudes uniformly (maxDistance=sqrt(26*4)) and widens the normative layerAgreement mean from 8→10 axes in computeConflatedLabels, but ranking order is preserved and verified by archetype-sweep (all 16 labels resolve to themselves, with 3 documented sub-0.02 near-tie exceptions). No ranking regression to nearest-label or conflation output.
- **Originality (code):** Inspected main-bank items (q0241–q0246 religion, q0321–q0326 foreign-policy/war) and module items (fm-left-*, fm-fasc-*). Prompts are distinct, paraphrased, clean-room statements — no copied third-party question/label text observed. Label descriptions are original prose.
- **Centroid/weight sign sanity:** Spot-checked both new axes. militarism-pacifism (+ = militarist): fascist-authoritarian +0.8, national-traditionalist +0.3, anarcho-capitalist -0.8, civil-libertarian-cosmopolitan -0.6 — all sane. secularism-religious (+ = religious): christian-democrat +0.4, national-traditionalist +0.5, fascist-authoritarian +0.6, anarcho-capitalist -0.6, civil-libertarian-cosmopolitan -0.7 — all sane. Question weights align with prompt direction.
- **AI-slop check:** No fallback masking — the ?? 0 defaults in scoring are documented ('unmeasured = neutral', distinguishable via itemCount). No swallowed errors, no duplicate execution paths. Repeated axisWeight vectors within a domain (e.g. secularism -0.8 across items) are template reuse across genuinely distinct prompts, not copy-paste dead code.

## Root Cause
N/A — this is a feature expansion review, not a defect investigation.

## Findings
- **LOW** src/types/label.ts:7-8 — subfamily field is declared/documented for hierarchical grouping but never set on any label and never read; speculative/dead abstraction. Fix: drop it, or populate + render a second grouping level so 'family-tree' is actually hierarchical.
- **LOW** src/data/axes.ts:181-198 — militarism-pacifism and secularism-religious are layer:'normative' but placed inside the file's 'Prescriptive' section block. Behavior correct (filter by a.layer), but misleading. Fix: relocate into the normative block.
- **LOW** src/data/polarity.test.ts:29-62 — no polarity RULES for the two new axes; their one-directional Likert weights are exactly the shape this guard catches. Defense-in-depth gap. Fix: add keyword rules for both axes.
- **LOW** src/components/ResultsScreen.tsx:82-85 — family group header renders raw kebab-case ids (social-democratic, libertarian-leaning) as user-facing text. Fix: map to display names or de-hyphenate/title-case.
- **LOW** src/data/questions.ts:3637+ / 4848+ — new-axis main-bank Likert items are one-directional (all secular/pacifist-keyed); reverse-keying exists only in statementChoice (6112/6070/6084) and module items. Scoring stays symmetric via normalizeAnswer, so this is acquiescence-bias measurement quality, not a bug. Fix: add a few reverse-worded Likert items per new axis.
- **INFO** ResultsScreen flat-fallback branch for nearestLabels is effectively dead since buildResultProfile always populates familyTree; acceptable defensive code.

## Recommendations
1. (Optional, pre-merge polish) Map family ids to human-readable display labels in ResultsScreen.
2. (Follow-up) Add polarity RULES for militarism-pacifism and secularism-religious.
3. (Follow-up) Remove the unused subfamily field or implement the hierarchy it promises.
4. (Follow-up) Move the two new axes into the normative section of axes.ts.
5. (Backlog) Add reverse-keyed Likert items for the two new axes to reduce acquiescence bias.

## Architectural Status
CLEAR

## Code Review Recommendation
APPROVE

## Trade-offs
- familyTree groups only the top-3 nearest labels (not all 16): keeps the UI focused and matches the 'nearest labels' framing; cost is that 'family-tree' is a one-level grouping of a small set, not a full taxonomy. Acceptable for the stated intent.
- Uniform ?? 0 for unmeasured axes: simple and predictable; cost is unmeasured axes pull distance toward each centroid's deviation-from-zero. Mitigated by full question coverage of all axes (dataValidity enforces ≥1 item per domain/layer) and itemCount exposure.

### Lane verdicts
- architecture: CLEAR
- product: CLEAR (watch: raw family-id rendering; acquiescence balance)
- code: CLEAR (watch: dead subfamily field, missing polarity rules)
- overall: APPROVE
- blockers: none
