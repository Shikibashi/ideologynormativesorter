import { beforeEach, describe, expect, it } from "vitest";
import {
  buildResearchSubmission,
  buildResearchTaskSubmission,
  type ResearchConsent,
} from "./research";
import { researchTaskBank } from "./data/researchTaskBank";
import { assignResearchTasks } from "./research/tasks";
import {
  clearPendingResearchRecord,
  loadPendingResearchRecord,
  loadQuizState,
  savePendingResearchRecord,
  saveQuizState,
} from "./save";
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

  it("does not retain a completed record with an incomplete version bundle", () => {
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
      submissionId: "submission-incomplete",
      submittedAt: "2026-08-10T12:03:00.000Z",
    });
    const incomplete = {
      ...submission,
      versionBundle: {
        ...submission.versionBundle,
        itemMetadataVersion: "",
      },
    };

    expect(
      savePendingResearchRecord({
        submission: incomplete,
        status: { status: "failed", reason: "fixture failure" },
      }),
    ).toEqual({
      saved: false,
      reason: "The completed research record is invalid.",
    });
    expect(loadPendingResearchRecord()).toBeNull();
  });

  it("retains a complete research-task record and rejects an incomplete task state", () => {
    const assignment = assignResearchTasks(
      researchTaskBank,
      "p_task_save",
      "probability",
    );
    const tasks = assignment.taskIds.map(
      (taskId) => researchTaskBank.find((task) => task.id === taskId)!,
    );
    const submission = buildResearchTaskSubmission({
      studyId: "study-test",
      participantId: "p_task_save",
      administration: "test",
      consent,
      scoringVersion: "score-v1",
      arm: "probability",
      assignment,
      tasks,
      responses: tasks.map((task) => {
        if (task.kind !== "forecast") {
          throw new Error(
            "probability assignment returned a non-forecast task",
          );
        }
        return { taskId: task.id, kind: task.kind, probability: 50 };
      }),
      startedAt: "2026-08-10T12:01:00.000Z",
      completedAt: "2026-08-10T12:02:00.000Z",
      submissionId: "task-submission-test",
      submittedAt: "2026-08-10T12:03:00.000Z",
    });

    expect(
      savePendingResearchRecord({
        submission,
        status: { status: "failed", reason: "fixture failure" },
      }),
    ).toEqual({ saved: true });
    expect(loadPendingResearchRecord()).toEqual({
      submission,
      status: { status: "failed", reason: "fixture failure" },
    });

    const incomplete = {
      ...submission,
      completionState: "incomplete",
    } as unknown as typeof submission;
    expect(
      savePendingResearchRecord({
        submission: incomplete,
        status: { status: "failed", reason: "fixture failure" },
      }),
    ).toEqual({
      saved: false,
      reason: "The completed research record is invalid.",
    });
  });
});
