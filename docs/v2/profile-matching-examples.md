# Phase 5 Matching Examples

These examples describe the pure profile layer. They do not imply a UI result or production activation.

## Exact match

Given measured constructs `a = 0.4` and `b = -0.2`, and a profile with targets `a = 0.4`, `b = -0.2`, the weighted RMS distance is `0` and similarity is `1`.

## Partial evidence

If a profile requires `a` and `b`, but the Phase 4 result for `b` is abstained, the profile does not substitute `0` for `b`. It emits `required_construct_unavailable`, includes the unavailable comparison, and is omitted from ranking.

## Constitutive gate

An `evidenceMinimum` gate for construct `a` with ratio `0.5` and minimum item count `1` passes only when the Phase 4 `a` result is scored and satisfies both inclusive thresholds. A construct-level abstention makes the gate `unavailable`; it is not silently converted into a failed ideological commitment.

## Tie

When the adjacent top similarities differ by less than `0.05`, all profiles in that deterministic tie group retain the same competition rank. The assessment exposes `topTie.reason = "label-tie"`, the tied profile IDs, the exact similarity delta, and high assessment uncertainty. A difference exactly equal to `0.05` is not a tie.
