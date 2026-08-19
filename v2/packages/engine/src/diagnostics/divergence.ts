import type { ConstructAssessment } from "../../../contracts/src/constructs";
import type { CanonicalContentBundle } from "../../../contracts/src/content";
import type { DivergenceDiagnostic, DivergenceRelation } from "../../../contracts/src/diagnostics";
import { deepFreeze } from "./common";

export function analyzeConstructDivergences(
  assessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
  relations: readonly DivergenceRelation[] = (bundle.diagnosticRelations ?? []) as readonly DivergenceRelation[],
): readonly DivergenceDiagnostic[] {
  const resultById = new Map(assessment.constructs.map((result) => [String(result.constructId), result]));
  return deepFreeze([...relations].sort((left, right) => left.id.localeCompare(right.id)).map((relation) => {
    const first = resultById.get(relation.constructIds[0]);
    const second = resultById.get(relation.constructIds[1]);
    if (first?.status === "scored" && second?.status === "scored") {
      const signedDifference = first.score - second.score * relation.secondDirection;
      return {
        id: relation.id,
        relationType: relation.type,
        constructIds: relation.constructIds,
        dimensionPair: relation.dimensionPair,
        status: "scored",
        evidenceStatus: "sufficient",
        firstScore: first.score,
        secondScore: second.score,
        signedDifference,
        magnitude: Math.abs(signedDifference),
        interpretationCode: "neutral_separation",
        provenanceRefs: Object.freeze([...(relation.provenanceRefs ?? [])].sort()),
      };
    }
    return {
      id: relation.id,
      relationType: relation.type,
      constructIds: relation.constructIds,
      dimensionPair: relation.dimensionPair,
      status: "unavailable",
      evidenceStatus: "unavailable",
      firstScore: first?.score ?? null,
      secondScore: second?.score ?? null,
      provenanceRefs: Object.freeze([...(relation.provenanceRefs ?? [])].sort()),
    };
  }));
}
