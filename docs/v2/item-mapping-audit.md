# v2 item-mapping audit

This report is generated from v2/content by v2/tools/generate-phase2-reports.mjs. It audits the compiled final state; it does not execute v1 fallback mapping logic.

## Summary

| Measure | Count |
| --- | ---: |
| Total active scored items | 406 |
| Core items | 338 |
| Specialist items | 68 |
| Explicit contribution mappings | 1013 |
| Multi-construct items/options | 311 |
| Reversed items | 0 |
| Statement-choice items | 6 |
| Statement-choice options audited | 24 |
| Unmapped scored items | 0 |
| Invalid/non-finite weights | 0 |
| Fallback mappings required | 0 |

## Resolution notes

- The six statement-choice records use option-owned mappings. Their item-level contribution arrays are intentionally empty, so no aggregate fallback mapping is duplicated at the item level.
- v1 signed weights are represented as an explicit positive magnitude plus an explicit polarity in v2.
- Specialist-local mappings are namespaced by module and remain separate from the 26 root constructs.
- No reverse-scoring flag is active in the approved export; every v2 item carries explicit false rather than relying on an engine default.

## Per-item audit

| Item | Role | Response | Domain | Mapping count | Option mapping count | Item mappings | Option mappings | Module | Status |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
| fm-an-1 | specialist | likert7 | state-legitimacy | 3 | 0 | authority-legitimacy:-1, anti-domination:0.7, specialist:anarchist-families-module:anti-authority:1 | - | anarchist-families-module | active |
| fm-an-2 | specialist | likert7 | markets-planning | 4 | 0 | market-process-confidence:1, coordination-optimism:0.6, specialist:anarchist-families-module:market-coordination:1, specialist:anarchist-families-module:communal-coordination:-0.4 | - | anarchist-families-module | active |
| fm-an-3 | specialist | likert7 | property-ownership | 4 | 0 | property-legitimacy:-0.8, equality-theory:0.6, specialist:anarchist-families-module:communal-property:1, specialist:anarchist-families-module:market-property:-0.5 | - | anarchist-families-module | active |
| fm-an-4 | specialist | likert7 | strategy-change | 3 | 0 | centralization-preference:-0.8, electoralism-vs-direct-action:-0.7, specialist:anarchist-families-module:direct-federation:1 | - | anarchist-families-module | active |
| fm-co-1 | specialist | likert7 | strategy-change | 2 | 0 | authority-legitimacy:0.4, specialist:conservative-variants-module:prudence:1 | - | conservative-variants-module | active |
| fm-co-2 | specialist | likert7 | family-gender-feminism | 3 | 0 | regulation-vs-deregulation:0.6, state-action-vs-exit:0.4, specialist:conservative-variants-module:moral-traditionalism:1 | - | conservative-variants-module | active |
| fm-co-3 | specialist | likert7 | national-identity-sovereignty | 3 | 0 | political-community-boundary:-0.8, moral-traditionalism:0.3, specialist:conservative-variants-module:national-continuity:1 | - | conservative-variants-module | active |
| fm-co-4 | specialist | likert7 | foreign-policy-war | 2 | 0 | coercion-strategy:0.8, specialist:conservative-variants-module:assertive-internationalism:1 | - | conservative-variants-module | active |
| fm-fem-1 | specialist | likert7 | family-gender-feminism | 3 | 0 | liberty-noninterference:0.7, equality-theory:0.5, specialist:feminist-faction-module:legal-equality-reform:1 | - | feminist-faction-module | active |
| fm-fem-2 | specialist | likert7 | family-gender-feminism | 3 | 0 | cultural-plasticity:0.5, specialist:feminist-faction-module:structural-patriarchy:1, specialist:feminist-faction-module:legal-equality-reform:-0.2 | - | feminist-faction-module | active |
| fm-fem-3 | specialist | likert7 | family-gender-feminism | 3 | 0 | anti-domination:1, moral-traditionalism:-0.5, specialist:feminist-faction-module:structural-patriarchy:1 | - | feminist-faction-module | active |
| fm-fem-4 | specialist | likert7 | family-gender-feminism | 3 | 0 | cultural-plasticity:-0.4, specialist:feminist-faction-module:class-social-reproduction:1, specialist:feminist-faction-module:structural-patriarchy:0.3 | - | feminist-faction-module | active |
| fm-fem-5 | specialist | likert7 | family-gender-feminism | 3 | 0 | state-action-vs-exit:0.4, reform-vs-revolution:0.3, specialist:feminist-faction-module:class-social-reproduction:1 | - | feminist-faction-module | active |
| fm-fem-6 | specialist | likert7 | family-gender-feminism | 5 | 0 | state-action-vs-exit:0.8, electoralism-vs-direct-action:0.5, reform-vs-revolution:-0.5, specialist:feminist-faction-module:legal-equality-reform:0.8, specialist:feminist-faction-module:anti-hierarchy-strategy:-1 | - | feminist-faction-module | active |
| fm-fem-7 | specialist | likert7 | family-gender-feminism | 4 | 0 | centralization-preference:-0.8, state-action-vs-exit:-0.8, reform-vs-revolution:0.4, specialist:feminist-faction-module:anti-hierarchy-strategy:1 | - | feminist-faction-module | active |
| fm-fem-8 | specialist | likert7 | family-gender-feminism | 4 | 0 | centralization-preference:-1, electoralism-vs-direct-action:-0.4, specialist:feminist-faction-module:anti-hierarchy-strategy:1, specialist:feminist-faction-module:structural-patriarchy:0.2 | - | feminist-faction-module | active |
| fm-gr-1 | specialist | likert7 | environment-climate-growth | 2 | 0 | human-nature-priority:1, specialist:green-morphology-module:ecological-standing:1 | - | green-morphology-module | active |
| fm-gr-2 | specialist | likert7 | environment-climate-growth | 2 | 0 | regulation-vs-deregulation:0.5, specialist:green-morphology-module:post-growth:1 | - | green-morphology-module | active |
| fm-gr-3 | specialist | likert7 | environment-climate-growth | 2 | 0 | regulation-vs-deregulation:0.3, specialist:green-morphology-module:market-technology:1 | - | green-morphology-module | active |
| fm-gr-4 | specialist | likert7 | democracy-expertise-constitutionalism | 2 | 0 | centralization-preference:-0.6, specialist:green-morphology-module:democratic-decentralism:1 | - | green-morphology-module | active |
| fm-gr-5 | specialist | likert7 | property-ownership | 3 | 0 | property-legitimacy:-0.7, anti-domination:0.4, specialist:green-morphology-module:collective-ownership:1 | - | green-morphology-module | active |
| fm-id-1 | specialist | likert7 | national-identity-sovereignty | 2 | 0 | political-community-boundary:-0.8, specialist:identity-sovereignty-module:ascriptive-membership:1 | - | identity-sovereignty-module | active |
| fm-id-10 | specialist | likert7 | race-ethnicity-multiculturalism | 3 | 0 | anti-domination:0.4, specialist:identity-sovereignty-module:community-autonomy:0.8, specialist:identity-sovereignty-module:territorial-separatism:-0.8 | - | identity-sovereignty-module | active |
| fm-id-11 | specialist | likert7 | national-identity-sovereignty | 4 | 0 | anti-domination:0.5, political-community-boundary:-0.4, specialist:identity-sovereignty-module:territorial-separatism:1, specialist:identity-sovereignty-module:minority-self-government:0.5 | - | identity-sovereignty-module | active |
| fm-id-12 | specialist | likert7 | national-identity-sovereignty | 3 | 0 | centralization-preference:-0.3, specialist:identity-sovereignty-module:territorial-separatism:-1, specialist:identity-sovereignty-module:minority-self-government:0.6 | - | identity-sovereignty-module | active |
| fm-id-13 | specialist | likert7 | race-ethnicity-multiculturalism | 3 | 0 | cultural-plasticity:-0.6, public-choice-skepticism:0.3, specialist:identity-sovereignty-module:decolonial-land-sovereignty:1 | - | identity-sovereignty-module | active |
| fm-id-14 | specialist | likert7 | national-identity-sovereignty | 4 | 0 | property-legitimacy:-0.4, anti-domination:0.5, specialist:identity-sovereignty-module:decolonial-land-sovereignty:1, specialist:identity-sovereignty-module:minority-self-government:0.4 | - | identity-sovereignty-module | active |
| fm-id-15 | specialist | likert7 | national-identity-sovereignty | 5 | 0 | electoralism-vs-direct-action:0.6, state-action-vs-exit:0.3, reform-vs-revolution:-0.5, specialist:identity-sovereignty-module:institutional-recognition:1, specialist:identity-sovereignty-module:minority-self-government:0.5 | - | identity-sovereignty-module | active |
| fm-id-16 | specialist | likert7 | national-identity-sovereignty | 5 | 0 | electoralism-vs-direct-action:-0.5, state-action-vs-exit:-0.5, reform-vs-revolution:0.4, specialist:identity-sovereignty-module:autonomous-resurgence:1, specialist:identity-sovereignty-module:decolonial-land-sovereignty:0.5 | - | identity-sovereignty-module | active |
| fm-id-17 | specialist | likert7 | race-ethnicity-multiculturalism | 2 | 0 | political-community-boundary:-0.2, specialist:identity-sovereignty-module:pan-african-solidarity:1 | - | identity-sovereignty-module | active |
| fm-id-18 | specialist | likert7 | national-identity-sovereignty | 2 | 0 | centralization-preference:0.4, specialist:identity-sovereignty-module:pan-african-solidarity:1 | - | identity-sovereignty-module | active |
| fm-id-19 | specialist | likert7 | race-ethnicity-multiculturalism | 3 | 0 | anti-domination:0.5, equality-theory:0.3, specialist:identity-sovereignty-module:pluralist-accommodation:1 | - | identity-sovereignty-module | active |
| fm-id-2 | specialist | likert7 | national-identity-sovereignty | 3 | 0 | anti-domination:0.3, political-community-boundary:0.3, specialist:identity-sovereignty-module:ascriptive-membership:-1 | - | identity-sovereignty-module | active |
| fm-id-20 | specialist | likert7 | race-ethnicity-multiculturalism | 3 | 0 | anti-domination:0.6, equality-theory:0.3, specialist:identity-sovereignty-module:pluralist-accommodation:1 | - | identity-sovereignty-module | active |
| fm-id-21 | specialist | likert7 | national-identity-sovereignty | 2 | 0 | anti-domination:0.4, specialist:identity-sovereignty-module:institutional-recognition:1 | - | identity-sovereignty-module | active |
| fm-id-22 | specialist | likert7 | national-identity-sovereignty | 3 | 0 | electoralism-vs-direct-action:-0.4, state-action-vs-exit:-0.4, specialist:identity-sovereignty-module:autonomous-resurgence:1 | - | identity-sovereignty-module | active |
| fm-id-3 | specialist | likert7 | national-identity-sovereignty | 4 | 0 | political-community-boundary:-0.7, anti-domination:-0.4, specialist:identity-sovereignty-module:dominant-nation-congruence:1, specialist:identity-sovereignty-module:pluralist-accommodation:-0.4 | - | identity-sovereignty-module | active |
| fm-id-4 | specialist | likert7 | race-ethnicity-multiculturalism | 4 | 0 | anti-domination:0.8, equality-theory:0.4, specialist:identity-sovereignty-module:dominant-nation-congruence:-1, specialist:identity-sovereignty-module:pluralist-accommodation:0.5 | - | identity-sovereignty-module | active |
| fm-id-5 | specialist | likert7 | race-ethnicity-multiculturalism | 3 | 0 | anti-domination:0.7, equality-theory:0.4, specialist:identity-sovereignty-module:pluralist-accommodation:1 | - | identity-sovereignty-module | active |
| fm-id-6 | specialist | likert7 | race-ethnicity-multiculturalism | 2 | 0 | equality-theory:-0.3, specialist:identity-sovereignty-module:pluralist-accommodation:-1 | - | identity-sovereignty-module | active |
| fm-id-7 | specialist | likert7 | national-identity-sovereignty | 3 | 0 | anti-domination:0.8, specialist:identity-sovereignty-module:minority-self-government:1, specialist:identity-sovereignty-module:pluralist-accommodation:0.4 | - | identity-sovereignty-module | active |
| fm-id-8 | specialist | likert7 | national-identity-sovereignty | 3 | 0 | centralization-preference:0.5, state-action-vs-exit:0.3, specialist:identity-sovereignty-module:minority-self-government:-1 | - | identity-sovereignty-module | active |
| fm-id-9 | specialist | likert7 | race-ethnicity-multiculturalism | 3 | 0 | state-action-vs-exit:-0.6, centralization-preference:-0.5, specialist:identity-sovereignty-module:community-autonomy:1 | - | identity-sovereignty-module | active |
| fm-mm-1 | specialist | likert7 | state-legitimacy | 2 | 0 | authority-legitimacy:0.8, specialist:monarchist-municipal-module:hereditary-authority:1 | - | monarchist-municipal-module | active |
| fm-mm-2 | specialist | likert7 | democracy-expertise-constitutionalism | 2 | 0 | electoralism-vs-direct-action:0.5, specialist:monarchist-municipal-module:constitutional-monarchy:1 | - | monarchist-municipal-module | active |
| fm-mm-3 | specialist | likert7 | democracy-expertise-constitutionalism | 2 | 0 | anti-domination:0.5, specialist:monarchist-municipal-module:municipal-autonomy:1 | - | monarchist-municipal-module | active |
| fm-mm-4 | specialist | likert7 | strategy-change | 2 | 0 | centralization-preference:-0.8, specialist:monarchist-municipal-module:confederal-coordination:1 | - | monarchist-municipal-module | active |
| fm-rn-1 | specialist | likert7 | religion-secularism | 3 | 0 | anti-domination:0.5, secularism-religious:0.3, specialist:religious-national-politics-module:popular-constitutionalism:1 | - | religious-national-politics-module | active |
| fm-rn-10 | specialist | likert7 | national-identity-sovereignty | 3 | 0 | political-community-boundary:-0.8, authority-legitimacy:0.2, specialist:religious-national-politics-module:jewish-national-self-determination:1 | - | religious-national-politics-module | active |
| fm-rn-11 | specialist | likert7 | religion-secularism | 3 | 0 | authority-legitimacy:0.45, secularism-religious:0.75, specialist:religious-national-politics-module:religious-authority:1 | - | religious-national-politics-module | active |
| fm-rn-2 | specialist | likert7 | religion-secularism | 2 | 0 | state-action-vs-exit:0.5, specialist:religious-national-politics-module:religious-authority:1 | - | religious-national-politics-module | active |
| fm-rn-3 | specialist | likert7 | national-identity-sovereignty | 4 | 0 | political-community-boundary:-0.7, moral-traditionalism:0.6, specialist:religious-national-politics-module:civilizational-nationalism:1, specialist:religious-national-politics-module:religious-national-fusion:1 | - | religious-national-politics-module | active |
| fm-rn-4 | specialist | likert7 | race-ethnicity-multiculturalism | 3 | 0 | equality-theory:0.8, anti-domination:0.6, specialist:religious-national-politics-module:minority-citizenship:1 | - | religious-national-politics-module | active |
| fm-rn-5 | specialist | likert7 | democracy-expertise-constitutionalism | 2 | 0 | centralization-preference:0.3, specialist:religious-national-politics-module:constitutional-review:1 | - | religious-national-politics-module | active |
| fm-rn-6 | specialist | likert7 | democracy-expertise-constitutionalism | 2 | 0 | electoralism-vs-direct-action:0.8, specialist:religious-national-politics-module:party-competition:1 | - | religious-national-politics-module | active |
| fm-rn-7 | specialist | likert7 | religion-secularism | 3 | 0 | secularism-religious:0.7, anti-domination:0.4, specialist:religious-national-politics-module:islamic-public-law:1 | - | religious-national-politics-module | active |
| fm-rn-8 | specialist | likert7 | democracy-expertise-constitutionalism | 3 | 0 | centralization-preference:-0.3, electoralism-vs-direct-action:0.5, specialist:religious-national-politics-module:interpretive-pluralism:1 | - | religious-national-politics-module | active |
| fm-rn-9 | specialist | likert7 | national-identity-sovereignty | 3 | 0 | political-community-boundary:-0.8, moral-traditionalism:0.6, specialist:religious-national-politics-module:hindu-civilizational-belonging:1 | - | religious-national-politics-module | active |
| fm-so-1 | specialist | likert7 | property-ownership | 3 | 0 | property-legitimacy:-1, equality-theory:0.7, specialist:socialist-families-module:social-ownership:1 | - | socialist-families-module | active |
| fm-so-2 | specialist | likert7 | markets-planning | 3 | 0 | market-process-confidence:-0.8, democratic-confidence:0.5, specialist:socialist-families-module:democratic-planning:1 | - | socialist-families-module | active |
| fm-so-3 | specialist | likert7 | strategy-change | 4 | 0 | reform-vs-revolution:-0.8, electoralism-vs-direct-action:0.6, specialist:socialist-families-module:reformism:1, specialist:socialist-families-module:revolutionary-strategy:-0.5 | - | socialist-families-module | active |
| fm-so-4 | specialist | likert7 | strategy-change | 3 | 0 | centralization-preference:0.7, reform-vs-revolution:0.8, specialist:socialist-families-module:revolutionary-strategy:1 | - | socialist-families-module | active |
| fm-te-1 | specialist | likert7 | democracy-expertise-constitutionalism | 2 | 0 | centralization-preference:0.2, specialist:technology-governance-module:expert-administration:1 | - | technology-governance-module | active |
| fm-te-2 | specialist | likert7 | technology-ai-surveillance | 3 | 0 | centralization-preference:0.5, state-action-vs-exit:0.3, specialist:technology-governance-module:algorithmic-authority:1 | - | technology-governance-module | active |
| fm-te-3 | specialist | likert7 | technology-ai-surveillance | 2 | 0 | coordination-optimism:0.8, specialist:technology-governance-module:decentralized-technology:1 | - | technology-governance-module | active |
| fm-te-4 | specialist | likert7 | strategy-change | 3 | 0 | reform-vs-revolution:0.7, gradualism-vs-immediatism:0.7, specialist:technology-governance-module:accelerationist-strategy:1 | - | technology-governance-module | active |
| fm-te-5 | specialist | likert7 | strategy-change | 3 | 0 | regulation-vs-deregulation:-0.6, reform-vs-revolution:0.4, specialist:technology-governance-module:market-acceleration:1 | - | technology-governance-module | active |
| fm-te-6 | specialist | likert7 | democracy-expertise-constitutionalism | 2 | 0 | centralization-preference:0.8, specialist:technology-governance-module:centralized-administration:1 | - | technology-governance-module | active |
| q0001 | core | likert7 | state-legitimacy | 3 | 0 | authority-legitimacy:-1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0003 | core | likert7 | state-legitimacy | 3 | 0 | authority-legitimacy:-1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0004 | core | likert7 | state-legitimacy | 3 | 0 | authority-legitimacy:-1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0005 | core | likert7 | state-legitimacy | 3 | 0 | authority-legitimacy:-1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0006 | core | likert7 | state-legitimacy | 3 | 0 | authority-legitimacy:-1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0007 | core | likert7 | state-legitimacy | 1 | 0 | coordination-optimism:1 | - | - | active |
| q0012 | core | likert7 | state-legitimacy | 1 | 0 | coordination-optimism:0.8 | - | - | active |
| q0015 | core | likert7 | state-legitimacy | 1 | 0 | centralization-preference:-1 | - | - | active |
| q0016 | core | likert7 | state-legitimacy | 3 | 0 | gradualism-vs-immediatism:-0.8, state-action-vs-exit:-0.4, centralization-preference:-0.3 | - | - | active |
| q0017 | core | likert7 | state-legitimacy | 2 | 0 | coercion-strategy:-0.8, gradualism-vs-immediatism:-0.5 | - | - | active |
| q0018 | core | likert7 | state-legitimacy | 1 | 0 | centralization-preference:-1 | - | - | active |
| q0019 | core | likert7 | state-legitimacy | 3 | 0 | anti-domination:0.8, authority-legitimacy:-0.4, liberty-noninterference:0.3 | - | - | active |
| q0021 | core | likert7 | property-ownership | 2 | 0 | property-legitimacy:0.5, anti-domination:0.4 | - | - | active |
| q0022 | core | likert7 | property-ownership | 3 | 0 | property-legitimacy:-1, anti-domination:0.8, equality-theory:0.3 | - | - | active |
| q0023 | core | likert7 | property-ownership | 2 | 0 | property-legitimacy:-0.4, anti-domination:0.5 | - | - | active |
| q0024 | core | likert7 | property-ownership | 2 | 0 | anti-domination:0.5, equality-theory:0.4 | - | - | active |
| q0025 | core | likert7 | property-ownership | 3 | 0 | property-legitimacy:-1, anti-domination:0.8, equality-theory:0.3 | - | - | active |
| q0026 | core | likert7 | property-ownership | 3 | 0 | property-legitimacy:-0.5, anti-domination:0.5, equality-theory:0.3 | - | - | active |
| q0027 | core | likert7 | property-ownership | 1 | 0 | coordination-optimism:0.8 | - | - | active |
| q0029 | core | likert7 | property-ownership | 2 | 0 | public-choice-skepticism:1, market-process-confidence:-0.8 | - | - | active |
| q0030 | core | likert7 | property-ownership | 2 | 0 | public-choice-skepticism:0.6, state-capacity-confidence:-0.5 | - | - | active |
| q0033 | core | likert7 | property-ownership | 3 | 0 | redistribution-vs-predistribution:0.5, regulation-vs-deregulation:-0.4, state-action-vs-exit:0.3 | - | - | active |
| q0034 | core | likert7 | property-ownership | 3 | 0 | redistribution-vs-predistribution:1, regulation-vs-deregulation:-0.8, state-action-vs-exit:0.3 | - | - | active |
| q0035 | core | likert7 | property-ownership | 3 | 0 | redistribution-vs-predistribution:1, regulation-vs-deregulation:-0.8, state-action-vs-exit:0.3 | - | - | active |
| q0036 | core | likert7 | property-ownership | 3 | 0 | redistribution-vs-predistribution:1, regulation-vs-deregulation:-0.8, state-action-vs-exit:-0.3 | - | - | active |
| q0038 | core | likert7 | property-ownership | 3 | 0 | redistribution-vs-predistribution:1, regulation-vs-deregulation:-0.8, state-action-vs-exit:-0.3 | - | - | active |
| q0039 | core | likert7 | property-ownership | 3 | 0 | property-legitimacy:-1, anti-domination:0.8, equality-theory:0.3 | - | - | active |
| q0041 | core | likert7 | markets-planning | 3 | 0 | liberty-noninterference:1, property-legitimacy:0.8, equality-theory:0.3 | - | - | active |
| q0042 | core | likert7 | markets-planning | 2 | 0 | anti-domination:0.8, liberty-noninterference:0.4 | - | - | active |
| q0043 | core | likert7 | markets-planning | 3 | 0 | liberty-noninterference:1, property-legitimacy:0.8, equality-theory:0.3 | - | - | active |
| q0044 | core | likert7 | markets-planning | 3 | 0 | liberty-noninterference:0.5, property-legitimacy:-0.4, equality-theory:0.3 | - | - | active |
| q0045 | core | likert7 | markets-planning | 3 | 0 | liberty-noninterference:1, property-legitimacy:0.8, equality-theory:0.3 | - | - | active |
| q0046 | core | likert7 | markets-planning | 3 | 0 | liberty-noninterference:1, property-legitimacy:0.8, equality-theory:0.3 | - | - | active |
| q0047 | core | likert7 | markets-planning | 2 | 0 | market-process-confidence:1, coordination-optimism:0.7 | - | - | active |
| q0048 | core | likert7 | markets-planning | 2 | 0 | market-process-confidence:1, coordination-optimism:0.3 | - | - | active |
| q0050 | core | likert7 | markets-planning | 1 | 0 | public-choice-skepticism:1 | - | - | active |
| q0053 | core | likert7 | markets-planning | 3 | 0 | regulation-vs-deregulation:-0.8, centralization-preference:-0.8, state-action-vs-exit:-0.6 | - | - | active |
| q0054 | core | likert7 | markets-planning | 3 | 0 | regulation-vs-deregulation:-1, centralization-preference:-0.8, state-action-vs-exit:-0.3 | - | - | active |
| q0055 | core | likert7 | markets-planning | 3 | 0 | regulation-vs-deregulation:0.4, centralization-preference:-0.4, state-action-vs-exit:0.2 | - | - | active |
| q0058 | core | likert7 | markets-planning | 1 | 0 | regulation-vs-deregulation:-1 | - | - | active |
| q0059 | core | likert7 | markets-planning | 3 | 0 | liberty-noninterference:1, property-legitimacy:0.8, equality-theory:0.3 | - | - | active |
| q0061 | core | likert7 | redistribution-welfare | 3 | 0 | equality-theory:1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0062 | core | likert7 | redistribution-welfare | 3 | 0 | equality-theory:1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0063 | core | likert7 | redistribution-welfare | 3 | 0 | equality-theory:1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0064 | core | likert7 | redistribution-welfare | 3 | 0 | equality-theory:1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0065 | core | likert7 | redistribution-welfare | 3 | 0 | equality-theory:1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0066 | core | likert7 | redistribution-welfare | 3 | 0 | equality-theory:1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0067 | core | likert7 | redistribution-welfare | 1 | 0 | state-capacity-confidence:-1 | - | - | active |
| q0073 | core | likert7 | redistribution-welfare | 3 | 0 | redistribution-vs-predistribution:0.8, state-action-vs-exit:-0.5, regulation-vs-deregulation:-0.3 | - | - | active |
| q0074 | core | likert7 | redistribution-welfare | 3 | 0 | redistribution-vs-predistribution:1, state-action-vs-exit:-0.8, regulation-vs-deregulation:-0.3 | - | - | active |
| q0075 | core | likert7 | redistribution-welfare | 3 | 0 | redistribution-vs-predistribution:-0.9, regulation-vs-deregulation:-0.7, state-action-vs-exit:-0.3 | - | - | active |
| q0076 | core | likert7 | redistribution-welfare | 3 | 0 | redistribution-vs-predistribution:1, state-action-vs-exit:0.8, regulation-vs-deregulation:0.3 | - | - | active |
| q0077 | core | likert7 | redistribution-welfare | 3 | 0 | centralization-preference:-0.7, state-action-vs-exit:-0.7, regulation-vs-deregulation:-0.2 | - | - | active |
| q0079 | core | likert7 | redistribution-welfare | 3 | 0 | equality-theory:1, anti-domination:0.8, liberty-noninterference:0.3 | - | - | active |
| q0081 | core | likert7 | labor-unions-workplace | 3 | 0 | liberty-noninterference:0.8, anti-domination:0.7, property-legitimacy:0.2 | - | - | active |
| q0082 | core | likert7 | labor-unions-workplace | 3 | 0 | anti-domination:1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0083 | core | likert7 | labor-unions-workplace | 3 | 0 | anti-domination:1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0084 | core | likert7 | labor-unions-workplace | 3 | 0 | anti-domination:1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0085 | core | likert7 | labor-unions-workplace | 3 | 0 | anti-domination:1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0089 | core | likert7 | labor-unions-workplace | 1 | 0 | market-process-confidence:-0.6 | - | - | active |
| q0093 | core | likert7 | labor-unions-workplace | 3 | 0 | regulation-vs-deregulation:-0.7, state-action-vs-exit:-0.6, centralization-preference:-0.4 | - | - | active |
| q0094 | core | likert7 | labor-unions-workplace | 1 | 0 | regulation-vs-deregulation:-1 | - | - | active |
| q0095 | core | likert7 | labor-unions-workplace | 3 | 0 | regulation-vs-deregulation:1, state-action-vs-exit:0.8, centralization-preference:0.3 | - | - | active |
| q0096 | core | likert7 | labor-unions-workplace | 1 | 0 | state-action-vs-exit:-1 | - | - | active |
| q0097 | core | likert7 | labor-unions-workplace | 3 | 0 | regulation-vs-deregulation:-0.6, state-action-vs-exit:-0.4, centralization-preference:-0.3 | - | - | active |
| q0098 | core | likert7 | labor-unions-workplace | 3 | 0 | regulation-vs-deregulation:-1, state-action-vs-exit:-0.8, centralization-preference:0.3 | - | - | active |
| q0099 | core | likert7 | labor-unions-workplace | 3 | 0 | anti-domination:1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0101 | core | likert7 | land-housing-georgism | 3 | 0 | property-legitimacy:-1, equality-theory:0.8, anti-domination:0.3 | - | - | active |
| q0102 | core | likert7 | land-housing-georgism | 3 | 0 | property-legitimacy:0.9, liberty-noninterference:0.7, anti-domination:0.2 | - | - | active |
| q0104 | core | likert7 | land-housing-georgism | 3 | 0 | equality-theory:0.7, anti-domination:0.6, property-legitimacy:0.3 | - | - | active |
| q0105 | core | likert7 | land-housing-georgism | 3 | 0 | property-legitimacy:-1, equality-theory:0.8, anti-domination:0.3 | - | - | active |
| q0106 | core | likert7 | land-housing-georgism | 3 | 0 | property-legitimacy:-0.5, equality-theory:0.4, anti-domination:0.3 | - | - | active |
| q0107 | core | likert7 | land-housing-georgism | 2 | 0 | market-process-confidence:0.7, coordination-optimism:0.5 | - | - | active |
| q0108 | core | likert7 | land-housing-georgism | 1 | 0 | market-process-confidence:0.8 | - | - | active |
| q0114 | core | likert7 | land-housing-georgism | 3 | 0 | regulation-vs-deregulation:-1, redistribution-vs-predistribution:0.8, centralization-preference:0.3 | - | - | active |
| q0115 | core | likert7 | land-housing-georgism | 3 | 0 | redistribution-vs-predistribution:-0.8, regulation-vs-deregulation:0.2, centralization-preference:0.2 | - | - | active |
| q0116 | core | likert7 | land-housing-georgism | 3 | 0 | regulation-vs-deregulation:-0.3, redistribution-vs-predistribution:0.2, centralization-preference:-0.2 | - | - | active |
| q0117 | core | likert7 | land-housing-georgism | 3 | 0 | regulation-vs-deregulation:0.5, redistribution-vs-predistribution:-0.4, centralization-preference:0.3 | - | - | active |
| q0119 | core | likert7 | land-housing-georgism | 3 | 0 | property-legitimacy:-0.5, equality-theory:0.6, anti-domination:0.5 | - | - | active |
| q0121 | core | likert7 | money-banking | 3 | 0 | authority-legitimacy:-1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0122 | core | likert7 | money-banking | 3 | 0 | authority-legitimacy:-1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0123 | core | likert7 | money-banking | 3 | 0 | authority-legitimacy:-1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0124 | core | likert7 | money-banking | 3 | 0 | authority-legitimacy:-1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0125 | core | likert7 | money-banking | 3 | 0 | authority-legitimacy:-1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0126 | core | likert7 | money-banking | 3 | 0 | authority-legitimacy:-1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0127 | core | likert7 | money-banking | 1 | 0 | market-process-confidence:1 | - | - | active |
| q0128 | core | likert7 | money-banking | 2 | 0 | state-capacity-confidence:-0.5, public-choice-skepticism:0.3 | - | - | active |
| q0130 | core | likert7 | money-banking | 2 | 0 | public-choice-skepticism:1, market-process-confidence:0.3 | - | - | active |
| q0133 | core | likert7 | money-banking | 3 | 0 | state-action-vs-exit:-0.9, regulation-vs-deregulation:-0.7, centralization-preference:-0.7 | - | - | active |
| q0134 | core | likert7 | money-banking | 3 | 0 | state-action-vs-exit:-1, regulation-vs-deregulation:-0.8, centralization-preference:0.3 | - | - | active |
| q0135 | core | likert7 | money-banking | 3 | 0 | regulation-vs-deregulation:0.4, state-action-vs-exit:-0.2, centralization-preference:-0.2 | - | - | active |
| q0136 | core | likert7 | money-banking | 3 | 0 | state-action-vs-exit:-0.9, regulation-vs-deregulation:-0.7, centralization-preference:-0.5 | - | - | active |
| q0137 | core | likert7 | money-banking | 3 | 0 | state-action-vs-exit:-0.5, centralization-preference:-0.6, regulation-vs-deregulation:0.2 | - | - | active |
| q0138 | core | likert7 | money-banking | 3 | 0 | state-action-vs-exit:-1, regulation-vs-deregulation:-0.8, centralization-preference:0.3 | - | - | active |
| q0139 | core | likert7 | money-banking | 3 | 0 | authority-legitimacy:-1, liberty-noninterference:0.8, property-legitimacy:0.3 | - | - | active |
| q0141 | core | likert7 | intellectual-property-information | 3 | 0 | property-legitimacy:-1, liberty-noninterference:0.8, anti-domination:0.3 | - | - | active |
| q0142 | core | likert7 | intellectual-property-information | 3 | 0 | property-legitimacy:-1, liberty-noninterference:0.8, anti-domination:0.3 | - | - | active |
| q0144 | core | likert7 | intellectual-property-information | 3 | 0 | property-legitimacy:-1, liberty-noninterference:0.8, anti-domination:0.3 | - | - | active |
| q0145 | core | likert7 | intellectual-property-information | 3 | 0 | property-legitimacy:-1, liberty-noninterference:0.8, anti-domination:0.3 | - | - | active |
| q0146 | core | likert7 | intellectual-property-information | 3 | 0 | property-legitimacy:-0.5, liberty-noninterference:0.5, anti-domination:0.3 | - | - | active |
| q0147 | core | likert7 | intellectual-property-information | 2 | 0 | coordination-optimism:0.7, market-process-confidence:0.5 | - | - | active |
| q0148 | core | likert7 | intellectual-property-information | 2 | 0 | market-process-confidence:-0.5, public-choice-skepticism:0.3 | - | - | active |
| q0153 | core | likert7 | intellectual-property-information | 3 | 0 | regulation-vs-deregulation:-1, state-action-vs-exit:-0.8, gradualism-vs-immediatism:0.3 | - | - | active |
| q0154 | core | likert7 | intellectual-property-information | 3 | 0 | regulation-vs-deregulation:-1, state-action-vs-exit:-0.8, gradualism-vs-immediatism:0.3 | - | - | active |
| q0155 | core | likert7 | intellectual-property-information | 3 | 0 | regulation-vs-deregulation:-1, state-action-vs-exit:-0.8, gradualism-vs-immediatism:0.3 | - | - | active |
| q0156 | core | likert7 | intellectual-property-information | 1 | 0 | regulation-vs-deregulation:1 | - | - | active |
| q0157 | core | likert7 | intellectual-property-information | 3 | 0 | regulation-vs-deregulation:-1, state-action-vs-exit:-0.8, gradualism-vs-immediatism:0.3 | - | - | active |
| q0158 | core | likert7 | intellectual-property-information | 3 | 0 | regulation-vs-deregulation:-1, state-action-vs-exit:-0.8, gradualism-vs-immediatism:0.3 | - | - | active |
| q0159 | core | likert7 | intellectual-property-information | 3 | 0 | property-legitimacy:-1, liberty-noninterference:0.8, anti-domination:0.3 | - | - | active |
| q0161 | core | likert7 | civil-liberties-speech | 3 | 0 | liberty-noninterference:1, anti-domination:0.8, moral-traditionalism:-0.3 | - | - | active |
| q0162 | core | likert7 | civil-liberties-speech | 3 | 0 | liberty-noninterference:1, anti-domination:0.8, moral-traditionalism:-0.3 | - | - | active |
| q0163 | core | likert7 | civil-liberties-speech | 3 | 0 | liberty-noninterference:1, anti-domination:0.8, moral-traditionalism:-0.3 | - | - | active |
| q0164 | core | likert7 | civil-liberties-speech | 3 | 0 | liberty-noninterference:1, anti-domination:0.8, moral-traditionalism:-0.3 | - | - | active |
| q0165 | core | likert7 | civil-liberties-speech | 3 | 0 | liberty-noninterference:1, anti-domination:0.8, moral-traditionalism:-0.3 | - | - | active |
| q0166 | core | likert7 | civil-liberties-speech | 3 | 0 | liberty-noninterference:1, anti-domination:0.8, moral-traditionalism:-0.3 | - | - | active |
| q0171 | core | likert7 | civil-liberties-speech | 1 | 0 | public-choice-skepticism:1 | - | - | active |
| q0173 | core | likert7 | civil-liberties-speech | 3 | 0 | regulation-vs-deregulation:-0.8, state-action-vs-exit:-0.6, coercion-strategy:-0.5 | - | - | active |
| q0174 | core | likert7 | civil-liberties-speech | 3 | 0 | regulation-vs-deregulation:-0.8, state-action-vs-exit:-0.5, coercion-strategy:-0.8 | - | - | active |
| q0175 | core | likert7 | civil-liberties-speech | 3 | 0 | coercion-strategy:-0.6, centralization-preference:-0.3, regulation-vs-deregulation:0.2 | - | - | active |
| q0176 | core | likert7 | civil-liberties-speech | 3 | 0 | coercion-strategy:-0.7, centralization-preference:-0.4, regulation-vs-deregulation:-0.2 | - | - | active |
| q0177 | core | likert7 | civil-liberties-speech | 2 | 0 | regulation-vs-deregulation:0.6, coercion-strategy:-0.6 | - | - | active |
| q0178 | core | likert7 | civil-liberties-speech | 2 | 0 | coercion-strategy:-0.8, regulation-vs-deregulation:0.4 | - | - | active |
| q0179 | core | likert7 | civil-liberties-speech | 2 | 0 | liberty-noninterference:1, anti-domination:0.8 | - | - | active |
| q0181 | core | likert7 | crime-policing-justice | 2 | 0 | anti-domination:0.8, authority-legitimacy:-0.4 | - | - | active |
| q0182 | core | likert7 | crime-policing-justice | 3 | 0 | anti-domination:0.8, liberty-noninterference:0.4, authority-legitimacy:-0.4 | - | - | active |
| q0183 | core | likert7 | crime-policing-justice | 1 | 0 | anti-domination:0.5 | - | - | active |
| q0184 | core | likert7 | crime-policing-justice | 3 | 0 | liberty-noninterference:0.7, anti-domination:0.5, authority-legitimacy:-0.4 | - | - | active |
| q0185 | core | likert7 | crime-policing-justice | 3 | 0 | anti-domination:1, authority-legitimacy:-0.6, liberty-noninterference:0.3 | - | - | active |
| q0186 | core | likert7 | crime-policing-justice | 2 | 0 | anti-domination:1, authority-legitimacy:-0.5 | - | - | active |
| q0188 | core | likert7 | crime-policing-justice | 2 | 0 | public-choice-skepticism:1, state-capacity-confidence:-0.8 | - | - | active |
| q0190 | core | likert7 | crime-policing-justice | 1 | 0 | public-choice-skepticism:1 | - | - | active |
| q0191 | core | likert7 | crime-policing-justice | 1 | 0 | public-choice-skepticism:1 | - | - | active |
| q0193 | core | likert7 | crime-policing-justice | 3 | 0 | coercion-strategy:-0.6, state-action-vs-exit:0.2, regulation-vs-deregulation:-0.2 | - | - | active |
| q0195 | core | likert7 | crime-policing-justice | 3 | 0 | coercion-strategy:-0.6, state-action-vs-exit:-0.4, regulation-vs-deregulation:0.2 | - | - | active |
| q0197 | core | likert7 | crime-policing-justice | 3 | 0 | state-action-vs-exit:-1, regulation-vs-deregulation:-0.8, coercion-strategy:0.3 | - | - | active |
| q0198 | core | likert7 | crime-policing-justice | 3 | 0 | coercion-strategy:-0.7, centralization-preference:-0.5, state-action-vs-exit:-0.3 | - | - | active |
| q0199 | core | likert7 | crime-policing-justice | 2 | 0 | anti-domination:0.8, authority-legitimacy:-0.5 | - | - | active |
| q0201 | core | likert7 | immigration-borders | 3 | 0 | political-community-boundary:1, liberty-noninterference:0.8, equality-theory:0.3 | - | - | active |
| q0202 | core | likert7 | immigration-borders | 2 | 0 | political-community-boundary:0.8, liberty-noninterference:0.7 | - | - | active |
| q0203 | core | likert7 | immigration-borders | 3 | 0 | political-community-boundary:1, liberty-noninterference:0.8, equality-theory:0.3 | - | - | active |
| q0204 | core | likert7 | immigration-borders | 3 | 0 | political-community-boundary:1, liberty-noninterference:0.8, equality-theory:0.3 | - | - | active |
| q0205 | core | likert7 | immigration-borders | 3 | 0 | political-community-boundary:1, liberty-noninterference:0.8, equality-theory:0.3 | - | - | active |
| q0206 | core | likert7 | immigration-borders | 3 | 0 | political-community-boundary:0.6, liberty-noninterference:0.5, equality-theory:0.3 | - | - | active |
| q0207 | core | likert7 | race-ethnicity-multiculturalism | 1 | 0 | cultural-plasticity:1 | - | - | active |
| q0208 | core | likert7 | immigration-borders | 1 | 0 | public-choice-skepticism:1 | - | - | active |
| q0213 | core | likert7 | immigration-borders | 3 | 0 | state-action-vs-exit:-0.8, regulation-vs-deregulation:-0.7, centralization-preference:-0.4 | - | - | active |
| q0214 | core | likert7 | immigration-borders | 3 | 0 | regulation-vs-deregulation:-1, centralization-preference:-0.8, gradualism-vs-immediatism:0.3 | - | - | active |
| q0215 | core | likert7 | immigration-borders | 3 | 0 | regulation-vs-deregulation:-1, centralization-preference:-0.8, gradualism-vs-immediatism:0.3 | - | - | active |
| q0216 | core | likert7 | immigration-borders | 3 | 0 | regulation-vs-deregulation:-1, centralization-preference:-0.8, gradualism-vs-immediatism:0.3 | - | - | active |
| q0217 | core | likert7 | immigration-borders | 3 | 0 | regulation-vs-deregulation:-1, centralization-preference:-0.8, gradualism-vs-immediatism:0.3 | - | - | active |
| q0219 | core | likert7 | immigration-borders | 3 | 0 | political-community-boundary:1, liberty-noninterference:0.8, equality-theory:0.3 | - | - | active |
| q0221 | core | likert7 | national-identity-sovereignty | 3 | 0 | political-community-boundary:0.4, anti-domination:0.6, moral-traditionalism:-0.3 | - | - | active |
| q0222 | core | likert7 | national-identity-sovereignty | 3 | 0 | political-community-boundary:1, anti-domination:0.8, moral-traditionalism:-0.3 | - | - | active |
| q0223 | core | likert7 | national-identity-sovereignty | 2 | 0 | anti-domination:0.6, liberty-noninterference:0.4 | - | - | active |
| q0224 | core | likert7 | national-identity-sovereignty | 2 | 0 | anti-domination:0.8, authority-legitimacy:-0.5 | - | - | active |
| q0225 | core | likert7 | national-identity-sovereignty | 2 | 0 | anti-domination:0.8, liberty-noninterference:0.4 | - | - | active |
| q0226 | core | likert7 | national-identity-sovereignty | 3 | 0 | anti-domination:0.6, political-community-boundary:0.3, moral-traditionalism:-0.3 | - | - | active |
| q0227 | core | likert7 | national-identity-sovereignty | 1 | 0 | coordination-optimism:1 | - | - | active |
| q0233 | core | likert7 | national-identity-sovereignty | 3 | 0 | centralization-preference:-1, state-action-vs-exit:-0.8, regulation-vs-deregulation:-0.3 | - | - | active |
| q0234 | core | likert7 | national-identity-sovereignty | 3 | 0 | centralization-preference:-0.4, state-action-vs-exit:-0.5, regulation-vs-deregulation:0.1 | - | - | active |
| q0235 | core | likert7 | national-identity-sovereignty | 3 | 0 | centralization-preference:-1, state-action-vs-exit:-0.8, regulation-vs-deregulation:0.3 | - | - | active |
| q0236 | core | likert7 | national-identity-sovereignty | 3 | 0 | centralization-preference:-0.5, state-action-vs-exit:-0.4, regulation-vs-deregulation:-0.3 | - | - | active |
| q0239 | core | likert7 | national-identity-sovereignty | 3 | 0 | political-community-boundary:1, anti-domination:0.8, moral-traditionalism:-0.3 | - | - | active |
| q0241 | core | likert7 | religion-secularism | 4 | 0 | moral-traditionalism:-0.5, authority-legitimacy:-0.4, liberty-noninterference:0.3, secularism-religious:-0.8 | - | - | active |
| q0242 | core | likert7 | religion-secularism | 4 | 0 | moral-traditionalism:-1, authority-legitimacy:-0.8, liberty-noninterference:0.3, secularism-religious:-0.8 | - | - | active |
| q0243 | core | likert7 | religion-secularism | 2 | 0 | liberty-noninterference:0.6, anti-domination:0.5 | - | - | active |
| q0244 | core | likert7 | religion-secularism | 4 | 0 | moral-traditionalism:-1, authority-legitimacy:-0.8, liberty-noninterference:0.3, secularism-religious:-0.8 | - | - | active |
| q0245 | core | likert7 | religion-secularism | 4 | 0 | moral-traditionalism:-1, authority-legitimacy:-0.8, liberty-noninterference:0.3, secularism-religious:-0.8 | - | - | active |
| q0246 | core | likert7 | religion-secularism | 4 | 0 | moral-traditionalism:-1, authority-legitimacy:-0.8, liberty-noninterference:0.3, secularism-religious:-0.8 | - | - | active |
| q0248 | core | likert7 | religion-secularism | 1 | 0 | public-choice-skepticism:1 | - | - | active |
| q0253 | core | likert7 | religion-secularism | 3 | 0 | coercion-strategy:-0.5, regulation-vs-deregulation:-0.3, state-action-vs-exit:-0.2 | - | - | active |
| q0254 | core | likert7 | religion-secularism | 3 | 0 | state-action-vs-exit:0.5, regulation-vs-deregulation:-0.4, centralization-preference:0.3 | - | - | active |
| q0255 | core | likert7 | religion-secularism | 3 | 0 | state-action-vs-exit:-0.8, regulation-vs-deregulation:-0.7, centralization-preference:-0.4 | - | - | active |
| q0256 | core | likert7 | religion-secularism | 3 | 0 | state-action-vs-exit:-0.5, regulation-vs-deregulation:-0.4, centralization-preference:-0.2 | - | - | active |
| q0257 | core | likert7 | religion-secularism | 3 | 0 | state-action-vs-exit:-0.5, regulation-vs-deregulation:-0.4, centralization-preference:0.3 | - | - | active |
| q0258 | core | likert7 | religion-secularism | 1 | 0 | coercion-strategy:-0.7 | - | - | active |
| q0259 | core | likert7 | religion-secularism | 3 | 0 | liberty-noninterference:0.7, anti-domination:0.6, authority-legitimacy:-0.3 | - | - | active |
| q0261 | core | likert7 | family-gender-feminism | 3 | 0 | moral-traditionalism:-1, liberty-noninterference:0.8, equality-theory:0.3 | - | - | active |
| q0262 | core | likert7 | family-gender-feminism | 3 | 0 | moral-traditionalism:-1, liberty-noninterference:0.8, equality-theory:0.3 | - | - | active |
| q0263 | core | likert7 | family-gender-feminism | 1 | 0 | equality-theory:0.7 | - | - | active |
| q0264 | core | likert7 | family-gender-feminism | 3 | 0 | anti-domination:0.8, liberty-noninterference:0.5, equality-theory:0.3 | - | - | active |
| q0265 | core | likert7 | family-gender-feminism | 3 | 0 | moral-traditionalism:-1, liberty-noninterference:0.8, equality-theory:0.3 | - | - | active |
| q0266 | core | likert7 | family-gender-feminism | 3 | 0 | moral-traditionalism:-0.5, liberty-noninterference:0.5, equality-theory:0.3 | - | - | active |
| q0269 | core | likert7 | family-gender-feminism | 2 | 0 | state-capacity-confidence:-0.5, public-choice-skepticism:0.4 | - | - | active |
| q0274 | core | likert7 | family-gender-feminism | 3 | 0 | regulation-vs-deregulation:-1, state-action-vs-exit:-0.8, redistribution-vs-predistribution:0.3 | - | - | active |
| q0275 | core | likert7 | family-gender-feminism | 3 | 0 | coercion-strategy:-0.6, regulation-vs-deregulation:-0.4, state-action-vs-exit:-0.3 | - | - | active |
| q0276 | core | likert7 | family-gender-feminism | 3 | 0 | state-action-vs-exit:-0.5, redistribution-vs-predistribution:0.3, regulation-vs-deregulation:-0.2 | - | - | active |
| q0278 | core | likert7 | family-gender-feminism | 3 | 0 | regulation-vs-deregulation:-1, state-action-vs-exit:-0.8, redistribution-vs-predistribution:0.3 | - | - | active |
| q0279 | core | likert7 | family-gender-feminism | 3 | 0 | anti-domination:0.8, liberty-noninterference:0.6, equality-theory:0.2 | - | - | active |
| q0281 | core | likert7 | race-ethnicity-multiculturalism | 3 | 0 | equality-theory:1, political-community-boundary:0.8, anti-domination:0.3 | - | - | active |
| q0282 | core | likert7 | race-ethnicity-multiculturalism | 2 | 0 | political-community-boundary:0.7, anti-domination:0.4 | - | - | active |
| q0283 | core | likert7 | race-ethnicity-multiculturalism | 3 | 0 | anti-domination:0.9, equality-theory:0.4, political-community-boundary:0.2 | - | - | active |
| q0284 | core | likert7 | race-ethnicity-multiculturalism | 2 | 0 | equality-theory:0.8, anti-domination:0.3 | - | - | active |
| q0285 | core | likert7 | race-ethnicity-multiculturalism | 2 | 0 | political-community-boundary:0.4, anti-domination:0.3 | - | - | active |
| q0293 | core | likert7 | race-ethnicity-multiculturalism | 3 | 0 | regulation-vs-deregulation:-0.4, centralization-preference:-0.3, state-action-vs-exit:-0.3 | - | - | active |
| q0294 | core | likert7 | race-ethnicity-multiculturalism | 3 | 0 | redistribution-vs-predistribution:-0.7, regulation-vs-deregulation:-0.5, centralization-preference:-0.3 | - | - | active |
| q0295 | core | likert7 | race-ethnicity-multiculturalism | 3 | 0 | regulation-vs-deregulation:-0.3, coercion-strategy:-0.3, centralization-preference:-0.2 | - | - | active |
| q0296 | core | likert7 | race-ethnicity-multiculturalism | 3 | 0 | redistribution-vs-predistribution:1, regulation-vs-deregulation:0.8, centralization-preference:0.3 | - | - | active |
| q0299 | core | likert7 | race-ethnicity-multiculturalism | 3 | 0 | equality-theory:1, political-community-boundary:0.8, anti-domination:0.3 | - | - | active |
| q0301 | core | likert7 | environment-climate-growth | 1 | 0 | human-nature-priority:0.8 | - | - | active |
| q0302 | core | likert7 | environment-climate-growth | 3 | 0 | human-nature-priority:1, equality-theory:0.8, anti-domination:0.3 | - | - | active |
| q0303 | core | likert7 | environment-climate-growth | 1 | 0 | human-nature-priority:1 | - | - | active |
| q0304 | core | likert7 | environment-climate-growth | 2 | 0 | anti-domination:0.5, liberty-noninterference:0.4 | - | - | active |
| q0305 | core | likert7 | environment-climate-growth | 1 | 0 | anti-domination:0.6 | - | - | active |
| q0307 | core | likert7 | environment-climate-growth | 1 | 0 | state-capacity-confidence:0.6 | - | - | active |
| q0308 | core | likert7 | environment-climate-growth | 1 | 0 | market-process-confidence:-0.4 | - | - | active |
| q0313 | core | likert7 | environment-climate-growth | 3 | 0 | regulation-vs-deregulation:0.3, centralization-preference:-0.6, state-action-vs-exit:-0.2 | - | - | active |
| q0314 | core | likert7 | environment-climate-growth | 3 | 0 | regulation-vs-deregulation:-1, centralization-preference:-0.8, state-action-vs-exit:0.3 | - | - | active |
| q0315 | core | likert7 | environment-climate-growth | 3 | 0 | regulation-vs-deregulation:0.2, centralization-preference:-0.4, state-action-vs-exit:0.1 | - | - | active |
| q0316 | core | likert7 | environment-climate-growth | 3 | 0 | regulation-vs-deregulation:0.5, centralization-preference:-0.4, state-action-vs-exit:0.3 | - | - | active |
| q0317 | core | likert7 | environment-climate-growth | 3 | 0 | regulation-vs-deregulation:-0.3, centralization-preference:-0.4, state-action-vs-exit:-0.2 | - | - | active |
| q0318 | core | likert7 | environment-climate-growth | 3 | 0 | regulation-vs-deregulation:-1, centralization-preference:-0.8, state-action-vs-exit:0.3 | - | - | active |
| q0319 | core | likert7 | environment-climate-growth | 1 | 0 | equality-theory:0.8 | - | - | active |
| q0321 | core | likert7 | foreign-policy-war | 2 | 0 | political-community-boundary:0.8, anti-domination:0.4 | - | - | active |
| q0322 | core | likert7 | foreign-policy-war | 3 | 0 | anti-domination:0.8, militarism-pacifism:-0.5, authority-legitimacy:-0.4 | - | - | active |
| q0323 | core | likert7 | foreign-policy-war | 2 | 0 | militarism-pacifism:-0.5, anti-domination:0.3 | - | - | active |
| q0324 | core | likert7 | foreign-policy-war | 3 | 0 | anti-domination:0.8, authority-legitimacy:-0.6, militarism-pacifism:-0.3 | - | - | active |
| q0325 | core | likert7 | foreign-policy-war | 3 | 0 | anti-domination:0.8, liberty-noninterference:0.6, authority-legitimacy:-0.5 | - | - | active |
| q0326 | core | likert7 | foreign-policy-war | 3 | 0 | anti-domination:0.6, militarism-pacifism:-0.4, political-community-boundary:0.2 | - | - | active |
| q0328 | core | likert7 | foreign-policy-war | 1 | 0 | state-capacity-confidence:-1 | - | - | active |
| q0329 | core | likert7 | foreign-policy-war | 1 | 0 | public-choice-skepticism:1 | - | - | active |
| q0334 | core | likert7 | foreign-policy-war | 3 | 0 | coercion-strategy:-0.5, centralization-preference:-0.4, state-action-vs-exit:-0.2 | - | - | active |
| q0336 | core | likert7 | foreign-policy-war | 3 | 0 | centralization-preference:-0.6, coercion-strategy:-0.5, state-action-vs-exit:-0.3 | - | - | active |
| q0337 | core | likert7 | foreign-policy-war | 3 | 0 | coercion-strategy:-0.5, centralization-preference:-0.3, state-action-vs-exit:-0.2 | - | - | active |
| q0338 | core | likert7 | foreign-policy-war | 1 | 0 | coercion-strategy:-0.8 | - | - | active |
| q0339 | core | likert7 | foreign-policy-war | 4 | 0 | anti-domination:0.8, liberty-noninterference:0.5, authority-legitimacy:-0.5, militarism-pacifism:-0.3 | - | - | active |
| q0341 | core | likert7 | democracy-expertise-constitutionalism | 3 | 0 | authority-legitimacy:-1, liberty-noninterference:0.8, anti-domination:0.3 | - | - | active |
| q0342 | core | likert7 | democracy-expertise-constitutionalism | 3 | 0 | authority-legitimacy:-0.2, liberty-noninterference:0.4, anti-domination:0.5 | - | - | active |
| q0343 | core | likert7 | democracy-expertise-constitutionalism | 3 | 0 | authority-legitimacy:-1, liberty-noninterference:0.8, anti-domination:0.3 | - | - | active |
| q0344 | core | likert7 | democracy-expertise-constitutionalism | 3 | 0 | anti-domination:0.8, authority-legitimacy:-0.5, liberty-noninterference:0.3 | - | - | active |
| q0345 | core | likert7 | democracy-expertise-constitutionalism | 3 | 0 | authority-legitimacy:-1, liberty-noninterference:0.8, anti-domination:0.3 | - | - | active |
| q0347 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | democratic-confidence:1 | - | - | active |
| q0348 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | democratic-confidence:-1 | - | - | active |
| q0350 | core | likert7 | democracy-expertise-constitutionalism | 2 | 0 | democratic-confidence:-1, public-choice-skepticism:0.3 | - | - | active |
| q0354 | core | likert7 | democracy-expertise-constitutionalism | 2 | 0 | centralization-preference:-1, state-action-vs-exit:-0.8 | - | - | active |
| q0355 | core | likert7 | democracy-expertise-constitutionalism | 2 | 0 | centralization-preference:0.5, state-action-vs-exit:-0.4 | - | - | active |
| q0356 | core | likert7 | democracy-expertise-constitutionalism | 2 | 0 | centralization-preference:1, state-action-vs-exit:0.8 | - | - | active |
| q0357 | core | likert7 | democracy-expertise-constitutionalism | 2 | 0 | centralization-preference:0.7, state-action-vs-exit:0.3 | - | - | active |
| q0359 | core | likert7 | democracy-expertise-constitutionalism | 3 | 0 | authority-legitimacy:-0.8, liberty-noninterference:0.4, anti-domination:0.3 | - | - | active |
| q0361 | core | likert7 | technology-ai-surveillance | 3 | 0 | liberty-noninterference:1, anti-domination:0.8, authority-legitimacy:-0.3 | - | - | active |
| q0362 | core | likert7 | technology-ai-surveillance | 2 | 0 | liberty-noninterference:1, anti-domination:0.8 | - | - | active |
| q0363 | core | likert7 | technology-ai-surveillance | 3 | 0 | liberty-noninterference:1, anti-domination:0.8, authority-legitimacy:-0.3 | - | - | active |
| q0364 | core | likert7 | technology-ai-surveillance | 3 | 0 | liberty-noninterference:1, anti-domination:0.8, authority-legitimacy:-0.3 | - | - | active |
| q0365 | core | likert7 | technology-ai-surveillance | 3 | 0 | liberty-noninterference:1, anti-domination:0.8, authority-legitimacy:-0.3 | - | - | active |
| q0368 | core | likert7 | technology-ai-surveillance | 1 | 0 | public-choice-skepticism:1 | - | - | active |
| q0374 | core | likert7 | technology-ai-surveillance | 3 | 0 | regulation-vs-deregulation:-0.3, state-action-vs-exit:-0.4, centralization-preference:-0.3 | - | - | active |
| q0375 | core | likert7 | technology-ai-surveillance | 3 | 0 | coercion-strategy:-0.7, centralization-preference:-0.3, regulation-vs-deregulation:0.2 | - | - | active |
| q0376 | core | likert7 | technology-ai-surveillance | 3 | 0 | coercion-strategy:-0.5, centralization-preference:-0.3, regulation-vs-deregulation:0.2 | - | - | active |
| q0377 | core | likert7 | technology-ai-surveillance | 3 | 0 | regulation-vs-deregulation:0.5, state-action-vs-exit:-0.6, centralization-preference:-0.4 | - | - | active |
| q0379 | core | likert7 | technology-ai-surveillance | 2 | 0 | anti-domination:0.8, liberty-noninterference:0.6 | - | - | active |
| q0381 | core | likert7 | strategy-change | 3 | 0 | anti-domination:0.6, authority-legitimacy:-0.4, liberty-noninterference:0.5 | - | - | active |
| q0382 | core | likert7 | strategy-change | 3 | 0 | anti-domination:1, authority-legitimacy:-0.8, liberty-noninterference:0.3 | - | - | active |
| q0383 | core | likert7 | strategy-change | 3 | 0 | anti-domination:1, authority-legitimacy:-0.8, liberty-noninterference:0.3 | - | - | active |
| q0384 | core | likert7 | strategy-change | 3 | 0 | anti-domination:1, authority-legitimacy:-0.8, liberty-noninterference:0.3 | - | - | active |
| q0385 | core | likert7 | strategy-change | 3 | 0 | anti-domination:0.6, liberty-noninterference:0.5, authority-legitimacy:-0.3 | - | - | active |
| q0394 | core | likert7 | strategy-change | 3 | 0 | gradualism-vs-immediatism:-0.7, electoralism-vs-direct-action:-0.6, reform-vs-revolution:-0.2 | - | - | active |
| q0396 | core | likert7 | strategy-change | 3 | 0 | reform-vs-revolution:-0.8, gradualism-vs-immediatism:-0.6, electoralism-vs-direct-action:0.1 | - | - | active |
| q0397 | core | likert7 | strategy-change | 3 | 0 | reform-vs-revolution:-0.8, gradualism-vs-immediatism:-0.6, compromise-vs-persistence:0.2 | - | - | active |
| q0399 | core | likert7 | strategy-change | 3 | 0 | anti-domination:1, authority-legitimacy:-0.8, liberty-noninterference:0.3 | - | - | active |
| q0401 | core | likert7 | foreign-policy-war | 2 | 0 | political-community-boundary:0.5, anti-domination:0.3 | - | - | active |
| q0402 | core | likert7 | foreign-policy-war | 3 | 0 | militarism-pacifism:1, authority-legitimacy:0.3, anti-domination:-0.3 | - | - | active |
| q0403 | core | likert7 | foreign-policy-war | 3 | 0 | militarism-pacifism:1, political-community-boundary:-0.3, anti-domination:-0.3 | - | - | active |
| q0404 | core | likert7 | religion-secularism | 3 | 0 | secularism-religious:-1, liberty-noninterference:0.5, moral-traditionalism:-0.5 | - | - | active |
| q0405 | core | likert7 | religion-secularism | 3 | 0 | secularism-religious:1, moral-traditionalism:0.7, authority-legitimacy:0.4 | - | - | active |
| q0406 | core | likert7 | religion-secularism | 3 | 0 | secularism-religious:-1, liberty-noninterference:0.4, authority-legitimacy:-0.3 | - | - | active |
| q0407 | core | likert7 | property-ownership | 3 | 0 | property-legitimacy:-0.8, anti-domination:0.6, equality-theory:0.3 | - | - | active |
| q0408 | core | likert7 | land-housing-georgism | 3 | 0 | property-legitimacy:-1, equality-theory:0.2, political-community-boundary:0.2 | - | - | active |
| q0411 | core | likert7 | strategy-change | 3 | 0 | centralization-preference:-0.8, electoralism-vs-direct-action:-0.7, state-action-vs-exit:-0.4 | - | - | active |
| q0412 | core | likert7 | strategy-change | 3 | 0 | centralization-preference:0.8, reform-vs-revolution:0.8, coercion-strategy:0.4 | - | - | active |
| q0413 | core | likert7 | strategy-change | 1 | 0 | centralization-preference:0.6 | - | - | active |
| q0414 | core | likert7 | religion-secularism | 3 | 0 | secularism-religious:1, moral-traditionalism:0.8, authority-legitimacy:0.5 | - | - | active |
| q0415 | core | likert7 | national-identity-sovereignty | 1 | 0 | political-community-boundary:0.8 | - | - | active |
| q0417 | core | likert7 | immigration-borders | 3 | 0 | centralization-preference:0.4, state-action-vs-exit:0.5, compromise-vs-persistence:-0.3 | - | - | active |
| q0418 | core | likert7 | environment-climate-growth | 1 | 0 | human-nature-priority:1 | - | - | active |
| q0420 | core | likert7 | environment-climate-growth | 2 | 0 | regulation-vs-deregulation:0.8, redistribution-vs-predistribution:0.4 | - | - | active |
| q0421 | core | likert7 | family-gender-feminism | 3 | 0 | anti-domination:0.8, equality-theory:0.7, moral-traditionalism:-0.5 | - | - | active |
| q0423 | core | likert7 | redistribution-welfare | 1 | 0 | compromise-vs-persistence:1 | - | - | active |
| q0424 | core | likert7 | land-housing-georgism | 1 | 0 | redistribution-vs-predistribution:-0.9 | - | - | active |
| q0425 | core | likert7 | democracy-expertise-constitutionalism | 2 | 0 | authority-legitimacy:0.8, moral-traditionalism:0.7 | - | - | active |
| q0427 | core | likert7 | environment-climate-growth | 1 | 0 | human-nature-priority:1 | - | - | active |
| q0428 | core | likert7 | environment-climate-growth | 1 | 0 | human-nature-priority:1 | - | - | active |
| q0429 | core | likert7 | environment-climate-growth | 1 | 0 | human-nature-priority:1 | - | - | active |
| q0430 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | democratic-confidence:0.6 | - | - | active |
| q0431 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | democratic-confidence:0.8 | - | - | active |
| q0432 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | democratic-confidence:-0.8 | - | - | active |
| q0433 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | expert-confidence:0.8 | - | - | active |
| q0434 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | expert-confidence:-0.8 | - | - | active |
| q0435 | core | likert7 | family-gender-feminism | 1 | 0 | cultural-plasticity:0.8 | - | - | active |
| q0436 | core | likert7 | strategy-change | 1 | 0 | reform-vs-revolution:-1 | - | - | active |
| q0437 | core | likert7 | strategy-change | 1 | 0 | reform-vs-revolution:1 | - | - | active |
| q0438 | core | likert7 | strategy-change | 1 | 0 | electoralism-vs-direct-action:1 | - | - | active |
| q0439 | core | likert7 | strategy-change | 1 | 0 | electoralism-vs-direct-action:-1 | - | - | active |
| q0440 | core | likert7 | strategy-change | 1 | 0 | compromise-vs-persistence:1 | - | - | active |
| q0441 | core | likert7 | strategy-change | 1 | 0 | compromise-vs-persistence:-1 | - | - | active |
| q0442 | core | likert7 | strategy-change | 1 | 0 | compromise-vs-persistence:1 | - | - | active |
| q0443 | core | likert7 | strategy-change | 1 | 0 | electoralism-vs-direct-action:-1 | - | - | active |
| q0444 | core | likert7 | family-gender-feminism | 1 | 0 | cultural-plasticity:-0.8 | - | - | active |
| q0445 | core | likert7 | family-gender-feminism | 1 | 0 | cultural-plasticity:0.8 | - | - | active |
| q0446 | core | likert7 | environment-climate-growth | 1 | 0 | human-nature-priority:1 | - | - | active |
| q0447 | core | likert7 | environment-climate-growth | 1 | 0 | human-nature-priority:1 | - | - | active |
| q0448 | core | likert7 | environment-climate-growth | 1 | 0 | human-nature-priority:-1 | - | - | active |
| q0449 | core | likert7 | foreign-policy-war | 1 | 0 | militarism-pacifism:1 | - | - | active |
| q0450 | core | likert7 | foreign-policy-war | 1 | 0 | militarism-pacifism:-1 | - | - | active |
| q0451 | core | likert7 | foreign-policy-war | 1 | 0 | militarism-pacifism:1 | - | - | active |
| q0452 | core | likert7 | religion-secularism | 1 | 0 | secularism-religious:1 | - | - | active |
| q0453 | core | likert7 | religion-secularism | 1 | 0 | secularism-religious:-1 | - | - | active |
| q0454 | core | likert7 | religion-secularism | 1 | 0 | secularism-religious:-1 | - | - | active |
| q0455 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | democratic-confidence:1 | - | - | active |
| q0456 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | democratic-confidence:-1 | - | - | active |
| q0457 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | democratic-confidence:-1 | - | - | active |
| q0458 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | expert-confidence:1 | - | - | active |
| q0459 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | expert-confidence:-1 | - | - | active |
| q0460 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | expert-confidence:1 | - | - | active |
| q0461 | core | likert7 | family-gender-feminism | 1 | 0 | cultural-plasticity:1 | - | - | active |
| q0462 | core | likert7 | family-gender-feminism | 1 | 0 | cultural-plasticity:-1 | - | - | active |
| q0463 | core | likert7 | family-gender-feminism | 1 | 0 | cultural-plasticity:1 | - | - | active |
| q0464 | core | likert7 | strategy-change | 1 | 0 | reform-vs-revolution:-1 | - | - | active |
| q0465 | core | likert7 | strategy-change | 1 | 0 | reform-vs-revolution:1 | - | - | active |
| q0466 | core | likert7 | strategy-change | 1 | 0 | reform-vs-revolution:-1 | - | - | active |
| q0467 | core | likert7 | strategy-change | 1 | 0 | electoralism-vs-direct-action:1 | - | - | active |
| q0468 | core | likert7 | strategy-change | 1 | 0 | electoralism-vs-direct-action:-1 | - | - | active |
| q0469 | core | likert7 | strategy-change | 1 | 0 | electoralism-vs-direct-action:-1 | - | - | active |
| q0470 | core | likert7 | strategy-change | 1 | 0 | compromise-vs-persistence:1 | - | - | active |
| q0471 | core | likert7 | strategy-change | 1 | 0 | compromise-vs-persistence:-1 | - | - | active |
| q0472 | core | likert7 | strategy-change | 1 | 0 | compromise-vs-persistence:1 | - | - | active |
| q0473 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | expert-confidence:0.8 | - | - | active |
| q0474 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | state-capacity-confidence:-1 | - | - | active |
| q0475 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | state-capacity-confidence:1 | - | - | active |
| q0476 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | expert-confidence:1 | - | - | active |
| q0477 | core | likert7 | democracy-expertise-constitutionalism | 1 | 0 | expert-confidence:-1 | - | - | active |
| q0478 | core | likert7 | family-gender-feminism | 1 | 0 | cultural-plasticity:1 | - | - | active |
| q0479 | core | likert7 | family-gender-feminism | 1 | 0 | cultural-plasticity:-1 | - | - | active |
| sq01 | core | statement-choice | state-legitimacy | 7 | 7 | - | a=authority-legitimacy:1,anti-domination:-0.6; b=authority-legitimacy:-0.3,anti-domination:0.5; c=authority-legitimacy:0.5; d=authority-legitimacy:-1,anti-domination:0.8 | - | active |
| sq02 | core | statement-choice | property-ownership | 8 | 8 | - | a=property-legitimacy:1,equality-theory:-0.4; b=property-legitimacy:-0.6,equality-theory:1; c=property-legitimacy:-0.2,equality-theory:0.3; d=property-legitimacy:-0.8,equality-theory:0.8 | - | active |
| sq06 | core | statement-choice | immigration-borders | 5 | 5 | - | a=political-community-boundary:-0.8; b=political-community-boundary:0.9; c=political-community-boundary:0.2; d=liberty-noninterference:0.8,political-community-boundary:0.4 | - | active |
| sq07 | core | statement-choice | environment-climate-growth | 4 | 4 | - | a=human-nature-priority:1; b=human-nature-priority:-1; c=human-nature-priority:0.5; d=human-nature-priority:-0.7 | - | active |
| sq13 | core | statement-choice | property-ownership | 9 | 9 | - | a=property-legitimacy:0.9,equality-theory:-0.4; b=property-legitimacy:-0.2,anti-domination:0.8; c=property-legitimacy:-0.5,equality-theory:0.4; d=property-legitimacy:-0.9,equality-theory:0.8,anti-domination:0.4 | - | active |
| sq15 | core | statement-choice | national-identity-sovereignty | 10 | 10 | - | a=political-community-boundary:0.6,moral-traditionalism:-0.3; b=political-community-boundary:-0.8,moral-traditionalism:0.7; c=political-community-boundary:-0.7,secularism-religious:0.9,moral-traditionalism:0.8; d=political-community-boundary:0.1,anti-domination:0.7,authority-legitimacy:-0.3 | - | active |
