const TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;
const RECORD_TYPES = new Set([
  "core",
  "specialist",
  "specialist-disposition",
  "research-task",
]);
const LAYERS = new Set(["normative", "descriptive", "prescriptive"]);
const THEORY_CONTEXTS = new Set(["ideal", "nonideal", "mixed"]);
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
const SALIENCE_VALUES = new Set([1, 3, 5]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validToken(value, maximumLength = 128) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= maximumLength &&
    TOKEN_PATTERN.test(value)
  );
}

function validString(value, maximumLength = 10_000) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maximumLength
  );
}

function validVersion(value, expected) {
  // Bank fingerprints concatenate the versioned review overlays. Keep a
  // bounded field, but allow the configured fingerprint to grow beyond the
  // short metadata limit used by individual module versions.
  return (
    validString(value, 2048) &&
    typeof expected === "string" &&
    value === expected
  );
}

function validTimestamp(value) {
  if (typeof value !== "string") return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function configuredInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function configuredIntegerSet(value) {
  if (typeof value !== "string") return new Set();
  return new Set(
    value
      .split(",")
      .map((entry) => Number(entry.trim()))
      .filter((entry) => Number.isInteger(entry) && entry > 0),
  );
}

function configuredTokenList(value) {
  if (typeof value !== "string") return [];
  const values = value.split(",").map((entry) => entry.trim());
  if (
    values.length === 0 ||
    !values.every((entry) => validToken(entry)) ||
    new Set(values).size !== values.length
  )
    return [];
  return values;
}

function validConsent(consent, env) {
  return (
    isObject(consent) &&
    consent.ageConfirmed === true &&
    consent.voluntaryParticipation === true &&
    consent.dataUseAccepted === true &&
    consent.consentVersion === env.EXPECTED_CONSENT_VERSION &&
    validTimestamp(consent.consentedAt) &&
    isObject(consent.disclosureSnapshot) &&
    consent.disclosureSnapshot.endpointConfigured === true &&
    validString(consent.disclosureSnapshot.transferAndWithdrawalNotice) &&
    validString(consent.disclosureSnapshot.retentionNotice) &&
    validString(consent.disclosureSnapshot.contactNotice)
  );
}

function validBaseRecord(submission, env) {
  if (
    !(
      isObject(submission) &&
      submission.schemaVersion === env.EXPECTED_SCHEMA_VERSION &&
      RECORD_TYPES.has(submission.recordType) &&
      validToken(submission.submissionId, 96) &&
      submission.studyId === env.EXPECTED_STUDY_ID &&
      validToken(submission.participantId, 96) &&
      (submission.administration === "test" ||
        submission.administration === "retest") &&
      validTimestamp(submission.submittedAt) &&
      validTimestamp(submission.startedAt) &&
      validTimestamp(submission.completedAt) &&
      Number.isInteger(submission.durationMs) &&
      submission.durationMs >= 0 &&
      validConsent(submission.consent, env) &&
      validToken(submission.locale, 32) &&
      submission.qualityRuleVersion === env.EXPECTED_QUALITY_RULE_VERSION
    )
  )
    return false;

  const startedAt = Date.parse(submission.startedAt);
  const completedAt = Date.parse(submission.completedAt);
  const submittedAt = Date.parse(submission.submittedAt);
  const consentedAt = Date.parse(submission.consent.consentedAt);
  return (
    startedAt <= completedAt &&
    completedAt <= submittedAt &&
    consentedAt <= completedAt &&
    submission.durationMs === completedAt - startedAt
  );
}

function validResponseOption(option) {
  return (
    isObject(option) &&
    (typeof option.value === "number" || typeof option.value === "string") &&
    validString(option.label)
  );
}

function validItem(item) {
  return (
    isObject(item) &&
    validToken(item.questionId) &&
    validString(item.prompt) &&
    validString(item.helpText) &&
    validToken(item.domain) &&
    LAYERS.has(item.layer) &&
    Array.isArray(item.responseOptions) &&
    item.responseOptions.length > 0 &&
    item.responseOptions.every(validResponseOption)
  );
}

function validAnswer(answer, item) {
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

function validAnsweredRecord(submission) {
  if (
    !(
      isObject(submission.answers) &&
      Array.isArray(submission.itemMap) &&
      Array.isArray(submission.presentationOrder) &&
      submission.itemMap.every(validItem)
    )
  )
    return false;

  const itemIds = submission.itemMap.map((item) => item.questionId);
  const answerIds = Object.keys(submission.answers);
  if (
    new Set(itemIds).size !== itemIds.length ||
    itemIds.length !== answerIds.length ||
    itemIds.length !== submission.presentationOrder.length ||
    !submission.presentationOrder.every((id, index) => id === itemIds[index])
  )
    return false;

  const membership = new Set(itemIds);
  return (
    answerIds.every((id) => membership.has(id)) &&
    submission.itemMap.every((item) =>
      validAnswer(submission.answers[item.questionId], item),
    )
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

export function researchFormFingerprint(
  itemMap,
  formVersion = "profile-form-v3",
) {
  const canonicalIds = itemMap
    .map((item) => item.questionId)
    .sort()
    .join("|");
  return `rf_${hash32(`${formVersion}:${canonicalIds}`).toString(16).padStart(8, "0")}`;
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

function validIdentity(identity) {
  if (!isObject(identity)) return false;
  if (identity.selfLabelId !== undefined && !validToken(identity.selfLabelId))
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

function validLabelExposure(value, participantId, studyId, env) {
  if (value === undefined) return true;
  if (!isObject(value) || !isObject(value.assignment)) return false;
  const assignment = value.assignment;
  if (
    assignment.version !==
      (env.EXPECTED_LABEL_EXPOSURE_VERSION ?? "2026-08-label-exposure-v1") ||
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

function validCoreRecord(submission, env) {
  const expectedProfileCount =
    submission.tier === "moderate"
      ? configuredInteger(env.EXPECTED_MODERATE_ITEM_COUNT, 206)
      : submission.tier === "extensive"
        ? configuredInteger(env.EXPECTED_EXTENSIVE_ITEM_COUNT, 338)
        : null;
  const legacyProfileCounts =
    submission.tier === "moderate"
      ? configuredIntegerSet(env.ALLOWED_LEGACY_MODERATE_ITEM_COUNTS)
      : submission.tier === "extensive"
        ? configuredIntegerSet(env.ALLOWED_LEGACY_EXTENSIVE_ITEM_COUNTS)
        : new Set();
  if (expectedProfileCount !== null)
    legacyProfileCounts.add(expectedProfileCount);
  const assignedCount = submission.itemMap?.length;
  const requestedCount = submission.form?.requestedItemCount;
  const allowedMatrixCounts = configuredIntegerSet(
    env.ALLOWED_MATRIX_ITEM_COUNTS,
  );
  const validProfileForm =
    requestedCount === null && legacyProfileCounts.has(assignedCount);
  const validMatrixForm =
    Number.isInteger(requestedCount) &&
    requestedCount === assignedCount &&
    allowedMatrixCounts.has(requestedCount);
  return (
    submission.recordType === "core" &&
    validAnsweredRecord(submission) &&
    (submission.tier === "moderate" || submission.tier === "extensive") &&
    (validProfileForm || validMatrixForm) &&
    typeof submission.resumed === "boolean" &&
    validVersion(submission.bankVersion, env.EXPECTED_BANK_VERSION) &&
    validVersion(submission.scoringVersion, env.EXPECTED_SCORING_VERSION) &&
    validVersion(submission.taxonomyVersion, env.EXPECTED_TAXONOMY_VERSION) &&
    validVersion(
      submission.primaryMeasurementVersion,
      env.EXPECTED_PRIMARY_MEASUREMENT_VERSION,
    ) &&
    validVersion(
      submission.modifierMeasurementVersion,
      env.EXPECTED_MODIFIER_MEASUREMENT_VERSION,
    ) &&
    Array.isArray(submission.primaryLabelIds) &&
    submission.primaryLabelIds.length > 0 &&
    submission.primaryLabelIds.every((id) => validToken(id)) &&
    new Set(submission.primaryLabelIds).size ===
      submission.primaryLabelIds.length &&
    Array.isArray(submission.modifierLabelIds) &&
    submission.modifierLabelIds.every((id) => validToken(id)) &&
    new Set(submission.modifierLabelIds).size ===
      submission.modifierLabelIds.length &&
    validVersion(
      submission.primaryLabelRosterFingerprint,
      env.EXPECTED_PRIMARY_LABEL_ROSTER_FINGERPRINT,
    ) &&
    validVersion(
      submission.modifierLabelRosterFingerprint,
      env.EXPECTED_MODIFIER_LABEL_ROSTER_FINGERPRINT,
    ) &&
    submission.primaryLabelRosterFingerprint ===
      labelRosterFingerprint(
        "primary",
        submission.primaryLabelIds,
        submission.taxonomyVersion,
        submission.primaryMeasurementVersion,
      ) &&
    submission.modifierLabelRosterFingerprint ===
      labelRosterFingerprint(
        "modifier",
        submission.modifierLabelIds,
        submission.taxonomyVersion,
        submission.modifierMeasurementVersion,
      ) &&
    validIdentity(submission.identity) &&
    Array.isArray(submission.predictedLabelIds) &&
    submission.predictedLabelIds.length <= 5 &&
    submission.predictedLabelIds.every((id) => validToken(id)) &&
    new Set(submission.predictedLabelIds).size ===
      submission.predictedLabelIds.length &&
    submission.predictedLabelIds.every((id) =>
      submission.primaryLabelIds.includes(id),
    ) &&
    Array.isArray(submission.predictedModifierIds) &&
    submission.predictedModifierIds.length <= 5 &&
    submission.predictedModifierIds.every((id) => validToken(id)) &&
    new Set(submission.predictedModifierIds).size ===
      submission.predictedModifierIds.length &&
    submission.predictedModifierIds.every((id) =>
      submission.modifierLabelIds.includes(id),
    ) &&
    isObject(submission.form) &&
    submission.form.algorithmVersion === env.EXPECTED_FORM_VERSION &&
    submission.form.assignedItemCount === assignedCount &&
    submission.form.fingerprint ===
      researchFormFingerprint(submission.itemMap, env.EXPECTED_FORM_VERSION) &&
    submission.sampling?.design === "open-opt-in-nonprobability" &&
    submission.sampling?.populationInference === false &&
    submission.sampling?.weighting === "none" &&
    validToken(submission.sampling?.recruitmentSource, 96) &&
    submission.sampling?.recruitmentSourceProvenance ===
      "url-parameter-unverified" &&
    (submission.specialistAssignment === undefined ||
      validAssignment(
        submission.specialistAssignment,
        submission.specialistAssignment.moduleId,
        submission.participantId,
        submission.studyId,
        env,
      )) &&
    validLabelExposure(
      submission.labelExposure,
      submission.participantId,
      submission.studyId,
      env,
    )
  );
}

function validAssignment(assignment, moduleId, participantId, studyId, env) {
  const moduleIds = configuredTokenList(
    env.EXPECTED_SPECIALIST_ASSIGNMENT_MODULE_IDS,
  );
  const expectedModuleId =
    moduleIds[
      hash32(`${studyId}:${participantId}:specialist-assignment`) %
        moduleIds.length
    ];
  return (
    isObject(assignment) &&
    assignment.moduleId === moduleId &&
    validToken(assignment.moduleId) &&
    validToken(assignment.strategy) &&
    assignment.strategy === env.EXPECTED_SPECIALIST_ASSIGNMENT_STRATEGY &&
    validToken(assignment.rosterVersion) &&
    assignment.rosterVersion ===
      env.EXPECTED_SPECIALIST_ASSIGNMENT_ROSTER_VERSION &&
    expectedModuleId === moduleId
  );
}

function validSpecialistRecord(submission, env) {
  return (
    submission.recordType === "specialist" &&
    validAnsweredRecord(submission) &&
    validToken(submission.moduleId) &&
    validString(submission.moduleVersion, 512) &&
    validVersion(submission.bankVersion, env.EXPECTED_BANK_VERSION) &&
    validVersion(submission.scoringVersion, env.EXPECTED_SCORING_VERSION) &&
    validAssignment(
      submission.assignment,
      submission.moduleId,
      submission.participantId,
      submission.studyId,
      env,
    ) &&
    isObject(submission.criterion) &&
    Array.isArray(submission.criterion.selectedIds) &&
    submission.criterion.selectedIds.every((id) => validToken(id)) &&
    typeof submission.criterion.noneOrUnsure === "boolean" &&
    !(
      submission.criterion.noneOrUnsure &&
      submission.criterion.selectedIds.length > 0
    ) &&
    ["low", "medium", "high"].includes(submission.criterion.confidence) &&
    isObject(submission.constructScores) &&
    Object.values(submission.constructScores).every((score) =>
      Number.isFinite(score),
    ) &&
    Array.isArray(submission.matches) &&
    submission.matches.every(
      (match) =>
        isObject(match) && validToken(match.id) && Number.isFinite(match.fit),
    )
  );
}

function validSpecialistDisposition(submission, env) {
  return (
    submission.recordType === "specialist-disposition" &&
    validToken(submission.moduleId) &&
    validString(submission.moduleVersion, 512) &&
    validAssignment(
      submission.assignment,
      submission.moduleId,
      submission.participantId,
      submission.studyId,
      env,
    ) &&
    [
      "declined-before-start",
      "declined-after-partial",
      "declined-after-completion",
    ].includes(submission.disposition) &&
    Number.isInteger(submission.answeredCount) &&
    submission.answeredCount >= 0
  );
}

function validResearchTask(task, env) {
  if (
    !(
      isObject(task) &&
      validToken(task.id) &&
      task.version === env.EXPECTED_RESEARCH_TASK_BANK_VERSION &&
      validToken(task.domainId) &&
      LAYERS.has(task.layer) &&
      THEORY_CONTEXTS.has(task.theoryContext) &&
      validString(task.prompt) &&
      Array.isArray(task.criterionIds) &&
      task.criterionIds.length > 0 &&
      task.criterionIds.every((id) => validToken(id)) &&
      TASK_KINDS.has(task.kind)
    )
  )
    return false;
  if (task.familyId !== undefined && !validString(task.familyId, 256))
    return false;
  if (task.kind === "probability" || task.kind === "forecast") {
    return (
      validString(task.propositionId, 256) &&
      validString(task.outcomeId, 256) &&
      validString(task.horizon, 256) &&
      task.probabilityScale === "0-100" &&
      typeof task.allowDontKnow === "boolean" &&
      (task.resolutionSource === undefined ||
        validString(task.resolutionSource, 256)) &&
      (task.outcomeVersion === undefined ||
        validString(task.outcomeVersion, 256))
    );
  }
  if (task.kind === "constrained-choice" || task.kind === "conjoint") {
    return (
      validString(task.choiceSetId, 256) &&
      Array.isArray(task.attributes) &&
      task.attributes.length > 0 &&
      task.attributes.every(
        (attribute) =>
          isObject(attribute) &&
          validToken(attribute.id) &&
          Array.isArray(attribute.levels) &&
          attribute.levels.length > 1 &&
          attribute.levels.every((level) => validString(level, 256)),
      ) &&
      Array.isArray(task.alternatives) &&
      task.alternatives.length > 1 &&
      new Set(task.alternatives).size === task.alternatives.length &&
      task.alternatives.every((alternative) => validString(alternative, 512)) &&
      validString(task.constraintProfileId, 256)
    );
  }
  if (task.kind === "allocation" || task.kind === "forced-tradeoff") {
    return (
      Array.isArray(task.goods) &&
      task.goods.length > 1 &&
      new Set(task.goods).size === task.goods.length &&
      task.goods.every((good) => validString(good, 256)) &&
      Number.isInteger(task.totalUnits) &&
      task.totalUnits > 0 &&
      Array.isArray(task.constraints) &&
      task.constraints.every((constraint) => validString(constraint, 256))
    );
  }
  return (
    Array.isArray(task.stimulusIds) &&
    task.stimulusIds.length > 1 &&
    new Set(task.stimulusIds).size === task.stimulusIds.length &&
    task.stimulusIds.every((stimulusId) => validToken(stimulusId)) &&
    validString(task.responseScale, 256)
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

function validResearchTaskRecord(submission, env) {
  if (
    submission.recordType !== "research-task" ||
    !["probability", "choice", "allocation", "similarity"].includes(
      submission.arm,
    ) ||
    submission.taskBankVersion !== env.EXPECTED_RESEARCH_TASK_BANK_VERSION ||
    !isObject(submission.assignment) ||
    submission.assignment.taskBankVersion !==
      env.EXPECTED_RESEARCH_TASK_BANK_VERSION ||
    submission.assignment.arm !== submission.arm ||
    !validString(submission.assignment.participantSeed, 256) ||
    !Array.isArray(submission.assignment.taskIds) ||
    !Array.isArray(submission.assignment.presentationOrder) ||
    !sameMembers(
      submission.assignment.taskIds,
      submission.assignment.presentationOrder,
    ) ||
    !validToken(submission.form?.algorithmVersion) ||
    submission.form.algorithmVersion !==
      env.EXPECTED_RESEARCH_TASK_FORM_VERSION ||
    !Number.isInteger(submission.form.assignedTaskCount) ||
    submission.form.assignedTaskCount !==
      submission.assignment.taskIds.length ||
    !validString(submission.form.fingerprint, 256) ||
    submission.form.fingerprint !== submission.assignment.fingerprint ||
    !Array.isArray(submission.tasks) ||
    submission.tasks.length !== submission.assignment.taskIds.length ||
    !submission.tasks.every((task) => validResearchTask(task, env)) ||
    !submission.tasks.every((task) =>
      taskMatchesResearchArm(task, submission.arm),
    ) ||
    !sameMembers(
      submission.tasks.map((task) => task.id),
      submission.assignment.taskIds,
    ) ||
    !Array.isArray(submission.responses) ||
    submission.responses.length !== submission.tasks.length ||
    new Set(submission.responses.map((response) => response.taskId)).size !==
      submission.responses.length ||
    !submission.responses.every((response) => {
      const task = submission.tasks.find(
        (candidate) => candidate.id === response.taskId,
      );
      return task && validResearchTaskResponse(task, response);
    }) ||
    !sameMembers(
      submission.presentationOrder,
      submission.assignment.presentationOrder,
    ) ||
    !isObject(submission.versionBundle) ||
    submission.versionBundle.studyId !== env.EXPECTED_STUDY_ID ||
    submission.versionBundle.schemaVersion !== env.EXPECTED_SCHEMA_VERSION ||
    submission.versionBundle.formVersion !==
      env.EXPECTED_RESEARCH_TASK_FORM_VERSION ||
    submission.versionBundle.researchTaskBankVersion !==
      env.EXPECTED_RESEARCH_TASK_BANK_VERSION
  )
    return false;
  return submission.assignment.presentationOrder.every((taskId) =>
    submission.tasks.some((task) => task.id === taskId),
  );
}

export function validateSubmission(submission, env) {
  if (!validBaseRecord(submission, env)) return false;
  if (submission.recordType === "core") return validCoreRecord(submission, env);
  if (submission.recordType === "specialist")
    return validSpecialistRecord(submission, env);
  if (submission.recordType === "research-task")
    return validResearchTaskRecord(submission, env);
  return validSpecialistDisposition(submission, env);
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

async function submissionDigest(submission) {
  const bytes = new TextEncoder().encode(canonicalize(submission));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

function responseHeaders(origin, env) {
  const headers = new Headers({
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "x-content-type-options": "nosniff",
    vary: "Origin",
  });
  if (origin === env.ALLOWED_ORIGIN)
    headers.set("access-control-allow-origin", origin);
  return headers;
}

function jsonResponse(status, body, origin, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(origin, env),
  });
}

async function persistSubmission(submission, env) {
  const digest = await submissionDigest(submission);
  const existing = await env.DB.prepare(
    "SELECT payload_sha256 FROM submissions WHERE submission_id = ?1",
  )
    .bind(submission.submissionId)
    .first();
  if (existing) {
    return existing.payload_sha256 === digest
      ? { duplicate: true, conflict: false }
      : { duplicate: false, conflict: true };
  }

  const receivedAt = new Date().toISOString();
  const result = await env.DB.prepare(
    `INSERT OR IGNORE INTO submissions (
      submission_id, record_type, participant_id, study_id, schema_version,
      received_at, payload_sha256, payload_json
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
  )
    .bind(
      submission.submissionId,
      submission.recordType,
      submission.participantId,
      submission.studyId,
      submission.schemaVersion,
      receivedAt,
      digest,
      JSON.stringify({ ...submission, receivedAt }),
    )
    .run();
  if (result?.success === false) throw new Error("D1 insert failed");
  if (result?.meta?.changes === 0) {
    const raced = await env.DB.prepare(
      "SELECT payload_sha256 FROM submissions WHERE submission_id = ?1",
    )
      .bind(submission.submissionId)
      .first();
    return raced?.payload_sha256 === digest
      ? { duplicate: true, conflict: false }
      : { duplicate: false, conflict: true };
  }
  return { duplicate: false, conflict: false };
}

export async function handleRequest(request, env) {
  const origin = request.headers.get("origin") ?? "";
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/health") {
    return jsonResponse(200, { ok: true }, origin, env);
  }

  if (request.method === "OPTIONS" && url.pathname === "/submit") {
    if (origin !== env.ALLOWED_ORIGIN)
      return jsonResponse(403, { error: "origin-not-allowed" }, origin, env);
    const headers = responseHeaders(origin, env);
    headers.set("access-control-allow-methods", "POST, OPTIONS");
    headers.set("access-control-allow-headers", "content-type");
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== "POST" || url.pathname !== "/submit") {
    return jsonResponse(404, { error: "not-found" }, origin, env);
  }
  if (origin !== env.ALLOWED_ORIGIN)
    return jsonResponse(403, { error: "origin-not-allowed" }, origin, env);
  if (
    !(request.headers.get("content-type") ?? "")
      .toLowerCase()
      .startsWith("application/json")
  ) {
    return jsonResponse(415, { error: "json-required" }, origin, env);
  }

  if (env.RESEARCH_RATE_LIMITER?.limit) {
    const actor = request.headers.get("cf-connecting-ip") ?? "unknown";
    const rateLimit = await env.RESEARCH_RATE_LIMITER.limit({
      key: `research:${actor}`,
    });
    if (!rateLimit.success)
      return jsonResponse(429, { error: "rate-limited" }, origin, env);
  }

  const maximumBodyBytes = configuredInteger(env.MAXIMUM_BODY_BYTES, 2_000_000);
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maximumBodyBytes)
    return jsonResponse(413, { error: "payload-too-large" }, origin, env);
  const body = await request.arrayBuffer();
  if (body.byteLength > maximumBodyBytes)
    return jsonResponse(413, { error: "payload-too-large" }, origin, env);

  let submission;
  try {
    submission = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return jsonResponse(400, { error: "invalid-json" }, origin, env);
  }
  if (!validateSubmission(submission, env)) {
    return jsonResponse(422, { error: "invalid-submission" }, origin, env);
  }

  try {
    const persistence = await persistSubmission(submission, env);
    if (persistence.conflict)
      return jsonResponse(
        409,
        { error: "submission-id-conflict" },
        origin,
        env,
      );
    return jsonResponse(
      202,
      {
        accepted: true,
        submissionId: submission.submissionId,
        deduplicated: persistence.duplicate,
      },
      origin,
      env,
    );
  } catch (error) {
    console.error("Failed to persist contribution", error);
    return jsonResponse(500, { error: "storage-failed" }, origin, env);
  }
}

export default {
  fetch: handleRequest,
};
