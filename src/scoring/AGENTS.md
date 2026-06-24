<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-22 | Updated: 2026-06-22 -->

# scoring

## Purpose
Pure functional scoring engine for the ideology test. Computes layered scores (normative/descriptive/prescriptive), ideal/non-ideal gaps, label matches, reliability bands, contributions/explainability, divergences, domain mini-results, and reason breakdowns. All functions are deterministic, side-effect free, and unit-tested.

## Key Files
| File | Description |
|------|-------------|
| `index.ts` | Barrel exports + buildResultProfile orchestrator (composes all scorers) |
| `aggregate.ts` | computeAxisScores, computeScoreBreakdown, axisScoreMap - weighted aggregation per axis/layer |
| `normalize.ts` | normalizeAnswer (Likert to -1..1, reverseScored support), salienceFactor (confidence/priority weighting) |
| `labelMatch.ts` | computeLabelMatches (Euclidean centroid distance, top-3); computeConflatedLabels (per-layer agreement on native scale; flags labels matching one layer but conflating it with divergent layers) |
| `gap.ts` | computeIdealNonIdealGaps per domain |
| `reliability.ts` | reliabilityForAxis, reliabilityForLabel - bands (insufficient/low/medium/high) based on itemCount/consistency |
| `explain.ts` | contributionsForAxis - top N contributions with layer/theoryContext |
| `divergence.ts` | detectDivergencesAndContradictions - layer divergence, inconsistency, compromise, uncertainty |
| `domainResults.ts` | computeDomainMiniResults - per-domain normative/descriptive/prescriptive means |
| `reasonDecomposition.ts` | computeReasonBreakdowns - policy position to layer/axis explanations |
| `moduleSuggestions.ts` | suggestModules based on nearest labels |
| `calibration.fixtures.ts` | Synthetic answer maps for archetype labels (for testing) |
| `*.test.ts` | Unit tests for each module (aggregate, gap, labelMatch, reliability, explain, calibration, decomposition, normalize) |

## Subdirectories
None.

## For AI Agents

### Working In This Directory
- All functions pure: take questions/answers/axes/labels, return new objects.
- Use buildResultProfile as entry point for full profile.
- When adding features, add to index.ts exports and buildResultProfile.
- Preserve types from ../types/scoring.ts.
- For changes to scoring logic, update corresponding tests and dataValidity if needed.

### Testing Requirements
- `npm test -- scoring` or specific like aggregate.test.ts
- All scorers have dedicated tests; maintain coverage for edge cases (dont_know, unmeasured, reverseScored, statementChoice).
- Calibration tests validate against fixtures for known labels.

### Common Patterns
- Map-based lookups for scores (axisScoresMap).
- Normalization to -1..1 clamped.
- Layer separation: normative (values), descriptive (beliefs), prescriptive (actions).
- Salience weighting for descriptive (confidence) / prescriptive (priority).

## Dependencies

### Internal
- Types: ../types (AxisScore, ResultProfile, etc.)
- Data: ../data (questions, axes, labels, domains)

### External
- None (pure TS/JS)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->