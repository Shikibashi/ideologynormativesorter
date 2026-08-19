# v2 divergence model

The canonical diagnostic relation source contains four audited
normative-prescriptive pairs carried forward from the legacy comparison table.
No pair is created from similar names, shared domains, or ontology ancestry.

For each relation:

`signedDifference = firstScore - (secondScore * secondDirection)`

`magnitude = abs(signedDifference)`

Both scores use the native `[-1, 1]` scale. If either construct is abstained,
the result is `unavailable` and has no numeric magnitude. Phase 8 does not
introduce low/moderate/high thresholds because the approved methodology does
not define validated divergence categories.

The legacy threshold of `0.35` and legacy prose labels are not copied into the
v2 diagnostic contract. The numerical comparison is preserved as an explicit,
neutral separation record.
