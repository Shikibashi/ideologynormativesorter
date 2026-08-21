import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const contentRoot = resolve(root, "v2/content");
const generatedBundlePath = resolve(root, "v2/generated/content.bundle.json");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}
function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
function readContent(relative) {
  return readJson(resolve(contentRoot, relative));
}
function writeContent(relative, value) {
  writeJson(resolve(contentRoot, relative), value);
}
function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

const SRC = Object.freeze({
  morphology: "citation:v3-freeden-morphology",
  liberty: "citation:v3-sep-liberty",
  liberalism: "citation:v3-sep-liberalism",
  equality: "citation:v3-sep-equality",
  property: "citation:v3-sep-property",
  ip: "citation:v3-sep-intellectual-property",
  authority: "citation:v3-sep-political-legitimacy",
  nationalism: "citation:v3-sep-nationalism",
  republicanism: "citation:v3-pettit-republicanism",
  conservatism: "citation:v3-oxford-conservatism",
  christianDemocracy: "citation:v3-cambridge-christian-democracy",
  green: "citation:v3-oxford-green-ideology",
  socialism: "citation:v3-oxford-socialism",
  socialDemocracy: "citation:v3-oxford-social-democracy",
  marx: "citation:v3-oxford-marxian-tradition",
  communism: "citation:v3-oxford-communism",
  libertarianism: "citation:v3-oxford-libertarianism",
  religion: "citation:v3-oxford-religion-liberal-philosophy",
  secularism: "citation:v3-oxford-political-secularism",
  pacifism: "citation:v3-sep-pacifism",
  hayek: "citation:v3-hayek-knowledge",
  ostrom: "citation:v3-ostrom-governing-commons",
  publicChoice: "citation:v3-public-choice",
});

const sourceRecords = [
  {
    id: SRC.morphology,
    kind: "citation",
    title: "Ideologies and Political Theory: A Conceptual Approach",
    location: "https://academic.oup.com/book/32837",
    url: "https://academic.oup.com/book/32837",
    publisher: "Oxford University Press",
    note: "Michael Freeden; morphological analysis of ideological concepts and core/adjacent/peripheral configurations.",
  },
  {
    id: SRC.liberty,
    kind: "citation",
    title: "Positive and Negative Liberty",
    location: "https://plato.stanford.edu/entries/liberty-positive-negative/",
    url: "https://plato.stanford.edu/entries/liberty-positive-negative/",
    publisher: "Stanford Encyclopedia of Philosophy",
    note: "Separates non-interference, positive/effective freedom, and republican non-domination.",
  },
  {
    id: SRC.liberalism,
    kind: "citation",
    title: "Liberalism",
    location: "https://plato.stanford.edu/entries/liberalism/",
    url: "https://plato.stanford.edu/entries/liberalism/",
    publisher: "Stanford Encyclopedia of Philosophy",
    note: "Liberal traditions, autonomy/effective power, property, constitutionalism, and social-liberal variation.",
  },
  {
    id: SRC.equality,
    kind: "citation",
    title: "Equality",
    location: "https://plato.stanford.edu/entries/equality/",
    url: "https://plato.stanford.edu/entries/equality/",
    publisher: "Stanford Encyclopedia of Philosophy",
    note: "Distinguishes legal/political, relational, distributive, and opportunity-related equality claims.",
  },
  {
    id: SRC.property,
    kind: "citation",
    title: "Property and Ownership",
    location: "https://plato.stanford.edu/entries/property/",
    url: "https://plato.stanford.edu/entries/property/",
    publisher: "Stanford Encyclopedia of Philosophy",
    note: "Property concerns distinct objects, incidents, institutions, and justifications rather than one scalar ownership attitude.",
  },
  {
    id: SRC.ip,
    kind: "citation",
    title: "Intellectual Property",
    location: "https://plato.stanford.edu/entries/intellectual-property/",
    url: "https://plato.stanford.edu/entries/intellectual-property/",
    publisher: "Stanford Encyclopedia of Philosophy",
    note: "Copyright, patents, trade secrets and moral/utilitarian/Lockean justifications and critiques are distinct from ordinary tangible property.",
  },
  {
    id: SRC.authority,
    kind: "citation",
    title: "Political Legitimacy",
    location: "https://plato.stanford.edu/entries/legitimacy/",
    url: "https://plato.stanford.edu/entries/legitimacy/",
    publisher: "Stanford Encyclopedia of Philosophy",
    note: "Legitimacy, political authority, and political obligation are related but separable normative questions.",
  },
  {
    id: SRC.nationalism,
    kind: "citation",
    title: "Nationalism",
    location: "https://plato.stanford.edu/entries/nationalism/",
    url: "https://plato.stanford.edu/entries/nationalism/",
    publisher: "Stanford Encyclopedia of Philosophy",
    note: "National identity, special compatriot obligations, and national self-determination are distinct normative and descriptive claims.",
  },
  {
    id: SRC.republicanism,
    kind: "citation",
    title: "Republicanism: A Theory of Freedom and Government",
    location: "https://global.oup.com/academic/product/republicanism-9780198296423",
    url: "https://global.oup.com/academic/product/republicanism-9780198296423",
    publisher: "Oxford University Press",
    note: "Philip Pettit; freedom as non-domination and institutional contestability.",
  },
  {
    id: SRC.conservatism,
    kind: "citation",
    title: "Conservatism",
    location: "https://academic.oup.com/edited-volume/34324/chapter/291337470",
    url: "https://academic.oup.com/edited-volume/34324/chapter/291337470",
    publisher: "Oxford Handbook of Political Ideologies",
    note: "Conservative prudence, inherited institutions, skepticism of rationalist reconstruction, and limits of politics.",
  },
  {
    id: SRC.christianDemocracy,
    kind: "citation",
    title: "What Is Christian Democracy?",
    location: "https://www.cambridge.org/core/books/what-is-christian-democracy/",
    url: "https://www.cambridge.org/core/books/what-is-christian-democracy/",
    publisher: "Cambridge University Press",
    note: "Personalism, subsidiarity, social capitalism, solidarity, democratic popularism, and Christian inspiration.",
  },
  {
    id: SRC.green,
    kind: "citation",
    title: "Green Ideology",
    location: "https://academic.oup.com/edited-volume/34324/chapter/291337947",
    url: "https://academic.oup.com/edited-volume/34324/chapter/291337947",
    publisher: "Oxford Handbook of Political Ideologies",
    note: "Ecological restructuring, democratization, ecological law, sustainability and nonviolence in green ideology.",
  },
  {
    id: SRC.socialism,
    kind: "citation",
    title: "Socialism",
    location: "https://academic.oup.com/acrefore/display/10.1093/acrefore/9780190228637.013.1047",
    url: "https://academic.oup.com/acrefore/display/10.1093/acrefore/9780190228637.013.1047",
    publisher: "Oxford Research Encyclopedia of Politics",
    note: "Social ownership/control, exploitation, community, equality and freedom; strategic disagreements exceed a simple reform/revolution binary.",
  },
  {
    id: SRC.socialDemocracy,
    kind: "citation",
    title: "Social Democracy",
    location: "https://academic.oup.com/edited-volume/34324/chapter/291337808",
    url: "https://academic.oup.com/edited-volume/34324/chapter/291337808",
    publisher: "Oxford Handbook of Political Ideologies",
    note: "Democratic collective action extending freedom/equality through welfare, labor institutions and regulated capitalism.",
  },
  {
    id: SRC.marx,
    kind: "citation",
    title: "The Marxian Tradition",
    location: "https://academic.oup.com/edited-volume/34328/chapter/291365645",
    url: "https://academic.oup.com/edited-volume/34328/chapter/291365645",
    publisher: "Oxford Handbook of the History of Political Philosophy",
    note: "Class, exploitation, capitalism, ideology, historical change, revolution and socialist/communist institutions.",
  },
  {
    id: SRC.communism,
    kind: "citation",
    title: "Communism",
    location: "https://academic.oup.com/edited-volume/34324/chapter/291337846",
    url: "https://academic.oup.com/edited-volume/34324/chapter/291337846",
    publisher: "Oxford Handbook of Political Ideologies",
    note: "Communist party monopoly, democratic centralism, state ownership, central planning, international movement, and eventual classless/stateless aspiration.",
  },
  {
    id: SRC.libertarianism,
    kind: "citation",
    title: "Libertarianism",
    location: "https://academic.oup.com/edited-volume/34508/chapter/292822509",
    url: "https://academic.oup.com/edited-volume/34508/chapter/292822509",
    publisher: "Oxford Handbook of the History of Political Philosophy",
    note: "Strong claims to peaceful enjoyment of person/property and restrictive conditions on permissible force.",
  },
  {
    id: SRC.religion,
    kind: "citation",
    title: "Religion in Liberal Political Philosophy",
    location: "https://academic.oup.com/book/9456",
    url: "https://academic.oup.com/book/9456",
    publisher: "Oxford University Press",
    note: "Distinguishes non-establishment/neutrality, accommodation/religious freedom, conscience, identity, and public justification.",
  },
  {
    id: SRC.secularism,
    kind: "citation",
    title: "Secularism in Political Philosophy",
    location: "https://academic.oup.com/edited-volume/62239/chapter-abstract/550724223",
    url: "https://academic.oup.com/edited-volume/62239/chapter-abstract/550724223",
    publisher: "Oxford Research Encyclopedia of Politics",
    note: "Political secularism involves conscience, neutrality, non-establishment and accommodation rather than a single church-state scalar.",
  },
  {
    id: SRC.pacifism,
    kind: "citation",
    title: "Pacifism",
    location: "https://plato.stanford.edu/entries/pacifism/",
    url: "https://plato.stanford.edu/entries/pacifism/",
    publisher: "Stanford Encyclopedia of Philosophy",
    note: "Pacifism ranges from absolute nonviolence to focused anti-war commitments and is distinct from ordinary conditional force permissibility.",
  },
  {
    id: SRC.hayek,
    kind: "citation",
    title: "The Use of Knowledge in Society",
    location: "https://www.aeaweb.org/aer/top20/35.4.519-530.pdf",
    url: "https://www.aeaweb.org/aer/top20/35.4.519-530.pdf",
    publisher: "American Economic Review",
    note: "F. A. Hayek; dispersed knowledge and price coordination.",
  },
  {
    id: SRC.ostrom,
    kind: "citation",
    title: "Governing the Commons",
    location: "https://www.cambridge.org/core/books/governing-the-commons/",
    url: "https://www.cambridge.org/core/books/governing-the-commons/",
    publisher: "Cambridge University Press",
    note: "Elinor Ostrom; institutional conditions under which decentralized groups solve collective-action problems.",
  },
  {
    id: SRC.publicChoice,
    kind: "citation",
    title: "The Calculus of Consent",
    location: "https://oll.libertyfund.org/titles/buchanan-the-calculus-of-consent-logical-foundations-of-constitutional-democracy",
    url: "https://oll.libertyfund.org/titles/buchanan-the-calculus-of-consent-logical-foundations-of-constitutional-democracy",
    publisher: "University of Michigan Press / Liberty Fund edition",
    note: "James Buchanan and Gordon Tullock; political incentives, collective choice, and constitutional rules.",
  },
];

function construct(id, name, role, family, description, negative, positive, defaultDomain, provenanceRefs, boundaryStatement) {
  return {
    id,
    name,
    role,
    scope: "root",
    family,
    description,
    boundaryStatement,
    sourceKey: id,
    lifecycle: {
      conceptualStatus: "canonical-v3",
      measurementStatus: "candidate-content-reviewed",
      publicRoleStatus: "internal",
    },
    display: { shortLabel: name, longLabel: name },
    poles: { negative, positive },
    provenanceRefs: unique([SRC.morphology, ...provenanceRefs]),
    __defaultDomain: defaultDomain,
  };
}

