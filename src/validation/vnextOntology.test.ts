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
