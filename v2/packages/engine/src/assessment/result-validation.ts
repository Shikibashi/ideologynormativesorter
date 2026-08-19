import type { CanonicalContentBundle } from "../../../contracts/src/content";
import type { AssessmentResult } from "../../../contracts/src/results";
import { throwScoringError } from "../errors/scoring-error";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertFiniteNumbers(value: unknown, path = "result"): void {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throwScoringError("ENGINE_INVARIANT_VIOLATION", "Result contains a non-finite number", { path });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertFiniteNumbers(entry, `${path}[${index}]`));
    return;
  }
  if (isRecord(value)) {
    for (const [key, entry] of Object.entries(value)) assertFiniteNumbers(entry, `${path}.${key}`);
  }
}

function assertVersionBinding(result: AssessmentResult, bundle: CanonicalContentBundle): void {
  const fields = [
    "responseSchemaVersion",
    "resultSchemaVersion",
    "contentSchemaVersion",
    "contentVersion",
    "contentFingerprint",
    "scoringVersion",
    "researchSchemaVersion",
  ] as const;
  for (const field of fields) {
    if (String(result[field]) !== String(bundle.metadata[field])) {
      throwScoringError("ENGINE_INVARIANT_VIOLATION", `Result ${field} does not match canonical content`, {
        details: { field, expected: bundle.metadata[field], received: result[field] },
      });
    }
  }
  if (result.diagnostics.contentFingerprint !== result.contentFingerprint) {
    throwScoringError("ENGINE_INVARIANT_VIOLATION", "Diagnostics content fingerprint does not match result");
  }
}

function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) {
    throwScoringError("ENGINE_INVARIANT_VIOLATION", `${label} contains duplicate IDs`, {
      details: { ids: [...values].sort() },
    });
  }
}

function assertRanking(result: AssessmentResult): void {
  const profileById = new Map(result.primary.profiles.map((profile) => [String(profile.profileId), profile]));
  assertUnique(result.primary.profiles.map((profile) => String(profile.profileId)), "primary profiles");
  let previousRank = 0;
  for (const entry of result.primary.ranking) {
    const profile = profileById.get(String(entry.profileId));
    if (!profile || profile.status !== "scored" || profile.rank !== entry.rank || profile.similarity !== entry.similarity) {
      throwScoringError("ENGINE_INVARIANT_VIOLATION", "Primary ranking references a profile inconsistently", { details: { profileId: entry.profileId } });
    }
    if (entry.rank < previousRank) {
      throwScoringError("ENGINE_INVARIANT_VIOLATION", "Primary ranking is not ordered by rank");
    }
    previousRank = entry.rank;
  }
  for (const profile of result.primary.profiles) {
    if (profile.status === "abstained" && (profile.rank !== null || profile.similarity !== null)) {
      throwScoringError("ENGINE_INVARIANT_VIOLATION", "Abstained profile has a substantive rank or similarity", { details: { profileId: profile.profileId } });
    }
    if (profile.similarity !== null && (profile.similarity < 0 || profile.similarity > 1)) {
      throwScoringError("ENGINE_INVARIANT_VIOLATION", "Primary profile similarity is outside [0, 1]", { details: { profileId: profile.profileId } });
    }
  }
}

function assertContributionReferences(result: AssessmentResult): void {
  const contributionIds = result.diagnostics.contributions.map((entry) => entry.contributionId);
  assertUnique(contributionIds, "diagnostic contributions");
  const known = new Set(contributionIds);
  const references = [
    ...result.constructs.flatMap((construct) => construct.contributionIds),
    ...result.diagnostics.constructs.flatMap((construct) => construct.contributionIds),
    ...result.diagnostics.constructs.flatMap((construct) => construct.includedContributionIds),
    ...result.diagnostics.constructs.flatMap((construct) => construct.excludedContributionIds),
    ...result.specialists.modules.flatMap((module) => module.contributionIds),
    ...result.diagnostics.specialists.flatMap((module) => module.constructDiagnostics.flatMap((construct) => construct.contributionIds)),
  ];
  for (const reference of references) {
    if (!known.has(reference)) {
      throwScoringError("ENGINE_INVARIANT_VIOLATION", "Result contains a dangling contribution reference", { details: { contributionId: reference } });
    }
  }
}

function assertSpecialistReferences(result: AssessmentResult, bundle: CanonicalContentBundle): void {
  const moduleIds = bundle.specialistModules.map((module) => String(module.id));
  const resultModuleIds = result.specialists.modules.map((module) => module.moduleId);
  assertUnique(resultModuleIds, "specialist modules");
  for (const moduleId of resultModuleIds) {
    if (!moduleIds.includes(moduleId)) {
      throwScoringError("ENGINE_INVARIANT_VIOLATION", "Result contains an unknown specialist module", { details: { moduleId } });
    }
  }
  for (const module of result.specialists.modules) {
    const profileIds = module.profiles.map((profile) => profile.profileId);
    assertUnique(profileIds, `specialist profiles for ${module.moduleId}`);
    for (const profile of module.profiles) {
      if (profile.similarity !== null && (profile.similarity < 0 || profile.similarity > 1)) {
        throwScoringError("ENGINE_INVARIANT_VIOLATION", "Specialist similarity is outside [0, 1]", { details: { profileId: profile.profileId } });
      }
    }
  }
}

export function validateAssessmentResult(
  result: AssessmentResult,
  bundle: CanonicalContentBundle,
): AssessmentResult {
  assertVersionBinding(result, bundle);
  assertFiniteNumbers(result);
  assertUnique(result.constructs.map((construct) => String(construct.constructId)), "constructs");
  assertRanking(result);
  assertContributionReferences(result);
  assertSpecialistReferences(result, bundle);
  if (result.assessment.status === "invalid") {
    throwScoringError("ENGINE_INVARIANT_VIOLATION", "The scorer must not emit an invalid result");
  }
  if (result.assessment.evidence.coreCoverage < 0 || result.assessment.evidence.coreCoverage > 1) {
    throwScoringError("ENGINE_INVARIANT_VIOLATION", "Core evidence coverage is outside [0, 1]");
  }
  return result;
}
