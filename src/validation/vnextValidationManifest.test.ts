import { describe, expect, it } from "vitest";
import { vnextValidationManifest } from "../data/vnextValidationManifest";
import {
  assertVNextValidationManifest,
  vnextValidationManifestErrors,
} from "./vnextValidationManifest";
import type { VNextValidationManifest } from "../types";

describe("vNext validation manifest", () => {
  it("freezes the V0 design contract without respondent claims", () => {
    expect(vnextValidationManifest.stage).toBe("V0");
    expect(vnextValidationManifest.responses).toEqual([]);
    expect(vnextValidationManifest.criteria).toEqual([]);
    expect(vnextValidationManifest.sampleMembership).toEqual([]);
    expect(vnextValidationManifestErrors()).toEqual([]);
    expect(() => assertVNextValidationManifest()).not.toThrow();
  });

  it("rejects item-level leakage and missing response provenance", () => {
    const invalid = {
      ...vnextValidationManifest,
      splitRules: vnextValidationManifest.splitRules.map((rule) =>
        rule.split === "confirmation"
          ? { ...rule, itemLevelRandomizationAllowed: true }
          : rule,
      ),
      responses: [
        {
          respondentId: "r1",
          administrationId: "a1",
          questionId: vnextValidationManifest.itemIds[0],
          itemVersion: "stale",
          formId: vnextValidationManifest.formId,
          split: "confirmation" as const,
          rawAnswer: "agree",
          responseState: "answered" as const,
          order: 0,
          labelExposureArm: "",
          labelExposureTiming: "none" as const,
        },
      ],
    };
    expect(
      vnextValidationManifestErrors(
        invalid as unknown as VNextValidationManifest,
      ),
    ).toEqual(
      expect.arrayContaining(["item-level random splitting is forbidden"]),
    );
    expect(
      vnextValidationManifestErrors(
        invalid as unknown as VNextValidationManifest,
      ),
    ).toEqual(
      expect.arrayContaining([
        "q0001 has a stale item version",
        "q0001 lacks label exposure arm",
      ]),
    );
  });
});
