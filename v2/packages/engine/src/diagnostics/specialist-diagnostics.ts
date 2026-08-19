import type { SpecialistAssessment } from "../../../contracts/src/specialists";
import type { SpecialistDiagnostic, SpecialistProfileDiagnostic } from "../../../contracts/src/diagnostics";
import { deepFreeze, weightedComparisonIds } from "./common";
import { buildConstructDiagnostics } from "./construct-diagnostics";
import { buildContributionTrace } from "./contribution-trace";

export function buildSpecialistDiagnostics(
  assessment: SpecialistAssessment | undefined,
  bundle: import("../../../contracts/src/content").CanonicalContentBundle,
): readonly SpecialistDiagnostic[] {
  if (!assessment) return Object.freeze([]);
  return deepFreeze([...assessment.modules].sort((left, right) => left.moduleId.localeCompare(right.moduleId)).map((module) => {
    const profileDiagnostics: SpecialistProfileDiagnostic[] = [...module.profiles].sort((left, right) => left.profileId.localeCompare(right.profileId)).map((profile) => {
      const ranked = weightedComparisonIds(profile.comparisons);
      return {
        profileId: profile.profileId,
        status: profile.status,
        distance: profile.distance,
        similarity: profile.similarity,
        rank: profile.rank,
        tieGroup: profile.tieGroup,
        closestConstructIds: ranked.closest,
        largestDepartureConstructIds: ranked.departures,
        comparisons: profile.comparisons,
        gates: profile.gates,
        evidence: profile.evidence,
        ...(profile.abstentionReason === undefined ? {} : { abstentionReason: profile.abstentionReason }),
      };
    });
    const constructDiagnostics = module.constructAssessment === null
      ? []
      : buildConstructDiagnostics(module.constructAssessment, bundle, buildContributionTrace(module.constructAssessment, bundle));
    return {
      moduleId: module.moduleId,
      status: module.status,
      activation: {
        moduleId: module.moduleId,
        activationRuleId: `module:${module.moduleId}:explicit-request`,
        status: module.activationStatus,
        eligibilityStatus: module.eligibilityStatus,
        requestedModule: module.activationStatus === "activated" || module.activationReason === "module_was_explicitly_requested",
        ...(module.activationReason ?? module.eligibilityReason ? { reason: module.activationReason ?? module.eligibilityReason } : {}),
      },
      evidence: module.evidence,
      constructDiagnostics: Object.freeze(constructDiagnostics),
      profileDiagnostics: Object.freeze(profileDiagnostics),
    };
  }));
}
