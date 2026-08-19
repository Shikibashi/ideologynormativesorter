import { mkdir, readFile, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

const registry = JSON.parse(await readFile(new URL("../research-worker/generated/acceptance-registry.json", import.meta.url), "utf8"));
const started = performance.now();
const missing = (item) => ({ state: "missing", itemId: item.id });
const envelope = {
  researchSchemaVersion: registry.researchSchemaVersion,
  researchProtocolVersion: registry.researchProtocolVersion,
  consentVersion: registry.consentVersion,
  submissionId: "rs_00000000-0000-4000-8000-000000000001",
  ...registry.metadata,
  consent: { granted: true, consentVersion: registry.consentVersion, consentedAt: "2026-08-19T12:00:00.000Z", purpose: "instrument-research", identityLinkage: "none" },
  responses: { core: registry.items.filter((item) => item.role === "core").map(missing), specialist: registry.items.filter((item) => item.role === "specialist").map(missing), requestedSpecialistModuleIds: registry.specialistModules.map((module) => module.id) },
};
const payload = JSON.stringify(envelope);
const bytes = new TextEncoder().encode(payload).byteLength;
const elapsed = performance.now() - started;
await mkdir(new URL("../../docs/v2/generated/", import.meta.url), { recursive: true });
await writeFile(new URL("../../docs/v2/generated/research-performance.json", import.meta.url), `${JSON.stringify({ contentFingerprint: registry.metadata.contentFingerprint, payloadBytes: bytes, maxPayloadBytes: registry.maxPayloadBytes, withinLimit: bytes <= registry.maxPayloadBytes, projectionMilliseconds: Number(elapsed.toFixed(3)) }, null, 2)}\n`);
console.log(JSON.stringify({ payloadBytes: bytes, maxPayloadBytes: registry.maxPayloadBytes, withinLimit: bytes <= registry.maxPayloadBytes, projectionMilliseconds: Number(elapsed.toFixed(3)) }));
