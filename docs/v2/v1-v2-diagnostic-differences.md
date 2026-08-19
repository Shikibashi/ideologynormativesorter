# v1/v2 diagnostic differences

## Legacy divergence

The v1 divergence path compared four explicit normative-prescriptive pairs and
applied a polarity inversion for liberty versus regulation. v2 preserves those
pairs as canonical `cross_dimension_pair` records and preserves the inversion
as `secondDirection: -1`. The v1 `0.35` display threshold and generated prose
are not preserved because they were not part of the Phase 0 measurement
contract. This is an INTENTIONAL_CHANGE in presentation semantics, with the
underlying native-scale difference preserved.

## Legacy domain results

`computeDomainMiniResults` reconstructed item-level means independently from
raw answers. It is classified as a KNOWN_DEFECT parallel diagnostic/scoring
path. v2 domain summaries derive from finalized construct results and retain
only explicitly labeled diagnostic means.

## Legacy reason breakdowns

`computeReasonBreakdowns` selected prescriptive items and recomputed their
contributions. It is classified as a KNOWN_DEFECT parallel explanation path.
v2 contribution traces use the exact Phase 3 records instead.

## Legacy conflated labels

`computeConflatedLabels` mixed layer-level profile agreement with heuristic
thresholds and user-facing prose. The useful semantic remainder is ordinary
near-tied/profile comparison data already represented by Phase 5 ranking and
Phase 8 profile diagnostics. The legacy name is ARCHIVE_ONLY.

There are no unexplained MUST_PRESERVE scoring mismatches in this diagnostic
classification. No v1 runtime module is imported by v2 diagnostics.
