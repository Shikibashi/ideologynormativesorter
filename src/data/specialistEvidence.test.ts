import { describe, expect, it } from "vitest";
import { scoreFeministSpecialists } from "./feministBreadth";
import { scoreIdentitySovereigntyTraditions } from "./identitySovereigntyBreadth";
import {
  evaluateSpecialistConstructGates,
  summarizeSpecialistEvidence,
} from "./specialistEvidence";

describe("specialist evidence accounting", () => {
  it("does not turn an unanswered module into zero-valued evidence", () => {
    const feministMatches = scoreFeministSpecialists({});
    const identityMatches = scoreIdentitySovereigntyTraditions({});

    expect(
      feministMatches.every(
        (match) => match.evidence.insufficientEvidence && match.fit === 0,
      ),
    ).toBe(true);
    expect(
      identityMatches.every(
        (match) => match.evidence.insufficientEvidence && match.fit === 0,
      ),
    ).toBe(true);
  });

  it("reports weighted coverage and effective answered item count", () => {
    const summary = summarizeSpecialistEvidence(
      [
        { question: { id: "one" }, constructWeights: { a: 1 } },
        { question: { id: "two" }, constructWeights: { a: 2 } },
      ],
      { one: 3 },
      ["a"],
    );

    expect(summary.answeredItemCount).toBe(1);
    expect(summary.answeredCoverage).toBe(0.5);
    expect(summary.weightedAnsweredCoverage).toBeCloseTo(1 / 3);
    expect(summary.effectiveItemCount).toBeCloseTo(2 / 3);
    expect(summary.status).toBe("insufficient-evidence");
    expect(summary.constructs.a.sufficient).toBe(false);
  });

  it("allows a sufficiently measured narrow profile without requiring every module construct", () => {
    const matches = scoreIdentitySovereigntyTraditions({
      "fm-id-17": 3,
      "fm-id-18": 3,
    });
    const panAfrican = matches.find((match) => match.id === "pan-africanism");

    expect(panAfrican?.evidence.insufficientEvidence).toBe(false);
    expect(panAfrican?.fit).toBeGreaterThan(0.9);
  });

  it("abstains on missing defining constructs and blocks measured contradictions", () => {
    const summary = summarizeSpecialistEvidence(
      [
        { question: { id: "authority" }, constructWeights: { authority: 1 } },
        { question: { id: "ownership" }, constructWeights: { ownership: 1 } },
      ],
      { authority: 1, ownership: -1 },
      ["authority", "ownership"],
    );

    expect(
      evaluateSpecialistConstructGates(
        summary,
        { authority: 1, ownership: -1 },
        [
          { constructId: "authority", min: 0.6 },
          { constructId: "ownership", max: -0.4 },
        ],
      ),
    ).toEqual({ status: "passed", failedConstructIds: [] });

    expect(
      evaluateSpecialistConstructGates(
        summary,
        { authority: -1, ownership: -1 },
        [{ constructId: "authority", min: 0.6 }],
      ),
    ).toEqual({ status: "blocked", failedConstructIds: ["authority"] });

    const sparseSummary = summarizeSpecialistEvidence(
      [{ question: { id: "authority" }, constructWeights: { authority: 1 } }],
      {},
      ["authority"],
    );
    expect(
      evaluateSpecialistConstructGates(sparseSummary, {}, [
        { constructId: "authority", min: 0.6 },
      ]),
    ).toEqual({ status: "insufficient-evidence", failedConstructIds: [] });
  });
});
