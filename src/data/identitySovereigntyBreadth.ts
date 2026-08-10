import type { Question } from '../types'

export const IDENTITY_SOVEREIGNTY_MODULE_ID = 'identity-sovereignty-module'

export type IdentitySovereigntyConstructId =
  | 'ascriptive-membership'
  | 'dominant-nation-congruence'
  | 'pluralist-accommodation'
  | 'minority-self-government'
  | 'community-autonomy'
  | 'territorial-separatism'
  | 'decolonial-land-sovereignty'
  | 'recognition-vs-refusal'
  | 'pan-african-solidarity'

export interface IdentitySovereigntyModuleItem {
  question: Question
  constructWeights: Partial<Record<IdentitySovereigntyConstructId, number>>
}

export type IdentitySovereigntyTraditionStatus =
  | 'existing-primary'
  | 'existing-modifier'
  | 'existing-specialist'
  | 'candidate-specialist'
  | 'candidate-role-review'

export interface IdentitySovereigntyTraditionProfile {
  id: string
  name: string
  status: IdentitySovereigntyTraditionStatus
  variant: string
  description: string
  constructSignals: Partial<Record<IdentitySovereigntyConstructId, number>>
}

export interface IdentitySovereigntyTraditionMatch {
  id: string
  name: string
  status: IdentitySovereigntyTraditionStatus
  variant: string
  distance: number
  fit: number
}

export const IDENTITY_SOVEREIGNTY_CONSTRUCT_IDS: readonly IdentitySovereigntyConstructId[] = [
  'ascriptive-membership',
  'dominant-nation-congruence',
  'pluralist-accommodation',
  'minority-self-government',
  'community-autonomy',
  'territorial-separatism',
  'decolonial-land-sovereignty',
  'recognition-vs-refusal',
  'pan-african-solidarity',
]

const nationalQuestionFields = {
  domain: 'national-identity-sovereignty',
  theoryContext: 'mixed' as const,
  responseType: 'likert7' as const,
  tier: 'extensive' as const,
  module: IDENTITY_SOVEREIGNTY_MODULE_ID,
}

const raceQuestionFields = {
  domain: 'race-ethnicity-multiculturalism',
  theoryContext: 'mixed' as const,
  responseType: 'likert7' as const,
  tier: 'extensive' as const,
  module: IDENTITY_SOVEREIGNTY_MODULE_ID,
}

/**
 * Specialist-only measurement items for identity, minority self-determination,
 * decolonial sovereignty, and Pan-African politics. These stay outside ordinary
 * quiz tiers. The local construct weights carry distinctions that the global
 * axis model cannot safely infer from generic nationalism questions alone.
 */
