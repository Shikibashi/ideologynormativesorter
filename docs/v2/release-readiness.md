# v2 Release Readiness

This document governs a release candidate only. It does not authorize production deployment, traffic cutover, D1 production writes, removal of v1, or empirical claims.

## Required gates

- Phase 13 research infrastructure receipt is `GO` with production writes disabled.
- Phase 14 analysis receipt is `GO` with empirical evidence status `NOT_EVALUATED`.
- Fresh install, typecheck, lint, production build, Phase 1-14 tests, and deterministic artifact checks pass.
- Canonical content, scoring authority, clean-room, privacy, and import-boundary audits pass.
- Chromium, Firefox, and WebKit behavioral/accessibility checks pass; WebKit may use the pinned official Playwright container on Fedora-family hosts; visual snapshots are compared in Chromium; responsive checks cover desktop and mobile.
- Performance remains within the Phase 13 payload and web budgets.
- Migration, rollback, support, and maintainer documents are present and reviewed.
- The release commit worktree is clean. Unrelated worktree changes must remain outside the release commit and must not be discarded by automation.

The machine-produced result is `v2/release/release-candidate-receipt.json`. A `NO-GO` receipt is authoritative for the candidate and must not be reinterpreted as a deployment approval.

The repository-wide v1 suite currently retains five documented pre-existing failures in untouched legacy files. They are not silently treated as v2 passes and are not fixed by changing v1 behavior during this clean-room rebuild.
