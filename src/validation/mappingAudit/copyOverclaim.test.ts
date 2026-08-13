import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Axis, Question } from "../../types";
import {
  analyzePsychometricStudy,
  type ValidationResponse,
} from "../psychometrics";

const FORBIDDEN_OVERCLAIM_PHRASES = [
  "validated against respondents",
  "empirically proven ideology match",
  "scientifically confirmed label",
] as const;

/** Permitted honesty markers — must not be treated as overclaims if present. */
const ALLOWED_PHRASES = [
  "pilot",
  "insufficient data",
  "non-empirical",
] as const;

const COPY_SOURCES = [
  "src/components/MethodologyScreen.tsx",
  "src/components/ResultsScreen.tsx",
] as const;

const axis: Axis = {
  id: "test-axis",
  layer: "normative",
  name: "Test Axis",
  negativePole: "Negative",
  positivePole: "Positive",
  description: "Test axis",
};

const items: Question[] = Array.from({ length: 4 }, (_, index) => ({
  id: `overclaim-q${index + 1}`,
  prompt: `Overclaim guard item ${index + 1}`,
  domain: "test-domain",
  layer: "normative",
  theoryContext: "mixed",
  responseType: "likert7",
  tier: "extensive",
  axisWeights: [{ axisId: axis.id, weight: 1 }],
}));

describe("copy overclaim guards", () => {
  it("MethodologyScreen and ResultsScreen avoid forbidden accuracy overclaim phrases", () => {
    for (const path of COPY_SOURCES) {
      const source = readFileSync(path, "utf8");
      const lower = source.toLowerCase();

      for (const phrase of FORBIDDEN_OVERCLAIM_PHRASES) {
        expect(
          lower.includes(phrase.toLowerCase()),
          `${path} contains forbidden phrase: ${phrase}`,
        ).toBe(false);
      }

      // Allowlisted honesty language is never treated as a failure when present.
      for (const allowed of ALLOWED_PHRASES) {
        if (lower.includes(allowed.toLowerCase())) {
          expect(lower.includes(allowed.toLowerCase())).toBe(true);
        }
      }
    }
  });

  it("empty psychometric study yields insufficient-data style status, not high confidence", () => {
    const emptyRecords: ValidationResponse[] = [];
    let report: ReturnType<typeof analyzePsychometricStudy>;

    expect(() => {
      report = analyzePsychometricStudy(emptyRecords, items, [axis], []);
    }).not.toThrow();

    // Study-level empty path uses not-collected; axis estimates use insufficient-data.
    expect(report!.status).toBe("not-collected");
    expect(report!.status).not.toBe("estimable");
    expect(report!.respondentCount).toBe(0);

    const axisReport = report!.axisReports[0];
    expect(axisReport.cronbachAlpha.status).toBe("insufficient-data");
    expect(axisReport.splitHalfReliability.status).toBe("insufficient-data");
    expect(axisReport.testRetestCorrelation.status).toBe("insufficient-data");
    expect(report!.selfLabelConcordance.status).toBe("insufficient-data");

    const estimatedStatuses = [
      axisReport.cronbachAlpha.status,
      axisReport.splitHalfReliability.status,
      axisReport.testRetestCorrelation.status,
      report!.selfLabelConcordance.status,
    ];
    expect(estimatedStatuses.every((status) => status !== "estimated")).toBe(
      true,
    );

    const confidenceClaim = /high[- ]confidence|high confidence/i;
    expect(confidenceClaim.test(JSON.stringify(report!))).toBe(false);
  });
});
