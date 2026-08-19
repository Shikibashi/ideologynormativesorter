# v2 specialist scoring semantics

## Construct layer

Specialist item responses reuse the Phase 3 response normalizer and explicit
contribution records. The scoped content index retains all mapping endpoints for
validation but emits and aggregates only the requested module's local
constructs. A specialist item may also declare a root-construct relationship for
the canonical content audit; that relationship is not included in the
specialist construct assessment and cannot contaminate the core assessment.

Each module result carries its scoped `ConstructAssessment`, including response
states, contribution provenance, construct evidence, and construct scores.

## Profile layer

Only output profiles listed by the module are considered. Profiles are matched
against that module's local constructs; no ontology ancestry, name matching,
cross-module comparison, or global specialist ranking is used.

Profile variants are evaluated using their explicit target requirements and
constitutive gates. Weighted squared distance is normalized by measured
requirement weight and mapped to similarity on `[0,1]` with maximum distance
`2`. Missing construct evidence abstains, and a failed gate abstains. Ties use
the fixed `1e-12` tolerance and lexical IDs for deterministic ordering.

Ranking and `topProfileIds` exist only inside a module. Catalog-only specialist
profiles without module ownership are not output by module scoring.

## Result separation

Specialist results are returned in `SpecialistAssessment.modules`. They are not
primary profile matches, modifier matches, or a replacement for either layer.
This phase stops before uncertainty diagnostics, final result assembly, and UI
integration.
