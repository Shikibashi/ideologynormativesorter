import { describe, expect, it } from 'vitest'
import {
  DESCRIPTIVE_EVIDENCE_THIRD_PASS_VERSION,
  descriptiveEvidenceThirdPassById,
} from './descriptiveEvidenceThirdPass'
import { QUESTION_BANK_VERSION, coreQuestions, questionById } from './effectiveQuestions'

describe('third descriptive evidence pass', () => {
  it('attaches public evidence to the restored democratic-confidence item', () => {
    expect(QUESTION_BANK_VERSION).toContain(DESCRIPTIVE_EVIDENCE_THIRD_PASS_VERSION)
    const evidence = descriptiveEvidenceThirdPassById.q0347
    const question = questionById.get('q0347')

    expect(question?.active).toBe(true)
    expect(question?.evidenceNote).toBe(evidence.evidenceNote)
    expect(question?.sources).toEqual(evidence.sources)
    expect(evidence.evidenceNote.length).toBeGreaterThan(100)
    expect(evidence.sources[0].url).toMatch(/^https:\/\//)
  })

  it('leaves every active descriptive item operationally scoped and sourced', () => {
    const activeDescriptive = coreQuestions.filter((question) =>
      question.active !== false && question.layer === 'descriptive',
    )

    expect(activeDescriptive).toHaveLength(34)
    expect(activeDescriptive.every((question) => Boolean(question.evidenceNote?.trim()))).toBe(true)
    expect(activeDescriptive.every((question) => (question.sources?.length ?? 0) > 0)).toBe(true)
  })
})
