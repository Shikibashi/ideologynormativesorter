# v2 Measurement Contract (Phase 0)

This contract is the authoritative scoring specification for Phase 1+ work. It resolves the open semantic conflict before any implementation.

## 1. Core principle and conflict resolution

One scoring model only. We choose the descriptive/prescriptive salience model from legacy production behavior:

- descriptive items use confidence
- prescriptive items use priority
- normative items use neutral salience weight 1

`salienceSkipped` for non-normative items excludes contribution entirely.

This is selected because it is the only model currently present in both legacy and production paths and is explicitly documented in existing normalization modules.

## 2. Response normalization

Normalize each raw response into an evidence record and a status:

- missing: no response for item
- missing-response: explicitly present but not answered
- refused-response: explicit refusal
- abstained-response: explicit abstention
- answered: usable answer with numeric value

Normalization rejects NaN, infinite, non-finite and malformed payloads.

## 3. Likert 5 normalization

- Accepted raw range: `-2..2`.
- Convert to unit scale by `value / 2`.
- Apply reverse scoring after conversion.
- Clamp to `[-1, 1]`.

## 4. Likert 7 normalization

- Accepted raw range: `-3..3`.
- Convert to unit scale by `value / 3`.
- Apply reverse scoring after conversion.
- Clamp to `[-1, 1]`.

## 5. Reverse scoring

If item flag `reverseScored` is true, invert the normalized unit value.

## 6. Statement-choice scoring

- Statement-choice items are normalized to a contribution unit of `+1`.
- If item option includes per-construct scores, those are used directly.
- If an option lacks direct construct scores, scoring must fail at compile-time unless explicit fallback is defined in item mapping.

## 7. Missing responses

Missing answers are excluded from contribution and increase abstention/evidence records. They are not coerced to neutral zero.

## 8. Refused responses

Refused answers are excluded from contribution and recorded as `refused`. They are distinguishable from missing in uncertainty and evidence reasoning.

## 9. Explicit abstentions

Explicit abstention answers are excluded from contribution and recorded as `abstained`.

## 10. Confidence semantics

For non-normative descriptive items, confidence is in `[1,3,5]` and maps by linear division to influence weight in `[0.2,1]`.

- `1 -> 0.2`
- `3 -> 0.6`
- `5 -> 1`
- out of range/missing confidence becomes non-weighted exclusion for non-normative layers.

## 11. Priority semantics

For non-normative prescriptive items, priority follows the same mapping as confidence:

- `1 -> 0.2`
- `3 -> 0.6`
- `5 -> 1`
- out of range/missing priority behaves as non-weighted exclusion for non-normative layers.

## 12. Item-to-construct mapping

Every scored item must define an explicit measured construct mapping in canonical content:

- direct root construct weights
- statement-option construct weights
- specialist module construct scope

If no valid mapping exists, content compilation fails.

## 13. Multi-construct items

- each construct on an item contributes independently
- contribution is signed and weighted by response and salience
- per-construct numerator and denominator are tracked separately
- construct score is `clamp(sum(weighted contributions) / sum(absolute weights), -1,1)`
- if denominator is zero, construct score is `null` with insufficient-evidence state

## 14. Construct aggregation

Aggregate contributions by construct using deterministic ordering and stable arithmetic.

- sum per construct of `response × salience × constructWeight`
- divide by stable denominator from absolute mapped weights
- clamp to `[-1,1]`
- never divide by zero silently
- compute deterministic evidence counters (item counts, coverage, answered count)

## 15. Minimum evidence

- construct evidence ratio = `answeredConstructItems / expectedConstructItems`
- status is `sufficient`, `partial`, or `none`
- default minimum for primary result matching is `0.5`
- insufficient evidence produces explicit abstention record and cannot be auto-interpreted as zero score

## 16. Evidence coverage

Evidence coverage is required at construct, profile, specialist, and result scope.

- answered count
- expected count
- coverage ratio in `[0,1]`
- status classification
- deterministic abstention list for missing/refused/skips

## 17. Uncertainty

Uncertainty band is deterministic and at least one reason is tracked.

- `low`, `medium`, `high`
- reasons: missingness, refusal, abstention, insufficient-evidence, adapter-output
- any explicit refusal or abstention without strong counter-evidence is `high`

## 18. Primary-profile matching

Primary-profile matching is similarity-based on measured constructs only and gated:

- construct scope must be declared in profile manifest
- required construct gates must be met before ranking
- constructs not measured do not contribute to similarity distance
- cosine-like behavior is forbidden unless explicitly documented; default to Euclidean-distance-as-defined similarity with deterministic formula

Distance formula:

- `distance = sqrt(sum((s_i - c_i)^2) / n_measured)`
- `similarity = clamp(1 - distance / 2, 0, 1)`

## 19. Constitutive gates

- required construct IDs are explicit in profile contract
- required minimum item counts are explicit per construct
- profiles with missing required constructs are blocked from matching

## 20. Ties

