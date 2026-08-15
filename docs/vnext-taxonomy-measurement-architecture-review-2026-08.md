# vNext ideological taxonomy and measurement architecture review — 2026-08

Status: cumulative vNext design record; the frozen Measurement Architecture
and its implementation baseline remain unchanged.

Frozen implementation baseline: `f0324dbf27dfc6e35ff557992e4643e3df15ee0e`

This record adjudicates the completed taxonomy Deep Research against the
approved Measurement Architecture, the current repository, the completed
taxonomy research, and the prior methodological decision log. It authorizes
architecture and research planning only. It does not promote a label, change
the ordinary scorer, alter the effective question bank, or convert any
synthetic result into evidence of respondent validity.

## Executive disposition

The Deep Research recommendations are compatible with the frozen architecture
when implemented as a new conceptual layer above the existing role-aware
registries. No genuine contradiction requiring reopening the frozen
Measurement Architecture was found.

The vNext conceptual Primary roster retains all 16 current Primary objects.
Fourteen have stable broad-family or broad-tradition standing. National
Conservatism and Liberal Conservatism remain named Primary candidates, but are
explicitly classified as compound or bridge traditions. Their independent M1
measurement is not accepted merely because a plausible centroid or current
scope exists. The current production role remains frozen until a separate
versioned role decision is made.

No current Specialist is promoted in this record. Several Specialists are
recognized as conceptually broad traditions or historically consequential
families, but their conceptual standing is separated from measurement
readiness and public role.

The immediate next implementation stage is Modifier architecture: define
facets, domains, subdimensions, host relationships, and direct construct
coverage without turning modifiers into latent substitutes for Primary
traditions.

## Authority and category separation

The following categories are authoritative for different questions and must
not be collapsed:

| Category                      | Authoritative decision in this record                                                                                                                               | What it does not establish                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Conceptual / political theory | What kind of ideological object a label is, what defines it, how it relates to other objects, and whether it has a coherent historical morphology                   | That respondents recognize the object, that a score is reliable, or that the object deserves an ordinary result |
| Measurement design            | Which constructs and facets are necessary, which current items cover them, what gates and abstention rules apply, and what M0/M1 comparison is being tested         | That the constructs are empirically unidimensional, reliable, invariant, or predictive                          |
| Empirical respondent evidence | Cognitive interpretation, response process, reliability, test-retest behavior, criterion performance, calibration, false positives, incremental value, and fairness | A replacement for conceptual definition or source-backed historical scholarship                                 |
| Implementation                | Versioned registries, graph schemas, derived-role views, question metadata, scoring adapters, compatibility behavior, and validation checks                         | Political validity, psychometric validity, or permission to reinterpret historical records                      |

The current production identifiers remain frozen: taxonomy
`2026-08-taxonomy-v13`, primary measurement
`2026-08-primary-core-v1`, modifier measurement
`2026-08-modifier-construct-v1`, scoring
`2026-08-13-taxonomy-v8`, and runtime decision-log bundle
`2026-08-methodological-decisions-v1`. A vNext identifier must be introduced
only when an implementation change is approved.

## 1. Deep Research recommendation adjudication

| Recommendation                                                                                         | Disposition                 | Rationale                                                                                                                                                                                                                                           | Dependencies                                                                                       | Downstream consequence                                                                                                             |
| ------------------------------------------------------------------------------------------------------ | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Preserve Primary / Specialist / Modifier / Context as useful public product roles                      | **Adopt**                   | This is already consistent with the frozen role boundary and prevents catalog breadth from being mistaken for ordinary measurement readiness.                                                                                                       | None beyond preserving current role/version contracts                                              | Keep the current public surfaces during vNext development; add conceptual kinds and readiness as separate metadata.                |
| Separate conceptual ontology from measurement readiness                                                | **Adopt**                   | The frozen architecture already separates role and measurement-status fields, but vNext must make conceptual kind, readiness, and public role independently addressable.                                                                            | New ontology and status registries                                                                 | A historically important Specialist can remain conceptually broad without becoming an ordinary result.                             |
| Represent ideological relationships through a faceted polyhierarchical graph                           | **Adopt with modification** | Current typed relations are a sound start, but `parentId` is single-parent and cannot represent overlapping, hybrid, regional, historical, and facet-specific relations without false hierarchy.                                                    | Versioned graph schema; relation symmetry and acyclicity checks where applicable                   | Replace universal parentage with typed multi-edge relations in vNext; do not rewrite v13 historical metadata.                      |
| Introduce explicit conceptual kinds independently from measurement status                              | **Adopt**                   | A family anchor, compound tradition, institutional project, and cross-cutting orientation can each be measured at different readiness levels.                                                                                                       | Controlled `conceptualKind` vocabulary                                                             | Every label receives a kind before any role or score is derived.                                                                   |
| Treat public roles as derived views over conceptual type, taxonomic relations, and measurement status  | **Adopt with modification** | This is the correct vNext direction, but the frozen v13 arrays remain implementation authority for historical compatibility.                                                                                                                        | New derived-view resolver; explicit high-risk and presentation policy                              | vNext may derive a role, but it must not silently reinterpret v13 records or assignments.                                          |
| Organize Modifiers into explicit domains and subdimensions                                             | **Adopt**                   | The current modifier list is useful but flat. Domain and subdimension metadata will prevent a modifier from being treated as a complete ideology or an undifferentiated latent factor.                                                              | Modifier ontology, direct-construct registry, host and non-equivalence relations                   | This is the next implementation stage; direct measurement and abstention gates remain mandatory.                                   |
| Distinguish heterogeneous Specialist types internally                                                  | **Adopt with modification** | “Specialist” currently contains subtypes, historical currents, regime projects, institutional proposals, and focused cross-cutting traditions. These need different evidence and presentation rules without creating extra public roles by default. | Conceptual kinds and module-specific evidence contracts                                            | Specialist modules can report whether they measure a tradition, variant, project, or facet profile.                                |
| Apply a compositional-residual test to compound Primary candidates                                     | **Adopt**                   | A named conjunction should not become a Primary merely because two existing scores can be combined. It needs historical coherence, non-additive ordering, multi-domain structure, and a discriminating residual.                                    | M0/M1 construct plans, incremental respondent study, clear criterion records                       | National Conservatism and Liberal Conservatism remain explicit residual cases; future compounds use the same test.                 |
| Measure constructs/facets first and treat ideological traditions as configurations of those constructs | **Adopt with modification** | This is compatible with the crossed construct map and layer separation, but configurations must not be presented as empirically validated profiles until respondent evidence supports them.                                                         | Construct-family map, item-level metadata, layer-specific estimation, content and cognitive review | Questions and scoring are authored around constructs first; traditions become interpretable configurations with evidence coverage. |
| Retain empirical latent-class/profile models as challenger models                                      | **Adopt**                   | D-19 already permits exploratory latent profiles/classes/networks. They are useful challengers to named-label configurations but cannot replace the conceptual taxonomy or production scorer without a later evidence-backed decision.              | Preregistered profile models, held-out evaluation, criterion and fairness gates                    | Report model comparison as research output; preserve named-tradition and construct interpretations separately.                     |

### Adjudication boundary

No recommendation is rejected or deferred in its entirety. Recommendations
that touch production meaning are adopted only as research-only or
version-gated architecture, and every independent-label promotion remains
deferred pending respondent evidence.

The recommendations do not authorize any of the following: changing the
current Primary roster in code, adding a global axis solely to fit a label,
using a modifier as an imputed Primary construct, inferring validity from
centroid recovery or software tests, using self-identification as a production
answer key, or replacing profile-similarity language with diagnosis or
posterior language.

## 2. Proposed vNext conceptual ontology

### 2.1 Label node

Every catalog object should have an ontology node with at least:

- stable identifier and historical aliases;
- canonical name and alternate names;
- `conceptualKind`, independent of role and measurement status;
- constitutive facets, optional associated facets, and explicitly non-constitutive facets;
- layer relevance: normative, descriptive, prescriptive, or a declared combination;
- historical and geographic scope;
- canonical definition and boundary statement;
- source records scoped to definition, boundary, history, or interpretation;
- typed graph relations;
- current public-role view and measurement-status view, both versioned;
- respondent-evidence requirements and unresolved claims.

### 2.2 Conceptual kinds

The initial controlled vocabulary is:

