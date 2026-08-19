import type { CanonicalContentBundle } from "../../../contracts/src/content";
import type { ConstructDiagnostic } from "../../../contracts/src/diagnostics";
import type { DivergenceDiagnostic } from "../../../contracts/src/diagnostics";
import { deepFreeze } from "./common";

export function buildDomainSummaries(
  bundle: CanonicalContentBundle,
  constructs: readonly ConstructDiagnostic[],
  divergences: readonly DivergenceDiagnostic[],
): readonly import("../../../contracts/src/diagnostics").DomainSummaryDiagnostic[] {
  const resultById = new Map(constructs.map((result) => [result.constructId, result]));
  return deepFreeze([...bundle.domains].sort((left, right) => left.id.localeCompare(right.id)).map((domain) => {
    const ids = bundle.constructs.filter((construct) => construct.domainId === domain.id).map((construct) => String(construct.id)).sort();
    const selected = ids.map((id) => resultById.get(id)).filter((result): result is ConstructDiagnostic => result !== undefined);
    const totalEligibleWeight = selected.reduce((sum, result) => sum + result.evidence.totalEligibleWeight, 0);
    const answeredEligibleWeight = selected.reduce((sum, result) => sum + result.evidence.answeredEligibleWeight, 0);
    const scored = selected.filter((result) => result.status === "scored");
    return {
      domainId: domain.id,
      constructIds: Object.freeze(ids),
      scoredConstructCount: scored.length,
      abstainedConstructCount: selected.length - scored.length,
      evidence: {
        totalEligibleWeight,
        answeredEligibleWeight,
        missingWeight: selected.reduce((sum, result) => sum + result.evidence.missingWeight, 0),
        skippedWeight: selected.reduce((sum, result) => sum + result.evidence.skippedWeight, 0),
        abstainedWeight: selected.reduce((sum, result) => sum + result.evidence.abstainedWeight, 0),
        refusedWeight: selected.reduce((sum, result) => sum + result.evidence.refusedWeight, 0),
        coverage: totalEligibleWeight === 0 ? 0 : answeredEligibleWeight / totalEligibleWeight,
      },
      diagnosticMean: scored.length === 0 ? null : scored.reduce((sum, result) => sum + result.score!, 0) / scored.length,
      diagnosticMeanIsNotAScore: true,
      divergenceIds: Object.freeze(divergences.filter((entry) => entry.constructIds.every((id) => ids.includes(id))).map((entry) => entry.id)),
    };
  }));
}
