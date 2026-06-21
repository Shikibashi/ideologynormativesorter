import type { Answer, AnswerMap, Axis, IdeologyLabel, Question, QuestionId, ResultProfile } from '../types'
import { computeScoreBreakdown } from './aggregate'
import { computeIdealNonIdealGaps } from './gap'
import { computeConfoundedLabels, computeLabelMatches } from './labelMatch'

export { normalizeAnswer } from './normalize'
export { computeAxisScores, computeScoreBreakdown, axisScoreMap } from './aggregate'
export { computeIdealNonIdealGaps } from './gap'
export { computeLabelMatches, computeConfoundedLabels } from './labelMatch'

export function buildResultProfile(questions: Question[], answers: AnswerMap, axes: Axis[], labels: IdeologyLabel[]): ResultProfile {
  const scores = computeScoreBreakdown(questions, answers, axes)
  const gaps = computeIdealNonIdealGaps(questions, answers)
  const nearestLabels = computeLabelMatches(scores, labels)
  const confoundedLabels = computeConfoundedLabels(scores, labels, axes)

  return { scores, gaps, nearestLabels, confoundedLabels }
}

export function answeredCount(answers: AnswerMap): number {
  return Object.keys(answers).length
}

export function setAnswer(answers: AnswerMap, questionId: QuestionId, answer: Answer): AnswerMap {
  return { ...answers, [questionId]: answer }
}
