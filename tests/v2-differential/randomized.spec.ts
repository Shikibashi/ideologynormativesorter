import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import type { AssessmentInput } from "../../v2/packages/contracts/src/results";
import { scoreAssessment, serializeAssessmentResult } from "../../v2/packages/engine/src";
import { RANDOM_SAMPLE_COUNT, RANDOM_SEED } from "./reference-types";

const bundle = JSON.parse(readFileSync(resolve(process.cwd(), "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;

function next(seed: number): number {
  return (seed * 1664525 + 1013904223) >>> 0;
}

function randomInput(sample: number): AssessmentInput {
  let seed = RANDOM_SEED + sample;
  const coreResponses = bundle.items.filter((item) => item.role === "core" && item.status === "active").map((item) => {
    seed = next(seed);
    if (item.responseType === "statement-choice") return { state: "answered" as const, itemId: item.id, responseType: item.responseType, optionId: item.options[seed % item.options.length].id };
    const maximum = item.responseType === "likert5" ? 2 : 3;
    const response: { state: "answered"; itemId: string; responseType: "likert5" | "likert7"; value: number; confidence?: 1 | 3 | 5; priority?: 1 | 3 | 5 } = { state: "answered", itemId: item.id, responseType: item.responseType, value: (seed % (maximum * 2 + 1)) - maximum };
    if (item.layer === "descriptive") response.confidence = ([1, 3, 5] as const)[seed % 3];
    if (item.layer === "prescriptive") response.priority = ([1, 3, 5] as const)[seed % 3];
    return response;
  });
  return { responseSchemaVersion: bundle.metadata.responseSchemaVersion, contentFingerprint: bundle.metadata.contentFingerprint, coreResponses, specialistResponses: [], requestedSpecialistModuleIds: [] };
}

describe("Phase 10 deterministic randomized differential samples", () => {
  it("replays the fixed seed/version/sample count without byte drift", () => {
    expect(RANDOM_SEED).toBe(20260819);
    expect(RANDOM_SAMPLE_COUNT).toBe(64);
    for (let sample = 0; sample < RANDOM_SAMPLE_COUNT; sample += 1) {
      const input = randomInput(sample);
      const first = scoreAssessment(input, bundle);
      const second = scoreAssessment(input, bundle);
      const reordered = scoreAssessment({ ...input, coreResponses: [...input.coreResponses].reverse() }, bundle);
      expect(serializeAssessmentResult(first)).toBe(serializeAssessmentResult(second));
      expect(serializeAssessmentResult(first)).toBe(serializeAssessmentResult(reordered));
    }
  }, 30000);
});
