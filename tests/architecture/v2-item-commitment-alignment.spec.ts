import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { ItemRecord } from "../../v2/packages/contracts/src/content";
import type { ItemMappingCorrection } from "../../v2/packages/content/src";

const coreItems = JSON.parse(
  readFileSync(resolve(process.cwd(), "v2/content/items/core.json"), "utf8"),
) as ItemRecord[];
const corrections = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "v2/content/items/reviewed-mapping-corrections.json"),
    "utf8",
  ),
) as ItemMappingCorrection[];
const archivedCorrections = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "docs/v2/archive/reviewed-mapping-corrections-v2.json"),
    "utf8",
  ),
) as ItemMappingCorrection[];
const byId = new Map(coreItems.map((item) => [String(item.id), item]));

function mappings(itemId: string) {
  return byId.get(itemId)?.scoring.contributions.map((entry) => ({
    constructId: String(entry.constructId),
    weight: entry.weight,
    polarity: entry.polarity,
  }));
}

describe("v3 reviewed item-to-commitment alignment", () => {
  it("separates authority legitimacy from non-domination and non-interference", () => {
    for (const itemId of ["q0001", "q0003", "q0004", "q0005", "q0006"]) {
      expect(mappings(itemId)).toEqual([
        { constructId: "political-authority-legitimacy", weight: 1, polarity: -1 },
      ]);
    }
  });

  it("maps worker-ownership reforms to the independent predistributive construct", () => {
    for (const itemId of ["q0036", "q0038"]) {
      expect(mappings(itemId)).toEqual([
        {
          constructId: "predistributive-reform",
          weight: 1,
          polarity: 1,
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
      expect(mappings(itemId)).toHaveLength(1);
      expect(mappings(itemId)?.[0]?.constructId).not.toBe("anti-domination");
    }
  });

  it("deactivates benefit-design items rather than proxying unrelated constructs", () => {
    expect(byId.get("q0073")?.status).toBe("inactive");
    expect(byId.get("q0074")?.status).toBe("inactive");
  });

  it("requires every reviewed mapping change to carry an explicit rationale", () => {
    expect(corrections).toHaveLength(0);
    expect(archivedCorrections.length).toBeGreaterThan(0);
    expect(archivedCorrections.every((entry) => entry.rationale.trim().length > 0)).toBe(true);
  });
});
