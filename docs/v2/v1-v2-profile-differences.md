# v1 to v2 Primary Profile Differences

## Preserved behavior

- Primary matching remains Euclidean/RMS distance on the native `-1..1` construct scale.
- Similarity remains `1 - distance / 2`, clamped to `[0, 1]`.
- Unmeasured dimensions do not receive neutral fallback scores.
- Constitutive evidence gates prevent an unmeasured required commitment from becoming a broad-profile match.
- Deterministic ranking remains distance/similarity based.

## Intentional v2 changes

- Profile dimensions are explicit `requirements` records with explicit targets and weights; no centroid fallback or ontology ancestry inference is permitted.
- Phase 4 `ConstructResult` is the only measurement input. Phase 5 never rereads raw responses or recomputes item contributions.
- Gate evaluation is typed and serialized, including unavailable evidence and compound child state.
- Every profile is represented as a scored or abstained discriminated-union result with a closed abstention reason.
- Ties use the measurement-contract `0.05` similarity tolerance and preserve tied profiles instead of returning an arbitrary single winner.
- Generated results carry the Phase 5 result schema version and are deeply immutable.

## Not included

Modifier matching, specialist activation/scoring, uncertainty algorithms beyond profile eligibility and tie reporting, UI adapters, and production deployment remain future phases.
