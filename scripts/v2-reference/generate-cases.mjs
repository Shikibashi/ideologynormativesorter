import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const bundle = JSON.parse(readFileSync(resolve(root, "v2/generated/content.bundle.json"), "utf8"));
const outRoot = resolve(root, "v2/reference/cases");
const activeCore = bundle.items.filter((item) => item.role === "core" && item.status === "active").sort((a, b) => a.id.localeCompare(b.id));
const modules = [...bundle.specialistModules].sort((a, b) => a.id.localeCompare(b.id));

function answered(item, index, mode) {
  if (item.responseType === "statement-choice") {
    const option = item.options[mode === "alternating" && index % 2 ? item.options.length - 1 : 0];
    return { state: "answered", itemId: item.id, responseType: item.responseType, optionId: option.id };
  }
  const maximum = item.responseType === "likert5" ? 2 : 3;
  let value = 0;
  if (mode === "max") value = maximum;
  if (mode === "alternating") value = index % 2 ? -maximum : maximum;
  if (mode === "random") value = ((index * 17 + 11) % (maximum * 2 + 1)) - maximum;
  const response = { state: "answered", itemId: item.id, responseType: item.responseType, value };
  if (item.layer === "descriptive" && mode === "salience-low") response.confidence = 1;
  if (item.layer === "prescriptive" && mode === "salience-low") response.priority = 1;
  if (item.layer === "descriptive" && (mode === "max" || mode === "salience-high")) response.confidence = 5;
  if (item.layer === "prescriptive" && (mode === "max" || mode === "salience-high")) response.priority = 5;
  return response;
}

function coreResponses(mode) {
  if (mode === "empty") return [];
  if (mode === "min") return activeCore.slice(0, 1).map((item, index) => answered(item, index, "mid"));
  if (mode === "statement") return activeCore.filter((item) => item.responseType === "statement-choice").map((item, index) => answered(item, index, "alternating"));
  if (mode === "mixed") return activeCore.slice(0, 5).map((item, index) => index === 0 ? answered(item, index, "max") : ({ state: ["missing", "skipped", "abstained", "refused"][index - 1], itemId: item.id }));
  return activeCore.map((item, index) => answered(item, index, mode));
}

function specialistResponses(module, mode = "max") {
  return module.itemIds.map((id, index) => {
    const item = bundle.items.find((candidate) => candidate.id === id);
    return answered(item, index, mode);
  });
}

const definitions = [
  ["empty-core", "No core responses; every construct must remain explicitly unmeasured.", "empty", [], ["K-003", "KD-007", "KD-008"]],
  ["min-core", "One answered core item with all other items absent.", "min", [], ["K-002", "P-002"]],
  ["complete-core", "The complete active core corpus is answered deterministically.", "max", [], ["V-001", "V-003", "VER-001", "VER-002", "VER-003"]],
  ["mid-core", "All core Likert values at midpoint and statement options at their first choice.", "mid", [], ["K-001", "P-003"]],
  ["max-core", "All active core items at their positive endpoint.", "max", [], ["C-001", "P-005", "M-002"]],
  ["alternating-core", "Deterministic alternating endpoints across every core item.", "alternating", [], ["D-002", "VER-002"]],
  ["mixed-states", "Answered, missing, skipped, abstained, and refused states in one input.", "mixed", [], ["S-001", "S-002", "S-003", "S-004", "K-004"]],
  ["statement-choice", "Every statement-choice item is answered explicitly by option ID.", "statement", [], ["ST-001", "ST-002", "C-003"]],
  ["salience-low", "Non-normative items use minimum valid confidence or priority.", "salience-low", [], ["SA-001", "SA-002", "SA-004"]],
  ["salience-high", "Non-normative items use maximum confidence or priority.", "salience-high", [], ["SA-001", "SA-002", "SA-003"]],
  ["random-seed-20260819", "Fixed-seed deterministic pseudo-random core responses.", "random", [], ["P-005", "VER-002"]],
  ["boundary-thresholds", "Small evidence boundary input used for gate, tie, and strict validation checks.", "min", [], ["V-002", "V-004", "N-004", "P-004", "KD-009"]],
];

const cases = [];
for (const [id, description, mode, requestedSpecialistModuleIds, expectedDifferences] of definitions) {
  const directory = resolve(outRoot, id);
  mkdirSync(directory, { recursive: true });
  const input = {
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    coreResponses: coreResponses(mode),
    specialistResponses: [],
    requestedSpecialistModuleIds,
  };
  writeFileSync(resolve(directory, "input.json"), `${JSON.stringify(input, null, 2)}\n`);
  cases.push({ id, description, classificationScope: ["scoring", "reference-oracle"], input: `v2/reference/cases/${id}/input.json`, expectedV1: `v2/reference/cases/${id}/expected-v1.json`, expectedV2: `v2/reference/cases/${id}/expected-v2.json`, expectedDifferences, sourceVersion: { contentVersion: String(bundle.metadata.contentVersion), contentFingerprint: String(bundle.metadata.contentFingerprint), scoringVersion: String(bundle.metadata.scoringVersion) }, rationaleRefs: ["docs/v2/reference-oracle.md", "docs/v2/behavioral-migration-receipt.md"] });
}
for (const module of modules) {
  const id = `specialist-${module.id}`;
  const directory = resolve(outRoot, id);
  mkdirSync(directory, { recursive: true });
  const input = { responseSchemaVersion: bundle.metadata.responseSchemaVersion, contentFingerprint: bundle.metadata.contentFingerprint, coreResponses: coreResponses("mid"), specialistResponses: specialistResponses(module), requestedSpecialistModuleIds: [module.id] };
  writeFileSync(resolve(directory, "input.json"), `${JSON.stringify(input, null, 2)}\n`);
  cases.push({ id, description: `All items in specialist module ${module.id} answered with explicit activation.`, classificationScope: ["specialists", "reference-oracle"], input: `v2/reference/cases/${id}/input.json`, expectedV1: `v2/reference/cases/${id}/expected-v1.json`, expectedV2: `v2/reference/cases/${id}/expected-v2.json`, expectedDifferences: ["SP-001", "SP-002", "SP-003", "SP-004", "KD-010"], sourceVersion: { contentVersion: String(bundle.metadata.contentVersion), contentFingerprint: String(bundle.metadata.contentFingerprint), scoringVersion: String(bundle.metadata.scoringVersion) }, rationaleRefs: ["docs/v2/reference-oracle.md", "docs/v2/known-defect-lockout.md"] });
}

writeFileSync(resolve(outRoot, "manifest.json"), `${JSON.stringify({ schemaVersion: 1, referenceManifest: "v2/reference/v1/manifest.json", contentFingerprint: bundle.metadata.contentFingerprint, cases }, null, 2)}\n`);
writeFileSync(resolve(root, "v2/reference/replay-manifest.json"), `${JSON.stringify({ schemaVersion: 1, replayVersion: "v2-replay-v2.phase10.1", referenceCommit: "f0324dbf27dfc6e35ff557992e4643e3df15ee0e", caseManifest: "v2/reference/cases/manifest.json", deterministic: true, cases: cases.map(({ id, input, expectedV1, expectedV2 }) => ({ id, input, expectedV1, expectedV2 })) }, null, 2)}\n`);
