import type { AnswerMap, Axis, AxisId, Question, ReasonBreakdown } from '../types'
import { contributionForQuestionAxis } from './aggregate'

export function computeReasonBreakdowns(
  questions: Question[],
  answers: AnswerMap,
  axes: Axis[]
): ReasonBreakdown[] {
  const breakdowns: ReasonBreakdown[] = []

  const prescriptiveAxes = axes.filter((axis) => axis.layer === 'prescriptive')
  const presQuestions = questions.filter(q => q.layer === 'prescriptive' && answers[q.id])

  for (const q of presQuestions) {
    const answer = answers[q.id]
    if (answer.value === 'dont_know') continue

    const contributions = prescriptiveAxes
      .map((axis) => ({ axisId: axis.id, contribution: contributionForQuestionAxis(q, answer, axis.id) }))
      .filter((entry): entry is { axisId: AxisId; contribution: number } => entry.contribution !== null && entry.contribution !== 0)
    if (contributions.length === 0) continue

    const largestMagnitude = Math.max(...contributions.map((entry) => Math.abs(entry.contribution)))
    const dominantAxes = contributions
      .filter((entry) => Math.abs(entry.contribution) === largestMagnitude)
      .map((entry) => entry.axisId)

    breakdowns.push({
      policyPosition: `policy-${q.id}`,
      dominantLayer: 'prescriptive',
      dominantAxes,
      explanation: `Primarily prescriptive on ${dominantAxes.join(', ')} (value ${answer.value})`
    })
  }

  return breakdowns
}