import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  FROZEN_VERSION_VALUES,
  versionBundleMatches,
} from "../research-worker/src/researchVersionBundle.mjs";
import {
  taskMatchesResearchArm as taskMatchesResearchArmPayload,
  validResearchTask as validResearchTaskPayload,
  validResearchTaskResponse as validResearchTaskResponsePayload,
} from "../research-worker/src/researchTaskContract.mjs";

const port = Number(process.env.PORT ?? 8787);
const outputFile = resolve(
  process.env.RESEARCH_OUTPUT_FILE ?? "./private-data/submissions.ndjson",
);
const specialistOutputFile = resolve(
  process.env.SPECIALIST_RESEARCH_OUTPUT_FILE ??
    "./private-data/specialist-submissions.ndjson",
);
const researchTaskOutputFile = resolve(
  process.env.RESEARCH_TASK_OUTPUT_FILE ??
    "./private-data/research-task-submissions.ndjson",
);
const allowedOrigin = process.env.ALLOWED_ORIGIN?.trim() ?? "";
const maximumBodyBytes = Number(process.env.MAXIMUM_BODY_BYTES ?? 2_000_000);
const expectedSchemaVersion = process.env.RESEARCH_SCHEMA_VERSION?.trim() ?? "";
const expectedConsentVersion =
  process.env.RESEARCH_CONSENT_VERSION?.trim() ?? "";
const expectedQualityRuleVersion =
  process.env.RESEARCH_QUALITY_RULE_VERSION?.trim() ?? "";
const expectedFormVersion = process.env.RESEARCH_FORM_VERSION?.trim() ?? "";
const expectedResearchTaskFormVersion =
  process.env.RESEARCH_TASK_FORM_VERSION?.trim() ?? "";
const expectedResearchTaskBankVersion =
  process.env.RESEARCH_TASK_BANK_VERSION?.trim() ?? "";
const expectedLabelExposureVersion =
  process.env.RESEARCH_LABEL_EXPOSURE_VERSION?.trim() ?? "";
const expectedStudyId = process.env.RESEARCH_STUDY_ID?.trim() ?? "";
const expectedBankVersion = process.env.RESEARCH_BANK_VERSION?.trim() ?? "";
const expectedScoringVersion =
  process.env.RESEARCH_SCORING_VERSION?.trim() ?? "";
const expectedTaxonomyVersion =
  process.env.RESEARCH_TAXONOMY_VERSION?.trim() ?? "";
const expectedPrimaryMeasurementVersion =
  process.env.RESEARCH_PRIMARY_MEASUREMENT_VERSION?.trim() ?? "";
const expectedModifierMeasurementVersion =
  process.env.RESEARCH_MODIFIER_MEASUREMENT_VERSION?.trim() ?? "";
const expectedPrimaryLabelRosterFingerprint =
  process.env.RESEARCH_PRIMARY_LABEL_ROSTER_FINGERPRINT?.trim() ?? "";
const expectedModifierLabelRosterFingerprint =
  process.env.RESEARCH_MODIFIER_LABEL_ROSTER_FINGERPRINT?.trim() ?? "";
const expectedSpecialistAssignmentStrategy =
  process.env.RESEARCH_SPECIALIST_ASSIGNMENT_STRATEGY?.trim() ?? "";
const expectedSpecialistAssignmentRosterVersion =
  process.env.RESEARCH_SPECIALIST_ASSIGNMENT_ROSTER_VERSION?.trim() ?? "";
const expectedSpecialistAssignmentModuleIds =
  process.env.RESEARCH_SPECIALIST_ASSIGNMENT_MODULE_IDS?.trim() ?? "";

export const REQUIRED_COLLECTOR_FROZEN_ENVIRONMENT = [
  "ALLOWED_ORIGIN",
  "RESEARCH_STUDY_ID",
  "RESEARCH_SCHEMA_VERSION",
  "RESEARCH_CONSENT_VERSION",
  "RESEARCH_QUALITY_RULE_VERSION",
  "RESEARCH_FORM_VERSION",
  "RESEARCH_TASK_FORM_VERSION",
  "RESEARCH_TASK_BANK_VERSION",
  "RESEARCH_LABEL_EXPOSURE_VERSION",
  "RESEARCH_BANK_VERSION",
  "RESEARCH_SCORING_VERSION",
  "RESEARCH_TAXONOMY_VERSION",
  "RESEARCH_PRIMARY_MEASUREMENT_VERSION",
  "RESEARCH_MODIFIER_MEASUREMENT_VERSION",
  "RESEARCH_PRIMARY_LABEL_ROSTER_FINGERPRINT",
  "RESEARCH_MODIFIER_LABEL_ROSTER_FINGERPRINT",
  "RESEARCH_SPECIALIST_ASSIGNMENT_STRATEGY",
  "RESEARCH_SPECIALIST_ASSIGNMENT_ROSTER_VERSION",
  "RESEARCH_SPECIALIST_ASSIGNMENT_MODULE_IDS",
];

