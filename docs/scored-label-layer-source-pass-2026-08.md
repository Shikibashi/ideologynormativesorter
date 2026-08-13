# Scored-label layer-source pass — 2026-08

This pass closes the source-layer audit for every ordinary scored primary and
modifier label. The catalog now requires the combined source set for each
scored label to cover all five claim layers exposed by the UI:

- definition;
- boundary/caution;
- normative commitments or values;
- descriptive historical or institutional context; and
- prescriptive or strategic implications.

The coverage invariant is intentionally aggregate rather than per-source: a
primary text may document an ideology's self-description while a scholarly
source supplies historical context and cautions. Sources are not treated as
validation of numeric centroids.

## Repairs made

- Social Democrat now has a dedicated Oxford source for the normative case
  for social democracy, alongside the Routledge definition and historical
  distinction between reformist and replacement projects.
- Fascist Authoritarian now separates a scholarly fascism source from
  Mussolini's primary-text self-description. The primary text is explicitly
  marked as self-description, not endorsement or proof, and the scholarly
  source remains responsible for historical boundary work.
- Civic Nationalist now exposes the civic-patriotic normative and
  prescriptive claims while retaining a caution that civic criteria are not
  automatically inclusive or uncontested.
- Ethnonationalist now pairs its Oxford definition with research on the
  normative boundary problem of treating pre-political culture as political
  legitimacy. This does not imply that all ethnic nationalisms have one
  membership rule or policy program.
- Classical Liberalism, Social Liberalism, Libertarian Socialism, and
  Multiculturalism now expose descriptive context in addition to their
  existing definition, normative, prescriptive, and boundary coverage.
- Welfare Chauvinism now identifies the normative in-group allocation claim,
  while preserving distinctions from welfare ethnocentrism and generic
  opposition to welfare.
- Regionalism now pairs the Princeton taxonomy of regionalism with an Oxford
  study that separates preferences for self-rule from preferences for shared
  rule.
- Religious Nationalism now presents its fusion of religious and national
  identity as a normative political project while preserving variation in
  law, minority rights, state-building, influence, and violence.

## Research records

- [The Ethics of Social Democracy: Justice Meets Capitalism](https://academic.oup.com/book/62941)
- [The Political and Social Doctrine of Fascism](https://onlinelibrary.wiley.com/doi/10.1111/j.1467-923X.1933.tb02289.x)
- [From Constitutional to Civic Patriotism](https://www.cambridge.org/core/journals/british-journal-of-political-science/article/abs/from-constitutional-to-civic-patriotism/9C7723CE5D8DE5AF316783A224D1BB16)
- [On the Demos and Its Kin: Nationalism, Democracy, and the Boundary Problem](https://www.cambridge.org/core/journals/american-political-science-review/article/abs/on-the-demos-and-its-kin-nationalism-democracy-and-the-boundary-problem/BE8FA4B938813DF88441F306772037EC)
- [Multiculturalism](https://plato.stanford.edu/entries/multiculturalism/)
- [Welfare Chauvinism in Divided Societies](https://academic.oup.com/policyandsociety/article/45/3/343/8304391)
- [Dissecting Public Opinion on Regional Authority](https://academic.oup.com/publius/article/52/2/310/6352108)
- [Religious Nationalism and Religious Influence](https://academic.oup.com/edited-volume/62239/chapter-abstract/550810397)

The source-scope regression is in
`src/data/labelSources.test.ts`. It checks that the active primary and
modifier rosters do not silently expose a claim layer without a corresponding
source scope.
