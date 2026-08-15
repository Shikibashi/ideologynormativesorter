// Decision IDs: D-01, D-02, D-04, D-21, D-26, D-28.
import type {
  AxisId,
  DomainId,
  Layer,
  QuestionId,
  TheoryContext,
} from "./common";

export type FamilyCoverage =
  | "complete"
  | "partial"
  | "missing"
  | "out-of-scope";

export interface ConstructFamilyCell {
  layer: Layer;
  domainId: DomainId;
  axisIds: readonly AxisId[];
  theoryContexts: readonly TheoryContext[];
  itemIds: readonly QuestionId[];
  researchTaskIds?: readonly string[];
  responseFormats: readonly string[];
  expectedCriteria: readonly string[];
  coverage: FamilyCoverage;
  reviewRecordIds: readonly string[];
}

export interface ConstructFamily {
  id: string;
  name: string;
  substantiveProblem: string;
  domainId: DomainId;
  axisIds: readonly AxisId[];
  cells: Partial<Record<Layer, ConstructFamilyCell>>;
  status: "active" | "research" | "out-of-scope";
}

export interface ConstructFamilyMap {
  version: string;
  architectureVersion: string;
  families: readonly ConstructFamily[];
}

export type CalibrationEligibility =
  | "eligible"
  | "pending-review"
  | "ineligible";

export type ItemLinkingRole =
  | "anchor"
  | "rotating"
  | "contemporary"
  | "calibration"
  | "specialist-only";

export interface ResearchItemMetadata {
  familyId: string;
  calibrationEligibility: CalibrationEligibility;
  linkingRole?: ItemLinkingRole;
  wordingFormId: string;
  responseProcessTags: readonly string[];
}

/** Common envelope for opt-in response-process research tasks. */
export interface ResearchTaskConstraint {
  id: string;
  description: string;
}

export interface ResearchTaskStimulus {
  description: string;
  profileDescription?: string;
  constraints: readonly ResearchTaskConstraint[];
}

export interface ResearchTaskAttribute {
  id: string;
  description: string;
  levels: readonly string[];
}

export interface ResearchTaskAttributeProfile {
  id: string;
  description: string;
  levels: Readonly<Record<string, string>>;
}

export interface ResearchTaskProfileStimulus {
  id: string;
  version: string;
  description: string;
}

export interface ResearchTaskBase {
  id: string;
  version: string;
  familyId?: string;
  domainId: DomainId;
  layer: Layer;
  theoryContext: TheoryContext;
  prompt: string;
  criterionIds: readonly string[];
  stimulus: ResearchTaskStimulus;
  randomizationSeedKey?: string;
}

export type ResearchTask =
  | (ResearchTaskBase & {
      kind: "probability" | "forecast";
      propositionId: string;
      outcomeId: string;
      horizon: string;
      probabilityScale: "0-100";
      allowDontKnow: boolean;
      outcomeDescription: string;
      resolutionSource?: string;
      outcomeVersion?: string;
    })
  | (ResearchTaskBase & {
      kind: "constrained-choice" | "conjoint";
      choiceSetId: string;
      attributes: readonly ResearchTaskAttribute[];
      attributeProfiles: readonly ResearchTaskAttributeProfile[];
      alternatives: readonly string[];
      constraintProfileId: string;
    })
  | (ResearchTaskBase & {
      kind: "allocation" | "forced-tradeoff";
      goods: readonly string[];
      goodDescriptions: Readonly<Record<string, string>>;
      totalUnits: number;
      constraints: readonly string[];
    })
  | (ResearchTaskBase & {
      kind: "similarity" | "sort";
      stimulusIds: readonly string[];
      stimuli: readonly ResearchTaskProfileStimulus[];
      responseScale: string;
    });

