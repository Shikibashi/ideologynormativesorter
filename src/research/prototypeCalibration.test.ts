// Decision IDs: D-11, D-12, D-18, D-29.
import { describe, expect, it } from "vitest";
import {
  assertPrototypeDistribution,
  prototypeDistributionErrors,
} from "./prototypeCalibration";
import type { PrototypeDistribution } from "../types";

const prototype: PrototypeDistribution = {
  labelId: "research-label-a",
  version: "2026-08-prototype-calibration-v1",
  scope: { geography: "unspecified", language: "en" },
  axisIds: ["axis-a", "axis-b"],
  means: { "axis-a": 0.2, "axis-b": -0.1 },
  scales: { "axis-a": 0.8, "axis-b": 0.9 },
  covariance: [
    [1, 0.2],
    [0.2, 1],
  ],
  expertDispersion: { "axis-a": 0.3, "axis-b": 0.4 },
  bridgeSampleId: "bridge-001",
  sourceIds: ["review-record-001"],
};

describe("prototype calibration", () => {
  it("accepts scoped, finite, positive-definite distributions", () => {
    expect(prototypeDistributionErrors(prototype)).toEqual([]);
    expect(() => assertPrototypeDistribution(prototype)).not.toThrow();
  });

  it("rejects non-positive-definite covariance", () => {
    expect(
      prototypeDistributionErrors({
        ...prototype,
        covariance: [
          [1, 2],
          [2, 1],
        ],
      }),
    ).toContain("prototype covariance must be positive definite");
  });
});
