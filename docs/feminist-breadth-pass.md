# Feminist political-tradition breadth pass

This pass addresses a real breadth gap without weakening the taxonomy rule adopted in `ideology-taxonomy-v2.md`: a political tradition should not become a scored endpoint before the instrument measures the constructs that distinguish it.

## Why a specialist module first

The current catalog already contains Liberal Feminism and Anarcha-Feminism, but the main questionnaire does not directly measure several concepts needed to distinguish major feminist schools. In particular, the global axis model does not separately represent structural patriarchy, social reproduction, or specifically feminist anti-hierarchical strategy.

Adding Radical Feminism or Socialist/Marxist Feminism directly to the ordinary 35-label pool would therefore create false precision. Instead, `src/data/feministBreadth.ts` introduces a quarantined specialist instrument. It is not appended to the normal quiz tiers and the two new candidate labels are not added to the production ideology catalog.

## Specialist target set

The first module targets four broad, historically recognizable feminist political traditions:

1. **Liberal Feminism** — individual autonomy, equal citizenship, equal opportunity, anti-discrimination law, and institutional reform.
2. **Radical Feminism** — patriarchy and male dominance as a distinct structural system, with sexuality, reproduction, and family relations treated as central sites of political power.
3. **Socialist / Marxist Feminism** — the interaction of gender domination with class, property, paid labor, unpaid care, and social reproduction.
4. **Anarcha-Feminism** — patriarchy understood together with state and hierarchical domination, combined with decentralized and anti-authoritarian strategy.

At this stage Marxist and socialist feminism are intentionally represented by one family-level specialist endpoint. Scholarship distinguishes internal debates between them, but the current eight-item module does not justify another subdivision. If respondent data later demonstrates reliable separation, that split can be reconsidered.

## Module-specific constructs

The module uses four specialist constructs rather than adding new global political axes:

- `legal-equality-reform`: how strongly feminist politics is centered on individual rights, equal citizenship, and reform through liberal institutions;
- `structural-patriarchy`: whether male dominance is understood as a distinct structural system that persists beyond formally equal law;
- `class-social-reproduction`: how strongly gender domination is tied to class, ownership, paid work, unpaid care, and social reproduction;
- `anti-hierarchy-strategy`: whether durable state and centralized hierarchy are treated as vehicles for liberation or as structures feminism must ultimately dismantle.

Each construct is measured by multiple items. Every item also retains ordinary global-axis weights so it remains compatible with the repository's existing question/audit model, but specialist classification is calculated in the four-dimensional module space.

## Promotion quarantine

`radical-feminism` remains a candidate ID outside the production catalog. `socialist-feminism` is now a catalog specialist connected to this focused module, but tests require that it remain outside the primary scoring pool.

Promotion requires, in order:

1. stable module wording and expert/content review;
2. a real UI/scoring path for specialist modules;
3. respondent data sufficient for reliability and discriminant-validity analysis;
4. satisfactory recovery against independently authored profiles and real self-identification criteria;
5. only then, addition to `labels.ts` and `SPECIALIST_LABEL_IDS`.

This makes the direction of causality explicit: **measurement earns a label; adding a label does not create measurement**.

## Sources and conceptual basis

The module is based on broad distinctions used in feminist political philosophy rather than internet ideology taxonomies.

- Stanford Encyclopedia of Philosophy, _Feminist Political Philosophy_ — discusses liberal feminism's autonomy/equality tradition and radical feminism's focus on dominance/subordination and patriarchy: https://plato.stanford.edu/entries/feminism-political/
- Stanford Encyclopedia of Philosophy, _Feminist Perspectives on Class and Work_ — reviews the influential liberal/radical/Marxist/socialist classification and the materialist analysis of labor, household work, and economic dependence: https://plato.stanford.edu/entries/feminism-class/
- Stanford Encyclopedia of Philosophy, _Feminist Perspectives on Power_ — surveys socialist-feminist attempts to integrate class and patriarchy and the later social-reproduction tradition: https://plato.stanford.edu/entries/feminist-power/
- Stanford Encyclopedia of Philosophy, _Liberal Feminism_ — provides the more specific autonomy and equal-rights account used to anchor the liberal specialist prototype: https://plato.stanford.edu/entries/feminism-liberal/

## What this pass does not claim

The candidate centroids are theory-informed hypotheses for regression testing, not empirical population estimates. Passing synthetic archetype tests demonstrates internal separability of the proposed module; it does not establish psychometric validity. Those claims require respondent data.
