// Decision IDs: D-11, D-12, D-24–D-27.
// Scope, expert, bridge, exposure, and longitudinal linking records are
// research-only. Raw expert identities and transcripts must stay private.
import {
  DEPLOYMENT_SCOPE_VERSION,
  LABEL_EXPOSURE_VERSION,
  PROTOTYPE_CODING_VERSION,
} from "./versions";
import { buildLabelExposureAssignment } from "./index";
import { labelExposurePresentationErrors } from "./labelExposure";
import type {
  BridgeResponseRecord,
  DeploymentScopeMetadata,
  ExpertCodeRecord,
  LabelExposureAssignment,
  LabelExposureOutcome,
} from "../types";

const EXPOSURE_ARMS = new Set<LabelExposureAssignment["arm"]>([
  "dimension-only",
  "unlabeled-profile",
  "named-label",
]);

function finiteProfile(values: Record<string, number>): boolean {
  return Object.values(values).every(
    (value) => Number.isFinite(value) && value >= -1 && value <= 1,
  );
}

export function deploymentScopeMetadataErrors(
  scope: DeploymentScopeMetadata,
): string[] {
  const errors: string[] = [];
  if (scope.version !== DEPLOYMENT_SCOPE_VERSION) {
    errors.push("deployment scope version is not current");
  }
  if (!scope.locale.trim()) errors.push("deployment scope locale is required");
  if (!scope.language.trim())
    errors.push("deployment scope language is required");
  if (!scope.translationVersion.trim()) {
    errors.push("translationVersion is required");
  }
  if (!scope.labelScopeVersion.trim())
    errors.push("labelScopeVersion is required");
  if (scope.backTranslationReviewed !== true) {
    errors.push("translation scope requires back-translation review");
  }
  if (
    !new Set(["not-tested", "partial", "supported", "not-supported"]).has(
      scope.invarianceStatus,
    )
  ) {
    errors.push("deployment invarianceStatus is invalid");
  }
  return errors;
}

export function expertCodeRecordErrors(record: ExpertCodeRecord): string[] {
  const errors = [...deploymentScopeMetadataErrors(record.scope)];
  if (record.codingVersion !== PROTOTYPE_CODING_VERSION) {
    errors.push("expert coding version is not current");
  }
  if (!record.labelId.trim()) errors.push("expert code labelId is required");
  if (!record.sourceUnitId.trim())
    errors.push("expert source unit is required");
  if (!record.independentCoderId.trim())
    errors.push("independent coder id is required");
  if (record.bridgeItemIds.length === 0)
    errors.push("expert code needs bridge items");
  if (record.sourceIds.length === 0)
    errors.push("expert code needs source provenance");
  if (!finiteProfile(record.codedAxisProfile)) {
    errors.push("coded expert axis profile must be finite and bounded");
  }
  if (
    !Object.values(record.uncertainty).every(
      (value) => Number.isFinite(value) && value >= 0,
    )
  ) {
    errors.push("expert uncertainty must be finite and non-negative");
  }
  return [...new Set(errors)];
}

export function bridgeResponseRecordErrors(
  record: BridgeResponseRecord,
): string[] {
  const errors: string[] = [];
  if (!record.bridgeStudyId.trim()) errors.push("bridgeStudyId is required");
  if (record.codingVersion !== PROTOTYPE_CODING_VERSION) {
    errors.push("bridge coding version is not current");
  }
  if (!record.participantId.trim())
    errors.push("bridge participantId is required");
  if (!record.expertSourceUnitId.trim())
    errors.push("bridge expert source is required");
  if (!record.itemVersion.trim()) errors.push("bridge itemVersion is required");
  if (!record.scopeVersion.trim())
    errors.push("bridge scopeVersion is required");
  if (!finiteProfile(record.observedAxisValues)) {
    errors.push("bridge observed axis values must be finite and bounded");
  }
  const observed = new Set(Object.keys(record.observedAxisValues));
  if (record.missingAxisIds.some((axisId) => observed.has(axisId))) {
    errors.push("bridge axis cannot be both observed and missing");
  }
  return [...new Set(errors)];
}

export function scopeLinkErrors(
  left: DeploymentScopeMetadata,
  right: DeploymentScopeMetadata,
): string[] {
  const errors = [
    ...deploymentScopeMetadataErrors(left),
    ...deploymentScopeMetadataErrors(right),
  ];
  if (
    left.version !== right.version ||
    left.translationVersion !== right.translationVersion ||
    left.labelScopeVersion !== right.labelScopeVersion
  ) {
    errors.push(
      "scope-linked records require matching translation and label scope versions",
    );
  }
  return [...new Set(errors)];
}

