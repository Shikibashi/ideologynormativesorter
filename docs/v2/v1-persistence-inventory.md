# v1 Persistence Inventory for v2

| v1 format | v1 location | v2 handling | Classification |
| --- | --- | --- | --- |
| Core quiz save | `ideology-quiz-save` | Exact-ID input migration only | SAFE_TO_MIGRATE when complete; otherwise PARTIALLY_MIGRATABLE/LOSSY |
| Specialist progress | `political-judgment-specialist-progress-v1:*` | Exact module/item migration; identity excluded | PARTIALLY_MIGRATABLE |
| Raw answer share | `#r=` | Exact-ID answer migration | PARTIALLY_MIGRATABLE |
| Compare share | `#r=...&c=...` | Archive/result-only boundary | RESULT_ONLY |
| Pending research records | `political-judgment-pending-research-record-*` | Not assessment persistence | ARCHIVE_ONLY |
| Participant identity | `political-judgment-research-participant-*` | Not assessment persistence | ARCHIVE_ONLY |
| Display preferences | `political-judgment-*-v1` | Not assessment persistence | ARCHIVE_ONLY |
| Malformed/unknown payload | any | Rejected without guessing | UNRECOVERABLE |

The inventory is an extraction boundary, not a promise that every historical
record can be converted without loss.
