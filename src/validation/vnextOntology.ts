import {
  vnextHighRiskById,
  VNEXT_MODIFIER_DOMAIN_IDS,
} from "../data/vnextAuthorityPolicy";
import { vnextConstructRegistry } from "../data/vnextConstructs";
import { vnextOntologyNodes } from "../data/vnextOntology";
import { vnextOntologyRecords } from "../data/vnextOntologyRecords";
import type { VNextOntologyNode, VNextOntologyRecord } from "../types";
import {
  VNEXT_CONCEPTUAL_KINDS,
  VNEXT_CONCEPTUAL_STATUSES,
  VNEXT_MEASUREMENT_STATUSES,
} from "../types";
import { VNEXT_ONTOLOGY_VERSION } from "./vnextVersions";

const CONTEXT_KINDS = new Set([
  "policy-proposal",
  "governance-model",
  "discourse-frame",
  "historical-reference",
  "speculative-technological-current",
]);
const ROOT_BY_ID = new Map(
  vnextConstructRegistry.roots.map((root) => [root.id, root]),
);
const FACET_BY_ID = new Map(
  vnextConstructRegistry.facets.map((facet) => [facet.id, facet]),
);
const LOCAL_BY_ID = new Map(
  vnextConstructRegistry.localConstructs.map((construct) => [
    construct.id,
    construct,
  ]),
);

function sameAuthorityRecord(
  node: VNextOntologyNode,
  record: VNextOntologyRecord,
): boolean {
  const authority = Object.fromEntries(
    Object.entries(node).filter(([key]) => key !== "compatibility"),
  );
  return JSON.stringify(authority) === JSON.stringify(record);
}

function ontologyNodeErrors(node: VNextOntologyNode): string[] {
  const errors: string[] = [];
  if (!VNEXT_CONCEPTUAL_KINDS.includes(node.conceptualKind))
    errors.push(`${node.id}: unknown conceptual kind`);
  if (!VNEXT_CONCEPTUAL_STATUSES.includes(node.conceptualStatus))
    errors.push(`${node.id}: unknown conceptual status`);
  if (!VNEXT_MEASUREMENT_STATUSES.includes(node.vNextMeasurementStatus))
    errors.push(`${node.id}: unknown measurement status`);
  if (node.version !== VNEXT_ONTOLOGY_VERSION)
    errors.push(`${node.id}: stale ontology version`);
  if (!node.canonicalDefinition.trim() || !node.boundaryStatement.trim())
    errors.push(`${node.id}: missing canonical definition or boundary prose`);
  if (
    !node.sourceRecordIds.some((record) =>
      record.startsWith("vnext-integrated-system-specification-2026-08"),
    )
  )
    errors.push(`${node.id}: missing integrated-specification provenance`);
  if (
    node.highRisk !==
    (node.highRiskClassification === "high-risk" &&
      vnextHighRiskById.has(node.id))
  )
    errors.push(`${node.id}: high-risk boolean and explicit registry disagree`);
  if (node.highRisk !== vnextHighRiskById.has(node.id))
    errors.push(`${node.id}: high-risk status is not explicitly enumerated`);
  if (
    !node.publicRoleView.eligibleRoles.includes(node.publicRoleView.defaultRole)
  )
    errors.push(`${node.id}: default public role is not eligible`);
  if (!node.publicRoleView.derivationInputs.length)
    errors.push(`${node.id}: public role lacks derivation inputs`);

  const requiredRootIds = node.evidenceRequirements.requiredConstructIds.filter(
    (id) => ROOT_BY_ID.has(id),
  );
  for (const id of node.evidenceRequirements.requiredConstructIds)
    if (!ROOT_BY_ID.has(id) && !LOCAL_BY_ID.has(id))
      errors.push(`${node.id}: unknown required construct ${id}`);
  const requiredRootSet = new Set(requiredRootIds);
  const checkFacet = (facetId: string, field: string) => {
    const facet = FACET_BY_ID.get(facetId);
    if (!facet) {
      errors.push(`${node.id}: unknown ${field} ${facetId}`);
      return;
    }
    if (field === "constitutive facet" || field === "required facet") {
      if (!requiredRootSet.has(facet.rootId))
        errors.push(
          `${node.id}: ${field} ${facetId} is outside required root ${facet.rootId}`,
        );
    }
  };
  for (const facetId of node.constitutiveFacetIds)
    checkFacet(facetId, "constitutive facet");
  for (const facetId of node.evidenceRequirements.requiredFacetIds)
    checkFacet(facetId, "required facet");
  for (const facetId of node.associatedFacetIds)
    checkFacet(facetId, "associated facet");
  for (const facetId of node.nonConstitutiveFacetIds)
    if (!FACET_BY_ID.has(facetId))
      errors.push(`${node.id}: unknown non-constitutive facet ${facetId}`);

  if (node.publicRoleView.defaultRole === "context") {
    if (!node.contextMetadata || node.contextMetadata.ordinaryScoring !== false)
      errors.push(`${node.id}: Context lacks explicit non-scoring metadata`);
    if (requiredRootIds.length > 0 && !node.contextMetadata)
      errors.push(
        `${node.id}: Context construct scope is not explicitly approved`,
      );
  }
  if (node.publicRoleView.defaultRole === "specialist") {
    if (!node.specialistKind)
      errors.push(`${node.id}: Specialist lacks specialistKind`);
    if (
      [
        "experimental",
        "respondent-supported",
        "validated-scoped-public",
      ].includes(node.vNextMeasurementStatus) &&
      !node.currentModuleId
    )
      errors.push(`${node.id}: focused Specialist lacks an applicable module`);
    if (
      node.currentModuleId &&
      !node.evidenceRequirements.prerequisiteModuleIds.includes(
        node.currentModuleId,
      )
    )
      errors.push(`${node.id}: Specialist module is not a prerequisite record`);
  }
  if (node.publicRoleView.defaultRole === "modifier") {
    if (!node.modifierMetadata)
      errors.push(`${node.id}: Modifier lacks explicit domain metadata`);
    else if (
      !VNEXT_MODIFIER_DOMAIN_IDS.includes(
        node.modifierMetadata.domainId as never,
      )
    )
      errors.push(
        `${node.id}: Modifier has unknown domain ${node.modifierMetadata.domainId}`,
      );
  }
  if (
    node.publicRoleView.defaultRole !== "context" &&
    node.publicRoleView.defaultRole !== "retired" &&
    requiredRootIds.length === 0
  )
    errors.push(
      `${node.id}: active vNext object lacks required root construct scope`,
    );
  if (
    node.highRisk &&
    node.publicRoleView.defaultRole !== "context" &&
    node.publicRoleView.defaultRole !== "retired" &&
    node.evidenceRequirements.requiredEvidenceComponents.length === 0
  )
    errors.push(
      `${node.id}: high-risk object lacks typed evidence requirements`,
    );
  if (
    node.conceptualStatus === "retired" &&
    node.publicRoleView.defaultRole !== "retired"
  )
    errors.push(
      `${node.id}: retired conceptual object is publicly non-retired`,
    );
  if (
    CONTEXT_KINDS.has(node.conceptualKind) &&
    node.publicRoleView.defaultRole === "primary"
  )
    errors.push(
      `${node.id}: context conceptual kind cannot be a Primary endpoint`,
    );
  return errors;
}

