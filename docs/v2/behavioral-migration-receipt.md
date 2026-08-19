# Behavioral Migration Receipt

This is the human-facing Phase 10 receipt for the v1/v2 behavioral boundary. The machine-generated status and bound hashes are in `v2/reference/behavioral-release-receipt.json`; the detailed case and classification report is `docs/v2/generated/differential-report.md`.

## Scope

- v1 reference: `f0324dbf27dfc6e35ff557992e4643e3df15ee0e`
- v2 scorer: `scoreAssessment()` only
- v2 content: the Phase 8.1 canonical bundle
- comparison: semantic projections plus independent mathematical oracles
- visual parity: not claimed
- deployment or UI activation: not authorized

## Decision policy

The receipt is GO only when every MUST_PRESERVE behavior is covered and passing, every INTENTIONAL_CHANGE has a rationale and fixture, every KNOWN_DEFECT lockout is enforced, all active content and specialist architecture have coverage, and no scoring-relevant difference is unclassified. Any stale bound hash invalidates this receipt.

Exact generated counts, case count, random seed, gate results, and artifact hashes are generated from the canonical bundle and reference manifests rather than hand-maintained here.
