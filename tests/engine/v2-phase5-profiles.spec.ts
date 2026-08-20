import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type {
  CanonicalContentBundle,
  ConstructRequirement,
  PrimaryProfileRecord,
} from "../../v2/packages/contracts/src/content";
import type {
  ConstructAssessment,
  ConstructResult,
} from "../../v2/packages/contracts/src/constructs";
import type { PrimaryProfileEvidence } from "../../v2/packages/contracts/src/profiles";
import {
  createConstructId,
  createProfileId,
} from "../../v2/packages/contracts/src/ids";
import {
  evaluateConstitutiveGates,
  PROFILE_TIE_TOLERANCE,
  scorePrimaryProfiles,
} from "../../v2/packages/engine/src";

const realBundle = JSON.parse(
  readFileSync(resolve(process.cwd(), "v2/generated/content.bundle.json"), "utf8"),
) as CanonicalContentBundle;

function profile(
  id: string,
  requirements: readonly ConstructRequirement[],
  gates: PrimaryProfileRecord["gates"] = [],
): PrimaryProfileRecord {
  return {
    id: createProfileId(`profile:${id}`),
    name: id,
    role: "primary",
    requirements: [...requirements],
    gates: [...gates],
    minimumEvidenceRatio: 0.5,
  };
}

function requirement(constructId: string, targetValue: number, weight = 1): ConstructRequirement {
  return {
    constructId: createConstructId(constructId),
    targetValue,
    weight,
  };
}

function evidence(constructId: string, answeredItemCount = 1): ConstructResult["evidence"] {
  return {
    constructId: createConstructId(constructId),
    expectedItemCount: answeredItemCount,
    answeredItemCount,
    missingItemCount: 0,
    skippedItemCount: 0,
    abstainedItemCount: 0,
    refusedItemCount: 0,
    supportingItemCount: answeredItemCount,
    totalEligibleWeight: answeredItemCount,
    answeredEligibleWeight: answeredItemCount,
    missingWeight: 0,
    skippedWeight: 0,
    abstainedWeight: 0,
    refusedWeight: 0,
    scoredMappedWeight: answeredItemCount,
    scoredEffectiveWeight: answeredItemCount,
    weightedSum: 0,
    structuralCoverage: 1,
    answeredWeightCoverage: 1,
    scoredWeightCoverage: 1,
    effectiveWeightCoverage: 1,
    salienceCoverage: 1,
    salienceSkippedWeight: 0,
    salienceSkippedItemCount: 0,
    contributionIds: [],
    itemStateById: {},
  };
}

