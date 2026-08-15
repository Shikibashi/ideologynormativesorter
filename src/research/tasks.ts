// Decision IDs: D-05, D-07, D-08, D-09, D-18, D-29.
import { domainById } from "../data/domains";
import { RESEARCH_TASK_BANK_VERSION } from "./versions";
import type {
  ResearchTaskAttributeProfile,
  ResearchTask,
  ResearchTaskArm,
  ResearchTaskResponse,
} from "../types";

export interface ResearchTaskAssignment {
  taskBankVersion: string;
  arm: ResearchTaskArm;
  participantSeed: string;
  taskIds: readonly string[];
  presentationOrder: readonly string[];
  fingerprint: string;
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function fingerprint(values: readonly string[]): string {
  return `rt_${hash32(`${RESEARCH_TASK_BANK_VERSION}:${values.join("|")}`)
    .toString(16)
    .padStart(8, "0")}`;
}

export function selectResearchTaskAttributeProfile(
  task: Extract<ResearchTask, { kind: "constrained-choice" | "conjoint" }>,
  participantSeed: string,
): ResearchTaskAttributeProfile {
  const seed = `${participantSeed}:${task.randomizationSeedKey ?? task.id}:attribute-profile`;
  return task.attributeProfiles[hash32(seed) % task.attributeProfiles.length];
}

function exactKeys(values: unknown, expected: readonly string[]): boolean {
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return false;
  }
  return (
    Object.keys(values as Record<string, unknown>)
      .sort()
      .join("|") === [...expected].sort().join("|")
  );
}

function attributeProfileErrors(
  task: Extract<ResearchTask, { kind: "constrained-choice" | "conjoint" }>,
  profile: ResearchTaskAttributeProfile,
  participantSeed?: string,
): string[] {
  const errors: string[] = [];
  if (!profile || typeof profile !== "object") {
    return ["choice response must record its attribute profile"];
  }
  if (!profile.id || !profile.description.trim()) {
    errors.push("attribute profile must have an id and description");
  }
  if (
    !profile.levels ||
    typeof profile.levels !== "object" ||
    Array.isArray(profile.levels)
  ) {
    return [...new Set([...errors, "attribute profile levels are required"])];
  }
  const profileDefinition = task.attributeProfiles.find(
    (candidate) => candidate.id === profile.id,
  );
  if (!profileDefinition) {
    errors.push("choice response names an unknown attribute profile");
  } else {
    if (profile.description !== profileDefinition.description) {
      errors.push("choice response attribute profile description differs");
    }
    if (
      !exactKeys(
        profile.levels,
        task.attributes.map((attribute) => attribute.id),
      )
    ) {
      errors.push("choice response attribute profile levels are incomplete");
    }
    for (const attribute of task.attributes) {
      if (!attribute.levels.includes(profile.levels[attribute.id])) {
        errors.push(
          `choice response attribute profile has an invalid ${attribute.id} level`,
        );
      }
      if (
        profile.levels[attribute.id] !== profileDefinition.levels[attribute.id]
      ) {
        errors.push(
          `choice response attribute profile ${attribute.id} differs from the frozen profile`,
        );
      }
    }
  }
  if (participantSeed && profileDefinition) {
    const expected = selectResearchTaskAttributeProfile(task, participantSeed);
    if (profile.id !== expected.id) {
      errors.push(
        "choice response attribute profile does not match its frozen seed",
      );
    }
  }
  return [...new Set(errors)];
}

export function taskMatchesResearchArm(
  task: ResearchTask,
  arm: ResearchTaskArm,
): boolean {
  if (arm === "all") return true;
  if (arm === "probability")
    return task.kind === "probability" || task.kind === "forecast";
  if (arm === "choice")
    return task.kind === "constrained-choice" || task.kind === "conjoint";
  if (arm === "allocation")
    return task.kind === "allocation" || task.kind === "forced-tradeoff";
  return task.kind === "similarity" || task.kind === "sort";
}

function ordered<T>(
  values: readonly T[],
  seed: string,
  key: (value: T) => string,
): T[] {
  return [...values].sort((left, right) => {
    const leftHash = hash32(`${seed}:${key(left)}`);
    const rightHash = hash32(`${seed}:${key(right)}`);
    return leftHash - rightHash || key(left).localeCompare(key(right));
  });
}

