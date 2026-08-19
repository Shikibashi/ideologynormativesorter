import type {
  CanonicalContentBundle,
  ConstructRequirement,
  SpecialistModuleRecord,
  SpecialistProfileRecord,
  SpecialistVariantRecord,
} from "../../../contracts/src/content";
import type {
  ConstructAssessment,
  ConstructResult,
} from "../../../contracts/src/constructs";
import type { ConstitutiveGate } from "../../../contracts/src/scoring";
import type {
  SpecialistAssessment,
  SpecialistAssessmentInput,
  SpecialistGateEvaluation,
  SpecialistModuleEvidence,
  SpecialistModuleResult,
  SpecialistProfileConstructComparison,
  SpecialistProfileEvidence,
  SpecialistProfileMatchResult,
  SpecialistProfileRankingEntry,
} from "../../../contracts/src/specialists";
import type {
  NormalizedResponse,
  RawResponseEnvelope,
} from "../../../contracts/src/responses";
import {
  createEngineContentIndex,
  getDeclaredItemMappings,
  isRecordValue,
} from "../content-index";
import { scoreConstructLayer } from "../constructs/score-constructs";
import { throwScoringError } from "../errors/scoring-error";
import { prepareAssessmentResponses } from "../responses/prepare-assessment";
import type {
  SpecialistPreparedAssessment,
  SpecialistPreparedModule,
} from "../types";

const SPECIALIST_MAX_DISTANCE = 2;
const SPECIALIST_TIE_TOLERANCE = 1e-12;

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (!Object.isFrozen(value)) Object.freeze(value);
  for (const nested of Object.values(value as Record<string, unknown>)) {
    deepFreeze(nested);
  }
  return value;
}

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.max(0, Math.min(1, numerator / denominator));
}

function specialistInputError(
  message: string,
  details?: Record<string, unknown>,
): never {
  throwScoringError("INVALID_RESPONSE_SHAPE", message, { details });
}

function configurationError(
  message: string,
  details?: Record<string, unknown>,
): never {
  throwScoringError("INVALID_SCORING_CONFIGURATION", message, { details });
}

function responseRecords(input: SpecialistAssessmentInput): {
  readonly records: readonly unknown[];
  readonly envelope?: Record<string, unknown>;
} {
  if (Array.isArray(input.responses)) {
    return { records: input.responses };
  }
  if (
    isRecordValue(input.responses) &&
    Array.isArray(input.responses.responses)
  ) {
    return {
      records: input.responses.responses,
      envelope: input.responses as unknown as Record<string, unknown>,
    };
  }
  specialistInputError("Specialist responses must be an array");
}

function requestedModules(
  input: SpecialistAssessmentInput,
  bundle: CanonicalContentBundle,
): readonly string[] {
  if (!Array.isArray(input.requestedModuleIds)) {
    specialistInputError("requestedModuleIds must be an array");
  }
  const ids = input.requestedModuleIds.map((id) => {
    if (typeof id !== "string" || id.length === 0) {
      specialistInputError("requestedModuleIds must contain non-empty strings");
    }
    return id;
  });
  if (new Set(ids).size !== ids.length) {
    specialistInputError("requestedModuleIds cannot contain duplicates");
  }
  const known = new Set(
    bundle.specialistModules.map((module) => String(module.id)),
  );
  for (const id of ids) {
    if (!known.has(id))
      configurationError("Unknown specialist module " + id, { moduleId: id });
  }
  return Object.freeze([...ids].sort());
}

function partitionResponses(
  records: readonly unknown[],
  requested: ReadonlySet<string>,
  bundle: CanonicalContentBundle,
): ReadonlyMap<string, readonly unknown[]> {
  const byModule = new Map<string, unknown[]>();
  const seenItemIds = new Set<string>();
  const itemById = new Map(bundle.items.map((item) => [String(item.id), item]));
  for (const [index, candidate] of records.entries()) {
    if (!isRecordValue(candidate) || typeof candidate.itemId !== "string") {
      specialistInputError(
        "Specialist response " + index + " must contain an itemId",
      );
    }
    const itemId = candidate.itemId;
    if (seenItemIds.has(itemId)) {
      specialistInputError("Specialist responses cannot repeat an item", {
        itemId,
      });
    }
    seenItemIds.add(itemId);
    const item = itemById.get(itemId);
    if (!item) {
      throwScoringError(
        "UNKNOWN_ITEM",
        "Response references unknown item " + itemId,
        { itemId },
      );
    }
    if (item.role !== "specialist" || !item.moduleId) {
      specialistInputError(
        "Core items cannot be submitted to specialist assessment",
        { itemId },
      );
    }
    const moduleId = String(item.moduleId);
    if (!requested.has(moduleId)) {
      specialistInputError(
        "Specialist response belongs to a module that was not explicitly activated",
        { itemId, moduleId },
      );
    }
    const moduleResponses = byModule.get(moduleId) ?? [];
    moduleResponses.push(candidate);
    byModule.set(moduleId, moduleResponses);
  }
  return new Map(
    [...byModule.entries()].map(([moduleId, moduleResponses]) => [
      moduleId,
      Object.freeze([...moduleResponses]),
    ]),
  );
}

