# Active-question context and source register

Date: 2026-08-13

## Coverage target

The effective public bank currently contains 338 active core questions (206 in the Balanced profile). The respondent-facing specialist registry contains 68 questions across the feminist, identity/sovereignty, anarchist, green, socialist, conservative, religious-national, technology-governance, and monarchist/municipal experimental modules. This register covers all 406 active core and specialist items.

The retired legacy faction-module corpus was removed from the source tree and validation inventory. The current specialist module registry is the only specialist question surface covered here; every module beyond the two focused breadth modules remains explicitly experimental and opt-in.

## What each item receives

Every target item receives:

- a versioned `contextNote` generated from its layer and domain;
- a substantive domain explanation distinguishing nearby constructs and common conflations;
- a layer boundary explaining whether the item concerns values, evidence, or strategy;
- at least one public source, normally two sources from the relevant scholarly or institutional source bundle.

Previously researched high-risk items retain bespoke notes: civic membership and assimilation (`q0222`, `q0225`, `q0415`, `q0417`), religion/public law (`q0405`, `q0406`, `q0414`), emergency-power persistence (`q0171`), and growth/throughput decoupling (`q0420`). Other items receive the same source discipline through domain-matched bundles so a source about one ideology is not presented as evidence for an unrelated question.

Descriptive `evidenceNote` values and their original claim-source records remain separate from neutral context notes. The `2026-08-descriptive-evidence-v5` overlay adds one triangulating academic or institutional source to each previously single-source active descriptive item; it does not rewrite prompts, operational evidence notes, or scoring. The new context layer explains how to read the construct; it does not operationalize a descriptive claim or alter scoring.

## Source bundles

### Authority, justice, and political economy

