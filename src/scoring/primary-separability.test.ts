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

function prototypeRanking(label: IdeologyLabel): string[] {
  return buildResultProfile(questions, centroidAnswers(label), axes, primaryScoringLabels)
    .nearestLabels
    .map((match) => String(match.labelId))
}

/**
 * Internal geometry guard only. These profiles are generated from centroids and
 * therefore cannot establish external or construct validity. Their purpose is
 * to stop the primary result pool from becoming so crowded that even its own
 * declared prototypes are not distinguishable by the active questionnaire.
 *
 * Thresholds deliberately freeze measured performance rather than asserting an
 * idealized level of precision the current bank has not demonstrated: every
 * primary must remain in its prototype's top five, at least 85% must remain in
 * the top three, and at least 65% must remain rank one.
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
    it(`${label.id} remains in the top five from its declared prototype`, () => {
      const topFive = prototypeRanking(label).slice(0, 5)
      expect(topFive, `${label.id} prototype resolved to ${topFive.join(', ')}`).toContain(label.id)
    })
  }

  it('keeps at least 85% of primary prototypes in the top three', () => {
    const topThreeCount = primaryScoringLabels.filter((label) =>
      prototypeRanking(label).slice(0, 3).includes(label.id),
    ).length
    const rate = topThreeCount / primaryScoringLabels.length

    expect(
      rate,
      `${topThreeCount}/${primaryScoringLabels.length} primary prototypes were top three`,
    ).toBeGreaterThanOrEqual(0.85)
  })

  it('keeps at least 65% of primary prototypes as rank-one matches', () => {
    const rankOneCount = primaryScoringLabels.filter((label) => prototypeRanking(label)[0] === label.id).length
    const rate = rankOneCount / primaryScoringLabels.length

    expect(
      rate,
      `${rankOneCount}/${primaryScoringLabels.length} primary prototypes were rank one`,
    ).toBeGreaterThanOrEqual(0.65)
  })
})
