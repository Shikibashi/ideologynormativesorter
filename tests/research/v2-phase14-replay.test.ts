import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { scoreAssessment } from "../../v2/packages/engine/src";
import { createResearchSubmission, researchInputFromSubmission } from "../../v2/packages/research/src";
import type { CanonicalContentBundle, RawResponse } from "../../v2/packages/contracts/src";

const bundle = JSON.parse(readFileSync("v2/generated/content.bundle.json", "utf8")) as CanonicalContentBundle;

function researchBundle() {
  return {
    metadata: bundle.metadata,
    items: bundle.items.map((item) => ({
      id: String(item.id),
      role: item.role,
      status: item.status,
      responseType: item.responseType,
      scaleMin: "scaleMin" in item ? item.scaleMin : undefined,
      scaleMax: "scaleMax" in item ? item.scaleMax : undefined,
      scaleStep: "scaleStep" in item ? item.scaleStep : undefined,
      moduleId: "moduleId" in item && item.moduleId ? String(item.moduleId) : undefined,
      options: "options" in item ? item.options.map((option) => ({ id: String(option.id) })) : undefined,
    })),
    specialistModules: bundle.specialistModules.map((module) => ({ id: String(module.id), itemIds: module.itemIds.map(String) })),
  };
}

describe("Phase 14 offline scoring replay", () => {
  it("reconstructs the exact AssessmentInput without using result or profile fields", () => {
    const coreResponses: RawResponse[] = bundle.items.filter((item) => item.role === "core" && item.status === "active").map((item, index) => {
      if (item.responseType === "statement-choice") return { state: "answered", itemId: item.id, responseType: item.responseType, optionId: item.options[0].id };
      const min = item.scaleMin ?? 1;
      const max = item.scaleMax ?? 5;
      return { state: "answered", itemId: item.id, responseType: item.responseType, value: min + (index % (max - min + 1)) };
    });
    const input = {
      responseSchemaVersion: bundle.metadata.responseSchemaVersion,
      contentFingerprint: bundle.metadata.contentFingerprint,
      coreResponses,
      specialistResponses: [],
      requestedSpecialistModuleIds: [],
    };
    const direct = scoreAssessment(input, bundle);
    const envelope = createResearchSubmission(input, researchBundle(), { consentedAt: "2026-01-01T00:00:00.000Z", submissionId: "rs_00000000-0000-4000-8000-000000000001" });
    const replayed = scoreAssessment(researchInputFromSubmission(envelope), bundle);
    expect(JSON.stringify(replayed)).toBe(JSON.stringify(direct));
    expect(envelope).not.toHaveProperty("result");
    expect(envelope).not.toHaveProperty("profiles");
  });
});
