import { vnextShadowResultContract } from "../data/vnextShadow";
import { vnextSurfaceManifestById } from "../data/vnextSurfaceManifests";
import type { VNextShadowResult } from "../types";

const REQUIRED_VERSION_KEYS = [
  "vnextOntologyVersion",
  "vnextGraphVersion",
  "vnextRolePolicyVersion",
  "vnextConstructsVersion",
  "vnextFacetMapVersion",
  "vnextItemAnnotationsVersion",
  "vnextSurfaceManifestVersion",
  "vnextChallengerModelsVersion",
  "vnextShadowScoringVersion",
  "scoringVersion",
  "codeRevision",
  "frozenProductionBaselineRevision",
] as const;

export function vnextShadowErrors(
  result: VNextShadowResult = vnextShadowResultContract,
): string[] {
  const errors: string[] = [];
  if (!result.researchOnly || result.productionConsumed || !result.failClosed)
    errors.push("shadow result is not research-only and fail-closed");
  for (const key of REQUIRED_VERSION_KEYS)
    if (!result.versionTuple[key]?.trim())
      errors.push(`shadow result lacks version tuple field ${key}`);
  if (
    result.versionTuple.codeRevision ===
    result.versionTuple.frozenProductionBaselineRevision
  )
    errors.push("shadow candidate and frozen baseline revisions must differ");
  if (!vnextSurfaceManifestById.has(result.surfaceManifestId))
    errors.push("shadow result references an unknown surface manifest");
  if (result.rootWeightReuse)
    errors.push("shadow result reuses root weights for facet estimates");
  if (!result.facetEstimationRule.includes("facet-level"))
    errors.push("shadow result lacks the facet-level estimation rule");
  for (const estimate of result.facetEstimates) {
    if (
      estimate.status === "estimated" &&
      (estimate.value === undefined || estimate.uncertainty === undefined)
    )
      errors.push(
        `${estimate.facetId} estimated without value and uncertainty`,
      );
    if (
      estimate.status === "abstained" &&
      !estimate.abstentionRationale?.trim()
    )
      errors.push(`${estimate.facetId} abstains without a rationale`);
  }
  if (
    result.evidenceStatus !== "pass" &&
    result.facetEstimates.some((estimate) => estimate.status === "estimated")
  )
    errors.push("shadow facet estimate bypasses evidence status gate");
  if (result.missingnessStatus === "not-administered" && result.rootEstimates) {
    if (Object.keys(result.rootEstimates).length > 0)
      errors.push("not-administered shadow result contains root estimates");
  }
  return [...new Set(errors)];
}

export function assertVNextShadow(): void {
  const errors = vnextShadowErrors();
  if (errors.length > 0)
    throw new Error(`vNext shadow contract violation: ${errors.join("; ")}`);
}
