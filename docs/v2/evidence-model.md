# V2 Construct Evidence Model

## Purpose

Evidence coverage describes how much canonical construct measurement was
actually available for an assessment. It is not psychometric reliability,
internal consistency, validity, or a confidence interval. Phase 4 uses the
terms `evidence`, `support`, and `uncertainty`; it does not claim alpha,
omega, reliability, or consistency from response counts.

## Structural counts

For each construct, `expectedItemCount` is the number of eligible item-to-
construct slots after applying the statement-choice eligibility policy.
`answeredItemCount`, `missingItemCount`, `skippedItemCount`,
`abstainedItemCount`, and `refusedItemCount` partition those slots:

```text
expectedItemCount = answeredItemCount
                  + missingItemCount
                  + skippedItemCount
                  + abstainedItemCount
                  + refusedItemCount
```

`structuralCoverage` is:

```text
answeredItemCount / expectedItemCount
```

It is `0` when no expected slots exist. A no-slot construct is separately
identified by `no_eligible_items`.

## Weight accounting

The same partition is retained using absolute canonical mapping weights:

```text
totalEligibleWeight = answeredEligibleWeight
                    + missingWeight
                    + skippedWeight
                    + abstainedWeight
                    + refusedWeight
```

`answeredEligibleWeight` includes answered mappings even when a nonnormative
salience rating causes the answer to be excluded from scoring. This keeps
structural coverage distinct from score eligibility.

`scoredMappedWeight` is the raw mapping-weight denominator of the construct
score. `scoredEffectiveWeight` is the sum after salience and is diagnostic
only. The derived fields are:

```text
answeredWeightCoverage  = answeredEligibleWeight / totalEligibleWeight
scoredWeightCoverage    = scoredMappedWeight / totalEligibleWeight
effectiveWeightCoverage = scoredEffectiveWeight / totalEligibleWeight
salienceCoverage        = scoredEffectiveWeight / scoredMappedWeight
```

All ratios are finite and clamped to `[0, 1]`; a zero denominator produces
`0` for the diagnostic ratio.

`salienceSkippedItemCount` and `salienceSkippedWeight` identify answered
nonnormative slots whose salience is absent or invalid. They are a subset of
answered evidence, not a sixth response state.

## Status and abstention

`evidenceStatus` is:

- `sufficient` when the evidence ratio is at least `0.5`;
- `partial` when evidence exists but the ratio is below `0.5`;
- `none` when no eligible slot is answered.

Scorability is decided in a fixed order:

1. no eligible slots -> `no_eligible_items`;
2. all slots share `missing`, `skipped`, `abstained`, or `refused` -> the corresponding closed reason;
3. ratio below `0.5` -> `insufficient_evidence`;
4. no finite positive scored mapping denominator -> `insufficient_evidence`;
5. otherwise the construct is scored.

The ratio threshold is inclusive. A scored construct may still have a high
uncertainty level when refusal or abstention is present. An abstained
construct always has `score: null` and never substitutes a neutral numeric
score.

## Determinism and ownership

Evidence is derived from one canonical owner for each scoring mapping. The
engine does not merge overlays, infer mappings from ontology relations, or
reconstruct profile dimensions. Counts, weights, state partitions, and
contribution IDs are sorted or accumulated in deterministic order. Reordering
responses or Phase 3 contribution records cannot change construct results.

