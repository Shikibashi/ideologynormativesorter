import type { AnswerMap, Question } from "../types";
import {
  CANONICAL_MANIFEST,
  type IdeologyNode,
  type SpecialistCandidate,
  type SpecialistModule,
} from "../domain";
import {
  evaluateSpecialistConstructGates,
  profileDistanceConstructIds,
  profileEvidence,
  summarizeSpecialistEvidence,
  type SpecialistEvidenceSummary,
} from "../data/specialistEvidence";
export type { SpecialistEvidenceSummary };

export interface CanonicalSpecialistCandidate extends SpecialistCandidate {
  readonly node?: IdeologyNode;
}

export interface CanonicalSpecialistModule {
  readonly id: string;
  readonly version: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly invitationNote: string;
  readonly estimatedMinutes: number;
  readonly itemIds: readonly string[];
  readonly constructIds: readonly string[];
  readonly candidateIds: readonly string[];
  readonly questions: readonly Question[];
  readonly constructWeightsByQuestionId: Readonly<
    Record<string, Readonly<Record<string, number>>>
  >;
  readonly candidates: readonly CanonicalSpecialistCandidate[];
}

export interface CanonicalSpecialistMatch {
  readonly id: string;
  readonly name: string;
  readonly variant?: string;
  readonly nodeId?: string;
  readonly status: string;
  readonly fit: number;
  readonly evidenceStatus?: "sufficient" | "insufficient-evidence";
  readonly insufficientEvidence?: boolean;
  readonly evidenceCoverage?: number;
  readonly coveredConstructCount?: number;
  readonly requiredConstructCount?: number;
  readonly gateStatus?: "passed" | "blocked" | "insufficient-evidence";
  readonly gateFailures?: readonly string[];
  readonly distance?: number;
}

export interface CanonicalSpecialistStrategyResult {
  readonly constructScores: Record<string, number>;
  readonly matches: readonly CanonicalSpecialistMatch[];
  readonly evidence: SpecialistEvidenceSummary;
}

const moduleById = new Map(
  (CANONICAL_MANIFEST.specialistModules ?? []).map((module) => [
    module.id,
    module,
  ]),
);
const nodeById = new Map(
  (CANONICAL_MANIFEST.nodes ?? []).map((node) => [node.id, node]),
);
const itemById = new Map(
  CANONICAL_MANIFEST.items.map((item) => [item.id, item]),
);
const candidateRecordsByModuleId = new Map<
  string,
  CanonicalSpecialistCandidate[]
>();

for (const candidate of CANONICAL_MANIFEST.specialistCandidates ?? []) {
  const node = candidate.nodeId ? nodeById.get(candidate.nodeId) : undefined;
  const candidates = candidateRecordsByModuleId.get(candidate.moduleId) ?? [];
  candidates.push({ ...candidate, node });
  candidateRecordsByModuleId.set(candidate.moduleId, candidates);
}

function canonicalQuestion(module: SpecialistModule, itemId: string): Question {
  const item = itemById.get(itemId);
  if (!item) throw new Error(`Canonical specialist item is missing: ${itemId}`);
  if (item.role !== "specialist" || item.moduleId !== module.id) {
    throw new Error(
      `Canonical specialist item ${item.id} crosses the core/module boundary for ${module.id}`,
    );
  }
  const axisWeights = Object.entries(item.rootConstructWeights ?? {}).map(
    ([axisId, weight]) => ({ axisId, weight }),
  );
  const layer = item.layer;
  if (!layer || !item.domain || !item.responseType || !item.tier) {
    throw new Error(
      `Canonical specialist item ${item.id} is missing question metadata`,
    );
  }
  return {
    id: item.id,
    prompt: item.prompt,
    domain: item.domain,
    layer,
    theoryContext: "mixed",
    responseType: item.responseType as Question["responseType"],
    tier: item.tier as Question["tier"],
    axisWeights,
    module: module.id,
    reviewStatus: "approved",
    version:
      module.id === "feminist-faction-module" ||
      module.id === "identity-sovereignty-module"
        ? "2026-08-editorial-v9"
        : module.version,
    updatedAt: "2026-08-12",
    contextNote: item.contextNote,
    evidenceNote: item.evidenceNote,
    explanation: item.explanation,
    helpText: item.helpText,
    confidencePrompt: item.confidencePrompt,
    priorityPrompt: item.priorityPrompt,
    allowDontKnow: item.allowDontKnow ?? layer === "descriptive",
    reverseScored: item.reverseScored,
    sources: item.sources?.map((source) => ({ ...source })),
  };
}

