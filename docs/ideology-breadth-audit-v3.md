# Ideology breadth audit v3 (historical)

> Superseded by [ideology breadth and validation audit v4](./ideology-breadth-audit-v4.md). This file remains as the pre-human-validation design record.

This audit asks a different question from the old expansion backlog. It does **not** ask how many named ideologies can be added. It asks whether the sorter covers the major political traditions it claims to classify, and whether each tradition has enough distinctive measurement content to justify its current role.

The audit uses academic political theory and intellectual history as the inclusion filter. Polcompball-style source lists may still be useful for finding aliases, but they are not sufficient evidence that a candidate deserves an independent scored endpoint.

## Current family coverage

| Family                                       | Current coverage                                                                                                                       | Breadth judgment                                                   | Next action                                                                                                                               |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Liberal traditions                           | Classical Liberalism, Social Liberalism, Neoliberalism, Cosmopolitan Liberalism; narrower liberal schools retained as specialists      | Broadly covered                                                    | Improve within-family discrimination only where tests show debt                                                                           |
| Conservative traditions                      | Social, National, Liberal and Neoconservatism; Christian Democracy plus narrower right/religious specialists                           | Broadly covered                                                    | Keep specialist depth approach                                                                                                            |
| Socialist / communist traditions             | Democratic Socialism, Market Socialism, Marxism-Leninism, Libertarian Socialism, Ecosocialism; many historical subtypes as specialists | Broadly covered                                                    | Resolve subtypes through left-family modules rather than main-pool expansion                                                              |
| Anarchist traditions                         | Anarcho-Communism, Anarcho-Capitalism, Mutualism, Individualist Anarchism plus multiple specialists                                    | Broadly covered                                                    | Keep subtype precision in anarchist/market modules                                                                                        |
| Nationalist traditions                       | Civic Nationalism, Ethnonationalism, Religious Nationalism, National Conservatism, Fascism plus multiple specialists/modifiers         | Broad at the generic level                                         | Add liberation/self-determination constructs before adding historically subordinated-group nationalisms                                   |
| Ecological traditions                        | Deep Ecology, Degrowth Green, Ecomodernism, Ecosocialism plus green specialists                                                        | Broadly covered                                                    | Continue green-family specialist validation                                                                                               |
| Religious politics                           | Christian Democracy and Religious Nationalism plus Islamic, integralist, reconstructionist, theocratic and other specialists           | Broadly covered                                                    | Avoid multiplying religion-specific labels unless a module can distinguish them                                                           |
| Feminist traditions                          | Liberal Feminism is primary; Anarcha-Feminism is specialist                                                                            | Previously undermeasured                                           | **In progress in PR #15:** dedicated feminist specialist instrument for liberal, radical, socialist/Marxist and anarcha-feminist profiles |
| Multicultural / recognition politics         | Multiculturalism is currently a modifier                                                                                               | Role deserves review                                               | Test whether recognition, accommodation and group-differentiated rights form a sufficiently independent measured profile                  |
| Black self-determination / Black nationalism | Public related-tradition entry with a focused identity-sovereignty module; no general-quiz endpoint                                    | Genuine breadth gap with an honest non-scored surface              | Validate the focused module before any scored promotion                                                                                   |
| Indigenous / decolonial sovereignty          | Indigenism exists as a specialist in the focused identity-sovereignty module                                                           | Label and construct coverage present; respondent validation absent | Keep it outside ordinary nationalism and validate the dedicated module                                                                    |

## Priority 1: feminist traditions

The first measurement gap is addressed by `src/data/feministBreadth.ts`.

The instrument keeps `radical-feminism` outside the production catalog while exposing `socialist-feminism` as a specialist tied to the focused feminist module. Neither is an ordinary primary result. The module tests whether legal-equality reform, structural patriarchy, class/social reproduction and anti-hierarchical strategy can distinguish four broad feminist traditions.

This is the model for future breadth work: identify the missing construct first, create an isolated specialist measurement surface, demonstrate internal separability, collect respondent evidence, and only then promote labels.

## Priority 2: Black self-determination and Black nationalism

The repository's old expansion backlog identified Black Nationalism, but only from weak internet taxonomy sources and therefore left it at speculative priority. Academic literature supports treating Black nationalism as a durable and heterogeneous political tradition rather than as an internet micro-label.

The key measurement problem is that Black nationalism cannot safely be represented by simply cloning the existing Ethnonationalist centroid. The tradition has included projects of independent statehood, community autonomy, economic self-sufficiency, cultural nationalism, transnational solidarity and limited forms of minority self-government. Political theorists have explicitly compared community Black nationalism to minority-national self-determination rather than reducing it to exclusionary ethnic nationalism.

A future specialist module should therefore distinguish at least:

- **integration versus group political autonomy**;
- **self-determination versus assimilation into dominant institutions**;
- **community control and economic self-sufficiency**;
- **territorial independence versus non-territorial/community autonomy**;
- **emancipatory solidarity versus exclusionary ethnic hierarchy**;
- **domestic community nationalism versus Pan-African/transnational orientation**.

