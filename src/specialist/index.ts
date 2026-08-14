import type { AnswerMap, Question } from "../types";
import { applyQuestionContext } from "../data/questionContext";
import { applyEditorialNinthPass } from "../data/editorialNinthPass";
import { applySpecialistDescriptiveEvidence } from "../data/specialistDescriptiveEvidence";
import { applyQuestionPromptReview } from "../data/questionPromptReview";
import {
  experimentalSpecialistModuleSpecs,
  type ExperimentalSpecialistModuleSpec,
} from "../data/experimentalSpecialists";
import {
  evaluateSpecialistConstructGates,
  profileDistanceConstructIds,
  profileEvidence,
  summarizeSpecialistEvidence,
} from "../data/specialistEvidence";
import {
  FEMINIST_MODULE_ID,
  feministModuleItems,
  feministModuleQuestions,
  feministSpecialistEvidence,
  feministSpecialistCandidates,
  scoreFeministConstructs,
  scoreFeministSpecialists,
} from "../data/feministBreadth";
import type { SpecialistEvidenceSummary } from "../data/specialistEvidence";
import {
  IDENTITY_SOVEREIGNTY_MODULE_ID,
  identitySovereigntyModuleItems,
  identitySovereigntyModuleQuestions,
  identitySovereigntySpecialistEvidence,
  identitySovereigntyTraditionProfiles,
  scoreIdentitySovereigntyConstructs,
  scoreIdentitySovereigntyTraditions,
} from "../data/identitySovereigntyBreadth";

export type SpecialistModuleId =
  | typeof FEMINIST_MODULE_ID
  | typeof IDENTITY_SOVEREIGNTY_MODULE_ID
  | (typeof experimentalSpecialistModuleSpecs)[number]["id"];
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
/**
 * Frozen ordered module roster for the existing balanced-hash-v2 cohort.
 *
 * Do not add, remove, or reorder an ID here for an existing study cohort:
 * change the study cohort or assignment strategy first. Keeping the v2 hash
 * seed unchanged preserves existing test/retest allocation.
 */
export const SPECIALIST_ASSIGNMENT_ROSTER_VERSION =
  "2026-08-specialist-roster-v1" as const;
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

function applySpecialistQuestionReview(question: Question): Question {
  return applyQuestionPromptReview(
    applyQuestionContext(
      applySpecialistDescriptiveEvidence(applyEditorialNinthPass(question)),
    ),
  );
}

export interface SpecialistModuleAssignment {
  moduleId: SpecialistModuleId;
  strategy: SpecialistAssignmentStrategy;
  rosterVersion: string;
}

function numericAnswers(
  answers: AnswerMap,
): Record<string, number | undefined> {
  return Object.fromEntries(
    Object.entries(answers).map(([questionId, answer]) => [
      questionId,
      typeof answer.value === "number" ? answer.value : undefined,
    ]),
  );
}

function copyConstructWeights(
  items: Array<{
    question: Question;
    constructWeights: Record<string, number> | Partial<Record<string, number>>;
  }>,
): Record<string, Record<string, number>> {
  return Object.fromEntries(
    items.map((item) => [
      item.question.id,
      Object.fromEntries(
        Object.entries(item.constructWeights).filter(
          (entry): entry is [string, number] => typeof entry[1] === "number",
        ),
      ),
    ]),
  );
}

const feministCriterionOptions: SpecialistCriterionOption[] =
  feministSpecialistCandidates.map((candidate) => ({
    id: candidate.id,
    traditionId: candidate.id,
    label: candidate.name,
    description: candidate.description,
  }));

const identityCriterionOptions: SpecialistCriterionOption[] =
  identitySovereigntyTraditionProfiles.map((profile) => {
    const variantIds: Record<string, string> = {
      "black-nationalism:community nationalism": "black-nationalism:community",
      "black-nationalism:separatist nationalism":
        "black-nationalism:separatist",
      "indigenism:institutional self-government": "indigenism:institutional",
      "indigenism:resurgence and refusal": "indigenism:resurgence",
    };
    const id = variantIds[`${profile.id}:${profile.variant}`] ?? profile.id;
    return {
      id,
      traditionId: profile.id,
      label: profile.name,
      variant: profile.variant,
      description: profile.description,
    };
  });

const specialistModules: SpecialistModuleDefinition[] = [
  {
    id: FEMINIST_MODULE_ID,
    version: "2026-08-v6",
    title: "Feminist political traditions",
    shortTitle: "Feminist traditions",
    description:
      "A short follow-up that tests whether legal-equality, structural-patriarchy, socialist/materialist, and anti-hierarchical feminist traditions can be distinguished reliably.",
    invitationNote:
      "Questions concern gender, family, work, hierarchy, and political strategy. You may skip the module without affecting your main result or study participation.",
    estimatedMinutes: 3,
    questions: feministModuleQuestions.map(applySpecialistQuestionReview),
    criterionOptions: feministCriterionOptions,
    constructWeightsByQuestionId: copyConstructWeights(feministModuleItems),
    score: (answers) => {
      const numeric = numericAnswers(answers);
      const matches = scoreFeministSpecialists(numeric);
      return {
        moduleId: FEMINIST_MODULE_ID,
        constructScores: scoreFeministConstructs(numeric),
        evidence: feministSpecialistEvidence(numeric),
        matches: matches.map((match) => ({
          id: match.id,
          name: match.name,
          status: match.status,
          fit: match.fit,
          ...match.evidence,
        })),
      };
    },
  },
  {
    id: IDENTITY_SOVEREIGNTY_MODULE_ID,
    version: "2026-08-v5",
    title: "Identity, nationalism, and sovereignty",
    shortTitle: "Identity and sovereignty",
    description:
      "A follow-up that separates ethnonationalism, multicultural accommodation, minority self-government, Black nationalism, Indigenous sovereignty, and Pan-African solidarity.",
    invitationNote:
      "Questions concern race, ethnicity, nationhood, colonialism, Indigenous sovereignty, Black political autonomy, and Pan-Africanism. You may skip the module without affecting your main result or study participation.",
    estimatedMinutes: 6,
    questions: identitySovereigntyModuleQuestions.map(
      applySpecialistQuestionReview,
    ),
    criterionOptions: identityCriterionOptions,
    constructWeightsByQuestionId: copyConstructWeights(
      identitySovereigntyModuleItems,
    ),
    score: (answers) => {
      const numeric = numericAnswers(answers);
      const matches = scoreIdentitySovereigntyTraditions(numeric);
      return {
        moduleId: IDENTITY_SOVEREIGNTY_MODULE_ID,
        constructScores: scoreIdentitySovereigntyConstructs(numeric),
        evidence: identitySovereigntySpecialistEvidence(numeric),
        matches: matches.map((match) => ({
          id: match.id,
          name: match.name,
          variant: match.variant,
          status: match.status,
          fit: match.fit,
          ...match.evidence,
        })),
      };
    },
  },
];

