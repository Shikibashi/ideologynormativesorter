import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  compileContent,
  countExplicitMappings,
  stableSerialize,
  validateContentSchema,
  validateContentSemantics,
} from "../../v2/packages/content/src/index";

const root = process.cwd();
const bundlePath = path.join(root, "v2", "generated", "content.bundle.json");
const manifestPath = path.join(root, "v2", "generated", "content-manifest.json");
const reconciliationPath = path.join(root, "docs", "v2", "v1-v2-content-reconciliation.md");

type JsonObject = Record<string, unknown>;

function readJson(filePath: string): JsonObject {
  return JSON.parse(readFileSync(filePath, "utf8")) as JsonObject;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(fullPath);
    return entry.name.endsWith(".ts") ? [fullPath] : [];
  });
}

describe("Phase 2 audited canonical content", () => {
  it("validates every generated record and explicit relationship", () => {
    const bundle = readJson(bundlePath);
    const schema = validateContentSchema(bundle);
    expect(schema.success).toBe(true);
    expect(schema.issues).toEqual([]);

    const semantics = validateContentSemantics(schema.value!);
    expect(semantics.success).toBe(true);
    expect(semantics.issues).toEqual([]);

    const itemIds = new Set(bundle.items.map((item: JsonObject) => item.id));
    expect(itemIds.size).toBe(bundle.items.length);
    for (const item of bundle.items) {
      expect(item.status).toBe("active");
      if (item.responseType === "statement-choice") {
        expect(item.scoring.mappingMode).toBe("options");
        expect(item.options.length).toBeGreaterThan(0);
        for (const option of item.options) expect(option.contributions.length).toBeGreaterThan(0);
      } else {
        expect(item.scoring.mappingMode).toBe("item");
        expect(item.scoring.contributions.length).toBeGreaterThan(0);
      }
    }
    expect(countExplicitMappings(bundle)).toBe(bundle.metadata.counts.explicitContributionMappings);
    expect(bundle.metadata.counts.explicitContributionMappings).toBeGreaterThan(0);
  });

  it("keeps specialist ownership, profiles, modules, and ontology explicit", () => {
    const bundle = readJson(bundlePath);
    const moduleMap = new Map(bundle.specialistModules.map((module: JsonObject) => [module.id, module]));
    const profileMap = new Map(bundle.specialists.map((profile: JsonObject) => [profile.id, profile]));

    expect(bundle.specialistAssignment.orderedModuleIds).toHaveLength(bundle.specialistModules.length);
    for (const item of bundle.items.filter((entry: JsonObject) => entry.role === "specialist")) {
      const module = moduleMap.get(item.moduleId);
      expect(module).toBeDefined();
      expect(module.itemIds).toContain(item.id);
    }
    for (const module of bundle.specialistModules) {
      for (const profileId of module.outputProfileIds) {
        expect(profileMap.get(profileId)?.moduleId).toBe(module.id);
      }
      for (const candidateId of module.candidateIds) {
        expect(bundle.specialistCandidates.some((candidate: JsonObject) => candidate.id === candidateId)).toBe(true);
      }
    }
    for (const relation of bundle.ontologyRelations) {
      expect(bundle.ontologyNodes.some((node: JsonObject) => node.id === relation.sourceNodeId)).toBe(true);
      expect(bundle.ontologyNodes.some((node: JsonObject) => node.id === relation.targetNodeId)).toBe(true);
      expect(relation.sourceNodeId).not.toBe(relation.targetNodeId);
    }
  });

  it("compiles to a deeply immutable, source-order-independent artifact", () => {
    const bundle = readJson(bundlePath);
    const first = compileContent(bundle);
    const reordered = clone(bundle);
    for (const key of [
      "domains",
      "constructs",
      "items",
      "profiles",
      "modifiers",
      "specialists",
      "specialistModules",
      "specialistCandidates",
      "ontologyNodes",
      "ontologyRelations",
      "provenanceSources",
    ]) {
      reordered[key] = [...reordered[key]].reverse();
    }
    const second = compileContent(reordered);

    expect(second.fingerprint).toBe(first.fingerprint);
    expect(second.serialized).toBe(first.serialized);
    expect(stableSerialize(first.bundle)).toBe(first.serialized);
    expect(Object.isFrozen(first.bundle)).toBe(true);
    expect(Object.isFrozen(first.bundle.items)).toBe(true);
    expect(Object.isFrozen(first.bundle.items[0])).toBe(true);
    expect(stableSerialize(readJson(bundlePath))).toBe(first.serialized);
    expect(readFileSync(bundlePath, "utf8").trimEnd()).toBe(first.serialized);
  });

  it("matches generated inventory and reconciliation gates", () => {
    const bundle = readJson(bundlePath);
    const compiled = compileContent(bundle);
    const generatedManifest = readJson(manifestPath);
    expect(generatedManifest.contentFingerprint).toBe(compiled.fingerprint);
    expect(generatedManifest.counts).toEqual(compiled.inventory);

    const reconciliation = readFileSync(reconciliationPath, "utf8");
    expect(reconciliation).toMatch(/MUST_PRESERVE mismatches: 0/);
    expect(reconciliation).toMatch(/Unexplained scoring-relevant differences: 0/);
  });

  it("keeps v1 overlay machinery outside the v2 runtime", () => {
    const runtime = sourceFiles(path.join(root, "v2", "packages"))
      .map((filePath) => readFileSync(filePath, "utf8"))
      .join("\n");
    expect(runtime).not.toMatch(/applySemanticCorrections|applyEditorialPass|applyMeasurementOverrides|effectiveQuestions|mergeCanonicalOverlay/);
  });
});
