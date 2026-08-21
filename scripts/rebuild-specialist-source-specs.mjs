import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const write = (path, value) => {
  mkdirSync(path.substring(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};
const unique = (values) => [...new Set(values.filter(Boolean))];
const ref = (moduleId, sourceRefs) => unique([
  "source:v1-canonical-manifest",
  "source:phase0-measurement-contract",
  ...sourceRefs[moduleId],
]);

const moduleSpecs = {
  "anarchist-families-module": {
    label: "Anarchist and market-anarchist families",
    sources: ["citation:1b5ab88e18ea0d1b", "citation:52724480906e1b00", "citation:8562430ec5beba7e", "citation:92cf18c2a150b81e", "citation:5a562c689b1ef3bd", "citation:d035a01d7395b2a3"],
    pairs: [["anti-authority", "market-coordination"], ["communal-property", "market-property"], ["communal-coordination", "direct-federation"]],
  },
  "conservative-variants-module": {
    label: "Conservative variants",
    sources: ["citation:462f83960116c2c0", "citation:v3-oxford-conservatism", "citation:16a3600798f070be", "citation:e9afa3c3056240c5", "citation:9c44a8a1c2400720"],
    pairs: [["moral-traditionalism", "national-continuity"], ["prudence", "assertive-internationalism"]],
  },
  "feminist-faction-module": {
    label: "Feminist factions",
    sources: ["citation:f3abe9549d155858", "citation:9981fba6d37552c9", "citation:efbc47adc614ad4d", "citation:fb7a357af1eb961e", "citation:2b021c15d204189b"],
    pairs: [["legal-equality-reform", "anti-hierarchy-strategy"], ["structural-patriarchy", "class-social-reproduction"]],
  },
  "green-morphology-module": {
    label: "Green ideological morphologies",
    sources: ["citation:v3-oxford-green-ideology", "citation:1ae79788486a6bdc", "citation:31f76d2e42e72045", "citation:88ca5b3bc9028f15", "citation:e725d2d09db0e176", "citation:92cf18c2a150b81e"],
    pairs: [["post-growth", "market-technology"], ["collective-ownership", "democratic-decentralism"], ["ecological-standing", "post-growth"]],
  },
  "identity-sovereignty-module": {
    label: "Identity, sovereignty, and self-determination traditions",
    sources: ["citation:v3-sep-nationalism", "citation:72a144a375dd03d3", "citation:0970dba48be47ce1", "citation:ce96036bc5bbc094", "citation:001375fe3543c227", "citation:f2e966e6106d230b", "citation:dda7d93939d1d146", "citation:9b4674300ce4501c", "citation:bd6acf17db8b57cf", "citation:981b366400f0cd3c"],
    pairs: [["ascriptive-membership", "pluralist-accommodation"], ["territorial-separatism", "community-autonomy"], ["dominant-nation-congruence", "minority-self-government"], ["institutional-recognition", "decolonial-land-sovereignty"]],
  },
  "monarchist-municipal-module": {
    label: "Monarchist and municipal traditions",
    sources: ["citation:2aff035965effa6a", "citation:855c558d330f6d15", "citation:6a5fc5f74b53b6d4", "citation:e725d2d09db0e176", "citation:c6778c6cde4b2ae9"],
    pairs: [["hereditary-authority", "constitutional-monarchy"], ["municipal-autonomy", "confederal-coordination"]],
  },
  "religious-national-politics-module": {
    label: "Religious-national political traditions",
    sources: ["citation:773c66fdd80832c7", "citation:6d882320da8a57cd", "citation:2823223e137871fb", "citation:767d8856723b95a6", "citation:1281263f480658cd", "citation:726584f99844985f", "citation:a040a5400317ec7b", "citation:11f5a6d12b7e87c8"],
    pairs: [["religious-national-fusion", "interpretive-pluralism"], ["religious-authority", "popular-constitutionalism"], ["civilizational-nationalism", "minority-citizenship"], ["party-competition", "constitutional-review"]],
  },
  "socialist-families-module": {
    label: "Socialist families",
    sources: ["citation:8a845d11cf0bd6a1", "citation:202b304371d95506", "citation:bebaea9c7a0e48c3", "citation:1dad3afb436d6571", "citation:2d99f6e2609c3939", "citation:258cbf6757349f69"],
    pairs: [["social-ownership", "democratic-planning"], ["reformism", "revolutionary-strategy"]],
  },
  "technology-governance-module": {
    label: "Technology and governance traditions",
    sources: ["citation:a2937319cd34d058", "citation:c0ac56609a28bea1", "citation:80af85709da20b89", "citation:15c1be9ae4824ea5", "citation:9e1c40cea0982cc0", "citation:c38b09dea29362d0", "citation:ce103804aedf7014", "citation:110d4ab1090b1d1f"],
    pairs: [["accelerationist-strategy", "centralized-administration"], ["algorithmic-authority", "expert-administration"], ["centralized-administration", "decentralized-technology"], ["market-acceleration", "decentralized-technology"]],
  },
};

const definitions = {
  "anarchist-families-module:anti-authority": ["Skepticism toward the political justification of coercive authority, especially authority that claims obedience without continuing consent, contestability, or non-dominating justification.", "normative", "bipolar", "acceptance of authority as legitimate only when it is justified, contestable, and non-dominating", "rejection of authority claims that rest on mere office, hierarchy, or coercive command", ["It is not a preference for disorder or the absence of all coordination."], ["Voluntary delegation can be compatible with this construct when revocable and accountable."]],
  "anarchist-families-module:communal-coordination": ["Coordination through common deliberation, mutual aid, and shared institutions rather than through a single command center or purely competitive exchange.", "mixed", "conditional", "exclusive reliance on private exchange or centralized command", "democratic and reciprocal common coordination", ["It does not require one particular ownership regime or deny all markets."], ["Large-scale federated coordination is included when authority remains accountable to participating communities."],],
  "anarchist-families-module:communal-property": ["A property regime in which productive resources are held or governed in common by affected communities, workers, or voluntary associations.", "normative", "bipolar", "support for common or worker-and-community governance of productive resources", "support for absentee or exclusive private control of productive resources", ["It is not identical to state ownership or equal consumption of every good."], ["Cooperatives, commons, and federated municipal ownership can all qualify if control is genuinely shared."]],
  "anarchist-families-module:direct-federation": ["A strategy of building political order through directly organized, federated associations and mutual-aid institutions rather than capturing a centralized state.", "prescriptive", "bipolar", "priority to direct association, federation, and mutual aid as the route of political change", "priority to electoral or centralized state capture as the route of political change", ["It does not mean that every election, delegation, or public institution is rejected."], ["A federation may delegate limited tasks while retaining recall, exit, and bottom-up authority."],],
  "anarchist-families-module:market-coordination": ["Reliance on decentralized exchange, price signals, contract, and private or cooperative enterprise to coordinate production and distribution.", "mixed", "conditional", "coordination primarily through common planning or command", "coordination primarily through market exchange and dispersed information", ["It does not imply that markets eliminate hierarchy, externalities, or the need for public goods."], ["A mixed economy can score positively when market allocation is the decisive coordinating mechanism in the relevant domain."],],
  "anarchist-families-module:market-property": ["Protection of individually or privately held productive property and the right to transfer, contract over, and use it under general rules.", "normative", "bipolar", "support for private or individually controlled productive property", "support for common or collectivized control of productive property", ["It is not a claim that all property claims are valid or that corporate concentration is harmless."], ["Small proprietor, cooperative, and contract-based forms must be distinguished from absentee monopoly."],],
  "conservative-variants-module:assertive-internationalism": ["A prescriptive foreign-policy orientation that treats active power projection, alliance leadership, or intervention as legitimate tools for defending a political order abroad.", "prescriptive", "bipolar", "support for active international power and intervention under stated political purposes", "preference for restraint, non-intervention, or narrowly defensive foreign policy", ["It is not equivalent to generic patriotism, militarism, or support for every intervention."], ["A position can be assertive in one theater and restrained in another; the item must state the relevant scope."],],
  "conservative-variants-module:moral-traditionalism": ["The view that inherited moral, familial, religious, or social norms deserve presumptive political protection because continuity is itself a source of order and meaning.", "normative", "bipolar", "presumption in favor of inherited moral and social norms", "presumption that inherited norms should yield readily to revision or individual choice", ["It is not a single religion, a claim that every inherited norm is just, or opposition to all reform."], ["Prudential reform can coexist with traditionalism when it is framed as preserving underlying continuity."],],
  "conservative-variants-module:national-continuity": ["The idea that political legitimacy and social order depend in part on maintaining a historically continuous national community, its institutions, and its inherited symbols.", "normative", "bipolar", "priority to continuity of the national community and its inherited institutions", "priority to reconstructing political membership without national continuity as a presumption", ["It is not identical to ethnic exclusion, territorial expansion, or hostility to all immigration."], ["Civic, cultural, and ethnic accounts of continuity must be distinguished rather than treated as interchangeable."],],
  "conservative-variants-module:prudence": ["A decision rule that gives weight to historical experience, unintended consequences, institutional knowledge, and incremental revision when judging political change.", "prescriptive", "multidimensional", "preference for cautious, institution-aware, consequence-sensitive change", "preference for abstract principle or rapid transformation despite institutional uncertainty", ["It is not mere indecision, status-quo worship, or opposition to all structural change."], ["A radical reformer can claim prudence when the proposed rupture is argued to prevent greater institutional harm."],],
  "feminist-faction-module:anti-hierarchy-strategy": ["A strategy of reducing gendered power by transforming authority relations in households, workplaces, movements, and states rather than relying only on formal equal treatment.", "prescriptive", "bipolar", "priority to dismantling gendered hierarchy through structural and collective change", "priority to adapting existing hierarchies or relying on formal equality alone", ["It does not require one theory of patriarchy or reject every institution with delegated authority."], ["Reform and abolition can be distinguished by the institution and time horizon under discussion."],],
  "feminist-faction-module:class-social-reproduction": ["Attention to how paid work, unpaid care, household organization, and class relations reproduce gendered political and economic power.", "descriptive", "unipolar", "recognition that social reproduction and class structure are central explanatory mechanisms", "treating household and care relations as politically irrelevant or secondary by definition", ["It is not a claim that class explains every gender relation or that all care must be socialized."], ["Different feminist traditions locate the mechanism in labor, property, family, race, sexuality, or their interaction."],],
  "feminist-faction-module:legal-equality-reform": ["Use of law and public institutions to secure equal rights, anti-discrimination, equal citizenship, and enforceable access across sex and gender.", "normative", "bipolar", "support for legal and institutional reform toward equal rights and status", "skepticism that formal legal equality is a sufficient or desirable route to justice", ["It is not identical to liberal individualism or denial of structural power."], ["A position may support equal-rights law while also demanding material and cultural transformation."],],
  "feminist-faction-module:structural-patriarchy": ["An explanatory account of gendered domination as a patterned system reproduced across institutions, norms, economic relations, and intimate life.", "descriptive", "unipolar", "recognition of patriarchy as a structural and institutional pattern of power", "treating gender inequality as isolated prejudice or only an individual attitude", ["It does not assert a single universal male conspiracy or erase differences among women."], ["Intersectional and transnational analyses can specify different mechanisms and groups without abandoning the structural claim."],],
  "green-morphology-module:collective-ownership": ["Political support for collective, public, cooperative, or commons-based control of ecologically significant resources and infrastructures.", "normative", "bipolar", "support for collective control of ecologically significant resources", "priority to private or market control as the default for those resources", ["It is not identical to central state planning or opposition to every market instrument."], ["Public, municipal, cooperative, and commons arrangements differ in scale and accountability."],],
  "green-morphology-module:democratic-decentralism": ["A prescriptive commitment to place ecological decisions in accountable local or federated institutions with meaningful participation and recall.", "prescriptive", "bipolar", "priority to decentralized, participatory, and federated ecological governance", "priority to centralized expert or administrative direction", ["It does not deny the need for national or transnational coordination of shared ecological systems."], ["Decentralization is not satisfied by merely moving administration downward without public control."],],
  "green-morphology-module:ecological-standing": ["The normative view that ecological systems, nonhuman life, or future generations possess moral standing that constrains human political choice.", "normative", "unipolar", "recognition of ecological or nonhuman claims as politically weight-bearing", "treating ecological effects as relevant only through immediate human preference", ["It does not prescribe one metaphysics of nature or imply that all human uses are impermissible."], ["Anthropocentric stewardship and intrinsic-value positions should remain distinguishable."],],
  "green-morphology-module:market-technology": ["Reliance on markets and technological innovation as principal tools for solving ecological scarcity, emissions, and resource problems.", "prescriptive", "bipolar", "confidence in market instruments and technological innovation as leading ecological tools", "priority to sufficiency, regulation, collective provision, or reduced throughput over market-technology solutions", ["It is not a claim that technology is always beneficial or that markets need no regulation."], ["A green position can support selective technology while rejecting market allocation in essential goods."],],
  "green-morphology-module:post-growth": ["A prescriptive orientation toward reducing material and energy throughput in high-consuming economies while protecting provisioning, equality, and ecological limits.", "prescriptive", "bipolar", "priority to ecological sufficiency and planned reduction of high-consumption throughput", "priority to continued aggregate growth and technological substitution as the primary solution", ["It is not synonymous with recession, austerity, poverty, or every environmental policy."], ["A post-growth position may support growth in low-income provisioning or particular public capabilities."],],
  "identity-sovereignty-module:ascriptive-membership": ["Treating inherited ethnic, religious, cultural, or ancestral membership as a politically significant basis of belonging and entitlement.", "normative", "bipolar", "political weight for inherited or ascribed group membership", "political membership based primarily on civic, universal, or voluntary criteria", ["It is not necessarily a demand for exclusion, hierarchy, or territorial separation."], ["Many movements combine ascriptive belonging with civic inclusion or constitutional equality."],],
  "identity-sovereignty-module:autonomous-resurgence": ["A strategy of rebuilding subordinated collective institutions, cultural practices, and political capacity through self-directed resurgence.", "prescriptive", "bipolar", "priority to autonomous collective resurgence and institution-building", "priority to integration into dominant institutions as the primary route of change", ["It is not a claim that autonomy requires isolation or rejection of all external alliances."], ["Resurgence may be cultural, territorial, legal, economic, or a combination."],],
  "identity-sovereignty-module:community-autonomy": ["Political authority for a bounded community to govern substantial internal affairs through its own institutions and accountable membership.", "normative", "bipolar", "support for meaningful community self-government", "priority to uniform central authority over community-specific self-government", ["It is not identical to individual secession, ethnic purity, or immunity from general rights constraints."], ["Autonomy can be territorial, non-territorial, municipal, or institutional."],],
  "identity-sovereignty-module:decolonial-land-sovereignty": ["A claim that colonized or Indigenous peoples should regain authority over land, territory, and political relationships imposed through colonial rule.", "normative", "bipolar", "support for decolonial land authority and self-determination", "treating existing colonial title and administrative boundaries as presumptively final", ["It is not a generic land reform program or a claim that every historical boundary has one simple remedy."], ["Remedies may include jurisdiction, restitution, treaty renewal, co-governance, or territorial restoration."],],
  "identity-sovereignty-module:dominant-nation-congruence": ["The view that state boundaries, public institutions, and political membership should substantially reflect the historically dominant nation or culture.", "normative", "bipolar", "priority to congruence between dominant national identity and state authority", "priority to plural or civic state membership that does not privilege one dominant nation", ["It is not identical to ethnic nationalism, forced assimilation, or territorial expansion."], ["Civic national identity can still be dominant and exclusionary; the relevant boundary must be stated."],],
  "identity-sovereignty-module:institutional-recognition": ["Support for public recognition of a group’s identity, status, history, rights, and institutions through law or constitutional practice.", "normative", "bipolar", "support for formal institutional recognition of collective identity and claims", "preference for a formally uniform public order that withholds group-specific recognition", ["Recognition is not the same as autonomy, material redistribution, or symbolic endorsement alone."], ["Recognition can be individual, group-based, territorial, or constitutional."],],
  "identity-sovereignty-module:minority-self-government": ["Support for legally protected self-government by a politically subordinate or minority community within a wider state or federation.", "normative", "bipolar", "support for minority institutions with protected self-rule", "preference for unilateral central control or assimilation", ["It is not a claim that minority institutions are beyond review or that all minorities seek territorial rule."], ["Non-territorial, territorial, treaty, and consociational forms are distinct."],],
  "identity-sovereignty-module:pan-african-solidarity": ["Political solidarity across African and African-diasporic peoples aimed at resisting colonial domination and building shared political agency.", "normative", "bipolar", "support for transnational African solidarity and collective political agency", "priority to exclusively state-bounded or assimilationist political identity", ["It is not interchangeable with Black separatism, one racial essence, or one institutional program."], ["Pan-African projects may be cultural, diplomatic, economic, federal, or anti-colonial."],],
  "identity-sovereignty-module:pluralist-accommodation": ["A political arrangement that protects multiple identities through equal citizenship, institutional accommodation, and negotiated coexistence.", "normative", "bipolar", "support for plural and negotiated accommodation of group difference", "priority to one uniform national or religious identity as the public norm", ["Accommodation does not require every group claim to be accepted or exempt from general rights."], ["Pluralism can involve individual rights, group rights, power-sharing, or federal arrangements."],],
  "identity-sovereignty-module:territorial-separatism": ["Support for establishing a separate territorial political authority for a people that regards existing state membership as incompatible with self-determination.", "prescriptive", "bipolar", "support for territorial separation as a remedy for denied self-determination", "preference for autonomy, federalism, or shared rule within the existing state", ["It is not synonymous with all nationalism, ethnic cleansing, or opposition to negotiated federation."], ["The claim must distinguish remedial secession from expansionist or exclusionary partition."],],
  "monarchist-municipal-module:confederal-coordination": ["Coordination among self-governing municipalities or local polities through revocable, limited, and negotiated common institutions.", "prescriptive", "bipolar", "priority to confederal shared rule among autonomous local units", "priority to a unitary or centrally sovereign administrative hierarchy", ["It is not equivalent to ordinary administrative decentralization or loose cultural association."], ["Confederal institutions may coordinate defense, infrastructure, or common rights without absorbing local sovereignty."],],
  "monarchist-municipal-module:constitutional-monarchy": ["A monarchy in which the sovereign’s authority is bounded by constitutional law and shared with representative or judicial institutions.", "normative", "bipolar", "support for bounded hereditary office within constitutional government", "support for unbounded hereditary sovereignty or non-monarchical constitutional rule", ["It is not the same as ceremonial monarchy, absolute monarchy, or generic respect for tradition."], ["The decisive boundary is legal and political constraint, not the amount of ceremonial symbolism."],],
  "monarchist-municipal-module:hereditary-authority": ["The claim that hereditary succession provides a legitimate basis for holding supreme or symbolically supreme political office.", "normative", "bipolar", "support for hereditary succession as a source of political authority", "support for elective, rotational, or merit-based succession instead", ["It is not automatically a claim for absolute rule or inherited wealth in every domain."], ["Hereditary office can be constrained, ceremonial, elective within a dynasty, or fully sovereign."],],
  "monarchist-municipal-module:municipal-autonomy": ["Substantial self-government for municipalities or local communities over their own institutions, services, and political development.", "normative", "bipolar", "support for robust municipal self-government", "priority to centralized administration over local political discretion", ["It is not merely administrative delegation or a claim that local majorities may violate general rights."], ["Municipal autonomy can coexist with constitutional monarchy, federation, or confederation."],],
  "religious-national-politics-module:civilizational-nationalism": ["A nationalist account that defines the political nation through a broad civilizational, religious, or historical culture extending beyond a narrow civic constitution.", "normative", "bipolar", "political priority for civilizational-historical belonging", "priority for civic or universal membership independent of civilizational identity", ["It is not identical to every religious identity, ethnic nationalism, or a single state religion."], ["Civilizational claims may be plural internally and can be used for inclusion or exclusion."],],
  "religious-national-politics-module:constitutional-review": ["Institutional authority for courts or constitutional bodies to review legislation and executive action against higher-law commitments.", "normative", "bipolar", "support for authoritative constitutional review", "preference for legislative or popular final authority without strong judicial review", ["It is not a judgment that courts are always correct or that review must be centralized."], ["Religious, rights-based, and democratic constitutional review can have different sources of higher law."],],
  "religious-national-politics-module:hindu-civilizational-belonging": ["A political conception of India or Hindu identity as a civilizational community whose history and symbols should shape public membership and state purpose.", "normative", "bipolar", "political priority for Hindu civilizational belonging", "priority for civic membership independent of Hindu civilizational identity", ["It is not a synonym for private Hindu faith, all Hindu political thought, or one party platform."], ["Civilizational belonging may be asserted culturally, constitutionally, territorially, or through minority policy."],],
  "religious-national-politics-module:interpretive-pluralism": ["Acceptance that religious or constitutional traditions contain legitimate internal disagreement and require interpretive contestation rather than one final political reading.", "normative", "bipolar", "support for plural interpretation and contestable authority within the tradition", "support for one binding institutional interpretation that settles political meaning", ["It is not relativism or denial that communities can adopt shared commitments."], ["Pluralism can be intra-traditional, inter-religious, constitutional, or procedural."],],
  "religious-national-politics-module:islamic-public-law": ["The view that Islamic jurisprudential or ethical principles should have a specified role in public law and constitutional ordering.", "normative", "bipolar", "support for a public-law role for Islamic principles", "support for public law grounded independently of Islamic jurisprudential authority", ["It does not specify one school, clerical institution, or degree of legal enforcement."], ["Islamic constitutionalism ranges from rights-compatible reference to strong juristic review; these are separate dimensions."],],
  "religious-national-politics-module:jewish-national-self-determination": ["Support for Jewish collective self-determination in a national political framework, including the claim to secure a Jewish national home or state.", "normative", "bipolar", "support for Jewish national self-determination", "preference for a political order that does not institutionalize Jewish national self-determination", ["It is not identical to a particular border, government, religious orthodoxy, or policy toward minorities."], ["Civic, ethnic, religious, and binational versions must be distinguished."],],
  "religious-national-politics-module:minority-citizenship": ["Equal political membership and civil standing for religious, ethnic, or ideological minorities within a state claiming a dominant religious or national identity.", "normative", "bipolar", "support for equal minority citizenship under the public order", "acceptance of differentiated or subordinate citizenship for minorities", ["It is not the same as cultural assimilation or complete separation of religion and state."], ["Formal equality can coexist with unequal social power; the item should specify legal, political, or substantive scope."],],
  "religious-national-politics-module:party-competition": ["Acceptance of organized, competitive parties as legitimate vehicles for representing disagreement and gaining governmental authority.", "normative", "bipolar", "support for open party competition and alternation", "preference for one-party, movement, clerical, military, or non-competitive authority", ["It is not a claim that every party is equally legitimate or that competition alone secures liberal rights."], ["Competition may be bounded by constitutional, religious, or national rules."],],
  "religious-national-politics-module:popular-constitutionalism": ["The view that constitutional meaning and authority should remain substantially accountable to popular political judgment rather than being monopolized by courts or elites.", "normative", "bipolar", "priority to popular participation in constitutional interpretation and change", "priority to elite or judicial finality over popular constitutional judgment", ["It is not simple majoritarianism or rejection of constitutional rights."], ["Popular constitutionalism can operate through elections, movements, referenda, or constitutional conventions."],],
  "religious-national-politics-module:religious-authority": ["Political deference to recognized religious scholars, institutions, or normative authorities in determining public law or legitimate governance.", "normative", "bipolar", "support for religious authorities as authoritative political interpreters", "preference for political judgment independent of religious authorities", ["It is not private religiosity, clerical rule, or all appeals to religious reasons."], ["Authority can be advisory, constitutional, judicial, clerical, or distributed among communities."],],
  "religious-national-politics-module:religious-national-fusion": ["A political project that fuses national membership and state purpose with a substantive religious identity or religiously marked public order.", "normative", "bipolar", "support for fusion of religious identity and national-state purpose", "support for a civic or secular state that separates national membership from religious identity", ["It is not simply religious voters, established churches, or cultural religious heritage."], ["Fusion may be symbolic, constitutional, legal, or coercive; those forms should not be conflated."],],
  "socialist-families-module:democratic-planning": ["Collective determination of major production and investment priorities through participatory, representative, or deliberative planning institutions.", "prescriptive", "bipolar", "priority to democratic planning of major economic decisions", "priority to markets or private investment decisions as the principal allocator", ["It is not identical to command planning, abolition of all markets, or a claim that planning is empirically feasible."], ["Planning can be indicative, participatory, sectoral, or binding, and can coexist with markets."],],
  "socialist-families-module:reformism": ["A strategy of pursuing socialist or egalitarian transformation through incremental reforms, elections, organized labor, and existing constitutional institutions.", "prescriptive", "bipolar", "priority to cumulative reform through existing institutions", "priority to rupture, insurrection, or extra-constitutional replacement of existing institutions", ["It is not political moderation in every policy domain or a denial that institutions can be transformed."], ["Reformists may support disruptive movements when they are linked to institutional change rather than replacement."],],
  "socialist-families-module:revolutionary-strategy": ["A strategy that treats rapid rupture with existing property or state institutions as necessary or central to socialist transformation.", "prescriptive", "bipolar", "priority to revolutionary rupture and replacement of existing institutions", "priority to gradual, electoral, or reformist transformation", ["It is not mere radical rhetoric or support for any particular violent tactic."], ["Revolutionary strategies can be nonviolent, mass-democratic, insurrectionary, or institution-building."],],
  "socialist-families-module:social-ownership": ["Collective, public, cooperative, or worker ownership and control of productive assets rather than concentrated private ownership.", "normative", "bipolar", "support for social or worker control of productive assets", "priority to concentrated private ownership and investor control", ["It is not one fixed model of state ownership, equal shares, or abolition of all private property."], ["Ownership and control may be separated; market socialism and cooperatives remain distinct from command administration."],],
  "technology-governance-module:accelerationist-strategy": ["A strategy of intensifying technological, economic, or social processes in order to force a political transformation or move beyond the present order.", "prescriptive", "bipolar", "priority to acceleration and intensification as a political strategy", "priority to restraint, stabilization, or deliberate slowing as the political strategy", ["It is not generic enthusiasm for innovation or a prediction that change will be fast."], ["Left, reactionary, and techno-capitalist accelerationisms can share a tactic while rejecting one another’s ends."],],
  "technology-governance-module:algorithmic-authority": ["Political authority delegated to computational systems, automated classifications, or algorithmic decision procedures in ways that materially shape rights, access, or governance.", "normative", "bipolar", "support for algorithmic systems as authoritative governance instruments", "priority to humanly contestable and non-automated authority", ["It is not ordinary software assistance, statistical evidence, or every use of automation."], ["The decisive boundary is binding or practically unreviewable authority, not technical complexity alone."],],
  "technology-governance-module:centralized-administration": ["Governance through centralized administrative institutions that coordinate information, standards, infrastructure, and enforcement across a large jurisdiction.", "normative", "bipolar", "support for centralized administrative coordination", "priority to polycentric, local, or distributed governance", ["It is not synonymous with dictatorship, bureaucracy, or national scale by itself."], ["A centralized system can be democratically accountable; a decentralized system can still be coercive or opaque."],],
  "technology-governance-module:decentralized-technology": ["Political preference for distributed technical infrastructures that reduce dependence on a single platform, administrator, or point of control.", "normative", "bipolar", "support for distributed and interoperable technical infrastructures", "priority to integrated centralized platforms or administrative control", ["It is not a guarantee of privacy, democracy, or equal power."], ["Decentralization may concern architecture, ownership, governance, or data portability; the item must specify which."],],
  "technology-governance-module:expert-administration": ["Political deference to specialized experts and technocratic agencies to make or implement complex public decisions.", "normative", "bipolar", "support for expert or technocratic authority in complex governance", "priority to lay participation, elected judgment, or contestable public deliberation", ["It is not respect for evidence, professional competence, or delegated implementation in itself."], ["Expert advice can coexist with democratic control when final authority and reasons remain contestable."],],
  "technology-governance-module:market-acceleration": ["A political strategy of using competition, investment, and market expansion to accelerate technological development and social transformation.", "prescriptive", "bipolar", "priority to market competition and investment as acceleration mechanisms", "priority to public, cooperative, or regulated direction of technological change", ["It is not generic support for markets, innovation, or economic growth."], ["Market acceleration can be paired with strong state capacity or radical anti-state commitments; the combination matters."],],
};

const constructsPath = "v2/content/constructs/specialist.json";
const candidatesPath = "v2/content/specialists/candidates.json";
const profilesPath = "v2/content/profiles/specialists.json";
const itemsPath = "v2/content/items/specialist.json";
const constructs = read(constructsPath);
const candidates = read(candidatesPath);
const profiles = read(profilesPath);
const items = read(itemsPath);
const provenanceSourceIds = new Set(read("v2/content/provenance/sources.json").map((source) => source.id));

const constructById = new Map(constructs.map((construct) => [construct.id, construct]));
const specById = new Map();
for (const construct of constructs) {
  const key = `${construct.moduleId}:${construct.sourceKey}`;
  const definition = definitions[key];
  if (!definition) throw new Error(`Missing source-backed specification for ${key}`);
  const [canonicalDefinition, semanticLayer, structureType, negative, positive, exclusions, boundaryCases] = definition;
  const module = moduleSpecs[construct.moduleId];
  const sourceRefs = ref(construct.moduleId, Object.fromEntries(Object.entries(moduleSpecs).map(([id, value]) => [id, value.sources])));
  const enriched = {
    ...construct,
    description: canonicalDefinition,
    canonicalDefinition,
    conceptualScope: `This module-local construct compares ${module.label.toLowerCase()} on the specified political content; it is not a global ideology axis and cannot establish a label outside the module.`,
    exclusions,
    boundaryCases,
    semanticLayer,
    structureType,
    poles: { negative, positive },
    boundaryStatement: `The construct is limited to the political content stated in its definition. ${boundaryCases[0]} It is scored for this module only and remains a research candidate pending expert and respondent-validity gates.`,
    lifecycle: {
      conceptualStatus: "source-backed-candidate",
      measurementStatus: "research-candidate",
      publicRoleStatus: "research-only",
    },
    provenanceRefs: sourceRefs,
  };
  specById.set(construct.id, enriched);
}

const sourceRefsByModule = Object.fromEntries(Object.entries(moduleSpecs).map(([id, value]) => [id, value.sources]));
const policyThresholds = { constitutive: 0.65, core: 0.55, characteristic: 0.25, contested: 0.2, compatible: 0.2, peripheral: 0.15, incompatible: 0.65 };
const policyName = "specialist-commitment-evidence-v1";
const policyCriterion = (commitment) => {
  if (!commitment.criterion) return undefined;
  const threshold = policyThresholds[commitment.relation] ?? 0.25;
  if (commitment.criterion.operator === "minimum") return { operator: "minimum", minimum: threshold };
  if (commitment.criterion.operator === "maximum") return { operator: "maximum", maximum: -threshold };
  return { operator: "interval", minimum: -threshold, maximum: threshold };
};
const direction = (criterion) => criterion?.operator === "maximum" ? "rejects or limits" : criterion?.operator === "minimum" ? "endorses or prioritizes" : "treats as conditional or contested";
const transformCommitment = (commitment, variant, moduleId) => {
  const construct = specById.get(commitment.constructId);
  if (!construct) throw new Error(`Unknown specialist commitment construct ${commitment.constructId}`);
  const criterion = policyCriterion(commitment);
  const policy = criterion ? `${policyName}:${commitment.relation}:${criterion.operator}` : `${policyName}:${commitment.relation}:no-threshold`;
  return {
    ...commitment,
    criterion,
    criterionPolicy: policy,
    rationale: `${commitment.relation} content hypothesis: ${variant.name} ${direction(commitment.criterion)} ${construct.name.toLowerCase()} within ${moduleSpecs[moduleId].label.toLowerCase()}. This relation is derived from the construct definition, the variant's documented political tradition, and the explicit ${policyName} evidence rule.`,
    provenanceRefs: unique([...(construct.provenanceRefs ?? []), ...(variant.provenanceRefs ?? [])]),
  };
};

const candidateById = new Map();
for (const candidate of candidates) {
  const moduleId = candidate.moduleId;
  const profileSource = profiles.find((profile) => profile.specialistId === candidate.nodeId || profile.targetNodeId === candidate.nodeId);
  const provenanceRefs = unique([
    ...(candidate.provenanceRefs ?? []),
    ...(moduleSpecs[moduleId]?.sources ?? []),
    ...(profileSource?.provenanceRefs ?? []),
  ]).filter((provenanceRef) => provenanceSourceIds.has(provenanceRef));
  const { sourceBackedStatus: _sourceBackedStatus, ...candidateBase } = candidate;
  const variant = { ...candidateBase, provenanceRefs };
  const commitments = (candidate.commitments ?? []).map((commitment) => transformCommitment({ ...commitment }, variant, moduleId));
  const commitmentsByConstruct = new Map(commitments.map((commitment) => [commitment.constructId, commitment]));
  const gates = (candidate.gates ?? []).map((gate) => {
    const commitment = gate.constructId ? commitmentsByConstruct.get(gate.constructId) : undefined;
    return commitment?.criterion ? { ...gate, ...commitment.criterion } : gate;
  });
  const transformed = { ...variant, commitments, gates };
  candidateById.set(candidate.id, transformed);
}

const transformedCandidates = candidates.map((candidate) => candidateById.get(candidate.id));
const transformedProfiles = profiles.map((profile) => {
  const moduleId = profile.moduleId;
  const profileRefs = unique([...(profile.provenanceRefs ?? []), ...(sourceRefsByModule[moduleId] ?? [])]).filter((provenanceRef) => provenanceSourceIds.has(provenanceRef));
  return {
    ...profile,
    provenanceRefs: profileRefs,
    variants: (profile.variants ?? []).map((variant) => {
      const candidate = candidateById.get(variant.id);
      if (!candidate) return variant;
      const { nodeId: _nodeId, moduleId: _moduleId, ...schemaVariant } = candidate;
      return schemaVariant;
    }),
  };
});

const auditItems = items.filter((item) => item.status === "active").map((item) => {
  const local = (item.scoring?.contributions ?? []).filter((contribution) => specById.has(contribution.constructId));
  if (!local.length) throw new Error(`Specialist item ${item.id} has no local construct mapping`);
  const sorted = [...local].sort((a, b) => (b.weight - a.weight) || a.constructId.localeCompare(b.constructId));
  const primary = specById.get(sorted[0].constructId);
  return {
    itemId: item.id,
    moduleId: item.moduleId,
    layer: item.layer,
    primaryConstructId: primary.id,
    secondaryConstructIds: sorted.slice(1).map((contribution) => contribution.constructId),
    primaryMappingWeight: sorted[0].weight,
    justification: `Primary mapping is ${primary.name} because its source-backed definition is the most direct political content expressed by the item. Secondary mappings are retained only where the prompt explicitly invokes an adjacent mechanism; they do not replace the primary construct.`,
    provenanceRefs: unique([...(item.provenanceRefs ?? []), ...(primary.provenanceRefs ?? [])]),
  };
});

const nearest = [];
for (const [moduleId, module] of Object.entries(moduleSpecs)) {
  const moduleItems = items.filter((item) => item.status === "active" && item.moduleId === moduleId);
  for (const [leftKey, rightKey] of module.pairs) {
    const left = constructs.find((construct) => construct.moduleId === moduleId && construct.sourceKey === leftKey);
    const right = constructs.find((construct) => construct.moduleId === moduleId && construct.sourceKey === rightKey);
    if (!left || !right) throw new Error(`Nearest-neighbor pair is not in ${moduleId}: ${leftKey}, ${rightKey}`);
    const leftItemIds = moduleItems.filter((item) => item.scoring.contributions.some((contribution) => contribution.constructId === left.id)).map((item) => item.id);
    const rightItemIds = moduleItems.filter((item) => item.scoring.contributions.some((contribution) => contribution.constructId === right.id)).map((item) => item.id);
    nearest.push({
      id: `nearest:${moduleId}:${leftKey}:${rightKey}`,
      moduleId,
      leftConstructId: left.id,
      rightConstructId: right.id,
      discriminant: `Distinguish ${left.name.toLowerCase()} from ${right.name.toLowerCase()} by asking about the institutional mechanism or normative priority specified in each source-backed definition, rather than by a shared family label.`,
      leftItemIds,
      rightItemIds,
      directCoverage: leftItemIds.length > 0 && rightItemIds.length > 0,
      provenanceRefs: unique([...specById.get(left.id).provenanceRefs, ...specById.get(right.id).provenanceRefs]),
    });
  }
}

write(constructsPath, constructs.map((construct) => specById.get(construct.id)));
write(candidatesPath, transformedCandidates);
write(profilesPath, transformedProfiles);
write("docs/v2/specialist-content-specifications-v1.json", {
  version: "specialist-content-specifications-v1",
  status: "research-only",
  sourcePolicy: "Each definition and boundary is directly bound to scholarly or primary provenance. Operational thresholds use specialist-commitment-evidence-v1 and are not inherited from retired centroid geometry.",
  expertReviewStatus: "pending",
  cognitiveInterviewStatus: "not-started",
  respondentValidityStatus: "not-evaluated",
  modules: Object.entries(moduleSpecs).map(([moduleId, module]) => ({
    moduleId,
    label: module.label,
    provenanceRefs: module.sources,
    constructIds: constructs.filter((construct) => construct.moduleId === moduleId).map((construct) => construct.id),
    nearestNeighborIds: nearest.filter((entry) => entry.moduleId === moduleId).map((entry) => entry.id),
  })),
  constructs: constructs.map((construct) => specById.get(construct.id)),
});
write("docs/v2/specialist-item-audit-v1.json", {
  version: "specialist-item-audit-v1",
  status: "research-only",
  rule: "Every active specialist item has one primary local construct. Secondary mappings require an explicit adjacent-mechanism justification and never replace the primary.",
  items: auditItems,
});
write("docs/v2/specialist-nearest-neighbor-coverage-v1.json", {
  version: "specialist-nearest-neighbor-coverage-v1",
  status: "research-only",
  rule: "A claimed within-module discriminant requires direct item coverage for both constructs; otherwise it must abstain.",
  discriminants: nearest,
});
write("docs/v2/specialist-commitment-policy-v1.json", {
  version: policyName,
  status: "research-only",
  relationThresholds: policyThresholds,
  rules: {
    constitutive: "Failure excludes the candidate; missing evidence abstains.",
    core: "The candidate must meet the threshold for a defining commitment.",
    characteristic: "The candidate receives an affinity commitment only when the directional evidence clears the threshold.",
    otherRelations: "Contested, compatible, peripheral, and incompatible relations are hypotheses about semantic fit, not claims of empirical validity.",
  },
  prohibition: "No criterion may be justified by retired targetValue or centroid distance.",
});

console.log(JSON.stringify({
  constructs: constructs.length,
  candidates: transformedCandidates.length,
  profiles: transformedProfiles.length,
  activeSpecialistItems: auditItems.length,
  nearestNeighborDiscriminants: nearest.length,
  uncoveredDiscriminants: nearest.filter((entry) => !entry.directCoverage).map((entry) => entry.id),
}, null, 2));
