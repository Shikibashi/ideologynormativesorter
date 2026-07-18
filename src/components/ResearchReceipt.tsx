import { downloadResearchSubmission, type ResearchSubmission, type ResearchSubmissionStatus } from '../research'

interface ResearchReceiptProps {
  submission: ResearchSubmission
  status: ResearchSubmissionStatus
}

export function ResearchReceipt({ submission, status }: ResearchReceiptProps) {
  const message = status.status === 'submitted'
    ? 'Your pseudonymous study record was submitted successfully.'
    : status.status === 'export-only'
      ? 'No study endpoint is configured. The record has not left this browser.'
      : `The study record was not submitted: ${status.reason}`

  return (
    <section className="screen methodology-screen" aria-label="Research submission status">
      <h2>Research record</h2>
      <p>{message}</p>
      <p className="muted">
        Participant code: <code>{submission.participantId}</code> · administration: {submission.administration} · study: {submission.studyId}
      </p>
      <button type="button" className="scale-button" onClick={() => downloadResearchSubmission(submission)}>
        Download study record
      </button>
    </section>
  )
}
