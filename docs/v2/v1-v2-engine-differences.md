# Phase 3 v1 to v2 engine differences

This document records intentional Phase 3 differences. It is not a runtime
compatibility layer.

| Behavior | v1 behavior observed | v2 Phase 3 behavior | Classification |
| --- | --- | --- | --- |
| Likert values outside the legal raw scale | Clamped before normalization | Rejected with `INVALID_LIKERT_VALUE` | `INTENTIONAL_CHANGE` |
| Missing descriptive confidence | Legacy salience helper defaults to full factor in the absence of a rating | Excluded with `salience_skipped` | `INTENTIONAL_CHANGE` |
| Missing prescriptive priority | Legacy salience helper defaults to full factor in the absence of a rating | Excluded with `salience_skipped` | `INTENTIONAL_CHANGE` |
| Duplicate response item IDs | Historical production normalization applied an order-dependent duplicate policy | Rejected deterministically with sorted duplicate IDs | `INTENTIONAL_CHANGE` |
| No response for an active item | Often represented implicitly by absence | Materialized as normalized `missing` state | `INTENTIONAL_CHANGE` |
| Statement-choice response | Unit contribution could be projected through legacy selectors | Only the selected option's explicit v2 mappings are used | `MUST_PRESERVE` |
| Reverse scoring | Normalize by scale, then negate once | Normalize by scale, then negate once | `MUST_PRESERVE` |

The v1 runtime is used only by test-side differential checks. It is not
imported by `v2/packages/engine`.