function preparedModuleInput(
  records: readonly unknown[],
  original: SpecialistAssessmentInput,
): RawResponseEnvelope | readonly unknown[] {
  if (Array.isArray(original.responses)) return records;
  return {
    ...original.responses,
    responses: [...records] as RawResponseEnvelope["responses"],
  };
}

export function prepareSpecialistAssessment(
  input: SpecialistAssessmentInput,
  bundle: CanonicalContentBundle,
): SpecialistPreparedAssessment {
  const requested = requestedModules(input, bundle);
  const partitioned = partitionResponses(
    responseRecords(input).records,
    new Set(requested),
    bundle,
  );
  const modulesById = new Map(
    bundle.specialistModules.map((module) => [String(module.id), module]),
  );
  const modules: SpecialistPreparedModule[] = [];
  for (const moduleId of requested) {
    const module = modulesById.get(moduleId);
    if (!module)
      configurationError("Unknown specialist module " + moduleId, { moduleId });
    const itemIds = module.itemIds.map(String);
    const constructIds = module.constructIds.map(String);
    const prepared = prepareAssessmentResponses(
      preparedModuleInput(partitioned.get(moduleId) ?? [], input),
      bundle,
      { itemIds, constructIds },
    );
    modules.push({
      moduleId,
      itemIds: Object.freeze([...itemIds].sort()),
      constructIds: Object.freeze([...constructIds].sort()),
      prepared,
    });
  }
  return deepFreeze({
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    scoringVersion: bundle.metadata.scoringVersion,
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    resultSchemaVersion: bundle.metadata.resultSchemaVersion,
    requestedModuleIds: requested,
    modules,
  });
}

function moduleEligibility(
  module: SpecialistModuleRecord,
  bundle: CanonicalContentBundle,
): { readonly eligible: boolean; readonly reason?: string } {
  if (module.activation.strategy !== "explicit-request") {
    return { eligible: false, reason: "unsupported_activation_strategy" };
  }
  if (module.itemIds.length === 0 || module.constructIds.length === 0) {
    return { eligible: false, reason: "module_has_no_scored_content" };
  }
  const itemById = new Map(bundle.items.map((item) => [String(item.id), item]));
  for (const itemId of module.itemIds.map(String)) {
    const item = itemById.get(itemId);
    if (
      !item ||
      item.role !== "specialist" ||
      String(item.moduleId) !== String(module.id)
    ) {
      return { eligible: false, reason: "module_item_scope_invalid" };
    }
  }
  const constructById = new Map(
    bundle.constructs.map((construct) => [String(construct.id), construct]),
  );
  for (const constructId of module.constructIds.map(String)) {
    const construct = constructById.get(constructId);
    if (
      !construct ||
      construct.scope !== "specialist" ||
      String(construct.moduleId) !== String(module.id)
    ) {
      return { eligible: false, reason: "module_construct_scope_invalid" };
    }
  }
  for (const profileId of module.outputProfileIds.map(String)) {
    const profile = bundle.specialists.find(
      (entry) => String(entry.id) === profileId,
    );
    if (!profile || String(profile.moduleId) !== String(module.id)) {
      return { eligible: false, reason: "module_output_profile_invalid" };
    }
  }
  return { eligible: true };
}

function itemWeight(
  item: ReturnType<typeof createEngineContentIndex>["activeItems"][number],
): number {
  const mappings = getDeclaredItemMappings(item);
  if (item.responseType !== "statement-choice") {
    return mappings.reduce((sum, mapping) => sum + Math.abs(mapping.weight), 0);
  }
  const byOption = new Map<string, number>();
  for (const mapping of mappings) {
    const optionId = mapping.optionId ?? "";
    byOption.set(
      optionId,
      (byOption.get(optionId) ?? 0) + Math.abs(mapping.weight),
    );
  }
  return Math.max(0, ...byOption.values());
}

function answeredItemWeight(
  item: ReturnType<typeof createEngineContentIndex>["activeItems"][number],
  response: NormalizedResponse | undefined,
): number {
  if (!response || response.state !== "answered") return 0;
  if (item.responseType !== "statement-choice") return itemWeight(item);
  if (response.responseType !== "statement-choice") return 0;
  return getDeclaredItemMappings(item, response.optionId).reduce(
    (sum, mapping) => sum + Math.abs(mapping.weight),
    0,
  );
}