const rootConstructSpecs = [
  construct("liberty-noninterference", "Liberty: Non-Interference", "normative", "liberty", "Normative priority on protection against coercive or intentional interference by others or the state.", "Freedom does not require a strong protected sphere against coercive interference", "People are politically freer when protected from coercive or intentional interference", "civil-liberties-speech", [SRC.liberty, SRC.liberalism, SRC.libertarianism], "Distinct from material capability and from republican non-domination."),
  construct("effective-agency", "Effective Agency", "normative", "liberty", "Normative view that freedom also depends on practical power, resources, or capabilities to pursue important ends.", "Formal permission is sufficient even when a person lacks practical capacity to act", "Freedom also depends on practical capabilities and resources needed to pursue important ends", "redistribution-welfare", [SRC.liberty, SRC.liberalism], "Does not by itself entail equal outcomes or any specific welfare program."),
  construct("anti-domination", "Freedom from Domination", "normative", "liberty", "Normative opposition to uncontrolled or arbitrary power over another person or group.", "Uncontrolled power can be acceptable when it is not actively interfering", "People should be protected from uncontrolled or arbitrary power even when it is not constantly exercised", "democracy-expertise-constitutionalism", [SRC.liberty, SRC.republicanism], "Not equivalent to opposition to every hierarchy; constrained and contestable authority can be non-dominating."),
  construct("political-authority-legitimacy", "Political Authority Legitimacy", "normative", "authority", "Normative belief that coercive political institutions can possess special legitimacy or generate duties of compliance when justified.", "Established political institutions possess no special moral authority merely as such", "Coercive political authority can generate genuine duties of compliance when properly justified", "state-legitimacy", [SRC.authority], "Separates the legitimacy of political authority from its administrative effectiveness and from democratic procedure."),
  construct("legal-equality", "Legal and Civic Equality", "normative", "equality", "Equal legal status, citizenship, and nondiscrimination independent of inherited group rank.", "Law may assign unequal civic status by inherited or ascriptive group", "Citizens should have equal legal and civic status without inherited or group-based rank", "race-ethnicity-multiculturalism", [SRC.equality, SRC.liberalism], "Distinct from material equality, relational equality, and equality of opportunity."),
  construct("equality-opportunity", "Equality of Opportunity", "normative", "equality", "Fair access to positions, education, and opportunities rather than mere formal eligibility.", "Formal eligibility is sufficient regardless of background barriers", "Institutions should secure fair opportunity rather than merely formal eligibility", "redistribution-welfare", [SRC.equality, SRC.liberalism], "Does not imply strict equality of final resources or outcomes."),
  construct("relational-equality", "Relational Equality", "normative", "equality", "Opposition to social relations of caste, status subordination, domination, or second-class standing.", "Status hierarchy and social subordination are not independent concerns of justice", "Justice requires social relations without caste-like domination or second-class standing", "race-ethnicity-multiculturalism", [SRC.equality, SRC.republicanism], "Distinct from a particular distributional pattern."),
  construct("distributive-equality", "Distributive Equality", "normative", "equality", "Normative concern with reducing unjust inequalities in income, wealth, or access to material resources.", "Large material inequalities are not independently objectionable if legal rights are equal", "Reducing unjust material inequalities is an important requirement of justice", "redistribution-welfare", [SRC.equality, SRC.socialDemocracy, SRC.socialism], "Does not identify one metric, pattern, or policy instrument."),
  construct("productive-property", "Private Productive Property", "normative", "property", "Normative legitimacy of strong private exclusion and control rights over productive capital.", "Claims to productive capital are substantially limited by social or democratic ownership claims", "Private owners may legitimately hold strong exclusion and control rights over productive capital", "property-ownership", [SRC.property, SRC.libertarianism, SRC.socialism], "Separate from personal possessions, land/resource claims, intellectual property, and workplace governance."),
  construct("workplace-self-government", "Workplace Self-Government", "normative", "property", "Normative claim that workers have meaningful rights of voice, governance, or control in productive institutions.", "Ownership alone may legitimately determine workplace governance", "Workers have a normative claim to meaningful voice or governance in productive institutions", "labor-unions-workplace", [SRC.property, SRC.socialism, SRC.socialDemocracy], "Does not require one ownership form; cooperatives, codetermination, and social ownership can instantiate it differently."),
  construct("land-natural-resource-claims", "Common Claims to Land and Natural Resources", "normative", "property", "Normative view that land and natural-resource value carries common, equal, or public claims that limit absolute private appropriation.", "Strong private title may exhaust legitimate claims to land and natural-resource value", "Land and natural-resource value carries common or equal claims that limit absolute private appropriation", "land-housing-georgism", [SRC.property, SRC.libertarianism], "Separate from ownership of produced capital and personal possessions."),
  construct("personal-property", "Personal Property", "normative", "property", "Strong normative claims over personal possessions and ordinary-use property.", "Ordinary personal possessions need not receive strong individual control claims", "People normally have strong moral claims over their personal possessions and ordinary-use property", "property-ownership", [SRC.property, SRC.libertarianism], "Does not settle ownership of firms, land rents, or intellectual creations."),
  construct("intellectual-property-rights", "Intellectual Property Rights", "normative", "property", "Normative legitimacy of exclusion rights over inventions, expression, information, and related intangible creations.", "Intangible creations generally should not generate strong state-enforced exclusion rights", "Creators and inventors may legitimately receive state-enforced exclusion rights over qualifying intellectual creations", "intellectual-property-information", [SRC.ip, SRC.property], "Copyright, patent, trademark, and trade-secret institutions remain distinct legal forms; this construct measures their common exclusion-right rationale only."),
  construct("universal-moral-standing", "Universal Moral Standing", "normative", "political-community", "Basic moral standing is not diminished by nationality, birthplace, or political borders.", "Political borders may substantially reduce the moral standing owed to outsiders", "Foreigners and compatriots possess the same basic moral standing despite political borders", "immigration-borders", [SRC.nationalism, SRC.liberalism], "Compatible with some special duties to compatriots; it does not entail world government or unrestricted migration."),
  construct("compatriot-priority", "Compatriot Priority", "normative", "political-community", "Normative belief that political institutions may give special priority to duties owed to compatriots.", "Political institutions should not privilege compatriots merely because of shared nationality", "Political institutions may legitimately give special priority to duties owed to compatriots", "national-identity-sovereignty", [SRC.nationalism], "Distinct from denying outsiders basic rights and from national self-determination."),
  construct("national-self-determination", "National Self-Determination", "normative", "political-community", "Normative claim that nations or national communities may possess rights to collective political self-government.", "National identity creates no independent claim to collective political self-government", "Nations may possess legitimate claims to collective political self-government", "national-identity-sovereignty", [SRC.nationalism], "Does not specify ethnic membership rules or require an ethnically homogeneous state."),
  construct("ecological-standing", "Ecological Standing", "normative", "ecology", "Normative standing of nonhuman nature and ecological systems beyond their instrumental usefulness to current humans.", "Ecological systems matter politically only through their effects on human interests", "Nonhuman nature and ecological systems have moral or political standing beyond immediate human use", "environment-climate-growth", [SRC.green], "Distinct from empirical beliefs about ecological limits and from a specific climate policy."),
  construct("intergenerational-ecological-duty", "Intergenerational Ecological Duty", "normative", "ecology", "Normative duties concerning ecological conditions inherited by future generations.", "Present people have no special duty to preserve ecological conditions for future generations beyond ordinary current interests", "Present generations owe duties concerning the ecological conditions inherited by future people", "environment-climate-growth", [SRC.green], "Does not decide the exact discount rate, growth path, or technology portfolio."),
  construct("tradition-deference", "Deference to Tradition", "normative", "conservatism", "Presumptive normative weight for inherited institutions and practices because they embody continuity, knowledge, or social attachment.", "Inherited practice has no presumptive normative weight merely because it is inherited", "Inherited institutions and practices deserve some presumptive weight before deliberate reconstruction", "family-gender-feminism", [SRC.conservatism], "Separate from coercive enforcement of traditional morality."),
  construct("coercive-moral-order", "Coercive Moral Order", "normative", "conservatism", "Normative legitimacy of using law to enforce a substantive traditional moral order in private and social life.", "Private moral conformity should not generally be enforced by law merely because it is traditional", "Law may legitimately enforce important elements of a substantive traditional moral order", "family-gender-feminism", [SRC.conservatism], "A person can value tradition while rejecting coercive moral legislation."),
  construct("religious-establishment", "Religious Establishment", "normative", "religion", "Normative legitimacy of constitutionally privileging, endorsing, or establishing a religion through public institutions.", "Public institutions should not constitutionally privilege or establish a religion", "Public institutions may legitimately privilege or establish a religion", "religion-secularism", [SRC.religion, SRC.secularism], "Distinct from accommodation of religious exercise and from religious inspiration in ordinary democratic politics."),
  construct("religious-neutrality", "Religious Neutrality", "normative", "religion", "Normative requirement that public institutions remain neutral among religions and between religion and non-religion.", "The state need not remain neutral among religious and nonreligious outlooks", "Public institutions should remain neutral among religions and between religion and non-religion", "religion-secularism", [SRC.religion, SRC.secularism], "Neutrality can coexist with accommodation and does not require excluding religious citizens from political argument."),
  construct("religious-accommodation", "Religious and Conscience Accommodation", "normative", "religion", "Normative support for exemptions or accommodations protecting conscience and religious exercise under suitable conditions.", "General legal rules normally need no accommodation for conscience or religious exercise", "Law should sometimes accommodate conscience or religious exercise rather than require identical treatment", "religion-secularism", [SRC.religion, SRC.secularism], "Accommodation is not equivalent to establishment or clerical authority."),
  construct("religious-political-inspiration", "Religious Political Inspiration", "normative", "religion", "Normative legitimacy of religious moral traditions inspiring ordinary democratic political projects without establishing clerical rule.", "Religious moral traditions should have no legitimate role in inspiring ordinary democratic political projects", "Religious moral traditions may legitimately inspire ordinary democratic political projects without establishing clerical authority", "religion-secularism", [SRC.religion, SRC.christianDemocracy], "Distinct from establishment, theocracy, and claims that religious arguments alone bind nonadherents."),
  construct("force-permissibility", "Conditional Permissibility of Force", "normative", "force", "Normative belief that organized military or defensive force can be morally justified under at least some conditions.", "Organized military or defensive force is never morally justified", "Organized military or defensive force can be morally justified under at least some strict conditions", "foreign-policy-war", [SRC.pacifism, SRC.libertarianism], "This is not militarism: conditional justifiability does not imply enthusiasm for war, prestige, or intervention."),
  construct("anti-militarism", "Anti-Militarism", "normative", "force", "Normative commitment to restraining military institutions, prestige, intervention, and war-making beyond ordinary acceptance of defensive force.", "Military power, prestige, and intervention need no special political presumption of restraint", "Military power, prestige, and intervention should face a strong political presumption of restraint", "foreign-policy-war", [SRC.pacifism, SRC.green], "Compatible with believing defensive force can sometimes be justified."),
  construct("democratic-legitimacy", "Democratic Legitimacy", "normative", "democracy", "Normative requirement that collective political power normally be democratically authorized and accountable.", "Political power need not normally be democratically authorized or accountable", "Collective political power normally requires democratic authorization and accountability", "democracy-expertise-constitutionalism", [SRC.liberalism, SRC.republicanism, SRC.socialDemocracy], "Distinct from the descriptive claim that voters reliably make good decisions."),
  construct("social-solidarity", "Social Solidarity", "normative", "social-obligation", "Normative obligation of political communities to protect members against severe social and material vulnerability.", "Political communities have no collective obligation to protect members against severe social or material vulnerability", "Political communities have obligations to protect members against severe social and material vulnerability", "redistribution-welfare", [SRC.christianDemocracy, SRC.socialDemocracy, SRC.liberalism], "Does not determine whether provision is public, mutual, cash-based, contributory, or universal."),

  construct("market-knowledge-coordination", "Market Knowledge Coordination", "descriptive", "markets", "Descriptive expectation that decentralized prices and exchange can aggregate dispersed information and coordinate resources.", "Market prices generally fail to coordinate dispersed information and resources", "Decentralized prices and exchange can often coordinate dispersed information and resources", "markets-planning", [SRC.hayek, SRC.libertarianism], "An empirical mechanism claim, not a claim that every market outcome is just."),
  construct("market-power-concentration", "Market Power and Concentration", "descriptive", "markets", "Descriptive expectation that market institutions can generate durable private concentration, monopoly, or dependency.", "Competitive pressures usually prevent durable private concentration or dependency", "Market institutions can generate durable concentration, monopoly, or dependency", "markets-planning", [SRC.socialism, SRC.socialDemocracy], "Does not by itself imply a particular antitrust, ownership, or regulatory remedy."),
  construct("state-administrative-capacity", "State Administrative Capacity", "descriptive", "institutions", "Descriptive expectation that state institutions can competently implement complex policy programs under suitable conditions.", "State institutions generally cannot competently execute complex policy programs", "State institutions can competently execute complex policy programs under suitable conditions", "democracy-expertise-constitutionalism", [SRC.publicChoice], "Separate from whether those programs are legitimate or desirable."),
  construct("political-incentives-capture", "Political Incentives and Capture", "descriptive", "institutions", "Descriptive expectation that public institutions are vulnerable to organized interests, rent seeking, and insider incentives.", "Public institutions usually overcome organized-interest and insider incentives", "Public institutions are often vulnerable to organized interests, rent seeking, and insider incentives", "democracy-expertise-constitutionalism", [SRC.publicChoice], "Does not entail that private institutions are free from analogous power problems."),
  construct("democratic-decision-capacity", "Democratic Decision Capacity", "descriptive", "democracy", "Descriptive confidence that democratic procedures can aggregate information and preferences, correct errors, and reach workable collective decisions.", "Democratic procedures are generally poor at aggregating information and correcting collective errors", "Democratic procedures can often aggregate information and correct collective errors", "democracy-expertise-constitutionalism", [SRC.republicanism, SRC.socialDemocracy], "Distinct from the normative legitimacy of democracy."),
  construct("expert-knowledge-capacity", "Expert Knowledge Capacity", "descriptive", "institutions", "Descriptive expectation that specialized expertise can improve collective decisions under appropriate accountability structures.", "Delegation to specialized expertise rarely improves collective decisions", "Specialized expertise can substantially improve collective decisions under appropriate institutions", "democracy-expertise-constitutionalism", [SRC.publicChoice], "Does not by itself justify technocratic insulation from accountability."),
  construct("cultural-malleability", "Cultural Malleability", "descriptive", "culture", "Descriptive expectation that norms, identities, and cultural practices respond substantially to institutions, incentives, and policy.", "Cultural patterns are strongly persistent and resist deliberate institutional change", "Cultural patterns can change substantially in response to institutions, incentives, and policy", "race-ethnicity-multiculturalism", [SRC.conservatism, SRC.nationalism], "Distinct from the normative desirability of cultural change."),
  construct("decentralized-coordination-capacity", "Decentralized Coordination Capacity", "descriptive", "institutions", "Descriptive expectation that voluntary, local, polycentric, or federated institutions can solve coordination problems without a single central director.", "Coordination problems generally require a single central director", "Voluntary, local, polycentric, or federated institutions can often solve coordination problems without one central director", "state-legitimacy", [SRC.ostrom, SRC.hayek], "Does not imply every public good can be privately supplied."),
  construct("class-exploitation", "Class and Exploitation", "descriptive", "political-economy", "Descriptive claim that class relations and control of productive assets systematically generate exploitation or asymmetric workplace power.", "Class ownership relations do not systematically generate exploitation or asymmetric workplace power", "Class ownership relations systematically generate exploitation or asymmetric workplace power", "labor-unions-workplace", [SRC.marx, SRC.socialism], "A mechanism claim that should not be inferred merely from support for redistribution."),
  construct("capital-accumulation-crisis", "Capital Accumulation and Crisis", "descriptive", "political-economy", "Descriptive claim that capitalist accumulation tends toward concentration, instability, or recurrent crisis mechanisms.", "Capitalist accumulation has no systematic tendency toward concentration or recurrent crisis", "Capitalist accumulation tends toward concentration, instability, or recurrent crisis mechanisms", "markets-planning", [SRC.marx], "Distinct from ordinary claims that individual markets sometimes fail."),
  construct("ideology-hegemony", "Ideology and Hegemony", "descriptive", "power", "Descriptive claim that beliefs, culture, and institutions systematically reproduce or legitimate structures of power.", "Beliefs and cultural institutions are largely independent of structural power", "Beliefs and cultural institutions can systematically reproduce or legitimate structures of power", "race-ethnicity-multiculturalism", [SRC.marx], "Does not imply that every belief is reducible to class interest or propaganda."),
  construct("nation-formation", "Nation Formation", "descriptive", "political-community", "Descriptive claim that national identities are socially and institutionally produced and historically reproduced rather than simply given.", "National identities are largely fixed or given independently of institutions and historical construction", "National identities are substantially produced and reproduced through institutions and historical processes", "national-identity-sovereignty", [SRC.nationalism], "Distinct from whether nations deserve self-determination."),
  construct("patriarchy-social-reproduction", "Patriarchy and Social Reproduction", "descriptive", "gender", "Descriptive claim that gendered power and social reproduction systematically structure institutions, work, family, and opportunities.", "Gendered power and social reproduction do not systematically structure major institutions and opportunities", "Gendered power and social reproduction systematically structure institutions and opportunities", "family-gender-feminism", [SRC.socialism], "A structural explanatory claim, not a generic endorsement of sex equality."),
  construct("imperialism-dependency", "Imperialism and Dependency", "descriptive", "international", "Descriptive claim that international political-economic relations can reproduce domination or dependency across states and peoples.", "International political-economic relations do not systematically reproduce dependency or external domination", "International political-economic relations can systematically reproduce dependency or external domination", "foreign-policy-war", [SRC.marx, SRC.nationalism], "Distinct from the normative view that any particular intervention is wrong."),
  construct("ecological-limits-growth", "Ecological Limits to Growth", "descriptive", "ecology", "Descriptive expectation that biophysical constraints can limit or materially alter the feasibility of indefinite growth in throughput.", "Biophysical constraints place no important long-run limits on material throughput because substitution and innovation can overcome them", "Biophysical constraints can materially limit the feasibility of indefinite growth in material throughput", "environment-climate-growth", [SRC.green], "Does not settle whether GDP, welfare, or technological progress must decline."),
  construct("collective-action-capacity", "Collective Action Capacity", "descriptive", "institutions", "Descriptive claim that groups can overcome free-rider and coordination problems under identifiable institutional conditions.", "Free-rider problems generally prevent groups from sustaining collective solutions", "Groups can overcome free-rider and coordination problems under identifiable institutional conditions", "state-legitimacy", [SRC.ostrom, SRC.publicChoice], "Not a claim that collective action is always efficient or benign."),
  construct("institutional-path-dependence", "Institutional Path Dependence", "descriptive", "institutions", "Descriptive claim that inherited institutions constrain later feasible choices and reform trajectories.", "Inherited institutional arrangements place little constraint on feasible later reforms", "Inherited institutions substantially constrain later feasible choices and reform trajectories", "strategy-change", [SRC.conservatism], "Does not imply that institutional change is impossible or undesirable."),
  construct("historical-change-structural", "Structural Historical Change", "descriptive", "history", "Descriptive claim that large-scale political change is substantially shaped by structural social and economic forces rather than only individual preferences or leaders.", "Large-scale political change is mainly explained by individual leaders and choices rather than structural forces", "Large-scale political change is substantially shaped by structural social and economic forces", "strategy-change", [SRC.marx], "Allows agency and contingency while measuring the claimed explanatory importance of structure."),

  construct("institutional-decentralization", "Institutional Decentralization", "prescriptive", "institutional-strategy", "Prescriptive support for dispersing political or administrative authority across smaller, local, federal, or polycentric units.", "Political and administrative authority should not be deliberately dispersed", "Political and administrative authority should be dispersed across smaller, local, federal, or polycentric units", "democracy-expertise-constitutionalism", [SRC.ostrom, SRC.conservatism, SRC.libertarianism], "Separate from the descriptive claim that decentralization works well."),
  construct("institutional-centralization", "Institutional Centralization", "prescriptive", "institutional-strategy", "Prescriptive support for concentrating authority in a central institution when uniformity or coordinated capacity is desired.", "Political and administrative authority should not be deliberately concentrated", "Political and administrative authority should be concentrated centrally when uniform coordination is required", "democracy-expertise-constitutionalism", [SRC.publicChoice], "Not simply the inverse of decentralization; institutions can combine central and local competencies."),
  construct("electoral-participation", "Electoral and Institutional Participation", "prescriptive", "political-strategy", "Prescriptive use of elections, parties, legislation, litigation, and other formal political channels as means of change.", "Formal electoral and institutional channels should generally be avoided as strategies for change", "Elections and formal political institutions are legitimate and useful strategies for political change", "strategy-change", [SRC.socialDemocracy, SRC.liberalism], "Can coexist with direct action."),
  construct("direct-action", "Direct Action", "prescriptive", "political-strategy", "Prescriptive use of strikes, boycotts, occupations, mutual aid, civil resistance, or other action outside ordinary electoral channels.", "Political change should avoid direct action outside ordinary electoral channels", "Direct action outside ordinary electoral channels can be a legitimate and useful strategy for change", "strategy-change", [SRC.socialism, SRC.pacifism], "Can coexist with electoral participation; violent tactics are measured separately."),
  construct("revolutionary-rupture", "Revolutionary Rupture", "prescriptive", "political-strategy", "Prescriptive support for replacing core institutions through revolutionary rupture rather than only reforming them in place.", "Core institutions should be changed without revolutionary rupture", "Some desired transformations require revolutionary rupture and replacement of core institutions", "strategy-change", [SRC.marx, SRC.communism, SRC.socialism], "Does not imply support for violence or a vanguard party."),
  construct("institutional-reform", "Institutional Reform", "prescriptive", "political-strategy", "Prescriptive support for changing existing institutions through constitutional, legislative, administrative, or organizational reform.", "Working through reforms of existing institutions is not a legitimate strategy for major change", "Existing institutions can be deliberately reformed to achieve major political goals", "strategy-change", [SRC.liberalism, SRC.socialDemocracy, SRC.conservatism], "Can coexist with long-run structural transformation."),
  construct("gradual-transition", "Gradual Transition", "prescriptive", "political-strategy", "Prescriptive support for sequencing major change to manage uncertainty, adaptation, and transition costs.", "Major changes should not be phased merely to manage transition and uncertainty", "Major institutional changes should often be phased to manage uncertainty and transition costs", "strategy-change", [SRC.conservatism], "Distinct from accepting only minor reforms."),
  construct("immediatist-transition", "Immediatist Transition", "prescriptive", "political-strategy", "Prescriptive support for implementing a desired institutional change rapidly rather than deliberately phasing it.", "Desired institutional changes should generally be phased rather than implemented rapidly", "When an institution is unjust, the desired replacement should sometimes be implemented without deliberate gradualism", "strategy-change", [SRC.socialism], "Not synonymous with revolution or violence."),
  construct("income-redistribution", "Income and Wealth Redistribution", "prescriptive", "economic-policy", "Prescriptive use of taxes and transfers to alter the distribution of resources after or alongside market incomes.", "Taxes and transfers should not deliberately alter the distribution of market income or wealth", "Taxes and transfers should be used when appropriate to reduce unjust material inequality or secure social provision", "redistribution-welfare", [SRC.socialDemocracy, SRC.liberalism, SRC.socialism], "Separate from rules that shape bargaining power and ownership before market income is generated."),
  construct("predistributive-reform", "Predistributive Reform", "prescriptive", "economic-policy", "Prescriptive alteration of property, bargaining, competition, education, labor, or market rules that shape primary distributions before transfers.", "Policy should not deliberately reshape the rules that generate primary market distributions", "Policy should reshape underlying market and bargaining rules when they generate unjust primary distributions", "labor-unions-workplace", [SRC.socialDemocracy, SRC.socialism], "Can coexist with redistribution; it is not its opposite."),
  construct("regulatory-intervention", "Regulatory Intervention", "prescriptive", "economic-policy", "Prescriptive use of legal rules and public oversight to constrain market or organizational conduct.", "Public authorities should generally avoid adding regulatory constraints to market conduct", "Public regulation and oversight should be used when market or organizational conduct creates serious harms or power imbalances", "markets-planning", [SRC.socialDemocracy, SRC.liberalism], "Domain-specific; endorsement does not imply maximal regulation in every market."),
  construct("market-deregulation", "Market Deregulation", "prescriptive", "economic-policy", "Prescriptive removal or simplification of regulatory restrictions to expand voluntary market choice and entry.", "Existing market regulations should generally be retained or strengthened rather than deliberately removed", "Regulatory restrictions should be removed or simplified when they unnecessarily block voluntary entry, choice, or competition", "markets-planning", [SRC.libertarianism, SRC.liberalism], "Can coexist with support for some rules protecting rights, competition, or externalities."),
  construct("public-provision", "Public Provision", "prescriptive", "social-policy", "Prescriptive use of state or public institutions to directly provide or finance goods and services.", "Social needs should generally be addressed without direct public provision", "Public institutions should directly provide or finance important goods and services when appropriate", "redistribution-welfare", [SRC.socialDemocracy, SRC.christianDemocracy, SRC.liberalism], "Separate from the normative claim that social needs matter and from the design of cash versus in-kind benefits."),
  construct("exit-parallel-institutions", "Exit and Parallel Institutions", "prescriptive", "institutional-strategy", "Prescriptive reliance on voluntary exit, mutual aid, counter-institutions, or parallel provision rather than state monopoly.", "Political and social problems should not generally be addressed by building voluntary alternatives outside state provision", "Voluntary exit, mutual aid, and parallel institutions should be used to solve problems outside state monopoly when feasible", "state-legitimacy", [SRC.libertarianism, SRC.ostrom], "Does not imply every collective good can be supplied through exit."),
  construct("coercive-enforcement-strategy", "Coercive Political Strategy", "prescriptive", "political-strategy", "Prescriptive willingness to use coercive or forceful tactics beyond ordinary rights-protecting enforcement to advance political change.", "Political change should avoid coercive or forceful tactics beyond ordinary rights-protecting enforcement", "Coercive or forceful tactics can sometimes be justified to advance political change", "strategy-change", [SRC.pacifism, SRC.libertarianism], "Separate from conditional defensive force and from ordinary enforcement of general law."),
  construct("nonviolent-strategy", "Nonviolent Strategy", "prescriptive", "political-strategy", "Prescriptive commitment to nonviolent methods of political conflict and change.", "Political strategy need not give nonviolence special priority", "Political conflict and social change should be pursued through nonviolent methods", "strategy-change", [SRC.pacifism, SRC.green], "Can include disruptive civil resistance and direct action."),
  construct("coalitional-compromise", "Coalitional Compromise", "prescriptive", "political-strategy", "Prescriptive willingness to accept partial gains and negotiated compromise with political opponents.", "Political actors should generally hold out for the full preferred program rather than accept compromise", "Political actors should often accept negotiated compromise and partial gains", "strategy-change", [SRC.conservatism, SRC.socialDemocracy], "A strategy preference, not a substantive ideological midpoint."),
  construct("public-ownership", "Public Ownership", "prescriptive", "ownership-policy", "Prescriptive use of public/state/social ownership for productive assets or infrastructure.", "Productive assets should not generally be placed in public or social ownership", "Public or social ownership should be used for some important productive assets or infrastructure", "property-ownership", [SRC.socialism, SRC.socialDemocracy, SRC.communism], "Does not by itself specify central planning or worker self-management."),
  construct("worker-control", "Worker Control", "prescriptive", "ownership-policy", "Prescriptive use of worker governance, cooperatives, codetermination, or democratic control in productive organizations.", "Workplace governance should generally remain with owners and appointed managers", "Workers should exercise substantial governance or democratic control in productive organizations", "labor-unions-workplace", [SRC.socialism, SRC.socialDemocracy], "Distinct from union bargaining over terms and from state ownership."),
  construct("social-insurance", "Social Insurance", "prescriptive", "social-policy", "Prescriptive use of broad social insurance, income security, pensions, health insurance, or related risk-pooling institutions.", "Social risks should generally be handled without broad collective insurance institutions", "Broad social-insurance institutions should pool major social risks and protect people against predictable vulnerability", "redistribution-welfare", [SRC.socialDemocracy, SRC.christianDemocracy], "Does not determine contributory versus universal design."),
  construct("vanguard-party", "Vanguard Party", "prescriptive", "revolutionary-strategy", "Prescriptive support for a disciplined revolutionary party claiming a leading role in political transition.", "Political transition should not be led by a disciplined revolutionary vanguard party", "A disciplined revolutionary vanguard party should lead the transition to socialism or communism", "strategy-change", [SRC.communism, SRC.marx], "A direct Marxist-Leninist discriminator, not a generic measure of organization or leadership."),
  construct("democratic-centralism", "Democratic Centralism", "prescriptive", "revolutionary-strategy", "Prescriptive support for internal deliberation followed by binding organizational unity in a Leninist party structure.", "Political organizations should not require binding centralized unity after internal deliberation", "A revolutionary party should combine internal deliberation with binding centralized unity after decisions", "strategy-change", [SRC.communism], "Specific to Leninist organizational doctrine; not equivalent to ordinary party discipline."),
  construct("constitutional-reform", "Constitutional Reform", "prescriptive", "institutional-strategy", "Prescriptive use of constitutional rules, rights, courts, checks, and formal institutional design to constrain political power.", "Constitutional rules and formal checks should not be a major instrument for constraining political power", "Constitutional rules, rights, checks, and institutional design should be used to constrain political power", "democracy-expertise-constitutionalism", [SRC.liberalism, SRC.republicanism], "Distinct from generic reform and from the descriptive quality of courts or experts."),
  construct("subsidiarity", "Subsidiarity", "prescriptive", "institutional-strategy", "Prescriptive allocation of public responsibilities to the lowest competent social or political level while permitting higher-level action where required.", "Public responsibilities need not be allocated to lower competent institutions before higher levels act", "Public responsibilities should normally rest with the lowest competent social or political level", "democracy-expertise-constitutionalism", [SRC.christianDemocracy], "Not equivalent to unconditional decentralization; higher levels retain roles when lower levels cannot perform the task."),
  construct("contestable-institutions", "Contestable Institutions", "prescriptive", "institutional-strategy", "Prescriptive design of institutions so exercises of power can be challenged, reviewed, and controlled by affected people.", "Exercises of public or private power need not be institutionally contestable by affected people", "Institutions should provide effective mechanisms for people to contest and review exercises of power", "democracy-expertise-constitutionalism", [SRC.republicanism], "Targets non-domination through institutional design rather than merely distributing authority geographically."),
  construct("collective-bargaining", "Collective Bargaining", "prescriptive", "labor-policy", "Prescriptive support for worker organization and collective bargaining as institutions governing employment relations.", "Employment terms should generally be set without collective worker bargaining institutions", "Workers should be able to organize and bargain collectively over employment relations", "labor-unions-workplace", [SRC.socialDemocracy, SRC.socialism], "Distinct from worker ownership or full workplace self-government."),
  construct("ecological-restructuring", "Ecological Restructuring", "prescriptive", "ecological-policy", "Prescriptive restructuring of economic and political institutions to satisfy ecological constraints and sustainability duties.", "Environmental harms should be addressed without substantial restructuring of economic or political institutions", "Economic and political institutions should be restructured where necessary to satisfy ecological constraints and sustainability duties", "environment-climate-growth", [SRC.green], "Does not predetermine degrowth, market instruments, public ownership, or one energy technology."),
  construct("central-planning", "Central Economic Planning", "prescriptive", "economic-policy", "Prescriptive allocation of major productive resources through centralized administrative planning rather than primarily decentralized market exchange.", "Major productive resources should not be allocated through centralized administrative planning", "Major productive resources should be allocated substantially through centralized administrative planning", "markets-planning", [SRC.communism, SRC.socialism], "Distinct from public ownership: publicly owned firms can use markets and privately owned firms can be heavily directed."),
];