function scoreExperimentalModule(
  spec: ExperimentalSpecialistModuleSpec,
  answers: AnswerMap,
): SpecialistOutcome {
  const numericAnswers: Record<string, number | undefined> = Object.fromEntries(
    Object.entries(answers).map(([questionId, answer]) => [
      questionId,
      typeof answer.value === "number" ? answer.value / 3 : undefined,
    ]),
  );
  const summary = summarizeSpecialistEvidence(
    spec.questions.map((question) => ({
      question,
      constructWeights:
        spec.constructWeightsByQuestionId[String(question.id)] ?? {},
    })),
    numericAnswers,
    spec.constructIds,
  );
  const constructScores: Record<string, number> = {};
  for (const constructId of spec.constructIds) {
    let weighted = 0;
    let weightTotal = 0;
    for (const question of spec.questions) {
      const weight =
        spec.constructWeightsByQuestionId[String(question.id)]?.[constructId];
      const answer = numericAnswers[String(question.id)];
      if (typeof weight !== "number" || typeof answer !== "number") continue;
      weighted += answer * weight;
      weightTotal += Math.abs(weight);
    }
    constructScores[constructId] =
      weightTotal > 0 ? Math.max(-1, Math.min(1, weighted / weightTotal)) : 0;
  }

  const matches = spec.candidates
    .map((candidate) => {
      const covered = profileDistanceConstructIds(summary, candidate.signals);
      const distance =
        covered.length === 0
          ? Number.POSITIVE_INFINITY
          : Math.sqrt(
              covered.reduce(
                (sum, constructId) =>
                  sum +
                  (constructScores[constructId] -
                    candidate.signals[constructId]) **
                    2,
                0,
              ) / covered.length,
            );
      const evidence = profileEvidence(summary, candidate.signals);
      const gateEvaluation = evaluateSpecialistConstructGates(
        summary,
        constructScores,
        candidate.gates,
      );
      const insufficientEvidence =
        evidence.insufficientEvidence ||
        gateEvaluation.status === "insufficient-evidence";
      const blocked = gateEvaluation.status === "blocked";
      return {
        id: candidate.id,
        name: candidate.name,
        status: insufficientEvidence
          ? "insufficient evidence"
          : blocked
            ? "blocked by constitutive gate"
            : "experimental",
        fit: !blocked && covered.length > 0 ? Math.max(0, 1 - distance / 2) : 0,
        evidence,
        gateStatus: gateEvaluation.status,
        gateFailures: gateEvaluation.failedConstructIds,
        distance,
        description: candidate.description,
      };
    })
    .sort((left, right) => right.fit - left.fit);

  return {
    moduleId: spec.id,
    constructScores,
    matches: matches.map((match) => ({
      id: match.id,
      name: match.name,
      status: match.status,
      fit: match.fit,
      gateStatus: match.gateStatus,
      gateFailures: match.gateFailures,
      ...match.evidence,
    })),
    evidence: summary,
  };
}

for (const spec of experimentalSpecialistModuleSpecs) {
  specialistModules.push({
    id: spec.id,
    version: spec.version,
    title: spec.title,
    shortTitle: spec.shortTitle,
    description: spec.description,
    invitationNote: spec.invitationNote,
    estimatedMinutes: spec.estimatedMinutes,
    questions: spec.questions.map(applySpecialistQuestionReview),
    criterionOptions: spec.candidates.map((candidate) => ({
      id: candidate.id,
      traditionId: candidate.id,
      label: candidate.name,
      description: candidate.description,
    })),
    constructWeightsByQuestionId: spec.constructWeightsByQuestionId,
    score: (answers) => scoreExperimentalModule(spec, answers),
  });
}

export const specialistModuleDefinitions: readonly SpecialistModuleDefinition[] =
  specialistModules;
export const specialistModuleById = new Map(
  specialistModules.map((module) => [module.id, module]),
);

function assertFrozenAssignmentRoster(): void {
  const registeredIds = specialistModuleDefinitions.map((module) => module.id);
  const rosterIds = [...SPECIALIST_ASSIGNMENT_MODULE_IDS];
  const unchanged =
    registeredIds.length === rosterIds.length &&
    registeredIds.every((moduleId, index) => moduleId === rosterIds[index]) &&
    new Set(rosterIds).size === rosterIds.length;
  if (!unchanged) {
    throw new Error(
      "Specialist assignment roster no longer matches the registered module order. Create a new assignment strategy or study cohort before changing the roster.",
    );
  }
}

assertFrozenAssignmentRoster();

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
