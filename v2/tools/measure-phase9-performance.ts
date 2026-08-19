import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import type { CanonicalContentBundle } from "../packages/contracts/src/content";
import type { AssessmentInput } from "../packages/contracts/src/results";
import { scoreAssessment, serializeAssessmentResult } from "../packages/engine/src/index";

const bundle = JSON.parse(readFileSync("v2/generated/content.bundle.json", "utf8")) as CanonicalContentBundle;

function coreResponses(): unknown[] {
  return bundle.items.filter((item) => item.role === "core" && item.status === "active").map((item, index) => {
    if (item.responseType === "statement-choice") return { state: "answered", itemId: item.id, responseType: item.responseType, optionId: item.options[0].id };
    const maximum = item.responseType === "likert5" ? 2 : 3;
    return {
      state: "answered",
      itemId: item.id,
      responseType: item.responseType,
      value: index % (maximum * 2 + 1) - maximum,
      ...(item.layer === "descriptive" ? { confidence: 5 } : {}),
      ...(item.layer === "prescriptive" ? { priority: 5 } : {}),
    };
  });
}

function specialistResponses(moduleId: string): unknown[] {
  return bundle.items.filter((item) => item.role === "specialist" && item.moduleId === moduleId && item.status === "active").map((item, index) => item.responseType === "statement-choice"
    ? { state: "answered", itemId: item.id, responseType: item.responseType, optionId: item.options[0].id }
    : { state: "answered", itemId: item.id, responseType: item.responseType, value: index % 7 - 3 });
}

function measure(input: AssessmentInput): { milliseconds: number; serializedBytes: number } {
  const start = performance.now();
  const result = scoreAssessment(input, bundle);
  const serialized = serializeAssessmentResult(result);
  return { milliseconds: Number((performance.now() - start).toFixed(3)), serializedBytes: Buffer.byteLength(serialized, "utf8") };
}

const base = {
  responseSchemaVersion: bundle.metadata.responseSchemaVersion,
  contentFingerprint: bundle.metadata.contentFingerprint,
  coreResponses: coreResponses(),
  specialistResponses: [],
  requestedSpecialistModuleIds: [],
} as AssessmentInput;
const moduleId = String(bundle.specialistModules[0].id);
const specialist = {
  ...base,
  specialistResponses: specialistResponses(moduleId),
  requestedSpecialistModuleIds: [moduleId],
} as AssessmentInput;
console.log(JSON.stringify({
  contentBundleBytes: Buffer.byteLength(readFileSync("v2/generated/content.bundle.json")),
  completeCore: measure(base),
  completeCoreWithOneSpecialistModule: measure(specialist),
  insufficientCore: measure({ ...base, coreResponses: [] }),
}, null, 2));
