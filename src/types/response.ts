import type { QuestionId } from './common'

export type AnswerValue = number | 'dont_know' | 'prefer_not_to_answer'

export interface Answer {
  questionId: QuestionId
  value: AnswerValue
  /** 1-5, only meaningful for descriptive items. */
  confidence?: number
  /** 1-5, only meaningful for prescriptive items. */
  priority?: number
  /** The respondent explicitly skipped a requested confidence/priority rating. */
  salienceSkipped?: true
}

export type AnswerMap = Record<QuestionId, Answer>