export function researchTaskBankVersion(
  taskBank: readonly ResearchTask[],
): string {
  return taskBank
    .map((task) => task.version)
    .filter((version, index, versions) => versions.indexOf(version) === index)
    .join("|");
}

export function assignResearchTasks(
  taskBank: readonly ResearchTask[],
  participantId: string,
  arm: ResearchTaskArm = "all",
  requestedCount?: number,
): ResearchTaskAssignment {
  const participantSeed = `${RESEARCH_TASK_BANK_VERSION}:${participantId}:${arm}`;
  const eligible = taskBank.filter((task) => taskMatchesResearchArm(task, arm));
  const selected = ordered(eligible, participantSeed, (task) => task.id).slice(
    0,
    requestedCount === undefined
      ? eligible.length
      : Math.max(0, Math.min(requestedCount, eligible.length)),
  );
  const presentation = ordered(
    selected,
    `${participantSeed}:presentation`,
    (task) => task.randomizationSeedKey ?? task.id,
  ).map((task) => task.id);
  const taskIds = selected.map((task) => task.id);
  return {
    taskBankVersion: researchTaskBankVersion(taskBank),
    arm,
    participantSeed,
    taskIds,
    presentationOrder: presentation,
    fingerprint: fingerprint(presentation),
  };
}

export function researchTaskAssignmentErrors(
  assignment: ResearchTaskAssignment,
  taskBank: readonly ResearchTask[],
): string[] {
  const errors: string[] = [];
  const byId = new Map(taskBank.map((task) => [task.id, task]));
  const ids = [...assignment.taskIds];
  const presentation = [...assignment.presentationOrder];
  if (assignment.taskBankVersion !== researchTaskBankVersion(taskBank)) {
    errors.push("task assignment version does not match its task bank");
  }
  if (new Set(ids).size !== ids.length)
    errors.push("task assignment has duplicate task IDs");
  if (new Set(presentation).size !== presentation.length) {
    errors.push("task presentation has duplicate task IDs");
  }
  if (
    ids.length !== presentation.length ||
    [...ids].sort().join("|") !== [...presentation].sort().join("|")
  ) {
    errors.push("task assignment and presentation membership differ");
  }
  if (presentation.some((taskId) => !byId.has(taskId))) {
    errors.push("task assignment references an unknown task");
  }
  if (
    ids.some((taskId) => {
      const task = byId.get(taskId);
      return task ? !taskMatchesResearchArm(task, assignment.arm) : false;
    })
  ) {
    errors.push("task assignment contains an item outside its declared arm");
  }
  if (assignment.fingerprint !== fingerprint(presentation)) {
    errors.push(
      "task assignment fingerprint does not match presentation order",
    );
  }
  return errors;
}

