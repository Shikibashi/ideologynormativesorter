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
   'national-traditionalist': [
      '“National Traditionalism” is a conservative orientation that gives national continuity, inherited institutions, social order, and cultural tradition priority while remaining distinct from ethnonationalism and fascist ultranationalism; it does not by itself specify one economic program or reject all democratic institutions.',
   ],
   'fascist-authoritarian': [
      '“Fascist / Palingenetic Ultranationalist” names fascism in this catalog’s narrow sense: revolutionary ultranationalism promising national rebirth through authoritarian mass mobilization, hierarchy, anti-liberal politics, and coercive state power; it is not generic authoritarianism or ordinary conservatism.',
   ],
   'eco-fascism': [
      '“Eco-Fascism” combines fascist or exclusionary ultranationalism with ecological politics, treating ecological preservation as tied to demographic control, ethnic or national homogeneity, or coercive state power; strong environmental regulation or environmental concern alone is not eco-fascism.',
   ],
   strasserism: [
      '“Strasserite Fascism” is a radical fascist current associated with the Strasser brothers and the Nazi movement, combining palingenetic ultranationalism and authoritarian mass mobilization with anti-capitalist or anti-finance rhetoric; that rhetoric does not make it socialism or generic market socialism.',
   ],
   'christian-democrat': [
      '“Christian Democracy” combines Christian social thought with democratic constitutionalism, subsidiarity, solidarity, social-market economics, and family or civil-society institutions; it is not equivalent to theocracy or a single church-state model.',
   ],
   theocrat: [
      '“Theocratic Politics” makes religious authority or revealed law the ultimate source of civil legitimacy and public law; it is a form of political ordering, not merely personal faith or every religiously inspired democratic movement.',
   ],
   integralism: [
      '“Integralism” here means Catholic integralism: a tradition that subordinates public order to a Catholic conception of the common good and divine moral authority, rejecting liberal church-state separation; it is distinct from Christian democracy and not synonymous with every clerical-fascist movement.',
   ],
   'fundamentalist-theocracy': [
      '“Fundamentalist Theocracy” combines theocratic rule with a fundamentalist claim that a strict or literal authoritative interpretation of sacred texts should govern public institutions, narrowing religious pluralism and secular alternatives; it is more specific than theocracy and not a synonym for religious conservatism.',
   ],
   'democratic-socialist': [
      '“Democratic Socialism” seeks democratic control or social ownership of major productive assets through democratic institutions and movements, aiming to transform capitalist ownership rather than merely regulate a mixed economy; this catalog keeps its stronger ownership distinction from social democracy explicit.',
   ],
   'market-socialist': [
      '“Market Socialism” combines social, public, or worker-cooperative ownership of productive assets with market allocation or pricing; it differs from both private-capitalist ownership and command planning, and models vary over firm governance and the public role.',
   ],
   'socialist-feminism': [
      '“Socialist and Marxist Feminist Traditions” analyze gender domination together with capitalism, class, labor, property, and social reproduction; this combined catalog label covers overlapping traditions without claiming they are identical or that economic change alone resolves patriarchy.',
   ],
   juche: [
      '“Juche” is the DPRK/Kimist state ideology of political independence, economic self-reliance, and military self-defense, organized around a centralized party-state and supreme-leader sovereignty; it is a specific national state ideology, not generic socialism or a general philosophy of personal self-reliance.',
   ],
   'egalitarian-statist': [
      '“State-Capacity Egalitarian” is a social-democratic orientation that treats capable, accountable public institutions and social provision as means to reduce durable material inequalities; it is distinct from authoritarian state socialism and from generic egalitarianism without a state-capacity commitment.',
   ],
   'social-democrat': [
      '“Social Democrat” supports democratic collective action to pursue freedom and equality through a mixed economy, welfare provision, labor rights, progressive taxation, and gradual reform; it does not by itself require abolishing capitalism or adopting one socialist ownership model.',
   ],
   'universal-basic-income': [
      '“Universal Basic Income Advocacy” supports a periodic cash payment delivered individually and unconditionally to all, without a means test or work requirement; proposals vary over payment level, funding, eligibility, interaction with services, and whether other benefits remain.',
   ],
   'social-investment-state': [
      '“Social Investment State” reorients welfare policy toward building and maintaining human capabilities across the life course through education, childcare, training, employment support, and protective buffers; it is not a synonym for passive income maintenance or market deregulation.',
   ],
   'right-wing-populism': [
      '“Right-Wing Populism” combines populism’s moralized people-versus-elite antagonism and popular sovereignty with a right-leaning host such as nationalism, nativism, traditionalism, or market conservatism; it is not a synonym for all conservatism or anti-elite rhetoric.',
   ],
   'left-wing-populism': [
      '“Left-Wing Populism” combines the people-versus-elite and popular-sovereignty frame with egalitarian, socialist, redistributive, or anti-oligarchic commitments; it is distinct from social democracy, socialism, and generic anti-elite rhetoric.',
   ],
   'agrarian-populism': [
      '“Agrarian Populism” is a populist current organized around rural producers or “people of the land,” framing urban, financial, corporate, or state elites as exploiting them; agrarian populist movements can be progressive, conservative, socialist, or pro-market.',
   ],
   'cultural-populism': [
      '“Cultural Populism” is a catalog term for populist politics that defines the people and the elite through cultural identity, often presenting ordinary or traditional communities against distant, cosmopolitan, or institutionally powerful elites; it is not identical to right-wing populism or every defense of tradition.',
   ],
   'market-liberal': [
      '“Market Liberal” is a market-oriented liberal position centered on private property, individual rights, competitive exchange, rule of law, and limited but constitutional government; it is distinct from social liberalism’s stronger emphasis on public capability provision and from neoliberalism’s market-governance usage.',
   ],
   'decentralist-market-skeptic-of-state': [
      '“Decentralist Market Liberal” is a market-liberal position that treats concentrated state power as a central danger and favors decentralized exchange, voluntary association, and exit; it is distinct from socialist anarchism and left-wing market anarchism rather than a synonym for any anti-state politics.',
   ],
   'civil-libertarian-cosmopolitan': [
      '“Civil-Libertarian Cosmopolitanism” combines strong civil-libertarian skepticism of concentrated authority with cosmopolitan obligations beyond national borders; it does not by itself settle property, market, or global institutional questions.',
   ],
   'classical-liberalism': [
      '“Classical Liberalism” is a broad liberal tradition centered on individual liberty, private property, freedom of contract, rule of law, and constitutionally limited government; historical versions vary over welfare, democracy, and the state’s economic role, so it is not identical to contemporary libertarianism.',
   ],
   neoliberalism: [
      '“Market-Governance Liberalism” is this catalog’s narrower use of “neoliberalism”: a market-oriented liberal approach that governs capitalism through competition, privatization or outsourcing, expert institutions, and international rules; the broader term remains historically contested and often polemical.',
   ],
   'social-liberalism': [
      '“Social Liberalism” combines individual rights and equal citizenship with public action to secure capabilities, opportunity, and protection from severe deprivation; it does not imply socialism or one fixed level of welfare or state ownership.',
   ],
   progressivism: [
      '“Progressivism” is a broad and historically changing reform tradition that seeks deliberate social improvement through empirical inquiry, institutional experimentation, public policy, and sometimes participatory movements; it is not synonymous with technocracy or one contemporary policy platform.',
   ],
   'liberal-feminism': [
      '“Liberal Feminism” seeks gender equality through individual autonomy, equal rights, legal reform, and equal opportunity within liberal-democratic institutions; it is distinct from feminist traditions that center capitalist property, social reproduction, or patriarchy as structures requiring broader transformation.',
   ],
   georgism: [
      '“Georgism” distinguishes privately created improvements from the socially generated value of land and natural opportunities, generally favoring public capture of land or resource rent through land-value taxation; the historic single tax is one formulation, not the whole tradition.',
   ],
   internationalism: [
      '“Internationalism” emphasizes cooperation and obligations across national boundaries through international institutions, transnational solidarity, or universal rights; it is broader than cosmopolitanism and does not require one world government.',
   ],
   'radical-centrism': [
      '“Radical Centrism” is a contested political style that rejects fixed left-right coalitions and seeks pragmatic, evidence-informed synthesis and institutional reform across the spectrum; “radical” refers to cross-cutting problem-solving, not necessarily rupture or one policy program.',
   ],
   'constitutional-monarchism': [
      '“Constitutional Monarchism” supports a hereditary monarch as head of state within constitutional rules that limit royal power; parliamentary variants make the monarch largely ceremonial, while executive constitutional monarchies retain constrained governing authority. It is a regime form, not a synonym for traditional or absolute monarchy.',
   ],
   'anti-imperialism': [
      '“Anti-Imperialism” opposes colonial rule, external domination, and unequal political dependence, generally supporting the self-determination of subordinated peoples; it is a cross-cutting orientation that can coexist with socialist, nationalist, liberal, non-aligned, or other programs.',
   ],
   'traditional-monarchist': [
      '“Traditional Monarchist” is a conservative royalist orientation that treats hereditary monarchy as historically or traditionally legitimate and often favors meaningful royal prerogative; it differs from constitutional monarchism’s limited head-of-state model and absolute monarchism’s stronger theory of indivisible sovereign power.',
   ],
   communitarianism: [
      '“Communitarianism” holds that persons’ identities and moral judgments are formed through constitutive communities, traditions, and social relations; it gives common goods and communal obligations weight alongside individual rights and is not one socialist or anti-liberal state program.',
   ],
   republicanism: [
      '“Republicanism” is a political-theory tradition centered on civic self-government and freedom as non-domination—security against arbitrary or uncontrolled power—through rule of law and accountable institutions; it is not a contemporary party label or one regime template.',
   ],
   bioregionalism: [
      '“Bioregionalism” organizes political, cultural, and economic life around ecologically defined places—often watersheds and connected human-environment relationships—rather than only inherited state borders; it is a place-based environmental philosophy, not simple localism or one economic model.',
   ],
   'political-islam': [
      '“Political Islam” is a broad, contested family of movements and projects that makes Islamic principles a reference for public authority, law, or political identity; it includes democratic, constitutional, electoral, activist, state-building, and violent currents and is not synonymous with Islam, Muslim civic participation, or one model of Sharia.',
   ],
   'world-federalism': [
      '“World Federalism” advocates a democratic federal layer of global government with shared authority between world institutions and nations; it is stronger than international cooperation alone but does not require abolishing national governments or choosing one economic system.',
   ],
   multiculturalism: [
      '“Multiculturalism” is a family of normative views that rejects forced assimilation and supports recognition, accommodation, or group-differentiated rights for distinct cultural, ethnic, national, or religious communities within a shared political order; it is not simply the demographic fact of diversity and variants disagree over liberal limits and common citizenship.',
   ],
   'technocratic-centralist': [
      '“Technocratic Centralism” gives centralized expert administration, scientific or technical knowledge, and state capacity priority over markets and ordinary electoral judgment; it is stronger than using experts within democratic institutions and does not determine one economic policy.',
   ],
   transhumanism: [
      '“Transhumanism” is a family of philosophical and movement views that support using science and technology to expand human health, longevity, cognition, or other capacities beyond current biological limits; variants disagree over safety, access, equality, governance, and whether enhancement should be pursued. It is not simply any enthusiasm for technology and is distinct from posthumanism, although some currents overlap.',
   ],
   cyberocracy: [
      '“Cyberocracy” is a speculative theory of governance in which electronic information and communications infrastructures, networks, and computational systems reshape or potentially supersede bureaucracy; possible forms range from democratic to authoritarian or hybrid, so it is not synonymous with digital democracy or algorithmic governance.',
   ],
   accelerationism: [
      '“Accelerationism” is a contested family of views that treats intensifying capitalism, technology, or modernity as a route to systemic transformation; left, right, and technology-centered variants have sharply different ends and strategies, so it is not simply faster policy or generic radicalism.',
   ],
   dataism: [
      '“Dataism” is an emerging, contested techno-philosophical term that treats data generation, processing, and flows as central to knowledge, value, and governance; it is not a settled political movement or a claim that data are automatically neutral or objective.',
   ],
   singularitarianism: [
      '“Singularitarianism” is a futurist current centered on the possibility of a technological singularity—rapid, potentially transformative artificial-intelligence progress—and on accelerating, preparing for, or safely managing that possibility; it is not a synonym for all AI optimism or transhumanism.',
   ],
   'bright-green-environmentalism': [
      '“Bright Green Environmentalism” is a technology- and design-optimist environmental current that seeks ecological protection through innovation, clean infrastructure, urban design, and social or market transformation while retaining human prosperity; it is broader than ecomodernism and not identical to green capitalism.',
   ],
   'green-capitalism': [
      '“Green Capitalism” is a family of views that seeks ecological protection through capitalist market institutions, private investment, pricing, innovation, and corporate activity; it treats capitalism as a vehicle for ecological transition rather than requiring its abolition, though critics dispute whether growth and profit incentives can resolve ecological crisis.',
   ],
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
   'civic-nationalist': [
      '“Civic nationalism” defines national membership primarily through shared citizenship, political institutions, and commitment to a common public culture rather than inherited ancestry; in practice civic and cultural identities can overlap, and the label does not guarantee liberal democracy or equal inclusion.',
   ],
   indigenism: [
      '“Indigenous self-determination and sovereignty” centers Indigenous peoples’ authority to govern their affairs, maintain land relationships, cultures, languages, and institutions, and pursue decolonial self-determined development; it is a broad catalog heading, not one uniform political program or a synonym for state-led indigenismo.',
   ],
   hindutva: [
      '“Hindutva” is a Hindu-nationalist political ideology that presents India as a Hindu nation or civilizational community; it is not the same as Hinduism as a religion, and its interpretations vary over citizenship, minorities, secularism, and state power.',
   ],
   'religious-nationalism': [
      '“Religious nationalism” fuses national identity or sovereignty with a religious tradition, treating that tradition as central to public belonging or authority; variants range from cultural identity projects to movements seeking religiously informed law, so it is not one religion or single regime.',
   ],
   zionism: [
      '“Political Zionism” is a diverse Jewish national movement seeking Jewish national self-determination through a national home or state in the Land of Israel; its liberal, socialist, religious, revisionist, and other currents disagree over borders, institutions, religion, and relations with Palestinians, so it is not a synonym for any one government or policy.',
   ],
   'left-wing-nationalism': [
      '“Left-wing nationalism” combines national self-determination or popular sovereignty with egalitarian, anti-colonial, socialist, or redistributive commitments; it is a diverse family that can conflict with both cosmopolitan internationalism and exclusionary chauvinism.',
   ],
   'expansionist-nationalism': [
      '“Expansionist nationalism” makes territorial enlargement, imperial influence, or irredentist claims part of national power and political purpose; it is distinct from nationalism in general and from realism as an explanatory theory, though movements may invoke security or civilizing rationales.',
   ],
   'separatist-nationalism': [
      '“Separatist nationalism” seeks self-government for a national or regional community through autonomy, federal reorganization, or independence; self-determination does not by itself settle whether secession is justified or require ethnic exclusion or violence.',
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
   'left-wing-market-anarchism': [
      '“Left-wing market anarchism” is an anti-capitalist market-anarchist umbrella that defends exchange in freed markets while arguing that state privilege sustains corporate power and exploitation; it is not a synonym for anarcho-capitalism, and its currents disagree over property, wage labor, and rent.',
   ],
   'individualist-anarchism': [
      '“Individualist anarchism” is a historically diverse anarchist family centered on individual autonomy and voluntary association; its natural-rights, mutualist, and egoist currents disagree over morality, property, and markets, so it is not a synonym for egoist anarchism or anarcho-capitalism.',
   ],
   'anarcho-primitivism': [
      '“Anarcho-primitivism” is an anarchist critique of civilization that links domestication, specialized division of labor, industrial technology, and large-scale organization to domination and ecological harm; it is more specific than environmentalism and is not a synonym for every anti-technology view.',
   ],
   voluntaryism: [
      '“Voluntaryism” is a historical libertarian family organized around voluntary political association: Auberon Herbert retained a voluntarily funded minimal state, while later currents developed anti-state variants, so the term does not automatically mean anarchism or anarcho-capitalism.',
   ],
   stirnerism: [
      '“Egoist anarchism” refers here to the anarchist reception of Max Stirner’s radical egoism, which rejects binding fixed abstractions and allows contingent “unions of egoists”; it is not ordinary selfishness, standard ethical egoism, or one complete policy program.',
   ],
   'anarcha-feminism': [
      '“Anarcha-feminism” combines anarchist criticism of coercive hierarchy with feminist analysis of gender domination, connecting freedom in intimate, economic, and political life rather than treating access to existing authority as sufficient liberation.',
   ],
   'queer-anarchism': [
      '“Queer anarchism” brings anarchist opposition to domination into queer resistance to enforced sexual and gender norms; it is a diverse theoretical and activist current, not one required position on identity, family, or gender abolition.',
   ],
   'techno-anarchism': [
      '“Techno-anarchist / crypto-anarchist” refers here to loose currents using encryption, anonymity, peer-to-peer systems, or decentralized networks to resist surveillance, censorship, and centralized control; it is not a synonym for blockchain advocacy or a settled anarchist school.',
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
   'national-traditionalist',
   'fascist-authoritarian',
   'eco-fascism',
   'strasserism',
   'christian-democrat',
   'theocrat',
   'integralism',
   'fundamentalist-theocracy',
   'democratic-socialist',
   'market-socialist',
   'socialist-feminism',
   'juche',
   'egalitarian-statist',
   'social-democrat',
   'universal-basic-income',
   'social-investment-state',
   'right-wing-populism',
   'left-wing-populism',
   'agrarian-populism',
   'cultural-populism',
   'market-liberal',
   'decentralist-market-skeptic-of-state',
   'civil-libertarian-cosmopolitan',
   'classical-liberalism',
   'neoliberalism',
   'social-liberalism',
   'progressivism',
   'liberal-feminism',
   'georgism',
   'internationalism',
   'radical-centrism',
   'constitutional-monarchism',
   'anti-imperialism',
   'traditional-monarchist',
   'communitarianism',
   'republicanism',
   'bioregionalism',
   'political-islam',
   'world-federalism',
   'multiculturalism',
   'technocratic-centralist',
   'transhumanism',
   'cyberocracy',
   'accelerationism',
   'dataism',
   'singularitarianism',
   'bright-green-environmentalism',
   'green-capitalism',
   'national-socialism',
   'corporatism',
   'islamic-democracy',
   'council-communist',
   'syndicalist',
   'anarcho-syndicalism',
   'platformism',
   'mutualist',
   'agorist',
   'left-wing-market-anarchism',
   'individualist-anarchism',
   'anarcho-primitivism',
   'voluntaryism',
   'stirnerism',
   'anarcha-feminism',
   'queer-anarchism',
   'techno-anarchism',
   'civic-nationalist',
   'indigenism',
   'hindutva',
   'religious-nationalism',
   'zionism',
   'left-wing-nationalism',
   'expansionist-nationalism',
   'separatist-nationalism',
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
   progressivism: {
      normative: 'Treats deliberate social improvement, equal civic standing, and solving remediable social problems as legitimate public aims, with openness to revising inherited institutions.',
      descriptive: 'Expects empirical inquiry, public administration, and institutional experimentation to improve social conditions, while progressivist movements vary between expert-led and participatory approaches.',
      prescriptive: 'Favors evidence-informed institutional reform, public programs, regulation, and sometimes movement-led democratic change; it does not prescribe technocracy or one current policy bundle.',
   },
   'liberal-feminism': {
      normative: 'Treats individuals of all genders as entitled to equal rights, autonomy, legal status, and opportunity.',
      descriptive: 'Expects discriminatory law, unequal access, and gendered social expectations to restrict agency, so legal reform and institutional access can expand equality; it does not reduce gender domination to one economic cause.',
      prescriptive: 'Favors legal reform, equal rights, anti-discrimination protections, equal opportunity, autonomy, and reform of institutions within liberal-democratic constitutionalism; it does not prescribe socialist ownership or one theory of patriarchy.',
   },
   georgism: {
      normative: 'Treats people as entitled to the value created by their labor and improvements while treating socially generated land and natural-resource rent as subject to common claims.',
      descriptive: 'Expects private capture of land rent to create unearned inequality and distort access, while competitive use of land and capital can remain compatible with individual enterprise.',
      prescriptive: 'Favors public capture of land or resource rent, usually through land-value taxation, while leaving the single-tax formulation, other taxes, and service design open to variation.',
   },
   internationalism: {
      normative: 'Treats obligations, cooperation, and rights across national boundaries as politically important without denying all value to national self-government.',
      descriptive: 'Expects transnational problems and interdependence to exceed what states can manage alone and sees international institutions or solidarity as ways to coordinate responses.',
      prescriptive: 'Favors international cooperation, institutions, treaties, transnational solidarity, or universal rights; it does not require abolishing states or creating one global government.',
   },
   'radical-centrism': {
      normative: 'Treats practical problem-solving, pluralist compromise, effective institutions, and outcomes over ideological purity as political goods.',
      descriptive: 'Expects fixed left-right coalitions and doctrinal polarization to block workable solutions, while evidence, experimentation, and cross-partisan synthesis can widen the feasible policy space.',
      prescriptive: 'Favors pragmatic cross-cutting coalitions, evidence-informed reform, and institutional experimentation; the label does not identify one economic program or imply indifference to substantive values.',
   },
   'constitutional-monarchism': {
      normative: 'Treats hereditary continuity or a nonpartisan head of state as compatible with constitutional rule, lawful government, and democratic self-government; variants differ over how much independent authority the crown should retain.',
      descriptive: 'Expects constitutional rules, conventions, and elected institutions to channel royal authority, while the monarch may continue to serve as a national figurehead even when day-to-day political power is limited.',
      prescriptive: 'Favors retaining or establishing a hereditary crown bounded by constitutional rules, with parliamentary ceremonial and executive constrained-monarchy models representing different institutional choices.',
   },
   'anti-imperialism': {
      normative: 'Treats peoples as entitled to political equality, self-determination, and freedom from colonial domination, military subordination, and exploitative external control.',
      descriptive: 'Expects imperial power to reproduce unequal dependence through colonial administration, military intervention, or political and economic influence, while the mechanisms and historical targets vary across anti-imperialist traditions.',
      prescriptive: 'Favors decolonization, national or popular self-government, non-intervention, anti-colonial solidarity, and sometimes non-alignment or economic sovereignty; it does not prescribe one economic system or one strategy of resistance.',
   },
   'traditional-monarchist': {
      normative: 'Treats dynastic continuity, inherited authority, social hierarchy, and historical or religious legitimacy as important political goods, while monarchist traditions differ over divine right, nation, religion, and constitutional limits.',
      descriptive: 'Expects established institutions and hereditary succession to preserve continuity, authority, and national representation better than abstract redesign or purely electoral competition, though claims about monarchy’s effects vary.',
      prescriptive: 'Favors preserving or restoring a hereditary monarchy with a meaningful royal role and prerogative; it can support constitutional limits and does not automatically entail absolute monarchy, rejection of all representation, or one religious doctrine.',
   },
   communitarianism: {
      normative: 'Treats shared community, social membership, tradition, and common goods as morally important sources of identity and obligation alongside individual rights and autonomy.',
      descriptive: 'Expects abstract individualism and universal rules to miss how social context, inherited practices, and relationships shape judgment, identity, and the social bases of self-respect; communitarian views differ over pluralism and the reach of community.',
      prescriptive: 'Favors civic participation, institutions that sustain community and mutual obligation, and policies attentive to common goods and social relationships; it does not prescribe socialism, nationalism, or one level of state intervention.',
   },
   republicanism: {
      normative: 'Treats civic self-government, equal civic standing, rule of law, and freedom from arbitrary or uncontrolled power as central political goods.',
      descriptive: 'Expects domination to persist whenever people or groups remain dependent on uncontrolled power even without constant interference, and sees stable public rules and civic participation as ways to reduce that vulnerability.',
      prescriptive: 'Favors accountable self-government, checks on arbitrary power, civic participation, anti-corruption measures, and public institutions that keep both rulers and private actors contestable; it is compatible with multiple constitutional and economic arrangements.',
   },
   bioregionalism: {
      normative: 'Treats ecological integrity, place-based belonging, stewardship, and reciprocal human-environment relationships as important goods for political and economic life.',
      descriptive: 'Expects inherited political boundaries and centralized management to misalign with ecological processes, while local knowledge, citizen engagement, and coordination within watersheds or other bioregions can improve stewardship.',
      prescriptive: 'Favors governance, land use, and resource management organized around ecological regions, local resilience, and participatory stewardship across existing borders; it does not require isolation, one ownership system, or rejection of all larger institutions.',
   },
   'political-islam': {
      normative: 'Treats Islamic principles as relevant to public authority, law, political identity, or the common good, while movements differ over sovereignty, jurisprudence, pluralism, democracy, and the role of religious institutions.',
      descriptive: 'Expects modern political order to be interpreted or reformed through Islamic concepts, with movements adapting differently to elections, constitutionalism, authoritarian rule, social activism, and state-building; the broad label does not imply one strategy or level of coercion.',
      prescriptive: 'Favors some public role for Islamic normative or legal principles, ranging from democratic constitutional participation to comprehensive Islamist state-building; it does not settle one interpretation of Sharia, church-state separation, minority rights, or political violence.',
   },
   'national-traditionalist': {
      normative: 'Treats national continuity, inherited institutions, cultural tradition, and social order as important goods, with legitimacy grounded partly in historical belonging and established authority.',
      descriptive: 'Expects rapid redesign and abstract universalism to weaken cohesion, while national-traditionalist positions vary over democracy, markets, welfare, religion, and membership boundaries.',
      prescriptive: 'Favors protecting national institutions, inherited practices, cultural continuity, and cautious reform; it does not prescribe racial exclusion, fascist rupture, or one economic model.',
   },
   'fascist-authoritarian': {
      normative: 'Treats organic national unity, rebirth, hierarchy, discipline, and collective mobilization as superior to liberal individualism and pluralist compromise.',
      descriptive: 'Expects liberal democracy, perceived decadence, and internal enemies to block national renewal, while fascist movements use mythic rebirth, mass politics, and coercive state power.',
      prescriptive: 'Favors authoritarian mass mobilization, centralized leadership, coercive state power, and an anti-liberal national-rebirth project; economic arrangements vary and remain subordinate to political-national goals.',
   },
   'eco-fascism': {
      normative: 'Treats ecological integrity or territorial nature as valuable but subordinates universal human equality to a bounded national or ethnic community and social order.',
      descriptive: 'Expects environmental crisis to be caused or worsened by demographic mixing, outsiders, liberalism, or disorder, and presents coercive collective control as a remedy; the term is contested and used variously.',
      prescriptive: 'Favors authoritarian or exclusionary ecological measures, demographic control, territorial protection, or coercive state power in service of a national or ethnic ecology; strong regulation alone is not enough for the label.',
   },
   strasserism: {
      normative: 'Treats national rebirth, revolutionary hierarchy and discipline, and anti-finance or anti-bourgeois politics as compatible within a fascist order, subordinating individual equality to an organic national community.',
      descriptive: 'Expects liberal capitalism, finance, Marxist internationalism, and parliamentary pluralism to block national renewal, while Strasserist currents differed over economic organization and their relationship to Nazi leadership.',
      prescriptive: 'Favors fascist mass mobilization and a strong state with anti-capitalist or corporatist measures subordinate to ultranationalism; it is not democratic socialism or socialism as such.',
   },
   'christian-democrat': {
      normative: 'Treats human dignity, solidarity, family and civil society, and a layered social order as important goods while accepting constitutional democracy and limits on centralized power.',
      descriptive: 'Expects institutions between the individual and the state and decentralized authority to support social cohesion; it accepts markets but sees them as requiring moral and social correction and welfare provision.',
      prescriptive: 'Favors democratic constitutionalism, subsidiarity, social-market institutions, social provision, labor protections, and support for family and civil society; it does not prescribe direct clerical rule.',
   },
   theocrat: {
      normative: 'Treats religious authority, divine law, or revealed moral order as superior sources of public legitimacy to secular pluralist law.',
      descriptive: 'Expects secular autonomy and pluralism to permit moral disorder or violate religious truth, while models differ over whether clerics, religious law, or state institutions hold authority.',
      prescriptive: 'Favors public law and state authority derived from or enforcing religious doctrine; the label does not identify one religion or one institutional form.',
   },
   integralism: {
      normative: 'Treats Catholic truth, the common good, and ordered social authority as requiring public power to recognize and remain subordinate to divine moral order.',
      descriptive: 'Expects liberal separation and individualistic neutrality to fragment social order, while integralist movements differ over church-state arrangements and political strategy.',
      prescriptive: 'Favors Catholicly informed public law and a subordinate temporal authority rather than liberal church-state separation; clerical-fascist alliances are one historical variant, not the whole term.',
   },
   'fundamentalist-theocracy': {
      normative: 'Treats strict or literal fidelity to authoritative scripture as necessary to legitimate moral and political order and gives religious conformity priority over secular pluralism.',
      descriptive: 'Expects modern secularism, doctrinal accommodation, and reinterpretation to corrupt or weaken sacred order, while fundamentalism has distinct histories across religions.',
      prescriptive: 'Favors religious law and state institutions enforcing a strict sacred-text interpretation, limiting pluralist and secular alternatives; it is more specific than generic religious conservatism or theocracy.',
   },
   'democratic-socialist': {
      normative: 'Treats democratic control of economic power and social ownership as necessary to extend political equality into production, not merely as a supplement to a capitalist mixed economy.',
      descriptive: 'Expects private ownership of major productive assets to reproduce class power and limit democratic agency, while democratic-socialist currents differ over reform, worker ownership, public ownership, and transition.',
      prescriptive: 'Favors democratic social ownership or control of major productive assets through elections, movements, cooperatives, public institutions, or workplace democracy; it does not prescribe authoritarian one-party rule.',
   },
   'market-socialist': {
      normative: 'Treats social or worker ownership as needed to prevent private capital from dominating economic life while retaining some value in decentralized exchange and choice.',
      descriptive: 'Expects markets and prices to coordinate dispersed information even when firms or capital are socially owned, while models differ over investment, competition, surplus distribution, and planning.',
      prescriptive: 'Favors combining social, public, or cooperative ownership with market pricing or competition; it rejects both unqualified private capitalist ownership and the assumption that socialism requires command planning.',
   },
   'socialist-feminism': {
      normative: 'Treats gender liberation and the transformation of class and property relations as connected political goods, including freedom from domination in paid and unpaid reproductive labor.',
      descriptive: 'Expects capitalism, patriarchy, household organization, paid work, unpaid care, and social reproduction to interact in producing gendered dependence; socialist and Marxist feminists disagree over the relation between these structures.',
      prescriptive: 'Favors collective action against patriarchy and capitalist exploitation through changes to ownership, labor, care, reproduction, and social institutions; the combined catalog label does not prescribe one feminist strategy.',
   },
   juche: {
      normative: 'Treats political autonomy, national self-reliance, collective discipline, and the sovereignty of the Korean revolutionary state as central political goods.',
      descriptive: 'Expects foreign dependence and ideological deviation to threaten national independence, while assigning a centralized party-state and supreme leader a guiding role in mobilizing the people.',
      prescriptive: 'Favors political independence, economic self-reliance, military self-defense, centralized party leadership, and leader-centered state authority in the DPRK/Kimist model; it is not a general endorsement of personal self-sufficiency.',
   },
   'egalitarian-statist': {
      normative: 'Treats material equality and effective public provision as political goods, while regarding capable and accountable state institutions as legitimate tools for reducing durable disadvantage.',
      descriptive: 'Expects unequal outcomes to be reproduced by market and social structures and assumes public institutions can implement redistributive and universal services competently when designed and held accountable.',
      prescriptive: 'Favors progressive redistribution, broad social provision, labor protections, and investment in capable public administration; it does not prescribe authoritarian state socialism.',
   },
   'social-democrat': {
      normative: 'Treats freedom and equality as requiring democratic control over social and economic conditions shaped by capitalism, while preserving pluralist political institutions.',
      descriptive: 'Expects markets to provide useful coordination but also to produce durable inequality and worker insecurity, so democratic governments, unions, and welfare institutions can temper market outcomes.',
      prescriptive: 'Favors mixed-economy reform through elections, progressive taxation, public services, collective bargaining, and social insurance rather than revolutionary abolition of existing institutions.',
   },
   'universal-basic-income': {
      normative: 'Treats an unconditional income floor as a means of securing basic economic freedom, security, or equal standing without making subsistence depend on proving need or work.',
      descriptive: 'Expects regular individual cash transfers to reduce poverty or insecurity and simplify or complement welfare, while funding, level, labor effects, and relations to services remain contested.',
      prescriptive: 'Favors a periodic cash payment to all individuals without a means test or work requirement; proposals diverge over taxation, citizenship or residency, payment level, and whether existing benefits are retained.',
   },
   'social-investment-state': {
      normative: 'Treats capabilities across the life course and inclusive participation as social goods, making human development and resilience central to welfare policy.',
      descriptive: 'Expects education, childcare, health, skills, work-life supports, and protective buffers to improve both social inclusion and economic performance, while scholarship differs on how far social investment should replace compensatory protection.',
      prescriptive: 'Favors policies that build, mobilize, and preserve capabilities—especially early education, care, training, employment support, and life-course protection—rather than relying only on passive income maintenance.',
   },
   'right-wing-populism': {
      normative: 'Treats an authentic or national people as the rightful source of political authority and often gives cohesion, order, or bounded membership priority over pluralist or cosmopolitan claims.',
      descriptive: 'Expects established elites and institutions to be corrupt or detached from the authentic people, while right-wing hosts interpret who belongs and what threatens the community through national, cultural, or nativist frames.',
      prescriptive: 'Favors restoring popular control through majoritarian, anti-establishment, nationalist, nativist, or culturally traditional policies; specific economic and institutional programs vary by host.',
   },
   'left-wing-populism': {
      normative: 'Treats ordinary people, especially subordinated or working groups, as entitled to political voice and economic equality against oligarchic domination.',
      descriptive: 'Expects concentrated wealth and entrenched elites to distort democracy and sees broad popular mobilization and redistribution as ways to reopen political agency; movements define people and elite differently.',
      prescriptive: 'Favors majoritarian or participatory mobilization, redistribution, public control, or economic democracy against oligarchic power; it does not prescribe one route between elections, movements, and institutions.',
   },
   'agrarian-populism': {
      normative: 'Treats small producers, rural communities, land-based livelihoods, or the people of the land as politically and morally undervalued by urban or financial power.',
      descriptive: 'Expects rural producers to be disadvantaged by concentrated land, credit, commodity, or political power, while agrarian populism can build cross-class alliances with divergent outcomes.',
      prescriptive: 'Favors producer protections, cooperative or distributed ownership, land or credit reform, and stronger rural representation; no single economic ideology follows from the label.',
   },
   'cultural-populism': {
      normative: 'Treats cultural belonging, everyday norms, or community recognition as politically important and sees distant elite authority as suspect.',
      descriptive: 'Expects cultural conflict and perceived status loss to mobilize anti-elite politics, with the people defined through national, religious, family, lifestyle, or other cultural boundaries.',
      prescriptive: 'Favors policies or political strategies that protect or restore a preferred cultural order and transfer authority from distant elites toward the culturally defined people; concrete positions on economy and state power vary.',
   },
   'market-liberal': {
      normative: 'Treats private property, individual liberty, legal equality, and predictable rule of law as central goods, with a presumption against concentrated public power.',
      descriptive: 'Expects competitive markets and secure property rights to coordinate dispersed knowledge and incentives better than extensive administrative direction, while leaving room for failures and regulation.',
      prescriptive: 'Favors competitive markets, secure private property, limited and constitutional government, and rule-governed reform; it does not prescribe one tax, welfare, or foreign-policy program.',
   },
   'decentralist-market-skeptic-of-state': {
      normative: 'Treats concentrated authority and dependence on centralized administration as major threats to liberty, valuing voluntary association, exit, and dispersed power.',
      descriptive: 'Expects decentralized exchange and voluntary institutions to reveal local knowledge and constrain abuse better than centralized state provision, though coordination and public-good limits remain contested.',
      prescriptive: 'Favors decentralizing provision, expanding exit and voluntary association, and reducing reliance on centralized administration; its market orientation distinguishes it from socialist anarchism.',
   },
   'civil-libertarian-cosmopolitan': {
      normative: 'Treats individual civil liberty and moral concern beyond national borders as jointly important, with universal obligations not exhausted by citizenship.',
      descriptive: 'Expects concentrated authority and closed national boundaries to create risks of domination, while transnational norms and decentralized institutions can widen protection.',
      prescriptive: 'Favors strong civil liberties, decentralized institutions, and cosmopolitan rights or obligations; it leaves economic property and global institutional design open.',
   },
   'classical-liberalism': {
      normative: 'Treats individual liberty, private property, voluntary exchange, rule of law, and constitutional limits on public power as central to a legitimate order.',
      descriptive: 'Expects dispersed decisions protected by property and legal constraints to check arbitrary power and support social coordination, while versions differ over welfare and state capacity.',
      prescriptive: 'Favors constitutionally limited government, civil and economic liberty, secure property, and rule-governed reform; it does not dictate a single libertarian or laissez-faire program.',
   },
   neoliberalism: {
      normative: 'Values liberal rights and market coordination while treating a competitive capitalist order and credible rules as important conditions for prosperity and institutional stability.',
      descriptive: 'Expects competition, price signals, expert regulation, and international economic rules to improve coordination, while scholars and critics dispute the term’s effects and boundaries.',
      prescriptive: 'Favors competition policy, market mechanisms, selective privatization or outsourcing, independent expert institutions, and international economic rules; this is a catalog-specific, contested use of neoliberalism.',
   },
   'social-liberalism': {
      normative: 'Treats individual liberty and equal citizenship as compatible with public responsibility for capabilities, opportunity, and protection from severe deprivation.',
      descriptive: 'Expects public services, regulation, and social insurance to expand effective freedom and stabilize a market society without requiring social ownership of production.',
      prescriptive: 'Favors rights-based public provision, social insurance, regulation, and opportunity-enhancing reform within a liberal constitutional order rather than socialism by definition.',
   },
   'anarcho-capitalist': {
      prescriptive: 'Favors replacing compulsory public provision with voluntary contract and competitive private provision of law, protection, and arbitration.',
   },
   geolibertarian: {
      normative: 'Combines self-ownership and voluntary exchange with an equal claim to the value of land and natural opportunities.',
      descriptive: 'Expects self-ownership and market exchange to coexist with equal claims to natural opportunities, treating land value as socially generated and land rent as a candidate for public capture; variants differ over revenue use and state scope.',
      prescriptive: 'Favors secure private use of land while collecting land or resource rent for public revenue or equal compensation, usually through a land-value tax.',
   },
   minarchist: {
      normative: 'Treats individual rights in life, liberty, property, and contract as primary constraints on political authority, while allowing a narrowly limited state to protect those rights.',
      descriptive: 'Expects a public system of police, courts, and defense to protect against force, fraud, and rights violations more reliably than a wholly stateless arrangement, while remaining skeptical of government expansion.',
      prescriptive: 'Favors a minimal state limited mainly to protecting rights through courts, policing, and defense.',
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
   distributism: {
      prescriptive: 'Favors dispersing productive property among families, small firms, guilds, cooperatives, and local associations rather than concentrating it in corporations or the state.',
   },
   mutualist: {
      normative: 'Treats reciprocity, worker autonomy, equal exchange, and voluntary association as safeguards against both capitalist privilege and centralized state administration.',
      descriptive: 'Expects cooperative markets and mutual-credit institutions to widen access to productive resources and reduce exploitation, while historical and contemporary implementations differ over property, exchange, and institutional scale.',
      prescriptive: 'Favors mutual credit, cooperative exchange, possession or use-based claims, and federated voluntary institutions instead of state administration or concentrated capitalist ownership.',
   },
   'civic-nationalist': {
      normative: 'Treats shared civic membership, political self-government, and a common public culture as important grounds of national belonging rather than inherited ancestry alone.',
      prescriptive: 'Favors inclusive citizenship, common political institutions, constitutional participation, and public nation-building while leaving room for cultural and historical identities within the civic community.',
   },
   indigenism: {
      normative: 'Treats Indigenous collective self-determination, cultural continuity, land relationships, and authority over community affairs as central goods in a decolonial political order.',
      prescriptive: 'Favors Indigenous governance, land and resource rights, language and cultural institutions, and decolonial changes to imposed state or market structures; traditions differ over institutional form and territorial scope.',
   },
   hindutva: {
      normative: 'Treats Hindu civilizational or national identity as central to the political meaning of India and to the boundaries of national belonging.',
      prescriptive: 'Favors public institutions and national membership organized around a Hindu-nationalist conception of India; programs vary over secularism, minority rights, citizenship, and the role of the state.',
   },
   'religious-nationalism': {
      normative: 'Treats a religious tradition and the national community as mutually reinforcing sources of identity, obligation, and political legitimacy.',
      prescriptive: 'Favors public institutions that recognize or advance a nation’s religious tradition, with variants ranging from cultural preference to religiously informed law or formal religious authority.',
   },
   zionism: {
      normative: 'Treats the Jewish people as a nation entitled to Jewish national self-determination and a secure political and cultural home.',
      prescriptive: 'Favors institutions capable of maintaining Jewish national self-determination in the Land of Israel; liberal, socialist, religious, revisionist, and other currents disagree over borders, state structure, religion, and relations with Palestinians.',
   },
   'left-wing-nationalism': {
      normative: 'Treats national self-determination and popular sovereignty as compatible with social equality, anti-colonial solidarity, and opposition to imperial domination.',
      prescriptive: 'Favors national liberation, redistributive or socialist policy, and popular control of the post-colonial state or nation; movements differ over internationalism, class politics, and minority membership.',
   },
   'expansionist-nationalism': {
      normative: 'Treats territorial enlargement, external influence, and national power as legitimate or necessary expressions of the nation’s political purpose.',
      prescriptive: 'Favors territorial acquisition, imperial administration, or irredentist expansion justified through security, historical, civilizing, or strategic claims; it is not a policy-neutral theory of international relations.',
   },
   'separatist-nationalism': {
      normative: 'Treats a distinct national or regional community’s self-government as more important than preserving the existing state’s territorial unity.',
      prescriptive: 'Favors autonomy, federal reorganization, or secession as routes to self-government, with the preferred route depending on the movement and its political conditions rather than following automatically from the label.',
   },
   'left-wing-market-anarchism': {
      normative: 'Combines individual liberty and voluntary exchange with opposition to state privilege, exploitation, and concentrated economic domination.',
      prescriptive: 'Favors stateless freed markets and voluntary institutions while dismantling legal privileges that sustain corporate concentration; currents differ over property, wage labor, rent, and the balance among firms, cooperatives, and mutual provision.',
   },
   'individualist-anarchism': {
      normative: 'Gives individual self-direction and voluntary association priority over compulsory state authority or demands that subordinate persons to an abstract collective good.',
      prescriptive: 'Favors stateless, voluntary forms of association while leaving substantial disagreement among natural-rights, mutualist, and egoist currents over property, exchange, and durable organization.',
   },
   'anarcho-primitivism': {
      normative: 'Treats autonomy, ecological integrity, and freedom from civilizational domination as more important than maintaining industrial scale, technological dependence, or specialized hierarchy.',
      prescriptive: 'Favors radical decentralization, deindustrialization, rewilding, and reducing dependence on domestication, specialized labor, and large technical systems; adherents differ over transition and acceptable tools.',
   },
   voluntaryism: {
      normative: 'Treats consent, individual liberty, and voluntary support as the standards by which political institutions and social relationships should be judged.',
      prescriptive: 'Favors voluntarily funded and joined institutions; Herbert retained a voluntarily funded minimal state, while later Voluntaryists have favored competing or stateless arrangements.',
   },
   stirnerism: {
      normative: 'Resists treating fixed moral, political, or social abstractions as obligations that override the self-directed unique individual.',
      prescriptive: 'Allows contingent, voluntary unions formed for participants’ purposes but supplies no single institutional blueprint, property system, or public-policy program.',
   },
   'anarcha-feminism': {
      normative: 'Treats patriarchy and gender subordination as forms of coercive hierarchy inseparable from a broader commitment to autonomy, equality, and freedom from domination.',
      prescriptive: 'Favors decentralized and non-coercive social relations that challenge gender hierarchy across intimate life, work, political organization, and other institutions rather than seeking representation within hierarchy alone.',
   },
   'queer-anarchism': {
      normative: 'Opposes coercive sexual and gender hierarchy together with the wider political and social structures that enforce conformity and domination.',
      prescriptive: 'Favors autonomous, decentralized forms of queer liberation and resistance to institutions that police gender or sexuality; the current does not impose one universal account of identity, family, or gender abolition.',
   },
   'techno-anarchism': {
      normative: 'Prioritizes privacy, autonomy, and resistance to centralized information control while treating technology as a possible anti-authoritarian tool rather than an authority in itself.',
      prescriptive: 'Favors encryption, anonymity systems, peer-to-peer protocols, and decentralized networks that make surveillance, censorship, or centralized control harder; it is a loose current rather than one settled institutional program.',
   },
   ecosocialist: {
      prescriptive: 'Favors social ownership and democratic planning of production around human need, equality, and ecological limits rather than profit or growth as ends in themselves.',
   },
   'world-federalism': {
      normative: 'Treats humanity as entitled to shared political institutions capable of securing peace, rights, and justice across borders while preserving self-government at appropriate levels.',
      descriptive: 'Expects problems that cross borders to exceed the capacity of sovereign states acting alone and to require accountable institutions with global scope.',
      prescriptive: 'Favors a democratic federal layer of world government with divided powers and enforceable international law above nation-states, while retaining national and local authority in other domains.',
   },
   multiculturalism: {
      normative: 'Treats cultural membership and the ability to maintain distinctive identities and practices as compatible with equal citizenship, rather than requiring a single assimilated public culture.',
      descriptive: 'Expects forced assimilation to reproduce unequal status and sees recognition or accommodation as possible tools for inclusion, though group rights can create tensions within and across communities.',
      prescriptive: 'Favors recognition, accommodation, or group-differentiated rights for minority cultural communities within a shared constitutional order; it does not prescribe separatism or one fixed model of integration.',
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
      descriptive: 'Expects prices, investment, firms, and innovation within capitalism to redirect production and consumption toward lower ecological harm, while critics challenge the sufficiency of that mechanism.',
      prescriptive: 'Favors carbon pricing, renewable-energy markets, eco-labeling, and corporate sustainability as mechanisms of ecological transition.',
   },
   'deep-ecology': {
      normative: 'Treats nonhuman life and ecological systems as possessing value independent of their usefulness to people, and regards ecological integrity as a condition of a flourishing world.',
      descriptive: 'Expects anthropocentric industrial practices, pollution, and resource depletion to damage an interdependent biosphere, while treating human beings as embedded in ecological relationships rather than separate from nature.',
      prescriptive: 'Favors restraint in human impacts, respect for ecological diversity and complexity, decentralization, and far-reaching social change around biocentric limits; it does not prescribe one population or economic policy.',
   },
   'eco-authoritarianism': {
      normative: 'Treats ecological protection as an overriding political priority and accepts concentrated authority, restricted participation, or reduced individual discretion as possible means to secure it.',
      descriptive: 'Expects ecological crisis and the perceived slowness or fragmentation of democratic and market institutions to justify centralized expertise, command, and coercive environmental enforcement; real-world environmental authoritarianism varies across regimes and policies.',
      prescriptive: 'Favors powerful centralized authority, expert or vanguard direction, and command-and-control environmental rules that can override ordinary democratic or individual constraints.',
   },
   'radical-democracy': {
      normative: 'Treats democratic equality, active participation, and the contestability of concentrated power as central goods, while regarding pluralism and legitimate political conflict as compatible with democratic life.',
      descriptive: 'Expects settled representative institutions and dominant hegemonies to exclude voices or depoliticize conflict, while social movements, counter-hegemonic struggles, and public contestation can reopen political participation.',
      prescriptive: 'Favors expanding participation and redesigning institutions so concentrated political and economic power remains contestable beyond periodic elections.',
   },
   'liquid-democracy': {
      normative: 'Treats voter autonomy and flexible participation as compatible: people should be able to decide directly on issues or authorize another person to decide for them without surrendering ongoing control.',
      descriptive: 'Expects a mixture of direct voting and voluntary, revisable proxy delegation to combine issue-specific participation with access to trusted expertise or representation; delegation can also create new risks of concentration and manipulation.',
      prescriptive: 'Favors delegable proxy voting that lets participants vote directly or transfer their vote to a chosen proxy, usually with the ability to revise or withdraw the delegation.',
   },
   'democratic-confederalism': {
      normative: 'Treats grassroots self-government, pluralism, ecological responsibility, gender equality, and freedom from centralized domination as mutually reinforcing political goods.',
      descriptive: 'Expects local communities and assemblies, linked through delegated coordination, to handle social decisions more democratically than a centralized nation-state, with ecology, feminism, and multicultural coexistence shaping the model.',
      prescriptive: 'Favors linked local assemblies and councils with limited coordinating bodies, participatory self-administration, and a non-state or post-nation-state political horizon.',
   },
   corporatism: {
      prescriptive: 'Favors organizing recognized occupational and sectoral bodies under strong state direction to mediate represented interests.',
   },
   'anarcho-syndicalism': {
      normative: 'Treats worker solidarity, self-management, and freedom from both capitalist and state domination as central goods, with labor organization serving as a vehicle for collective autonomy.',
      descriptive: 'Expects industrial unions, direct action, and federated worker organization to build class power and provide a basis for social coordination, while historical movements differed over reform, revolution, and union structure.',
      prescriptive: 'Favors replacing capitalism and the state with federated worker organizations, using direct action rather than electoral politics.',
   },
   platformism: {
      normative: 'Treats anarchist-communist emancipation and coordinated collective action as compatible with anti-authoritarian politics, while rejecting disorganization as an adequate basis for durable movement power.',
      descriptive: 'Expects a shared political program, tactical coordination, collective responsibility, and federal organization to make anarchist movements more coherent and effective; the tendency originates in the 1926 Organisational Platform and remains contested within anarchism.',
      prescriptive: 'Favors a unified but decentralized anarchist organization with collective responsibility and tactical coordination.',
   },
   'bright-green-environmentalism': {
      normative: 'Values ecological protection alongside human prosperity and accepts technology-intensive routes to both.',
      descriptive: 'Expects technology, urbanization, and sometimes markets to reduce ecological harm without ending prosperity.',
      prescriptive: 'Favors technological innovation, clean energy, efficient infrastructure, urban redesign, and scalable policy or market instruments to reduce ecological harm while preserving or expanding prosperity.',
   },
   'national-socialism': {
      normative: 'Treats racial hierarchy, antisemitic exclusion, ultranationalism, and totalizing racial-national authority as foundational commitments.',
   },
   'technocratic-centralist': {
      normative: 'Treats expert competence, administrative capacity, and coordinated problem-solving as important grounds of political legitimacy, with less confidence in unmediated electoral judgment.',
      descriptive: 'Assumes centralized expert administration has high capacity and that markets and electoral majorities are comparatively unreliable.',
      prescriptive: 'Favors centralized expert agencies, planning, and evidence-guided administration insulated from short-term electoral pressure; the label leaves open how accountability and popular participation are secured.',
   },
   transhumanism: {
      normative: 'Values human flourishing, autonomy, and the possibility of overcoming disease, aging, or inherited biological limits through enhancement.',
      descriptive: 'Expects biomedical, computational, and cybernetic technologies to make human capacities more alterable and to create new conflicts over risk, access, and governance.',
      prescriptive: 'Favors research, development, regulation, and access pathways for human enhancement, with internal disagreement over limits, safety, equality, and public or private control.',
   },
   cyberocracy: {
      normative: 'Treats effective information circulation, adaptive coordination, and institutional capacity as important political goods, without fixing whether authority should remain human, democratic, or automated.',
      descriptive: 'Expects electronic information infrastructures and computation to reshape bureaucracy and potentially produce democratic, authoritarian, or hybrid governing forms.',
      prescriptive: 'Favors building and using networked information systems and computational decision support in public administration; the label alone does not settle who controls them or how they are held accountable.',
   },
   accelerationism: {
      normative: 'Treats intensification or acceleration of technological, capitalist, or modernizing dynamics as potentially transformative rather than assuming stability or gradualism is inherently preferable.',
      descriptive: 'Expects crises or transformations to emerge from escalating technical, economic, or social processes; left, right, and technology-centered variants make different causal and political claims.',
      prescriptive: 'Favors strategically intensifying, redirecting, or removing constraints on selected processes to force systemic change; the concrete program varies so widely that the label does not identify one policy package.',
   },
   dataism: {
      normative: 'Treats data generation, processing, and circulation as unusually central to knowledge, value, and social organization, while the term remains contested rather than a settled moral doctrine.',
      descriptive: 'Expects analytics, quantification, and algorithmic systems to increasingly shape decisions and institutions, with disagreements over whether this improves knowledge or reproduces bias and power.',
      prescriptive: 'Favors expanding data collection, measurement, optimization, and data-driven governance as tools of social coordination; privacy, ownership, accountability, and the status of human judgment remain open disputes.',
   },
   singularitarianism: {
      normative: 'Treats the possibility of radical artificial-intelligence-driven transformation as a major horizon of human concern, hope, or risk.',
      descriptive: 'Expects advanced artificial intelligence could become self-reinforcing or socially discontinuous enough to outpace ordinary forecasting and institutions.',
      prescriptive: 'Favors some combination of artificial-intelligence research, safety or alignment work, preparation, and enhancement; singularitarian currents diverge over whether acceleration or restraint should take priority.',
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
