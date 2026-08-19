import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const registry = JSON.parse(await read("v2/research-worker/generated/acceptance-registry.json"));
const migration = await read("v2/research-worker/migrations/0001_create_research_submissions.sql");
const worker = await read("v2/research-worker/src/worker.mjs");
const inventory = {
  contentFingerprint: registry.metadata.contentFingerprint,
  contentVersion: registry.metadata.contentVersion,
  researchSchemaVersion: registry.researchSchemaVersion,
  responseSchemaVersion: registry.metadata.responseSchemaVersion,
  scoringVersion: registry.metadata.scoringVersion,
  resultSchemaVersion: registry.metadata.resultSchemaVersion,
  coreItems: registry.items.filter((item) => item.role === "core").length,
  specialistItems: registry.items.filter((item) => item.role === "specialist").length,
  modules: registry.specialistModules.length,
  activeItems: registry.items.length,
  maxPayloadBytes: registry.maxPayloadBytes,
};
await mkdir(new URL("docs/v2/generated/", root), { recursive: true });
await writeFile(new URL("docs/v2/generated/research-inventory.json", root), `${JSON.stringify(inventory, null, 2)}\n`);
await writeFile(new URL("docs/v2/generated/content-inventory.md", root), `# v2 Research Acceptance Inventory\n\nGenerated from the Phase 12 canonical content bundle and the Phase 13 acceptance registry.\n\n- Core items: ${inventory.coreItems}\n- Specialist items: ${inventory.specialistItems}\n- Active accepted items: ${inventory.activeItems}\n- Specialist modules: ${inventory.modules}\n- Content version: \`${inventory.contentVersion}\`\n- Content fingerprint: \`${inventory.contentFingerprint}\`\n- Research schema: \`${inventory.researchSchemaVersion}\`\n- Response schema: \`${inventory.responseSchemaVersion}\`\n- Scoring version binding: \`${inventory.scoringVersion}\`\n- Result schema binding: \`${inventory.resultSchemaVersion}\`\n`);
const receipt = {
  phase: "13",
  status: process.env.RESEARCH_TESTS_VERIFIED === "true" ? "GO" : "NO-GO",
  researchSchemaVersion: registry.researchSchemaVersion,
  researchProtocolVersion: registry.researchProtocolVersion,
  consentVersion: registry.consentVersion,
  acceptedVersions: registry.metadata,
  activeAcceptedItems: inventory.activeItems,
  coreItems: inventory.coreItems,
  specialistItems: inventory.specialistItems,
  specialistModules: inventory.modules,
  maxPayloadBytes: registry.maxPayloadBytes,
  d1MigrationFingerprint: hash(migration),
  workerSourceFingerprint: hash(Buffer.concat([worker, Buffer.from(JSON.stringify(registry))])),
  productionWritesEnabled: false,
  notes: [
    "Phase 13 readiness is scoped to the isolated v2 research infrastructure.",
    "The repository-wide legacy v1 suite retains five pre-existing failures in untouched files: canonical manifest fingerprint, three legacy Worker compatibility cases, and one primary measurement disclosure case.",
  ],
  verification: {
    typecheck: process.env.RESEARCH_TYPECHECK_VERIFIED === "true",
    unitTests: process.env.RESEARCH_UNIT_TESTS_VERIFIED === "true",
    workerTests: process.env.RESEARCH_WORKER_TESTS_VERIFIED === "true",
    d1Migration: process.env.RESEARCH_D1_VERIFIED === "true",
    browserTests: process.env.RESEARCH_BROWSER_TESTS_VERIFIED === "true",
    architectureBoundary: process.env.RESEARCH_ARCHITECTURE_VERIFIED === "true",
  },
};
await mkdir(new URL("v2/research/", root), { recursive: true });
await writeFile(new URL("v2/research/research-readiness-receipt.json", root), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt));
