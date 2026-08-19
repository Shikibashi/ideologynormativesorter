import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import type { PrimaryProfileAssessment } from "../../v2/packages/contracts/src/profiles";
import { detectDivergencesAndContradictions } from "../../src/scoring/divergence";
import {
  analyzeConstructDivergences,
  buildAssessmentDiagnostics,
  buildConstructDiagnostics,
  buildContributionTrace,
  prepareAssessmentResponses,
  prepareSpecialistAssessment,
  scoreModifiers,
  scorePrimaryProfiles,
  scoreSpecialists,
  scoreConstructLayer,
} from "../../v2/packages/engine/src";

const bundle = {
  metadata: {
    contentSchemaVersion: "diagnostic-test-schema",
    contentVersion: "diagnostic-test-content",
    contentFingerprint: "diagnostic-test-fingerprint",
    scoringVersion: "diagnostic-test-scoring",
    responseSchemaVersion: "diagnostic-test-response",
    resultSchemaVersion: "diagnostic-test-result",
    researchSchemaVersion: "diagnostic-test-research",
  },
  domains: [{ id: "domain-a", label: "Domain A", poles: { negative: "low", positive: "high" } }],
  constructs: [
    { id: "norm", role: "normative", scope: "root", domainId: "domain-a", name: "Norm" },
    { id: "desc", role: "descriptive", scope: "root", domainId: "domain-a", name: "Desc" },
    { id: "pres", role: "prescriptive", scope: "root", domainId: "domain-a", name: "Pres" },
  ],
  items: [
    { id: "i-positive", domainId: "domain-a", prompt: "positive", responseType: "likert5", scaleMin: -2, scaleMax: 2, scaleStep: 1, role: "core", layer: "normative", tier: "quick", status: "active", reverseScored: false, scoring: { mappingMode: "item", contributions: [{ constructId: "norm", weight: 1, polarity: 1 }] } },
    { id: "i-negative", domainId: "domain-a", prompt: "negative", responseType: "likert5", scaleMin: -2, scaleMax: 2, scaleStep: 1, role: "core", layer: "normative", tier: "quick", status: "active", reverseScored: false, scoring: { mappingMode: "item", contributions: [{ constructId: "norm", weight: 1, polarity: 1 }] } },
    { id: "i-desc", domainId: "domain-a", prompt: "desc", responseType: "likert5", scaleMin: -2, scaleMax: 2, scaleStep: 1, role: "core", layer: "descriptive", tier: "quick", status: "active", reverseScored: false, scoring: { mappingMode: "item", contributions: [{ constructId: "desc", weight: 1, polarity: 1 }] } },
    { id: "i-pres", domainId: "domain-a", prompt: "pres", responseType: "likert5", scaleMin: -2, scaleMax: 2, scaleStep: 1, role: "core", layer: "prescriptive", tier: "quick", status: "active", reverseScored: false, scoring: { mappingMode: "item", contributions: [{ constructId: "pres", weight: 1, polarity: 1 }] } },
  ],
  profiles: [], modifiers: [], specialists: [], specialistModules: [], specialistCandidates: [], specialistAssignment: { strategy: "none", rosterVersion: "test", orderedModuleIds: [] }, ontologyNodes: [], ontologyRelations: [], diagnosticRelations: [{ id: "norm-pres", type: "cross_dimension_pair", constructIds: ["norm", "pres"], dimensionPair: "normative-prescriptive", secondDirection: 1 }], provenanceSources: [],
} as unknown as CanonicalContentBundle;

function assessment() {
  const prepared = prepareAssessmentResponses([
    { state: "answered", itemId: "i-positive", responseType: "likert5", value: 2 },
    { state: "answered", itemId: "i-negative", responseType: "likert5", value: -2 },
    { state: "answered", itemId: "i-desc", responseType: "likert5", value: 0, confidence: 5 },
    { state: "missing", itemId: "i-pres" },
  ], bundle);
  return scoreConstructLayer(prepared, bundle);
}

