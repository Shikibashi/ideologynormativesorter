# Seventh editorial pass: descriptive evidence closure

Date: 2026-08-11

Bank overlay: `2026-08-editorial-v7`

Evidence overlay: `2026-08-descriptive-evidence-v2`

## Scope

This pass reviewed the 32 active descriptive items that did not yet have both an operational evidence note and a public background source. Each item was checked for one answerable empirical claim, a direct fit with an existing descriptive axis, and source language that did not overstate association as causation.

The result is nine scoped rewrites and 23 quarantines. Together with the 27 first-pass evidence records, all 36 descriptive items that remain active now expose an operational scope and at least one public source. Quarantined records remain addressable by ID for version history but no longer enter new forms or scores.

## Active scoped rewrites

| Item | Editorial action | Public basis |
| --- | --- | --- |
| `q0007` | Replaced a hypothetical competitive-government claim with a scoped finding from U.S. metropolitan police studies; mapped only to decentralized coordination. | [Elinor Ostrom, “Beyond Markets and States”](https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/lecture/) |
| `q0049` | Replaced three bundled missing-market conditions with one observed Superfund price-incidence result; mapped only to market-process confidence. | [Fullerton and Tsang, NBER Working Paper 4418](https://www.nber.org/papers/w4418) |
| `q0067` | Replaced a value-laden program comparison with a measured SNAP recertification burden; mapped only to state capacity. | [Homonoff and Somerville, NBER Working Paper 27311](https://www.nber.org/papers/w27311) |
| `q0168` | Replaced an unspecified censorship-slippage claim with documented use of broad counterterrorism laws against legitimate expression; mapped only to public-choice skepticism. | [UN Human Rights Council, A/HRC/40/52](https://www.ohchr.org/sites/default/files/Documents/Issues/Terrorism/SR/A_HRC_40_52_EN.pdf) |
| `q0207` | Replaced a migration-and-cooperation bundle with the qualified result of a randomized-contact review; mapped only to cultural plasticity. | [Paluck, Green, and Green, “The Contact Hypothesis Re-evaluated”](https://www.cambridge.org/core/journals/behavioural-public-policy/article/contact-hypothesis-reevaluated/142C913E7FA9E121277B29E994124EC5) |
| `q0208` | Replaced a bargaining-power assertion with an industry-level association between lobbying and migration barriers; mapped only to public-choice skepticism. | [Facchini, Mayda, and Mishra, “Do Interest Groups Affect Immigration?”](https://www.iza.org/en/publications/dp/3183/do-interest-groups-affect-immigration) |
| `q0210` | Replaced a housing-law bundle with a scoped municipal service-capacity constraint during rapid refugee inflows; mapped only to state capacity. | [World Bank, “Coping with the Influx”](https://documents1.worldbank.org/curated/en/585111595352295241/pdf/Coping-with-the-Influx-Service-Delivery-to-Syrian-Refugees-and-Hosts-in-Jordan-Lebanon-and-Kurdistan-Iraq.pdf) |
| `q0227` | Replaced an undefined civic-ritual claim with paired-city evidence on interethnic associations and communal violence; mapped only to decentralized coordination. | [Varshney, “Ethnic Conflict and Civil Society”](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/2F8EEAACC16E9A8366A9914C0301F08D/S0043887100020165a.pdf/ethnic-conflict-and-civil-society-india-and-beyond.pdf) |
| `q0329` | Replaced a causal threat-inflation claim with a noncausal association between lobbying and defense contract awards; mapped only to public-choice skepticism. | [Ağca and Igan, BIS Working Paper 1058](https://www.bis.org/publ/work1058.htm) |

## Quarantined claims

The following items remain in the audit history with exact rationales and replacement guidance in `src/data/editorialSeventhPass.ts`, but are inactive in new assessments:

- Construct mismatch: `q0009`, `q0088`, `q0149`, `q0167`, `q0169`, `q0260`, `q0367`.
- Compound or underspecified claim: `q0028`, `q0051`, `q0069`, `q0087`, `q0150`, `q0170`, `q0240`, `q0271`, `q0280`, `q0289`, `q0340`.
- Unsupported directional inference after source comparison: `q0228`, `q0327`, `q0380`.
- Active duplicate: `q0180`, `q0388`.

Two proposed rewrites were rejected during source comparison rather than accepted merely because a related paper existed:

- The public-sector-union literature reviewed for `q0088` supports compensation and spending effects, not the prompt’s asserted political-influence mechanism.
- Trade-and-conflict research reviewed for `q0327` contains competing directional mechanisms, so a single positive coordination mapping would overstate the evidence.

## Runtime integration

- The public profiles now contain 140 Balanced items and 286 Full-depth items.
- The frontend, Worker defaults, Wrangler environments, compatibility tests, README, and deployment documentation use those same versioned counts.
- Controlled 120-item matrix forms remain supported.
- Sources are background context, not answer keys or evidence that an item has psychometric validity.
