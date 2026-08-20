import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";

const root = resolve(process.cwd());
const bundle = JSON.parse(readFileSync(resolve(root, "v2/generated/content.bundle.json"), "utf8")) as CanonicalContentBundle;
const manifest = JSON.parse(readFileSync(resolve(root, "v2/reference/cases/manifest.json"), "utf8")) as { cases: readonly { id: string }[] };
const coverage = JSON.parse(readFileSync(resolve(root, "v2/reference/reference-coverage.json"), "utf8")) as { coreItems: Readonly<Record<string, string>> };
const ids = new Set(manifest.cases.map((entry) => entry.id));

describe("Phase 10 reference coverage", () => {
  it("covers all active core items, root constructs, profiles, modifiers, modules, and specialist profiles structurally", () => {
    expect(ids.has("max-core")).toBe(true);
    expect(ids.has("complete-core") || ids.has("max-core")).toBe(true);
    const activeCoreItems = bundle.items.filter((item) => item.role === "core" && item.status === "active");
    expect(activeCoreItems).toHaveLength(336);
    expect(Object.keys(coverage.coreItems).sort()).toEqual(activeCoreItems.map((item) => String(item.id)).sort());
    expect(bundle.constructs.filter((construct) => construct.scope === "root")).toHaveLength(26);
    expect(bundle.profiles).toHaveLength(16);
    expect(bundle.modifiers).toHaveLength(24);
    for (const module of bundle.specialistModules) expect(ids.has(`specialist-${module.id}`)).toBe(true);
    expect(bundle.specialists.length).toBe(78);
  });

  it("uses a fixed random seed and sample count in the differential suite", async () => {
    const source = readFileSync(resolve(root, "tests/v2-differential/randomized.spec.ts"), "utf8");
    expect(source).toContain("20260819");
    expect(source).toContain("64");
  });
});
