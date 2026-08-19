import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const text = (path: string) => readFileSync(path, "utf8");

describe("Phase 13 research boundaries", () => {
  it("keeps research source and Worker independent from v1 and scoring", () => {
    const researchSource = text("v2/packages/research/src/index.ts") + text("v2/packages/research/src/client.ts") + text("v2/packages/research/src/contract.ts");
    const workerSource = text("v2/research-worker/src/worker.mjs");
    expect(researchSource).not.toMatch(/packages\/engine|src\/research|scoreAssessment|localStorage/);
    expect(workerSource).not.toMatch(/packages\/engine|src\/research|scoreAssessment|weighted|profile matching|modifier matching|specialist scoring|construct score/);
  });

  it("keeps the acceptance registry structural and duplicate-free", () => {
    const registry = JSON.parse(text("v2/research-worker/generated/acceptance-registry.json")) as { items: Array<Record<string, unknown>> };
    const ids = registry.items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(text("v2/research-worker/generated/acceptance-registry.json")).not.toMatch(/contributions|polarity|weight/);
  });

  it("compiles acceptance metadata deterministically", () => {
    const first = execFileSync("node", ["v2/tools/generate-research-acceptance.mjs"], { encoding: "utf8" }).trim();
    const second = execFileSync("node", ["v2/tools/generate-research-acceptance.mjs"], { encoding: "utf8" }).trim();
    expect(first).toBe(second);
    expect(text("v2/research-worker/wrangler.local.jsonc")).toContain('"DEPLOYMENT_ENVIRONMENT": "local"');
    expect(text("v2/research-worker/wrangler.local.jsonc")).toContain('"RESEARCH_WRITES_ENABLED": "true"');
    expect(text("v2/research-worker/src/worker.mjs")).toContain('env.DEPLOYMENT_ENVIRONMENT !== "production"');
  });
});
