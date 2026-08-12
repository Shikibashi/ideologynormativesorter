import type { Question } from '../types'

export interface ExperimentalSpecialistCandidate {
   id: string
   name: string
   description: string
   signals: Record<string, number>
}

export interface ExperimentalSpecialistModuleSpec {
   id: string
   version: string
   title: string
   shortTitle: string
   description: string
   invitationNote: string
   estimatedMinutes: number
   questions: Question[]
   constructWeightsByQuestionId: Record<string, Record<string, number>>
   constructIds: string[]
   candidates: ExperimentalSpecialistCandidate[]
}

type ExperimentalQuestion = {
   id: string
   prompt: string
   domain: string
   layer: Question['layer']
   constructs: Record<string, number>
   axisWeights: Question['axisWeights']
}

function buildQuestions(moduleId: string, items: ExperimentalQuestion[]): Question[] {
   return items.map((item) => ({
      id: item.id,
      prompt: item.prompt,
      domain: item.domain,
      layer: item.layer,
      theoryContext: 'mixed',
      responseType: 'likert7',
      tier: 'extensive',
      module: moduleId,
      axisWeights: item.axisWeights,
      allowDontKnow: item.layer === 'descriptive',
      confidencePrompt: item.layer === 'descriptive' ? 'How confident are you in this empirical claim?' : undefined,
      priorityPrompt: item.layer === 'prescriptive' ? 'How important is this strategic distinction to your outlook?' : undefined,
      reviewStatus: 'approved',
      version: '2026-08-specialist-v1',
      updatedAt: '2026-08-12',
      evidenceNote: item.layer === 'descriptive'
         ? 'This experimental descriptive item is scoped to the institutional mechanism named in the prompt; it is not a universal claim about every society or every technological or political context.'
         : undefined,
      contextNote: 'This experimental follow-up separates a focused construct from neighboring traditions. Its sources provide interpretive background and do not validate a respondent identity claim.',
      sources: [],
   }))
}

function spec(
   id: string,
   title: string,
   shortTitle: string,
   description: string,
   items: ExperimentalQuestion[],
   candidates: ExperimentalSpecialistCandidate[],
): ExperimentalSpecialistModuleSpec {
   const questions = buildQuestions(id, items)
   const constructWeightsByQuestionId = Object.fromEntries(
      items.map((item) => [item.id, item.constructs]),
   )
   return {
      id,
      version: '2026-08-specialist-v1',
      title,
      shortTitle,
      description,
      invitationNote: 'This is an opt-in experimental follow-up. You may skip it without affecting your primary result or research participation.',
      estimatedMinutes: 3,
      questions,
      constructWeightsByQuestionId,
      constructIds: [...new Set(items.flatMap((item) => Object.keys(item.constructs)))],
      candidates,
   }
}

const candidate = (id: string, name: string, description: string, signals: Record<string, number>): ExperimentalSpecialistCandidate => ({ id, name, description, signals })

