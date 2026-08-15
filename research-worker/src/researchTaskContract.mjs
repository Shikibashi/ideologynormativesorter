const TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;
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

function sameMembers(left, right) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    [...left].sort().join("|") === [...right].sort().join("|")
  );
}

function exactKeys(value, expected) {
  return isObject(value) && sameMembers(Object.keys(value), expected);
}

function validStimulus(stimulus) {
  return (
    isObject(stimulus) &&
    validString(stimulus.description) &&
    (stimulus.profileDescription === undefined ||
      validString(stimulus.profileDescription)) &&
    Array.isArray(stimulus.constraints) &&
    stimulus.constraints.length > 0 &&
    new Set(stimulus.constraints.map((constraint) => constraint?.id)).size ===
      stimulus.constraints.length &&
    stimulus.constraints.every(
      (constraint) =>
        isObject(constraint) &&
        validToken(constraint.id) &&
        validString(constraint.description),
    )
  );
}

function validAttributeProfile(task, profile) {
  return (
    isObject(profile) &&
    validToken(profile.id) &&
    validString(profile.description) &&
    exactKeys(
      profile.levels,
      task.attributes.map((attribute) => attribute.id),
    ) &&
    task.attributes.every(
      (attribute) =>
        validString(attribute.description) &&
        attribute.levels.includes(profile.levels[attribute.id]),
    )
  );
}

export function taskMatchesResearchArm(task, arm) {
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

export function validResearchTask(task, expectedVersion) {
  if (
    !isObject(task) ||
    !validToken(task.id) ||
    task.version !== expectedVersion ||
    !validToken(task.domainId) ||
    !LAYERS.has(task.layer) ||
    !THEORY_CONTEXTS.has(task.theoryContext) ||
    !validString(task.prompt) ||
    !Array.isArray(task.criterionIds) ||
    task.criterionIds.length === 0 ||
    !task.criterionIds.every((id) => validToken(id)) ||
    (task.familyId !== undefined && !validString(task.familyId, 256)) ||
    !TASK_KINDS.has(task.kind) ||
    !validStimulus(task.stimulus)
  )
    return false;

  if (task.kind === "probability" || task.kind === "forecast") {
    return (
      validString(task.propositionId, 256) &&
      validString(task.outcomeId, 256) &&
      validString(task.horizon, 256) &&
      task.probabilityScale === "0-100" &&
      typeof task.allowDontKnow === "boolean" &&
      validString(task.outcomeDescription, 2_000) &&
      validString(task.resolutionSource, 256) &&
      validString(task.outcomeVersion, 256)
    );
  }

  if (task.kind === "constrained-choice" || task.kind === "conjoint") {
    const attributes = Array.isArray(task.attributes) ? task.attributes : [];
    const attributeProfiles = Array.isArray(task.attributeProfiles)
      ? task.attributeProfiles
      : [];
    const attributeIds = attributes.map((attribute) => attribute?.id);
    const profileIds = attributeProfiles.map((profile) => profile?.id);
    return (
      validString(task.choiceSetId, 256) &&
      validToken(task.randomizationSeedKey, 256) &&
      attributes.length > 0 &&
      new Set(attributeIds).size === attributeIds.length &&
      attributes.every(
        (attribute) =>
          isObject(attribute) &&
          validToken(attribute.id) &&
          validString(attribute.description, 512) &&
          Array.isArray(attribute.levels) &&
          attribute.levels.length > 1 &&
          new Set(attribute.levels).size === attribute.levels.length &&
          attribute.levels.every((level) => validString(level, 256)),
      ) &&
      attributeProfiles.length > 0 &&
      new Set(profileIds).size === profileIds.length &&
      attributeProfiles.every((profile) =>
        validAttributeProfile(task, profile),
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
      task.goods.every((good) => validToken(good, 256)) &&
      exactKeys(task.goodDescriptions, task.goods) &&
      Object.values(task.goodDescriptions).every((description) =>
        validString(description, 2_000),
      ) &&
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
    Array.isArray(task.stimuli) &&
    task.stimuli.length === task.stimulusIds.length &&
    sameMembers(
      task.stimuli.map((stimulus) => stimulus?.id),
      task.stimulusIds,
    ) &&
    task.stimuli.every(
      (stimulus) =>
        isObject(stimulus) &&
        validToken(stimulus.id) &&
        validString(stimulus.version, 256) &&
        validString(stimulus.description, 2_000),
    ) &&
    validString(task.responseScale, 256)
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

function expectedAttributeProfile(task, participantSeed) {
  const seed = `${participantSeed}:${task.randomizationSeedKey ?? task.id}:attribute-profile`;
  return task.attributeProfiles[hash32(seed) % task.attributeProfiles.length];
}

export function validResearchTaskResponse(task, response, participantSeed) {
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
    if (
      !validAttributeProfile(task, response.attributeProfile) ||
      !participantSeed ||
      response.attributeProfile.id !==
        expectedAttributeProfile(task, participantSeed).id
    )
      return false;
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
