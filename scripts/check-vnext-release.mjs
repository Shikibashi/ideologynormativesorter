import fs from "node:fs";
import { execFileSync } from "node:child_process";

const manifestPath = "release-manifest/vnext-release-manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const candidate = "e298ccd5588708528db4b63e3e33ce6f19230d69";
const baseline = "f0324dbf27dfc6e35ff557992e4643e3df15ee0e";
const expectedFingerprints = {
  ontology: "vnext_cd79f416",
  graph: "vnext_9305c022",
  constructs: "vnext_bdba44fb",
  coreItems: "vnext_ccf53979",
  specialistItems: "vnext_f473b915",
  itemAnnotations: "vnext_9d8d2f09",
  surfaces: "vnext_217fbb32",
  validation: "vnext_14697783",
  challengers: "vnext_fb04132b",
  evidenceCards: "vnext_b526b927",
};
const errors = [];
if (
  manifest.candidateCommit !== candidate ||
  manifest.auditedCandidateCommit !== candidate
)
  errors.push(
    "release manifest candidate revision drifted from the audited candidate",
  );
if (
  manifest.frozenBaselineCommit !== baseline ||
  manifest.rollbackReference !== baseline
)
  errors.push("release manifest frozen baseline/rollback reference drifted");
if (manifest.candidateCommit === manifest.frozenBaselineCommit)
  errors.push("candidate and frozen baseline must be distinct");
if (
  !/^[0-9a-f]{40}$/.test(manifest.candidateCommit) ||
  !/^[0-9a-f]{40}$/.test(manifest.frozenBaselineCommit)
)
  errors.push("release revisions must be full commit SHAs");
try {
  execFileSync("git", ["merge-base", "--is-ancestor", candidate, "HEAD"], {
    stdio: "ignore",
  });
} catch {
  errors.push("current checkout is not a descendant of the audited candidate");
}
if (manifest.manifestVersion !== "2026-08-vnext-release-manifest-v1")
  errors.push("release manifest version is stale");
if (!manifest.branch || !manifest.reference)
  errors.push("release provenance is incomplete");
const requiredFingerprints = [
  "ontology",
  "graph",
  "constructs",
  "coreItems",
  "specialistItems",
  "itemAnnotations",
  "surfaces",
  "validation",
  "challengers",
  "evidenceCards",
];
for (const key of requiredFingerprints)
  if (!String(manifest.fingerprints?.[key] ?? "").trim())
    errors.push(`missing fingerprint ${key}`);
for (const [key, expected] of Object.entries(expectedFingerprints))
  if (manifest.fingerprints?.[key] !== expected)
    errors.push(
      `fingerprint ${key} does not match the audited candidate artifact`,
    );
const p1 = new Map(
  (manifest.p1Findings ?? []).map((finding) => [finding.id, finding]),
);
for (let index = 1; index <= 6; index += 1) {
  const finding = p1.get(`P1-0${index}`);
  if (
    !finding ||
    finding.status !== "closed" ||
    finding.implementationUnits?.length === 0
  )
    errors.push(`P1-0${index} is not closed and traceable`);
}
if (Object.keys(manifest.implementationUnits ?? {}).length !== 18)
  errors.push("implementation-unit parity is not I-001 through I-018");
if (
  !Array.isArray(manifest.outstandingEmpiricalGates) ||
  manifest.outstandingEmpiricalGates.length === 0
)
  errors.push("empirical gates were not preserved");
if (
  !Array.isArray(manifest.outstandingGovernanceGates) ||
  manifest.outstandingGovernanceGates.length === 0
)
  errors.push("governance gates were not preserved");
if (
  !Array.isArray(manifest.outstandingDeploymentGates) ||
  manifest.outstandingDeploymentGates.length === 0
)
  errors.push("deployment gates were not preserved");
if (errors.length > 0) {
  console.error(
    `vNext release manifest check failed:\n- ${errors.join("\n- ")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    "vNext release manifest check passed: candidate provenance, P1 closure, parity, fingerprints, rollback, and external gates are present.",
  );
}
