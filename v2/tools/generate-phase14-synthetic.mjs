import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const bundle = JSON.parse(await readFile(new URL("generated/content.bundle.json", root)));
const registry = JSON.parse(await readFile(new URL("research-worker/generated/acceptance-registry.json", root)));
const output = new URL("research/fixtures/phase14-synthetic.ndjson", root);
const canonicalize = (value) => JSON.stringify(sortValue(value));
const sortValue = (value) => Array.isArray(value) ? value.map(sortValue) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortValue(value[key])])) : value;
const activeCore = registry.items.filter((item) => item.role === "core");
const lines = [];
for (let subject = 1; subject <= 40; subject += 1) {
  const suffix = subject.toString(16).padStart(12, "0");
  const responses = activeCore.map((item, itemIndex) => {
    if (item.responseType === "statement-choice") {
      const optionIds = item.optionIds ?? [];
      return { state: "answered", itemId: item.id, responseType: "statement-choice", optionId: optionIds[subject % optionIds.length] ?? optionIds[0] };
    }
    const min = item.scaleMin ?? 1;
    const max = item.scaleMax ?? (item.responseType === "likert7" ? 7 : 5);
    return { state: "answered", itemId: item.id, responseType: item.responseType, value: min + ((subject + itemIndex) % (max - min + 1)) };
  });
  lines.push(canonicalize({
    researchSchemaVersion: registry.researchSchemaVersion,
    researchProtocolVersion: registry.researchProtocolVersion,
    consentVersion: registry.consentVersion,
    submissionId: `rs_00000000-0000-4000-8000-${suffix}`,
    contentSchemaVersion: bundle.metadata.contentSchemaVersion,
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    scoringVersion: bundle.metadata.scoringVersion,
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    resultSchemaVersion: bundle.metadata.resultSchemaVersion,
    consent: { granted: true, consentVersion: registry.consentVersion, consentedAt: `2026-01-01T00:00:${String(subject).padStart(2, "0")}.000Z`, purpose: "instrument-research", identityLinkage: "none" },
    responses: { core: responses, specialist: [], requestedSpecialistModuleIds: [] },
  }));
}
await mkdir(new URL("../research/fixtures/", import.meta.url), { recursive: true });
await writeFile(output, `${lines.join("\n")}\n`);
console.log(JSON.stringify({ output: output.pathname, submissions: lines.length, coreItems: activeCore.length }));
