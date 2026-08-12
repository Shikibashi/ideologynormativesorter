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
      labelIds: ['anarcho-communist', 'individualist-anarchism', 'mutualist', 'anarcho-syndicalism', 'anarcho-capitalist', 'minarchist'],
      moduleId: 'anarchist-families-module',
      constructs: [
         'anti-authority',
         'market and communal coordination',
         'property regime',
         'direct federation and strategy',
      ],
      measurementCaution: 'The module distinguishes family-level affinities; it does not establish a single identity, historical affiliation, or settled boundary between anarchism and minarchism.',
      nextGate: 'Evaluate construct coverage, internal structure, test-retest stability, and false-positive separation before presenting any anarchist subtype as a validated specialist result.',
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
      labelIds: ['market-socialist', 'council-communist', 'syndicalist', 'maoism', 'trotskyism'],
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
      labelIds: ['islamic-democracy', 'political-islam'],
      moduleId: 'religious-national-politics-module',
      constructs: [
         'popular constitutional sovereignty',
         'religious legal authority',
         'constitutional review and interpretation',
         'minority and equal-citizenship protection',
         'clerical institutional power',
         'electoral and party competition',
      ],
      nextGate: 'Create a construct-matched module distinguishing Islamic democratic constitutionalism from broad Political Islam and theocratic politics; keep all current labels provisional until separation tests pass.',
      measurementCaution: 'The existing scored label remains a sourced catalog definition, not a specialist measurement result.',
   },
   {
      id: 'religious-national-variants',
      status: 'experimental-module',
      labelIds: ['hindutva', 'zionism'],
      moduleId: 'religious-national-politics-module',
      constructs: [
         'religious or civilizational national membership',
         'state and majority-community congruence',
         'minority citizenship and pluralism',
         'territorial self-determination',
         'religious authority in public law',
      ],
      nextGate: 'Separate internal variants before adding subtypes or interpreting a single centroid as a precise account of either tradition.',
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
      ],
      nextGate: 'Build separate construct-matched items before splitting or promoting emerging technology labels; retain experimental cautions in the meantime.',
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
