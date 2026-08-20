# Commitment-based ideology scoring

Status: **production-primary migration in progress**.

## Decision

Primary ideology classification no longer treats an ideology as a point in a universal construct space. The migrated `targetValue`/`weight` arrays in `v2/content/profiles/primary.json` are compatibility artifacts and are not a production scoring authority.

Production primary matching now uses the commitment specifications in:

- `v2/packages/engine/src/profiles/ideology-commitments.ts`

A regression test mutates every legacy primary target and weight and requires the production primary result to remain byte-for-byte unchanged.

## Commitment relations

Primary commitment records distinguish:

- `constitutive`: required for eligibility;
- `core`: strongly defining and strongly diagnostic;
- `characteristic`: common and useful for affinity, but not required for membership;
- `contested`: an explicit internal disagreement that must not penalize either direction;
- `compatible`: consistent but non-diagnostic;
- `peripheral`: historically associated or currently undermeasured, but not used for classification;
- `incompatible`: a directly measured position that conflicts with the ideology's core.

Every scored commitment uses an explicit minimum, maximum, or interval criterion. There is no expected ideal point for every construct.

## Affinity calculation

For eligible profiles:

1. Constitutive commitments must be supported.
2. Incompatible commitments must not be present.
3. Missing decisive evidence abstains rather than being treated as ideological disagreement.
4. Core commitments receive a fixed diagnostic weight of 2.
5. Characteristic commitments receive a fixed diagnostic weight of 1.
6. Contested, compatible, and peripheral commitments do not change affinity.
7. Affinity is the weighted share of evaluated core/characteristic commitments that meet their criteria.

The result contract still exposes the historical `similarity` and `distance` field names for compatibility. Under the commitment model, `similarity` means **commitment affinity** and `distance` is only the compatibility alias `1 - affinity`; it is not Euclidean or RMS distance from an ideology centroid.

## Ordinary-primary roster

The first commitment-backed ordinary roster contains:

- Christian Democracy
- Classical Liberalism
- Prudential Conservatism
- Democratic Socialism
- Green Politics / Political Ecology
- Libertarian Socialism
- Right-Libertarianism
- Marxian Socialism
- Marxism-Leninism
- Republicanism
- Social Democracy
- Social Liberalism

The following migrated v1 profiles are not ordinary primary outcomes in this model:

- Liberal Conservatism
- Market Liberalism
- National Conservatism
- Radical Democracy

Their ontology records remain. They may later be represented as branches, hybrids, modifiers, or specialist outcomes after direct measurement is established. Demotion is a sorter-role decision, not a claim that the traditions do not exist.

## Construct limitations

This migration deliberately does **not** pretend that the existing 26 root constructs are final. Several current constructs remain too coarse or falsely bipolar. In particular:

- formal and substantive equality should not be treated as mutually exclusive;
- non-interference, effective autonomy/capability, and republican non-domination need separate treatment;
- productive capital, land/natural resources, personal property, and intellectual property should not be one property scalar;
- pacifism and militarism are not exhausted by whether force can ever be morally justified;
- redistribution and predistribution are not opposites;
- electoral politics and direct action can be combined;
- public provision and exit/voluntary alternatives can be combined.

For that reason, the commitment model uses only constructs that can presently support a bounded claim and marks known construct gaps as contested or peripheral instead of inventing target values.

Marxian and Marxist-Leninist profiles in particular remain undermeasured because the root bank lacks direct constructs for class, exploitation, accumulation, ideology/hegemony, vanguard organization, and democratic centralism.

## Question-alignment audit

The ideology migration makes question alignment a separate evidence problem rather than silently inheriting every old cross-loading.

The next bank pass must review each active item under these rules:

1. Every item has one primary construct by default.
2. A secondary construct is permitted only with an explicit measurement rationale.
3. A stem must not be mapped to a construct merely because the position is historically associated with an ideology.
4. Descriptive questions about a named study or empirical finding must not be treated automatically as a general world-model belief.
5. An item may not encode a false bipolar construct into its polarity.
6. Mapping reviews must be performed against ideology boundaries, not only global coverage counts.

Known high-priority mapping defects identified before this migration include:

- `q0036` and `q0038`: worker-ownership / contestable-ownership reform currently points toward the redistribution pole even though the current construct defines institutional rule changes as the predistribution side;
- `q0041` and `q0043`: market/plural-ends items carry equality/property cross-loadings not established by their stems;
- `q0073` and `q0074`: low-paternalism/cash-benefit design is not equivalent to a general state-action-versus-exit position;
- `q0081`: freedom of worker association does not by itself establish a theory of property;
- early state-legitimacy items repeatedly force authority skepticism, non-domination, and non-interference to co-move despite their theoretical differences.

These mappings must be changed in the declarative item content, not hidden behind a runtime scoring overlay. Until that source-content pass is complete, the new primary model remains research-stage.

## Specialist status

Specialist modules remain quarantined research outputs and still contain migrated target-value variants. They do not alter the ordinary primary result. They must be converted to the same commitment semantics before any specialist result is promoted or described as validated.

## Validation status

This architectural change does not establish empirical validity. After the ideology/construct/item content pass, the instrument still requires expert content review, cognitive interviewing, pilot data, dimensionality/reliability analysis, retest evidence, criterion/known-groups evidence, and subgroup/DIF analysis before scoped validation claims are permitted.
