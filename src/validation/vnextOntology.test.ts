import { describe, expect, it } from "vitest";
import { vnextGraphEdges } from "../data/vnextGraph";
import { vnextOntologyNodes } from "../data/vnextOntology";
import { assertVNextGraph, vnextGraphErrors } from "./vnextGraph";

describe("vNext ontology and graph", () => {
  it("keeps one ontology node for every v13 role ID", () => {
    expect(vnextOntologyNodes).toHaveLength(145);
    expect(new Set(vnextOntologyNodes.map((node) => node.id)).size).toBe(145);
  });

  it("validates targets, subtype acyclicity, and symmetric relations", () => {
    expect(vnextGraphErrors()).toEqual([]);
    expect(() => assertVNextGraph()).not.toThrow();
  });

  it("populates the complete independent node contract", () => {
    expect(
      vnextOntologyNodes.every(
        (node) =>
          Array.isArray(node.aliases) &&
          node.canonicalDefinition.length > 20 &&
          node.boundaryStatement.length > 20 &&
          node.sourceRecordIds.length > 0 &&
          node.version === "2026-08-vnext-ontology-v1" &&
          node.constitutiveFacetIds.length > 0 &&
          node.associatedFacetIds.length > 0 &&
          node.publicRoleView.derivationInputs.length > 0 &&
          node.evidenceRequirements.abstentionRule.length > 0,
      ),
    ).toBe(true);
    expect(
      vnextOntologyNodes.find((node) => node.id === "national-conservatism"),
    ).toMatchObject({
      conceptualKind: "compound-tradition",
      conceptualStatus: "compatibility",
      secondaryKinds: expect.arrayContaining(["hybrid-configuration"]),
      publicRoleView: {
        defaultRole: "primary",
        activationState: "compatibility",
      },
    });
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