| Kind                              | Definition                                                                                                                            | Examples in this roster                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `family-anchor`                   | Broad family node that organizes multiple internally heterogeneous traditions without selecting one subtype                           | Conservative, Green Politics, Right-Libertarianism, Marxian Socialism      |
| `broad-tradition`                 | Durable tradition with a recognizable cross-domain normative, descriptive, or prescriptive morphology                                 | Classical Liberalism, Republicanism, Social Liberalism, Social Democracy   |
| `compound-tradition`              | Named tradition whose components are historically fused and whose combination may have a non-additive ordering or institutional logic | Democratic Socialism, Marxism-Leninism, National Conservatism              |
| `bridge-tradition`                | A historically recurring synthesis that mediates between established families and may be described by more than one word order        | Liberal Conservatism / Conservative Liberalism, Christian Democracy        |
| `hybrid-configuration`            | A configuration made from otherwise separable traditions or facets, without necessarily being a durable peer-level tradition          | Future compound candidates and some historical hybrids                     |
| `cross-cutting-orientation`       | Commitment that can attach to multiple hosts and does not by itself organize a complete political program                             | Nationalism, Populism, Feminist Orientation, Social Conservatism           |
| `subtype-tradition`               | Narrower school, tendency, or historical variant inside a broader family                                                              | Maoism, Trotskyism, Mutualism, One-Nation Conservatism                     |
| `regional-historical-variant`     | Tradition whose meaning depends materially on region, period, movement, or language context                                           | Ba'athism, Hindutva, Kemalism, Pan-Africanism                              |
| `institutional-project`           | Proposed institutional arrangement or governance mechanism rather than a complete ideology                                            | Liquid Democracy, World Federalism, Platformism, Constitutional Monarchism |
| `strategy-or-program`             | Policy, economic regime, or strategy that may be ideologically important without being a complete tradition                           | Georgism, Participism, Universal Basic Income Advocacy                     |
| `regime-or-authoritarian-project` | Historically bounded political project or regime-oriented synthesis requiring high-risk content boundaries                            | Fascist Authoritarianism, National Socialism, National Bolshevism          |
| `intellectual-current`            | Named analytical or intellectual current whose public meaning may be contested or historically variable                               | Neoliberalism, Ordoliberalism, Fourth Political Theory                     |

Kinds are conceptual classifications. They do not imply an ordinary score,
respondent familiarity, or measurement readiness.

### 2.3 Faceted polyhierarchical graph

The vNext graph should support multiple non-exclusive edges. Suggested edge
types are:

| Relation                                      | Meaning                                                             | Constraint                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `subtype_of`                                  | A narrower tradition inherits a broader family boundary             | Acyclic within a declared family facet; not a synonym for “often associated with” |
| `family_member_of`                            | Membership in a broad family without full subtype inheritance       | May be many-to-many                                                               |
| `hybrid_of`                                   | A named object combines two or more traditions or facets            | Does not imply that the hybrid is reducible to those inputs                       |
| `configures`                                  | A tradition organizes or orders a facet in a characteristic way     | Used for residual structure, not just correlation                                 |
| `often_combines_with`                         | Empirically or historically recurring co-occurrence                 | Never a constitutive requirement by itself                                        |
| `overlaps_with`                               | Shared constructs or historical field without identity              | Symmetric in the derived graph                                                    |
| `contrasts_with`                              | Boundary-defining difference                                        | Must state the differentiating facet or construct                                 |
| `requires`                                    | A declared constitutive condition for a candidate profile           | Measurement gate only when separately authorized                                  |
| `regional_variant_of`                         | Regional or historical variant of a broader object                  | Does not erase local morphology                                                   |
| `historical_predecessor_of` / `influenced_by` | Historical relation                                                 | Not a conceptual subtype claim                                                    |
| `institutionalizes`                           | A tradition gives institutional form to a construct or ideal        | Does not establish that every adherent supports the institution                   |
| `not_equivalent_to`                           | Explicit non-equivalence needed to prevent a common false inference | Required for high-risk or frequently conflated labels                             |

Each relation may carry facets for domain, layer, historical period, region,
and evidence scope. A node can therefore be a family member of multiple
families, a hybrid of multiple objects, and a modifier host without being
forced into one parent.

### 2.4 Readiness and role views

The conceptual node, measurement status, and public role are separate views:

| View               | Proposed values                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Conceptual kind    | Controlled vocabulary above                                                                                                              |
| Measurement status | `conceptual-only`, `content-specified`, `bank-covered`, `research-provisional`, `respondent-validated`, `production-approved`, `retired` |
| Public role        | `primary`, `specialist`, `modifier`, `context`, `retired`                                                                                |

The current v13 registry remains the historical production view. The vNext
resolver may derive a new role only from a versioned policy that considers
conceptual kind, graph relations, evidence status, high-risk boundaries,
direct construct coverage, and approved presentation rules.

## 3. Authoritative conceptual Primary roster

The following is the vNext conceptual roster. “Retain” means retain as a
named Primary object in the conceptual taxonomy; it does not mean that the
current score is psychometrically validated. All 16 labels remain in the
frozen production roster until a later implementation decision.

| Primary                                | Conceptual kind      | Historical / morphological coherence                                                                                                                                                     | Peer-level granularity                                                                                                | Canonical definition                                                                                                                                                                                                                                                                   | Disposition                                                                |
| -------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Conservative / Prudential Conservative | `family-anchor`      | High as a family of prudential arguments; internally plural across religion, nation, economy, and democracy                                                                              | Correct broad anchor; narrower conservative variants remain below it                                                  | A broad orientation that gives weight to inherited institutions, social continuity, prudence, and gradual change while leaving economic policy, religion, nationalism, and democratic design open to variation                                                                         | **Retain**                                                                 |
| Christian Democrat                     | `bridge-tradition`   | High; recurring democratic tradition grounded in Christian social thought, subsidiarity, solidarity, and social-market constitutionalism                                                 | Peer-level with other broad cross-domain traditions; not reducible to social conservatism or distributism             | A democratic constitutional tradition combining Christian social ethics, subsidiarity, civil-society institutions, family and community concerns, social-market economics, and welfare or labor protection                                                                             | **Retain**                                                                 |
| Classical Liberalism                   | `broad-tradition`    | High but historically variable; a recognizable tradition of liberty, property, contract, rule of law, and limited constitutional government                                              | Peer-level as an intellectual tradition, though close to Market Liberal and Right-Libertarianism                      | A liberal tradition centered on individual liberty, private property, freedom of contract, rule of law, and constitutionally limited government while allowing disagreement over public goods and the social minimum                                                                   | **Retain; keep distinct from Market Liberal by kind and historical scope** |
| Democratic Socialism                   | `compound-tradition` | High; the democratic-control and social-ownership combination is historically recurrent but internally plural                                                                            | Peer-level if the democratic-control residual is preserved; not merely Social Democracy plus equality                 | A tradition seeking democratic control or social ownership of major productive assets while rejecting authoritarian one-party rule and leaving ownership, strategy, and institutional form open to variation                                                                           | **Retain**                                                                 |
| Green Politics / Political Ecology     | `family-anchor`      | High as a broad ecological family; economic and strategic morphologies vary substantially                                                                                                | Correct broad anchor; Green subtraditions remain facet-specific                                                       | A broad ecological family treating environmental limits and the human relationship with the nonhuman world as central while leaving growth, markets, technology, governance, and strategy open                                                                                         | **Retain**                                                                 |
| Liberal Conservatism                   | `bridge-tradition`   | Moderate-to-high; recurring but cross-nationally unstable synthesis of liberal constitutionalism and conservative continuity                                                             | Peer-level only as a named bridge tradition; otherwise it is a derived configuration                                  | A conservative-family synthesis pairing social continuity and cautious reform with liberal constitutionalism, civil liberty, limited government, and a market economy                                                                                                                  | **Retain as a named candidate; M1 remains evidence-held**                  |
| Libertarian Socialism                  | `family-anchor`      | High as a broad anti-authoritarian socialist family spanning anarchist, councilist, autonomist, and related currents                                                                     | Correct broad socialist/anarchist bridge; narrower schools remain Specialists                                         | An anti-authoritarian socialism opposing both capitalist concentration and centralized state socialism and seeking worker self-management and federated, anti-hierarchical organization                                                                                                | **Retain**                                                                 |
| Market Liberal                         | `broad-tradition`    | High as a contemporary market-oriented institutional family distinct from both laissez-faire absolutism and right-libertarian statelessness                                              | Peer-level as a contemporary policy-intellectual family; close to Classical Liberalism                                | A market-liberal family giving strong priority to competitive markets, private enterprise, trade, property, and rule-governed economic policy while accepting an enabling state, public goods, macroeconomic institutions, and a limited safety net                                    | **Retain**                                                                 |
| Right-Libertarianism                   | `family-anchor`      | High as a broad property-and-state lineage, despite disagreement over minimal state versus statelessness                                                                                 | Correct broad anchor; anarcho-capitalism, minarchism, Georgism, and Objectivism remain distinct                       | A family emphasizing voluntary exchange, strong personal liberty, private or use-based property claims, and skepticism toward centralized authority while leaving state design and public goods open                                                                                   | **Retain**                                                                 |
| Marxian Socialism (Non-Leninist)       | `family-anchor`      | High as a Marxian family distinct from Leninist party-state organization; internally diverse over democracy, planning, markets, and transition                                           | Correct broad non-Leninist anchor                                                                                     | A Marxian socialist family focused on class power, social ownership or control of production, and transformation of capitalist institutions without assuming Leninist party-state organization                                                                                         | **Retain**                                                                 |
| Marxism-Leninism                       | `compound-tradition` | High as a historically consequential doctrine of vanguard party, centralized state power, revolutionary transition, and socialist transformation; national variants remain heterogeneous | Peer-level only with a strict family-level definition, not as a proxy for any historical regime                       | A tradition centering a disciplined vanguard party that seizes and wields centralized state power to abolish private capital and direct a planned or state-coordinated transition toward communism                                                                                     | **Retain with high-risk and constitutive gates**                           |
| National Conservatism                  | `compound-tradition` | Moderate-to-high; a contemporary and developing project with recurring national-sovereignty and cultural-continuity morphology but substantial movement variation                        | Borderline peer-level; valid only as an explicit compound candidate rather than generic Conservatism plus Nationalism | A conservative project that makes the nation-state and national sovereignty the primary political locus while treating cultural continuity and resistance to cosmopolitan or rapid redesign as constitutive concerns; economic, religious, and authoritarian positions remain variable | **Retain as a named candidate; M1 remains evidence-held**                  |
| Radical Democracy                      | `broad-tradition`    | High as a family of participatory, agonistic, deliberative, and anti-oligarchic theories                                                                                                 | Peer-level as a democratic theory tradition; not equivalent to low confidence in existing institutions                | A tradition treating concentrated institutional and economic power as a threat to self-rule and favoring expansive participation, contestability, and democratized authority beyond periodic elections                                                                                 | **Retain, but bounded by missing participatory constructs**                |
| Republicanism                          | `broad-tradition`    | High; a durable political theory of freedom as non-domination, civic self-government, and accountable public power                                                                       | Peer-level as a theory tradition; not a contemporary party label                                                      | A tradition treating freedom as security against arbitrary power and emphasizing civic self-government, rule of law, accountable institutions, and equal civic standing                                                                                                                | **Retain, but bounded by missing civic self-government constructs**        |
| Social Democrat / Social Democracy     | `broad-tradition`    | High as a policy-intellectual tradition of mixed economy, welfare, labor protection, and incremental reform; historical usage varies                                                     | Peer-level with Democratic Socialism, but the ownership and transition boundary must remain explicit                  | A tradition accepting a predominantly mixed economy and democratic institutions while tempering market outcomes through public services, progressive taxation, unions, and incremental reform                                                                                          | **Retain**                                                                 |
| Social Liberalism                      | `broad-tradition`    | High; a recognizable liberal family linking individual rights to positive liberty, effective opportunity, and pluralist public action                                                    | Peer-level with Classical and Market Liberalism; not Social Democracy by definition                                   | A liberal tradition accepting markets and private property while using targeted public action and redistribution to secure substantive opportunity and individual freedom                                                                                                              | **Retain**                                                                 |

