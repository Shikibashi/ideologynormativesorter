import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import {
  compileContent,
  type ContentInventory,
} from "../packages/content/src/index";
import type {
  CanonicalContentBundle,
  ItemRecord,
  ScoringContribution,
} from "../packages/contracts/src/index";

const root = process.cwd();
const sourceRoot = path.join(root, "v2/content");
const generatedRoot = path.join(root, "v2/generated");
const inventoryPath = path.join(root, "docs/v2/generated/content-inventory.md");

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(path.join(sourceRoot, relativePath), "utf8")) as T;
}

function writeJson(relativePath: string, value: unknown): void {
  const target = path.join(generatedRoot, relativePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

interface ItemMappingCorrection {
  readonly itemId: string;
  readonly status: "active" | "inactive";
  readonly contributions: readonly ScoringContribution[];
  readonly rationale: string;
}

function applyItemMappingCorrections(
  items: CanonicalContentBundle["items"],
  corrections: readonly ItemMappingCorrection[],
): CanonicalContentBundle["items"] {
  const itemIds = new Set(items.map((item) => String(item.id)));
  const seen = new Set<string>();
  for (const correction of corrections) {
    if (!correction.itemId || seen.has(correction.itemId)) {
      throw new Error(`Invalid or duplicate item mapping correction: ${correction.itemId}`);
    }
    seen.add(correction.itemId);
    if (!itemIds.has(correction.itemId)) {
      throw new Error(`Item mapping correction references unknown item ${correction.itemId}`);
    }
    if (correction.contributions.length === 0) {
      throw new Error(`Item mapping correction ${correction.itemId} has no contributions`);
    }
    if (!correction.rationale.trim()) {
      throw new Error(`Item mapping correction ${correction.itemId} requires a rationale`);
    }
  }

  return items.map((item) => {
    const correction = corrections.find((entry) => entry.itemId === String(item.id));
    if (!correction) return item;
    if (item.responseType === "statement-choice") {
      throw new Error(`Item mapping correction ${correction.itemId} cannot patch statement-choice mappings`);
    }
    return {
      ...item,
      status: correction.status,
      scoring: {
        mappingMode: "item",
        contributions: correction.contributions.map((entry) => ({ ...entry })),
      },
      reviewStatus: "reviewed-commitment-alignment-v1",
      contextNote: `${item.contextNote ?? ""}${item.contextNote ? " " : ""}Scoring mapping reviewed for commitment alignment: ${correction.rationale}`,
    } satisfies ItemRecord;
  });
}

function loadBundle(): CanonicalContentBundle {
  const manifest = readJson<{
    metadata: CanonicalContentBundle["metadata"];
    files: {
      domains: string;
      constructs: Record<string, string>;
      items: Record<string, string>;
      itemCorrections: string;
      profiles: Record<string, string>;
      specialists: Record<string, string>;
      ontology: Record<string, string>;
      diagnostics: Record<string, string>;
      provenance: Record<string, string>;
    };
  }>("manifest.json");
  const read = (file: string) => readJson<unknown>(file);
  const items = Object.values(manifest.files.items).flatMap(
    (file) => read(file) as CanonicalContentBundle["items"],
  );
  const corrections = readJson<ItemMappingCorrection[]>(manifest.files.itemCorrections);
  return {
    metadata: manifest.metadata,
    domains: read(manifest.files.domains) as CanonicalContentBundle["domains"],
    constructs: Object.values(manifest.files.constructs).flatMap((file) => read(file) as CanonicalContentBundle["constructs"]),
    items: applyItemMappingCorrections(items, corrections),
    profiles: read(manifest.files.profiles.primary) as CanonicalContentBundle["profiles"],
    modifiers: read(manifest.files.profiles.modifiers) as CanonicalContentBundle["modifiers"],
    specialists: read(manifest.files.profiles.specialists) as CanonicalContentBundle["specialists"],
    specialistModules: read(manifest.files.specialists.modules) as CanonicalContentBundle["specialistModules"],
    specialistCandidates: read(manifest.files.specialists.candidates) as CanonicalContentBundle["specialistCandidates"],
    specialistAssignment: read(manifest.files.specialists.assignment) as CanonicalContentBundle["specialistAssignment"],
    ontologyNodes: read(manifest.files.ontology.nodes) as CanonicalContentBundle["ontologyNodes"],
    ontologyRelations: read(manifest.files.ontology.relations) as CanonicalContentBundle["ontologyRelations"],
    diagnosticRelations: read(manifest.files.diagnostics.relations) as CanonicalContentBundle["diagnosticRelations"],
    provenanceSources: read(manifest.files.provenance.sources) as CanonicalContentBundle["provenanceSources"],
  };
}

function markdownInventory(inventory: ContentInventory): string {
  const responseRows = Object.entries(inventory.responseTypes)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([type, count]) => `| ${type} | ${count} |`)
    .join("\n");
  return `# Generated v2 content inventory

This file is generated by v2/tools/compile-content.ts. It is not a content authority.

## Identity

- Content version: ${inventory.contentVersion}
- Content fingerprint: ${inventory.contentFingerprint}

## Counts

| Category | Count |
| --- | ---: |
| Domains | ${inventory.domains} |
| Root constructs | ${inventory.constructsRoot} |
| Specialist-local constructs | ${inventory.constructsSpecialist} |
| Total constructs | ${inventory.constructsTotal} |
| Core items | ${inventory.coreItems} |
| Specialist items | ${inventory.specialistItems} |
| Reversed items | ${inventory.reversedItems} |
| Statement-choice items | ${inventory.statementChoiceItems} |
| Primary profiles | ${inventory.primaryProfiles} |
| Modifiers | ${inventory.modifierProfiles} |
| Specialist profiles | ${inventory.specialistProfiles} |
| Specialist candidates | ${inventory.specialistCandidates} |
| Specialist modules | ${inventory.specialistModules} |
| Ontology nodes | ${inventory.ontologyNodes} |
| Ontology relations | ${inventory.ontologyRelations} |
| Diagnostic relations | ${inventory.diagnosticRelations} |
| Explicit contribution mappings | ${inventory.explicitContributionMappings} |

## Construct families

| Family | Count |
| --- | ---: |
${Object.entries(inventory.constructsByFamily)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([family, count]) => `| ${family} | ${count} |`)
  .join("\n")}

## Response types

| Response type | Count |
| --- | ---: |
${responseRows}
`;
}

function validateDeclaredJsonSchema(bundle: CanonicalContentBundle): void {
  const ajv = new Ajv({ allErrors: true });
  const schemaDirectory = path.join(
    root,
    "v2/packages/content/schemas",
  );
  const schemaFiles = [
    "content-schema.schema.json",
    "contribution.schema.json",
    "requirement.schema.json",
    "gate.schema.json",
    "domain.schema.json",
    "construct.schema.json",
    "item.schema.json",
    "profile.schema.json",
    "modifier.schema.json",
    "specialist.schema.json",
    "specialist-module.schema.json",
    "specialist-candidate.schema.json",
    "specialist-assignment.schema.json",
    "ontology-node.schema.json",
    "ontology-relation.schema.json",
    "diagnostic-relation.schema.json",
    "provenance-source.schema.json",
    "manifest.schema.json",
  ];
  for (const file of schemaFiles) {
    const schema = JSON.parse(
      readFileSync(path.join(schemaDirectory, file), "utf8"),
    ) as Record<string, unknown>;
    ajv.addSchema(schema);
  }
  const validate = ajv.getSchema(
    "https://example.com/v2/content-manifest.schema.json",
  );
  if (!validate || !validate(bundle)) {
    throw new Error(
      `Declared JSON schema validation failed: ${JSON.stringify(validate?.errors ?? [])}`,
    );
  }
}

const inputBundle = loadBundle();
validateDeclaredJsonSchema(inputBundle);
const compiled = compileContent(inputBundle);
writeFileSync(
  path.join(generatedRoot, "content.bundle.json"),
  `${compiled.serialized}\n`,
  "utf8",
);
writeJson("content-manifest.json", {
  artifactVersion: "v2-content-bundle-1",
  sourceManifest: "v2/content/manifest.json",
  contentVersion: compiled.inventory.contentVersion,
  contentFingerprint: compiled.fingerprint,
  counts: compiled.inventory,
  serializedBytes: Buffer.byteLength(compiled.serialized, "utf8"),
});
mkdirSync(path.dirname(inventoryPath), { recursive: true });
writeFileSync(inventoryPath, markdownInventory(compiled.inventory), "utf8");
console.log(JSON.stringify(compiled.inventory, null, 2));
