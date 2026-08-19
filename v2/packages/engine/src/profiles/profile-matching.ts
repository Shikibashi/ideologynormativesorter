import type {
  ConstructAssessment,
  ConstructResult,
} from "../../../contracts/src/constructs";
import type {
  CanonicalContentBundle,
  PrimaryProfileRecord,
} from "../../../contracts/src/content";
import type { ConstructId } from "../../../contracts/src/ids";
import type {
  PrimaryProfileAssessment,
  PrimaryProfileEvidence,
  PrimaryProfileMatchResult,
  PrimaryProfileSupportSummary,
  ProfileAbstentionReason,
  ScoredPrimaryProfile,
} from "../../../contracts/src/profiles";
import { throwScoringError } from "../errors/scoring-error";
import {
  emptyProfileEvidence,
  evaluatePrimaryProfileEvidence,
} from "./profile-evidence";
import {
  evaluateConstitutiveGates,
  validatePrimaryProfileConfiguration,
} from "./profile-gates";
import { computeProfileDistance } from "./profile-distance";
import { rankPrimaryProfiles } from "./profile-ranking";

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (!Object.isFrozen(value)) Object.freeze(value);
  for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
  return value;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function assertVersionCompatibility(
  assessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
): void {
  const expected = bundle.metadata;
  const checks: readonly [string, string, string][] = [
    ["responseSchemaVersion", String(expected.responseSchemaVersion), String(assessment.responseSchemaVersion)],
    ["scoringVersion", String(expected.scoringVersion), String(assessment.scoringVersion)],
    ["contentVersion", String(expected.contentVersion), String(assessment.contentVersion)],
    ["contentFingerprint", String(expected.contentFingerprint), String(assessment.contentFingerprint)],
    ["resultSchemaVersion", String(expected.resultSchemaVersion), String(assessment.resultSchemaVersion)],
  ];
  for (const [field, expectedValue, receivedValue] of checks) {
    if (expectedValue === receivedValue) continue;
    const code =
      field === "responseSchemaVersion"
        ? "RESPONSE_SCHEMA_VERSION_MISMATCH"
        : field === "scoringVersion"
          ? "SCORING_VERSION_MISMATCH"
          : field === "contentVersion"
            ? "CONTENT_VERSION_MISMATCH"
            : field === "contentFingerprint"
              ? "CONTENT_FINGERPRINT_MISMATCH"
              : "RESULT_SCHEMA_VERSION_MISMATCH";
    throwScoringError(code, `Construct assessment ${field} does not match canonical content`, {
      details: { expected: expectedValue, received: receivedValue },
    });
  }
}

function constructMap(
  constructs: readonly ConstructResult[],
): ReadonlyMap<ConstructId, ConstructResult> {
  const map = new Map<ConstructId, ConstructResult>();
  for (const construct of constructs) {
    if (map.has(construct.constructId)) {
      throwScoringError("INVALID_SCORING_CONFIGURATION", "Construct assessment contains duplicate construct results", {
        details: { constructId: construct.constructId },
      });
    }
    map.set(construct.constructId, construct);
  }
  return map;
}

function supportFor(
  evidence: PrimaryProfileEvidence,
  reason?: ProfileAbstentionReason,
): PrimaryProfileSupportSummary {
  const evidenceStatus =
    evidence.measuredWeight === 0
      ? "none"
      : evidence.unavailableRequiredConstructCount === 0 &&
          evidence.comparisonCoverage >= evidence.minimumEvidenceRatio
        ? "sufficient"
        : "partial";
  const uncertaintyReasons = new Set<PrimaryProfileSupportSummary["uncertaintyReasons"][number]>();
  if (evidence.unavailableRequiredConstructCount > 0) uncertaintyReasons.add("required_construct_unavailable");
  if (evidenceStatus === "partial") uncertaintyReasons.add("partial_profile_evidence");
  if (reason === "insufficient_evidence") uncertaintyReasons.add("insufficient_profile_evidence");
  if (reason === "constitutive_gate_failed") uncertaintyReasons.add("constitutive_gate_failed");
  if (reason === "constitutive_gate_unavailable") uncertaintyReasons.add("constitutive_gate_unavailable");
  if (reason === "no_comparable_constructs") uncertaintyReasons.add("no_comparable_constructs");
  return Object.freeze({
    evidenceStatus,
    evidenceRatio: evidence.comparisonCoverage,
    minimumEvidenceRatio: evidence.minimumEvidenceRatio,
    uncertaintyLevel: reason === undefined && evidenceStatus === "sufficient" ? "low" : "high",
    uncertaintyReasons: Object.freeze([...uncertaintyReasons].sort()),
  });
}