export function collectorConfigurationErrors(environment = process.env) {
  return REQUIRED_COLLECTOR_FROZEN_ENVIRONMENT.filter(
    (name) =>
      typeof environment[name] !== "string" || !environment[name].trim(),
  ).map((name) => `${name} is required`);
}

function expectedVersionBundle(value, formVersion) {
  return {
    ...FROZEN_VERSION_VALUES,
    bankVersion: expectedBankVersion,
    scoringVersion: expectedScoringVersion,
    taxonomyVersion: expectedTaxonomyVersion,
    primaryMeasurementVersion: expectedPrimaryMeasurementVersion,
    modifierMeasurementVersion: expectedModifierMeasurementVersion,
    formVersion,
    schemaVersion: expectedSchemaVersion,
    consentVersion: expectedConsentVersion,
    qualityRuleVersion: expectedQualityRuleVersion,
    studyId: expectedStudyId,
    researchTaskBankVersion: expectedResearchTaskBankVersion,
  };
}

function validVersionBundle(value, formVersion) {
  return versionBundleMatches(
    value.versionBundle,
    expectedVersionBundle(value, formVersion),
  );
}
const TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;
const LAYERS = new Set(["normative", "descriptive", "prescriptive"]);
const THEORY_CONTEXTS = new Set(["ideal", "nonideal", "mixed"]);
const RESPONSE_TYPES = new Set(["likert5", "likert7", "statementChoice"]);
const REVIEW_STATUSES = new Set(["approved", "draft", "needs-rewrite"]);
const TIERS = new Set(["blitz", "quick", "moderate", "extensive"]);
const SALIENCE_VALUES = new Set([1, 3, 5]);
const LABEL_EXPOSURE_ARMS = new Set([
  "dimension-only",
  "unlabeled-profile",
  "named-label",
]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validToken(value, maximumLength = 96) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= maximumLength &&
    TOKEN_PATTERN.test(value)
  );
}

function validNonemptyString(value, maximumLength = 512) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maximumLength
  );
}

function validIsoTimestamp(value) {
  if (typeof value !== "string") return false;
  const timestamp = Date.parse(value);
  return (
    Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value
  );
}

function validVersion(value, expected = null) {
  return (
    validNonemptyString(value, 512) && (expected === null || value === expected)
  );
}

function configuredTokenList(value) {
  if (typeof value !== "string") return [];
  const values = value.split(",").map((entry) => entry.trim());
  if (
    values.length === 0 ||
    !values.every((entry) => validToken(entry, 128)) ||
    new Set(values).size !== values.length
  )
    return [];
  return values;
}

function validAxisWeights(weights) {
  return (
    Array.isArray(weights) &&
    weights.every(
      (weight) =>
        isObject(weight) &&
        validToken(weight.axisId, 128) &&
        typeof weight.weight === "number" &&
        Number.isFinite(weight.weight),
    )
  );
}

function validSalienceSnapshot(salience, layer) {
  if (layer === "normative") return salience === undefined;
  if (!isObject(salience)) return false;
  const expectedKind = layer === "descriptive" ? "confidence" : "priority";
  if (
    salience.kind !== expectedKind ||
    !validNonemptyString(salience.prompt, 1_000) ||
    !validNonemptyString(salience.helpText, 2_000) ||
    !Array.isArray(salience.options)
  )
    return false;
  const values = salience.options.map((option) => option?.value);
  return (
    values.length === 4 &&
    [1, 3, 5, "skipped"].every((value) =>
      values.some((candidate) => Object.is(candidate, value)),
    ) &&
    salience.options.every(
      (option) => isObject(option) && validNonemptyString(option.label, 256),
    )
  );
}