function candidateOptionId(candidate: CanonicalSpecialistCandidate): string {
  const variantIds: Record<string, string> = {
    "black-nationalism:community nationalism": "black-nationalism:community",
    "black-nationalism:separatist nationalism": "black-nationalism:separatist",
    "indigenism:institutional self-government": "indigenism:institutional",
    "indigenism:resurgence and refusal": "indigenism:resurgence",
  };
  return variantIds[`${candidate.id}:${candidate.variant}`] ?? candidate.id;
}

function assertCanonicalModule(module: SpecialistModule): void {
  const activeCore = new Set(CANONICAL_MANIFEST.activeCoreItemIds ?? []);
  const conditionalSpecialist = new Set(
    CANONICAL_MANIFEST.conditionalSpecialistItemIds ?? [],
  );
  if (new Set(module.itemIds).size !== module.itemIds.length) {
    throw new Error(
      `Canonical specialist module ${module.id} has duplicate item IDs`,
    );
  }
  for (const itemId of module.itemIds) {
    if (activeCore.has(itemId) || !conditionalSpecialist.has(itemId)) {
      throw new Error(
        `Canonical specialist module ${module.id} contains a core or unassigned item: ${itemId}`,
      );
    }
    const item = itemById.get(itemId);
    if (!item || item.moduleId !== module.id || item.role !== "specialist") {
      throw new Error(
        `Canonical specialist module ${module.id} has an invalid item reference: ${itemId}`,
      );
    }
  }
  const candidates = candidateRecordsByModuleId.get(module.id) ?? [];
  for (const candidateId of module.candidateIds) {
    if (!candidates.some((candidate) => candidate.id === candidateId)) {
      throw new Error(
        `Canonical specialist module ${module.id} has an invalid candidate reference: ${candidateId}`,
      );
    }
  }
}

export function getCanonicalSpecialistModule(
  moduleId: string,
): CanonicalSpecialistModule | undefined {
  const module = moduleById.get(moduleId);
  if (!module) return undefined;
  assertCanonicalModule(module);
  const questions = module.itemIds.map((itemId) =>
    canonicalQuestion(module, itemId),
  );
  const constructWeightsByQuestionId = Object.fromEntries(
    module.itemIds.map((itemId) => [
      itemId,
      itemById.get(itemId)?.localConstructWeights ?? {},
    ]),
  );
  const candidates = (candidateRecordsByModuleId.get(module.id) ?? []).filter(
    (candidate) => module.candidateIds.includes(candidate.id),
  );
  return {
    ...module,
    questions,
    constructWeightsByQuestionId,
    candidates,
  };
}

export function listCanonicalSpecialistModules(): readonly CanonicalSpecialistModule[] {
  const canonicalModules = CANONICAL_MANIFEST.specialistModules ?? [];
  if (
    new Set(canonicalModules.map((module) => module.id)).size !==
    canonicalModules.length
  ) {
    throw new Error("Canonical specialist modules have duplicate IDs.");
  }
  const modules = canonicalModules.map((module) => {
    const selected = getCanonicalSpecialistModule(module.id);
    if (!selected)
      throw new Error(`Canonical specialist module is missing: ${module.id}`);
    return selected;
  });
  const assignedItemIds = new Set(modules.flatMap((module) => module.itemIds));
  const expectedItemIds = new Set(
    CANONICAL_MANIFEST.conditionalSpecialistItemIds ?? [],
  );
  if (
    assignedItemIds.size !== expectedItemIds.size ||
    [...expectedItemIds].some((itemId) => !assignedItemIds.has(itemId))
  ) {
    throw new Error(
      "Canonical specialist modules do not cover exactly the conditional specialist item roster.",
    );
  }
  return modules;
}
export function listCanonicalSpecialistCandidates(
  moduleId: string,
): readonly CanonicalSpecialistCandidate[] {
  return getCanonicalSpecialistModule(moduleId)?.candidates ?? [];
}

