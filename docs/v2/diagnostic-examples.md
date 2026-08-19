# v2 diagnostic examples

The following examples use the Phase 8 contracts and show the underlying
values, not UI prose.

## Contribution trace

```json
{
  "contributionId": "item-1\\u0000construct-a\\u0000",
  "itemId": "item-1",
  "constructId": "construct-a",
  "responseState": "answered",
  "normalizedValue": 1,
  "mappingWeight": 2,
  "salienceFactor": 0.5,
  "effectiveWeight": 1,
  "weightedContribution": 1,
  "included": true
}
```

## Construct explanation

If the authoritative construct numerator is `1`, denominator is `2`, and the
trace has one included contribution of `1` with mapping weight `2`, both
arithmetic reconciliation flags are true. A negative trace enters only the
negative list when its signed `weightedContribution` is below zero.

## Divergence

For scores `0.5` and `-0.25` with `secondDirection: 1`, the structured result is
`signedDifference: 0.75` and `magnitude: 0.75`. If the second construct is
abstained, status is `unavailable`, `magnitude` is absent, and no midpoint value
is substituted.

## Domain summary

Two scored constructs with values `0.5` and `-0.5` have diagnostic mean `0`.
That value remains labeled as a diagnostic mean and cannot be used as a domain
score or profile input.

## Profile, modifier, and specialist explanations

These records retain the authoritative comparison `weightedSquaredError`,
distance, fit, gate evaluations, module activation status, and evidence status.
Closest profile constructs are ordered by lowest weighted squared error; largest
departures are ordered by highest weighted squared error. No second distance or
fit is calculated.
