import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { CanonicalContentBundle } from "../packages/contracts/src/content";
import type { AssessmentInput } from "../packages/contracts/src/results";
import { scoreAssessment, serializeAssessmentResult } from "../packages/engine/src/index";

const bundle = JSON.parse(readFileSync("v2/generated/content.bundle.json", "utf8")) as CanonicalContentBundle;
const target = "v2/reference/v2/cases";

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

const input = {
  responseSchemaVersion: bundle.metadata.responseSchemaVersion,
  contentFingerprint: bundle.metadata.contentFingerprint,
  coreResponses: coreResponses(),
  specialistResponses: [],
  requestedSpecialistModuleIds: [],
} as AssessmentInput;
const result = scoreAssessment(input, bundle);
const serialized = serializeAssessmentResult(result);
mkdirSync(`${target}/complete-core`, { recursive: true });
writeFileSync(`${target}/complete-core/input.json`, `${JSON.stringify(input, null, 2)}\n`);
writeFileSync(`${target}/complete-core/expected-result.json`, `${JSON.stringify(result, null, 2)}\n`);
writeFileSync(`${target}/complete-core/expected-result.canonical.json`, serialized);
writeFileSync(`${target}/manifest.json`, `${JSON.stringify({
  schemaVersion: "v2-golden-v1",
  contentFingerprint: bundle.metadata.contentFingerprint,
  resultSchemaVersion: bundle.metadata.resultSchemaVersion,
  cases: [{
    id: "complete-core",
    input: "complete-core/input.json",
    expectedResult: "complete-core/expected-result.json",
    canonicalResult: "complete-core/expected-result.canonical.json",
    canonicalSha256: createHash("sha256").update(serialized).digest("hex"),
  }],
}, null, 2)}\n`);
