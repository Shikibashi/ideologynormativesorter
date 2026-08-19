# v2 Research Security

- Exact origin allowlists are required; wildcard CORS is prohibited.
- Production writes are disabled in code, not only by configuration.
- Requests are size-limited before persistence and parsed as strict JSON.
- Submission IDs are opaque UUIDs and payload digests provide replay/collision detection.
- IP addresses are not stored; a future rate limiter may use them transiently only.
- Responses never echo raw payloads or storage exceptions.
- No credentials, cookies, localStorage queue, account identifier, private-save token, or share token is sent.
- The D1 parent and child records are append-only and transactionally inserted.
- The Worker source has an architecture test forbidding v1/scoring imports and scoring terminology.

This is infrastructure hardening, not a claim that the study is approved for public collection.