- [Authority](https://plato.stanford.edu/entries/authority/) and [Political Obligation](https://plato.stanford.edu/entries/political-obligation/) — legitimacy, coercion, obligation, and the right to rule.
- [Property and Ownership](https://plato.stanford.edu/entries/property/index.html) and [Distributive Justice](https://plato.stanford.edu/entries/justice-distributive/index.html) — ownership claims, distribution, and institutional justice.
- [The Impact of Zoning on Housing Affordability](https://www.nber.org/papers/w8835) — housing supply, land-use barriers, and the distinction between supply-side rules and demand-side assistance.
- [Markets](https://plato.stanford.edu/entries/markets/) and [Socialism](https://plato.stanford.edu/archives/fall2025/entries/socialism/) — exchange, ownership, planning, information, and worker control.
- [Collective Bargaining and Labour Relations](https://www.ilo.org/topics-and-sectors/collective-bargaining-and-labour-relations) and the [ILO business and collective-bargaining helpdesk](https://www.ilo.org/resource/other/ilo-helpdesk-business-and-collective-bargaining) — labor organization and workplace bargaining.
- [Monetary Policy](https://www.federalreserve.gov/aboutthefed/fedexplained/monetary-policy.htm) — central-bank transmission, prices, employment, and financial conditions.
- [Intellectual Property](https://www.wipo.int/about-ip/en/) — exclusion, innovation, access, and creative or technical knowledge.

### Rights, membership, and institutions

- [International Covenant on Civil and Political Rights](https://2covenants.ohchr.org/About-ICCPR.html) and [Liberalism](https://plato.stanford.edu/entries/liberalism/) — expression, conscience, equality, due process, and limits on coercion.
- [Emergency Powers](https://www.idea.int/publications/catalogue/emergency-powers) — declaration, renewal, termination, rights limits, checks, and the return to ordinary constitutional order.
- [Legal Punishment](https://plato.stanford.edu/entries/legal-punishment/) — deterrence, desert, proportionality, rehabilitation, and state punishment.
- [Immigration](https://plato.stanford.edu/archives/win2024/entries/immigration/) and the [1951 Refugee Convention](https://www.unhcr.org/about-unhcr/overview/1951-refugee-convention) — admission, membership, asylum, and non-refoulement.
- [Nationalism](https://plato.stanford.edu/entries/nationalism/) and [Multiculturalism](https://plato.stanford.edu/entries/multiculturalism/) — civic and inherited membership, accommodation, assimilation, and self-government.
- [Religion and Political Theory](https://plato.stanford.edu/entries/religion-politics/) and [Constitutional Interpretation and Constitutionalism in the Arab World](https://academic.oup.com/icon/article/11/3/615/789556) — state neutrality, religious authority, public justification, and constitutional design.
- [Feminist Political Philosophy](https://plato.stanford.edu/entries/feminism-political/) and [Feminist Ethics](https://plato.stanford.edu/entries/feminism-ethics/) — family, care, gendered power, autonomy, and structural inequality.

### Environment, external power, and change

- [Environmental Ethics](https://plato.stanford.edu/entries/ethics-environmental/) and the [IPCC Sixth Assessment Synthesis Report](https://www.ipcc.ch/report/ar6/syr/downloads/report/IPCC_AR6_SYR_FullVolume.pdf) — human and nonhuman value, limits, climate risk, mitigation, and distribution.
- [IPCC AR6 WGIII Chapter 2](https://www.ipcc.ch/report/ar6/wg3/chapter/chapter-2/) — relative and absolute decoupling, emissions accounting, time variation, rebound effects, and the limits of treating GDP growth as an environmental proxy.
- [War](https://plato.stanford.edu/entries/war/) and the [United Nations Charter](https://www.un.org/en/about-us/un-charter/full-text) — force, sovereignty, self-defense, intervention, proportionality, and peace.
- [Democracy](https://plato.stanford.edu/entries/democracy/index.html) and [International IDEA’s Electoral Justice overview](https://www.idea.int/sites/default/files/publications/chapters/electoral-justice-handbook/electoral-justice-handbook-overview.pdf) — participation, representation, expertise, constitutional limits, and electoral remedies.
- [Ethics of Artificial Intelligence and Robotics](https://plato.stanford.edu/entries/ethics-ai/) and [NIST’s AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) — privacy, autonomy, bias, safety, accountability, and lifecycle governance.
- [NIST SP 800-175B, Cryptographic Mechanisms](https://csrc.nist.gov/pubs/sp/800/175/b/r1/final) and [Decentralized Network Governance](https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2020.00012/full) — cryptographic security services, distributed networks, and the distinction between technical decentralization and political control.
- [Federalism](https://plato.stanford.edu/entries/federalism/) and [Democratic Confederalism](https://www.uplopen.com/books/m/10.1515/9783839472736) — shared rule, self-rule, delegated coordination, and the boundary between federal and confederal institutional designs.
- [Civil Disobedience](https://plato.stanford.edu/archives/fall2025/entries/civil-disobedience/) and [Revolution](https://plato.stanford.edu/entries/revolution/index.html) — reform, protest, resistance, organization, coercion, and political transformation.

## Implementation and review rules

The overlay in `src/data/questionContext.ts` is applied after the existing effective-bank review overlays and directly to the complete specialist module registry. It copies sources before attaching them, preserves descriptive evidence metadata, and contributes its version to the question-bank fingerprint. The ninth and tenth editorial passes add bespoke cross-domain notes for property/redistribution, housing/migration/labour, family/work, climate deployment, algorithmic administration, post-capitalist institutional design, religion/public-law justification versus institutional authority, emergency powers, and growth/impact decoupling. The fifteenth editorial pass adds source-scoped records for property categories, worker cooperatives, regulator accountability and appeals, government data access, and public-algorithm contestability; the sixteenth isolates referendum rights review from fiscal and anti-discrimination safeguards. The identity module's multiculturalism bundle is now split into language/cultural accommodation, conscience exemptions, and representation items; recognition and autonomous resurgence are separate constructs. Technology-governance items now distinguish expert delegation from algorithmic authority and cryptographic affordances from political decentralization; the monarchist/municipal item distinguishes confederal preference from descriptive coordination. The religious-national module now separately tests constitutional review, peaceful party competition, Islamic public-law framing, interpretive pluralism, Hindu civilizational belonging, and Jewish national self-determination. Context version `2026-08-question-context-v22` adds bespoke, source-matched records for all six active statement-choice items, including the property/markets distinctions in `sq02` and `sq13`; eleven previously quarantined statement items remain outside the effective bank and receive no public context overlay. Context version `2026-08-question-context-v23` adds a second bespoke pass for 21 foundational authority, property, and market questions (`q0001`, `q0003`–`q0006`, `q0021`–`q0026`, `q0034`, `q0035`, `q0038`, `q0039`, and `q0041`–`q0046`) with boundaries for exit, emergency authority, title, rectification, privilege, planning, and contestability. Context version `2026-08-question-context-v24` adds bespoke records for the next 42 active welfare, labor, land/housing, and money/banking questions; existing bespoke records for `q0075` and `q0123` remain source-matched and are counted separately. The new records distinguish normative standards from prescriptive instruments and descriptive mechanisms such as benefit cliffs, licensing, housing scarcity, land-value taxation, bank resolution, and monetary competition. These passes do not change prompts, options, or weights. `RESEARCH_SCHEMA_VERSION` changes because the presented core instrument metadata changed; the revised feminist breadth module is `2026-08-v5`, identity/sovereignty remains `2026-08-v4`, and the seven experimental waves are `2026-08-specialist-v6`.

Context version `2026-08-question-context-v25` adds bespoke records for 57 active rights, membership, religion/secularism, and family/gender questions. The pass distinguishes civil-liberty principles from their implementation, civic from inherited membership, self-government from incumbent sovereignty, religious exercise from religious establishment, and adult autonomy from child/dependent protection. It also gives the two remaining generic norm-change items (`q0478`, `q0479`) explicit boundaries about legal versus informal change.

Context version `2026-08-question-context-v26` adds bespoke records for 46 active environment, foreign-policy/war, democracy/constitutionalism, technology, and strategy questions. The pass distinguishes intergenerational and nonhuman standing from policy instruments, humanitarian concern from military control, expertise from authorization, technical affordances from political governance, and political ends from the means and transition used to pursue them. The four state-capacity and evidence items (`q0474`–`q0477`) retain their direct empirical sources while receiving separate construct-boundary records in the neutral context overlay.

Context version `2026-08-question-context-v27` adds bespoke records for the final 41 generic active core questions: state legitimacy, markets/planning, intellectual property, crime/justice, race/ethnicity, productive ownership, and land-value taxation. The pass distinguishes decentralization from fragmentation, discovery from laissez-faire, information copying from physical taking, punishment from repair and restraint, equal citizenship from cultural uniformity, and land rent from privately created improvements. It completes bespoke coverage for the active core bank without changing scored fields.

Context version `2026-08-question-context-v28` adds bespoke records for all 46 specialist-module questions that previously relied on domain fallback context. These records cover feminist, identity-sovereignty, anarchist-family, green-morphology, socialist-family, conservative-variant, religious-national, technology-governance, and monarchist-municipal items. They clarify specialist constructs without changing module assignment, evidence thresholds, experimental status, or ordinary primary scoring.

Context version `2026-08-question-context-v29` adds a care-work source and
updates the two highest-confidence specialist compound reviews: the feminist
item now isolates paid/unpaid labor organization, and the municipal/confederal
item isolates confederal coordination. The experimental roster is
`2026-08-specialist-v6`; earlier administrations remain versioned separately.

Context version `2026-08-question-context-v30` adds bespoke records for the
two active normative precision rewrites in the twenty-seventh editorial pass.
`q0085` now separates a general claim about legally restricted labor-market
entry or exit from the distinct mechanisms of occupational licensing,
immigration status, housing access, and employer power; its context cites the
[NBER occupational-licensing entry study](https://www.nber.org/papers/w25262),
the [ILO employment-relationship recommendation](https://www.ilo.org/resource/other/r198-employment-relationship-recommendation-2006),
and labour-rights context. `q0407` now tests direct worker governance rather
than combining ownership and governance; its context cites [Employee Governance
and the Ownership of the Firm](https://www.cambridge.org/core/journals/business-ethics-quarterly/article/abs/employee-governance-and-the-ownership-of-the-firm/F95BA42AF5F782A9BC16FC96FF6375F1)
alongside property and socialism sources. These records preserve the existing
layer, domain, response, and axis mappings; the sources clarify the constructs
and do not determine the respondent's normative answer.

Context version `2026-08-question-context-v31` adds source-matched records for
the twenty-eighth editorial pass. `q0081` now isolates freedom of association
and collective bargaining rather than bundling refusal, exit, competitive
entry, and property rules; it cites the [ILO freedom-of-association
overview](https://www.ilo.org/topics-and-sectors/freedom-association) and
collective-bargaining materials. `q0411` now isolates worker-council
governance of production rather than combining workplace and neighborhood
councils with transition strategy; it cites [Employee Governance and the
Ownership of the Firm](https://www.cambridge.org/core/journals/business-ethics-quarterly/article/abs/employee-governance-and-the-ownership-of-the-firm/F95BA42AF5F782A9BC16FC96FF6375F1)
and [Democratic Confederalism](https://www.uplopen.com/books/m/10.1515/9783839472736).
The records preserve the existing scored fields and state that sources provide
interpretive background rather than answers.

The six specialist descriptive items also receive operational evidence scopes in `src/data/specialistDescriptiveEvidence.ts`; those evidence records remain distinct from neutral context notes. The expert-administration item is intentionally prescriptive rather than descriptive because the revised wording measures an authority-allocation preference, not an unsupported general claim about institutional performance. The cryptography source is NIST SP 800-175B, which directly covers cryptographic mechanisms and security services rather than only listing standards.

All disclosures stay collapsed in the quiz UI and say that sources do not determine the respondent’s answer. The source catalog is a context aid, not a claim that every linked work endorses the item or validates its axis mapping. Future revisions should replace generic domain context with bespoke item context when a question is unusually contested, high-risk, or likely to be misunderstood.

## Validation contract

Coverage tests derive the target set from active effective core questions and the complete specialist module registry. They require context, public HTTPS sources, and preserved prompt/layer/response/tier/axis/construct fields for every target. They also assert that the retired legacy module-question surface remains absent and that existing descriptive evidence arrays remain exact.

## Current v33 specialist delta

Context version `2026-08-question-context-v33` adds a second, source-matched
religious-authority item (`fm-rn-11`) and sharpens the source bundle for
`fm-rn-2`. Together they separate final religious legal authority from private
faith, religious advocacy, establishment, statutory accommodation, and
pluralist religious-party competition. The item context uses [Oxford Research
Encyclopedia, “Secularism in Political
Philosophy”](https://academic.oup.com/edited-volume/62239/chapter-abstract/550724223),
alongside secularism and civil-political-rights sources. The experimental
specialist roster is now 68 items and versioned `2026-08-specialist-v10`;
Theocratic Politics has moved from ordinary modifier scoring to this
direct-evidence-only experimental comparison. Neither change alters ordinary
primary scoring or specialist assignment.
