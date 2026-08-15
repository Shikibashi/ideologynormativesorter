# vNext Modifier Architecture Review — 2026-08

Status: definitive vNext conceptual and measurement-design review; production
promotion remains evidence-gated.

Frozen implementation baseline:
`f0324dbf27dfc6e35ff557992e4643e3df15ee0e`

This document is cumulative with the frozen Measurement Architecture, the
completed taxonomy Deep Research, the approved Primary architecture in
[`vnext-taxonomy-measurement-architecture-review-2026-08.md`](vnext-taxonomy-measurement-architecture-review-2026-08.md), the current
repository, and the [cumulative methodological decision log](methodological-change-decision-log-2026-08.md).
It defines the next conceptual and measurement-design handoff. It does not
rewrite v13 metadata, change the current question bank, promote a label, or
authorize participant-facing production changes.

## 1. Executive decision

The current 24-entry Modifier registry is retained as a versioned v13 catalog,
but it is not retained as a flat ontology. The authoritative vNext model is a
faceted, polyhierarchical graph with four distinct object types:

1. **Modifier domains** organize related political characteristics. A domain is
   not itself a score or an ideology.
2. **Construct facets** are bounded, potentially cross-host characteristics
   that may become measured outputs when direct respondent evidence supports
   them.
3. **Configuration nodes** combine a thin facet with a host tradition or with
   another independent facet. They are derived descriptions, not automatically
   independent constructs.
4. **Specialist traditions and projects** remain separate objects when a label
   has a historically specific doctrine, movement, institutional program,
   regional identity, or regime project.

The decisive criterion for a Modifier is not that a label can be attached to
more than one Primary in prose. It must also be:

- conceptually narrower than a complete ideology;
- portable across at least two genuinely different hosts in principle;
- independently distinguishable from nearby constructs;
- expressible as a bounded respondent construct rather than a label bundle;
- measurable with direct items that do not merely reuse a host Primary score;
- safe to display only under the frozen direct-evidence and uncertainty gates.

No genuine contradiction with the frozen Measurement Architecture was found.
The existing v13 registry, current matcher, and historical documents contain
older role descriptions, but those are versioned historical records rather than
authority to reopen the frozen baseline. The only additive tensions are the
already recorded single-parent versus polyhierarchical graph issue and the
need to separate v13 measurement status from vNext conceptual readiness.

The immediate recommendations are:

- retain the current seven ordinary direct constructs without changing their
  v13 scoring contract;
- retain `ethnonationalist` as a sensitive focused-follow-up construct;
- retain the other current entries as conceptual catalog nodes, with explicit
  domains and evidence holds;
- represent Nationalism as a domain with separately measured subdimensions,
  not as one undifferentiated scalar;
- represent Populism as a thin people-versus-elite domain with separable
  people-centrism, anti-elitism, anti-pluralism, and popular-sovereignty
  facets;
- represent left/right labels as derived host configurations unless later
  respondent studies demonstrate residual structure beyond their components;
- add no new public Modifier labels in this stage.

## 2. Frozen boundary and current state

The frozen production contract remains authoritative:

| Surface                             | Frozen/current fact                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| Taxonomy                            | `2026-08-taxonomy-v13`                                                                       |
| Current Modifier IDs                | 24                                                                                           |
| Ordinary direct Modifier constructs | 7                                                                                            |
| Focused-follow-up Modifier          | `ethnonationalist`                                                                           |
| Catalog-only Modifiers              | 16                                                                                           |
| Modifier measurement registry       | `2026-08-modifier-construct-v1`                                                              |
| Direct-match minimum                | 2 answered declared indicators                                                               |
| Fit gate                            | `MODIFIER_FIT_THRESHOLD = 0.65`                                                              |
| Evidence gate                       | `MODIFIER_EVIDENCE_THRESHOLD = 0.4`                                                          |
| Ordinary matcher                    | Direct declared indicators only                                                              |
| Forbidden substitute                | Primary centroid, host score, synthetic archetype, source presence, or theoretical coherence |

The existing seven ordinary constructs are:

- Anti-imperialism: `q0321`, `q0322`, `q0323`, `q0326`;
- Cosmopolitanism: `q0201`, `q0321`, `q0233`;
- Civil-libertarianism: `q0161`, `q0164`, `q0173`;
- Decentralist orientation: `q0015`, `q0018`, `q0053`;
- Feminist orientation: `q0261`, `q0264`, `q0421`;
- Multiculturalism: `q0281`, `q0282`, `q0293`;
- Technocratic orientation: `q0458`, `q0460`, `q0476`.

These are measurement-status facts, not claims that the constructs have
established reliability, validity, invariance, or criterion performance. The
respondent gates in the frozen architecture remain in force.

## 3. Conceptual ontology

### 3.1 Modifier domain

A **Modifier domain** is an organizing region of the conceptual graph. It
groups related facets without asserting that the facets form one latent scale.
For example, National Orientation contains membership-basis and territorial
facets that may correlate but should not be collapsed without evidence.

### 3.2 Construct facet

A **construct facet** is a bounded characteristic that can vary within a host
tradition. It can be a disposition, strategy, identity boundary, institutional
preference, economic orientation, cultural orientation, national orientation,
organizational principle, or another explicitly named political facet.

Every facet must state:

- its conceptual kind;
- its positive and negative boundary;
- compatible and incompatible hosts;
- nearest non-equivalent facets;
- whether it is a disposition, project, identity boundary, or institutional
  preference;
- the direct items required for measurement;
- its current measurement status and evidence hold.

### 3.3 Configuration node

A **configuration node** describes a structured combination, such as
`populism + egalitarian host` or `national orientation + social-conservative
host`. A configuration may be historically meaningful without being a new
independent construct. It is eligible for public display only after all
constitutive components are directly measured and a versioned resolver applies
an explicit configuration rule.

### 3.4 Specialist relation

A Specialist can be related to a Modifier in several non-equivalent ways:

- `expresses`: the Specialist commonly instantiates a facet;
- `requires`: the Specialist cannot be interpreted without the facet;
- `contrasts_with`: a Specialist is distinguished by rejecting or reversing a
  facet;
- `institutionalizes`: a project turns a facet into an institutional form;
- `configuration_of`: the Specialist combines two or more facets or a facet
  with a Primary host;
- `regional_or_historical_variant_of`: a Specialist is a situated tradition,
  not a generic cross-host facet.

These are graph relations, not measurement substitutions.

## 4. Authoritative Modifier-domain hierarchy

The following hierarchy replaces the earlier flat planning sketch. Domain and
subdimension labels are conceptual metadata; they do not create new scores.

### 4.1 Community, membership, sovereignty, and territorial orientation

**Parent domain:** National Orientation and Political Community

