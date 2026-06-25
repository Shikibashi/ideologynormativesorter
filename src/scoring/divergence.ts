import type { AxisId, DivergenceReport, IdealNonIdealGap, ScoreBreakdown } from '../types'

const LAYER_DIVERGENCE_THRESHOLD = 0.35

interface AxisComparison {
  presId: string
  invert: boolean
}

const LAYER_MAPPING: Record<string, AxisComparison> = {
  'liberty-noninterference': { presId: 'regulation-vs-deregulation', invert: true },
  'equality-theory': { presId: 'redistribution-vs-predistribution', invert: false },
  'authority-legitimacy': { presId: 'state-action-vs-exit', invert: false },
  'militarism-pacifism': { presId: 'coercion-strategy', invert: false }
}

export function detectDivergencesAndContradictions(
  scores: ScoreBreakdown,
  gaps: IdealNonIdealGap[]
): DivergenceReport[] {
  const reports: DivergenceReport[] = []

  const norm = new Map(scores.normative.map(s => [s.axisId, s.normalized]))
  const pres = new Map(scores.prescriptive.map(s => [s.axisId, s.normalized]))

  for (const [normId, config] of Object.entries(LAYER_MAPPING)) {
    const n = norm.get(normId)
    const pRaw = pres.get(config.presId)
    if (n !== undefined && pRaw !== undefined) {
      const p = config.invert ? -pRaw : pRaw
      if (Math.abs(n - p) > LAYER_DIVERGENCE_THRESHOLD) {
        reports.push({
          type: 'layer_divergence',
          description: `Layer divergence: normative ${normId} (${n.toFixed(2)}) vs prescriptive ${config.presId} (${pRaw.toFixed(2)})`,
          affectedAxes: [normId as AxisId, config.presId as AxisId]
        })
      }
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