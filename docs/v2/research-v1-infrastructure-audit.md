# v1 Research Infrastructure Audit

| v1 source | Classification | Phase 13 handling |
| --- | --- | --- |
| `src/research/**` | research-only legacy runtime | archive-only; not imported by v2 |
| `research-worker/src/worker.mjs` | research-only legacy Worker | archive-only; v2 Worker is isolated |
| `research-worker/migrations/**` | legacy D1 storage | not reused; v2 has a separate migration |
| `research-worker/generated/canonical-contract.json` | historical contract artifact | not an acceptance authority |
| `src/research/pendingSubmission.ts` | legacy local queue | not reused; Phase 13 has no v2 offline queue |
| v1 participant/self-label/demographic fields | broader draft protocol | intentionally excluded from `research-v2.phase13.1` |
| v1 production/staging Wrangler configuration | deployment boundary | unchanged; v2 local config only |

The v1 implementation remains available for historical comparison, but no deployed v2 path depends on it. The v2 acceptance registry is generated from the v2 canonical content bundle and does not serialize the old canonical contract or scoring artifacts.
