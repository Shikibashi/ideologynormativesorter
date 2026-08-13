# Ideology research and measurement audit — 2026-08

This audit records the next accuracy gates after the taxonomy and editorial
passes. It separates claims that can be improved from published sources from
claims that require respondent data. A source can clarify a tradition or a
boundary; it cannot validate a centroid, a respondent identity, or a causal
claim about political outcomes.

## Completed source-fidelity fixes

- Cyberocracy now cites David Ronfeldt’s dedicated RAND paper, *Cyberocracy,
  Cyberspace, and Cyberology: Political Effects of the Information Revolution*,
  rather than using only the broader *Noopolitik* report.
- Zionism now includes separate Cambridge research records for the Revisionist
  and Labour currents. The public label remains a family-level, provisional
  specialist result rather than a synthetic claim about every Zionist current.
- Islamic Democratic Constitutionalism now has separate records for the
  Cambridge constitutionalism discussion, the Annual Review historical survey,
  and the Polity discussion of judicial review, constitutional rights, majority
  rule, and minority protection.
- Label source records now carry source-specific scope metadata. Descriptive
  scholarship is not displayed as if it directly establishes a label’s
  normative or prescriptive commitments.
- Narrow specialist source records were strengthened for Georgist
  libertarianism, minarchism, and anarcho-communism so the catalog does not
  rely only on broad libertarian or anarchist family baselines. Their source
  scopes now distinguish historical/definition evidence from normative and
  prescriptive interpretation.
- Dugin’s Fourth Political Theory now has separate primary-text and scholarly
  criticism records, so the self-description is not presented as if it were a
  neutral scholarly classification.
- The scored-label source pass now checks aggregate coverage of definition,
  boundary, normative, descriptive, and prescriptive claims for every active
  primary and modifier. Repairs cover social democracy, fascist self-description
  versus scholarship, civic and ethnic nationalism, multiculturalism, welfare
  chauvinism, regionalism, and religious nationalism. Details and exact source
  scopes are recorded in `docs/scored-label-layer-source-pass-2026-08.md`.
- National Conservatism, Liberal Conservatism / Conservative Liberalism, and
  Social Conservatism now have dedicated source records and claim-scoped
  mappings instead of relying only on the broad conservatism baseline. The
  bounded interpretation is recorded in
  `docs/conservative-variant-source-pass-2026-08.md`.
- Theocratic Politics, Eco-Authoritarianism, and Internationalism now have
  dedicated modifier sources rather than inheriting unrelated conservatism,
  nationalism, or liberalism baselines. Their bounded scopes are recorded in
  `docs/modifier-source-correction-pass-2026-08.md`.
- Market-Governance Liberalism / neoliberalism, Progressivism, Expansionist
  Nationalism, and Separatist Nationalism now have dedicated, bounded source
  records. The source limits and historical/case-specific caveats are recorded
  in `docs/liberal-progressive-nationalist-source-pass-2026-08.md`.
- The nationalism and religious-authority boundary pass further separates
  civic membership from ancestry, ethnic nationalism from primordialism,
  religious nationalism from theocracy, and fascism from generic
  authoritarianism. It also narrows `q0405` and `q0415` so their mappings do
  not combine religious authority with the ancestry/civic-membership contrast.
  See `docs/nationalism-religion-boundary-pass-2026-08.md`.
- The Integralism boundary correction removes Clerical Fascism from the
  Integralism subtype list, adds the clarifying alias Catholic Integralism,
  and adds Oxford source coverage. The correction preserves the distinction
  between Catholic integralism and historically specific clerical-fascist
  alliances. See `docs/integralism-boundary-correction-2026-08.md`.
- The Juche and National Bolshevism boundary correction narrows Juche from
  potentially autarkic “economic self-sufficiency” to state-directed
  self-reliance and bounds National Bolshevism to its post-Soviet reference
  case while recording historical variation. Cambridge and Oxford source
  coverage now backs the Juche definition and boundary. See
  `docs/juche-national-bolshevism-boundary-correction-2026-08.md`.

- The macro/meso/micro/nano scale pass now distinguishes an ideology as a
  doctrine or social order, its movement and institutional carriers, and the
  respondent-level uptake estimated by the quiz. It records the academic
  four-level proposal in which nano is a method-sensitive sublevel inside
  micro, rather than inventing standalone nano ideology labels. The versioned
  registry and source boundary are recorded in
  `docs/ideology-analytical-scales.md`.
