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
   /** Short user-facing note for labels whose academic usage is contested, niche, or easily conflated. */
   cautionNote?: string
   /** Plain-language clarification shown with the label when extra context helps users interpret it. */
   usageNote?: string
   /** Alternate names / grouped child ideologies listed under this parent label. Display-only; not used by scoring. */
   aliases?: string[]
}
