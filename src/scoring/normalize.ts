import type { Answer, Question } from '../types'

const LIKERT_MAX: Record<Question['responseType'], number> = {
  likert5: 2,
  likert7: 3,
}

/**
 * Converts a raw Likert answer into a -1..1 unit value, honoring reverseScored.
 * Returns null for "I don't know" answers, which are excluded from aggregation.
 */
export function normalizeAnswer(question: Question, answer: Answer): number | null {
  if (answer.value === 'dont_know') return null

  const max = LIKERT_MAX[question.responseType]
  let unit = answer.value / max
  if (unit > 1) unit = 1
  if (unit < -1) unit = -1

  return question.reverseScored ? -unit : unit
}
