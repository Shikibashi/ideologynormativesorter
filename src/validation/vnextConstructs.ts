import { axes } from "../data/axes";
import {
  vnextConstructRegistry,
  vnextKnownOntologyLabelIds,
} from "../data/vnextConstructs";
import { specialistModuleDefinitions } from "../specialist";
import type {
  VNextConstructRegistry,
  VNextConstructCoverageStatus,
} from "../types";
import {
  VNEXT_CONSTRUCTS_VERSION,
  VNEXT_FACET_MAP_VERSION,
} from "./vnextVersions";

const VALID_COVERAGE = new Set<VNextConstructCoverageStatus>([
  "missing",
  "planned",
  "effectively-unmeasured",
  "underrepresented",
  "adequate",
  "depth-limited",
  "overrepresented",
  "contaminated",
]);

export function vnextConstructErrors(
  registry: VNextConstructRegistry = vnextConstructRegistry,
): string[] {
  const errors: string[] = [];
  if (registry.constructsVersion !== VNEXT_CONSTRUCTS_VERSION) {
    errors.push("construct registry version is not current");
  }
  if (registry.facetMapVersion !== VNEXT_FACET_MAP_VERSION) {
    errors.push("facet map version is not current");
  }
  if (registry.roots.length !== 26)
    errors.push(`expected 26 roots, got ${registry.roots.length}`);
  if (registry.facets.length !== 157)
    errors.push(`expected 157 facets, got ${registry.facets.length}`);
  if (registry.localConstructs.length !== 54)
    errors.push(
      `expected 54 local constructs, got ${registry.localConstructs.length}`,
    );
  const axisIds = new Set(axes.map((axis) => axis.id));
  const rootIds = new Set<string>();
  for (const root of registry.roots) {
    if (rootIds.has(root.id)) errors.push(`duplicate root ${root.id}`);
    rootIds.add(root.id);
    if (!axisIds.has(root.id)) errors.push(`unknown root ${root.id}`);
    if (!VALID_COVERAGE.has(root.coverageStatus)) {
      errors.push(`${root.id} has an invalid coverage status`);
    }
    if (!root.definition.trim() || root.sourceRecordIds.length === 0) {
      errors.push(`${root.id} is missing canonical definition or provenance`);
    }
    if (root.facetIds.length === 0 || root.expectedConfigurations.length === 0)
      errors.push(`${root.id} lacks canonical facets or configurations`);
    if (root.version !== VNEXT_CONSTRUCTS_VERSION)
      errors.push(`${root.id} has a stale construct version`);
    if (root.measurementStatus === "validated-scoped") {
      errors.push(
        `${root.id} cannot be respondent-validated in the design registry`,
      );
    }
    for (const neighborId of root.neighboringRootIds) {
      if (!axisIds.has(neighborId))
        errors.push(
          `${root.id} references unknown neighboring root ${neighborId}`,
        );
      if (neighborId === root.id)
        errors.push(`${root.id} cannot neighbor itself`);
    }
    for (const primaryId of root.applicablePrimaryIds) {
      if (!vnextKnownOntologyLabelIds.has(primaryId))
        errors.push(
          `${root.id} references unknown applicable Primary ${primaryId}`,
        );
    }
    for (const labelId of root.applicableLabelIds) {
      if (!vnextKnownOntologyLabelIds.has(labelId)) {
        errors.push(`${root.id} references unknown label ${labelId}`);
      }
    }
    for (const moduleId of root.applicableModuleIds) {
      if (
        !specialistModuleDefinitions.some((module) => module.id === moduleId)
      ) {
        errors.push(`${root.id} references unknown module ${moduleId}`);
      }
    }
  }
  if (rootIds.size !== axes.length)
    errors.push("root registry does not cover all 26 axes");
  for (const axis of axes) {
    if (!rootIds.has(axis.id)) errors.push(`missing root ${axis.id}`);
  }
  const facetIds = new Set<string>();
  for (const facet of registry.facets) {
    if (facetIds.has(facet.id)) errors.push(`duplicate facet ${facet.id}`);
    facetIds.add(facet.id);
    const root = registry.roots.find(
      (candidate) => candidate.id === facet.rootId,
    );
    if (!root)
      errors.push(`${facet.id} references unknown root ${facet.rootId}`);
    if (!VALID_COVERAGE.has(facet.coverageStatus)) {
      errors.push(`${facet.id} has an invalid coverage status`);
    }
    if (!root?.facetIds.includes(facet.id)) {
      errors.push(`${facet.id} is not declared by its root`);
    }
    if (!facet.definition.trim() || facet.sourceRecordIds.length === 0) {
      errors.push(`${facet.id} is missing canonical definition or provenance`);
    }
    if (
      facet.definition.includes("the ") &&
      facet.definition.includes(" dimension of the construct")
    )
      errors.push(`${facet.id} still uses a formulaic generic definition`);
    if (facet.version !== VNEXT_CONSTRUCTS_VERSION)
      errors.push(`${facet.id} has a stale construct version`);
    if (facet.applicableConfigurationIds.length === 0)
      errors.push(`${facet.id} lacks applicable ideological configurations`);
    if (facet.measurementStatus === "validated-scoped") {
      errors.push(
        `${facet.id} cannot be respondent-validated in the design registry`,
      );
    }
    for (const neighborId of facet.neighboringRootIds) {
      if (!axisIds.has(neighborId))
        errors.push(
          `${facet.id} references unknown neighboring root ${neighborId}`,
        );
    }
    for (const primaryId of facet.applicablePrimaryIds) {
      if (!vnextKnownOntologyLabelIds.has(primaryId))
        errors.push(
          `${facet.id} references unknown applicable Primary ${primaryId}`,
        );
    }
    for (const moduleId of facet.applicableModuleIds) {
      if (!specialistModuleDefinitions.some((module) => module.id === moduleId))
        errors.push(
          `${facet.id} references unknown applicable module ${moduleId}`,
        );
    }
  }
  for (const root of registry.roots) {
    for (const facetId of root.facetIds) {
      if (!facetIds.has(facetId))
        errors.push(`${root.id} is missing facet ${facetId}`);
    }
  }
  const localIds = new Set<string>();
  for (const local of registry.localConstructs) {
    if (localIds.has(local.id))
      errors.push(`duplicate local construct ${local.id}`);
    localIds.add(local.id);
    if (!rootIds.has(local.rootId))
      errors.push(`${local.id} references unknown root ${local.rootId}`);
    for (const rootId of local.applicableRootIds) {
      if (!rootIds.has(rootId))
        errors.push(`${local.id} references unknown applicable root ${rootId}`);
    }
    if (!local.definition.trim() || local.sourceRecordIds.length === 0)
      errors.push(`${local.id} is missing definition or provenance`);
    if (local.definition.startsWith("Module-local construct for"))
      errors.push(
        `${local.id} still uses a placeholder local-construct definition`,
      );
    if (local.version !== VNEXT_CONSTRUCTS_VERSION)
      errors.push(`${local.id} has a stale construct version`);
    if (local.applicableRootIds.length === 0)
      errors.push(`${local.id} lacks applicable root scope`);
    for (const moduleId of local.moduleIds) {
      if (!specialistModuleDefinitions.some((module) => module.id === moduleId))
        errors.push(`${local.id} references unknown module ${moduleId}`);
    }
  }
  return errors;
}

export function assertVNextConstructs(): void {
  const errors = vnextConstructErrors();
  if (errors.length > 0) {
    throw new Error(`vNext construct violation: ${errors.join("; ")}`);
  }
}