function validItemSnapshot(item) {
  if (
    !isObject(item) ||
    !validToken(item.questionId, 128) ||
    !validNonemptyString(item.prompt, 10_000) ||
    !validNonemptyString(item.helpText, 10_000) ||
    !validToken(item.domain, 128) ||
    !LAYERS.has(item.layer) ||
    !THEORY_CONTEXTS.has(item.theoryContext) ||
    !RESPONSE_TYPES.has(item.responseType) ||
    !Array.isArray(item.responseOptions) ||
    item.responseOptions.length === 0 ||
    !validAxisWeights(item.axisWeights) ||
    typeof item.reverseScored !== "boolean" ||
    (item.reviewStatus !== undefined &&
      !REVIEW_STATUSES.has(item.reviewStatus)) ||
    !Number.isInteger(item.sourceCount) ||
    item.sourceCount < 0 ||
    !validSalienceSnapshot(item.salience, item.layer) ||
    !validNonemptyString(item.familyId, 256) ||
    !["eligible", "pending-review", "ineligible"].includes(
      item.calibrationEligibility,
    ) ||
    (item.linkingRole !== undefined &&
      ![
        "anchor",
        "rotating",
        "contemporary",
        "calibration",
        "specialist-only",
      ].includes(item.linkingRole)) ||
    !validNonemptyString(item.wordingFormId, 512) ||
    !Array.isArray(item.responseProcessTags) ||
    item.responseProcessTags.length === 0 ||
    !item.responseProcessTags.every((tag) => validNonemptyString(tag, 256))
  )
    return false;

  const responseValues = item.responseOptions.map((option) => option?.value);
  const responseKeys = responseValues.map(
    (value) => `${typeof value}:${String(value)}`,
  );
  const stringValues = responseValues.filter(
    (value) => typeof value === "string",
  );
  if (
    new Set(responseKeys).size !== responseKeys.length ||
    !item.responseOptions.every(
      (option) => isObject(option) && validNonemptyString(option.label, 10_000),
    ) ||
    !responseValues.every(
      (value) => typeof value === "number" || typeof value === "string",
    ) ||
    !stringValues.every(
      (value) => value === "dont_know" || value === "prefer_not_to_answer",
    ) ||
    !responseValues.includes("prefer_not_to_answer")
  )
    return false;

  if (item.responseType === "statementChoice") {
    if (
      !Array.isArray(item.statementOptions) ||
      item.statementOptions.length === 0
    )
      return false;
    const validStatements = item.statementOptions.every(
      (option) =>
        isObject(option) &&
        validToken(option.id, 128) &&
        validNonemptyString(option.text, 10_000) &&
        validAxisWeights(option.axisWeights),
    );
    const expectedValues = item.statementOptions.map((_, index) => index);
    const numericValues = responseValues.filter(
      (value) => typeof value === "number",
    );
    return (
      validStatements &&
      numericValues.length === expectedValues.length &&
      expectedValues.every((value) => numericValues.includes(value))
    );
  }

  const expectedValues =
    item.responseType === "likert5"
      ? [-2, -1, 0, 1, 2]
      : [-3, -2, -1, 0, 1, 2, 3];
  const numericValues = responseValues.filter(
    (value) => typeof value === "number",
  );
  return (
    numericValues.length === expectedValues.length &&
    expectedValues.every((value) => numericValues.includes(value))
  );
}

