import type { Axis, IdeologyLabel, Layer } from '../types'

export interface LayerExplainer {
   label: string
   measurement: string
   description: string
}

export const LAYER_EXPLAINERS: Record<Layer, LayerExplainer> = {
   normative: {
      label: 'Foundational values / ideal legitimacy',
      measurement: 'which values and forms of authority you consider morally legitimate',
      description: 'In this test, this layer asks about foundational moral commitments and what an ideally legitimate political order would value or allow.',
   },
   descriptive: {
      label: 'Empirical beliefs / how institutions behave',
      measurement: 'what you think tends to be true in the world',
      description: 'In this test, this layer asks what you believe about institutions, incentives, culture, and likely consequences—not what you approve of.',
   },
   prescriptive: {
      label: 'Applied policy / strategy',
      measurement: 'which policies, institutions, or strategies you favor',
      description: 'In this test, this layer asks what should be done in practice under the ideal, current, or mixed conditions named by the item.',
   },
}

interface IdeologyTermDefinition {
   pattern: RegExp
   definition: string
}

/**
 * Short, plain-language definitions for ideology names that are commonly used
 * as if they were interchangeable. These explain the catalog's intended use;
 * they do not claim that each term has one uncontested academic meaning.
 */
const IDEOLOGY_TERM_DEFINITIONS: IdeologyTermDefinition[] = [
   {
      pattern: /\bclassical liberalism\b/i,
      definition: '“Classical liberalism” is a tradition centered on individual rights, private property, limited government, and legal constraints on public power.',
   },
   {
      pattern: /\bsocial liberalism\b/i,
      definition: '“Social liberalism” combines individual rights with public action to secure capabilities, opportunity, and protection from deprivation.',
   },
   {
      pattern: /\bmarket[- ]governance liberalism\b|\bneoliberalism\b/i,
      definition: '“Market-governance liberalism” refers here to using competition, markets, and expert institutions to organize public policy; “neoliberalism” has several contested historical uses.',
   },
   {
      pattern: /\bliberal(?:ism)?\b/i,
      definition: '“Liberalism” is a family of traditions that gives individual rights, legal equality, and limits on arbitrary power a central place.',
   },
   {
      pattern: /\bprogressiv(?:ism|e)\b/i,
      definition: '“Progressivism” is a broad and historically changing family of reform politics that seeks deliberate social improvement through public institutions, inquiry, and policy.',
   },
   {
      pattern: /\bsocial democracy\b|\bsocial democrat\b/i,
      definition: '“Social democracy” generally seeks egalitarian outcomes through democratic institutions, regulation, and social provision while retaining a mixed or market economy.',
   },
   {
      pattern: /\bdemocratic socialism\b|\bdemocratic socialist\b/i,
      definition: '“Democratic socialism” refers here to democratic control or social ownership of major productive assets, distinguished from social democracy’s usual reform of capitalism.',
   },
   {
      pattern: /\bnational socialism\b|\bnazism\b/i,
      definition: '“National Socialism” means the Nazi ideology of racial hierarchy, antisemitic exclusion, ultranationalism, dictatorship, and expansion; its anti-capitalist rhetoric does not make it socialism.',
   },
   {
      pattern: /\bsocialis(?:m|t)\b/i,
      definition: '“Socialism” is a broad family of traditions that gives social, worker, or collective control over productive resources a central role.',
   },
   {
      pattern: /\bmarx(?:ism|ist)\b/i,
      definition: '“Marxism” is a family of theories centered on class relations, production, and the historical dynamics of capitalism; its political strategies vary widely.',
   },
   {
      pattern: /\banarch(?:ism|ist|o[- ]communism|o[- ]capitalism)\b/i,
      definition: '“Anarchism” subjects political authority, centralized coercion, and hierarchy to radical criticism; socialist, mutualist, individualist, and market strands disagree about property and social organization.',
   },
   {
      pattern: /\bconservat(?:ism|ive)\b/i,
      definition: '“Conservatism” is a family of traditions that gives continuity, inherited institutions, social order, and cautious change special weight.',
   },
   {
      pattern: /\breligious nationalism\b/i,
      definition: '“Religious nationalism” fuses national identity with a religious tradition; it can range from cultural identity politics to projects that give religious law or institutions formal public authority.',
   },
   {
      pattern: /\bnationalis(?:m|t)\b/i,
      definition: '“Nationalism” gives a nation or people special political importance, often emphasizing collective identity, sovereignty, or self-determination.',
   },
   {
      pattern: /\bpopulis(?:m|t)\b/i,
      definition: '“Populism” frames politics as a struggle between an ordinary people and a self-serving elite; it is usually a thin-centered style or ideology that depends on a host tradition.',
   },
   {
      pattern: /\bfascis(?:m|t)\b|\bpalingenetic ultranationalist\b/i,
      definition: '“Fascism” refers here to a revolutionary ultranationalist politics of national rebirth, mass mobilization, and authoritarian leadership—not merely any strong government.',
   },
   {
      pattern: /\btheocr(?:acy|atic)\b|\btheocrat\b/i,
      definition: '“Theocratic politics” treats religious authority or revealed law as a legitimate basis for public rule; it is not a synonym for private religious belief.',
   },
   {
      pattern: /\bpolitical islam\b|\bislamic democratic constitutionalism\b/i,
      definition: '“Political Islam” is a broad family of projects that relate public governance to Islamic principles; it includes distinct democratic, constitutional, and state-building interpretations.',
   },
   {
      pattern: /\brepublicanism\b/i,
      definition: '“Republicanism” here means the political-theory tradition of civic self-government and freedom from domination, not a contemporary party label.',
   },
   {
      pattern: /\bcommunitarian(?:ism)?\b/i,
      definition: '“Communitarianism” emphasizes the moral importance of shared practices, social membership, and community obligations alongside individual rights.',
   },
   {
      pattern: /\bworld federalism\b/i,
      definition: '“World federalism” advocates a democratic federal layer of global government and enforceable international law above nation-states.',
   },
   {
      pattern: /\binternationalism\b/i,
      definition: '“Internationalism” emphasizes cooperation, solidarity, or obligations across national boundaries; it is broader than any one form of cosmopolitanism or global government.',
   },
   {
      pattern: /\bindigenism\b/i,
      definition: '“Indigenous self-determination and sovereignty” centers Indigenous authority, land, cultural continuity, and decolonial governance without implying that Indigenous peoples share one political order.',
   },
   {
      pattern: /\bbioregionalism\b/i,
      definition: '“Bioregionalism” favors place-based political and economic organization around ecological regions, watersheds, and local stewardship rather than only inherited borders.',
   },
   {
      pattern: /\bzionis(?:m|t)\b/i,
      definition: '“Political Zionism” refers to Jewish national self-determination or statehood; its liberal, labor, religious, revisionist, and other variants should not be treated as identical.',
   },
   {
      pattern: /\bhindutva\b/i,
      definition: '“Hindutva” is a political ideology of Hindu civilizational or national identity, distinct from Hinduism as a religion and internally varied in political expression.',
   },
   {
      pattern: /\bjuche\b/i,
      definition: '“Juche” refers here to the North Korean state ideology of national autonomy and self-reliance tied to a centralized party-state and leader-centered political order.',
   },
   {
      pattern: /\baccelerationis(?:m|t)\b/i,
      definition: '“Accelerationism” is a family of views that seek to intensify capitalism, technology, or modernity to provoke a deeper transformation; left, right, and technology-centered variants differ sharply.',
   },
   {
      pattern: /\btranshumanism\b/i,
      definition: '“Transhumanism” is a broad family of arguments about using technology to extend or alter human capacities, with major disagreements over safety, access, governance, and desirability.',
   },
   {
      pattern: /\bsingularitarianism\b/i,
      definition: '“Singularitarianism” focuses on the possibility of a technological singularity and on accelerating or safely managing advanced artificial intelligence and human enhancement.',
   },
   {
      pattern: /\bdataism\b/i,
      definition: '“Dataism” is an emerging techno-philosophical term that treats data processing and information flows as a central lens for knowledge, value, and governance.',
   },
   {
      pattern: /\bcyberocrat(?:ic|y)\b/i,
      definition: '“Cyberocratic governance” is an experimental idea of governing through information systems, electronic networks, and computational decision support rather than a settled ideology.',
   },
   {
      pattern: /\btechno[- ]anarch|\bcrypto[- ]anarch/i,
      definition: '“Techno-anarchist / crypto-anarchist” refers to emerging currents that use encryption, networks, or decentralized technology to resist centralized control.',
   },
   {
      pattern: /\bcorporatism\b/i,
      definition: '“Corporatism” organizes representation through recognized occupational or sectoral bodies; it is distinct from ordinary corporate ownership and has democratic and authoritarian variants.',
   },
   {
      pattern: /\bradical centrism\b/i,
      definition: '“Radical centrism” is a broad, contested style of pragmatic cross-ideological problem-solving rather than one fixed policy doctrine.',
   },
   {
      pattern: /\bintegralism\b/i,
      definition: '“Integralism” refers here to a political order subordinated to an authoritative religious moral framework, especially Catholic integralism—not generic religious conservatism.',
   },
   {
      pattern: /\bgeorg(?:ism|ian)|\bgeo[- ]?libertarian/i,
      definition: '“Georgism” distinguishes private use of labor-created improvements from common claims on land value, typically favoring land-value taxation.',
   },
]

