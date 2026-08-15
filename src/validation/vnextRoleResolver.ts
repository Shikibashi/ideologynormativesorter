import { modifierMeasurementForLabel } from "../data/modifierMeasurement";
import { vnextOntologyById } from "../data/vnextOntology";
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
  const relationTypes = [
    ...(node.compatibility.parentId ? ["subtype_of" as const] : []),
    ...node.compatibility.relations.map((relation) => relation.type),
  ];
  const policy = resolveVNextRolePolicy({
    conceptualKind: node.conceptualKind,
    currentRole: node.compatibility.role,
    measurementStatus: node.vNextMeasurementStatus,
    highRisk: node.highRisk,
    hasDirectConstructEvidence: modifier?.availability === "core-construct",
    hasRespondentEvidence: false,
    explicitPromotion: false,
    relationTypes,
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
