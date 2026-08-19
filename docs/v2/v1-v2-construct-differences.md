# V1/V2 Construct Aggregation Differences

## MUST_PRESERVE arithmetic

For a legal answered item with an explicit mapping, v2 preserves the v1
answered construct/axis arithmetic:

- Likert normalization is performed once before aggregation;
- mapping polarity is applied once;
- salience scales the contribution numerator;
- the normalized score divides by the absolute raw mapping-weight sum;
- the result is bounded to `[-1, 1]`.

The v1 differential test covers a descriptive Likert-5 answer with weight `2`
and confidence `1`: both implementations produce a raw contribution of `0.4`
and a normalized score of `0.2`.

## Intentional changes

- V2 records every item-to-construct mapping explicitly in canonical content.
- V2 reports separate missing, skipped, abstained, and refused evidence.
- V2 abstains explicitly when evidence is insufficient instead of returning a
  neutral zero for an unmeasured construct.
- V2 uses `ConstructAssessment` as the reusable boundary before profile or
  modifier matching.
- V2 defines deterministic evidence slots for non-answered statement-choice
  items using the maximum mapping weight per construct across alternatives.
- V2 includes specialist item mappings as construct evidence without scoring
  specialist profiles at this phase.
- V2 exposes raw mapped and effective salience weights separately so salience
  cannot cancel itself through denominator renormalization.

## Known-defect behavior

V1 fallback mapping behavior, overlay composition, dual result paths, and
ambiguous abstention semantics are not reproduced. Those differences are
expected clean-room corrections documented in the Phase 0 and Phase 2
decisions. V2 does not use v1 runtime code to calculate construct results.

## Terminology

The v1 `reliability` helpers are not a validation authority for Phase 4. V2
uses evidence coverage, support status, and uncertainty reasons. No response
count is presented as psychometric reliability or internal consistency.

