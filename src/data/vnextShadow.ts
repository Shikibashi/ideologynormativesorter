import { CURRENT_RESEARCH_VERSION_BUNDLE } from "../validation/researchContracts";
import type { VNextShadowResult } from "../types";
import {
  VNEXT_RELEASE_CANDIDATE_COMMIT,
  VNEXT_CHALLENGER_MODELS_VERSION,
  VNEXT_CONSTRUCTS_VERSION,
  VNEXT_FACET_MAP_VERSION,
  VNEXT_FROZEN_BASELINE_COMMIT,
  VNEXT_GRAPH_VERSION,
  VNEXT_ITEM_ANNOTATIONS_VERSION,
  VNEXT_ONTOLOGY_VERSION,
  VNEXT_ROLE_POLICY_VERSION,
  VNEXT_SHADOW_SCORING_VERSION,
  VNEXT_SURFACE_MANIFEST_VERSION,
} from "../validation/vnextVersions";

export const vnextShadowVersionTuple = {
  ...CURRENT_RESEARCH_VERSION_BUNDLE,
  vnextOntologyVersion: VNEXT_ONTOLOGY_VERSION,
  vnextGraphVersion: VNEXT_GRAPH_VERSION,
  vnextRolePolicyVersion: VNEXT_ROLE_POLICY_VERSION,
  vnextConstructsVersion: VNEXT_CONSTRUCTS_VERSION,
  vnextFacetMapVersion: VNEXT_FACET_MAP_VERSION,
  vnextItemAnnotationsVersion: VNEXT_ITEM_ANNOTATIONS_VERSION,
  vnextSurfaceManifestVersion: VNEXT_SURFACE_MANIFEST_VERSION,
  vnextChallengerModelsVersion: VNEXT_CHALLENGER_MODELS_VERSION,
  vnextShadowScoringVersion: VNEXT_SHADOW_SCORING_VERSION,
  scoringVersion: CURRENT_RESEARCH_VERSION_BUNDLE.scoringVersion,
  codeRevision: VNEXT_RELEASE_CANDIDATE_COMMIT,
  frozenProductionBaselineRevision: VNEXT_FROZEN_BASELINE_COMMIT,
};

/** Empty fail-closed result shape used until a declared research run exists. */
export const vnextShadowResultContract: VNextShadowResult = {
  resultId: "vnext-shadow-contract-no-run",
  researchOnly: true,
  productionConsumed: false,
  failClosed: true,
  versionTuple: vnextShadowVersionTuple,
  surfaceManifestId: "vnext-analysis-surface:core:2026-08-v1",
  itemFingerprint: "not-run",
  missingnessStatus: "not-administered",
  refusalHandling:
    "Refusal, dont-know, omitted, and module nonselection remain missingness states and cannot be coerced into a directional estimate.",
  evidenceStatus: "not-started",
  uncertaintyStatus: "not-estimable",
  claimTierCeiling: "PC0",
  abstentionRationale:
    "No respondent evidence or preregistered shadow run is attached; all facet estimates abstain.",
  rootEstimates: {},
  facetEstimates: [],
  facetEstimationRule:
    "Estimate a facet only from its declared facet-level model and evidence; never reuse a root weight or impute an absent facet.",
  rootWeightReuse: false,
  scoringVersion: VNEXT_SHADOW_SCORING_VERSION,
  questionIds: [],
  rootScores: [],
  facetScores: [],
  measuredLayerMask: {
    normative: false,
    descriptive: false,
    prescriptive: false,
  },
  excludedItemIds: [],
  warnings: [],
  claimCeiling: "PC0",
};
