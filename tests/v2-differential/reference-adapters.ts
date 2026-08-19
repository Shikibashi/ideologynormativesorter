import type { ProductionResponse } from "../../src/production/contracts";
import { canonicalProductionLabels, scoreProduction } from "../../src/production";
import { canonicalRegistry } from "../../src/domain/registry";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import type { AssessmentInput, AssessmentResult } from "../../v2/packages/contracts/src/results";
import { scoreAssessment, serializeAssessmentResult } from "../../v2/packages/engine/src";
import { REFERENCE_COMMIT } from "./reference-types";

interface InputRecord {
  readonly itemId?: unknown;
  readonly state?: unknown;
  readonly responseType?: unknown;
  readonly value?: unknown;
  readonly optionId?: unknown;
  readonly confidence?: unknown;
  readonly priority?: unknown;
}

function isRecord(value: unknown): value is InputRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function productionResponses(input: AssessmentInput, bundle: CanonicalContentBundle): readonly ProductionResponse[] {
  const items = new Map(bundle.items.map((item) => [String(item.id), item]));
  return input.coreResponses.flatMap((raw) => {
    if (!isRecord(raw) || typeof raw.itemId !== "string") return [];
    const item = items.get(raw.itemId);
    if (!item || raw.state !== "answered") {
      const status = raw.state === "refused" ? "refused" : raw.state === "abstained" ? "abstained" : "missing";
      return [{ itemId: raw.itemId, status }];
    }
    if (item.responseType === "statement-choice" && typeof raw.optionId === "string") {
      const option = item.options.find((candidate) => candidate.id === raw.optionId);
      const constructValues = Object.fromEntries((option?.contributions ?? []).map((entry) => [entry.constructId, entry.polarity * entry.weight]));
      return [{ itemId: raw.itemId, value: 1, constructValues }];
    }
    if (typeof raw.value !== "number") return [{ itemId: raw.itemId, status: "abstained" }];
    const maximum = item.responseType === "likert5" ? 2 : 3;
    const unit = Math.max(-1, Math.min(1, raw.value / maximum));
    return [{ itemId: raw.itemId, value: item.reverseScored ? -unit : unit }];
  });
}

export interface V1ReferenceProjection {
  readonly referenceCommit: string;
  readonly contentVersion: string;
  readonly scoringVersion: string;
  readonly decision: string;
  readonly evidenceCoverage: Readonly<Record<string, unknown>>;
  readonly uncertainty: Readonly<Record<string, unknown>>;
  readonly abstentionCodes: readonly string[];
  readonly dimensionScores: readonly Readonly<Record<string, unknown>>[];
  readonly labels: readonly Readonly<Record<string, unknown>>[];
}

export function runV1ReferenceCase(input: AssessmentInput, bundle: CanonicalContentBundle): V1ReferenceProjection {
  const result = scoreProduction(
    { responses: productionResponses(input, bundle), labels: canonicalProductionLabels(canonicalRegistry) },
    { registry: canonicalRegistry },
  );
  return {
    referenceCommit: REFERENCE_COMMIT,
    contentVersion: String(bundle.metadata.contentVersion),
    scoringVersion: result.interpretation.scoringVersion,
    decision: result.decision,
    evidenceCoverage: result.evidenceCoverage,
    uncertainty: result.uncertainty,
    abstentionCodes: result.abstentions.map((entry) => entry.code).sort(),
    dimensionScores: result.profile.scores.map((score) => ({
      dimensionId: score.dimensionId,
      value: score.value,
      answeredItems: score.evidenceCoverage.answeredItems,
      expectedItems: score.evidenceCoverage.expectedItems,
      coverage: score.evidenceCoverage.coverage,
    })),
    labels: result.labels.map((label) => ({
      labelId: label.labelId,
      similarity: label.similarity,
      rank: label.rank,
      runnerUpMargin: label.runnerUpMargin,
    })),
  };
}

export interface V2ReferenceProjection {
  readonly resultSchemaVersion: string;
  readonly contentFingerprint: string;
  readonly assessment: AssessmentResult["assessment"];
  readonly constructs: readonly Readonly<Record<string, unknown>>[];
  readonly primary: Readonly<Record<string, unknown>>;
  readonly modifiers: readonly Readonly<Record<string, unknown>>[];
  readonly specialists: Readonly<Record<string, unknown>>;
  readonly diagnostics: Readonly<Record<string, unknown>>;
}

function constructProjection(result: AssessmentResult): readonly Readonly<Record<string, unknown>>[] {
  return result.constructs.map((construct) => ({
    constructId: construct.constructId,
    status: construct.status,
    score: construct.score,
    answeredItemCount: construct.evidence.answeredItemCount,
    expectedItemCount: construct.evidence.expectedItemCount,
    coverage: construct.evidence.answeredWeightCoverage,
  }));
}

export function projectV2Result(result: AssessmentResult): V2ReferenceProjection {
  return {
    resultSchemaVersion: String(result.resultSchemaVersion),
    contentFingerprint: String(result.contentFingerprint),
    assessment: result.assessment,
    constructs: constructProjection(result),
    primary: {
      profiles: result.primary.profiles.map((profile) => ({ profileId: profile.profileId, status: profile.status, distance: profile.distance, similarity: profile.similarity, rank: profile.rank, abstentionReason: profile.abstentionReason })),
      ranking: result.primary.ranking,
      topProfileIds: result.primary.topProfileIds,
      topTie: result.primary.topTie,
      uncertainty: result.primary.uncertainty,
    },
    modifiers: result.modifiers.map((modifier) => ({ modifierId: modifier.modifierId, status: modifier.status, fit: modifier.fit, reason: modifier.reason })),
    specialists: {
      modules: result.specialists.modules.map((module) => ({ moduleId: module.moduleId, activationStatus: module.activationStatus, profileCount: module.profiles.length, constructCount: module.constructs.length, contributionCount: module.contributionIds.length })),
      summary: result.specialists.summary,
    },
    diagnostics: {
      contributionCount: result.diagnostics.contributions.length,
      constructCount: result.diagnostics.constructs.length,
      profileCount: result.diagnostics.profiles.length,
      modifierCount: result.diagnostics.modifiers.length,
      specialistCount: result.diagnostics.specialists.length,
      divergenceCount: result.diagnostics.divergences.length,
      domainCount: result.diagnostics.domains.length,
    },
  };
}

export function runV2ReferenceCase(input: AssessmentInput, bundle: CanonicalContentBundle): V2ReferenceProjection {
  return projectV2Result(scoreAssessment(input, bundle));
}

export function canonicalV2Bytes(input: AssessmentInput, bundle: CanonicalContentBundle): string {
  return serializeAssessmentResult(scoreAssessment(input, bundle));
}
