import type { AnswerMap, Axis, AxisScore, Question, ScoreBreakdown } from '../types'
import { normalizeAnswer } from './normalize'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Computes a normalized -1..1 score per axis from the questions/answers that
 * reference it. Axes with no answered items get a normalized score of 0 and
 * itemCount of 0, so callers can distinguish "neutral" from "unmeasured".
 */
export function computeAxisScores(questions: Question[], answers: AnswerMap, axes: Axis[]): AxisScore[] {
  return axes.map((axis) => {
    let raw = 0
    let weightSum = 0
    let itemCount = 0

    for (const question of questions) {
      const axisWeight = question.axisWeights.find((w) => w.axisId === axis.id)
      if (!axisWeight) continue

      const answer = answers[question.id]
      if (!answer) continue

      const unit = normalizeAnswer(question, answer)
      if (unit === null) continue

      raw += unit * axisWeight.weight
      weightSum += Math.abs(axisWeight.weight)
      itemCount += 1
    }

    return {
      axisId: axis.id,
      layer: axis.layer,
      raw,
      normalized: weightSum > 0 ? clamp(raw / weightSum, -1, 1) : 0,
      itemCount,
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
