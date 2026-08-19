# v1/v2 UI Differences

The v2 interface is a clean-room web surface, not a visual migration of the v1 application.

- v2 presents canonical prompts and options directly from the generated content bundle.
- v2 uses an explicit questionnaire state machine and separates optional specialist routing from the core flow.
- v2 sends one complete input to `scoreAssessment()` rather than composing scores in UI code.
- v2 presents profile similarity and evidence coverage; it does not claim identity, probability, reliability, or diagnosis.
- v2 preserves ties and displays unavailable evidence as unavailable.
- v2 keeps diagnostic explanations sourced from the unified result diagnostics table.
- v2 stores answers in memory for the current lifecycle only; persistence and sharing are deferred to Phase 12.

The v1 production app remains untouched and continues to be governed by its own release boundary.
