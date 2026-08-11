import { describe, expect, it } from 'vitest'
import { DESCRIPTIVE_EVIDENCE_VERSION, descriptiveEvidenceById } from './descriptiveEvidence'
import { QUESTION_BANK_VERSION, coreQuestions, questionById } from './effectiveQuestions'

describe('descriptive evidence context', () => {
  it('versions the bank and attaches every reviewed evidence record to an active descriptive item', () => {
    expect(QUESTION_BANK_VERSION).toContain(DESCRIPTIVE_EVIDENCE_VERSION)
    expect(Object.keys(descriptiveEvidenceById)).toHaveLength(27)

    for (const [id, evidence] of Object.entries(descriptiveEvidenceById)) {
      const question = questionById.get(id)
      expect(question, `${id} evidence references a missing item`).toBeDefined()
      expect(question!.active, `${id} evidence references an inactive item`).not.toBe(false)
      expect(question!.layer).toBe('descriptive')
      expect(question!.evidenceNote).toBe(evidence.evidenceNote)
      expect(question!.sources).toEqual(evidence.sources)
      expect(evidence.evidenceNote.length).toBeGreaterThan(80)
      expect(evidence.sources.length).toBeGreaterThan(0)
      for (const source of evidence.sources) {
        expect(source.title.length).toBeGreaterThan(8)
        expect(source.publisher?.length ?? 0).toBeGreaterThan(2)
        expect(source.url).toMatch(/^https:\/\//)
      }
    }
  })

  it('reports partial source coverage rather than pretending every remaining descriptive item is operationalized', () => {
    const activeDescriptive = coreQuestions.filter((question) => question.active !== false && question.layer === 'descriptive')
    const sourced = activeDescriptive.filter((question) => (question.sources?.length ?? 0) > 0)
    const operationalized = activeDescriptive.filter((question) => Boolean(question.evidenceNote?.trim()))

    expect(activeDescriptive).toHaveLength(59)
    expect(sourced).toHaveLength(27)
    expect(operationalized).toHaveLength(27)
  })
})