export function researchTaskErrors(task: ResearchTask): string[] {
  const errors: string[] = [];
  if (!task.id.trim()) errors.push("task id is required");
  if (task.version !== RESEARCH_TASK_BANK_VERSION) {
    errors.push("task version does not match the current research task bank");
  }
  if (!domainById.has(task.domainId))
    errors.push("task domain is not in the domain registry");
  if (!task.prompt.trim()) errors.push("task prompt is required");
  if (task.criterionIds.length === 0)
    errors.push("task must name at least one criterion");
  if (!task.stimulus || !task.stimulus.description.trim()) {
    errors.push("task stimulus description is required");
  } else {
    if (
      task.stimulus.profileDescription !== undefined &&
      !task.stimulus.profileDescription.trim()
    ) {
      errors.push("task stimulus profileDescription cannot be empty");
    }
    if (
      !Array.isArray(task.stimulus.constraints) ||
      task.stimulus.constraints.length === 0
    ) {
      errors.push("task stimulus needs at least one constraint");
    } else {
      const constraintIds = task.stimulus.constraints.map(
        (constraint) => constraint.id,
      );
      if (new Set(constraintIds).size !== constraintIds.length) {
        errors.push("task stimulus constraints must be unique");
      }
      if (
        task.stimulus.constraints.some(
          (constraint) =>
            !constraint.id.trim() || !constraint.description.trim(),
        )
      ) {
        errors.push("task stimulus constraints need ids and descriptions");
      }
    }
  }
  if (task.familyId && task.familyId !== `domain:${task.domainId}`) {
    errors.push("task family must match its domain-derived research family");
  }
  if (task.kind === "probability" || task.kind === "forecast") {
    if (!task.propositionId || !task.outcomeId || !task.horizon) {
      errors.push(
        "probability task requires proposition, outcome, and horizon",
      );
    }
    if (!task.outcomeDescription?.trim()) {
      errors.push("probability task requires an outcome description");
    }
    if (!task.resolutionSource?.trim() || !task.outcomeVersion?.trim()) {
      errors.push("probability task requires resolution and outcome versions");
    }
  }
  if (task.kind === "constrained-choice" || task.kind === "conjoint") {
    if (!task.randomizationSeedKey?.trim()) {
      errors.push("choice task requires a randomization seed key");
    }
    if (task.alternatives.length < 2)
      errors.push("choice task needs at least two alternatives");
    if (new Set(task.alternatives).size !== task.alternatives.length) {
      errors.push("choice task alternatives must be unique");
    }
    if (
      task.attributes.some(
        (attribute) =>
          !attribute.description.trim() || attribute.levels.length < 2,
      )
    ) {
      errors.push("choice task attributes need at least two levels");
    }
    const attributeIds = task.attributes.map((attribute) => attribute.id);
    if (new Set(attributeIds).size !== attributeIds.length) {
      errors.push("choice task attributes must be unique");
    }
    if (task.attributeProfiles.length === 0) {
      errors.push("choice task needs frozen attribute profiles");
    }
    const profileIds = task.attributeProfiles.map((profile) => profile.id);
    if (new Set(profileIds).size !== profileIds.length) {
      errors.push("choice task attribute profiles must be unique");
    }
    for (const profile of task.attributeProfiles) {
      if (!profile.description.trim()) {
        errors.push(`${profile.id}: attribute profile description is required`);
      }
      if (!exactKeys(profile.levels, attributeIds)) {
        errors.push(`${profile.id}: attribute profile levels are incomplete`);
      }
      for (const attribute of task.attributes) {
        if (!attribute.levels.includes(profile.levels[attribute.id])) {
          errors.push(
            `${profile.id}: ${attribute.id} has an invalid frozen level`,
          );
        }
      }
    }
  }
  if (task.kind === "allocation" || task.kind === "forced-tradeoff") {
    if (task.goods.length < 2)
      errors.push("allocation task needs at least two goods");
    if (new Set(task.goods).size !== task.goods.length)
      errors.push("allocation goods must be unique");
    if (!exactKeys(task.goodDescriptions, task.goods)) {
      errors.push("allocation goods need a description for every good");
    }
    if (
      Object.values(task.goodDescriptions).some(
        (description) => !description.trim(),
      )
    ) {
      errors.push("allocation good descriptions cannot be empty");
    }
    if (!Number.isInteger(task.totalUnits) || task.totalUnits <= 0) {
      errors.push("allocation task totalUnits must be a positive integer");
    }
  }
  if (task.kind === "similarity" || task.kind === "sort") {
    if (task.stimulusIds.length < 2)
      errors.push("similarity task needs at least two stimuli");
    if (new Set(task.stimulusIds).size !== task.stimulusIds.length) {
      errors.push("similarity task stimuli must be unique");
    }
    const stimulusIds = task.stimuli.map((stimulus) => stimulus.id);
    if (
      stimulusIds.length !== task.stimulusIds.length ||
      !exactKeys(
        Object.fromEntries(stimulusIds.map((id) => [id, true])),
        task.stimulusIds,
      )
    ) {
      errors.push(
        "similarity task stimuli descriptions must match stimulus IDs",
      );
    }
    if (
      task.stimuli.some(
        (stimulus) => !stimulus.version.trim() || !stimulus.description.trim(),
      )
    ) {
      errors.push("similarity task stimuli need versions and descriptions");
    }
  }
  return errors;
}

