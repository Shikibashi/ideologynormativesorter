import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { questions } from '../data/effectiveQuestions'
import { primaryScoringLabels } from '../data/labelTaxonomy'
import type { AnswerMap, IdeologyLabel } from '../types'
import { centroidAlignedAnswerValue } from './calibration.fixtures'
import { buildResultProfile } from './index'

function scopedCentroidAnswers(label: IdeologyLabel): AnswerMap {
  const scope = label.scoringScope
  if (!scope) throw new Error(`${label.id} has no source-backed primary scoring scope`)

  const axisIds = new Set(scope.axisIds)
  return Object.fromEntries(
    questions
      .filter((question) => question.axisWeights.some((weight) => axisIds.has(weight.axisId)))
      .map((question) => [
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
  return buildResultProfile(questions, scopedCentroidAnswers(label), axes, primaryScoringLabels)
    .nearestLabels
    .map((match) => String(match.labelId))
}

function scopedSignature(label: IdeologyLabel): string {
  const scope = label.scoringScope
  if (!scope) throw new Error(`${label.id} has no source-backed primary scoring scope`)
  return scope.axisIds
    .map((axisId) => `${axisId}:${label.centroid[axisId]}`)
    .sort()
    .join('|')
}

/**
 * These are construct-scoped synthetic profiles, not empirical accuracy
 * evidence. They verify a narrower contract than the retired full-centroid
 * rank-one geometry: every primary has enough measured core evidence to remain
 * in its own nearby neighborhood, while related broad traditions may overlap.
 */
describe('primary ideology separability', () => {
  it('gives every primary a distinct source-backed comparison signature', () => {
    const signatures = new Map<string, string[]>()

    for (const label of primaryScoringLabels) {
      const signature = scopedSignature(label)
      signatures.set(signature, [...(signatures.get(signature) ?? []), label.id])
    }

    const duplicates = [...signatures.values()].filter((ids) => ids.length > 1)
    expect(duplicates).toEqual([])
  })

  for (const label of primaryScoringLabels) {
    it(`${label.id} has measured evidence for every required core construct in its prototype`, () => {
      const answers = scopedCentroidAnswers(label)
      const result = buildResultProfile(questions, answers, axes, primaryScoringLabels)
      const own = result.nearestLabels.find((match) => match.labelId === label.id)

      expect(Object.keys(answers).length, `${label.id} has no effective scoped items`).toBeGreaterThan(0)
      expect(own, `${label.id} was withheld despite a complete scoped prototype`).toBeDefined()
      expect(own!.coreGateStatus).toBe('passed')
      expect(own!.measuredAxisCount).toBeGreaterThanOrEqual(label.scoringScope!.requiredAxisIds.length)
    })

    it(`${label.id} remains within its own top-three scoped prototype neighborhood`, () => {
      const topThree = prototypeRanking(label).slice(0, 3)
      expect(topThree, `${label.id} prototype resolved to ${topThree.join(', ')}`).toContain(label.id)
    })
  }
})