export function labelExposureAssignmentErrors(
  assignment: LabelExposureAssignment,
): string[] {
  const errors: string[] = [];
  if (assignment.version !== LABEL_EXPOSURE_VERSION) {
    errors.push("label exposure version is not current");
  }
  if (!assignment.studyId.trim()) errors.push("exposure studyId is required");
  if (!assignment.participantId.trim())
    errors.push("exposure participantId is required");
  if (!EXPOSURE_ARMS.has(assignment.arm))
    errors.push("exposure arm is invalid");
  if (!assignment.seed.trim()) errors.push("exposure seed is required");
  if (assignment.studyId.trim() && assignment.participantId.trim()) {
    const expected = buildLabelExposureAssignment(
      assignment.studyId,
      assignment.participantId,
    );
    if (assignment.seed !== expected.seed) {
      errors.push("exposure seed does not match the frozen assignment rule");
    }
    if (assignment.arm !== expected.arm) {
      errors.push("exposure arm does not match the frozen assignment rule");
    }
  }
  if (assignment.assignedAfterSubstantiveResponses !== true) {
    errors.push("label exposure must be assigned after substantive responses");
  }
  return errors;
}

export function labelExposureOutcomeErrors(
  outcome: LabelExposureOutcome,
): string[] {
  const errors = labelExposureAssignmentErrors(outcome.assignment);
  if (
    !Array.isArray(outcome.exposedLabelIds) ||
    new Set(outcome.exposedLabelIds).size !== outcome.exposedLabelIds.length ||
    outcome.exposedLabelIds.some((labelId) => !labelId.trim())
  ) {
    errors.push("exposed label ids must be unique, non-empty ids");
  }
  const exposedLabelCount = Array.isArray(outcome.exposedLabelIds)
    ? outcome.exposedLabelIds.length
    : 0;
  if (
    outcome.exposureShown &&
    outcome.assignment.arm === "named-label" &&
    exposedLabelCount === 0
  ) {
    errors.push("named-label exposure must record the exposed label ids");
  }
  if (
    outcome.exposureShown &&
    outcome.assignment.arm !== "named-label" &&
    exposedLabelCount > 0
  ) {
    errors.push("non-label exposure arms cannot record exposed label ids");
  }
  if (outcome.exposureShown) {
    if (!outcome.presentation) {
      errors.push("shown exposure outcomes require the common presentation");
    } else {
      errors.push(...labelExposurePresentationErrors(outcome.presentation));
    }
  }
  for (const [name, value] of [
    ["perceivedAccuracy", outcome.ratings?.perceivedAccuracy],
    ["identityAcceptance", outcome.ratings?.identityAcceptance],
    ["confidence", outcome.ratings?.confidence],
    ["affect", outcome.ratings?.affect],
    ["followUpStability", outcome.ratings?.followUpStability],
  ] as const) {
    if (
      value !== undefined &&
      value !== "prefer_not_to_answer" &&
      (!Number.isFinite(value) || value < 1 || value > 5)
    ) {
      errors.push(`${name} must be a 1-5 response`);
    }
  }
  if (outcome.exposureShown === false && outcome.missingReason === undefined) {
    errors.push("unshown exposure outcomes require a missingReason");
  }
  if (outcome.exposureShown === true && outcome.missingReason === "not-shown") {
    errors.push("shown exposure outcomes cannot use the not-shown reason");
  }
  return [...new Set(errors)];
}

export function assertExpertCodeRecord(record: ExpertCodeRecord): void {
  const errors = expertCodeRecordErrors(record);
  if (errors.length > 0)
    throw new Error(`Expert code violation: ${errors.join("; ")}`);
}

export function assertBridgeResponseRecord(record: BridgeResponseRecord): void {
  const errors = bridgeResponseRecordErrors(record);
  if (errors.length > 0)
    throw new Error(`Bridge response violation: ${errors.join("; ")}`);
}

export function assertLabelExposureOutcome(
  outcome: LabelExposureOutcome,
): void {
  const errors = labelExposureOutcomeErrors(outcome);
  if (errors.length > 0)
    throw new Error(`Label exposure violation: ${errors.join("; ")}`);
}