function numericAnswers(
  answers: AnswerMap,
): Record<string, number | undefined> {
  return Object.fromEntries(
    Object.entries(answers).map(([questionId, answer]) => [
      questionId,
      typeof answer.value === "number" && Number.isFinite(answer.value)
        ? answer.value / 3
        : undefined,
    ]),
  );
}

function constructScores(
  module: CanonicalSpecialistModule,
  answers: Readonly<Record<string, number | undefined>>,
): Record<string, number> {
  const scores: Record<string, { numerator: number; denominator: number }> =
    Object.fromEntries(
      module.constructIds.map((constructId) => [
        constructId,
        { numerator: 0, denominator: 0 },
      ]),
    );
  for (const question of module.questions) {
    const answer = answers[String(question.id)];
    if (typeof answer !== "number") continue;
    const weights =
      module.constructWeightsByQuestionId[String(question.id)] ?? {};
    for (const [constructId, weight] of Object.entries(weights)) {
      if (!scores[constructId] || !Number.isFinite(weight) || weight === 0)
        continue;
      scores[constructId].numerator += answer * weight;
      scores[constructId].denominator += Math.abs(weight);
    }
  }
  return Object.fromEntries(
    module.constructIds.map((constructId) => {
      const score = scores[constructId];
      return [
        constructId,
        score.denominator === 0 ? 0 : score.numerator / score.denominator,
      ];
    }),
  );
}

function evidenceFor(
  module: CanonicalSpecialistModule,
  answers: Readonly<Record<string, number | undefined>>,
): SpecialistEvidenceSummary {
  return summarizeSpecialistEvidence(
    module.questions.map((question) => ({
      question,
      constructWeights:
        module.constructWeightsByQuestionId[String(question.id)] ?? {},
    })),
    answers,
    module.constructIds,
  );
}

function candidateMatch(
  candidate: CanonicalSpecialistCandidate,
  scores: Record<string, number>,
  evidence: SpecialistEvidenceSummary,
  mode: "feminist" | "identity" | "experimental",
): CanonicalSpecialistMatch & { readonly distance: number } {
  const signals = candidate.signals ?? {};
  const covered = profileDistanceConstructIds(evidence, signals);
  const distance =
    covered.length === 0
      ? 2
      : Math.sqrt(
          covered.reduce(
            (sum, constructId) =>
              sum + (scores[constructId] - signals[constructId]) ** 2,
            0,
          ) / covered.length,
        );
  const candidateEvidence = profileEvidence(evidence, signals);
  const gates = (candidate.gates ?? []).flatMap((gate) => {
    const constructId =
      typeof gate.constructId === "string" ? gate.constructId : undefined;
    if (!constructId) return [];
    return [
      {
        constructId,
        ...(typeof gate.min === "number" ? { min: gate.min } : {}),
        ...(typeof gate.max === "number" ? { max: gate.max } : {}),
      },
    ];
  });
  const gateEvaluation = evaluateSpecialistConstructGates(
    evidence,
    scores,
    gates,
  );
  const insufficientEvidence =
    candidateEvidence.insufficientEvidence ||
    gateEvaluation.status === "insufficient-evidence";
  const blocked = gateEvaluation.status === "blocked";
  const status =
    mode === "experimental"
      ? insufficientEvidence
        ? "insufficient evidence"
        : blocked
          ? "blocked by constitutive gate"
          : "experimental"
      : candidate.status;
  return {
    id: candidate.id,
    name: candidate.name,
    ...(candidate.variant ? { variant: candidate.variant } : {}),
    ...(candidate.nodeId ? { nodeId: candidate.nodeId } : {}),
    status,
    fit:
      mode === "experimental"
        ? !blocked && covered.length > 0
          ? Math.max(0, 1 - distance / 2)
          : 0
        : insufficientEvidence
          ? 0
          : Math.max(0, Math.min(1, 1 - distance / 2)),
    evidenceStatus: candidateEvidence.evidenceStatus,
    insufficientEvidence: candidateEvidence.insufficientEvidence,
    evidenceCoverage: candidateEvidence.evidenceCoverage,
    coveredConstructCount: candidateEvidence.coveredConstructCount,
    requiredConstructCount: candidateEvidence.requiredConstructCount,
    ...(mode === "experimental"
      ? {
          gateStatus: gateEvaluation.status,
          gateFailures: gateEvaluation.failedConstructIds,
        }
      : {}),
    distance,
  };
}

