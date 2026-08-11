import type { ResearchSubmission, ResearchSubmissionStatus } from '../research'

interface ResearchReceiptProps {
  submission: ResearchSubmission
  status: ResearchSubmissionStatus
}

export function ResearchReceipt({ submission, status }: ResearchReceiptProps) {
  const recordLabel = submission.recordType === 'specialist' ? 'Topic follow-up' : 'Main contribution'
  const message = status.status === 'submitted'
    ? 'Your pseudonymous contribution was received. Thank you for helping improve the site.'
    : status.status === 'export-only'
      ? 'Local preview only: this contribution was not sent to the website.'
      : `The contribution was not received: ${status.reason}`
  const detail = submission.recordType === 'specialist'
    ? ` · module: ${submission.moduleId}`
    : ''

  return (
    <section className="screen methodology-screen" aria-label="Contribution submission status">
      <div className="section-band">
        <span className="section-band-label">COMMUNITY INPUT / RECEIPT</span>
        <span className="section-band-status">RECORD {status.status}</span>
      </div>
      <h2>{recordLabel}</h2>
      <p>{message}</p>
      <p className="muted">
        Contribution code: <code>{submission.participantId}</code>{detail}
      </p>
    </section>
  )
}
