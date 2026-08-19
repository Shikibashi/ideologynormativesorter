# v1 to v2 Modifier Differences

The v1 direct matcher was audited against `src/data/modifierMeasurement.ts`,
`src/production/score.ts`, and the associated modifier tests. The v2 matcher
preserves its approved direct-indicator arithmetic while removing runtime
history and presentation filtering.

| Area | v1 | v2 disposition |
| --- | --- | --- |
| Input | Raw/normalized production response adapter | Phase 4 `ConstructAssessment` contribution records only |
| Direct evidence | Item IDs and directions | Same item IDs and directions, explicitly retained in canonical content |
| Weighting | Unit indicator weights | Explicit modifier weights, currently all `1` for extracted v1 parity |
| Fit | RMS distance to directed ideal, fit `1 - distance / 2` | Same formula, weighted by the modifier contract |
| Evidence | Minimum answered indicators and coverage | Same counts plus retained exclusion/state diagnostics |
| Availability | Only passing matches were returned | All 24 modifiers are returned with active/inactive/below-threshold/unavailable status |
| Result limit | Top five | No limit; complete canonical set is preserved |
| Primary profiles | Could be used by other legacy paths | Never an input to modifier scoring |

The removal of the v1 top-five and pass-only filters is intentional. The
continuous fit and evidence values remain available for later presentation and
research decisions. No unresolved scoring-relevant mismatch remains in the
direct-indicator differential checks; the only expected difference is the
intentional full-output behavior.
