import { vnextEvidenceCards } from "./vnextEvidenceCards";
import {
  vnextSpecialistItemIdsByModule,
  vnextSurfaceManifestBySurface,
} from "./vnextSurfaceManifests";
import {
  VNEXT_CHALLENGER_MODELS_VERSION,
  VNEXT_FROZEN_BASELINE_COMMIT,
  VNEXT_VALIDATION_MANIFEST_VERSION,
} from "../validation/vnextVersions";
import type {
  VNextChallengerSpecification,
  VNextMissingnessPolicy,
} from "../types";

const MISSINGNESS_POLICY: VNextMissingnessPolicy = {
  substantiveStates: ["answered"],
  missingStates: [
    "dont_know",
    "prefer_not_to_answer",
    "refusal",
    "omitted",
    "invalid",
  ],
  refusalHandling:
    "Retain refusal as an explicit missingness state and report it by construct, group, form, and module.",
  moduleNonselectionHandling:
    "Do not treat a nonselected Specialist module as negative evidence for its candidates.",
  completeCaseIsDefault: false,
};

const common = {
  version: VNEXT_CHALLENGER_MODELS_VERSION,
  objectIds: vnextEvidenceCards
    .filter((card) => card.productRole === "primary")
    .map((card) => card.labelId),
  itemIds: vnextSurfaceManifestBySurface.get("core")!.itemIds,
  surfaceManifestId: vnextSurfaceManifestBySurface.get("core")!.manifestId,
  heldOutSplit: "confirmation" as const,
  seed: 20260815,
  preregistrationId: "vnext-preregistration-pending-respondent-wave",
  versionBundle: {
    vnextChallengerModelsVersion: VNEXT_CHALLENGER_MODELS_VERSION,
    vnextValidationManifestVersion: VNEXT_VALIDATION_MANIFEST_VERSION,
    frozenProductionBaselineCommit: VNEXT_FROZEN_BASELINE_COMMIT,
  },
  missingnessPolicy: MISSINGNESS_POLICY,
};

const baseChallengerSpecifications: readonly VNextChallengerSpecification[] = [
  {
    ...common,
    id: "production-baseline-v13",
    family: "production-baseline",
    estimand:
      "Reproduce the frozen production compatibility/profile behavior in the declared held-out split.",
    modelParameters: { scorer: "frozen-v13", postHocRetuning: false },
    provenance: ["src/scoring", "src/research/versions.ts", "I-009"],
  },
  {
    ...common,
    id: "theory-led-multidimensional-vnext",
    family: "theory-led-multidimensional",
    estimand:
      "Compare the declared root/facet configuration against the frozen baseline without post-hoc factor invention.",
    modelParameters: {
      structure: "declared-roots-and-facets",
      crossLoadingReview: true,
    },
    provenance: [
      "src/data/vnextConstructs.ts",
      "docs/empirical-validation-architecture-2026-08.md",
      "I-009",
    ],
  },
  {
    ...common,
    id: "respondent-lca-vnext",
    family: "lca",
    estimand:
      "Describe respondent class/profile heterogeneity as a challenger, not as named ideology membership.",
    modelParameters: {
      classes: "preregistered-range",
      localMaxima: "reported",
      entropy: "reported",
    },
    provenance: ["docs/empirical-validation-architecture-2026-08.md", "I-009"],
  },
  {
    ...common,
    id: "respondent-lpa-vnext",
    family: "lpa",
    estimand:
      "Describe continuous respondent profile heterogeneity and its replication behavior separately from named labels.",
    modelParameters: {
      profiles: "preregistered-range",
      covariance: "declared",
    },
    provenance: ["docs/empirical-validation-architecture-2026-08.md", "I-009"],
  },
  {
    ...common,
    id: "respondent-profile-clustering-vnext",
    family: "profile-clustering",
    estimand:
      "Test whether robust respondent profiles recur under preregistered distance and missingness alternatives.",
    modelParameters: {
      distance: "theory-declared",
      resampling: "preregistered",
    },
    provenance: ["docs/empirical-validation-architecture-2026-08.md", "I-009"],
  },
  {
    ...common,
    id: "respondent-network-vnext",
    family: "network",
    estimand:
      "Estimate only preregistered conditional/residual relations; do not reinterpret a network as a latent ideology taxonomy.",
    modelParameters: { edges: "preregistered", regularization: "declared" },
    provenance: ["docs/empirical-validation-architecture-2026-08.md", "I-009"],
  },
];

const specialistChallengers = [...vnextSpecialistItemIdsByModule.entries()].map(
  ([moduleId, itemIds]) => ({
    ...common,
    id: `specialist-${moduleId}-vnext`,
    family: "theory-led-multidimensional" as const,
    moduleId,
    itemIds,
    surfaceManifestId:
      vnextSurfaceManifestBySurface.get("specialist")!.manifestId,
    objectIds: vnextEvidenceCards
      .filter((card) => card.moduleId === moduleId)
      .map((card) => card.labelId),
    estimand:
      "Compare one declared Specialist module-local construct surface without changing the ordinary Primary result.",
    modelParameters: {
      structure: "module-local",
      moduleId,
      crossLoadingReview: true,
    },
    provenance: [
      "src/specialist/index.ts",
      "src/data/vnextSurfaceManifests.ts",
      "I-009",
      "D-107",
    ],
  }),
);

export const vnextChallengerSpecifications: readonly VNextChallengerSpecification[] =
  [...baseChallengerSpecifications, ...specialistChallengers];

export const vnextChallengerSpecificationById = new Map(
  vnextChallengerSpecifications.map((specification) => [
    specification.id,
    specification,
  ]),
);
