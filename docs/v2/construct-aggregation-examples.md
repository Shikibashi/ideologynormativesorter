# Construct Aggregation Examples

The examples below use already-normalized inputs and positive mapping weights.
Polarity is shown explicitly where it changes a contribution.

## A. Equal weights

Two answered items produce `+1` and `-1`, each with mapping weight `1`:

```text
numerator   = (1 * 1) + (-1 * 1) = 0
denominator = 1 + 1 = 2
score       = 0 / 2 = 0
```

## B. Unequal weights

One item produces `+1` at weight `2`; another produces `-0.5` at weight `1`:

```text
numerator   = (1 * 2) + (-0.5 * 1) = 1.5
denominator = 2 + 1 = 3
score       = 1.5 / 3 = 0.5
```

## C. Missing response at the exact threshold

One of two equal-weight slots is answered with `+1`; one is missing:

```text
evidenceRatio = 1 / 2 = 0.5
score         = 1 / 1 = 1
status        = scored
```

The result is scored because the minimum ratio is inclusive. Missing weight is
reported separately and does not enter the numerator or denominator.

## D. Abstention with sufficient ratio

One of two equal-weight slots is answered with `+1`; one is explicitly
abstained:

```text
evidenceRatio = 1 / 2 = 0.5
score         = 1
status        = scored
uncertainty   = elevated because abstention is present
```

Abstention is not a neutral response and remains visible in the evidence.

## E. Refusal with sufficient ratio

One of two equal-weight slots is answered with `-1`; one is refused:

```text
evidenceRatio = 1 / 2 = 0.5
score         = -1
status        = scored
uncertainty   = elevated because refusal is present
```

The refusal contributes no score weight.

## F. Below-threshold evidence

One of three equal-weight slots is answered with `+1`; two are missing:

```text
evidenceRatio = 1 / 3 = 0.333333...
status        = abstained
score         = null
reason        = insufficient_evidence
```

## G. All missing

Two eligible slots are both missing:

```text
evidenceRatio = 0 / 2 = 0
status        = abstained
score         = null
reason        = all_responses_missing
```

The result is not a neutral zero.

## H. Salience remains numerator-only

A descriptive item has mapping weight `2`, normalized input `+1`, and
confidence salience factor `0.2`:

```text
numerator             = 1 * 2 * 0.2 = 0.4
scoredMappedWeight    = 2
scoredEffectiveWeight = 0.4
score                 = 0.4 / 2 = 0.2
```

Using `0.4` as the denominator would incorrectly restore the score to `1`.

## I. Multi-construct item

One normalized `+1` response maps independently to two constructs:

```text
construct alpha: weight 2, polarity +1 -> numerator  2, score  1
construct beta:  weight 3, polarity -1 -> numerator -3, score -1
```

The two mapping records are separate evidence for their respective
constructs. Neither construct inherits the other mapping.

## J. Statement-choice non-answer

Option A maps `alpha` at weight `1`; option B maps `alpha` at weight `3`. If
the item is skipped before an option is selected, the evidence layer creates
one `alpha` slot with weight `3`, the maximum declared alternative weight:

```text
expectedItemCount    = 1
skippedItemCount     = 1
skippedWeight        = 3
totalEligibleWeight = 3
status               = abstained
reason               = all_responses_skipped
```

The alternatives are not counted as two items, and neither option produces a
score contribution.

