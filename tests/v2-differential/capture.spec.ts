import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import type { AssessmentInput } from "../../v2/packages/contracts/src/results";
import { runV1ReferenceCase, runV2ReferenceCase } from "./reference-adapters";

const root = resolve(process.cwd());
const bundle = JSON.parse(readFileSync(resolve(root, "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;
const manifest = JSON.parse(readFileSync(resolve(root, "v2/reference/cases/manifest.json"), "utf8")) as { cases: readonly { input: string; expectedV1: string; expectedV2: string }[] };

describe("Phase 10 reference capture guard", () => {
  it.skipIf(process.env.V2_REFERENCE_CAPTURE !== "1")("captures deterministic v1 and v2 projections only with explicit opt-in", () => {
    for (const entry of manifest.cases) {
      const input = JSON.parse(readFileSync(resolve(root, entry.input), "utf8")) as AssessmentInput;
      mkdirSync(resolve(root, entry.expectedV1, ".."), { recursive: true });
      writeFileSync(resolve(root, entry.expectedV1), `${JSON.stringify(runV1ReferenceCase(input, bundle), null, 2)}\n`);
      writeFileSync(resolve(root, entry.expectedV2), `${JSON.stringify(runV2ReferenceCase(input, bundle), null, 2)}\n`);
    }
  });
});