- The specialist question-precision pass narrows `fm-fem-5` to the
  organization of paid and unpaid labor and `fm-mm-4` to confederal
  coordination. Both prompts remain prescriptive and keep their construct
  mappings; the change removes multiple institutional requirements from one
  response. It is versioned as `2026-08-specialist-v7` and
  `2026-08-question-context-v29` in
  `docs/specialist-question-precision-pass-2026-08.md`.

- The twenty-seventh editorial pass narrows two remaining active normative
  prompts: `q0085` now tests legally restricted entry or exit as a possible
  source of labor-market coercion without bundling licensing, immigration, and
  zoning, while `q0407` isolates direct worker governance from ownership form.
  The corresponding context/source records are versioned as
  `2026-08-question-context-v30`; the editorial overlay is
  `2026-08-editorial-v27`. The NBER licensing literature and Cambridge work on
  employee governance are used as boundary sources, not as answers to the
  normative items.

- The twenty-eighth editorial pass narrows `q0081` to freedom of association
  and collective bargaining, and `q0411` to worker-council governance of
  production. Their earlier prompts bundled refusal, exit, competitive entry,
  neighborhood governance, and transition strategy. The rewrites are
  versioned as `2026-08-editorial-v28` with context/source metadata at
  `2026-08-question-context-v31`; the ILO, Cambridge, and University Press
  Library Open sources are boundary sources rather than normative answers.

## Current interpretation after source review

| Label or family | Evidence-supported interpretation | Measurement consequence |
| --- | --- | --- |
| Hindutva | A contested political Hindu-nationalist discourse distinct from Hinduism, with multiple scholarly definitions and formulations ranging from moderate to extremist. | Keep the label provisional; separate civilizational identity, majority/state congruence, minority citizenship, and party strategy before any promotion. |
| Zionism | A historically changing family of Jewish national self-determination projects with distinct Labour, Revisionist, religious, liberal, and other currents. | Do not read the family centroid as a single border, state, religious, or minority-rights program. |
| Islamic democratic constitutionalism | A family of arrangements differing over whether Islam limits government, grounds constitutional law, or is included within a limited constitutional order; judicial review and minority rights are separate institutional questions. | Preserve the opt-in module and abstention behavior until subtype separation and criterion validity are tested. |
| Accelerationism | A family whose left, right, unconditional, and technology-centered uses can diverge sharply. | Keep the public label provisional; the technology module now tests market intensification versus post-capitalist redirection before any subtype interpretation. |
| Cyberocracy | An early, future-oriented concept of information-organized or cybercratic government, not a settled ideology or synonym for digital democracy. | Keep it context-only in ordinary scoring and experimental in the technology module. |
| Dugin’s Fourth Political Theory | Dugin’s own proposed framework must be displayed separately from scholarly criticism that treats it as an ideological repackaging of older reactionary or fascist materials. | Keep author-specific naming, self-description, and criticism distinct. |

## Tests now in place

- Source tests verify source IDs, URLs, claim scopes, and the dedicated
  cyberocracy source.
- Across the editorial passes through v18, all 34 live core descriptive items
  now have operational scope and public sources; v17 narrowed twelve items
  and v18 narrowed five more where the source supported a mechanism or
  institutional pattern but not a universal or motive-imputing claim.
- The eighteenth editorial pass further narrows five of those live items
  where occupational licensing, zoning, monetary transmission, regulatory
  information, or financial-entry evidence was mixed or conditional.
- The nineteenth editorial pass narrows the last two compound-looking
  descriptive prompts (`q0027` and `q0308`) by separating empirical mechanisms
  from distributional outcomes and methodological instructions.
- The twentieth editorial pass further scopes `q0007`, `q0067`, `q0107`, and
  `q0328` to their named empirical populations and outcomes, and separates
  anticipatory self-defense from unrestricted preventive force in `q0402`.
  `q0425` receives a bespoke context record distinguishing hereditary office
  from the separate claims of consent, constitutional limitation, competence,
  and continuity. Details and source links are recorded in
  `docs/editorial-twentieth-pass-2026-08.md`.
