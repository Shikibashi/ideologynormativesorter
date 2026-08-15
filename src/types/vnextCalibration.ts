import type { VNextClaimTier } from "./vnextEvidence";

export type VNextCalibrationArtifactStatus =
  | "not-started"
  | "design-ready"
  | "insufficient-data"
  | "conditional-pass"
  | "pass"
  | "fail";

export interface VNextReliabilityArtifact {
  status: VNextCalibrationArtifactStatus;
  estimand: string;
  method:
    | "omega"
    | "test-retest"
    | "IRT-information"
    | "model-based"
    | "not-estimable";
  observedN?: number;
  denominatorN?: number;
  itemCountOnly: false;
  precisionMetric: string;
  uncertaintyMethod: string;
}

export interface VNextUncertaintyArtifact {
  status: VNextCalibrationArtifactStatus;
  estimand: string;
  method:
    | "bootstrap"
    | "model-based"
    | "sandwich"
    | "repeated-split"
    | "not-estimable";
  observedN?: number;
  denominatorN?: number;
  interval?: { lower: number; upper: number; method: string };
  empiricalCoverage?: number;
  rankReversalRate?: number;
  abstentionErrorTradeoff?: string;
}

export interface VNextDIFInvarianceArtifact {
  status: VNextCalibrationArtifactStatus;
  estimand: string;
  groups: readonly string[];
  languages: readonly string[];
  minimumUsableNPerGroup: number;
  observedUsableNByGroup: Readonly<Record<string, number>>;
  invarianceSequence: readonly string[];
  difMethod: string;
  effectSizeRule: string;
  intervalMethod: string;
  multipleTestingMethod: string;
  anchorStrategy: string;
  scoreAndDisplayConsequences: readonly string[];
}

export interface VNextFormEquivalenceArtifact {
  status: VNextCalibrationArtifactStatus;
  estimand:
    | "construct-score"
    | "facet-rank"
    | "primary-neighborhood"
    | "modifier-display"
    | "specialist-stability"
    | "coverage-uncertainty";
  formFingerprints: readonly string[];
  presentedItemIds: Readonly<Record<string, readonly string[]>>;
  anchorItems: readonly string[];
  sampleOverlap: string;
  heldOutEvaluation: string;
  itemCountOnly: false;
}

export interface VNextRobustnessArtifact {
  status: VNextCalibrationArtifactStatus;
  omissionAnalyses: readonly string[];
  missingnessAnalyses: readonly string[];
  scoringAlternatives: readonly string[];
  trackedOutputs: readonly string[];
  preregistered: boolean;
}

export interface VNextCalibrationContract {
  contractId: string;
  contractVersion: string;
  objectIds: readonly string[];
  constructScore: {
    scale: string;
    orientation: string;
    referencePopulation: string;
    form: string;
    missingnessPolicy: string;
    expectedPrecision: string;
    criterionForMeaningfulDifference: string;
  };
  reliability: VNextReliabilityArtifact;
  uncertainty: VNextUncertaintyArtifact;
  difInvariance: VNextDIFInvarianceArtifact;
  formEquivalence: VNextFormEquivalenceArtifact;
  robustness: VNextRobustnessArtifact;
  neighborMargins: {
    status: VNextCalibrationArtifactStatus;
    estimand: string;
    heldOut: boolean;
    tieRate?: number;
    rankReversalRate?: number;
    abstentionRate?: number;
  };
  claimTierCeiling: VNextClaimTier;
  multiplicity: {
    family: string;
    method: string;
    hypotheses: number;
    preregistered: boolean;
  };
  subgroupManifest: {
    declaredGroups: readonly string[];
    voluntary: true;
    inferredFromAnswers: false;
    minimumUsableNPerGroup: number;
    intersectionalLimitations: readonly string[];
  };
  versionBundle: Readonly<Record<string, string>>;
  provenance: readonly string[];
}
