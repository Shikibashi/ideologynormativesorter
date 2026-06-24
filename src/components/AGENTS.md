<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-22 | Updated: 2026-06-22 -->

# components

## Purpose
React UI components implementing the quiz stages and visualizations. All components are functional, use hooks for local state where needed, and receive data via props from App.tsx. Focused on rendering the intro, quiz interaction, results display, axis visualizations, and methodology info.

## Key Files
| File | Description |
|------|-------------|
| `IntroScreen.tsx` | Displays quiz tier options (quick/moderate/extensive) with question counts and explanatory cards for layers/theory |
| `QuizScreen.tsx` | Renders current question (Likert scales or statement choice), handles salience ratings (confidence/priority), dont_know, navigation |
| `ResultsScreen.tsx` | Shows layered axis profiles, ideal/non-ideal gaps, nearest labels, conflated labels (layer-conflation flags), module suggestions, share link button |
| `AxisBar.tsx` | Visual bipolar axis bar with normalized score marker, poles, reliability badge, salience info, and optional 'Why this score?' contribution list |
| `MethodologyScreen.tsx` | Documents the test's approach (layers, theory, scoring) for users |

## Subdirectories
None.

## For AI Agents

### Working In This Directory
- Keep components presentational; move logic to scoring/ or App if complex.
- Use consistent CSS classes from App.css/index.css.
- For new features, add to ResultsScreen or new component, pass data from App.
- AxisBar expects axis and score props; extend for new metrics.
- QuizScreen manages per-question state (answer + salience); update handle* functions carefully.

### Testing Requirements
- Integration tests in App.test.tsx cover flows; add component tests if isolated.
- Test UI renders for different answer states, tier selections, result profiles.
- Verify accessibility (roles, labels) and interaction (clicks, selections).

### Common Patterns
- Props destructuring in function params.
- useState for local UI state (e.g., copied state in Results).
- Conditional rendering based on stage or data presence (e.g., gaps.length > 0).
- Event handlers passed from parent or local (e.g., onStart, onComplete).
- Descriptive text for layers in LAYER_TITLES.

## Dependencies

### Internal
- Types from ../types (Axis, ResultProfile, etc.)
- Data imports via App (questions, axes, etc. passed as props)
- Scoring utils indirectly via ResultProfile
- share/buildShareUrl for copy link

### External
- React for components/hooks

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->