export function researchTaskBankErrors(
  taskBank: readonly ResearchTask[],
): string[] {
  const errors: string[] = [];
  const ids = taskBank.map((task) => task.id);
  if (new Set(ids).size !== ids.length)
    errors.push("task bank contains duplicate IDs");
  for (const task of taskBank) {
    errors.push(
      ...researchTaskErrors(task).map((error) => `${task.id}: ${error}`),
    );
  }
  return errors;
}

export function researchTaskResponseErrors(
  task: ResearchTask,
  response: ResearchTaskResponse,
  participantSeed?: string,
): string[] {
  const errors: string[] = [];
  if (response.taskId !== task.id)
    errors.push("response taskId does not match task");
  if (!response.kind || response.kind !== task.kind)
    errors.push("response kind does not match task");

  if (task.kind === "probability" || task.kind === "forecast") {
    if ("probability" in response) {
      if (
        !Number.isFinite(response.probability) ||
        response.probability < 0 ||
        response.probability > 100
      ) {
        errors.push("probability must be between 0 and 100");
      }
    } else if (
      !(
        "value" in response &&
        (response.value === "prefer_not_to_answer" ||
          (response.value === "dont_know" && task.allowDontKnow))
      )
    ) {
      errors.push(
        "probability response must provide a bounded value or explicit missingness",
      );
    }
  }

  if (task.kind === "constrained-choice" || task.kind === "conjoint") {
    if (!("attributeProfile" in response)) {
      errors.push("choice response must record its attribute profile");
    } else {
      errors.push(
        ...attributeProfileErrors(
          task,
          response.attributeProfile,
          participantSeed,
        ),
      );
    }
    if ("chosenAlternative" in response) {
      if (!task.alternatives.includes(response.chosenAlternative)) {
        errors.push("choice response names an unknown alternative");
      }
    } else if (
      !(
        "value" in response &&
        (response.value === "none" || response.value === "prefer_not_to_answer")
      )
    ) {
      errors.push(
        "choice response must select an alternative or explicit missingness",
      );
    }
  }

  if (task.kind === "allocation" || task.kind === "forced-tradeoff") {
    if ("allocations" in response) {
      const keys = Object.keys(response.allocations).sort();
      const goods = [...task.goods].sort();
      if (keys.join("|") !== goods.join("|"))
        errors.push("allocation keys must exactly match goods");
      const total = Object.values(response.allocations).reduce(
        (sum, value) => sum + value,
        0,
      );
      if (
        Object.values(response.allocations).some(
          (value) => !Number.isInteger(value) || value < 0,
        )
      ) {
        errors.push("allocation values must be nonnegative integers");
      }
      if (total !== task.totalUnits)
        errors.push("allocation values must sum to totalUnits");
    } else if (
      !("value" in response && response.value === "prefer_not_to_answer")
    ) {
      errors.push(
        "allocation response must provide totals or explicit missingness",
      );
    }
  }

  if (task.kind === "similarity" || task.kind === "sort") {
    if ("ratings" in response) {
      const keys = Object.keys(response.ratings).sort();
      const stimuli = [...task.stimulusIds].sort();
      if (keys.join("|") !== stimuli.join("|"))
        errors.push("ratings must cover each stimulus exactly once");
      if (
        Object.values(response.ratings).some(
          (value) => !Number.isFinite(value) || value < 0 || value > 100,
        )
      ) {
        errors.push("similarity ratings must be between 0 and 100");
      }
    } else if ("order" in response) {
      const order = [...response.order];
      if (
        new Set(order).size !== order.length ||
        order.slice().sort().join("|") !==
          [...task.stimulusIds].sort().join("|")
      ) {
        errors.push("sort response must be a complete stimulus permutation");
      }
    } else if (
      !("value" in response && response.value === "prefer_not_to_answer")
    ) {
      errors.push(
        "similarity response must provide ratings, an order, or explicit missingness",
      );
    }
  }
  return errors;
}

export function assertResearchTaskResponse(
  task: ResearchTask,
  response: ResearchTaskResponse,
): void {
  const errors = researchTaskResponseErrors(task, response);
  if (errors.length > 0)
    throw new Error(`Research task response violation: ${errors.join("; ")}`);
}
