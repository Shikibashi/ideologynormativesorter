import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { REFERENCE_COMMIT } from "./reference-types";

const root = resolve(process.cwd());

describe("Phase 10 reference integrity", () => {
  it("freezes the v1 reference metadata instead of reading current main", () => {
    const manifest = JSON.parse(readFileSync(resolve(root, "v2/reference/v1/manifest.json"), "utf8")) as Record<string, unknown>;
    expect(manifest.referenceCommit).toBe(REFERENCE_COMMIT);
    expect(manifest.captureMode).toBe("frozen-reference-boundary");
    expect(manifest.visualParityClaim).toBe(false);
  });

  it("requires complete ledger records and deterministic replay metadata", () => {
    const ledger = JSON.parse(readFileSync(resolve(root, "v2/reference/migration-behavior-ledger.json"), "utf8")) as { behaviors: readonly Record<string, unknown>[] };
    const ids = ledger.behaviors.map((behavior) => behavior.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const behavior of ledger.behaviors) {
      expect(typeof behavior.subsystem).toBe("string");
      expect(typeof behavior.classification).toBe("string");
      expect(typeof behavior.v1Behavior).toBe("string");
      expect(typeof behavior.expectedV2).toBe("string");
      expect(typeof behavior.rationale).toBe("string");
      expect(Array.isArray(behavior.fixtures)).toBe(true);
      expect(behavior.status).toBe("covered");
    }
    const replay = JSON.parse(readFileSync(resolve(root, "v2/reference/replay-manifest.json"), "utf8")) as { deterministic: boolean; referenceCommit: string; cases: readonly unknown[] };
    expect(replay.deterministic).toBe(true);
    expect(replay.referenceCommit).toBe(REFERENCE_COMMIT);
    expect(replay.cases.length).toBeGreaterThanOrEqual(18);
  });
});
