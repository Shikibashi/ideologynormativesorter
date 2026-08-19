# v2 UI Claim-Boundary Audit

Phase 11 UI language is limited to measured profile similarity, construct position, evidence coverage, uncertainty as reported by the engine, gate status, and diagnostic trace information.

The UI does not claim that a person is an ideology, identify a person, assign probability, report reliability, diagnose a person, or expose a salience multiplier. It uses “confidence captured” and “priority captured” only for the canonical response metadata fields.

Automated enforcement lives in `tests/v2-web/claim-boundary.test.ts`. The web architecture test separately rejects v1 imports and low-level scoring calls from UI source.
