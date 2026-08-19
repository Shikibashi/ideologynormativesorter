import type { ReactNode } from "react";

export type ResearchPanelState =
  | "unavailable"
  | "available"
  | "review-consent"
  | "declined"
  | "consented"
  | "sending"
  | "sent"
  | "retryable-error";

export interface ResearchPanelProps {
  readonly state: ResearchPanelState;
  readonly errorMessage?: string;
  readonly onReviewConsent?: () => void;
  readonly onDecline?: () => void;
  readonly onConsent?: () => void;
  readonly onSend?: () => void;
  readonly onRetry?: () => void;
}

const titleByState: Record<ResearchPanelState, string> = {
  unavailable: "Optional research is unavailable",
  available: "Optional research is available",
  "review-consent": "Optional research contribution",
  declined: "Research contribution declined",
  consented: "Ready to contribute",
  sending: "Sending research contribution",
  sent: "Research contribution sent",
  "retryable-error": "Research contribution could not be sent",
};

export function ResearchPanel({
  state,
  errorMessage,
  onReviewConsent,
  onDecline,
  onConsent,
  onSend,
  onRetry,
}: ResearchPanelProps) {
  return (
    <section className="persistence-actions research-panel" aria-labelledby="research-panel-heading">
      <div>
        <div className="eyebrow">Optional research</div>
        <h2 id="research-panel-heading">{titleByState[state]}</h2>
        {state === "unavailable" ? (
          <p>Research collection is not enabled in this version. Your assessment remains available without it.</p>
        ) : null}
        {state === "available" ? <p>You can review the optional research consent before deciding whether to contribute. Nothing is sent unless you consent and choose to send it.</p> : null}
        {state === "review-consent" ? <ConsentNotice /> : null}
        {state === "declined" ? <p>No research data was sent. Declining has no effect on your assessment.</p> : null}
        {state === "consented" ? <p>You consented to optional research. Send your contribution only if you want to.</p> : null}
        {state === "sending" ? <p aria-live="polite">Your optional contribution is being sent. Keep this page open briefly.</p> : null}
        {state === "sent" ? <p role="status">Thank you. Your optional contribution was accepted.</p> : null}
        {state === "retryable-error" ? <p role="alert">{errorMessage ?? "The contribution was not sent. You can try again without changing your assessment."}</p> : null}
      </div>

      {state === "review-consent" ? (
        <div className="persistence-buttons">
          <button type="button" className="secondary-button" onClick={onDecline}>Decline research</button>
          <button type="button" className="primary-button" onClick={onConsent}>I consent to optional research</button>
        </div>
      ) : null}
      {state === "available" ? (
        <div className="persistence-buttons">
          <button type="button" className="secondary-button" onClick={onReviewConsent}>Review optional research consent</button>
        </div>
      ) : null}
      {state === "consented" ? (
        <div className="persistence-buttons">
          <button type="button" className="primary-button" onClick={onSend}>Send research submission</button>
        </div>
      ) : null}
      {state === "retryable-error" ? (
        <div className="persistence-buttons">
          <button type="button" className="primary-button" onClick={onRetry}>Try sending again</button>
        </div>
      ) : null}
    </section>
  );
}

function ConsentNotice(): ReactNode {
  return (
    <>
      <p>Taking part is optional. Declining will not change your results.</p>
      <p>With your consent, this page may send your response states and version information for instrument research. It does not collect your name, account, email address, or device fingerprint.</p>
      <p>Research data is stored separately from scoring and is retained only under the approved research policy. Withdrawal may not remove a submission that has already been received.</p>
    </>
  );
}
