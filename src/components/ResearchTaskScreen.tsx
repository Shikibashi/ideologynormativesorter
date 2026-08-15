import { useMemo, useState } from "react";
import { researchTaskBank } from "../data/researchTaskBank";
import {
  assignResearchTasks,
  researchTaskResponseErrors,
  type ResearchTaskAssignment,
} from "../research/tasks";
import { ResearchReceipt } from "./ResearchReceipt";
import type { ResearchSubmission, ResearchSubmissionStatus } from "../research";
import type {
  ResearchTask,
  ResearchTaskArm,
  ResearchTaskResponse,
} from "../types";

interface ResearchTaskProgress {
  assignmentFingerprint: string;
  index: number;
  startedAt: string;
  responses: Record<string, ResearchTaskResponse>;
}

interface ResearchTaskScreenProps {
  arm: Exclude<ResearchTaskArm, "all">;
  participantId: string;
  studyId: string;
  submission: ResearchSubmission | null;
  status: ResearchSubmissionStatus | null;
  onComplete: (input: {
    assignment: ResearchTaskAssignment;
    tasks: ResearchTask[];
    responses: ResearchTaskResponse[];
    startedAt: string;
    completedAt: string;
  }) => Promise<void>;
  onRestart: () => void;
}

function progressKey(
  studyId: string,
  participantId: string,
  arm: string,
): string {
  return `political-judgment-research-task-progress-v1:${studyId}:${participantId}:${arm}`;
}

function loadProgress(
  key: string,
  fingerprint: string,
): ResearchTaskProgress | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ResearchTaskProgress>;
    if (
      parsed.assignmentFingerprint !== fingerprint ||
      typeof parsed.startedAt !== "string" ||
      !Number.isInteger(parsed.index) ||
      !parsed.responses ||
      typeof parsed.responses !== "object"
    ) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed as ResearchTaskProgress;
  } catch {
    return null;
  }
}

function saveProgress(key: string, progress: ResearchTaskProgress): void {
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // Research task progress is best-effort; submission validation remains
    // authoritative and the user can still finish the module.
  }
}

function clearProgress(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore unavailable browser storage after the completed record exists.
  }
}

function initialAllocation(
  task: Extract<ResearchTask, { kind: "allocation" | "forced-tradeoff" }>,
): Record<string, number> {
  return Object.fromEntries(task.goods.map((good) => [good, 0]));
}

function initialRatings(
  task: Extract<ResearchTask, { kind: "similarity" | "sort" }>,
): Record<string, number> {
  return Object.fromEntries(
    task.stimulusIds.map((stimulusId) => [stimulusId, 50]),
  );
}