### Roster-level retain / promote / demote / merge / rename decisions

| Action  | Decision                                                                                                                                                                                                                                                                                                                     |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Retain  | Retain all 16 current Primary objects conceptually. Keep the current production roster unchanged in this stage.                                                                                                                                                                                                              |
| Promote | Promote no Specialist to Primary. Conceptual breadth alone does not satisfy the respondent-validation gates.                                                                                                                                                                                                                 |
| Demote  | No immediate production demotion is authorized. National Conservatism and Liberal Conservatism receive a conditional M1 hold; if M1 fails the incremental evidence test, the next role decision should demote them to Specialist or derived configuration rather than retain a false independent endpoint.                   |
| Merge   | Merge no current Primary. Classical Liberalism, Market Liberal, and Right-Libertarianism are close but represent different conceptual kinds and historical scopes. Democratic Socialism, Social Democracy, Marxian Socialism, and Marxism-Leninism also require distinct ownership, organization, and transition boundaries. |
| Rename  | No identifier or public name is changed. Keep `liberal-conservatism` canonical and retain `conservative-liberalism` as the existing compatibility alias. Add alternate-name metadata in vNext rather than silently changing historical language.                                                                             |

## 4. Individual Primary architecture review

The following table records the constitutive constructs, genuinely
discriminating features, nearest Specialist relations, Modifier relations,
current scope coverage, and evidence still required. Item counts are counts of
active effective-bank items touching an axis, not reliability or validity
evidence. They are included to document coverage only.