describe("Phase 8 downstream diagnostics", () => {
  it("traces exact contribution arithmetic and separates positive and negative evidence", () => {
    const constructs = assessment();
    const traces = buildContributionTrace(constructs, bundle);
    const [norm] = buildConstructDiagnostics(constructs, bundle, traces).filter((entry) => entry.constructId === "norm");
    expect(norm.strongestPositiveContributionIds).toHaveLength(1);
    expect(norm.strongestNegativeContributionIds).toHaveLength(1);
    expect(norm.arithmetic.numeratorReconciles).toBe(true);
    expect(norm.arithmetic.denominatorReconciles).toBe(true);
    expect(traces.find((entry) => !entry.included)?.exclusionReason).toBe("missing_response");
  });

  it("uses explicit relations and reports unavailable divergence without midpoint substitution", () => {
    const constructs = assessment();
    const [divergence] = analyzeConstructDivergences(constructs, bundle);
    expect(divergence.status).toBe("unavailable");
    expect(divergence.magnitude).toBeUndefined();
    const complete = scoreConstructLayer(prepareAssessmentResponses([
      { state: "answered", itemId: "i-positive", responseType: "likert5", value: 2 },
      { state: "answered", itemId: "i-negative", responseType: "likert5", value: -2 },
      { state: "answered", itemId: "i-desc", responseType: "likert5", value: 0, confidence: 5 },
      { state: "answered", itemId: "i-pres", responseType: "likert5", value: -2, priority: 5 },
    ], bundle), bundle);
    expect(analyzeConstructDivergences(complete, bundle)[0].magnitude).toBe(1);
  });

  it("is deterministic and leaves authoritative scoring objects unchanged", () => {
    const constructs = assessment();
    const snapshot = structuredClone(constructs);
    const first = buildAssessmentDiagnostics({ bundle, constructs });
    const second = buildAssessmentDiagnostics({ bundle, constructs: { ...constructs, contributions: [...constructs.contributions].reverse(), constructs: [...constructs.constructs].reverse() } });
    expect(first).toEqual(second);
    expect(constructs).toEqual(snapshot);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.contributions)).toBe(true);
  });

  it("uses structured profile comparisons without inventing a second distance", () => {
    const constructs = assessment();
    const profiles = {
      responseSchemaVersion: bundle.metadata.responseSchemaVersion,
      scoringVersion: bundle.metadata.scoringVersion,
      contentVersion: bundle.metadata.contentVersion,
      contentFingerprint: bundle.metadata.contentFingerprint,
      resultSchemaVersion: bundle.metadata.resultSchemaVersion,
      constructs: constructs.constructs,
      profiles: [{ profileId: "profile-a", name: "A", status: "scored", distance: 0.2, similarity: 0.9, rank: 1, tieGroup: null, comparisons: [
        { constructId: "norm", targetValue: 1, observedScore: 1, weight: 2, squaredError: 0, weightedSquaredError: 0, included: true },
        { constructId: "desc", targetValue: 1, observedScore: 0, weight: 1, squaredError: 1, weightedSquaredError: 1, included: true },
      ], evidence: { requiredConstructCount: 2, measuredRequiredConstructCount: 2, unavailableRequiredConstructCount: 0, totalWeight: 3, measuredWeight: 3, unavailableWeight: 0, comparisonCoverage: 1, minimumEvidenceRatio: 0.5, meetsMinimumEvidence: true, unavailableConstructIds: [] }, gates: [], support: { evidenceStatus: "sufficient", evidenceRatio: 1, minimumEvidenceRatio: 0.5, uncertaintyLevel: "low", uncertaintyReasons: [] } }], ranking: [], topProfileIds: ["profile-a"], topTie: { isTie: false, profileIds: ["profile-a"], similarityDelta: null, tolerance: 0.05 }, uncertainty: { level: "low", reasons: [] },
    } satisfies PrimaryProfileAssessment;
    const diagnostics = buildAssessmentDiagnostics({ bundle, constructs, profiles });
    expect(diagnostics.profiles[0].closestConstructIds).toEqual(["norm", "desc"]);
    expect(diagnostics.profiles[0].largestDepartureConstructIds).toEqual(["desc", "norm"]);
    expect(diagnostics.profiles[0].similarity).toBe(0.9);
  });

  it("preserves the audited v1 liberty polarity inversion as a neutral v2 divergence", () => {
    const legacy = detectDivergencesAndContradictions({
      normative: [{ axisId: "liberty-noninterference", normalized: 0.8 }],
      descriptive: [],
      prescriptive: [{ axisId: "regulation-vs-deregulation", normalized: 0.8 }],
    } as never, []);
    expect(legacy[0].affectedAxes).toEqual(["liberty-noninterference", "regulation-vs-deregulation"]);
    const assessment = {
      responseSchemaVersion: "response-v1",
      scoringVersion: "scoring-v1",
      contentVersion: "content-v1",
      contentFingerprint: "fingerprint-v1",
      resultSchemaVersion: "result-v1",
      responseSummary: { answeredCount: 0, missingCount: 0, skippedCount: 0, abstainedCount: 0, refusedCount: 0 },
      contributions: [],
      evidence: { overall: {}, byConstruct: [] },
      constructs: [
        { constructId: "liberty-noninterference", status: "scored", score: 0.8, numerator: 0.8, denominator: 1, evidence: {}, support: {} },
        { constructId: "regulation-vs-deregulation", status: "scored", score: 0.8, numerator: 0.8, denominator: 1, evidence: {}, support: {} },
      ],
    } as never;
    const v2 = analyzeConstructDivergences(assessment, {} as CanonicalContentBundle, [{ id: "audited-liberty-regulation", type: "cross_dimension_pair", constructIds: ["liberty-noninterference", "regulation-vs-deregulation"], dimensionPair: "normative-prescriptive", secondDirection: -1 }]);
    expect(v2[0]).toMatchObject({ status: "scored", magnitude: 1.6, interpretationCode: "neutral_separation" });
  });
});

