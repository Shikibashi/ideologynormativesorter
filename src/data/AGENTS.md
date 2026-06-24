<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-22 | Updated: 2026-06-22 -->

# data

## Purpose
Static data definitions for the quiz: question bank, axes, ideology labels, domains, faction modules, and related validation/audit logic. All data is versioned and immutable, used to drive the pure scoring engine.

## Key Files
| File | Description |
|------|-------------|
| `questions.ts` | ~600 question items with prompts, domains, layers (normative/descriptive/prescriptive), theoryContext (ideal/nonideal/mixed), tiers, axisWeights; exports QUESTION_BANK_VERSION, questionsForTier, questionById |
| `axes.ts` | 26 Axis definitions (8 normative, 7 descriptive, 9 prescriptive, 2 cross-cutting: militarism-pacifism, secularism-religious) with id, name, poles, description; axisById map |
| `labels.ts` | 16 IdeologyLabel entries with id, name, family, description, centroid (axis scores); labelById map |
| `domains.ts` | 16+ Domain definitions for grouping (e.g., state-legitimacy, property-ownership); domainById |
| `factionModules.ts` | Post-quiz module suggestions with trigger labels and question ids |
| `moduleQuestions.ts` | Additional questions for faction modules |
| `statementQuestions.ts` | Statement-choice question variants |
| `audit.ts` | Typed corpus audit report (totals, coverage, problems) |
| `dataValidity.test.ts` | 24 tests validating domains, axes, questions, tiers, labels, modules |
| `audit.test.ts` | Tests for audit function |

## Subdirectories
None.

## For AI Agents

### Working In This Directory
- Data is static and versioned; update QUESTION_BANK_VERSION when changing questions.
- Questions must follow schema: id, prompt, domain, layer, theoryContext, responseType, tier, axisWeights (array of {axisId, weight}).
- Use questionsForTier(tier) to filter for quiz modes.
- For new data, add validation in dataValidity.test.ts.
- Avoid mutating data objects.

### Testing Requirements
- Run `npm test -- dataValidity` and audit tests after changes.
- Ensure no duplicate ids, valid refs to axes/domains/layers, tier nesting (quick ⊂ moderate ⊂ extensive), layer coverage per domain.

### Common Patterns
- Maps for lookup: axisById, labelById, domainById, questionById.
- Centroids in labels for scoring distance calculations.
- Version constants for reproducibility in shares.

## Dependencies

### Internal
- Used by src/App.tsx, src/scoring/*, src/components/*
- Types from ../types (Axis, Label, Domain, Question, etc.)

### External
- None (pure data)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->