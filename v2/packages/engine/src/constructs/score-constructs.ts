import type {
  ConstructAssessment,
  ConstructEvidence,
  OverallConstructEvidence,
} from "../../../contracts/src/constructs";
import type { ResponseState } from "../../../contracts/src/responses";
import type { CanonicalContentBundle } from "../../../contracts/src/content";
import type { ContentFingerprint } from "../../../contracts/src/versions";
import type { EngineContentIndex, EngineContentScope } from "../content-index";
import { createEngineContentIndex } from "../content-index";
import { throwScoringError } from "../errors/scoring-error";
import type { PreparedAssessment } from "../types";
import { aggregateConstruct } from "./aggregate-construct";
import { computeConstructEvidence } from "./evidence";
import { ratioOrZero, stableUnitRatio } from "./numeric";

function assertVersionCompatibility(
  prepared: PreparedAssessment,
  bundle: CanonicalContentBundle,
): void {
  if (
    prepared.responseSchemaVersion !== bundle.metadata.responseSchemaVersion
  ) {
    throwScoringError(
      "RESPONSE_SCHEMA_VERSION_MISMATCH",
      "Prepared response schema version does not match canonical content",
      {
        details: {
          expected: bundle.metadata.responseSchemaVersion,
          received: prepared.responseSchemaVersion,
        },
      },
    );
  }
  if (prepared.contentFingerprint !== bundle.metadata.contentFingerprint) {
    throwScoringError(
      "CONTENT_FINGERPRINT_MISMATCH",
      "Prepared content fingerprint does not match canonical content",
      {
        details: {
          expected: bundle.metadata.contentFingerprint,
          received: prepared.contentFingerprint,
        },
      },
    );
  }
  if (prepared.contentVersion !== bundle.metadata.contentVersion) {
    throwScoringError(
      "CONTENT_VERSION_MISMATCH",
      "Prepared content version does not match canonical content",
      {
        details: {
          expected: bundle.metadata.contentVersion,
          received: prepared.contentVersion,
        },
      },
    );
  }
  if (prepared.scoringVersion !== bundle.metadata.scoringVersion) {
    throwScoringError(
      "SCORING_VERSION_MISMATCH",
      "Prepared scoring version does not match canonical content",
      {
        details: {
          expected: bundle.metadata.scoringVersion,
          received: prepared.scoringVersion,
        },
      },
    );
  }
}

function sumEvidence(
  evidences: readonly ConstructEvidence[],
): OverallConstructEvidence {
  const itemStateById: Record<string, ResponseState> = {};
  const contributionIds = new Set<string>();
  const sum = (key: keyof ConstructEvidence): number =>
    evidences.reduce(
      (total, evidence) =>
        total + (typeof evidence[key] === "number" ? evidence[key] : 0),
      0,
    );
  for (const evidence of evidences) {
    for (const [itemId, state] of Object.entries(evidence.itemStateById)) {
      itemStateById[itemId] = state;
    }
    for (const id of evidence.contributionIds) contributionIds.add(id);
  }
  const totalEligibleWeight = sum("totalEligibleWeight");
  const answeredEligibleWeight = sum("answeredEligibleWeight");
  const scoredMappedWeight = sum("scoredMappedWeight");
  return Object.freeze({
    expectedItemCount: sum("expectedItemCount"),
    answeredItemCount: sum("answeredItemCount"),
    missingItemCount: sum("missingItemCount"),
    skippedItemCount: sum("skippedItemCount"),
    abstainedItemCount: sum("abstainedItemCount"),
    refusedItemCount: sum("refusedItemCount"),
    supportingItemCount: sum("supportingItemCount"),
    totalEligibleWeight,
    answeredEligibleWeight,
    missingWeight: sum("missingWeight"),
    skippedWeight: sum("skippedWeight"),
    abstainedWeight: sum("abstainedWeight"),
    refusedWeight: sum("refusedWeight"),
    scoredMappedWeight,
    scoredEffectiveWeight: sum("scoredEffectiveWeight"),
    weightedSum: sum("weightedSum"),
    structuralCoverage: stableUnitRatio(
      sum("answeredItemCount"),
      sum("expectedItemCount"),
    ),
    answeredWeightCoverage: stableUnitRatio(
      answeredEligibleWeight,
      totalEligibleWeight,
    ),
    scoredWeightCoverage: stableUnitRatio(
      scoredMappedWeight,
      totalEligibleWeight,
    ),
    effectiveWeightCoverage: stableUnitRatio(
      sum("scoredEffectiveWeight"),
      totalEligibleWeight,
    ),
    salienceCoverage: ratioOrZero(
      sum("scoredEffectiveWeight"),
      scoredMappedWeight,
    ),
    salienceSkippedWeight: sum("salienceSkippedWeight"),
    salienceSkippedItemCount: sum("salienceSkippedItemCount"),
    contributionIds: Object.freeze([...contributionIds].sort()),
    itemStateById: Object.freeze(itemStateById),
    constructCount: evidences.length,
  });
}

function contributionSortKey(contribution: {
  readonly sourceItemId: string;
  readonly sourceResponseState: string;
  readonly constructId: string;
  readonly optionId?: string;
}): string {
  return [
    contribution.sourceItemId,
    contribution.optionId ?? "",
    contribution.constructId,
    contribution.sourceResponseState,
  ].join("\u0000");
}

export function scoreConstructs(
  prepared: PreparedAssessment,
  contentIndex: EngineContentIndex,
): ConstructAssessment {
  assertVersionCompatibility(prepared, contentIndex.bundle);
  const orderedConstructs = [...contentIndex.activeConstructs].sort(
    (left, right) => left.id.localeCompare(right.id),
  );
  const evidences = orderedConstructs.map((construct) =>
    computeConstructEvidence(construct.id, prepared, contentIndex),
  );
  const constructs = orderedConstructs.map((construct, index) =>
    aggregateConstruct(construct, evidences[index]),
  );
  const overall = sumEvidence(evidences);
  const contributions = Object.freeze(
    [...prepared.contributions].sort((left, right) =>
      contributionSortKey(left).localeCompare(contributionSortKey(right)),
    ),
  );
  return Object.freeze({
    responseSchemaVersion: prepared.responseSchemaVersion,
    scoringVersion: prepared.scoringVersion,
    contentVersion: prepared.contentVersion,
    contentFingerprint: prepared.contentFingerprint as ContentFingerprint,
    resultSchemaVersion: contentIndex.bundle.metadata.resultSchemaVersion,
    responseSummary: Object.freeze({ ...prepared.responseSummary }),
    contributions,
    constructs: Object.freeze(constructs),
    evidence: Object.freeze({
      overall,
      byConstruct: Object.freeze(evidences),
    }),
  });
}

export function scoreConstructLayer(
  prepared: PreparedAssessment,
  bundle: CanonicalContentBundle,
  scope?: EngineContentScope,
): ConstructAssessment {
  return scoreConstructs(
    prepared,
    createEngineContentIndex(bundle, scope ?? prepared.scope),
  );
}
