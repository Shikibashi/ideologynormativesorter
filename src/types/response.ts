import type { QuestionId } from './common'

export type AnswerValue = number | 'dont_know'

export interface Answer {
  questionId: QuestionId
  value: AnswerValue
  /** 1-5, only meaningful for descriptive items. */
  confidence?: number
  /** 1-5, only meaningful for prescriptive items. */
  priority?: number
}

export type AnswerMap = Record<QuestionId, Answer>
