import { describe, expect, it } from 'vitest'
import type { AnswerMap } from '../types'
import {
  assignSpecialistModule,
  buildSpecialistQuestionForm,
  scoreSpecialistModule,
  specialistModuleDefinitions,
  specialistModuleById,
} from './index'

function answerMap(values: Record<string, number>): AnswerMap {
  return Object.fromEntries(
    Object.entries(values).map(([questionId, value]) => [questionId, { questionId, value }]),
  )
}

describe('specialist module registry', () => {
  it('contains unique, respondent-facing modules', () => {
    expect(specialistModuleDefinitions.length).toBeGreaterThanOrEqual(2)
    expect(new Set(specialistModuleDefinitions.map((module) => module.id)).size).toBe(specialistModuleDefinitions.length)
    for (const module of specialistModuleDefinitions) {
      expect(module.questions.length).toBeGreaterThanOrEqual(4)
      expect(module.criterionOptions.length).toBeGreaterThanOrEqual(4)
      expect(module.estimatedMinutes).toBeGreaterThan(0)
    }
  })

  it('assigns the same module across test and retest for a participant', () => {
    const first = assignSpecialistModule('p_example', 'pilot')
    const second = assignSpecialistModule('p_example', 'pilot')
    expect(first).toEqual(second)
  })

  it('spreads deterministic assignments across the available modules', () => {
    const assigned = new Set(
      Array.from({ length: 64 }, (_, index) => assignSpecialistModule(`p_${index}`, 'pilot').moduleId),
    )
    expect(assigned).toEqual(new Set(specialistModuleDefinitions.map((module) => module.id)))
  })

  it('uses a deterministic but administration-specific presentation order', () => {
    const assignment = assignSpecialistModule('p_order', 'pilot')
    const module = specialistModuleById.get(assignment.moduleId)
    expect(module).toBeDefined()

    const testForm = buildSpecialistQuestionForm(assignment.moduleId, 'p_order', 'test')
    const repeatTestForm = buildSpecialistQuestionForm(assignment.moduleId, 'p_order', 'test')
    const retestForm = buildSpecialistQuestionForm(assignment.moduleId, 'p_order', 'retest')

    expect(testForm.map((question) => question.id)).toEqual(repeatTestForm.map((question) => question.id))
    expect(new Set(testForm.map((question) => question.id))).toEqual(new Set(module?.questions.map((question) => question.id)))
    expect(retestForm.map((question) => question.id)).not.toEqual(testForm.map((question) => question.id))
  })

  it('adapts rich AnswerMap values into specialist scoring', () => {
    const feminist = specialistModuleDefinitions.find((module) => module.id === 'feminist-faction-module')
    expect(feminist).toBeDefined()
    const outcome = scoreSpecialistModule(
      'feminist-faction-module',
      answerMap({
        'fm-fem-1': 3,
        'fm-fem-2': 1,
        'fm-fem-3': 0,
        'fm-fem-4': 0,
        'fm-fem-5': -2,
        'fm-fem-6': 3,
        'fm-fem-7': -3,
        'fm-fem-8': -3,
      }),
    )
    expect(outcome.matches[0]?.id).toBe('liberal-feminism')
    expect(outcome.constructScores['legal-equality-reform']).toBeGreaterThan(0)
  })

  it('exposes an abstention state when a follow-up has no answered evidence', () => {
    const outcome = scoreSpecialistModule('feminist-faction-module', answerMap({}))

    expect(outcome.evidence?.status).toBe('insufficient-evidence')
    expect(outcome.matches.every((match) => match.insufficientEvidence && match.fit === 0)).toBe(true)
  })

  it('keeps experimental module matches separate and evidence-aware', () => {
    const module = specialistModuleById.get('green-morphology-module')
    expect(module).toBeDefined()

    const empty = scoreSpecialistModule('green-morphology-module', answerMap({}))
    expect(empty.evidence?.status).toBe('insufficient-evidence')
    expect(empty.matches.every((match) => match.status === 'insufficient evidence')).toBe(true)

    const answered = answerMap(Object.fromEntries(module!.questions.map((question) => [String(question.id), 3])))
    const outcome = scoreSpecialistModule('green-morphology-module', answered)
    expect(outcome.evidence?.status).toBe('sufficient')
    expect(outcome.matches[0]?.status).toBe('experimental')
    expect(outcome.matches.every((match) => match.evidenceStatus === 'sufficient')).toBe(true)
  })

  it('keeps identity criterion variants distinct without multiplying tradition ids', () => {
    const identity = specialistModuleDefinitions.find((module) => module.id === 'identity-sovereignty-module')
    expect(identity).toBeDefined()
    const optionIds = identity?.criterionOptions.map((option) => option.id) ?? []
    expect(optionIds).toContain('black-nationalism:community')
    expect(optionIds).toContain('black-nationalism:separatist')
    expect(optionIds).toContain('indigenism:institutional')
    expect(optionIds).toContain('indigenism:resurgence')
    expect(new Set(optionIds).size).toBe(optionIds.length)
  })
})
