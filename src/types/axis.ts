import type { AxisId, Layer } from './common'

/**
 * Bipolar axis. Scores run -1 (negativePole) to +1 (positivePole).
 */
export interface Axis {
  id: AxisId
  layer: Layer
  name: string
  positivePole: string
  negativePole: string
  description: string
}
