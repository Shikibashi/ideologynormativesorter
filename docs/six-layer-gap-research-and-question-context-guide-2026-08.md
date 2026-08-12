# Six ideology-layer gaps and question context guide

Date: 2026-08-11

## Scope

This pass closes the six remaining user-visible curated-summary fallbacks:

- normative: Corporatism, Kemalism, Fiscal Conservatism
- prescriptive: Ethnonationalism, Islamic Democracy, Fourth Political Theory

The copy is layer-specific and qualified. It does not change question prompts, axis weights, response scales, tier membership, eligibility, scoring, or the label catalogue.

## Layer decisions and source basis

### Corporatism — normative

The summary treats organized occupational representation, social harmony, and coordinated public direction as political goods. It explicitly scopes the claim to state corporatism and avoids treating it as equivalent to autonomous societal or neo-corporatist bargaining. This distinction is supported by Ming-Sho Ho’s overview of state corporatism and the state’s role in organizing exclusive representative associations, alongside the existing comparative treatment in the project’s state-corporatism guide.

Source: [Ming-Sho Ho, “State Corporatism”](https://doi.org/10.1002/9781118663202.wberen366)

### Kemalism — normative

The summary identifies republican sovereignty, secular public authority, national unity, scientific modernization, and state-led reform as the relevant goods, while leaving citizenship, pluralism, and state reach open to variation. The Six Arrows are treated as a historical program rather than as proof of one contemporary policy package.

Source: [“Turkish Conservative Modernism: Birth of a Nationalist Quest for Cultural Renewal”](https://www.cambridge.org/core/journals/international-journal-of-middle-east-studies/article/abs/turkish-conservative-modernism-birth-of-a-nationalist-quest-for-cultural-renewal/72A93098038B9EC1D959659C08D0EAEB)

### Fiscal Conservatism — normative

The summary frames sustainable public finances, debt or deficit restraint, and fairness between present and future taxpayers as values. It does not infer a single tax rate, spending baseline, social-insurance model, or fiscal rule. This matters because the label contains internal disputes over both means and the measurement of fiscal burdens.

Sources: [Fiscal Conservatism](https://sk.sagepub.com/ency/edvol/embed/the-encyclopedia-of-political-science/chpt/fiscal-conservatism); [Auerbach, Gokhale, and Kotlikoff, “Generational Accounting: A Meaningful Way to Evaluate Fiscal Policy”](https://doi.org/10.1257/jep.8.1.73)

### Ethnonationalism — prescriptive

The summary describes a family of possible strategies for protecting an inherited ethnic or cultural nation, from preferential membership rules or assimilation through autonomy or separation. It intentionally does not collapse the label into one territorial outcome or one coercive program. The [Stanford Encyclopedia of Philosophy overview of nationalism](https://plato.stanford.edu/entries/nationalism/) distinguishes national self-determination from a necessary claim to one independent state, while Connor’s entry defines ethnonational identity through a perceived common ancestry.

### Islamic Democracy — prescriptive

The summary treats electoral accountability and an Islamic ethical or legal framework as a contested institutional-design combination. It names interpretation, judicial authority, popular sovereignty, minority rights, and enforcement as open questions rather than presenting “Sharia” as one administrative model.

Source: [Lombardi, “Constitutional Interpretation and Constitutionalism in the Arab World”](https://academic.oup.com/icon/article/11/3/615/789556)

### Fourth Political Theory — prescriptive

The summary attributes the post-liberal, multipolar, civilizational proposal to the author-specific Fourth Theory project, rather than presenting it as a settled ideology with one institutional blueprint. The [primary project statement](https://www.4pt.su/en/content/fourth-political-theory) is paired with [Backman’s scholarly analysis](https://doi.org/10.3389/fpos.2022.941799), which situates the proposal as a radical-conservative, pluralistic geopolitical project opposed to liberal universalism.

## Question context architecture

Question-level context is now versioned in `src/data/questionContext.ts` and applied as an effective-bank overlay. It adds an optional `contextNote` and reuses the existing public `sources` shape. The overlay is metadata-only: it does not mutate prompts, layer assignments, response options, axis weights, or scoring.

`evidenceNote` remains descriptive-only. It records operational scope or empirical boundaries and continues to support the methodology guarantee that active descriptive items have an evidence note and public sources. `contextNote` may accompany normative or prescriptive items when a source helps clarify a contested term or institutional distinction. All source disclosures remain collapsed and explicitly state that sources do not determine the respondent’s answer.

The research item map now carries `contextNote` so exported instrument metadata preserves the exact context shown to contributors. The bank version includes the overlay version for reproducibility.

## Initial context pilot

The first pilot covers seven existing core questions:

- civic membership, coercive assimilation, immigration/cultural continuity, and civic nationhood (`q0222`, `q0225`, `q0415`, `q0417`)
- religion, public-law justification, and civil-law hierarchy (`q0405`, `q0406`, `q0414`)

No direct corporatist or Fourth Theory scored question was found in the current core bank, and no fiscal-conservatism-specific item was suitable for a source attachment in this pass. Adding those would require new question IDs, semantic review, cognitive pretesting, and a later bank version rather than borrowing an unrelated prompt.

## Expansion protocol

Future batches should proceed by construct family: identity and nationalism; religion and constitutionalism; fiscal and economic governance; state organization and corporatism; then foreign policy and civilizational strategy. Each batch should use neutral, layer-matched context, pair partisan primary material with scholarly analysis where relevant, validate every link, and run cognitive/pretest review before broadening the public bank. Questionnaire wording, preceding context, and item order can affect responses, so context additions must remain disclosed, versioned, and experimentally reviewable.

Method guidance: [Pew Research Center, Writing Survey Questions](https://www.pewresearch.org/writing-survey-questions/); [AAPOR Best Practices](https://aapor.org/standards-and-ethics/best-practices/); [AAPOR Disclosure Standards](https://aapor.org/standards-and-ethics/disclosure-standards/).
