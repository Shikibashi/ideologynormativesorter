import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle, PrimaryProfileRecord } from "../../v2/packages/contracts/src/content";
import type { ConstructAssessment, ConstructResult } from "../../v2/packages/contracts/src/constructs";
import { createConstructId } from "../../v2/packages/contracts/src/ids";
import { scorePrimaryProfiles } from "../../v2/packages/engine/src";

const bundle = JSON.parse(readFileSync(resolve(process.cwd(), "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;

function scoredConstruct(constructId: string, score: number): ConstructResult {
  return {
    constructId: createConstructId(constructId), status: "scored", score, numerator: score, denominator: 1,
    evidence: { constructId: createConstructId(constructId), expectedItemCount: 2, answeredItemCount: 2, missingItemCount: 0, skippedItemCount: 0, abstainedItemCount: 0, refusedItemCount: 0, supportingItemCount: 2, totalEligibleWeight: 2, answeredEligibleWeight: 2, missingWeight: 0, skippedWeight: 0, abstainedWeight: 0, refusedWeight: 0, scoredMappedWeight: 2, scoredEffectiveWeight: 2, weightedSum: score * 2, structuralCoverage: 1, answeredWeightCoverage: 1, scoredWeightCoverage: 1, effectiveWeightCoverage: 1, salienceCoverage: 1, salienceSkippedWeight: 0, salienceSkippedItemCount: 0, contributionIds: [], itemStateById: {} },
    support: { evidenceStatus: "sufficient", minimumEvidenceRatio: 0.5, evidenceRatio: 1, nearThreshold: false, uncertaintyLevel: "low", uncertaintyReasons: [] }, contributionIds: [],
  };
}
function assessment(scores: Readonly<Record<string, number>>): ConstructAssessment {
  const constructs = bundle.constructs.filter((construct) => construct.scope === "root").map((construct) => scoredConstruct(String(construct.id), scores[String(construct.id)] ?? 0));
  return { responseSchemaVersion: bundle.metadata.responseSchemaVersion, scoringVersion: bundle.metadata.scoringVersion, contentVersion: bundle.metadata.contentVersion, contentFingerprint: bundle.metadata.contentFingerprint, resultSchemaVersion: bundle.metadata.resultSchemaVersion, responseSummary: { answeredCount: constructs.length, missingCount: 0, skippedCount: 0, abstainedCount: 0, refusedCount: 0 }, contributions: [], constructs, evidence: { overall: {} as ConstructAssessment["evidence"]["overall"], byConstruct: constructs.map((construct) => construct.evidence) } };
}
function injectLegacyCentroids(profiles: readonly PrimaryProfileRecord[]): PrimaryProfileRecord[] {
  return profiles.map((profile) => ({ ...profile, requirements: [{ constructId: createConstructId("liberty-noninterference"), targetValue: -1, weight: 999, minimumAnsweredItems: 999 }] }));
}

describe("declarative commitment-based production primary scoring", () => {
  it("contains only the 12 commitment-backed primary outcomes and no active target vectors", () => {
    expect(bundle.profiles).toHaveLength(12);
    expect(bundle.profiles.every((profile) => (profile.commitments?.length ?? 0) > 0)).toBe(true);
    expect(bundle.profiles.every((profile) => (profile.requirements?.length ?? 0) === 0)).toBe(true);
    expect(JSON.stringify(bundle.profiles)).not.toContain('"targetValue"');
  });

  it("ignores hostile legacy target requirements injected at runtime", () => {
    const baseline = scorePrimaryProfiles(assessment({}), bundle);
    const mutated = scorePrimaryProfiles(assessment({}), { ...bundle, profiles: injectLegacyCentroids(bundle.profiles) });
    expect(mutated).toEqual(baseline);
  });

  it("scores right-libertarian affinity from v3 commitments", () => {
    const result = scorePrimaryProfiles(assessment({
      "liberty-noninterference": 0.8, "productive-property": 0.8, "personal-property": 0.8, "political-authority-legitimacy": 0,
      "market-knowledge-coordination": 0.7, "market-deregulation": 0.6, "legal-equality": 0.6, "income-redistribution": -0.7, "central-planning": -0.8,
    }), bundle);
    const match = result.profiles.find((entry) => String(entry.profileId) === "profile:market-right-libertarianism");
    expect(match?.status).toBe("scored");
    expect(match?.similarity).toBe(1);
    expect(match?.distance).toBe(0);
    expect(match?.gates.some((gate) => gate.gateId === "commitment:rl-liberty")).toBe(true);
  });
});
