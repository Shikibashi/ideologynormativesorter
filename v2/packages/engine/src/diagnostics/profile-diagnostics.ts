import type { PrimaryProfileAssessment } from "../../../contracts/src/profiles";
import type { ProfileDiagnostic } from "../../../contracts/src/diagnostics";
import { deepFreeze, weightedComparisonIds } from "./common";

export function buildProfileDiagnostics(assessment?: PrimaryProfileAssessment): readonly ProfileDiagnostic[] {
  if (!assessment) return Object.freeze([]);
  return deepFreeze([...assessment.profiles].sort((left, right) => String(left.profileId).localeCompare(String(right.profileId))).map((profile) => {
    const ranked = weightedComparisonIds(profile.comparisons);
    return {
      profileId: String(profile.profileId),
      status: profile.status,
      similarity: profile.similarity,
      distance: profile.distance,
      rank: profile.rank,
      tieGroup: profile.tieGroup,
      assessmentTie: assessment.topTie,
      assessmentUncertainty: assessment.uncertainty,
      closestConstructIds: ranked.closest,
      largestDepartureConstructIds: ranked.departures,
      highestWeightConstructIds: ranked.highestWeight,
      comparisons: profile.comparisons,
      gates: profile.gates,
      evidence: profile.evidence,
      ...(profile.status === "abstained" ? { abstentionReason: profile.abstentionReason } : {}),
    };
  }));
}
