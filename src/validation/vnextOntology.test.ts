import { describe, expect, it } from "vitest";
import {
  vnextGraphAdjudicationRecords,
  vnextGraphEdges,
} from "../data/vnextGraph";
import { vnextGraphMigrationLedger } from "../data/vnextGraphMigration";
import { vnextOntologyNodes } from "../data/vnextOntology";
import { vnextOntologyRecords } from "../data/vnextOntologyRecords";
import { vnextSpecialistRelationCoverage } from "../data/vnextSpecialistRelationCoverage";
import {
  assertVNextGraph,
  vnextGraphErrors,
  vnextSpecialistRelationCoverageErrors,
} from "./vnextGraph";
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

  it("covers every approved Specialist family-graph row without inventing anchors", () => {
    expect(vnextSpecialistRelationCoverageErrors()).toEqual([]);
    const specialistIds = new Set(
      vnextOntologyNodes
        .filter((node) => node.publicRoleView.defaultRole === "specialist")
        .map((node) => node.id),
    );
    expect(specialistIds.size).toBe(78);
    expect(
      new Set(vnextSpecialistRelationCoverage.map((record) => record.sourceId)),
    ).toEqual(specialistIds);
    const connectedNodeIds = new Set(
      vnextGraphEdges.flatMap((edge) => [edge.sourceId, edge.targetId]),
    );
    for (const specialistId of specialistIds) {
      if (connectedNodeIds.has(specialistId)) continue;
      const records = vnextSpecialistRelationCoverage.filter(
        (record) => record.sourceId === specialistId,
      );
      expect(records.length, specialistId).toBeGreaterThan(0);
      expect(
        records.every(
          (record) =>
            record.status === "dispositioned" ||
            record.status === "no_typed_relation_declared",
        ),
        specialistId,
      ).toBe(true);
    }
    expect(
      vnextSpecialistRelationCoverage.filter(
        (record) => record.status === "dispositioned",
      ).length,
    ).toBeGreaterThan(0);
    for (const [sourceId, relationType, targetId] of [
      ["agorist", "subtype_of", "market-anarchism"],
      ["anarcho-primitivism", "overlaps_with", "deep-ecology"],
      ["green-capitalism", "hybrid_of", "green-politics"],
      ["one-nation-conservatism", "subtype_of", "conservative"],
      ["socialist-feminism", "hybrid_of", "feminist-orientation"],
      ["socialist-feminism", "hybrid_of", "marxian-socialism"],
      ["maoism", "influenced_by", "marxist-leninist"],
      ["syndicalist", "overlaps_with", "anarcho-syndicalism"],
      ["trotskyism", "influenced_by", "marxist-leninist"],
      ["strasserism", "subtype_of", "fascist-authoritarian"],
      ["technocratic-centralist", "hybrid_of", "technocratic-orientation"],
    ] as const) {
      expect(vnextSpecialistRelationCoverage).toContainEqual(
        expect.objectContaining({
          sourceId,
          relationType,
          targetId,
          status: "represented",
        }),
      );
    }
    for (const sourceId of ["techno-anarchism", "zionism", "theocrat"])
      expect(
        vnextSpecialistRelationCoverage.some(
          (record) =>
            record.sourceId === sourceId &&
            record.status === "dispositioned" &&
            record.rationale.length > 0,
        ),
      ).toBe(true);
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
