# v1/v2 Persistence Differences

v1 saves persisted a question snapshot, tier/index fields, and answer objects
whose semantics were interpreted by the old runtime. v2 persists only the
validated declarative `AssessmentInput`, explicit response states, canonical
version bindings, and a safe presentation cursor. Historical question banks,
overlay layers, participant identity, and research wrappers are not copied.

v1 answer shares were compact raw-answer payloads. v2 public shares are
result-only projections and cannot be used as v2 inputs. v2 private export is
a separate sensitive format with schema validation and integrity metadata.

These are intentional changes to remove hidden defaults, runtime overlays, and
privacy leakage. No scoring-relevant MUST_PRESERVE mismatch is accepted by the
Phase 12 reconciliation boundary.