describe("Phase 8 real canonical structural diagnostics", () => {
  it("traces the full canonical core, profiles, modifiers, and specialist roster", () => {
    const realBundle = JSON.parse(readFileSync(resolve(process.cwd(), "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;
    const activeItems = realBundle.items.filter((item) => item.status === "active");
    const responses = activeItems.map((item, index) => {
      if (item.responseType === "statement-choice") return { state: "answered", itemId: item.id, responseType: item.responseType, optionId: item.options[0].id };
      const value = item.responseType === "likert5" ? index % 5 - 2 : index % 7 - 3;
      return { state: "answered", itemId: item.id, responseType: item.responseType, value, ...(item.layer === "descriptive" ? { confidence: (index % 3 + 1) * 2 - 1 } : {}), ...(item.layer === "prescriptive" ? { priority: (index % 3 + 1) * 2 - 1 } : {}) };
    });
    const constructs = scoreConstructLayer(prepareAssessmentResponses(responses, realBundle), realBundle);
    const profiles = scorePrimaryProfiles(constructs, realBundle);
    const modifiers = scoreModifiers(constructs, realBundle);
    const requestedModuleId = realBundle.specialistModules[0].id;
    const specialistResponses = responses.filter((response) => {
      const item = realBundle.items.find((entry) => entry.id === response.itemId);
      return item?.role === "specialist" && item.moduleId === requestedModuleId;
    });
    const specialistPrepared = prepareSpecialistAssessment({ requestedModuleIds: [requestedModuleId], responses: specialistResponses }, realBundle);
    const specialists = scoreSpecialists(constructs, specialistPrepared, realBundle);
    const diagnostics = buildAssessmentDiagnostics({ bundle: realBundle, constructs, profiles, modifiers, specialists });
    expect(diagnostics.constructs).toHaveLength(realBundle.constructs.length);
    expect(diagnostics.profiles).toHaveLength(realBundle.profiles.length);
    expect(diagnostics.modifiers).toHaveLength(realBundle.modifiers.length);
    expect(diagnostics.specialists).toHaveLength(realBundle.specialistModules.length);
    expect(diagnostics.specialists.find((entry) => entry.moduleId === requestedModuleId)?.activation.status).toBe("activated");
    expect(diagnostics.specialists.find((entry) => entry.moduleId === requestedModuleId)?.activation.requestedModule).toBe(true);
    expect(diagnostics.contributions.every((entry) => Number.isFinite(entry.weightedContribution))).toBe(true);
    expect(diagnostics.constructs.every((entry) => entry.arithmetic.numeratorReconciles && entry.arithmetic.denominatorReconciles)).toBe(true);
    expect(diagnostics.divergences).toHaveLength(realBundle.diagnosticRelations?.length ?? 0);
  });
});
