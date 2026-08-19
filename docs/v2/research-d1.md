# v2 Research D1 Storage

Migration `v2/research-worker/migrations/0001_create_research_submissions.sql` creates an append-only `research_submissions` parent table plus `research_submission_responses` and `research_submission_modules` child projections. The parent stores the canonical validated envelope and its SHA-256 digest. Child rows retain state, response type, raw value/option, confidence, priority, scope, and requested module membership.

The parent is authoritative. Child rows are inserted in the same D1 batch and are useful for analysis/export. Foreign keys, composite primary keys, and the unique submission ID prevent partial or duplicate logical records.

Only the local D1 binding is used in Phase 13 tests. The root legacy migrations are not reused by v2.
