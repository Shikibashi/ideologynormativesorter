// Decision IDs: D-04, D-21, D-26.
// The empty manifest is intentional: anchor selection is held until the first
// confirmation study. It prevents research preparation from silently making
// current items longitudinal anchors.
import { RESEARCH_STUDY_ID } from "../research";
import { ANCHOR_ROTATION_VERSION } from "../research/versions";
import type { AnchorRotationManifest, QuestionId } from "../types";

export const researchAnchorManifest: AnchorRotationManifest = {
  version: ANCHOR_ROTATION_VERSION,
  studyId: RESEARCH_STUDY_ID,
  anchors: [],
  rotationRate: 0,
  linkingMethod: "none",
  changedItemReviewRequired: true,
};

export function anchorRotationManifestErrors(
  manifest: AnchorRotationManifest = researchAnchorManifest,
): string[] {
  const errors: string[] = [];
  if (manifest.version !== ANCHOR_ROTATION_VERSION) {
    errors.push("anchor rotation version is not current");
  }
  if (!manifest.studyId.trim())
    errors.push("anchor manifest studyId is required");
  if (manifest.changedItemReviewRequired !== true) {
    errors.push("changed item review must remain required");
  }
  if (
    !Number.isFinite(manifest.rotationRate) ||
    manifest.rotationRate < 0 ||
    manifest.rotationRate > 1
  ) {
    errors.push("rotationRate must be between 0 and 1");
  }
  const itemIds = manifest.anchors.map((anchor) => anchor.questionId);
  if (new Set(itemIds).size !== itemIds.length) {
    errors.push("anchor items must be unique");
  }
  for (const anchor of manifest.anchors) {
    if (!anchor.itemVersion.trim())
      errors.push(`${anchor.questionId} needs an item version`);
    if (!anchor.wave.trim()) errors.push(`${anchor.questionId} needs a wave`);
    if (anchor.axisIds.length === 0)
      errors.push(`${anchor.questionId} needs an axis scope`);
    if (anchor.formVersions.length === 0) {
      errors.push(`${anchor.questionId} needs a form scope`);
    }
    if (anchor.role === "anchor" && manifest.linkingMethod === "none") {
      errors.push("active anchor items require a declared linking method");
    }
  }
  return [...new Set(errors)];
}

export function anchorItemIds(
  manifest: AnchorRotationManifest = researchAnchorManifest,
): QuestionId[] {
  return manifest.anchors
    .filter((anchor) => anchor.role === "anchor")
    .map((anchor) => anchor.questionId);
}

export function assertAnchorRotationManifest(
  manifest: AnchorRotationManifest = researchAnchorManifest,
): void {
  const errors = anchorRotationManifestErrors(manifest);
  if (errors.length > 0) {
    throw new Error(`Anchor rotation manifest violation: ${errors.join("; ")}`);
  }
}
