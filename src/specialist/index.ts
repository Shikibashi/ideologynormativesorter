import type { AnswerMap, Question } from "../types";
import {
  assertCanonicalSpecialistAssignment,
  canonicalCriterionOptions,
  listCanonicalSpecialistModules,
  scoreExperimentalSpecialistModule,
  scoreFeministModule,
  scoreIdentitySovereigntyModule,
  type CanonicalSpecialistModule,
  type SpecialistEvidenceSummary,
} from "./canonicalAdapter";

export type SpecialistModuleId =
  | "feminist-faction-module"
  | "identity-sovereignty-module"
  | "anarchist-families-module"
  | "green-morphology-module"
  | "socialist-families-module"
  | "conservative-variants-module"
  | "religious-national-politics-module"
  | "technology-governance-module"
  | "monarchist-municipal-module";
export type SpecialistCriterionConfidence = "low" | "medium" | "high";

export interface SpecialistCriterionOption {
  id: string;
  traditionId: string;
  label: string;
  variant?: string;
  description: string;
}

export interface SpecialistCriterionResponse {
  selectedIds: string[];
  noneOrUnsure: boolean;
  confidence: SpecialistCriterionConfidence;
}

export interface SpecialistMatch {
  id: string;
  name: string;
  variant?: string;
  nodeId?: string;
  status: string;
  fit: number;
  evidenceStatus?: "sufficient" | "insufficient-evidence";
  insufficientEvidence?: boolean;
  evidenceCoverage?: number;
  coveredConstructCount?: number;
  requiredConstructCount?: number;
  gateStatus?: "passed" | "blocked" | "insufficient-evidence";
  gateFailures?: readonly string[];
}

export interface SpecialistOutcome {
  moduleId: SpecialistModuleId;
  constructScores: Record<string, number>;
  matches: SpecialistMatch[];
  evidence?: SpecialistEvidenceSummary;
}

export interface SpecialistModuleDefinition {
  id: SpecialistModuleId;
  version: string;
  itemIds?: readonly string[];
  candidateIds?: readonly string[];
  canonicalVersion?: string;
  title: string;
  shortTitle: string;
  description: string;
  invitationNote: string;
  estimatedMinutes: number;
  questions: Question[];
  criterionOptions: SpecialistCriterionOption[];
  constructWeightsByQuestionId: Record<string, Record<string, number>>;
  score: (answers: AnswerMap) => SpecialistOutcome;
}

export type SpecialistAssignmentStrategy =
  | "balanced-hash-v1"
  | "balanced-hash-v2";
export const SPECIALIST_ASSIGNMENT_STRATEGY = "balanced-hash-v2" as const;
export const SPECIALIST_ASSIGNMENT_ROSTER_VERSION =
  "2026-08-specialist-roster-v1" as const;

/**
 * Frozen ordered module roster for the existing balanced-hash-v2 cohort.
 *
 * Do not add, remove, or reorder an ID here for an existing study cohort:
 * change the study cohort or assignment strategy first. Keeping the v2 hash
 * seed unchanged preserves existing test/retest allocation.
 */
export const SPECIALIST_ASSIGNMENT_MODULE_IDS = [
  "feminist-faction-module",
  "identity-sovereignty-module",
  "anarchist-families-module",
  "green-morphology-module",
  "socialist-families-module",
  "conservative-variants-module",
  "religious-national-politics-module",
  "technology-governance-module",
  "monarchist-municipal-module",
] as const satisfies readonly SpecialistModuleId[];

export interface SpecialistModuleAssignment {
  moduleId: SpecialistModuleId;
  strategy: SpecialistAssignmentStrategy;
  rosterVersion: string;
}

function scoreCanonicalModule(
  module: CanonicalSpecialistModule,
  answers: AnswerMap,
): SpecialistOutcome {
  const result =
    module.id === "feminist-faction-module"
      ? scoreFeministModule(module, answers)
      : module.id === "identity-sovereignty-module"
        ? scoreIdentitySovereigntyModule(module, answers)
        : scoreExperimentalSpecialistModule(module, answers);
  return {
    moduleId: module.id as SpecialistModuleId,
    constructScores: result.constructScores,
    matches: result.matches.map(({ distance, ...match }) => {
      void distance;
      return match;
    }),
    evidence: result.evidence,
  };
}

function buildDefinition(
  module: CanonicalSpecialistModule,
): SpecialistModuleDefinition {
  const publicVersion =
    module.id === "feminist-faction-module" ||
    module.id === "identity-sovereignty-module"
      ? `2026-08-${module.version}`
      : module.version;
  return {
    id: module.id as SpecialistModuleId,
    version: publicVersion,
    itemIds: [...module.itemIds],
    candidateIds: [...module.candidateIds],
    canonicalVersion: module.version,
    title: module.title,
    shortTitle: module.shortTitle,
    description: module.description,
    invitationNote: module.invitationNote,
    estimatedMinutes: module.estimatedMinutes,
    questions: [...module.questions],
    criterionOptions: canonicalCriterionOptions(module).map((option) => ({
      ...option,
    })),
    constructWeightsByQuestionId: Object.fromEntries(
      Object.entries(module.constructWeightsByQuestionId).map(
        ([questionId, weights]) => [questionId, { ...weights }],
      ),
    ),
    score: (answers) => scoreCanonicalModule(module, answers),
  };
}

