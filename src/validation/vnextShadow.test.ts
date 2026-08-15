import { describe, expect, it } from "vitest";
import { vnextShadowResultContract } from "../data/vnextShadow";
import { assertVNextShadow, vnextShadowErrors } from "./vnextShadow";
import type { VNextShadowResult } from "../types";

describe("vNext shadow scoring contract", () => {
  it("is research-only, version-complete, and fail-closed", () => {
    expect(vnextShadowErrors()).toEqual([]);
    expect(() => assertVNextShadow()).not.toThrow();
    expect(vnextShadowResultContract.productionConsumed).toBe(false);
    expect(vnextShadowResultContract.rootWeightReuse).toBe(false);
  });

  it("rejects a facet estimate that bypasses evidence or uncertainty", () => {
    const invalid = {
      ...vnextShadowResultContract,
      evidenceStatus: "not-started" as const,
      facetEstimates: [
        { facetId: "authority.source", status: "estimated" as const },
      ],
    } as VNextShadowResult;
    expect(vnextShadowErrors(invalid)).toEqual(
      expect.arrayContaining([
        "authority.source estimated without value and uncertainty",
        "shadow facet estimate bypasses evidence status gate",
      ]),
    );
  });
});
