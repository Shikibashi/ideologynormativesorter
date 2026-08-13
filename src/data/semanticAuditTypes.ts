import type { AxisWeight } from "../types";

export type SemanticIssue =
  | "sign-inversion"
  | "construct-mismatch"
  | "template-carryover"
  | "double-barreled"
  | "non-discriminating"
  | "underspecified";

export interface SemanticCorrection {
  issue: Exclude<
    SemanticIssue,
    "double-barreled" | "non-discriminating" | "underspecified"
  >;
  rationale: string;
  axisWeights: AxisWeight[];
}

export interface SemanticRewriteReview {
  issue: Extract<
    SemanticIssue,
    "double-barreled" | "non-discriminating" | "underspecified"
  >;
  rationale: string;
}
