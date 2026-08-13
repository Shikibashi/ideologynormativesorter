import type { AxisId, LabelId } from "./common";

export type IdeologyLabelSourceKind =
  | "primary-text"
  | "scholarly"
  | "reference";
export type IdeologyLabelSourceScope =
  | "definition"
  | "normative"
  | "descriptive"
  | "prescriptive"
  | "boundary";

/** Public background source attached to a label explanation. */
export interface IdeologyLabelSource {
  sourceId: string;
  title: string;
  publisher?: string;
  url: string;
  kind: IdeologyLabelSourceKind;
  supports: readonly IdeologyLabelSourceScope[];
  /** Explains what the source supports and what it does not establish. */
  note: string;
}

/**
 * A deliberately narrow set of constructs used to compare a broad primary
 * tradition. It prevents a family label from inheriting a score from every
 * empirical or strategic stereotype encoded in a legacy full centroid.
 */
export interface LabelScoringScope {
  version: string;
  /** Axis dimensions that are doctrinally relevant to this comparison. */
  axisIds: readonly AxisId[];
  /** Every required construct must have respondent evidence before a primary match is exposed. */
  requiredAxisIds: readonly AxisId[];
  /** Minimum direct responses needed for a required construct when one item would be too thin. */
  minimumItemCounts?: Readonly<Partial<Record<AxisId, number>>>;
  /** Public label-source records used to select this scope. */
  sourceIds: readonly string[];
  /** Why these axes are constitutive enough for an ordinary family-level comparison. */
  rationale: string;
  /** Important core constructs the current ordinary bank does not yet distinguish. */
  limitation?: string;
}

export interface IdeologyLabel {
  id: LabelId;
  name: string;
  family: string;
  /** Optional second-level grouping within a family, used for the family-tree display. */
  subfamily?: string;
  /** Reference position in axis-space used for nearest-label distance matching. */
  centroid: Record<AxisId, number>;
  /** Optional source-backed restriction for an ordinary primary comparison. */
  scoringScope?: LabelScoringScope;
  description: string;
  /** Short user-facing note for labels whose academic usage is contested, niche, or easily conflated. */
  cautionNote?: string;
  /** Plain-language clarification shown with the label when extra context helps users interpret it. */
  usageNote?: string;
  /** Public interpretive sources for the label's definition or layer-specific explanation. */
  sources?: readonly IdeologyLabelSource[];
  /** Alternate names for this same label. Child or neighboring ideologies belong in subTheories or separate labels. */
  aliases?: string[];
  /** Influencing philosophical traditions (e.g. Marxism, Liberalism, Conservatism, etc.). Display-only. */
  philosophies?: string[];

  /** Sub-ideology variants (e.g. Stalinism under Marxism-Leninism). Display-only. */
  subTheories?: string[];

  /** Normative ethics frameworks this ideology draws on (e.g. deontology, consequentialism, virtue ethics). Display-only. */
  ethicalTheory?: string[];

  /** Philosophies primarily shaping normative (ought-to-be) commitments. Subset of `philosophies`. */
  normativePhilosophies?: string[];

  /** Philosophies primarily shaping descriptive (what-is) empirical beliefs. Subset of `philosophies`. */
  descriptivePhilosophies?: string[];

  /** Philosophies primarily shaping prescriptive (what-to-do) policy/strategy preferences. Subset of `philosophies`. */
  prescriptivePhilosophies?: string[];

  /** Structured mapping from influencing philosophy to specific axis-score effects. */
  philosophyInfluences?: Array<{
    philosophy: string;
    /** Explanation of how this philosophy affects the ideology's axis positions. */
    description: string;
    /** Axis IDs this philosophy primarily influences. */
    affectedAxes: AxisId[];
  }>;
}
