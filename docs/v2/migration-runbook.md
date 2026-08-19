# v2 Migration Runbook

Migration is an explicit, offline, reversible operation. Preserve v1 production traffic and data. Validate the target content fingerprint, scoring version, response schema, persistence schema, and research contract before importing any save or share payload. Result-only legacy payloads are not replayable through v2 scoring.

No migration step in this runbook performs a production write or route cutover. A future activation requires a separately approved change, staged canary, monitored rollback point, and research-governance approval.
