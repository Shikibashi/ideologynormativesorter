# Ralplan Final: Subfamily hierarchy + remaining label families

## Status: APPROVED by user (Option A; execute item 1 then item 2 via ultragoal)

## Item 1 — Family-tree second level (Option A)
Explicit subfamily field on IdeologyLabel (consistent with existing family field), validated by dataValidity.
- Re-add `subfamily?: string` to IdeologyLabel type
- Assign subfamily to all 24 labels
- Extend familyTree output to family -> subfamily -> label; render nested in ResultsScreen
- Add subfamily validity assertion + familyTree two-level tests

## Item 2 — Remaining label families (subtypes)
Add subtype labels (original clean-room descriptions, SEP/Britannica-grounded centroids covering all 26 axes), calibration archetypes, sweep coverage, module wiring:
- Monarchist/reactionary: absolute-monarchist, neoreactionary (authoritarian family)
- Green: ecosocialist, degrowth-green (green module)
- Nationalist: civic-nationalist, ethnonationalist (nationalist module)

## Acceptance
- centroids cover all axes; archetype-sweep covers every new label (#1 or documented near-tie)
- subfamily + module assignments validated; all gates green (test/lint/build) + browser check

## ADR
- Decision: explicit subfamily field (Option A) over derived central map (Option B)
- Drivers: consistency with family, lean single source of truth per label, validatable
- Alternatives: Option B central map (rejected: second source of truth)
- Consequences: one more optional field per label; more labels increase near-tie clustering (mitigated by documented-exception mechanism)
- Follow-ups: none blocking
