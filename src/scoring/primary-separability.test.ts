import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { questions } from '../data/effectiveQuestions'
import { primaryScoringLabels } from '../data/labelTaxonomy'
import type { AnswerMap, IdeologyLabel } from '../types'
import { centroidAlignedAnswerValue } from './calibration.fixtures'
import { buildResultProfile } from './index'

function centroidDistance(a: IdeologyLabel, b: IdeologyLabel): number {
  return Math.sqrt(
    axes.reduce((sum, axis) => {
      const delta = a.centroid[axis.id] - b.centroid[axis.id]
      return sum + delta * delta
    }, 0),
  )
}

function centroidAnswers(label: IdeologyLabel): AnswerMap {
  return Object.fromEntries(
    questions.map((question) => [
      question.id,
      {
        questionId: question.id,
        value: centroidAlignedAnswerValue(question, label.centroid),
        ...(question.layer === 'descriptive' ? { confidence: 3 } : {}),
        ...(question.layer === 'prescriptive' ? { priority: 3 } : {}),
      },
    ]),
  )
}

/**
 * Internal geometry guard only. These profiles are generated from centroids and
 * therefore cannot establish external or construct validity. Their purpose is
 * to stop the primary result pool from becoming so crowded that even its own
 * declared prototypes are not distinguishable by the active questionnaire.
 */
describe('primary ideology separability', () => {
  it('keeps primary centroids outside the near-duplicate floor', () => {
    let closest: { pair: string; distance: number } | null = null

    for (let i = 0; i < primaryScoringLabels.length; i++) {
      for (let j = i + 1; j < primaryScoringLabels.length; j++) {
        const left = primaryScoringLabels[i]
        const right = primaryScoringLabels[j]
        const distance = centroidDistance(left, right)
        if (!closest || distance < closest.distance) {
          closest = { pair: `${left.id} / ${right.id}`, distance }
        }
      }
    }

    expect(closest).not.toBeNull()
    expect(closest!.distance, `closest primary pair: ${closest!.pair}`).toBeGreaterThanOrEqual(0.35)
  })

  for (const label of primaryScoringLabels) {
    it(`${label.id} is recoverable from its declared prototype`, () => {
      const result = buildResultProfile(questions, centroidAnswers(label), axes, primaryScoringLabels)
      const topThree = result.nearestLabels.slice(0, 3).map((match) => match.labelId)

      expect(topThree, `${label.id} prototype resolved to ${topThree.join(', ')}`).toContain(label.id)
    })
  }

  it('keeps most primary prototypes as rank-1 matches', () => {
    const rankOneCount = primaryScoringLabels.filter((label) => {
      const result = buildResultProfile(questions, centroidAnswers(label), axes, primaryScoringLabels)
      return result.nearestLabels[0]?.labelId === label.id
    }).length

    const rate = rankOneCount / primaryScoringLabels.length
    expect(rate, `${rankOneCount}/${primaryScoringLabels.length} primary prototypes were rank 1`).toBeGreaterThanOrEqual(0.7)
  })
})