| Subdimension                             | Construct boundary                                                                                                                               | Current labels                                              | Measurement rule                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| National-community salience and priority | Whether the nation is treated as a politically important community and, separately, whether national priority can override competing obligations | `nationalism`                                               | Measure salience, continuity, solidarity, and priority separately before considering an aggregate      |
| Membership basis                         | What makes someone a member: civic commitment, ancestry/ethnicity, culture, religion, residence, or combinations                                 | `civic-nationalist`, `ethnonationalist`                     | Do not infer from equal citizenship, immigration policy, or social traditionalism alone                |
| Sovereignty and autonomy                 | Preference for self-government, political autonomy, non-domination, or control over collective decisions                                         | `regionalism`, `separatist-nationalism`, `anti-imperialism` | Separate external non-domination from internal secession and ordinary decentralization                 |
| Economic nationalism                     | National productive capacity, strategic autonomy, domestic industry, or control of strategic assets                                              | `economic-nationalism`                                      | Separate national priority from protectionism, ownership, fiscal restraint, and developmental strategy |
| Separatism and statehood                 | Preference for independence, secession, or a distinct sovereign political unit rather than only devolution or cultural recognition               | `separatist-nationalism`                                    | Requires a dedicated autonomy/federation/independence comparison                                       |
| Expansion orientation                    | Whether national power should expand territory, influence, or political control                                                                  | `expansionist-nationalism`                                  | Requires direct territorial, irredentist, imperial, and force distinctions                             |
| Regional identity and authority          | A region’s political identity and authority within, alongside, or against a larger state                                                         | `regionalism`                                               | Distinguish regional identity, regional institution, federalism, and separatism                        |

National Orientation is deliberately not equivalent to civic nationalism,
ethnonationalism, social conservatism, immigration restriction, patriotism,
sovereigntism, or one foreign-policy stance. The domain is a structured family
of questions, not a single left-right score.

### 4.2 Cross-border moral scope and external order

**Parent domain:** Transnational Moral and Political Order

| Subdimension                     | Construct boundary                                                                         | Current labels                        | Non-equivalence                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------- |
| Cosmopolitan moral scope         | Equal moral concern and layered membership beyond nationality                              | `cosmopolitanism`                     | Not identical to open borders, world government, or international institutions        |
| International cooperation        | Obligations, cooperation, and institutions across states or political communities          | `internationalism`                    | Not identical to universal moral scope or a world federation                          |
| Anti-imperial restraint          | Opposition to domination, colonial control, unequal dependence, or externally imposed rule | `anti-imperialism`                    | Not identical to pacifism, isolationism, non-intervention in every case, or socialism |
| External coercion and projection | Use of force, regime transformation, territorial expansion, or strategic dominance         | Related to `expansionist-nationalism` | Must not be inferred from realism, military capacity, or ordinary defense preference  |

Cosmopolitanism, internationalism, and anti-imperialism may co-occur, but they
answer different questions: moral scope, institutional cooperation, and
anti-domination respectively.

### 4.3 Popular sovereignty and political style

**Parent domain:** People-versus-Elite and Popular-Sovereignty Frame

| Subdimension                         | Construct boundary                                                                      | Measurement implication                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| People-centrism                      | A morally unified or politically privileged account of “the people”                     | Must identify who counts as the people rather than use general public opinion |
| Anti-elitism                         | Moral or political opposition to a corrupt, self-serving, or insulated elite            | Must distinguish elite criticism from ordinary institutional accountability   |
| Anti-pluralism                       | Whether political opponents are treated as illegitimate or outside the authentic people | Must be measured directly and separately from majoritarian preference         |
| Popular sovereignty/general will     | Preference for direct or unmediated popular authorization                               | Must distinguish democratic participation from anti-pluralist exclusivity     |
| Mobilization and institutional style | Preference for plebiscitary, movement, leader-centered, or extra-institutional action   | This is a strategy/style facet, not proof of populism by itself               |

`populism` is the parent catalog node. It must not become an ordinary scalar
until a direct item set shows whether these facets form a useful construct or
several separable constructs. `left-wing-populism` and `right-wing-populism`
are configurations of this domain with host content, not sibling latent
traits.

### 4.4 Authority, rights, and institutional distribution

**Parent domain:** Authority and Institutional Order

| Subdimension                      | Construct boundary                                                                                                   | Current labels             | Non-equivalence                                                               |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------- |
| Civil-liberties constraint        | Strong default protection for expression, privacy, association, conscience, due process, protest, or bodily autonomy | `civil-libertarianism`     | Not property theory, market liberalism, or minimal government                 |
| Decentralization and polycentrism | Dispersed, locally responsive, plural, and contestable authority                                                     | `decentralist-orientation` | Not separatism, anarchism, local majoritarianism, or one economic system      |
| Accountable expertise             | Confidence in evidence-guided, transparent, contestable technical administration                                     | `technocratic-orientation` | Not insulated expert rule, centralization, or administrative authoritarianism |
| Regional institutional authority  | Authority distributed to regions or subnational communities                                                          | `regionalism`              | Cross-linked to National Orientation but not reducible to identity            |

The `technocratic-centralist` Specialist is a configuration of accountable
expertise with concentrated authority. It must not be reconstructed from the
ordinary Technocratic Orientation modifier.

### 4.5 Political economy and distribution

**Parent domain:** Economic Order and Public Finance

| Subdimension                        | Construct boundary                                                          | Current labels             | Required separation                                                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Fiscal orientation                  | Debt, deficit, tax, spending, and public-finance rules                      | `fiscal-conservatism`      | Separate fiscal sustainability, tax burden, spending composition, and austerity                                               |
| Economic nationalism                | National productive capacity and strategic economic autonomy                | `economic-nationalism`     | Separate ownership, trade protection, industrial policy, and welfare distribution                                             |
| Redistribution and social provision | Distribution, public services, social insurance, and economic equality      | No new Modifier added here | These are constructs in host Primaries and specialist modules until a demonstrated cross-host gap requires a bounded Modifier |
| Market governance                   | Competition, regulation, public coordination, and mixed institutional order | No new Modifier added here | Do not add a generic “market orientation” Modifier; existing Primary constructs cover much of this space                      |

The absence of a new generic redistribution or market Modifier is deliberate.
Adding one would duplicate constitutive Primary constructs without a demonstrated
measurement gap.

### 4.6 Culture, recognition, and social order

**Parent domain:** Social Relations and Cultural Order

| Subdimension                          | Construct boundary                                                                                           | Current labels         | Non-equivalence                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------ |
| Gendered power and liberation         | Gendered hierarchy, dependency, violence, care, reproduction, labor, or representation as political concerns | `feminist-orientation` | Not one feminist school or formal equal-treatment policy                                         |
| Plural accommodation and equal status | Equal citizenship alongside cultural association, recognition, and non-uniformity                            | `multiculturalism`     | Not every group-rights, exemption, autonomy, or reparative policy                                |
| Social and moral traditionalism       | Preference for inherited social norms and institutions as sources of cohesion or flourishing                 | `social-conservatism`  | Not necessarily theocracy, nationalism, authoritarianism, or one religious enforcement mechanism |
| Embedded community and common good    | View that persons and obligations are constituted partly through communities and shared goods                | `communitarianism`     | Not identical to traditionalism, republicanism, welfare solidarity, or localism                  |

Feminist Specialists remain schools or traditions under the Feminist
Orientation facet. They are not interchangeable with the generic Modifier.

### 4.7 Political change and reform

**Parent domain:** Change, Reform, and Social Improvement

