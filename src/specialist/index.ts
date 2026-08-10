import type { AnswerMap, Question } from '../types'
import {
  FEMINIST_MODULE_ID,
  feministModuleItems,
  feministModuleQuestions,
  feministSpecialistCandidates,
  scoreFeministConstructs,
  scoreFeministSpecialists,
} from '../data/feministBreadth'
import {
  IDENTITY_SOVEREIGNTY_MODULE_ID,
  identitySovereigntyModuleItems,
  identitySovereigntyModuleQuestions,
  identitySovereigntyTraditionProfiles,
  scoreIdentitySovereigntyConstructs,
  scoreIdentitySovereigntyTraditions,
} from '../data/identitySovereigntyBreadth'

export type SpecialistModuleId = typeof FEMINIST_MODULE_ID | typeof IDENTITY_SOVEREIGNTY_MODULE_ID
export type SpecialistCriterionConfidence = 'low' | 'medium' | 'high'

export interface SpecialistCriterionOption {
  id: string
  traditionId: string
  label: string
  variant?: string
  description: string
}

export interface SpecialistCriterionResponse {
  selectedIds: string[]
  noneOrUnsure: boolean
  confidence: SpecialistCriterionConfidence
}

export interface SpecialistMatch {
  id: string
  name: string
  variant?: string
  status: string
  fit: number
}

export interface SpecialistOutcome {
  moduleId: SpecialistModuleId
  constructScores: Record<string, number>
  matches: SpecialistMatch[]
}

export interface SpecialistModuleDefinition {
  id: SpecialistModuleId
  version: string
  title: string
  shortTitle: string
  description: string
  invitationNote: string
  estimatedMinutes: number
  questions: Question[]
  criterionOptions: SpecialistCriterionOption[]
  constructWeightsByQuestionId: Record<string, Record<string, number>>
  score: (answers: AnswerMap) => SpecialistOutcome
}

export interface SpecialistModuleAssignment {
  moduleId: SpecialistModuleId
  strategy: typeof SPECIALIST_ASSIGNMENT_STRATEGY
}

export const SPECIALIST_ASSIGNMENT_STRATEGY = 'balanced-hash-v1' as const

function numericAnswers(answers: AnswerMap): Record<string, number | undefined> {
  return Object.fromEntries(
    Object.entries(answers).map(([questionId, answer]) => [
      questionId,
      typeof answer.value === 'number' ? answer.value : undefined,
    ]),
  )
}

function copyConstructWeights(
  items: Array<{ question: Question; constructWeights: Record<string, number> | Partial<Record<string, number>> }>,
): Record<string, Record<string, number>> {
  return Object.fromEntries(
    items.map((item) => [item.question.id, Object.fromEntries(
      Object.entries(item.constructWeights).filter((entry): entry is [string, number] => typeof entry[1] === 'number'),
    )]),
  )
}

const feministCriterionOptions: SpecialistCriterionOption[] = feministSpecialistCandidates.map((candidate) => ({
  id: candidate.id,
  traditionId: candidate.id,
  label: candidate.name,
  description: candidate.description,
}))

const identityCriterionOptions: SpecialistCriterionOption[] = identitySovereigntyTraditionProfiles.map((profile) => {
  const variantIds: Record<string, string> = {
    'black-nationalism:community nationalism': 'black-nationalism:community',
    'black-nationalism:separatist nationalism': 'black-nationalism:separatist',
    'indigenism:institutional self-government': 'indigenism:institutional',
    'indigenism:resurgence and refusal': 'indigenism:resurgence',
  }
  const id = variantIds[`${profile.id}:${profile.variant}`] ?? profile.id
  return {
    id,
    traditionId: profile.id,
    label: profile.name,
    variant: profile.variant,
    description: profile.description,
  }
})

const specialistModules: SpecialistModuleDefinition[] = [
  {
    id: FEMINIST_MODULE_ID,
    version: '2026-08-v1',
    title: 'Feminist political traditions',
    shortTitle: 'Feminist traditions',
    description:
      'A short follow-up that tests whether legal-equality, structural-patriarchy, socialist/materialist, and anti-hierarchical feminist traditions can be distinguished reliably.',
    invitationNote:
      'Questions concern gender, family, work, hierarchy, and political strategy. You may skip the module without affecting your main result or study participation.',
    estimatedMinutes: 3,
    questions: feministModuleQuestions,
    criterionOptions: feministCriterionOptions,
    constructWeightsByQuestionId: copyConstructWeights(feministModuleItems),
    score: (answers) => ({
      moduleId: FEMINIST_MODULE_ID,
      constructScores: scoreFeministConstructs(numericAnswers(answers)),
      matches: scoreFeministSpecialists(numericAnswers(answers)).map((match) => ({
        id: match.id,
        name: match.name,
        status: match.status,
        fit: match.fit,
      })),
    }),
  },
  {
    id: IDENTITY_SOVEREIGNTY_MODULE_ID,
    version: '2026-08-v1',
    title: 'Identity, nationalism, and sovereignty',
    shortTitle: 'Identity and sovereignty',
    description:
      'A follow-up that separates ethnonationalism, multicultural accommodation, minority self-government, Black nationalism, Indigenous sovereignty, and Pan-African solidarity.',
    invitationNote:
      'Questions concern race, ethnicity, nationhood, colonialism, Indigenous sovereignty, Black political autonomy, and Pan-Africanism. You may skip the module without affecting your main result or study participation.',
    estimatedMinutes: 6,
    questions: identitySovereigntyModuleQuestions,
    criterionOptions: identityCriterionOptions,
    constructWeightsByQuestionId: copyConstructWeights(identitySovereigntyModuleItems),
    score: (answers) => ({
      moduleId: IDENTITY_SOVEREIGNTY_MODULE_ID,
      constructScores: scoreIdentitySovereigntyConstructs(numericAnswers(answers)),
      matches: scoreIdentitySovereigntyTraditions(numericAnswers(answers)).map((match) => ({
        id: match.id,
        name: match.name,
        variant: match.variant,
        status: match.status,
        fit: match.fit,
      })),
    }),
  },
]

export const specialistModuleDefinitions: readonly SpecialistModuleDefinition[] = specialistModules
export const specialistModuleById = new Map(specialistModules.map((module) => [module.id, module]))

function hash32(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function assignSpecialistModule(participantId: string, studyId: string): SpecialistModuleAssignment {
  const index = hash32(`${studyId}:${participantId}:specialist-assignment`) % specialistModules.length
  return { moduleId: specialistModules[index].id, strategy: SPECIALIST_ASSIGNMENT_STRATEGY }
}

export function buildSpecialistQuestionForm(
  moduleId: SpecialistModuleId,
  participantId: string,
  administration: 'test' | 'retest',
): Question[] {
  const module = specialistModuleById.get(moduleId)
  if (!module) return []
  const seed = `${participantId}:${administration}:${moduleId}:presentation`
  return [...module.questions].sort((left, right) => {
    const leftHash = hash32(`${seed}:${left.id}`)
    const rightHash = hash32(`${seed}:${right.id}`)
    return leftHash - rightHash || String(left.id).localeCompare(String(right.id))
  })
}

export function scoreSpecialistModule(moduleId: SpecialistModuleId, answers: AnswerMap): SpecialistOutcome {
  const module = specialistModuleById.get(moduleId)
  if (!module) throw new Error(`Unknown specialist module: ${moduleId}`)
  return module.score(answers)
}
