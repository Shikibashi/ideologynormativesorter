import { describe, expect, it } from "vitest";
import { vnextChallengerSpecifications } from "../data/vnextChallengers";
import {
  assertVNextChallengers,
  vnextChallengerResultErrors,
  vnextChallengerSpecificationErrors,
} from "./vnextChallengers";

describe("vNext challenger contracts", () => {
  it("registers the baseline and every research-only challenger family", () => {
    expect(vnextChallengerSpecifications).toHaveLength(6);
    expect(vnextChallengerSpecificationErrors()).toEqual([]);
    expect(() => assertVNextChallengers()).not.toThrow();
  });

  it("rejects result/protocol mismatches and preserves nonconvergence", () => {
    const specification = vnextChallengerSpecifications[0];
    expect(
      vnextChallengerResultErrors({
        specificationId: specification.id,
        runId: "run-1",
        status: "converged",
        split: "replication",
        seed: specification.seed + 1,
        missingnessSummary: { answered: 0 },
        convergence: { converged: false, reason: "optimizer stopped" },
        disagreementReviewQueue: [],
        artifactLinks: [],
      }),
    ).toEqual(
      expect.arrayContaining([
        "challenger result seed does not match specification",
        "challenger result split does not match specification",
        "converged result lacks convergence evidence",
        "converged result lacks estimates",
      ]),
    );
  });
});
