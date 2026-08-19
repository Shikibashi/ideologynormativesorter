import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const fixed = JSON.parse(readFileSync(resolve(root, "v2/reference/v1/manifest.json"), "utf8"));
const replay = JSON.parse(readFileSync(resolve(root, "v2/reference/replay-manifest.json"), "utf8"));
const cases = JSON.parse(readFileSync(resolve(root, "v2/reference/cases/manifest.json"), "utf8"));
const ledger = JSON.parse(readFileSync(resolve(root, "v2/reference/migration-behavior-ledger.json"), "utf8"));
const bundleManifest = JSON.parse(readFileSync(resolve(root, "v2/generated/content-manifest.json"), "utf8"));
const coverage = JSON.parse(readFileSync(resolve(root, "v2/reference/reference-coverage.json"), "utf8"));
const differentialReport = readFileSync(resolve(root, "docs/v2/generated/differential-report.md"), "utf8");
const coverageReport = readFileSync(resolve(root, "docs/v2/reference-coverage.md"), "utf8");

const errors = [];
if (fixed.referenceCommit !== "f0324dbf27dfc6e35ff557992e4643e3df15ee0e") errors.push("v1 reference commit drift");
if (replay.referenceCommit !== fixed.referenceCommit) errors.push("replay manifest is not bound to the frozen commit");
if (cases.contentFingerprint !== bundleManifest.contentFingerprint) errors.push("case manifest content fingerprint drift");
if (coverage.contentFingerprint !== bundleManifest.contentFingerprint) errors.push("machine coverage fingerprint drift");
if (!differentialReport.includes(bundleManifest.contentFingerprint)) errors.push("differential report is stale");
if (!coverageReport.includes(bundleManifest.contentFingerprint)) errors.push("coverage report is stale");
const behaviorIds = new Set();
for (const behavior of ledger.behaviors) {
  if (behaviorIds.has(behavior.id)) errors.push(`duplicate behavior ${behavior.id}`);
  behaviorIds.add(behavior.id);
  if (behavior.status !== "covered") errors.push(`uncovered behavior ${behavior.id}`);
  if (!Array.isArray(behavior.fixtures) || behavior.fixtures.length === 0) errors.push(`behavior without fixture ${behavior.id}`);
}
for (const entry of cases.cases) {
  for (const path of [entry.input, entry.expectedV1, entry.expectedV2]) if (!existsSync(resolve(root, path))) errors.push(`missing case artifact ${path}`);
  for (const behaviorId of entry.expectedDifferences) if (!behaviorIds.has(behaviorId)) errors.push(`unclassified case difference ${behaviorId}`);
}
if (process.env.V2_REFERENCE_UPDATE === "1" && !existsSync(resolve(root, "v2/reference/fixture-update-receipt.json"))) errors.push("fixture update requested without explicit fixture-update-receipt.json");
if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`reference verified: ${cases.cases.length} cases, ${ledger.behaviors.length} behaviors, ${fixed.referenceCommit}`);
}
