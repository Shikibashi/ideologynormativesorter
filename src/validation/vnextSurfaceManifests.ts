import { questions } from "../data/effectiveQuestions";
import { specialistModuleDefinitions } from "../specialist";
import {
  vnextSurfaceFingerprint,
  vnextSpecialistItemIdsByModule,
  vnextSurfaceManifests,
} from "../data/vnextSurfaceManifests";
import { vnextItemAnnotations } from "../data/vnextItemAnnotations";
import type { VNextSurfaceManifest } from "../types";
import {
  VNEXT_RELEASE_CANDIDATE_COMMIT,
  VNEXT_FROZEN_BASELINE_COMMIT,
  VNEXT_SURFACE_MANIFEST_VERSION,
} from "./vnextVersions";

export function vnextSurfaceManifestErrors(
  manifests: readonly VNextSurfaceManifest[] = vnextSurfaceManifests,
): string[] {
  const errors: string[] = [];
  const bySurface = new Map(
    manifests.map((manifest) => [manifest.surface, manifest]),
  );
  if (manifests.length !== 5)
    errors.push(
      `expected five analysis surface manifests, found ${manifests.length}`,
    );
  for (const surface of [
    "core",
    "specialist",
    "research-task",
    "expert-review",
    "bridge",
  ] as const) {
    if (!bySurface.has(surface))
      errors.push(`missing ${surface} surface manifest`);
  }
  const expectedCore = questions.map((question) => question.id);
  const expectedSpecialist = specialistModuleDefinitions.flatMap((module) =>
    module.questions.map((question) => question.id),
  );
  const core = bySurface.get("core");
  const specialist = bySurface.get("specialist");
  if (core) {
    if (JSON.stringify(core.itemIds) !== JSON.stringify(expectedCore))
      errors.push(
        "core surface roster does not exactly match the active core form",
      );
    if (core.status !== "active-design")
      errors.push("core surface must remain the active design surface");
  }
  if (specialist) {
    if (
      JSON.stringify([...specialist.itemIds].sort()) !==
      JSON.stringify([...expectedSpecialist].sort())
    )
      errors.push(
        "Specialist surface roster does not exactly match Specialist modules",
      );
    if (specialist.moduleIds.length !== specialistModuleDefinitions.length)
      errors.push("Specialist surface does not declare every module");
    const moduleItems = [...vnextSpecialistItemIdsByModule.values()].flat();
    if (
      JSON.stringify([...moduleItems].sort()) !==
      JSON.stringify([...specialist.itemIds].sort())
    )
      errors.push(
        "Specialist module-local rosters do not partition the Specialist surface",
      );
    if (new Set(moduleItems).size !== moduleItems.length)
      errors.push("Specialist module-local rosters overlap");
  }
  const seen = new Map<string, string>();
  for (const manifest of manifests) {
    if (manifest.manifestVersion !== VNEXT_SURFACE_MANIFEST_VERSION)
      errors.push(`${manifest.surface} surface has a stale manifest version`);
    if (manifest.candidateCodeRevision !== VNEXT_RELEASE_CANDIDATE_COMMIT)
      errors.push(
        `${manifest.surface} surface points at another candidate revision`,
      );
    if (
      manifest.frozenProductionBaselineRevision !== VNEXT_FROZEN_BASELINE_COMMIT
    )
      errors.push(
        `${manifest.surface} surface points at another frozen baseline`,
      );
    if (new Set(manifest.itemIds).size !== manifest.itemIds.length)
      errors.push(`${manifest.surface} surface contains duplicate item IDs`);
    if (vnextSurfaceFingerprint(manifest.itemIds) !== manifest.itemFingerprint)
      errors.push(
        `${manifest.surface} surface item fingerprint disagrees with roster`,
      );
    for (const itemId of manifest.itemIds) {
      const prior = seen.get(itemId);
      if (prior)
        errors.push(
          `item ${itemId} leaks between ${prior} and ${manifest.surface} surfaces`,
        );
      seen.set(itemId, manifest.surface);
    }
    if (
      manifest.versionTuple.vnextOntologyVersion === undefined ||
      manifest.versionTuple.vnextGraphVersion === undefined ||
      manifest.versionTuple.vnextConstructsVersion === undefined ||
      manifest.versionTuple.vnextItemAnnotationsVersion === undefined ||
      manifest.versionTuple.vnextChallengerModelsVersion === undefined ||
      manifest.versionTuple.vnextShadowScoringVersion === undefined
    )
      errors.push(
        `${manifest.surface} surface lacks ontology/graph/construct/item version tuple`,
      );
    if (manifest.provenance.length === 0)
      errors.push(`${manifest.surface} surface lacks provenance`);
  }
  const effectiveIds = vnextItemAnnotations.map(
    (annotation) => annotation.itemId,
  );
  const partitionIds = [
    ...(core?.itemIds ?? []),
    ...(specialist?.itemIds ?? []),
  ].sort();
  if (JSON.stringify(partitionIds) !== JSON.stringify([...effectiveIds].sort()))
    errors.push(
      "core and Specialist surfaces do not partition the complete effective vNext item roster",
    );
  for (const surface of ["research-task", "expert-review", "bridge"] as const) {
    const manifest = bySurface.get(surface);
    if (
      manifest &&
      manifest.itemIds.length === 0 &&
      manifest.status !== "not-applicable" &&
      surface !== "research-task"
    )
      errors.push(
        `${surface} empty design manifest must be explicitly not-applicable`,
      );
    if (
      manifest &&
      manifest.itemIds.some((itemId) => seen.get(itemId) !== surface)
    )
      errors.push(
        `${surface} surface contains an undeclared cross-surface item`,
      );
  }
  return [...new Set(errors)];
}

export function assertVNextSurfaceManifests(): void {
  const errors = vnextSurfaceManifestErrors();
  if (errors.length > 0)
    throw new Error(`vNext surface manifest violation: ${errors.join("; ")}`);
}
