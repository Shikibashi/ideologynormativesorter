import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

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
const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "http://localhost:5173";
const maximumBodyBytes = Number(process.env.MAXIMUM_BODY_BYTES ?? 2_000_000);
const expectedSchemaVersion =
  process.env.RESEARCH_SCHEMA_VERSION ?? "2026-08-v16";
const expectedConsentVersion =
  process.env.RESEARCH_CONSENT_VERSION ?? "2026-08-12-v8";
const expectedQualityRuleVersion =
  process.env.RESEARCH_QUALITY_RULE_VERSION ?? "data-quality-v2";
const expectedFormVersion =
  process.env.RESEARCH_FORM_VERSION ?? "profile-form-v3";
const expectedResearchTaskFormVersion =
  process.env.RESEARCH_TASK_FORM_VERSION ?? "2026-08-research-task-form-v1";
const expectedResearchTaskBankVersion =
  process.env.RESEARCH_TASK_BANK_VERSION ?? "2026-08-research-task-bank-v1";
const expectedLabelExposureVersion =
  process.env.RESEARCH_LABEL_EXPOSURE_VERSION ?? "2026-08-label-exposure-v1";
const expectedStudyId = process.env.RESEARCH_STUDY_ID?.trim() || null;
const expectedBankVersion = process.env.RESEARCH_BANK_VERSION?.trim() || null;
const expectedScoringVersion =
  process.env.RESEARCH_SCORING_VERSION?.trim() || null;
const expectedTaxonomyVersion =
  process.env.RESEARCH_TAXONOMY_VERSION ?? "2026-08-taxonomy-v13";
const expectedPrimaryMeasurementVersion =
  process.env.RESEARCH_PRIMARY_MEASUREMENT_VERSION ?? "2026-08-primary-core-v1";
const expectedModifierMeasurementVersion =
  process.env.RESEARCH_MODIFIER_MEASUREMENT_VERSION ??
  "2026-08-modifier-construct-v1";
const expectedPrimaryLabelRosterFingerprint =
  process.env.RESEARCH_PRIMARY_LABEL_ROSTER_FINGERPRINT ?? "lr_3cc0f435";
const expectedModifierLabelRosterFingerprint =
  process.env.RESEARCH_MODIFIER_LABEL_ROSTER_FINGERPRINT ?? "lr_eb26ed76";
const expectedSpecialistAssignmentStrategy =
  process.env.RESEARCH_SPECIALIST_ASSIGNMENT_STRATEGY ?? "balanced-hash-v2";
const expectedSpecialistAssignmentRosterVersion =
  process.env.RESEARCH_SPECIALIST_ASSIGNMENT_ROSTER_VERSION ??
  "2026-08-specialist-roster-v1";
const expectedSpecialistAssignmentModuleIds =
  process.env.RESEARCH_SPECIALIST_ASSIGNMENT_MODULE_IDS ??
  "feminist-faction-module,identity-sovereignty-module,anarchist-families-module,green-morphology-module,socialist-families-module,conservative-variants-module,religious-national-politics-module,technology-governance-module,monarchist-municipal-module";
const TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;
const LAYERS = new Set(["normative", "descriptive", "prescriptive"]);
const THEORY_CONTEXTS = new Set(["ideal", "nonideal", "mixed"]);
const RESPONSE_TYPES = new Set(["likert5", "likert7", "statementChoice"]);
const REVIEW_STATUSES = new Set(["approved", "draft", "needs-rewrite"]);
const TIERS = new Set(["blitz", "quick", "moderate", "extensive"]);
const SALIENCE_VALUES = new Set([1, 3, 5]);
const TASK_KINDS = new Set([
  "probability",
  "forecast",
  "constrained-choice",
  "conjoint",
  "allocation",
  "forced-tradeoff",
  "similarity",
  "sort",
]);
const LABEL_EXPOSURE_ARMS = new Set([
  "dimension-only",
  "unlabeled-profile",
  "named-label",
]);

