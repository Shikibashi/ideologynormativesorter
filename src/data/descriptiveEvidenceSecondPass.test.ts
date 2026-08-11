import { describe, expect, it } from 'vitest'
import {
  DESCRIPTIVE_EVIDENCE_SECOND_PASS_VERSION,
  descriptiveEvidenceSecondPassById,
} from './descriptiveEvidenceSecondPass'
import { QUESTION_BANK_VERSION, coreQuestions, questionById } from './effectiveQuestions'

describe('second descriptive evidence pass', () => {
  it('attaches a public scope and source to every seventh-pass empirical rewrite', () => {
    expect(QUESTION_BANK_VERSION).toContain(DESCRIPTIVE_EVIDENCE_SECOND_PASS_VERSION)
    expect(Object.keys(descriptiveEvidenceSecondPassById)).toHaveLength(9)

    for (const [id, evidence] of Object.entries(descriptiveEvidenceSecondPassById)) {
      const question = questionById.get(id)
      expect(question, `${id} evidence references a missing item`).toBeDefined()
      expect(question!.layer).toBe('descriptive')
      expect(evidence.evidenceNote.length).toBeGreaterThan(100)
      expect(evidence.sources.length).toBeGreaterThan(0)
      for (const item of evidence.sources) {
        expect(item.title.length).toBeGreaterThan(8)
        expect(item.publisher?.length ?? 0).toBeGreaterThan(2)
        expect(item.url).toMatch(/^https:\/\//)
      }
    }
  })

  it('leaves no active descriptive item without operational context and a public source', () => {
    const activeDescriptive = coreQuestions.filter((question) => question.active !== false && question.layer === 'descriptive')

    expect(activeDescriptive).toHaveLength(34)
    expect(activeDescriptive.every((question) => Boolean(question.evidenceNote?.trim()))).toBe(true)
    expect(activeDescriptive.every((question) => (question.sources?.length ?? 0) > 0)).toBe(true)
  })
})
