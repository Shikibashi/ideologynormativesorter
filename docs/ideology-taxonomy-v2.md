# Ideology taxonomy v2

This document defines which catalog entries are allowed to become ordinary user-facing ideology results and which entries require a different role.

## Principle

Catalog breadth and scoring precision are different problems. The repository may retain a broad historical and research catalog, but the ordinary questionnaire should return only labels that are both meaningful political traditions and supported by the active measurement model.

A label should not become a primary endpoint merely because a centroid can be written for it.

## Roles

### Primary

A durable, reasonably self-contained political tradition that can organize positions across multiple political domains and is sufficiently distinguishable in the active questionnaire. Primary labels are the only labels returned directly by the ordinary scoring path.

### Specialist

A real but narrower school, tendency, or historically specific subtype. Specialists are preserved for fine-grained follow-up classification and must be attached to a substantive depth module before promotion to a specialist result.

Examples include Maoism, Trotskyism, Agorism, Objectivism, Anarcho-Syndicalism, Integralism, and Paleoconservatism.

### Modifier

A thin or cross-cutting ideological component that normally combines with a broader host tradition rather than replacing it.

Examples include left- and right-wing populism, anti-imperialism, fiscal conservatism, internationalism, and welfare chauvinism.

Populism is a useful model for this distinction: contemporary political-science literature commonly analyzes it as a thin-centered ideology whose political content depends partly on a host ideology.

### Context

A policy proposal, governance mechanism, speculative future concept, or analytical current that may describe an important part of a person's politics but should not be presented as the person's primary ideology.

Examples include Universal Basic Income Advocacy, Liquid Democracy, Dataism, Singularitarianism, and Radical Centrism.

### Retired

A legacy synthetic or repo-specific composite retained only for data compatibility, audit history, or old links. Retired labels are not user-facing scoring or browsing endpoints.

## Promotion criteria

A new primary ideology should satisfy all of the following:

1. **Tradition:** It has a recognizable intellectual or political tradition beyond a single policy, tactic, slogan, internet micro-label, or temporary coalition.
2. **Breadth:** Its core concepts imply positions across more than one policy domain.
3. **Construct coverage:** The questionnaire measures the concepts that distinguish it from its nearest neighbors.
4. **Separability:** It passes primary-space centroid and prototype non-regression gates.
5. **Semantic recovery:** Independently hand-authored profiles representing the tradition keep the intended label in the top result neighborhood.
6. **Evidence:** Definitions and distinctions are supported by appropriate political-theory or scholarly sources.

A label that satisfies (1) and (2) but not (3)-(5) should remain specialist or backlog rather than being promoted prematurely.

## Current non-regression gates

The primary pool is intentionally tested at several levels:

- all primary centroids must remain at least 0.35 apart in Euclidean axis space;
- every primary label's declared prototype must remain in its own top five;
- at least 85% of primary prototypes must remain in their own top three;
- at least 65% must remain rank one;
- the strongest three axis distinctions between every primary label and its nearest primary neighbor must each be measured by at least two active questions;
- a separate hand-authored archetype battery must recover its intended primary labels in the top five.

These are internal non-regression criteria, not empirical validity claims. Respondent-grounded validation remains a separate research requirement.

## Fine-graining strategy

Do not solve close-label collisions by putting every subtype into the ordinary result pool or by endlessly adding general questions. Use a two-stage model:

1. classify the broad primary ideological neighborhood with the main questionnaire;
2. run a targeted family/depth module when a user wants a narrower subtype.

The repository already contains depth modules for anarchist, market, left, green, authoritarian, religious, nationalist, right, and Georgist families. Specialist labels are mapped to these modules in `src/data/labelTaxonomy.ts`.

## Breadth backlog

The present catalog should not be treated as complete merely because it is large. Breadth gaps must be added only together with construct coverage.

### Feminist political traditions

The current main bank has no explicit patriarchy/gender-power construct coverage. Political-theory literature distinguishes liberal, radical, Marxist, and socialist feminist traditions, among later developments. Liberal feminism is already represented in the catalog, but adding radical or socialist feminism as scored endpoints before adding relevant measurement content would create false precision.

Recommended next work:

- design a feminist depth module with items that distinguish autonomy/equal-rights liberal feminism, structural patriarchy-centered radical feminism, and class/materialist socialist or Marxist feminism;
- decide whether this requires a dedicated gender-power construct or whether a validated module can discriminate these traditions through existing anti-domination, equality, property, cultural-plasticity, reform/revolution, and strategy axes;
- add candidate labels only after the module and independent archetypes exist.

### Other future candidates

Treat other proposed additions the same way: first establish that they are durable political traditions, then identify what the current instrument does not measure, add discriminating items, and only then promote them. Do not add labels merely to increase the catalog count.

## Sources

- Stanford Encyclopedia of Philosophy, “Feminist Political Philosophy,” https://plato.stanford.edu/entries/feminism-political/
- Stanford Encyclopedia of Philosophy, “Feminist Perspectives on Class and Work,” https://plato.stanford.edu/entries/feminism-class/
- Cas Mudde's thin-centered account of populism is surveyed and tested throughout contemporary populism research; see, for example, Cambridge Core discussions of populism and host ideologies: https://www.cambridge.org/core/journals/journal-of-experimental-political-science/article/populism-and-candidate-support-in-the-us-the-effects-of-thin-and-host-ideology/315C0660F29FBEC870D11DC73E6328D7