const rootSpecById = new Map(rootConstructSpecs.map((entry) => [entry.id, entry]));
if (rootSpecById.size !== rootConstructSpecs.length) throw new Error("Duplicate v3 root construct id");

const retiredRootIds = new Set([
  "authority-legitimacy",
  "equality-theory",
  "human-nature-priority",
  "militarism-pacifism",
  "moral-traditionalism",
  "political-community-boundary",
  "property-legitimacy",
  "secularism-religious",
  "coordination-optimism",
  "cultural-plasticity",
  "democratic-confidence",
  "expert-confidence",
  "market-process-confidence",
  "public-choice-skepticism",
  "state-capacity-confidence",
  "centralization-preference",
  "coercion-strategy",
  "compromise-vs-persistence",
  "electoralism-vs-direct-action",
  "gradualism-vs-immediatism",
  "redistribution-vs-predistribution",
  "reform-vs-revolution",
  "regulation-vs-deregulation",
  "state-action-vs-exit",
]);

function criterion(operator, first, second) {
  if (operator === "minimum") return { operator, minimum: first };
  if (operator === "maximum") return { operator, maximum: first };
  return { operator, minimum: first, maximum: second };
}
function cm(id, constructId, relation, operator, first, rationale, refs, second) {
  return {
    id,
    constructId,
    relation,
    ...(operator ? { criterion: criterion(operator, first, second) } : {}),
    ...(operator ? { minimumAnsweredItems: 1 } : {}),
    rationale,
    provenanceRefs: unique([SRC.morphology, ...refs]),
  };
}

