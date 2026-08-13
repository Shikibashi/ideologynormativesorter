import { describe, expect, it } from "vitest";
import type { Axis, IdeologyLabel, Layer, ResultProfile } from "../types";
import { buildPhilosophyRows, philosophyOverview } from "./resultsPhilosophy";

const descriptiveAxis: Axis = {
  id: "market-process-confidence",
  layer: "descriptive",
  name: "Market-Process Confidence",
  negativePole: "Markets often fail",
  positivePole: "Markets often coordinate well",
  description: "Confidence in decentralized market coordination.",
};

function resultWithScore(normalized: number, itemCount: number): ResultProfile {
  return {
    scores: {
      normative: [],
      descriptive: [
        {
          axisId: descriptiveAxis.id,
          layer: "descriptive",
          raw: normalized,
          normalized,
          itemCount,
        },
      ],
      prescriptive: [],
    },
    nearestLabels: [
      {
        labelId: "test-label",
        name: "Test Label",
        distance: 0.2,
        fit: 0.9,
        evidenceStrength: 0.8,
        measuredAxisCount: 1,
        totalAxisCount: 1,
        uncertaintyBand: "low",
      },
    ],
    conflatedLabels: [],
    gaps: [],
  };
}

function labelWithInfluence(options: {
  centroid: number;
  descriptivePhilosophies?: string[];
  normativePhilosophies?: string[];
}): IdeologyLabel {
  return {
    id: "test-label",
    name: "Test Label",
    family: "test",
    description: "Test label.",
    philosophies: ["Classical Liberalism"],
    normativePhilosophies: options.normativePhilosophies ?? [],
    descriptivePhilosophies: options.descriptivePhilosophies ?? [],
    prescriptivePhilosophies: [],
    philosophyInfluences: [
      {
        philosophy: "Classical Liberalism",
        description: "Market coordination and individual liberty.",
        affectedAxes: [descriptiveAxis.id],
      },
    ],
    centroid: { [descriptiveAxis.id]: options.centroid },
  };
}

describe("Philosophy Explorer evidence selection", () => {
  it("does not present an opposite-direction axis as philosophy alignment", () => {
    const rows = buildPhilosophyRows(
      resultWithScore(-0.31, 4),
      [
        labelWithInfluence({
          centroid: 0.5,
          descriptivePhilosophies: ["Classical Liberalism"],
        }),
      ],
      [descriptiveAxis],
    );

    expect(rows).toEqual([]);
  });

  it("does not turn an unmeasured neutral score into supporting evidence", () => {
    const rows = buildPhilosophyRows(
      resultWithScore(0, 0),
      [
        labelWithInfluence({
          centroid: 0.5,
          descriptivePhilosophies: ["Classical Liberalism"],
        }),
      ],
      [descriptiveAxis],
    );

    expect(rows).toEqual([]);
  });

  it("honors the label layer classification instead of inferring a layer from affectedAxes", () => {
    const rows = buildPhilosophyRows(
      resultWithScore(0.5, 4),
      [
        labelWithInfluence({
          centroid: 0.5,
          normativePhilosophies: ["Classical Liberalism"],
        }),
      ],
      [descriptiveAxis],
    );

    expect(rows).toEqual([]);
  });

  it("retains measured, same-direction evidence in the declared layer", () => {
    const rows = buildPhilosophyRows(
      resultWithScore(0.4, 4),
      [
        labelWithInfluence({
          centroid: 0.5,
          descriptivePhilosophies: ["Classical Liberalism"],
        }),
      ],
      [descriptiveAxis],
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      philosophy: "Classical Liberalism",
      layer: "descriptive",
      axisIds: [descriptiveAxis.id],
      labelNames: ["Test Label"],
    });
  });

  it("uses layer-specific Marxism explanations", () => {
    const normative = philosophyOverview(
      "Marxism",
      "normative" satisfies Layer,
    );
    const descriptive = philosophyOverview(
      "Marxism",
      "descriptive" satisfies Layer,
    );

    expect(normative).toMatch(/emancipation|class domination/i);
    expect(normative).not.toMatch(/^Analyzes class/i);
    expect(descriptive).toMatch(/analyzes class/i);
  });
});
