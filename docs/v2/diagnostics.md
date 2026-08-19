# v2 diagnostics

Phase 8 diagnostics are immutable downstream data. The dependency direction is

`responses -> contributions -> constructs -> profiles/modifiers/specialists -> diagnostics`.

The diagnostics package never reads raw responses and never calls a scoring
primitive. It consumes the exact records emitted by earlier phases. A
contribution ID is the deterministic compound key `itemId`, `constructId`, and
statement option ID separated by NUL. The same identity is used by construct
evidence and modifier comparisons.

Construct strength is `abs(weightedContribution)`. Positive and negative lists
filter the signed weighted contribution and sort by magnitude descending, then
contribution ID. Arithmetic diagnostics reconcile the traced included numerator
and raw mapping-weight denominator with the authoritative construct result.

Domain summaries recompute weighted evidence coverage from their construct
evidence. `diagnosticMean` is present only as a labeled descriptive summary; it
is not a construct score and is not consumed by profile matching.

Profile, modifier, and specialist diagnostics copy structured comparisons and
gate/evidence statuses from their authoritative assessment layers. They expose
references and machine-readable reasons, not user-facing prose. Ordinary
divergence is neutral separation, not inconsistency or a psychological claim.
The only cross-dimension pairs are the explicit records in the canonical
diagnostic relation source.
