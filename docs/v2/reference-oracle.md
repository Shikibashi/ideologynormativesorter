# v2 Reference Oracle

Phase 10 freezes the v1 behavioral boundary without making v1 a v2 runtime dependency.

## Frozen boundary

- Frozen v1 reference commit: `f0324dbf27dfc6e35ff557992e4643e3df15ee0e`
- Approved methodology commit: `b1ac3e3e147e3761faccec8588d7c822a875d4dc`
- Reference metadata: `v2/reference/v1/manifest.json`
- Machine behavior ledger: `v2/reference/migration-behavior-ledger.json`
- Case manifest: `v2/reference/cases/manifest.json`
- Replay manifest: `v2/reference/replay-manifest.json`

The v1 adapter is test-only and lives under `tests/v2-differential/`. It translates v2 raw inputs into the v1 production response boundary and emits a semantic projection. The v2 adapter calls only `scoreAssessment()` and emits a parallel semantic projection. Neither adapter is imported by `v2/packages/*`.

## Case and comparison policy

Every case has an ID, description, classification scope, input path, captured v1 projection, captured v2 projection, expected differences, source version, and rationale references. Cases are generated deterministically and captured only with explicit `V2_REFERENCE_CAPTURE=1`.

Comparisons are semantic rather than blind byte parity. Scores use one central tolerance, `1e-9`; serialization and content artifacts still require exact byte determinism. MUST_PRESERVE behavior must be covered and pass. INTENTIONAL_CHANGE requires a receipt explaining v1 behavior, desired v2 behavior, fixture, and rationale. KNOWN_DEFECT behavior is a lockout.

## Independent mathematical oracle

Hand-calculated specifications for Likert normalization, single reverse scoring, salience, weighted construct arithmetic, evidence ratios, and profile distance live in `tests/v2-differential/spec-oracles.ts`. They are independent of both runtime scoring implementations.

## Live versus captured v1

The reference manifest is fixed to the historical commit and never follows current main. A live adapter run is diagnostic only; it cannot rewrite fixtures without an explicit fixture-update receipt and decision. Visual reference locks remain metadata-only and make no visual parity claim.

## Commands

- `npm run v2:reference:verify`
- `npm run v2:reference:differential`
- `npm run v2:reference:coverage`
- `npm run v2:reference:hash`
- `npm run v2:reference:report`