| Primary               | Constitutive constructs and genuinely discriminating features                                                                                                                                                                                                                                      | Nearest Specialists / conceptual relations                                                                                                                       | Relevant Modifier domains and boundaries                                                                                                                                                        | Current effective-bank coverage and gap                                                                                                                                                                                                                                                                                             | Evidence still required                                                                                                                                                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Conservative          | Institutional continuity, prudential judgment, gradual change. Distinguish from Social Conservatism by not requiring a moral program; from National Conservatism by not requiring bounded national priority; from small government by not assuming an economic policy.                             | One-Nation, Paleoconservatism, Neoconservatism, Distributism; these are variants or adjacent projects, not required subtypes.                                    | Culture/order: Social Conservatism. Community: Nationalism and Regionalism. Economy: Fiscal Conservatism and Economic Nationalism.                                                              | Required `cultural-plasticity` 9 and `gradualism-vs-immediatism` 14; optional `reform-vs-revolution` 9. Missing dedicated institutional-prudence and inherited-practice construct.                                                                                                                                                  | Cognitive distinction between prudence, traditionalism, and status-quo preference; test-retest; criterion comparison with expert-coded conservative variants; DIF/invariance.                                                                       |
| Christian Democrat    | Christian social ethics, subsidiarity, solidarity, social-market order, constitutional democracy, intermediary associations. The residual is the integrated relation among religion, social protection, and dispersed authority, not religiosity alone.                                            | Christian Socialism, Distributism, Integralism, One-Nation Conservatism; overlap does not imply theocracy or dispersed productive ownership.                     | Religion/order: Religious Authority and Religious Nationalism must remain separate. Economy: Welfare and Fiscal Conservatism. Authority: Decentralist Orientation and Technocratic Orientation. | `property-legitimacy` 41, `equality-theory` 47, `centralization-preference` 62, `secularism-religious` 13. Missing direct subsidiarity, Christian social-ethical reasoning, intermediary-association, and constitutional-pluralism facets.                                                                                          | Response-process review of religious wording; independent criterion and expert codes; internal structure; test-retest; fairness and cross-country/language review.                                                                                  |
| Classical Liberalism  | Individual liberty, property, contract, rule of law, constitutional limits. Distinguish from Market Liberal by historical/intellectual scope and openness to public goods; from Right-Libertarianism by weaker anti-state commitment.                                                              | Ordoliberalism, Neoliberalism, Minarchism, Objectivism, Georgism; these are intellectual, policy, or narrower variants, not automatic subtypes.                  | Economy: Fiscal Conservatism, Market Governance, Property/Ownership facets. Authority: Civil Libertarianism and Decentralist Orientation.                                                       | `authority-legitimacy` 53, `property-legitimacy` 41, `liberty-noninterference` 96, `market-process-confidence` 11. Missing finer public-goods, property-acquisition, and state-function facets.                                                                                                                                     | Triad discrimination against Market Liberal and Right-Libertarianism; cognitive review of “limited government” and “market”; criterion, retest, DIF, and calibration.                                                                               |
| Democratic Socialism  | Social or democratic control of productive assets, anti-domination, democratic participation, and non-authoritarian transition. The residual is democratic control of ownership and power, not equality plus state action.                                                                         | Market Socialism, Council Communism, Participism, Socialist Feminism; they instantiate different ownership, workplace, or social-reproduction facets.            | Economy: Property, Equality, Redistribution, Labor/Workplace. Authority: Decentralist and Radical-Democratic facets. Strategy: Reform and Direct Action.                                        | `property-legitimacy` 41, `equality-theory` 47, `anti-domination` 106. Missing direct workplace self-management, democratic ownership, class structure, and institutional transition constructs.                                                                                                                                    | Incremental validity over Social Democracy and Marxian Socialism; criterion and expert codes; internal structure; retest; DIF; false-positive analysis.                                                                                             |
| Green Politics        | Nonhuman moral standing and ecological limits are constitutive; growth, technology, markets, authority, and strategy are facets, not inferred defaults.                                                                                                                                            | Deep Ecology, Degrowth Green, Ecosocialist, Ecomodernist, Green Capitalism, Bioregionalism, Eco-Authoritarianism; all require separate morphology.               | Ecology/technology: Green variants and Transhumanism are distinct. Economy: Market and Redistribution facets. Authority: Eco-Authoritarianism requires its own gate.                            | `human-nature-priority` has 11 active items and a minimum of 2 direct responses. Ordinary scope intentionally omits growth, technology, political economy, governance, and strategy.                                                                                                                                                | Cognitive review of ecological-standing items; multi-affinity module validation; criterion and profile calibration; retest; DIF; community-informed review where content is group-sensitive.                                                        |
| Liberal Conservatism  | Liberal rights, constitutional order, market economy, continuity, and cautious reform. The discriminating feature is the ordering: liberal institutions are used to preserve and adapt inherited order, rather than being merely additive liberal and conservative scores.                         | Ordoliberalism, One-Nation Conservatism, Neoconservatism, Paleoconservatism; the word-order field is historically unstable and must remain explicitly qualified. | Economy: Market and Fiscal Conservatism. Culture/order: Social Conservatism. Authority: Civil Libertarianism and Constitutionalism. Strategy: Gradualism.                                       | Required `property-legitimacy` 41, `liberty-noninterference` 96, `market-process-confidence` 11, `cultural-plasticity` 9; optional `gradualism-vs-immediatism` 14. Missing integrated constitutional-prudence and institutional-order facets.                                                                                       | M0/M1 incremental validity against Conservative plus liberal facets; wording and label-exposure experiments; criterion, retest, DIF, false positives, and cross-national name interpretation.                                                       |
| Libertarian Socialism | Anti-authoritarianism, anti-capitalist or social ownership, anti-domination, worker self-management, and federation. Distinguish from Right-Libertarianism by the property and class relation, not by the shared word “libertarian.”                                                               | Anarcho-Communism, Anarcho-Syndicalism, Council Communism, Mutualism, Individualist Anarchism, Anarcha-Feminism.                                                 | Economy: Social Ownership and Labor/Workplace. Authority: Decentralist Orientation and Civil Libertarianism. Strategy: Direct Action and Reform.                                                | `authority-legitimacy` 53, `property-legitimacy` 41, `equality-theory` 47, `anti-domination` 106, `centralization-preference` 62. Missing worker self-management, class structure, and organizational-form facets.                                                                                                                  | Incremental validity against Social Anarchism-related specialists and Marxian Socialism; module criterion; retest; DIF; multi-affinity modeling.                                                                                                    |
| Market Liberal        | Competitive markets, private enterprise, trade, property, enabling state, public goods, and limited safety net. The discriminating feature is market governance with an enabling state, not deregulation or anti-state politics.                                                                   | Neoliberalism, Ordoliberalism, Georgism, Third Way, Minarchism; each emphasizes a different state, property, or historical facet.                                | Economy: Fiscal Conservatism, Property, Regulation, Economic Nationalism. Authority: Civil Libertarianism and Technocratic Orientation.                                                         | Same four-axis core as Classical Liberalism: `authority-legitimacy` 53, `property-legitimacy` 41, `liberty-noninterference` 96, `market-process-confidence` 11. Missing public-goods, welfare, institutional-market, and state-function facets.                                                                                     | Triad discrimination; incremental value of authority and enabling-state items; criterion and retest; fairness; form equivalence.                                                                                                                    |
| Right-Libertarianism  | Strong non-interference, private or use-based property, voluntary exchange, exit, and skepticism of centralized coercion. The discriminating feature is the property-and-state lineage, not generic market support.                                                                                | Anarcho-Capitalism, Minarchism, Voluntaryism, Paleolibertarianism, Objectivism, Georgism, Agorism.                                                               | Economy: Property, Regulation, Fiscal Conservatism. Authority: Civil Libertarianism and Decentralist Orientation. Strategy: Exit and voluntary association.                                     | Same four-axis core: `authority-legitimacy` 53, `property-legitimacy` 41, `liberty-noninterference` 96, `market-process-confidence` 11. Missing property acquisition, public-goods, minimal-state/statelessness, and social-obligation facets.                                                                                      | Triad discrimination and false-positive separation from Anarcho-Capitalism; criterion, retest, DIF, and calibration with sparse/partial evidence gates.                                                                                             |
| Marxian Socialism     | Class structure, social ownership/control, anti-capitalist transformation, emancipation from domination, and historical-materialist explanation. The missing class/historical residual is the key boundary from Democratic Socialism and Social Democracy.                                         | Trotskyism, Maoism, Council Communism, Market Socialism, Christian Socialism, Socialist Feminism.                                                                | Economy: Property, Markets/Planning, Labor, Redistribution. Authority: Anti-Domination and Centralization. Strategy: Reform/Revolution.                                                         | `property-legitimacy` 41, `equality-theory` 47, `anti-domination` 106. Missing direct class-structure and historical-materialist constructs; current core is substantially shared with Democratic Socialism.                                                                                                                        | Incremental validity over Democratic Socialism; direct class-analytic items; criterion and expert codes; internal structure, retest, DIF, and false-positive analysis.                                                                              |
| Marxism-Leninism      | Socialist property transformation plus vanguard organization, centralized authority, revolutionary transition, and state action. The constitutive residual is party-state organization and transition, not generic Marxian analysis.                                                               | Maoism, Juche, National Bolshevism, Trotskyism as contrast, Council Communism as counter-tradition.                                                              | Authority: Centralization and Technocratic/Party expertise. Economy: Property and Planning. Strategy: Revolution and Coercion.                                                                  | Required `authority-legitimacy` 53, `property-legitimacy` 41, `centralization-preference` 62, `reform-vs-revolution` 9, `state-action-vs-exit` 68; optional `market-process-confidence` 11. Missing direct vanguard-party, one-party, party discipline, and historical-regime facets. Existing constitutive gate remains mandatory. | Criterion coding must distinguish doctrine from regime approval; expert-coded historical variants; response-process; retest; DIF; high-risk false-positive and label-exposure review.                                                               |
| National Conservatism | National sovereignty/community boundary, cultural continuity, conservative change orientation, and an integrated priority of nation-state political membership. The residual is not generic Nationalism plus Social Conservatism; it is their ordering around national sovereignty and continuity. | Paleoconservatism, One-Nation Conservatism, Religious Nationalism, Ethnonationalism, Welfare Chauvinism, Expansionist Nationalism.                               | Community: Nationalism, Civic/Ethnonationalist, Economic Nationalism, Cosmopolitanism. Culture/order: Social Conservatism and Progressivism.                                                    | Required `political-community-boundary` 24 and `cultural-plasticity` 9; optional `moral-traditionalism` 25. Missing explicit sovereignty, national-membership, anti-cosmopolitan-institutional, and non-ethnic boundary facets.                                                                                                     | M0/M1 incremental validity against Conservative plus Nationalism/Social Conservatism; cognitive label interpretation; criterion and expert codes; retest; DIF; cross-country fairness; false-positive separation from Ethnonationalism and Fascism. |
| Radical Democracy     | Popular sovereignty, participation, contestability, anti-oligarchy, democratized authority, and institutional/economic power redistribution. The discriminating feature is democratic self-rule beyond periodic elections, not distrust of voters or ordinary democratic confidence.               | Democratic Confederalism, Participism, Libertarian Municipalism, Council Communism, Social Anarchism.                                                            | Authority: Decentralist Orientation, Populism, Technocratic Orientation. Economy: Labor and Ownership. Strategy: Direct Action and Participatory Reform.                                        | Required `equality-theory` 47 and `anti-domination` 106; optional `authority-legitimacy` 53 and `centralization-preference` 62. Missing direct popular-sovereignty, participation, deliberation, and self-government constructs.                                                                                                    | Add and cognitively review dedicated participation items; incremental validity against Republicanism and Libertarian Socialism; criterion, retest, DIF, and model comparison.                                                                       |
| Republicanism         | Non-domination, civic self-government, rule of law, accountability, and equal civic standing. The discriminating feature is freedom from arbitrary power through civic institutions, not non-interference or confidence in existing democracy.                                                     | Civic Republicanism, Community Republicanism, Municipalism, Constitutionalism-related projects.                                                                  | Authority: Civil Libertarianism, Decentralist Orientation, Populism, Technocratic Orientation. Community: Civic Nationalism and Cosmopolitanism can attach but are not constitutive.            | Required `liberty-noninterference` 96 and `anti-domination` 106; optional `authority-legitimacy` 53. Missing civic self-government, institutional independence, and rule-of-law anti-arbitrariness facets.                                                                                                                          | Dedicated civic self-government items; incremental validity against Social Liberalism and Radical Democracy; criterion and retest; DIF/invariance; expert review.                                                                                   |
| Social Democracy      | Mixed economy, public provision, labor protection, progressive redistribution, and incremental reform within democratic institutions. The discriminating feature is reforming capitalism rather than replacing ownership structures.                                                               | Third Way, One-Nation Conservatism, Christian Democracy, Market Socialism, Democratic Socialism.                                                                 | Economy: Fiscal Conservatism, Redistribution, Regulation, Labor/Workplace. Authority: State Capacity and Technocratic Orientation. Strategy: Reform and Compromise.                             | `property-legitimacy` 41, `equality-theory` 47, `state-action-vs-exit` 68, `reform-vs-revolution` 9. Missing direct welfare-regime, union/workplace, and mixed-economy institutional facets.                                                                                                                                        | Incremental validity against Democratic Socialism, Social Liberalism, and Christian Democracy; criterion, retest, DIF, short-form equivalence, and calibration.                                                                                     |
| Social Liberalism     | Individual rights, positive liberty/effective opportunity, pluralism, markets, and targeted public action. The discriminating feature is liberal justification of social provision, not a full social-democratic class or welfare program.                                                         | Neoliberalism, Ordoliberalism, Liberal Feminism, Georgism, Cosmopolitan Liberalism.                                                                              | Economy: Redistribution, Regulation, Market Governance. Authority: Civil Libertarianism and Technocratic Orientation. Culture: Progressivism, Multiculturalism, Feminist Orientation.           | `liberty-noninterference` 96, `equality-theory` 47, `state-action-vs-exit` 68. Missing direct positive-liberty/capability, pluralist, and public-action justification facets.                                                                                                                                                       | Cognitive review of positive liberty; incremental validity against Market Liberal and Social Democracy; criterion, retest, DIF, and calibration.                                                                                                    |

