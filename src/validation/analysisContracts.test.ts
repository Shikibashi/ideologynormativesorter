import { describe, expect, it } from "vitest";
import {
  assertResearchDIFPlan,
  assertResearchFormEquivalence,
  assertResearchModelResult,
  researchAnalysisMetadataErrors,
  researchDIFPlanErrors,
  researchFormEquivalenceErrors,
  researchModelSpecificationErrors,
  researchPrecisionOutputErrors,
} from "./analysisContracts";
import {
  DEPLOYMENT_SCOPE_VERSION,
  DIF_PLAN_VERSION,
  FORM_EQUIVALENCE_VERSION,
  MODEL_COMPARISON_VERSION,
} from "../research/versions";
import type {
  ResearchAnalysisMetadata,
  ResearchDIFPlan,
  ResearchFormEquivalenceReport,
  ResearchModelResult,
  ResearchModelSpecification,
  ResearchPrecisionOutput,
} from "../types";

const metadata: ResearchAnalysisMetadata = {
  recordType: "analysis",
  analysisId: "fixture-analysis",
  analysisVersion: "fixture-v1",
  studyId: "study-1",
  codeRevision: "abcdef0123456789",
  inclusionManifestId: "manifest-1",
  sample: {
    includedN: 10,
    excludedN: 2,
    denominatorDescription: "included consented test administrations",
  },
  estimand: "layer-specific axis estimate",
  seed: 42,
  versionBundle: { studyId: "study-1", schemaVersion: "schema-v1" },
  itemFingerprint: "rf_items",
  modelId: "production-baseline",
};

const model: ResearchModelSpecification = {
  id: "production-baseline",
  version: MODEL_COMPARISON_VERSION,
  family: "production-baseline",
  estimand: "exact production score",
  identification: "frozen production weighting and normalization",
  itemEligibility: "active reviewed primary-axis items",
  priorsOrEstimator: "deterministic production scorer",
  seed: 42,
  developmentFraction: 0.5,
  confirmationFraction: 0.5,
  fitCriteria: ["fixture-stability"],
  productionBaselineComparison: true,
};

describe("research analysis contracts", () => {
  it("requires provenance sufficient to reproduce an analysis output", () => {
    expect(researchAnalysisMetadataErrors(metadata)).toEqual([]);
    expect(
      researchAnalysisMetadataErrors({ ...metadata, inclusionManifestId: "" }),
    ).toContain("inclusionManifestId is required");
  });

  it("keeps precision bounded and distinguishes insufficient data", () => {
    const output: ResearchPrecisionOutput = {
      status: "insufficient-data",
      estimand: "axis coverage",
      observedN: 1,
      denominatorN: 10,
      coverage: 0.1,
      reason: "minimum respondent threshold not met",
    };
    expect(researchPrecisionOutputErrors(output)).toEqual([]);
    expect(
      researchPrecisionOutputErrors({ ...output, coverage: 1.5 }),
    ).toContain("coverage must be between 0 and 1");
  });

  it("requires every candidate model to compare against the production baseline", () => {
    expect(researchModelSpecificationErrors(model)).toEqual([]);
    expect(
      researchModelSpecificationErrors({
        ...model,
        productionBaselineComparison: false,
      }),
    ).toContain("model comparisons must name the exact production baseline");
  });

  it("rejects nonconverged model statistics and accepts a converged fixture", () => {
    const result: ResearchModelResult = {
      metadata,
      model,
      status: "converged",
      fit: { cfi: 0.95 },
      reason: "fixture converged",
    };
    expect(() => assertResearchModelResult(result)).not.toThrow();
    expect(() =>
      assertResearchModelResult({ ...result, status: "nonconverged" }),
    ).toThrow(/nonconverged/);
  });

  it("enforces preregistered DIF thresholds and no inferred groups", () => {
    const plan: ResearchDIFPlan = {
      version: DIF_PLAN_VERSION,
      deploymentScopeVersion: DEPLOYMENT_SCOPE_VERSION,
      targetGroups: ["language-version", "country-version"],
      minimumUsableN: 100,
      preferredN: 200,
      effectSizeRule: "review absolute effect size >= 0.2",
      multipleTestingMethod: "Benjamini-Hochberg",
      invarianceMethod: "graded-response",
      inferredGroupsAllowed: false,
    };
    expect(researchDIFPlanErrors(plan)).toEqual([]);
    expect(() => assertResearchDIFPlan(plan)).not.toThrow();
    expect(
      researchDIFPlanErrors({ ...plan, inferredGroupsAllowed: true as false }),
    ).toContain("DIF groups cannot be inferred");
  });

  it("requires held-out respondents for estimated short/full equivalence", () => {
    const report: ResearchFormEquivalenceReport = {
      version: FORM_EQUIVALENCE_VERSION,
      studyId: "study-1",
      shortFormFingerprint: "rf_short",
      fullFormFingerprint: "rf_full",
      estimand: "held-out axis agreement",
      heldOutN: 25,
      axisAgreement: 0.9,
      neighborhoodStability: 0.8,
      status: "estimated",
      reason: "fixture",
    };
    expect(researchFormEquivalenceErrors(report)).toEqual([]);
    expect(() => assertResearchFormEquivalence(report)).not.toThrow();
    expect(researchFormEquivalenceErrors({ ...report, heldOutN: 0 })).toContain(
      "estimated form equivalence requires held-out respondents",
    );
  });
});
