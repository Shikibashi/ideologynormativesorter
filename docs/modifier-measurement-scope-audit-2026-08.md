# Modifier measurement scope audit — 2026-08

## Decision

Ordinary modifier results now use `2026-08-modifier-construct-v1`. A public modifier is returned only when the active core questionnaire contains at least two declared, directly relevant indicators, meets the existing fit and coverage thresholds, and has no high uncertainty. It is never reconstructed from the 26-axis centroid used for broad primary labels.

This distinction matters especially for populism. The literature treats populism as a thin ideology with people-centrism, anti-elitism, and anti-pluralism that combines with different host ideologies; nationalism, economic policy, and institutional distrust are not interchangeable proxies. See [Castanho Silva, Neuner, and Wratil](https://www.cambridge.org/core/journals/journal-of-experimental-political-science/article/populism-and-candidate-support-in-the-us-the-effects-of-thin-and-host-ideology/315C0660F29FBEC870D11DC73E6328D7) and [the comparative party analysis](https://www.cambridge.org/core/journals/european-journal-of-political-research/article/anatomy-of-populist-ideology-how-political-parties-define-the-people-and-the-elite/530AC0E964E62C709929D155CE14CEBB).

## Ordinary core constructs

| Modifier | Declared indicators | Output boundary |
| --- | --- | --- |
| Anti-imperialism | q0321, q0322, q0323, q0326 | Equal standing and resistance to domination abroad; not pacifism or every anti-colonial program. |
| Cosmopolitanism | q0201, q0321, q0233 | Equal moral concern and layered membership; not world government or one border rule. |
| Civil-libertarianism | q0161, q0164, q0173 | Rights constraint; not property theory or a minimal-state conclusion. |
| Decentralist orientation | q0015, q0018, q0053 | Preference for dispersed, contestable institutions; not separatism or anarchism. |
| Feminist orientation | q0261, q0264, q0421 | Gendered hierarchy and liberation; not a particular feminist school. |
| Multiculturalism | q0281, q0282, q0293 | Plural accommodation with equal status; not one exemption, representation, or self-government policy. |
| Technocratic orientation | q0458, q0460, q0476 | Accountable evidence-guided administration; not insulated expert rule or technocratic centralism. |

## Abstaining public modifiers

`ethnonationalist` is focused-follow-up only because ethnic centrality, assimilation, minority self-determination, and exclusion are distinct sensitive variants. The remaining catalog modifiers are sourced and browsable but do not generate an ordinary match: `civic-nationalist`, `communitarianism`, `economic-nationalism`, `expansionist-nationalism`, `fiscal-conservatism`, `internationalism`, `left-wing-nationalism`, `left-wing-populism`, `nationalism`, `populism`, `progressivism`, `regionalism`, `right-wing-populism`, `separatist-nationalism`, `social-conservatism`, and `transhumanism`.

Nationalism and civic nationalism are deliberately in this abstaining group. Existing items can ask whether civic membership is equal or whether cultural continuity matters in a particular immigration decision; they do not establish whether national political priority is more important than cosmopolitan duty, liberal constitutionalism, cultural conservatism, or multilevel membership. This follows the need to distinguish national concepts and their variants rather than treating a civic/ethnic contrast as exhaustive; see the [Stanford Encyclopedia of Philosophy entry on nationalism](https://plato.stanford.edu/entries/nationalism/). Multiculturalism remains directly scoped because its indicators jointly address equal citizenship, non-uniformity, and voluntary association, while its result card states that accommodation variants remain open; compare the [SEP account of multiculturalism](https://plato.stanford.edu/entries/multiculturalism/).

## Next evidence work

Before an abstaining modifier can become ordinary output, add a construct-specific item set, direct source/context records, cognitive interviews, and retest/construct-coverage checks. The first priorities are: three separable populism items; national/civic membership versus national priority and cosmopolitan duty; fiscal sustainability versus taxes, spending, and austerity; and international cooperation versus cosmopolitan moral scope or world federalism. Host-dependent labels such as left- and right-populism must additionally show the thin construct and their host orientation separately.

Research core records now preserve the taxonomy version, modifier-measurement version, active primary/modifier ID lists, and roster fingerprints. This lets analysis reject or stratify records when eligibility changes rather than silently pooling outputs from different modifier contracts.
