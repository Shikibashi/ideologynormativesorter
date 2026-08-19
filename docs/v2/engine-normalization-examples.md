# Phase 3 normalization examples

These examples use the Phase 3 contract, not a historical runtime overlay.

## Likert conversion and reverse scoring

For a non-reversed `likert5` item with raw value `2`:

```text
normalizedInput = 2 / 2 = 1
```

For a reversed `likert7` item with raw value `3`:

```text
unit = 3 / 3 = 1
normalizedInput = -unit = -1
```

Reverse scoring is applied once. A future engine must not negate the
contribution again merely because the normalized response records
`reverseScored: true`.

## Explicit mapping arithmetic

For normalized input `1`, mapping polarity `-1`, weight `0.5`, and neutral
salience:

```text
effectiveWeight = 0.5 * 1 = 0.5
weightedContribution = 1 * -1 * 0.5 = -0.5
```

The record remains separate from every other record targeting the same
construct.

## Salience omission

For a descriptive item with normalized input `1` and no confidence response:

```text
salienceFactor = 0
included = false
exclusionReason = "salience_skipped"
weightedContribution = 0
```

For a prescriptive item with priority `1`:

`salienceFactor = 1 / 5 = 0.2`

Normative items use factor `1` and do not require confidence or priority.

## Missingness

An absent active item becomes:

```json
{
  "state": "missing",
  "itemId": "item-id"
}
```

For an item-level mapping, its exclusion record has
`normalizedInput: null`, `effectiveWeight: 0`, and
`exclusionReason: "missing_response"`. `skipped`, `abstained`, and `refused`
remain distinct states and receive distinct exclusion reasons.