const primaryModel = {
  "profile:christian-democrat": {
    rationale: "Christian democracy is identified by subsidiarity, social solidarity, democratic public authority, socially bounded property, and Christian political inspiration rather than a generic conservative midpoint.",
    sources: [SRC.christianDemocracy, SRC.morphology],
    commitments: [
      cm("cd-subsidiarity", "subsidiarity", "constitutive", "minimum", 0.1, "Subsidiarity is a central institutional principle of Christian-democratic political thought.", [SRC.christianDemocracy]),
      cm("cd-solidarity", "social-solidarity", "core", "minimum", 0.05, "Solidarity and social protection are core to Christian-democratic social capitalism.", [SRC.christianDemocracy]),
      cm("cd-democracy", "democratic-legitimacy", "core", "minimum", 0, "Modern Christian democracy is democratic rather than clerical-authoritarian.", [SRC.christianDemocracy]),
      cm("cd-inspiration", "religious-political-inspiration", "characteristic", "minimum", -0.05, "Christian moral inspiration is characteristic even where institutions are religiously pluralist.", [SRC.christianDemocracy, SRC.religion]),
      cm("cd-property", "productive-property", "characteristic", "minimum", -0.2, "Private property is generally accepted but constrained by social duties.", [SRC.christianDemocracy, SRC.property]),
      cm("cd-insurance", "social-insurance", "characteristic", "minimum", -0.05, "Social insurance and social-market institutions are characteristic instruments.", [SRC.christianDemocracy]),
      cm("cd-establishment", "religious-establishment", "contested", null, null, "Christian democrats vary substantially on establishment and church-state constitutional form.", [SRC.christianDemocracy, SRC.religion]),
      cm("cd-moral-law", "coercive-moral-order", "contested", null, null, "Christian-democratic parties vary on coercive enforcement of traditional morality.", [SRC.christianDemocracy]),
    ],
  },
  "profile:classical-liberalism": {
    rationale: "Classical liberalism combines non-interference, legal equality, private property, markets, constitutional limits, and skepticism toward concentrated coercive authority without requiring a single welfare or democracy theory.",
    sources: [SRC.liberalism, SRC.libertarianism],
    commitments: [
      cm("cl-liberty", "liberty-noninterference", "constitutive", "minimum", 0.15, "A protected sphere of individual non-interference is constitutive of classical liberalism.", [SRC.liberalism, SRC.libertarianism]),
      cm("cl-legal-equality", "legal-equality", "core", "minimum", 0, "Equal legal status is central to liberal citizenship.", [SRC.liberalism, SRC.equality]),
      cm("cl-property", "productive-property", "core", "minimum", 0.05, "Private property and voluntary exchange are core institutions.", [SRC.property, SRC.liberalism]),
      cm("cl-market", "market-knowledge-coordination", "characteristic", "minimum", 0, "Classical liberals characteristically expect decentralized markets to coordinate dispersed knowledge.", [SRC.hayek, SRC.liberalism]),
      cm("cl-constitutional", "constitutional-reform", "core", "minimum", 0, "Constitutional limits and rule-bound government are core liberal institutional commitments.", [SRC.liberalism]),
      cm("cl-contestability", "contestable-institutions", "characteristic", "minimum", -0.05, "Institutional checks and review are characteristic protections against arbitrary power.", [SRC.republicanism, SRC.liberalism]),
      cm("cl-effective-agency", "effective-agency", "contested", null, null, "Classical liberals disagree over how far effective material capacity belongs within liberty itself.", [SRC.liberalism]),
      cm("cl-solidarity", "social-solidarity", "contested", null, null, "Classical-liberal traditions vary over social minima and public social duties.", [SRC.liberalism]),
      cm("cl-planning", "central-planning", "incompatible", "minimum", 0.65, "Comprehensive central planning conflicts with classical-liberal economic and political pluralism.", [SRC.liberalism, SRC.hayek]),
    ],
  },
  "profile:conservative": {
    rationale: "Prudential conservatism is identified by deference to inherited institutions, path dependence, gradual change, and skepticism of deliberate social reconstruction rather than by mandatory nationalism, religiosity, or laissez-faire economics.",
    sources: [SRC.conservatism],
    commitments: [
      cm("con-tradition", "tradition-deference", "constitutive", "minimum", 0.1, "Inherited institutions and practices receive presumptive weight.", [SRC.conservatism]),
      cm("con-path", "institutional-path-dependence", "core", "minimum", 0, "Conservative prudence relies on limits created by institutional history and tacit adaptation.", [SRC.conservatism]),
      cm("con-gradual", "gradual-transition", "core", "minimum", 0, "Major changes should usually be sequenced cautiously.", [SRC.conservatism]),
      cm("con-reform", "institutional-reform", "characteristic", "minimum", -0.15, "Conservatism permits reform when it preserves continuity and manages risk.", [SRC.conservatism]),
      cm("con-malleability", "cultural-malleability", "core", "maximum", 0.25, "Conservatives characteristically doubt easy deliberate remaking of culture and institutions.", [SRC.conservatism]),
      cm("con-authority", "political-authority-legitimacy", "characteristic", "minimum", -0.2, "Order and authority may be legitimate, but no universal theory of unlimited state power is constitutive.", [SRC.conservatism, SRC.authority]),
      cm("con-moral-order", "coercive-moral-order", "contested", null, null, "Conservatives disagree over how far traditional morality should be legally enforced.", [SRC.conservatism]),
      cm("con-national", "compatriot-priority", "contested", null, null, "National attachment is important in some conservative traditions but not constitutive of prudential conservatism as such.", [SRC.conservatism, SRC.nationalism]),
      cm("con-market", "productive-property", "contested", null, null, "Conservative traditions range from market-oriented to paternal/social variants.", [SRC.conservatism]),
    ],
  },
  "profile:democratic-socialist": {
    rationale: "Democratic socialism requires democratic political legitimacy and meaningful social or democratic control of economic power; it is not merely a more redistributive social democracy.",
    sources: [SRC.socialism, SRC.socialDemocracy],
    commitments: [
      cm("ds-democracy", "democratic-legitimacy", "constitutive", "minimum", 0.1, "Democratic political institutions distinguish democratic socialism from authoritarian socialist strategies.", [SRC.socialism, SRC.socialDemocracy]),
      cm("ds-workplace", "workplace-self-government", "core", "minimum", 0.05, "Economic democracy and worker power are central socialist goals.", [SRC.socialism]),
      cm("ds-public-ownership", "public-ownership", "core", "minimum", -0.05, "Social ownership is central, though its institutional form can be public, cooperative, municipal, or otherwise social.", [SRC.socialism]),
      cm("ds-worker-control", "worker-control", "core", "minimum", -0.05, "Democratic control of productive institutions is a core route to economic democracy.", [SRC.socialism]),
      cm("ds-solidarity", "social-solidarity", "core", "minimum", 0, "Social provision and solidarity are core socialist concerns.", [SRC.socialism]),
      cm("ds-class", "class-exploitation", "characteristic", "minimum", -0.05, "Democratic socialists commonly understand economic power in terms of class and workplace domination.", [SRC.socialism]),
      cm("ds-private-capital", "productive-property", "incompatible", "minimum", 0.75, "Treating strong private control of productive capital as presumptively overriding democratic/social claims conflicts with democratic socialism.", [SRC.socialism, SRC.property]),
      cm("ds-revolution", "revolutionary-rupture", "contested", null, null, "Democratic socialists differ over transformation through elections, extra-parliamentary action, rupture, or long reform.", [SRC.socialism]),
    ],
  },
  "profile:green-politics": {
    rationale: "Green politics is identified by ecological standing, intergenerational obligations, and ecological restructuring; ecocentrism alone is not treated as the whole ideology.",
    sources: [SRC.green],
    commitments: [
      cm("green-standing", "ecological-standing", "constitutive", "minimum", 0.15, "Nature and ecological systems receive standing beyond immediate instrumental use.", [SRC.green]),
      cm("green-future", "intergenerational-ecological-duty", "core", "minimum", 0.1, "Intergenerational ecological obligations are central to sustainability politics.", [SRC.green]),
      cm("green-restructure", "ecological-restructuring", "core", "minimum", 0, "Green ideology characteristically seeks institutional restructuring to respect ecological constraints.", [SRC.green]),
      cm("green-limits", "ecological-limits-growth", "characteristic", "minimum", -0.1, "Many green traditions emphasize biophysical limits, while ecomodernist strands dispute stronger limits claims.", [SRC.green]),
      cm("green-democracy", "democratic-legitimacy", "characteristic", "minimum", -0.05, "Green political traditions commonly connect ecological politics with democratization.", [SRC.green]),
      cm("green-nonviolence", "nonviolent-strategy", "characteristic", "minimum", -0.1, "Nonviolence is historically characteristic but not a universal gate for every green party.", [SRC.green, SRC.pacifism]),
      cm("green-property", "public-ownership", "contested", null, null, "Green traditions disagree over market, common, cooperative, and public ownership forms.", [SRC.green]),
    ],
  },
  "profile:libertarian-socialism": {
    rationale: "Libertarian socialism combines anti-authoritarian/non-dominating political arrangements with social or worker control of productive institutions and decentralized organization.",
    sources: [SRC.socialism, SRC.libertarianism],
    commitments: [
      cm("ls-domination", "anti-domination", "constitutive", "minimum", 0.15, "Opposition to domination and hierarchical command is constitutive.", [SRC.socialism, SRC.republicanism]),
      cm("ls-authority", "political-authority-legitimacy", "constitutive", "maximum", 0.15, "Libertarian socialism is skeptical that centralized coercive authority possesses a broad special claim to obedience.", [SRC.libertarianism, SRC.socialism]),
      cm("ls-workplace", "workplace-self-government", "constitutive", "minimum", 0.1, "Socialism requires democratic or social control of productive power rather than capitalist workplace hierarchy.", [SRC.socialism]),
      cm("ls-decentralize", "institutional-decentralization", "core", "minimum", 0, "Decentralized and federated organization is characteristic of libertarian-socialist institutions.", [SRC.socialism, SRC.ostrom]),
      cm("ls-worker-control", "worker-control", "core", "minimum", 0, "Worker self-management is a characteristic institutional strategy.", [SRC.socialism]),
      cm("ls-direct", "direct-action", "characteristic", "minimum", -0.1, "Direct organization and action are characteristic but need not exclude all electoral work.", [SRC.socialism]),
      cm("ls-private-capital", "productive-property", "incompatible", "minimum", 0.7, "Strong capitalist control rights over productive assets conflict with libertarian socialism.", [SRC.socialism]),
      cm("ls-planning", "central-planning", "incompatible", "minimum", 0.65, "Centralized administrative planning conflicts with the libertarian-socialist decentralist core.", [SRC.socialism]),
      cm("ls-markets", "market-knowledge-coordination", "contested", null, null, "Market anarchist and communistic libertarian-socialist branches disagree over market coordination.", [SRC.socialism, SRC.libertarianism]),
    ],
  },
  "profile:market-right-libertarianism": {
    rationale: "Right-libertarianism is identified by strong non-interference and property rights, constrained political authority, voluntary exchange, and opposition to coercive redistribution or comprehensive planning.",
    sources: [SRC.libertarianism, SRC.property],
    commitments: [
      cm("rl-liberty", "liberty-noninterference", "constitutive", "minimum", 0.2, "Strong rights against coercive interference are constitutive.", [SRC.libertarianism]),
      cm("rl-property", "productive-property", "constitutive", "minimum", 0.2, "Strong legitimate private property claims are constitutive of right-libertarian justice.", [SRC.libertarianism, SRC.property]),
      cm("rl-personal", "personal-property", "core", "minimum", 0.1, "Strong control over personal holdings is central.", [SRC.libertarianism, SRC.property]),
      cm("rl-authority", "political-authority-legitimacy", "core", "maximum", 0.2, "Political authority is sharply constrained; minarchist and anarchist variants differ over its residual scope.", [SRC.libertarianism, SRC.authority]),
      cm("rl-market", "market-knowledge-coordination", "core", "minimum", 0, "Decentralized exchange is characteristically viewed as an effective coordination institution.", [SRC.hayek, SRC.libertarianism]),
      cm("rl-deregulation", "market-deregulation", "characteristic", "minimum", -0.05, "Reducing coercive restrictions on voluntary exchange is characteristic.", [SRC.libertarianism]),
      cm("rl-legal-equality", "legal-equality", "core", "minimum", 0, "Equal individual rights rather than inherited legal status is a core implication of individual rights.", [SRC.libertarianism, SRC.equality]),
      cm("rl-redistribution", "income-redistribution", "incompatible", "minimum", 0.7, "Strong coercive redistribution for patterned distributive outcomes conflicts with right-libertarian property claims.", [SRC.libertarianism]),
      cm("rl-planning", "central-planning", "incompatible", "minimum", 0.65, "Comprehensive central planning conflicts with voluntary exchange and private control.", [SRC.libertarianism, SRC.hayek]),
      cm("rl-force", "force-permissibility", "contested", null, null, "Libertarians agree on defensive force more than on pacifism, foreign policy, or military institutions.", [SRC.libertarianism, SRC.pacifism]),
    ],
  },
  "profile:marxian-socialism": {
    rationale: "Marxian socialism is distinguished by its descriptive theory of class, exploitation, accumulation, ideology, and structural historical change together with socialist transformation; it is not defined merely as non-Leninist distance from another profile.",
    sources: [SRC.marx, SRC.socialism],
    commitments: [
      cm("mx-class", "class-exploitation", "constitutive", "minimum", 0.15, "Class and exploitation are constitutive explanatory commitments of Marxian analysis.", [SRC.marx]),
      cm("mx-accumulation", "capital-accumulation-crisis", "core", "minimum", 0, "Accumulation, concentration, and crisis mechanisms are central to Marxian political economy.", [SRC.marx]),
      cm("mx-ideology", "ideology-hegemony", "core", "minimum", -0.05, "Ideology and social reproduction of power are central explanatory themes.", [SRC.marx]),
      cm("mx-structure", "historical-change-structural", "core", "minimum", 0, "Structural social and economic forces play a major role in historical change.", [SRC.marx]),
      cm("mx-private-capital", "productive-property", "incompatible", "minimum", 0.7, "Treating capitalist private productive property as presumptively just conflicts with Marxian socialism.", [SRC.marx, SRC.socialism]),
      cm("mx-public", "public-ownership", "characteristic", "minimum", -0.1, "Social ownership is characteristic, while Marxian traditions dispute state, communal, and cooperative forms.", [SRC.socialism, SRC.marx]),
      cm("mx-worker", "worker-control", "characteristic", "minimum", -0.1, "Worker/social control is characteristic of emancipatory socialist transformation.", [SRC.socialism, SRC.marx]),
      cm("mx-revolution", "revolutionary-rupture", "contested", null, null, "Marxian traditions disagree over revolutionary rupture, reform, and transition strategy.", [SRC.marx, SRC.socialism]),
      cm("mx-vanguard", "vanguard-party", "contested", null, null, "Vanguard-party doctrine belongs to Leninist branches and is not constitutive of Marxian socialism as a whole.", [SRC.marx, SRC.communism]),
    ],
  },
  "profile:marxist-leninist": {
    rationale: "Marxism-Leninism combines Marxian class analysis with the distinctive Leninist institutions of a vanguard party, democratic centralism, revolutionary transition, and extensive planned/socialized ownership.",
    sources: [SRC.communism, SRC.marx],
    commitments: [
      cm("ml-class", "class-exploitation", "core", "minimum", 0.1, "Marxian class and exploitation analysis remains central.", [SRC.marx]),
      cm("ml-vanguard", "vanguard-party", "constitutive", "minimum", 0.15, "The leading revolutionary party is a defining Leninist institutional commitment.", [SRC.communism]),
      cm("ml-dc", "democratic-centralism", "constitutive", "minimum", 0.1, "Democratic centralism is a defining organizational doctrine.", [SRC.communism]),
      cm("ml-planning", "central-planning", "core", "minimum", 0, "Central planning is characteristic of Marxist-Leninist political economy.", [SRC.communism]),
      cm("ml-public", "public-ownership", "core", "minimum", 0.05, "State/social ownership of major productive assets is characteristic.", [SRC.communism]),
      cm("ml-rupture", "revolutionary-rupture", "core", "minimum", 0, "Revolutionary transition rather than merely constitutional reform is central to Leninist strategy.", [SRC.communism, SRC.marx]),
      cm("ml-structure", "historical-change-structural", "characteristic", "minimum", 0, "Structural class forces are central to historical analysis.", [SRC.marx]),
      cm("ml-private-capital", "productive-property", "incompatible", "minimum", 0.7, "Strong private capitalist control over major productive assets conflicts with the Marxist-Leninist program.", [SRC.communism]),
    ],
  },
  "profile:republicanism": {
    rationale: "Republicanism is identified by freedom as non-domination and institutions that make power contestable, rule-bound, and publicly accountable; it is not a generic midpoint on liberty and authority.",
    sources: [SRC.republicanism, SRC.liberty],
    commitments: [
      cm("rep-domination", "anti-domination", "constitutive", "minimum", 0.15, "Freedom as non-domination is the central republican liberty commitment.", [SRC.republicanism, SRC.liberty]),
      cm("rep-contestable", "contestable-institutions", "core", "minimum", 0.1, "Institutions must permit effective contestation of arbitrary power.", [SRC.republicanism]),
      cm("rep-democracy", "democratic-legitimacy", "core", "minimum", 0, "Public accountability and democratic control are core institutional mechanisms.", [SRC.republicanism]),
      cm("rep-constitutional", "constitutional-reform", "characteristic", "minimum", 0, "Rule of law and constitutional checks are characteristic republican institutions.", [SRC.republicanism]),
      cm("rep-equality", "legal-equality", "core", "minimum", 0, "Equal civic standing is necessary for non-dominating citizenship.", [SRC.republicanism, SRC.equality]),
      cm("rep-effective", "effective-agency", "characteristic", "minimum", -0.1, "Some material independence can be relevant where dependence exposes citizens to domination.", [SRC.republicanism, SRC.liberty]),
      cm("rep-property", "productive-property", "contested", null, null, "Republicans disagree over how property institutions contribute to or undermine independence and non-domination.", [SRC.republicanism, SRC.property]),
      cm("rep-welfare", "social-solidarity", "contested", null, null, "Republican traditions differ over the social provision required for civic independence.", [SRC.republicanism]),
    ],
  },
  "profile:social-democrat": {
    rationale: "Social democracy combines democratic collective action, social solidarity, social insurance, labor power, redistribution, and regulation while ordinarily retaining a mixed or capitalist market economy.",
    sources: [SRC.socialDemocracy],
    commitments: [
      cm("sd-solidarity", "social-solidarity", "constitutive", "minimum", 0.15, "Collective social protection is central to social democracy.", [SRC.socialDemocracy]),
      cm("sd-democracy", "democratic-legitimacy", "core", "minimum", 0.1, "Democratic political accountability is core.", [SRC.socialDemocracy]),
      cm("sd-insurance", "social-insurance", "core", "minimum", 0.05, "Broad social insurance is a characteristic institution of social-democratic capitalism.", [SRC.socialDemocracy]),
      cm("sd-redistribution", "income-redistribution", "core", "minimum", 0, "Taxes and transfers are legitimate tools for social protection and equality.", [SRC.socialDemocracy]),
      cm("sd-regulation", "regulatory-intervention", "core", "minimum", -0.05, "Regulation of market power, labor relations, and social risks is characteristic.", [SRC.socialDemocracy]),
      cm("sd-bargaining", "collective-bargaining", "characteristic", "minimum", -0.05, "Organized labor and collective bargaining are historically characteristic social-democratic institutions.", [SRC.socialDemocracy]),
      cm("sd-reform", "institutional-reform", "core", "minimum", 0, "Social democracy ordinarily pursues change through democratic institutional reform.", [SRC.socialDemocracy]),
      cm("sd-private-property", "productive-property", "characteristic", "minimum", -0.25, "Modern social democracy ordinarily accepts substantial private productive property subject to social regulation.", [SRC.socialDemocracy, SRC.property]),
      cm("sd-public-ownership", "public-ownership", "contested", null, null, "Social democrats differ over public ownership and sectoral socialization.", [SRC.socialDemocracy]),
      cm("sd-rupture", "revolutionary-rupture", "incompatible", "minimum", 0.75, "A commitment to replacing democratic institutions through revolutionary rupture conflicts with contemporary social-democratic strategy.", [SRC.socialDemocracy]),
    ],
  },
  "profile:social-liberalism": {
    rationale: "Social liberalism combines liberal rights and constitutionalism with effective agency, fair opportunity, social provision, and regulated markets rather than occupying a geometric midpoint between classical liberalism and social democracy.",
    sources: [SRC.liberalism, SRC.equality],
    commitments: [
      cm("sl-liberty", "liberty-noninterference", "core", "minimum", 0.1, "Social liberalism retains strong liberal civil and personal liberty commitments.", [SRC.liberalism, SRC.liberty]),
      cm("sl-effective", "effective-agency", "core", "minimum", 0.1, "Effective capacity to pursue one’s ends is central to social-liberal accounts of freedom.", [SRC.liberalism, SRC.liberty]),
      cm("sl-legal-equality", "legal-equality", "core", "minimum", 0.1, "Equal legal citizenship remains core.", [SRC.liberalism, SRC.equality]),
      cm("sl-opportunity", "equality-opportunity", "core", "minimum", 0, "Fair opportunity is a central social-liberal extension of liberal equality.", [SRC.liberalism, SRC.equality]),
      cm("sl-solidarity", "social-solidarity", "characteristic", "minimum", -0.05, "Social provision can be justified as securing effective freedom and fair opportunity.", [SRC.liberalism]),
      cm("sl-public", "public-provision", "characteristic", "minimum", -0.1, "Public provision is a legitimate instrument where it supports effective liberty and opportunity.", [SRC.liberalism]),
      cm("sl-regulation", "regulatory-intervention", "characteristic", "minimum", -0.2, "Markets are retained but subject to public rules and correction.", [SRC.liberalism]),
      cm("sl-property", "productive-property", "characteristic", "minimum", -0.2, "Private property is ordinarily accepted but not treated as absolute against social justice.", [SRC.liberalism, SRC.property]),
      cm("sl-democracy", "democratic-legitimacy", "core", "minimum", 0, "Constitutional democracy is core to contemporary social liberalism.", [SRC.liberalism]),
      cm("sl-contest", "contestable-institutions", "characteristic", "minimum", -0.05, "Rights, review, and institutional accountability constrain public power.", [SRC.liberalism, SRC.republicanism]),
      cm("sl-planning", "central-planning", "incompatible", "minimum", 0.75, "Comprehensive administrative planning conflicts with social liberalism’s pluralist market order.", [SRC.liberalism]),
    ],
  },
};

