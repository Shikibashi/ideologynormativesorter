# Phase 5: Primary Profile Matching

Phase 5 consumes the Phase 4 `ConstructAssessment` and produces deterministic primary-profile matches. It does not read raw responses, recompute item contributions, apply modifiers, activate specialist modules, or infer profile dimensions from ontology ancestry.

## Input boundary

`scorePrimaryProfiles(constructAssessment, canonicalBundle)` accepts only the immutable Phase 4 construct results and the canonical content bundle. The version tuple and content fingerprint must match. A mismatch is an engine error, not a partial match.

Each profile's `requirements` array is the sole source of its comparison dimensions. A requirement declares one construct target and one positive relative weight. The current Phase 1/2 content contract has no optional-dimension flag, so every declared requirement is required for eligibility. `minimumAnsweredItems` is honored when present.

## Evidence eligibility

Only `scored` construct results with finite scores are comparable. Abstained or absent construct results are unavailable and never receive a neutral fallback value. Required unavailable constructs abstain the profile with `required_construct_unavailable`.

Profile comparison coverage is the measured requirement weight divided by total requirement weight. The profile's explicit `minimumEvidenceRatio` is inclusive. A profile with no comparison requirements abstains with `no_comparable_constructs`.

## Distance and similarity

For included requirements, Phase 5 computes weighted RMS distance on the native construct score scale:

```text
distance = sqrt(sum(weight_i * (observed_i - target_i)^2) / sum(weight_i))
similarity = clamp(1 - distance / 2, 0, 1)
```

The canonical score range is `[-1, 1]`, so distance is bounded by `2`. With equal weights this is the measurement-contract `n_measured` formula. Weight scaling is normalized by the measured weight sum; multiplying all profile weights by a common factor does not change the result.

## Result shape

Every canonical primary profile appears exactly once in `PrimaryProfileAssessment.profiles`. A scored result contains explicit comparisons, evidence, gate evaluations, distance, similarity, rank, and tie group. An abstained result retains the same diagnostic structures but has null distance/similarity/rank and one closed abstention reason.

The separate `ranking` array contains scored profiles only. Abstained profiles never compete for rank.
