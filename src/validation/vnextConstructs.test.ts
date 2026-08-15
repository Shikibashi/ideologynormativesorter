import { describe, expect, it } from "vitest";
import { vnextConstructRegistry } from "../data/vnextConstructs";
import { assertVNextConstructs, vnextConstructErrors } from "./vnextConstructs";

describe("vNext root and facet registry", () => {
  it("registers all 26 roots and their canonical facets", () => {
    expect(vnextConstructRegistry.roots).toHaveLength(26);
    expect(vnextConstructRegistry.facets.length).toBeGreaterThan(130);
    expect(vnextConstructErrors()).toEqual([]);
    expect(() => assertVNextConstructs()).not.toThrow();
  });

  it("records facet-level blueprint coverage without claiming respondent validation", () => {
    expect(
      vnextConstructRegistry.facets.every(
        (facet) =>
          !["validated-scoped"].includes(facet.measurementStatus) &&
          facet.coverageStatus.length > 0,
      ),
    ).toBe(true);
  });

  it("keeps construct relationships deterministic and locally addressable", () => {
    expect(vnextConstructRegistry.localConstructs.length).toBeGreaterThan(0);
    expect(
      vnextConstructRegistry.roots.every(
        (root) =>
          root.definition.length > 20 &&
          root.neighboringRootIds.length > 0 &&
          root.facetIds.length > 0 &&
          root.validationRequirements.length > 0,
      ),
    ).toBe(true);
    expect(
      vnextConstructRegistry.roots.find(
        (root) => root.id === "authority-legitimacy",
      ),
    ).toMatchObject({
      facetIds: expect.arrayContaining([
        "authority.source",
        "authority.accountability",
      ]),
      neighboringRootIds: expect.not.arrayContaining(["authority-legitimacy"]),
      measurementStatus: "effectively-unmeasured",
    });
    expect(
      vnextConstructRegistry.facets.find(
        (facet) => facet.id === "market.alternative",
      ),
    ).toMatchObject({
      rootId: "market-process-confidence",
      definition: expect.stringContaining("alternative"),
    });
  });
});
