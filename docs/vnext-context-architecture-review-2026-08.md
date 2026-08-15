# vNext Context architecture review — 2026-08

This is the definitive vNext review of the Context layer. It continues the
frozen Measurement Architecture at `f0324dbf27dfc6e35ff557992e4643e3df15ee0e`,
the approved Primary, Modifier, and Specialist architecture reviews, the
completed taxonomy Deep Research, and the cumulative methodological decision
log.

This document is a vNext ontology and measurement-design decision record. It
does not rewrite the frozen v13 runtime, roster, question bank, scorer, stored
research records, or public-result contract.

## 1. Executive decision

`Context` is a product and presentation role, not a conceptual kind and not a
readiness category. A Context entry may denote a policy proposal, an
institutional mechanism, a governance model, an intellectual current, a
historical reference, a regional tradition, a regime project, or another
politically meaningful object. These objects must be classified independently
of their current product role.

The authoritative current Context roster remains all 19 existing Context IDs:

- retain all 19 as browsable Context entries;
- promote none to Primary, Modifier, or Specialist in this review;
- demote, merge, rename, retire, or add none;
- preserve `context-only` as the frozen v13 measurement status for all 19;
- record Baʿthism, Developmental Authoritarianism, Platformism, and Utopian
  Socialism as the highest-priority future tradition/module candidates, not as
  presently measured labels;
- treat policy proposals and institutional models as possible future direct
  constructs or choice tasks, not as ideology scores by proxy;
- keep sensitive and speculative projects behind stricter scope, response-
  process, fairness, and community-informed review gates.

The central rule is:

> A Context label may explain an ideological configuration, policy expression,
> institutional mechanism, or historical debate. It must not be presented as a
> respondent identity, a scored tradition, or a validated latent class unless a
> later role decision passes the existing respondent-validation gates.

## 2. Frozen boundary and current implementation

The frozen implementation currently defines 19 Context IDs in
`src/data/labelTaxonomy.ts`. `measurementStatusForRole` maps the Context role to
`context-only`, and `publicCatalogLabels` keeps Context entries browsable while
excluding them from `primaryScoringLabels` and `modifierScoringLabels`.

The current public card may show a Context definition, usage note, caution note,
analytical scale, and cited source scope. That presentation is explanatory
catalog behavior. It is not evidence that the label is respondent-measured.

The active core and modifier banks do not contain direct label-target measures
for these 19 Context IDs. Some active Specialist modules and ordinary
constructs measure neighboring material—for example, technology, religious
authority, decentralization, development, socialism, nationalism, or
cosmopolitanism. Neighbor coverage must not be relabeled as Context-label
coverage.

No genuine contradiction with the frozen Measurement Architecture was found.
The additive tension already recorded in T-01 and T-02 remains applicable:
v13 has a single `parentId` and role-derived status, while vNext requires a
faceted polyhierarchy and independent conceptual/readiness fields. The vNext
Context registry must therefore be versioned and additive.

## 3. Context ontology

### 3.1 Conceptual kinds

The following kinds are independent of public role and measurement status.

| Conceptual kind                     | Definition                                                                                                                                                         | Typical Context examples                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `compound-tradition`                | A historically recognizable synthesis of multiple political traditions whose conjunction has its own lineage, institutions, or morphology.                         | Baʿthism                                                 |
| `regional-tradition`                | A tradition whose meaning and historical organization are materially regional, linguistic, civilizational, or period-specific.                                     | Baʿthism when region is the defining scope               |
| `institutional-model`               | A proposed or observed arrangement of authority, representation, jurisdiction, or constitutional organization.                                                     | Constitutional Monarchism, World Federalism              |
| `institutional-mechanism`           | A procedure or mechanism that can be adopted by otherwise different ideological hosts.                                                                             | Liquid Democracy                                         |
| `policy-proposal`                   | A substantive policy instrument or welfare/economic program that does not by itself specify a complete political order.                                            | Universal Basic Income                                   |
| `governance-model`                  | A wider account of how administration, expertise, information, or jurisdiction should be organized.                                                                | Cyberocracy, Panarchism                                  |
| `regime-project`                    | A proposed or observed relationship between political authority, state structure, coercion, and a substantive developmental, religious, or civilizational project. | Developmental Authoritarianism, Fundamentalist Theocracy |
| `organizational-current`            | A strategic or organizational doctrine inside a wider ideological family.                                                                                          | Platformism                                              |
| `intellectual-current`              | A body of arguments, diagnoses, or normative concepts with political relevance but without a settled mass ideology or complete measured program.                   | Accelerationism, Fourth Political Theory                 |
| `discourse-frame`                   | A contested justificatory vocabulary or civilizational frame used by different political actors and institutions.                                                  | Asian Values Discourse, Radical Centrism                 |
| `speculative-technological-current` | A future-oriented movement or worldview whose political implications remain unsettled and internally heterogeneous.                                                | Dataism, Singularitarianism                              |
| `historical-reference`              | A historically important umbrella or current retained for explanation and research framing where current measurement is not yet warranted.                         | Early / Utopian Socialism                                |

An entry may carry more than one conceptual kind in the graph. The registry
must identify one primary kind for display and any secondary kinds for analysis;
for example, Baʿthism is both a compound and regional tradition, while
Developmental Authoritarianism is both a regime project and a compound of
developmentalism with restricted pluralism.

### 3.2 Independent status fields

