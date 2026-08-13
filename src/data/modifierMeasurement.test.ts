import { describe, expect, it } from "vitest";
import { questionById, questionsForTier } from "./effectiveQuestions";
import {
  MODIFIER_LABEL_IDS,
  modifierScoringLabels,
  publicCatalogLabels,
  roleForLabel,
} from "./labelTaxonomy";
import {
  MODIFIER_MEASUREMENT_VERSION,
  modifierMeasurementDefinitions,
  modifierMeasurementForLabel,
} from "./modifierMeasurement";

describe("modifier measurement registry", () => {
  it("gives every public modifier one explicit ordinary-measurement disposition", () => {
    expect(MODIFIER_MEASUREMENT_VERSION).toBe("2026-08-modifier-construct-v1");
    expect(
      modifierMeasurementDefinitions
        .map((definition) => definition.labelId)
        .sort(),
    ).toEqual([...MODIFIER_LABEL_IDS].sort());

    for (const labelId of MODIFIER_LABEL_IDS) {
      const definition = modifierMeasurementForLabel(labelId);
      expect(
        definition,
        `${labelId} is missing its measurement disposition`,
      ).toBeDefined();
      expect(roleForLabel(labelId)).toBe("modifier");
      expect(definition?.constructName.length ?? 0).toBeGreaterThan(0);
      expect(definition?.note.length ?? 0).toBeGreaterThan(40);
    }
  });

  it("requires direct active indicators before a modifier can be ordinarily scored", () => {
    const invalidIndicators: string[] = [];

    for (const definition of modifierMeasurementDefinitions) {
      if (definition.availability !== "core-construct") {
        expect(definition.indicators, definition.labelId).toBeUndefined();
        continue;
      }

      expect(
        definition.indicators?.length ?? 0,
        definition.labelId,
      ).toBeGreaterThanOrEqual(2);
      expect(
        definition.minimumAnsweredItems,
        definition.labelId,
      ).toBeGreaterThanOrEqual(2);
      expect(
        definition.minimumAnsweredItems,
        definition.labelId,
      ).toBeLessThanOrEqual(definition.indicators!.length);
      for (const indicator of definition.indicators ?? []) {
        const question = questionById.get(indicator.questionId);
        if (!question)
          invalidIndicators.push(
            `${definition.labelId}:${indicator.questionId}:unknown`,
          );
        else if (question.active === false)
          invalidIndicators.push(
            `${definition.labelId}:${indicator.questionId}:inactive`,
          );
        else if (question.reviewStatus === "needs-rewrite")
          invalidIndicators.push(
            `${definition.labelId}:${indicator.questionId}:needs-rewrite`,
          );
        expect(indicator.rationale.length).toBeGreaterThan(12);
      }
    }

    expect(invalidIndicators).toEqual([]);
  });

  it("keeps catalog and follow-up-only modifiers out of ordinary results while preserving them in the catalog", () => {
    const scoredIds = new Set(modifierScoringLabels.map((label) => label.id));
    const catalogIds = new Set(publicCatalogLabels.map((label) => label.id));

    for (const definition of modifierMeasurementDefinitions) {
      expect(
        catalogIds.has(definition.labelId),
        `${definition.labelId} should remain browsable`,
      ).toBe(true);
      if (definition.availability === "core-construct") {
        expect(
          scoredIds.has(definition.labelId),
          `${definition.labelId} should be core scored`,
        ).toBe(true);
      } else {
        expect(
          scoredIds.has(definition.labelId),
          `${definition.labelId} must abstain from ordinary scoring`,
        ).toBe(false);
      }
    }

    expect(modifierMeasurementForLabel("ethnonationalist")?.availability).toBe(
      "focused-follow-up",
    );
    expect(modifierMeasurementForLabel("civic-nationalist")?.availability).toBe(
      "catalog-only",
    );
    expect(modifierMeasurementForLabel("nationalism")?.availability).toBe(
      "catalog-only",
    );
    expect(modifierMeasurementForLabel("populism")?.availability).toBe(
      "catalog-only",
    );
    expect(
      modifierMeasurementForLabel("fiscal-conservatism")?.availability,
    ).toBe("catalog-only");
  });

  it("gives every core-scored modifier enough direct indicators in the standard Balanced profile", () => {
    const balancedIds = new Set(
      questionsForTier("moderate").map((question) => question.id),
    );

    for (const definition of modifierMeasurementDefinitions) {
      if (definition.availability !== "core-construct") continue;
      const balancedIndicatorCount = (definition.indicators ?? []).filter(
        (indicator) => balancedIds.has(indicator.questionId),
      ).length;
      expect(
        balancedIndicatorCount,
        `${definition.labelId} cannot meet its direct-evidence minimum in the Balanced profile`,
      ).toBeGreaterThanOrEqual(definition.minimumAnsweredItems ?? Infinity);
    }
  });
});