const productionProfileIds = Object.freeze(Object.keys(primaryModel).sort());
const demotedProfileIds = Object.freeze([
  "profile:liberal-conservatism",
  "profile:market-liberal",
  "profile:national-conservatism",
  "profile:radical-democracy",
]);

const neighborPairs = [
  { id: "christian-democrat__conservative", left: "profile:christian-democrat", right: "profile:conservative", constructIds: ["subsidiarity", "social-solidarity", "religious-political-inspiration"] },
  { id: "classical-liberal__right-libertarian", left: "profile:classical-liberalism", right: "profile:market-right-libertarianism", constructIds: ["productive-property", "effective-agency", "social-solidarity"] },
  { id: "democratic-socialist__social-democrat", left: "profile:democratic-socialist", right: "profile:social-democrat", constructIds: ["public-ownership", "worker-control", "workplace-self-government"] },
  { id: "libertarian-socialist__democratic-socialist", left: "profile:libertarian-socialism", right: "profile:democratic-socialist", constructIds: ["political-authority-legitimacy", "institutional-decentralization", "direct-action"] },
  { id: "marxian__democratic-socialist", left: "profile:marxian-socialism", right: "profile:democratic-socialist", constructIds: ["class-exploitation", "capital-accumulation-crisis", "ideology-hegemony", "historical-change-structural"] },
  { id: "marxist-leninist__marxian", left: "profile:marxist-leninist", right: "profile:marxian-socialism", constructIds: ["vanguard-party", "democratic-centralism", "central-planning"] },
  { id: "republican__social-liberal", left: "profile:republicanism", right: "profile:social-liberalism", constructIds: ["anti-domination", "contestable-institutions"] },
  { id: "republican__classical-liberal", left: "profile:republicanism", right: "profile:classical-liberalism", constructIds: ["anti-domination", "contestable-institutions"] },
  { id: "social-liberal__classical-liberal", left: "profile:social-liberalism", right: "profile:classical-liberalism", constructIds: ["effective-agency", "equality-opportunity", "social-solidarity"] },
  { id: "green__social-democrat", left: "profile:green-politics", right: "profile:social-democrat", constructIds: ["ecological-standing", "intergenerational-ecological-duty", "ecological-restructuring"] },
];

function rootContributions(contributions) {
  return (contributions ?? []).filter((entry) => !String(entry.constructId).startsWith("specialist:"));
}
function specialistContributions(contributions) {
  return (contributions ?? []).filter((entry) => String(entry.constructId).startsWith("specialist:"));
}
function bestContribution(contributions) {
  return [...contributions].sort((a, b) => (Number(b.weight) || 0) - (Number(a.weight) || 0) || String(a.constructId).localeCompare(String(b.constructId)))[0];
}
function byId(contributions, id) {
  return contributions.find((entry) => String(entry.constructId) === id);
}
function lower(text) {
  return String(text ?? "").toLowerCase();
}
function has(text, pattern) {
  return pattern.test(text);
}

