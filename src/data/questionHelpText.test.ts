import { describe, expect, it } from 'vitest'
import type { Question } from '../types'
import { axes } from './axes'
import { moduleQuestions } from './moduleQuestions'
import { getQuestionHelpText, getSalienceHelpText } from './questionHelpText'
import { questions } from './questions'

function stripTerminalPunctuation(value: string): string {
  return value.trim().replace(/[.!?]$/, '')
}

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
  const allQuestionItems = [...questions, ...moduleQuestions]

  it('defines prompt terms and explains the measurement in plain language without echoing the prompt', () => {
    const helpText = getQuestionHelpText(baseQuestion)

    expect(helpText).toContain('“Exit” means')
    expect(helpText).toContain('This question measures your moral judgment about state legitimacy, based on how strongly you agree')
    expect(helpText).not.toContain('people should have meaningful exit rights from political authority')
    expect(helpText).not.toContain('with scoring focused on')
  })

  it('keeps statement-choice help focused on the topic rather than internal axis labels or the literal prompt', () => {
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

    expect(helpText).not.toContain('with scoring focused on')
    expect(helpText).toContain('based on which statement you choose')
    expect(helpText).not.toContain('which comes closest to your view of when political authority is justified')
    expect(helpText).not.toContain('view of which comes closest')
    expect(helpText).not.toContain('view of which statement')
  })

  it('explains institutional-design prompts without leaking unrelated axis labels or the literal prompt', () => {
    const helpText = getQuestionHelpText({
      ...baseQuestion,
      prompt: 'Institutional design should assume rulers are ordinary incentive-driven actors, not guardians above politics.',
      layer: 'prescriptive',
      axisWeights: [
        { axisId: 'state-action-vs-exit', weight: 1 },
        { axisId: 'centralization-preference', weight: -0.8 },
      ],
    })

    expect(helpText).toContain('“Institutional design” means')
    expect(helpText).not.toContain('institutional design should assume rulers are ordinary incentive-driven actors')
    expect(helpText).not.toContain('State Action vs Exit')
    expect(helpText).not.toContain('state action vs exit')
  })

  it('uses the academic concept dictionary for matched terms', () => {
    const helpText = getQuestionHelpText({
      ...baseQuestion,
      prompt: 'Unchecked domination should matter even when officials usually act benevolently.',
      axisWeights: [{ axisId: 'anti-domination', weight: 1 }],
    })

    expect(helpText).toContain('“Domination” means')
    expect(helpText).not.toContain('unchecked domination should matter')
  })

  it('provides help text for salience follow-up questions', () => {
    expect(getSalienceHelpText('confidence')).toContain('“Confidence” means')
    expect(getSalienceHelpText('priority')).toContain('“Priority” means')
  })

  it('generates concise customer-facing help text for every core questionnaire item', () => {
    for (const question of questions) {
      const helpText = getQuestionHelpText(question)

      expect(helpText, `${question.id} is missing a definition`).toMatch(/^“.+”/)
      expect(helpText, `${question.id} is missing a measurement sentence`).toContain('This question measures')
      expect(helpText, `${question.id} should not echo the question prompt`).not.toContain(stripTerminalPunctuation(question.prompt).slice(0, 48).toLowerCase())
      expect(helpText.length, `${question.id} help text is too long`).toBeLessThanOrEqual(650)
    }
  })

  it('also generates customer-facing help text for module questionnaire items', () => {
    for (const question of moduleQuestions) {
      const helpText = getQuestionHelpText(question)

      expect(helpText, `${question.id} is missing a definition`).toMatch(/^“.+”/)
      expect(helpText, `${question.id} is missing a measurement sentence`).toContain('This question measures')
      expect(helpText, `${question.id} should not echo the question prompt`).not.toContain(stripTerminalPunctuation(question.prompt).slice(0, 48).toLowerCase())
      expect(helpText.length, `${question.id} help text is too long`).toBeLessThanOrEqual(650)
    }
  })

  it('keeps every generated explainer free of awkward nested-question wording', () => {
    const awkwardFragments = [
      'view of which comes closest',
      'view of which statement',
      'view of which best',
      'view of which captures',
      'whether you agree that which',
      'whether you agree that what',
      'whether you agree that how',
      'about about',
    ]

    for (const question of allQuestionItems) {
      const helpText = getQuestionHelpText(question)

      for (const fragment of awkwardFragments) {
        expect(helpText, `${question.id} uses awkward nested wording`).not.toContain(fragment)
      }
    }
  })

  it('does not expose internal axis names in generated question explainers', () => {
    for (const question of allQuestionItems) {
      const helpText = getQuestionHelpText(question)

      for (const axis of axes) {
        expect(helpText, `${question.id} leaks axis label ${axis.name}`).not.toContain(axis.name)
      }
    }
  })

  it('keeps every generated explainer free of scoring and implementation jargon', () => {
    const implementationFragments = [
      'axis',
      'axis-weight',
      'centroid',
      'likert',
      'responseType',
      'score',
      'scoring',
      'tier',
    ]

    for (const question of allQuestionItems) {
      const helpText = getQuestionHelpText(question).toLowerCase()

      for (const fragment of implementationFragments) {
        expect(helpText, `${question.id} exposes implementation jargon`).not.toContain(fragment.toLowerCase())
      }
    }
  })

  it('uses a consistent definition-plus-measurement structure for every generated explainer', () => {
    for (const question of allQuestionItems) {
      const helpText = getQuestionHelpText(question)
      const lowerHelpText = helpText.toLowerCase()

      expect(helpText, `${question.id} should start with a quoted plain-language term`).toMatch(/^“[^”]+” means /)
      expect(helpText, `${question.id} should include one clear measurement sentence`).toContain(`This question measures ${{
        normative: 'your moral judgment',
        descriptive: 'your practical belief',
        prescriptive: 'your preferred policy direction',
      }[question.layer]} about `)
      expect(lowerHelpText, `${question.id} should not use the generic missing-domain fallback`).not.toContain('general political judgment prompt')
      expect(helpText.length, `${question.id} should stay concise enough to read inline`).toBeLessThanOrEqual(650)
    }
  })

  it('uses term definitions from statement-choice options as well as the stem', () => {
    const helpText = getQuestionHelpText({
      ...baseQuestion,
      prompt: 'Which comes closest to your view?',
      responseType: 'statementChoice',
      axisWeights: [],
      statementOptions: [
        { id: 'a', text: 'Public goods justify ordinary political authority.', axisWeights: [{ axisId: 'authority-legitimacy', weight: 0.6 }] },
        { id: 'b', text: 'Exit rights should remain available.', axisWeights: [{ axisId: 'anti-domination', weight: 0.4 }] },
        { id: 'c', text: 'This depends on institutional design.', axisWeights: [{ axisId: 'authority-legitimacy', weight: 0.2 }] },
      ],
    })

    expect(helpText).toContain('“Exit” means')
  })

  it('does not attach the unrelated "political authority" definition merely because a prompt says legitimate/legitimacy', () => {
    const helpText = getQuestionHelpText({
      ...baseQuestion,
      prompt: 'A political order is more legitimate when people can refuse its services without being treated as criminals.',
    })

    expect(helpText).toContain('“Legitimacy” means')
    expect(helpText).not.toContain('“Political authority” means')
  })

  it('defines specific niche jargon instead of falling back to the generic domain definition', () => {
    const cases: Array<[string, string]> = [
      ['Occupational licensing often protects incumbent workers more than consumers.', '“Occupational licensing” means'],
      ['Deposit insurance reduces panic but can weaken discipline on banks if supervision fails.', '“Deposit insurance” means'],
      ['Qualified immunity and similar shields should be narrowed when officials violate clear rights.', '“Qualified immunity” means'],
      ['Civil asset forfeiture should require a criminal conviction or be abolished.', '“Asset forfeiture” means'],
      ['Blasphemy, apostasy, and heresy should not be civil crimes.', '“Blasphemy” means'],
      ['Referenda should include fiscal notes, rights constraints, and rules against targeting unpopular minorities.', '“Referendum” means'],
      ['Benefit rules should be designed to avoid cliffs that punish additional earnings.', '“Benefit cliffs” means'],
    ]

    for (const [prompt, expectedFragment] of cases) {
      const helpText = getQuestionHelpText({ ...baseQuestion, prompt })
      expect(helpText, `"${prompt}" should not use the generic domain fallback`).toContain(expectedFragment)
    }
  })
})
