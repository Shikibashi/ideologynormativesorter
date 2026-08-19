# v2 Persistence Privacy Boundaries

Private saves may contain every response and are stored only through the
browser `Storage` adapter or an explicitly exported file. The v2 web app does
not submit them to a worker, D1, analytics endpoint, or research archive.

Public shares are intentionally result-only projections. “Public” does not
mean anonymous or authenticated; the projection simply minimizes the data
released by this app. Numeric similarity, rank/tie metadata, active modifier
names, scored specialist results, and evidence summary remain shareable
content and should be treated as potentially identifying in context.

Legacy participant identity and pending research records are archive-only and
are outside the assessment save migration boundary. Display preferences are
not assessment data.

## Phase 13 research boundary

Optional research collects no direct identity, account, device, session, private-save, share, result, label, diagnostic, self-label, or demographic fields. It is disabled in production and requires explicit post-result consent plus a separate send action. See `research-consent.md`, `research-security.md`, and `research-retention.md`.
