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

  it("marks facet records as planned rather than measured scores", () => {
    expect(
      vnextConstructRegistry.facets.every((facet) =>
        ["planned", "effectively-unmeasured"].includes(facet.coverageStatus),
      ),
    ).toBe(true);
  });
});
