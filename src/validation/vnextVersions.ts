/**
 * Version identifiers for the additive vNext research contracts.
 *
 * This module is intentionally separate from the frozen production/research
 * bundle in `src/research/versions.ts`: adding a vNext registry must not
 * relabel an existing respondent record or change production meaning.
 */
export const VNEXT_BASELINE_CHECK_VERSION =
  "2026-08-vnext-baseline-check-v1" as const;
export const VNEXT_ONTOLOGY_VERSION = "2026-08-vnext-ontology-v1" as const;
export const VNEXT_GRAPH_VERSION = "2026-08-vnext-graph-v1" as const;
export const VNEXT_ROLE_POLICY_VERSION =
  "2026-08-vnext-role-policy-v1" as const;
export const VNEXT_ROSTER_INTEGRITY_VERSION =
  "2026-08-vnext-roster-integrity-v1" as const;
export const VNEXT_CONSTRUCTS_VERSION = "2026-08-vnext-constructs-v1" as const;
export const VNEXT_FACET_MAP_VERSION = "2026-08-vnext-facet-map-v1" as const;
export const VNEXT_ITEM_ANNOTATIONS_VERSION =
  "2026-08-vnext-item-annotations-v1" as const;
export const VNEXT_ITEM_DISPOSITIONS_VERSION =
  "2026-08-vnext-item-dispositions-v1" as const;
export const VNEXT_EVIDENCE_CARD_VERSION =
  "2026-08-vnext-evidence-card-v1" as const;
export const VNEXT_PROMOTION_RECORD_VERSION =
  "2026-08-vnext-promotion-record-v1" as const;
export const VNEXT_VALIDATION_MANIFEST_VERSION =
  "2026-08-vnext-validation-manifest-v1" as const;
export const VNEXT_CHALLENGER_MODELS_VERSION =
  "2026-08-vnext-challenger-models-v1" as const;
export const VNEXT_CALIBRATION_VERSION =
  "2026-08-vnext-calibration-v1" as const;
export const VNEXT_UNCERTAINTY_VERSION =
  "2026-08-vnext-uncertainty-v1" as const;
export const VNEXT_ROBUSTNESS_VERSION = "2026-08-vnext-robustness-v1" as const;
export const VNEXT_SHADOW_SCORING_VERSION =
  "2026-08-vnext-shadow-scoring-v1" as const;
export const VNEXT_SURFACE_MANIFEST_VERSION =
  "2026-08-vnext-surface-manifests-v1" as const;
export const VNEXT_RELEASE_MANIFEST_VERSION =
  "2026-08-vnext-release-manifest-v1" as const;

export const VNEXT_FROZEN_BASELINE_COMMIT =
  "f0324dbf27dfc6e35ff557992e4643e3df15ee0e" as const;
export const VNEXT_AUDITED_CANDIDATE_COMMIT =
  "e298ccd5588708528db4b63e3e33ce6f19230d69" as const;

export const VNEXT_IMPLEMENTATION_DECISION_IDS = [
  "I-001",
  "I-002",
  "I-003",
  "I-004",
  "I-005",
  "I-006",
  "I-007",
  "I-008",
  "I-009",
  "I-010",
  "I-011",
  "I-012",
  "I-013",
  "I-014",
  "I-015",
  "I-016",
  "I-017",
  "I-018",
] as const;
