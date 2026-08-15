// Decision IDs: D-00, D-06, D-10, D-11, D-12, D-14, D-29.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CONSTRUCT_FAMILY_MAP_VERSION,
  CURRENT_RESEARCH_VERSION_BUNDLE,
  RESEARCH_ESTIMATOR_VERSION,
  assertCurrentVersionBundle,
  assertResearchBoundary,
  isLayer,
  isTheoryContext,
  layerContextErrors,
  researchBoundaryErrors,
  roleBoundaryErrors,
  versionBundleErrors,
} from "./researchContracts";

describe("research contract versions", () => {
  it("exposes a complete frozen version bundle", () => {
    expect(CURRENT_RESEARCH_VERSION_BUNDLE.constructFamilyMapVersion).toBe(
      CONSTRUCT_FAMILY_MAP_VERSION,
    );
    expect(CURRENT_RESEARCH_VERSION_BUNDLE.researchEstimatorVersion).toBe(
      RESEARCH_ESTIMATOR_VERSION,
    );
    expect(versionBundleErrors(CURRENT_RESEARCH_VERSION_BUNDLE)).toEqual([]);
    expect(() =>
      assertCurrentVersionBundle(CURRENT_RESEARCH_VERSION_BUNDLE),
    ).not.toThrow();
  });

  it("keeps the checked-in quality gate tied to the governing versions", () => {
    const qualityGate = JSON.parse(
      readFileSync("quality-gate.json", "utf8"),
    ) as {
      artifact?: { baselineCommit?: string };
      currentContract?: Record<string, string>;
    };
    expect(qualityGate.artifact?.baselineCommit).toMatch(/^[0-9a-f]{40}$/);
    expect(qualityGate.currentContract).toMatchObject({
      architectureVersion: CURRENT_RESEARCH_VERSION_BUNDLE.architectureVersion,
      decisionLogVersion: CURRENT_RESEARCH_VERSION_BUNDLE.decisionLogVersion,
      implementationSpecVersion:
        CURRENT_RESEARCH_VERSION_BUNDLE.implementationSpecVersion,
      taxonomyVersion: CURRENT_RESEARCH_VERSION_BUNDLE.taxonomyVersion,
      scoringVersion: CURRENT_RESEARCH_VERSION_BUNDLE.scoringVersion,
      researchEstimator: RESEARCH_ESTIMATOR_VERSION,
    });
  });

  it("rejects a missing or mixed-version research record", () => {
    expect(
      versionBundleErrors({
        ...CURRENT_RESEARCH_VERSION_BUNDLE,
        scoringVersion: "future-unapproved-score",
      }),
    ).toContain("scoringVersion does not match the frozen research contract");
    expect(versionBundleErrors({ bankVersion: "only-one-version" })).toEqual(
      expect.arrayContaining([
        "architectureVersion is required",
        "schemaVersion is required",
      ]),
    );
  });
});

describe("layer and theory-context boundaries", () => {
  it("keeps layer values distinct from theory-context values", () => {
    expect(isLayer("normative")).toBe(true);
    expect(isLayer("ideal")).toBe(false);
    expect(isTheoryContext("ideal")).toBe(true);
    expect(isTheoryContext("descriptive")).toBe(false);
    expect(layerContextErrors("normative", "mixed")).toEqual([]);
    expect(layerContextErrors("ideal", "mixed")).toHaveLength(1);
  });
});

describe("role and research-only boundaries", () => {
  it("requires evidence before ordinary primary or modifier exposure", () => {
    expect(
      roleBoundaryErrors({
        role: "primary",
        ordinaryScoringEndpoint: true,
        coreEvidenceStatus: "insufficient-evidence",
      }),
    ).toContain("primary scoring requires passed core evidence");
    expect(
      roleBoundaryErrors({
        role: "modifier",
        ordinaryScoringEndpoint: true,
        directConstructEvidence: false,
      }),
    ).toContain("ordinary modifier scoring requires direct construct evidence");
    expect(
      roleBoundaryErrors({
        role: "specialist",
        ordinaryScoringEndpoint: true,
      }),
    ).toContain("specialist labels cannot be ordinary scoring endpoints");
  });

  it("accepts research criteria with similarity language", () => {
    const declaration = {
      recordType: "criterion" as const,
      researchOnly: true,
      productionScoringInput: false,
      participantFacing: false,
      claimLanguage: "research-estimate" as const,
      selfIdentificationRole: "criterion" as const,
      layer: "descriptive" as const,
      theoryContext: "nonideal" as const,
    };
    expect(researchBoundaryErrors(declaration)).toEqual([]);
    expect(() => assertResearchBoundary(declaration)).not.toThrow();
  });

  it("blocks self-label contamination and held production claims", () => {
    const contaminated = {
      recordType: "criterion" as const,
      researchOnly: true,
      productionScoringInput: true,
      participantFacing: true,
      claimLanguage: "posterior" as const,
      selfIdentificationRole: "scoring" as const,
    };
    expect(researchBoundaryErrors(contaminated)).toEqual(
      expect.arrayContaining([
        "research records cannot be production scoring inputs",
        "self-identification is a criterion, not a scoring input",
        "probability, posterior, population, and representative claims require a later release decision",
      ]),
    );
    expect(() => assertResearchBoundary(contaminated)).toThrow(
      /Research boundary violation/,
    );
  });
});
