import type { AxisId, DomainId, Layer } from './common'
import type { LabelId } from './common'

export interface AxisScore {
  axisId: AxisId
  layer: Layer
  /** Weighted sum of contributions, unnormalized. */
  raw: number
  /** raw / sum(|weights|), clamped to -1..1. */
  normalized: number
  itemCount: number
  /** Mean 1-5 confidence (descriptive) or priority (prescriptive) across rated items, if any were rated. */
  avgSalience?: number
}

export interface ScoreBreakdown {
  normative: AxisScore[]
  descriptive: AxisScore[]
  prescriptive: AxisScore[]
}

export interface IdealNonIdealGap {
  domain: DomainId
  /** Mean normalized response across that domain's ideal-context items. */
  ideal: number
  /** Mean normalized response across that domain's nonideal-context items. */
  nonIdeal: number
  /** ideal - nonIdeal. Large magnitude means the respondent's real-world prescriptions diverge from their ideal-conditions judgments. */
  gap: number
  idealItemCount: number
  nonIdealItemCount: number
}

export interface LabelMatch {
  labelId: LabelId
  name: string
  distance: number
  /** 0..1, higher means a closer match. */
  confidence: number
}

export interface ConfoundedLabelFlag {
  labelId: LabelId
  name: string
  reason: string
}

export interface ResultProfile {
  scores: ScoreBreakdown
  gaps: IdealNonIdealGap[]
  nearestLabels: LabelMatch[]
  confoundedLabels: ConfoundedLabelFlag[]
}
