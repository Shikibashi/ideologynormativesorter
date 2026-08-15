import fs from "node:fs";
import { execFileSync } from "node:child_process";

const manifestPath = "release-manifest/vnext-release-manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const baseline = "f0324dbf27dfc6e35ff557992e4643e3df15ee0e";
const head = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const expectedFingerprints = {
  ontology: "vnext_4635d133",
  graph: "vnext_31c2a612",
  specialistRelationCoverage: "vnext_069715e3",
  constructs: "vnext_bdba44fb",
  coreItems: "vnext_ccf53979",
  specialistItems: "vnext_f473b915",
  itemAnnotations: "vnext_9d8d2f09",
  surfaces: "vnext_217fbb32",
  validation: "vnext_14697783",
  challengers: "vnext_fb04132b",
  evidenceCards: "vnext_b4c6a2e0",
};
const errors = [];
const candidate = manifest.candidateCommit;
if (
  manifest.candidateCommit !== manifest.auditedCandidateCommit ||
  !/^[0-9a-f]{40}$/.test(candidate)
)
  errors.push("release manifest candidate revision is missing or inconsistent");
if (
  manifest.frozenBaselineCommit !== baseline ||
  manifest.rollbackReference !== baseline
)
  errors.push("release manifest frozen baseline/rollback reference drifted");
if (manifest.candidateCommit === manifest.frozenBaselineCommit)
  errors.push("candidate and frozen baseline must be distinct");
if (!/^[0-9a-f]{40}$/.test(manifest.frozenBaselineCommit))
  errors.push("release revisions must be full commit SHAs");
try {
  if (manifest.candidateBinding === "exact-head") {
    if (head !== candidate)
      errors.push("exact-head release candidate does not equal git HEAD");
  } else if (manifest.candidateBinding === "parent-bound-finalization") {
    const parent = execFileSync("git", ["rev-parse", "HEAD^"], {
      encoding: "utf8",
    }).trim();
    if (manifest.releaseMetadataParentCommit !== candidate)
      errors.push("release metadata parent does not equal candidateCommit");
    if (parent !== candidate)
      errors.push(
        "finalized release metadata is not immediately bound to the exact candidate parent",
      );
  } else {
    errors.push("release manifest lacks the approved candidate binding mode");
  }
} catch {
  errors.push("current checkout cannot be resolved for exact release binding");
}
try {
  execFileSync("git", ["diff", "--quiet", "HEAD", "--"]);
} catch (error) {
  if (error?.status === 1)
    errors.push(
      "tracked working-tree changes are not bound to the release candidate commit",
    );
  else errors.push("current checkout cannot verify tracked working-tree state");
}
if (manifest.manifestVersion !== "2026-08-vnext-release-manifest-v1")
  errors.push("release manifest version is stale");
if (!manifest.branch || !manifest.reference)
  errors.push("release provenance is incomplete");
if (manifest.candidateCommit === manifest.frozenBaselineCommit)
  errors.push("candidate and frozen baseline must be distinct");
const requiredFingerprints = [
  "ontology",
  "graph",
  "specialistRelationCoverage",
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