Those distinctions now exist in the focused identity-sovereignty module, so `black-nationalism` is visible as a related tradition with a focused follow-up. It remains outside the ordinary nationalist pool and has no global-axis centroid.

### Pan-Africanism

Pan-Africanism is treated as a related specialist candidate, not an automatic separate primary ideology. Its transnational and anti-colonial dimensions are not captured well by a domestic community-boundary axis. The focused identity-sovereignty module includes Pan-African solidarity and unity constructs so later respondent evidence can test whether the profile behaves as a specialist ideology, modifier, or broader orientation.

## Priority 3: Indigenous sovereignty and decolonial political thought

`indigenism` already exists as a specialist label, so the immediate problem is not catalog breadth. It is now attached to the dedicated identity-sovereignty module rather than the generic nationalist module.

Recent Indigenous political theory emphasizes that Indigenous claims may contest the assumptions of modern state sovereignty itself. Land, treaty relations, colonial authority, collective self-determination, reciprocal relations and alternative conceptions of political ordering are not equivalent to simply scoring high on nationalism or localism.

A dedicated module should distinguish:

- collective self-determination from ordinary national majoritarianism;
- land/treaty-based political authority from generic territorial nationalism;
- decolonization from ordinary decentralization;
- relational or plural sovereignty from centralized state sovereignty;
- Indigenous governance claims from cultural recognition without political autonomy.

Only after that module exists should the project consider whether `indigenism` is the right umbrella name or whether more precise specialist naming is warranted.

## Priority 4: multiculturalism role review

Multiculturalism is currently classified as a modifier. That is defensible if it behaves mainly as a cross-cutting commitment hosted by liberal, social-democratic, communitarian or other traditions. But political philosophy also treats multiculturalism as a normative program concerning recognition, accommodation, group-differentiated rights, minority political power and, in some cases, self-determination.

Do **not** promote it merely because the literature is substantial. First test whether respondents who strongly favor multicultural recognition and group accommodation form a profile that remains distinct from:

- Cosmopolitan Liberalism;
- Social Liberalism;
- Communitarianism;
- Civic Nationalism;
- Radical Democracy.

The missing constructs are likely **uniform citizenship versus differentiated accommodation**, **assimilation versus recognition**, and **individual-only versus group-differentiated rights**. If these add predictive information beyond the existing political-community-boundary and anti-domination axes, Multiculturalism may deserve specialist or primary reconsideration. If not, keeping it as a modifier is more honest.

## What not to add

This audit does not recommend adding every historical tendency encountered in the literature. A name should stay an alias, modifier or contextual descriptor when its main differences are biography, geography, tactical vocabulary or a single policy.

In particular:

- do not create race-specific nationalist endpoints merely by copying Ethnonationalism and changing the group name;
- do not split Marxist and Socialist Feminism until the module can empirically discriminate them;
- do not create separate Pan-Africanist, Black internationalist and Black nationalist endpoints before testing whether those dimensions separate in respondent data;
- do not create Indigenous ideology labels that flatten distinct peoples and traditions into a single invented centroid;
- do not promote Multiculturalism solely because it has a large scholarly literature.

## Proposed sequence

1. Finish and validate the feminist specialist instrument.
2. Validate the focused identity-sovereignty module with Black Nationalism and Pan-Africanism as non-exclusive candidate outcomes.
3. Validate the Indigenous-sovereignty/decolonization profiles now attached to that module.
4. Run a multiculturalism role experiment against its nearest liberal, communitarian and civic-nationalist neighbors.
5. Re-run the primary-pool and hand-authored archetype gates after every promotion.

## Academic sources

- Stanford Encyclopedia of Philosophy, _Feminist Political Philosophy_: https://plato.stanford.edu/entries/feminism-political/
- Stanford Encyclopedia of Philosophy, _Feminist Perspectives on Class and Work_: https://plato.stanford.edu/entries/feminism-class/
- Andrew Valls, “A Liberal Defense of Black Nationalism,” _American Political Science Review_ 104(3), 2010: https://doi.org/10.1017/S0003055410000249
- Dean E. Robinson, _Black Nationalism in American Politics and Thought_, Cambridge University Press, 2001: https://doi.org/10.1017/CBO9780511606038
- Stanford Encyclopedia of Philosophy, _Nationalism_: https://plato.stanford.edu/entries/nationalism/
- Stanford Encyclopedia of Philosophy, _Multiculturalism_: https://plato.stanford.edu/entries/multiculturalism/
- Valentin Clavé-Mercier, “Indigenous political theory, metaphysical revolt, and the decolonial rearticulation of political ordering,” _International Theory_ 17(1), 2025: https://doi.org/10.1017/S1752971924000137
- David Myer Temin, _Remapping Sovereignty: Decolonization and Self-Determination in North American Indigenous Political Thought_, University of Chicago Press, 2023.