export function scoreFeministModule(
  module: CanonicalSpecialistModule,
  answers: AnswerMap,
): CanonicalSpecialistStrategyResult {
  const numeric = numericAnswers(answers);
  const evidence = evidenceFor(module, numeric);
  const scores = constructScores(module, numeric);
  return {
    constructScores: scores,
    evidence,
    matches: module.candidates
      .map((candidate) =>
        candidateMatch(candidate, scores, evidence, "feminist"),
      )
      .sort((left, right) => left.distance - right.distance),
  };
}

export function scoreIdentitySovereigntyModule(
  module: CanonicalSpecialistModule,
  answers: AnswerMap,
): CanonicalSpecialistStrategyResult {
  const numeric = numericAnswers(answers);
  const evidence = evidenceFor(module, numeric);
  const scores = constructScores(module, numeric);
  const bestById = new Map<
    string,
    CanonicalSpecialistMatch & { readonly distance: number }
  >();
  for (const candidate of module.candidates) {
    const match = candidateMatch(candidate, scores, evidence, "identity");
    const existing = bestById.get(match.id);
    if (!existing || match.distance < existing.distance)
      bestById.set(match.id, match);
  }
  return {
    constructScores: scores,
    evidence,
    matches: [...bestById.values()].sort(
      (left, right) => left.distance - right.distance,
    ),
  };
}

export function scoreExperimentalSpecialistModule(
  module: CanonicalSpecialistModule,
  answers: AnswerMap,
): CanonicalSpecialistStrategyResult {
  const numeric = numericAnswers(answers);
  const evidence = evidenceFor(module, numeric);
  const scores = constructScores(module, numeric);
  return {
    constructScores: scores,
    evidence,
    matches: module.candidates
      .map((candidate) =>
        candidateMatch(candidate, scores, evidence, "experimental"),
      )
      .sort((left, right) => right.fit - left.fit),
  };
}

export function canonicalCriterionOptions(
  module: CanonicalSpecialistModule,
): readonly {
  readonly id: string;
  readonly traditionId: string;
  readonly label: string;
  readonly variant?: string;
  readonly description: string;
}[] {
  return module.candidates.map((candidate) => ({
    id: candidateOptionId(candidate),
    traditionId: candidate.id,
    label: candidate.name,
    ...(candidate.variant ? { variant: candidate.variant } : {}),
    description: candidate.description,
  }));
}

export function assertCanonicalSpecialistAssignment(
  moduleId: string,
  moduleVersion: string,
  assignmentModuleId: string,
): void {
  const module = getCanonicalSpecialistModule(moduleId);
  if (!module || module.id !== assignmentModuleId) {
    throw new Error(
      `Unknown canonical specialist assignment module: ${assignmentModuleId}`,
    );
  }
  const publicVersion =
    module.id === "feminist-faction-module" ||
    module.id === "identity-sovereignty-module"
      ? `2026-08-${module.version}`
      : module.version;
  if (publicVersion !== moduleVersion) {
    throw new Error(
      `Specialist module ${moduleId} has version ${publicVersion}, not ${moduleVersion}`,
    );
  }
}