export const identitySovereigntyModuleItems: IdentitySovereigntyModuleItem[] = [
  {
    question: {
      id: 'fm-id-1',
      prompt:
        'A nation is fundamentally a people connected by shared ancestry and inherited culture, not simply everyone who holds the same citizenship.',
      layer: 'normative',
      ...nationalQuestionFields,
      axisWeights: [{ axisId: 'political-community-boundary', weight: -0.8 }],
    },
    constructWeights: { 'ascriptive-membership': 1 },
  },
  {
    question: {
      id: 'fm-id-2',
      prompt:
        "People who adopt a country's civic institutions and public culture can become full members of the nation regardless of ancestry.",
      layer: 'normative',
      ...nationalQuestionFields,
      axisWeights: [
        { axisId: 'anti-domination', weight: 0.3 },
        { axisId: 'political-community-boundary', weight: 0.3 },
      ],
    },
    constructWeights: { 'ascriptive-membership': -1 },
  },
  {
    question: {
      id: 'fm-id-3',
      prompt:
        'A state may legitimately give political priority to preserving the demographic and cultural predominance of its historic core nation.',
      layer: 'normative',
      ...nationalQuestionFields,
      axisWeights: [
        { axisId: 'political-community-boundary', weight: -0.7 },
        { axisId: 'anti-domination', weight: -0.4 },
      ],
    },
    constructWeights: {
      'dominant-nation-congruence': 1,
      'pluralist-accommodation': -0.4,
    },
  },
  {
    question: {
      id: 'fm-id-4',
      prompt:
        'Equal citizenship is incompatible with giving the majority ethnocultural group a permanent privileged political status.',
      layer: 'normative',
      ...raceQuestionFields,
      axisWeights: [
        { axisId: 'anti-domination', weight: 0.8 },
        { axisId: 'equality-theory', weight: 0.4 },
      ],
    },
    constructWeights: {
      'dominant-nation-congruence': -1,
      'pluralist-accommodation': 0.5,
    },
  },
  {
    question: {
      id: 'fm-id-5',
      prompt:
        'Equal citizenship can require group-differentiated accommodations such as language rights, exemptions, or guaranteed representation for minority communities.',
      layer: 'normative',
      ...raceQuestionFields,
      axisWeights: [
        { axisId: 'anti-domination', weight: 0.7 },
        { axisId: 'equality-theory', weight: 0.4 },
      ],
    },
    constructWeights: { 'pluralist-accommodation': 1 },
  },
  {
    question: {
      id: 'fm-id-6',
      prompt:
        'Common citizenship is usually best protected by applying the same public rules and institutions to everyone rather than granting group-differentiated accommodations.',
      layer: 'normative',
      ...raceQuestionFields,
      axisWeights: [{ axisId: 'equality-theory', weight: -0.3 }],
    },
    constructWeights: { 'pluralist-accommodation': -1 },
  },
  {
    question: {
      id: 'fm-id-7',
      prompt:
        'Peoples coercively incorporated into a larger state can have a right to durable self-government beyond the equal individual rights of their members.',
      layer: 'normative',
      ...nationalQuestionFields,
      axisWeights: [{ axisId: 'anti-domination', weight: 0.8 }],
    },
    constructWeights: {
      'minority-self-government': 1,
      'pluralist-accommodation': 0.4,
    },
  },
  {
    question: {
      id: 'fm-id-8',
      prompt:
        'Minority nations should generally pursue influence through common political institutions rather than autonomous governments of their own.',
      layer: 'prescriptive',
      ...nationalQuestionFields,
      priorityPrompt: 'How important is this institutional preference to your overall outlook?',
      axisWeights: [
        { axisId: 'centralization-preference', weight: 0.5 },
        { axisId: 'state-action-vs-exit', weight: 0.3 },
      ],
    },
    constructWeights: { 'minority-self-government': -1 },
  },
  {
    question: {
      id: 'fm-id-9',
      prompt:
        'Historically subordinated communities can reasonably build independent schools, businesses, organizations, and political institutions to increase collective autonomy.',
      layer: 'prescriptive',
      ...raceQuestionFields,
      priorityPrompt: 'How important is this community strategy to your overall outlook?',
      axisWeights: [
        { axisId: 'state-action-vs-exit', weight: -0.6 },
        { axisId: 'centralization-preference', weight: -0.5 },
      ],
    },
    constructWeights: { 'community-autonomy': 1 },
  },
  {
    question: {
      id: 'fm-id-10',
      prompt:
        'Collective self-reliance can be politically valuable even when a group neither seeks territorial separation nor a separate state.',
      layer: 'normative',
      ...raceQuestionFields,
      axisWeights: [{ axisId: 'anti-domination', weight: 0.4 }],
    },
    constructWeights: {
      'community-autonomy': 0.8,
      'territorial-separatism': -0.8,
    },
  },
  {
    question: {
      id: 'fm-id-11',
      prompt:
        'When a distinct people faces durable political domination, separate statehood can sometimes be morally preferable to autonomy inside the existing state.',
      layer: 'normative',
      ...nationalQuestionFields,
      axisWeights: [
        { axisId: 'anti-domination', weight: 0.5 },
        { axisId: 'political-community-boundary', weight: -0.4 },
      ],
    },
    constructWeights: {
      'territorial-separatism': 1,
      'minority-self-government': 0.5,
    },
  },
  {
    question: {
      id: 'fm-id-12',
      prompt:
        'Where robust self-government is possible, minority autonomy within a shared state should usually be preferred to drawing new sovereign borders.',
      layer: 'prescriptive',
      ...nationalQuestionFields,
      priorityPrompt: 'How important is this constitutional preference to your overall outlook?',
      axisWeights: [{ axisId: 'centralization-preference', weight: -0.3 }],
    },
    constructWeights: {
      'territorial-separatism': -1,
      'minority-self-government': 0.6,
    },
  },
  {
    question: {
      id: 'fm-id-13',
      prompt:
        'Colonial dispossession can continue through present-day institutions even when Indigenous people have formal citizenship and voting rights.',
      layer: 'descriptive',
      ...raceQuestionFields,
      allowDontKnow: true,
      confidencePrompt: 'How confident are you in this empirical claim?',
      axisWeights: [
        { axisId: 'cultural-plasticity', weight: -0.6 },
        { axisId: 'public-choice-skepticism', weight: 0.3 },
      ],
    },
    constructWeights: { 'decolonial-land-sovereignty': 1 },
  },
  {
    question: {
      id: 'fm-id-14',
      prompt:
        'Treaties, traditional territories, and continuing relationships to land can ground political authority that is not reducible to ordinary private property or municipal jurisdiction.',
      layer: 'normative',
      ...nationalQuestionFields,
      axisWeights: [
        { axisId: 'property-legitimacy', weight: -0.4 },
        { axisId: 'anti-domination', weight: 0.5 },
      ],
    },
    constructWeights: {
      'decolonial-land-sovereignty': 1,
      'minority-self-government': 0.4,
    },
  },
  {
    question: {
      id: 'fm-id-15',
      prompt:
        'Negotiated recognition, treaty implementation, and self-government agreements within existing states are durable routes to restoring Indigenous political authority.',
      layer: 'prescriptive',
      ...nationalQuestionFields,
      priorityPrompt: 'How important is this institutional route to your overall outlook?',
      axisWeights: [
        { axisId: 'electoralism-vs-direct-action', weight: 0.6 },
        { axisId: 'state-action-vs-exit', weight: 0.3 },
        { axisId: 'reform-vs-revolution', weight: -0.5 },
      ],
    },
    constructWeights: {
      'recognition-vs-refusal': -1,
      'minority-self-government': 0.5,
    },
  },
  {
    question: {
      id: 'fm-id-16',
      prompt:
        'Durable decolonization sometimes requires rebuilding Indigenous legal and political institutions without waiting for recognition from settler-state authorities.',
      layer: 'prescriptive',
      ...nationalQuestionFields,
      priorityPrompt: 'How important is this resurgence strategy to your overall outlook?',
      axisWeights: [
        { axisId: 'electoralism-vs-direct-action', weight: -0.5 },
        { axisId: 'state-action-vs-exit', weight: -0.5 },
        { axisId: 'reform-vs-revolution', weight: 0.4 },
      ],
    },
    constructWeights: {
      'recognition-vs-refusal': 1,
      'decolonial-land-sovereignty': 0.5,
    },
  },
  {
    question: {
      id: 'fm-id-17',
      prompt:
        'African peoples and African-descended diasporas have special political reasons for solidarity across existing national borders.',
      layer: 'normative',
      ...raceQuestionFields,
      axisWeights: [{ axisId: 'political-community-boundary', weight: -0.2 }],
    },
    constructWeights: { 'pan-african-solidarity': 1 },
  },
  {
    question: {
      id: 'fm-id-18',
      prompt:
        'African unity can justify building continental or transnational political institutions even when existing states surrender some sovereign discretion.',
      layer: 'prescriptive',
      ...nationalQuestionFields,
      priorityPrompt: 'How important is this transnational goal to your overall outlook?',
      axisWeights: [{ axisId: 'centralization-preference', weight: 0.4 }],
    },
    constructWeights: { 'pan-african-solidarity': 1 },
  },
]

