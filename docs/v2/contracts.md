# v2 Contracts (Phase 1)

This document captures the explicit public contracts implemented in `v2/packages/contracts`.

## Content contracts

- `DomainRecord`, `ConstructRecord`, `ItemRecord`, `ProfileRecord`, `OntologyNodeRecord`, `OntologyRelationRecord`.
- Item response types supported in phase 1:
  - `likert5`
  - `likert7`
  - `statement-choice`
- Profile roles supported in phase 1:
  - `primary`
  - `modifier`
  - `specialist`
- Response and assessment statuses are preserved as explicit discriminants:
  - `answered`
  - `missing`
  - `skipped`
  - `abstained`
  - `refused`

## Result contracts

- `AssessmentResult` is the single runtime result envelope.
- `ConstructScoreResult`, `ProfileMatchResult`, `ModifierMatchResult`, `SpecialistResult` are first-class fields.
- `AssessmentDiagnostics` is a versioned downstream contract containing exact
  contribution traces, construct evidence summaries, explicit-relation
  divergences, domain summaries, profile comparisons, modifier comparisons, and
  specialist activation/evidence diagnostics.
- No parallel legacy + production payload paths are represented.

## Scoring contracts

- `ConstitutiveGate` supports minimum/maximum/interval/evidenceMinimum/conjunction/disjunction operators with explicit fields.
- `ContributionRecordBase` and `UncertaintySummary` define contribution and uncertainty reasons.
- No implicit construct inference is allowed by contract.
- Diagnostic contracts are consumers of authoritative scoring records and are
  not scoring inputs.

## Version contracts

`VersionFields` requires explicit versions:

- `contentSchemaVersion`
- `contentVersion`
- `contentFingerprint`
- `scoringVersion`
- `responseSchemaVersion`
- `resultSchemaVersion`
- `researchSchemaVersion`

These are intentionally distinct and non-interchangeable.

## Phase 2 content additions

The extracted canonical bundle makes construct scope, item role/layer/tier/status,
mapping mode, option-owned contributions, modifier item indicators, specialist
modules/candidates, assignment rosters, ontology lifecycle, and normalized
provenance explicit. These fields are content semantics; the future scoring
engine must not infer them from names, folders, overlays, or ontology ancestry.

## Phase 3 engine contract additions

The response contract retains raw Likert values alongside normalized values and
carries optional confidence/priority metadata through statement-choice
normalization. The scoring contract represents `normalizedInput` as
`number | null`, distinguishes a numeric `salienceFactor` from its
`salienceKind`, and records source response state, inclusion, effective weight,
and structured exclusion reasons.

`prepareAssessmentResponses` returns normalized responses and explicit
contribution records together with all content/scoring/response version
identifiers. It does not aggregate contributions or calculate profile results.

## Phase 4 contract additions

The Phase 4 contracts add ConstructEvidence,
OverallConstructEvidence, ConstructSupportSummary, and the discriminated
ConstructResult union. A scored result has a finite bounded number; an
abstained result has score null and a closed abstentionReason. Both retain
the same evidence, support, numerator, denominator, and stable contribution
references.

ConstructAssessment carries the version metadata, immutable Phase 3
contributions, construct results, response summary, and per-construct plus
overall evidence. It is the sole Phase 5 input for construct-level scoring;
Phase 5 must not recompute contributions from raw responses.

## Phase 5 contract additions

\`PrimaryProfileAssessment\` is the Phase 5 result envelope. Every profile is a
\`ScoredPrimaryProfile\` or \`AbstainedPrimaryProfile\`. Requirements, comparison
records, profile evidence, typed constitutive-gate evaluations, distance,
similarity, rank, tie group, abstention reason, and uncertainty are explicit.

Only scored profiles enter \`ranking\`. The top tie summary uses the strict
measurement-contract similarity tolerance and preserves all tied profile IDs.

## Phase 9 unified result contract

`AssessmentInput` separates core responses from optional specialist responses
and requires an explicit requested-module list. `AssessmentResult` is the only
top-level v2 result envelope. It carries all independent version fields,
assessment status/evidence, root constructs, primary profile projections,
modifiers, specialist projections, and downstream diagnostics. Raw responses
are not copied into the result, and `diagnostics.contributions` is the single
canonical contribution table.
## Phase 6 modifier contracts

`ModifierAssessment` and `ModifierResult` are defined in
`v2/packages/contracts/src/modifiers.ts`. The result retains direct indicator
comparisons, construct/contribution traceability, evidence coverage,
uncertainty, fit, and gate evaluations. Modifier statuses are `active`,
`inactive`, `below-threshold`, and `unavailable`; no result is silently removed
for failing a fit threshold.
