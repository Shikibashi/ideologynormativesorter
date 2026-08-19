import type { ConstructResult } from "../../../contracts/src/constructs";
import type { ModifierProfileRecord } from "../../../contracts/src/content";
import type { ConstructId } from "../../../contracts/src/ids";
import type {
  ModifierEvidence,
  ModifierGateEvaluation,
  ModifierGateReason,
  ModifierGateStatus,
} from "../../../contracts/src/modifiers";
import type { ConstitutiveGate } from "../../../contracts/src/scoring";

export interface ModifierGateContext {
  readonly constructsById: ReadonlyMap<ConstructId, ConstructResult>;
  readonly modifierEvidence: ModifierEvidence;
}

export interface ModifierGateEvaluationResult {
  readonly evaluations: readonly ModifierGateEvaluation[];
  readonly status: ModifierGateStatus;
}

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function validateGateShape(gate: ConstitutiveGate): string | undefined {
  if (!gate.id) return "gate id must be a non-empty string";
  switch (gate.operator) {
    case "minimum":
      return finite(gate.minimum) ? undefined : "minimum threshold must be finite";
    case "maximum":
      return finite(gate.maximum) ? undefined : "maximum threshold must be finite";
    case "interval":
      if (!finite(gate.minimum) || !finite(gate.maximum)) return "interval thresholds must be finite";
      return gate.minimum <= gate.maximum ? undefined : "interval minimum exceeds maximum";
    case "evidenceMinimum":
      if (!finite(gate.minimumEvidenceRatio) || gate.minimumEvidenceRatio < 0 || gate.minimumEvidenceRatio > 1) return "evidence threshold must be within [0,1]";
      if (gate.minimumItemCount !== undefined && (!Number.isInteger(gate.minimumItemCount) || gate.minimumItemCount < 0)) return "minimum item count must be a non-negative integer";
      return undefined;
    case "conjunction":
    case "disjunction":
      return gate.children.length > 0 && gate.children.every((child) => child.length > 0)
        ? undefined
        : `${gate.operator} gate must contain child IDs`;
  }
}

export function validateModifierGateConfiguration(
  modifier: ModifierProfileRecord,
  knownConstructIds: ReadonlySet<string>,
): string | undefined {
  const gateIds = new Set<string>();
  const gateById = new Map<string, ConstitutiveGate>();
  for (const gate of modifier.gates) {
    if (gateIds.has(gate.id)) return `duplicate gate ${gate.id}`;
    const shapeError = validateGateShape(gate);
    if (shapeError) return `${gate.id}: ${shapeError}`;
    if ("constructId" in gate && gate.constructId !== undefined && !knownConstructIds.has(String(gate.constructId))) return `${gate.id}: unknown construct ${String(gate.constructId)}`;
    gateIds.add(gate.id);
    gateById.set(gate.id, gate);
  }
  for (const gate of modifier.gates) {
    if (gate.operator !== "conjunction" && gate.operator !== "disjunction") continue;
    if (new Set(gate.children).size !== gate.children.length) return `${gate.id}: duplicate child gate`;
    for (const child of gate.children) if (!gateById.has(child)) return `${gate.id}: unknown child gate ${child}`;
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): string | undefined => {
    if (visited.has(id)) return undefined;
    if (visiting.has(id)) return `cyclic gate reference at ${id}`;
    visiting.add(id);
    const gate = gateById.get(id);
    if (gate?.operator === "conjunction" || gate?.operator === "disjunction") {
      for (const child of gate.children) {
        const error = visit(child);
        if (error) return error;
      }
    }
    visiting.delete(id);
    visited.add(id);
    return undefined;
  };
  for (const gate of modifier.gates) {
    const error = visit(gate.id);
    if (error) return error;
  }
  return undefined;
}

function valueEvaluation(
  gate: Extract<ConstitutiveGate, { operator: "minimum" | "maximum" | "interval" }>,
  result: ConstructResult | undefined,
): ModifierGateEvaluation {
  const base = { gateId: gate.id, operator: gate.operator, constructId: gate.constructId } as const;
  if (!result || result.status !== "scored") return Object.freeze({ ...base, status: "unavailable", reason: "construct_unavailable" });
  const observedValue = result.score;
  if (gate.operator === "minimum") return Object.freeze({ ...base, observedValue, minimum: gate.minimum, status: observedValue >= gate.minimum ? "passed" : "failed", reason: observedValue >= gate.minimum ? "value_meets_threshold" : "value_below_minimum" });
  if (gate.operator === "maximum") return Object.freeze({ ...base, observedValue, maximum: gate.maximum, status: observedValue <= gate.maximum ? "passed" : "failed", reason: observedValue <= gate.maximum ? "value_meets_threshold" : "value_above_maximum" });
  const passes = observedValue >= gate.minimum && observedValue <= gate.maximum;
  return Object.freeze({ ...base, observedValue, minimum: gate.minimum, maximum: gate.maximum, status: passes ? "passed" : "failed", reason: passes ? "value_in_interval" : "value_outside_interval" });
}