export const identitySovereigntyModuleQuestions: Question[] = identitySovereigntyModuleItems.map(
  (item) => item.question,
)

/**
 * These profiles are measurement hypotheses, not mutually exclusive result
 * labels. Black Nationalism and Indigenism intentionally have more than one
 * profile because the literature contains substantively distinct variants.
 */
export const identitySovereigntyTraditionProfiles: IdentitySovereigntyTraditionProfile[] = [
  {
    id: 'ethnonationalist',
    name: 'Ethnonationalism',
    status: 'existing-primary',
    variant: 'core ethnonationalism',
    description:
      'Defines nationhood primarily through inherited descent and culture and gives political weight to congruence between the state and the historic core nation.',
    constructSignals: {
      'ascriptive-membership': 0.95,
      'dominant-nation-congruence': 0.9,
      'pluralist-accommodation': -0.65,
    },
  },
  {
    id: 'multiculturalism',
    name: 'Multiculturalism',
    status: 'existing-modifier',
    variant: 'liberal multiculturalism',
    description:
      'Supports recognition and accommodation of cultural difference within shared citizenship, including differentiated rights or self-government where justified.',
    constructSignals: {
      'ascriptive-membership': -0.6,
      'dominant-nation-congruence': -0.75,
      'pluralist-accommodation': 0.95,
      'minority-self-government': 0.4,
    },
  },
  {
    id: 'black-nationalism',
    name: 'Black Nationalism',
    status: 'candidate-specialist',
    variant: 'community nationalism',
    description:
      'Emphasizes Black community autonomy, institution-building, self-reliance, and collective power without requiring territorial separation or independent statehood.',
    constructSignals: {
      'community-autonomy': 0.95,
      'territorial-separatism': -0.45,
      'minority-self-government': 0.45,
      'pan-african-solidarity': 0.25,
    },
  },
  {
    id: 'black-nationalism',
    name: 'Black Nationalism',
    status: 'candidate-specialist',
    variant: 'separatist nationalism',
    description:
      'Combines Black collective autonomy with a stronger preference for territorial separation, independent political authority, or separate statehood.',
    constructSignals: {
      'community-autonomy': 0.8,
      'territorial-separatism': 0.95,
      'minority-self-government': 0.7,
      'pan-african-solidarity': 0.2,
    },
  },
  {
    id: 'indigenism',
    name: 'Indigenous Sovereignty / Indigenism',
    status: 'existing-specialist',
    variant: 'institutional self-government',
    description:
      'Centers Indigenous collective self-government, treaty and territorial authority, and negotiated restoration of political jurisdiction within or alongside existing states.',
    constructSignals: {
      'minority-self-government': 0.9,
      'decolonial-land-sovereignty': 0.85,
      'recognition-vs-refusal': -0.55,
      'pluralist-accommodation': 0.4,
    },
  },
  {
    id: 'indigenism',
    name: 'Indigenous Sovereignty / Indigenism',
    status: 'existing-specialist',
    variant: 'resurgence and refusal',
    description:
      'Treats settler-colonial authority and dispossession as continuing structures and emphasizes resurgence, refusal, land-based political relations, and rebuilding Indigenous institutions on their own terms.',
    constructSignals: {
      'minority-self-government': 0.8,
      'decolonial-land-sovereignty': 0.95,
      'recognition-vs-refusal': 0.95,
      'community-autonomy': 0.4,
    },
  },
  {
    id: 'pan-africanism',
    name: 'Pan-Africanism',
    status: 'candidate-role-review',
    variant: 'transnational solidarity and unity',
    description:
      'Treats African peoples and African-descended diasporas as linked by political interests that can justify transnational solidarity, coordination, or African political unity across existing state borders.',
    constructSignals: {
      'pan-african-solidarity': 0.95,
    },
  },
]

