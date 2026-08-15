// Decision IDs: D-00, D-06, D-10, D-11, D-12, D-14, D-29.
// Research-only contract checks. This module must not be imported by the
// production scoring path.
import { QUESTION_BANK_VERSION } from "../data/effectiveQuestions";
import { MODIFIER_MEASUREMENT_VERSION } from "../data/modifierMeasurement";
import { PRIMARY_MEASUREMENT_VERSION } from "../data/primaryMeasurement";
import { TAXONOMY_VERSION } from "../data/labelTaxonomy";
import { ITEM_METADATA_VERSION } from "../data/itemMetadata";
import { RESEARCH_FORM_VERSION } from "../research/forms";
import {
  SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  SPECIALIST_ASSIGNMENT_STRATEGY,
} from "../specialist";
import { RESULT_SCORING_VERSION } from "../scoring";
import type { Layer, TheoryContext } from "../types";
import {
  ANCHOR_ROTATION_VERSION,
  COGNITIVE_REVIEW_VERSION,
  CONSTRUCT_FAMILY_MAP_VERSION,
  CONTENT_REVIEW_VERSION,
  CRITERION_PLAN_VERSION,
  DEPLOYMENT_SCOPE_VERSION,
  DESCRIPTIVE_CALIBRATION_VERSION,
  DIF_PLAN_VERSION,
  FORM_EQUIVALENCE_VERSION,
  IMPLEMENTATION_SPECIFICATION_VERSION,
  LABEL_EXPOSURE_VERSION,
  MEASUREMENT_ARCHITECTURE_VERSION,
  METHODOLOGICAL_DECISION_LOG_VERSION,
  MODEL_COMPARISON_VERSION,
  NORMATIVE_TRADEOFF_VERSION,
  PERCEPTION_GEOMETRY_VERSION,
  PROFILE_DISCOVERY_VERSION,
  PROTOTYPE_CODING_VERSION,
  PROTOTYPE_CALIBRATION_VERSION,
  RESEARCH_CONSENT_VERSION,
  RESEARCH_QUALITY_RULE_VERSION,
  RESEARCH_SCHEMA_VERSION,
  RESEARCH_STUDY_ID,
  RESEARCH_ESTIMATOR_VERSION,
  RESEARCH_TASK_BANK_VERSION,
  RESEARCH_TASK_FORM_VERSION,
  STRATEGY_TASK_BANK_VERSION,
  UNFOLDING_ANALYSIS_VERSION,
  VALIDATION_REPORT_VERSION,
  VALIDATOR_BATTERY_VERSION,
} from "../research/versions";

export {
  ANCHOR_ROTATION_VERSION,
  COGNITIVE_REVIEW_VERSION,
  CONSTRUCT_FAMILY_MAP_VERSION,
  CONTENT_REVIEW_VERSION,
  CRITERION_PLAN_VERSION,
  DEPLOYMENT_SCOPE_VERSION,
  DESCRIPTIVE_CALIBRATION_VERSION,
  DIF_PLAN_VERSION,
  FORM_EQUIVALENCE_VERSION,
  IMPLEMENTATION_SPECIFICATION_VERSION,
  LABEL_EXPOSURE_VERSION,
  MEASUREMENT_ARCHITECTURE_VERSION,
  METHODOLOGICAL_DECISION_LOG_VERSION,
  MODEL_COMPARISON_VERSION,
  NORMATIVE_TRADEOFF_VERSION,
  PERCEPTION_GEOMETRY_VERSION,
  PROFILE_DISCOVERY_VERSION,
  PROTOTYPE_CODING_VERSION,
  PROTOTYPE_CALIBRATION_VERSION,
  RESEARCH_ESTIMATOR_VERSION,
  RESEARCH_TASK_BANK_VERSION,
  RESEARCH_TASK_FORM_VERSION,
  STRATEGY_TASK_BANK_VERSION,
  UNFOLDING_ANALYSIS_VERSION,
  VALIDATION_REPORT_VERSION,
  VALIDATOR_BATTERY_VERSION,
};

export interface MeasurementVersionBundle {
  architectureVersion: string;
  implementationSpecVersion: string;
  decisionLogVersion: string;
  bankVersion: string;
  scoringVersion: string;
  taxonomyVersion: string;
  primaryMeasurementVersion: string;
  modifierMeasurementVersion: string;
  formVersion: string;
  schemaVersion: string;
  consentVersion: string;
  qualityRuleVersion: string;
  studyId: string;
  specialistRosterVersion: string;
  specialistAssignmentStrategy: string;
  researchTaskBankVersion: string;
  researchEstimatorVersion: string;
  descriptiveCalibrationVersion: string;
  strategyTaskBankVersion: string;
  normativeTradeoffVersion: string;
  modelComparisonVersion: string;
  unfoldingAnalysisVersion: string;
  perceptionGeometryVersion: string;
  profileDiscoveryVersion: string;
  prototypeCodingVersion: string;
  deploymentScopeVersion: string;
  constructFamilyMapVersion: string;
  criterionPlanVersion: string;
  validatorBatteryVersion: string;
  prototypeCalibrationVersion: string;
  difPlanVersion: string;
  contentReviewVersion: string;
  cognitiveReviewVersion: string;
  labelExposureVersion: string;
  formEquivalenceVersion: string;
  anchorRotationVersion: string;
  validationReportVersion: string;
  itemMetadataVersion: string;
}

