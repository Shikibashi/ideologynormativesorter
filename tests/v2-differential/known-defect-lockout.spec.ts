import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { recursive: true }).filter((entry): entry is string => entry.endsWith(".ts")).map((entry) => resolve(directory, entry));
}

describe("Phase 10 known-defect lockout", () => {
  it("keeps forbidden v1 runtime and overlay authorities out of v2 packages", () => {
    const source = sourceFiles(resolve(process.cwd(), "v2/packages")).map((file) => readFileSync(file, "utf8")).join("\n");
    expect(source).not.toMatch(/from ["'][^"']*src\/(data|domain|scoring|production|specialist|validation|research)\//i);
    expect(source).not.toMatch(/canonicalData\.ts|effectiveQuestions|applySemanticCorrections|applyEditorialPass|applyMeasurementOverrides|mergeCanonicalOverlay|scoreProduction|buildResultProfile/);
    expect(source).not.toMatch(/reliabilityForAxis|reliabilityForLabel|reliability/);
  });

  it("keeps the twelve explicit lockout behaviors present and covered", () => {
    const ledger = JSON.parse(readFileSync(resolve(process.cwd(), "v2/reference/migration-behavior-ledger.json"), "utf8")) as { behaviors: readonly { id: string; classification: string; status: string }[] };
    const knownDefects = ledger.behaviors.filter((behavior) => behavior.classification === "KNOWN_DEFECT");
    expect(knownDefects.map((behavior) => behavior.id)).toEqual(["ST-002", "SA-004", "C-003", "SP-004", "D-004", "KD-001", "KD-002", "KD-003", "KD-004", "KD-005", "KD-006", "KD-007", "KD-008", "KD-009", "KD-010", "KD-011", "KD-012"]);
    expect(knownDefects.every((behavior) => behavior.status === "covered")).toBe(true);
  });
});
