import type { AxisId, Layer, QuestionId } from "./common";

export type VNextItemDisposition =
  | "empirical review required"
  | "retain"
  | "rewrite"
  | "replace"
  | "retain with minor edit";

export type VNextItemAnalysisEligibility =
  | "research-only"
  | "specialist-module-only"
  | "ipsative-only"
  | "blocked-pending-replacement";

export interface VNextStatementOptionAnnotation {
  optionId: string;
  text: string;
  semanticDirection: string;
  rootIds: readonly AxisId[];
  facetIds: readonly string[];
  localConstructIds: readonly string[];
}

export interface VNextItemAnnotation {
  itemId: QuestionId;
  surface: "core" | "specialist";
  moduleId?: string;
  domainId: string;
  layer: Layer;
  intendedRootIds: readonly AxisId[];
  facetIds: readonly string[];
  localConstructIds: readonly string[];
  semanticDirection: string;
  discrimination: string;
  riskFlags: readonly string[];
  depth: string;
  sourceProvenance: string;
  sourceRecordIds: readonly string[];
  disposition: VNextItemDisposition;
  coverageConsequence: string;
  replacementRequired: boolean;
  replacementQuestionId?: QuestionId;
  analysisEligibility: VNextItemAnalysisEligibility;
  optionRecords?: readonly VNextStatementOptionAnnotation[];
}
