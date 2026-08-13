import { describe, expect, it } from "vitest";
import { axes } from "../data/axes";
import { labels } from "../data/labels";
import { questions } from "../data/questions";
import {
  allCalibrationFixtures,
  centroidAlignedAnswerValue,
} from "./calibration.fixtures";
import { buildResultProfile } from "./index";

const ALL_SCORABLE = questions;

/**
 * Reflexivity check: each fixture projects a label's own centroid back through
 * the question bank, so it is NOT a test of cross-profile discrimination or
 * external validity. It verifies the weaker but useful property that the
 * catalog geometry and scoring implementation are internally coherent.
 *
 * Product-level discrimination is tested separately against the primary label
 * pool with hand-authored archetypes and primary separability gates.
 */
describe("calibration fixtures (catalog centroid reflexivity)", () => {
  for (const fixture of allCalibrationFixtures) {
    it(fixture.description, () => {
      const result = buildResultProfile(
        ALL_SCORABLE,
        fixture.answers,
        axes,
        labels,
      );

      const ids = result.nearestLabels.map((l) => l.labelId);
      expect(ids).toContain(fixture.expectedLabelIds[0]);
      const own = result.nearestLabels.find(
        (l) => l.labelId === fixture.expectedLabelIds[0],
      )!;
      expect(own.fit).toBeGreaterThanOrEqual(0);
      expect(own.fit).toBeLessThanOrEqual(1);
      const legacyEquivalentMargin =
        (result.nearestLabels[0].fit - own.fit) / Math.sqrt(axes.length);
      expect(legacyEquivalentMargin).toBeLessThanOrEqual(0.07);
    });
  }
});

describe("centroid-aligned calibration answers", () => {
  it("chooses the statement option whose axis weights best match the target centroid", () => {
    const propertyQuestion = questions.find((q) => q.id === "sq02")!;

    expect(
      centroidAlignedAnswerValue(propertyQuestion, {
        "property-legitimacy": -1,
        "equality-theory": 1,
      }),
    ).toBe(3);
  });

  it("emits the opposite raw response for reverse-scored Likert items", () => {
    const baseQuestion = questions.find(
      (q) => q.responseType !== "statementChoice" && q.axisWeights.length > 0,
    )!;
    const axisWeight = baseQuestion.axisWeights[0];
    const centroid = { [axisWeight.axisId]: Math.sign(axisWeight.weight) || 1 };
    const forward = centroidAlignedAnswerValue(
      { ...baseQuestion, reverseScored: false },
      centroid,
    );
    const reversed = centroidAlignedAnswerValue(
      { ...baseQuestion, reverseScored: true },
      centroid,
    );

    expect(reversed).toBe(-forward);
  });

  it("rejects missing statementOptions", () => {
    const propertyQuestion = questions.find((q) => q.id === "sq02")!;

    expect(() =>
      centroidAlignedAnswerValue(
        { ...propertyQuestion, statementOptions: undefined },
        {
          "property-legitimacy": -1,
          "equality-theory": 1,
        },
      ),
    ).toThrow(/statementOptions/);
  });

  it("rejects empty statementOptions", () => {
    const propertyQuestion = questions.find((q) => q.id === "sq02")!;

    expect(() =>
      centroidAlignedAnswerValue(
        { ...propertyQuestion, statementOptions: [] },
        {
          "property-legitimacy": -1,
          "equality-theory": 1,
        },
      ),
    ).toThrow(/statementOptions/);
  });

  it("rejects statementOptions with no scorable options", () => {
    const propertyQuestion = questions.find((q) => q.id === "sq02")!;

    expect(() =>
      centroidAlignedAnswerValue(
        {
          ...propertyQuestion,
          statementOptions: propertyQuestion.statementOptions!.map(
            (option) => ({
              ...option,
              axisWeights: [],
            }),
          ),
        },
        {
          "property-legitimacy": -1,
          "equality-theory": 1,
        },
      ),
    ).toThrow(/scorable statementOptions/);
  });
});
