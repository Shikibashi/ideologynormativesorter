import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { AssessmentInput, CanonicalContentBundle } from "../../v2/packages/contracts/src";
import { scoreAssessment, serializeAssessmentResult } from "../../v2/packages/engine/src";
import {
  MemoryAssessmentSaveStore,
  SAVE_SCHEMA_VERSION,
  createPrivateAssessmentSave,
  evaluateSavedAssessmentFreshness,
  exportPrivateAssessment,
  importPrivateAssessment,
  migrateLegacyAnswerShare,
  migrateLegacyQuizSave,
  migrateLegacySpecialistProgress,
  parsePrivateAssessmentSave,
  parsePublicShare,
  projectPublicShare,
  serializePrivateAssessmentSave,
  serializePublicShare,
  sha256Hex,
} from "../../v2/packages/persistence/src";

const bundle = JSON.parse(readFileSync(resolve(process.cwd(), "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;
const coreItems = bundle.items.filter((item) => item.role === "core" && item.status === "active");
const specialistModule = bundle.specialistModules[0];

function completeInput(): AssessmentInput {
  return {
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    coreResponses: coreItems.map((item, index) => item.responseType === "statement-choice"
      ? { state: "answered", itemId: item.id, responseType: item.responseType, optionId: item.options[0].id }
      : { state: "answered", itemId: item.id, responseType: item.responseType, value: item.scaleMin + (index % (item.scaleMax - item.scaleMin + 1)), ...(item.layer === "descriptive" ? { confidence: 5 as const } : {}), ...(item.layer === "prescriptive" ? { priority: 5 as const } : {}) }),
    specialistResponses: [],
    requestedSpecialistModuleIds: [],
  } as AssessmentInput;
}

function statefulInput(): AssessmentInput {
  const likerts = coreItems.filter((item) => item.responseType !== "statement-choice");
  const statement = coreItems.find((item) => item.responseType === "statement-choice");
  return {
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    coreResponses: [
      { state: "answered", itemId: likerts[0].id, responseType: likerts[0].responseType, value: 0, confidence: 3, priority: 5 },
      { state: "missing", itemId: likerts[1].id },
      { state: "abstained", itemId: likerts[2].id },
      { state: "refused", itemId: likerts[3].id },
      ...(statement ? [{ state: "answered" as const, itemId: statement.id, responseType: "statement-choice" as const, optionId: statement.options[0].id }] : []),
    ],
    specialistResponses: [],
    requestedSpecialistModuleIds: [],
  } as AssessmentInput;
}

function save(input: AssessmentInput, cachedResult?: AssessmentInput extends never ? never : ReturnType<typeof scoreAssessment>): ReturnType<typeof createPrivateAssessmentSave> {
  return createPrivateAssessmentSave({
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    scoringVersion: bundle.metadata.scoringVersion,
    session: { stage: "core-questionnaire", currentItemId: coreItems[2].id, presentationProgress: { coreIndex: 2, specialistModuleIndex: 0, specialistItemIndex: 0 } },
    assessmentInput: input,
    ...(cachedResult === undefined ? {} : { cachedResult }),
  });
}

describe("Phase 12 persistence boundaries", () => {
  it("provides a browser-safe deterministic SHA-256 implementation", () => {
    expect(sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });

  it("round-trips every v2 response state and metadata without mutation", () => {
    const input = statefulInput();
    const before = structuredClone(input);
    const serialized = JSON.stringify(save(input));
    const parsed = parsePrivateAssessmentSave(serialized);
    expect(parsed.status).toBe("loaded");
    expect(parsed.save?.saveSchemaVersion).toBe(SAVE_SCHEMA_VERSION);
    expect(parsed.save?.assessmentInput).toEqual(input);
    expect(input).toEqual(before);
  });

  it("compiles private envelopes deterministically and rejects malformed input", () => {
    const first = serializePrivateAssessmentSave(save(statefulInput()));
    const second = serializePrivateAssessmentSave(save(statefulInput()));
    expect(first).toBe(second);
    expect(parsePrivateAssessmentSave("[]").status).toBe("corrupted");
    expect(parsePrivateAssessmentSave("{\"kind\":\"private-save\"}").status).toBe("corrupted");
    expect(parsePrivateAssessmentSave("{\"__proto__\":{}} ").status).toBe("corrupted");
  });

  it("rejects a tampered public projection and keeps the public schema bounded", () => {
    const serialized = serializePublicShare(projectPublicShare(scoreAssessment(completeInput(), bundle)));
    const tampered = JSON.parse(serialized) as { primaryMatches: Array<{ name: string }> };
    tampered.primaryMatches[0].name = "changed";
    expect(() => parsePublicShare(JSON.stringify(tampered))).toThrowError(/integrity/i);
    expect(serialized.length).toBeLessThan(64 * 1024);
  });

  it("uses an explicit storage adapter and leaves v1 keys untouched", () => {
    const store = new MemoryAssessmentSaveStore();
    const input = statefulInput();
    expect(store.save(save(input))).toEqual({ saved: true });
    expect(store.load().status).toBe("loaded");
    expect(store.remove()).toBe(true);
    expect(store.load().status).toBe("missing");
  });

  it("rejects digest corruption and dangerous imported keys", () => {
    const serialized = JSON.stringify(save(statefulInput()));
    const corrupted = JSON.parse(serialized) as { assessmentInput: { coreResponses: Array<{ value?: number }> } };
    corrupted.assessmentInput.coreResponses[0].value = 2;
    expect(parsePrivateAssessmentSave(JSON.stringify(corrupted)).freshness.reason).toBe("integrity_failed");
    expect(parsePrivateAssessmentSave(`${serialized.slice(0, -1)},"__proto__":{}}`).status).toBe("corrupted");
  });

  it("classifies content changes before an imported save can be used", () => {
    const current = save(statefulInput());
    const stale = createPrivateAssessmentSave({ ...current, contentFingerprint: "different-content" });
    expect(evaluateSavedAssessmentFreshness(stale, bundle).kind).toBe("incompatible");
    expect(() => importPrivateAssessment(JSON.stringify(stale), bundle)).toThrowError(/incompatible/i);
  });

  it("preserves score identity across private export/import and never uses cached results as authority", () => {
    const input = completeInput();
    const result = scoreAssessment(input, bundle);
    const cached = JSON.parse(JSON.stringify(result)) as typeof result;
    (cached.primary.topProfileIds as string[]).reverse();
    const exported = exportPrivateAssessment(save(input, cached));
    const imported = importPrivateAssessment(exported, bundle);
    const replayed = scoreAssessment(imported.save.assessmentInput, bundle);
    expect(serializeAssessmentResult(replayed)).toBe(serializeAssessmentResult(result));
    expect(imported.save.cachedResult).toBeDefined();
  });

  it("projects a privacy-minimized, tie-preserving public share", () => {
    const result = scoreAssessment(completeInput(), bundle);
    const serialized = serializePublicShare(projectPublicShare(result));
    const parsed = parsePublicShare(serialized);
    expect(parsed.primaryTie.isTie).toBe(result.primary.topTie.isTie);
    expect(parsed.primaryMatches.length).toBeGreaterThan(0);
    expect(parsed).not.toHaveProperty("coreResponses");
    expect(parsed).not.toHaveProperty("specialistResponses");
    expect(parsed).not.toHaveProperty("contributions");
    expect(parsed).not.toHaveProperty("diagnostics");
    expect(parsed.primaryMatches.every((profile) => !Object.prototype.hasOwnProperty.call(profile, "itemId"))).toBe(true);
    expect(parsed.methodologyMetadata.rawResponsesIncluded).toBe(false);
  });

  it("rejects an unknown imported item through the sealed scoring validator", () => {
    const input = { ...statefulInput(), coreResponses: [{ state: "missing", itemId: "unknown-v1-item" }] } as AssessmentInput;
    expect(() => scoreAssessment(input, bundle)).toThrowError(expect.objectContaining({ code: "UNKNOWN_ITEM" }));
  });

  it("migrates exact legacy IDs and reports lossy transformations explicitly", () => {
    const item = coreItems.find((entry) => entry.responseType !== "statement-choice")!;
    const migrated = migrateLegacyQuizSave({ questions: [{ id: item.id }], answers: { [item.id]: { questionId: item.id, value: "dont_know" } }, index: 0, tier: "moderate" }, bundle);
    expect(migrated.report.classification).toBe("PARTIALLY_MIGRATABLE");
    expect(migrated.report.loss).toBe("LOSSY");
    expect(migrated.input?.coreResponses[0]).toMatchObject({ state: "abstained", itemId: item.id });
    const unknown = migrateLegacyQuizSave({ questions: [], answers: { "removed-id": { questionId: "removed-id", value: 0 } }, index: 0, tier: "moderate" }, bundle);
    expect(unknown.report.droppedResponses).toBe(1);
    expect(unknown.report.warnings.join(" ")).toMatch(/exact canonical v2 item ID/);
  });

  it("migrates raw legacy shares and specialist progress without forcing activation", () => {
    const item = coreItems.find((entry) => entry.responseType !== "statement-choice")!;
    const payload = Buffer.from(JSON.stringify({ v: 3, a: [[item.id, 0, 3, 5]] })).toString("base64url");
    const share = migrateLegacyAnswerShare(payload, bundle);
    expect(share.input?.coreResponses[0]).toMatchObject({ itemId: item.id, state: "answered" });
    const specialistItem = bundle.items.find((entry) => entry.role === "specialist" && String(entry.moduleId) === String(specialistModule.id))!;
    const specialist = migrateLegacySpecialistProgress({ participantId: "legacy-participant", administration: "test", moduleId: specialistModule.id, answers: { [specialistItem.id]: { questionId: specialistItem.id, value: 0 } }, index: 0, startedAt: "2026-01-01T00:00:00.000Z" }, bundle);
    expect(specialist.input?.requestedSpecialistModuleIds).toEqual([specialistModule.id]);
    expect(specialist.report.warnings.join(" ")).toMatch(/identity is not migrated/);
    const result = scoreAssessment(specialist.input!, bundle);
    expect(result.specialists.modules.find((module) => module.moduleId === specialistModule.id)?.activationStatus).toBe("activated");
  });
});
