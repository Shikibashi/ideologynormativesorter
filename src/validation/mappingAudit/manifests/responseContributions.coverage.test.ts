import { describe, it, expect } from "vitest";
import { questions as effectiveActiveQuestions } from "../../../data/effectiveQuestions";
import { statementQuestions } from "../../../data/statementQuestions";
import { expectedContributionCardinality } from "./expand";
import {
  responseContributions,
  statementContributions,
  allCorpusContributions,
} from "./responseContributions";
import { WP0_FREEZE } from "../inventory/freeze";

describe("responseContributions.coverage", () => {
  it("effective-active main cardinality equals expansion(active set)", () => {
    const expected = expectedContributionCardinality(effectiveActiveQuestions);
    expect(expected).toBe(WP0_FREEZE.effectiveActiveContributionCardinality);
    expect(responseContributions.length).toBe(expected);
  });

  it("statement cardinality equals expansion(statement set)", () => {
    const expected = expectedContributionCardinality(statementQuestions);
    expect(expected).toBe(WP0_FREEZE.statementContributionCardinality);
    expect(statementContributions.length).toBe(expected);
  });

  it("contribution ids are unique within each corpus export", () => {
    for (const [name, rows] of [
      ["main", responseContributions],
      ["statement", statementContributions],
    ] as const) {
      const ids = rows.map((r) => r.id);
      expect(new Set(ids).size, `${name} has duplicate contribution ids`).toBe(
        ids.length,
      );
    }
  });

  it("statement corpus aliases main statementChoice ids (same rc keys)", () => {
    // statementQuestions is a view over main-bank sq* items, not a disjoint bank.
    const mainIds = new Set(responseContributions.map((r) => r.id));
    const aliased = statementContributions.filter((r) => mainIds.has(r.id));
    expect(aliased.length).toBeGreaterThan(0);
    expect(aliased.length).toBeLessThanOrEqual(statementContributions.length);
  });

  it("main audit pool has unique ids", () => {
    const ids = allCorpusContributions().map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every contribution id matches rc:{questionId}:{responseKey}:{axisId}", () => {
    for (const row of [...responseContributions, ...statementContributions]) {
      expect(row.id).toBe(
        `rc:${row.questionId}:${row.responseKey}:${row.axisId}`,
      );
    }
  });

  it("every effective-active row starts with pending textual audit stub", () => {
    for (const row of responseContributions) {
      expect(row.constructRationale.length).toBeGreaterThan(0);
      expect(row.inventorySet).toBe("effective-active");
    }
  });
});