function chooseRoot(item, option, contributions) {
  const roots = rootContributions(contributions);
  const best = bestContribution(roots);
  const text = lower(`${item.prompt ?? ""} ${option?.text ?? ""} ${item.contextNote ?? ""}`);
  const domain = String(item.domainId);
  const layer = String(item.layer);
  const old = (id) => byId(roots, id);
  const picked = (constructId, polarity = 1, rule = "semantic override") => ({ constructId, polarity, rule, source: best ?? null });

  if (layer === "normative") {
    if (domain === "intellectual-property-information") return picked("intellectual-property-rights", old("property-legitimacy")?.polarity ?? 1, "IP-specific property domain");
    if (domain === "land-housing-georgism" && has(text, /land|ground rent|land value|natural resource|site value/)) {
      const p = old("property-legitimacy");
      return picked("land-natural-resource-claims", p ? -p.polarity : 1, "land/resource claims separated from productive property");
    }
    if (domain === "religion-secularism") {
      if (has(text, /accommodat|exempt|conscience|religious exercise|free exercise|opt[- ]?out/)) return picked("religious-accommodation", 1, "religious accommodation content");
      if (has(text, /religious reason|religious values|faith.{0,20}politic|religion.{0,20}public argument|inspir/)) return picked("religious-political-inspiration", 1, "religious political inspiration content");
      const sec = old("secularism-religious");
      if (has(text, /neutral|non[- ]?establish|secular state|favor.{0,20}religion|religion and non/)) return picked("religious-neutrality", sec ? -sec.polarity : 1, "state neutrality content");
      if (has(text, /establish|official religion|state church|privileg.{0,20}religion|religious test|theocr/)) return picked("religious-establishment", sec?.polarity ?? 1, "religious establishment content");
      return picked(sec && sec.polarity < 0 ? "religious-neutrality" : "religious-establishment", 1, "split inherited religion axis by direction");
    }
    if (domain === "environment-climate-growth") {
      if (has(text, /future generation|intergenerational|posterity|future people/)) return picked("intergenerational-ecological-duty", 1, "intergenerational ecological duty content");
      if (old("human-nature-priority")) return picked("ecological-standing", old("human-nature-priority").polarity, "ecological standing replaces anthropocentric/ecocentric binary");
    }
    if (domain === "foreign-policy-war") {
      if (has(text, /empire|prestige|crusade|regime change|militari|permanent war|interventionism/)) return picked("anti-militarism", old("militarism-pacifism") ? -old("militarism-pacifism").polarity : 1, "anti-militarism distinguished from force permissibility");
      if (old("militarism-pacifism")) return picked("force-permissibility", old("militarism-pacifism").polarity, "conditional force permissibility");
    }
    if (domain === "immigration-borders" || domain === "national-identity-sovereignty") {
      if (has(text, /self[- ]?determination|sovereign|nation.{0,20}govern|national independence/)) return picked("national-self-determination", 1, "national self-determination content");
      const community = old("political-community-boundary");
      if (has(text, /compatriot|citizen.{0,20}priority|own people|fellow citizen|national obligation/)) return picked("compatriot-priority", community ? -community.polarity : 1, "special compatriot duty content");
      if (community) return picked(community.polarity >= 0 ? "universal-moral-standing" : "compatriot-priority", 1, "split universal standing from compatriot partiality");
    }
    if (domain === "race-ethnicity-multiculturalism") {
      const eq = old("equality-theory");
      if (has(text, /equal citizenship|equal legal|law|nondiscrimin|discriminat|civil right/)) return picked("legal-equality", eq && eq.polarity < 0 ? 1 : (eq?.polarity ?? 1), "legal/civic equality content");
      if (has(text, /opportunit|access to/)) return picked("equality-opportunity", 1, "opportunity equality content");
      if (has(text, /second[- ]?class|status hierarchy|subordinat|caste|dominat|social standing/)) return picked("relational-equality", 1, "relational equality content");
      if (eq) return picked(eq.polarity < 0 ? "legal-equality" : "distributive-equality", 1, "split inherited equality axis by direction");
    }
    if (domain === "redistribution-welfare") {
      if (has(text, /agency|real freedom|effective freedom|capabilit|practical ability/)) return picked("effective-agency", 1, "effective agency content");
      if (has(text, /safety net|basic needs|poverty|social minimum|vulnerability|security/)) return picked("social-solidarity", 1, "social solidarity content");
      if (old("equality-theory")) return picked(old("equality-theory").polarity < 0 ? "legal-equality" : "distributive-equality", 1, "equality claim separated by type");
    }
    if (domain === "labor-unions-workplace") {
      if (has(text, /worker.{0,30}(govern|control|voice|manage|ownership|cooperativ)|workplace.{0,30}(democra|govern|control)/)) return picked("workplace-self-government", 1, "workplace governance content");
      if (has(text, /subordinat|dominat|status|boss.{0,20}power/)) return picked("relational-equality", 1, "workplace relational equality content");
    }
    if (domain === "family-gender-feminism") {
      const trad = old("moral-traditionalism");
      if (has(text, /law|ban|prohibit|criminal|state.{0,20}(enforce|require)|legally require/)) return picked("coercive-moral-order", trad?.polarity ?? 1, "coercive moral-order content");
      if (trad) return picked("tradition-deference", trad.polarity, "tradition separated from coercive enforcement");
      if (has(text, /equal legal|equal rights|nondiscrimin/)) return picked("legal-equality", 1, "sex/gender legal equality content");
      if (has(text, /patriarch|subordinat|dominat|status hierarchy/)) return picked("relational-equality", 1, "gender relational equality content");
    }
    if (domain === "democracy-expertise-constitutionalism") {
      if (has(text, /democratic|vote|voter|majority|popular sovereignty|elected/)) return picked("democratic-legitimacy", 1, "democratic legitimacy content");
      if (has(text, /arbitrary|unchecked|uncontrolled|dominat/)) return picked("anti-domination", old("anti-domination")?.polarity ?? 1, "arbitrary-power content");
    }
    if (domain === "state-legitimacy" && old("authority-legitimacy")) return picked("political-authority-legitimacy", old("authority-legitimacy").polarity, "political authority legitimacy content");

    if (old("anti-domination")) return picked("anti-domination", old("anti-domination").polarity, "direct inherited non-domination content");
    if (old("authority-legitimacy")) return picked("political-authority-legitimacy", old("authority-legitimacy").polarity, "authority legitimacy split");
    if (old("liberty-noninterference")) return picked("liberty-noninterference", old("liberty-noninterference").polarity, "direct non-interference content");
    if (old("equality-theory")) return picked(old("equality-theory").polarity < 0 ? "legal-equality" : "distributive-equality", 1, "equality type split");
    if (old("human-nature-priority")) return picked("ecological-standing", old("human-nature-priority").polarity, "ecological standing");
    if (old("militarism-pacifism")) return picked("force-permissibility", old("militarism-pacifism").polarity, "force permissibility");
    if (old("moral-traditionalism")) return picked("tradition-deference", old("moral-traditionalism").polarity, "tradition deference");
    if (old("political-community-boundary")) return picked(old("political-community-boundary").polarity >= 0 ? "universal-moral-standing" : "compatriot-priority", 1, "political community split");
    if (old("property-legitimacy")) {
      const prop = old("property-legitimacy");
      if (domain === "land-housing-georgism") return picked("land-natural-resource-claims", -prop.polarity, "land/resource property split");
      if (domain === "labor-unions-workplace" && prop.polarity < 0) return picked("workplace-self-government", 1, "worker governance separated from generic property");
      return picked("productive-property", prop.polarity, "productive property separated from other property domains");
    }
    if (old("secularism-religious")) return picked(old("secularism-religious").polarity < 0 ? "religious-neutrality" : "religious-establishment", 1, "religion axis split");
    return picked("legal-equality", 1, "normative fallback after content audit");
  }

  if (layer === "descriptive") {
    if (domain === "environment-climate-growth" && has(text, /limit|growth|throughput|planet|resource|ecolog|climate/)) return picked("ecological-limits-growth", 1, "ecological limits mechanism");
    if (domain === "family-gender-feminism" && has(text, /patriarch|gender|care work|social reproduction|family.{0,20}power/)) return picked("patriarchy-social-reproduction", 1, "gendered structural mechanism");
    if (domain === "labor-unions-workplace" && has(text, /class|exploit|worker.{0,20}power|employer.{0,20}power|surplus|wage/)) return picked("class-exploitation", 1, "class/workplace power mechanism");
    if (domain === "markets-planning") {
      if (has(text, /crisis|accumulat|falling profit|concentrat.{0,20}capital|boom|bust/)) return picked("capital-accumulation-crisis", 1, "capital accumulation/crisis mechanism");
      if (has(text, /monopol|market power|concentrat|dominant firm|dependency/)) return picked("market-power-concentration", 1, "market concentration mechanism");
    }
    if ((domain === "foreign-policy-war" || domain === "national-identity-sovereignty") && has(text, /imperial|colonial|dependency|core.{0,20}periphery|external domination/)) return picked("imperialism-dependency", 1, "imperialism/dependency mechanism");
    if (domain === "national-identity-sovereignty" && has(text, /nation|national identity|identity.{0,20}(made|formed|construct|institution)|school|language/)) return picked("nation-formation", 1, "nation formation mechanism");
    if ((domain === "race-ethnicity-multiculturalism" || domain === "family-gender-feminism") && has(text, /ideolog|hegem|legitimat|media|culture.{0,20}power|reproduce.{0,20}power/)) return picked("ideology-hegemony", 1, "ideology/hegemony mechanism");
    if (domain === "strategy-change" && has(text, /path depend|institution.{0,20}persist|history.{0,20}constraint/)) return picked("institutional-path-dependence", 1, "institutional path dependence mechanism");
    if (domain === "strategy-change" && has(text, /class|structure|material condition|historical change|social forces/)) return picked("historical-change-structural", 1, "structural historical-change mechanism");
    if (has(text, /free rider|collective action|common pool|commons|cooperat.{0,20}problem/)) return picked("collective-action-capacity", 1, "collective-action mechanism");

    const map = {
      "coordination-optimism": "decentralized-coordination-capacity",
      "cultural-plasticity": "cultural-malleability",
      "democratic-confidence": "democratic-decision-capacity",
      "expert-confidence": "expert-knowledge-capacity",
      "market-process-confidence": "market-knowledge-coordination",
      "public-choice-skepticism": "political-incentives-capture",
      "state-capacity-confidence": "state-administrative-capacity",
    };
    if (best && map[String(best.constructId)]) return picked(map[String(best.constructId)], best.polarity, "split descriptive world-model construct");
    return picked("collective-action-capacity", 1, "descriptive fallback after content audit");
  }

  if (layer === "prescriptive") {
    if (has(text, /democratic centralism/)) return picked("democratic-centralism", 1, "direct Leninist organizational doctrine");
    if (has(text, /vanguard/)) return picked("vanguard-party", 1, "direct vanguard-party doctrine");
    if (has(text, /central plan|centrally plan|command econom|planning board|administrative allocation/)) return picked("central-planning", 1, "central planning content");
    if (domain === "labor-unions-workplace") {
      if (has(text, /collective bargain|union|organize.{0,20}worker/)) return picked("collective-bargaining", 1, "collective bargaining content");
      if (has(text, /worker.{0,30}(control|govern|manage|cooperativ|ownership)|workplace democracy/)) return picked("worker-control", 1, "worker-control content");
    }
    if ((domain === "property-ownership" || domain === "markets-planning") && has(text, /public ownership|state ownership|social ownership|nationali[sz]/)) return picked("public-ownership", 1, "public/social ownership content");
    if (domain === "redistribution-welfare" && has(text, /social insurance|unemployment insurance|health insurance|pension|risk pool/)) return picked("social-insurance", 1, "social-insurance content");
    if (domain === "environment-climate-growth" && has(text, /restructur|transform.{0,20}(econom|institution)|ecological transition|green transition/)) return picked("ecological-restructuring", 1, "ecological restructuring content");
    if (has(text, /subsidiarit/)) return picked("subsidiarity", 1, "subsidiarity content");
    if (domain === "democracy-expertise-constitutionalism" && has(text, /contest|appeal|review|check and balance|oversight|challenge.{0,20}power/)) return picked("contestable-institutions", 1, "institutional contestability content");
    if (domain === "democracy-expertise-constitutionalism" && has(text, /constitution|constitutional|judicial review|bill of rights|separation of powers/)) return picked("constitutional-reform", 1, "constitutional design content");

    const c = best;
    if (c) {
      const id = String(c.constructId);
      if (id === "centralization-preference") return picked(c.polarity < 0 ? "institutional-decentralization" : "institutional-centralization", 1, "split centralization/decentralization strategies");
      if (id === "coercion-strategy") return picked(c.polarity < 0 ? "nonviolent-strategy" : "coercive-enforcement-strategy", 1, "split coercive/nonviolent strategy");
      if (id === "compromise-vs-persistence") return picked("coalitional-compromise", c.polarity, "compromise treated as its own strategy");
      if (id === "electoralism-vs-direct-action") return picked(c.polarity < 0 ? "direct-action" : "electoral-participation", 1, "separate electoral participation and direct action");
      if (id === "gradualism-vs-immediatism") return picked(c.polarity < 0 ? "gradual-transition" : "immediatist-transition", 1, "separate gradual and immediatist strategies");
      if (id === "redistribution-vs-predistribution") return picked(c.polarity < 0 ? "predistributive-reform" : "income-redistribution", 1, "separate redistribution and predistribution");
      if (id === "reform-vs-revolution") return picked(c.polarity < 0 ? "institutional-reform" : "revolutionary-rupture", 1, "separate reform and revolutionary rupture");
      if (id === "regulation-vs-deregulation") return picked(c.polarity < 0 ? "market-deregulation" : "regulatory-intervention", 1, "separate regulation and deregulation");
      if (id === "state-action-vs-exit") return picked(c.polarity < 0 ? "exit-parallel-institutions" : "public-provision", 1, "separate public provision and exit/parallel institutions");
    }
    return picked("institutional-reform", 1, "prescriptive fallback after content audit");
  }
  throw new Error(`Unknown item layer ${layer}`);
}

function cleanConstruct(entry) {
  const { __defaultDomain, ...constructRecord } = entry;
  return constructRecord;
}

function migrateMappedContributions(item, option, contributions) {
  const roots = rootContributions(contributions);
  const specialists = specialistContributions(contributions);
  const chosen = chooseRoot(item, option, roots);
  if (!rootSpecById.has(chosen.constructId)) throw new Error(`Unknown v3 mapped construct ${chosen.constructId} for ${item.id}`);
  return {
    contributions: [
      { constructId: chosen.constructId, weight: 1, polarity: chosen.polarity < 0 ? -1 : 1 },
      ...specialists,
    ],
    chosen,
    removed: roots,
    specialists,
  };
}

function auditRecord(item, option, mapped, disposition = "remapped-v3") {
  const spec = rootSpecById.get(mapped.chosen.constructId);
  const key = option ? `${item.id}#${option.id}` : item.id;
  return {
    key,
    itemId: item.id,
    ...(option ? { optionId: option.id } : {}),
    role: item.role,
    layer: item.layer,
    domainId: item.domainId,
    primaryConstructId: mapped.chosen.constructId,
    primaryPolarity: mapped.chosen.polarity < 0 ? -1 : 1,
    responseInterpretation: mapped.chosen.polarity < 0 ? `Agreement rejects ${spec.name}` : `Agreement supports ${spec.name}`,
    constructRationale: `${mapped.chosen.rule}. The v3 audit retains one primary root loading and removes inherited root cross-loadings that encoded assumed ideological correlations.`,
    sourceScope: unique([...(item.provenanceRefs ?? []), ...(spec.provenanceRefs ?? [])]),
    boundaryNote: item.contextNote ?? spec.boundaryStatement,
    removedLegacyRootMappings: mapped.removed.map((entry) => ({ constructId: entry.constructId, weight: entry.weight, polarity: entry.polarity })),
    secondaryMappings: mapped.specialists.map((entry) => ({
      constructId: entry.constructId,
      weight: entry.weight,
      polarity: entry.polarity,
      rationale: "Module-local specialist discriminator retained as a non-root secondary mapping; source-backed specialist reconstruction is owned by issue #22.",
    })),
    reviewDisposition: disposition,
    reviewVersion: "v3-item-audit-1",
  };
}

