import { questions } from "./effectiveQuestions";
import { specialistModuleDefinitions } from "../specialist";
import { vnextItemAnnotations } from "./vnextItemAnnotations";
import { researchFormFingerprint } from "../research/forms";
import { CURRENT_RESEARCH_VERSION_BUNDLE } from "../validation/researchContracts";
import type { VNextAnalysisSurface, VNextSurfaceManifest } from "../types";
import {
  VNEXT_AUDITED_CANDIDATE_COMMIT,
  VNEXT_CONSTRUCTS_VERSION,
  VNEXT_FACET_MAP_VERSION,
  VNEXT_FROZEN_BASELINE_COMMIT,
  VNEXT_GRAPH_VERSION,
  VNEXT_ITEM_ANNOTATIONS_VERSION,
  VNEXT_ONTOLOGY_VERSION,
  VNEXT_ROLE_POLICY_VERSION,
  VNEXT_SURFACE_MANIFEST_VERSION,
} from "../validation/vnextVersions";

function fingerprint(values: readonly string[]): string {
  let hash = 2166136261;
  for (const value of values) {
    for (const char of value) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    hash ^= 124;
    hash = Math.imul(hash, 16777619);
  }
  return `vnext_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

const versionTuple = {
  ...CURRENT_RESEARCH_VERSION_BUNDLE,
  vnextOntologyVersion: VNEXT_ONTOLOGY_VERSION,
  vnextGraphVersion: VNEXT_GRAPH_VERSION,
  vnextRolePolicyVersion: VNEXT_ROLE_POLICY_VERSION,
  vnextConstructsVersion: VNEXT_CONSTRUCTS_VERSION,
  vnextFacetMapVersion: VNEXT_FACET_MAP_VERSION,
  vnextItemAnnotationsVersion: VNEXT_ITEM_ANNOTATIONS_VERSION,
  vnextSurfaceManifestVersion: VNEXT_SURFACE_MANIFEST_VERSION,
};

function makeManifest(
  surface: VNextAnalysisSurface,
  itemIds: readonly string[],
  moduleIds: readonly string[],
  formIds: readonly string[],
  constructScope: readonly string[],
  status: VNextSurfaceManifest["status"],
): VNextSurfaceManifest {
  return {
    manifestId: `vnext-analysis-surface:${surface}:2026-08-v1`,
    manifestVersion: VNEXT_SURFACE_MANIFEST_VERSION,
    surface,
    status,
    moduleIds,
    formIds,
    itemIds: [...itemIds],
    itemFingerprint: fingerprint(itemIds),
    formFingerprint:
      formIds.length === 1 && surface === "core"
        ? researchFormFingerprint([...questions])
        : fingerprint(formIds),
    constructScope: [...new Set(constructScope)].sort(),
    candidateCodeRevision: VNEXT_AUDITED_CANDIDATE_COMMIT,
    frozenProductionBaselineRevision: VNEXT_FROZEN_BASELINE_COMMIT,
    versionTuple,
    provenance: [
      "docs/vnext-integrated-system-specification-2026-08:5.3-8",
      "docs/vnext-codex-implementation-specification-2026-08:I-005,I-008,I-009",
      "D-100",
      "D-124",
      "D-128",
    ],
  };
}

const coreItemIds = questions.map((question) => question.id);
const coreAnnotations = vnextItemAnnotations.filter(
  (annotation) => annotation.surface === "core",
);
const specialistAnnotations = vnextItemAnnotations.filter(
  (annotation) => annotation.surface === "specialist",
);
const coreConstructScope = coreAnnotations.flatMap((annotation) => [
  ...annotation.intendedRootIds,
  ...annotation.facetIds,
]);

const specialistItemIdsByModule = new Map<string, string[]>();
for (const annotation of specialistAnnotations) {
  if (!annotation.moduleId) continue;
  specialistItemIdsByModule.set(annotation.moduleId, [
    ...(specialistItemIdsByModule.get(annotation.moduleId) ?? []),
    annotation.itemId,
  ]);
}
const specialistItemIds = specialistModuleDefinitions.flatMap((module) =>
  module.questions.map((question) => question.id),
);
const specialistConstructScope = specialistAnnotations.flatMap((annotation) => [
  ...annotation.intendedRootIds,
  ...annotation.facetIds,
  ...annotation.localConstructIds,
]);

export const vnextSurfaceManifests: readonly VNextSurfaceManifest[] = [
  makeManifest(
    "core",
    coreItemIds,
    [],
    ["vnext-core-form-v1"],
    coreConstructScope,
    "active-design",
  ),
  makeManifest(
    "specialist",
    specialistItemIds,
    specialistModuleDefinitions.map((module) => module.id),
    specialistModuleDefinitions.map(
      (module) => `module-form:${module.id}:${module.version}`,
    ),
    specialistConstructScope,
    "research-only",
  ),
  makeManifest(
    "research-task",
    [],
    [],
    ["research-task-form-v2"],
    [],
    "research-only",
  ),
  makeManifest(
    "expert-review",
    [],
    [],
    ["expert-review-not-yet-authorized"],
    [],
    "not-applicable",
  ),
  makeManifest(
    "bridge",
    [],
    [],
    ["bridge-surface-not-yet-authorized"],
    [],
    "not-applicable",
  ),
];

export const vnextSurfaceManifestById = new Map(
  vnextSurfaceManifests.map((manifest) => [manifest.manifestId, manifest]),
);
export const vnextSurfaceManifestBySurface = new Map(
  vnextSurfaceManifests.map((manifest) => [manifest.surface, manifest]),
);
export const vnextSpecialistItemIdsByModule = specialistItemIdsByModule;
export const vnextSurfaceFingerprint = fingerprint;
