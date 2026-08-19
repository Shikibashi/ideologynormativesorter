import type {
  ConstructResult,
} from "../../../contracts/src/constructs";
import type {
  ConstructRequirement,
  PrimaryProfileRecord,
} from "../../../contracts/src/content";
import type { ConstructId } from "../../../contracts/src/ids";
import type {
  ConstitutiveGate,
} from "../../../contracts/src/scoring";
import type {
  PrimaryProfileEvidence,
  ProfileGateEvaluation,
  ProfileGateReason,
  ProfileGateStatus,
} from "../../../contracts/src/profiles";

export interface ConstitutiveGateContext {
  readonly constructsById: ReadonlyMap<ConstructId, ConstructResult>;
  readonly profileEvidence: PrimaryProfileEvidence;
}

export interface ConstitutiveGateEvaluation {
  readonly evaluations: readonly ProfileGateEvaluation[];
  readonly status: ProfileGateStatus;
}

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function requirementsFor(profile: PrimaryProfileRecord): readonly ConstructRequirement[] {
  return profile.requirements ?? [];
}

function validateGateShape(gate: ConstitiveGateLike): string | undefined {
  if (!gate.id || typeof gate.id !== "string") return "gate id must be a non-empty string";
  switch (gate.operator) {
    case "minimum":
      return finite(gate.minimum) ? undefined : "minimum gate threshold must be finite";
    case "maximum":
      return finite(gate.maximum) ? undefined : "maximum gate threshold must be finite";
    case "interval":
      if (!finite(gate.minimum) || !finite(gate.maximum)) {
        return "interval gate thresholds must be finite";
      }
      return gate.minimum <= gate.maximum
        ? undefined
        : "interval gate minimum must not exceed maximum";
    case "evidenceMinimum":
      if (
        !finite(gate.minimumEvidenceRatio) ||
        gate.minimumEvidenceRatio < 0 ||
        gate.minimumEvidenceRatio > 1
      ) {
        return "evidence minimum ratio must be within [0, 1]";
      }
      if (
        gate.minimumItemCount !== undefined &&
        (!Number.isInteger(gate.minimumItemCount) || gate.minimumItemCount < 0)
      ) {
        return "evidence minimum item count must be a non-negative integer";
      }
      if (gate.minimumItemCount !== undefined && gate.constructId === undefined) {
        return "evidence minimum item count requires a construct";
      }
      return undefined;
    case "conjunction":
    case "disjunction":
      return gate.children.length > 0 && gate.children.every((child) => typeof child === "string" && child.length > 0)
        ? undefined
        : `${gate.operator} gate must contain non-empty child ids`;
  }
}

type ConstitiveGateLike = ConstitiveGateUnion;
type ConstitiveGateUnion = ConstitiveMinimumGate | ConstitiveMaximumGate | ConstitiveIntervalGate | ConstitiveEvidenceGate | ConstitiveCompoundGate;
type ConstitiveMinimumGate = Extract<ConstitutiveGate, { operator: "minimum" }>;
type ConstitiveMaximumGate = Extract<ConstitutiveGate, { operator: "maximum" }>;
type ConstitiveIntervalGate = Extract<ConstitutiveGate, { operator: "interval" }>;
type ConstitiveEvidenceGate = Extract<ConstitutiveGate, { operator: "evidenceMinimum" }>;
type ConstitiveCompoundGate = Extract<ConstitutiveGate, { operator: "conjunction" | "disjunction" }>;

