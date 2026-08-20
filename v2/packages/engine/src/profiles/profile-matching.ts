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
  ProfileGateEvaluation,
  ProfileGateStatus,
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
import {
  computeCommitmentAffinity,
  computeProfileDistance,
} from "./profile-distance";
import { rankPrimaryProfiles } from "./profile-ranking";
import {
  commitmentCriterionSatisfied,
  getPrimaryIdeologyCommitmentSpec,
  isDecisiveCommitment,
  isDemotedPrimaryProfile,
  type CommitmentCriterion,
  type PrimaryIdeologyCommitment,
  type PrimaryIdeologyCommitmentSpec,
} from "./ideology-commitments";

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
  commitmentModel: boolean,
): ScoredPrimaryProfile {
  const score = commitmentModel
    ? computeCommitmentAffinity(comparisons)
    : computeProfileDistance(comparisons);
  return {
    profileId: profile.id,
    name: profile.name,
    status: "scored",
    distance: score.distance,
    similarity: score.similarity,
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

function criterionShapeValid(criterion: CommitmentCriterion): boolean {
  if (criterion.operator === "minimum") {
    return Number.isFinite(criterion.minimum) && criterion.minimum >= -1 && criterion.minimum <= 1;
  }
  if (criterion.operator === "maximum") {
    return Number.isFinite(criterion.maximum) && criterion.maximum >= -1 && criterion.maximum <= 1;
  }
  return (
    Number.isFinite(criterion.minimum) &&
    Number.isFinite(criterion.maximum) &&
    criterion.minimum >= -1 &&
    criterion.maximum <= 1 &&
    criterion.minimum <= criterion.maximum
  );
}

function validateCommitmentSpec(
  spec: PrimaryIdeologyCommitmentSpec,
  knownConstructIds: ReadonlySet<string>,
): string | undefined {
  if (spec.commitments.length === 0) return "commitment model has no commitments";
  const ids = new Set<string>();
  for (const commitment of spec.commitments) {
    if (!commitment.id || ids.has(commitment.id)) return `duplicate or empty commitment id ${commitment.id}`;
    ids.add(commitment.id);
    if (!knownConstructIds.has(commitment.constructId)) {
      return `unknown commitment construct ${commitment.constructId}`;
    }
    if (
      (commitment.relation === "constitutive" ||
        commitment.relation === "core" ||
        commitment.relation === "characteristic" ||
        commitment.relation === "incompatible") &&
      commitment.criterion === undefined
    ) {
      return `${commitment.id} requires an explicit criterion`;
    }
    if (commitment.criterion !== undefined && !criterionShapeValid(commitment.criterion)) {
      return `${commitment.id} has an invalid criterion`;
    }
  }
  if (!spec.commitments.some((entry) => entry.relation === "core" || entry.relation === "characteristic")) {
    return "commitment model has no affinity-bearing commitments";
  }
  return undefined;
}

function commitmentReason(
  criterion: CommitmentCriterion,
  satisfied: boolean,
): ProfileGateEvaluation["reason"] {
  if (criterion.operator === "minimum") {
    return satisfied ? "value_meets_threshold" : "value_below_minimum";
  }
  if (criterion.operator === "maximum") {
    return satisfied ? "value_meets_threshold" : "value_above_maximum";
  }
  return satisfied ? "value_in_interval" : "value_outside_interval";
}

function commitmentEvaluation(
  commitment: PrimaryIdeologyCommitment,
  constructsById: ReadonlyMap<ConstructId, ConstructResult>,
): ProfileGateEvaluation {
  const criterion = commitment.criterion!;
  const construct = constructsById.get(commitment.constructId as ConstructId);
  const base = {
    gateId: `commitment:${commitment.id}`,
    operator: criterion.operator,
    constructId: commitment.constructId as ConstructId,
    ...(criterion.operator === "minimum" ? { minimum: criterion.minimum } : {}),
    ...(criterion.operator === "maximum" ? { maximum: criterion.maximum } : {}),
    ...(criterion.operator === "interval"
      ? { minimum: criterion.minimum, maximum: criterion.maximum }
      : {}),
  } as const;
  if (!construct || construct.status !== "scored" || !Number.isFinite(construct.score)) {
    return Object.freeze({
      ...base,
      status: "unavailable" as const,
      reason: "construct_unavailable" as const,
    });
  }
  if (
    commitment.minimumAnsweredItems !== undefined &&
    construct.evidence.answeredItemCount < commitment.minimumAnsweredItems
  ) {
    return Object.freeze({
      ...base,
      observedValue: construct.score,
      status: "unavailable" as const,
      reason: "construct_unavailable" as const,
    });
  }
  const criterionSatisfied = commitmentCriterionSatisfied(construct.score, criterion);
  const passed =
    commitment.relation === "incompatible" ? !criterionSatisfied : criterionSatisfied;
  return Object.freeze({
    ...base,
    observedValue: construct.score,
    status: passed ? "passed" : "failed",
    reason: commitmentReason(criterion, criterionSatisfied),
  });
}

function evaluateDecisiveCommitments(
  spec: PrimaryIdeologyCommitmentSpec,
  constructsById: ReadonlyMap<ConstructId, ConstructResult>,
): { readonly evaluations: readonly ProfileGateEvaluation[]; readonly status: ProfileGateStatus } {
  const evaluations = spec.commitments
    .filter(isDecisiveCommitment)
    .map((entry) => commitmentEvaluation(entry, constructsById))
    .sort((left, right) => left.gateId.localeCompare(right.gateId));
  const status: ProfileGateStatus = evaluations.some((entry) => entry.status === "failed")
    ? "failed"
    : evaluations.some((entry) => entry.status === "unavailable")
      ? "unavailable"
      : "passed";
  return { evaluations: Object.freeze(evaluations), status };
}

export function scorePrimaryProfiles(
  assessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
): PrimaryProfileAssessment {
  assertVersionCompatibility(assessment, bundle);
  const constructsById = constructMap(assessment.constructs);
  const knownConstructIds = new Set(bundle.constructs.map((construct) => String(construct.id)));
  const profiles: PrimaryProfileMatchResult[] = [];

  for (const profile of [...bundle.profiles]
    .sort((left, right) => String(left.id).localeCompare(String(right.id)))) {
    const profileId = String(profile.id);
    if (isDemotedPrimaryProfile(profileId)) continue;

    const commitmentSpec = getPrimaryIdeologyCommitmentSpec(profileId);
    const configurationError = commitmentSpec
      ? validateCommitmentSpec(commitmentSpec, knownConstructIds)
      : validatePrimaryProfileConfiguration(profile, knownConstructIds);
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

    const contentGateResult = evaluateConstitutiveGates(profile, {
      constructsById,
      profileEvidence: evaluated.evidence,
    });
    const commitmentGateResult = commitmentSpec
      ? evaluateDecisiveCommitments(commitmentSpec, constructsById)
      : { evaluations: Object.freeze([]), status: "passed" as const };
    const gateEvaluations = Object.freeze(
      [...contentGateResult.evaluations, ...commitmentGateResult.evaluations].sort((left, right) =>
        left.gateId.localeCompare(right.gateId),
      ),
    );
    const combinedGateStatus: ProfileGateStatus =
      contentGateResult.status === "failed" || commitmentGateResult.status === "failed"
        ? "failed"
        : contentGateResult.status === "unavailable" || commitmentGateResult.status === "unavailable"
          ? "unavailable"
          : "passed";

    const reason: ProfileAbstentionReason | undefined =
      evaluated.evidence.unavailableRequiredConstructCount > 0
        ? "required_construct_unavailable"
        : combinedGateStatus === "failed"
          ? "constitutive_gate_failed"
          : combinedGateStatus === "unavailable"
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
          gateEvaluations,
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
        gateEvaluations,
        commitmentSpec !== undefined,
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
