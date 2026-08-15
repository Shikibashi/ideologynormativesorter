// Decision IDs: D-05, D-07, D-08, D-09, D-18, D-29.
import { describe, expect, it } from "vitest";
import { researchTaskBank } from "../data/researchTaskBank";
import type { ResearchTask } from "../types";
import {
  assignResearchTasks,
  researchTaskAssignmentErrors,
  researchTaskResponseErrors,
  selectResearchTaskAttributeProfile,
} from "./tasks";

describe("research task assignment", () => {
  it("is deterministic for a participant and arm", () => {
    const first = assignResearchTasks(
      researchTaskBank,
      "participant-001",
      "all",
    );
    const second = assignResearchTasks(
      researchTaskBank,
      "participant-001",
      "all",
    );
    const other = assignResearchTasks(
      researchTaskBank,
      "participant-002",
      "all",
    );
    expect(first).toEqual(second);
    expect(first.presentationOrder).not.toEqual(other.presentationOrder);
    expect(researchTaskAssignmentErrors(first, researchTaskBank)).toEqual([]);
  });

  it("supports explicit arms and bounded assignment sizes", () => {
    const choice = assignResearchTasks(
      researchTaskBank,
      "participant-001",
      "choice",
      1,
    );
    expect(choice.taskIds).toHaveLength(1);
    expect(choice.taskIds.every((taskId) => taskId.includes("conjoint"))).toBe(
      true,
    );
  });

  it("selects and validates one frozen attribute profile per participant seed", () => {
    const choice = researchTaskBank.find(
      (
        task,
      ): task is Extract<
        ResearchTask,
        { kind: "constrained-choice" | "conjoint" }
      > => task.kind === "conjoint",
    )!;
    const assignment = assignResearchTasks(
      researchTaskBank,
      "participant-profile",
      "choice",
    );
    const profile = selectResearchTaskAttributeProfile(
      choice,
      assignment.participantSeed,
    );
    expect(profile.levels).toMatchObject({
      resources: expect.any(String),
      "administrative-capacity": expect.any(String),
      opposition: expect.any(String),
      uncertainty: expect.any(String),
      reversibility: expect.any(String),
      "time-horizon": expect.any(String),
      "political-constraints": expect.any(String),
    });
    expect(
      researchTaskResponseErrors(
        choice,
        {
          taskId: choice.id,
          kind: "conjoint",
          attributeProfile: profile,
          chosenAlternative: choice.alternatives[0],
        },
        assignment.participantSeed,
      ),
    ).toEqual([]);
    expect(
      researchTaskResponseErrors(
        choice,
        {
          taskId: choice.id,
          kind: "conjoint",
          attributeProfile: choice.attributeProfiles.find(
            (candidate) => candidate.id !== profile.id,
          )!,
          chosenAlternative: choice.alternatives[0],
        },
        assignment.participantSeed,
      ),
    ).toContain(
      "choice response attribute profile does not match its frozen seed",
    );
  });

  it("validates complete response shapes for each research format", () => {
    const forecast = researchTaskBank.find((task) => task.kind === "forecast")!;
    const choice = researchTaskBank.find(
      (
        task,
      ): task is Extract<
        ResearchTask,
        { kind: "constrained-choice" | "conjoint" }
      > => task.kind === "conjoint",
    )!;
    const allocation = researchTaskBank.find(
      (task) => task.kind === "allocation",
    )!;
    const similarity = researchTaskBank.find(
      (task) => task.kind === "similarity",
    )!;
    expect(
      researchTaskResponseErrors(forecast, {
        taskId: forecast.id,
        kind: "forecast",
        value: "dont_know",
      }),
    ).toEqual([]);
    expect(
      researchTaskResponseErrors(choice, {
        taskId: choice.id,
        kind: "conjoint",
        attributeProfile: choice.attributeProfiles[0],
        chosenAlternative: choice.alternatives[0],
      }),
    ).toEqual([]);
    expect(
      researchTaskResponseErrors(allocation, {
        taskId: allocation.id,
        kind: "allocation",
        allocations: {
          "income-floor": 30,
          "health-services": 30,
          "housing-support": 40,
        },
      }),
    ).toEqual([]);
    expect(
      researchTaskResponseErrors(similarity, {
        taskId: similarity.id,
        kind: "similarity",
        ratings: {
          "profile-authority-justified-001": 75,
          "profile-authority-contestable-001": 25,
          "profile-authority-localist-001": 50,
        },
      }),
    ).toEqual([]);
  });
});
