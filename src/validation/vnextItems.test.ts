import { describe, expect, it } from "vitest";
import { vnextItemAnnotations } from "../data/vnextItemAnnotations";
import {
  vnextHistoricalCoreItemIds,
  vnextItemDispositionCounts,
} from "../data/vnextItemDispositions";
import { assertVNextItems, vnextItemErrors } from "./vnextItems";

describe("vNext item audit manifest", () => {
  it("covers all 406 effective core and Specialist items", () => {
    expect(vnextItemAnnotations).toHaveLength(406);
    expect(vnextItemErrors()).toEqual([]);
    expect(() => assertVNextItems()).not.toThrow();
  });

  it("preserves approved dispositions and statement-choice boundaries", () => {
    expect(vnextItemDispositionCounts).toMatchObject({
      "empirical review required": 328,
      retain: 49,
      rewrite: 16,
      replace: 10,
      "retain with minor edit": 3,
    });
    expect(
      vnextItemAnnotations.filter((item) => item.itemId.startsWith("sq")),
    ).toHaveLength(6);
    expect(vnextHistoricalCoreItemIds.length).toBeGreaterThan(0);
  });
});
