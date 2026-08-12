import { describe, expect, it } from 'vitest'
import { allQuestions, QUESTION_BANK_VERSION, questionById } from './effectiveQuestions'
import {
  applyQuestionContext,
  QUESTION_CONTEXT_VERSION,
  questionContextById,
} from './questionContext'

describe('question context overlay', () => {
  it('versions the effective bank and attaches each context record to an active question', () => {
    expect(QUESTION_BANK_VERSION).toContain(QUESTION_CONTEXT_VERSION)
    expect(Object.keys(questionContextById)).toHaveLength(7)

    for (const [id, context] of Object.entries(questionContextById)) {
      const question = questionById.get(id)
      expect(question, `${id} context references a missing item`).toBeDefined()
      expect(question!.active, `${id} context references an inactive item`).not.toBe(false)
      expect(context.contextNote.length).toBeGreaterThan(100)
      expect(context.sources.length).toBeGreaterThan(0)
      expect(question!.contextNote).toBe(context.contextNote)
      expect(question!.sources).toEqual(context.sources)
      for (const source of context.sources) {
        expect(source.title.length).toBeGreaterThan(8)
        expect(source.publisher?.length ?? 0).toBeGreaterThan(2)
        expect(source.url).toMatch(/^https:\/\//)
      }
    }
  })

  it('adds context without changing the scored question fields', () => {
    for (const id of Object.keys(questionContextById)) {
      const raw = allQuestions.find((question) => String(question.id) === id)
      const effective = questionById.get(id)
      expect(raw).toBeDefined()
      expect(effective).toBeDefined()
      const contextualized = applyQuestionContext(raw!)

      expect(contextualized.prompt).toBe(raw!.prompt)
      expect(contextualized.layer).toBe(raw!.layer)
      expect(contextualized.axisWeights).toEqual(raw!.axisWeights)
      expect(contextualized.statementOptions).toEqual(raw!.statementOptions)
      expect(contextualized.contextNote).toBe(questionContextById[id].contextNote)
      expect(effective!.contextNote).toBe(contextualized.contextNote)
    }
  })

  it('does not convert context sources into descriptive evidence metadata', () => {
    for (const id of Object.keys(questionContextById)) {
      const question = questionById.get(id)!
      expect(question.layer).not.toBe('descriptive')
      expect(question.evidenceNote).toBeUndefined()
    }
  })
})
