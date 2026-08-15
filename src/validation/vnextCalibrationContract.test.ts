import { describe, expect, it } from "vitest";
import { vnextCalibrationContract } from "../data/vnextCalibrationContract";
import {
  assertVNextCalibrationContract,
  vnextCalibrationContractErrors,
} from "./vnextCalibrationContract";
import type { VNextCalibrationContract } from "../types";

describe("vNext calibration and robustness contract", () => {
  it("keeps all respondent calibration outputs design-only", () => {
    expect(vnextCalibrationContractErrors()).toEqual([]);
    expect(() => assertVNextCalibrationContract()).not.toThrow();
    expect(vnextCalibrationContract.claimTierCeiling).toBe("PC0");
    expect(vnextCalibrationContract.formEquivalence.itemCountOnly).toBe(false);
  });

  it("rejects item-count-only reliability and malformed intervals", () => {
    const invalid = {
      ...vnextCalibrationContract,
      reliability: {
        ...vnextCalibrationContract.reliability,
        itemCountOnly: true,
      },
      uncertainty: {
        ...vnextCalibrationContract.uncertainty,
        interval: { lower: 2, upper: 1, method: "bootstrap" },
      },
    };
    expect(
      vnextCalibrationContractErrors(
        invalid as unknown as VNextCalibrationContract,
      ),
    ).toEqual(
      expect.arrayContaining([
        "item count cannot be a reliability estimate",
        "uncertainty interval is invalid",
      ]),
    );
  });
});
