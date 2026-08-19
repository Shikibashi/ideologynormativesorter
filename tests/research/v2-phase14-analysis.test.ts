import { describe, expect, it } from "vitest";
import {
  assertNoUnsupportedClaims,
  buildAnalysisItemDefinitions,
  createClaimRegistry,
  cronbachAlpha,
  prepareAnalysisDataset,
  summarizeDataQuality,
  validateSubmissionEnvelope,
  type AnalysisVersionBinding,
} from "../../v2/packages/research/src/analysis";

const binding: AnalysisVersionBinding = {
  researchSchemaVersion: "research-v2.phase13.1",
  researchProtocolVersion: "research-protocol-v2.phase13.1",
  consentVersion: "consent-v2.phase13.1",
  contentSchemaVersion: "content-schema-v2.phase8.1",
  contentVersion: "v2-content-phase8.1",
  contentFingerprint: "bb1dfddf12db1224215440d48f14cf876b9228a850d585e70d49d18b455aaa72",
  scoringVersion: "scoring-v2.phase7.1",
  responseSchemaVersion: "response-v2.phase1.1",
  resultSchemaVersion: "result-v2.phase9.1",
};

const definitions = buildAnalysisItemDefinitions({ items: [
  { id: "core-likert", role: "core", responseType: "likert5", scaleMin: 1, scaleMax: 5 },
  { id: "core-choice", role: "core", responseType: "statement-choice", options: [{ id: "a" }, { id: "b" }] },
  { id: "specialist-likert", role: "specialist", responseType: "likert7", scaleMin: 1, scaleMax: 7, moduleId: "module-a" },
] });

function envelope(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    researchSchemaVersion: binding.researchSchemaVersion,
    researchProtocolVersion: binding.researchProtocolVersion,
    consentVersion: binding.consentVersion,
    submissionId: "rs_test_0001",
    contentSchemaVersion: binding.contentSchemaVersion,
    contentVersion: binding.contentVersion,
    contentFingerprint: binding.contentFingerprint,
    scoringVersion: binding.scoringVersion,
    responseSchemaVersion: binding.responseSchemaVersion,
    resultSchemaVersion: binding.resultSchemaVersion,
    consent: { granted: true, consentVersion: binding.consentVersion, consentedAt: "2026-01-01T00:00:00.000Z", purpose: "instrument-research", identityLinkage: "none" },
    responses: {
      core: [
        { state: "answered", itemId: "core-likert", responseType: "likert5", value: 3 },
        { state: "answered", itemId: "core-choice", responseType: "statement-choice", optionId: "a" },
      ],
      specialist: [],
      requestedSpecialistModuleIds: [],
    },
    ...overrides,
  };
}

describe("Phase 14 research analysis contract", () => {
  it("rejects version drift, duplicate items, and implicit statement-choice mappings", () => {
    const invalid = envelope({
      responseSchemaVersion: "response-v1",
      responses: {
        core: [
          { state: "answered", itemId: "core-choice", responseType: "statement-choice" },
          { state: "missing", itemId: "core-choice" },
        ],
        specialist: [],
        requestedSpecialistModuleIds: [],
      },
    });
    const issues = validateSubmissionEnvelope(invalid, binding, definitions);
    expect(issues.some((entry) => entry.code === "VERSION_MISMATCH")).toBe(true);
    expect(issues.some((entry) => entry.code === "DUPLICATE_ITEM_RESPONSE")).toBe(true);
    expect(issues.some((entry) => entry.code === "INVALID_STATEMENT_CHOICE")).toBe(true);
  });

  it("projects unrequested specialist items as structural non-applicability without exposing IDs", () => {
    const dataset = prepareAnalysisDataset([envelope()], binding, definitions);
    expect(dataset.issues).toHaveLength(0);
    const specialist = dataset.rows.find((row) => row.itemId === "specialist-likert");
    expect(specialist?.analysisState).toBe("structural_not_applicable");
    expect(dataset.rows.every((row) => !("submissionId" in row))).toBe(true);
    expect(summarizeDataQuality(dataset).structuralNotApplicableRows).toBe(1);
  });

  it("deduplicates identical immutable submissions and rejects divergent duplicates", () => {
    const same = envelope();
    const divergent = structuredClone(same) as { responses: { core: Array<{ value: number }> } };
    divergent.responses.core[0].value = 4;
    const dataset = prepareAnalysisDataset([same, same, divergent], binding, definitions);
    expect(dataset.duplicateSubmissionCount).toBe(1);
    expect(dataset.conflictingSubmissionCount).toBe(1);
    expect(dataset.envelopes).toHaveLength(1);
  });

  it("computes reliability only from complete finite numeric rows", () => {
    expect(cronbachAlpha([[1, 2], [2, 3], [3, 4]])).toBeCloseTo(1);
    expect(cronbachAlpha([[1, null], [2, 2]])).toBeNull();
  });

  it("keeps synthetic and unevaluated claims permanently ineligible", () => {
    const claims = createClaimRegistry(["reliability", "validity"], "synthetic-fixture");
    expect(claims.every((claim) => claim.status === "NOT_EVALUABLE" && claim.eligibleForProductionClaim === false)).toBe(true);
    expect(() => assertNoUnsupportedClaims(claims)).not.toThrow();
  });
});