export function vnextOntologyErrors(
  nodes: readonly VNextOntologyNode[] = vnextOntologyNodes,
): string[] {
  const errors: string[] = [];
  if (nodes.length !== 145)
    errors.push(`expected 145 ontology nodes, got ${nodes.length}`);
  if (vnextOntologyRecords.length !== nodes.length)
    errors.push("runtime ontology and authoritative record counts differ");
  const ids = new Set<string>();
  for (const node of nodes) {
    if (ids.has(node.id)) errors.push(`duplicate ontology node ${node.id}`);
    ids.add(node.id);
    const record = vnextOntologyRecords.find(
      (candidate) => candidate.id === node.id,
    );
    if (!record || !sameAuthorityRecord(node, record))
      errors.push(
        `${node.id}: runtime node is not an exact authoritative record join`,
      );
    errors.push(...ontologyNodeErrors(node));
  }
  if (ids.size !== vnextOntologyRecords.length)
    errors.push(
      "authoritative ontology records contain IDs absent from runtime nodes",
    );
  return [...new Set(errors)];
}

export function assertVNextOntology(): void {
  const errors = vnextOntologyErrors();
  if (errors.length > 0)
    throw new Error(`vNext ontology violation: ${errors.join("; ")}`);
}

export const vnextOntologyConstructCoverage = vnextOntologyNodes.map(
  (node) => ({
    nodeId: node.id,
    requiredRootConstructIds: node.evidenceRequirements.requiredConstructIds,
    constitutiveFacetIds: node.constitutiveFacetIds,
    associatedFacetIds: node.associatedFacetIds,
    requiredFacetIds: node.evidenceRequirements.requiredFacetIds,
    measurementStatus: node.vNextMeasurementStatus,
    publicRole: node.publicRoleView.defaultRole,
    highRisk: node.highRiskClassification,
  }),
);
