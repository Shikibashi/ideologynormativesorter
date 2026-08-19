# v2 specialist architecture

Specialists are optional scoped extensions. A module owns its specialist item
IDs, local construct IDs, candidate records, and output profiles. Specialist
local constructs are never folded into root construct scoring and specialist
profiles never compete with primary profiles or modifiers.

The Phase 7 engine accepts an explicit requested module set. It returns a
module result for every canonical module, including ineligible and not-
activated states. Phase 8 diagnostics consume those module results and expose
activation, evidence, local constructs, and local profile comparisons without
re-evaluating eligibility or scoring.