function moduleEvidence(
  module: SpecialistModuleRecord,
  prepared: SpecialistPreparedModule,
  constructAssessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
): SpecialistModuleEvidence {
  const index = createEngineContentIndex(bundle, {
    itemIds: module.itemIds.map(String),
    constructIds: module.constructIds.map(String),
  });
  const responseById = new Map(
    prepared.prepared.responses.map((response) => [
      String(response.itemId),
      response,
    ]),
  );
  let totalItemWeight = 0;
  let answeredItemWeightValue = 0;
  for (const item of index.activeItems) {
    totalItemWeight += itemWeight(item);
    answeredItemWeightValue += answeredItemWeight(
      item,
      responseById.get(item.id),
    );
  }
  const scoredConstructCount = constructAssessment.constructs.filter(
    (construct) => construct.status === "scored",
  ).length;
  const policy = module.activation;
  const itemCoverage = ratio(
    prepared.prepared.responseSummary.answeredCount,
    module.itemIds.length,
  );
  const answeredWeightCoverage = ratio(
    answeredItemWeightValue,
    totalItemWeight,
  );
  const constructCoverage = ratio(
    scoredConstructCount,
    module.constructIds.length,
  );
  const insufficientReasons: string[] = [];
  if (
    prepared.prepared.responseSummary.answeredCount <
    policy.minimumAnsweredItems
  ) {
    insufficientReasons.push("minimum_answered_items");
  }
  if (answeredWeightCoverage < policy.minimumAnsweredWeightRatio) {
    insufficientReasons.push("minimum_answered_weight_ratio");
  }
  if (constructCoverage < policy.minimumConstructCoverageRatio) {
    insufficientReasons.push("minimum_construct_coverage_ratio");
  }
  return Object.freeze({
    expectedItemCount: module.itemIds.length,
    answeredItemCount: prepared.prepared.responseSummary.answeredCount,
    missingItemCount: prepared.prepared.responseSummary.missingCount,
    skippedItemCount: prepared.prepared.responseSummary.skippedCount,
    abstainedItemCount: prepared.prepared.responseSummary.abstainedCount,
    refusedItemCount: prepared.prepared.responseSummary.refusedCount,
    totalItemWeight,
    answeredItemWeight: answeredItemWeightValue,
    itemCoverage,
    answeredWeightCoverage,
    expectedConstructCount: module.constructIds.length,
    scoredConstructCount,
    constructCoverage,
    minimumAnsweredItems: policy.minimumAnsweredItems,
    minimumAnsweredWeightRatio: policy.minimumAnsweredWeightRatio,
    minimumConstructCoverageRatio: policy.minimumConstructCoverageRatio,
    status: insufficientReasons.length === 0 ? "sufficient" : "insufficient",
    insufficientReasons: Object.freeze(insufficientReasons),
  });
}

function emptyModuleEvidence(
  module: SpecialistModuleRecord,
  reason: string,
): SpecialistModuleEvidence {
  return Object.freeze({
    expectedItemCount: module.itemIds.length,
    answeredItemCount: 0,
    missingItemCount: module.itemIds.length,
    skippedItemCount: 0,
    abstainedItemCount: 0,
    refusedItemCount: 0,
    totalItemWeight: 0,
    answeredItemWeight: 0,
    itemCoverage: 0,
    answeredWeightCoverage: 0,
    expectedConstructCount: module.constructIds.length,
    scoredConstructCount: 0,
    constructCoverage: 0,
    minimumAnsweredItems: module.activation.minimumAnsweredItems,
    minimumAnsweredWeightRatio: module.activation.minimumAnsweredWeightRatio,
    minimumConstructCoverageRatio:
      module.activation.minimumConstructCoverageRatio,
    status: "insufficient",
    insufficientReasons: Object.freeze([reason]),
  });
}

function emptyProfileEvidence(
  requirements: readonly ConstructRequirement[],
  minimumEvidenceRatio: number,
): SpecialistProfileEvidence {
  const sorted = [...requirements].sort((left, right) =>
    String(left.constructId).localeCompare(String(right.constructId)),
  );
  const totalWeight = sorted.reduce(
    (sum, requirement) => sum + requirement.weight,
    0,
  );
  return Object.freeze({
    requiredConstructCount: sorted.length,
    measuredRequiredConstructCount: 0,
    unavailableRequiredConstructCount: sorted.length,
    totalWeight,
    measuredWeight: 0,
    unavailableWeight: totalWeight,
    comparisonCoverage: 0,
    minimumEvidenceRatio,
    meetsMinimumEvidence: false,
    unavailableConstructIds: Object.freeze(
      sorted.map((requirement) => String(requirement.constructId)),
    ),
  });
}

