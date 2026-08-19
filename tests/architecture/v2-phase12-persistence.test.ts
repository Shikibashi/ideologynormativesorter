import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(tsx?|d\.ts)$/.test(entry.name) ? [path] : [];
  });
}

describe("Phase 12 persistence architecture boundary", () => {
  it("keeps persistence independent of v1 runtime and scoring engine internals", () => {
    const persistence = sourceFiles(resolve(process.cwd(), "v2/packages/persistence/src")).map((file) => readFileSync(file, "utf8")).join("\n");
    expect(persistence).not.toMatch(/(?:\.\.\/)+src\/(?:save|share|specialist)(?:['"]|\/)/);
    expect(persistence).not.toMatch(/packages\/engine|engine\/src|effectiveQuestions|apply(?:Semantic|Editorial|Measurement)Override/);
  });

  it("keeps the engine unaware of persistence and legacy migration", () => {
    const engine = sourceFiles(resolve(process.cwd(), "v2/packages/engine/src")).map((file) => readFileSync(file, "utf8")).join("\n");
    expect(engine).not.toMatch(/packages\/persistence|persistence\/src|legacy\/v1/);
  });

  it("keeps the web boundary off direct storage and v1 runtime imports", () => {
    const web = sourceFiles(resolve(process.cwd(), "v2/apps/web/src")).map((file) => readFileSync(file, "utf8")).join("\n");
    expect(web).not.toMatch(/\b(?:localStorage|sessionStorage)\b/);
    expect(web).not.toMatch(/\.\.\/\.\.\/\.\.\/src\//);
    expect(web).not.toMatch(/from ["'][^"']*\/packages\/engine\/src\/(?!index)/);
  });

  it("does not give public shares raw assessment or contribution authority", () => {
    const share = readFileSync(resolve(process.cwd(), "v2/packages/persistence/src/share.ts"), "utf8");
    expect(share).not.toMatch(/AssessmentInput|coreResponses|specialistResponses|contributions|result\.diagnostics/);
  });
});