| Subdimension                   | Construct boundary                                                              | Current labels                       | Non-equivalence                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| Progressive change orientation | Deliberate social improvement through reform, inquiry, and institutional change | `progressivism`                      | Not identical to liberalism, social democracy, cultural leftism, or one policy program |
| Reform versus rupture          | Preference for incremental, experimental, or transformative change              | Existing axes and Primary constructs | No new Modifier until a distinct cross-host residual is demonstrated                   |

Progressivism is retained conceptually, but its measurement must avoid turning
“supports change” into a proxy for every liberal, socialist, feminist, or green
position.

### 4.8 Technology, enhancement, and human futures

**Parent domain:** Technology and Human Enhancement

| Subdimension                  | Construct boundary                                                                           | Current labels               | Required separation                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| Human enhancement orientation | Deliberate scientific or technological improvement of human capacities, health, or longevity | `transhumanism`              | Separate voluntary enhancement, access, safety, privacy, surveillance, and coercive deployment |
| Technology governance         | Democratic, expert, market, or decentralized control over technology                         | Specialist/context relations | Do not duplicate Green Politics or Technocratic Orientation                                    |

`transhumanism` remains a conceptual cross-host orientation, not a validated
ordinary Modifier. A single enhancement item cannot establish the broader
construct.

## 5. Nationalism architecture

### 5.1 Decision

Retain `nationalism` as a conceptual parent node with the vNext canonical name
**National Orientation**. Preserve the `nationalism` ID for v13 compatibility.
Do not produce a single ordinary Nationalism score from existing civic,
continuity, immigration, or border items.

National orientation is a domain because its dimensions can vary independently:

```text
National Orientation
├── national-community salience
├── national political priority
├── continuity and solidarity
├── membership basis
│   ├── civic membership
│   └── ethnocultural / descent-based membership
├── sovereignty and autonomy
│   ├── general self-government
│   ├── regional autonomy
│   └── separatist statehood
├── economic nationalism
└── territorial projection
    ├── defensive / self-determining orientation
    └── expansion orientation
```

Religious nationalism is not added as a generic Modifier in this stage. It is a
Specialist configuration that combines national orientation with religious
identity or public authority and remains governed by its existing module. The
same rule applies to Black Nationalism, Zionism, Hindutva, Pan-Africanism,
Indigenism, and related situated traditions: their national content is mapped
to the domain, but the tradition is not collapsed into a generic national
facet.

### 5.2 Required distinctions

The future national module must directly distinguish at least:

- attachment or salience from priority over other communities;
- civic membership from ancestry, ethnicity, religion, culture, residence, or
  assimilation requirements;
- sovereignty from hostility to international cooperation;
- economic autonomy from protectionism, public ownership, and fiscal restraint;
- regional autonomy from secession and statehood;
- defensive self-determination from expansion, irredentism, or empire;
- national solidarity from exclusionary membership or welfare restriction.

The present bank contains relevant material but not a validated joint construct
set for these distinctions. It therefore remains measurement-incomplete.

## 6. Populism architecture

### 6.1 Decision

Retain `populism` as the conceptual parent node **People-versus-Elite Frame**.
Preserve the `populism` ID for compatibility, but do not infer it from
institutional distrust, nativism, direct democracy, nationalism, economic
policy, or a Primary score.

Populism is potentially cross-host because it can combine with conservative,
social-democratic, socialist, democratic, nationalist, agrarian, or other host
traditions. Its portability does not make it a single homogeneous score.

### 6.2 Required direct measurement

A future populism bank should separately test:

1. who constitutes the authentic people;
2. whether elites are treated as a morally corrupt opposing bloc;
3. whether political opponents or minorities can still belong to the people;
4. whether popular sovereignty is direct, plebiscitary, representative, or
   leader-mediated;
5. whether institutional checks and pluralism remain legitimate;
6. whether leader-centered or extra-institutional mobilization is preferred.

The first three are the minimum conceptual core. Anti-pluralism must not be
silently folded into anti-elitism, and popular participation must not be
silently folded into populism.

### 6.3 Left and right variants

`left-wing-populism` and `right-wing-populism` are **hybrid configurations**:

- Left-populism = populist frame + egalitarian, anti-oligarchic, or
  redistributive host content, with its own inclusion and pluralism profile.
- Right-populism = populist frame + national, traditionalist, nativist,
  sovereigntist, or market/welfare host content, with its own membership and
  coercion profile.

Neither is an independent Modifier merely because the same label appears in
different countries or parties. Future derived display requires direct evidence
for the thin populist facets and separate evidence for the host configuration.
If a respondent study shows a stable residual factor beyond those components,
the label may become a Specialist or independent configuration node; it must
not be promoted by centroid similarity or by hand-authored coherence.

## 7. Left/right and other compositionally specific labels

The same rule is applied consistently across the roster:

| Label                      | M0 representation                                                                 | M1 representation                                  | Current decision                                                                        |
| -------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `left-wing-nationalism`    | National Orientation facets + egalitarian or anti-colonial Primary/construct host | Independent named bridge configuration             | Retain conceptually as a configuration; no independent Modifier score                   |
| `left-wing-populism`       | Populism facets + egalitarian/anti-oligarchic host                                | Independent named bridge configuration             | Retain conceptually as a configuration; no independent Modifier score                   |
| `right-wing-populism`      | Populism facets + national/traditionalist/nativist/sovereigntist host             | Independent named bridge configuration             | Retain conceptually as a configuration; no independent Modifier score                   |
| `separatist-nationalism`   | National Orientation + separatist statehood facet                                 | Independent territorial tradition or configuration | Keep as a bounded catalog/follow-up node; do not treat as a scalar nationalism variant  |
| `expansionist-nationalism` | National Orientation + expansion/territorial-projection facet                     | Independent territorial project                    | Keep as a bounded catalog/follow-up node; do not infer from military or patriotic views |
| `civic-nationalist`        | National Orientation + civic membership facet                                     | Independent named civic-national configuration     | Keep as a membership-basis subdimension; direct evidence required                       |
| `ethnonationalist`         | National Orientation + ethnocultural membership facet                             | Independent identity-boundary configuration        | Keep as sensitive focused follow-up; direct identity and sovereignty evidence required  |

For M1 to warrant an independent endpoint beyond M0, respondent evidence must
show all of the following:

- response-process evidence that respondents understand the combination as a
  coherent object rather than a label cue;
- incremental predictive or explanatory value beyond the component facets and
  host Primary;
- discriminant behavior from the nearest host, membership, sovereignty,
  social-order, and populist constructs;
- stable response patterns across retest and relevant scope/language groups;
- criterion interpretation that does not collapse into self-identification or
  one policy preference;
- acceptable fairness and false-positive behavior;
- presentation value beyond showing the component profile.

Failure supports M0 plus facets, a Specialist module, or a catalog
configuration. It does not erase the historical label.

## 8. Definitive roster and individual dispositions

The following table evaluates every current Modifier. “Current status” is the
frozen v13 measurement status. “vNext recommendation” is a design
recommendation only and does not change the current runtime.

