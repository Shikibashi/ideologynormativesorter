# v2 Research Idempotency

`submissionId` is an opaque client-generated UUID with an `rs_` prefix. The client creates one immutable envelope before the first send and retries that same envelope and ID. It does not derive IDs from answers or identity and does not generate a new ID per retry.

The Worker first looks up the existing digest. Same ID and same canonical payload returns `202` with `deduplicated: true`. Same ID and a different canonical payload returns a collision response. A unique-key race is re-read after the failed batch; a matching digest is treated as a successful deduplication. Parent and child rows are inserted atomically.
