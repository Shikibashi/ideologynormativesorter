# Brief: Advanced Infrastructure for Political Judgment Decomposition Test

Implement the full set of advanced reliability, explainability, versioning, reproducibility, corpus audit, calibration, methodology page, and decomposition-depth features for the existing political judgment decomposition test app (ideology sorter).

The repo is brownfield Vite 8 + React 19 + TS 6 + Vitest 4 + ESLint 10, no router, no DB. Core (400 clean-room questions, 24 axes, 8 labels, tiered modes, pure scoring, share via URL, UI) is implemented and tests pass.

Scope (all-three-combined, user chosen):
- Reliability indicators (per-axis and per-label pragmatic bands)
- Explainability ("Why this score" with top contributing questions)
- Question versioning (optional fields + bank constants, no mass edit of bank)
- Result reproducibility (v2 share envelope with versions, backward compat)
- Corpus audit (typed report with coverage/problems)
- Calibration fixtures (synthetic archetypes for 6+ labels)
- Methodology page (via Stage extension)
- Decomposition depth: divergence vs contradiction detection, domain mini-results, same-answer/different-reason and different-answer/same-value analysis

Constraints:
- No new runtime deps
- Pure functions, unit-testable, deterministic
- Preserve existing public APIs (buildResultProfile, etc.)
- No changes to question bank bodies (questions.ts etc.)
- All new user-facing text original
- Final gate: ai-slop-cleaner + verification (npm test/lint/build + new behavior fixtures) + code review

Detailed phases in local://ideology-advanced-infrastructure-plan.md and the reviewed plan. Implementation must follow the 10 phases in order, with tests passing after each, and full verification at end.

This is a multi-phase implementation requiring ordered stories, checkpoints, and final quality gate before marking complete.
