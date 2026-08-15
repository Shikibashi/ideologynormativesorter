# Current Repository Brief: Political Judgment Decomposition Test

This brief records the current implementation contract for the ideology sorter. It supersedes the earlier advanced-infrastructure planning brief, which described a pre-release architecture and stale question, axis, label, and test counts.

## Application contract

- Stack: Vite 8, React 19, TypeScript 6, Vitest 4, ESLint 10, and Playwright. The frontend has no router or application database.
- Entry flow: `src/main.tsx` mounts `App`; `src/App.tsx` delegates orchestration to `src/app/useAppController.ts`; `src/components/AppStage.tsx` renders the current stage.
- Stages: intro, methodology, consent, core quiz, self-identification, optional specialist invitation/quiz/criterion/result, and final results.
- Public quiz tiers: Balanced (`moderate`, 206 active core questions) and Full-depth (`extensive`, 338 active core questions). `blitz` and `quick` remain nested internal/legacy tiers and are not public intro choices.
- Effective live bank: 338 active core questions plus 68 respondent-facing specialist questions, for 406 live questions. The effective bank is the runtime source of truth; raw question files and historical audit tables are not substitutes for it.

## Measurement and taxonomy

- Taxonomy registry: `2026-08-taxonomy-v13`, with 16 ordinary primary labels, 24 modifier entries, 78 specialist entries, 19 context entries, and 8 retired compatibility entries.
- Primary measurement registry: `2026-08-primary-core-v1`. Required construct evidence gates a primary label; missing evidence abstains rather than using centroid or unrelated-axis imputation.
- Modifier measurement registry: `2026-08-modifier-construct-v1`. Ordinary modifier output is limited to declared direct core constructs; catalog-only and focused-follow-up modifiers remain provisional or abstain.
- Scoring remains layered across normative, descriptive, and prescriptive responses. Skips, “don’t know,” and refusals are non-substantive responses, not neutral answers.
- Result scoring version: `2026-08-13-taxonomy-v8`. Question-bank versions are composed in `src/data/effectiveQuestions.ts` from the raw bank and reviewed overlays.
- Sources and audit documents establish definitions, boundaries, and question context. They do not by themselves establish psychometric validity or answer keys. Specialist labels and matches remain experimental/provisional.

## Research, specialist modules, and collection

- Research contract: study `community-2026-v5`, schema `2026-08-v18`, consent `2026-08-12-v8`, profile form `profile-form-v3`, research-task form `2026-08-research-task-form-v2`, task bank `2026-08-research-task-bank-v3`, strategy task bank `2026-08-strategy-task-bank-v2`, and assignment strategy `balanced-hash-v2`.
- Research mode preserves the selected ordinary profile for contribution. Matrix/test-retest forms are explicit research requests and use deterministic membership, order, and fingerprints.
- The frozen specialist roster is `2026-08-specialist-roster-v1` with nine modules. Specialist results expose evidence coverage and gates and do not silently change the ordinary result.
- `research-collector/` provides dependency-free HTTP validation and NDJSON collection. `research-worker/` provides the Cloudflare Worker/D1 path, rate limiting, version checks, idempotency, and migrations.

## Validation and deployment

- Unit/data validation: `npm test`, `npm run lint`, `npm run build`, and `npm run research:check`.
- Research-worker validation: `npm run test:worker` and `npm run worker:check` (Cloudflare dry run).
- Browser validation: `npm run test:browser`, covering the e2e, accessibility, and ECW projects.
- Additional measurement validation is documented in `docs/psychometric-validation-protocol.md` and implemented in `analysis/` plus `src/validation/`.
- CI runs Node verification, collector/research/worker checks, build, R syntax checks, and browser projects. GitHub Pages deployment builds `dist` with the configured research environment; Worker deployment is a separate explicit operation.

## Change discipline

Before changing political-science, taxonomy, scoring, or measurement logic, read the applicable current audit documents, especially the methodology review, primary-core measurement audit, modifier-scope audit, psychometric protocol, and effective-bank/source audits. For each implementation task:

1. Identify affected files and make the smallest coherent change.
2. Add or update task-specific validation for changed behavior.
3. Run `npm test`, `npm run lint`, and `npm run build`, plus relevant research, worker, browser, or analysis checks.
4. Review the final diff for methodological, behavioral, version-contract, and deployment regressions.

Do not edit or stage the untracked `vite` artifact in the repository root.
