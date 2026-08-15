import { describe, expect, it } from "vitest";
import {
  vnextGraphAdjudicationRecords,
  vnextGraphEdges,
} from "../data/vnextGraph";
import { vnextGraphMigrationLedger } from "../data/vnextGraphMigration";
import { vnextOntologyNodes } from "../data/vnextOntology";
import { vnextOntologyRecords } from "../data/vnextOntologyRecords";
import { assertVNextGraph, vnextGraphErrors } from "./vnextGraph";
import { assertVNextOntology, vnextOntologyErrors } from "./vnextOntology";

describe("vNext ontology and graph", () => {
  it("keeps one ontology node for every v13 role ID", () => {
    expect(vnextOntologyNodes).toHaveLength(145);
    expect(new Set(vnextOntologyNodes.map((node) => node.id)).size).toBe(145);
  });

  it("validates targets, subtype acyclicity, and symmetric relations", () => {
    expect(vnextGraphErrors()).toEqual([]);
    expect(() => assertVNextGraph()).not.toThrow();
    expect(vnextOntologyErrors()).toEqual([]);
    expect(() => assertVNextOntology()).not.toThrow();
  });

  it("populates the complete independent node contract from static records", () => {
    expect(
      vnextOntologyNodes.every(
        (node) =>
          Array.isArray(node.aliases) &&
          node.canonicalDefinition.length > 20 &&
          node.boundaryStatement.length > 20 &&
          node.sourceRecordIds.length > 0 &&
          node.version === "2026-08-vnext-ontology-v1" &&
          (["context", "retired"].includes(node.publicRoleView.defaultRole) ||
            (node.constitutiveFacetIds.length > 0 &&
              node.associatedFacetIds.length > 0)) &&
          node.publicRoleView.derivationInputs.length > 0 &&
          node.evidenceRequirements.abstentionRule.length > 0,
      ),
    ).toBe(true);
    expect(
      vnextOntologyNodes.find((node) => node.id === "national-conservatism"),
    ).toMatchObject({
      conceptualKind: "compound-tradition",
      conceptualStatus: "current",
      secondaryKinds: expect.arrayContaining(["hybrid-configuration"]),
      publicRoleView: {
        defaultRole: "primary",
        activationState: "compatibility",
      },
    });
    expect(vnextOntologyRecords).toHaveLength(145);
    expect(
      vnextOntologyNodes.every((node) =>
        vnextOntologyRecords.some((record) => record.id === node.id),
      ),
    ).toBe(true);
    expect(
      vnextOntologyNodes
        .filter((node) => node.publicRoleView.defaultRole === "context")
        .every((node) => node.contextMetadata?.ordinaryScoring === false),
    ).toBe(true);
    expect(
      vnextOntologyNodes.find((node) => node.id === "welfare-chauvinism"),
    ).toMatchObject({
      specialistKind: "sensitive-compound",
      highRiskClassification: "high-risk",
    });
    expect(
      vnextOntologyNodes.find((node) => node.id === "marxist-leninist"),
    ).toMatchObject({ highRiskClassification: "high-risk" });
  });

  it("covers every approved relation type with semantic edge metadata", () => {
    const relationTypes = new Set(vnextGraphEdges.map((edge) => edge.type));
    expect(relationTypes).toHaveLength(17);
    expect(
      vnextGraphEdges.every(
        (edge) =>
          edge.sourceId !== edge.targetId &&
          edge.graphVersion === "2026-08-vnext-graph-v1" &&
          edge.scope.length > 0 &&
          edge.provenance.length > 0 &&
          edge.note.length > 0 &&
          edge.semanticConstraints.length > 0 &&
          edge.facet.differentiatingConstructIds?.length,
      ),
    ).toBe(true);
    expect(vnextGraphEdges.filter((edge) => edge.type === "hybrid_of")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceId: "anarcha-feminism",
          targetId: "social-anarchism",
        }),
        expect.objectContaining({
          sourceId: "anarcha-feminism",
          targetId: "feminist-orientation",
        }),
      ]),
    );
    expect(vnextGraphAdjudicationRecords).toHaveLength(vnextGraphEdges.length);
    expect(
      vnextGraphAdjudicationRecords.every(
        (record) =>
          record.status === "approved" &&
          record.sourceRecordIds.some((id) => id.startsWith("docs/")) &&
          record.decisionIds.length > 0,
      ),
    ).toBe(true);
  });

  it("accounts for every historical compatibility edge in the migration ledger", () => {
    expect(vnextGraphMigrationLedger).toHaveLength(64);
    const edgeIds = new Set(vnextGraphEdges.map((edge) => edge.id));
    expect(
      vnextGraphMigrationLedger.every((record) =>
        record.newRelationIds.every((edgeId) => edgeIds.has(edgeId)),
      ),
    ).toBe(true);
    for (const id of [
      "deep-ecology",
      "degrowth-green",
      "ecomodernist",
      "ecosocialist",
      "geolibertarian",
      "georgism",
      "mutualist",
      "welfare-chauvinism",
    ]) {
      expect(
        vnextGraphEdges.some(
          (edge) => edge.sourceId === id || edge.targetId === id,
        ),
      ).toBe(true);
    }
  });

  it("does not expose Context or retired nodes as public measurement", () => {
    expect(
      vnextOntologyNodes
        .filter((node) =>
          ["context", "retired"].includes(node.compatibility.role),
        )
        .every(
          (node) =>
            node.vNextMeasurementStatus !== "validated-scoped-public" &&
            node.vNextMeasurementStatus !== "respondent-supported-scored",
        ),
    ).toBe(true);
    expect(vnextGraphEdges.length).toBeGreaterThan(0);
  });
});