function gateResult(
  gate: ConstitutiveGate,
  constructs: ReadonlyMap<string, ConstructResult>,
  evidence: SpecialistProfileEvidence,
): SpecialistGateEvaluation {
  const base = { gateId: String(gate.id), operator: gate.operator } as const;
  if (
    gate.operator === "minimum" ||
    gate.operator === "maximum" ||
    gate.operator === "interval"
  ) {
    const construct = constructs.get(String(gate.constructId));
    if (
      !construct ||
      construct.status !== "scored" ||
      !finite(construct.score)
    ) {
      return {
        ...base,
        constructId: String(gate.constructId),
        status: "unavailable",
        reason: "construct_unavailable",
      };
    }
    const observedValue = construct.score;
    const passes =
      gate.operator === "minimum"
        ? observedValue >= gate.minimum
        : gate.operator === "maximum"
          ? observedValue <= gate.maximum
          : observedValue >= gate.minimum && observedValue <= gate.maximum;
    return {
      ...base,
      constructId: String(gate.constructId),
      status: passes ? "passed" : "failed",
      reason: passes ? "value_meets_gate" : "value_fails_gate",
      observedValue,
      ...(gate.operator === "minimum" ? { minimum: gate.minimum } : {}),
      ...(gate.operator === "maximum" ? { maximum: gate.maximum } : {}),
      ...(gate.operator === "interval"
        ? { minimum: gate.minimum, maximum: gate.maximum }
        : {}),
    };
  }
  if (gate.operator === "evidenceMinimum") {
    let observedEvidenceRatio = evidence.comparisonCoverage;
    let observedItemCount: number | undefined;
    if (gate.constructId !== undefined) {
      const construct = constructs.get(String(gate.constructId));
      if (!construct || construct.status !== "scored") {
        return {
          ...base,
          constructId: String(gate.constructId),
          status: "unavailable",
          reason: "construct_unavailable",
          minimumEvidenceRatio: gate.minimumEvidenceRatio,
        };
      }
      observedEvidenceRatio = construct.support.evidenceRatio;
      observedItemCount = construct.evidence.answeredItemCount;
    }
    const ratioPasses = observedEvidenceRatio >= gate.minimumEvidenceRatio;
    const countPasses =
      gate.minimumItemCount === undefined ||
      (observedItemCount !== undefined &&
        observedItemCount >= gate.minimumItemCount);
    const passes = ratioPasses && countPasses;
    return {
      ...base,
      ...(gate.constructId === undefined
        ? {}
        : { constructId: String(gate.constructId) }),
      status: passes ? "passed" : "failed",
      reason: passes ? "evidence_meets_gate" : "evidence_fails_gate",
      observedEvidenceRatio,
      minimumEvidenceRatio: gate.minimumEvidenceRatio,
    };
  }
  return {
    ...base,
    status: "unavailable",
    reason: "compound_gate_requires_recursive_evaluation",
    children: Object.freeze([...gate.children].sort()),
  };
}

function evaluateSpecialistGates(
  gates: readonly ConstitutiveGate[],
  constructs: ReadonlyMap<string, ConstructResult>,
  evidence: SpecialistProfileEvidence,
): {
  readonly evaluations: readonly SpecialistGateEvaluation[];
  readonly status: "passed" | "failed" | "unavailable";
} {
  const gateById = new Map(gates.map((gate) => [String(gate.id), gate]));
  const memo = new Map<string, SpecialistGateEvaluation>();
  const visiting = new Set<string>();
  const evaluate = (id: string): SpecialistGateEvaluation => {
    const cached = memo.get(id);
    if (cached) return cached;
    const gate = gateById.get(id);
    if (!gate) {
      return {
        gateId: id,
        operator: "evidenceMinimum",
        status: "unavailable",
        reason: "unknown_gate",
      };
    }
    if (visiting.has(id)) {
      return {
        gateId: id,
        operator: gate.operator,
        status: "unavailable",
        reason: "gate_cycle",
      };
    }
    visiting.add(id);
    let result: SpecialistGateEvaluation;
    if (gate.operator === "conjunction" || gate.operator === "disjunction") {
      const children = gate.children.map((child) => evaluate(String(child)));
      const passed = children.some((child) => child.status === "passed");
      const failed = children.some((child) => child.status === "failed");
      const unavailable = children.some(
        (child) => child.status === "unavailable",
      );
      const status =
        gate.operator === "conjunction"
          ? failed
            ? "failed"
            : unavailable
              ? "unavailable"
              : "passed"
          : passed
            ? "passed"
            : unavailable
              ? "unavailable"
              : "failed";
      result = {
        gateId: id,
        operator: gate.operator,
        status,
        reason:
          status === "passed"
            ? "children_passed"
            : status === "failed"
              ? "child_failed"
              : "child_unavailable",
        children: Object.freeze([...gate.children].map(String).sort()),
      };
    } else {
      result = gateResult(gate, constructs, evidence);
    }
    visiting.delete(id);
    memo.set(id, result);
    return result;
  };
  const evaluations = [...gates]
    .sort((left, right) => String(left.id).localeCompare(String(right.id)))
    .map((gate) => evaluate(String(gate.id)));
  const status = evaluations.some((entry) => entry.status === "failed")
    ? "failed"
    : evaluations.some((entry) => entry.status === "unavailable")
      ? "unavailable"
      : "passed";
  return { evaluations: Object.freeze(evaluations), status };
}

interface VariantTarget {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: string;
  readonly variant?: string;
  readonly requirements: readonly ConstructRequirement[];
  readonly gates: readonly ConstitutiveGate[];
}