| ID                         | Conceptual kind and domain                                                                             | Cross-host / independence decision                                                                                                                                                 | Primary and Specialist relationship                                                                                                                                                                                | Current coverage and vNext measurement recommendation                                                                                                      | Disposition                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `anti-imperialism`         | Cross-cutting external-order orientation; anti-domination disposition                                  | Portable across liberal, socialist, green, nationalist, democratic, and other hosts; distinct from pacifism and socialism                                                          | Can combine with Radical Democracy, Democratic Socialism, Green Politics, National Orientation, and Cosmopolitanism; relates to Pan-Africanism, Indigenism, and anti-colonial traditions                           | Direct four-item core exists; preserve direct-only scoring and test separation from cosmopolitan scope, non-intervention, and defense                      | Retain as scored Modifier                                                    |
| `civic-nationalist`        | Membership-basis facet under National Orientation                                                      | Conceptually independent of national salience, but not a complete orientation; civic basis can coexist with exclusion or assimilation                                              | Can attach to Liberal, Republicanism, Christian Democracy, National Conservatism, Social Liberalism, and others; relates to civic-republican and national specialists                                              | Catalog-only; add a direct membership-basis follow-up distinguishing citizenship, commitment, ancestry, culture, and assimilation                          | Retain as subdimension; focused-follow-up candidate                          |
| `communitarianism`         | Cross-cutting social-ontology and common-good orientation                                              | Portable across conservative, republican, liberal, social-democratic, religious, and some socialist hosts; risk of contamination with tradition and welfare solidarity             | Relates to Christian Democracy, Republicanism, Conservative, Confucian Political Revival, Distributism, and Christian Socialism; does not define any of them                                                       | Catalog-only; require items on embedded personhood, common goods, social bases of self-respect, and rights limits                                          | Retain as research Modifier candidate                                        |
| `cosmopolitanism`          | Cross-cutting transnational moral-scope orientation                                                    | Independent from international institutions and open borders, though correlated; portable across liberal, socialist, green, and democratic hosts                                   | Relates to Social Liberalism, Classical Liberalism, Green Politics, Radical Democracy, Pan-Africanism, and Internationalism; contrasts with exclusionary membership and expansionism                               | Direct three-item core exists; preserve bounded construct name “equal moral concern across borders” and test against internationalism and local attachment | Retain as scored Modifier                                                    |
| `civil-libertarianism`     | Rights-constraint disposition under Authority and Institutional Order                                  | Portable across market, socialist, green, anarchist, conservative, and democratic hosts; independent from property and market policy                                               | Relates to Classical Liberalism, Social Liberalism, Libertarian Socialism, Radical Democracy, and Anarchist Specialists; contrasts with Theocrat and Technocratic Centralist only on distinct authority dimensions | Direct three-item core exists; preserve direct-only scoring and test against general liberal rights and anti-state views                                   | Retain as scored Modifier                                                    |
| `decentralist-orientation` | Institutional distribution preference                                                                  | Portable across anarchist, green, republican, democratic, socialist, and some conservative hosts; distinct from separatism and anarchism                                           | Relates to Libertarian Municipalism, Democratic Confederalism, Bioregionalism, Republicanism, Green Politics, and Anarchist Specialists                                                                            | Direct three-item core exists; preserve bounded polycentric construct and test against regional identity, federalism, and anti-state preference            | Retain as scored Modifier                                                    |
| `economic-nationalism`     | Cross-cutting economic and national-autonomy orientation                                               | Portable across conservative, socialist, developmental, populist, green, and anti-colonial hosts; independent only if national priority is separated from ownership and protection | Relates to National Conservatism, Democratic Socialism, Developmentalism, Baʿthism, Welfare Chauvinism, and anti-colonial traditions                                                                               | Catalog-only; require direct items separating strategic autonomy, trade protection, domestic industry, ownership, and welfare                              | Retain as research Modifier candidate                                        |
| `ethnonationalist`         | Sensitive identity-boundary facet under Membership Basis                                               | Portable across multiple hosts in principle, but heterogeneous across liberation, exclusionary, assimilationist, and ethnocratic variants; not one scalar without subfacets        | Relates to Black Nationalism, Indigenism, Zionism, Hindutva, Religious Nationalism, National Socialism, and National Conservatism; never infer one Specialist from the facet                                       | Focused-follow-up only; preserve identity/sovereignty module and require direct membership, ancestry, assimilation, minority, and self-determination items | Retain as sensitive focused-follow-up Modifier                               |
| `expansionist-nationalism` | Territorial-projection project, not a generic disposition                                              | Can appear across hosts but is a compound territorial project; expansion, irredentism, empire, and influence are non-equivalent                                                    | Relates to Fascist Authoritarianism, National Socialism, National Bolshevism, Neoconservatism, and imperial traditions; contrasts with anti-imperial restraint                                                     | Catalog-only; require direct territorial claim, irredentism, force, and external-rule items                                                                | Demote endpoint; retain as bounded configuration/focused catalog node        |
| `fiscal-conservatism`      | Economic public-finance disposition                                                                    | Portable across conservative, liberal, Christian-democratic, social-democratic, and market-oriented hosts; independent from small government only if measured directly             | Relates to Ordoliberalism, Neoliberalism, Conservative, Christian Democracy, and Social Democracy; does not define them                                                                                            | Catalog-only; require multi-item coverage of debt, deficits, rules, taxes, spending composition, and austerity                                             | Retain as research Modifier candidate                                        |
| `internationalism`         | Cross-border cooperation and institutional orientation                                                 | Portable across liberal, socialist, green, anti-imperial, democratic, and developmental hosts; distinct from moral cosmopolitanism                                                 | Relates to Pan-Africanism, Pan-Arabism, Social Liberalism, Green Politics, Democratic Socialism, and anti-imperial traditions                                                                                      | Catalog-only; require direct cooperation, institutional obligation, solidarity, intervention, and world-government distinctions                            | Retain as research Modifier candidate                                        |
| `feminist-orientation`     | Cross-cutting gendered-power and liberation orientation                                                | Portable across liberal, socialist, anarchist, green, democratic, and conservative-reform hosts; independent from formal equality alone                                            | Relates to Liberal Feminism, Radical Feminism, Socialist Feminism, Black Feminism, Queer Politics, and Anarcha-Feminism                                                                                            | Direct three-item core exists; preserve generic orientation boundary and route schools to focused modules                                                  | Retain as scored Modifier                                                    |
| `left-wing-nationalism`    | Compound/bridge configuration: National Orientation plus egalitarian or anti-colonial host             | Not independent of its components on present evidence; label meaning varies by membership, sovereignty, and economic program                                                       | Relates to Democratic Socialism, Radical Democracy, Marxian Socialism, Green Politics, Black Nationalism, Pan-Africanism, and Indigenism                                                                           | Catalog-only; measure national and host constructs separately before any derived configuration                                                             | Demote endpoint; retain as derived configuration                             |
| `left-wing-populism`       | Compound/bridge configuration: Populist Frame plus egalitarian/anti-oligarchic host                    | Not independent of thin populism and host content on present evidence; anti-pluralism and inclusion vary                                                                           | Relates to Social Democracy, Democratic Socialism, Radical Democracy, Marxian Socialism, and Agrarian Populism                                                                                                     | Catalog-only; requires direct populist facets plus host evidence and an explicit resolver                                                                  | Demote endpoint; retain as derived configuration                             |
| `multiculturalism`         | Cross-cutting recognition and accommodation orientation                                                | Portable across social-liberal, social-democratic, green, republican, communitarian, and democratic hosts; independent only if recognition is separated from generic tolerance     | Relates to Social Liberalism, Social Democracy, Radical Democracy, Christian Democracy, Black Politics, Queer Politics, and Indigenism                                                                             | Direct three-item core exists; preserve equal-status and voluntary-association boundary; test against cosmopolitanism, civic nationalism, and separatism   | Retain as scored Modifier                                                    |
| `regionalism`              | Cross-cutting regional identity and institutional-authority facet                                      | Portable across green, republican, decentralist, nationalist, developmental, and cultural hosts; combines identity and institutional preference and must separate them             | Relates to Bioregionalism, Democratic Confederalism, Libertarian Municipalism, Separatist Nationalism, and regional traditions                                                                                     | Catalog-only; require separate regional identity, regional authority, federalism, devolution, and statehood items                                          | Retain as research Modifier candidate with cross-domain edges                |
| `right-wing-populism`      | Compound/bridge configuration: Populist Frame plus national/traditionalist/nativist/sovereigntist host | Not independent of thin populism and host facets; “right” varies by economy, religion, membership, and authority                                                                   | Relates to Conservative, National Conservatism, Christian Democracy, Market Right-Libertarianism, Welfare Chauvinism, and Agrarian Populism                                                                        | Catalog-only; requires direct populist facets and separate host/membership evidence                                                                        | Demote endpoint; retain as derived configuration                             |
| `separatist-nationalism`   | Territorial self-determination project under National Orientation                                      | Cross-host in principle but combines identity, sovereignty, territory, and statehood; not a simple nationalism pole                                                                | Relates to Indigenism, Black Nationalism, Zionism, Pan-Africanism, Democratic Confederalism, Radical Democracy, and Regionalism                                                                                    | Catalog-only; require explicit comparison of autonomy, federation, confederation, and independence                                                         | Demote scalar endpoint; retain as bounded configuration/focused catalog node |
| `progressivism`            | Cross-cutting change and social-improvement orientation                                                | Portable across liberal, social-democratic, green, feminist, and democratic hosts; risk of contamination with contemporary left policy bundles                                     | Relates to Social Liberalism, Social Democracy, Green Politics, Feminist Specialists, Queer Politics, and Third Way                                                                                                | Catalog-only; require direct change orientation, inquiry, reform, inclusion, and institutional experimentation items                                       | Retain as research Modifier candidate                                        |
| `social-conservatism`      | Cross-cutting moral and social-order orientation                                                       | Portable across Conservative, Christian Democracy, National Conservatism, Republicanism, and some communitarian hosts; independent from theocracy and nationalism                  | Relates to Paleoconservatism, Integralism, Religious Nationalism, Confucian Political Revival, Theocrat, and Christian Democracy                                                                                   | Catalog-only; require non-theocratic, non-nationalist social-traditionalism items plus enforcement distinctions                                            | Retain as research Modifier candidate                                        |
| `technocratic-orientation` | Institutional preference for accountable evidence-guided administration                                | Portable across liberal, conservative, social-democratic, green, developmental, and market hosts; independent from centralization if accountability and authority are separated    | Relates to Ecomodernism, Developmentalism, Technocratic Centralism, and Developmental Authoritarianism; centralist Specialists require an additional authority construct                                           | Direct three-item core exists; preserve accountable-expertise boundary and test against confidence in science, bureaucracy, and centralization             | Retain as scored Modifier                                                    |
| `nationalism`              | Parent domain node: National Orientation                                                               | Cross-host domain, not a single independent scalar; its facets have different portability and sensitivity                                                                          | Relates to National Conservatism, Civic and Ethnocultural membership, Religious Nationalism, Black Nationalism, Zionism, Pan-Africanism, Indigenism, and anti-colonial traditions                                  | Catalog-only; develop a versioned multi-facet module; no aggregate until dimensionality and discriminant evidence support it                               | Retain ID; rename vNext canonical display to National Orientation            |
| `populism`                 | Parent domain node: People-versus-Elite Frame                                                          | Cross-host domain, not a validated single scalar; people, elite, pluralism, sovereignty, and style may separate                                                                    | Relates to Radical Democracy, Social Democracy, Democratic Socialism, National Conservatism, Agrarian Populism, Left/Right configurations, and Welfare Chauvinism                                                  | Catalog-only; develop direct thin-ideology items and test subscale structure before ordinary output                                                        | Retain ID; rename vNext canonical display to People-versus-Elite Frame       |
| `transhumanism`            | Cross-cutting human-enhancement and technology-future orientation                                      | Potentially portable across liberal, libertarian, socialist, green, conservative, and technocratic hosts; present label bundles too many technology questions                      | Relates to Techno-Anarchism, Ecomodernism, Accelerationism, Technocratic Centralism, and technology-governance contexts                                                                                            | Catalog-only; require direct multi-item separation of enhancement, access, safety, privacy, surveillance, and coercion                                     | Retain as research Modifier candidate                                        |

