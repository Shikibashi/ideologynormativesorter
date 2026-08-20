import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type {
  ItemRecord,
} from "../../v2/packages/contracts/src/content";
import {
  applyItemMappingCorrections,
  type ItemMappingCorrection,
} from "../../v2/packages/content/src";

const coreItems = JSON.parse(
  readFileSync(resolve(process.cwd(), "v2/content/items/core.json"), "utf8"),
) as ItemRecord[];
const corrections = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "v2/content/items/reviewed-mapping-corrections.json"),
    "utf8",
  ),
) as ItemMappingCorrection[];
const reviewed = applyItemMappingCorrections(coreItems, corrections);
const byId = new Map(reviewed.map((item) => [String(item.id), item]));

function mappings(itemId: string) {
  return byId.get(itemId)?.scoring.contributions.map((entry) => ({
    constructId: String(entry.constructId),
    weight: entry.weight,
    polarity: entry.polarity,
  }));
}

describe("reviewed item-to-commitment alignment", () => {
  it("stops forcing authority skepticism, non-domination, and non-interference to co-move", () => {
    for (const itemId of ["q0001", "q0003", "q0004", "q0005", "q0006"]) {
      expect(mappings(itemId)).toEqual([
        { constructId: "authority-legitimacy", weight: 1, polarity: -1 },
      ]);
    }
  });

  it("corrects worker-ownership reforms toward the current predistribution pole", () => {
    for (const itemId of ["q0036", "q0038"]) {
      expect(mappings(itemId)).toEqual([
        {
          constructId: "redistribution-vs-predistribution",
          weight: 1,
          polarity: -1,
        },
      ]);
    }
  });

  it("removes unsupported market/pluralism and workplace cross-loadings", () => {
    expect(mappings("q0041")).toEqual([
      { constructId: "liberty-noninterference", weight: 1, polarity: 1 },
    ]);
    expect(mappings("q0042")).toEqual([
      { constructId: "anti-domination", weight: 1, polarity: 1 },
    ]);
    expect(mappings("q0043")).toEqual([
      { constructId: "liberty-noninterference", weight: 1, polarity: 1 },
    ]);
    expect(mappings("q0081")).toEqual([
      { constructId: "liberty-noninterference", weight: 1, polarity: 1 },
    ]);
    for (const itemId of ["q0082", "q0083"]) {
      expect(mappings(itemId)).toEqual([
        { constructId: "anti-domination", weight: 1, polarity: 1 },
      ]);
    }
  });

  it("deactivates benefit-design items rather than proxying unrelated constructs", () => {
    expect(byId.get("q0073")?.status).toBe("inactive");
    expect(byId.get("q0074")?.status).toBe("inactive");
  });

  it("requires every reviewed mapping change to carry an explicit rationale", () => {
    expect(corrections.length).toBeGreaterThan(0);
    expect(corrections.every((entry) => entry.rationale.trim().length > 0)).toBe(true);
  });
});
