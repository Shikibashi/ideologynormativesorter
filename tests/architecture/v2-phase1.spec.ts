import { readFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  validateContentSchema,
  validateContentSemantics,
  stableSerialize,
  computeContentFingerprint,
} from "../../v2/packages/content/src/index";
import {
  isAnsweredResponse,
  isSkippedResponse,
  isAbstainedResponse,
  isMissingResponse,
  isRefusedResponse,
  RawResponse,
} from "../../v2/packages/contracts/src/responses";
import { createItemId } from "../../v2/packages/contracts/src/ids";

const fixturePath = path.join(
  process.cwd(),
  "v2",
  "packages",
  "content",
  "fixtures",
  "synthetic",
  "manifest.json",
);

type SyntheticContribution = {
  constructId: string;
  weight: number;
  polarity: number;
};

type SyntheticItem = {
  scoring: { contributions: SyntheticContribution[] };
  options: { contributions: SyntheticContribution[] }[];
};

type SyntheticFixture = {
  domains: unknown;
  items: SyntheticItem[];
  profiles: { gates: { operator: string }[] }[];
  specialists: { itemIds: string[] }[];
  ontologyRelations: { targetNodeId: string }[];
};

function readFixture(): SyntheticFixture {
  return JSON.parse(readFileSync(fixturePath, "utf8")) as SyntheticFixture;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function collectFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const paths: string[] = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      paths.push(...collectFiles(full));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      paths.push(full);
    }
  }
  return paths;
}