### 8.1 Roster totals and role decisions

| vNext disposition                                                                          | IDs                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Retain as ordinary scored Modifier under the existing v13 direct contract                  | `anti-imperialism`, `cosmopolitanism`, `civil-libertarianism`, `decentralist-orientation`, `feminist-orientation`, `multiculturalism`, `technocratic-orientation`                                                                 |
| Retain as conceptual Modifier or domain/subdimension, with measurement hold                | `civic-nationalist`, `communitarianism`, `economic-nationalism`, `ethnonationalist`, `fiscal-conservatism`, `internationalism`, `nationalism`, `populism`, `progressivism`, `regionalism`, `social-conservatism`, `transhumanism` |
| Retain in the graph but demote from independent Modifier endpoint to configuration/project | `expansionist-nationalism`, `left-wing-nationalism`, `left-wing-populism`, `right-wing-populism`, `separatist-nationalism`                                                                                                        |
| New Modifier labels added                                                                  | None                                                                                                                                                                                                                              |
| Current v13 runtime role changed now                                                       | None                                                                                                                                                                                                                              |

The demotions are conceptual and prospective. They do not delete IDs or alter
v13 results. A later vNext resolver may expose a configuration label only when
its components and evidence contract are satisfied.

### 8.2 Canonical definitions and rename/merge decisions

These definitions are the authoritative vNext conceptual boundaries for the
current IDs. They are not psychometric claims and do not imply that every
definition is currently measurable.

