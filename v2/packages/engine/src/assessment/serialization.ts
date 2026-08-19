import { stableSerialize } from "../../../content/src/serialization";
import type { AssessmentResult } from "../../../contracts/src/results";

function assertJsonSafe(value: unknown, path = "result"): void {
  if (typeof value === "function" || typeof value === "bigint" || value === undefined) {
    throw new TypeError(`${path} contains a non-JSON value`);
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new TypeError(`${path} contains a non-finite number`);
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertJsonSafe(entry, `${path}[${index}]`));
    return;
  }
  if (typeof value === "object" && value !== null) {
    for (const [key, entry] of Object.entries(value)) assertJsonSafe(entry, `${path}.${key}`);
  }
}

export function serializeAssessmentResult(result: AssessmentResult): string {
  assertJsonSafe(result);
  return stableSerialize(result);
}
