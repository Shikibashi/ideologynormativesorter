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

/**
 * Scales a contribution by how strongly the respondent holds it: confidence
 * for descriptive (empirical) items, priority for prescriptive (policy)
 * items. 1-5 maps to 0.2..1 so a low-confidence/low-priority answer still
 * counts, just much less. Normative items and unrated answers get full
 * weight (1).
 */
export function salienceFactor(question: Question, answer: Answer): number {
  const rating = question.layer === 'descriptive' ? answer.confidence : question.layer === 'prescriptive' ? answer.priority : undefined
  if (rating === undefined) return 1
  return clampUnit(rating / 5)
}

function clampUnit(value: number): number {
  if (value > 1) return 1
  if (value < 0.2) return 0.2
  return value
}
