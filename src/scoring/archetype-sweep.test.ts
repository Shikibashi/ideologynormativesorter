import { describe, expect, it } from "vitest";
import { axes } from "../data/axes";
import { primaryScoringLabels } from "../data/labelTaxonomy";
import { questions } from "../data/questions";
import { allCalibrationFixtures } from "./calibration.fixtures";
import { buildResultProfile } from "./index";

const ALL_SCORABLE = questions;

/**
 * Compatibility sweep for synthetic full-centroid fixtures.
 *
 * These fixtures preserve catalog-geometry reflexivity only. They are not a
 * primary-result separation target: broad primaries now compare distinct,
 * source-backed construct scopes rather than every legacy centroid coordinate.
 * Scoped primary-prototype and boundary behavior is tested in
 * primary-separability.test.ts and primary-archetypes.test.ts.
 */
describe("synthetic centroid reflexivity sweep", () => {
  for (const fixture of allCalibrationFixtures) {
    const target = fixture.expectedLabelIds[0];
    it(`${target} remains interpretable from its full-centroid fixture`, () => {
      const result = buildResultProfile(
        ALL_SCORABLE,
        fixture.answers,
        axes,
        primaryScoringLabels,
      );
      const own = result.nearestLabels.find(
        (match) => match.labelId === target,
      );

      // A full-centroid fixture contains every required core construct, so
      // its own broad primary remains a visible comparison even when an
      // overlapping scoped family ranks above it.
      expect(own, `${target} not in nearest labels`).toBeDefined();
      expect(own!.coreGateStatus).toBe("passed");
    });
  }

  it("keeps a synthetic fixture for every ordinary scoring label", () => {
    const covered = new Set(
      allCalibrationFixtures.map((fixture) => fixture.expectedLabelIds[0]),
    );
    const uncovered = primaryScoringLabels
      .map((label) => label.id)
      .filter((id) => !covered.has(id));
    expect(
      uncovered,
      `scoring labels with no synthetic coherence fixture: ${uncovered.join(", ")}`,
    ).toEqual([]);
  });
});