| ID                         | Canonical vNext definition                                                                                                                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `anti-imperialism`         | Opposition to colonial, imperial, militarily imposed, or structurally dependent domination of political communities, with concern for their self-determination and equal standing.                                                                                       |
| `civic-nationalist`        | A membership-basis orientation in which national belonging is grounded primarily in citizenship, civic commitment, shared institutions, or public law rather than descent alone.                                                                                         |
| `communitarianism`         | An orientation that treats persons, obligations, and political judgment as partly constituted through social relationships, communities, traditions, and shared goods, while leaving the status of rights and pluralism open.                                            |
| `cosmopolitanism`          | A moral-scope orientation that grants persons equal concern across national boundaries and permits layered or transnational membership without deciding one border, state, or distributive regime.                                                                       |
| `civil-libertarianism`     | A rights-constraint orientation giving strong default protection to expression, privacy, association, conscience, due process, protest, and bodily autonomy against political or administrative power.                                                                   |
| `decentralist-orientation` | A preference for dispersed, locally responsive, plural, polycentric, or contestable authority rather than unnecessary concentration in one territorial or administrative center.                                                                                         |
| `economic-nationalism`     | An orientation that gives national productive capacity, domestic capability, strategic supply, or economic autonomy special political importance, without determining ownership or welfare policy.                                                                       |
| `ethnonationalist`         | A membership-boundary orientation that gives descent, ethnicity, inherited cultural identity, or ethnocultural continuity a central role in defining the nation or political membership; its exclusionary, emancipatory, and assimilationist variants must be separated. |
| `expansionist-nationalism` | A territorial-national project that treats expansion of territory, influence, sovereignty, or political control as a national aim or duty.                                                                                                                               |
| `fiscal-conservatism`      | A public-finance disposition favoring sustainable debt, deficit restraint, fiscal rules, or constrained public finance, with tax level, spending composition, and austerity treated as separate questions.                                                               |
| `internationalism`         | An orientation toward obligations, cooperation, solidarity, and institutions across states or political communities without requiring cosmopolitan moral scope or a single world state.                                                                                  |
| `feminist-orientation`     | An orientation that treats gendered hierarchy, dependency, violence, care, reproduction, labor, or representation as politically significant and seeks to reduce or transform those structures without selecting one feminist school.                                    |
| `left-wing-nationalism`    | A configuration joining national self-determination or political community with egalitarian, anti-oligarchic, redistributive, or anti-colonial host commitments.                                                                                                         |
| `left-wing-populism`       | A configuration joining a people-versus-elite frame with egalitarian, anti-oligarchic, redistributive, or economically democratic host commitments.                                                                                                                      |
| `multiculturalism`         | An orientation toward equal civic standing alongside durable cultural plurality, voluntary cultural association, and accommodation of difference without prescribing one group-rights or autonomy regime.                                                                |
| `regionalism`              | A cross-cutting orientation that gives a subnational region political identity, authority, cultural standing, or institutional organization within, alongside, or against a larger political order.                                                                      |
| `right-wing-populism`      | A configuration joining a people-versus-elite frame with national, traditionalist, nativist, sovereigntist, market, welfare-boundary, or other right-host commitments.                                                                                                   |
| `separatist-nationalism`   | A territorial self-determination project favoring a distinct sovereign political unit or secession for a region or community rather than only cultural recognition, devolution, or shared-state autonomy.                                                                |
| `progressivism`            | A change orientation favoring deliberate social improvement through reform, inquiry, inclusion, experimentation, or institutional transformation, without specifying one complete ideology or policy package.                                                            |
| `social-conservatism`      | An orientation that gives inherited moral, family, cultural, or social institutions special value as sources of cohesion or flourishing and resists some progressive cultural changes without necessarily requiring theocracy, nationalism, or authoritarianism.         |
| `technocratic-orientation` | A preference for evidence-guided expertise and competent administration when it is transparent, contestable, accountable, and bounded by legitimate political authority.                                                                                                 |
| `nationalism`              | The structured domain of treating the nation as a valuable political community with some combination of attachment, continuity, solidarity, priority, sovereignty, membership boundary, or self-government.                                                              |
| `populism`                 | The structured domain of framing politics through an authentic people, a morally opposed elite, and claims about popular sovereignty, with pluralism, membership, and institutional style measured rather than assumed.                                                  |
| `transhumanism`            | An orientation toward deliberate scientific or technological enhancement of human capacities, health, longevity, or well-being, with voluntariness, access, safety, privacy, and coercion left as separate constructs.                                                   |

No current Modifier is merged with a neighbor merely because the labels
correlate. `nationalism` and `populism` are renamed at the vNext canonical
display layer but retain their IDs. The three left/right configuration labels
and the two territorial labels are moved to configuration/project status, not
merged into a new generic label. No current ID is retired, and no new Modifier
is added.

## 9. Discriminant-feature and non-equivalence matrix

| Neighboring objects                                 | Discriminating feature required                                                                          | Common contamination to prevent                                                                            |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| National Orientation vs Cosmopolitanism             | National political priority and solidarity versus equal moral concern beyond nationality                 | Treating any border concern, patriotism, or foreign aid view as one of the two                             |
| National Orientation vs Internationalism            | Nation as political community versus cross-border cooperation and institutions                           | Treating sovereignty and cooperation as mutually exclusive                                                 |
| National Orientation vs Civic Nationalism           | National salience/priority versus basis of membership                                                    | Calling equal citizenship civic nationalism without national priority                                      |
| Civic vs Ethnocultural Membership                   | Citizenship/commitment/residence versus ancestry, descent, ethnicity, or inherited culture               | Treating civic membership as automatically liberal or ethnocultural membership as one exclusionary program |
| Sovereignty vs Separatism                           | General self-government/non-domination versus independent statehood                                      | Calling decentralization or cultural autonomy separatism                                                   |
| Separatism vs Regionalism                           | Statehood/secession preference versus regional identity or authority within a larger order               | Inferring a statehood project from federalism or regional pride                                            |
| Expansion Orientation vs Anti-imperialism           | Territorial projection or dominance versus opposition to external domination                             | Using military strength, defense, or international influence as a proxy                                    |
| Economic Nationalism vs Fiscal Conservatism         | National productive/strategic priority versus public-finance restraint                                   | Treating tariffs, taxes, austerity, and ownership as one dimension                                         |
| Economic Nationalism vs Protectionism               | National autonomy and productive capacity versus a particular trade instrument                           | Inferring national orientation from one tariff preference                                                  |
| Populism vs Radical Democracy                       | Moral people/elite antagonism and pluralism boundary versus democratic participation and popular control | Treating every participatory or majoritarian view as populist                                              |
| Anti-elitism vs Institutional Accountability        | Elite as morally corrupt bloc versus ordinary checks, transparency, and oversight                        | Calling criticism of bureaucracy or inequality populism                                                    |
| Anti-pluralism vs Popular Sovereignty               | Opponents excluded from legitimate people versus authorization by citizens                               | Folding majoritarian preference into anti-pluralism                                                        |
| Left/Right Populism vs Populism                     | Host economy, membership, culture, authority, and redistribution beyond thin populist facets             | Using “left” or “right” as a substitute for direct host measurement                                        |
| Civil-libertarianism vs Liberalism                  | Rights constraint versus a complete tradition including political economy and state role                 | Inferring market or minimal-state views from civil liberties                                               |
| Decentralism vs Anarchism                           | Distributed authority within accountable institutions versus rejection of coercive hierarchy/state       | Inferring an anarchist tradition from localism                                                             |
| Technocratic Orientation vs Technocratic Centralism | Contestable expertise versus concentrated expert authority                                               | Promoting the Specialist from evidence confidence alone                                                    |
| Feminist Orientation vs Formal Equality             | Gendered structures, power, dependency, and liberation versus equal legal treatment alone                | Treating any anti-discrimination view as a feminist orientation                                            |
| Multiculturalism vs Tolerance/Cosmopolitanism       | Institutional accommodation and equal status for cultural difference                                     | Treating generic non-hostility or universalism as multiculturalism                                         |
| Social Conservatism vs Theocracy                    | Social/moral traditionalism versus final religious legal authority                                       | Inferring theocratism from religion or family traditionalism                                               |
| Communitarianism vs Social Conservatism             | Embedded personhood and common goods versus inherited moral/social order                                 | Treating community language as traditionalism                                                              |
| Progressivism vs Social Liberalism                  | Change/improvement orientation versus a complete liberal host                                            | Treating support for one reform as progressivism                                                           |
| Transhumanism vs Technological Optimism             | Normative human enhancement orientation versus confidence in technology generally                        | Treating privacy, automation, or science confidence as transhumanism                                       |

