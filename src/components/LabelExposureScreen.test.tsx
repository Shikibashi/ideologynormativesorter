import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Axis, LabelExposureAssignment, ResultProfile } from "../types";
import { LABEL_EXPOSURE_VERSION } from "../research/versions";
import { LABEL_EXPOSURE_NAMED_LABEL_EXPLANATION } from "../research/labelExposure";
import { LabelExposureScreen } from "./LabelExposureScreen";

afterEach(cleanup);

const axis: Axis = {
  id: "authority-legitimacy",
  layer: "normative",
  name: "Authority Legitimacy",
  positivePole: "legitimate authority",
  negativePole: "skepticism of authority",
  description: "A test axis.",
};

const result: ResultProfile = {
  scores: {
    normative: [
      {
        axisId: axis.id,
        layer: axis.layer,
        raw: 0,
        normalized: 0,
        itemCount: 1,
      },
    ],
    descriptive: [],
    prescriptive: [],
  },
  gaps: [],
  nearestLabels: [
    {
      labelId: "market-liberal",
      name: "Market Liberal",
      distance: 0.1,
      fit: 0.9,
      evidenceStrength: 0.8,
      measuredAxisCount: 1,
      totalAxisCount: 1,
      uncertaintyBand: "medium",
    },
  ],
  conflatedLabels: [],
  axisReliabilities: {
    [axis.id]: {
      axisId: axis.id,
      band: "high",
      consistency: 1,
      itemCount: 1,
      reason: "test fixture",
    },
  },
};

function assignment(
  arm: LabelExposureAssignment["arm"],
): LabelExposureAssignment {
  return {
    version: LABEL_EXPOSURE_VERSION,
    studyId: "study-1",
    participantId: "p1",
    arm,
    seed: "study-1_p1_label-exposure-v2",
    assignedAfterSubstantiveResponses: true,
  };
}

describe("LabelExposureScreen", () => {
  it("uses the fixed heading and names the named-label similarity boundary", () => {
    render(
      <LabelExposureScreen
        assignment={assignment("named-label")}
        result={result}
        axes={[axis]}
        onComplete={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Substantive profile" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(LABEL_EXPOSURE_NAMED_LABEL_EXPLANATION),
    ).toBeInTheDocument();
  });

  it("does not expose the named-label explanation in a no-label arm", () => {
    render(
      <LabelExposureScreen
        assignment={assignment("dimension-only")}
        result={result}
        axes={[axis]}
        onComplete={vi.fn()}
      />,
    );

    expect(
      screen.queryByText(LABEL_EXPOSURE_NAMED_LABEL_EXPLANATION),
    ).not.toBeInTheDocument();
  });
});