export type IdentitySovereigntyAnswers = Readonly<Record<string, number | undefined>>

export function scoreIdentitySovereigntyConstructs(
  answers: IdentitySovereigntyAnswers,
): Record<IdentitySovereigntyConstructId, number> {
  const scores = Object.fromEntries(
    IDENTITY_SOVEREIGNTY_CONSTRUCT_IDS.map((constructId) => [
      constructId,
      { numerator: 0, denominator: 0 },
    ]),
  ) as Record<IdentitySovereigntyConstructId, { numerator: number; denominator: number }>

  for (const item of identitySovereigntyModuleItems) {
    const raw = answers[item.question.id]
    if (raw === undefined || !Number.isFinite(raw)) continue
    const normalized = Math.max(-1, Math.min(1, raw / 3))

    for (const constructId of IDENTITY_SOVEREIGNTY_CONSTRUCT_IDS) {
      const weight = item.constructWeights[constructId]
      if (weight === undefined || weight === 0) continue
      scores[constructId].numerator += normalized * weight
      scores[constructId].denominator += Math.abs(weight)
    }
  }

  return Object.fromEntries(
    IDENTITY_SOVEREIGNTY_CONSTRUCT_IDS.map((constructId) => {
      const score = scores[constructId]
      return [constructId, score.denominator === 0 ? 0 : score.numerator / score.denominator]
    }),
  ) as Record<IdentitySovereigntyConstructId, number>
}

export function identitySovereigntySignalDistance(
  profile: Record<IdentitySovereigntyConstructId, number>,
  signals: Partial<Record<IdentitySovereigntyConstructId, number>>,
): number {
  const entries = Object.entries(signals) as Array<[IdentitySovereigntyConstructId, number]>
  if (entries.length === 0) return 2

  const meanSquared = entries.reduce((sum, [constructId, target]) => {
    const delta = profile[constructId] - target
    return sum + delta * delta
  }, 0) / entries.length

  return Math.sqrt(meanSquared)
}

/**
 * Returns independent affinities. When a tradition has multiple validated
 * profiles, the best-fitting variant is retained. A high score for one
 * tradition does not suppress another tradition's score.
 */
export function scoreIdentitySovereigntyTraditions(
  answers: IdentitySovereigntyAnswers,
): IdentitySovereigntyTraditionMatch[] {
  const profile = scoreIdentitySovereigntyConstructs(answers)
  const bestById = new Map<string, IdentitySovereigntyTraditionMatch>()

  for (const tradition of identitySovereigntyTraditionProfiles) {
    const distance = identitySovereigntySignalDistance(profile, tradition.constructSignals)
    const match: IdentitySovereigntyTraditionMatch = {
      id: tradition.id,
      name: tradition.name,
      status: tradition.status,
      variant: tradition.variant,
      distance,
      fit: Math.max(0, Math.min(1, 1 - distance / 2)),
    }

    const existing = bestById.get(tradition.id)
    if (!existing || match.distance < existing.distance) bestById.set(tradition.id, match)
  }

  return [...bestById.values()].sort((left, right) => left.distance - right.distance)
}
