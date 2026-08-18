import { beforeEach, describe, expect, it } from "vitest";
import {
  clearSpecialistProgress,
  loadSpecialistProgress,
  saveSpecialistProgress,
} from "./save";

describe("specialist progress storage", () => {
  beforeEach(() => localStorage.clear());

  it("stores progress separately by module and administration", () => {
    const first = {
      participantId: "p_1",
      administration: "test" as const,
      moduleId: "feminist-faction-module" as const,
      answers: { "fm-fem-1": { questionId: "fm-fem-1", value: 2 } },
      index: 1,
      startedAt: "2026-08-10T12:00:00.000Z",
    };
    const second = {
      ...first,
      administration: "retest" as const,
      answers: { "fm-fem-1": { questionId: "fm-fem-1", value: -2 } },
    };

    expect(saveSpecialistProgress(first)).toEqual({ saved: true });
    expect(saveSpecialistProgress(second)).toEqual({ saved: true });
    expect(
      loadSpecialistProgress("p_1", "test", "feminist-faction-module")?.answers[
        "fm-fem-1"
      ].value,
    ).toBe(2);
    expect(
      loadSpecialistProgress("p_1", "retest", "feminist-faction-module")
        ?.answers["fm-fem-1"].value,
    ).toBe(-2);
  });

  it("clears only the requested module progress", () => {
    expect(
      saveSpecialistProgress({
        participantId: "p_1",
        administration: "test",
        moduleId: "identity-sovereignty-module",
        answers: { "fm-id-1": { questionId: "fm-id-1", value: 1 } },
        index: 0,
        startedAt: "2026-08-10T12:00:00.000Z",
      }),
    ).toEqual({ saved: true });

    expect(
      clearSpecialistProgress("p_1", "test", "identity-sovereignty-module"),
    ).toBe(true);
    expect(
      loadSpecialistProgress("p_1", "test", "identity-sovereignty-module"),
    ).toBeNull();
  });
  it("rejects malformed indexes, timestamps, and answer IDs", () => {
    const base = {
      participantId: "p_1",
      administration: "test" as const,
      moduleId: "feminist-faction-module" as const,
      answers: { "fm-fem-1": { questionId: "fm-fem-1", value: 2 } },
      index: 1,
      startedAt: "2026-08-10T12:00:00.000Z",
    };
    for (const malformed of [
      { ...base, index: Number.POSITIVE_INFINITY },
      { ...base, startedAt: "invalid" },
      {
        ...base,
        answers: {
          extra: { questionId: "extra", value: 1 },
        },
      },
      {
        ...base,
        answers: {
          "fm-fem-1": { questionId: "other", value: 1 },
        },
      },
    ]) {
      expect(saveSpecialistProgress(malformed)).toEqual({
        saved: false,
        reason: "The specialist progress is invalid.",
      });
    }
  });

  it("clears malformed persisted progress without affecting siblings", () => {
    const valid = {
      participantId: "p_1",
      administration: "test" as const,
      moduleId: "feminist-faction-module" as const,
      answers: { "fm-fem-1": { questionId: "fm-fem-1", value: 2 } },
      index: 1,
      startedAt: "2026-08-10T12:00:00.000Z",
    };
    expect(saveSpecialistProgress(valid)).toEqual({ saved: true });
    localStorage.setItem(
      "political-judgment-specialist-progress-v1:p_1:test:identity-sovereignty-module",
      JSON.stringify({ ...valid, moduleId: "identity-sovereignty-module" }),
    );
    expect(
      loadSpecialistProgress("p_1", "test", "feminist-faction-module"),
    ).not.toBeNull();
    expect(
      loadSpecialistProgress("p_1", "test", "identity-sovereignty-module"),
    ).toBeNull();
    expect(
      loadSpecialistProgress("p_1", "test", "feminist-faction-module"),
    ).not.toBeNull();
  });
});
