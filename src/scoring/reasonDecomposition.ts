import type { AnswerMap, Axis, Question, ReasonBreakdown } from '../types'
import { computeAxisScores } from './aggregate'

export function computeReasonBreakdowns(
  questions: Question[],
  answers: AnswerMap,
  axes: Axis[]
): ReasonBreakdown[] {
  const breakdowns: ReasonBreakdown[] = []

  const presQuestions = questions.filter(q => q.layer === 'prescriptive' && answers[q.id])

  for (const q of presQuestions) {
    const answer = answers[q.id]
    const ans: AnswerMap = {}
    ans[q.id] = answer
    const presScores = computeAxisScores([q], ans, axes.filter(a => a.layer === 'prescriptive'))

    if (presScores.length > 0) {
      const top = presScores.sort((a, b) => Math.abs(b.normalized) - Math.abs(a.normalized))[0]
      breakdowns.push({
        policyPosition: `policy-${q.id}`,
        dominantLayer: 'prescriptive',
        dominantAxes: [top.axisId],
        explanation: `Primarily prescriptive on ${top.axisId} (value ${answer.value})`
      })
    }
  }

  return breakdowns
}