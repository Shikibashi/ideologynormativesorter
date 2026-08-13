import { describe, expect, it } from "vitest";
import type { Axis, Domain, Question } from "../types";
import { auditCorpus } from "./audit";

describe("auditCorpus", () => {
  it("real corpus has no structural problems", () => {
    const report = auditCorpus();
    expect(report.problems).toEqual([]);
    expect(report.totals.totalQuestions).toBeGreaterThan(30);
  });

  it("reports unknown domain and axis ids explicitly", () => {
    const syntheticAxes: Axis[] = [
      {
        id: "known-axis",
        layer: "normative",
        name: "Known",
        positivePole: "p",
        negativePole: "n",
        description: "d",
      },
    ];
    const syntheticDomains: Domain[] = [
      { id: "known-domain", name: "Known", description: "d" },
    ];
    const syntheticQuestion: Question = {
      id: "q-bad",
      prompt: "p",
      domain: "missing-domain",
      layer: "normative",
      theoryContext: "mixed",
      responseType: "likert7",
      tier: "extensive",
      axisWeights: [{ axisId: "missing-axis", weight: 1 }],
    };

    const report = auditCorpus({
      questions: [syntheticQuestion],
      axes: syntheticAxes,
      domains: syntheticDomains,
      labels: [],
    });

    expect(report.coverage.domains).toBe(1);
    expect(report.problems).toContain(
      "unknown domain: q-bad -> missing-domain",
    );
    expect(report.problems).toContain("unknown axis: q-bad -> missing-axis");
  });
});