export const CURRENT_RESEARCH_VERSION_BUNDLE = {
  architectureVersion: MEASUREMENT_ARCHITECTURE_VERSION,
  implementationSpecVersion: IMPLEMENTATION_SPECIFICATION_VERSION,
  decisionLogVersion: METHODOLOGICAL_DECISION_LOG_VERSION,
  bankVersion: QUESTION_BANK_VERSION,
  scoringVersion: RESULT_SCORING_VERSION,
  taxonomyVersion: TAXONOMY_VERSION,
  primaryMeasurementVersion: PRIMARY_MEASUREMENT_VERSION,
  modifierMeasurementVersion: MODIFIER_MEASUREMENT_VERSION,
  formVersion: RESEARCH_FORM_VERSION,
  schemaVersion: RESEARCH_SCHEMA_VERSION,
  consentVersion: RESEARCH_CONSENT_VERSION,
  qualityRuleVersion: RESEARCH_QUALITY_RULE_VERSION,
  studyId: RESEARCH_STUDY_ID,
  specialistRosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  specialistAssignmentStrategy: SPECIALIST_ASSIGNMENT_STRATEGY,
  researchTaskBankVersion: RESEARCH_TASK_BANK_VERSION,
  researchEstimatorVersion: RESEARCH_ESTIMATOR_VERSION,
  descriptiveCalibrationVersion: DESCRIPTIVE_CALIBRATION_VERSION,
  strategyTaskBankVersion: STRATEGY_TASK_BANK_VERSION,
  normativeTradeoffVersion: NORMATIVE_TRADEOFF_VERSION,
  modelComparisonVersion: MODEL_COMPARISON_VERSION,
  unfoldingAnalysisVersion: UNFOLDING_ANALYSIS_VERSION,
  perceptionGeometryVersion: PERCEPTION_GEOMETRY_VERSION,
  profileDiscoveryVersion: PROFILE_DISCOVERY_VERSION,
  prototypeCodingVersion: PROTOTYPE_CODING_VERSION,
  deploymentScopeVersion: DEPLOYMENT_SCOPE_VERSION,
  constructFamilyMapVersion: CONSTRUCT_FAMILY_MAP_VERSION,
  criterionPlanVersion: CRITERION_PLAN_VERSION,
  validatorBatteryVersion: VALIDATOR_BATTERY_VERSION,
  prototypeCalibrationVersion: PROTOTYPE_CALIBRATION_VERSION,
  difPlanVersion: DIF_PLAN_VERSION,
  contentReviewVersion: CONTENT_REVIEW_VERSION,
  cognitiveReviewVersion: COGNITIVE_REVIEW_VERSION,
  labelExposureVersion: LABEL_EXPOSURE_VERSION,
  formEquivalenceVersion: FORM_EQUIVALENCE_VERSION,
  anchorRotationVersion: ANCHOR_ROTATION_VERSION,
  validationReportVersion: VALIDATION_REPORT_VERSION,
  itemMetadataVersion: ITEM_METADATA_VERSION,
} satisfies MeasurementVersionBundle;

const REQUIRED_VERSION_KEYS = Object.keys(
  CURRENT_RESEARCH_VERSION_BUNDLE,
) as Array<keyof MeasurementVersionBundle>;

const VERSION_KEYS = new Set<keyof MeasurementVersionBundle>(
  REQUIRED_VERSION_KEYS,
);

export function buildResearchVersionBundle(
  overrides: Partial<MeasurementVersionBundle> = {},
): MeasurementVersionBundle {
  return { ...CURRENT_RESEARCH_VERSION_BUNDLE, ...overrides };
}

export function versionBundleErrors(
  bundle: Partial<MeasurementVersionBundle>,
  expected: Partial<MeasurementVersionBundle> = CURRENT_RESEARCH_VERSION_BUNDLE,
): string[] {
  const errors: string[] = [];
  for (const key of Object.keys(bundle)) {
    if (!VERSION_KEYS.has(key as keyof MeasurementVersionBundle)) {
      errors.push(`${key} is not part of the frozen research contract`);
    }
  }
  for (const key of REQUIRED_VERSION_KEYS) {
    if (!bundle[key]) {
      errors.push(`${key} is required`);
      continue;
    }
    if (expected[key] && bundle[key] !== expected[key]) {
      errors.push(`${key} does not match the frozen research contract`);
    }
  }
  return errors;
}

