import type { Axis, AxisReliability, LabelReliability } from './types'

type CoverageBand = AxisReliability['band'] | LabelReliability['band']

export function axisPositionLabel(value: number, axis: Pick<Axis, 'negativePole' | 'positivePole'>): string {
  if (Math.abs(value) < 0.12) return 'near the midpoint'
  const pole = value > 0 ? axis.positivePole : axis.negativePole
  const strength = Math.abs(value)
  if (strength < 0.35) return `slightly toward ${pole}`
  if (strength < 0.65) return `leans toward ${pole}`
  return `strongly toward ${pole}`
}

export function labelProximityLabel(fit: number): string {
  if (fit >= 0.85) return 'Very close axis profile'
  if (fit >= 0.72) return 'Close axis profile'
  if (fit >= 0.58) return 'Some axis overlap'
  return 'Limited axis overlap'
}

export function comparisonStabilityLabel(uncertainty: 'low' | 'medium' | 'high'): string {
  if (uncertainty === 'low') return 'more stable comparison'
  if (uncertainty === 'medium') return 'tentative comparison'
  return 'very tentative comparison'
}

export function coverageLabel(band: CoverageBand): string {
  if (band === 'high') return 'broad answer coverage'
  if (band === 'medium') return 'moderate answer coverage'
  if (band === 'low') return 'limited answer coverage'
  return 'too little answer coverage'
}

export function idealGapLabel(gap: number): string {
  const magnitude = Math.abs(gap)
  if (magnitude < 0.2) return 'Small difference between ideal and current-condition answers'
  if (magnitude < 0.4) return 'Noticeable difference between ideal and current-condition answers'
  return 'Large difference between ideal and current-condition answers'
}

export function constructSignalLabel(value: number): string {
  if (Math.abs(value) < 0.12) return 'near the midpoint'
  if (value > 0.65) return 'strongly expressed'
  if (value > 0.3) return 'clearly expressed'
  if (value > 0) return 'slightly expressed'
  if (value < -0.65) return 'strongly opposed'
  if (value < -0.3) return 'clearly opposed'
  return 'slightly opposed'
}

export function layerAgreementLabel(agreement: number): string {
  if (agreement >= 0.75) return 'close'
  if (agreement >= 0.55) return 'mixed'
  return 'different'
}
