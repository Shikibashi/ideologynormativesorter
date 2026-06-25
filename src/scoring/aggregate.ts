import type { Answer, AnswerMap, Axis, AxisId, AxisScore, AxisWeight, Question, ScoreBreakdown } from '../types'
import { normalizeAnswer, salienceFactor } from './normalize'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * statementChoice questions carry their axis weights on the chosen option
 * rather than on the question itself, since each option pushes different
 * axes by design (it's a pick, not a scaled agreement).
 */
function axisWeightFor(question: Question, answer: Answer, axisId: AxisId): AxisWeight | undefined {
  if (question.responseType !== 'statementChoice') {
    return question.axisWeights.find((w) => w.axisId === axisId)
  }
  if (typeof answer.value !== 'number') return undefined
  return question.statementOptions?.[answer.value]?.axisWeights.find((w) => w.axisId === axisId)
}

export function contributionForQuestionAxis(question: Question, answer: Answer, axisId: AxisId): number | null {
  const axisWeight = axisWeightFor(question, answer, axisId)
  if (!axisWeight) return null

  const unit = normalizeAnswer(question, answer)
  if (unit === null) return null

  return unit * axisWeight.weight * salienceFactor(question, answer)
}

/**
 * Computes a normalized -1..1 score per axis from the questions/answers that
 * reference it. Axes with no answered items get a normalized score of 0 and
 * itemCount of 0, so callers can distinguish "neutral" from "unmeasured".
 * Each contribution is scaled by salienceFactor, so a low-confidence
 * descriptive answer or a low-priority prescriptive answer moves the axis
 * less than a strongly-held one.
 */
export function computeAxisScores(questions: Question[], answers: AnswerMap, axes: Axis[]): AxisScore[] {
  return axes.map((axis) => {
    let raw = 0
    let weightSum = 0
    let itemCount = 0
    let salienceSum = 0
    let salienceCount = 0

    for (const question of questions) {
      const answer = answers[question.id]
      if (!answer) continue

      const contribution = contributionForQuestionAxis(question, answer, axis.id)
      if (contribution === null) continue

      const axisWeight = axisWeightFor(question, answer, axis.id)
      if (!axisWeight) continue

      raw += contribution
      weightSum += Math.abs(axisWeight.weight)
      itemCount += 1

      const rating = question.layer === 'descriptive' ? answer.confidence : answer.priority
      if (rating !== undefined) {
        salienceSum += rating
        salienceCount += 1
      }
    }

    return {
      axisId: axis.id,
      layer: axis.layer,
      raw,
      normalized: weightSum > 0 ? clamp(raw / weightSum, -1, 1) : 0,
      itemCount,
      avgSalience: salienceCount > 0 ? salienceSum / salienceCount : undefined,
    }
  })
}

export function computeScoreBreakdown(questions: Question[], answers: AnswerMap, axes: Axis[]): ScoreBreakdown {
  return {
    normative: computeAxisScores(questions, answers, axes.filter((a) => a.layer === 'normative')),
    descriptive: computeAxisScores(questions, answers, axes.filter((a) => a.layer === 'descriptive')),
    prescriptive: computeAxisScores(questions, answers, axes.filter((a) => a.layer === 'prescriptive')),
  }
}

export function axisScoreMap(breakdown: ScoreBreakdown): Map<string, AxisScore> {
  const all = [...breakdown.normative, ...breakdown.descriptive, ...breakdown.prescriptive]
  return new Map(all.map((s) => [s.axisId, s]))
}
