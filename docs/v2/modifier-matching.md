# Phase 6 Modifier Matching

Phase 6 consumes only the immutable Phase 4 `ConstructAssessment` and the
canonical modifier records. It does not accept raw responses, call response
normalization, recompute item contributions, read primary-profile matches, or
derive a modifier from ontology ancestry.

## Direct-indicator authority

The current approved v2 modifier corpus contains seven `core-construct`
modifiers. Their indicator item IDs, directions, independent modifier weights,
minimum answered counts, and fit thresholds are the complete modifier scoring
contract. The other 17 catalog/focused records remain explicit but are
unavailable for ordinary matching.

The matcher reads `ContributionRecordBase.normalizedInput` and
`sourceResponseState` from the construct assessment. It never reads the raw
response envelope. Multiple construct contributions from one indicator are
deduplicated by item ID for modifier arithmetic; their construct IDs and stable
contribution IDs are retained for traceability.

## Distance and fit

For each measured indicator:

```text
directedValue_i = normalizedInput_i * modifierDirection_i
error_i         = (directedValue_i - targetValue_i)^2
```

`targetValue` defaults to `1`. The modifier's own indicator weight is used for
the weighted RMS distance:

```text
distance = sqrt(sum(modifierWeight_i * error_i) / sum(modifierWeight_i))
fit      = clamp(1 - distance / 2, 0, 1)
```

Core records declare the approved fit threshold `0.65` and evidence threshold
`0.4`. The v1 direct matcher was unweighted, so the extracted unit weights
preserve its results while making the independent modifier weighting explicit.

## Evidence and output

Evidence counts indicators, not primary constructs. Missing, skipped, abstained,
refused, and salience-excluded indicators are retained as explicit comparison
records. A modifier is ordinarily active only when its minimum answered count,
evidence coverage, uncertainty policy, and content-declared gates pass.

Every canonical modifier appears exactly once in `ModifierAssessment.modifiers`:

- `active`: measured and eligible;
- `below-threshold`: measured with a continuous fit below the fit threshold;
- `inactive`: measured or attempted but blocked by evidence, uncertainty, or a gate;
- `unavailable`: catalog-only or focused-follow-up content without ordinary core measurement.

No top-five filter is applied. Presentation may later choose how to display the
complete result set, but it cannot make a low-fit record disappear.
