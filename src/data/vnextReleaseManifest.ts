import { vnextChallengerSpecifications } from "./vnextChallengers";
import { vnextConstructRegistry } from "./vnextConstructs";
import { vnextEvidenceCards } from "./vnextEvidenceCards";
import { vnextGraphEdges } from "./vnextGraph";
import { vnextItemAnnotations } from "./vnextItemAnnotations";
import { vnextOntologyNodes } from "./vnextOntology";
import {
  vnextSurfaceManifests,
  vnextSurfaceManifestBySurface,
  vnextSurfaceFingerprint,
} from "./vnextSurfaceManifests";
import { vnextValidationManifest } from "./vnextValidationManifest";
import { CURRENT_RESEARCH_VERSION_BUNDLE } from "../validation/researchContracts";
import type { VNextReleaseManifest } from "../types";
import {
  VNEXT_AUDITED_CANDIDATE_COMMIT,
  VNEXT_CALIBRATION_VERSION,
  VNEXT_CHALLENGER_MODELS_VERSION,
  VNEXT_CONSTRUCTS_VERSION,
  VNEXT_EVIDENCE_CARD_VERSION,
  VNEXT_FACET_MAP_VERSION,
  VNEXT_FROZEN_BASELINE_COMMIT,
  VNEXT_GRAPH_VERSION,
  VNEXT_ITEM_ANNOTATIONS_VERSION,
  VNEXT_ONTOLOGY_VERSION,
  VNEXT_RELEASE_MANIFEST_VERSION,
  VNEXT_ROLE_POLICY_VERSION,
  VNEXT_SHADOW_SCORING_VERSION,
  VNEXT_SURFACE_MANIFEST_VERSION,
  VNEXT_VALIDATION_MANIFEST_VERSION,
} from "../validation/vnextVersions";

function fingerprint(values: readonly string[]): string {
  return vnextSurfaceFingerprint([...values].sort());
}

