import { describe, expect, it } from 'vitest'
import { QUESTION_BANK_VERSION, questionById } from './effectiveQuestions'
import {
  EDITORIAL_SIXTEENTH_PASS_VERSION,
  sixteenthPassRewritesById,
} from './editorialSixteenthPass'

describe('sixteenth editorial pass', () => {
  it('narrows the remaining referendum safeguard bundle', () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_SIXTEENTH_PASS_VERSION)
    const rewrite = sixteenthPassRewritesById.q0355
    const question = questionById.get('q0355')!

    expect(question.active).toBe(true)
    expect(question.layer).toBe('prescriptive')
    expect(question.prompt).toBe(rewrite.prompt)
    expect(question.evidenceNote).toBe(rewrite.evidenceNote)
    expect(question.sources).toHaveLength(rewrite.sourceIds.length)
    expect(question.sources?.every((source) => source.url.startsWith('https://'))).toBe(true)
    expect(question.version).toBe(EDITORIAL_SIXTEENTH_PASS_VERSION)
    expect(question.reviewStatus).toBe('approved')
    expect(question.prompt).not.toMatch(/fiscal notes|unpopular minorities/i)
  })
})
