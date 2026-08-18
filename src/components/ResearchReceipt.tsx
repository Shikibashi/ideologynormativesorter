import { useState } from "react";
import {
   loadPendingResearchRecords,
   type PendingResearchRecordView,
} from "../save";
import type { ResearchSubmission, ResearchSubmissionStatus } from "../research";

export type ResearchRecoveryAction = (
   submissionId: string,
) => void | boolean | Promise<void | boolean>;

interface ResearchReceiptProps {
   submission: ResearchSubmission;
   status: ResearchSubmissionStatus;
   /** Optional preloaded view for callers that already have the current context. */
   pendingRecords?: readonly PendingResearchRecordView[];
   onExport?: ResearchRecoveryAction;
   onDelete?: ResearchRecoveryAction;
   onRetry?: ResearchRecoveryAction;
}

interface RecoveryRecordSummary {
   submission: ResearchSubmission;
   submissionId: string;
   state: string;
   stored: boolean;
   status: ResearchSubmissionStatus;
   route: string;
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
   return "not received";
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
   onExport,
   onDelete,
   onRetry,
}: ResearchReceiptProps) {
   const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());
   const [refreshedRecords, setRefreshedRecords] = useState<
      readonly PendingResearchRecordView[] | null
   >(null);
   const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());
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

   const contextFilter = {
      studyId: submission.studyId,
      participantId: submission.participantId,
      administration: submission.administration,
   };
   const sourceRecords =
      refreshedRecords ??
      pendingRecords ??
      loadPendingResearchRecords(contextFilter);
   const records = sourceRecords.filter(
      (record) =>
         record.submission.studyId === submission.studyId &&
         record.submission.participantId === submission.participantId &&
         record.submission.administration === submission.administration,
   );
   const recoveryRecords: RecoveryRecordSummary[] = records
      .filter((record) => !deletedIds.has(record.submissionId))
      .map((record) => ({
         submission: record.submission,
         submissionId: record.submissionId,
         state: record.state,
         status: record.status,
         stored: true,
         route: record.route,
         updatedAt: record.updatedAt,
      }));
   if (
      !deletedIds.has(submission.submissionId) &&
      !recoveryRecords.some(
         (record) => record.submissionId === submission.submissionId,
      )
   )
      recoveryRecords.unshift({
         submission,
         submissionId: submission.submissionId,
         state: fallbackState(status),
         status,
         stored: false,
         route: "",
         updatedAt: submission.submittedAt,
      });

   const runRecoveryAction = async (
      action: ResearchRecoveryAction | undefined,
      submissionId: string,
      onSuccess: () => void,
   ): Promise<void> => {
      if (!action || busyIds.has(submissionId)) return;
      setBusyIds((current) => new Set(current).add(submissionId));
      try {
         const result = await action(submissionId);
         if (result !== false) onSuccess();
      } finally {
         setBusyIds((current) => {
            const next = new Set(current);
            next.delete(submissionId);
            return next;
         });
      }
   };
   const retryableState = (state: string) =>
      state === "pending" ||
      state === "retryable" ||
      state === "failed" ||
      state === "conflict";

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
                     <div className="recovery-actions">
                        {onExport && (
                           <button
                              type="button"
                              disabled={busyIds.has(record.submissionId)}
                              onClick={() =>
                                 void runRecoveryAction(
                                    onExport,
                                    record.submissionId,
                                    () => { },
                                 )
                              }
                           >
                              Export exact payload
                           </button>
                        )}
                        {onDelete && record.stored && (
                           <button
                              type="button"
                              disabled={busyIds.has(record.submissionId)}
                              onClick={() =>
                                 void runRecoveryAction(
                                    onDelete,
                                    record.submissionId,
                                    () => {
                                       setDeletedIds((current) => {
                                          const next = new Set(current);
                                          next.add(record.submissionId);
                                          return next;
                                       });
                                    },
                                 )
                              }
                           >
                              Delete saved submission
                           </button>
                        )}
                        {onRetry &&
                           retryableState(record.state) &&
                           record.route.trim().length > 0 && (
                              <button
                                 type="button"
                                 disabled={busyIds.has(record.submissionId)}
                                 onClick={() =>
                                    void runRecoveryAction(
                                       onRetry,
                                       record.submissionId,
                                       () => {
                                          setRefreshedRecords(
                                             loadPendingResearchRecords(contextFilter),
                                          );
                                       },
                                    )
                                 }
                              >
                                 Retry submission
                              </button>
                           )}
                     </div>
                  </li>
               ))}
            </ul>
         </div>
      </section>
   );
}