## 10. Current coverage gaps

The current bank supports direct output only for the seven constructs listed in
Section 2. The remaining gaps are:

| Gap                                  | Affected labels                                             | Required item family before scoring                                                                                                  |
| ------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| National salience and priority       | `nationalism`, `civic-nationalist`, `ethnonationalist`      | National attachment, priority, continuity, membership basis, assimilation, minority standing, and competing cosmopolitan obligations |
| Sovereignty, autonomy, and statehood | `regionalism`, `separatist-nationalism`, `anti-imperialism` | Autonomy, federation, confederation, independence, external domination, and domestic coercion                                        |
| Territorial projection               | `expansionist-nationalism`                                  | Expansion, irredentism, empire, influence, force, and defensive limitation                                                           |
| Economic nationalism                 | `economic-nationalism`                                      | Strategic autonomy, domestic capacity, trade protection, ownership, supply resilience, and distribution                              |
| Populist thin ideology               | `populism`, `left-wing-populism`, `right-wing-populism`     | People-centrism, anti-elitism, anti-pluralism, popular sovereignty, and institutional style                                          |
| Fiscal orientation                   | `fiscal-conservatism`                                       | Debt, deficit, tax, spending composition, rules, and austerity                                                                       |
| International cooperation            | `internationalism`                                          | Cross-border obligation, institutional cooperation, solidarity, intervention, and world-government boundaries                        |
| Communitarianism                     | `communitarianism`                                          | Embedded personhood, common goods, social bases, rights, and pluralism                                                               |
| Social traditionalism                | `social-conservatism`                                       | Non-theocratic, non-nationalist norms, institutions, cultural change, and enforcement                                                |
| Progressive change                   | `progressivism`                                             | Improvement, reform, inquiry, inclusion, institutional experimentation, and rupture/increment distinctions                           |
| Regionalism                          | `regionalism`                                               | Regional identity, authority, devolution, federalism, and statehood                                                                  |
| Human enhancement                    | `transhumanism`                                             | Enhancement, voluntariness, access, safety, privacy, surveillance, and coercion                                                      |

Relevant existing questions may be used as candidate content during research,
but their topical presence does not make them declared indicators. A future
module must record exact item IDs, direction, rationale, layer, source scope,
and construct boundary before it can enter a measurement version.

## 11. Measurement, scoring, and display requirements

### 11.1 Measurement status is independent of conceptual standing

The vNext registry must carry separate fields for:

- `conceptualKind`;
- `domainId` and subdimension IDs;
- graph relations;
- `currentV13Role` and `currentV13MeasurementStatus`;
- `vNextMeasurementReadiness`;
- direct indicator set and minimum evidence;
- sensitive-content and focused-module policy;
- public display policy;
- respondent-validation state.

An entry may therefore be a coherent broad tradition or cross-cutting facet
while remaining catalog-only, research-only, or focused-follow-up.

### 11.2 Ordinary scoring

Until a later implementation decision says otherwise:

- only declared direct indicators may feed an ordinary Modifier match;
- at least two substantive direct indicators are required;
- the current fit, evidence, and uncertainty thresholds remain in force;
- missing, invalid, refused, and non-substantive responses are not imputed;
- Primary axes, Primary centroids, host traditions, and neighboring Modifier
  scores cannot supply missing evidence;
- a domain score cannot be created by averaging or summing child facets without
  a separately approved estimand and respondent study;
- a configuration cannot be displayed from a name match or from co-occurrence
  in a hand-authored profile.

### 11.3 Display

Current v13 display behavior remains frozen. A future vNext display may show:

- a bounded Modifier construct with its construct name and evidence coverage;
- a domain or subdimension as explanatory structure only when the underlying
  construct is directly measured;
- a derived configuration only with a versioned resolver, complete component
  evidence, and non-identity profile-similarity language.

It must not display a domain as a complete ideology, a configuration as a
validated identity, or a catalog label as measured merely because sources or
historical significance exist.

### 11.4 Promotion gates

Promotion from conceptual/catalog status to scored or displayed use requires:

1. expert content review of definition, boundaries, and nearest neighbors;
2. cognitive interviews demonstrating that respondents interpret the intended
   construct rather than a label cue or one policy;
3. direct construct coverage with exact item provenance and layer metadata;
4. item-quality, missingness, salience, and response-process checks;
5. reliability or an explicitly justified alternative information analysis;
6. dimensionality and discriminant tests against neighboring constructs;
7. test-retest or other temporal-stability evidence where the construct is a
   disposition;
8. criterion interpretation and convergent/divergent evidence where suitable;
9. fairness, scope, language, and invariance review;
10. held-out replication and reproducible versioned analysis;
11. presentation-value review for any new public label or configuration.

Synthetic prototypes, centroid recovery, software tests, theoretical elegance,
source coverage, and hand-coded historical profiles cannot satisfy these gates.

## 12. Specialist architecture consequences

Conceptual breadth does not force a Specialist into the Modifier layer. The
following existing Specialists may be broad or historically consequential
traditions, but remain Specialist objects until their own evidence contract is
met:

