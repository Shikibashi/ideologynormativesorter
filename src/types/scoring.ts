import type { AxisId, DomainId, Layer, QuestionId, TheoryContext } from './common'
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
   description?: string
   cautionNote?: string
   usageNote?: string
   distance: number
   /** 0..1, higher means closer to centroid. Formerly "confidence". */
   fit: number
   /** 0..1, how much of the label's centroid was actually measured. */
   evidenceStrength: number
   /** Number of centroid axes with at least one answered question. */
   measuredAxisCount: number
   /** Total axes in the label's centroid. */
   totalAxisCount: number
   /** Distance gap between this match and the runner-up (undefined if this is not rank 1). */
   runnerUpMargin?: number
   /** Qualitative uncertainty derived from evidenceStrength and runnerUpMargin. */
   uncertaintyBand: 'low' | 'medium' | 'high'
}

/**
 * A nearest-fitting label whose match holds on some layers but breaks on others.
 * Flags where a single ideology label would conflate the respondent's
 * normative, descriptive, and prescriptive positions into one, hiding the
 * cross-layer divergence the test exists to surface.
 */
export interface LabelConflationFlag {
   labelId: LabelId
   name: string
   /** Layer on which the respondent most closely matches this label. */
   matchedLayer: Layer
   /** Layers on which the respondent diverges sharply from this label. */
   conflatedLayers: Layer[]
   /** Per-layer agreement, native -1..1 scale: 1 = identical, 0 = maximally opposed. */
   layerAgreement: Record<Layer, number>
   /** Axes (within conflated layers) where respondent and label diverge most. */
   divergentAxes: AxisId[]
   /** Academic, explanatory account of the conflation. */
   reason: string
}

export interface AxisReliability {
   axisId: AxisId
   band: 'insufficient' | 'low' | 'medium' | 'high'
   consistency: number
   itemCount: number
   reason: string
}

export interface LabelReliability {
   labelId: LabelId
   band: 'insufficient' | 'low' | 'medium' | 'high'
   evidenceCount: number
   reason: string
}

export interface Contribution {
   questionId: QuestionId
   prompt: string
   layer: Layer
   theoryContext: TheoryContext
   unit: number
   axisWeight: number
   salienceFactor: number
   contribution: number
   toward: 'positive' | 'negative'
}

export interface DivergenceReport {
   type: 'layer_divergence' | 'internal_inconsistency' | 'strategic_compromise' | 'low_info_uncertainty'
   description: string
   affectedAxes?: AxisId[]
   affectedDomains?: DomainId[]
}

export interface DomainMiniResult {
   domain: DomainId
   normative: { mean: number; itemCount: number }
   descriptive: { mean: number; itemCount: number }
   prescriptive: { mean: number; itemCount: number }
}

export interface ReasonBreakdown {
   policyPosition: string
   dominantLayer: Layer
   dominantAxes: AxisId[]
   explanation: string
}

export interface ResultProfile {
   scores: ScoreBreakdown
   gaps: IdealNonIdealGap[]
   nearestLabels: LabelMatch[]
   conflatedLabels: LabelConflationFlag[]
   axisReliabilities?: Record<AxisId, AxisReliability>
   labelReliabilities?: Record<LabelId, LabelReliability>
   contributions?: Record<AxisId, Contribution[]>
   divergences?: DivergenceReport[]
   domainMiniResults?: DomainMiniResult[]
   reasonBreakdowns?: ReasonBreakdown[]
   bankVersion?: string
   scoringVersion?: string
   /** Nearest labels grouped by family for the family-tree display. */
   familyTree?: Record<string, LabelMatch[]>
   /** Nearest labels grouped family -> subfamily -> labels for the two-level family-tree display. */
   familySubtree?: Record<string, Record<string, LabelMatch[]>>
}