import type { AxisId, LabelId } from './common'

export interface IdeologyLabel {
   id: LabelId
   name: string
   family: string
   /** Optional second-level grouping within a family, used for the family-tree display. */
   subfamily?: string
   /** Reference position in axis-space used for nearest-label distance matching. */
   centroid: Record<AxisId, number>
   description: string
   /** Alternate names / grouped child ideologies listed under this parent label. Display-only; not used by scoring. */
   aliases?: string[]
   /** Influencing philosophical traditions (e.g. Marxism, Liberalism, Conservatism, etc.). Display-only. */
   philosophies?: string[]
}