export type ResearchTaskResponse =
  | { taskId: string; kind: "probability" | "forecast"; probability: number }
  | {
      taskId: string;
      kind: "probability" | "forecast";
      value: "dont_know" | "prefer_not_to_answer";
    }
  | {
      taskId: string;
      kind: "constrained-choice" | "conjoint";
      attributeProfile: ResearchTaskAttributeProfile;
      chosenAlternative: string;
    }
  | {
      taskId: string;
      kind: "constrained-choice" | "conjoint";
      attributeProfile: ResearchTaskAttributeProfile;
      value: "none" | "prefer_not_to_answer";
    }
  | {
      taskId: string;
      kind: "allocation" | "forced-tradeoff";
      allocations: Record<string, number>;
    }
  | {
      taskId: string;
      kind: "allocation" | "forced-tradeoff";
      value: "prefer_not_to_answer";
    }
  | {
      taskId: string;
      kind: "similarity" | "sort";
      ratings: Record<string, number>;
    }
  | { taskId: string; kind: "similarity" | "sort"; order: readonly string[] }
  | {
      taskId: string;
      kind: "similarity" | "sort";
      value: "prefer_not_to_answer";
    };

export interface CriterionObservation {
  criterionId: string;
  criterionVersion: string;
  layer?: Layer;
  kind:
    | "self-label"
    | "external-scale"
    | "behavior"
    | "forecast-outcome"
    | "expert-code"
    | "novel-scenario";
  value: unknown;
  collectionWave: string;
  timing: "pre-questionnaire" | "post-questionnaire" | "follow-up";
  missingReason?:
    | "declined"
    | "not-applicable"
    | "unresolved"
    | "not-collected";
}

export interface PrototypeDistribution {
  labelId: string;
  version: string;
  scope: {
    geography?: string;
    language?: string;
    historicalPeriod?: string;
  };
  axisIds: readonly AxisId[];
  means: Record<AxisId, number>;
  scales: Record<AxisId, number>;
  covariance?: number[][];
  expertDispersion?: Record<AxisId, number>;
  bridgeSampleId?: string;
  sourceIds: readonly string[];
}

/** Machine-readable provenance required on every future analysis artifact. */
export interface ResearchAnalysisMetadata {
  recordType: "analysis";
  analysisId: string;
  analysisVersion: string;
  studyId: string;
  codeRevision: string;
  inclusionManifestId: string;
  sample: {
    includedN: number;
    excludedN: number;
    denominatorDescription: string;
  };
  estimand: string;
  seed: number;
  versionBundle: Record<string, string>;
  itemFingerprint?: string;
  taskFingerprint?: string;
  formFingerprint?: string;
  modelId?: string;
}

export type ResearchPrecisionStatus =
  | "estimated"
  | "insufficient-data"
  | "not-applicable";

export interface ResearchPrecisionOutput {
  status: ResearchPrecisionStatus;
  estimand: string;
  observedN: number;
  denominatorN: number;
  coverage: number;
  standardError?: number;
  interval?: {
    lower: number;
    upper: number;
    method: "normal-approximation" | "bootstrap" | "model-based";
  };
  information?: {
    observed: number;
    expected?: number;
    scale: string;
  };
  localDependenceFlag?: "none" | "review" | "insufficient-data";
  reason: string;
}

export type ResearchModelFamily =
  | "production-baseline"
  | "one-factor"
  | "correlated-factor"
  | "higher-order"
  | "bifactor"
  | "multidimensional"
  | "graded-response";

export interface ResearchModelSpecification {
  id: string;
  version: string;
  family: ResearchModelFamily;
  estimand: string;
  identification: string;
  itemEligibility: string;
  priorsOrEstimator: string;
  seed: number;
  developmentFraction: number;
  confirmationFraction: number;
  fitCriteria: readonly string[];
  productionBaselineComparison: boolean;
}

export interface ResearchModelResult {
  metadata: ResearchAnalysisMetadata;
  model: ResearchModelSpecification;
  status: "converged" | "nonconverged" | "insufficient-data" | "skipped";
  fit?: Record<string, number | null>;
  rankStability?: number | null;
  criterionPerformance?: Record<string, number | null>;
  reason: string;
}