## 5. Nearest-neighbor matrix

The matrix below is a conceptual adjacency matrix, not a respondent-derived
distance matrix. Existing centroid proximity is only an implementation
diagnostic and cannot validate these neighborhoods.

| Primary               | Nearest conceptual neighbors                                    | Discriminating boundary                                                                                            |
| --------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Conservative          | Liberal Conservatism; Christian Democrat; National Conservatism | Prudence and continuity without requiring liberal constitutionalism, Christian social ethics, or national priority |
| Christian Democrat    | Conservative; Social Democracy; Social Liberalism               | Christian social ethics, subsidiarity, solidarity, and social-market constitutionalism                             |
| Classical Liberalism  | Market Liberal; Right-Libertarianism; Liberal Conservatism      | Historical liberal tradition of liberty, property, contract, and limited constitutional government                 |
| Democratic Socialism  | Marxian Socialism; Social Democracy; Libertarian Socialism      | Democratic control/social ownership without Leninist party-state organization                                      |
| Green Politics        | Radical Democracy; Marxian Socialism; Libertarian Socialism     | Nonhuman moral standing and ecological limits; economic and authority morphology remains open                      |
| Liberal Conservatism  | Conservative; Classical Liberalism; Christian Democrat          | Liberal institutions and markets ordered toward continuity and cautious reform                                     |
| Libertarian Socialism | Radical Democracy; Marxian Socialism; Democratic Socialism      | Anti-authoritarian social ownership, worker self-management, and federation                                        |
| Market Liberal        | Classical Liberalism; Right-Libertarianism; Social Liberalism   | Market governance with an enabling state, public goods, and limited safety net                                     |
| Right-Libertarianism  | Classical Liberalism; Market Liberal; Libertarian Socialism     | Strong private/use-based property and state skepticism, with the state question left internally open               |
| Marxian Socialism     | Democratic Socialism; Libertarian Socialism; Marxism-Leninism   | Class structure and historical-materialist transformation without requiring Leninist party-state organization      |
| Marxism-Leninism      | Marxian Socialism; Democratic Socialism; Libertarian Socialism  | Vanguard party, centralized state, and revolutionary transition                                                    |
| National Conservatism | Conservative; Liberal Conservatism; Christian Democrat          | National sovereignty and cultural continuity as an integrated political order                                      |
| Radical Democracy     | Republicanism; Libertarian Socialism; Democratic Socialism      | Popular sovereignty and participation beyond periodic elections; anti-oligarchic self-rule                         |
| Republicanism         | Radical Democracy; Social Liberalism; Christian Democrat        | Non-domination through civic self-government and accountable institutions                                          |
| Social Democracy      | Democratic Socialism; Social Liberalism; Christian Democrat     | Mixed economy, welfare/labor protection, and incremental reform rather than ownership replacement                  |
| Social Liberalism     | Market Liberal; Social Democracy; Classical Liberalism          | Positive liberty and effective opportunity within liberal pluralism and markets                                    |

## 6. Discriminant-feature matrix

This matrix is a content specification. A listed feature is not yet a
validated latent dimension or answer key.

| Primary               | Primary discriminant features                                                             | Current discriminant coverage                                                        | Priority construct additions                                                               |
| --------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Conservative          | Prudence, inherited practice, gradual institutional change                                | Cultural plasticity and gradualism are present but thin                              | Institutional prudence; inherited-practice judgment; change-risk assessment                |
| Christian Democrat    | Subsidiarity, solidarity, Christian social ethics, social-market constitutionalism        | Property, equality, centralization, secularism proxies                               | Subsidiarity; intermediary associations; Christian social ethics; constitutional pluralism |
| Classical Liberalism  | Rule of law, contract, limited government, liberty/property                               | Strong shared liberal core                                                           | Public-goods boundary; property acquisition; state-function differentiation                |
| Democratic Socialism  | Democratic control of ownership, worker power, anti-authoritarian socialism               | Property, equality, anti-domination                                                  | Workplace self-management; democratic ownership; class structure; transition authority     |
| Green Politics        | Nonhuman standing and ecological limits                                                   | Human-nature priority, with two-item minimum gate                                    | Growth/ecological limits; technology; governance; ecological strategy                      |
| Liberal Conservatism  | Liberal constitutionalism ordered toward continuity and cautious reform                   | Liberal core plus cultural plasticity and gradualism                                 | Constitutional-prudential integration; institutional continuity; market-power boundary     |
| Libertarian Socialism | Anti-authoritarian social ownership, worker self-management, federation                   | Authority, property, equality, anti-domination, centralization                       | Workplace governance; federation; class power; anti-capitalist organization                |
| Market Liberal        | Market governance, enabling state, public goods, limited safety net                       | Shared liberal core plus market confidence                                           | Enabling-state function; public goods; social insurance; market institutionalism           |
| Right-Libertarianism  | Strong property, voluntary exchange, exit, anti-centralization                            | Shared liberal core                                                                  | Property acquisition; public goods; minimal-state/statelessness; social obligation         |
| Marxian Socialism     | Class structure, historical materialism, social ownership, anti-capitalist transformation | Property, equality, anti-domination                                                  | Class structure; historical materialism; capital/labor relation                            |
| Marxism-Leninism      | Vanguard party, centralized state, revolutionary transition                               | Constitutive gate over authority, property, centralization, revolution, state action | Party organization; one-party rule; transition doctrine; historical-variant coding         |
| National Conservatism | National sovereignty, cultural continuity, nation-state priority                          | Community boundary, cultural plasticity, moral-traditionalism proxy                  | Sovereignty; membership; anti-cosmopolitan institutional stance; national continuity       |
| Radical Democracy     | Participation, popular sovereignty, contestability, anti-oligarchy                        | Equality, anti-domination, centralization                                            | Popular sovereignty; participatory self-government; institutional contestability           |
| Republicanism         | Non-domination, civic self-government, accountability, rule of law                        | Liberty, anti-domination, authority                                                  | Civic self-government; institutional independence; anti-arbitrary power                    |
| Social Democracy      | Mixed economy, welfare, labor protection, incremental reform                              | Property, equality, state action, reform                                             | Welfare regime; unions/workplace; mixed-economy institutions                               |
| Social Liberalism     | Positive liberty, effective opportunity, pluralism, targeted public action                | Liberty, equality, state action                                                      | Positive-liberty/capability reasoning; pluralism; public-action justification              |

## 7. Compositional-residual analysis

### 7.1 M0/M1 decision rule

For a compositionally specific candidate:

- **M0** represents the candidate through a broader Primary plus relevant
  Modifiers or construct facets. M0 is not allowed to invent a single
  synthetic label; it is a multi-affinity configuration.
- **M1** represents the candidate as an independent named Primary
  configuration with its own constitutive construct specification.
- M1 receives conceptual standing only when the combination has: (a) a
  durable named tradition or project; (b) cross-domain and cross-layer
  morphology; (c) a non-additive ordering, institutional logic, or historical
  boundary; and (d) at least one discriminant that M0 cannot express without
  treating the relationship itself as a construct.
- M1 measurement readiness additionally requires respondent evidence of
  incremental value beyond M0. Conceptual residual is not psychometric
  residual.

This is a conceptual design rule, not a respondent cutoff or a statistical
threshold.

### 7.2 M0/M1 matrix for the current roster

