# v2 Maintainer Release Checklist

- [ ] Confirm Phase 13 and Phase 14 receipts are `GO`.
- [ ] Run the fresh-install, typecheck, lint, build, unit, architecture, browser, accessibility, visual, performance, privacy, and deterministic checks.
- [ ] Inspect the generated release-candidate receipt and blocker register.
- [ ] Confirm production writes and traffic cutover remain disabled.
- [ ] Confirm empirical validation status remains `NOT_EVALUATED` unless a separately reviewed real-data claim registry exists.
- [ ] Review the release-owned diff without staging unrelated user changes.
- [ ] Obtain explicit deployment and governance approval before any future activation.
