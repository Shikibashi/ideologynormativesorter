import { readFile, writeFile } from "node:fs/promises";

const bundle = JSON.parse(await readFile(new URL("../generated/content.bundle.json", import.meta.url), "utf8"));
const items = bundle.items.filter((item) => item.status === "active").map((item) => ({
  id: item.id,
  role: item.role,
  responseType: item.responseType,
  scaleMin: item.scaleMin,
  scaleMax: item.scaleMax,
  scaleStep: item.scaleStep,
  moduleId: item.moduleId,
  optionIds: item.options?.map((option) => option.id) ?? [],
})).sort((a, b) => a.id.localeCompare(b.id));
const registry = {
  researchSchemaVersion: "research-v2.phase13.1",
  researchProtocolVersion: "research-protocol-v2.phase13.1",
  consentVersion: "consent-v2.phase13.1",
  maxPayloadBytes: 131072,
  metadata: {
    contentSchemaVersion: bundle.metadata.contentSchemaVersion,
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    scoringVersion: bundle.metadata.scoringVersion,
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    resultSchemaVersion: bundle.metadata.resultSchemaVersion,
  },
  items,
  specialistModules: bundle.specialistModules.map((module) => ({ id: module.id, itemIds: [...module.itemIds].sort() })).sort((a, b) => a.id.localeCompare(b.id)),
};
await writeFile(new URL("../research-worker/generated/acceptance-registry.json", import.meta.url), `${JSON.stringify(registry, null, 2)}\n`);
console.log(JSON.stringify({ items: items.length, coreItems: items.filter((item) => item.role === "core").length, specialistItems: items.filter((item) => item.role === "specialist").length, modules: registry.specialistModules.length, contentFingerprint: registry.metadata.contentFingerprint }));
