import { describe, expect, it } from 'vitest'
import { QUESTION_BANK_VERSION, questionById } from './effectiveQuestions'
import {
  boundaryRewritesById,
  EDITORIAL_TWENTY_FOURTH_PASS_VERSION,
} from './editorialTwentyFourthPass'

describe('twenty-fourth editorial pass', () => {
  it('registers and applies each identity/religion boundary correction', () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_TWENTY_FOURTH_PASS_VERSION)
    expect(Object.keys(boundaryRewritesById)).toEqual(['q0405', 'q0415'])

    for (const [id, rewrite] of Object.entries(boundaryRewritesById)) {
      const question = questionById.get(id)!
      expect(question.active, id).toBe(true)
      expect(question.prompt, id).toBe(rewrite.prompt)
      expect(question.version, id).toBe(EDITORIAL_TWENTY_FOURTH_PASS_VERSION)
      expect(question.reviewStatus, id).toBe('approved')
    }
  })

  it('leaves the two questions on distinct, single-axis boundaries', () => {
    const civicMembership = questionById.get('q0415')!
    expect(civicMembership.layer).toBe('normative')
    expect(civicMembership.axisWeights).toEqual([
      { axisId: 'political-community-boundary', weight: 0.8 },
    ])
    expect(civicMembership.prompt).not.toMatch(/religious identity/i)

    const religiousLaw = questionById.get('q0405')!
    expect(religiousLaw.layer).toBe('normative')
    expect(religiousLaw.axisWeights).toEqual([
      { axisId: 'secularism-religious', weight: 1 },
      { axisId: 'moral-traditionalism', weight: 0.7 },
      { axisId: 'authority-legitimacy', weight: 0.4 },
    ])
    expect(religiousLaw.prompt).toMatch(/public law/i)
  })
})