function hash32(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function researchFormFingerprint(itemMap) {
  const canonical = itemMap
    .map((item) => item.questionId)
    .sort()
    .join("|");
  return `rf_${hash32(`${expectedFormVersion}:${canonical}`).toString(16).padStart(8, "0")}`;
}

function researchPresentationFingerprint(itemMap, administration) {
  const ordered = itemMap.map((item) => item.questionId).join("|");
  return `rfo_${hash32(`${expectedFormVersion}:${administration}:${ordered}`)
    .toString(16)
    .padStart(8, "0")}`;
}

function validFormManifest(manifest, value) {
  if (!isObject(manifest)) return false;
  const itemIds = value.itemMap.map((item) => item.questionId);
  const layerCounts = { normative: 0, descriptive: 0, prescriptive: 0 };
  const axisIds = new Set();
  for (const item of value.itemMap) {
    if (layerCounts[item.layer] === undefined) return false;
    layerCounts[item.layer] += 1;
    for (const weight of item.axisWeights ?? []) axisIds.add(weight.axisId);
    for (const option of item.statementOptions ?? []) {
      for (const weight of option.axisWeights ?? []) axisIds.add(weight.axisId);
    }
  }
  const requestedItemCount = value.form.requestedItemCount;
  return (
    manifest.algorithmVersion === expectedFormVersion &&
    manifest.role ===
      (requestedItemCount === null
        ? "consumer-profile"
        : "controlled-matrix") &&
    manifest.sourceTier === value.tier &&
    manifest.administration === value.administration &&
    manifest.requestedItemCount === requestedItemCount &&
    manifest.assignedItemCount === itemIds.length &&
    manifest.assignmentSeed ===
      `${expectedFormVersion}:${value.participantId}:assignment` &&
    manifest.presentationSeed ===
      `${expectedFormVersion}:${value.participantId}:${value.administration}:presentation` &&
    Array.isArray(manifest.itemIds) &&
    manifest.itemIds.join("|") === itemIds.join("|") &&
    manifest.membershipFingerprint === researchFormFingerprint(value.itemMap) &&
    manifest.presentationFingerprint ===
      researchPresentationFingerprint(value.itemMap, value.administration) &&
    isObject(manifest.layerCounts) &&
    ["normative", "descriptive", "prescriptive"].every(
      (layer) => manifest.layerCounts[layer] === layerCounts[layer],
    ) &&
    Array.isArray(manifest.axisIds) &&
    [...manifest.axisIds].sort().join("|") === [...axisIds].sort().join("|")
  );
}

function validExposurePresentation(presentation) {
  if (
    !isObject(presentation) ||
    presentation.version !== expectedLabelExposureVersion ||
    !/^lep_[0-9a-f]{8}$/.test(presentation.fingerprint) ||
    !Array.isArray(presentation.axes) ||
    presentation.axes.length === 0
  )
    return false;
  const layers = new Set(["normative", "descriptive", "prescriptive"]);
  const positions = new Set([
    "near the midpoint",
    "slightly toward",
    "leans toward",
    "strongly toward",
    "unmeasured",
  ]);
  const coverageBands = new Set(["insufficient", "low", "medium", "high"]);
  if (
    new Set(presentation.axes.map((axis) => axis.axisId)).size !==
      presentation.axes.length ||
    !presentation.axes.every(
      (axis) =>
        isObject(axis) &&
        validToken(axis.axisId) &&
        validNonemptyString(axis.name) &&
        layers.has(axis.layer) &&
        positions.has(axis.position) &&
        coverageBands.has(axis.coverageBand) &&
        (axis.position === "near the midpoint" ||
          axis.position === "unmeasured" ||
          validNonemptyString(axis.pole)),
    )
  )
    return false;
  const canonical = presentation.axes
    .map((axis) =>
      [
        axis.axisId,
        axis.layer,
        axis.name,
        axis.position,
        axis.pole ?? "",
        axis.coverageBand,
      ].join("|"),
    )
    .join("||");
  return (
    `lep_${hash32(canonical).toString(16).padStart(8, "0")}` ===
    presentation.fingerprint
  );
}

function labelRosterFingerprint(
  role,
  labelIds,
  taxonomyVersion,
  measurementVersion = "not-applicable",
) {
  if (!Array.isArray(labelIds)) return "";
  const canonicalIds = [...new Set(labelIds)].sort().join("|");
  const payload = `${taxonomyVersion}:${role}:${measurementVersion}:${canonicalIds}`;
  return `lr_${hash32(payload).toString(16).padStart(8, "0")}`;
}

function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function submissionDigest(submission) {
  const withoutReceipt = { ...submission };
  delete withoutReceipt.receivedAt;
  return createHash("sha256")
    .update(canonicalize(withoutReceipt))
    .digest("hex");
}

async function loadSubmissionDigests(paths) {
  const digests = new Map();
  for (const path of new Set(paths)) {
    let contents;
    try {
      contents = await readFile(path, "utf8");
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      throw error;
    }
    const lines = contents
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);
    for (const [lineIndex, line] of lines.entries()) {
      let submission;
      try {
        submission = JSON.parse(line);
      } catch {
        throw new Error(
          `Cannot start with malformed JSON in ${path} at data line ${lineIndex + 1}.`,
        );
      }
      if (!validToken(submission?.submissionId)) {
        throw new Error(
          `Cannot start with a missing or invalid submissionId in ${path} at data line ${lineIndex + 1}.`,
        );
      }
      const digest = submissionDigest(submission);
      const existing = digests.get(submission.submissionId);
      if (existing && existing !== digest) {
        throw new Error(
          `Conflicting stored records reuse submissionId ${submission.submissionId}.`,
        );
      }
      digests.set(submission.submissionId, digest);
    }
  }
  return digests;
}

let submissionDigests = new Map();
let writeQueue = Promise.resolve();

function setCors(response, origin) {
  if (origin === allowedOrigin)
    response.setHeader("access-control-allow-origin", origin);
  response.setHeader("vary", "origin");
  response.setHeader("access-control-allow-methods", "POST, OPTIONS");
  response.setHeader("access-control-allow-headers", "content-type");
  response.setHeader("cache-control", "no-store");
  response.setHeader("x-content-type-options", "nosniff");
}

function validBaseRecord(value) {
  if (
    !(
      isObject(value) &&
      value.schemaVersion === expectedSchemaVersion &&
      validToken(value.submissionId) &&
      validToken(value.studyId) &&
      value.studyId === expectedStudyId &&
      validToken(value.participantId) &&
      (value.administration === "test" || value.administration === "retest") &&
      validIsoTimestamp(value.submittedAt) &&
      validIsoTimestamp(value.startedAt) &&
      validIsoTimestamp(value.completedAt) &&
      Number.isInteger(value.durationMs) &&
      value.durationMs >= 0 &&
      isObject(value.consent) &&
      value.consent?.ageConfirmed === true &&
      value.consent?.voluntaryParticipation === true &&
      value.consent?.dataUseAccepted === true &&
      value.consent?.consentVersion === expectedConsentVersion &&
      validIsoTimestamp(value.consent?.consentedAt) &&
      isObject(value.consent?.disclosureSnapshot) &&
      typeof value.consent.disclosureSnapshot.endpointConfigured ===
        "boolean" &&
      validNonemptyString(
        value.consent.disclosureSnapshot.transferAndWithdrawalNotice,
        10_000,
      ) &&
      validNonemptyString(
        value.consent.disclosureSnapshot.retentionNotice,
        10_000,
      ) &&
      validNonemptyString(
        value.consent.disclosureSnapshot.contactNotice,
        10_000,
      ) &&
      validToken(value.locale, 32) &&
      value.qualityRuleVersion === expectedQualityRuleVersion
    )
  )
    return false;

  const submittedAt = Date.parse(value.submittedAt);
  const startedAt = Date.parse(value.startedAt);
  const completedAt = Date.parse(value.completedAt);
  const consentedAt = Date.parse(value.consent.consentedAt);
  return (
    startedAt <= completedAt &&
    completedAt <= submittedAt &&
    consentedAt <= completedAt &&
    value.durationMs === completedAt - startedAt
  );
}

