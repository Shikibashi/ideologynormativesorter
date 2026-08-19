import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import type { AssessmentInput, AssessmentResult } from "../../v2/packages/contracts/src/results";
import { scoreAssessment, serializeAssessmentResult } from "../../v2/packages/engine/src";

const root = resolve(process.cwd(), "v2/reference/v2/cases");
const bundle = JSON.parse(readFileSync(resolve(process.cwd(), "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;
const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf8")) as { contentFingerprint: string; resultSchemaVersion: string; cases: { id: string; input: string; expectedResult: string; canonicalResult: string; canonicalSha256: string }[] };

describe("Phase 9 v2 golden fixtures", () => {
  it("replays every persisted authoritative result exactly", () => {
    expect(manifest.contentFingerprint).toBe(bundle.metadata.contentFingerprint);
    expect(manifest.resultSchemaVersion).toBe(bundle.metadata.resultSchemaVersion);
    for (const entry of manifest.cases) {
      const input = JSON.parse(readFileSync(resolve(root, entry.input), "utf8")) as AssessmentInput;
      const expected = JSON.parse(readFileSync(resolve(root, entry.expectedResult), "utf8")) as AssessmentResult;
      const expectedCanonical = readFileSync(resolve(root, entry.canonicalResult), "utf8");
      const actual = scoreAssessment(input, bundle);
      const actualCanonical = serializeAssessmentResult(actual);
      expect(actual).toEqual(expected);
      expect(actualCanonical).toBe(expectedCanonical);
      expect(createHash("sha256").update(actualCanonical).digest("hex")).toBe(entry.canonicalSha256);
    }
  });
});