| Specialist family                                                          | Conceptual standing                                                                           | Modifier relationship                                                                                            | Current decision                                                                                           |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Liberal, Radical, Socialist, Black, Queer, and Anarcha-Feminist traditions | Subtype traditions with internal schools, not generic gender facets                           | Express or refine `feminist-orientation`                                                                         | Retain Specialist role and focused modules; no promotion to generic Modifier                               |
| Black Nationalism, Pan-Africanism, Indigenism                              | Broad identity/self-determination or transnational traditions in particular historical scopes | Configure National Orientation, membership, sovereignty, anti-imperialism, multiculturalism, or internationalism | Retain Specialist identity-sovereignty treatment; do not collapse into `ethnonationalist` or `nationalism` |
| Zionism, Hindutva, Religious Nationalism                                   | Compound national-religious traditions with internal historical and institutional variation   | Configure National Orientation, membership, social order, religion, and sovereignty                              | Retain Specialist module; no generic religious-national Modifier added                                     |
| Pan-Arabism, Baʿthism, Arab Socialism                                      | Regional/historical compound traditions                                                       | Relate to National Orientation, Internationalism, Economic Nationalism, and Socialism                            | Retain regional Specialist distinctions                                                                    |
| Agrarian Populism and Welfare Chauvinism                                   | Host/configuration objects with populist or welfare-membership components                     | Relate to Populism, National Orientation, economic distribution, and membership boundaries                       | Retain Specialist/configuration status; no shortcut to left/right populism                                 |
| Technocratic Centralism and Developmental Authoritarianism                 | Institutional or regime projects                                                              | Require Technocratic Orientation plus authority/centralization or developmental constructs                       | Retain Specialist status; never infer from ordinary technocratic score                                     |
| Democratic Confederalism, Libertarian Municipalism, Bioregionalism         | Institutional and organizational projects                                                     | Express Decentralist Orientation, Regionalism, sovereignty, and ecological facets                                | Retain Specialist/context distinctions                                                                     |
| Green, socialist, conservative, and anarchist variants                     | Family subtypes and compound traditions                                                       | Configure economic, authority, social, ecological, or national facets                                            | Retain existing Specialist modules and Primary architecture                                                |
| Technology-governance Specialists                                          | Projects or institutional visions, not generic enhancement attitudes                          | Relate to Transhumanism, Technocratic Orientation, decentralism, and rights                                      | Retain Specialist/context distinction                                                                      |

No Specialist is promoted in this review. A Specialist may nevertheless be
conceptually broader than a particular Modifier; conceptual standing and
measurement readiness remain independent.

The [definitive Specialist architecture review](vnext-specialist-architecture-review-2026-08.md)
now controls the detailed Specialist kind, family-graph, module, assignment,
and validation treatment. Modifier-to-Specialist edges must reference that
registry rather than treating a Specialist label as an untyped Modifier
variant.

Context relations are now controlled by the
[definitive Context architecture review](vnext-context-architecture-review-2026-08.md).
Context objects may express, institutionalize, or frame Modifier constructs,
but they are not Modifier aggregates and do not create direct Modifier scores.

## 13. Consequences for the approved Primary architecture

The approved 16-Primary roster remains unchanged. The Modifier review makes the
following clarifications binding for later Primary implementation:

- National Conservatism is not represented as generic National Orientation plus
  Social Conservatism by default. Its M1 case remains a historically coherent
  Primary configuration whose residual value must be tested beyond M0.
- Liberal Conservatism is not represented as generic liberal, conservative,
  civic-national, or fiscal facets by default. Its M1 case remains subject to
  the approved compositional-residual test.
- Conservative, Christian Democrat, Republicanism, and National Conservatism
  may share social, national, fiscal, religious, or communitarian facets, but
  those shared facets do not erase Primary-level differences.
- Radical Democracy and Populism may share popular sovereignty, but direct
  participation, pluralism, institutional contestation, and people-versus-elite
  antagonism must remain distinct constructs.
- Green Politics may share anti-imperial, feminist, multicultural,
  decentralist, internationalist, or technological facets with other hosts;
  none of those shared facets is a replacement for the Green Primary.
- Liberal, socialist, anarchist, and conservative Primaries may host
  civil-libertarian, feminist, communitarian, social-conservative,
  technocratic, or economic-national facets without changing the Primary
  roster.
- No Modifier may be used to impute a missing Primary axis, satisfy a Primary
  required-core gate, or establish M1 residual structure.

The earlier Primary review’s initial six-domain sketch is superseded as a
planning description by the definitive hierarchy in Section 4. The Primary
review remains authoritative for its roster, compositional-residual decisions,
and respondent-validation gates.

## 14. Unresolved questions

1. Do national salience, national priority, and continuity form one useful
   construct or several scope-specific constructs?
2. Can civic and ethnocultural membership be measured as a meaningful contrast
   without implying that all civic nationalism is liberal or all ethnocultural
   nationalism is exclusionary?
3. Does Populism support one thin construct, multiple subscales, or a profile
   whose facets should remain separate?
4. Is anti-pluralism a constitutive populist facet in the target scope, a
   distinct democratic-authority construct, or both through typed relations?
5. Which regionalism cases are identity boundaries, institutional preferences,
   or separatist projects?
6. Does Progressivism add incremental measurement beyond host Primaries and
   existing change/cultural constructs?
7. Does Communitarianism add value beyond social embeddedness, common-good,
   republican, religious, and welfare constructs already in the bank?
8. Can a safe ordinary construct be built for expansion orientation, or should
   it remain a focused historical/project module?
9. Which Specialist traditions require scope-specific language or community
   review before any respondent-facing module is expanded?
10. What public display, if any, helps respondents understand a configuration
    without turning it into an identity or validity claim?
11. What vNext graph and role-resolver schema can preserve every v13 ID and
    historical relation without reinterpreting old records?

## 15. Implementation handoff

The next implementation stage may proceed only as versioned research/scaffolding
until a separate production decision is approved:

1. add a vNext Modifier ontology registry without mutating v13 role arrays;
2. add domain, subdimension, configuration, Specialist, host, and
   non-equivalence relations;
3. preserve current `modifierMeasurement` definitions and direct matcher;
4. define research-only item manifests for National Orientation, Populism,
   fiscal orientation, Internationalism, Regionalism, Communitarianism,
   Social Conservatism, Progressivism, and Transhumanism;
5. route sensitive membership, statehood, expansion, and configuration labels
   through focused modules or derived resolvers rather than ordinary scoring;
6. version every new question set, source/context record, resolver, display
   contract, and research record;
7. run content, cognitive, psychometric, criterion, fairness, and replication
   gates before promotion;
8. record any future change as a new methodological decision rather than
   silently modifying this architecture or the frozen baseline.

The construct blueprint is now the required semantic and measurement-design
dependency for this handoff. Modifier manifests must reference its construct
and facet IDs, preserve direct-indicator provenance, and distinguish a
cross-host construct from a derived host description.

## 16. Source and authority record

This review uses the following local authorities and references:

- [Measurement Architecture Specification](measurement-architecture-specification-2026-08.md)
- [Measurement Architecture Implementation Specification](measurement-architecture-implementation-specification-2026-08.md)
- [Cumulative Methodological Change Decision Log](methodological-change-decision-log-2026-08.md)
- [vNext Taxonomy and Primary Architecture Review](vnext-taxonomy-measurement-architecture-review-2026-08.md)
- [vNext Construct Architecture and Measurement Blueprint](vnext-construct-architecture-measurement-blueprint-2026-08.md)
- [Modifier Measurement Scope Audit](modifier-measurement-scope-audit-2026-08.md)
- [Modifier Source-Correction Pass](modifier-source-correction-pass-2026-08.md)
- `src/data/labelTaxonomy.ts`
- `src/data/modifierMeasurement.ts`
- `src/scoring/modifierConstructMatch.ts`
- `src/data/constructFamilies.ts`
- `src/data/domains.ts` and `src/data/axes.ts`

These sources support conceptual definitions, boundaries, current coverage,
and implementation constraints. They do not establish respondent validity.
