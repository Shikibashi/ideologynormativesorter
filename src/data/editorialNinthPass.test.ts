import { describe, expect, it } from 'vitest'
import { coreQuestions, QUESTION_BANK_VERSION, questionById } from './effectiveQuestions'
import {
  EDITORIAL_NINTH_PASS_VERSION,
  ninthPassRewritesById,
  ninthPassStatementRewritesById,
} from './editorialNinthPass'
import { specialistModuleDefinitions } from '../specialist'

const activeCoreQuestions = coreQuestions.filter((question) => question.active !== false)
const specialistQuestions = specialistModuleDefinitions.flatMap((module) => module.questions)

describe('ninth editorial pass', () => {
  it('versions the bank and rewrites the four compound prompts without changing score fields', () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_NINTH_PASS_VERSION)
    expect(Object.keys(ninthPassRewritesById)).toEqual(['q0075', 'q0215', 'q0274', 'q0314'])

    for (const [id, rewrite] of Object.entries(ninthPassRewritesById)) {
      const question = questionById.get(id)
      expect(question, `${id} references a missing item`).toBeDefined()
      expect(question!.active).toBe(true)
      expect(question!.reviewStatus).toBe('approved')
      expect(question!.version).toBe(EDITORIAL_NINTH_PASS_VERSION)
      expect(question!.prompt).toBe(rewrite.prompt)
      expect(question!.axisWeights).toEqual({
        q0075: [
          { axisId: 'redistribution-vs-predistribution', weight: -0.9 },
          { axisId: 'regulation-vs-deregulation', weight: -0.7 },
          { axisId: 'state-action-vs-exit', weight: -0.3 },
        ],
        q0215: [
          { axisId: 'regulation-vs-deregulation', weight: -1 },
          { axisId: 'centralization-preference', weight: -0.8 },
          { axisId: 'gradualism-vs-immediatism', weight: 0.3 },
        ],
        q0274: [
          { axisId: 'regulation-vs-deregulation', weight: -1 },
          { axisId: 'state-action-vs-exit', weight: -0.8 },
          { axisId: 'redistribution-vs-predistribution', weight: 0.3 },
        ],
        q0314: [
          { axisId: 'regulation-vs-deregulation', weight: -1 },
          { axisId: 'centralization-preference', weight: -0.8 },
          { axisId: 'state-action-vs-exit', weight: 0.3 },
        ],
      }[id])
    }
  })

  it('makes the two reviewed statement-choice forms explicitly ipsative', () => {
    expect(Object.keys(ninthPassStatementRewritesById)).toEqual(['sq02', 'sq13'])

    for (const [id, rewrite] of Object.entries(ninthPassStatementRewritesById)) {
      const question = questionById.get(id)
      expect(question?.reviewStatus).toBe('approved')
      expect(question?.version).toBe(EDITORIAL_NINTH_PASS_VERSION)
      expect(question?.prompt).toBe(rewrite.prompt ?? question?.prompt)
      const options = question?.statementOptions ?? []
      expect(options).toHaveLength(4)
      expect(new Set(options.map((option) => option.text)).size).toBe(4)
      expect(new Set(options.map((option) => option.id)).size).toBe(4)
    }
  })

  it('stamps every previously unversioned active core and specialist item without erasing earlier pass history', () => {
    expect(activeCoreQuestions).toHaveLength(285)
    expect(specialistQuestions).toHaveLength(26)
    for (const question of [...activeCoreQuestions, ...specialistQuestions]) {
      expect(question.reviewStatus, `${question.id} review status`).toBe('approved')
      expect(question.version, `${question.id} review version`).toBeTruthy()
      expect(question.updatedAt, `${question.id} updatedAt`).toBeTruthy()
    }

    expect(activeCoreQuestions.filter((question) => question.version === EDITORIAL_NINTH_PASS_VERSION)).toHaveLength(88)
    expect(specialistQuestions.every((question) => question.version === EDITORIAL_NINTH_PASS_VERSION)).toBe(true)
  })
})
