import type { CanonicalContentBundle } from "../../../contracts/src";
import { SAVE_SCHEMA_VERSION, type PrivateAssessmentSave, type SaveFreshness } from "../types";

export function evaluateSavedAssessmentFreshness(save: PrivateAssessmentSave, bundle: CanonicalContentBundle): SaveFreshness {
  if (save.saveSchemaVersion !== SAVE_SCHEMA_VERSION) return { kind: "incompatible", reason: "save_schema_version_mismatch" };
  if (save.contentFingerprint !== bundle.metadata.contentFingerprint) return { kind: "incompatible", reason: "content_fingerprint_mismatch", savedContentFingerprint: save.contentFingerprint, currentContentFingerprint: bundle.metadata.contentFingerprint };
  if (save.responseSchemaVersion !== bundle.metadata.responseSchemaVersion) return { kind: "incompatible", reason: "response_schema_version_mismatch" };
  if (save.scoringVersion !== bundle.metadata.scoringVersion || save.contentVersion !== bundle.metadata.contentVersion) return { kind: "replay_required", reason: "scoring_version_changed", savedContentFingerprint: save.contentFingerprint, currentContentFingerprint: bundle.metadata.contentFingerprint };
  return { kind: "exact_match", reason: "exact_versions", savedContentFingerprint: save.contentFingerprint, currentContentFingerprint: bundle.metadata.contentFingerprint };
}

export function cachedResultMatchesCurrentVersions(save: PrivateAssessmentSave, bundle: CanonicalContentBundle): boolean {
  const result = save.cachedResult;
  return result !== undefined && result.contentFingerprint === bundle.metadata.contentFingerprint && result.contentVersion === bundle.metadata.contentVersion && result.scoringVersion === bundle.metadata.scoringVersion && result.responseSchemaVersion === bundle.metadata.responseSchemaVersion;
}
