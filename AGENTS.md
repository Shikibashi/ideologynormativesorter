# Repository Guidelines

## Project Overview
ideologynormativesorter is a political judgment decomposition test application. It is an interactive React SPA that separates responses into three independent layers (normative moral values, descriptive empirical beliefs, prescriptive policy preferences) under ideal vs. non-ideal conditions. Users answer tiered quizzes (quick/moderate/extensive) from a ~600-question clean-room bank, receive detailed scoring across 26 axes (8 normative, 7 descriptive, 9 prescriptive, 2 cross-cutting), and see mappings to 16 ideology labels with reliability, explainability, and decomposition metrics. Results are shareable via URL hash.

## Architecture & Data Flow
Pure frontend SPA (no router, no database). All routing/state in `App.tsx` (stages: intro → quiz → results). Optional faction modules triggered post-scoring.

Data flow:
- Questions (with `axisWeights`, `layer`, `theoryContext`, `tier`) + `AnswerMap` → normalization (`normalizeAnswer` + `salienceFactor`) → aggregation (`computeAxisScores` per layer) → `ScoreBreakdown` → derived outputs (gaps, label matches, reliabilities, contributions, divergences, domain mini-results, reason breakdowns) → `ResultProfile`.
- Results rendered via components; shareable via `encodeAnswers`/`buildShareUrl` (v2 base64url envelope with `bankVersion`/`scoringVersion`).

Scoring is isolated in pure, deterministic functions (no side effects). UI is minimal (functional components + hooks only).

## Key Directories
- `src/components/`: React UI (IntroScreen, QuizScreen, ResultsScreen, AxisBar, MethodologyScreen). All stateless or pure local state.
- `src/scoring/`: Pure functional pipeline (~14 files). Core: `buildResultProfile` (orchestrator), aggregate, normalize, labelMatch, gap, reliability, explain, divergence, domainResults, reasonDecomposition, moduleSuggestions.
- `src/data/`: Static data + validation (questions.ts ~600 items + `QUESTION_BANK_VERSION`, axes.ts, labels.ts with centroids, domains.ts, factionModules.ts, moduleQuestions.ts, audit.ts, dataValidity.test.ts).
- `src/types/`: All definitions (barrel in index.ts; branded IDs like `AxisId`/`QuestionId`, unions for `Layer`/`QuizTier`/`TheoryContext`/`ResponseType`).
- `src/share/`: URL encoding (base64url v2 with versioning).
- `src/test/`: Vitest setup.

## Development Commands
```bash
npm run dev      # Vite dev server (HMR)
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run test     # vitest run
npm run preview  # vite preview
```

## Code Conventions & Common Patterns
- **Purity**: All scoring is pure/deterministic (questions[] + AnswerMap → immutable ResultProfile). No mutations or side effects. Composition via sequential calls in `buildResultProfile`.
- **TypeScript**: Strict mode (noUnusedLocals/Parameters, strict, erasableSyntaxOnly). Branded string IDs. Union types for enums (Layer, TheoryContext, QuizTier, ResponseType). Interfaces for shapes.
- **Imports**: `import type { ... }` for types. Explicit relative paths. Data: `import { questions } from '../data/questions'`.
- **Naming**: camelCase for functions/vars; PascalCase for components/types. Descriptive (e.g., `computeAxisScores`, `salienceFactor`).
- **React**: Functional components + hooks (`useState`, `useMemo`). State in `App.tsx` (shallow tree, props drilling). No context or external state libs.
- **File organization**: Colocated by concern (scoring/ by function, data/ for static + validation, types/ barrel, components/ for UI). Tests as `.test.ts` next to source or in data/.
- **Versioning**: `QUESTION_BANK_VERSION` / `SCORING_VERSION` constants; embedded in share URLs for reproducibility.
- **Error/edge handling**: `dont_know` returns null (excluded); unmeasured axes normalize to 0 with `itemCount: 0`.
- **Testing**: Descriptive `it()` names. Fixtures for synthetic data. `fireEvent` + `screen` queries. afterEach cleanup.

## Important Files
- `package.json`: Scripts, deps (React 19, Vite 8, Vitest 4, TS ~6).
- `vite.config.ts`: React plugin + Vitest (jsdom, setupFiles: `./src/test/setup.ts`).
- `tsconfig*.json`: Strict TS, bundler resolution, project references.
- `eslint.config.js`: Flat config (recommended + TS + React hooks/refresh).
- `index.html` + `src/main.tsx`: SPA entry (StrictMode → App).
- `src/App.tsx`: Stage machine, tier selection, `buildResultProfile` calls, module handling, share loading.
- `src/scoring/index.ts`: Orchestrator + re-exports (`buildResultProfile` and all sub-modules).
- `src/data/questions.ts`: Bank + `questionsForTier`, versioning constants.
- `src/data/axes.ts`, `labels.ts`, `domains.ts`: Axis/Label/Domain defs + maps (centroids for matching).
- `src/types/scoring.ts`: Core shapes (`AxisScore`, `ScoreBreakdown`, `ResultProfile` + derived types).
- `src/share/index.ts`: encode/decode + buildShareUrl/readSharedAnswers (v2 versioning).
- `quality-gate.json`: Records of verification gates.

## Runtime/Tooling Preferences
- Runtime: Node (ES modules via `"type": "module"`). npm (lockfileVersion 3).
- Build: Vite 8 (tsc -b pre-step; output to dist/).
- Tooling constraints: Strict TypeScript (noEmit, noUnused*, verbatimModuleSyntax); ESLint flat (baseline recommended, no type-aware by default); Vitest. No Prettier or formatter config. No React Compiler.

## Testing & QA
- Framework: Vitest 4 + React Testing Library + jsdom.
- Run: `npm run test` (vitest run, headless).
- Scope: 14 test files, 110 tests (all passing). Mix of:
  - Integration: full App flow (tier selection, quiz loop, results, shared links, modules) in `App.test.tsx`.
  - Unit: pure scorers (aggregate, normalize, gap, labelMatch, reliability, explain, divergence, decomposition) with fixtures.
  - Data validation: bank coverage/consistency (`dataValidity.test.ts` + `audit.test.ts`).
  - Share: encode/decode + versioning.
- Patterns: Descriptive `it()` names; `fireEvent` + `screen` queries; synthetic fixtures (e.g., calibration archetypes); afterEach cleanup. Strong coverage on scoring logic and data integrity. No mocks for core paths.
- QA gates: Tests + lint + build must pass; ai-slop-cleaner + code review required for delivery (see quality-gate.json).