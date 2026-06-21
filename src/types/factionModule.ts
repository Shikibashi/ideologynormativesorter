import type { LabelId, QuestionId } from './common'

/**
 * Optional follow-up question set offered once a broad profile is known,
 * triggered by proximity to one or more of triggerLabelIds.
 */
export interface FactionModule {
  id: string
  name: string
  description: string
  triggerLabelIds: LabelId[]
  questionIds: QuestionId[]
}
