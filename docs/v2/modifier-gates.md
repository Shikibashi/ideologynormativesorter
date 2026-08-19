# Phase 6 Modifier Gates

Modifier gates use the same explicit scalar, evidence, conjunction, and
disjunction operators as primary-profile gates, but their input boundary is
the Phase 4 construct assessment plus the current modifier's own indicator
evidence.

Scalar gates read only the named scored construct. An unavailable construct
makes the gate unavailable; it is never replaced with a neutral score.
Construct-scoped evidence gates read that construct's support evidence.
Modifier-scoped evidence gates read indicator coverage and measured indicator
count. Compound gates preserve the inclusive conjunction/disjunction rules and
are serialized by stable gate ID.

Gate failure produces an explicit `inactive` modifier result with
`constitutive_gate_failed`. An unavailable gate produces
`constitutive_gate_unavailable`. Gate status never changes the primary-profile
assessment because the modifier layer has no write access to primary results.