describe("Phase 1 contracts and schemas", () => {
  it("A) accepts a valid synthetic bundle", () => {
    const fixture = readFixture();
    const schemaResult = validateContentSchema(fixture);
    expect(schemaResult.success).toBe(true);
    expect(schemaResult.issues).toEqual([]);

    const semantics = validateContentSemantics(schemaResult.value!);
    expect(semantics.success).toBe(true);
    expect(semantics.issues).toEqual([]);
  });

  it("B) rejects malformed records", () => {
    const malformed = deepClone(readFixture());
    malformed.domains = "bad";
    const schemaResult = validateContentSchema(malformed);
    expect(schemaResult.success).toBe(false);
    expect(schemaResult.issues.length).toBeGreaterThan(0);
  });

  it("C) rejects duplicate IDs", () => {
    const duplicate = deepClone(readFixture());
    duplicate.items = [...duplicate.items, duplicate.items[0]];
    const schemaResult = validateContentSchema(duplicate);
    expect(schemaResult.success).toBe(true);
    expect(validateContentSemantics(schemaResult.value!).success).toBe(false);
  });

  it("D) rejects unknown construct references", () => {
    const unknownConstruct = deepClone(readFixture());
    unknownConstruct.items[0].scoring.contributions[0].constructId = "construct:missing";
    const schemaResult = validateContentSchema(unknownConstruct);
    expect(schemaResult.success).toBe(true);
    expect(validateContentSemantics(schemaResult.value!).success).toBe(false);
  });

  it("E) rejects missing explicit item mappings", () => {
    const missingMap = deepClone(readFixture());
    missingMap.items[0].scoring.contributions = [];
    const schemaResult = validateContentSchema(missingMap);
    expect(schemaResult.success).toBe(false);
  });

  it("F) rejects invalid weights", () => {
    const invalidWeight = deepClone(readFixture());
    invalidWeight.items[0].scoring.contributions[0].weight = 0;
    const schemaResult = validateContentSchema(invalidWeight);
    expect(schemaResult.success).toBe(false);
  });

  it("G) rejects malformed gates", () => {
    const malformedGate = deepClone(readFixture());
    malformedGate.profiles[0].gates[0].operator = "bad-gate";
    const schemaResult = validateContentSchema(malformedGate);
    expect(schemaResult.success).toBe(false);
  });

  it("H) rejects statement options with no mapping", () => {
    const missingOptionMap = deepClone(readFixture());
    missingOptionMap.items[3].options[0].contributions = [];
    const schemaResult = validateContentSchema(missingOptionMap);
    expect(schemaResult.success).toBe(false);
  });

  it("I) rejects specialist modules with unknown items", () => {
    const specialistItem = deepClone(readFixture());
    specialistItem.specialists[0].itemIds = ["item:does-not-exist"];
    const schemaResult = validateContentSchema(specialistItem);
    expect(schemaResult.success).toBe(true);
    expect(validateContentSemantics(schemaResult.value!).success).toBe(false);
  });

  it("J) rejects broken ontology edges", () => {
    const brokenEdge = deepClone(readFixture());
    brokenEdge.ontologyRelations[0].targetNodeId = "node:does-not-exist";
    const schemaResult = validateContentSchema(brokenEdge);
    expect(schemaResult.success).toBe(true);
    expect(validateContentSemantics(schemaResult.value!).success).toBe(false);
  });

  it("K) stable serialization is deterministic for semantically equivalent order", () => {
    const first = deepClone(readFixture());
    const second = deepClone(readFixture());
    second.items = [...second.items].reverse();
    second.constructs = [...second.constructs].reverse();
    expect(stableSerialize(first)).toBe(stableSerialize(second));
  });

  it("L) deterministic fingerprint behavior", () => {
    const first = deepClone(readFixture());
    const ordered = computeContentFingerprint(first);

    const reordered = deepClone(readFixture());
    reordered.constructs = [...reordered.constructs].reverse();
    reordered.items = [...reordered.items].reverse();
    expect(computeContentFingerprint(reordered)).toBe(ordered);

    const scoringChange = deepClone(readFixture());
    scoringChange.items[0].scoring.contributions[0].weight = 2.25;
    expect(computeContentFingerprint(scoringChange)).not.toBe(ordered);
  });

  it("L2) excluded metadata changes do not alter fingerprint", () => {
    const first = deepClone(readFixture());
    const second = deepClone(readFixture());
    second.domains[0].display.shortLabel = "Alternative Label";
    expect(computeContentFingerprint(first)).toBe(computeContentFingerprint(second));
  });

  it("N) version fields are separate contracts", () => {
    const fixture = readFixture() as SyntheticFixture & { metadata: Record<string, string> };
    expect(new Set([
      fixture.metadata.contentSchemaVersion,
      fixture.metadata.contentVersion,
      fixture.metadata.scoringVersion,
      fixture.metadata.resultSchemaVersion,
      fixture.metadata.responseSchemaVersion,
      fixture.metadata.researchSchemaVersion,
    ]).size).toBe(6);
  });

  it("O) keeps response states as distinct round-trippable states", () => {
    const answeredRaw: RawResponse = {
      state: "answered",
      itemId: createItemId("item:desc-likert5"),
      responseType: "likert5",
      value: 2,
    };
    const missingRaw: RawResponse = {
      state: "missing",
      itemId: createItemId("item:desc-likert5"),
    };
    const skippedRaw: RawResponse = {
      state: "skipped",
      itemId: createItemId("item:desc-likert5"),
    };
    const abstainedRaw: RawResponse = {
      state: "abstained",
      itemId: createItemId("item:desc-likert5"),
    };
    const refusedRaw: RawResponse = {
      state: "refused",
      itemId: createItemId("item:desc-likert5"),
    };

    expect(isAnsweredResponse(answeredRaw)).toBe(true);
    expect(isMissingResponse(missingRaw)).toBe(true);
    expect(isAbstainedResponse(abstainedRaw)).toBe(true);
    expect(isRefusedResponse(refusedRaw)).toBe(true);
    expect(isAnsweredResponse(missingRaw)).toBe(false);
    expect(isSkippedResponse(skippedRaw)).toBe(true);
    expect(isMissingResponse(missingRaw)).toBe(true);
  });
});

describe("Phase 1 architecture enforcement", () => {
  it("P) detects forbidden v1 imports inside v2 runtime", () => {
    const files = collectFiles(path.join(process.cwd(), "v2"));
    const forbiddenPath = /(\/|\\)src\/(data|domain|scoring|production|specialist|validation|research)\//;
    const violations: string[] = [];
    const importPattern = /(?:import|export)\s+(?:[^'"]+\s+from\s+)?["']([^"']+)["']/g;

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      const matches = [...source.matchAll(importPattern)];
      for (const match of matches) {
        const spec = match[1];
        if (forbiddenPath.test(spec.replaceAll("\\", "/"))) {
          violations.push(`${file} -> ${spec}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
