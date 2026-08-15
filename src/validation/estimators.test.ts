import { describe, expect, it } from "vitest";
import {
  assertResearchEstimatorOutput,
  estimateResearchLayerMean,
  researchEstimatorInputErrors,
} from "./estimators";

describe("research layer estimator", () => {
  it("returns a layer-specific estimate with explicit precision and missingness", () => {
    const estimate = estimateResearchLayerMean({
      estimatorId: "layer-mean-fixture",
      respondentId: "respondent-1",
      studyId: "study-1",
      axisId: "equality",
      layer: "normative",
      observations: [
        { questionId: "q1", value: -0.5 },
        { questionId: "q2", value: 0.5 },
        { questionId: "q3", missingReason: "dont_know" },
      ],
    });

    expect(estimate.status).toBe("estimated");
    expect(estimate.value).toBeCloseTo(0);
    expect(estimate.layer).toBe("normative");
    expect(estimate.precision).toMatchObject({
      observedCount: 2,
      totalCount: 3,
      coverage: 2 / 3,
    });
    expect(estimate.precision.interval?.method).toBe("normal-approximation");
    expect(estimate.missingness.reasons.dont_know).toBe(1);
    expect(() => assertResearchEstimatorOutput(estimate)).not.toThrow();
  });

  it("fails closed for insufficient or absent observations", () => {
    const insufficient = estimateResearchLayerMean({
      estimatorId: "layer-mean-fixture",
      respondentId: "respondent-1",
      studyId: "study-1",
      axisId: "equality",
      layer: "descriptive",
      observations: [{ questionId: "q1", missingReason: "skipped" }],
    });
    expect(insufficient.status).toBe("insufficient-data");
    expect(insufficient.value).toBeUndefined();

    const absent = estimateResearchLayerMean({
      estimatorId: "layer-mean-fixture",
      respondentId: "respondent-1",
      studyId: "study-1",
      axisId: "equality",
      layer: "prescriptive",
      observations: [],
    });
    expect(absent.status).toBe("not-applicable");
    expect(absent.precision.coverage).toBe(0);
  });

  it("rejects midpoint substitution, duplicate items, and production routing", () => {
    expect(
      researchEstimatorInputErrors({
        estimatorId: "layer-mean-fixture",
        respondentId: "respondent-1",
        studyId: "study-1",
        axisId: "equality",
        layer: "normative",
        productionScoringInput: true,
        observations: [
          { questionId: "q1", value: 0 },
          { questionId: "q1", value: 2 },
        ],
      }),
    ).toEqual(
      expect.arrayContaining([
        "research estimates cannot be production scoring inputs",
        "estimator observations must have unique questionIds",
        "observation q1 must be a finite normalized value from -1 to 1",
      ]),
    );
    expect(() =>
      estimateResearchLayerMean({
        estimatorId: "layer-mean-fixture",
        respondentId: "respondent-1",
        studyId: "study-1",
        axisId: "equality",
        layer: "normative",
        observations: [{ questionId: "q1" }],
      }),
    ).toThrow(/explicit missingReason/);
  });
});