| Primary               | M0 representation                                                                                   | M1 residual                                                                                                                        | Conceptual decision                               | Empirical decision required before independent M1 output                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Conservative          | Family anchor; modifiers for social conservatism, nationalism, fiscal policy, or religion           | Prudence and continuity as a general political judgment                                                                            | M1 is the correct broad family object             | Show that prudence is not merely traditionalism or low cultural plasticity                                                            |
| Christian Democrat    | Conservative or Social Democracy plus religious, solidarity, and decentralist facets                | Subsidiarity and Christian social ethics integrated with constitutional democracy and social-market institutions                   | M1 passes conceptually                            | Demonstrate incremental value over Social Democracy plus religion/authority facets                                                    |
| Classical Liberalism  | Market Liberal plus civil-libertarian and limited-authority facets                                  | Historical rule-of-law/contract tradition and a distinctive state-function boundary                                                | M1 passes conceptually as a historical tradition  | Separate from Market Liberal and Right-Libertarianism using respondent-level incremental tests                                        |
| Democratic Socialism  | Social Democracy or Marxian Socialism plus democratic-control and anti-domination facets            | Democratic ownership/control is constitutive rather than merely reformist or class-analytic                                        | M1 passes conceptually                            | Add direct democratic-ownership/workplace indicators and test incremental value                                                       |
| Green Politics        | A green ecological-standing facet attached to another host                                          | Ecology is the organizing family principle; economic and authority choices remain open                                             | M1 passes as a family anchor                      | Validate the family signal and non-exclusive morphology; do not infer a single green subtype                                          |
| Liberal Conservatism  | Conservative plus Classical/Market Liberal and civil-libertarian facets                             | Liberal constitutionalism and market order are ordered toward continuity and cautious reform                                       | M1 passes conceptually but remains borderline     | Test whether relationship/order items add precision beyond M0 and are interpreted consistently across contexts                        |
| Libertarian Socialism | Social Anarchism or Marxian Socialism plus decentralist, anti-domination, and worker-control facets | Anti-capitalist and anti-authoritarian organization are jointly constitutive                                                       | M1 passes conceptually                            | Test against Right-Libertarianism, Social Anarchism specialists, and Marxian Socialism                                                |
| Market Liberal        | Classical Liberalism plus market-process and enabling-state facets                                  | Contemporary market-governance family with public-good and safety-net boundary                                                     | M1 passes conceptually                            | Test whether enabling-state items add value beyond Classical Liberalism                                                               |
| Right-Libertarianism  | Market Liberal plus civil-libertarian, decentralist, and exit facets                                | Property-and-state lineage with a distinctive relationship between voluntary exchange and coercive authority                       | M1 passes conceptually                            | Test state-function, property-acquisition, and public-good residuals; separate anarcho-capitalism                                     |
| Marxian Socialism     | Democratic Socialism plus class and anti-capitalist facets                                          | Class structure and historical materialism organize the tradition                                                                  | M1 passes conceptually                            | Add class-analytic indicators and test incremental value beyond Democratic Socialism                                                  |
| Marxism-Leninism      | Marxian Socialism plus centralization, revolution, and state-action facets                          | Vanguard party and centralized revolutionary transition                                                                            | M1 passes with an existing constitutive gate      | Validate doctrine-level interpretation and false-positive separation from generic state socialism                                     |
| National Conservatism | Conservative plus Nationalism and Social Conservatism facets                                        | National sovereignty and cultural continuity form an integrated political order; national priority is not merely an added modifier | M1 passes conceptually as a conditional candidate | Test incremental value over M0; validate boundaries against ethnonationalism, religious nationalism, fascism, and generic nationalism |
| Radical Democracy     | Republicanism plus anti-domination, participation, and decentralist facets                          | Democratic self-rule is expanded to contestability and participation beyond elections                                              | M1 passes conceptually                            | Add direct participation/popular-sovereignty constructs and compare with Republicanism and Libertarian Socialism                      |
| Republicanism         | Civil-libertarian and anti-domination facets                                                        | Freedom as non-domination plus civic self-government and anti-arbitrary institutions                                               | M1 passes conceptually                            | Add civic self-government indicators and test against Social Liberalism and Radical Democracy                                         |
| Social Democracy      | Social Liberalism or Democratic Socialism plus welfare, labor, and reform facets                    | Mixed-economy reform and social protection rather than ownership replacement                                                       | M1 passes conceptually                            | Test welfare/labor/mixed-economy residuals beyond general equality and state action                                                   |
| Social Liberalism     | Market Liberal plus equality, state-action, and civil-libertarian facets                            | Positive liberty/effective opportunity as a liberal justification for public action                                                | M1 passes conceptually                            | Test positive-liberty and pluralist reasoning beyond Social Democracy and Market Liberalism                                           |

### 7.3 Priority case: National Conservatism

**M0:** Conservative + Nationalism + Social Conservatism, with optional
Economic Nationalism, Regionalism, or anti-Cosmopolitanism facets.

**M1 residual:** the nation-state is treated as the primary locus of political
membership and sovereignty, and cultural continuity is interpreted as a
political obligation of that national community. This is not equivalent to
generic nationalism, because the conservative continuity mechanism matters; it
is not equivalent to Social Conservatism, because national sovereignty and
membership matter; and it is not Ethnonationalism, because national membership
need not be ethnic or hereditary.

**Decision:** the residual is conceptually sufficient for a named compound
tradition candidate, but present measurement is not sufficient to claim an
independent validated endpoint. Keep the current frozen Primary role and
declare M1 evidence-held in vNext. If incremental validity fails, demote the
public role to Specialist or derived configuration rather than preserving M1
by naming convention.

### 7.4 Priority case: Liberal Conservatism

**M0:** Conservative + Classical or Market Liberalism + civil-libertarian and
market-governance facets.

**M1 residual:** liberal constitutional rights, markets, and limited public
authority are not merely adjacent commitments; they are used as a mode of
preserving continuity while allowing cautious reform. That relationship is a
distinctive ordering principle. It is not a fixed midpoint and is not
interchangeable with Ordoliberalism or Conservative Liberalism in every
historical context.

**Decision:** the residual is conceptually sufficient for a named bridge
tradition candidate, but the word-order field and cross-national usage are
unstable. Keep the canonical current ID and public role frozen, add alternate
names and historical scope in vNext, and hold M1 output pending incremental,
response-process, and cross-context evidence.

### 7.5 Evidence eventually required for M1 beyond M0

For either priority case, M1 must demonstrate all of the following in a
preregistered respondent study:

1. **Response-process distinction:** respondents understand M1 as an integrated
   tradition rather than selecting whichever component word is most salient.
2. **Incremental construct value:** M1 relationship/order items explain
   criterion or held-out profile information beyond M0 component constructs.
3. **Discriminant behavior:** M1 reduces false positives with the nearest
   neighboring Primary and the most likely Specialist alternatives.
4. **Stability:** the M1 profile and evidence coverage are sufficiently stable
   at retest for the intended claim.
5. **Criterion interpretation:** independent self-description, expert codes,
   or other preregistered criteria support the M1 interpretation without being
   used as an uncritical answer key.
6. **Fairness and scope:** the M1 relation is interpreted comparably across
   preregistered groups, regions, languages, and relevant historical frames.
7. **Presentation value:** label exposure does not create avoidable demand,
   priming, or confusion relative to an unlabelled profile presentation.

Failure of these conditions does not erase conceptual history. It changes the
public role or keeps M1 as a research-only configuration.

## 8. Existing Specialists with possible broad-tradition standing

Conceptual breadth and measurement readiness are reported separately. These
are the most important current candidates; the remaining Specialists continue
to use the same kind-specific review rule.