If top two match similarity values differ by `<0.05`, result includes explicit `label-tie` reason and uncertainty band is promoted to `high`.

## 21. Modifier scoring

Modifier scoring is separate from primary matching and uses indicator coverage thresholds:

- measured indicator count and distance-to-ideal are explicit
- minimum answered indicator count and evidence minimum are explicit
- fit threshold below `0.65` is filtered out
- uncertainty must not be `high` for public inclusion

## 22. Specialist scoring

- specialist module assignment strategy is explicit and versioned
- per-module construct scores, evidence counts, and gate status are first-class
- specialist results are optional extension fields in result model and absent only for failed/insufficient evidence

## 23. Result exposure rules

There is one result contract only:

- single `AssessmentResult` payload
- no parallel legacy/prod result payload path
- no UI-side rescoring
- diagnostics and contribution records are the same computed objects used to derive scores

## 24. Determinism and order invariance requirements

- same input + same manifest + same version metadata must produce byte-stable output for scored structures
- item order and response order do not alter contribution totals
- ties and abstention ordering are stable and sorted by score then deterministic id order

## 25. Version policy

Separate, independent version fields are mandatory:

- schemaVersion
- contentVersion
- contentFingerprint
- scoringVersion
- resultVersion
- researchVersion

Do not reuse one string for all layers.


## Phase 3 response-set policy

The response set has a fail-closed duplicate policy: an item ID may occur at
most once. Duplicate IDs are rejected with a structured `DUPLICATE_RESPONSE`
error whose duplicate ID list is sorted. The engine does not adopt a
last-write-wins or first-write-wins policy from historical v1 code.

The engine materializes an explicit normalized `missing` state for every active
item absent from the raw response set. This is a coverage representation, not
a scored zero. Item-level mappings receive exclusion records with
`normalizedInput: null`; statement-choice non-answers have no selected option
and therefore emit no construct mapping record.

Phase 3 accepts only legal integer Likert raw values: `-2..2` for Likert5 and
`-3..3` for Likert7. Out-of-range or non-finite values are rejected rather
than clamped. Scale conversion precedes the single reverse-scoring operation.

For descriptive and prescriptive answered items, omission of the required
confidence or priority value excludes the mapping with
`exclusionReason: "salience_skipped"`. It is not a full-salience default.

## Phase 4 construct aggregation clarification

The construct score numerator is the sum of Phase 3
weightedContribution values. The denominator is the sum of absolute raw
canonical mapping weights for included answered mappings. Salience therefore
scales the numerator and remains visible through scoredEffectiveWeight; it
does not become the score denominator.

Construct evidence uses explicit slots. Direct mappings create one slot per
item-to-construct mapping. An answered statement-choice item uses only the
selected option's mappings. A non-answered statement-choice item creates one
slot per construct in the union of its option mappings, using the maximum
declared weight for that construct. Alternatives are not counted as separate
items and do not score.

The minimum construct evidence ratio is 0.5, inclusive. Missing, skipped,
abstained, and refused states are excluded from scoring and counted
separately. A construct with insufficient evidence returns an explicit
abstention and score null; it does not return a neutral score.

## Phase 5 primary profile matching clarification

Primary profiles compare only the constructs listed in their explicit
requirements. Missing or abstained required constructs block profile matching;
they do not receive a neutral fallback. Weighted RMS distance is normalized by
the measured requirement-weight sum, and similarity is \`clamp(1 - distance /
2, 0, 1)\`. All constitutive gates are inclusive at their scalar/evidence
thresholds and retain unavailable state when the required Phase 4 evidence is
not scored.

Profiles whose top similarities differ by less than \`0.05\` form an explicit
\`label-tie\` group and raise assessment uncertainty to high. A difference equal
to \`0.05\` is not a tie. Abstained profiles remain in the complete result set
but never enter ranking.

## Phase 8 diagnostic semantics

Diagnostics are downstream derived data and cannot alter any authoritative
score, rank, gate, status, or evidence value. Contribution strength means the
absolute value of an existing `weightedContribution`; positive and negative
lists filter that same value by sign and sort by magnitude descending, then
stable contribution ID. A root construct is described as near its interpretive
midpoint only when its assigned domain declares poles and its score is within
`0.1` of zero. This is a descriptive diagnostic state, not a new score.

Cross-dimension divergence uses only explicit canonical diagnostic relations.
For comparable native `[-1,1]` constructs, `signedDifference = firstScore -
secondScore * secondDirection` and `magnitude = abs(signedDifference)`. An
unscored endpoint yields unavailable divergence with no numeric substitute.
Domain summaries recompute weighted evidence coverage from construct evidence;
their optional arithmetic mean is explicitly diagnostic and never enters
profile matching.

## Phase 9 result boundary

The complete result is assembled only after normalization, contribution
generation, construct aggregation, primary matching, modifier matching,
specialist scoring, and downstream diagnostics. Partial valid evidence yields a
partial or insufficient-evidence result; invalid response/configuration data
raises a structured engine error instead of being represented as evidence.
