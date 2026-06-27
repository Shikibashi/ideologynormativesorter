import { describe, expect, it } from 'vitest'
import type { Question } from '../types'
import { getQuestionHelpText, getSalienceHelpText } from './questionHelpText'

const baseQuestion: Question = {
  id: 'test-question',
  prompt: 'People should have meaningful exit rights from political authority.',
  domain: 'state-legitimacy',
  layer: 'normative',
  theoryContext: 'mixed',
  responseType: 'likert7',
  tier: 'quick',
  axisWeights: [{ axisId: 'authority-legitimacy', weight: -1 }],
}

describe('question help text', () => {
  it('defines prompt terms and explains the measured axis', () => {
    const helpText = getQuestionHelpText(baseQuestion)

    expect(helpText).toContain('“Exit” means')
    expect(helpText).toContain('This question measures what you think is morally justified')
    expect(helpText).toContain('authority legitimacy')
  })

  it('uses statement option weights when the question has no question-level axis weights', () => {
    const helpText = getQuestionHelpText({
      ...baseQuestion,
      prompt: 'Which comes closest to your view of when political authority is justified?',
      responseType: 'statementChoice',
      axisWeights: [],
      statementOptions: [
        { id: 'a', text: 'Authority is usually justified.', axisWeights: [{ axisId: 'authority-legitimacy', weight: 0.7 }] },
        { id: 'b', text: 'Authority is rarely justified.', axisWeights: [{ axisId: 'anti-domination', weight: 0.4 }] },
      ],
    })

    expect(helpText).toContain('authority legitimacy')
  })

  it('provides help text for salience follow-up questions', () => {
    expect(getSalienceHelpText('confidence')).toContain('“Confidence” means')
    expect(getSalienceHelpText('priority')).toContain('“Priority” means')
  })
})