function validAnswerForItem(answer, item) {
  if (!isObject(answer) || answer.questionId !== item.questionId) return false;
  if (
    !item.responseOptions.some((option) =>
      Object.is(option.value, answer.value),
    )
  )
    return false;

  const substantive = typeof answer.value === "number";
  const hasConfidence = answer.confidence !== undefined;
  const hasPriority = answer.priority !== undefined;
  const skipped = answer.salienceSkipped === true;
  if (answer.salienceSkipped !== undefined && !skipped) return false;
  if (!substantive) return !hasConfidence && !hasPriority && !skipped;
  if (item.layer === "normative")
    return !hasConfidence && !hasPriority && !skipped;

  const rating =
    item.layer === "descriptive" ? answer.confidence : answer.priority;
  const hasWrongRating =
    item.layer === "descriptive" ? hasPriority : hasConfidence;
  if (hasWrongRating) return false;
  return skipped ? rating === undefined : SALIENCE_VALUES.has(rating);
}

function validAnsweredRecord(value) {
  if (
    !(
      validBaseRecord(value) &&
      value.answers &&
      typeof value.answers === "object" &&
      !Array.isArray(value.answers) &&
      Array.isArray(value.itemMap) &&
      Array.isArray(value.presentationOrder)
    )
  )
    return false;

  if (!value.itemMap.every(validItemSnapshot)) return false;
  const itemIds = value.itemMap.map((item) => item.questionId);
  const answerIds = Object.keys(value.answers);
  if (new Set(itemIds).size !== itemIds.length) return false;
  if (new Set(value.presentationOrder).size !== value.presentationOrder.length)
    return false;
  if (
    itemIds.length !== answerIds.length ||
    itemIds.length !== value.presentationOrder.length
  )
    return false;
  const membership = new Set(itemIds);
  if (
    !answerIds.every((id) => membership.has(id)) ||
    !value.presentationOrder.every((id, index) => id === itemIds[index])
  )
    return false;
  return value.itemMap.every((item) =>
    validAnswerForItem(value.answers[item.questionId], item),
  );
}

function validAssignment(assignment, moduleId, participantId, studyId) {
  const moduleIds = configuredTokenList(expectedSpecialistAssignmentModuleIds);
  const expectedModuleId =
    moduleIds[
      hash32(`${studyId}:${participantId}:specialist-assignment`) %
        moduleIds.length
    ];
  return (
    isObject(assignment) &&
    assignment.moduleId === moduleId &&
    validToken(assignment.moduleId, 128) &&
    assignment.strategy === expectedSpecialistAssignmentStrategy &&
    validToken(assignment.rosterVersion, 128) &&
    assignment.rosterVersion === expectedSpecialistAssignmentRosterVersion &&
    expectedModuleId === moduleId
  );
}

function validIdentity(identity) {
  if (!isObject(identity)) return false;
  if (
    identity.selfLabelId !== undefined &&
    !validToken(identity.selfLabelId, 128)
  )
    return false;
  if (
    identity.selfReportedIdeologies !== undefined &&
    (typeof identity.selfReportedIdeologies !== "string" ||
      identity.selfReportedIdeologies.length > 240)
  )
    return false;
  if (
    identity.ageBand !== undefined &&
    !["18-24", "25-34", "35-44", "45-54", "55-64", "65+"].includes(
      identity.ageBand,
    )
  )
    return false;
  return (
    identity.genderGroup === undefined ||
    ["woman", "man", "nonbinary-or-another"].includes(identity.genderGroup)
  );
}

