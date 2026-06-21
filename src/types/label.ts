import type { AxisId, LabelId } from './common'

export interface IdeologyLabel {
  id: LabelId
  name: string
  family: string
  /** Reference position in axis-space used for nearest-label distance matching. */
  centroid: Record<AxisId, number>
  /** Labels this one is commonly mistaken for despite differing cross-layer profiles. */
  confoundedWith?: LabelId[]
  description: string
}