export function ResearchTaskScreen({
  arm,
  participantId,
  studyId,
  submission,
  status,
  onComplete,
  onRestart,
}: ResearchTaskScreenProps) {
  const assignment = useMemo(
    () => assignResearchTasks(researchTaskBank, participantId, arm),
    [arm, participantId],
  );
  const tasks = useMemo(
    () =>
      assignment.taskIds
        .map((taskId) => researchTaskBank.find((task) => task.id === taskId))
        .filter((task): task is ResearchTask => Boolean(task)),
    [assignment.taskIds],
  );
  const orderedTasks = useMemo(
    () =>
      assignment.presentationOrder
        .map((taskId) => tasks.find((task) => task.id === taskId))
        .filter((task): task is ResearchTask => Boolean(task)),
    [assignment.presentationOrder, tasks],
  );
  const storageKey = progressKey(studyId, participantId, arm);
  const [progress] = useState(() =>
    loadProgress(storageKey, assignment.fingerprint),
  );
  const [index, setIndex] = useState(() =>
    Math.min(progress?.index ?? 0, Math.max(0, orderedTasks.length - 1)),
  );
  const [startedAt] = useState(
    () => progress?.startedAt ?? new Date().toISOString(),
  );
  const [responses, setResponses] = useState<
    Record<string, ResearchTaskResponse>
  >(() => progress?.responses ?? {});
  const [allocationDrafts, setAllocationDrafts] = useState<
    Record<string, Record<string, number>>
  >({});
  const [ratingDrafts, setRatingDrafts] = useState<
    Record<string, Record<string, number>>
  >({});
  const [responseError, setResponseError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (submission && status) {
    return (
      <>
        <ResearchReceipt submission={submission} status={status} />
        <section
          className="screen methodology-screen"
          aria-label="Research task controls"
        >
          <p className="muted">
            Task wording, assignment seed, and response states were preserved
            with this research record.
          </p>
          <button type="button" className="primary-button" onClick={onRestart}>
            Return to start
          </button>
        </section>
      </>
    );
  }

  const task = orderedTasks[index];
  if (!task) return null;
  const selectedResponse = responses[task.id];
  const isLast = index === orderedTasks.length - 1;

  function persist(
    nextResponses: Record<string, ResearchTaskResponse>,
    nextIndex: number,
  ): void {
    saveProgress(storageKey, {
      assignmentFingerprint: assignment.fingerprint,
      index: nextIndex,
      startedAt,
      responses: nextResponses,
    });
  }

  async function record(response: ResearchTaskResponse): Promise<void> {
    const errors = researchTaskResponseErrors(task, response);
    if (errors.length > 0) {
      setResponseError(errors.join(" "));
      return;
    }
    setResponseError(null);
    const nextResponses = { ...responses, [task.id]: response };
    setResponses(nextResponses);
    const nextIndex = Math.min(index + 1, orderedTasks.length - 1);
    persist(nextResponses, nextIndex);
    if (!isLast) {
      setIndex(nextIndex);
      return;
    }
    setSubmitting(true);
    clearProgress(storageKey);
    await onComplete({
      assignment,
      tasks,
      responses: assignment.presentationOrder.map(
        (taskId) => nextResponses[taskId],
      ),
      startedAt,
      completedAt: new Date().toISOString(),
    });
    setSubmitting(false);
  }

  function allocationResponse(): ResearchTaskResponse {
    const allocationTask = task as Extract<
      ResearchTask,
      { kind: "allocation" | "forced-tradeoff" }
    >;
    return {
      taskId: task.id,
      kind: allocationTask.kind,
      allocations:
        allocationDrafts[task.id] ?? initialAllocation(allocationTask),
    };
  }

  function ratingResponse(): ResearchTaskResponse {
    const similarityTask = task as Extract<
      ResearchTask,
      { kind: "similarity" | "sort" }
    >;
    return {
      taskId: task.id,
      kind: similarityTask.kind,
      ratings: ratingDrafts[task.id] ?? initialRatings(similarityTask),
    };
  }

  return (
    <section className="screen quiz-screen" data-research-task-id={task.id}>
      <div className="section-band">
        <span className="section-band-label">RESEARCH / TASK</span>
        <span className="section-band-status">
          OPT-IN · {arm.toUpperCase()}
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Research task progress"
        aria-valuemin={1}
        aria-valuemax={orderedTasks.length}
        aria-valuenow={index + 1}
        aria-valuetext={`Research task ${index + 1} of ${orderedTasks.length}`}
      >
        <div
          className="progress-fill"
          style={{ width: `${((index + 1) / orderedTasks.length) * 100}%` }}
        />
      </div>
      <p className="muted question-context">
        Research task {index + 1} of {orderedTasks.length} · {task.layer} ·{" "}
        {task.theoryContext}
      </p>
      <p className="prompt">{task.prompt}</p>
      <p className="muted help-text">
        This task is research-only and does not change the ordinary profile
        score.
      </p>

      {(task.kind === "probability" || task.kind === "forecast") && (
        <>
          <div className="scale" role="group" aria-label="Probability estimate">
            {[0, 25, 50, 75, 100].map((value) => (
              <button
                key={value}
                type="button"
                className={`scale-button${selectedResponse && "probability" in selectedResponse && selectedResponse.probability === value ? " selected" : ""}`}
                aria-pressed={Boolean(
                  selectedResponse &&
                    "probability" in selectedResponse &&
                    selectedResponse.probability === value,
                )}
                onClick={() =>
                  void record({
                    taskId: task.id,
                    kind: task.kind,
                    probability: value,
                  })
                }
              >
                {value}%
              </button>
            ))}
          </div>
          <button
            type="button"
            className="dont-know-button"
            onClick={() =>
              void record({
                taskId: task.id,
                kind: task.kind,
                value: "dont_know",
              })
            }
          >
            I don’t know
          </button>
          <button
            type="button"
            className="dont-know-button"
            onClick={() =>
              void record({
                taskId: task.id,
                kind: task.kind,
                value: "prefer_not_to_answer",
              })
            }
          >
            Prefer not to answer
          </button>
        </>
      )}

      {(task.kind === "constrained-choice" || task.kind === "conjoint") && (
        <div
          className="statement-list"
          role="group"
          aria-label="Research choices"
        >
          {task.alternatives.map((alternative) => (
            <button
              key={alternative}
              type="button"
              className="statement-button"
              onClick={() =>
                void record({
                  taskId: task.id,
                  kind: task.kind,
                  chosenAlternative: alternative,
                })
              }
            >
              {alternative}
            </button>
          ))}
          <button
            type="button"
            className="dont-know-button"
            onClick={() =>
              void record({ taskId: task.id, kind: task.kind, value: "none" })
            }
          >
            None of these
          </button>
          <button
            type="button"
            className="dont-know-button"
            onClick={() =>
              void record({
                taskId: task.id,
                kind: task.kind,
                value: "prefer_not_to_answer",
              })
            }
          >
            Prefer not to answer
          </button>
        </div>
      )}

      {(task.kind === "allocation" || task.kind === "forced-tradeoff") && (
        <fieldset className="tier-picker">
          <legend>Allocate {task.totalUnits} units</legend>
          {task.goods.map((good) => {
            const draft = allocationDrafts[task.id] ?? initialAllocation(task);
            return (
              <label key={good} className="tier-option">
                <span className="tier-option-label">{good}</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={draft[good]}
                  onChange={(event) =>
                    setAllocationDrafts((current) => ({
                      ...current,
                      [task.id]: {
                        ...draft,
                        [good]: Number(event.target.value),
                      },
                    }))
                  }
                />
              </label>
            );
          })}
          <button
            type="button"
            className="primary-button"
            disabled={submitting}
            onClick={() => void record(allocationResponse())}
          >
            Record allocation
          </button>
          <button
            type="button"
            className="dont-know-button"
            onClick={() =>
              void record({
                taskId: task.id,
                kind: task.kind,
                value: "prefer_not_to_answer",
              })
            }
          >
            Prefer not to answer
          </button>
        </fieldset>
      )}

      {(task.kind === "similarity" || task.kind === "sort") && (
        <fieldset className="tier-picker">
          <legend>Similarity rating from 0 to 100</legend>
          {task.stimulusIds.map((stimulusId) => {
            const draft = ratingDrafts[task.id] ?? initialRatings(task);
            return (
              <label key={stimulusId} className="tier-option">
                <span className="tier-option-label">{stimulusId}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={draft[stimulusId]}
                  aria-label={`Similarity for ${stimulusId}`}
                  onChange={(event) =>
                    setRatingDrafts((current) => ({
                      ...current,
                      [task.id]: {
                        ...draft,
                        [stimulusId]: Number(event.target.value),
                      },
                    }))
                  }
                />
                <output>{draft[stimulusId]}</output>
              </label>
            );
          })}
          <button
            type="button"
            className="primary-button"
            disabled={submitting}
            onClick={() => void record(ratingResponse())}
          >
            Record ratings
          </button>
          <button
            type="button"
            className="dont-know-button"
            onClick={() =>
              void record({
                taskId: task.id,
                kind: task.kind,
                value: "prefer_not_to_answer",
              })
            }
          >
            Prefer not to answer
          </button>
        </fieldset>
      )}

      {responseError && (
        <p className="muted error-inline" role="alert">
          {responseError}
        </p>
      )}
      {index > 0 && (
        <button
          type="button"
          className="back-link"
          onClick={() => setIndex((current) => current - 1)}
        >
          Back
        </button>
      )}
    </section>
  );
}
