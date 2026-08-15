import type { VNextClaimTier, VNextEvidenceComponentId } from "./vnextEvidence";

export const VNEXT_VALIDATION_STAGES = [
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "V11",
  "V12",
  "V13",
] as const;
export type VNextValidationStage = (typeof VNEXT_VALIDATION_STAGES)[number];

export const VNEXT_ANALYSIS_SPLITS = [
  "development",
  "tuning",
  "confirmation",
  "retest",
  "criterion",
  "subgroup-form",
  "replication",
] as const;
export type VNextAnalysisSplit = (typeof VNEXT_ANALYSIS_SPLITS)[number];

export type VNextResponseState =
  | "answered"
  | "dont_know"
  | "prefer_not_to_answer"
  | "refusal"
  | "omitted"
  | "invalid";

export interface VNextSplitRule {
  split: VNextAnalysisSplit;
  unit: "respondent" | "respondent-administration";
  assignment:
    | "preregistered-random"
    | "prospective-wave"
    | "linked-retest"
    | "declared-subgroup-form";
  itemLevelRandomizationAllowed: false;
  leakageRule: string;
}

export interface VNextSampleMembership {
  respondentId: string;
  administrationId: string;
  wave: string;
  split: VNextAnalysisSplit;
  included: boolean;
  exclusionReason?: string;
}

export interface VNextRawResponseRecord {
  respondentId: string;
  administrationId: string;
  questionId: string;
  itemVersion: string;
  formId: string;
  split: VNextAnalysisSplit;
  rawAnswer: unknown;
  codedValue?: number;
  responseState: VNextResponseState;
  order: number;
  timestamp?: string;
  labelExposureArm: string;
  labelExposureTiming:
    | "before-questionnaire"
    | "during-questionnaire"
    | "after-questionnaire"
    | "none";
}

export interface VNextCriterionRecord {
  respondentId: string;
  administrationId: string;
  criterionId: string;
  criterionVersion: string;
  kind: string;
  timing: "pre-questionnaire" | "post-questionnaire" | "follow-up";
  exposureTiming:
    | "before-questionnaire"
    | "after-questionnaire"
    | "not-exposed";
  value: unknown;
  missingReason?: string;
  independentCollectionId: string;
}

export interface VNextValidationManifest {
  manifestId: string;
  manifestVersion: string;
  stage: VNextValidationStage;
  preregistration: {
    id: string;
    status: "design-ready" | "amended" | "closed";
    hypotheses: readonly string[];
    estimands: readonly string[];
    decisionRules: readonly string[];
  };
  objectIds: readonly string[];
  evidenceCardIds: readonly string[];
  scope: {
    population: string;
    language: string;
    region: string;
    form: string;
    time: string;
  };
  versionBundle: Readonly<Record<string, string>>;
  codeRevision: string;
  frozenProductionBaselineRevision: string;
  surfaceManifestIds: readonly string[];
  seed: number;
  itemFingerprint: string;
  optionFingerprint: string;
  formFingerprint: string;
  formId: string;
  itemIds: readonly string[];
  itemVersions: Readonly<Record<string, string>>;
  splitRules: readonly VNextSplitRule[];
  sampleMembership: readonly VNextSampleMembership[];
  responses: readonly VNextRawResponseRecord[];
  criteria: readonly VNextCriterionRecord[];
  inclusionManifestId: string;
  analysisManifestIds: readonly string[];
  estimand: string;
  claimTierCeiling: VNextClaimTier;
  componentLinks: Readonly<Record<string, readonly VNextEvidenceComponentId[]>>;
  dataDictionary: readonly string[];
}
