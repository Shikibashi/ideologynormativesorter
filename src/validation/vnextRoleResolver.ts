import { modifierMeasurementForLabel } from "../data/modifierMeasurement";
import { vnextOntologyById } from "../data/vnextOntology";
import { vnextGraphEdgesBySource } from "../data/vnextGraph";
import { specialistModuleByLabel } from "../data/labelTaxonomy";
import type { VNextRolePolicyResult } from "../data/vnextRolePolicy";
import { resolveVNextRolePolicy } from "../data/vnextRolePolicy";

export interface VNextRoleView extends VNextRolePolicyResult {
  labelId: string;
  conceptualKind: string;
  measurementStatus: string;
  currentRole: string;
  currentModuleId?: string;
}

export function resolveVNextRole(labelId: string): VNextRoleView | undefined {
  const node = vnextOntologyById.get(labelId);
  if (!node) return undefined;
  const modifier = modifierMeasurementForLabel(labelId);
  const relationTypes =
    vnextGraphEdgesBySource.get(labelId)?.map((edge) => edge.type) ?? [];
  const policy = resolveVNextRolePolicy({
    conceptualKind: node.conceptualKind,
    secondaryKinds: node.secondaryKinds,
    conceptualStatus: node.conceptualStatus,
    eligibleRoles: node.publicRoleView.eligibleRoles,
    measurementStatus: node.vNextMeasurementStatus,
    evidenceRequirements: node.evidenceRequirements,
    evidenceCoverage: {
      satisfiedComponentIds: [],
      missingComponentIds: node.evidenceRequirements.requiredEvidenceComponents,
      respondentEvidenceState: "absent",
      prerequisiteModuleIds: node.evidenceRequirements.prerequisiteModuleIds,
      satisfiedPrerequisiteModuleIds: [],
    },
    highRiskClassification: node.highRisk ? "high-risk" : "ordinary",
    moduleId: node.publicRoleView.moduleId,
    explicitPromotion: false,
    relationTypes,
    currentRole: node.compatibility.role,
    hasDirectConstructEvidence: modifier?.availability === "core-construct",
  });
  return {
    labelId,
    conceptualKind: node.conceptualKind,
    measurementStatus: node.vNextMeasurementStatus,
    currentRole: node.compatibility.role,
    ...(specialistModuleByLabel[labelId]
      ? { currentModuleId: specialistModuleByLabel[labelId] }
      : {}),
    ...policy,
  };
}

export function resolveAllVNextRoles(): VNextRoleView[] {
  return [...vnextOntologyById.keys()]
    .map((labelId) => resolveVNextRole(labelId))
    .filter((view): view is VNextRoleView => view !== undefined);
}
