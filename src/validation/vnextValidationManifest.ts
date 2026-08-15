import { VNEXT_ANALYSIS_SPLITS, VNEXT_VALIDATION_STAGES } from "../types";
import type { VNextValidationManifest, VNextRawResponseRecord } from "../types";
import { vnextEvidenceCardByCardId } from "../data/vnextEvidenceCards";
import { vnextValidationManifest } from "../data/vnextValidationManifest";
import { vnextSurfaceManifestById } from "../data/vnextSurfaceManifests";

function hasFingerprint(value: string): boolean {
  return value.trim().length >= 8;
}

function responseErrors(response: VNextRawResponseRecord): string[] {
  const errors: string[] = [];
  if (response.order < 0 || !Number.isInteger(response.order)) {
    errors.push(`${response.questionId} has an invalid collection order`);
  }
  if (
    response.responseState === "answered" &&
    typeof response.codedValue !== "number"
  ) {
    errors.push(`${response.questionId} answered without a coded value`);
  }
  if (
    response.responseState !== "answered" &&
    response.codedValue !== undefined
  ) {
    errors.push(
      `${response.questionId} has a substantive coded value for a missing state`,
    );
  }
  if (!response.labelExposureArm.trim())
    errors.push(`${response.questionId} lacks label exposure arm`);
  return errors;
}

export function vnextValidationManifestErrors(
  manifest: VNextValidationManifest = vnextValidationManifest,
): string[] {
  const errors: string[] = [];
  if (!VNEXT_VALIDATION_STAGES.includes(manifest.stage))
    errors.push("validation stage is not V0-V13");
  if (!manifest.preregistration.id.trim())
    errors.push("preregistration ID is required");
  if (manifest.preregistration.status !== "design-ready") {
    errors.push("initial vNext manifest must remain design-ready");
  }
  if (
    manifest.manifestPurpose !== "aggregate-design-only" ||
    manifest.analysisSurface !== "none" ||
    manifest.analysisEligible !== false ||
    !manifest.surfaceInterpretation.includes("never")
  )
    errors.push(
      "aggregate validation manifest is not explicitly blocked from analysis-surface use",
    );
  if (
    manifest.preregistration.hypotheses.length === 0 ||
    manifest.preregistration.estimands.length === 0
  ) {
    errors.push("preregistration must include hypotheses and estimands");
  }
  for (const key of [
    "codeRevision",
    "inclusionManifestId",
    "formId",
    "estimand",
  ]) {
    if (!String(manifest[key as keyof VNextValidationManifest] ?? "").trim()) {
      errors.push(`${key} is required`);
    }
  }
  if (!Number.isInteger(manifest.seed) || manifest.seed < 0)
    errors.push("seed must be a non-negative integer");
  if (!/^[0-9a-f]{40}$/.test(manifest.codeRevision))
    errors.push("codeRevision must be a full candidate commit SHA");
  if (!/^[0-9a-f]{40}$/.test(manifest.frozenProductionBaselineRevision))
    errors.push(
      "frozen production baseline revision must be a full commit SHA",
    );
  if (manifest.codeRevision === manifest.frozenProductionBaselineRevision)
    errors.push("candidate and frozen baseline revisions must be distinct");
  if (manifest.surfaceManifestIds.length === 0)
    errors.push("validation manifest must declare analysis surfaces");
  for (const surfaceManifestId of manifest.surfaceManifestIds)
    if (!vnextSurfaceManifestById.has(surfaceManifestId))
      errors.push(`unknown analysis surface manifest ${surfaceManifestId}`);
  for (const [name, fingerprint] of Object.entries({
    item: manifest.itemFingerprint,
    option: manifest.optionFingerprint,
    form: manifest.formFingerprint,
  })) {
    if (!hasFingerprint(fingerprint))
      errors.push(`${name} fingerprint is missing`);
  }
  if (new Set(manifest.itemIds).size !== manifest.itemIds.length)
    errors.push("item IDs must be unique");
  if (Object.keys(manifest.itemVersions).length !== manifest.itemIds.length) {
    errors.push("every item must have an exact item-version record");
  }
  const splits = new Set(manifest.splitRules.map((rule) => rule.split));
  for (const split of VNEXT_ANALYSIS_SPLITS) {
    if (!splits.has(split)) errors.push(`missing split rule ${split}`);
  }
  if (manifest.splitRules.some((rule) => rule.itemLevelRandomizationAllowed)) {
    errors.push("item-level random splitting is forbidden");
  }
  const members = new Map(
    manifest.sampleMembership.map((membership) => [
      membership.administrationId,
      membership,
    ]),
  );
  if (members.size !== manifest.sampleMembership.length)
    errors.push("sample membership administration IDs must be unique");
  for (const response of manifest.responses) {
    errors.push(...responseErrors(response));
    const membership = members.get(response.administrationId);
    if (membership && membership.split !== response.split) {
      errors.push(
        `${response.administrationId} crosses declared split membership`,
      );
    }
    if (!manifest.itemIds.includes(response.questionId))
      errors.push(`${response.questionId} is outside the manifest item set`);
    if (manifest.itemVersions[response.questionId] !== response.itemVersion) {
      errors.push(`${response.questionId} has a stale item version`);
    }
  }
  for (const criterion of manifest.criteria) {
    if (!criterion.independentCollectionId.trim())
      errors.push(
        `${criterion.criterionId} lacks independent collection provenance`,
      );
    if (
      criterion.kind === "self-label" &&
      criterion.timing === "post-questionnaire" &&
      criterion.exposureTiming !== "after-questionnaire"
    ) {
      errors.push(
        `${criterion.criterionId} has invalid self-label exposure timing`,
      );
    }
    if (criterion.missingReason && criterion.value !== undefined) {
      errors.push(
        `${criterion.criterionId} has both missingReason and a criterion value`,
      );
    }
  }
  for (const cardId of manifest.evidenceCardIds) {
    if (!vnextEvidenceCardByCardId.has(cardId))
      errors.push(`unknown evidence card ${cardId}`);
  }
  if (
    Object.keys(manifest.componentLinks).some(
      (cardId) => !vnextEvidenceCardByCardId.has(cardId),
    )
  ) {
    errors.push("component link contains an unknown evidence card");
  }
  if (manifest.claimTierCeiling !== "PC0")
    errors.push("design-only V0 manifest exceeds PC0");
  return [...new Set(errors)];
}

export function assertVNextValidationManifest(): void {
  const errors = vnextValidationManifestErrors();
  if (errors.length > 0)
    throw new Error(
      `vNext validation manifest violation: ${errors.join("; ")}`,
    );
}