const DIRECT_TERM_DEFINITIONS_BY_LABEL_ID: Readonly<Record<string, readonly string[]>> = {
   'national-socialism': [
      '“National Socialism” means the Nazi ideology of racial hierarchy, antisemitic exclusion, ultranationalism, dictatorship, and expansion; its anti-capitalist rhetoric does not make it socialism.',
   ],
   minarchist: [
      '“Minarchism” supports a minimal state limited mainly to protecting rights through courts, policing, and defense.',
   ],
   'degrowth-green': [
      '“Degrowth” argues that wealthy economies should deliberately reduce material and energy throughput while organizing for sufficiency and well-being rather than growth as an end in itself.',
   ],
   'absolute-monarchist': [
      '“Absolute monarchy” places supreme governing authority in a hereditary monarch with few effective constitutional limits.',
   ],
   neoreactionary: [
      '“Neoreaction” is an anti-democratic current that favors concentrated sovereign authority, often using corporate governance and competitive exit as political analogies.',
   ],
   distributism: [
      '“Distributism” favors widely dispersed ownership of productive property, especially among families, small firms, cooperatives, and local associations.',
   ],
   'deep-ecology': [
      '“Deep ecology” gives nonhuman life and ecological systems value independent of their usefulness to people and calls for far-reaching social change around that view.',
   ],
   paleolibertarianism: [
      '“Paleolibertarianism” combines radical economic and political libertarianism with culturally traditionalist or paleoconservative commitments.',
   ],
   objectivism: [
      '“Objectivism” is Ayn Rand’s philosophy of reason, rational self-interest, individual rights, and laissez-faire capitalism.',
   ],
   'radical-democracy': [
      '“Radical democracy” seeks to extend democratic participation and contestation beyond periodic elections into institutions where power is concentrated.',
   ],
   'eco-authoritarianism': [
      '“Eco-authoritarianism” gives a powerful centralized authority broad latitude to impose ecological goals, including over ordinary democratic or individual constraints.',
   ],
   'democratic-confederalism': [
      '“Democratic confederalism” organizes self-government through linked local assemblies and councils, emphasizing pluralism, ecology, and gender equality without a centralized nation-state.',
   ],
   'libertarian-municipalism': [
      '“Libertarian municipalism” proposes directly democratic local assemblies joined in confederation as an alternative to centralized state rule.',
   ],
   regionalism: [
      '“Regionalism” gives a subnational region’s identity, interests, or self-government special political importance within or across existing states.',
   ],
   corporatism: [
      '“State corporatism” organizes recognized occupational or sectoral bodies under strong state direction, distinct from democratic societal or neo-corporatist bargaining.',
   ],
   'islamic-democracy': [
      '“Islamic democratic constitutionalism” combines electoral government, constitutional limits, and public accountability with an Islamic ethical or legal framework.',
   ],
   ethnonationalist: [
      '“Ethnonationalism” defines the nation primarily through shared ancestry, ethnicity, or inherited culture rather than equal civic membership alone.',
   ],
   ordoliberalism: [
      '“Ordoliberalism” favors a strong legal and institutional framework that preserves competition and constrains both private monopoly and discretionary economic power.',
   ],
   'council-communist': [
      '“Council communism” is a left-communist tradition that treats democratically organized workers’ councils, rather than parliament or a vanguard party, as the organs of workers’ political power and control of production.',
   ],
   syndicalist: [
      '“Revolutionary syndicalism” treats worker-run unions and direct action, especially strikes, as both the means of overcoming capitalism and the institutional basis for workers’ control afterward.',
   ],
   'anarcho-syndicalism': [
      '“Anarcho-syndicalism” joins anarchism’s anti-state aims to syndicalist labor organization, using federated unions and direct action to abolish capitalism and the state and establish workers’ self-management.',
   ],
   platformism: [
      '“Platformism” is an anarchist-communist organizational tendency, originating in the 1926 Organisational Platform, that emphasizes theoretical and tactical unity, collective responsibility, and federalism.',
   ],
   mutualist: [
      '“Mutualism” is a Proudhonian anarchist tradition centered on reciprocity, cooperative exchange, and mutual credit as alternatives to both capitalist privilege and state administration.',
   ],
   agorist: [
      '“Agorism” is Samuel Edward Konkin III’s market-anarchist strategy of building a counter-economy through voluntary exchange outside state licensing and taxation rather than pursuing electoral power.',
   ],
   'welfare-chauvinism': [
      '“Welfare chauvinism” supports social provision for a national or ethnic in-group while restricting immigrants’ or other out-groups’ access to benefits and services.',
   ],
   participism: [
      '“Participism” refers here to participatory economics: social ownership, democratic worker and consumer councils, balanced job complexes, and decentralized participatory planning instead of markets or central planning.',
   ],
   panarchism: [
      '“Panarchism” is a niche theory of voluntary, nonterritorial government in which multiple governments coexist and people choose among them without changing physical residence.',
   ],
   'liquid-democracy': [
      '“Liquid democracy” is delegable proxy voting: a person may vote directly or delegate a vote to someone who may pass that delegation onward.',
   ],
   ecomodernist: [
      '“Ecomodernism” argues that technological change and capable institutions can decouple human development from environmental harm while leaving more room for nature.',
   ],
   ecosocialist: [
      '“Ecosocialism” combines ecological politics with anti-capitalist socialist transformation, seeking social control of production oriented toward human need and ecological limits rather than profit and growth.',
   ],
   geolibertarian: [
      '“Georgist libertarianism” combines libertarian self-ownership and voluntary exchange with an equal claim to the value of land and natural opportunities, generally using land-value charges to compensate those excluded.',
   ],
   'anarcho-capitalist': [
      '“Anarcho-capitalism” is a right-libertarian doctrine that would replace the state with private property, voluntary contract, and competing providers of law, protection, and arbitration; its status as a form of anarchism is disputed.',
   ],
   'anarcho-communist': [
      '“Anarcho-communism” seeks a stateless, classless order based on common control of productive resources, free association, and distribution according to need; unlike anarcho-capitalism, it rejects capitalist property and wage labor.',
   ],
   'bleeding-heart-libertarianism': [
      '“Bleeding-heart libertarianism,” also called neoclassical liberalism by some academic proponents, combines civil liberties and market institutions with explicit concern for social justice and the interests of the least advantaged.',
   ],
   'national-bolshevism': [
      '“National Bolshevism” names historically varied attempts to combine radical nationalism with Bolshevik or revolutionary-socialist ideas; this catalog models the post-Soviet authoritarian nationalist current, not orthodox Marxism-Leninism.',
   ],
   kemalism: [
      '“Kemalism,” or “Atatürkism,” is the founding republican ideology of modern Turkey, conventionally summarized by the Six Arrows: republicanism, nationalism, populism, statism, laicism, and reformism.',
   ],
   'christian-reconstructionism': [
      '“Christian Reconstructionism” is a small Reformed Protestant theonomic movement that treats biblical law, including continuing Old Testament civil norms, as authoritative for public institutions; it is not generic Christian conservatism or Christian democracy.',
   ],
   'fourth-theory': [
      '“Fourth Political Theory” is Aleksandr Dugin’s anti-liberal project claiming to move beyond liberalism, communism, and fascism toward civilizational pluralism, traditionalism, and multipolarity; it is not a settled academic ideology, and its claimed break with fascism is disputed.',
   ],
   'revolutionary-collectivist': [
      '“Revolutionary State Socialist” is a catalog umbrella for socialist strategies that seek a revolutionary break and use centralized public ownership or state power as the main transition mechanism; it is not one historical school or a synonym for every revolutionary socialist.',
   ],
   'marxist-leninist': [
      '“Marxism-Leninism” is the Soviet tradition codified under Stalin around a disciplined vanguard party, centralized revolutionary state power, and planned social ownership during a transition toward communism; later national variants did not form one uniform practice.',
   ],
   'libertarian-socialism': [
      '“Libertarian socialism” is a broad anti-capitalist and anti-authoritarian family favoring worker self-management, federation, and social ownership without a centralized party-state; it is distinct from right-libertarian market doctrines.',
   ],
   maoism: [
      '“Maoism” is a Marxist-Leninist tradition emphasizing the mass line, peasant mobilization, protracted people’s war, and continuing revolution against bureaucratic or capitalist restoration.',
   ],
   trotskyism: [
      '“Trotskyism” is a Marxist revolutionary tradition centered on permanent and international revolution, opposition to “socialism in one country,” and criticism of Soviet bureaucratic degeneration.',
   ],
   'guild-socialism': [
      '“Guild socialism” is an early twentieth-century British tradition proposing public ownership with democratic worker guilds administering industries and representing producers, rather than direct state bureaucracy or private capital.',
   ],
   'christian-socialism': [
      '“Christian socialism” is a diverse family applying Christian teachings about solidarity, justice, and obligations to poor and working people to the problems of industrial capitalism; its currents disagree over markets, ownership, state action, and reform strategy.',
   ],
   'utopian-socialism': [
      '“Utopian socialism” is a retrospective label most often grouping the distinct projects of Saint-Simon, Fourier, Owen, and their followers; it is not one doctrine, and the term reflects a later Marxist classification.',
   ],
   neoconservative: [
      '“Neoconservatism” here means the modern U.S. current that grew from Cold War liberal and anti-communist circles and later emphasized American or allied power, democracy promotion, and a willingness to use military force; it is not simply any hawkish conservatism or a synonym for Leo Strauss’s philosophy.',
   ],
   paleoconservatism: [
      '“Paleoconservatism” is a U.S. current named in the 1980s to revive parts of the Old Right against neoconservatism and neoliberalism, combining cultural traditionalism and nationalism with localism, immigration restriction, and a generally non-interventionist foreign policy.',
   ],
   'one-nation-conservatism': [
      '“One-Nation Conservatism” is a British paternalist tradition that accepts limited welfare provision and state intervention to preserve social cohesion, security, and opportunity without pursuing egalitarian socialism.',
   ],
   'fiscal-conservatism': [
      '“Fiscal conservatism” is a thin budget-policy orientation concerned with deficits, debt, and sustainable public finances; it can support different combinations of spending restraint, taxes, and fiscal rules and does not determine social or foreign policy.',
   ],
   'social-conservatism': [
      '“Social conservatism” centers the preservation of inherited moral norms and institutions such as family, religion, and community; it does not by itself determine economic, fiscal, or foreign policy.',
   ],
   'national-conservatism': [
      '“National conservatism” prioritizes national sovereignty, cultural continuity, traditional institutions, and the nation-state over cosmopolitan or supranational authority; contemporary currents vary over markets, welfare, democracy, and foreign policy.',
   ],
   'conservative-liberalism': [
      'In this catalog, “Conservative Liberalism” is the liberal-family synthesis: individual rights, rule of law, private property, and markets tempered by conservative prudence and respect for inherited institutions. The name is historically variable and overlaps with “liberal conservatism.”',
   ],
   'liberal-conservatism': [
      'In this catalog, “Liberal Conservatism” is the conservative-family synthesis: social continuity and cautious reform combined with liberal constitutionalism, civil liberty, and a market economy. The name is historically variable and overlaps with “conservative liberalism.”',
   ],
}