export const vnextReleaseManifest: VNextReleaseManifest = {
  manifestId: "vnext-release-manifest:2026-08-candidate-e298ccd",
  manifestVersion: VNEXT_RELEASE_MANIFEST_VERSION,
  candidateCommit: VNEXT_AUDITED_CANDIDATE_COMMIT,
  auditedCandidateCommit: VNEXT_AUDITED_CANDIDATE_COMMIT,
  frozenBaselineCommit: VNEXT_FROZEN_BASELINE_COMMIT,
  branch: "codex/vnext-implementation",
  reference: "candidate-under-audit:e298ccd5588708528db4b63e3e33ce6f19230d69",
  versionTuple: {
    ...CURRENT_RESEARCH_VERSION_BUNDLE,
    vnextOntologyVersion: VNEXT_ONTOLOGY_VERSION,
    vnextGraphVersion: VNEXT_GRAPH_VERSION,
    vnextRolePolicyVersion: VNEXT_ROLE_POLICY_VERSION,
    vnextConstructsVersion: VNEXT_CONSTRUCTS_VERSION,
    vnextFacetMapVersion: VNEXT_FACET_MAP_VERSION,
    vnextItemAnnotationsVersion: VNEXT_ITEM_ANNOTATIONS_VERSION,
    vnextEvidenceCardVersion: VNEXT_EVIDENCE_CARD_VERSION,
    vnextValidationManifestVersion: VNEXT_VALIDATION_MANIFEST_VERSION,
    vnextChallengerModelsVersion: VNEXT_CHALLENGER_MODELS_VERSION,
    vnextCalibrationVersion: VNEXT_CALIBRATION_VERSION,
    vnextShadowScoringVersion: VNEXT_SHADOW_SCORING_VERSION,
    vnextSurfaceManifestVersion: VNEXT_SURFACE_MANIFEST_VERSION,
  },
  fingerprints: {
    ontology: fingerprint(
      vnextOntologyNodes.map(
        (node) =>
          `${node.id}:${node.version}:${node.conceptualKind}:${node.constitutiveFacetIds.join(",")}`,
      ),
    ),
    graph: fingerprint(
      vnextGraphEdges.map(
        (edge) =>
          `${edge.id}:${edge.graphVersion}:${edge.scope}:${edge.facet.differentiatingConstructIds?.join(",") ?? ""}`,
      ),
    ),
    constructs: fingerprint(
      [
        ...vnextConstructRegistry.roots,
        ...vnextConstructRegistry.facets,
        ...vnextConstructRegistry.localConstructs,
      ].map((record) => record.id),
    ),
    coreItems: vnextSurfaceManifestBySurface.get("core")!.itemFingerprint,
    specialistItems:
      vnextSurfaceManifestBySurface.get("specialist")!.itemFingerprint,
    itemAnnotations: fingerprint(
      vnextItemAnnotations.map(
        (annotation) =>
          `${annotation.itemId}:${annotation.intendedRootIds.join(",")}:${annotation.facetIds.join(",")}:${annotation.localConstructIds.join(",")}`,
      ),
    ),
    surfaces: fingerprint(
      vnextSurfaceManifests.map(
        (manifest) =>
          `${manifest.manifestId}:${manifest.itemFingerprint}:${manifest.formFingerprint}`,
      ),
    ),
    validation: fingerprint([vnextValidationManifest.itemFingerprint]),
    challengers: fingerprint(
      vnextChallengerSpecifications.map(
        (specification) =>
          `${specification.id}:${specification.surfaceManifestId}:${specification.itemIds.join(",")}`,
      ),
    ),
    evidenceCards: fingerprint(
      vnextEvidenceCards.map(
        (card) =>
          `${card.cardId}:${card.cardVersion}:${card.constructScope.join(",")}`,
      ),
    ),
  },
  qualityGateResults: {
    status: "candidate-remediation-pending-final-gate",
    frozenV13Regression: "passed-and-preserved",
    generatedArtifacts: "passed-by-vnext:items:check",
    unitTests: 808,
    browserTests: 57,
    accessibilityTests: 8,
    ecwTests: 28,
    rSyntaxFiles: 12,
    researchChecks: "passed",
    workerDryRun: "passed",
  },
  p1Findings: [
    {
      id: "P1-01",
      status: "closed",
      implementationUnits: ["I-002", "I-006"],
      evidence: [
        "src/data/vnextOntology.ts",
        "src/data/vnextGraph.ts",
        "src/validation/vnextGraph.ts",
      ],
    },
    {
      id: "P1-02",
      status: "closed",
      implementationUnits: ["I-003", "I-006"],
      evidence: [
        "src/data/vnextRolePolicy.ts",
        "src/validation/vnextRoleResolver.ts",
      ],
    },
    {
      id: "P1-03",
      status: "closed",
      implementationUnits: ["I-004", "I-006"],
      evidence: [
        "src/data/vnextConstructs.ts",
        "src/validation/vnextConstructs.ts",
      ],
    },
    {
      id: "P1-04",
      status: "closed",
      implementationUnits: ["I-005", "I-006"],
      evidence: [
        "scripts/generate-vnext-item-manifest.mjs",
        "src/validation/vnextItems.ts",
        "npm run vnext:items:check",
      ],
    },
    {
      id: "P1-05",
      status: "closed",
      implementationUnits: ["I-008", "I-009"],
      evidence: [
        "src/data/vnextSurfaceManifests.ts",
        "src/validation/vnextSurfaceManifests.ts",
        "src/data/vnextChallengers.ts",
      ],
    },
    {
      id: "P1-06",
      status: "closed",
      implementationUnits: ["I-018"],
      evidence: [
        "src/data/vnextReleaseManifest.ts",
        "release-manifest/vnext-release-manifest.json",
        ".github/workflows/ci.yml",
      ],
    },
  ],
  implementationUnits: {
    "I-001": "complete",
    "I-002": "complete",
    "I-003": "complete",
    "I-004": "complete",
    "I-005": "complete",
    "I-006": "complete",
    "I-007": "complete",
    "I-008": "complete",
    "I-009": "complete",
    "I-010": "complete",
    "I-011": "complete",
    "I-012": "respondent-gated",
    "I-013": "respondent-gated",
    "I-014": "respondent-gated",
    "I-015": "respondent-gated",
    "I-016": "cutover-gated",
    "I-017": "cutover-gated",
    "I-018": "complete",
  },
  releaseStatus: "candidate-remediation-pending-final-gate",
  auditSignoff: {
    state: "pending-independent-review",
    target: "latest-release-readiness-audit-2026-08",
    reviewer: "unassigned",
  },
  rollbackReference: VNEXT_FROZEN_BASELINE_COMMIT,
  outstandingEmpiricalGates: [
    "V2 cognitive response-process evidence",
    "V5 internal structure and facet separability",
    "V6-V13 reliability, retest, criterion, fairness, replication, calibration, and display-value evidence",
    "M0/M1 held-out compositional residual tests for every compound card",
  ],
  outstandingGovernanceGates: [
    "independent release audit/signoff",
    "promotion decision records for any public vNext endpoint",
    "explicit decision for any future v13-to-vNext cutover",
  ],
  outstandingDeploymentGates: [
    "merge decision and production deployment approval",
    "post-merge CI and browser evidence on the final release commit",
  ],
};

export const vnextReleaseManifestById = new Map([
  [vnextReleaseManifest.manifestId, vnextReleaseManifest],
]);
