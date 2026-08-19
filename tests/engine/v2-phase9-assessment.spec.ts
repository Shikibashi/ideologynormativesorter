import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import type { AssessmentInput } from "../../v2/packages/contracts/src/results";
import {
  buildAssessmentDiagnostics,
  prepareAssessmentResponses,
  prepareSpecialistAssessment,
  scoreAssessment,
  scoreConstructLayer,
  scoreModifiers,
  scorePrimaryProfiles,
  scoreSpecialists,
  serializeAssessmentResult,
  validateAssessmentResult,
} from "../../v2/packages/engine/src";

const bundle = JSON.parse(readFileSync(resolve(process.cwd(), "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;

function coreResponses(value = 0): unknown[] {
  return bundle.items.filter((item) => item.role === "core" && item.status === "active").map((item, index) => {
    if (item.responseType === "statement-choice") return { state: "answered", itemId: item.id, responseType: item.responseType, optionId: item.options[0].id };
    const maximum = item.responseType === "likert5" ? 2 : 3;
    return {
      state: "answered",
      itemId: item.id,
      responseType: item.responseType,
      value: Math.max(-maximum, Math.min(maximum, value === 0 ? index % (maximum * 2 + 1) - maximum : value)),
      ...(item.layer === "descriptive" ? { confidence: 5 } : {}),
      ...(item.layer === "prescriptive" ? { priority: 5 } : {}),
    };
  });
}

function input(overrides: Partial<AssessmentInput> = {}): AssessmentInput {
  return {
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    coreResponses: coreResponses(),
    specialistResponses: [],
    requestedSpecialistModuleIds: [],
    ...overrides,
  } as AssessmentInput;
}

describe("Phase 9 unified assessment result", () => {
  it("assembles one version-bound result from the full canonical core", () => {
    const result = scoreAssessment(input(), bundle);
    expect(result.resultSchemaVersion).toBe("result-v2.phase9.1");
    expect(result.contentFingerprint).toBe(bundle.metadata.contentFingerprint);
    expect(result.constructs).toHaveLength(bundle.constructs.filter((construct) => construct.scope === "root").length);
    expect(result.primary.profiles).toHaveLength(bundle.profiles.length);
    expect(result.modifiers).toHaveLength(bundle.modifiers.length);
    expect(result.specialists.modules).toHaveLength(bundle.specialistModules.length);
    expect(result.assessment.status).toBe("complete");
    expect((result.primary as Record<string, unknown>).constructs).toBeUndefined();
    expect(result.diagnostics.contributions.length).toBeGreaterThan(0);
    expect(validateAssessmentResult(result, bundle)).toBe(result);
  });

  it("distinguishes valid insufficient evidence from invalid input", () => {
    const missing = scoreAssessment(input({ coreResponses: [] }), bundle);
    expect(missing.assessment.status).toBe("insufficient_core_evidence");
    expect(missing.constructs.every((construct) => construct.status === "abstained")).toBe(true);
    expect(() => scoreAssessment(input({ coreResponses: [{ state: "answered", itemId: "unknown", responseType: "likert5", value: 0 }] }), bundle)).toThrowError(expect.objectContaining({ code: "UNKNOWN_ITEM", category: "INPUT_ERROR" }));
  });

  it("fails closed on version and fingerprint mismatches", () => {
    expect(() => scoreAssessment(input({ responseSchemaVersion: "response-v0" as never }), bundle)).toThrowError(expect.objectContaining({ code: "RESPONSE_SCHEMA_VERSION_MISMATCH", category: "VERSION_ERROR" }));
    expect(() => scoreAssessment(input({ contentFingerprint: "wrong" as never }), bundle)).toThrowError(expect.objectContaining({ code: "CONTENT_FINGERPRINT_MISMATCH" }));
  });

  it("routes an explicitly requested specialist module without nesting a second contribution table", () => {
    const moduleId = String(bundle.specialistModules[0].id);
    const specialistResponses = bundle.items.filter((item) => item.role === "specialist" && String(item.moduleId) === moduleId && item.status === "active").map((item, index) => item.responseType === "statement-choice"
      ? { state: "answered", itemId: item.id, responseType: item.responseType, optionId: item.options[0].id }
      : { state: "answered", itemId: item.id, responseType: item.responseType, value: index % 7 - 3 });
    const result = scoreAssessment(input({ requestedSpecialistModuleIds: [moduleId], specialistResponses }), bundle);
    const module = result.specialists.modules.find((entry) => entry.moduleId === moduleId)!;
    expect(module.activationStatus).toBe("activated");
    expect(module.constructs.length).toBeGreaterThan(0);
    expect((module as Record<string, unknown>).constructAssessment).toBeUndefined();
    expect(module.contributionIds.every((id) => result.diagnostics.contributions.some((trace) => trace.contributionId === id))).toBe(true);
    expect(result.diagnostics.specialists.find((entry) => entry.moduleId === moduleId)?.activation.requestedModule).toBe(true);
  });

  it("rejects core responses in the specialist set and unrequested specialist items", () => {
    const coreItem = bundle.items.find((item) => item.role === "core")!;
    expect(() => scoreAssessment(input({ specialistResponses: [{ state: "missing", itemId: coreItem.id }] }), bundle)).toThrowError(expect.objectContaining({ code: "INVALID_ASSESSMENT_INPUT" }));
    const specialistItem = bundle.items.find((item) => item.role === "specialist")!;
    expect(() => scoreAssessment(input({ specialistResponses: [{ state: "missing", itemId: specialistItem.id }] }), bundle)).toThrowError(expect.objectContaining({ code: "INVALID_ASSESSMENT_INPUT" }));
  });

  it("is input-order invariant, immutable, serializable, and equivalent to layer composition", () => {
    const assessmentInput = input();
    const snapshot = structuredClone(assessmentInput);
    const result = scoreAssessment(assessmentInput, bundle);
    const reordered = scoreAssessment(input({ coreResponses: [...assessmentInput.coreResponses].reverse() }), bundle);
    expect(serializeAssessmentResult(result)).toBe(serializeAssessmentResult(reordered));
    expect(assessmentInput).toEqual(snapshot);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.diagnostics)).toBe(true);
    expect(() => JSON.parse(serializeAssessmentResult(result))).not.toThrow();

    const scope = {
      itemIds: bundle.items.filter((item) => item.role === "core" && item.status === "active").map((item) => String(item.id)).sort(),
      constructIds: bundle.constructs.filter((construct) => construct.scope === "root").map((construct) => String(construct.id)).sort(),
    };
    const prepared = prepareAssessmentResponses(assessmentInput.coreResponses, bundle, scope);
    const constructs = scoreConstructLayer(prepared, bundle, scope);
    const primary = scorePrimaryProfiles(constructs, bundle);
    const modifiers = scoreModifiers(constructs, bundle);
    const specialistPrepared = prepareSpecialistAssessment({ requestedModuleIds: [], responses: [] }, bundle);
    const specialists = scoreSpecialists(constructs, specialistPrepared, bundle);
    const diagnostics = buildAssessmentDiagnostics({ bundle, constructs, profiles: primary, modifiers, specialists });
    expect(result.constructs).toEqual(constructs.constructs);
    expect(result.primary.profiles).toEqual(primary.profiles);
    expect(result.primary.ranking).toEqual(primary.ranking);
    expect(result.modifiers).toEqual(modifiers.modifiers);
    expect(JSON.parse(JSON.stringify(result.diagnostics))).toMatchObject(JSON.parse(JSON.stringify(diagnostics)));
  });
});