| Specialist or Specialist family                                        | Conceptual standing                                                                                              | Current role decision                                                                                                 | Measurement consequence                                                                                              |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Market Anarchism                                                       | Broad anarchist family anchor with real internal variation over property, reciprocity, and capitalism            | Retain Specialist; do not promote beside Right-Libertarianism and Social Anarchism without a non-overlapping boundary | Requires a focused market-anarchist module and explicit relation to Mutualism and Anarcho-Capitalism                 |
| Mutualism                                                              | Durable anarchist tradition with a distinctive property, reciprocity, and federation morphology                  | Retain Specialist; not a child of one anarchist branch                                                                | Requires property/rent/reciprocity items and non-exclusive module scoring                                            |
| Anarcho-Communism                                                      | Durable subtype tradition within anarchist/socialist fields                                                      | Retain Specialist                                                                                                     | Existing compound gate is a false-positive safeguard, not validation                                                 |
| Anarcho-Syndicalism                                                    | Durable strategy-and-organization tradition with worker federation and direct-action morphology                  | Retain Specialist                                                                                                     | Requires workplace and organizational constructs; do not infer from anti-state answers alone                         |
| Liberal, Radical, Socialist/Marxist, and Anarcha-Feminism              | Each is a serious feminist tradition; these are not mere modifiers conceptually                                  | Retain focused Specialists pending feminist module evidence                                                           | Dedicated gender-power and social-reproduction coverage remains required before any role change                      |
| Neoliberalism and Ordoliberalism                                       | Broad intellectual/policy currents with substantial historical significance                                      | Retain Specialist or Context according to source and presentation scope; no promotion now                             | Distinguish state-market governance and historical period; avoid treating either as a generic market score           |
| One-Nation Conservatism, Paleoconservatism, and Neoconservatism        | Broad conservative subtraditions or historical currents                                                          | Retain Specialist                                                                                                     | Validate distinct conservative variants before any Primary reconsideration                                           |
| Religious Nationalism, Hindutva, Zionism, and Political Islam          | Broad or consequential configurations, often regionally and historically embedded                                | Retain Specialist with high-context and community-informed review                                                     | Separate religion, national identity, authority, membership, and state-building constructs                           |
| Pan-Africanism                                                         | Broad transnational and anti-colonial political tradition, but not a single domestic ideology                    | Retain Specialist / related tradition                                                                                 | Validate solidarity, unity, sovereignty, and nativist variants without a forced single centroid                      |
| Black Nationalism                                                      | Durable but heterogeneous self-determination and autonomy tradition                                              | Retain Specialist / related tradition                                                                                 | Use community-autonomy and separatist constructs; do not clone Ethnonationalism or claim one identity result         |
| Indigenism / Indigenous sovereignty and resurgence                     | Important family of sovereignty and decolonial traditions, but the umbrella is internally and community-specific | Retain Specialist with naming review                                                                                  | Keep institutional recognition and autonomous resurgence separate; community-informed review is required             |
| Christian Socialism                                                    | Durable religious-socialist tradition                                                                            | Retain Specialist                                                                                                     | Distinguish Christian social ethics from Christian Democracy, social ownership, and theocracy                        |
| Fascist Authoritarianism, National Socialism, Strasserism, Eco-Fascism | Historically consequential regime or project kinds, not generic authority-plus-nationalism combinations          | Retain high-risk Specialist/catalog objects; never ordinary fallback output                                           | Existing constitutive gates, historical definitions, false-positive review, and fairness safeguards remain mandatory |
| Maoism, Trotskyism, Juche, and National Bolshevism                     | Historically consequential socialist or revolutionary variants                                                   | Retain Specialist                                                                                                     | Use variant-specific constructs; do not infer from Marxian or Leninist proximity alone                               |
| Georgism, Distributism, Participism, and Technocratic Centralism       | Important programs or compound institutional projects, but not broad complete ideologies at current resolution   | Retain Specialist or Context by object kind                                                                           | Direct land, ownership, participatory-economy, or expert-authority constructs required                               |
| Confucian Political Revival                                            | Broad modern intellectual/political current with plural constitutional and meritocratic branches                 | Retain Specialist / Context                                                                                           | Region- and tradition-specific response-process and translation review required                                      |

No Specialist promotion is authorized. A future promotion would require a
versioned role decision with semantic, cognitive, psychometric, criterion,
fairness, and reproducibility evidence, as already required by the frozen
architecture.

The [definitive Specialist architecture review](vnext-specialist-architecture-review-2026-08.md)
now supplies the authoritative 78-label roster, controlled `specialistKind`
vocabulary, polyhierarchical relation semantics, module assignments, and
per-label measurement recommendations. This section’s conceptual standing and
no-promotion decision remain in force; the newer review adds resolution detail
without changing the approved Primary roster or its respondent gates.

## 9. Measurement-status recommendations for every Primary

The current runtime status for all 16 is `core-primary`. That status means the
label is in the frozen ordinary scoring contract; it does not mean validated
reliability or validity. The vNext recommendation below is an explicit
research/design status for the next registry.

| Primary               | vNext measurement-status recommendation                  | Current scoring interpretation                                                                                                               |
| --------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Conservative          | `research-provisional` with bounded family scope         | Keep current required-axis gate; do not infer social, national, religious, or economic subtype                                               |
| Christian Democrat    | `research-provisional` with content gap                  | Keep current scope; disclose that secularism and centralization are proxies, not Christian social-ethics measurement                         |
| Classical Liberalism  | `research-provisional` with triad-discrimination hold    | Keep current scope; report close liberal-family neighborhoods as uncertain                                                                   |
| Democratic Socialism  | `research-provisional` with democratic-control gap       | Keep current scope; do not claim workplace-democratic or social-ownership validity                                                           |
| Green Politics        | `research-provisional` with direct ecological gate       | Keep the two-item ecological-standing minimum; use green morphology module for subtypes                                                      |
| Liberal Conservatism  | `research-provisional` and `M1-held`                     | Frozen result remains allowed only under current bounded scope; no validated bridge claim                                                    |
| Libertarian Socialism | `research-provisional` with organization gap             | Keep current anti-authoritarian/socialist comparison; do not infer a specific anarchist subtype                                              |
| Market Liberal        | `research-provisional` with liberal-triad hold           | Keep authority requirement and current bounded scope; do not equate with deregulation or neoliberalism                                       |
| Right-Libertarianism  | `research-provisional` with state/property residual hold | Keep current four-axis scope; do not infer anarcho-capitalism, minarchism, or Georgism                                                       |
| Marxian Socialism     | `research-provisional` with class-analysis gap           | Keep current scope; do not present a complete Marxian theory measure                                                                         |
| Marxism-Leninism      | `research-provisional` with constitutive high-risk gate  | Preserve the existing all-of gate; do not infer historical regime endorsement or national variant                                            |
| National Conservatism | `research-provisional` and `M1-held`                     | Frozen result remains bounded to community boundary and cultural plasticity; do not infer ethnonationalism, fascism, or one economic program |
| Radical Democracy     | `research-provisional` with participation gap            | Keep current equality/anti-domination scope; do not infer participatory self-government from democratic confidence                           |
| Republicanism         | `research-provisional` with civic-self-government gap    | Keep current non-domination boundary; do not infer a specific institutional model                                                            |
| Social Democracy      | `research-provisional` with welfare/labor gap            | Keep mixed-economy/reform interpretation; do not infer one Nordic or party model                                                             |
| Social Liberalism     | `research-provisional` with positive-liberty gap         | Keep liberal opportunity/public-action interpretation; do not infer progressive cultural identity or social democracy                        |

## 10. Current question-bank coverage gaps

The current 338-item effective core bank provides measurable axis coverage for
all frozen required scopes, subject to response missingness and the existing
gates. The most important architecture gaps are:

- no direct institutional-prudence construct for Conservative;
- no direct Christian social-ethics, subsidiarity, intermediary-association,
  or constitutional-pluralism construct for Christian Democrat;
- no public-goods, property-acquisition, state-function, or enabling-state
  construct that cleanly separates the liberal triad;
- no direct democratic workplace control, class structure, or
  historical-materialist construct across the socialist family;
- no ordinary Green constructs for growth, technology, political economy,
  governance, or ecological strategy;
- no integrated constitutional-prudence construct for Liberal Conservatism;
- no workplace self-management or federated organizational construct for
  Libertarian Socialism;
- no vanguard-party, one-party, or party-discipline construct for
  Marxism-Leninism beyond the existing false-positive gate;
- no explicit national sovereignty, membership, and anti-cosmopolitan
  institutional facets for National Conservatism;
- no direct popular-sovereignty, participatory self-government, or civic
  contestability construct for Radical Democracy;
- no direct civic self-government and anti-arbitrary institutional construct
  for Republicanism;
- no direct welfare-regime, labor/union, or mixed-economy institutional
  construct for Social Democracy;
- no direct positive-liberty/capability and pluralist public-action reasoning
  construct for Social Liberalism.

New constructs must enter through the frozen W1/W2 research-only sequence,
with item-level source/context review, cognitive review, layer assignment,
response-state handling, and versioned bank metadata. Adding a label first and
backfilling a construct later is not authorized.

## 11. Respondent-validation requirements

Every Primary retains the common frozen gates:

1. cognitive interviews and response-process review;
2. item quality, comprehension, and burden review;
3. internal-structure analysis using appropriate layer-specific estimators;
4. reliability, information/precision, and missing-evidence analysis;
5. test-retest stability of construct scores, profile scores, and coverage;
6. criterion validation using independently supplied self-description,
   expert codes, external validators, or other preregistered criteria;
7. label-specific precision, recall, calibration, false-positive, and
   abstention analysis where an endpoint is proposed;
8. incremental validity against nearest-neighbor and M0 models;
9. DIF, measurement invariance, and fairness analysis where sample sizes and
   design permit;
10. Balanced/Full-depth equivalence analysis before any short-form claim;
11. community-informed review for identity, religious, Indigenous, Black,
    nationalist, and high-risk historical material;
12. reproducibility review with exact versions, item content, inclusion
    decisions, response states, and preregistered analysis specifications.

The following are explicitly not substitutes: centroid recovery, synthetic
archetype top-1/top-3 results, software tests, theoretical coherence, source
presence, or a plausible hand-authored profile.

