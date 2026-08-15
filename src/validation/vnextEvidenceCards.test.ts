import { describe, expect, it } from "vitest";
import {
  assertVNextEvidenceCards,
  evidenceCardFor,
  vnextEvidenceCardErrors,
} from "./vnextEvidenceCards";
import {
  vnextEvidenceCards,
  vnextPromotionRecords,
} from "../data/vnextEvidenceCards";
import { VNEXT_EVIDENCE_COMPONENT_IDS } from "../types";

describe("vNext evidence cards and promotion records", () => {
  it("creates one nine-component card for every Primary and Specialist", () => {
    expect(vnextEvidenceCards).toHaveLength(94);
    expect(vnextEvidenceCardErrors()).toEqual([]);
    expect(() => assertVNextEvidenceCards()).not.toThrow();
    expect(vnextPromotionRecords).toHaveLength(94);
    expect(
      vnextEvidenceCards.every((card) =>
        VNEXT_EVIDENCE_COMPONENT_IDS.every(
          (componentId) => card.evidence[componentId].status === "not-started",
        ),
      ),
    ).toBe(true);
  });

  it("keeps compatibility and experimental states bounded without activation", () => {
    expect(evidenceCardFor("social-democrat")).toMatchObject({
      publicMeasurementStatus: "compatibility-scored-unvalidated",
      publicDisplayState: "compatibility-scored-unvalidated",
      promotionDecision: "not-started",
      claimTierCeiling: "PC1",
    });
    expect(evidenceCardFor("anarcho-communist")).toMatchObject({
      publicDisplayState: "experimental-display",
      promotionDecision: "not-started",
    });
    expect(evidenceCardFor("conservative-liberalism")).toMatchObject({
      labelId: "liberal-conservatism",
    });
  });
});
