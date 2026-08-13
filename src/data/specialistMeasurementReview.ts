import type { LabelId } from '../types'

export type SpecialistMeasurementReviewStatus =
   | 'focused-module'
   | 'role-experiment'
   | 'candidate-module'
   | 'experimental-module'

export interface SpecialistMeasurementReview {
   id: string
   status: SpecialistMeasurementReviewStatus
   labelIds: readonly LabelId[]
   relatedTraditionIds?: readonly string[]
   moduleId?: string
   constructs: readonly string[]
   measurementCaution?: string
   nextGate: string
}

/**
 * Measurement work is tracked separately from the public label taxonomy.
 * Literature alone does not promote a specialist into ordinary scoring.
 */
export const specialistMeasurementReviews: readonly SpecialistMeasurementReview[] = [
   {
      id: 'identity-sovereignty',
      status: 'focused-module',
      labelIds: ['ethnonationalist', 'multiculturalism', 'indigenism'],
      relatedTraditionIds: ['black-nationalism', 'pan-africanism'],
      moduleId: 'identity-sovereignty-module',
      constructs: [
         'ascriptive membership',
         'dominant-nation congruence',
         'pluralist accommodation',
         'minority self-government',
         'community autonomy',
         'territorial separatism',
         'decolonial land sovereignty',
         'institutional recognition',
         'autonomous resurgence',
         'Pan-African solidarity',
      ],
      measurementCaution: 'Black Nationalism is currently displayed only as community-autonomy or separatist self-determination orientations; Pan-African output is limited to solidarity and unity. Neither is a validated identity diagnosis.',
      nextGate: 'Validate focused-module reliability and role separation with respondent data before promoting candidate traditions or changing multiculturalism’s modifier role.',
   },
   {
      id: 'anarchist-families',
      status: 'experimental-module',
      labelIds: ['social-anarchism', 'anarcho-communist', 'individualist-anarchism', 'market-anarchism', 'mutualist', 'anarcho-syndicalism', 'anarcho-capitalist', 'minarchist'],
      moduleId: 'anarchist-families-module',
      constructs: [
         'anti-authority',
         'market and communal coordination',
         'property regime',
         'direct federation and strategy',
      ],
      measurementCaution: 'The module distinguishes family-level affinities; it does not establish a single identity, historical affiliation, or settled boundary between anarchism and minarchism. Its Social / Communal Anarchism result is an experimental family signal, not a parent of mutualism or market anarchism. In particular, its present four constructs cannot distinguish Proudhonian mutualism, the Tuckerite and Labadie lines within American individualist anarchism, Swartz’s later restatement, or contemporary mutualist and C4SS-adjacent left-market-anarchist work.',
      nextGate: 'Before naming mutualist lineages, add and expert-review separate constructs for property or possession claims, anti-rent and monopoly analysis, mutual-credit or cooperative provision, individual sovereignty versus federation, and counter-economic strategy; then evaluate coverage, internal structure, test-retest stability, and false-positive separation with respondent data.',
   },
   {
      id: 'green-morphology',
      status: 'experimental-module',
      labelIds: ['deep-ecology', 'degrowth-green', 'ecomodernist', 'ecosocialist', 'green-capitalism'],
      moduleId: 'green-morphology-module',
      constructs: [
         'ecological moral standing',
         'post-growth orientation',
         'market and technology strategy',
         'democratic decentralism',
      ],
      measurementCaution: 'Green profiles may be multi-affinity: ecological concern, growth skepticism, technology confidence, and governance preferences are intentionally not forced into one scale.',
      nextGate: 'Test multi-affinity scoring, construct independence, criterion interpretation, and stability before promoting ecological subtypes or treating a high fit as a singular green identity.',
   },
   {
      id: 'socialist-families',
      status: 'experimental-module',
      labelIds: ['democratic-socialist', 'marxian-socialism', 'market-socialist', 'guild-socialism', 'council-communist', 'syndicalist', 'maoism', 'trotskyism'],
      moduleId: 'socialist-families-module',
      constructs: [
         'social ownership',
         'democratic planning',
         'reformism',
         'revolutionary strategy',
      ],
      measurementCaution: 'The module separates ownership and strategy rather than treating socialism as one party, state, or economic mechanism.',
      nextGate: 'Assess construct reliability, differentiation from the broad socialist anchors, and fairness across respondents before promoting any socialist variant into ordinary scoring.',
   },
   {
      id: 'conservative-variants',
      status: 'experimental-module',
      labelIds: ['conservative', 'social-conservatism', 'national-conservatism', 'christian-democrat', 'liberal-conservatism', 'neoconservative'],
      moduleId: 'conservative-variants-module',
      constructs: [
         'prudential continuity',
         'moral traditionalism',
         'national continuity',
         'assertive internationalism',
      ],
      measurementCaution: 'Conservative variants share a family name but can diverge over social norms, nation, markets, democracy, welfare, and foreign policy; the module is not a generic conservatism detector.',
      nextGate: 'Validate separation among prudential, social, national, Christian-democratic, liberal-conservative, and neoconservative dimensions before changing public primary roles.',
   },
   {
      id: 'religious-constitutionalism',
      status: 'experimental-module',
      labelIds: ['islamic-democracy', 'political-islam', 'theocrat'],
      moduleId: 'religious-national-politics-module',
      constructs: [
         'popular constitutional sovereignty',
         'religious legal authority',
         'constitutional review and interpretation',
         'minority and equal-citizenship protection',
         'clerical institutional power',
         'electoral and party competition',
         'constitutional review as a rights constraint',
         'peaceful party alternation',
         'Islamic public-law framing',
         'interpretive pluralism',
      ],
      nextGate: 'Pool respondent data from the v10 construct-matched module, test separation of Islamic democratic constitutionalism, broad Political Islam, and the two-item final-religious-legal-authority comparison, and keep all current labels provisional until those tests pass.',
      measurementCaution: 'The Theocratic Politics comparison is a direct but narrow experimental affinity: it requires a two-item direct measure of final religious authority over civil-law legitimacy, not private faith, establishment, national identity, one religion, or an empirically validated respondent identity.',
   },
   {
      id: 'religious-national-variants',
      status: 'experimental-module',
      labelIds: ['hindutva', 'zionism', 'religious-nationalism'],
      moduleId: 'religious-national-politics-module',
      constructs: [
         'religious or civilizational national membership',
         'religious-national fusion',
         'state and majority-community congruence',
         'minority citizenship and pluralism',
         'territorial self-determination',
         'religious authority in public law',
         'Hindu civilizational belonging',
         'Jewish national self-determination',
      ],
      nextGate: 'Pool respondent data from the v10 module and test whether the direct religious-national fusion construct, Hindu civilizational belonging, Jewish national self-determination, and religious-national variants separate reliably before adding subtypes or interpreting a single centroid as precise.',
   },
   {
      id: 'sensitive-compound-outputs',
      status: 'candidate-module',
      labelIds: ['fascist-authoritarian', 'welfare-chauvinism', 'eco-authoritarianism', 'christian-reconstructionism', 'fundamentalist-theocracy'],
      constructs: [
         'palingenetic national rebirth and fascist mobilization',
         'welfare or service access restricted by a named in-group boundary',
         'ecological enforcement that overrides ordinary democratic or rights constraints',
         'theonomic biblical civil-law authority',
         'literalist or fundamentalist scriptural authority in coercive law',
      ],
      measurementCaution: 'These labels remain browsable and sourced, but ordinary axes such as authority, nationalism, religiosity, redistribution, or ecological concern are not substitutes for their defining constructs. They must not be returned as ordinary results until a dedicated follow-up measures those constructs and is empirically evaluated.',
      nextGate: 'Design separate expert-reviewed items for each defining construct, complete cognitive interviewing and false-positive review, then assign a versioned opt-in module before enabling any respondent-facing specialist match.',
   },
   {
      id: 'technology-governance-variants',
      status: 'experimental-module',
      labelIds: ['accelerationism', 'cyberocracy', 'techno-anarchism'],
      moduleId: 'technology-governance-module',
      constructs: [
         'technology intensification as transformation strategy',
         'algorithmic or cybernetic administrative authority',
         'privacy and decentralized infrastructure',
         'market, state, and commons coordination',
         'left, right, and technology-centered acceleration variants',
         'market intensification versus post-capitalist redirection',
      ],
      nextGate: 'Pool respondent data from the v5 technology-governance module and test the separation of accelerationist direction, cyberocratic authority, and techno-anarchist infrastructure preferences before splitting or promoting emerging labels.',
   },
   {
      id: 'monarchist-municipal',
      status: 'experimental-module',
      labelIds: ['absolute-monarchist', 'traditional-monarchist', 'constitutional-monarchism', 'libertarian-municipalism', 'democratic-confederalism'],
      moduleId: 'monarchist-municipal-module',
      constructs: [
         'hereditary authority',
         'constitutional monarchy',
         'municipal autonomy',
         'confederal coordination',
      ],
      measurementCaution: 'This family crosses regime type and decentralized governance; a municipal or confederal preference is not itself a monarchist commitment.',
      nextGate: 'Validate regime-type and decentralization constructs separately, including respondents who combine constitutional monarchy with local autonomy or confederal governance.',
   },
]

export const specialistMeasurementReviewById = new Map(
   specialistMeasurementReviews.map((review) => [review.id, review]),
)
