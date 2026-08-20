import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type {
  CanonicalContentBundle,
  PrimaryProfileRecord,
} from "../../v2/packages/contracts/src/content";
import type {
  ConstructAssessment,
  ConstructResult,
} from "../../v2/packages/contracts/src/constructs";
import { createConstructId } from "../../v2/packages/contracts/src/ids";
import { scorePrimaryProfiles } from "../../v2/packages/engine/src";
import {
  DEMOTED_PRIMARY_PROFILE_IDS,
  PRIMARY_IDEOLOGY_COMMITMENT_SPECS,
} from "../../v2/packages/engine/src/profiles/ideology-commitments";

const bundle = JSON.parse(
  readFileSync(resolve(process.cwd(), "v2/generated/content.bundle.json"), "utf8"),
) as CanonicalContentBundle;

function scoredConstruct(constructId: string, score: number): ConstructResult {
  return {
    constructId: createConstructId(constructId),
    status: "scored",
    score,
    numerator: score,
    denominator: 1,
    evidence: {
      constructId: createConstructId(constructId),
      expectedItemCount: 2,
      answeredItemCount: 2,
      missingItemCount: 0,
      skippedItemCount: 0,
      abstainedItemCount: 0,
      refusedItemCount: 0,
      supportingItemCount: 2,
      totalEligibleWeight: 2,
      answeredEligibleWeight: 2,
      missingWeight: 0,
      skippedWeight: 0,
      abstainedWeight: 0,
      refusedWeight: 0,
      scoredMappedWeight: 2,
      scoredEffectiveWeight: 2,
      weightedSum: score * 2,
      structuralCoverage: 1,
      answeredWeightCoverage: 1,
      scoredWeightCoverage: 1,
      effectiveWeightCoverage: 1,
      salienceCoverage: 1,
      salienceSkippedWeight: 0,
      salienceSkippedItemCount: 0,
      contributionIds: [],
      itemStateById: {},
    },
    support: {
      evidenceStatus: "sufficient",
      minimumEvidenceRatio: 0.5,
      evidenceRatio: 1,
      nearThreshold: false,
      uncertaintyLevel: "low",
      uncertaintyReasons: [],
    },
    contributionIds: [],
  };
}

function assessment(scores: Readonly<Record<string, number>>): ConstructAssessment {
  const constructs = bundle.constructs
    .filter((construct) => construct.scope === "root")
    .map((construct) => scoredConstruct(String(construct.id), scores[String(construct.id)] ?? 0));
  return {
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    scoringVersion: bundle.metadata.scoringVersion,
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    resultSchemaVersion: bundle.metadata.resultSchemaVersion,
    responseSummary: {
      answeredCount: constructs.length,
      missingCount: 0,
      skippedCount: 0,
      abstainedCount: 0,
      refusedCount: 0,
    },
    contributions: [],
    constructs,
    evidence: {
      overall: {} as ConstructAssessment["evidence"]["overall"],
      byConstruct: constructs.map((construct) => construct.evidence),
    },
  };
}

function scrambleCentroids(profiles: readonly PrimaryProfileRecord[]): PrimaryProfileRecord[] {
  return profiles.map((profile) => ({
    ...profile,
    requirements: (profile.requirements ?? []).map((requirement, index) => ({
      ...requirement,
      targetValue: index % 2 === 0 ? -1 : 1,
      weight: index % 3 === 0 ? 99 : 0.25,
    })),
  }));
}

describe("commitment-based production primary scoring", () => {
  it("does not read migrated centroid target values or weights", () => {
    const constructAssessment = assessment({});
    const baseline = scorePrimaryProfiles(constructAssessment, bundle);
    const mutated = scorePrimaryProfiles(constructAssessment, {
      ...bundle,
      profiles: scrambleCentroids(bundle.profiles),
    });

    expect(mutated).toEqual(baseline);
  });

  it("only exposes commitment-backed primary ideologies in ordinary ranking", () => {
    const result = scorePrimaryProfiles(assessment({}), bundle);
    const expected = PRIMARY_IDEOLOGY_COMMITMENT_SPECS
      .map((entry) => entry.profileId)
      .sort();
    expect(
      result.profiles
        .filter((entry) => !DEMOTED_PRIMARY_PROFILE_IDS.includes(String(entry.profileId) as never))
        .map((entry) => String(entry.profileId))
        .sort(),
    ).toEqual(expected);
    for (const demoted of DEMOTED_PRIMARY_PROFILE_IDS) {
      expect(
        result.profiles.find((entry) => String(entry.profileId) === demoted),
      ).toMatchObject({
        status: "abstained",
        abstentionReason: "invalid_profile_configuration",
      });
      expect(result.ranking.some((entry) => String(entry.profileId) === demoted)).toBe(false);
    }
  });

  it("scores right-libertarian affinity from commitment satisfaction rather than vector distance", () => {
    const result = scorePrimaryProfiles(
      assessment({
        "authority-legitimacy": 0,
        "property-legitimacy": 0.7,
        "liberty-noninterference": 0.8,
        "market-process-confidence": 0.8,
        "public-choice-skepticism": 0.6,
        "state-action-vs-exit": -0.6,
        "regulation-vs-deregulation": -0.6,
        "centralization-preference": -0.6,
      }),
      bundle,
    );
    const match = result.profiles.find(
      (entry) => String(entry.profileId) === "profile:market-right-libertarianism",
    );
    expect(match?.status).toBe("scored");
    expect(match?.similarity).toBe(1);
    expect(match?.distance).toBe(0);
    expect(match?.gates.some((gate) => gate.gateId === "commitment:rl-liberty")).toBe(true);
  });
});
