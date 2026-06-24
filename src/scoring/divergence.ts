import type { DivergenceReport, IdealNonIdealGap, ScoreBreakdown } from '../types'

const LAYER_DIVERGENCE_THRESHOLD = 0.35

export function detectDivergencesAndContradictions(
  scores: ScoreBreakdown,
  gaps: IdealNonIdealGap[]
): DivergenceReport[] {
  const reports: DivergenceReport[] = []

  const norm = new Map(scores.normative.map(s => [s.axisId, s.normalized]))
  const pres = new Map(scores.prescriptive.map(s => [s.axisId, s.normalized]))

  for (const [id, n] of norm) {
    const p = pres.get(id)
    if (p !== undefined && Math.abs(n - p) > LAYER_DIVERGENCE_THRESHOLD) {
      reports.push({
        type: 'layer_divergence',
        description: `Layer divergence on ${id}: normative ${n.toFixed(2)} vs prescriptive ${p.toFixed(2)}`,
        affectedAxes: [id]
      })
    }
  }

  for (const g of gaps) {
    if (Math.abs(g.gap) > 0.4) {
      reports.push({
        type: 'strategic_compromise',
        description: `Strategic compromise in ${g.domain}: ideal ${g.ideal.toFixed(2)} vs non-ideal ${g.nonIdeal.toFixed(2)}`,
        affectedDomains: [g.domain]
      })
    }
  }

  return reports
}