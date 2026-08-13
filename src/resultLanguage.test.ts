import { describe, expect, it } from "vitest";
import {
  axisPositionLabel,
  comparisonStabilityLabel,
  constructSignalLabel,
  coverageLabel,
  idealGapLabel,
  labelProximityLabel,
  layerAgreementLabel,
} from "./resultLanguage";

const axis = { negativePole: "worker control", positivePole: "owner control" };

describe("consumer result language", () => {
  it("turns axis values into pole-aware direction language", () => {
    expect(axisPositionLabel(0, axis)).toBe("near the midpoint");
    expect(axisPositionLabel(-0.2, axis)).toBe(
      "slightly toward worker control",
    );
    expect(axisPositionLabel(0.5, axis)).toBe("leans toward owner control");
    expect(axisPositionLabel(-0.9, axis)).toBe(
      "strongly toward worker control",
    );
  });

  it("turns comparison and coverage values into bounded plain-language states", () => {
    expect(labelProximityLabel(0.9)).toBe("Very close axis profile");
    expect(labelProximityLabel(0.75)).toBe("Close axis profile");
    expect(comparisonStabilityLabel("high")).toBe("very tentative comparison");
    expect(coverageLabel("insufficient")).toBe("too little answer coverage");
  });

  it("describes gaps, constructs, and layer agreement without raw scores", () => {
    expect(idealGapLabel(0.5)).toMatch(/^Large difference/);
    expect(constructSignalLabel(-0.4)).toBe("clearly opposed");
    expect(layerAgreementLabel(0.6)).toBe("mixed");
  });
});
