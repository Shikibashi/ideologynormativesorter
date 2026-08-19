# v2 Web Architecture

Phase 11 adds an isolated local web application at `v2/apps/web`. Its dependency direction is:

`contracts -> content -> engine -> view-model -> persistence -> web`

The web application calls only `scoreAssessment(input, canonicalBundle)` at the scoring boundary. It stores UI state in memory, builds raw response records from canonical item metadata, and renders the resulting `AssessmentResult` through `v2/packages/view-model`.

The state machine has explicit landing, core questionnaire, specialist routing, specialist questionnaire, ready-to-score, results, and recoverable-error states. Core and specialist progress are separate. Unanswered, missing, skipped, abstained, and refused response states are not collapsed in the UI.

The browser uses persistence only through an explicit storage adapter. Resume
and import validate input before restoring state; results remain downstream of
the public scoring facade. Public sharing is a deliberate result projection,
not a serialized input or diagnostics dump. The application is intentionally
not wired into the legacy production entry point. The isolated build writes to
`v2/dist-v2`; no deployment, route, database, or Cloudflare configuration
changes are part of this phase.

## Phase 13 research flow

The web client may expose an optional post-result consent panel only in an explicitly enabled non-production test/local configuration. The panel creates one immutable v2 research envelope and sends it through the research client with bounded retries. It does not change assessment input, result rendering, persistence, import/export, or share behavior.
