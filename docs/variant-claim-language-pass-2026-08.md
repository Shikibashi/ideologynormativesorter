# Variant claim-language pass — August 2026

This pass corrected seven over-absolute phrases in ideology descriptions and
philosophy-influence summaries. It does not change label IDs, roles, centroids,
axis weights, or score thresholds.

## Corrections

- Agorism now describes counter-economics as its primary emphasis rather than
  saying that every agorist rejects electoral politics entirely. The wording
  also distinguishes a strategic aim from a demonstrated outcome.
- Minarchism now identifies the minimal rights-protecting state as the common
  anchor while leaving room for disagreement about public goods, infrastructure,
  and the boundary of legitimate protection.
- Anarcho-capitalism and agorism now use strong rather than absolute
  self-ownership and property language.
- Individualist anarchism and queer anarchism now describe a radical critique of
  coercive authority or hierarchy without asserting that every variant has the
  same total rejection formula.
- Stirnerism now refers to criticism of fixed ideas and imposed authority
  rather than claiming that the unique individual rejects all external
  constraints.

## Research basis

The Stanford Encyclopedia of Philosophy describes anarchism as a diverse family
united by a general critique of centralized or hierarchical power, while also
noting that not every anarchist shares the same focus or entails the same
political action. That supports qualified family-level language rather than
universal claims:

- [Stanford Encyclopedia of Philosophy — Anarchism](https://plato.stanford.edu/entries/anarchism/)

The minarchism wording is aligned with the libertarian state literature’s
distinction between a minimal rights-protecting state and disputes about
redistribution, public goods, infrastructure, and the scope of legitimate
enforcement:

- [Cambridge Core — Libertarianism and the State](https://www.cambridge.org/core/journals/social-philosophy-and-policy/article/libertarianism-and-the-state/A472942FA3426AF3C0616AE7F2B5433C)

The Stirner wording follows the project’s cited Cambridge research record on
radical egoism and critique of fixed ideas, while avoiding a claim that all
external constraints are rejected in one uniform sense:

- [Cambridge Core — Egoism and Class Consciousness, or: Why Marx and Engels Wrote So Much About Stirner](https://www.cambridge.org/core/journals/hegel-bulletin/article/abs/egoism-and-class-consciousness-or-why-marx-and-engels-wrote-so-much-about-stirner/B4DA312DB8525A88B33DFAE923DB487D)

Agorism remains tied to Konkin’s primary text for its own counter-economic
strategy; that source is not treated as proof that the strategy produces a
particular social outcome:

- [Konkin — The New Libertarian Manifesto](https://agorism.eu.org/docs/NewLibertarianManifesto.pdf)

## Validation

`truthfulnessAccuracy.test.ts` now guards the corrected boundaries and prevents
the removed absolute phrases from returning. Existing label-source tests still
verify scoped definition, boundary, and layer records for active scored labels.
