import { vnextEvidenceCards } from "./vnextEvidenceCards";
import {
  VNEXT_CALIBRATION_VERSION,
  VNEXT_FROZEN_BASELINE_COMMIT,
  VNEXT_ROBUSTNESS_VERSION,
  VNEXT_UNCERTAINTY_VERSION,
} from "../validation/vnextVersions";
import type { VNextCalibrationContract } from "../types";

export const vnextCalibrationContract: VNextCalibrationContract = {
  contractId: "vnext-calibration-robustness-design-2026-08",
  contractVersion: VNEXT_CALIBRATION_VERSION,
  objectIds: vnextEvidenceCards.map((card) => card.labelId),
  constructScore: {
    scale: "versioned construct/facet estimate with explicit measured mask",
    orientation:
      "item and facet direction declared per annotation; no implicit sign flips",
    referencePopulation: "not authorized before respondent validation",
    form: "exact form fingerprint required",
    missingnessPolicy:
      "no imputation of unasked, refused, dont_know, or module-nonselected constructs",
    expectedPrecision: "preregistered per construct, depth, and declared scope",
    criterionForMeaningfulDifference:
      "preregistered interval/margin rule, not bounded numeric range",
  },
  reliability: {
    status: "not-started",
    estimand:
      "Respondent-level score precision/reliability in the declared construct and form scope.",
    method: "model-based",
    itemCountOnly: false,
    precisionMetric:
      "conditional precision or information plus declared reliability estimand",
    uncertaintyMethod:
      "preregistered respondent-level interval or repeated-split method",
  },
  uncertainty: {
    status: "not-started",
    estimand:
      "Empirical uncertainty and instability of construct, affinity, margin, and abstention outputs.",
    method: "repeated-split",
  },
  difInvariance: {
    status: "not-started",
    estimand:
      "Item, construct, score, label, and display comparability within named groups/languages/forms.",
    groups: [],
    languages: [],
    minimumUsableNPerGroup: 100,
    observedUsableNByGroup: {},
    invarianceSequence: [
      "configural",
      "metric/loading",
      "scalar/threshold",
      "residual-if-required",
      "partial-or-approximate",
      "score/display-consequences",
    ],
    difMethod: "preregistered uniform/nonuniform DIF model",
    effectSizeRule: "not-started",
    intervalMethod: "not-started",
    multipleTestingMethod: "not-started",
    anchorStrategy: "not-started",
    scoreAndDisplayConsequences: [
      "restrict scope",
      "revise item",
      "abstain",
      "hold public claim",
    ],
  },
  formEquivalence: {
    status: "not-started",
    estimand: "construct-score",
    formFingerprints: [],
    presentedItemIds: {},
    anchorItems: [],
    sampleOverlap: "not-started",
    heldOutEvaluation: "not-started",
    itemCountOnly: false,
  },
  robustness: {
    status: "not-started",
    omissionAnalyses: [
      "leave-one-item-out",
      "leave-one-facet-out",
      "high-cross-loading omission",
      "high-desirability/specialized-knowledge omission",
    ],
    missingnessAnalyses: [
      "observed missingness",
      "refusal",
      "dont_know",
      "depth omission",
      "module nonselection",
      "no-imputation alternative",
    ],
    scoringAlternatives: [
      "declared versus respondent-estimated weights",
      "independent-axis versus covariance-adjusted distance",
      "root versus facet",
      "hard versus soft gates",
      "alternate margin/tie policy",
    ],
    trackedOutputs: [
      "construct/facet scores",
      "measured masks",
      "Primary rank/margin/abstention",
      "Modifier eligibility",
      "Specialist stability",
      "uncertainty",
      "claim ceiling",
    ],
    preregistered: false,
  },
  neighborMargins: {
    status: "not-started",
    estimand:
      "Held-out neighbor margin, tie, false-positive, and abstention behavior for each named object.",
    heldOut: false,
  },
  claimTierCeiling: "PC0",
  multiplicity: {
    family: "object/component/scope-specific preregistered hypotheses",
    method: "not-started; must be declared before confirmatory analysis",
    hypotheses: 0,
    preregistered: false,
  },
  subgroupManifest: {
    declaredGroups: [],
    voluntary: true,
    inferredFromAnswers: false,
    minimumUsableNPerGroup: 100,
    intersectionalLimitations: [
      "No subgroup claim is authorized without explicit consented scope and adequate data.",
    ],
  },
  versionBundle: {
    vnextCalibrationVersion: VNEXT_CALIBRATION_VERSION,
    vnextUncertaintyVersion: VNEXT_UNCERTAINTY_VERSION,
    vnextRobustnessVersion: VNEXT_ROBUSTNESS_VERSION,
    frozenProductionBaselineCommit: VNEXT_FROZEN_BASELINE_COMMIT,
  },
  provenance: [
    "docs/empirical-validation-architecture-2026-08.md",
    "I-010",
    "D-120",
    "D-121",
    "D-122",
    "D-123",
  ],
};
