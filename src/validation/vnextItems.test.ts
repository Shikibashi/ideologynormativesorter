import { describe, expect, it } from "vitest";
import { vnextItemAnnotations } from "../data/vnextItemAnnotations";
import {
  vnextHistoricalCoreItemIds,
  vnextItemDispositionCounts,
} from "../data/vnextItemDispositions";
import {
  assertVNextItems,
  parseVNextSemanticDirection,
  vnextItemErrors,
} from "./vnextItems";

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

  it("parses ASCII plus, ASCII hyphen, and Unicode minus without splitting hyphenated roots", () => {
    expect(
      parseVNextSemanticDirection(
        "+political-community-boundary; −anti-domination",
      ),
    ).toEqual([
      { sign: "+", rootId: "political-community-boundary" },
      { sign: "−", rootId: "anti-domination" },
    ]);
    expect(() => parseVNextSemanticDirection("+unknown root")).toThrow(
      "Malformed semantic-direction",
    );
  });

  it("maps every statement-choice option to canonical roots and facets", () => {
    for (const item of vnextItemAnnotations.filter((candidate) =>
      candidate.itemId.startsWith("sq"),
    )) {
      expect(item.optionRecords).toHaveLength(4);
      for (const option of item.optionRecords ?? []) {
        expect(option.rootIds.length).toBeGreaterThan(0);
        expect(option.facetIds.length).toBeGreaterThan(0);
        expect(option.localConstructIds).toEqual([]);
      }
    }
  });
});