- The twenty-first editorial pass refines the prescriptive bank items on bank
  resolution (`q0135`), alternative currencies (`q0136`), and climate
  technology versus consumption limits (`q0318`). It replaces inaccurate or
  loaded shorthand with the claims hierarchy, payment-risk boundaries, and
  decoupling distinctions supported by official sources. Details and source
  links are recorded in `docs/editorial-twenty-first-pass-2026-08.md`.
- The twenty-second editorial pass refines six high-density items: housing
  supply/subsidy sequencing (`q0114`), financial-service entry safeguards
  (`q0123`), creator attribution versus downstream control (`q0142`), patent
  exclusivity versus remedies (`q0154`), interoperability versus exclusionary
  enforcement (`q0158`), and immigration-status enforcement versus serious
  criminal conduct (`q0217`). Details and source links are recorded in
  `docs/editorial-twenty-second-pass-2026-08.md`.
- The third confidence-coverage pass adds paired, single-axis descriptive items
  for state-capacity confidence, expert confidence, and cultural plasticity.
  Each item has an operational evidence note, a confidence prompt, and two
  academic sources; it raises those axes from the limited to the moderate
  answer-coverage band in the balanced profile without changing the
  reliability interpretation into a psychometric claim.
- The fifth descriptive-evidence pass adds a second, source-scoped record to
  all 40 active core descriptive items that previously had only one public
  source. The additions triangulate mechanisms or boundaries and preserve the
  original evidence note and first claim source; they do not validate
  centroids or turn source count into reliability evidence. Details and links
  are recorded in `docs/descriptive-evidence-fifth-pass-2026-08.md`.
- The specialist label source pass audits accelerationism, Hindutva, Zionism,
  Islamic democratic constitutionalism, cyberocracy, and techno-anarchism. It
  adds comparative sources for accelerationism, economic/state variation for
  Hindutva, and crypto-anarchist governance for techno-anarchism; the other
  three already had appropriately bounded multi-source coverage. None is
  promoted into ordinary scoring. Details and remaining respondent-validity
  gates are recorded in `docs/specialist-label-source-pass-2026-08.md`.
- Specialist simulations verify that construct-matched synthetic personas can
  separate Islamic democratic constitutionalism from Hindutva, and cyberocracy
  from techno-anarchism, and left from right accelerationist directions, while
  every match remains explicitly experimental.
- Existing abstention tests continue to require insufficient evidence when a
  module is unanswered or sparsely answered.

## Remaining research gates

1. Recruit and preregister respondent data for test–retest reliability,
   construct coverage, criterion validity, subgroup fairness, and measurement
   invariance for every experimental module.
2. Run cognitive interviews on the highest-risk compound or theory-loaded
   questions before changing weights. Automated conjunction detection is only a
   review queue, not evidence that an item is invalid.
3. Compare specialist candidates against self-description and external
   criteria without treating either as a gold standard. The module must be
   allowed to return insufficient evidence or a multi-affinity profile.
4. Re-run the current mapping/separability audit after any centroid change and
   check the nearest-neighbor boundary items, not only top-label accuracy.
5. Run an isolated browser smoke test and the configured production workflow
   after the next reviewed commit. Local tests and a local Vite page do not
   prove that the live deployment exposes this source and taxonomy version.
6. The specialist modules still have provisional construct coverage. Their
   evidence gate is a response-coverage gate, not a reliability or validity
   finding; respondent data are still required before promotion.
7. Source-layer completeness is now a passing catalog invariant, but it is
   still interpretive documentation rather than empirical validation of the
   scoring model. Human review should specifically inspect the new primary
   fascist source, the boundaries between civic and ethnic nationalism, and
   the difference between regional self-rule and shared rule.
8. Family baselines remain attached to scored labels for orientation, but they
   now support only definition and boundary claims unless a source is also an
   explicit label record. Direct label sources carry the reviewed layer scopes;
   the source tests reject inherited family scholarship as subtype-specific
   normative, descriptive, or prescriptive evidence. This is a provenance
   safeguard, not empirical validation of the scoring model; future passes can
   still add stronger direct sources where a displayed layer claim warrants it.

9. The analytical scale registry is a conceptual unit-of-analysis aid, not a
   psychometric scale. `micro` on active primary and modifier entries means
   respondent-level uptake of broader ideological claims; it does not establish
   a micro ideology or a nano-level commitment. Provisional specialists require
   an opt-in module result before any respondent-level estimate is shown. The
   nano distinction requires methods suited to personally adapted or
   sub-individual processes and is not inferred from one questionnaire response.

