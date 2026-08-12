import { describe, expect, it } from 'vitest'
import { coreQuestions, allQuestions, QUESTION_BANK_VERSION } from './effectiveQuestions'
import {
  applyQuestionContext,
  isQuestionContextTarget,
  QUESTION_CONTEXT_VERSION,
  questionContextById,
  questionContextSources,
} from './questionContext'
import { specialistModuleDefinitions } from '../specialist'

const activeCoreQuestions = coreQuestions.filter((question) => question.active !== false)
const specialistQuestions = specialistModuleDefinitions.flatMap((module) => module.questions)
const contextTargets = [...activeCoreQuestions, ...specialistQuestions]

describe('question context overlay', () => {
  it('versions and covers every active core and specialist question', () => {
    expect(QUESTION_BANK_VERSION).toContain(QUESTION_CONTEXT_VERSION)
    expect(activeCoreQuestions).toHaveLength(285)
    expect(specialistQuestions).toHaveLength(26)
    expect(new Set(contextTargets.map((question) => question.id)).size).toBe(311)

    for (const question of contextTargets) {
      expect(isQuestionContextTarget(question), `${question.id} must be an overlay target`).toBe(true)
      expect(question.contextNote, `${question.id} needs context`).toBeTruthy()
      expect(question.contextNote!.length, `${question.id} context is too short`).toBeGreaterThan(100)
      expect(question.sources?.length, `${question.id} needs public sources`).toBeGreaterThan(0)
      for (const source of question.sources ?? []) {
        expect(source.title.length, `${question.id} source title`).toBeGreaterThan(2)
        expect(source.publisher?.length ?? 0, `${question.id} source publisher`).toBeGreaterThan(2)
        expect(source.url, `${question.id} source URL`).toMatch(/^https:\/\//)
      }
    }

    for (const [sourceId, source] of Object.entries(questionContextSources)) {
      expect(source.title, `${sourceId} source title`).toBeTruthy()
      expect(source.url, `${sourceId} source URL`).toMatch(/^https:\/\//)
    }
  })

  it('adds context without changing scored question fields', () => {
    for (const question of contextTargets) {
      const contextualized = applyQuestionContext(question)

      expect(contextualized.prompt).toBe(question.prompt)
      expect(contextualized.layer).toBe(question.layer)
      expect(contextualized.theoryContext).toBe(question.theoryContext)
      expect(contextualized.responseType).toBe(question.responseType)
      expect(contextualized.tier).toBe(question.tier)
      expect(contextualized.axisWeights).toEqual(question.axisWeights)
      expect(contextualized.statementOptions).toEqual(question.statementOptions)
      expect(contextualized.reverseScored).toBe(question.reverseScored)
    }
  })

  it('preserves existing descriptive evidence notes and exact source lists', () => {
    for (const question of activeCoreQuestions.filter((item) => item.layer === 'descriptive')) {
      const evidenceNote = question.evidenceNote
      const sources = question.sources
      const contextualized = applyQuestionContext(question)

      expect(evidenceNote).toBeTruthy()
      expect(contextualized.evidenceNote).toBe(evidenceNote)
      expect(contextualized.sources).toEqual(sources)
    }
  })

  it('does not leak context into the inert legacy module-question audit surface', () => {
    const legacyModuleQuestion = allQuestions.find((question) => question.id === 'fm-left-1')
    expect(legacyModuleQuestion).toBeDefined()
    expect(legacyModuleQuestion?.contextNote).toBeUndefined()
  })

  it('keeps explicit high-risk records resolvable', () => {
    for (const [id, record] of Object.entries(questionContextById)) {
      const question = contextTargets.find((candidate) => candidate.id === id)
      expect(question, `${id} context references a missing target`).toBeDefined()
      expect(record.contextNote?.length).toBeGreaterThan(100)
      expect(record.sourceIds?.length).toBeGreaterThan(0)
    }
  })
})