function scoredConstruct(constructId: string, score: number, answeredItemCount = 1): ConstructResult {
  return {
    constructId: createConstructId(constructId),
    status: "scored",
    score,
    numerator: score,
    denominator: 1,
    evidence: evidence(constructId, answeredItemCount),
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

function abstainedConstruct(constructId: string): ConstructResult {
  return {
    constructId: createConstructId(constructId),
    status: "abstained",
    score: null,
    numerator: 0,
    denominator: 1,
    evidence: {
      ...evidence(constructId),
      answeredItemCount: 0,
      totalEligibleWeight: 1,
      answeredEligibleWeight: 0,
      structuralCoverage: 0,
      answeredWeightCoverage: 0,
      scoredWeightCoverage: 0,
      effectiveWeightCoverage: 0,
      salienceCoverage: 0,
    },
    support: {
      evidenceStatus: "none",
      minimumEvidenceRatio: 0.5,
      evidenceRatio: 0,
      nearThreshold: false,
      uncertaintyLevel: "high",
      uncertaintyReasons: ["no_scored_weight"],
    },
    abstentionReason: "insufficient_evidence",
    contributionIds: [],
  };
}

function assessmentFor(
  bundle: CanonicalContentBundle,
  constructs: readonly ConstructResult[],
): ConstructAssessment {
  return {
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    scoringVersion: bundle.metadata.scoringVersion,
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    resultSchemaVersion: bundle.metadata.resultSchemaVersion,
    responseSummary: {
      answeredCount: constructs.filter((construct) => construct.status === "scored").length,
      missingCount: 0,
      skippedCount: 0,
      abstainedCount: constructs.filter((construct) => construct.status === "abstained").length,
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

function syntheticBundle(
  constructIds: readonly string[],
  profiles: readonly PrimaryProfileRecord[],
): CanonicalContentBundle {
  const sourceConstructs = new Map(realBundle.constructs.map((construct) => [String(construct.id), construct]));
  return {
    ...realBundle,
    constructs: constructIds.map((id) => ({
      ...(sourceConstructs.get(String(id)) ?? realBundle.constructs[0]),
      id: createConstructId(id),
    })),
    items: [],
    profiles: [...profiles],
    modifiers: [],
    specialists: [],
    specialistModules: [],
    specialistCandidates: [],
    specialistAssignment: {
      orderedModuleIds: [],
      strategy: "fixed-order",
    },
    ontologyNodes: [],
    ontologyRelations: [],
    provenanceSources: [],
  };
}

function profileEvidenceFor(): PrimaryProfileEvidence {
  return {
    requiredConstructCount: 1,
    measuredRequiredConstructCount: 1,
    unavailableRequiredConstructCount: 0,
    totalWeight: 1,
    measuredWeight: 1,
    unavailableWeight: 0,
    comparisonCoverage: 1,
    minimumEvidenceRatio: 0.5,
    meetsMinimumEvidence: true,
    unavailableConstructIds: [],
  };
}

describe("Phase 5 primary profile matching", () => {
  it("uses explicit requirements and weighted RMS distance without fallback constructs", () => {
    const bundle = syntheticBundle(
      ["c-alpha", "c-beta"],
      [
        profile("exact", [requirement("c-alpha", 0.5), requirement("c-beta", -0.5)]),
        profile("opposite", [requirement("c-alpha", -0.5), requirement("c-beta", 0.5)]),
      ],
    );
    const result = scorePrimaryProfiles(
      assessmentFor(bundle, [scoredConstruct("c-alpha", 0.5), scoredConstruct("c-beta", -0.5)]),
      bundle,
    );
    const exact = result.profiles.find((entry) => entry.profileId === "profile:exact");
    const opposite = result.profiles.find((entry) => entry.profileId === "profile:opposite");
    expect(exact?.status).toBe("scored");
    expect(exact && exact.distance).toBeCloseTo(0);
    expect(exact && exact.similarity).toBeCloseTo(1);
    expect(opposite && opposite.distance).toBeCloseTo(1);
    expect(opposite && opposite.similarity).toBeCloseTo(0.5);
    expect(result.ranking.map((entry) => entry.profileId)).toEqual([
      "profile:exact",
      "profile:opposite",
    ]);
  });

  it("normalizes explicit profile weights by their measured sum", () => {
    const bundle = syntheticBundle(
      ["c-alpha", "c-beta"],
      [profile("weighted", [requirement("c-alpha", 0, 3), requirement("c-beta", -1)])],
    );
    const result = scorePrimaryProfiles(
      assessmentFor(bundle, [scoredConstruct("c-alpha", 1), scoredConstruct("c-beta", -1)]),
      bundle,
    );
    const weighted = result.profiles[0];
    expect(weighted?.status).toBe("scored");
    expect(weighted && weighted.distance).toBeCloseTo(Math.sqrt(3 / 4));
    expect(weighted && weighted.similarity).toBeCloseTo(1 - Math.sqrt(3 / 4) / 2);
  });

  it("withholds a profile when a required construct or its evidence gate is unavailable", () => {
    const bundle = syntheticBundle(
      ["c-alpha", "c-beta"],
      [
        profile("gated", [requirement("c-alpha", 0), requirement("c-beta", 0)], [
          {
            id: "gate:evidence:beta",
            operator: "evidenceMinimum",
            constructId: createConstructId("c-beta"),
            minimumEvidenceRatio: 0.5,
            minimumItemCount: 1,
          },
        ]),
      ],
    );
    const result = scorePrimaryProfiles(
      assessmentFor(bundle, [scoredConstruct("c-alpha", 0), abstainedConstruct("c-beta")]),
      bundle,
    );
    const gated = result.profiles[0];
    expect(gated?.status).toBe("abstained");
    expect(gated && gated.abstentionReason).toBe("required_construct_unavailable");
    expect(gated && gated.gates[0]?.status).toBe("unavailable");
    expect(result.ranking).toHaveLength(0);
  });

  it("evaluates minimum, maximum, interval, evidence, conjunction, and disjunction gates", () => {
    const bundle = syntheticBundle(
      ["c-alpha", "c-beta"],
      [profile("gates", [requirement("c-alpha", 0), requirement("c-beta", 0)], [
        { id: "gate:min", operator: "minimum", constructId: createConstructId("c-alpha"), minimum: 0.25 },
        { id: "gate:max", operator: "maximum", constructId: createConstructId("c-beta"), maximum: 0.75 },
        { id: "gate:interval", operator: "interval", constructId: createConstructId("c-alpha"), minimum: 0.25, maximum: 0.75 },
        { id: "gate:evidence", operator: "evidenceMinimum", constructId: createConstructId("c-alpha"), minimumEvidenceRatio: 0.5, minimumItemCount: 1 },
        { id: "gate:below", operator: "minimum", constructId: createConstructId("c-beta"), minimum: 0.75 },
        { id: "gate:and", operator: "conjunction", children: ["gate:min", "gate:max"] },
        { id: "gate:or", operator: "disjunction", children: ["gate:below", "gate:min"] },
      ])],
    );
    const profileRecord = bundle.profiles[0];
    const gateResult = evaluateConstitutiveGates(profileRecord, {
      constructsById: new Map([
        [createConstructId("c-alpha"), scoredConstruct("c-alpha", 0.5)],
        [createConstructId("c-beta"), scoredConstruct("c-beta", 0.5)],
      ]),
      profileEvidence: profileEvidenceFor(),
    });
    expect(gateResult.status).toBe("failed");
    expect(gateResult.evaluations.find((gate) => gate.gateId === "gate:or")?.status).toBe("passed");
    expect(gateResult.evaluations.find((gate) => gate.gateId === "gate:below")?.status).toBe("failed");
    expect(gateResult.evaluations.map((gate) => gate.gateId)).toEqual([
      "gate:and",
      "gate:below",
      "gate:evidence",
      "gate:interval",
      "gate:max",
      "gate:min",
      "gate:or",
    ]);
  });

  it("preserves substantive ties under the strict 0.05 similarity tolerance", () => {
    const bundle = syntheticBundle(
      ["c-alpha"],
      [
        profile("c", [requirement("c-alpha", 0.12)]),
        profile("b", [requirement("c-alpha", 0.04)]),
        profile("a", [requirement("c-alpha", 0)]),
      ],
    );
    const result = scorePrimaryProfiles(
      assessmentFor(bundle, [scoredConstruct("c-alpha", 0)]),
      bundle,
    );
    expect(result.topTie.isTie).toBe(true);
    expect(result.topTie.reason).toBe("label-tie");
    expect(result.topTie.tolerance).toBe(PROFILE_TIE_TOLERANCE);
    expect(result.topProfileIds).toEqual(["profile:a", "profile:b"]);
    expect(result.ranking.map((entry) => [entry.profileId, entry.rank, entry.tieGroup])).toEqual([
      ["profile:a", 1, 1],
      ["profile:b", 1, 1],
      ["profile:c", 3, 2],
    ]);
    expect(result.uncertainty).toMatchObject({ level: "high", reasons: ["label-tie"] });
  });

  it("is invariant to input ordering and deeply freezes the profile assessment", () => {
    const profiles = [
      profile("b", [requirement("c-beta", 0.2)]),
      profile("a", [requirement("c-alpha", 0.2)]),
    ];
    const bundle = syntheticBundle(["c-alpha", "c-beta"], profiles);
    const first = scorePrimaryProfiles(
      assessmentFor(bundle, [scoredConstruct("c-alpha", 0.2), scoredConstruct("c-beta", 0.1)]),
      bundle,
    );
    const second = scorePrimaryProfiles(
      assessmentFor(bundle, [scoredConstruct("c-beta", 0.1), scoredConstruct("c-alpha", 0.2)]),
      { ...bundle, profiles: [...profiles].reverse() },
    );
    expect(second).toEqual(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.profiles)).toBe(true);
    expect(Object.isFrozen(first.profiles[0])).toBe(true);
    expect(Object.isFrozen(first.profiles[0]?.comparisons)).toBe(true);
  });

  it("abstains invalid profile references instead of inventing a comparison dimension", () => {
    const bundle = syntheticBundle(
      ["c-alpha"],
      [profile("invalid", [requirement("c-missing", 0)])],
    );
    const result = scorePrimaryProfiles(
      assessmentFor(bundle, [scoredConstruct("c-alpha", 0)]),
      bundle,
    );
    expect(result.profiles[0]).toMatchObject({
      status: "abstained",
      abstentionReason: "invalid_profile_configuration",
    });
    expect(result.profiles[0]?.evidence.unavailableWeight).toBe(1);
    expect(result.ranking).toHaveLength(0);
  });

  it("fails closed when a construct result claims a non-finite score", () => {
    const bundle = syntheticBundle(
      ["c-alpha"],
      [profile("finite-only", [requirement("c-alpha", 0)])],
    );
    const invalid = { ...scoredConstruct("c-alpha", 0), score: Number.NaN };
    const result = scorePrimaryProfiles(assessmentFor(bundle, [invalid]), bundle);
    expect(result.profiles[0]).toMatchObject({
      status: "abstained",
      abstentionReason: "required_construct_unavailable",
    });
    expect(result.profiles[0]?.comparisons[0]).toMatchObject({
      included: false,
      observedScore: null,
    });
  });

  it("does not call a gate-only abstention partial evidence", () => {
    const bundle = syntheticBundle(
      ["c-alpha"],
      [profile("gate-only", [requirement("c-alpha", 0)], [
        {
          id: "gate:minimum",
          operator: "minimum",
          constructId: createConstructId("c-alpha"),
          minimum: 0.75,
        },
      ])],
    );
    const result = scorePrimaryProfiles(
      assessmentFor(bundle, [scoredConstruct("c-alpha", 0.5)]),
      bundle,
    );
    expect(result.profiles[0]?.abstentionReason).toBe("constitutive_gate_failed");
    expect(result.uncertainty.reasons).toEqual(["no_eligible_profiles"]);
  });

  it("rejects a construct assessment from a different result schema", () => {
    const bundle = syntheticBundle(
      ["c-alpha"],
      [profile("versioned", [requirement("c-alpha", 0)])],
    );
    const assessment = assessmentFor(bundle, [scoredConstruct("c-alpha", 0)]);
    expect(() =>
      scorePrimaryProfiles(
        { ...assessment, resultSchemaVersion: "result-v2.phase4.1" as typeof assessment.resultSchemaVersion },
        bundle,
      ),
    ).toThrow("Construct assessment resultSchemaVersion does not match canonical content");
  });
});

describe("Phase 5 full canonical primary-profile corpus", () => {
  it("accounts for every canonical profile while keeping demoted compatibility profiles out of ranking", () => {
    const constructs = realBundle.constructs.map((construct) => scoredConstruct(String(construct.id), 0, 2));
    const result = scorePrimaryProfiles(assessmentFor(realBundle, constructs), realBundle);
    const demoted = new Set([
      "profile:liberal-conservatism",
      "profile:market-liberal",
      "profile:national-conservatism",
      "profile:radical-democracy",
    ]);
    const demotedResults = result.profiles.filter((entry) => demoted.has(String(entry.profileId)));
    const commitmentResults = result.profiles.filter((entry) => !demoted.has(String(entry.profileId)));

    expect(result.profiles).toHaveLength(realBundle.profiles.length);
    expect(demotedResults).toHaveLength(demoted.size);
    expect(
      demotedResults.every(
        (entry) =>
          entry.status === "abstained" &&
          entry.abstentionReason === "invalid_profile_configuration" &&
          entry.comparisons.length === 0,
      ),
    ).toBe(true);
    expect(commitmentResults).toHaveLength(realBundle.profiles.length - demoted.size);
    expect(commitmentResults.every((entry) => entry.comparisons.length > 0)).toBe(true);
    expect(result.ranking.every((entry) => !demoted.has(String(entry.profileId)))).toBe(true);
  });

  it("does not rank profiles when required canonical evidence is absent", () => {
    const firstConstruct = realBundle.constructs[0];
    const result = scorePrimaryProfiles(
      assessmentFor(realBundle, [abstainedConstruct(String(firstConstruct.id))]),
      realBundle,
    );
    expect(result.ranking).toHaveLength(0);
    expect(result.profiles.every((profileResult) => profileResult.status === "abstained")).toBe(true);
  });
});
