import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Phase 14 research analysis boundary", () => {
  it("does not import the v1 runtime or scoring engine into the research package", () => {
    const source = readFileSync("v2/packages/research/src/analysis.ts", "utf8");
    expect(source).not.toMatch(/from ["'].*(?:src\/domain|packages\/engine)/);
  });

  it("does not classify synthetic output as empirical evidence", () => {
    const config = JSON.parse(readFileSync("v2/research/config/analysis-config.json", "utf8")) as { datasetKind: string; privacy: { outputSubmissionIds: boolean } };
    expect(config.datasetKind).toBe("synthetic-regression-fixture");
    expect(config.privacy.outputSubmissionIds).toBe(false);
  });

  it("keeps legacy analysis scripts outside the v2 source tree", () => {
    expect(readFileSync("v2/research/README.md", "utf8")).toContain("legacy v1 analysis scripts remain archive-only");
  });
});
