import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildSpecialistDispositionSubmission,
  buildSpecialistResearchSubmission,
  buildResearchSubmission,
  type ResearchConsent,
} from "./research";
import {
  clearPendingResearchRecord,
  loadPendingResearchRecord,
  loadPendingResearchRecords,
  loadQuizState,
  savePendingResearchRecord,
  saveQuizState,
} from "./save";
import {
  savePendingResearchSubmission,
  transitionPendingResearchSubmission,
} from "./research/pendingSubmission";
import {
  SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  SPECIALIST_ASSIGNMENT_STRATEGY,
} from "./specialist";
import type { Question } from "./types";

const question: Question = {
  id: "q-save-test",
  prompt: "A saved test item.",
  domain: "test-domain",
  layer: "normative",
  theoryContext: "mixed",
  responseType: "likert7",
  tier: "quick",
  axisWeights: [{ axisId: "test-axis", weight: 1 }],
  reviewStatus: "approved",
};

const consent: ResearchConsent = {
  ageConfirmed: true,
  voluntaryParticipation: true,
  dataUseAccepted: true,
  consentVersion: "test-consent",
  consentedAt: "2026-08-10T12:00:00.000Z",
  disclosureSnapshot: {
    endpointConfigured: false,
    transferAndWithdrawalNotice: "No endpoint.",
    retentionNotice: "No retention notice.",
    contactNotice: "No contact.",
  },
};
function buildTestSubmission(
  submissionId: string,
  studyId = "study-test",
  participantId = "p_test",
  administration: "test" | "retest" = "test",
  submittedAt = "2026-08-10T12:03:00.000Z",
) {
  return buildResearchSubmission({
    studyId,
    participantId,
    administration,
    bankVersion: "bank-v1",
    scoringVersion: "score-v1",
    tier: "quick",
    consent,
    identity: {},
    predictedLabelIds: [],
    answers: { [question.id]: { questionId: question.id, value: 1 } },
    questions: [question],
    startedAt: "2026-08-10T12:01:00.000Z",
    completedAt: "2026-08-10T12:02:00.000Z",
    resumed: false,
    submissionId,
    submittedAt,
  });
}
function buildTestSpecialistSubmission(
  submissionId: string,
  studyId = "study-test",
  participantId = "p_test",
  administration: "test" | "retest" = "test",
  submittedAt = "2026-08-10T12:03:00.000Z",
) {
  const moduleId = "feminist-faction-module" as const;
  const assignment = {
    moduleId,
    strategy: SPECIALIST_ASSIGNMENT_STRATEGY,
    rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  };
  return buildSpecialistResearchSubmission({
    studyId,
    participantId,
    administration,
    consent,
    moduleId,
    moduleVersion: "module-v1",
    assignment,
    bankVersion: "bank-v1",
    scoringVersion: "score-v1",
    criterion: {
      selectedIds: ["liberal-feminism"],
      noneOrUnsure: false,
      confidence: "high",
    },
    answers: { [question.id]: { questionId: question.id, value: 1 } },
    questions: [question],
    constructWeightsByQuestionId: {
      [question.id]: { "legal-equality-reform": 1 },
    },
    outcome: {
      moduleId,
      constructScores: { "legal-equality-reform": 0.5 },
      matches: [
        {
          id: "liberal-feminism",
          name: "Liberal Feminism",
          status: "existing-primary",
          fit: 0.8,
        },
      ],
    },
    startedAt: "2026-08-10T12:01:00.000Z",
    completedAt: "2026-08-10T12:02:00.000Z",
    submissionId,
    submittedAt,
  });
}

function buildTestSpecialistDisposition(
  submissionId: string,
  studyId = "study-test",
  participantId = "p_test",
  administration: "test" | "retest" = "test",
  submittedAt = "2026-08-10T12:03:00.000Z",
) {
  const moduleId = "feminist-faction-module" as const;
  return buildSpecialistDispositionSubmission({
    studyId,
    participantId,
    administration,
    consent,
    moduleId,
    moduleVersion: "module-v1",
    assignment: {
      moduleId,
      strategy: SPECIALIST_ASSIGNMENT_STRATEGY,
      rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
    },
    disposition: "declined-after-partial",
    answeredCount: 1,
    startedAt: "2026-08-10T12:01:00.000Z",
    occurredAt: "2026-08-10T12:02:00.000Z",
    submissionId,
    submittedAt,
  });
}