export function validatePrimaryProfileConfiguration(
  profile: PrimaryProfileRecord,
  knownConstructIds: ReadonlySet<string>,
): string | undefined {
  if (!profile.id || !profile.name || profile.role !== "primary") {
    return "primary profile identity is invalid";
  }
  if (
    profile.minimumEvidenceRatio !== undefined &&
    (!finite(profile.minimumEvidenceRatio) ||
      profile.minimumEvidenceRatio < 0 ||
      profile.minimumEvidenceRatio > 1)
  ) {
    return "profile minimum evidence ratio must be within [0, 1]";
  }

  const requirementIds = new Set<string>();
  for (const requirement of requirementsFor(profile)) {
    const constructId = String(requirement.constructId);
    if (requirementIds.has(constructId)) return `duplicate requirement ${constructId}`;
    requirementIds.add(constructId);
    if (!knownConstructIds.has(constructId)) return `unknown requirement construct ${constructId}`;
    if (!finite(requirement.targetValue) || requirement.targetValue < -1 || requirement.targetValue > 1) {
      return `invalid target value for ${constructId}`;
    }
    if (!finite(requirement.weight) || requirement.weight <= 0) {
      return `invalid weight for ${constructId}`;
    }
    if (
      requirement.minimumAnsweredItems !== undefined &&
      (!Number.isInteger(requirement.minimumAnsweredItems) || requirement.minimumAnsweredItems < 0)
    ) {
      return `invalid minimum answered item count for ${constructId}`;
    }
  }

  const gateById = new Map<string, ConstitutiveGate>();
  for (const gate of profile.gates) {
    if (gateById.has(gate.id)) return `duplicate gate ${gate.id}`;
    const shapeError = validateGateShape(gate);
    if (shapeError) return `${gate.id}: ${shapeError}`;
    gateById.set(gate.id, gate);
    if ("constructId" in gate && gate.constructId !== undefined && !knownConstructIds.has(String(gate.constructId))) {
      return `${gate.id}: unknown gate construct ${String(gate.constructId)}`;
    }
  }

  for (const gate of profile.gates) {
    if (gate.operator !== "conjunction" && gate.operator !== "disjunction") continue;
    const children = gate.children;
    if (new Set(children).size !== children.length) return `${gate.id}: duplicate child gate`;
    for (const child of children) {
      if (!gateById.has(child)) return `${gate.id}: unknown child gate ${child}`;
      if (child === gate.id) return `${gate.id}: gate cannot reference itself`;
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (gateId: string): string | undefined => {
    if (visited.has(gateId)) return undefined;
    if (visiting.has(gateId)) return `cyclic gate reference at ${gateId}`;
    visiting.add(gateId);
    const gate = gateById.get(gateId);
    if (gate?.operator === "conjunction" || gate?.operator === "disjunction") {
      for (const child of gate.children) {
        const error = visit(child);
        if (error) return error;
      }
    }
    visiting.delete(gateId);
    visited.add(gateId);
    return undefined;
  };
  for (const gate of profile.gates) {
    const error = visit(gate.id);
    if (error) return error;
  }
  return undefined;
}

function valueEvaluation(
  gate: Extract<ConstitutiveGate, { operator: "minimum" | "maximum" | "interval" }>,
  result: ConstructResult | undefined,
): ProfileGateEvaluation {
  const base = {
    gateId: gate.id,
    operator: gate.operator,
    constructId: gate.constructId,
  } as const;
  if (!result || result.status !== "scored") {
    return Object.freeze({ ...base, status: "unavailable", reason: "construct_unavailable" });
  }
  const observedValue = result.score;
  if (gate.operator === "minimum") {
    return Object.freeze({
      ...base,
      observedValue,
      minimum: gate.minimum,
      status: observedValue >= gate.minimum ? "passed" : "failed",
      reason: observedValue >= gate.minimum ? "value_meets_threshold" : "value_below_minimum",
    });
  }
  if (gate.operator === "maximum") {
    return Object.freeze({
      ...base,
      observedValue,
      maximum: gate.maximum,
      status: observedValue <= gate.maximum ? "passed" : "failed",
      reason: observedValue <= gate.maximum ? "value_meets_threshold" : "value_above_maximum",
    });
  }
  const inInterval = observedValue >= gate.minimum && observedValue <= gate.maximum;
  return Object.freeze({
    ...base,
    observedValue,
    minimum: gate.minimum,
    maximum: gate.maximum,
    status: inInterval ? "passed" : "failed",
    reason: inInterval ? "value_in_interval" : "value_outside_interval",
  });
}

function evidenceEvaluation(
  gate: Extract<ConstitutiveGate, { operator: "evidenceMinimum" }>,
  context: ConstitutiveGateContext,
): ProfileGateEvaluation {
  if (gate.constructId !== undefined) {
    const result = context.constructsById.get(gate.constructId);
    const base = {
      gateId: gate.id,
      operator: gate.operator,
      constructId: gate.constructId,
      minimumEvidenceRatio: gate.minimumEvidenceRatio,
      ...(gate.minimumItemCount === undefined ? {} : { minimumItemCount: gate.minimumItemCount }),
    } as const;
    if (!result || result.status !== "scored") {
      return Object.freeze({ ...base, status: "unavailable", reason: "construct_unavailable" });
    }
    const observedEvidenceRatio = result.support.evidenceRatio;
    const observedItemCount = result.evidence.answeredItemCount;
    const evidencePasses = observedEvidenceRatio >= gate.minimumEvidenceRatio;
    const itemCountPasses =
      gate.minimumItemCount === undefined || observedItemCount >= gate.minimumItemCount;
    const passes = evidencePasses && itemCountPasses;
    return Object.freeze({
      ...base,
      observedEvidenceRatio,
      observedItemCount,
      status: passes ? "passed" : "failed",
      reason: passes
        ? gate.minimumItemCount === undefined
          ? "evidence_meets_threshold"
          : "item_count_meets_threshold"
        : !evidencePasses
          ? "evidence_below_threshold"
          : "item_count_below_threshold",
    });
  }

  const observedEvidenceRatio = context.profileEvidence.comparisonCoverage;
  const passes = observedEvidenceRatio >= gate.minimumEvidenceRatio;
  return Object.freeze({
    gateId: gate.id,
    operator: gate.operator,
    observedEvidenceRatio,
    minimumEvidenceRatio: gate.minimumEvidenceRatio,
    status: passes ? "passed" : "failed",
    reason: passes ? "evidence_meets_threshold" : "evidence_below_threshold",
  });
}

function compoundEvaluation(
  gate: Extract<ConstitutiveGate, { operator: "conjunction" | "disjunction" }>,
  evaluate: (gateId: string) => ProfileGateEvaluation,
): ProfileGateEvaluation {
  const children = gate.children.map((child) => evaluate(child));
  const hasPassed = children.some((child) => child.status === "passed");
  const hasFailed = children.some((child) => child.status === "failed");
  const hasUnavailable = children.some((child) => child.status === "unavailable");
  const status =
    gate.operator === "conjunction"
      ? hasFailed
        ? "failed"
        : hasUnavailable
          ? "unavailable"
          : "passed"
      : hasPassed
        ? "passed"
        : hasUnavailable
          ? "unavailable"
          : "failed";
  const reason: ProfileGateReason =
    status === "passed"
      ? "children_passed"
      : status === "failed"
        ? "child_failed"
        : "child_unavailable";
  return Object.freeze({
    gateId: gate.id,
    operator: gate.operator,
    status,
    reason,
    children: Object.freeze([...gate.children].sort()),
  });
}

export function evaluateConstitutiveGates(
  profile: PrimaryProfileRecord,
  context: ConstitutiveGateContext,
): ConstitutiveGateEvaluation {
  const gateById = new Map(profile.gates.map((gate) => [gate.id, gate]));
  const memo = new Map<string, ProfileGateEvaluation>();
  const evaluate = (gateId: string): ProfileGateEvaluation => {
    const cached = memo.get(gateId);
    if (cached) return cached;
    const gate = gateById.get(gateId);
    if (!gate) throw new Error(`Unknown validated gate ${gateId}`);
    let evaluation: ProfileGateEvaluation;
    switch (gate.operator) {
      case "minimum":
      case "maximum":
      case "interval":
        evaluation = valueEvaluation(gate, context.constructsById.get(gate.constructId));
        break;
      case "evidenceMinimum":
        evaluation = evidenceEvaluation(gate, context);
        break;
      case "conjunction":
      case "disjunction":
        evaluation = compoundEvaluation(gate, evaluate);
        break;
    }
    memo.set(gateId, evaluation);
    return evaluation;
  };

  const evaluations = [...profile.gates]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((gate) => evaluate(gate.id));
  const status = evaluations.some((evaluation) => evaluation.status === "failed")
    ? "failed"
    : evaluations.some((evaluation) => evaluation.status === "unavailable")
      ? "unavailable"
      : "passed";
  return {
    evaluations: Object.freeze(evaluations),
    status,
  };
}
