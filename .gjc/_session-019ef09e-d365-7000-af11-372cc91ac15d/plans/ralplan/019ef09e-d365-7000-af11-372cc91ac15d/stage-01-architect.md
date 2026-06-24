# Subfamily Two-Level Family Tree — Architecture/Code Review

## Summary
Additive optional subfamily field plus two-level familySubtree output is a clean, backward-compatible extension. familyTree is retained and unchanged, the new tree is built in the same single pass, render is lossless, and subfamily groupings are mostly coherent. Recommendation: APPROVE. One LOW-severity data-taxonomy nit (geoist-market grouping) worth a follow-up, no blockers.

## Analysis
- Type (src/types/label.ts:7-8): subfamily?: string is optional/additive; no existing field changed. ResultProfile (src/types/scoring.ts:125-127) keeps familyTree? and adds familySubtree?: Record<string, Record<string, LabelMatch[]>>, both optional — no breaking type change.
- Compute (src/scoring/index.ts:47-60): both trees populated in ONE loop over nearestLabels. subfamily = label.subfamily ?? label.family fallback keeps labels without a subfamily valid, so familySubtree is well-formed even pre-migration. familyTree push logic unchanged.
- nearestLabels is computeLabelMatches() top-3 sorted by ascending distance = descending confidence (src/scoring/labelMatch.ts:39-55), so per-subfamily arrays inherit confidence-desc order; render sorts rely on that and hold.
- Render (src/components/ResultsScreen.tsx:93-127): family entries sorted by topConfidence desc, subfamilies by first-match confidence desc, label list rendered; subfamily h4 suppressed when subfamily===family (avoids redundant header for single-subfamily families e.g. technocratic). Falls back to flat nearestLabels list when familySubtree empty.
- Tests (src/scoring/familyTree.test.ts:54-89): assert losslessness (flattened length == nearestLabels.length), family/subfamily field agreement, and parent-nesting for every calibration fixture. dataValidity.test.ts:163-168 asserts every label has a non-empty string subfamily.
- All 24 labels carry a subfamily; verified each family partition: social-democratic{reformist-welfare}, liberal{market-liberal,civil-libertarian}, libertarian-leaning{geoist-market,market-anarchist,minarchist}, socialist{democratic-market-socialist,state-socialist,libertarian-socialist}, conservative{national-conservative,religious-conservative}, technocratic{technocratic}, authoritarian{ultranationalist}, anarchist{social-anarchist}.

## Root Cause
N/A — feature addition, no defect under review.

## Findings
- LOW (coherence) src/data/labels.ts decentralist-market-skeptic-of-state: subfamily geoist-market alongside geolibertarian, but its description never references land/resource rents or Georgism and its property-legitimacy (+0.6) diverges from geolibertarian (-0.5). Reads as a generic deregulatory decentralist, not a geoist. Rename subfamily or place it separately. Non-blocking.
- LOW (coherence) src/data/labels.ts neoconservative under national-conservative with national-traditionalist: defensible but neoconservatism is arguably its own current; acceptable as-is.
- LOW (perf/style) src/scoring/index.ts:50 labels.find by id inside the loop is O(n) (O(n*m)). Pre-existing pattern (familyTree already did this), n<=3 here so negligible; labelById Map exists in src/data/labels.ts but is not imported. Not a regression.
- INFO src/scoring/index.ts: familyTree is now fully derivable from familySubtree by flattening; the retained flat tree is intentional backward-compat duplication, acceptable, candidate for future dedup.

## Recommendations
1. (LOW) Reconsider the geoist-market subfamily label or membership so decentralist-market-skeptic-of-state genuinely belongs; pure data edit, no code change.
2. (Optional) If a hot path forms, swap the in-loop labels.find for the existing labelById Map.
3. (Optional, future) Treat familyTree as derived from familySubtree to remove the parallel structure once safe.

## Architectural Status
CLEAR

## Code Review Recommendation
APPROVE

## Trade-offs
- Retain familyTree (chosen): backward compatible, zero consumer churn; cost = parallel structure. Vs replace with familySubtree only: less duplication but a breaking change to ResultProfile contract and tests. Additive choice is correct for a brownfield instrument.
