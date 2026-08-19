# v2 specialist module activation

## Boundary

Specialist modules are separate from primary profiles and modifiers. A module is
eligible when its canonical item, construct, and output-profile references are
valid. Eligibility does not activate a module.

The v2 activation strategy is `explicit-request`. The caller must provide the
module IDs to assess. Specialist answers cannot activate a module, and an answer
for a module that was not requested is rejected rather than silently retained or
scored.

The canonical module policy is versioned in
`v2/content/specialists/modules.json`:

- minimum answered items: `2`;
- minimum answered item weight ratio: `0.5`;
- minimum scored local-construct coverage: `0.5`.

The item-weight denominator is the sum of absolute declared mapping weights for
each module item. Statement-choice items use the largest declared option weight
as their expected item weight and the selected option's weight when answered.
Construct coverage is the number of scored local module constructs divided by
the module's declared construct count.

## Statuses

- `ineligible`: canonical module structure cannot be scored;
- `not_activated`: the module was eligible but was not requested;
- `activated_insufficient_evidence`: the module was requested but failed its
  explicit evidence policy;
- `scored`: the module was requested and passed its evidence policy.

The result contains every canonical module so that absence, non-activation, and
insufficient evidence cannot be confused.

## API

`prepareSpecialistAssessment({ requestedModuleIds, responses }, bundle)` routes
responses through the Phase 3 normalizer, one explicit module scope at a time.
`scoreSpecialistModules(prepared, bundle)` scores only those prepared scopes.
`scoreSpecialists(coreAssessment, prepared, bundle)` returns all module results;
the core assessment is version-checked but its construct values do not activate,
rank, or alter specialist results in this content revision.