function sameSequence(left, right) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function validLabelExposure(
  value,
  participantId,
  studyId,
  expectedNamedLabelIds,
) {
  if (value === undefined) return true;
  if (!isObject(value) || !isObject(value.assignment)) return false;
  const assignment = value.assignment;
  if (
    assignment.version !== expectedLabelExposureVersion ||
    assignment.studyId !== studyId ||
    assignment.participantId !== participantId ||
    !LABEL_EXPOSURE_ARMS.has(assignment.arm) ||
    !validToken(assignment.seed, 256) ||
    assignment.seed !== `${studyId}_${participantId}_label-exposure-v2` ||
    assignment.arm !==
      ["dimension-only", "unlabeled-profile", "named-label"][
        hash32(`${studyId}_${participantId}_label-exposure-v2`) % 3
      ] ||
    assignment.assignedAfterSubstantiveResponses !== true ||
    typeof value.exposureShown !== "boolean"
  )
    return false;
  if (
    !Array.isArray(value.exposedLabelIds) ||
    new Set(value.exposedLabelIds).size !== value.exposedLabelIds.length ||
    !value.exposedLabelIds.every((labelId) => validToken(labelId, 128))
  )
    return false;
  const exposedLabelCount = value.exposedLabelIds.length;
  if (value.exposureShown && assignment.arm === "named-label") {
    const expected = Array.isArray(expectedNamedLabelIds)
      ? expectedNamedLabelIds.slice(0, 3)
      : null;
    if (!expected || !sameSequence(value.exposedLabelIds, expected))
      return false;
  }
  if (
    (!value.exposureShown || assignment.arm !== "named-label") &&
    exposedLabelCount > 0
  )
    return false;
  if (
    !isObject(value.ratings) ||
    ![
      "perceivedAccuracy",
      "identityAcceptance",
      "confidence",
      "affect",
      "followUpStability",
    ].every((key) => Object.hasOwn(value.ratings, key))
  )
    return false;
  const ratings = Object.values(value.ratings);
  if (
    ratings.some(
      (rating) =>
        rating !== "prefer_not_to_answer" &&
        (!Number.isInteger(rating) || rating < 1 || rating > 5),
    )
  )
    return false;
  if (value.exposureShown && !validExposurePresentation(value.presentation))
    return false;
  if (!value.exposureShown && typeof value.missingReason !== "string")
    return false;
  if (
    value.missingReason !== undefined &&
    !["declined", "not-shown", "unresolved"].includes(value.missingReason)
  )
    return false;
  return !(value.exposureShown && value.missingReason === "not-shown");
}

function validCoreRecord(value) {
  return (
    validAnsweredRecord(value) &&
    value.recordType === "core" &&
    validVersionBundle(value, expectedFormVersion) &&
    typeof value.resumed === "boolean" &&
    validVersion(value.bankVersion, expectedBankVersion) &&
    validVersion(value.scoringVersion, expectedScoringVersion) &&
    validVersion(value.taxonomyVersion, expectedTaxonomyVersion) &&
    validVersion(
      value.primaryMeasurementVersion,
      expectedPrimaryMeasurementVersion,
    ) &&
    validVersion(
      value.modifierMeasurementVersion,
      expectedModifierMeasurementVersion,
    ) &&
    Array.isArray(value.primaryLabelIds) &&
    value.primaryLabelIds.length > 0 &&
    value.primaryLabelIds.every((labelId) => validToken(labelId, 128)) &&
    new Set(value.primaryLabelIds).size === value.primaryLabelIds.length &&
    Array.isArray(value.modifierLabelIds) &&
    value.modifierLabelIds.every((labelId) => validToken(labelId, 128)) &&
    new Set(value.modifierLabelIds).size === value.modifierLabelIds.length &&
    validVersion(
      value.primaryLabelRosterFingerprint,
      expectedPrimaryLabelRosterFingerprint,
    ) &&
    validVersion(
      value.modifierLabelRosterFingerprint,
      expectedModifierLabelRosterFingerprint,
    ) &&
    value.primaryLabelRosterFingerprint ===
      labelRosterFingerprint(
        "primary",
        value.primaryLabelIds,
        value.taxonomyVersion,
        value.primaryMeasurementVersion,
      ) &&
    value.modifierLabelRosterFingerprint ===
      labelRosterFingerprint(
        "modifier",
        value.modifierLabelIds,
        value.taxonomyVersion,
        value.modifierMeasurementVersion,
      ) &&
    TIERS.has(value.tier) &&
    validIdentity(value.identity) &&
    Array.isArray(value.predictedLabelIds) &&
    value.predictedLabelIds.length <= 5 &&
    value.predictedLabelIds.every((labelId) => validToken(labelId, 128)) &&
    new Set(value.predictedLabelIds).size === value.predictedLabelIds.length &&
    value.predictedLabelIds.every((labelId) =>
      value.primaryLabelIds.includes(labelId),
    ) &&
    Array.isArray(value.predictedModifierIds) &&
    value.predictedModifierIds.length <= 5 &&
    value.predictedModifierIds.every((labelId) => validToken(labelId, 128)) &&
    new Set(value.predictedModifierIds).size ===
      value.predictedModifierIds.length &&
    value.predictedModifierIds.every((labelId) =>
      value.modifierLabelIds.includes(labelId),
    ) &&
    isObject(value.form) &&
    value.form.algorithmVersion === expectedFormVersion &&
    (value.form.requestedItemCount === null ||
      (Number.isInteger(value.form.requestedItemCount) &&
        value.form.requestedItemCount >= 12 &&
        value.form.requestedItemCount >= value.form.assignedItemCount)) &&
    Number.isInteger(value.form.assignedItemCount) &&
    value.form.assignedItemCount > 0 &&
    value.form.assignedItemCount === value.itemMap.length &&
    value.form.fingerprint === researchFormFingerprint(value.itemMap) &&
    validFormManifest(value.form.manifest, value) &&
    value.sampling?.design === "open-opt-in-nonprobability" &&
    value.sampling?.populationInference === false &&
    value.sampling?.weighting === "none" &&
    validToken(value.sampling?.recruitmentSource) &&
    value.sampling?.recruitmentSourceProvenance ===
      "url-parameter-unverified" &&
    (value.specialistAssignment === undefined ||
      validAssignment(
        value.specialistAssignment,
        value.specialistAssignment.moduleId,
        value.participantId,
        value.studyId,
      )) &&
    validLabelExposure(
      value.labelExposure,
      value.participantId,
      value.studyId,
      value.predictedLabelIds,
    )
  );
}

