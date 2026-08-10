import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { questions } from '../data/effectiveQuestions'
import { primaryScoringLabels } from '../data/labelTaxonomy'
import type { AnswerMap, Question } from '../types'
import { buildResultProfile } from './index'

type AxisIntent = Record<string, number>

interface PrimaryArchetype {
  id: string
  targetLabelId: string
  expectedFamily: string
  intent: AxisIntent
}

/**
 * Hand-authored profiles written independently of labels.ts centroids.
 * These exercise questionnaire -> axis aggregation -> ideology matching and
 * complement the centroid-reflexivity fixtures used elsewhere in the suite.
 */
const ARCHETYPES: PrimaryArchetype[] = [
  {
    id: 'social-democratic-reformist', targetLabelId: 'social-democrat', expectedFamily: 'social-democratic',
    intent: {
      'equality-theory': 0.8, 'market-process-confidence': 0.3, 'state-capacity-confidence': 0.7,
      'democratic-confidence': 0.8, 'reform-vs-revolution': -0.9, 'state-action-vs-exit': 0.8,
      'electoralism-vs-direct-action': 0.8, 'compromise-vs-persistence': 0.6, 'coercion-strategy': -0.6,
      'regulation-vs-deregulation': 0.6, 'redistribution-vs-predistribution': 0.7,
    },
  },
  {
    id: 'classical-liberal', targetLabelId: 'classical-liberalism', expectedFamily: 'liberal',
    intent: {
      'property-legitimacy': 0.8, 'liberty-noninterference': 0.8, 'equality-theory': -0.3,
      'market-process-confidence': 0.8, 'public-choice-skepticism': 0.6, 'coordination-optimism': 0.6,
      'centralization-preference': -0.5, 'reform-vs-revolution': -0.8, 'state-action-vs-exit': -0.5,
      'coercion-strategy': -0.8, 'regulation-vs-deregulation': -0.8, 'redistribution-vs-predistribution': -0.6,
    },
  },
  {
    id: 'market-anarchist-right-libertarian', targetLabelId: 'anarcho-capitalist', expectedFamily: 'libertarian-leaning',
    intent: {
      'authority-legitimacy': -1, 'property-legitimacy': 1, 'liberty-noninterference': 1, 'equality-theory': -0.5,
      'market-process-confidence': 1, 'state-capacity-confidence': -0.8, 'public-choice-skepticism': 1,
      'coordination-optimism': 0.9, 'centralization-preference': -1, 'state-action-vs-exit': -1,
      'coercion-strategy': -1, 'regulation-vs-deregulation': -1, 'redistribution-vs-predistribution': -1,
    },
  },
  {
    id: 'democratic-socialist', targetLabelId: 'democratic-socialist', expectedFamily: 'socialist',
    intent: {
      'property-legitimacy': -0.8, 'equality-theory': 0.9, 'anti-domination': 0.9,
      'market-process-confidence': -0.2, 'democratic-confidence': 0.9, 'reform-vs-revolution': -0.7,
      'state-action-vs-exit': 0.5, 'electoralism-vs-direct-action': 0.7, 'coercion-strategy': -0.7,
      'regulation-vs-deregulation': 0.5, 'redistribution-vs-predistribution': 0.6,
    },
  },
  {
    id: 'marxist-leninist', targetLabelId: 'marxist-leninist', expectedFamily: 'socialist',
    intent: {
      'authority-legitimacy': 0.5, 'property-legitimacy': -1, 'liberty-noninterference': -0.7, 'equality-theory': 1,
      'market-process-confidence': -0.9, 'state-capacity-confidence': 0.7, 'democratic-confidence': -0.5,
      'centralization-preference': 0.9, 'reform-vs-revolution': 1, 'gradualism-vs-immediatism': 0.7,
      'state-action-vs-exit': 1, 'electoralism-vs-direct-action': -0.8, 'compromise-vs-persistence': -0.8,
      'coercion-strategy': 0.7, 'regulation-vs-deregulation': 0.9, 'redistribution-vs-predistribution': 0.9,
    },
  },
  {
    id: 'national-conservative', targetLabelId: 'national-conservatism', expectedFamily: 'conservative',
    intent: {
      'authority-legitimacy': 0.5, 'property-legitimacy': 0.4, 'political-community-boundary': -0.8,
      'moral-traditionalism': 0.8, 'state-capacity-confidence': 0.5, 'democratic-confidence': 0.3,
      'cultural-plasticity': -0.7, 'centralization-preference': 0.3, 'reform-vs-revolution': -0.5,
      'state-action-vs-exit': 0.4, 'militarism-pacifism': 0.4, 'secularism-religious': 0.4,
    },
  },
  {
    id: 'degrowth-ecologist', targetLabelId: 'degrowth-green', expectedFamily: 'green',
    intent: {
      'human-nature-priority': 0.9, 'equality-theory': 0.7, 'market-process-confidence': -0.6,
      'coordination-optimism': -0.5, 'centralization-preference': -0.2, 'state-action-vs-exit': 0.5,
      'coercion-strategy': -0.5, 'regulation-vs-deregulation': 0.7, 'redistribution-vs-predistribution': 0.5,
      'militarism-pacifism': -0.7,
    },
  },
  {
    id: 'technocratic-governance', targetLabelId: 'technocratic-centralist', expectedFamily: 'technocratic',
    intent: {
      'authority-legitimacy': 0.6, 'state-capacity-confidence': 0.9, 'public-choice-skepticism': -0.4,
      'democratic-confidence': -0.8, 'expert-confidence': 1, 'cultural-plasticity': 0.6,
      'centralization-preference': 0.9, 'state-action-vs-exit': 0.8, 'regulation-vs-deregulation': 0.5,
    },
  },
  {
    id: 'fascist-ultranationalist', targetLabelId: 'fascist-authoritarian', expectedFamily: 'authoritarian',
    intent: {
      'authority-legitimacy': 1, 'liberty-noninterference': -1, 'equality-theory': -0.7,
      'political-community-boundary': -1, 'moral-traditionalism': 0.7, 'anti-domination': -0.8,
      'state-capacity-confidence': 0.8, 'democratic-confidence': -0.9, 'centralization-preference': 1,
      'reform-vs-revolution': 0.8, 'gradualism-vs-immediatism': 0.7, 'state-action-vs-exit': 0.9,
      'compromise-vs-persistence': -0.8, 'coercion-strategy': 1, 'militarism-pacifism': 0.9,
    },
  },
  {
    id: 'radical-democrat', targetLabelId: 'radical-democracy', expectedFamily: 'democratic',
    intent: {
      'authority-legitimacy': -0.1, 'property-legitimacy': 0, 'liberty-noninterference': 0.4, 'equality-theory': 0.2,
      'anti-domination': 0.9, 'public-choice-skepticism': 0.5, 'democratic-confidence': 1, 'expert-confidence': -0.5,
      'coordination-optimism': 0.3, 'centralization-preference': -0.5, 'reform-vs-revolution': -0.3,
      'gradualism-vs-immediatism': 0.1, 'state-action-vs-exit': 0.2, 'electoralism-vs-direct-action': -0.4,
      'compromise-vs-persistence': -0.1, 'coercion-strategy': -0.7,
    },
  },
  {
    id: 'mutualist-market-anarchist', targetLabelId: 'mutualist', expectedFamily: 'anarchist',
    intent: {
      'authority-legitimacy': -0.9, 'property-legitimacy': -0.3, 'liberty-noninterference': 0.8,
      'equality-theory': 0.5, 'anti-domination': 1, 'market-process-confidence': 0.5,
      'state-capacity-confidence': -0.6, 'public-choice-skepticism': 0.7, 'coordination-optimism': 0.6,
      'centralization-preference': -0.9, 'state-action-vs-exit': -0.8, 'electoralism-vs-direct-action': -0.4,
      'coercion-strategy': -0.9, 'regulation-vs-deregulation': -0.4, 'redistribution-vs-predistribution': -0.2,
    },
  },
  {
    id: 'christian-democratic-social-market', targetLabelId: 'christian-democrat', expectedFamily: 'conservative',
    intent: {
      'authority-legitimacy': 0.3, 'property-legitimacy': 0.3, 'equality-theory': 0.4,
      'political-community-boundary': 0.1, 'moral-traditionalism': 0.6, 'market-process-confidence': 0.4,
      'state-capacity-confidence': 0.5, 'democratic-confidence': 0.8, 'centralization-preference': -0.2,
      'reform-vs-revolution': -0.8, 'state-action-vs-exit': 0.5, 'electoralism-vs-direct-action': 0.7,
      'coercion-strategy': -0.5, 'regulation-vs-deregulation': 0.2, 'redistribution-vs-predistribution': 0.3,
      'secularism-religious': 0.6,
    },
  },
  {
    id: 'civic-nationalist', targetLabelId: 'civic-nationalist', expectedFamily: 'nationalist',
    intent: {
      'authority-legitimacy': 0.2, 'liberty-noninterference': 0.3, 'equality-theory': 0.2,
      'political-community-boundary': -0.45, 'moral-traditionalism': 0.1, 'democratic-confidence': 0.7,
      'cultural-plasticity': 0.2, 'centralization-preference': 0, 'reform-vs-revolution': -0.7,
      'electoralism-vs-direct-action': 0.7, 'coercion-strategy': -0.5, 'militarism-pacifism': 0,
      'secularism-religious': -0.2,
    },
  },
  {
    id: 'civic-republican', targetLabelId: 'republicanism', expectedFamily: 'republican',
    intent: {
      'authority-legitimacy': 0.2, 'property-legitimacy': 0.1, 'liberty-noninterference': 0.3,
      'equality-theory': -0.2, 'anti-domination': 1, 'democratic-confidence': 0.8, 'expert-confidence': 0,
      'centralization-preference': -0.2, 'reform-vs-revolution': -0.6, 'state-action-vs-exit': 0,
      'electoralism-vs-direct-action': 0.7, 'compromise-vs-persistence': 0.4, 'coercion-strategy': -0.5,
      'regulation-vs-deregulation': 0, 'redistribution-vs-predistribution': -0.3,
    },
  },
  {
    id: 'communitarian', targetLabelId: 'communitarianism', expectedFamily: 'communitarian',
    intent: {
      'authority-legitimacy': 0.3, 'liberty-noninterference': -0.2, 'equality-theory': 0.3,
      'political-community-boundary': -0.2, 'moral-traditionalism': 0.4, 'anti-domination': 0.2,
      'state-capacity-confidence': 0.3, 'democratic-confidence': 0.6, 'centralization-preference': -0.2,
      'reform-vs-revolution': -0.7, 'state-action-vs-exit': 0.3, 'coercion-strategy': -0.3,
    },
  },
  {
    id: 'distributist', targetLabelId: 'distributism', expectedFamily: 'distributist',
    intent: {
      'authority-legitimacy': 0.2, 'property-legitimacy': 0.5, 'liberty-noninterference': 0.1,
      'equality-theory': 0.5, 'political-community-boundary': -0.1, 'moral-traditionalism': 0.6,
      'anti-domination': 0.6, 'market-process-confidence': 0.1, 'state-capacity-confidence': 0.2,
      'democratic-confidence': 0.5, 'centralization-preference': -0.5, 'reform-vs-revolution': -0.7,
      'state-action-vs-exit': 0.2, 'regulation-vs-deregulation': 0.2, 'redistribution-vs-predistribution': -0.4,
      'secularism-religious': 0.5,
    },
  },
]