export interface ResearchDIFPlan {
  version: string;
  deploymentScopeVersion: string;
  targetGroups: readonly string[];
  minimumUsableN: number;
  preferredN: number;
  effectSizeRule: string;
  multipleTestingMethod: string;
  invarianceMethod:
    | "graded-response"
    | "partial-invariance"
    | "approximate-invariance";
  inferredGroupsAllowed: false;
}

export interface ResearchFormEquivalenceReport {
  version: string;
  studyId: string;
  shortFormFingerprint: string;
  fullFormFingerprint: string;
  estimand: string;
  heldOutN: number;
  axisAgreement?: number;
  neighborhoodStability?: number;
  coverageDifference?: number;
  uncertaintyDifference?: number;
  burdenDifference?: number;
  status: "estimated" | "insufficient-data" | "not-applicable";
  reason: string;
}

export interface AnchorItemRecord {
  questionId: QuestionId;
  itemVersion: string;
  wave: string;
  role: "anchor" | "rotating" | "contemporary";
  axisIds: readonly AxisId[];
  layer: Layer;
  formVersions: readonly string[];
  politicalContextPeriod?: string;
}

export interface AnchorRotationManifest {
  version: string;
  studyId: string;
  anchors: readonly AnchorItemRecord[];
  rotationRate: number;
  linkingMethod: "none" | "mean-sigma" | "IRT-linking" | "regression-linking";
  changedItemReviewRequired: true;
}

export interface DeploymentScopeMetadata {
  version: string;
  locale: string;
  language: string;
  countryOrRegion?: string;
  translationVersion: string;
  labelScopeVersion: string;
  historicalPeriod?: string;
  backTranslationReviewed: boolean;
  invarianceStatus: "not-tested" | "partial" | "supported" | "not-supported";
}

export interface ExpertCodeRecord {
  codingVersion: string;
  labelId: string;
  sourceUnitId: string;
  scope: DeploymentScopeMetadata;
  codedAxisProfile: Record<AxisId, number>;
  uncertainty: Record<AxisId, number>;
  bridgeItemIds: readonly QuestionId[];
  independentCoderId: string;
  sourceIds: readonly string[];
}

export interface BridgeResponseRecord {
  bridgeStudyId: string;
  codingVersion: string;
  participantId: string;
  expertSourceUnitId: string;
  itemVersion: string;
  scopeVersion: string;
  observedAxisValues: Record<AxisId, number>;
  missingAxisIds: readonly AxisId[];
}

export type LabelExposureArm =
  | "dimension-only"
  | "unlabeled-profile"
  | "named-label";

export interface LabelExposureAssignment {
  version: string;
  studyId: string;
  participantId: string;
  arm: LabelExposureArm;
  seed: string;
  assignedAfterSubstantiveResponses: true;
}

export type LabelExposureRating = number | "prefer_not_to_answer";

export interface LabelExposureRatings {
  perceivedAccuracy: LabelExposureRating;
  identityAcceptance: LabelExposureRating;
  confidence: LabelExposureRating;
  affect: LabelExposureRating;
  followUpStability: LabelExposureRating;
}

export type LabelExposurePosition =
  | "near the midpoint"
  | "slightly toward"
  | "leans toward"
  | "strongly toward"
  | "unmeasured";

export type LabelExposureCoverageBand =
  | "insufficient"
  | "low"
  | "medium"
  | "high";

export interface LabelExposureAxisSnapshot {
  axisId: string;
  layer: Layer;
  name: string;
  position: LabelExposurePosition;
  pole?: string;
  coverageBand: LabelExposureCoverageBand;
}

export interface LabelExposurePresentation {
  version: string;
  fingerprint: string;
  axes: readonly LabelExposureAxisSnapshot[];
}

export interface LabelExposureOutcome {
  assignment: LabelExposureAssignment;
  exposureShown: boolean;
  presentation?: LabelExposurePresentation;
  exposedLabelIds: readonly string[];
  ratings: LabelExposureRatings;
  missingReason?: "declined" | "not-shown" | "unresolved";
}

export type ResearchTaskArm =
  | "all"
  | "probability"
  | "choice"
  | "allocation"
  | "similarity";
