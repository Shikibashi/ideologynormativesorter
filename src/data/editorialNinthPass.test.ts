import { describe, expect, it } from 'vitest'
import { coreQuestions, QUESTION_BANK_VERSION, questionById } from './effectiveQuestions'
import {
  EDITORIAL_NINTH_PASS_VERSION,
  ninthPassRewritesById,
  ninthPassStatementRewritesById,
} from './editorialNinthPass'
import { EXPERIMENTAL_SPECIALIST_VERSION } from './experimentalSpecialists'
import { specialistModuleDefinitions } from '../specialist'
import { EDITORIAL_TWENTIETH_PASS_VERSION } from './editorialTwentiethPass'
import { EDITORIAL_TWENTY_FIRST_PASS_VERSION } from './editorialTwentyFirstPass'
import { EDITORIAL_TWENTY_SECOND_PASS_VERSION } from './editorialTwentySecondPass'
import { EDITORIAL_TWENTY_THIRD_PASS_VERSION } from './editorialTwentyThirdPass'
import { EDITORIAL_TWENTY_FOURTH_PASS_VERSION } from './editorialTwentyFourthPass'
import { EDITORIAL_TWENTY_FIFTH_PASS_VERSION } from './editorialTwentyFifthPass'
import { EDITORIAL_TWENTY_SEVENTH_PASS_VERSION } from './editorialTwentySeventhPass'
import { EDITORIAL_TWENTY_EIGHTH_PASS_VERSION } from './editorialTwentyEighthPass'

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
    expect(activeCoreQuestions).toHaveLength(338)
    expect(specialistQuestions).toHaveLength(68)
    for (const question of [...activeCoreQuestions, ...specialistQuestions]) {
      expect(question.reviewStatus, `${question.id} review status`).toBe('approved')
      expect(question.version, `${question.id} review version`).toBeTruthy()
      expect(question.updatedAt, `${question.id} updatedAt`).toBeTruthy()
    }

    expect(activeCoreQuestions.filter((question) => question.version === EDITORIAL_NINTH_PASS_VERSION)).toHaveLength(82)
    expect(activeCoreQuestions.filter((question) => question.version === EDITORIAL_TWENTIETH_PASS_VERSION)).toHaveLength(2)
    expect(activeCoreQuestions.filter((question) => question.version === EDITORIAL_TWENTY_FIRST_PASS_VERSION)).toHaveLength(3)
    expect(activeCoreQuestions.filter((question) => question.version === EDITORIAL_TWENTY_SECOND_PASS_VERSION)).toHaveLength(6)
    expect(activeCoreQuestions.filter((question) => question.version === EDITORIAL_TWENTY_THIRD_PASS_VERSION)).toHaveLength(11)
    expect(activeCoreQuestions.filter((question) => question.version === EDITORIAL_TWENTY_FOURTH_PASS_VERSION)).toHaveLength(2)
    expect(activeCoreQuestions.filter((question) => question.version === EDITORIAL_TWENTY_FIFTH_PASS_VERSION)).toHaveLength(20)
    expect(activeCoreQuestions.filter((question) => question.version === EDITORIAL_TWENTY_SEVENTH_PASS_VERSION)).toHaveLength(2)
    expect(activeCoreQuestions.filter((question) => question.version === EDITORIAL_TWENTY_EIGHTH_PASS_VERSION)).toHaveLength(2)
    expect(EXPERIMENTAL_SPECIALIST_VERSION).toBe('2026-08-specialist-v10')
    expect(specialistQuestions.every((question) => question.version === EDITORIAL_NINTH_PASS_VERSION || question.version === EXPERIMENTAL_SPECIALIST_VERSION)).toBe(true)
  })
})
