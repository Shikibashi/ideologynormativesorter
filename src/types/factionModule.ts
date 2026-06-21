import type { LabelId, QuestionId } from './common'

/**
 * Optional follow-up question set offered once a broad profile is known.
 * Not wired into the MVP quiz flow; reserved for a future iteration.
 */
export interface FactionModule {
  id: string
  name: string
  description: string
  triggerLabelIds: LabelId[]
  questionIds: QuestionId[]
}
