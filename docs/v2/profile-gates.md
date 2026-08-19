# Phase 5 Constitutive Gates

Constitutive gates are content-declared eligibility rules. All gates listed on a primary profile are required; gate operators are not inferred from names, ontology relations, or scorer code.

## Scalar gates

`minimum` passes when the measured construct score is greater than or equal to the threshold. `maximum` passes when it is less than or equal to the threshold. `interval` passes inclusively between its minimum and maximum.

If the referenced construct is not a scored Phase 4 result, the scalar gate is `unavailable`.

## Evidence gates

`evidenceMinimum` can name a construct or apply to the profile comparison evidence. A construct-scoped gate uses the construct support evidence ratio and answered item count. A profile-scoped gate uses profile comparison coverage. Both thresholds are inclusive.

## Compound gates

`conjunction` passes only when all children pass. It fails when any child fails; otherwise an unavailable child makes it unavailable. `disjunction` passes when any child passes. It fails only when every child fails; if none pass and at least one is unavailable, it is unavailable.

Gate evaluations are serialized by gate ID. Each result retains the operator, status, reason, thresholds, observed values, and child IDs where applicable. A failed gate abstains a profile with `constitutive_gate_failed`; an unavailable gate abstains with `constitutive_gate_unavailable` unless a missing required comparison already supplies the more specific `required_construct_unavailable` reason.

Malformed gate graphs, duplicate IDs, unknown endpoints, cycles, non-finite thresholds, and invalid interval bounds are invalid profile configuration and do not enter the ranking.
