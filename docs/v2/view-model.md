# v2 View-Model Boundary

The view-model package is a presentation adapter, not a scoring authority. It accepts immutable canonical content and an `AssessmentResult`, then produces UI-ready names, ordering, formatting, labels, top-N selections, evidence states, and diagnostic summaries.

It may sort, select, group, format, and label. It must not recompute construct scores, profile distances, modifier fit, specialist rankings, gates, coverage, uncertainty, or diagnostics. It does not import the engine. `diagnostics` remains the authoritative explanation source.

Top-N primary profile display preserves every profile in the tie group at the cutoff. Null scores remain unavailable rather than becoming zero. Failed and unavailable gates remain distinct. Percent labels are presentation-only transformations of already-computed ratios.

Question ordering is explicit: core questions use stable canonical item IDs; specialist questions use the item order declared by their canonical module. The web layer never maintains a second question bank.
