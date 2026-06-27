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
   /** Influencing philosophical traditions (e.g. Marxism, Liberalism, Conservatism, etc.). Display-only. */
   philosophies?: string[]

   /** Sub-ideology variants (e.g. Stalinism under Marxism-Leninism). Display-only. */
   subTheories?: string[]

   /** Normative ethics frameworks this ideology draws on (e.g. deontology, consequentialism, virtue ethics). Display-only. */
   ethicalTheory?: string[]

   /** Philosophies primarily shaping normative (ought-to-be) commitments. Subset of `philosophies`. */
   normativePhilosophies?: string[]

   /** Philosophies primarily shaping descriptive (what-is) empirical beliefs. Subset of `philosophies`. */
   descriptivePhilosophies?: string[]

   /** Philosophies primarily shaping prescriptive (what-to-do) policy/strategy preferences. Subset of `philosophies`. */
   prescriptivePhilosophies?: string[]

   /** Structured mapping from influencing philosophy to specific axis-score effects. */
   philosophyInfluences?: Array<{
      philosophy: string
      /** Explanation of how this philosophy affects the ideology's axis positions. */
      description: string
      /** Axis IDs this philosophy primarily influences. */
      affectedAxes: AxisId[]
   }>
}