function profileTargets(
  profile: SpecialistProfileRecord,
): readonly VariantTarget[] {
  const variants = profile.variants ?? [];
  if (variants.length > 0) {
    return variants.map((variant: SpecialistVariantRecord) => ({
      id: String(variant.id),
      name: variant.name,
      description: variant.description,
      status: variant.status,
      ...(variant.variant === undefined ? {} : { variant: variant.variant }),
      requirements: variant.requirements,
      gates: variant.gates,
    }));
  }
  return [
    {
      id: String(profile.id),
      name: profile.name,
      description: profile.rationale ?? profile.name,
      status: profile.status ?? "active",
      requirements: profile.requirements ?? [],
      gates: profile.gates,
    },
  ];
}

function profileEvidence(
  profile: SpecialistProfileRecord,
  target: VariantTarget,
  constructs: ReadonlyMap<string, ConstructResult>,
  module: SpecialistModuleRecord,
): {
  readonly comparisons: readonly SpecialistProfileConstructComparison[];
  readonly evidence: SpecialistProfileEvidence;
  readonly gates: readonly SpecialistGateEvaluation[];
  readonly gateStatus: "passed" | "failed" | "unavailable";
  readonly distance: number | null;
  readonly similarity: number | null;
  readonly reason?: string;
} {
  const requirements = [...target.requirements].sort((left, right) =>
    String(left.constructId).localeCompare(String(right.constructId)),
  );
  const minimumEvidenceRatio =
    profile.minimumEvidenceRatio ??
    module.activation.minimumConstructCoverageRatio;
  const comparisons: SpecialistProfileConstructComparison[] = [];
  const unavailableConstructIds: string[] = [];
  let totalWeight = 0;
  let measuredWeight = 0;
  for (const requirement of requirements) {
    const constructId = String(requirement.constructId);
    totalWeight += requirement.weight;
    const construct = constructs.get(constructId);
    const invalidRequirement =
      !finite(requirement.weight) ||
      requirement.weight <= 0 ||
      !finite(requirement.targetValue) ||
      requirement.targetValue < -1 ||
      requirement.targetValue > 1;
    if (
      invalidRequirement ||
      !construct ||
      construct.status !== "scored" ||
      !finite(construct.score) ||
      (requirement.minimumAnsweredItems !== undefined &&
        construct.evidence.answeredItemCount < requirement.minimumAnsweredItems)
    ) {
      unavailableConstructIds.push(constructId);
      comparisons.push({
        constructId,
        targetValue: requirement.targetValue,
        observedScore: construct?.score ?? null,
        weight: requirement.weight,
        squaredError: null,
        weightedSquaredError: null,
        included: false,
        exclusionReason: invalidRequirement
          ? "invalid_requirement"
          : requirement.minimumAnsweredItems !== undefined && construct
            ? "minimum_answered_items_not_met"
            : "construct_unavailable",
      });
      continue;
    }
    const squaredError = (construct.score - requirement.targetValue) ** 2;
    measuredWeight += requirement.weight;
    comparisons.push({
      constructId,
      targetValue: requirement.targetValue,
      observedScore: construct.score,
      weight: requirement.weight,
      squaredError,
      weightedSquaredError: requirement.weight * squaredError,
      included: true,
    });
  }
  const comparisonCoverage = ratio(measuredWeight, totalWeight);
  const evidence = Object.freeze({
    requiredConstructCount: requirements.length,
    measuredRequiredConstructCount: comparisons.filter(
      (comparison) => comparison.included,
    ).length,
    unavailableRequiredConstructCount: unavailableConstructIds.length,
    totalWeight,
    measuredWeight,
    unavailableWeight: totalWeight - measuredWeight,
    comparisonCoverage,
    minimumEvidenceRatio,
    meetsMinimumEvidence:
      requirements.length > 0 && comparisonCoverage >= minimumEvidenceRatio,
    unavailableConstructIds: Object.freeze(
      [...new Set(unavailableConstructIds)].sort(),
    ),
  });
  const gateEvaluation = evaluateSpecialistGates(
    target.gates,
    constructs,
    evidence,
  );
  if (requirements.length === 0) {
    return {
      comparisons: Object.freeze(comparisons),
      evidence,
      gates: gateEvaluation.evaluations,
      gateStatus: gateEvaluation.status,
      distance: null,
      similarity: null,
      reason: "no_comparable_constructs",
    };
  }
  if (!evidence.meetsMinimumEvidence) {
    return {
      comparisons: Object.freeze(comparisons),
      evidence,
      gates: gateEvaluation.evaluations,
      gateStatus: gateEvaluation.status,
      distance: null,
      similarity: null,
      reason: "insufficient_evidence",
    };
  }
  if (gateEvaluation.status === "failed") {
    return {
      comparisons: Object.freeze(comparisons),
      evidence,
      gates: gateEvaluation.evaluations,
      gateStatus: gateEvaluation.status,
      distance: null,
      similarity: null,
      reason: "constitutive_gate_failed",
    };
  }
  if (gateEvaluation.status === "unavailable") {
    return {
      comparisons: Object.freeze(comparisons),
      evidence,
      gates: gateEvaluation.evaluations,
      gateStatus: gateEvaluation.status,
      distance: null,
      similarity: null,
      reason: "constitutive_gate_unavailable",
    };
  }
  const included = comparisons.filter((comparison) => comparison.included);
  const weightedSquaredDistance = included.reduce(
    (sum, comparison) => sum + (comparison.weightedSquaredError ?? 0),
    0,
  );
  const distance =
    measuredWeight > 0
      ? Math.sqrt(weightedSquaredDistance / measuredWeight)
      : null;
  const similarity =
    distance === null || !finite(distance)
      ? 0
      : Math.max(0, Math.min(1, 1 - distance / SPECIALIST_MAX_DISTANCE));
  return {
    comparisons: Object.freeze(comparisons),
    evidence,
    gates: gateEvaluation.evaluations,
    gateStatus: gateEvaluation.status,
    distance,
    similarity,
  };
}

