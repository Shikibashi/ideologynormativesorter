# Ultragoal Brief: Ideology Label Expansion

**Source plan:** `.omp/workflows/ralplan/ideology-expansion/plan.md`
**Source interview:** `.omp/workflows/deep-interview/ideology-source-expansion.md`

## Objective
Expand the ideology label set from 88 to 120-150 labels by systematically mining Polcompball and Philosophyball wikis, adding 6 new optional fields to IdeologyLabel, enriching all existing labels with philosophy data, and ensuring all tests pass.

## Constraints
- No new scoring axes, no question-bank changes
- All new fields optional (backward-compatible)
- TypeScript strict mode throughout
- 26-axis centroid system unchanged
- Floor: 115 labels minimum | Target: 120-130 | Cap: 150 (hard)
- Near-tie exception density ≤ 33%
- Existing-validation invariant priority (no regression)

## Structure
7 sequential goals following the plan's dependency DAG:
- G001: Type definitions (precedes everything)
- G002: Centroid pre-screen (before full data entry)
- G003: Enrich existing 88 labels (parallelizable with G004)
- G004: Add new labels (parallelizable with G003)
- G005: Calibration fixtures + sweep test (depends on G004)
- G006: Validation tests (depends on G001)
- G007: Full suite + build + deploy (depends on all)
