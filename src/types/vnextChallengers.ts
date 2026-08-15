export const VNEXT_CHALLENGER_FAMILIES = [
  "production-baseline",
  "theory-led-multidimensional",
  "lca",
  "lpa",
  "profile-clustering",
  "network",
] as const;
export type VNextChallengerFamily = (typeof VNEXT_CHALLENGER_FAMILIES)[number];

export type VNextChallengerRunStatus =
  | "not-run"
  | "converged"
  | "nonconverged"
  | "insufficient-data"
  | "failed";

export interface VNextMissingnessPolicy {
  substantiveStates: readonly string[];
  missingStates: readonly string[];
  refusalHandling: string;
  moduleNonselectionHandling: string;
  completeCaseIsDefault: false;
}

export interface VNextChallengerSpecification {
  id: string;
  version: string;
  family: VNextChallengerFamily;
  objectIds: readonly string[];
  itemIds: readonly string[];
  estimand: string;
  heldOutSplit: "confirmation" | "replication";
  seed: number;
  preregistrationId: string;
  versionBundle: Readonly<Record<string, string>>;
  missingnessPolicy: VNextMissingnessPolicy;
  modelParameters: Readonly<Record<string, string | number | boolean>>;
  provenance: readonly string[];
}

export interface VNextChallengerResult {
  specificationId: string;
  runId: string;
  status: VNextChallengerRunStatus;
  split: VNextChallengerSpecification["heldOutSplit"];
  seed: number;
  usableN?: number;
  effectiveN?: number;
  missingnessSummary: Readonly<Record<string, number>>;
  convergence: {
    converged: boolean;
    iterations?: number;
    reason: string;
  };
  estimates?: Readonly<Record<string, unknown>>;
  uncertainty?: Readonly<Record<string, unknown>>;
  disagreementReviewQueue: readonly VNextModelDisagreement[];
  artifactLinks: readonly string[];
}

export interface VNextModelDisagreement {
  id: string;
  baselineModelId: string;
  challengerModelId: string;
  objectId?: string;
  disagreement:
    | "structure"
    | "profile"
    | "criterion"
    | "group-form"
    | "missingness";
  reviewRequired: true;
  defaultDisposition:
    | "hold-score-change"
    | "treat-as-challenger"
    | "restrict-scope";
  reason: string;
}