function matchProfile(
  profile: SpecialistProfileRecord,
  module: SpecialistModuleRecord,
  constructAssessment: ConstructAssessment,
  moduleEvidenceValue: SpecialistModuleEvidence,
): SpecialistProfileMatchResult {
  const constructs = new Map(
    constructAssessment.constructs.map((construct) => [
      String(construct.constructId),
      construct,
    ]),
  );
  const targets = profileTargets(profile).map((target) => ({
    target,
    evaluated: profileEvidence(profile, target, constructs, module),
  }));
  const validTargets = targets.filter(
    (entry) =>
      entry.evaluated.reason === undefined &&
      entry.evaluated.similarity !== null,
  );
  const ordered = [...targets].sort((left, right) => {
    const leftSimilarity = left.evaluated.similarity ?? -1;
    const rightSimilarity = right.evaluated.similarity ?? -1;
    return (
      rightSimilarity - leftSimilarity ||
      (left.evaluated.distance ?? Number.POSITIVE_INFINITY) -
        (right.evaluated.distance ?? Number.POSITIVE_INFINITY) ||
      left.target.id.localeCompare(right.target.id)
    );
  });
  const selected = (validTargets.length > 0 ? validTargets : ordered)[0];
  if (!selected) {
    const empty = emptyProfileEvidence(
      profile.requirements ?? [],
      module.activation.minimumConstructCoverageRatio,
    );
    return {
      profileId: String(profile.id),
      moduleId: String(module.id),
      name: profile.name,
      outputType: profile.outputType,
      canonicalStatus: profile.status,
      status: "abstained",
      distance: null,
      similarity: null,
      rank: null,
      tieGroup: null,
      abstentionReason: "no_comparable_constructs",
      comparisons: Object.freeze([]),
      evidence: empty,
      gates: Object.freeze([]),
    };
  }
  const evaluated = selected.evaluated;
  const profileActivation = profile.activation;
  const profileActivationReason =
    profileActivation.minimumAnsweredItems !== undefined &&
    constructAssessment.responseSummary.answeredCount <
      profileActivation.minimumAnsweredItems
      ? "profile_minimum_answered_items_not_met"
      : profileActivation.minimumItemWeight !== undefined &&
          evaluated.evidence.measuredWeight <
            profileActivation.minimumItemWeight
        ? "profile_minimum_item_weight_not_met"
        : profileActivation.requiredConstructCount !== undefined &&
            evaluated.evidence.measuredRequiredConstructCount <
              profileActivation.requiredConstructCount
          ? "profile_required_construct_count_not_met"
          : undefined;
  const reason =
    moduleEvidenceValue.status === "insufficient"
      ? "module_insufficient_evidence"
      : (profileActivationReason ?? evaluated.reason);
  return {
    profileId: String(profile.id),
    moduleId: String(module.id),
    name: profile.name,
    outputType: profile.outputType,
    canonicalStatus: profile.status,
    ...(selected.target.id === String(profile.id)
      ? {}
      : { variantId: selected.target.id }),
    ...(selected.target.variant === undefined
      ? {}
      : { variant: selected.target.variant }),
    status: reason === undefined ? "scored" : "abstained",
    distance: reason === undefined ? evaluated.distance : null,
    similarity: reason === undefined ? evaluated.similarity : null,
    rank: null,
    tieGroup: null,
    ...(reason === undefined ? {} : { abstentionReason: reason }),
    comparisons: evaluated.comparisons,
    evidence: evaluated.evidence,
    gates: evaluated.gates,
  };
}

