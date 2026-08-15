export const VERSION_BUNDLE_KEYS = [
  "architectureVersion",
  "implementationSpecVersion",
  "decisionLogVersion",
  "bankVersion",
  "scoringVersion",
  "taxonomyVersion",
  "primaryMeasurementVersion",
  "modifierMeasurementVersion",
  "formVersion",
  "schemaVersion",
  "consentVersion",
  "qualityRuleVersion",
  "studyId",
  "specialistRosterVersion",
  "specialistAssignmentStrategy",
  "researchTaskBankVersion",
  "researchEstimatorVersion",
  "descriptiveCalibrationVersion",
  "strategyTaskBankVersion",
  "normativeTradeoffVersion",
  "modelComparisonVersion",
  "unfoldingAnalysisVersion",
  "perceptionGeometryVersion",
  "profileDiscoveryVersion",
  "prototypeCodingVersion",
  "deploymentScopeVersion",
  "constructFamilyMapVersion",
  "criterionPlanVersion",
  "validatorBatteryVersion",
  "prototypeCalibrationVersion",
  "difPlanVersion",
  "contentReviewVersion",
  "cognitiveReviewVersion",
  "labelExposureVersion",
  "formEquivalenceVersion",
  "anchorRotationVersion",
  "validationReportVersion",
  "itemMetadataVersion",
];

export const FROZEN_VERSION_VALUES = {
  architectureVersion: "2026-08-measurement-architecture-v1",
  implementationSpecVersion: "2026-08-implementation-spec-v1",
  decisionLogVersion: "2026-08-methodological-decisions-v1",
  specialistRosterVersion: "2026-08-specialist-roster-v1",
  specialistAssignmentStrategy: "balanced-hash-v2",
  researchEstimatorVersion: "2026-08-research-estimators-v1",
  descriptiveCalibrationVersion: "2026-08-descriptive-calibration-v1",
  strategyTaskBankVersion: "2026-08-strategy-task-bank-v1",
  normativeTradeoffVersion: "2026-08-normative-tradeoff-v1",
  modelComparisonVersion: "2026-08-model-comparison-v1",
  unfoldingAnalysisVersion: "2026-08-unfolding-analysis-v1",
  perceptionGeometryVersion: "2026-08-perception-geometry-v1",
  profileDiscoveryVersion: "2026-08-profile-discovery-v1",
  prototypeCodingVersion: "2026-08-prototype-coding-v1",
  deploymentScopeVersion: "2026-08-deployment-scope-v1",
  constructFamilyMapVersion: "2026-08-construct-family-map-v1",
  criterionPlanVersion: "2026-08-criterion-plan-v1",
  validatorBatteryVersion: "2026-08-validator-battery-v1",
  prototypeCalibrationVersion: "2026-08-prototype-calibration-v1",
  difPlanVersion: "2026-08-dif-plan-v1",
  contentReviewVersion: "2026-08-content-review-v1",
  cognitiveReviewVersion: "2026-08-cognitive-review-v1",
  labelExposureVersion: "2026-08-label-exposure-v1",
  formEquivalenceVersion: "2026-08-form-equivalence-v1",
  anchorRotationVersion: "2026-08-anchor-rotation-v1",
  validationReportVersion: "2026-08-validation-report-v1",
  itemMetadataVersion: "2026-08-item-metadata-v1",
};

export function versionBundleMatches(bundle, expected) {
  if (!bundle || typeof bundle !== "object" || Array.isArray(bundle)) {
    return false;
  }
  const keys = Object.keys(bundle);
  return (
    keys.length === VERSION_BUNDLE_KEYS.length &&
    VERSION_BUNDLE_KEYS.every(
      (key) =>
        typeof bundle[key] === "string" &&
        bundle[key].trim().length > 0 &&
        bundle[key] === expected[key],
    )
  );
}