export const experimentalSpecialistModuleSpecs: readonly ExperimentalSpecialistModuleSpec[] = [
   spec(
      'anarchist-families-module',
      'Anarchist and market-libertarian families',
      'Anarchist families',
      'Separates anti-authoritarian social organization, property and market commitments, and political strategy.',
      [
         { id: 'fm-an-1', prompt: 'Durable political freedom requires dismantling imposed political hierarchy rather than merely making rulers more accountable.', domain: 'state-legitimacy', layer: 'normative', constructs: { 'anti-authority': 1 }, axisWeights: [{ axisId: 'authority-legitimacy', weight: -1 }, { axisId: 'anti-domination', weight: 0.7 }] },
         { id: 'fm-an-2', prompt: 'Markets and private exchange can coordinate social life without requiring a centralized state to direct production.', domain: 'markets-planning', layer: 'descriptive', constructs: { 'market-coordination': 1, 'communal-coordination': -0.4 }, axisWeights: [{ axisId: 'market-process-confidence', weight: 1 }, { axisId: 'centralization-preference', weight: -0.6 }] },
         { id: 'fm-an-3', prompt: 'Productive resources should generally be held in common or governed by workers and affected communities rather than by absentee owners.', domain: 'property-ownership', layer: 'normative', constructs: { 'communal-property': 1, 'market-property': -0.5 }, axisWeights: [{ axisId: 'property-legitimacy', weight: -0.8 }, { axisId: 'equality-theory', weight: 0.6 }] },
         { id: 'fm-an-4', prompt: 'Anarchist change should prioritize federated association, mutual aid, and direct organization over electoral capture of a central state.', domain: 'strategy-change', layer: 'prescriptive', constructs: { 'direct-federation': 1 }, axisWeights: [{ axisId: 'centralization-preference', weight: -0.8 }, { axisId: 'electoralism-vs-direct-action', weight: -0.7 }] },
      ],
      [
         candidate('anarcho-communist', 'Anarcho-Communism', 'Communal ownership and anti-authoritarian federation.', { 'anti-authority': 0.9, 'market-coordination': -0.6, 'communal-property': 0.95, 'direct-federation': 0.8 }),
         candidate('individualist-anarchism', 'Individualist Anarchism', 'Anti-authoritarian self-direction and voluntary association without a single required economic program.', { 'anti-authority': 0.9, 'market-coordination': 0.15, 'communal-property': -0.1, 'direct-federation': 0.5 }),
         candidate('mutualist', 'Mutualism', 'Reciprocal exchange, federated association, and non-capitalist property.', { 'anti-authority': 0.8, 'market-coordination': 0.45, 'communal-property': 0.2, 'direct-federation': 0.8 }),
         candidate('anarcho-syndicalism', 'Anarcho-Syndicalism', 'Worker organization and direct industrial action under anarchist commitments.', { 'anti-authority': 0.85, 'market-coordination': -0.2, 'communal-property': 0.65, 'direct-federation': 0.95 }),
         candidate('anarcho-capitalist', 'Anarcho-Capitalism', 'Private property and market exchange without a state.', { 'anti-authority': 0.9, 'market-coordination': 0.95, 'communal-property': -0.8, 'direct-federation': 0.35 }),
         candidate('minarchist', 'Minarchism', 'A minimal state limited to protective and adjudicative functions.', { 'anti-authority': 0.35, 'market-coordination': 0.8, 'communal-property': -0.6, 'direct-federation': -0.2 }),
      ],
   ),
   spec(
      'green-morphology-module',
      'Green political morphology',
      'Green morphology',
      'Measures ecological moral standing separately from growth, ownership, technology, governance, and strategy.',
      [
         { id: 'fm-gr-1', prompt: 'The nonhuman world has moral standing that should constrain human activity even when doing so reduces material convenience.', domain: 'environment-climate-growth', layer: 'normative', constructs: { 'ecological-standing': 1 }, axisWeights: [{ axisId: 'human-nature-priority', weight: 1 }] },
         { id: 'fm-gr-2', prompt: 'High-income societies should reduce material throughput rather than treating continued aggregate economic growth as the default solution to social problems.', domain: 'environment-climate-growth', layer: 'prescriptive', constructs: { 'post-growth': 1 }, axisWeights: [{ axisId: 'human-nature-priority', weight: 0.6 }, { axisId: 'regulation-vs-deregulation', weight: 0.5 }] },
         { id: 'fm-gr-3', prompt: 'Private investment and technological innovation can be central tools for rapid ecological transition when public rules correct external harms.', domain: 'environment-climate-growth', layer: 'prescriptive', constructs: { 'market-technology': 1 }, axisWeights: [{ axisId: 'market-process-confidence', weight: 0.7 }, { axisId: 'expert-confidence', weight: 0.3 }] },
         { id: 'fm-gr-4', prompt: 'Ecological politics should prioritize democratic and locally accountable control over both corporate and centralized state power.', domain: 'democracy-expertise-constitutionalism', layer: 'prescriptive', constructs: { 'democratic-decentralism': 1 }, axisWeights: [{ axisId: 'democratic-confidence', weight: 0.6 }, { axisId: 'centralization-preference', weight: -0.6 }, { axisId: 'anti-domination', weight: 0.5 }] },
      ],
      [
         candidate('deep-ecology', 'Deep Ecology', 'Strong independent moral standing for nonhuman nature.', { 'ecological-standing': 0.95, 'post-growth': 0.5, 'market-technology': -0.3, 'democratic-decentralism': 0.5 }),
         candidate('degrowth-green', 'Degrowth Green', 'Democratic reduction of material throughput in affluent economies.', { 'ecological-standing': 0.8, 'post-growth': 0.95, 'market-technology': -0.35, 'democratic-decentralism': 0.65 }),
         candidate('ecosocialist', 'Ecosocialism', 'Ecological transformation joined to collective ownership and anti-capitalist politics.', { 'ecological-standing': 0.8, 'post-growth': 0.75, 'market-technology': -0.65, 'democratic-decentralism': 0.45 }),
         candidate('ecomodernist', 'Ecomodernism', 'Ecological improvement through innovation, infrastructure, and high-capacity institutions.', { 'ecological-standing': 0.55, 'post-growth': -0.45, 'market-technology': 0.85, 'democratic-decentralism': 0.1 }),
         candidate('green-capitalism', 'Green Capitalism', 'Market investment and regulation as the main route to ecological transition.', { 'ecological-standing': 0.55, 'post-growth': -0.2, 'market-technology': 0.8, 'democratic-decentralism': 0.2 }),
      ],
   ),
   spec(
      'socialist-families-module',
      'Socialist family variants',
      'Socialist variants',
      'Separates ownership, democratic control, planning, reform, and revolutionary strategy across socialist traditions.',
      [
         { id: 'fm-so-1', prompt: 'Productive assets should be socially or worker owned rather than controlled primarily through private capital markets.', domain: 'property-ownership', layer: 'normative', constructs: { 'social-ownership': 1 }, axisWeights: [{ axisId: 'property-legitimacy', weight: -1 }, { axisId: 'equality-theory', weight: 0.7 }] },
         { id: 'fm-so-2', prompt: 'Democratic planning and collective decision-making can coordinate complex production without relying entirely on market prices.', domain: 'markets-planning', layer: 'descriptive', constructs: { 'democratic-planning': 1 }, axisWeights: [{ axisId: 'market-process-confidence', weight: -0.8 }, { axisId: 'democratic-confidence', weight: 0.5 }] },
         { id: 'fm-so-3', prompt: 'Socialist politics should normally pursue durable gains through elections, law, unions, and public institutions rather than immediate rupture.', domain: 'strategy-change', layer: 'prescriptive', constructs: { 'reformism': 1, 'revolutionary-strategy': -0.5 }, axisWeights: [{ axisId: 'reform-vs-revolution', weight: -0.8 }, { axisId: 'electoralism-vs-direct-action', weight: 0.6 }] },
         { id: 'fm-so-4', prompt: 'A disciplined revolutionary organization may need to centralize political authority during the transition away from capitalism.', domain: 'strategy-change', layer: 'prescriptive', constructs: { 'revolutionary-strategy': 1 }, axisWeights: [{ axisId: 'centralization-preference', weight: 0.7 }, { axisId: 'reform-vs-revolution', weight: 0.8 }] },
      ],
      [
         candidate('social-democrat', 'Social Democracy', 'Reformist welfare and labor politics within a mixed economy.', { 'social-ownership': 0.1, 'democratic-planning': 0.2, 'reformism': 0.95, 'revolutionary-strategy': -0.8 }),
         candidate('market-socialist', 'Market Socialism', 'Social ownership combined with market exchange or competition.', { 'social-ownership': 0.8, 'democratic-planning': 0.15, 'reformism': 0.35, 'revolutionary-strategy': -0.2 }),
         candidate('council-communist', 'Council Communism', 'Worker councils and direct democratic control of production and politics.', { 'social-ownership': 0.9, 'democratic-planning': 0.85, 'reformism': -0.3, 'revolutionary-strategy': 0.7 }),
         candidate('syndicalist', 'Syndicalism', 'Union organization and direct industrial action as the route to social transformation.', { 'social-ownership': 0.8, 'democratic-planning': 0.65, 'reformism': -0.2, 'revolutionary-strategy': 0.8 }),
         candidate('maoism', 'Maoism', 'Revolutionary party organization, mass mobilization, and centralized transition.', { 'social-ownership': 0.9, 'democratic-planning': 0.7, 'reformism': -0.7, 'revolutionary-strategy': 0.95 }),
         candidate('trotskyism', 'Trotskyism', 'Revolutionary Marxism emphasizing international transformation and party strategy.', { 'social-ownership': 0.9, 'democratic-planning': 0.65, 'reformism': -0.65, 'revolutionary-strategy': 0.9 }),
      ],
   ),
   spec(
      'conservative-variants-module',
      'Conservative variants',
      'Conservative variants',
      'Separates prudential continuity from moral traditionalism, nationalism, Christian democracy, liberal conservatism, and neoconservative strategy.',
      [
         { id: 'fm-co-1', prompt: 'Political reform should normally proceed cautiously because inherited institutions contain knowledge that deliberate redesign can easily destroy.', domain: 'strategy-change', layer: 'normative', constructs: { 'prudence': 1 }, axisWeights: [{ axisId: 'gradualism-vs-immediatism', weight: -1 }, { axisId: 'cultural-plasticity', weight: -0.5 }] },
         { id: 'fm-co-2', prompt: 'Public law should actively uphold inherited family and sexual norms rather than leave those questions mainly to individual choice.', domain: 'family-gender-feminism', layer: 'prescriptive', constructs: { 'moral-traditionalism': 1 }, axisWeights: [{ axisId: 'moral-traditionalism', weight: 1 }, { axisId: 'liberty-noninterference', weight: -0.6 }] },
         { id: 'fm-co-3', prompt: 'The political community should give special priority to the continuity and authority of a historic national culture.', domain: 'national-identity-sovereignty', layer: 'normative', constructs: { 'national-continuity': 1 }, axisWeights: [{ axisId: 'political-community-boundary', weight: -0.8 }, { axisId: 'moral-traditionalism', weight: 0.3 }] },
         { id: 'fm-co-4', prompt: 'A state may need an assertive foreign policy and strong international alliances to defend a liberal order against hostile regimes.', domain: 'foreign-policy-war', layer: 'prescriptive', constructs: { 'assertive-internationalism': 1 }, axisWeights: [{ axisId: 'militarism-pacifism', weight: 0.8 }, { axisId: 'state-capacity-confidence', weight: 0.4 }] },
      ],
      [
         candidate('conservative', 'Conservative / Prudential Conservative', 'Broad prudential continuity and gradual institutional change.', { 'prudence': 0.95, 'moral-traditionalism': 0.25, 'national-continuity': 0.25, 'assertive-internationalism': 0 }),
         candidate('social-conservatism', 'Social Conservatism', 'Moral and family traditionalism as a cross-cutting political commitment.', { 'prudence': 0.5, 'moral-traditionalism': 0.95, 'national-continuity': 0.4, 'assertive-internationalism': 0 }),
         candidate('national-conservatism', 'National Conservatism', 'National continuity joined to conservative institutional politics.', { 'prudence': 0.65, 'moral-traditionalism': 0.55, 'national-continuity': 0.95, 'assertive-internationalism': 0.3 }),
         candidate('liberal-conservatism', 'Liberal Conservatism / Conservative Liberalism', 'Constitutional liberty and markets combined with social and institutional continuity.', { 'prudence': 0.7, 'moral-traditionalism': 0.3, 'national-continuity': 0.2, 'assertive-internationalism': 0.2 }),
         candidate('neoconservative', 'Neoconservatism', 'Modern U.S. conservative internationalism with an assertive foreign-policy orientation.', { 'prudence': 0.4, 'moral-traditionalism': 0.35, 'national-continuity': 0.25, 'assertive-internationalism': 0.95 }),
      ],
   ),
   spec(
      'religious-national-politics-module',
      'Religious and national political projects',
      'Religious-national politics',
      'Separates constitutional religious democracy, religious authority, civilizational nationalism, minority citizenship, and territorial projects.',
      [
         { id: 'fm-rn-1', prompt: 'Constitutional authority should be publicly accountable to citizens even when religious law or tradition informs interpretation.', domain: 'religion-secularism', layer: 'normative', constructs: { 'popular-constitutionalism': 1 }, axisWeights: [{ axisId: 'democratic-confidence', weight: 0.6 }, { axisId: 'secularism-religious', weight: 0.3 }] },
         { id: 'fm-rn-2', prompt: 'A recognized religious authority should have final power to reject civil laws that conflict with its interpretation of religious doctrine.', domain: 'religion-secularism', layer: 'prescriptive', constructs: { 'religious-authority': 1 }, axisWeights: [{ axisId: 'secularism-religious', weight: 1 }, { axisId: 'authority-legitimacy', weight: 0.7 }] },
         { id: 'fm-rn-3', prompt: 'The state should primarily express the historic religious or civilizational identity of the majority nation rather than remain neutral among identities.', domain: 'national-identity-sovereignty', layer: 'normative', constructs: { 'civilizational-nationalism': 1 }, axisWeights: [{ axisId: 'political-community-boundary', weight: -0.7 }, { axisId: 'moral-traditionalism', weight: 0.6 }] },
         { id: 'fm-rn-4', prompt: 'Minority citizens should retain equal legal and political standing even when the state adopts a majority religious or national tradition.', domain: 'race-ethnicity-multiculturalism', layer: 'normative', constructs: { 'minority-citizenship': 1 }, axisWeights: [{ axisId: 'equality-theory', weight: 0.8 }, { axisId: 'anti-domination', weight: 0.6 }] },
      ],
      [
         candidate('islamic-democracy', 'Islamic Democratic Constitutionalism', 'Popular sovereignty and constitutional competition interpreted through Islamic legal and ethical traditions.', { 'popular-constitutionalism': 0.9, 'religious-authority': 0.25, 'civilizational-nationalism': 0.2, 'minority-citizenship': 0.6 }),
         candidate('political-islam', 'Political Islam', 'Political projects that make Islamic identity or law central to state and movement politics.', { 'popular-constitutionalism': 0.35, 'religious-authority': 0.65, 'civilizational-nationalism': 0.55, 'minority-citizenship': 0.2 }),
         candidate('hindutva', 'Hindutva', 'A majoritarian or civilizational account of Indian national identity centered on Hindu cultural belonging.', { 'popular-constitutionalism': 0.25, 'religious-authority': 0.25, 'civilizational-nationalism': 0.95, 'minority-citizenship': -0.25 }),
         candidate('zionism', 'Zionism', 'A family of Jewish national self-determination projects with divergent territorial and constitutional variants.', { 'popular-constitutionalism': 0.3, 'religious-authority': 0.2, 'civilizational-nationalism': 0.75, 'minority-citizenship': 0.2 }),
         candidate('fundamentalist-theocracy', 'Fundamentalist Theocracy', 'Religious authority as the final foundation of coercive public law.', { 'popular-constitutionalism': -0.5, 'religious-authority': 0.98, 'civilizational-nationalism': 0.5, 'minority-citizenship': -0.4 }),
      ],
   ),
   spec(
      'technology-governance-module',
      'Technology and governance variants',
      'Technology and governance',
      'Separates expert administration, algorithmic authority, decentralized technology, and accelerationist strategy.',
      [
         { id: 'fm-te-1', prompt: 'Complex public decisions should normally be delegated to technically qualified institutions rather than settled directly by ordinary electoral majorities.', domain: 'democracy-expertise-constitutionalism', layer: 'descriptive', constructs: { 'expert-administration': 1 }, axisWeights: [{ axisId: 'expert-confidence', weight: 1 }, { axisId: 'democratic-confidence', weight: -0.6 }] },
         { id: 'fm-te-2', prompt: 'Algorithmic systems should be allowed to make or substantially determine public decisions when their performance exceeds that of human officials.', domain: 'technology-ai-surveillance', layer: 'prescriptive', constructs: { 'algorithmic-authority': 1 }, axisWeights: [{ axisId: 'expert-confidence', weight: 0.6 }, { axisId: 'authority-legitimacy', weight: 0.5 }] },
         { id: 'fm-te-3', prompt: 'Cryptography, distributed networks, and peer-to-peer tools can reduce dependence on centralized states and corporations.', domain: 'technology-ai-surveillance', layer: 'descriptive', constructs: { 'decentralized-technology': 1 }, axisWeights: [{ axisId: 'coordination-optimism', weight: 0.8 }, { axisId: 'centralization-preference', weight: -0.8 }] },
         { id: 'fm-te-4', prompt: 'Rapid technological acceleration should be pursued even when it destabilizes existing institutions and social arrangements.', domain: 'strategy-change', layer: 'prescriptive', constructs: { 'accelerationist-strategy': 1 }, axisWeights: [{ axisId: 'reform-vs-revolution', weight: 0.7 }, { axisId: 'cultural-plasticity', weight: 0.7 }] },
      ],
      [
         candidate('technocratic-centralist', 'Technocratic Centralism', 'Centralized expert administration insulated from ordinary electoral pressure.', { 'expert-administration': 0.95, 'algorithmic-authority': 0.55, 'decentralized-technology': -0.45, 'accelerationist-strategy': 0.1 }),
         candidate('cyberocracy', 'Cyberocracy', 'Governance through cybernetic information systems and algorithmic administration.', { 'expert-administration': 0.7, 'algorithmic-authority': 0.95, 'decentralized-technology': 0.1, 'accelerationist-strategy': 0.3 }),
         candidate('techno-anarchism', 'Techno-Anarchism', 'Decentralized technology and cryptography used against centralized control.', { 'expert-administration': -0.35, 'algorithmic-authority': -0.25, 'decentralized-technology': 0.95, 'accelerationist-strategy': 0.35 }),
         candidate('accelerationism', 'Accelerationism', 'Strategic intensification of technological or social change to transform existing institutions.', { 'expert-administration': 0.15, 'algorithmic-authority': 0.25, 'decentralized-technology': 0.2, 'accelerationist-strategy': 0.95 }),
         candidate('dataism', 'Dataism', 'An epistemic and cultural orientation that gives data-driven systems privileged interpretive authority.', { 'expert-administration': 0.6, 'algorithmic-authority': 0.75, 'decentralized-technology': 0.2, 'accelerationist-strategy': 0.4 }),
      ],
   ),
   spec(
      'monarchist-municipal-module',
      'Monarchist and municipal/confederal families',
      'Regime and confederal variants',
      'Separates hereditary authority, constitutional limitation, municipal self-rule, and confederal coordination.',
      [
         { id: 'fm-mm-1', prompt: 'Hereditary or traditional authority can be legitimate even when it is not continuously authorized through ordinary elections.', domain: 'state-legitimacy', layer: 'normative', constructs: { 'hereditary-authority': 1 }, axisWeights: [{ axisId: 'authority-legitimacy', weight: 0.8 }, { axisId: 'democratic-confidence', weight: -0.4 }] },
         { id: 'fm-mm-2', prompt: 'A monarch can serve as a constitutional symbol while elected institutions retain final political authority.', domain: 'democracy-expertise-constitutionalism', layer: 'prescriptive', constructs: { 'constitutional-monarchy': 1 }, axisWeights: [{ axisId: 'authority-legitimacy', weight: 0.2 }, { axisId: 'democratic-confidence', weight: 0.6 }] },
         { id: 'fm-mm-3', prompt: 'Political decisions should be made as locally as possible, with higher-level bodies limited to tasks that local communities cannot coordinate alone.', domain: 'democracy-expertise-constitutionalism', layer: 'normative', constructs: { 'municipal-autonomy': 1 }, axisWeights: [{ axisId: 'centralization-preference', weight: -0.9 }, { axisId: 'democratic-confidence', weight: 0.5 }] },
         { id: 'fm-mm-4', prompt: 'Federated municipalities or regions can coordinate through delegated, recallable, and non-sovereign institutions rather than one centralized state.', domain: 'strategy-change', layer: 'prescriptive', constructs: { 'confederal-coordination': 1 }, axisWeights: [{ axisId: 'centralization-preference', weight: -0.8 }, { axisId: 'anti-domination', weight: 0.7 }] },
      ],
      [
         candidate('absolute-monarchist', 'Absolute Monarchism', 'Hereditary authority with concentrated sovereign power.', { 'hereditary-authority': 0.95, 'constitutional-monarchy': -0.3, 'municipal-autonomy': -0.4, 'confederal-coordination': -0.4 }),
         candidate('traditional-monarchist', 'Traditional Monarchism', 'Hereditary authority grounded in historical and social continuity.', { 'hereditary-authority': 0.85, 'constitutional-monarchy': 0.2, 'municipal-autonomy': 0, 'confederal-coordination': -0.1 }),
         candidate('constitutional-monarchism', 'Constitutional Monarchism', 'Monarchy constrained by constitutional and elected institutions.', { 'hereditary-authority': 0.45, 'constitutional-monarchy': 0.95, 'municipal-autonomy': 0.1, 'confederal-coordination': 0 }),
         candidate('libertarian-municipalism', 'Libertarian Municipalism', 'Municipal democracy and confederal self-government.', { 'hereditary-authority': -0.5, 'constitutional-monarchy': -0.1, 'municipal-autonomy': 0.95, 'confederal-coordination': 0.85 }),
         candidate('democratic-confederalism', 'Democratic Confederalism', 'Decentralized, pluralist, and confederal democratic organization.', { 'hereditary-authority': -0.65, 'constitutional-monarchy': -0.2, 'municipal-autonomy': 0.85, 'confederal-coordination': 0.95 }),
      ],
   ),
]

export const experimentalSpecialistModuleById = new Map(
   experimentalSpecialistModuleSpecs.map((module) => [module.id, module]),
)