Every vNext Context record should keep these fields separate:

| Field               | Permitted question                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `conceptualKind`    | What sort of political object is this?                                                                      |
| `contextStatus`     | Why is it currently presented through Context?                                                              |
| `measurementStatus` | What, if anything, is directly measured today?                                                              |
| `graphRelations`    | How does it relate to Primaries, Modifiers, Specialists, and other Context objects?                         |
| `sourceScope`       | What do the sources support: definition, history, boundary, normative self-description, or empirical claim? |
| `futureRoute`       | What evidence could justify a later construct, Specialist module, or role decision?                         |

`unmeasured-tradition-candidate` is a status or future-route value, not a
conceptual kind. It must never be used to make a tradition appear more
validated than it is.

## 4. Authoritative Context roster

All rows below have frozen v13 `measurementStatus = context-only` and current
product role `Context`. “Adjacent coverage” identifies measured constructs or
Specialists that may explain part of the object; it is not direct coverage of
the Context label.

| ID / public name                                                  | Conceptual kind                                                       | Canonical definition                                                                                                                                                                                                                                                                            | Graph and measured-layer relationships                                                                                                                                                                                                                                                         | Context rationale and present usefulness                                                                                                                                                                                                                                            | Future route and evidence requirement                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accelerationism` — Technology-Centered Accelerationism           | `intellectual-current`; secondary `speculative-technological-current` | A diagnosis or strategy that treats intensifying technological, capitalist, or modernizing forces as a route to systemic transformation. Left, right, and technology-centered variants are not interchangeable.                                                                                 | `overlaps_with` Transhumanism, Technology-Governance Specialists, and selected Green or Liberal configurations; `often_combines_with` Technocratic Orientation; `contrasts_with` gradualist reform.                                                                                            | Important for contemporary technology politics, but the label is internally heterogeneous and can refer to incompatible projects. Context is useful for explaining a family of arguments without inferring collapse, authoritarianism, or violence.                                 | Research-only variant module. Require separate items for technological intensification, political strategy, desired endpoint, coercion, democratic constraint, and variant identity; then cognitive, psychometric, criterion, retest, fairness, and presentation-value review.                                                            |
| `asian-values` — Asian Values Discourse                           | `discourse-frame`; secondary `regional-tradition`                     | A contested discourse giving distinctive weight to family, duty, harmony, order, community, and development, sometimes in contrast to individualized liberal rights. It does not describe one regional culture.                                                                                 | `context_for` Political Confucianism; `overlaps_with` Communitarianism, Developmentalism, and Social Conservatism; no required relation to authoritarianism.                                                                                                                                   | Historically and contemporarily important as a justificatory frame. Context prevents a heterogeneous and sometimes strategic discourse from becoming a regional ideology or cultural stereotype.                                                                                    | No direct label promotion. Research may compare democratic, communitarian, developmental, and authoritarian uses with region- and language-sensitive cognitive review.                                                                                                                                                                    |
| `baathism` — Baʿthism / Arab Socialism                            | `compound-tradition`; secondary `regional-tradition`                  | A secular Arab-nationalist synthesis seeking Arab unity, independence, and social transformation through a vanguard party and state-led development, with sharply divergent historical branches.                                                                                                | `regional_variant_of` Arab Socialism and Pan-Arabism; `often_combines_with` Anti-Imperialism, Economic Nationalism, and Developmentalism; relates to National Orientation, State Capacity, and Technocratic Orientation; distinguish founder doctrine from later party-state practice.         | A historically consequential tradition with more residual coherence than a mere policy or modifier. It remains Context because the present roster has no dedicated Arab-socialist respondent module and the label can otherwise collapse doctrine, organization, and regime record. | Highest-priority future Specialist candidate. Require direct Arab-unity/membership, secular-national, social-economic, party/state, development, sovereignty, and regime-practice items; compare it against Arab Socialism, Pan-Arabism, Nasserism, and Developmentalism with regional/language review.                                   |
| `constitutional-monarchism` — Constitutional Monarchism           | `institutional-model`                                                 | A regime arrangement retaining a hereditary monarch under constitutional limits, ranging from a ceremonial parliamentary crown to a monarch with constrained executive authority.                                                                                                               | `institutionalizes` constitutionalism and monarchist authority; relates to Monarchist Specialists, Conservative, Liberal Conservatism, Christian Democracy, Republicanism, and Civil-Libertarianism; `overlaps_with` but is not required by any of them.                                       | Politically important, but it specifies a head-of-state and authority arrangement rather than a complete ideology. Context is useful for distinguishing ceremonial, executive, parliamentary, rights, and party-system variants.                                                    | Do not promote as an ideology. A future governance-preference task could measure hereditary authority, ceremonial versus executive power, constitutional constraint, succession, accountability, and rights. It needs choice-task validation and cross-country measurement invariance.                                                    |
| `corporatism` — State Corporatism                                 | `governance-model`; secondary `regime-project`                        | A state-directed system organizing society into hierarchical functional groups that claim to mediate economic and social interests above class conflict and party competition. The state-corporatist form is distinct from democratic neocorporatist bargaining and self-organized corporatism. | `institutionalizes` strong authority, sectoral representation, and managed interest mediation; relates to Fascist, Authoritarian, Catholic-social, Conservative, and Developmental traditions; contrasts with pluralist representation and worker self-management.                             | Important institutional mechanism and historical regime project. The current narrow public label is useful as a catalog distinction, but it must not infer Fascism, authoritarianism, or democratic corporatism from one another.                                                   | Future focused institutional module, not generic ideology score. Require items separating state sponsorship, functional representation, party pluralism, class mediation, ownership, coercion, and democratic accountability; use criterion and comparative regime review.                                                                |
| `cyberocracy` — Cyberocratic Governance                           | `governance-model`; secondary `institutional-model`                   | A governance concept placing information systems, networked administration, and algorithmic decision support at the center while leaving final authority with humans, democratic bodies, or automated systems as an open question.                                                              | `context_for` Technology-Governance Specialists; `often_combines_with` Technocratic Orientation and State Capacity; `overlaps_with` Dataism; contrasts with decentralist and civil-libertarian safeguards when authority is concentrated.                                                      | Relevant emerging governance concept, but academic usage and political boundaries remain unsettled. Context is useful for explaining a mechanism without treating algorithmic administration as a complete ideology.                                                                | Future technology-governance choice module. Require direct items for expert authority, automation, centralization, transparency, contestability, privacy, rights, and human override; do not use technology enthusiasm as a proxy.                                                                                                        |
| `dataism` — Dataism                                               | `speculative-technological-current`; secondary `intellectual-current` | A techno-philosophical worldview treating data processing and information flows as a central lens for value, knowledge, and governance. It is a popularizing and contested term, not an established organized political movement.                                                               | `overlaps_with` Cyberocracy, Technocratic Orientation, Transhumanism, and Positivism; `influenced_by` data-centric governance discourse; does not require centralized state authority or a single economic program.                                                                            | Useful as intellectual and cultural context for technology politics. Its present measurement usefulness is low because self-understanding, political organization, and normative content vary substantially.                                                                        | Retain Context. A future study would first need a bounded contemporary population, response-process evidence that respondents recognize the construct, and separate items for epistemic primacy of data, governance automation, efficiency, privacy, and human judgment.                                                                  |
| `developmental-authoritarianism` — Developmental Authoritarianism | `regime-project`; secondary `compound-tradition`                      | A state-led developmental project treating rapid industrialization, national transformation, and administrative capacity as sources of legitimacy while pairing them with restricted pluralism or dominant-party rule.                                                                          | `hybrid_of` Developmentalism and concentrated authority; `requires` Developmentalism plus restricted-pluralism/authority evidence and often Technocratic Orientation; `contrasts_with` Radical Democracy; relates to Economic Nationalism, National Conservatism, and Technocratic Centralism. | A historically and comparatively important regime-project distinction. Context preserves the distinction between developmental strategy and regime type and prevents an authoritarian descriptor from being inferred from development or technocracy alone.                         | Highest-priority future Specialist candidate after Baʿthism, subject to a bounded comparative module. Require direct development goals, state capacity, bureaucratic autonomy, dominant-party/restriction, accountability, rights, ownership, and nationalism items; compare democratic developmentalism and authoritarian modernization. |
| `fourth-theory` — Dugin’s Fourth Political Theory                 | `intellectual-current`; secondary `regime-project`                    | Aleksandr Dugin’s post-Soviet project rejecting liberalism, communism, and fascism as exhausted and proposing a traditionalist, anti-liberal, civilizational, multipolar alternative without one settled economic program. Its self-description and scholarly placement must remain distinct.   | `influenced_by` Eurasianism and Traditionalism; `overlaps_with` Anti-Liberalism, National Orientation, and authoritarian/civilizational projects; `contrasts_with` Liberal, Marxian, and fascist self-descriptions without making those contrasts analytically decisive.                       | Significant as an intellectual project and political vocabulary, but single-author, contested, and incomplete. Context allows source-backed explanation without turning self-description or a synthetic centroid into respondent classification.                                    | Retain Context and high-risk research status. A module would require direct project-recognition, civilizational membership, multipolar sovereignty, tradition, economic uncertainty, democracy, and coercion items, plus historical and community-informed review.                                                                        |
| `fundamentalist-theocracy` — Fundamentalist Theocracy             | `regime-project`; secondary `institutional-model`                     | A political order in which a strict, self-described fundamentalist interpretation of religious doctrine is treated as supreme authority and state institutions enforce it, often restricting pluralist or secular alternatives.                                                                 | `institutionalizes` final religious legal authority; relates to Theocrat, Religious Nationalism, Political Islam, Social Conservatism, and religious-authority constructs; contrasts with religious establishment, ordinary religiosity, and Islamic Democratic Constitutionalism.             | Politically important and measurable in principle, but sensitive and easily over-inferred. Context is necessary until direct evidence can separate religious belief, public religious participation, clerical influence, legal supremacy, coercion, and treatment of dissent.       | Future sensitive Specialist/module candidate, not ordinary scoring. Require explicit final-authority, interpretive, legal-enforcement, pluralism, minority-rights, and dissent items; add response-process, safety, fairness, language, and community-informed review.                                                                    |
| `liquid-democracy` — Liquid Democracy                             | `institutional-mechanism`; secondary `governance-model`               | A hybrid direct and representative procedure in which voters may decide directly or delegate voting power to trusted representatives on an issue-by-issue basis, subject to design choices about revocability, expertise, and scope.                                                            | `institutionalizes` popular sovereignty and delegative representation; relates to Radical Democracy, Democratic Confederalism, Republicanism, Decentralist Orientation, and Expert Confidence; does not define economic order or general democratic quality.                                   | A clear governance mechanism with contemporary relevance, but not a complete ideology. Context is useful for presenting institutional design without assigning an ideological identity to support for one voting procedure.                                                         | Future choice-task or governance module. Require items for delegation, revocability, direct voting, representative accountability, expertise, scale, minority protection, and digital access; test whether respondents distinguish the mechanism from generic democracy.                                                                  |
| `radical-centrism` — Radical Centrism                             | `discourse-frame`; secondary `intellectual-current`                   | A contested orientation rejecting fixed left-right coalitions and favoring pragmatic, evidence-informed synthesis and institutional reform. “Radical” describes cross-cutting problem-solving rather than a required revolutionary program.                                                     | `overlaps_with` Progressivism, Third Way, Social Liberalism, Technocratic Orientation, and Compromise; `contrasts_with` ideological-purity or revolution-centered strategies; it is not a host-independent policy package.                                                                     | Relevant as political style and reform discourse, but its boundaries are broad and self-descriptive. Context prevents compromise, evidence use, or moderate policy preferences from being reified as a complete ideology.                                                           | No label promotion. It may be studied as a strategy/style construct using direct items for cross-spectrum synthesis, pragmatism, evidence, compromise, gradualism, and institutional reform; incremental value beyond Strategy/Change constructs is required.                                                                             |
| `singularitarianism` — Singularitarianism                         | `speculative-technological-current`; secondary `intellectual-current` | A futurist current focused on the possibility of technological singularity and on accelerating or safely managing advanced AI, enhancement, and radical life extension. Positions on governance, access, safety, and acceleration vary sharply.                                                 | `overlaps_with` Transhumanism, Dataism, Cyberocracy, and Accelerationism; relates to Technology-Governance Specialists; `requires` no particular economic, national, or democratic host.                                                                                                       | Future-oriented and politically relevant, but membership, doctrine, and institutional program are unsettled. Context is the least misleading current presentation.                                                                                                                  | Research-only candidate under technology/governance. Require construct separation for singularity belief, enhancement, acceleration, safety, access, governance, and inequality; establish a contemporary sampling frame before any Specialist decision.                                                                                  |
| `social-investment-state` — Social Investment State               | `policy-proposal`; secondary `governance-model`                       | A welfare-state strategy shifting emphasis toward human capital, education, childcare, lifelong learning, and labor-market activation while seeking social inclusion and economic capacity. It does not by definition replace income security, care, or disability protection.                  | `policy_expression_of` Social Democracy, Social Liberalism, Third Way, Predistribution, and Human-Capital approaches; relates to Fiscal Orientation, Redistribution, and State Capacity; can combine with Conservative or Liberal hosts.                                                       | Important policy and welfare-state model, not a complete ideology. Context is useful for separating activation and human-capital investment from generic welfare support and for documenting supportive versus punitive variants.                                                   | Measure as a policy battery or choice task, not a tradition label. Require direct items for services, income maintenance, activation, care, disability, conditionality, taxation, and labor-market governance; test dimensionality and host independence.                                                                                 |
| `platformism` — Platformism                                       | `organizational-current`; secondary `compound-tradition`              | An anarchist tendency favoring a unified strategic organization, collective responsibility, and tactical unity while rejecting a vanguard party and retaining decentralized revolutionary organization.                                                                                         | `subtype_of` or `often_combines_with` Social Anarchism and Anarcho-Communism depending on the graph’s evidence; `institutionalizes` disciplined anarchist organization; contrasts with loose affinity-group organization and Leninist vanguardism.                                             | It has recognizable historical and organizational content, but it is a narrow internal anarchist current and the current Specialist roster already has dense anarchist families. Context avoids duplicate endpoints while keeping the doctrine visible.                             | High-priority future anarchist Specialist candidate, subject to family-module capacity. Require direct organization, collective responsibility, tactical unity, anti-vanguardism, decentralization, direct action, and economic-order items; compare with Anarcho-Communism, Anarcho-Syndicalism, and Social Anarchism.                   |
| `panarchism` — Panarchism                                         | `governance-model`; secondary `institutional-model`                   | A proposal that people should choose among competing voluntary governance associations without changing residence, envisioning overlapping jurisdictions and an exit-oriented market in governance.                                                                                             | `institutionalizes` Decentralist Orientation, Voluntaryism, exit, and polycentric jurisdiction; relates to Market Anarchism, Libertarian Municipalism, Federalism, Civil Libertarianism, and property constructs; does not require one economic or anarchist host.                             | A coherent but niche and highly theoretical institutional proposal. Context is useful for explaining jurisdictional choice without treating any decentralist, market, or anti-state answer as panarchist.                                                                           | Future institutional-preference task, not immediate ideology promotion. Require items for territorial authority, jurisdictional exit, membership, coercion, public goods, rights protection, equality of access, property, and polycentric enforcement.                                                                                   |
| `universal-basic-income` — Universal Basic Income Advocacy        | `policy-proposal`                                                     | Advocacy for a regular, unconditional cash payment to every member of a defined population, with variation over citizenship/residency, amount, taxation, funding, and interaction with existing services.                                                                                       | `policy_expression_of` Egalitarian, Liberal, Social Democratic, and sometimes Libertarian configurations; relates to Redistribution, Predistribution, Fiscal Orientation, Market Liberalism, and Social Democracy; no Primary is implied.                                                      | Important and directly discussable policy proposal, but not an ideology. Context prevents a single policy preference from becoming a broad label or a proxy for egalitarianism, liberalism, or socialism.                                                                           | Future policy battery or choice experiment. Require direct items for universality, unconditionality, amount, funding, taxation, service replacement, labor effects, citizenship, and political rationale; test policy-specific response processes and stability.                                                                          |
| `utopian-socialism` — Early / Utopian Socialism                   | `historical-reference`; secondary `compound-tradition`                | A retrospective umbrella for diverse early socialist projects: cooperative and communal currents such as Owenism and Fourierism, alongside more expert-administrative Saint-Simonian projects.                                                                                                  | `historical_predecessor_of` later Socialist traditions; `influenced_by` early cooperative, communal, and industrial-reform arguments; relates to Socialism, Democratic Socialism, Market Socialism, and organizational constructs without being a single host.                                 | Historically important and useful for genealogy, but internally heterogeneous and retrospective. Context is appropriate until a direct historical-tradition module can separate its strands.                                                                                        | Future historical Specialist candidate only if research demonstrates respondent-relevant recognition and a coherent scope. Require items for cooperative community, social ownership, reform method, expert administration, class theory, and historical knowledge; do not infer it from current socialism scores.                        |
| `world-federalism` — World Federalism                             | `institutional-model`; secondary `governance-model`                   | A family of proposals for a democratic federal layer of global authority and enforceable international law while retaining self-government at other levels. It is stronger than cooperation but not identical to cosmopolitanism or a centralized world state.                                  | `institutionalizes` Cosmopolitanism, Internationalism, global law, and federal/constitutional design; relates to Decentralist Orientation and Transnational Moral Order; `contrasts_with` sovereignty absolutism but does not determine all national or economic commitments.                  | A major global-governance proposal, not a complete ideology. Context allows the institution to be discussed without equating moral universalism, international cooperation, and world government.                                                                                   | Future institutional choice task. Require direct items for global authority, federal division, enforceability, democratic accountability, subsidiarity, rights, coercion, and national self-government; test against Cosmopolitanism and Internationalism for incremental value.                                                          |

## 5. Individual status and decision summary

| Disposition                                                       | Entries                                                                                                                                |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Retain as Context                                                 | All 19 current Context IDs                                                                                                             |
| Promote to Primary                                                | None                                                                                                                                   |
| Promote to Modifier                                               | None                                                                                                                                   |
| Promote to Specialist now                                         | None                                                                                                                                   |
| Demote from Context                                               | None                                                                                                                                   |
| Merge                                                             | None                                                                                                                                   |
| Rename                                                            | None; existing v13 public names remain authoritative                                                                                   |
| Retire                                                            | None                                                                                                                                   |
| Add                                                               | None                                                                                                                                   |
| Highest-priority future tradition/module candidates               | Baʿthism; Developmental Authoritarianism; Platformism; Utopian Socialism                                                               |
| Highest-priority future institutional/policy construct candidates | Corporatism; Fundamentalist Theocracy; Liquid Democracy; Panarchism; World Federalism; Social Investment State; Universal Basic Income |
| Retain as primarily intellectual/discourse context                | Accelerationism; Asian Values Discourse; Dataism; Fourth Political Theory; Radical Centrism; Singularitarianism                        |

The different future routes are deliberate. A tradition candidate may warrant a
focused Specialist module. An institutional or policy candidate may instead
warrant a choice task or construct battery and still never become a public
ideology label.

## 6. Graph architecture and relations

### 6.1 Context-specific relation rules

The vNext graph may connect Context nodes to all four public-role classes and
to construct nodes. Relations are typed and faceted; an edge is not a score or
an inheritance claim.

| Relation                    | Use                                                                                                                                | Example                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `context_for`               | A Context object frames, exemplifies, or historically locates another object without being its parent.                             | Political Confucianism `context_for` Asian Values Discourse                                        |
| `subtype_of`                | Use only when a tradition genuinely inherits a wider tradition’s constitutive commitments and remains identifiable as its subtype. | Platformism `subtype_of` Social Anarchism only if the organizational evidence supports inheritance |
| `hybrid_of`                 | A compound object requires two or more host traditions or construct families.                                                      | Developmental Authoritarianism `hybrid_of` Developmentalism + concentrated authority               |
| `regional_variant_of`       | A historically regional expression retains a wider tradition while adding regional morphology.                                     | Baʿthism `regional_variant_of` Arab Socialism and Pan-Arabism                                      |
| `institutionalizes`         | A model, mechanism, or project gives institutional form to a construct or tradition.                                               | World Federalism `institutionalizes` Cosmopolitanism + transnational law                           |
| `policy_expression_of`      | A policy proposal is one possible expression of a host configuration, not a defining part of that host.                            | Universal Basic Income `policy_expression_of` Egalitarianism and Social Democracy                  |
| `historical_predecessor_of` | A historical current influenced later traditions without implying present identity or respondent uptake.                           | Utopian Socialism `historical_predecessor_of` later Socialist traditions                           |
| `overlaps_with`             | Two objects share constructs or discourse but are not equivalent.                                                                  | Dataism `overlaps_with` Cyberocracy                                                                |
| `often_combines_with`       | Co-occurrence is historically or conceptually common but not required.                                                             | Accelerationism `often_combines_with` Transhumanism                                                |
| `requires`                  | A candidate’s definition cannot be established without a specified construct or component.                                         | Fundamentalist Theocracy `requires` final religious legal authority                                |
| `contrasts_with`            | A boundary or non-equivalence relation prevents a common proxy or conflation.                                                      | Constitutional Monarchism `contrasts_with` Republicanism as a head-of-state form                   |

`parentId` remains a v13 compatibility field. It must not be used as the sole
vNext representation of Context relationships. A future graph registry must
preserve edge version, evidence scope, source provenance, confidence as a
graph-maintenance field rather than a respondent-validity claim, and whether an
edge is conceptual, historical, regional, institutional, or empirical.

### 6.2 Required non-equivalence boundaries

- Asian Values Discourse is not a uniform Asian culture, Confucianism, or
  authoritarianism.
- Baʿthism is not generic Arab nationalism, Arab Socialism, Marxism-Leninism,
  anti-imperialism, or the later practice of every Baʿthist regime.
- Constitutional Monarchism is not Conservatism, Monarchism in general, or a
  claim about democratic quality.
- State Corporatism is not Fascism, democratic neocorporatism, or any organized
  interest-group system.
- Developmental Authoritarianism is not Developmentalism, Technocratic
  Orientation, or authoritarianism inferred from state capacity.
- Fundamentalist Theocracy is not religiosity, religious conservatism,
  religious establishment, or Political Islam in general.
- Liquid Democracy is not democracy in general, direct action, or digital
  enthusiasm.
- Social Investment State and Universal Basic Income are policy objects, not
  Social Democracy, Social Liberalism, Egalitarianism, or Libertarianism as
  such.
- World Federalism is not Cosmopolitanism, Internationalism, cooperation, or a
  single centralized world state.
- Technology-centered Context entries do not establish Transhumanism,
  Technocratic Orientation, or support for automation without direct items.

## 7. Labels moved out of measured or mixed roles

Earlier reviews created several distinct paths. They must not be silently
collapsed into Context or treated as a hidden measurement roster.

| Historical/current item                                                                                                                           | Authoritative treatment in this review                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Constitutional Monarchism, World Federalism, Platformism, Cyberocracy, Dataism, and Dugin’s Fourth Political Theory                               | Continue as Context institutional, organizational, governance, or intellectual objects. Their catalog presence does not imply a measured role.                                                                          |
| Baʿthism and Developmental Authoritarianism                                                                                                       | Continue as Context with explicit future Specialist candidacy. Their source descriptions may call them provisional specialist concepts, but the current public role and measurement status remain Context/context-only. |
| Asian Values Discourse                                                                                                                            | Continue as Context/discourse frame. Political Confucianism is a separate Specialist object; neither label is a proxy for the other.                                                                                    |
| Fundamentalist Theocracy                                                                                                                          | Continue as sensitive Context/regime project. Theocrat and Religious Nationalism remain separate Specialist objects; broad religiosity or social conservatism cannot substitute for final religious legal authority.    |
| Utopian Socialism                                                                                                                                 | Continue as historical Context/reference, not a current socialist endpoint. Existing Socialist Primaries/Specialists cannot be used as a score for this historical object.                                              |
| Accelerationism, Radical Centrism, Singularitarianism, Social Investment State, Liquid Democracy, Panarchism, Corporatism, Universal Basic Income | Continue as intellectual, strategic, institutional, governance, or policy Context objects. Each has a possible direct research route, but none is a current label score.                                                |
| `conservative-liberalism`                                                                                                                         | Retired compatibility alias for canonical Liberal Conservatism; not Context and not a second Primary.                                                                                                                   |
| `civil-libertarian-cosmopolitan`                                                                                                                  | Retired synthetic compound split into Civil-libertarianism and Cosmopolitanism Modifier constructs; not Context.                                                                                                        |
| `national-traditionalist`                                                                                                                         | Retired synthetic compound decomposed into National Conservatism and Social Conservatism; not Context.                                                                                                                  |
| `decentralist-market-skeptic-of-state`                                                                                                            | Retired synthetic compound decomposed into Market Liberal and Decentralist Orientation facets; not Context.                                                                                                             |
| `bright-green-environmentalism`                                                                                                                   | Retired alias for Ecomodernist; not Context.                                                                                                                                                                            |
| `cultural-populism`, `egalitarian-statist`, and `revolutionary-collectivist`                                                                      | Keep retired under their existing legacy dispositions; do not resurrect as Context merely because they are historically intelligible compounds.                                                                         |
| Liberal Feminism and other moved narrow traditions                                                                                                | Follow the approved Specialist architecture where a current focused object and module route exist; Context is not a catch-all demotion.                                                                                 |

The distinction is important: Context is the appropriate product role for an
unmeasured object that remains useful to explain or browse. Retired is the
appropriate compatibility state for an alias or a synthetic compound that the
approved architecture has decomposed or rejected as a public object.

## 8. Public-result rules

Until a later versioned role decision changes the contract:

1. Context entries may appear in the catalog, glossary, explainer, search,
   source display, and relation-oriented documentation.
2. Context entries must not appear in ordinary nearest-label rankings, Primary
   scores, Modifier matches, respondent identity prompts, or public confidence
   claims.
3. A result may mention that a measured construct or Specialist has a
   relationship to a Context object only when the relation is explicitly
   labeled as context, influence, institutional expression, overlap, or
   contrast. It must not imply that the respondent holds the Context label.
4. Public copy must preserve descriptive, normative, and prescriptive
   separation. A description of a proposal or regime expectation is not a claim
   that the proposal works or that the regime has a morally preferred outcome.
5. High-risk, sensitive, and speculative Context entries require bespoke
   caution notes and must not be presented with unqualified “you are” language.
6. Context definitions may display source scope. Sources support conceptual
   interpretation and boundaries; they do not validate respondent scores,
   centroids, classifications, or latent classes.

## 9. Documentation and research-use rules

Documentation may use Context entries to:

- explain a tradition’s historical lineage or institutional expression;
- distinguish a policy proposal from a host ideology;
- document why a label was not promoted to a measured role;
- define graph relations and non-equivalence boundaries;
- identify future question-development candidates and missing constructs;
- support source-backed theory, history, and comparative institutional notes.

Research-only use may:

- expose a Context label as a pre-registered treatment or label-exposure
  condition;
- collect respondent self-recognition separately from scored ideology;
- test a direct policy or institutional-preference battery;
- build a focused Specialist or historical module under a new version and
  consented study protocol;
- compare a named Context configuration against M0 host-plus-facets models;
- use exploratory latent-class/profile models as challenger analyses.

Research-only use may not:

- convert catalog sources, theoretical coherence, synthetic centroids,
  centroid recovery, software tests, or module completion into validity;
- impute a Context label from a Primary, Modifier, Specialist, or unanswered
  question;
- treat self-identification alone as criterion validity;
- use an experimental Context result as an ordinary public score;
- silently reinterpret historical responses collected under v13.

## 10. Promotion, display, and validation gates

### 10.1 Tradition or Specialist promotion

A Context tradition may be considered for Specialist promotion only after:

- documented historical or contemporary coherence and an explicit scope;
- constitutive constructs that are not reducible to a host plus generic
  modifiers;
- direct, construct-matched, cognitively reviewed item coverage;
- evidence that respondents recognize and interpret the target construct as
  intended;
- within-family and nearest-neighbor discriminant evidence;
- psychometric and retest evidence appropriate to the proposed use;
- criterion interpretation that is defined before testing;
- fairness, language, scope, sensitivity, and community-informed review where
  relevant;
- held-out replication and a presentation-value review;
- an explicit versioned role decision and migration plan.

### 10.2 Policy or institutional promotion

Policy proposals and institutional models should normally be promoted to a
construct battery, choice task, or research module rather than to a public
ideology label. Promotion requires evidence that respondents distinguish the
mechanism from nearby values and hosts, that the items identify the intended
design choices, and that the construct has incremental value for the intended
research question.

### 10.3 Abstention

If a required defining construct is unmeasured, contradictory, or interpreted
in multiple incompatible ways, the system must abstain from assignment. It
must not substitute an adjacent Primary, Modifier, Specialist, source-based
description, or centroid value.

## 11. Current coverage gaps and future measurement candidates

| Candidate family                            | Present adjacent coverage                                                                                    | Missing direct evidence                                                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arab socialist and developmental compounds  | Arab Socialism, Pan-Arabism, Nasserism, Developmentalism, National Orientation, Anti-Imperialism             | Arab unity, regional membership, party organization, secular nationalism, development, sovereignty, and regime-practice separation                 |
| Developmental-authoritarian projects        | Developmentalism, Technocratic Orientation, Technocratic Centralism, State Capacity                          | Restricted pluralism, dominant-party rule, bureaucratic autonomy, rights/accountability, and non-authoritarian developmental comparison            |
| Anarchist organizational currents           | Social Anarchism, Anarcho-Communism, Anarcho-Syndicalism, Decentralist Orientation, direct-action constructs | Collective responsibility, tactical unity, anti-vanguardism, organization scale, and economic-order discrimination                                 |
| Religious-authority regimes                 | Theocrat, Religious Nationalism, Political Islam, Social Conservatism, religious-authority specialist items  | Final legal authority, interpretive authority, coercive enforcement, minority rights, dissent, and pluralism                                       |
| Technology and future currents              | Transhumanism, Technocratic Orientation, Technology-Governance Specialist modules                            | Automation authority, human override, data primacy, privacy, enhancement, safety, access, acceleration, and inequality                             |
| Constitutional and polycentric institutions | Monarchist Specialists, Republicanism, Decentralist Orientation, Cosmopolitanism, Internationalism           | hereditary authority, constitutional limits, delegation, revocability, jurisdictional exit, global federal power, subsidiarity, and accountability |
| Welfare and policy proposals                | Social Democracy, Social Liberalism, Redistribution, Predistribution, Fiscal Orientation                     | policy-specific design, funding, conditionality, service replacement, labor effects, and respondent rationale                                      |

## 12. Consequences for the approved architectures

### Primary

The 16 approved Primaries remain unchanged. Context objects must not be used
to fill missing Primary constructs or to create new Primary endpoints by
catalog association. National Conservatism and Liberal Conservatism remain the
approved M1 compositional-residual cases; Context policy or institutional
objects do not alter their M0/M1 evidence gates.

### Modifiers

The approved Modifier domains remain the measurement primitives. Context
objects can be graph-linked as institutional or policy expressions of National
Orientation, Transnational Moral and Political Order, Authority and
Institutional Order, Economic Order, Social Relations, Change/Strategy, and
Technology/Human Enhancement. They must not be treated as aggregate Modifier
scores. In particular, UBI is not Egalitarianism, World Federalism is not
Cosmopolitanism, and Accelerationism is not Transhumanism.

### Specialists

The approved 78-ID Specialist roster remains unchanged. Context entries may be
candidate parents, regional/organizational neighbors, institutional
expressions, or future module targets, but graph adjacency does not authorize
assignment. Baʿthism, Developmental Authoritarianism, Platformism, and Utopian
Socialism require a future Specialist decision rather than an implicit addition
to the current roster.

### Questions and scoring

No Context-specific items should be added to the ordinary bank under this
review. Future items must identify the construct, layer, theory context, source
scope, response type, and whether the item is descriptive, normative, or
prescriptive. Scoring remains direct-indicator-only, with evidence thresholds,
uncertainty, abstention, versioning, and respondent validation preserved.

### Implementation

The next implementation stage should add a versioned Context ontology registry
and graph migration view rather than modifying v13 role arrays in place. The
registry should support:

- independent `conceptualKind`, `contextStatus`, `measurementStatus`, and
  `futureRoute` fields;
- relation type, relation facet, source scope, and historical version;
- explicit Context-to-construct and Context-to-role edges;
- public display policy that excludes Context from ordinary score paths;
- legacy alias/retired handling and historical record preservation;
- tests proving every current Context ID is covered exactly once and no Context
  reaches Primary, Modifier, or Specialist scoring without a versioned role
  decision.

## 13. Unresolved questions

1. Should Baʿthism and Developmental Authoritarianism receive separate future
   modules, or a comparative regional/developmental module with conditional
   outputs?
2. Can Platformism be distinguished from Anarcho-Communism and
   Anarcho-Syndicalism without measuring organization, strategy, and economic
   order as one contaminated bundle?
3. Does Utopian Socialism have respondent-relevant recognition outside a
   historical knowledge task, or should it remain documentation-only?
4. Which Context institutional models are best studied through forced-choice
   governance tasks rather than agreement items?
5. Can technology-centered Context entries be sampled as contemporary political
   currents with stable boundaries across language, age, and technical
   familiarity?
6. What safety and community-informed review is required before displaying
   sensitive religious-authority and identity-adjacent Context relationships?
7. Which Context-to-construct edges should be public, and which should remain
   research metadata to avoid suggesting endorsement or respondent identity?
8. How should historical influence edges be represented when contemporary
   adherents reject the claimed lineage?
9. What display wording best distinguishes a policy proposal, institutional
   mechanism, and intellectual current for non-specialist users?
10. Which future Context study, if any, has sufficient incremental measurement
    value to justify a new question bank and role decision?

## 14. Decision categories and implementation handoff

### Conceptual/political-theory decisions

- Context is a product role, not a conceptual kind.
- Every current Context object receives an independent kind and graph scope.
- Policy, institutional, governance, intellectual, historical, regional,
  organizational, and regime objects are not interchangeable.
- Polyhierarchy and typed non-equivalence edges are required; no flat Context
  list is authoritative for conceptual inheritance.

### Measurement-design decisions

- All 19 current entries remain `context-only` and outside ordinary scoring.
- Adjacent construct or Specialist coverage is not Context-label coverage.
- Policy and institutional objects default to direct batteries or choice tasks;
  traditions may be considered for focused Specialist modules.
- Promotion, display, and assignment require direct respondent evidence and the
  existing abstention, psychometric, retest, criterion, fairness, and
  presentation gates.

### Empirical questions

- Whether the four high-priority tradition candidates have incremental value
  beyond host-plus-facet M0 representations.
- Whether institutional and policy respondents distinguish the proposed
  mechanisms from nearby values and hosts.
- Whether technology, religious-authority, historical, and regional concepts
  are interpreted consistently across relevant populations and languages.
- Whether any candidate has stable, fair, criterion-relevant, and replicable
  respondent patterns.

### Implementation decisions

- Do not change the frozen v13 role arrays, scorer, question bank, or stored
  records in this Context review.
- Add a versioned Context registry and graph migration view in a later
  implementation task.
- Preserve current public catalog behavior and source display.
- Add coverage and role-exclusion tests before any future Context route is
  implemented.

The construct blueprint is now the required dependency for any future Context
promotion. Context relations may describe institutionalization or policy
expression, but they cannot create a measured construct or substitute for
direct respondent evidence.

## 15. Authority record

This review is authoritative for the vNext Context architecture and should be
read with:

- [`vnext-taxonomy-measurement-architecture-review-2026-08.md`](vnext-taxonomy-measurement-architecture-review-2026-08.md)
- [`vnext-modifier-architecture-review-2026-08.md`](vnext-modifier-architecture-review-2026-08.md)
- [`vnext-specialist-architecture-review-2026-08.md`](vnext-specialist-architecture-review-2026-08.md)
- [`vnext-construct-architecture-measurement-blueprint-2026-08.md`](vnext-construct-architecture-measurement-blueprint-2026-08.md)
- [`methodological-change-decision-log-2026-08.md`](methodological-change-decision-log-2026-08.md)
- frozen implementation at `f0324dbf27dfc6e35ff557992e4643e3df15ee0e`

The next architecture stage may proceed to implementation planning for the
Context registry and then to the next approved taxonomy layer without
reopening the frozen Measurement Architecture unless a genuine contradiction
is documented.