function migrateItems(items) {
  const audits = [];
  const migrated = items.map((original) => {
    const item = JSON.parse(JSON.stringify(original));
    if (item.responseType === "statement-choice") {
      item.scoring.contributions = [];
      item.options = item.options.map((option) => {
        const mapped = migrateMappedContributions(item, option, option.contributions);
        if (item.status === "active") audits.push(auditRecord(item, option, mapped));
        return { ...option, contributions: mapped.contributions };
      });
    } else {
      const mapped = migrateMappedContributions(item, null, item.scoring.contributions);
      item.scoring.contributions = mapped.contributions;
      if (item.status === "active") audits.push(auditRecord(item, null, mapped));
    }
    return item;
  });
  return { migrated, audits };
}

function mappedRootIndex(items) {
  const index = new Map(rootConstructSpecs.map((entry) => [entry.id, []]));
  for (const item of items) {
    if (item.status !== "active") continue;
    if (item.responseType === "statement-choice") {
      for (const option of item.options) {
        for (const contribution of rootContributions(option.contributions)) index.get(String(contribution.constructId))?.push(`${item.id}#${option.id}`);
      }
    } else {
      for (const contribution of rootContributions(item.scoring.contributions)) index.get(String(contribution.constructId))?.push(item.id);
    }
  }
  return index;
}

function directPrompt(spec) {
  const positive = String(spec.poles.positive).replace(/[.?!]+$/, "");
  return `Do you agree that ${positive.charAt(0).toLowerCase()}${positive.slice(1)}?`;
}

const oldRootConstructs = [
  ...readContent("constructs/normative.json"),
  ...readContent("constructs/descriptive.json"),
  ...readContent("constructs/prescriptive.json"),
];
const oldPrimaryProfiles = readContent("profiles/primary.json");
const oldCorrections = readContent("items/reviewed-mapping-corrections.json");

const archiveRootPath = resolve(root, "docs/v2/archive/root-constructs-v2.json");
const archivePrimaryPath = resolve(root, "docs/v2/archive/primary-centroids-v2.json");
const archiveCorrectionsPath = resolve(root, "docs/v2/archive/reviewed-mapping-corrections-v2.json");
if (!existsSync(archiveRootPath)) writeJson(archiveRootPath, oldRootConstructs);
if (!existsSync(archivePrimaryPath)) writeJson(archivePrimaryPath, oldPrimaryProfiles);
if (!existsSync(archiveCorrectionsPath)) writeJson(archiveCorrectionsPath, oldCorrections);

if (!existsSync(generatedBundlePath)) throw new Error("Run v2/tools/compile-content.ts before the v3 migration so reviewed mapping corrections are materialized");
const baselineBundle = readJson(generatedBundlePath);
const baselineItems = baselineBundle.items;
let { migrated: migratedItems, audits } = migrateItems(baselineItems);

const profileCommitmentConstructIds = new Set(
  Object.values(primaryModel).flatMap((profile) => profile.commitments)
    .filter((entry) => ["constitutive", "core", "characteristic", "incompatible"].includes(entry.relation))
    .map((entry) => entry.constructId),
);
let index = mappedRootIndex(migratedItems);
const usedIds = new Set(migratedItems.map((item) => String(item.id)));
let boundaryNumber = 501;
for (const spec of rootConstructSpecs) {
  const minimum = profileCommitmentConstructIds.has(spec.id) ? 2 : 1;
  let count = index.get(spec.id)?.length ?? 0;
  while (count < minimum) {
    let id;
    do id = `q${String(boundaryNumber++).padStart(4, "0")}`; while (usedIds.has(id));
    usedIds.add(id);
    const item = {
      id,
      domainId: spec.__defaultDomain,
      prompt: directPrompt(spec),
      responseType: "likert7",
      scoring: { mappingMode: "item", contributions: [{ constructId: spec.id, weight: 1, polarity: 1 }] },
      role: "core",
      layer: spec.role,
      tier: "extensive",
      status: "active",
      reverseScored: false,
      contextNote: spec.boundaryStatement,
      sourceKey: id,
      provenanceRefs: spec.provenanceRefs,
      scaleMin: -3,
      scaleMax: 3,
      scaleStep: 1,
    };
    migratedItems.push(item);
    const mapped = { chosen: { constructId: spec.id, polarity: 1, rule: "direct v3 boundary item" }, removed: [], specialists: [] };
    audits.push(auditRecord(item, null, mapped, "added-direct-boundary-item-v3"));
    count += 1;
  }
  index = mappedRootIndex(migratedItems);
}

migratedItems.sort((a, b) => String(a.id).localeCompare(String(b.id)));
audits.sort((a, b) => a.key.localeCompare(b.key));
const coreItems = migratedItems.filter((item) => item.role === "core");
const specialistItems = migratedItems.filter((item) => item.role === "specialist");
writeContent("items/core.json", coreItems);
writeContent("items/specialist.json", specialistItems);
writeContent("items/reviewed-mapping-corrections.json", []);
writeContent("constructs/normative.json", rootConstructSpecs.filter((entry) => entry.role === "normative").map(cleanConstruct));
writeContent("constructs/descriptive.json", rootConstructSpecs.filter((entry) => entry.role === "descriptive").map(cleanConstruct));
writeContent("constructs/prescriptive.json", rootConstructSpecs.filter((entry) => entry.role === "prescriptive").map(cleanConstruct));

const existingSources = readContent("provenance/sources.json");
const sourceById = new Map(existingSources.map((entry) => [String(entry.id), entry]));
for (const source of sourceRecords) sourceById.set(source.id, source);
writeContent("provenance/sources.json", [...sourceById.values()].sort((a, b) => String(a.id).localeCompare(String(b.id))));

const oldProfileById = new Map(oldPrimaryProfiles.map((entry) => [String(entry.id), entry]));
const primaryProfiles = productionProfileIds.map((profileId) => {
  const old = oldProfileById.get(profileId);
  if (!old) throw new Error(`Missing legacy metadata for production profile ${profileId}`);
  const model = primaryModel[profileId];
  return {
    id: old.id,
    name: old.name,
    role: "primary",
    commitments: model.commitments,
    gates: [],
    minimumEvidenceRatio: 0.6,
    status: "commitment-scored-unvalidated",
    version: "2026-08-primary-commitment-v3",
    targetNodeId: old.targetNodeId,
    rationale: model.rationale,
    provenanceRefs: unique([...(old.provenanceRefs ?? []), ...model.sources]),
  };
});
writeContent("profiles/primary.json", primaryProfiles);

writeContent("diagnostics/relations.json", [
  { id: "divergence-liberty-regulation", type: "cross_dimension_pair", constructIds: ["liberty-noninterference", "regulatory-intervention"], dimensionPair: "normative-prescriptive", secondDirection: -1, provenanceRefs: [SRC.liberty] },
  { id: "divergence-equality-redistribution", type: "cross_dimension_pair", constructIds: ["distributive-equality", "income-redistribution"], dimensionPair: "normative-prescriptive", secondDirection: 1, provenanceRefs: [SRC.equality] },
  { id: "divergence-authority-state-action", type: "cross_dimension_pair", constructIds: ["political-authority-legitimacy", "public-provision"], dimensionPair: "normative-prescriptive", secondDirection: 1, provenanceRefs: [SRC.authority] },
  { id: "divergence-force-coercion", type: "cross_dimension_pair", constructIds: ["force-permissibility", "coercive-enforcement-strategy"], dimensionPair: "normative-prescriptive", secondDirection: 1, provenanceRefs: [SRC.pacifism] },
]);

const directItems = mappedRootIndex(migratedItems);
const constructRole = new Map(rootConstructSpecs.map((entry) => [entry.id, entry.role]));
const commitmentMatrix = productionProfileIds.map((profileId) => ({
  profileId,
  rationale: primaryModel[profileId].rationale,
  commitments: primaryModel[profileId].commitments.map((entry) => ({
    ...entry,
    layer: constructRole.get(entry.constructId),
    directItemIds: directItems.get(entry.constructId) ?? [],
  })),
}));
const neighborCoverage = neighborPairs.map((pair) => ({
  ...pair,
  directEvidence: pair.constructIds.map((constructId) => ({ constructId, itemIds: directItems.get(constructId) ?? [] })),
  itemIds: unique(pair.constructIds.flatMap((constructId) => directItems.get(constructId) ?? [])).sort(),
}));

writeJson(resolve(root, "docs/v2/item-commitment-audit-v3.json"), {
  schemaVersion: "v3-item-audit-1",
  empiricalValidity: "NOT_EVALUATED",
  activeAuditRecordCount: audits.length,
  records: audits,
});
writeJson(resolve(root, "docs/v2/primary-commitment-matrix-v3.json"), {
  schemaVersion: "v3-primary-commitment-matrix-1",
  empiricalValidity: "NOT_EVALUATED",
  profiles: commitmentMatrix,
});
writeJson(resolve(root, "docs/v2/nearest-neighbor-coverage-v3.json"), {
  schemaVersion: "v3-neighbor-coverage-1",
  empiricalValidity: "NOT_EVALUATED",
  pairs: neighborCoverage,
});

const ontologyNodes = readContent("ontology/nodes.json");
const ontologyRelations = readContent("ontology/relations.json");
const modifiers = readContent("profiles/modifiers.json");
const specialists = readContent("profiles/specialists.json");
writeJson(resolve(root, "docs/v2/ontology-role-freeze-v3.json"), {
  schemaVersion: "v3-ontology-role-freeze-1",
  ontology: {
    nodeIds: ontologyNodes.map((entry) => String(entry.id)).sort(),
    relationIds: ontologyRelations.map((entry) => String(entry.id)).sort(),
  },
  sorterRoles: {
    Primary: productionProfileIds,
    SpecialistDerivedFromFormerPrimary: demotedProfileIds,
    Modifier: modifiers.map((entry) => String(entry.modifierId ?? entry.id)).sort(),
    Specialist: specialists.map((entry) => String(entry.specialistId ?? entry.id)).sort(),
  },
  note: "Taxonomic rank and ontology relations remain independent from sorter implementation role. Former primary hybrids remain ontology entries but are not ordinary primary scoring outcomes.",
});

const manifest = readContent("manifest.json");
manifest.metadata.contentSchemaVersion = "content-schema-v3.commitments.1";
manifest.metadata.contentVersion = "v3-content-commitments-1";
manifest.metadata.contentFingerprint = "pending-v3-root-rebuild";
manifest.metadata.scoringVersion = "scoring-v3.commitment-1";
manifest.metadata.methodologyCommit = "e1c194ff2c44ec20e23e00ab23dc410ebdd25f4c";
manifest.metadata.extractionVersion = "v3-root-rebuild-1";
manifest.extraction.extractionVersion = "v3-root-rebuild-1";
manifest.metadata.counts = {
  domains: readContent("domains.json").length,
  constructsRoot: rootConstructSpecs.length,
  constructsSpecialist: readContent("constructs/specialist.json").length,
  constructsTotal: rootConstructSpecs.length + readContent("constructs/specialist.json").length,
  coreItems: coreItems.length,
  specialistItems: specialistItems.length,
  likert7Items: migratedItems.filter((item) => item.responseType === "likert7").length,
  statementChoiceItems: migratedItems.filter((item) => item.responseType === "statement-choice").length,
  reversedItems: migratedItems.filter((item) => item.reverseScored).length,
  primaryProfiles: primaryProfiles.length,
  modifierProfiles: modifiers.length,
  specialistProfiles: specialists.length,
  specialistCandidates: readContent("specialists/candidates.json").length,
  specialistModules: readContent("specialists/modules.json").length,
  ontologyNodes: ontologyNodes.length,
  ontologyRelations: ontologyRelations.length,
  diagnosticRelations: readContent("diagnostics/relations.json").length,
  explicitContributionMappings: migratedItems.reduce((sum, item) => {
    if (item.responseType === "statement-choice") return sum + item.options.reduce((optionSum, option) => optionSum + option.contributions.length, 0);
    return sum + item.scoring.contributions.length;
  }, 0),
};
manifest.extraction.generatedCounts = { ...manifest.metadata.counts };
writeContent("manifest.json", manifest);

function replaceOnce(path, oldText, newText) {
  const absolute = resolve(root, path);
  const text = readFileSync(absolute, "utf8");
  if (!text.includes(oldText)) throw new Error(`Expected patch anchor missing in ${path}: ${oldText.slice(0, 160)}`);
  writeFileSync(absolute, text.replace(oldText, newText), "utf8");
}

replaceOnce(
  "v2/packages/contracts/src/content.ts",
  "  rationale: string;\n}\n\nexport interface BaseProfileRecord",
  "  rationale: string;\n  provenanceRefs?: string[];\n}\n\nexport interface BaseProfileRecord",
);
replaceOnce(
  "v2/packages/contracts/src/content.ts",
  "  requirements?: ConstructRequirement[];\n  gates: ConstitutiveGate[];",
  "  requirements?: ConstructRequirement[];\n  commitments?: SpecialistCommitmentRecord[];\n  gates: ConstitutiveGate[];",
);

const commitmentSchema = readJson(resolve(root, "v2/packages/content/schemas/commitment.schema.json"));
commitmentSchema.properties.provenanceRefs = { type: "array", items: { type: "string", minLength: 1 } };
writeJson(resolve(root, "v2/packages/content/schemas/commitment.schema.json"), commitmentSchema);
writeJson(resolve(root, "v2/packages/content/schemas/profile.schema.json"), {
  $id: "https://example.com/v2/profile.schema.json",
  type: "object",
  required: ["id", "name", "role", "commitments", "gates"],
  properties: {
    id: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    role: { const: "primary" },
    requirements: { type: "array", maxItems: 0, items: { $ref: "requirement.schema.json" } },
    commitments: { type: "array", minItems: 1, items: { $ref: "commitment.schema.json" } },
    gates: { type: "array", items: { $ref: "gate.schema.json" } },
    minimumEvidenceRatio: { type: "number", minimum: 0, maximum: 1 },
    status: { type: "string" },
    version: { type: "string" },
    targetNodeId: { type: "string", minLength: 1 },
    rationale: { type: "string" },
    provenanceRefs: { type: "array", items: { type: "string" } },
  },
  additionalProperties: false,
});

replaceOnce(
  "v2/packages/content/src/validate-schema.ts",
  "  validateRequirements(record.requirements, `${path}.requirements`, issues);\n  if (!record.requirements?.length) addIssue(issues, `${path}.requirements`, \"value\", \"Primary profile requires requirements\");",
  "  if (record.requirements?.length) addIssue(issues, `${path}.requirements`, \"value\", \"Primary profile legacy target requirements are not authoritative in v3\");\n  validateCommitments(record.commitments, `${path}.commitments`, issues);\n  if (!record.commitments?.length) addIssue(issues, `${path}.commitments`, \"value\", \"Primary profile requires commitment specifications\");",
);

