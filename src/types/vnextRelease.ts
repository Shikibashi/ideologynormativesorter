export type VNextP1Status = "closed";

export interface VNextReleaseManifest {
  manifestId: string;
  manifestVersion: string;
  candidateCommit: string;
  auditedCandidateCommit: string;
  historicalAuditCandidateCommit?: string;
  candidateBinding: "exact-head" | "parent-bound-finalization";
  releaseMetadataParentCommit: string;
  frozenBaselineCommit: string;
  branch: string;
  reference: string;
  versionTuple: Readonly<Record<string, string>>;
  fingerprints: Readonly<Record<string, string>>;
  qualityGateResults: Readonly<Record<string, string | number | boolean>>;
  p1Findings: readonly {
    id: string;
    status: VNextP1Status;
    implementationUnits: readonly string[];
    evidence: readonly string[];
  }[];
  implementationUnits: Readonly<
    Record<
      string,
      "complete" | "respondent-gated" | "cutover-gated" | "deployment-gated"
    >
  >;
  releaseStatus:
    | "candidate-ready-for-merge-decision"
    | "candidate-remediation-pending-final-gate";
  auditSignoff: Readonly<{
    state: "pending-independent-review" | "recorded";
    target: string;
    reviewer: string;
  }>;
  rollbackReference: string;
  outstandingEmpiricalGates: readonly string[];
  outstandingGovernanceGates: readonly string[];
  outstandingDeploymentGates: readonly string[];
}
