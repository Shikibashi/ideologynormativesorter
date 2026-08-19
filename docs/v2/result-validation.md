# v2 result validation

`validateAssessmentResult()` is the final runtime invariant check. It verifies
the complete version tuple, finite numeric values, bounded similarities and
coverage, unique construct/module/profile IDs, ranking references, abstained
profile rank rules, specialist module references, and contribution references.

Invalid input is represented by deterministic `ScoringError` values with an
error category and code. Valid incomplete evidence returns a result with
`partially_scored` or `insufficient_core_evidence`; it is never converted to an
invalid result.

`serializeAssessmentResult()` rejects non-JSON values and uses the canonical
stable serializer. The serialized result is deterministic because all semantic
arrays are sorted by explicit IDs or ranks before assembly.