replaceOnce(
  "v2/packages/content/src/validate-semantics.ts",
  `  for (const [index, requirement] of (profile.requirements ?? []).entries()) {\n    const construct = constructMap.get(requirement.constructId);\n    if (!construct)\n      addIssue(\n        issues,\n        \`profiles[\${profile.id}].requirements[\${index}].constructId\`,\n        \"ref\",\n        \`Unknown construct \${requirement.constructId}\`,\n      );\n    else if (construct.scope !== \"root\")\n      addIssue(\n        issues,\n        \`profiles[\${profile.id}].requirements[\${index}].constructId\`,\n        \"scope\",\n        \"Primary profile must target root constructs\",\n      );\n  }`,
  `  for (const [index, commitment] of (profile.commitments ?? []).entries()) {\n    const construct = constructMap.get(commitment.constructId);\n    if (!construct)\n      addIssue(\n        issues,\n        \`profiles[\${profile.id}].commitments[\${index}].constructId\`,\n        \"ref\",\n        \`Unknown construct \${commitment.constructId}\`,\n      );\n    else if (construct.scope !== \"root\")\n      addIssue(\n        issues,\n        \`profiles[\${profile.id}].commitments[\${index}].constructId\`,\n        \"scope\",\n        \"Primary commitment must target a root construct\",\n      );\n    validateProvenanceRefs(\n      commitment.provenanceRefs,\n      provenanceIds,\n      \`profiles[\${profile.id}].commitments[\${index}].provenanceRefs\`,\n      issues,\n    );\n  }`,
);

writeFileSync(resolve(root, "v2/packages/engine/src/profiles/ideology-commitments.ts"), `import type {\n  CommitmentCriterion as ContentCommitmentCriterion,\n  CommitmentRelation,\n  PrimaryProfileRecord,\n  SpecialistCommitmentRecord,\n} from "../../../contracts/src/content";\n\nexport const PRIMARY_COMMITMENT_RELATIONS = [\n  "constitutive",\n  "core",\n  "characteristic",\n  "contested",\n  "compatible",\n  "peripheral",\n  "incompatible",\n] as const;\n\nexport type PrimaryCommitmentRelation = CommitmentRelation;\nexport type CommitmentCriterion = ContentCommitmentCriterion;\nexport type PrimaryIdeologyCommitment = SpecialistCommitmentRecord;\n\nexport interface PrimaryIdeologyCommitmentSpec {\n  readonly profileId: string;\n  readonly modelVersion: string;\n  readonly rationale: string;\n  readonly commitments: readonly PrimaryIdeologyCommitment[];\n}\n\nexport const DEMOTED_PRIMARY_PROFILE_IDS = Object.freeze([\n  "profile:liberal-conservatism",\n  "profile:market-liberal",\n  "profile:national-conservatism",\n  "profile:radical-democracy",\n] as const);\nconst demotedPrimaryIds = new Set<string>(DEMOTED_PRIMARY_PROFILE_IDS);\n\nexport function getPrimaryIdeologyCommitmentSpec(\n  profile: PrimaryProfileRecord,\n): PrimaryIdeologyCommitmentSpec | undefined {\n  if (!profile.commitments?.length) return undefined;\n  return {\n    profileId: String(profile.id),\n    modelVersion: profile.version ?? "primary-commitment-unspecified",\n    rationale: profile.rationale ?? profile.name,\n    commitments: profile.commitments,\n  };\n}\n\nexport function isDemotedPrimaryProfile(profileId: string): boolean {\n  return demotedPrimaryIds.has(profileId);\n}\n\nexport function commitmentCriterionSatisfied(\n  score: number,\n  criterion: CommitmentCriterion,\n): boolean {\n  switch (criterion.operator) {\n    case "minimum": return score >= criterion.minimum;\n    case "maximum": return score <= criterion.maximum;\n    case "interval": return score >= criterion.minimum && score <= criterion.maximum;\n  }\n}\n\nexport function commitmentCriterionAnchor(criterion: CommitmentCriterion): number {\n  switch (criterion.operator) {\n    case "minimum": return criterion.minimum;\n    case "maximum": return criterion.maximum;\n    case "interval": return (criterion.minimum + criterion.maximum) / 2;\n  }\n}\n\nexport function commitmentAffinityWeight(relation: PrimaryCommitmentRelation): number {\n  if (relation === "core") return 2;\n  if (relation === "characteristic") return 1;\n  return 0;\n}\n\nexport function isAffinityCommitment(commitment: PrimaryIdeologyCommitment): boolean {\n  return commitmentAffinityWeight(commitment.relation) > 0 && commitment.criterion !== undefined;\n}\n\nexport function isDecisiveCommitment(commitment: PrimaryIdeologyCommitment): boolean {\n  return (commitment.relation === "constitutive" || commitment.relation === "incompatible") && commitment.criterion !== undefined;\n}\n`, "utf8");

for (const path of [
  "v2/packages/engine/src/profiles/profile-evidence.ts",
  "v2/packages/engine/src/profiles/profile-matching.ts",
]) {
  const absolute = resolve(root, path);
  const text = readFileSync(absolute, "utf8").replaceAll("getPrimaryIdeologyCommitmentSpec(String(profile.id))", "getPrimaryIdeologyCommitmentSpec(profile)").replaceAll("getPrimaryIdeologyCommitmentSpec(profileId)", "getPrimaryIdeologyCommitmentSpec(profile)");
  writeFileSync(absolute, text, "utf8");
}

writeFileSync(resolve(root, "tests/engine/v2-primary-commitment-model.spec.ts"), `import { readFileSync } from "node:fs";\nimport { resolve } from "node:path";\nimport { describe, expect, it } from "vitest";\nimport type { CanonicalContentBundle, PrimaryProfileRecord } from "../../v2/packages/contracts/src/content";\nimport type { ConstructAssessment, ConstructResult } from "../../v2/packages/contracts/src/constructs";\nimport { createConstructId } from "../../v2/packages/contracts/src/ids";\nimport { scorePrimaryProfiles } from "../../v2/packages/engine/src";\n\nconst bundle = JSON.parse(readFileSync(resolve(process.cwd(), "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;\n\nfunction scoredConstruct(constructId: string, score: number): ConstructResult {\n  return {\n    constructId: createConstructId(constructId), status: "scored", score, numerator: score, denominator: 1,\n    evidence: { constructId: createConstructId(constructId), expectedItemCount: 2, answeredItemCount: 2, missingItemCount: 0, skippedItemCount: 0, abstainedItemCount: 0, refusedItemCount: 0, supportingItemCount: 2, totalEligibleWeight: 2, answeredEligibleWeight: 2, missingWeight: 0, skippedWeight: 0, abstainedWeight: 0, refusedWeight: 0, scoredMappedWeight: 2, scoredEffectiveWeight: 2, weightedSum: score * 2, structuralCoverage: 1, answeredWeightCoverage: 1, scoredWeightCoverage: 1, effectiveWeightCoverage: 1, salienceCoverage: 1, salienceSkippedWeight: 0, salienceSkippedItemCount: 0, contributionIds: [], itemStateById: {} },\n    support: { evidenceStatus: "sufficient", minimumEvidenceRatio: 0.5, evidenceRatio: 1, nearThreshold: false, uncertaintyLevel: "low", uncertaintyReasons: [] }, contributionIds: [],\n  };\n}\nfunction assessment(scores: Readonly<Record<string, number>>): ConstructAssessment {\n  const constructs = bundle.constructs.filter((construct) => construct.scope === "root").map((construct) => scoredConstruct(String(construct.id), scores[String(construct.id)] ?? 0));\n  return { responseSchemaVersion: bundle.metadata.responseSchemaVersion, scoringVersion: bundle.metadata.scoringVersion, contentVersion: bundle.metadata.contentVersion, contentFingerprint: bundle.metadata.contentFingerprint, resultSchemaVersion: bundle.metadata.resultSchemaVersion, responseSummary: { answeredCount: constructs.length, missingCount: 0, skippedCount: 0, abstainedCount: 0, refusedCount: 0 }, contributions: [], constructs, evidence: { overall: {} as ConstructAssessment["evidence"]["overall"], byConstruct: constructs.map((construct) => construct.evidence) } };\n}\nfunction injectLegacyCentroids(profiles: readonly PrimaryProfileRecord[]): PrimaryProfileRecord[] {\n  return profiles.map((profile) => ({ ...profile, requirements: [{ constructId: createConstructId("liberty-noninterference"), targetValue: -1, weight: 999, minimumAnsweredItems: 999 }] }));\n}\n\ndescribe("declarative commitment-based production primary scoring", () => {\n  it("contains only the 12 commitment-backed primary outcomes and no active target vectors", () => {\n    expect(bundle.profiles).toHaveLength(12);\n    expect(bundle.profiles.every((profile) => (profile.commitments?.length ?? 0) > 0)).toBe(true);\n    expect(bundle.profiles.every((profile) => (profile.requirements?.length ?? 0) === 0)).toBe(true);\n    expect(JSON.stringify(bundle.profiles)).not.toContain('"targetValue"');\n  });\n\n  it("ignores hostile legacy target requirements injected at runtime", () => {\n    const baseline = scorePrimaryProfiles(assessment({}), bundle);\n    const mutated = scorePrimaryProfiles(assessment({}), { ...bundle, profiles: injectLegacyCentroids(bundle.profiles) });\n    expect(mutated).toEqual(baseline);\n  });\n\n  it("scores right-libertarian affinity from v3 commitments", () => {\n    const result = scorePrimaryProfiles(assessment({\n      "liberty-noninterference": 0.8, "productive-property": 0.8, "personal-property": 0.8, "political-authority-legitimacy": 0,\n      "market-knowledge-coordination": 0.7, "market-deregulation": 0.6, "legal-equality": 0.6, "income-redistribution": -0.7, "central-planning": -0.8,\n    }), bundle);\n    const match = result.profiles.find((entry) => String(entry.profileId) === "profile:market-right-libertarianism");\n    expect(match?.status).toBe("scored");\n    expect(match?.similarity).toBe(1);\n    expect(match?.distance).toBe(0);\n    expect(match?.gates.some((gate) => gate.gateId === "commitment:rl-liberty")).toBe(true);\n  });\n});\n`, "utf8");

writeFileSync(resolve(root, "tests/architecture/v3-root-commitment-audit.spec.ts"), `import { readFileSync } from "node:fs";\nimport { describe, expect, it } from "vitest";\nimport type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";\n\nconst bundle = JSON.parse(readFileSync("v2/generated/content.bundle.json", "utf8")) as CanonicalContentBundle;\nconst itemAudit = JSON.parse(readFileSync("docs/v2/item-commitment-audit-v3.json", "utf8"));\nconst matrix = JSON.parse(readFileSync("docs/v2/primary-commitment-matrix-v3.json", "utf8"));\nconst neighbors = JSON.parse(readFileSync("docs/v2/nearest-neighbor-coverage-v3.json", "utf8"));\nconst retired = new Set(${JSON.stringify([...retiredRootIds])});\nconst auditKeys = new Set(itemAudit.records.map((entry: { key: string }) => entry.key));\nconst rootIds = new Set(bundle.constructs.filter((construct) => construct.scope === "root").map((construct) => String(construct.id)));\n\nfunction rootMappings(contributions: readonly { constructId: unknown }[]) { return contributions.filter((entry) => !String(entry.constructId).startsWith("specialist:")); }\n\ndescribe("v3 commitment/item architecture", () => {\n  it("gives every active item or statement option exactly one primary root construct", () => {\n    for (const item of bundle.items.filter((entry) => entry.status === "active")) {\n      if (item.responseType === "statement-choice") {\n        expect(rootMappings(item.scoring.contributions)).toHaveLength(0);\n        for (const option of item.options) {\n          expect(rootMappings(option.contributions), \`${'${item.id}#${option.id}'} root loading count\`).toHaveLength(1);\n          expect(auditKeys.has(\`${'${item.id}#${option.id}'}\`)).toBe(true);\n        }\n      } else {\n        expect(rootMappings(item.scoring.contributions), \`${'${item.id}'} root loading count\`).toHaveLength(1);\n        expect(auditKeys.has(String(item.id))).toBe(true);\n      }\n    }\n  });\n\n  it("removes retired false-binary constructs from all active mappings and production commitments", () => {\n    for (const item of bundle.items.filter((entry) => entry.status === "active")) {\n      const contributions = item.responseType === "statement-choice" ? item.options.flatMap((option) => option.contributions) : item.scoring.contributions;\n      for (const contribution of rootMappings(contributions)) expect(retired.has(String(contribution.constructId))).toBe(false);\n    }\n    for (const profile of bundle.profiles) {\n      for (const commitment of profile.commitments ?? []) {\n        expect(retired.has(String(commitment.constructId))).toBe(false);\n        expect(rootIds.has(String(commitment.constructId))).toBe(true);\n      }\n    }\n  });\n\n  it("provides direct coverage for every scored primary commitment", () => {\n    for (const profile of matrix.profiles) {\n      for (const commitment of profile.commitments.filter((entry: { relation: string }) => ["constitutive", "core", "characteristic", "incompatible"].includes(entry.relation))) {\n        expect(commitment.directItemIds.length, \`${'${profile.profileId}:${commitment.id}'} direct coverage\`).toBeGreaterThanOrEqual(2);\n      }\n    }\n  });\n\n  it("provides direct measurement for every claimed nearest-neighbor distinction", () => {\n    for (const pair of neighbors.pairs) {\n      expect(pair.itemIds.length, pair.id).toBeGreaterThan(0);\n      expect(pair.directEvidence.every((entry: { itemIds: unknown[] }) => entry.itemIds.length > 0), pair.id).toBe(true);\n    }\n  });\n\n  it("keeps empirical validity explicitly unevaluated", () => {\n    expect(itemAudit.empiricalValidity).toBe("NOT_EVALUATED");\n    expect(matrix.empiricalValidity).toBe("NOT_EVALUATED");\n    expect(neighbors.empiricalValidity).toBe("NOT_EVALUATED");\n  });\n});\n`, "utf8");

console.log(JSON.stringify({
  rootConstructs: rootConstructSpecs.length,
  coreItems: coreItems.length,
  specialistItems: specialistItems.length,
  activeAuditRecords: audits.length,
  primaryProfiles: primaryProfiles.length,
  retiredRootIds: [...retiredRootIds].sort(),
  directCoverage: Object.fromEntries([...directItems.entries()].map(([id, ids]) => [id, ids.length])),
}, null, 2));