function validSpecialistRecord(value) {
  return (
    validAnsweredRecord(value) &&
    value.recordType === "specialist" &&
    validVersionBundle(value, expectedFormVersion) &&
    validToken(value.moduleId, 128) &&
    validVersion(value.moduleVersion) &&
    validVersion(value.bankVersion, expectedBankVersion) &&
    validVersion(value.scoringVersion, expectedScoringVersion) &&
    validAssignment(
      value.assignment,
      value.moduleId,
      value.participantId,
      value.studyId,
    ) &&
    isObject(value.criterion) &&
    Array.isArray(value.criterion.selectedIds) &&
    value.criterion.selectedIds.every((labelId) => validToken(labelId, 128)) &&
    new Set(value.criterion.selectedIds).size ===
      value.criterion.selectedIds.length &&
    typeof value.criterion.noneOrUnsure === "boolean" &&
    !(value.criterion.noneOrUnsure && value.criterion.selectedIds.length > 0) &&
    ["low", "medium", "high"].includes(value.criterion.confidence) &&
    isObject(value.constructScores) &&
    Object.values(value.constructScores).every(
      (score) => typeof score === "number" && Number.isFinite(score),
    ) &&
    Array.isArray(value.matches) &&
    value.matches.every(
      (match) =>
        isObject(match) &&
        validToken(match.id, 128) &&
        Number.isFinite(match.fit),
    )
  );
}

function validSpecialistDisposition(value) {
  return (
    validBaseRecord(value) &&
    value.recordType === "specialist-disposition" &&
    validVersionBundle(value, expectedFormVersion) &&
    validToken(value.moduleId, 128) &&
    validVersion(value.moduleVersion) &&
    validAssignment(
      value.assignment,
      value.moduleId,
      value.participantId,
      value.studyId,
    ) &&
    [
      "declined-before-start",
      "declined-after-partial",
      "declined-after-completion",
    ].includes(value.disposition) &&
    Number.isInteger(value.answeredCount) &&
    value.answeredCount >= 0
  );
}

function sameMembers(left, right) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    [...left].sort().join("|") === [...right].sort().join("|")
  );
}

function validResearchTaskRecord(value) {
  return (
    validBaseRecord(value) &&
    value.recordType === "research-task" &&
    value.completionState === "complete" &&
    ["probability", "choice", "allocation", "similarity"].includes(value.arm) &&
    value.taskBankVersion === expectedResearchTaskBankVersion &&
    isObject(value.assignment) &&
    value.assignment.taskBankVersion === expectedResearchTaskBankVersion &&
    value.assignment.arm === value.arm &&
    validNonemptyString(value.assignment.participantSeed, 256) &&
    value.assignment.participantSeed ===
      `${expectedResearchTaskBankVersion}:${value.participantId}:${value.arm}` &&
    Array.isArray(value.assignment.taskIds) &&
    Array.isArray(value.assignment.presentationOrder) &&
    sameMembers(value.assignment.taskIds, value.assignment.presentationOrder) &&
    isObject(value.form) &&
    value.form.algorithmVersion === expectedResearchTaskFormVersion &&
    Number.isInteger(value.form.assignedTaskCount) &&
    value.form.assignedTaskCount === value.assignment.taskIds.length &&
    value.form.fingerprint === value.assignment.fingerprint &&
    value.assignment.fingerprint ===
      `rt_${hash32(
        `${expectedResearchTaskBankVersion}:${value.assignment.presentationOrder.join("|")}`,
      )
        .toString(16)
        .padStart(8, "0")}` &&
    Array.isArray(value.tasks) &&
    value.tasks.length === value.assignment.taskIds.length &&
    value.tasks.every((task) =>
      validResearchTaskPayload(task, expectedResearchTaskBankVersion),
    ) &&
    value.tasks.every((task) =>
      taskMatchesResearchArmPayload(task, value.arm),
    ) &&
    sameMembers(
      value.tasks.map((task) => task.id),
      value.assignment.taskIds,
    ) &&
    Array.isArray(value.responses) &&
    value.responses.length === value.tasks.length &&
    new Set(value.responses.map((response) => response.taskId)).size ===
      value.responses.length &&
    value.responses.every((response) => {
      const task = value.tasks.find(
        (candidate) => candidate.id === response.taskId,
      );
      return (
        task &&
        validResearchTaskResponsePayload(
          task,
          response,
          value.assignment.participantSeed,
        )
      );
    }) &&
    sameMembers(value.presentationOrder, value.assignment.presentationOrder) &&
    validVersionBundle(value, expectedResearchTaskFormVersion)
  );
}

