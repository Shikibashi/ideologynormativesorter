import type { AnswerMap, AxisId, Contribution, Question } from '../types'
import { normalizeAnswer, salienceFactor } from './normalize'

/**
 * Returns top contributing questions for an axis, sorted by |contribution| desc (capped at 5).
 * Reuses normalize and salience from the scoring core.
 */
export function contributionsForAxis(
  axisId: AxisId,
  questions: Question[],
  answers: AnswerMap
): Contribution[] {
  const contributions: Contribution[] = []

  for (const question of questions) {
    const answer = answers[question.id]
    if (!answer) continue

    let axisWeight = question.axisWeights.find((w) => w.axisId === axisId)
    if (question.responseType === 'statementChoice' && typeof answer.value === 'number') {
      axisWeight = question.statementOptions?.[answer.value]?.axisWeights.find((w) => w.axisId === axisId)
    }
    if (!axisWeight) continue

    const unit = normalizeAnswer(question, answer)
    if (unit === null) continue

    const factor = salienceFactor(question, answer)
    const contribution = unit * axisWeight.weight * factor

    contributions.push({
      questionId: question.id,
      prompt: question.prompt,
      layer: question.layer,
      theoryContext: question.theoryContext,
      unit,
      axisWeight: axisWeight.weight,
      salienceFactor: factor,
      contribution,
      toward: contribution >= 0 ? 'positive' : 'negative'
    })
  }

  contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
  return contributions.slice(0, 5)
}