function statementChoiceValue(question: Question, intent: AxisIntent): number | null {
  if (!question.statementOptions?.length) return null

  let bestIndex = -1
  let bestScore = Number.NEGATIVE_INFINITY
  question.statementOptions.forEach((option, index) => {
    let score = 0
    let matched = 0
    for (const weight of option.axisWeights) {
      const desired = intent[weight.axisId]
      if (desired === undefined) continue
      score += desired * weight.weight
      matched++
    }
    if (matched > 0 && score > bestScore) {
      bestIndex = index
      bestScore = score
    }
  })

  return bestIndex >= 0 ? bestIndex : null
}

function likertValue(question: Question, intent: AxisIntent): number | null {
  let total = 0
  let denominator = 0
  for (const weight of question.axisWeights) {
    const desired = intent[weight.axisId]
    if (desired === undefined) continue
    total += desired * weight.weight
    denominator += Math.abs(weight.weight)
  }
  if (denominator === 0) return null

  const max = question.responseType === 'likert5' ? 2 : 3
  const normalized = Math.max(-1, Math.min(1, total / denominator))
  const rawDirection = question.reverseScored ? -normalized : normalized
  return rawDirection * max
}

function answersForIntent(intent: AxisIntent): AnswerMap {
  const answers: AnswerMap = {}
  for (const question of questions) {
    const value = question.responseType === 'statementChoice'
      ? statementChoiceValue(question, intent)
      : likertValue(question, intent)
    if (value === null) continue

    answers[question.id] = {
      questionId: question.id,
      value,
      ...(question.layer === 'descriptive' ? { confidence: 5 } : {}),
      ...(question.layer === 'prescriptive' ? { priority: 5 } : {}),
    }
  }
  return answers
}

const labelById = new Map(primaryScoringLabels.map((label) => [label.id, label]))

describe('hand-authored primary ideology archetypes', () => {
  it('uses only primary labels in the expected taxonomy families', () => {
    for (const archetype of ARCHETYPES) {
      const target = labelById.get(archetype.targetLabelId)
      expect(target, `${archetype.targetLabelId} is not a primary label`).toBeDefined()
      expect(target!.family, `${archetype.targetLabelId} has the wrong taxonomy family`).toBe(archetype.expectedFamily)
    }
  })

  for (const archetype of ARCHETYPES) {
    it(`${archetype.id} resolves to the intended ideological neighborhood`, () => {
      const answers = answersForIntent(archetype.intent)
      const result = buildResultProfile(questions, answers, axes, primaryScoringLabels)
      const topFiveIds = result.nearestLabels.slice(0, 5).map((match) => match.labelId)

      expect(Object.keys(answers).length, `${archetype.id} has too little question coverage`).toBeGreaterThanOrEqual(20)
      expect(
        topFiveIds,
        `${archetype.id} top five were ${topFiveIds.join(', ')}`,
      ).toContain(archetype.targetLabelId)
    })
  }
})
