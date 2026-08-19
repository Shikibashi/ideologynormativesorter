# V2 Construct Aggregation

## Scope

Construct aggregation is the Phase 4 boundary. It consumes the immutable
`PreparedAssessment` and the canonical content bundle produced by earlier
phases. It returns construct results and evidence only. It does not match
profiles, score modifiers, activate specialist results, or calculate a final
ideology label.

The public entry points are:

- `computeConstructEvidence(constructId, prepared, contentIndex)`
- `determineConstructScorability(evidence)`
- `aggregateConstruct(construct, evidence)`
- `scoreConstructs(prepared, contentIndex)`
- `scoreConstructLayer(prepared, bundle)`

The result is an immutable `ConstructAssessment`. Construct records are
ordered by construct ID, contribution records are ordered by source item,
option, construct, and response state, and no filesystem or input ordering is
semantic.

## Eligible mapping slots

An eligible slot is one canonical active item-to-construct mapping that can
produce evidence for a construct.

- A direct item contributes one slot for each explicit mapping.
- An answered statement-choice item contributes slots from the selected
  option only.
- A non-answered statement-choice item contributes one slot per construct in
  the union of its options. If alternatives declare different weights, the
  maximum declared weight is used for that construct. Option identity is not
  counted because no option was selected.
- Specialist item mappings are eligible at this layer when their items are
  active. Module activation and specialist result scoring are later phases.

The statement non-answer rule is an evidence policy, not a scoring fallback.
It ensures that missing, skipped, abstained, and refused responses remain
visible without counting every hypothetical option as a separate item.

## Score formula

Phase 3 has already normalized the response and applied mapping polarity. For
each included contribution `i`:

```text
weightedContribution_i = normalizedInput_i
                        * polarity_i
                        * mappingWeight_i
                        * salienceFactor_i
```

The construct numerator is the finite sum of those explicit contribution
records:

```text
numerator = sum(weightedContribution_i)
```

The construct denominator is the stable sum of absolute raw canonical
mapping weights for the same included records:

```text
denominator = sum(abs(mappingWeight_i))
score       = clamp(numerator / denominator, -1, 1)
```

Salience affects the numerator but does not replace the mapping denominator.
`scoredEffectiveWeight` is retained as a diagnostic and is not the score
denominator. This prevents a low-confidence answer from being silently
renormalized back to full strength.

The denominator is zero only when no scored mapping remains. Such a construct
does not receive a neutral score. It is abstained with an explicit reason.
Non-finite arithmetic is an error. Values within the numeric tolerance of a
bound may be clamped to `-1` or `1`; values outside that tolerance fail
validation.

## Evidence and scorability

Evidence distinguishes response states rather than treating non-answers as
neutral:

- `answered`: a valid normalized response exists;
- `missing`: no usable response was supplied;
- `skipped`: the respondent explicitly skipped the item;
- `abstained`: the respondent selected an abstention state;
- `refused`: the respondent declined to answer.

The default construct minimum evidence ratio is `0.5`, inclusive:

```text
evidenceRatio = answeredItemCount / expectedItemCount
```

No-eligible constructs abstain with `no_eligible_items`. A construct whose
eligible slots all share one non-answer state uses the corresponding closed
reason. Otherwise, a ratio below `0.5`, or no scored mapping weight, abstains
with `insufficient_evidence`. A ratio exactly equal to `0.5` is sufficient.

An abstained result always has `score: null`, a machine-readable
`abstentionReason`, explicit evidence, support status, and uncertainty
summary. A scored result can still have elevated uncertainty when refusal,
abstention, missingness, or salience exclusion materially limits support.

## Evidence independence

Construct results are authoritative inputs for later phases. They contain the
score numerator and denominator, all evidence counters and weights, support and
uncertainty summaries, and stable contribution IDs. Phase 5 must not need raw
responses or recompute item contributions from the content bundle.