function abstainedResult(
  profile: PrimaryProfileRecord,
  evidence: PrimaryProfileEvidence,
  comparisons: PrimaryProfileMatchResult["comparisons"],
  gates: PrimaryProfileMatchResult["gates"],
  reason: ProfileAbstentionReason,
): PrimaryProfileMatchResult {
  return {
    profileId: profile.id,
    name: profile.name,
    status: "abstained",
    distance: null,
    similarity: null,
    rank: null,
    tieGroup: null,
    abstentionReason: reason,
    comparisons,
    evidence,
    gates,
    support: supportFor(evidence, reason),
  };
}

function scoredResult(
  profile: PrimaryProfileRecord,
  evidence: PrimaryProfileEvidence,
  comparisons: PrimaryProfileMatchResult["comparisons"],
  gates: PrimaryProfileMatchResult["gates"],
): ScoredPrimaryProfile {
  const distance = computeProfileDistance(comparisons);
  return {
    profileId: profile.id,
    name: profile.name,
    status: "scored",
    distance: distance.distance,
    similarity: distance.similarity,
    rank: null,
    tieGroup: null,
    comparisons,
    evidence,
    gates,
    support: supportFor(evidence),
  };
}

function sortConstructs(constructs: readonly ConstructResult[]): readonly ConstructResult[] {
  return [...constructs].sort((left, right) =>
    String(left.constructId).localeCompare(String(right.constructId)),
  );
}

export function scorePrimaryProfiles(
  assessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
): PrimaryProfileAssessment {
  assertVersionCompatibility(assessment, bundle);
  const constructsById = constructMap(assessment.constructs);
  const knownConstructIds = new Set(bundle.constructs.map((construct) => String(construct.id)));
  const profiles: PrimaryProfileMatchResult[] = [];

  for (const profile of [...bundle.profiles].sort((left, right) =>
    String(left.id).localeCompare(String(right.id)),
  )) {
    const configurationError = validatePrimaryProfileConfiguration(profile, knownConstructIds);
    if (configurationError) {
      const empty = emptyProfileEvidence(profile);
      profiles.push(
        abstainedResult(profile, empty.evidence, empty.comparisons, [], "invalid_profile_configuration"),
      );
      continue;
    }

    const evaluated = evaluatePrimaryProfileEvidence(profile, constructsById);
    if (evaluated.evidence.requiredConstructCount === 0) {
      profiles.push(
        abstainedResult(
          profile,
          evaluated.evidence,
          evaluated.comparisons,
          [],
          "no_comparable_constructs",
        ),
      );
      continue;
    }

    const gateResult = evaluateConstitutiveGates(profile, {
      constructsById,
      profileEvidence: evaluated.evidence,
    });
    const reason: ProfileAbstentionReason | undefined =
      evaluated.evidence.unavailableRequiredConstructCount > 0
        ? "required_construct_unavailable"
        : gateResult.status === "failed"
          ? "constitutive_gate_failed"
          : gateResult.status === "unavailable"
            ? "constitutive_gate_unavailable"
            : !evaluated.evidence.meetsMinimumEvidence
              ? "insufficient_evidence"
              : evaluated.evidence.measuredRequiredConstructCount === 0
                ? "no_comparable_constructs"
                : undefined;

    if (reason !== undefined) {
      profiles.push(
        abstainedResult(
          profile,
          evaluated.evidence,
          evaluated.comparisons,
          gateResult.evaluations,
          reason,
        ),
      );
      continue;
    }
    profiles.push(
      scoredResult(
        profile,
        evaluated.evidence,
        evaluated.comparisons,
        gateResult.evaluations,
      ),
    );
  }

  const ranked = rankPrimaryProfiles(profiles);
  const result: PrimaryProfileAssessment = {
    responseSchemaVersion: assessment.responseSchemaVersion,
    scoringVersion: assessment.scoringVersion,
    contentVersion: assessment.contentVersion,
    contentFingerprint: assessment.contentFingerprint,
    resultSchemaVersion: bundle.metadata.resultSchemaVersion,
    constructs: clone(sortConstructs(assessment.constructs)),
    profiles: ranked.profiles,
    ranking: ranked.ranking,
    topProfileIds: ranked.topProfileIds,
    topTie: ranked.topTie,
    uncertainty: ranked.uncertainty,
  };
  return deepFreeze(result);
}

export const matchPrimaryProfiles = scorePrimaryProfiles;