export function assertCurrentVersionBundle(
  bundle: Partial<MeasurementVersionBundle>,
): asserts bundle is MeasurementVersionBundle {
  const errors = versionBundleErrors(bundle);
  if (errors.length > 0) {
    throw new Error(
      `Research version contract violation: ${errors.join("; ")}`,
    );
  }
}

const LAYER_VALUES = ["normative", "descriptive", "prescriptive"] as const;
const THEORY_CONTEXT_VALUES = ["ideal", "nonideal", "mixed"] as const;

export function isLayer(value: unknown): value is Layer {
  return typeof value === "string" && LAYER_VALUES.includes(value as Layer);
}

export function isTheoryContext(value: unknown): value is TheoryContext {
  return (
    typeof value === "string" &&
    THEORY_CONTEXT_VALUES.includes(value as TheoryContext)
  );
}

export function layerContextErrors(
  layer: unknown,
  theoryContext: unknown,
): string[] {
  const errors: string[] = [];
  if (!isLayer(layer))
    errors.push("layer must be normative, descriptive, or prescriptive");
  if (!isTheoryContext(theoryContext)) {
    errors.push("theoryContext must be ideal, nonideal, or mixed");
  }
  return errors;
}

export type MeasurementRole =
  | "primary"
  | "modifier"
  | "specialist"
  | "context"
  | "retired";

export interface RoleBoundaryDeclaration {
  role: MeasurementRole;
  ordinaryScoringEndpoint: boolean;
  coreEvidenceStatus?: "passed" | "insufficient-evidence";
  directConstructEvidence?: boolean;
}

export function roleBoundaryErrors(
  declaration: RoleBoundaryDeclaration,
): string[] {
  const errors: string[] = [];
  if (
    declaration.ordinaryScoringEndpoint &&
    (declaration.role === "specialist" ||
      declaration.role === "context" ||
      declaration.role === "retired")
  ) {
    errors.push(
      `${declaration.role} labels cannot be ordinary scoring endpoints`,
    );
  }
  if (
    declaration.role === "primary" &&
    declaration.ordinaryScoringEndpoint &&
    declaration.coreEvidenceStatus !== "passed"
  ) {
    errors.push("primary scoring requires passed core evidence");
  }
  if (
    declaration.role === "modifier" &&
    declaration.ordinaryScoringEndpoint &&
    declaration.directConstructEvidence !== true
  ) {
    errors.push("ordinary modifier scoring requires direct construct evidence");
  }
  return errors;
}

export type ResearchRecordType =
  | "core"
  | "specialist"
  | "specialist-disposition"
  | "research-task"
  | "criterion"
  | "prototype"
  | "analysis";

export type ClaimLanguage =
  | "profile-similarity"
  | "evidence-coverage"
  | "uncertainty"
  | "research-estimate"
  | "probability"
  | "posterior"
  | "population-prevalence"
  | "representative";

export interface ResearchBoundaryDeclaration {
  recordType: ResearchRecordType;
  researchOnly: boolean;
  productionScoringInput: boolean;
  participantFacing: boolean;
  claimLanguage: ClaimLanguage;
  selfIdentificationRole?: "criterion" | "scoring";
  layer?: unknown;
  theoryContext?: unknown;
}

const HELD_CLAIM_LANGUAGES = new Set<ClaimLanguage>([
  "probability",
  "posterior",
  "population-prevalence",
  "representative",
]);

export function researchBoundaryErrors(
  declaration: ResearchBoundaryDeclaration,
): string[] {
  const errors = [
    ...(declaration.productionScoringInput
      ? ["research records cannot be production scoring inputs"]
      : []),
    ...(declaration.selfIdentificationRole === "scoring"
      ? ["self-identification is a criterion, not a scoring input"]
      : []),
    ...(declaration.participantFacing &&
    HELD_CLAIM_LANGUAGES.has(declaration.claimLanguage)
      ? [
          "probability, posterior, population, and representative claims require a later release decision",
        ]
      : []),
    ...(declaration.layer === undefined ||
    declaration.theoryContext === undefined
      ? []
      : layerContextErrors(declaration.layer, declaration.theoryContext)),
  ];
  if (!declaration.researchOnly) {
    errors.push("research records must declare researchOnly=true");
  }
  return errors;
}

export function assertResearchBoundary(
  declaration: ResearchBoundaryDeclaration,
): void {
  const errors = researchBoundaryErrors(declaration);
  if (errors.length > 0) {
    throw new Error(`Research boundary violation: ${errors.join("; ")}`);
  }
}