const canonicalDefinitions = new Map(
  listCanonicalSpecialistModules().map((module) => [
    module.id,
    buildDefinition(module),
  ]),
);

function assertFrozenAssignmentRoster(): void {
  const registeredIds = [...canonicalDefinitions.keys()];
  const rosterIds = [...SPECIALIST_ASSIGNMENT_MODULE_IDS];
  if (
    registeredIds.length !== rosterIds.length ||
    rosterIds.some((moduleId) => !canonicalDefinitions.has(moduleId)) ||
    new Set(rosterIds).size !== rosterIds.length
  ) {
    throw new Error(
      "Specialist assignment roster no longer matches canonical specialist modules. Create a new assignment strategy or study cohort before changing the roster.",
    );
  }
}

assertFrozenAssignmentRoster();

export const specialistModuleDefinitions: readonly SpecialistModuleDefinition[] =
  SPECIALIST_ASSIGNMENT_MODULE_IDS.map(
    (moduleId) => canonicalDefinitions.get(moduleId)!,
  ).filter(
    (module): module is SpecialistModuleDefinition => module !== undefined,
  );
export const specialistModuleById = new Map(
  specialistModuleDefinitions.map((module) => [module.id, module]),
);

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function assignSpecialistModule(
  participantId: string,
  studyId: string,
): SpecialistModuleAssignment {
  // Preserve the established balanced-hash-v2 seed so a frozen roster gives
  // the same module to the same participant at test and retest.
  const index =
    hash32(`${studyId}:${participantId}:specialist-assignment`) %
    SPECIALIST_ASSIGNMENT_MODULE_IDS.length;
  const moduleId = SPECIALIST_ASSIGNMENT_MODULE_IDS[index];
  if (!moduleId) throw new Error("Specialist assignment roster is empty.");
  const module = specialistModuleById.get(moduleId);
  if (!module)
    throw new Error(`Unknown canonical specialist module: ${moduleId}`);
  return {
    moduleId,
    strategy: SPECIALIST_ASSIGNMENT_STRATEGY,
    rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  };
}

export function buildSpecialistQuestionForm(
  moduleId: SpecialistModuleId,
  participantId: string,
  administration: "test" | "retest",
): Question[] {
  const module = specialistModuleById.get(moduleId);
  if (!module) return [];
  const seed = `${participantId}:${administration}:${moduleId}:presentation`;
  return [...module.questions].sort((left, right) => {
    const leftHash = hash32(`${seed}:${left.id}`);
    const rightHash = hash32(`${seed}:${right.id}`);
    return (
      leftHash - rightHash || String(left.id).localeCompare(String(right.id))
    );
  });
}

export function scoreSpecialistModule(
  moduleId: SpecialistModuleId,
  answers: AnswerMap,
): SpecialistOutcome {
  const module = specialistModuleById.get(moduleId);
  if (!module) throw new Error(`Unknown specialist module: ${moduleId}`);
  return module.score(answers);
}

/** Validate the persisted assignment against the canonical module/version boundary. */
export function assertSpecialistAssignment(
  assignment: SpecialistModuleAssignment,
  moduleVersion: string,
): void {
  if (assignment.strategy !== SPECIALIST_ASSIGNMENT_STRATEGY) {
    throw new Error(
      `Unsupported specialist assignment strategy: ${assignment.strategy}`,
    );
  }
  if (assignment.rosterVersion !== SPECIALIST_ASSIGNMENT_ROSTER_VERSION) {
    throw new Error(
      `Unsupported specialist roster version: ${assignment.rosterVersion}`,
    );
  }
  assertCanonicalSpecialistAssignment(
    assignment.moduleId,
    moduleVersion,
    assignment.moduleId,
  );
}

/**
 * Catalog-only and unknown candidate IDs are never accepted as a self-description.
 * Variant option IDs are accepted only when they resolve to a canonical candidate.
 */
export function assertSpecialistCriterion(
  moduleId: SpecialistModuleId,
  criterion: SpecialistCriterionResponse,
): void {
  const module = specialistModuleById.get(moduleId);
  if (!module) throw new Error(`Unknown specialist module: ${moduleId}`);
  if (criterion.noneOrUnsure) {
    if (criterion.selectedIds.length > 0) {
      throw new Error("A specialist abstention cannot include candidate IDs.");
    }
    return;
  }
  if (criterion.selectedIds.length === 0) {
    throw new Error(
      "A specialist criterion must select a candidate or abstain.",
    );
  }
  if (new Set(criterion.selectedIds).size !== criterion.selectedIds.length) {
    throw new Error("A specialist criterion cannot repeat candidate IDs.");
  }
  const allowed = new Set(module.criterionOptions.map((option) => option.id));
  for (const candidateId of criterion.selectedIds) {
    if (!allowed.has(candidateId)) {
      throw new Error(
        `Unknown or catalog-only specialist candidate: ${candidateId}`,
      );
    }
  }
}
