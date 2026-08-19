# v2 Save Migration Policy

The v2 save migration registry currently contains only the identity step for
`save-v2.phase12.1`. There is no historical v2 save format to migrate.

The v1 migration boundary is exact-ID and explicit. Numeric core answers can
be migrated when their canonical item and response scale match. `dont_know`
and `prefer_not_to_answer` become explicit v2 `abstained` and `refused`
states and are reported as lossy transformations. Legacy salience-skipped
records, unknown IDs, malformed choices, and unsupported scales are dropped
with warnings rather than assigned defaults.

Legacy specialist progress may migrate exact module/item responses, but
participant identity and historical session semantics do not migrate. The
engine remains the authority for specialist activation. Legacy raw answer
shares are partially migratable by exact ID. Legacy comparison/result-only
payloads cannot be replayed and are archive/result-only. Pending research
records are reserved for a later research migration phase.