const DIRECT_ONLY_TERM_DEFINITION_LABEL_IDS = new Set([
   'national-socialism',
   'corporatism',
   'islamic-democracy',
   'council-communist',
   'syndicalist',
   'anarcho-syndicalism',
   'platformism',
   'mutualist',
   'agorist',
   'welfare-chauvinism',
   'participism',
   'panarchism',
   'liquid-democracy',
   'ecomodernist',
   'ecosocialist',
   'geolibertarian',
   'anarcho-capitalist',
   'anarcho-communist',
   'bleeding-heart-libertarianism',
   'national-bolshevism',
   'kemalism',
   'christian-reconstructionism',
   'fourth-theory',
   'revolutionary-collectivist',
   'marxist-leninist',
   'libertarian-socialism',
   'maoism',
   'trotskyism',
   'guild-socialism',
   'christian-socialism',
   'utopian-socialism',
   'neoconservative',
   'paleoconservatism',
   'one-nation-conservatism',
   'fiscal-conservatism',
   'social-conservatism',
   'national-conservatism',
   'conservative-liberalism',
   'liberal-conservatism',
])

/**
 * Layer-specific editorial summaries for labels whose general influence notes
 * otherwise conflate values, empirical expectations, and practical strategy.
 */
export const CURATED_IDEOLOGY_LAYER_SUMMARIES: Readonly<Record<string, Partial<Record<Layer, string>>>> = {
   ecomodernist: {
      normative: 'Values human flourishing and ecological protection as compatible goals rather than treating prosperity and ecological integrity as inherently opposed.',
      prescriptive: 'Favors technological innovation, resource-efficient infrastructure, conservation, and active public institutions to reduce ecological harm while supporting human development.',
   },
   'anarcho-capitalist': {
      prescriptive: 'Favors replacing compulsory public provision with voluntary contract and competitive private provision of law, protection, and arbitration.',
   },
   geolibertarian: {
      normative: 'Combines self-ownership and voluntary exchange with an equal claim to the value of land and natural opportunities.',
      prescriptive: 'Favors secure private use of land while collecting land or resource rent for public revenue or equal compensation, usually through a land-value tax.',
   },
   'anarcho-communist': {
      prescriptive: 'Favors stateless federations of freely associated communities, common control of productive resources, and distribution according to need rather than markets or centralized state planning.',
   },
   'bleeding-heart-libertarianism': {
      normative: 'Treats individual liberty and social justice, especially effects on disadvantaged people, as joint standards for assessing institutions.',
   },
   kemalism: {
      prescriptive: 'Favors the Six Arrows program of republicanism, nationalism, populism, statism, laicism, and continuing reform or revolutionism.',
   },
   'christian-reconstructionism': {
      prescriptive: 'Favors reconstructing civil institutions under theonomic biblical law rather than maintaining a religiously neutral legal order.',
   },
   'market-socialist': {
      descriptive: 'Expects market pricing and competition to retain coordinating value under social or cooperative ownership.',
   },
   'christian-democrat': {
      prescriptive: 'Favors subsidiarity, social-market institutions, welfare and labor protections, and support for family and civil-society institutions within democratic constitutionalism.',
   },
   republicanism: {
      prescriptive: 'Favors civic self-government, rule of law, accountable institutions, and effective checks on arbitrary power.',
   },
   distributism: {
      prescriptive: 'Favors dispersing productive property among families, small firms, guilds, cooperatives, and local associations rather than concentrating it in corporations or the state.',
   },
   mutualist: {
      prescriptive: 'Favors mutual credit, cooperative exchange, possession or use-based claims, and federated voluntary institutions instead of state administration or concentrated capitalist ownership.',
   },
   ecosocialist: {
      prescriptive: 'Favors social ownership and democratic planning of production around human need, equality, and ecological limits rather than profit or growth as ends in themselves.',
   },
   'world-federalism': {
      prescriptive: 'Favors a democratic federal layer of world government and enforceable international law above nation-states.',
   },
   'radical-democracy': {
      prescriptive: 'Favors expanding participation and redesigning institutions so concentrated political and economic power remains contestable beyond periodic elections.',
   },
   'christian-socialism': {
      prescriptive: 'Favors some combination of cooperative organization, labor protection, social provision, regulation, or social ownership to subordinate economic power to solidarity and the needs of poor and working people; currents disagree over ownership and strategy.',
   },
   'revolutionary-collectivist': {
      prescriptive: 'Favors a revolutionary break with capitalist property relations and centralized public ownership or state power as the main transition mechanism.',
   },
   'marxist-leninist': {
      prescriptive: 'Favors a disciplined vanguard party taking state power, abolishing private control of major productive assets, and directing a planned transition toward communism.',
   },
   'libertarian-socialism': {
      prescriptive: 'Favors worker self-management, social ownership, and federated institutions without a centralized party-state; traditions vary over markets and the balance between reform and direct action.',
   },
   maoism: {
      prescriptive: 'Favors mass-line organizing, peasant or peripheral mobilization, protracted revolutionary struggle, and continuing campaigns against bureaucratic or capitalist restoration.',
   },
   trotskyism: {
      prescriptive: 'Favors permanent international revolution led by a revolutionary party, opposing both reformist gradualism and an isolated bureaucratic socialism in one country.',
   },
   'guild-socialism': {
      prescriptive: 'Favors public ownership of industry combined with democratic worker guilds that administer production and represent producers alongside political institutions representing citizens.',
   },
   'utopian-socialism': {
      prescriptive: 'Historically favored moral persuasion, model communities, cooperative experiments, or rational industrial reorganization; the projects grouped under this later label differed substantially.',
   },
   neoconservative: {
      normative: 'Defends liberal-democratic institutions against totalitarian or authoritarian threats while often rejecting moral relativism; adherents have differed substantially over domestic policy.',
      prescriptive: 'Favors an assertive U.S. or allied international role using alliances, pressure, and sometimes military force to defend strategic interests and promote liberal-democratic institutions abroad.',
   },
   paleoconservatism: {
      prescriptive: 'Generally favors local or national control, immigration restriction, economic nationalism or skepticism toward free trade, and a less interventionist foreign policy than neoconservatism.',
   },
   'one-nation-conservatism': {
      prescriptive: 'Accepts cost-conscious welfare provision and moderate state intervention to preserve social cohesion, security, and opportunity within existing institutions rather than pursue egalitarian transformation.',
   },
   'fiscal-conservatism': {
      prescriptive: 'Prioritizes sustainable public finances and restraint of deficits or debt; possible means include spending limits, revenue changes, or fiscal rules, so the label does not prescribe one tax level or social program.',
   },
   'social-conservatism': {
      normative: 'Gives inherited moral norms and institutions such as family, religion, and community special weight in sustaining social order and human flourishing.',
      prescriptive: 'Favors preserving or reinforcing traditional social institutions through law, public policy, or civil society; positions on markets, welfare, and foreign policy remain separate questions.',
   },
   'national-conservatism': {
      normative: 'Gives national sovereignty, cultural continuity, and inherited institutions priority over cosmopolitan or supranational commitments.',
      prescriptive: 'Favors strengthening the nation-state and protecting national institutions or culture; contemporary currents vary over economic intervention, welfare provision, democracy, and external power.',
   },
   'conservative-liberalism': {
      normative: 'Combines liberal rights, rule of law, and private property with conservative prudence, social continuity, and respect for inherited institutions.',
      prescriptive: 'Favors a constitutional market order and gradual reform that preserves the legal and social institutions on which liberty is understood to depend.',
   },
   'liberal-conservatism': {
      normative: 'Combines conservative concern for continuity and social order with liberal commitments to constitutional government and civil liberty.',
      prescriptive: 'Favors cautious reform, a market economy, limited constitutional government, and preservation of established institutions rather than either reaction or radical reconstruction.',
   },
   'green-capitalism': {
      normative: 'Values ecological protection alongside human prosperity and continued material development.',
      prescriptive: 'Favors carbon pricing, renewable-energy markets, eco-labeling, and corporate sustainability as mechanisms of ecological transition.',
   },
   corporatism: {
      prescriptive: 'Favors organizing recognized occupational and sectoral bodies under strong state direction to mediate represented interests.',
   },
   'liberal-feminism': {
      prescriptive: 'Favors legal reform, equal rights, and equal-opportunity measures within existing liberal-democratic institutions.',
   },
   'anarcho-syndicalism': {
      descriptive: 'The catalog does not currently provide a curated empirical-belief summary for this label.',
      prescriptive: 'Favors replacing capitalism and the state with federated worker organizations, using direct action rather than electoral politics.',
   },
   platformism: {
      descriptive: 'The catalog does not currently provide a curated empirical-belief summary for this label.',
      prescriptive: 'Favors a unified but decentralized anarchist organization with collective responsibility and tactical coordination.',
   },
   georgism: {
      normative: 'Distinguishes value created through labor and improvements from land or resource rent, treating the latter as subject to common claims.',
      prescriptive: 'Generally favors public capture of land or resource rent through land-value taxation.',
   },
   'bright-green-environmentalism': {
      normative: 'Values ecological protection alongside human prosperity and accepts technology-intensive routes to both.',
      descriptive: 'Expects technology, urbanization, and sometimes markets to reduce ecological harm without ending prosperity.',
   },
   'national-socialism': {
      normative: 'Treats racial hierarchy, antisemitic exclusion, ultranationalism, and totalizing racial-national authority as foundational commitments.',
   },
   'technocratic-centralist': {
      descriptive: 'Assumes centralized expert administration has high capacity and that markets and electoral majorities are comparatively unreliable.',
   },
   theocrat: {
      prescriptive: 'Favors civil law and public authority derived from and enforcing religious doctrine.',
   },
   'libertarian-municipalism': {
      prescriptive: 'Favors directly democratic local assemblies joined in confederation instead of centralized state rule.',
   },
}

