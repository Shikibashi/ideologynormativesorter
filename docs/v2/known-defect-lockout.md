# v2 Known-Defect Lockout

Phase 10 turns the Phase 0 known-defect list into executable lockouts. The behavior ledger is the machine-readable authority.

The v2 runtime must not reintroduce dual scoring, implicit mapping fallbacks, double reverse scoring, legacy scoring projections, historical aliases in active scoring, generated TypeScript as source authority, reliability terminology in place of evidence, unanswered-as-neutral behavior, conflated gate failure and unavailability, specialist contamination, or diagnostic rescoring.

`tests/v2-differential/known-defect-lockout.spec.ts` scans the v2 package boundary and checks that every ledger lockout remains covered. Any lockout that is not covered is a hard NO-GO. Legacy source remains available for historical audit and the isolated v1 adapter only.
