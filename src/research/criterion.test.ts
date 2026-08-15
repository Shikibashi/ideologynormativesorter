// Decision IDs: D-06, D-10, D-13, D-14, D-18, D-29.
import { describe, expect, it } from "vitest";
import { criterionObservation, criterionObservationErrors } from "./criterion";

describe("criterion observations", () => {
  it("keeps self-labels post-questionnaire and outside scoring", () => {
    const observation = criterionObservation({
      criterionId: "self-label-001",
      kind: "self-label",
      value: "label-a",
      collectionWave: "pilot-2026-08",
      timing: "post-questionnaire",
    });
    expect(observation.criterionVersion).toMatch(/^2026-08-/);
    expect(criterionObservationErrors(observation)).toEqual([]);
  });

  it("requires explicit null plus a reason for missing criteria", () => {
    expect(
      criterionObservationErrors({
        criterionId: "forecast-001",
        criterionVersion: "2026-08-criterion-plan-v1",
        kind: "forecast-outcome",
        value: null,
        collectionWave: "pilot-2026-08",
        timing: "follow-up",
        missingReason: "unresolved",
      }),
    ).toEqual([]);
    expect(
      criterionObservationErrors({
        criterionId: "forecast-001",
        criterionVersion: "2026-08-criterion-plan-v1",
        kind: "forecast-outcome",
        value: null,
        collectionWave: "pilot-2026-08",
        timing: "follow-up",
      }),
    ).toContain("criterion value is required when missingReason is absent");
  });
});