function rankProfiles(profiles: readonly SpecialistProfileMatchResult[]): {
  readonly profiles: readonly SpecialistProfileMatchResult[];
  readonly ranking: readonly SpecialistProfileRankingEntry[];
  readonly topProfileIds: readonly string[];
  readonly topTie: boolean;
} {
  const scored = profiles
    .filter(
      (profile) => profile.status === "scored" && profile.similarity !== null,
    )
    .sort(
      (left, right) =>
        (right.similarity ?? -1) - (left.similarity ?? -1) ||
        left.profileId.localeCompare(right.profileId),
    );
  const rankByProfileId = new Map<
    string,
    { rank: number; tieGroup: string | null }
  >();
  let lastSimilarity: number | undefined;
  let rank = 0;
  let tieNumber = 0;
  for (const [index, profile] of scored.entries()) {
    if (
      lastSimilarity === undefined ||
      Math.abs((profile.similarity ?? 0) - lastSimilarity) >
        SPECIALIST_TIE_TOLERANCE
    ) {
      rank = index + 1;
      lastSimilarity = profile.similarity ?? 0;
      tieNumber += 1;
    }
    const tied =
      scored.filter(
        (candidate) =>
          Math.abs((candidate.similarity ?? 0) - (profile.similarity ?? 0)) <=
          SPECIALIST_TIE_TOLERANCE,
      ).length > 1;
    rankByProfileId.set(profile.profileId, {
      rank,
      tieGroup: tied ? `tie-${tieNumber}` : null,
    });
  }
  const rankedProfiles = profiles.map((profile) => {
    const position = rankByProfileId.get(profile.profileId);
    return position
      ? { ...profile, rank: position.rank, tieGroup: position.tieGroup }
      : profile;
  });
  const ranking = Object.freeze(
    scored.map((profile) => {
      const position = rankByProfileId.get(profile.profileId)!;
      return {
        profileId: profile.profileId,
        rank: position.rank,
        similarity: profile.similarity!,
        tieGroup: position.tieGroup,
      };
    }),
  );
  const topProfileIds = Object.freeze(
    ranking
      .filter((entry) => entry.rank === 1)
      .map((entry) => entry.profileId)
      .sort(),
  );
  return {
    profiles: Object.freeze(rankedProfiles),
    ranking,
    topProfileIds,
    topTie: topProfileIds.length > 1,
  };
}

function assertVersion(
  received: Record<string, unknown>,
  bundle: CanonicalContentBundle,
  label: string,
): void {
  const expected = bundle.metadata as unknown as Record<string, unknown>;
  for (const field of [
    "responseSchemaVersion",
    "scoringVersion",
    "contentVersion",
    "contentFingerprint",
    "resultSchemaVersion",
  ]) {
    if (String(received[field]) !== String(expected[field])) {
      configurationError(
        label + " " + field + " does not match canonical content",
        {
          field,
          expected: expected[field],
          received: received[field],
        },
      );
    }
  }
}

function notActivatedResult(
  module: SpecialistModuleRecord,
): SpecialistModuleResult {
  return {
    moduleId: String(module.id),
    status: "not_activated",
    eligibilityStatus: "eligible",
    activationStatus: "not_activated",
    activationReason: "module_was_not_explicitly_requested",
    evidence: emptyModuleEvidence(module, "module_not_activated"),
    constructAssessment: null,
    profiles: Object.freeze([]),
    ranking: Object.freeze([]),
    topProfileIds: Object.freeze([]),
    topTie: false,
  };
}

function ineligibleResult(
  module: SpecialistModuleRecord,
  reason: string,
  activationStatus: "activated" | "not_activated",
): SpecialistModuleResult {
  return {
    moduleId: String(module.id),
    status: "ineligible",
    eligibilityStatus: "ineligible",
    activationStatus,
    eligibilityReason: reason,
    evidence: emptyModuleEvidence(module, reason),
    constructAssessment: null,
    profiles: Object.freeze([]),
    ranking: Object.freeze([]),
    topProfileIds: Object.freeze([]),
    topTie: false,
  };
}

function scoreModule(
  module: SpecialistModuleRecord,
  prepared: SpecialistPreparedModule,
  bundle: CanonicalContentBundle,
): SpecialistModuleResult {
  const eligibility = moduleEligibility(module, bundle);
  if (!eligibility.eligible)
    return ineligibleResult(
      module,
      eligibility.reason ?? "module_ineligible",
      "activated",
    );
  const scope = {
    itemIds: module.itemIds.map(String),
    constructIds: module.constructIds.map(String),
  };
  const preparedScope = prepared.prepared.scope;
  if (
    preparedScope === undefined ||
    JSON.stringify(preparedScope.itemIds ?? []) !==
      JSON.stringify([...scope.itemIds].sort()) ||
    JSON.stringify(preparedScope.constructIds ?? []) !==
      JSON.stringify([...scope.constructIds].sort())
  ) {
    configurationError(
      "Specialist prepared assessment does not carry the module scope",
      {
        moduleId: String(module.id),
      },
    );
  }
  const constructAssessment = scoreConstructLayer(
    prepared.prepared,
    bundle,
    scope,
  );
  const evidence = moduleEvidence(
    module,
    prepared,
    constructAssessment,
    bundle,
  );
  const profiles = module.outputProfileIds
    .map((profileId) =>
      bundle.specialists.find(
        (profile) => String(profile.id) === String(profileId),
      ),
    )
    .filter(
      (profile): profile is SpecialistProfileRecord => profile !== undefined,
    )
    .sort((left, right) => String(left.id).localeCompare(String(right.id)))
    .map((profile) =>
      matchProfile(profile, module, constructAssessment, evidence),
    );
  const ranked = rankProfiles(profiles);
  return {
    moduleId: String(module.id),
    status:
      evidence.status === "sufficient"
        ? "scored"
        : "activated_insufficient_evidence",
    eligibilityStatus: "eligible",
    activationStatus: "activated",
    activationReason: "module_was_explicitly_requested",
    evidence,
    constructAssessment,
    profiles: ranked.profiles,
    ranking: ranked.ranking,
    topProfileIds: ranked.topProfileIds,
    topTie: ranked.topTie,
  };
}

