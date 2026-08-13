import { describe, expect, it } from 'vitest'
import { QUESTION_BANK_VERSION, questionById } from './effectiveQuestions'
import {
  EDITORIAL_TWENTIETH_PASS_VERSION,
  twentiethPassRewritesById,
} from './editorialTwentiethPass'
import { confidenceCoverageTierPromotions, EDITORIAL_TWENTY_THIRD_PASS_VERSION } from './editorialTwentyThirdPass'
import { descriptiveConstructCorrectionsById, EDITORIAL_TWENTY_FIFTH_PASS_VERSION } from './editorialTwentyFifthPass'

describe('twentieth editorial pass', () => {
  it('registers and applies each research-scoped rewrite', () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_TWENTIETH_PASS_VERSION)
    expect(Object.keys(twentiethPassRewritesById)).toEqual(['q0007', 'q0067', 'q0107', 'q0328', 'q0402'])

    for (const [id, rewrite] of Object.entries(twentiethPassRewritesById)) {
      const question = questionById.get(id)!
      expect(question.active, id).toBe(true)
      expect(question.prompt, id).toBe(rewrite.prompt)
      expect(question.evidenceNote, id).toBe(rewrite.evidenceNote)
      expect(question.version, id).toBe(descriptiveConstructCorrectionsById[id]
        ? EDITORIAL_TWENTY_FIFTH_PASS_VERSION
        : confidenceCoverageTierPromotions[id]
          ? EDITORIAL_TWENTY_THIRD_PASS_VERSION
          : EDITORIAL_TWENTIETH_PASS_VERSION)
      expect(question.reviewStatus, id).toBe('approved')
      expect(question.sources?.length, id).toBeGreaterThanOrEqual(rewrite.sourceIds.length)
      expect(question.contextNote?.length, id).toBeGreaterThan(100)
    }
  })

  it('removes unsupported causal, universal, and conflated wording', () => {
    expect(questionById.get('q0007')?.prompt).toMatch(/comparisons|associated/i)
    expect(questionById.get('q0007')?.prompt).not.toMatch(/every public service|competitive market/i)
    expect(questionById.get('q0067')?.prompt).toMatch(/SNAP|recertification/i)
    expect(questionById.get('q0067')?.prompt).not.toMatch(/otherwise eligible recipients/i)
    expect(questionById.get('q0107')?.prompt).not.toMatch(/reduce exclusion/i)
    expect(questionById.get('q0328')?.prompt).not.toMatch(/security, and institutional knowledge/i)
    expect(questionById.get('q0402')?.prompt).not.toMatch(/overwhelming|before they materialize/i)
    expect(questionById.get('q0402')?.contextNote).toMatch(/preventive war|anticipatory self-defense/i)
  })
})
