// Decision IDs: D-01, D-02, D-22, D-23.
import { describe, expect, it } from "vitest";
import {
  classifyFamilyCoverage,
  constructFamilyMap,
  constructFamilyMapErrors,
} from "./constructFamilies";
import { axes } from "./axes";
import { domains } from "./domains";
import { questions } from "./effectiveQuestions";

describe("construct-family registry", () => {
  it("covers every active core question without conflating layers", () => {
    expect(constructFamilyMap.families).toHaveLength(domains.length);
    expect(constructFamilyMapErrors()).toEqual([]);
    for (const family of constructFamilyMap.families) {
      expect(Object.keys(family.cells).sort()).toEqual([
        "descriptive",
        "normative",
        "prescriptive",
      ]);
      const cellLayers = Object.values(family.cells).map((cell) => cell!.layer);
      expect(new Set(cellLayers).size).toBe(cellLayers.length);
    }
    expect(
      constructFamilyMap.families.flatMap((family) =>
        Object.values(family.cells).flatMap((cell) => cell?.itemIds ?? []),
      ),
    ).toHaveLength(questions.length);
  });

  it("references only the frozen axis registry", () => {
    const knownAxes = new Set(axes.map((axis) => axis.id));
    for (const family of constructFamilyMap.families) {
      for (const axisId of family.axisIds) {
        expect(knownAxes.has(axisId)).toBe(true);
      }
      for (const cell of Object.values(family.cells)) {
        for (const axisId of cell!.axisIds) {
          expect(knownAxes.has(axisId)).toBe(true);
        }
      }
    }
  });

  it("keeps coverage classifications explicit and non-psychometric", () => {
    expect(classifyFamilyCoverage(0)).toBe("missing");
    expect(classifyFamilyCoverage(1)).toBe("partial");
    expect(classifyFamilyCoverage(3)).toBe("complete");
  });
});
