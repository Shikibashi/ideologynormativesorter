import type { ConstructAssessment } from "../../../contracts/src/constructs";
import type { ModifierAssessment } from "../../../contracts/src/modifiers";
import type { ModifierDiagnostic } from "../../../contracts/src/diagnostics";
import type { ContributionTrace } from "../../../contracts/src/diagnostics";
import { deepFreeze } from "./common";

export function buildModifierDiagnostics(
  assessment: ModifierAssessment | undefined,
  constructs: ConstructAssessment,
  traces: readonly ContributionTrace[],
): readonly ModifierDiagnostic[] {
  if (!assessment) return Object.freeze([]);
  const traceById = new Map(traces.map((trace) => [trace.contributionId, trace]));
  return deepFreeze([...assessment.modifiers].sort((left, right) => String(left.modifierId).localeCompare(String(right.modifierId))).map((modifier) => {
    const supporting = new Set<string>();
    const opposing = new Set<string>();
    for (const comparison of modifier.comparisons) {
      if (!comparison.included) continue;
      let sum = 0;
      for (const id of comparison.contributionIds) sum += traceById.get(id)?.weightedContribution ?? 0;
      for (const id of comparison.constructIds) (sum >= 0 ? supporting : opposing).add(String(id));
    }
    return {
      modifierId: String(modifier.modifierId),
      status: modifier.status,
      fit: modifier.fit,
      distance: modifier.distance,
      supportingConstructIds: Object.freeze([...supporting].sort()),
      opposingConstructIds: Object.freeze([...opposing].sort()),
      comparisons: modifier.comparisons,
      gates: modifier.gates,
      evidence: modifier.evidence,
      ...(modifier.reason === undefined ? {} : { abstentionReason: modifier.reason }),
    };
  }));
}