function layerPhilosophies(label: IdeologyLabel, layer: Layer): string[] {
   if (layer === 'normative') return label.normativePhilosophies ?? []
   if (layer === 'descriptive') return label.descriptivePhilosophies ?? []
   return label.prescriptivePhilosophies ?? []
}

/**
 * Explains how a single label is read in each layer without pretending its
 * one name is a complete description of the respondent's whole politics.
 */
export function getIdeologyLayerSummary(label: IdeologyLabel, axes: Axis[], layer: Layer): string {
   const curatedSummary = CURATED_IDEOLOGY_LAYER_SUMMARIES[label.id]?.[layer]
   if (curatedSummary) return `${LAYER_EXPLAINERS[layer].description} ${curatedSummary}`

   const layerAxisIds = new Set(axes.filter((axis) => axis.layer === layer).map((axis) => axis.id))
   const philosophyNames = layerPhilosophies(label, layer)
   const philosophyNameSet = new Set(philosophyNames)
   const relevantInfluences = (label.philosophyInfluences ?? [])
      .filter((influence) => philosophyNameSet.has(influence.philosophy))
      .filter((influence) => influence.affectedAxes.some((axisId) => layerAxisIds.has(axisId)))
      .map((influence) => influence.description.trim())
      .filter((description, index, descriptions) => descriptions.indexOf(description) === index)
      .slice(0, 2)

   if (relevantInfluences.length > 0) {
      return `${LAYER_EXPLAINERS[layer].description} ${relevantInfluences.join(' ')}`
   }

   if (philosophyNames.length > 0) {
      return `${LAYER_EXPLAINERS[layer].description} Related traditions include ${philosophyNames.slice(0, 3).join(', ')}. The catalog does not currently provide a more specific curated summary for this label in this layer.`
   }

   return `${LAYER_EXPLAINERS[layer].description} The catalog does not currently provide a curated summary for this label in this layer.`
}

export function getIdeologyTermDefinitions(label: IdeologyLabel, limit = 2): string[] {
   const directDefinitions = [...(DIRECT_TERM_DEFINITIONS_BY_LABEL_ID[label.id] ?? [])]
   if (DIRECT_ONLY_TERM_DEFINITION_LABEL_IDS.has(label.id)) return directDefinitions.slice(0, limit)

   const identityText = [
      label.name,
      ...(label.aliases ?? []),
   ].join(' ')
   const definitions: string[] = directDefinitions

   for (const { pattern, definition } of IDEOLOGY_TERM_DEFINITIONS) {
      if (!pattern.test(identityText) || definitions.includes(definition)) continue
      definitions.push(definition)
      if (definitions.length >= limit) return definitions
   }

   return definitions.slice(0, limit)
}