## 12. Downstream implications

### Modifiers

The next stage should create explicit Modifier domains and subdimensions while
preserving the rule that a Modifier is not a complete ideology by default.
The first domain plan is:

| Domain                                 | Example subdimensions                                                                                    | Current labels or families                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Economic order and distribution        | fiscal stance, redistribution, regulation, productive capacity, market governance                        | Fiscal Conservatism, Economic Nationalism, relevant market and welfare facets                               |
| Authority and institutional design     | civil liberty, decentralization, technocratic confidence, centralization, expertise                      | Civil Libertarianism, Decentralist Orientation, Technocratic Orientation                                    |
| Community, membership, and sovereignty | national priority, civic membership, ethnic boundary, separatism, cosmopolitan scope, internationalism   | Nationalism, Civic Nationalism, Ethnonationalist, Separatist Nationalism, Cosmopolitanism, Internationalism |
| Culture, recognition, and social order | moral traditionalism, progressivism, multicultural accommodation, feminist concern, identity sovereignty | Social Conservatism, Progressivism, Multiculturalism, Feminist Orientation                                  |
| Political style and strategy           | people-versus-elite frame, reform, direct action, compromise, coercion                                   | Populism and related strategy facets                                                                        |
| Ecology and technology                 | ecological standing, technological enhancement, technology governance                                    | Transhumanism and green-family facets; do not duplicate Green Politics as a thin modifier                   |

This table was the approved initial handoff sketch. It is now superseded as
the authoritative Modifier hierarchy by
[`vnext-modifier-architecture-review-2026-08.md`](vnext-modifier-architecture-review-2026-08.md),
which separates National Orientation, transnational order, populist style,
authority, political economy, culture, reform, and technology into explicit
domains and distinguishes construct facets from compound configurations. The
Primary roster, M0/M1 decisions, and respondent-validation gates in this
review remain unchanged.

Each Modifier needs a domain, subdimension, host compatibility map,
non-equivalence notes, direct item set, minimum evidence rule, and disposition
for `core-construct`, `focused-follow-up`, `catalog-only`, or abstention. A
modifier score must not be used to impute a missing Primary construct.

### Specialists

Specialists should receive internal kinds such as subtype tradition,
regional-historical variant, regime/project, institutional project, and
focused cross-cutting tradition. The public role remains Specialist, but the
module and evidence contract should be selected by kind. A broad conceptual
Specialist is not automatically promoted; a narrow label is not made more
valid by being assigned a module.

### Context

Context entries should hold policy proposals, institutional mechanisms,
governance forms, speculative concepts, historical setting, and intellectual
projects that are meaningful but not complete respondent ideology endpoints.
Context relations can explain how a construct is institutionalized without
making the context itself a score.

This initial handoff is superseded for the Context layer by the definitive
[`vnext-context-architecture-review-2026-08.md`](vnext-context-architecture-review-2026-08.md).
That review retains all 19 current Context IDs, classifies their underlying
conceptual kinds independently, formalizes Context graph relations, and adds
the public-result, documentation, research, and promotion gates. The approved
Primary roster and M0/M1 decisions in this document remain unchanged.

### Constructs and questions

The ontology should reference construct families and layer-specific facets,
not directly assign a label to a question as if the label were the measured
variable. Question metadata should state the construct, layer, theory context,
response format, evidence note, and intended discriminant. Double-barreled
compound questions should not be used to create a compound label merely
because the label name contains two concepts.

The definitive construct/facet layer beneath this taxonomy is recorded in
[`vnext-construct-architecture-measurement-blueprint-2026-08.md`](vnext-construct-architecture-measurement-blueprint-2026-08.md).
It preserves the frozen root IDs and item provenance while making the
construct-to-taxonomy map, coverage gaps, scoring-compensation limits, and
respondent-validation requirements explicit.

### Scoring

The current scorer remains unchanged. A future scorer may use a vNext ontology
adapter only after a new decision record. It must preserve:

- separate normative, descriptive, and prescriptive vectors;
- distinct missing, `dont_know`, refusal, skipped confidence, and skipped
  priority states;
- required-axis abstention and minimum direct evidence gates;
- profile-similarity and evidence-coverage language;
- exclusion of criterion, expert, forecast, and novel-task records from
  ordinary scoring;
- separate multi-affinity configurations from one ranked Primary label.

An M1 configuration must not be generated by simply adding or subtracting
Modifier scores from an M0 Primary until respondent evidence supports that
estimator and its interpretation.

### Research and versioning

The vNext research records should carry the ontology version, node kind,
relation snapshot, role view, measurement status, primary/modifier roster
fingerprints, question-bank version, form fingerprint, and exact presented
content where applicable. Historical v13 records remain decodable under their
original contract. New ontology relations do not retroactively alter old
Specialist assignments, label exposures, or result profiles.

## 13. Unresolved decisions

1. Whether National Conservatism and Liberal Conservatism pass M1 incremental
   validity and remain independent public Primary endpoints.
2. Whether Classical Liberalism and Market Liberalism remain separate public
   endpoints after the liberal-triad respondent study, or become a broad
   tradition plus a derived contemporary configuration.
3. The exact construct definitions and item families for institutional
   prudence, subsidiarity, democratic workplace control, class structure,
   civic self-government, participation, positive liberty, and national
   sovereignty.
4. Whether a broad conceptual Specialist should ever be represented as a
   non-primary “family” view without becoming an ordinary endpoint.
5. The final graph relation vocabulary, relation symmetry rules, historical
   facets, and migration representation for current `parentId` metadata.
6. The policy that derives a public role from conceptual kind, measurement
   status, high-risk policy, evidence coverage, and presentation needs.
7. Whether empirical latent profiles should be multilabel configurations,
   challenger classes, or both, and how they remain separate from named
   tradition claims.
8. The preregistered sample, criterion, fairness, and incremental-validity
   gates for M0/M1 studies.
9. Cross-language and cross-national name interpretation for Liberal
   Conservatism / Conservative Liberalism and National Conservatism.
10. The exact future taxonomy and measurement version numbers; no version bump
    is authorized by this document alone.

## 14. Contradiction and tension register

No contradiction requiring reopening the frozen Measurement Architecture was
found. Two additive implementation tensions are recorded so they are not
silently resolved:

| ID   | Tension                                                                                                                                                                                                                                 | Disposition                                                                                                                                                             |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T-01 | The current registry has a single `parentId` alongside typed relations, while the completed research recommends a faceted polyhierarchy and the anarchist catalog already uses overlap and contrast relations to avoid false parentage. | Preserve v13 metadata for compatibility. Implement a new graph view with typed multi-edges and explicit family membership; do not rewrite the frozen registry in place. |
| T-02 | The current runtime derives `core-primary` directly from the Primary role, while vNext requires conceptual kind, public role, and measurement readiness to be independent.                                                              | Treat v13 `core-primary` as a frozen production-contract status, not as a psychometric claim. Add independent vNext status fields and a versioned role resolver.        |

Neither tension changes current scores or opens a production promotion path.

## 15. Next-stage implementation handoff

The next stage may proceed directly to Modifier architecture with the
following inputs:

1. create the conceptual-kind and relation registries as research/versioned
   metadata, leaving v13 code untouched;
2. define Modifier domains, subdimensions, host relations, and
   non-equivalence edges;
3. map existing Modifier labels to direct constructs and identify
   catalog-only or focused-follow-up cases;
4. specify new question families only for approved construct gaps;
5. preserve all current respondent-validation, abstention, provenance,
   versioning, and research-record gates;
6. prepare a separate implementation decision before any production role,
   scoring, question-bank, or public-language change.

## Source and baseline record

This review is grounded in the frozen and current repository records:

- [Measurement Architecture Specification](measurement-architecture-specification-2026-08.md)
- [Measurement Architecture Implementation Specification](measurement-architecture-implementation-specification-2026-08.md)
- [Methodological Change Decision Log](methodological-change-decision-log-2026-08.md)
- [Primary-core measurement audit](primary-core-measurement-audit-2026-08.md)
- [Modifier measurement scope audit](modifier-measurement-scope-audit-2026-08.md)
- [Psychometric validation protocol](psychometric-validation-protocol.md)
- [Taxonomy redesign and measurement migration](taxonomy-redesign-v1-2026-08.md)
- [Ideology breadth and validation audit v4](ideology-breadth-audit-v4.md)
- [Conservative variants descriptive layer guide](conservative-variants-descriptive-layer-guide-2026-08.md)
- `src/data/labelTaxonomy.ts`
- `src/data/primaryMeasurement.ts`
- `src/data/compoundGates.ts`
- `src/data/constructFamilies.ts`
- `src/data/domains.ts` and `src/data/axes.ts`

These records support definitions, boundaries, measurement design, and
implementation constraints. They do not establish psychometric validity.
