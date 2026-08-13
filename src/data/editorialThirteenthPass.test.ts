import { describe, expect, it } from 'vitest'
import { QUESTION_BANK_VERSION, questionById } from './effectiveQuestions'
import {
  EDITORIAL_THIRTEENTH_PASS_VERSION,
  thirteenthPassRewritesById,
} from './editorialThirteenthPass'
import { descriptiveConstructCorrectionsById, EDITORIAL_TWENTY_FIFTH_PASS_VERSION } from './editorialTwentyFifthPass'

describe('thirteenth editorial pass', () => {
  it('narrows the three researched active items without changing their measurement layers', () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_THIRTEENTH_PASS_VERSION)
    expect(Object.keys(thirteenthPassRewritesById)).toEqual(['q0093', 'q0173', 'q0191'])

    for (const [id, rewrite] of Object.entries(thirteenthPassRewritesById)) {
      const question = questionById.get(id)!
      expect(question.active).toBe(true)
      expect(question.prompt).toBe(rewrite.prompt)
      expect(question.evidenceNote).toBe(rewrite.evidenceNote)
      expect(question.sources?.map((source) => source.title)).toEqual(
        rewrite.sourceIds.map((sourceId) => {
          if (sourceId === 'employmentRelationship') return 'R198 Employment Relationship Recommendation, 2006'
          if (sourceId === 'cooperativesWorkRights') return 'Cooperatives and the Fundamental Principles and Rights at Work'
          if (sourceId === 'labourRights') return 'ILO Helpdesk: Business and collective bargaining'
          if (sourceId === 'civilPoliticalRights') return 'International Covenant on Civil and Political Rights'
          if (sourceId === 'cryptography') return 'Guideline for Using Cryptographic Standards in the Federal Government: Cryptographic Mechanisms'
          if (sourceId === 'liberalism') return 'Liberalism'
          if (sourceId === 'pleaInnocenceEffect') return 'The Innocence Effect'
          if (sourceId === 'pleaMiscarriageJustice') return 'Plea Bargaining and the Miscarriage of Justice'
          throw new Error(`Unhandled source ${sourceId}`)
        }),
      )
      expect(question.version).toBe(descriptiveConstructCorrectionsById[id]
        ? EDITORIAL_TWENTY_FIFTH_PASS_VERSION
        : EDITORIAL_THIRTEENTH_PASS_VERSION)
      expect(question.reviewStatus).toBe('approved')
    }
  })

  it('removes the old compound and universal-sounding language', () => {
    expect(questionById.get('q0093')?.prompt).not.toMatch(/freelancing|partnerships|equal legal footing/i)
    expect(questionById.get('q0173')?.prompt).not.toMatch(/by default\.$/i)
    expect(questionById.get('q0191')?.prompt).not.toMatch(/overcharged|surrender trial rights/i)
    expect(questionById.get('q0191')?.evidenceNote).toMatch(/counterfactual trial outcomes are difficult to observe/i)
  })
})
