import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

describe("Phase 11 web architecture boundary", () => {
  it("keeps web and view-model source independent from v1 runtime and low-level scoring", () => {
    const roots = [resolve(process.cwd(), "v2/apps/web/src"), resolve(process.cwd(), "v2/packages/view-model/src")];
    const files = roots.flatMap(sourceFiles);
    const forbidden = /src\/(data|domain|scoring|production|specialist|validation|research)|canonicalData|effectiveQuestions|normalizeLikert|aggregateConstruct|computeProfileDistance|evaluateGate|matchModifier|scoreSpecialistProfile/;
    const violations = files.flatMap((file) => {
      const text = readFileSync(file, "utf8");
      return forbidden.test(text) ? [file] : [];
    });
    expect(violations).toEqual([]);
  });

  it("keeps the view-model free of engine imports", () => {
    const files = sourceFiles(resolve(process.cwd(), "v2/packages/view-model/src"));
    expect(files.flatMap((file) => readFileSync(file, "utf8").includes("packages/engine") ? [file] : [])).toEqual([]);
  });

  it("uses the public scoreAssessment boundary from the web", () => {
    const app = readFileSync(resolve(process.cwd(), "v2/apps/web/src/App.tsx"), "utf8");
    expect(app).toContain("scoreAssessment");
    expect(app).not.toMatch(/\b(normalizeResponse|aggregateConstruct|scorePrimaryProfiles|scoreModifiers|scoreSpecialists)\b/);
  });
});
