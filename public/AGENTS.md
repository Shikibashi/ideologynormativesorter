<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-22 | Updated: 2026-06-22 -->

# public

## Purpose
Static public assets served directly by Vite (not processed). Contains SVG icons and favicon for the SPA.

## Key Files
| File | Description |
|------|-------------|
| `icons.svg` | SVG sprite with icons for social (Bluesky, Discord, GitHub, X), docs, sharing |
| `favicon.svg` | Browser tab favicon |

## Subdirectories
None.

## For AI Agents

### Working In This Directory
- Assets are referenced directly in index.html or components (e.g., via <use> for sprites).
- Do not add code here; keep for static files only.
- Changes to icons affect UI visuals; update references if renaming.

### Testing Requirements
- Visual/UI tests may reference these; no unit tests here.

### Common Patterns
- Use SVG sprites for multiple icons to reduce HTTP requests.

## Dependencies

### Internal
- Referenced from src/components/ and index.html.

### External
- None (pure static SVGs)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->