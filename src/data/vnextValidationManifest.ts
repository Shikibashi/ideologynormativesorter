import { questions } from "./effectiveQuestions";
import { researchFormFingerprint } from "../research/forms";
import { vnextEvidenceCards } from "./vnextEvidenceCards";
import { vnextItemAnnotations } from "./vnextItemAnnotations";
import { CURRENT_RESEARCH_VERSION_BUNDLE } from "../validation/researchContracts";
import {
  VNEXT_ITEM_ANNOTATIONS_VERSION,
  VNEXT_VALIDATION_MANIFEST_VERSION,
  VNEXT_FROZEN_BASELINE_COMMIT,
  VNEXT_RELEASE_CANDIDATE_COMMIT,
} from "../validation/vnextVersions";
import { vnextSurfaceManifests } from "./vnextSurfaceManifests";
import type {
  VNextAnalysisSplit,
  VNextValidationManifest,
  VNextSplitRule,
} from "../types";

const SPLIT_RULES: readonly VNextSplitRule[] = [
  {
    split: "development",
    unit: "respondent",
    assignment: "preregistered-random",
    itemLevelRandomizationAllowed: false,
    leakageRule:
      "Keep every administration for a respondent in one split unless a retest linkage rule is explicitly preregistered.",
  },
  {
    split: "tuning",
    unit: "respondent",
    assignment: "preregistered-random",
    itemLevelRandomizationAllowed: false,
    leakageRule:
      "Tuning may not read confirmation, criterion, subgroup, or replication outcomes.",
  },
  {
    split: "confirmation",
    unit: "respondent",
    assignment: "preregistered-random",
    itemLevelRandomizationAllowed: false,
    leakageRule:
      "Confirmation is untouched by item, weight, threshold, and model retuning.",
  },
  {
    split: "retest",
    unit: "respondent-administration",
    assignment: "linked-retest",
    itemLevelRandomizationAllowed: false,
    leakageRule:
      "Retest responses are linked but cannot enter initial tuning or item selection.",
  },
  {
    split: "criterion",
    unit: "respondent-administration",
    assignment: "prospective-wave",
    itemLevelRandomizationAllowed: false,
    leakageRule:
      "Criterion observations remain independent or temporally separated from tuning.",
  },
  {
    split: "subgroup-form",
    unit: "respondent",
    assignment: "declared-subgroup-form",
    itemLevelRandomizationAllowed: false,
    leakageRule:
      "Group and form comparisons use declared scope and minimum denominators.",
  },
  {
    split: "replication",
    unit: "respondent",
    assignment: "prospective-wave",
    itemLevelRandomizationAllowed: false,
    leakageRule:
      "Replication is independent or prospective and cannot inherit a tuned result without its manifest.",
  },
];

const itemIds = vnextItemAnnotations.map((annotation) => annotation.itemId);
const formFingerprint = researchFormFingerprint([...questions]);

export const vnextValidationManifest: VNextValidationManifest = {
  manifestId: "vnext-validation-manifest-2026-08-v0",
  manifestVersion: VNEXT_VALIDATION_MANIFEST_VERSION,
  stage: "V0",
  preregistration: {
    id: "vnext-preregistration-pending-respondent-wave",
    status: "design-ready",
    hypotheses: [
      "Respondent evidence must be evaluated separately for each construct, label, module, form, and declared scope.",
      "Missingness, exposure, and presentation conditions must not be collapsed into an endorsement score.",
    ],
    estimands: [
      "Object-specific construct/profile behavior under the declared measured mask.",
      "Object-specific separability, precision, uncertainty, and criterion behavior only after the relevant stage is preregistered.",
    ],
    decisionRules: [
      "No evidence component may be marked pass without preregistered respondent data and its decision rule.",
      "No respondent, item, or criterion may cross a development/confirmation boundary through item-level splitting.",
    ],
  },
  objectIds: vnextEvidenceCards.map((card) => card.labelId),
  evidenceCardIds: vnextEvidenceCards.map((card) => card.cardId),
  scope: {
    population: "not authorized before respondent validation protocol approval",
    language: "not authorized",
    region: "not authorized",
    form: "current-v13-core-form plus separately declared Specialist modules",
    time: "not authorized",
  },
  versionBundle: {
    ...CURRENT_RESEARCH_VERSION_BUNDLE,
    vnextValidationManifestVersion: VNEXT_VALIDATION_MANIFEST_VERSION,
    vnextItemAnnotationsVersion: VNEXT_ITEM_ANNOTATIONS_VERSION,
    frozenProductionBaselineCommit: VNEXT_FROZEN_BASELINE_COMMIT,
  },
  codeRevision: VNEXT_RELEASE_CANDIDATE_COMMIT,
  frozenProductionBaselineRevision: VNEXT_FROZEN_BASELINE_COMMIT,
  surfaceManifestIds: vnextSurfaceManifests.map(
    (manifest) => manifest.manifestId,
  ),
  seed: 0,
  itemFingerprint: `${VNEXT_ITEM_ANNOTATIONS_VERSION}:${itemIds.join("|")}`,
  optionFingerprint: `${VNEXT_ITEM_ANNOTATIONS_VERSION}:statement-choice-options-v1`,
  formFingerprint,
  formId: "vnext-core-form-design-only",
  manifestPurpose: "aggregate-design-only",
  analysisSurface: "none",
  analysisEligible: false,
  surfaceInterpretation:
    "Aggregate 406-item design inventory only. It must never be consumed as a core, Specialist, production-baseline, task, expert, or bridge analysis surface.",
  itemIds,
  itemVersions: Object.fromEntries(
    itemIds.map((itemId) => [itemId, VNEXT_ITEM_ANNOTATIONS_VERSION]),
  ),
  splitRules: SPLIT_RULES,
  sampleMembership: [],
  responses: [],
  criteria: [],
  inclusionManifestId: "vnext-inclusion-manifest-pending-respondent-wave",
  analysisManifestIds: ["vnext-analysis-manifest-pending-respondent-wave"],
  estimand:
    "No respondent estimate is authorized by the design-only V0 manifest.",
  claimTierCeiling: "PC0",
  componentLinks: Object.fromEntries(
    vnextEvidenceCards.map((card) => [card.cardId, []]),
  ),
  dataDictionary: [
    "rawAnswer is retained separately from codedValue and responseState.",
    "dont_know, prefer_not_to_answer, refusal, omitted, and invalid are missingness states, not substantive directional answers.",
    "Label exposure arm and timing are required for any criterion interpretation.",
    "Sample split membership is respondent-level unless a preregistered leakage-safe retest design says otherwise.",
  ],
};

export function splitRuleFor(
  split: VNextAnalysisSplit,
): VNextSplitRule | undefined {
  return SPLIT_RULES.find((rule) => rule.split === split);
}
