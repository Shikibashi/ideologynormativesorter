# v1 to v2 Research Differences

| Category | v1 behavior | v2 Phase 13 behavior | Classification |
| --- | --- | --- | --- |
| schema | accumulated `2026-08-v15` records | strict `research-v2.phase13.1` envelope | INTENTIONAL_CHANGE |
| identity | participant and study fields | opaque submission ID, no identity linkage | INTENTIONAL_CHANGE |
| result data | labels, predictions, diagnostics, snapshots | raw response states only | INTENTIONAL_CHANGE |
| consent | broader historical consent versions | explicit post-result consent and separate send | INTENTIONAL_CHANGE |
| storage | legacy submissions table | v2 parent plus normalized child tables | INTENTIONAL_CHANGE |
| queue | legacy browser pending queue | no v2 offline queue | INTENTIONAL_CHANGE |
| production | legacy deployment configuration exists | v2 production writes hard-disabled | INTENTIONAL_CHANGE |

There are no MUST_PRESERVE scoring differences because the research envelope is not a scoring authority. Legacy fields are retained only in historical code and documents.