function evidenceEvaluation(
  gate: Extract<ConstitutiveGate, { operator: "evidenceMinimum" }>,
  context: ModifierGateContext,
): ModifierGateEvaluation {
  const result = gate.constructId === undefined ? undefined : context.constructsById.get(gate.constructId);
  const observedEvidenceRatio = result?.status === "scored" ? result.support.evidenceRatio : context.modifierEvidence.indicatorCoverage;
  const observedItemCount = result?.status === "scored" ? result.evidence.answeredItemCount : context.modifierEvidence.measuredIndicatorCount;
  const unavailable = gate.constructId !== undefined && (!result || result.status !== "scored");
  const evidencePasses = observedEvidenceRatio >= gate.minimumEvidenceRatio;
  const itemCountPasses = gate.minimumItemCount === undefined || observedItemCount >= gate.minimumItemCount;
  const passes = !unavailable && evidencePasses && itemCountPasses;
  const reason: ModifierGateReason = unavailable
    ? "construct_unavailable"
    : passes
      ? gate.minimumItemCount === undefined ? "evidence_meets_threshold" : "item_count_meets_threshold"
      : !evidencePasses ? "evidence_below_threshold" : "item_count_below_threshold";
  return Object.freeze({
    gateId: gate.id,
    operator: gate.operator,
    ...(gate.constructId === undefined ? {} : { constructId: gate.constructId }),
    observedEvidenceRatio,
    minimumEvidenceRatio: gate.minimumEvidenceRatio,
    observedItemCount,
    ...(gate.minimumItemCount === undefined ? {} : { minimumItemCount: gate.minimumItemCount }),
    status: unavailable ? "unavailable" : passes ? "passed" : "failed",
    reason,
  });
}

function compoundEvaluation(
  gate: Extract<ConstitutiveGate, { operator: "conjunction" | "disjunction" }>,
  evaluate: (gateId: string) => ModifierGateEvaluation,
): ModifierGateEvaluation {
  const children = gate.children.map((child) => evaluate(child));
  const hasPassed = children.some((child) => child.status === "passed");
  const hasFailed = children.some((child) => child.status === "failed");
  const hasUnavailable = children.some((child) => child.status === "unavailable");
  const status: ModifierGateStatus = gate.operator === "conjunction"
    ? hasFailed ? "failed" : hasUnavailable ? "unavailable" : "passed"
    : hasPassed ? "passed" : hasUnavailable ? "unavailable" : "failed";
  const reason: ModifierGateReason = status === "passed" ? "children_passed" : status === "failed" ? "child_failed" : "child_unavailable";
  return Object.freeze({ gateId: gate.id, operator: gate.operator, status, reason, children: Object.freeze([...gate.children].sort()) });
}

export function evaluateModifierGates(
  modifier: ModifierProfileRecord,
  context: ModifierGateContext,
): ModifierGateEvaluationResult {
  const gateById = new Map(modifier.gates.map((gate) => [gate.id, gate]));
  const memo = new Map<string, ModifierGateEvaluation>();
  const evaluate = (gateId: string): ModifierGateEvaluation => {
    const cached = memo.get(gateId);
    if (cached) return cached;
    const gate = gateById.get(gateId);
    if (!gate) throw new Error(`Unknown validated modifier gate ${gateId}`);
    const evaluation = gate.operator === "minimum" || gate.operator === "maximum" || gate.operator === "interval"
      ? valueEvaluation(gate, context.constructsById.get(gate.constructId))
      : gate.operator === "evidenceMinimum"
        ? evidenceEvaluation(gate, context)
        : compoundEvaluation(gate, evaluate);
    memo.set(gateId, evaluation);
    return evaluation;
  };
  const evaluations = [...modifier.gates].sort((left, right) => left.id.localeCompare(right.id)).map((gate) => evaluate(gate.id));
  const status: ModifierGateStatus = evaluations.some((entry) => entry.status === "failed")
    ? "failed"
    : evaluations.some((entry) => entry.status === "unavailable") ? "unavailable" : "passed";
  return { evaluations: Object.freeze(evaluations), status };
}