beforeEach(() => localStorage.clear());

describe("research recovery storage", () => {
  it("keeps a completed quiz save valid for recovery before record preparation", () => {
    expect(
      saveQuizState({
        questions: [question],
        answers: { [question.id]: { questionId: question.id, value: 1 } },
        index: 0,
        tier: "quick",
        startedAt: "2026-08-10T12:01:00.000Z",
        completedAt: "2026-08-10T12:02:00.000Z",
        research: {
          participantId: "p_test",
          studyId: "study-test",
          administration: "test",
          bankVersion: "bank-v1",
          formVersion: "form-v1",
          formFingerprint: "rf_test",
          requestedItemCount: 1,
        },
      }),
    ).toEqual({ saved: true });

    expect(loadQuizState()?.completedAt).toBe("2026-08-10T12:02:00.000Z");
  });
  it("rejects malformed indexes, timestamps, and answer IDs on load", () => {
    const base = {
      questions: [question],
      answers: { [question.id]: { questionId: question.id, value: 1 } },
      index: 0,
      tier: "quick" as const,
      startedAt: "2026-08-10T12:01:00.000Z",
    };
    for (const malformed of [
      { ...base, index: Number.POSITIVE_INFINITY },
      { ...base, startedAt: "not-a-timestamp" },
      {
        ...base,
        answers: {
          ...base.answers,
          extra: { questionId: "extra", value: 1 },
        },
      },
      {
        ...base,
        answers: { [question.id]: { questionId: "other", value: 1 } },
      },
    ]) {
      localStorage.setItem("ideology-quiz-save", JSON.stringify(malformed));
      expect(loadQuizState()).toBeNull();
      expect(localStorage.getItem("ideology-quiz-save")).toBeNull();
    }
  });

  it("does not write malformed quiz progress", () => {
    expect(
      saveQuizState({
        questions: [question],
        answers: {
          unknown: { questionId: "unknown", value: 1 },
        },
        index: 0,
        tier: "quick",
      } as never),
    ).toEqual({ saved: false, reason: "The saved quiz progress is invalid." });
  });

  it("persists an export-only record until it is explicitly cleared", () => {
    const submission = buildResearchSubmission({
      studyId: "study-test",
      participantId: "p_test",
      administration: "test",
      bankVersion: "bank-v1",
      scoringVersion: "score-v1",
      tier: "quick",
      consent,
      identity: {},
      predictedLabelIds: [],
      answers: { [question.id]: { questionId: question.id, value: 1 } },
      questions: [question],
      startedAt: "2026-08-10T12:01:00.000Z",
      completedAt: "2026-08-10T12:02:00.000Z",
      resumed: false,
      submissionId: "submission-test",
      submittedAt: "2026-08-10T12:03:00.000Z",
    });

    expect(
      savePendingResearchRecord({
        submission,
        status: { status: "export-only" },
      }),
    ).toEqual({ saved: true });
    expect(loadPendingResearchRecord()).toEqual({
      submission,
      status: { status: "export-only" },
    });
    expect(clearPendingResearchRecord()).toBe(true);
    expect(loadPendingResearchRecord()).toBeNull();
  });
  it("filters recovery to the requested research context", () => {
    const unrelated = buildTestSubmission("a-unrelated");
    const current = buildTestSubmission("z-current");
    expect(
      savePendingResearchSubmission(unrelated, "/old-route", "old-cohort").saved,
    ).toBe(true);
    expect(
      savePendingResearchSubmission(current, "/current-route", "current-cohort")
        .saved,
    ).toBe(true);

    expect(
      loadPendingResearchRecord({
        route: "/current-route",
        cohort: "current-cohort",
      })?.submission,
    ).toEqual(current);
  });

  it("prefers the newest retryable record over submitted and older records", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-08-10T12:10:00.000Z"));
      const submitted = buildTestSubmission("a-submitted");
      expect(
        savePendingResearchSubmission(submitted, "/submitted", "cohort").saved,
      ).toBe(true);
      expect(
        transitionPendingResearchSubmission(submitted.submissionId, "submitted")
          .saved,
      ).toBe(true);

      vi.setSystemTime(new Date("2026-08-10T12:11:00.000Z"));
      const olderRetryable = buildTestSubmission("b-retryable");
      expect(
        savePendingResearchSubmission(olderRetryable, "", "cohort").saved,
      ).toBe(true);
      expect(
        transitionPendingResearchSubmission(
          olderRetryable.submissionId,
          "retryable",
        ).saved,
      ).toBe(true);

      vi.setSystemTime(new Date("2026-08-10T12:12:00.000Z"));
      const newestRetryable = buildTestSubmission("c-retryable");
      expect(
        savePendingResearchSubmission(newestRetryable, "", "cohort").saved,
      ).toBe(true);
      expect(
        transitionPendingResearchSubmission(
          newestRetryable.submissionId,
          "retryable",
        ).saved,
      ).toBe(true);

      expect(loadPendingResearchRecord()?.submission).toEqual(newestRetryable);
    } finally {
      vi.useRealTimers();
    }
  });
  it("loads every matching record type with durable state and deterministic ordering", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-08-10T12:10:00.000Z"));
      const core = buildTestSubmission("a-core");
      expect(savePendingResearchSubmission(core, "/matching", "cohort").saved).toBe(
        true,
      );
      expect(
        transitionPendingResearchSubmission(core.submissionId, "pending").saved,
      ).toBe(true);

      vi.setSystemTime(new Date("2026-08-10T12:11:00.000Z"));
      const specialist = buildTestSpecialistSubmission("b-specialist");
      expect(
        savePendingResearchSubmission(specialist, "/matching", "cohort").saved,
      ).toBe(true);
      expect(
        transitionPendingResearchSubmission(
          specialist.submissionId,
          "retryable",
          { error: "temporary network failure", retryAfterMs: 5000 },
        ).saved,
      ).toBe(true);

      vi.setSystemTime(new Date("2026-08-10T12:12:00.000Z"));
      const disposition = buildTestSpecialistDisposition("c-disposition");
      expect(
        savePendingResearchSubmission(disposition, "/matching", "cohort").saved,
      ).toBe(true);
      expect(
        transitionPendingResearchSubmission(
          disposition.submissionId,
          "submitted",
        ).saved,
      ).toBe(true);

      const unrelated = buildTestSpecialistSubmission(
        "d-unrelated",
        "other-study",
      );
      expect(
        savePendingResearchSubmission(unrelated, "/matching", "cohort").saved,
      ).toBe(true);

      const records = loadPendingResearchRecords({
        studyId: "study-test",
        participantId: "p_test",
        administration: "test",
        route: "/matching",
        cohort: "cohort",
      });
      expect(records.map((record) => record.submissionId)).toEqual([
        "b-specialist",
        "a-core",
        "c-disposition",
      ]);
      expect(records.map((record) => record.submission.recordType)).toEqual([
        "specialist",
        "core",
        "specialist-disposition",
      ]);
      expect(records[0]).toMatchObject({
        submissionId: "b-specialist",
        state: "retryable",
        status: {
          status: "failed",
          reason: "temporary network failure",
        },
        route: "/matching",
        cohort: "cohort",
        nextEligibleAt: "2026-08-10T12:11:05.000Z",
      });
      expect(records[1]).toMatchObject({
        submissionId: "a-core",
        state: "pending",
        status: {
          status: "failed",
          reason: "The contribution is waiting for an explicit retry.",
        },
      });
      expect(records[2]).toMatchObject({
        submissionId: "c-disposition",
        state: "submitted",
        status: { status: "submitted", endpoint: "/matching" },
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("applies version filters without leaking a different core context", () => {
    const matching = buildTestSubmission("a-version-match");
    const unrelated = buildTestSubmission("b-version-unrelated");
    unrelated.schemaVersion = "other-schema";
    unrelated.bankVersion = "other-bank";
    unrelated.form.algorithmVersion = "other-form";
    unrelated.cohortVersion = "other-cohort-version";
    unrelated.contractVersion = "other-contract-version";
    expect(
      savePendingResearchSubmission(matching, "/matching", "cohort").saved,
    ).toBe(true);
    expect(
      savePendingResearchSubmission(unrelated, "/matching", "cohort").saved,
    ).toBe(true);

    expect(
      loadPendingResearchRecords({
        studyId: matching.studyId,
        participantId: matching.participantId,
        administration: matching.administration,
        route: "/matching",
        cohort: "cohort",
        version: matching.schemaVersion,
        bankVersion: matching.bankVersion,
        formVersion: matching.form.algorithmVersion,
        cohortVersion: matching.cohortVersion,
        contractVersion: matching.contractVersion,
      }).map((record) => record.submissionId),
    ).toEqual(["a-version-match"]);
  });
});