function validSubmission(value) {
  return (
    validCoreRecord(value) ||
    validSpecialistRecord(value) ||
    validSpecialistDisposition(value) ||
    validResearchTaskRecord(value)
  );
}

function persistSubmission(submission, targetFile) {
  const operation = writeQueue.then(async () => {
    const digest = submissionDigest(submission);
    const existing = submissionDigests.get(submission.submissionId);
    if (existing) {
      return existing === digest
        ? { duplicate: true, conflict: false }
        : { duplicate: false, conflict: true };
    }

    const storedSubmission = {
      ...submission,
      receivedAt: new Date().toISOString(),
    };
    await appendFile(targetFile, `${JSON.stringify(storedSubmission)}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
    submissionDigests.set(submission.submissionId, digest);
    return { duplicate: false, conflict: false };
  });
  writeQueue = operation.then(
    () => undefined,
    () => undefined,
  );
  return operation;
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin ?? "";
  setCors(response, origin);

  if (request.method === "OPTIONS") {
    response.writeHead(origin === allowedOrigin ? 204 : 403).end();
    return;
  }

  if (request.method !== "POST" || request.url !== "/submit") {
    response
      .writeHead(404, { "content-type": "application/json" })
      .end(JSON.stringify({ error: "not-found" }));
    return;
  }

  if (origin !== allowedOrigin) {
    response
      .writeHead(403, { "content-type": "application/json" })
      .end(JSON.stringify({ error: "origin-not-allowed" }));
    return;
  }

  if (
    !(request.headers["content-type"] ?? "")
      .toLowerCase()
      .startsWith("application/json")
  ) {
    response
      .writeHead(415, { "content-type": "application/json" })
      .end(JSON.stringify({ error: "json-required" }));
    return;
  }

  const chunks = [];
  let byteCount = 0;
  for await (const chunk of request) {
    byteCount += chunk.length;
    if (byteCount > maximumBodyBytes) {
      response
        .writeHead(413, { "content-type": "application/json" })
        .end(JSON.stringify({ error: "payload-too-large" }));
      return;
    }
    chunks.push(chunk);
  }

  let submission;
  try {
    submission = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    response
      .writeHead(400, { "content-type": "application/json" })
      .end(JSON.stringify({ error: "invalid-json" }));
    return;
  }

  if (!validSubmission(submission)) {
    response
      .writeHead(422, { "content-type": "application/json" })
      .end(JSON.stringify({ error: "invalid-submission" }));
    return;
  }

  const targetFile =
    submission.recordType === "specialist" ||
    submission.recordType === "specialist-disposition"
      ? specialistOutputFile
      : submission.recordType === "research-task"
        ? researchTaskOutputFile
        : outputFile;
  let persistence;
  try {
    persistence = await persistSubmission(submission, targetFile);
  } catch (error) {
    console.error("Failed to persist research submission:", error);
    response
      .writeHead(500, { "content-type": "application/json" })
      .end(JSON.stringify({ error: "storage-failed" }));
    return;
  }
  if (persistence.conflict) {
    response
      .writeHead(409, { "content-type": "application/json" })
      .end(JSON.stringify({ error: "submission-id-conflict" }));
    return;
  }
  response.writeHead(202, { "content-type": "application/json" }).end(
    JSON.stringify({
      accepted: true,
      submissionId: submission.submissionId,
      deduplicated: persistence.duplicate,
    }),
  );
});

export async function startCollector() {
  const configurationErrors = collectorConfigurationErrors();
  if (configurationErrors.length > 0) {
    throw new Error(
      `Collector configuration is incomplete: ${configurationErrors.join("; ")}`,
    );
  }
  await Promise.all([
    mkdir(dirname(outputFile), { recursive: true }),
    mkdir(dirname(specialistOutputFile), { recursive: true }),
    mkdir(dirname(researchTaskOutputFile), { recursive: true }),
  ]);
  submissionDigests = await loadSubmissionDigests([
    outputFile,
    specialistOutputFile,
    researchTaskOutputFile,
  ]);
  server.listen(port, () => {
    console.log(
      `Research collector listening on http://localhost:${port}/submit`,
    );
    console.log(`Writing core pseudonymous records to ${outputFile}`);
    console.log(
      `Writing specialist pseudonymous records and dispositions to ${specialistOutputFile}`,
    );
    console.log(`Writing research task records to ${researchTaskOutputFile}`);
    console.log(
      `Loaded ${submissionDigests.size} existing submission ID(s) for idempotency checks`,
    );
  });
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)
) {
  try {
    await startCollector();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
