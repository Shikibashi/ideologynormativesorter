# Taxonomy redesign and measurement migration — v1

This record documents the August 2026 migration from a mixed primary label pool to a role-aware taxonomy. It is an implementation and measurement-status record, not a claim that every catalog label is empirically validated.

## Public roles

The ordinary questionnaire now scores only broad primary families in `src/data/labelTaxonomy.ts`. Cross-cutting commitments such as progressivism, social conservatism, multiculturalism, fiscal conservatism, religious nationalism, populism, and technocratic orientation are scored separately as modifiers. Institutional forms, mechanisms, and intellectual projects—such as constitutional monarchism, world federalism, platformism, cyberocracy, dataism, and Dugin’s Fourth Political Theory—remain browsable context entries and are not scored by the ordinary result.

Narrow schools and compound traditions remain browsable as provisional specialists. They are not included in ordinary primary or modifier matching. A specialist can appear only inside an opt-in, respondent-facing module and is marked experimental until respondent validation supports a later role decision.

The canonical public entry for Liberal Conservatism / Conservative Liberalism is `liberal-conservatism`. The former `conservative-liberalism` ID is retained as a hidden compatibility alias. The new broad anchors are:

- `conservative` — Conservative / Prudential Conservative
- `green-politics` — Green Politics / Political Ecology
- `social-anarchism` — Social / Communal Anarchism
- `market-right-libertarianism` — Market / Right-Libertarianism
- `marxian-socialism` — Marxian Socialism (Non-Leninist)

`neoliberalism` remains the stable ID while its public presentation is narrowed to Market-Governance Liberalism. The six sourced high-risk labels—State Corporatism, Kemalism, Fiscal Conservatism, Ethnonationalism, Islamic Democratic Constitutionalism, and Dugin’s Fourth Political Theory—are enriched catalog explainers, not fallback scoring labels.

## Evidence and sources

`src/data/labelSources.ts` attaches source records to every primary and modifier label. Each record declares whether it supports definition, normative, descriptive, prescriptive, or boundary interpretation. Sources explain the tradition and its distinctions; they do not validate a respondent score, centroid, or self-identification. The six high-priority labels receive bespoke Cambridge, SAGE, Oxford, and Springer records.

The five broad anchors have their own centroids, descriptions, caution notes, term definitions, and layer-specific explainers. They are intentionally not aliases for a narrow subtype centroid. The catalog UI displays role and measurement-status badges, and scored label cards expose their source scope.

## Experimental module roster

The respondent-facing specialist roster uses `balanced-hash-v2` in `src/specialist/index.ts`. Assignment is deterministic for a participant and study cohort, while the versioned strategy makes a future roster change explicit rather than silently changing an existing cohort. The current opt-in waves are:

1. anarchist and market-libertarian families;
2. green morphology and multi-affinity profiles;
3. socialist family variants;
4. conservative variants;
5. religious and national political projects;
6. technology and governance variants;
7. monarchist and municipal/confederal families.

The feminist and identity-sovereignty modules remain available as focused modules. Black Nationalism and Pan-Africanism are catalog specialists connected to identity-sovereignty evidence; Multiculturalism remains a separately scored modifier. Evidence-aware scoring abstains with insufficient evidence rather than converting unanswered items into a zero-confidence match.

`src/data/specialistMeasurementReview.ts` records the next validation gate for each module family. Experimental matches are explicitly labeled in the specialist result screen and are never promoted into ordinary scoring by module assignment alone.

## Research compatibility

Core research records now carry `taxonomyVersion`, the active primary and modifier roster IDs, and `predictedModifierIds`. Historical records remain decodable. `canonicalLabelId()` normalizes the hidden Conservative Liberalism compatibility alias during analysis without rewriting stored historical records. Share links continue to decode older payload versions, while stale scoring metadata is rejected through the existing outdated-link path.

When the roster, taxonomy, or scoring contract changes, bump the corresponding version and update the active roster fingerprints in the research collector, Worker, validators, and audit fixtures. Never reinterpret an old specialist assignment as if it came from the new roster.

## Validation status

Synthetic tests cover role exclusivity, source coverage, primary/modifier separation, modifier thresholds, broad-anchor calibration, deterministic assignment, evidence abstention, research serialization, Worker parity, and legacy alias handling. Human respondent validation, test-retest reliability, fairness, response-process review, and community-informed review remain promotion gates for all experimental specialists.