await Promise.all([
  mkdir(dirname(outputFile), { recursive: true }),
  mkdir(dirname(specialistOutputFile), { recursive: true }),
  mkdir(dirname(researchTaskOutputFile), { recursive: true }),
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
    !validSalienceSnapshot(item.salience, item.layer)
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

const submissionDigests = await loadSubmissionDigests([
  outputFile,
  specialistOutputFile,
  researchTaskOutputFile,
]);
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
      (expectedStudyId === null || value.studyId === expectedStudyId) &&
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

function validLabelExposure(value, participantId, studyId) {
  if (value === undefined) return true;
  if (!isObject(value) || !isObject(value.assignment)) return false;
  const assignment = value.assignment;
  if (
    assignment.version !== expectedLabelExposureVersion ||
    assignment.studyId !== studyId ||
    assignment.participantId !== participantId ||
    !LABEL_EXPOSURE_ARMS.has(assignment.arm) ||
    !validToken(assignment.seed, 256) ||
    assignment.assignedAfterSubstantiveResponses !== true ||
    typeof value.exposureShown !== "boolean"
  )
    return false;
  if (value.exposedLabelIds !== undefined) {
    if (
      !Array.isArray(value.exposedLabelIds) ||
      new Set(value.exposedLabelIds).size !== value.exposedLabelIds.length ||
      !value.exposedLabelIds.every((labelId) => validToken(labelId, 128))
    )
      return false;
  }
  const ratings = [
    value.perceivedAccuracy,
    value.identityAcceptance,
    value.confidence,
    value.affect,
    value.followUpStability,
  ];
  if (
    ratings.some(
      (rating) =>
        rating !== undefined &&
        (!Number.isInteger(rating) || rating < 1 || rating > 5),
    )
  )
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
    validLabelExposure(value.labelExposure, value.participantId, value.studyId)
  );
}

function validSpecialistRecord(value) {
  return (
    validAnsweredRecord(value) &&
    value.recordType === "specialist" &&
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

function taskMatchesResearchArm(task, arm) {
  if (arm === "probability")
    return task.kind === "probability" || task.kind === "forecast";
  if (arm === "choice")
    return task.kind === "constrained-choice" || task.kind === "conjoint";
  if (arm === "allocation")
    return task.kind === "allocation" || task.kind === "forced-tradeoff";
  if (arm === "similarity")
    return task.kind === "similarity" || task.kind === "sort";
  return true;
}

function validResearchTask(task) {
  if (
    !(
      isObject(task) &&
      validToken(task.id) &&
      task.version === expectedResearchTaskBankVersion &&
      validToken(task.domainId) &&
      LAYERS.has(task.layer) &&
      THEORY_CONTEXTS.has(task.theoryContext) &&
      validNonemptyString(task.prompt, 10_000) &&
      Array.isArray(task.criterionIds) &&
      task.criterionIds.length > 0 &&
      task.criterionIds.every((id) => validToken(id)) &&
      TASK_KINDS.has(task.kind)
    )
  )
    return false;
  if (task.kind === "probability" || task.kind === "forecast") {
    return (
      validNonemptyString(task.propositionId, 256) &&
      validNonemptyString(task.outcomeId, 256) &&
      validNonemptyString(task.horizon, 256) &&
      task.probabilityScale === "0-100" &&
      typeof task.allowDontKnow === "boolean"
    );
  }
  if (task.kind === "constrained-choice" || task.kind === "conjoint") {
    return (
      validNonemptyString(task.choiceSetId, 256) &&
      Array.isArray(task.attributes) &&
      task.attributes.length > 0 &&
      task.attributes.every(
        (attribute) =>
          isObject(attribute) &&
          validToken(attribute.id) &&
          Array.isArray(attribute.levels) &&
          attribute.levels.length > 1 &&
          attribute.levels.every((level) => validNonemptyString(level, 256)),
      ) &&
      Array.isArray(task.alternatives) &&
      task.alternatives.length > 1 &&
      new Set(task.alternatives).size === task.alternatives.length &&
      task.alternatives.every((alternative) =>
        validNonemptyString(alternative, 512),
      ) &&
      validNonemptyString(task.constraintProfileId, 256)
    );
  }
  if (task.kind === "allocation" || task.kind === "forced-tradeoff") {
    return (
      Array.isArray(task.goods) &&
      task.goods.length > 1 &&
      new Set(task.goods).size === task.goods.length &&
      task.goods.every((good) => validNonemptyString(good, 256)) &&
      Number.isInteger(task.totalUnits) &&
      task.totalUnits > 0 &&
      Array.isArray(task.constraints) &&
      task.constraints.every((constraint) =>
        validNonemptyString(constraint, 256),
      )
    );
  }
  return (
    Array.isArray(task.stimulusIds) &&
    task.stimulusIds.length > 1 &&
    new Set(task.stimulusIds).size === task.stimulusIds.length &&
    task.stimulusIds.every((stimulusId) => validToken(stimulusId)) &&
    validNonemptyString(task.responseScale, 256)
  );
}

function validResearchTaskResponse(task, response) {
  if (
    !isObject(response) ||
    response.taskId !== task.id ||
    response.kind !== task.kind
  )
    return false;
  if (task.kind === "probability" || task.kind === "forecast") {
    return (
      (Number.isFinite(response.probability) &&
        response.probability >= 0 &&
        response.probability <= 100) ||
      (response.value === "dont_know" && task.allowDontKnow) ||
      response.value === "prefer_not_to_answer"
    );
  }
  if (task.kind === "constrained-choice" || task.kind === "conjoint") {
    return (
      task.alternatives.includes(response.chosenAlternative) ||
      response.value === "none" ||
      response.value === "prefer_not_to_answer"
    );
  }
  if (task.kind === "allocation" || task.kind === "forced-tradeoff") {
    if (response.value === "prefer_not_to_answer") return true;
    if (!isObject(response.allocations)) return false;
    const values = Object.values(response.allocations);
    return (
      sameMembers(Object.keys(response.allocations), task.goods) &&
      values.every((value) => Number.isInteger(value) && value >= 0) &&
      values.reduce((sum, value) => sum + value, 0) === task.totalUnits
    );
  }
  if (response.value === "prefer_not_to_answer") return true;
  if (isObject(response.ratings)) {
    const values = Object.values(response.ratings);
    return (
      sameMembers(Object.keys(response.ratings), task.stimulusIds) &&
      values.every(
        (value) => Number.isFinite(value) && value >= 0 && value <= 100,
      )
    );
  }
  return (
    Array.isArray(response.order) &&
    sameMembers(response.order, task.stimulusIds) &&
    new Set(response.order).size === response.order.length
  );
}

function validResearchTaskRecord(value) {
  return (
    validBaseRecord(value) &&
    value.recordType === "research-task" &&
    ["probability", "choice", "allocation", "similarity"].includes(value.arm) &&
    value.taskBankVersion === expectedResearchTaskBankVersion &&
    isObject(value.assignment) &&
    value.assignment.taskBankVersion === expectedResearchTaskBankVersion &&
    value.assignment.arm === value.arm &&
    validNonemptyString(value.assignment.participantSeed, 256) &&
    Array.isArray(value.assignment.taskIds) &&
    Array.isArray(value.assignment.presentationOrder) &&
    sameMembers(value.assignment.taskIds, value.assignment.presentationOrder) &&
    isObject(value.form) &&
    value.form.algorithmVersion === expectedResearchTaskFormVersion &&
    Number.isInteger(value.form.assignedTaskCount) &&
    value.form.assignedTaskCount === value.assignment.taskIds.length &&
    value.form.fingerprint === value.assignment.fingerprint &&
    Array.isArray(value.tasks) &&
    value.tasks.length === value.assignment.taskIds.length &&
    value.tasks.every(validResearchTask) &&
    value.tasks.every((task) => taskMatchesResearchArm(task, value.arm)) &&
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
      return task && validResearchTaskResponse(task, response);
    }) &&
    sameMembers(value.presentationOrder, value.assignment.presentationOrder) &&
    isObject(value.versionBundle) &&
    value.versionBundle.studyId === value.studyId &&
    value.versionBundle.schemaVersion === expectedSchemaVersion &&
    value.versionBundle.formVersion === expectedResearchTaskFormVersion &&
    value.versionBundle.researchTaskBankVersion ===
      expectedResearchTaskBankVersion
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
