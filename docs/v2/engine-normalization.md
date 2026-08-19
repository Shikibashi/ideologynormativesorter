# Phase 3 response normalization and contribution engine

Phase 3 is the pure boundary between raw assessment responses and the
explicit content mappings compiled in Phase 2. It does not aggregate
constructs, match profiles, evaluate modifiers, score specialist modules, or
produce an assessment result.

## Public operation

`prepareAssessmentResponses(input, bundle)` performs these steps:

1. validate the input envelope and response records against the supplied
   content bundle;
2. reject duplicate item IDs and version/fingerprint mismatches;
3. synthesize a `missing` normalized response for every active item not present
   in the input;
4. normalize answered responses in stable item-ID order;
5. emit one contribution record per selected explicit item-to-construct
   mapping;
6. preserve non-answer states and emit exclusion records where a mapping
   exists.

The returned object carries `responseSchemaVersion`, `scoringVersion`,
`contentVersion`, and `contentFingerprint`. The input array and its response
objects are not mutated.

## Legal response values

`likert5` accepts integer values from `-2` through `2` and normalizes with:

`unit = rawValue / 2`

`likert7` accepts integer values from `-3` through `3` and normalizes with:

`unit = rawValue / 3`

The result is clamped to `[-1, 1]`. If the canonical item is reversed, the
sign is negated after scale conversion and before contribution arithmetic.
The raw value and the single reverse decision remain visible in the normalized
response.

Statement-choice responses normalize to unit `1`. Only the selected option's
explicit mappings are eligible for contribution generation. There is no
item-level fallback mapping and no inheritance from another option.

## Salience

The item layer selects the salience source:

- descriptive items use `confidence`;
- prescriptive items use `priority`;
- normative and otherwise neutral items use factor `1`.

Legal ratings are `1`, `3`, and `5`, mapped to `0.2`, `0.6`, and `1`.
If a nonnormative answered item lacks its required rating, its mappings are
retained as excluded records with `salienceFactor: 0` and
`exclusionReason: "salience_skipped"`. It is not silently treated as fully
salient.

## Contribution arithmetic

For an included record:

```text
effectiveWeight = mappingWeight * salienceFactor
weightedContribution = normalizedInput * direction * effectiveWeight
```

For a non-answer or salience-skipped record, `normalizedInput` is `null`,
`effectiveWeight` is `0`, and `weightedContribution` is `0`. Non-answer
records use state-specific exclusion reasons. A statement-choice non-answer
has no selected option and therefore emits no construct record; its normalized
response state remains available to the future kernel.

The engine never sums records. Multiple records for one construct remain
separate evidence contributions for Phase 4.

## Determinism and safety

Content mappings, active items, responses, and output records are ordered by
stable IDs. Input order cannot affect output. The engine rejects unknown or
inactive items, wrong response types, unknown statement options, non-finite
values, illegal scale values, invalid salience ratings, and malformed
response shapes with `ScoringError` issue codes.

The engine imports only Phase 1 contracts and Phase 2 canonical content
structures. v1 runtime modules, UI code, browser storage, profile matching,
modifier scoring, specialist scoring, and construct aggregation are outside
this boundary.
