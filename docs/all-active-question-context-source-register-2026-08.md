# Active-question context and source register

Date: 2026-08-11

## Coverage target

The effective public bank currently contains 285 active core questions. The respondent-facing specialist registry contains 8 feminist questions and 18 identity, nationalism, and sovereignty questions. This register covers all 311 active core and specialist items.

The older `src/data/moduleQuestions.ts` collection contains inert audit items from a removed module system. It is not presented by the application or specialist registry and is intentionally excluded from this coverage claim.

## What each item receives

Every target item receives:

- a versioned `contextNote` generated from its layer and domain;
- a substantive domain explanation distinguishing nearby constructs and common conflations;
- a layer boundary explaining whether the item concerns values, evidence, or strategy;
- at least one public source, normally two sources from the relevant scholarly or institutional source bundle.

Seven previously researched high-risk items retain bespoke notes: civic membership and assimilation (`q0222`, `q0225`, `q0415`, `q0417`) and religion/public law (`q0405`, `q0406`, `q0414`). Other items receive the same source discipline through domain-matched bundles so a source about one ideology is not presented as evidence for an unrelated question.

Descriptive `evidenceNote` values and their existing source arrays remain separate and unchanged. The new context layer explains how to read the construct; it does not operationalize a descriptive claim or alter scoring.

## Source bundles

### Authority, justice, and political economy

- [Authority](https://plato.stanford.edu/entries/authority/) and [Political Obligation](https://plato.stanford.edu/entries/political-obligation/) — legitimacy, coercion, obligation, and the right to rule.
- [Property and Ownership](https://plato.stanford.edu/entries/property/index.html) and [Distributive Justice](https://plato.stanford.edu/entries/justice-distributive/index.html) — ownership claims, distribution, and institutional justice.
- [Markets](https://plato.stanford.edu/entries/markets/) and [Socialism](https://plato.stanford.edu/archives/fall2025/entries/socialism/) — exchange, ownership, planning, information, and worker control.
- [Collective Bargaining and Labour Relations](https://www.ilo.org/topics-and-sectors/collective-bargaining-and-labour-relations) and the [ILO business and collective-bargaining helpdesk](https://www.ilo.org/resource/other/ilo-helpdesk-business-and-collective-bargaining) — labor organization and workplace bargaining.
- [Monetary Policy](https://www.federalreserve.gov/aboutthefed/fedexplained/monetary-policy.htm) — central-bank transmission, prices, employment, and financial conditions.
- [Intellectual Property](https://www.wipo.int/about-ip/en/) — exclusion, innovation, access, and creative or technical knowledge.

### Rights, membership, and institutions

- [International Covenant on Civil and Political Rights](https://2covenants.ohchr.org/About-ICCPR.html) and [Liberalism](https://plato.stanford.edu/entries/liberalism/) — expression, conscience, equality, due process, and limits on coercion.
- [Legal Punishment](https://plato.stanford.edu/entries/legal-punishment/) — deterrence, desert, proportionality, rehabilitation, and state punishment.
- [Immigration](https://plato.stanford.edu/archives/win2024/entries/immigration/) and the [1951 Refugee Convention](https://www.unhcr.org/about-unhcr/overview/1951-refugee-convention) — admission, membership, asylum, and non-refoulement.
- [Nationalism](https://plato.stanford.edu/entries/nationalism/) and [Multiculturalism](https://plato.stanford.edu/entries/multiculturalism/) — civic and inherited membership, accommodation, assimilation, and self-government.
- [Religion and Political Theory](https://plato.stanford.edu/entries/religion-politics/) and [Constitutional Interpretation and Constitutionalism in the Arab World](https://academic.oup.com/icon/article/11/3/615/789556) — state neutrality, religious authority, public justification, and constitutional design.
- [Feminist Political Philosophy](https://plato.stanford.edu/entries/feminism-political/) and [Feminist Ethics](https://plato.stanford.edu/entries/feminism-ethics/) — family, care, gendered power, autonomy, and structural inequality.

### Environment, external power, and change

- [Environmental Ethics](https://plato.stanford.edu/entries/ethics-environmental/) and the [IPCC Sixth Assessment Synthesis Report](https://www.ipcc.ch/report/ar6/syr/downloads/report/IPCC_AR6_SYR_FullVolume.pdf) — human and nonhuman value, limits, climate risk, mitigation, and distribution.
- [War](https://plato.stanford.edu/entries/war/) and the [United Nations Charter](https://www.un.org/en/about-us/un-charter/full-text) — force, sovereignty, self-defense, intervention, proportionality, and peace.
- [Democracy](https://plato.stanford.edu/entries/democracy/index.html) and [International IDEA’s Electoral Justice overview](https://www.idea.int/sites/default/files/publications/chapters/electoral-justice-handbook/electoral-justice-handbook-overview.pdf) — participation, representation, expertise, constitutional limits, and electoral remedies.
- [Ethics of Artificial Intelligence and Robotics](https://plato.stanford.edu/entries/ethics-ai/) and [NIST’s AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) — privacy, autonomy, bias, safety, accountability, and lifecycle governance.
- [Civil Disobedience](https://plato.stanford.edu/archives/fall2025/entries/civil-disobedience/) and [Revolution](https://plato.stanford.edu/entries/revolution/index.html) — reform, protest, resistance, organization, coercion, and political transformation.

## Implementation and review rules

The overlay in `src/data/questionContext.ts` is applied after the existing effective-bank review overlays and directly to both specialist module registries. It copies sources before attaching them, preserves descriptive evidence metadata, and contributes its version to the question-bank fingerprint. `RESEARCH_SCHEMA_VERSION` and both specialist module versions change because the presented instrument metadata changed.

All disclosures stay collapsed in the quiz UI and say that sources do not determine the respondent’s answer. The source catalog is a context aid, not a claim that every linked work endorses the item or validates its axis mapping. Future revisions should replace generic domain context with bespoke item context when a question is unusually contested, high-risk, or likely to be misunderstood.

## Validation contract

Coverage tests derive the target set from active effective core questions and both specialist modules. They require context, public HTTPS sources, and preserved prompt/layer/response/tier/axis/construct fields for every target. They also assert that the inert legacy module-question surface remains untouched and that existing descriptive evidence arrays remain exact.
