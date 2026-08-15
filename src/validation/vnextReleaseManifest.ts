import { vnextReleaseManifest } from "../data/vnextReleaseManifest";
import { vnextSurfaceManifestById } from "../data/vnextSurfaceManifests";
import type { VNextReleaseManifest } from "../types";
import {
  VNEXT_AUDITED_CANDIDATE_COMMIT,
  VNEXT_FROZEN_BASELINE_COMMIT,
  VNEXT_RELEASE_MANIFEST_VERSION,
} from "./vnextVersions";

const REQUIRED_P1 = [
  "P1-01",
  "P1-02",
  "P1-03",
  "P1-04",
  "P1-05",
  "P1-06",
] as const;
const EXPECTED_FINGERPRINTS: Readonly<Record<string, string>> = {
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

export function vnextReleaseManifestErrors(
  manifest: VNextReleaseManifest = vnextReleaseManifest,
): string[] {
  const errors: string[] = [];
  if (manifest.manifestVersion !== VNEXT_RELEASE_MANIFEST_VERSION)
    errors.push("release manifest version is stale");
  if (
    manifest.candidateCommit !== VNEXT_AUDITED_CANDIDATE_COMMIT ||
    manifest.auditedCandidateCommit !== VNEXT_AUDITED_CANDIDATE_COMMIT
  )
    errors.push(
      "release manifest candidate revision does not identify the audited candidate",
    );
  if (
    manifest.frozenBaselineCommit !== VNEXT_FROZEN_BASELINE_COMMIT ||
    manifest.rollbackReference !== VNEXT_FROZEN_BASELINE_COMMIT
  )
    errors.push(
      "release manifest does not preserve the frozen baseline rollback reference",
    );
  if (!manifest.branch || !manifest.reference)
    errors.push("release manifest lacks branch/reference provenance");
  for (const key of [
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
  ])
    if (!manifest.fingerprints[key]?.trim())
      errors.push(`release manifest lacks ${key} fingerprint`);
  for (const [key, expected] of Object.entries(EXPECTED_FINGERPRINTS))
    if (manifest.fingerprints[key] !== expected)
      errors.push(
        `release manifest ${key} fingerprint does not match candidate`,
      );
  for (const p1 of REQUIRED_P1) {
    const record = manifest.p1Findings.find((finding) => finding.id === p1);
    if (!record) errors.push(`${p1} is missing from release manifest`);
    else if (record.status !== "closed")
      errors.push(`${p1} is not closed in release manifest`);
    else if (
      record.implementationUnits.length === 0 ||
      record.evidence.length === 0
    )
      errors.push(`${p1} lacks implementation/evidence traceability`);
  }
  if (Object.keys(manifest.implementationUnits).length !== 18)
    errors.push("release manifest does not classify I-001 through I-018");
  for (let index = 1; index <= 18; index += 1)
    if (!manifest.implementationUnits[`I-${String(index).padStart(3, "0")}`])
      errors.push(`I-${String(index).padStart(3, "0")} lacks release status`);
  if (
    manifest.releaseStatus !== "candidate-ready-for-merge-decision" &&
    manifest.releaseStatus !== "candidate-remediation-pending-final-gate"
  )
    errors.push("release status is not recognized");
  if (
    manifest.outstandingEmpiricalGates.length === 0 ||
    manifest.outstandingGovernanceGates.length === 0 ||
    manifest.outstandingDeploymentGates.length === 0
  )
    errors.push("release manifest must preserve outstanding external gates");
  for (const surfaceId of Object.values(manifest.fingerprints).filter((value) =>
    value.startsWith("vnext-analysis-surface:"),
  ))
    if (!vnextSurfaceManifestById.has(surfaceId))
      errors.push(`unknown surface fingerprint reference ${surfaceId}`);
  return [...new Set(errors)];
}

export function assertVNextReleaseManifest(): void {
  const errors = vnextReleaseManifestErrors();
  if (errors.length > 0)
    throw new Error(`vNext release manifest violation: ${errors.join("; ")}`);
}
