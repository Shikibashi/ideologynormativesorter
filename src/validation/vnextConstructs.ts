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
  const axisIds = new Set(axes.map((axis) => axis.id));
  const rootIds = new Set<string>();
  for (const root of registry.roots) {
    if (rootIds.has(root.id)) errors.push(`duplicate root ${root.id}`);
    rootIds.add(root.id);
    if (!axisIds.has(root.id)) errors.push(`unknown root ${root.id}`);
    if (!VALID_COVERAGE.has(root.coverageStatus)) {
      errors.push(`${root.id} has an invalid coverage status`);
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
  }
  for (const root of registry.roots) {
    for (const facetId of root.facetIds) {
      if (!facetIds.has(facetId))
        errors.push(`${root.id} is missing facet ${facetId}`);
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