10. The scored-label context pass adds complementary usage and caution notes
    for 21 high-confusion public labels. These notes make internal variation,
    host-ideology dependence, and institutional boundaries visible without
    changing centroids or promoting provisional specialists. The exact label
    list, source basis, and regression test are recorded in
    `docs/scored-label-context-pass-2026-08.md`.

## Research references

- RAND, [*Cyberocracy, Cyberspace, and Cyberology*](https://www.rand.org/pubs/papers/P7745.html).
- Oxford University Press, [*Hindutva, Hindu Organizations, and the Hindu Diasporas*](https://academic.oup.com/book/47098/chapter-abstract/416165265).
- Cambridge University Press, [*Jabotinsky and the Revisionist tradition*](https://www.cambridge.org/core/books/abs/zionism-and-the-foundations-of-israeli-diplomacy/jabotinsky-and-the-revisionist-tradition/FEC78FE517D6D846BBB4F7997C436517).
- Cambridge University Press, [*In the Name of Socialism: Zionism and European Social Democracy in the Inter-War Years*](https://www.cambridge.org/core/journals/international-review-of-social-history/article/in-the-name-of-socialism-zionism-and-european-social-democracy-in-the-interwar-years/8B3D3F22827E7E6D8B2963870C68E09E).
- Annual Review, [*Islamic Constitutionalism*](https://www.annualreviews.org/content/journals/10.1146/annurev.lawsocsci.3.081806.112753).
- Tezcür, [*Constitutionalism, judiciary, and democracy in Islamic societies*](https://asu.elsevierpure.com/en/publications/constitutionalism-judiciary-and-democracy-in-islamic-societies/).
- Cambridge University Press, [*From Islamists to Muslim Democrats: The Case of Tunisia’s Ennahda*](https://www.cambridge.org/core/journals/american-political-science-review/article/abs/from-islamists-to-muslim-democrats-the-case-of-tunisias-ennahda/C0D3D82CA222E3C28B108B28ED5A4DD4).
- Taylor & Francis, [*Editorial Introduction: Accelerationism and the Left*](https://www.tandfonline.com/doi/full/10.1080/0969725X.2019.1568729).
- Springer Nature, [*Old wine in a postmodern bottle: Aleksandr Dugin’s “Fourth political theory”*](https://link.springer.com/article/10.1007/s11212-025-09703-3).
- Oxford University Press, [*The Ethics of Social Democracy: Justice Meets Capitalism*](https://academic.oup.com/book/62941).
- Wiley, [*The Political and Social Doctrine of Fascism*](https://onlinelibrary.wiley.com/doi/10.1111/j.1467-923X.1933.tb02289.x).
- Cambridge University Press, [*From Constitutional to Civic Patriotism*](https://www.cambridge.org/core/journals/british-journal-of-political-science/article/abs/from-constitutional-to-civic-patriotism/9C7723CE5D8DE5AF316783A224D1BB16).
- Cambridge University Press, [*On the Demos and Its Kin: Nationalism, Democracy, and the Boundary Problem*](https://www.cambridge.org/core/journals/american-political-science-review/article/abs/on-the-demos-and-its-kin-nationalism-democracy-and-the-boundary-problem/BE8FA4B938813DF88441F306772037EC).
- Oxford University Press, [*Welfare Chauvinism in Divided Societies*](https://academic.oup.com/policyandsociety/article/45/3/343/8304391).
- Oxford University Press, [*Dissecting Public Opinion on Regional Authority*](https://academic.oup.com/publius/article/52/2/310/6352108).
- Humphrey, Laycock, and Umbach, [*Introduction*](https://doi.org/10.1080/13569317.2019.1589961), on macro, meso, and micro ideological discourse.
- Ylikoski, [*Getting lost with levels: the sociological micro-macro problem*](https://link.springer.com/article/10.1007/s11229-024-04841-3), on context-dependent levels of analysis.
- Maynard, [*Ideological and Non-Ideological: The Levels of Analysis Problem*](https://doi.org/10.4324/9781003412007-3), on the proposed macro/meso/micro/nano analytic matrix.
