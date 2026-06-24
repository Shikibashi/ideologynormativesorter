<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-22 | Updated: 2026-06-22 -->

# src

## Purpose
Core source code for the ideologynormativesorter React SPA. Contains the main application logic, UI components, pure scoring engine, data models, and type definitions. The app implements a political ideology decomposition quiz with advanced scoring, reliability, and explainability features.

## Key Files
| File | Description |
|------|-------------|
| `main.tsx` | React entry point rendering App in StrictMode |
| `App.tsx` | Central state machine managing stages (intro/quiz/results), quiz tiers, answers, scoring orchestration, module handling, and share link loading |
| `App.test.tsx` | Integration tests for full app flow including tier selection, quiz interaction, results, and sharing |
| `App.css` / `index.css` | Global styles for the SPA |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `components/` | Reusable React UI components for screens and visualizations (see `components/AGENTS.md`) |
| `data/` | Static data definitions (questions, axes, labels, domains) and validation (see `data/AGENTS.md`) |
| `scoring/` | Pure functional scoring pipeline and related modules (see `scoring/AGENTS.md`) |
| `share/` | URL-based result encoding/decoding for shareable links (see `share/AGENTS.md`) |
| `types/` | TypeScript interfaces, unions, and branded types (see `types/AGENTS.md`) |
| `test/` | Shared test setup and configuration (see `test/AGENTS.md`) |
| `assets/` | Static assets like images and icons (see `assets/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- All application logic lives here; changes should preserve pure scoring functions and deterministic behavior.
- State is centralized in App.tsx; avoid adding global state or external libs unless specified.
- Follow strict TypeScript and pure function patterns for scoring.
- Use relative imports; barrel exports in types/.

### Testing Requirements
- Run `npm run test` for Vitest; focus on unit tests for scoring and integration for App.
- Add tests for new scoring logic or UI flows.
- Data changes should pass dataValidity.test.ts and audit tests.

### Common Patterns
- Pure functions: e.g., buildResultProfile, compute* functions take inputs and return immutable outputs.
- React: Functional components with useState/useMemo; no classes or Context.
- Data flow: Questions + Answers → Scoring → ResultProfile → UI.
- Tiered data: questionsForTier filters based on quick/moderate/extensive.

## Dependencies

### Internal
- Relies on data from src/data/ for questions/axes/labels.
- Scoring logic in src/scoring/ is the core computation engine.
- Types in src/types/ define all interfaces used across src/.

### External
- React 19 for UI
- No other runtime deps beyond React/React-DOM

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->