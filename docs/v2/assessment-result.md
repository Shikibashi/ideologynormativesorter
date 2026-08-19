# v2 AssessmentResult

Phase 9 establishes one canonical derived result. `AssessmentResult` contains
the version binding, assessment status and evidence summary, root construct
results, primary profile results and ranking, modifiers, specialist module
projections, and downstream diagnostics.

The result does not contain raw or normalized responses. It also does not copy
the content bundle. `diagnostics.contributions` is the one contribution table;
construct, specialist, and diagnostic records refer to contribution IDs.

Labels are profile similarities, not probabilities or classifications. Evidence
coverage is not psychometric reliability. A specialist module that is not
activated is not a rejection, and abstention is not neutrality.

The canonical result intentionally has no result fingerprint. The stable
serializer is sufficient for deterministic fixtures at this stage; save/share
integrity metadata belongs to a later persistence boundary.
