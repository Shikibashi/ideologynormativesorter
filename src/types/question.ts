import type { AxisId, DomainId, LabelId, Layer, QuestionId, QuizTier, ResponseType, TheoryContext } from './common'

export interface AxisWeight {
  axisId: AxisId
  /** Signed contribution toward the axis's positive pole, -1..1. */
  weight: number
}

export interface IdeologyAffinity {
  labelId: LabelId
  /** Signed contribution toward affinity with the label, -1..1. */
  weight: number
}

/** One "which best represents your view" option for a statementChoice question. */
export interface StatementOption {
  id: string
  text: string
  axisWeights: AxisWeight[]
}

export interface Question {
  id: QuestionId
  prompt: string
  domain: DomainId
  layer: Layer
  theoryContext: TheoryContext
  responseType: ResponseType
  /** Smallest question pool this item belongs to; quick ⊂ moderate ⊂ extensive. */
  tier: QuizTier
  axisWeights: AxisWeight[]
  /** Required when responseType is statementChoice; each option carries its own axisWeights instead of the question-level scale. */
  statementOptions?: StatementOption[]
  /** When true, the raw answer value is inverted before axis weights are applied. */
  reverseScored?: boolean
  ideologyAffinities?: IdeologyAffinity[]
  /** Faction module this item belongs to, if any. Absent for core short/full mode items. */
  module?: string
  /** Optional note shown in results explaining what the item measures. */
  explanation?: string
  /** Descriptive items may let the respondent decline to guess. */
  allowDontKnow?: boolean
  /** Prompt shown alongside a descriptive item's confidence rating. */
  confidencePrompt?: string
  /** Prompt shown alongside a prescriptive item's priority rating. */
  priorityPrompt?: string
}
