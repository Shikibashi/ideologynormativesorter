# Scored-label context pass — 2026-08

This pass completes the complementary scope-and-boundary notes for 21 active
scored labels that already had one bespoke clarification but were still easy
to overread. The changes are editorial metadata only: they do not change
label centroids, role assignments, question weights, or respondent scoring.

## Labels covered

| Family | Labels | Main boundary made explicit |
| --- | --- | --- |
| Religious authority | Theocratic Politics; Religious Nationalism | Religious influence, religious-national identity, and controlling religious authority are distinct institutional claims. |
| National membership and sovereignty | Ethnonationalist; Left-Wing Nationalism; National Conservatism; Expansionist Nationalism; Separatist Nationalism | Ethnic membership, anti-colonial self-determination, cultural continuity, territorial expansion, and secession are not interchangeable. |
| Liberal and republican traditions | Classical Liberalism; Market-Governance Liberalism (Neoliberalism); Communitarianism; Republicanism; Liberal Conservatism; Internationalism | Historically variable families do not imply one state size, economic program, party identity, or foreign-policy package. |
| Populism and democracy | Right-Wing Populism; Left-Wing Populism; Radical Democracy | Thin populist host ideologies and plural radical-democratic traditions are not complete programs or synonymous with one institutional design. |
| Pluralism and ecology | Multiculturalism; Eco-Authoritarianism; Progressivism | Recognition, ecological authority, and reform orientation each leave important questions about rights, coercion, expertise, and implementation open. |
| Fiscal and social conservatism | Fiscal Conservatism; Social Conservatism | Fiscal restraint is not “small government,” and moral traditionalism does not determine religion, economics, nationalism, or enforcement strategy. |

## Research basis

The notes use the existing claim-scoped source records in
`src/data/labelSources.ts`. The main academic boundary checks were:

- The Stanford Encyclopedia of Philosophy treats liberalism as internally
  divided, describes classical liberalism as a spectrum that can allow public
  goods and a modest social minimum, and distinguishes republican liberty from
  ordinary non-interference.
- The SEP entries on communitarianism, republicanism, nationalism, and
  multiculturalism support family-level treatment and warn against collapsing
  community, civic membership, non-domination, ethnicity, and group
  accommodation into one policy package.
- Oxford’s neoliberalism record supports treating the term as contested across
  ideology, policy project, and governance; the catalog therefore uses the
  narrower public name “Market-Governance Liberalism.”
- SAGE’s social-conservatism record distinguishes the moral and cultural
  orientation from its particularly Christian-right U.S. expression.
- Cambridge records support the historical variability of progressivism, the
  thin people-versus-elite core of populism, the institutional contingency of
  environmental governance, and variation among sub-state nationalist
  movements.
- The catalog’s fiscal-conservatism source is used for a bounded fiscal
  orientation, not as evidence for a universal small-state doctrine.

This research improves construct description and user interpretation. It does
not establish psychometric validity of any centroid or prove that a respondent
matches a historical ideology. Specialist labels remain provisional and
context-only entries remain non-scored.

## Regression coverage

`src/data/truthfulnessAccuracy.test.ts` now requires every label in this pass
to expose both a usage note and a caution note longer than 30 characters.
Existing source tests continue to require definition, boundary, and
layer-scoped source records for active scored labels.

## Source register

- [Stanford Encyclopedia of Philosophy — Liberalism](https://plato.stanford.edu/entries/liberalism/)
- [Stanford Encyclopedia of Philosophy — Communitarianism](https://plato.stanford.edu/entries/communitarianism/)
- [Stanford Encyclopedia of Philosophy — Republicanism](https://plato.stanford.edu/entries/republicanism/)
- [Stanford Encyclopedia of Philosophy — Nationalism](https://plato.stanford.edu/entries/nationalism/)
- [Stanford Encyclopedia of Philosophy — Multiculturalism](https://plato.stanford.edu/entries/multiculturalism/)
- [SAGE — Social Conservatism](https://sk.sagepub.com/ency/edvol/embed/the-encyclopedia-of-political-science/chpt/social-conservatism)
- [Cambridge Core — The Bases of Progressivism within the Major Parties](https://www.cambridge.org/core/journals/social-science-history/article/abs/bases-of-progressivism-within-the-major-parties/9F4E5915519D82957598AB084E08BA94)
- [Cambridge Core — Democracy, Autocracy, and Everything in Between](https://www.cambridge.org/core/journals/british-journal-of-political-science/article/abs/democracy-autocracy-and-everything-in-between-how-domestic-institutions-affect-environmental-protection/919F89325DCF95477795D0539F89C26C)
- [Cambridge University Press — Imperial Nationalism](https://www.cambridge.org/core/books/abs/russias-war-on-ukraine/imperial-nationalism/5B79DD19FDC5055D522B461AD44C7B1D)
