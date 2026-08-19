import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import type { AssessmentInput } from "../../v2/packages/contracts/src/results";
import { serializeAssessmentResult, scoreAssessment } from "../../v2/packages/engine/src";
import { runV1ReferenceCase, runV2ReferenceCase } from "./reference-adapters";
import type { ReferenceCaseEntry } from "./reference-types";
import { REFERENCE_COMMIT } from "./reference-types";

const root = resolve(process.cwd());
const bundle = JSON.parse(readFileSync(resolve(root, "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;
const manifest = JSON.parse(readFileSync(resolve(root, "v2/reference/cases/manifest.json"), "utf8")) as { cases: readonly ReferenceCaseEntry[]; contentFingerprint: string };
const ledger = JSON.parse(readFileSync(resolve(root, "v2/reference/migration-behavior-ledger.json"), "utf8")) as { behaviors: readonly { id: string; classification: string; status: string; fixtures: readonly string[] }[] };

describe("Phase 10 differential reference oracle", () => {
  it("replays every captured case against both isolated adapters", () => {
    expect(manifest.contentFingerprint).toBe(bundle.metadata.contentFingerprint);
    for (const entry of manifest.cases) {
      const input = JSON.parse(readFileSync(resolve(root, entry.input), "utf8")) as AssessmentInput;
      const expectedV1 = JSON.parse(readFileSync(resolve(root, entry.expectedV1), "utf8"));
      const expectedV2 = JSON.parse(readFileSync(resolve(root, entry.expectedV2), "utf8"));
      expect(runV1ReferenceCase(input, bundle)).toEqual(expectedV1);
      expect(runV2ReferenceCase(input, bundle)).toEqual(expectedV2);
      expect(expectedV1.referenceCommit).toBe(REFERENCE_COMMIT);
      for (const behaviorId of entry.expectedDifferences) expect(ledger.behaviors.some((behavior) => behavior.id === behaviorId)).toBe(true);
    }
  });

  it("keeps every classified behavior covered by at least one case", () => {
    const fixtureIds = new Set(manifest.cases.map((entry) => entry.id));
    for (const behavior of ledger.behaviors) {
      expect(behavior.status).toBe("covered");
      expect(behavior.fixtures.some((fixture) => fixture === "math-oracles" || fixtureIds.has(fixture))).toBe(true);
    }
  });

  it("has no unexplained scoring-relevant difference category", () => {
    const allowed = new Set(["MUST_PRESERVE", "INTENTIONAL_CHANGE", "KNOWN_DEFECT", "RESEARCH_ONLY", "ARCHIVE_ONLY"]);
    for (const behavior of ledger.behaviors) expect(allowed.has(behavior.classification)).toBe(true);
    expect(ledger.behaviors.filter((behavior) => behavior.status !== "covered")).toHaveLength(0);
  });

  it("is order invariant while preserving a stable canonical result", () => {
    const entry = manifest.cases.find((candidate) => candidate.id === "alternating-core")!;
    const input = JSON.parse(readFileSync(resolve(root, entry.input), "utf8")) as AssessmentInput;
    const result = scoreAssessment(input, bundle);
    const reordered = scoreAssessment({ ...input, coreResponses: [...input.coreResponses].reverse() }, bundle);
    expect(serializeAssessmentResult(result)).toBe(serializeAssessmentResult(reordered));
  });
});
