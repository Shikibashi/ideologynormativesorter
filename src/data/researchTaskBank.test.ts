// Decision IDs: D-05, D-07, D-08, D-09, D-18, D-29.
import { describe, expect, it } from "vitest";
import type { ResearchTask } from "../types";
import { researchTaskBank } from "./researchTaskBank";
import {
  researchTaskBankErrors,
  researchTaskErrors,
  researchTaskResponseErrors,
} from "../research/tasks";

describe("research task bank", () => {
  it("contains valid, versioned task formats without entering production scoring", () => {
    expect(researchTaskBankErrors(researchTaskBank)).toEqual([]);
    expect(new Set(researchTaskBank.map((task) => task.kind))).toEqual(
      new Set(["forecast", "conjoint", "allocation", "similarity"]),
    );
    expect(researchTaskBank.every((task) => task.criterionIds.length > 0)).toBe(
      true,
    );
  });

  it("keeps task-family and domain context explicit", () => {
    for (const task of researchTaskBank) {
      expect(task.familyId).toBe(`domain:${task.domainId}`);
      expect(task.stimulus.description).toBeTruthy();
      expect(task.stimulus.constraints.length).toBeGreaterThan(0);
      expect(task.version).toBe(researchTaskBank[0].version);
      expect(researchTaskErrors(task)).toEqual([]);
    }
  });

  it("freezes complete format-specific stimulus descriptions", () => {
    const forecast = researchTaskBank.find(
      (task) => task.kind === "forecast",
    ) as Extract<ResearchTask, { kind: "probability" | "forecast" }> & {
      kind: "forecast";
    };
    const choice = researchTaskBank.find(
      (task) => task.kind === "conjoint",
    ) as Extract<ResearchTask, { kind: "constrained-choice" | "conjoint" }> & {
      kind: "conjoint";
    };
    const allocation = researchTaskBank.find(
      (task) => task.kind === "allocation",
    ) as Extract<ResearchTask, { kind: "allocation" | "forced-tradeoff" }> & {
      kind: "allocation";
    };
    const similarity = researchTaskBank.find(
      (task) => task.kind === "similarity",
    ) as Extract<ResearchTask, { kind: "similarity" | "sort" }> & {
      kind: "similarity";
    };
    expect(forecast.outcomeDescription).toBeTruthy();
    expect(choice.attributeProfiles.length).toBeGreaterThan(0);
    expect(allocation.goodDescriptions).toEqual(
      expect.objectContaining({ "income-floor": expect.any(String) }),
    );
    expect(similarity.stimuli.every((stimulus) => stimulus.description)).toBe(
      true,
    );
  });

  it("rejects invalid response-process states", () => {
    const forecast = researchTaskBank.find((task) => task.kind === "forecast")!;
    expect(
      researchTaskResponseErrors(forecast, {
        taskId: forecast.id,
        kind: "forecast",
        probability: 101,
      }),
    ).toContain("probability must be between 0 and 100");
    const forecastWithoutDontKnow = {
      ...forecast,
      allowDontKnow: false,
    } as ResearchTask;
    expect(
      researchTaskResponseErrors(forecastWithoutDontKnow, {
        taskId: forecast.id,
        kind: "forecast",
        value: "dont_know",
      }),
    ).toContain(
      "probability response must provide a bounded value or explicit missingness",
    );

    const allocation = researchTaskBank.find(
      (task) => task.kind === "allocation",
    )!;
    expect(
      researchTaskResponseErrors(allocation, {
        taskId: allocation.id,
        kind: "allocation",
        allocations: {
          "income-floor": 50,
          "health-services": 50,
          "housing-support": 1,
        },
      }),
    ).toContain("allocation values must sum to totalUnits");
  });
});