export function scoreSpecialistModules(
  prepared: SpecialistPreparedAssessment,
  bundle: CanonicalContentBundle,
): readonly SpecialistModuleResult[] {
  assertVersion(
    prepared as unknown as Record<string, unknown>,
    bundle,
    "Specialist prepared assessment",
  );
  const moduleById = new Map(
    bundle.specialistModules.map((module) => [String(module.id), module]),
  );
  const requested = new Set(prepared.requestedModuleIds);
  if (requested.size !== prepared.requestedModuleIds.length) {
    configurationError(
      "Specialist prepared assessment repeats a requested module",
    );
  }
  const seen = new Set<string>();
  const results: SpecialistModuleResult[] = [];
  for (const entry of [...prepared.modules].sort((left, right) =>
    left.moduleId.localeCompare(right.moduleId),
  )) {
    if (seen.has(entry.moduleId))
      configurationError("Specialist prepared assessment repeats a module", {
        moduleId: entry.moduleId,
      });
    if (!requested.has(entry.moduleId)) {
      configurationError(
        "Specialist prepared module was not explicitly requested",
        { moduleId: entry.moduleId },
      );
    }
    seen.add(entry.moduleId);
    const module = moduleById.get(entry.moduleId);
    if (!module)
      configurationError(
        "Specialist prepared assessment references unknown module",
        { moduleId: entry.moduleId },
      );
    results.push(scoreModule(module, entry, bundle));
  }
  if (seen.size !== requested.size) {
    configurationError(
      "Specialist prepared assessment is missing a requested module",
    );
  }
  return Object.freeze(results);
}

function assertCoreAssessment(
  coreAssessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
): void {
  assertVersion(
    coreAssessment as unknown as Record<string, unknown>,
    bundle,
    "Core construct assessment",
  );
}

export function scoreSpecialists(
  coreAssessment: ConstructAssessment,
  prepared: SpecialistPreparedAssessment,
  bundle: CanonicalContentBundle,
): SpecialistAssessment {
  assertCoreAssessment(coreAssessment, bundle);
  assertVersion(
    prepared as unknown as Record<string, unknown>,
    bundle,
    "Specialist prepared assessment",
  );
  const activated = new Map(
    scoreSpecialistModules(prepared, bundle).map((result) => [
      result.moduleId,
      result,
    ]),
  );
  const modules = bundle.specialistModules
    .map((module) => {
      const eligibility = moduleEligibility(module, bundle);
      if (!eligibility.eligible) {
        return ineligibleResult(
          module,
          eligibility.reason ?? "module_ineligible",
          "not_activated",
        );
      }
      return activated.get(String(module.id)) ?? notActivatedResult(module);
    })
    .sort((left, right) => left.moduleId.localeCompare(right.moduleId));
  const result: SpecialistAssessment = {
    contentSchemaVersion: bundle.metadata.contentSchemaVersion,
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    scoringVersion: bundle.metadata.scoringVersion,
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    resultSchemaVersion: bundle.metadata.resultSchemaVersion,
    researchSchemaVersion: bundle.metadata.researchSchemaVersion,
    coreAssessmentContentFingerprint: String(coreAssessment.contentFingerprint),
    modules: Object.freeze(modules),
    summary: Object.freeze({
      moduleCount: modules.length,
      eligibleModuleCount: modules.filter(
        (module) => module.eligibilityStatus === "eligible",
      ).length,
      activatedModuleCount: modules.filter(
        (module) => module.activationStatus === "activated",
      ).length,
      scoredModuleCount: modules.filter((module) => module.status === "scored")
        .length,
      insufficientEvidenceModuleCount: modules.filter(
        (module) => module.status === "activated_insufficient_evidence",
      ).length,
      notActivatedModuleCount: modules.filter(
        (module) => module.status === "not_activated",
      ).length,
      ineligibleModuleCount: modules.filter(
        (module) => module.status === "ineligible",
      ).length,
    }),
  };
  return deepFreeze(result);
}
