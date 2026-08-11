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
}

const DIRECT_ONLY_TERM_DEFINITION_LABEL_IDS = new Set([
   'national-socialism',
   'corporatism',
   'islamic-democracy',
])

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
      return `${LAYER_EXPLAINERS[layer].description} Related traditions include ${philosophyNames.slice(0, 3).join(', ')}, but this label does not imply one more specific shared position in this layer.`
   }

   return `${LAYER_EXPLAINERS[layer].description} This label does not imply one distinct shared position in this layer.`
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
