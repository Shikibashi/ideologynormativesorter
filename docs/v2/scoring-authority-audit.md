# v2 scoring authority audit

There is one owner for each scoring concept. Phase 9 only invokes these owners
and assembles their immutable outputs.

| Concept | Single authority |
| --- | --- |
| Response normalization | `v2/packages/engine/src/responses/` |
| Salience | `v2/packages/engine/src/contributions/compute-item-contribution.ts` |
| Contribution arithmetic | `v2/packages/engine/src/contributions/` |
| Construct aggregation | `v2/packages/engine/src/constructs/` |
| Constitutive gates | `v2/packages/engine/src/profiles/profile-gates.ts` and modifier/specialist gate modules |
| Primary profile comparison | `v2/packages/engine/src/profiles/` |
| Primary ranking and ties | `v2/packages/engine/src/profiles/profile-ranking.ts` |
| Modifier matching | `v2/packages/engine/src/modifiers/` |
| Specialist matching | `v2/packages/engine/src/specialists/` |
| Diagnostics | `v2/packages/engine/src/diagnostics/`, downstream only |
| Top-level orchestration | `v2/packages/engine/src/assessment/score-assessment.ts` |
| Result validation | `v2/packages/engine/src/assessment/result-validation.ts` |
| Result serialization | `v2/packages/engine/src/assessment/serialization.ts` |

No duplicate weighted means, profile distances, modifier fits, specialist
similarities, gate comparisons, or ranking formulas were added in Phase 9.
`assembleAssessmentResult()` is structural and does not score.
