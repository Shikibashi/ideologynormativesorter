import {
  loadPendingResearchRecords,
  type PendingResearchRecordView,
} from "../save";
import type { ResearchSubmission, ResearchSubmissionStatus } from "../research";

interface ResearchReceiptProps {
  submission: ResearchSubmission;
  status: ResearchSubmissionStatus;
  /** Optional preloaded view for callers that already have the current context. */
  pendingRecords?: readonly PendingResearchRecordView[];
}

interface RecoveryRecordSummary {
  submission: ResearchSubmission;
  submissionId: string;
  state: string;
  status: ResearchSubmissionStatus;
  updatedAt?: string;
}

function recordLabel(recordType: ResearchSubmission["recordType"]): string {
  switch (recordType) {
    case "core":
      return "Core study record";
    case "specialist":
      return "Specialist follow-up record";
    case "specialist-disposition":
      return "Specialist disposition record";
  }
}

function statusLabel(status: ResearchSubmissionStatus): string {
  if (status.status === "submitted") return "submitted";
  if (status.status === "export-only") return "local preview only";
  return `not received: ${status.reason}`;
}

function fallbackState(status: ResearchSubmissionStatus): string {
  if (status.status === "submitted") return "submitted";
  if (status.status === "export-only") return "export-only";
  return "failed";
}

export function ResearchReceipt({
  submission,
  status,
  pendingRecords,
}: ResearchReceiptProps) {
  const recordLabelText = recordLabel(submission.recordType);
  const message =
    status.status === "submitted"
      ? "Your pseudonymous contribution was received. Thank you for helping improve the site."
      : status.status === "export-only"
        ? "Local preview only: this contribution was not sent to the website."
        : `The contribution was not received: ${status.reason}`;
  const detail =
    submission.recordType === "specialist" ||
    submission.recordType === "specialist-disposition"
      ? ` · module: ${submission.moduleId}`
      : "";

  const records = (
    pendingRecords ??
    loadPendingResearchRecords({
      studyId: submission.studyId,
      participantId: submission.participantId,
      administration: submission.administration,
    })
  ).filter(
    (record) =>
      record.submission.studyId === submission.studyId &&
      record.submission.participantId === submission.participantId &&
      record.submission.administration === submission.administration,
  );
  const recoveryRecords: RecoveryRecordSummary[] = records.map((record) => ({
    submission: record.submission,
    submissionId: record.submissionId,
    state: record.state,
    status: record.status,
    updatedAt: record.updatedAt,
  }));
  if (
    !recoveryRecords.some(
      (record) => record.submissionId === submission.submissionId,
    )
  )
    recoveryRecords.unshift({
      submission,
      submissionId: submission.submissionId,
      state: fallbackState(status),
      status,
      updatedAt: submission.submittedAt,
    });

  return (
    <section
      className="screen methodology-screen"
      aria-label="Contribution submission status"
    >
      <div className="section-band">
        <span className="section-band-label">COMMUNITY INPUT / RECEIPT</span>
        <span className="section-band-status">RECORD {status.status}</span>
      </div>
      <h2>{recordLabelText}</h2>
      <p>{message}</p>
      <p className="muted">
        Contribution code: <code>{submission.participantId}</code>
        {detail}
        <br />
        Submission ID: <code>{submission.submissionId}</code>
      </p>
      <div aria-label="Contribution recovery summary">
        <h3>Recovery summary</h3>
        <ul>
          {recoveryRecords.map((record) => (
            <li key={record.submissionId}>
              <strong>{recordLabel(record.submission.recordType)}</strong>
              {" · submission ID: "}
              <code>{record.submissionId}</code>
              {" · state: "}
              <code>{record.state}</code>
              {" · "}
              {statusLabel(record.status)}
              {record.updatedAt && (
                <>
                  {" · updated "}
                  <time dateTime={record.updatedAt}>{record.updatedAt}</time>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
