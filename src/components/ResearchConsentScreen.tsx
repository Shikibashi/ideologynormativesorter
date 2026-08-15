import { useState } from "react";
import {
  RESEARCH_CONSENT_VERSION,
  type ResearchConsent,
  type ResearchAdministration,
} from "../research";
import type { ResearchTaskArm } from "../types";

interface ResearchConsentScreenProps {
  participantId: string;
  administration: ResearchAdministration;
  expectedCoreItemCount: number;
  profileLabel: string;
  endpointConfigured: boolean;
  allowOfflinePreview?: boolean;
  researchContact?: string;
  retentionNotice?: string;
  onConsent: (consent: ResearchConsent) => void;
  onCancel: () => void;
  researchTaskArm?: ResearchTaskArm | null;
}

export function ResearchConsentScreen({
  participantId,
  administration,
  expectedCoreItemCount,
  profileLabel,
  endpointConfigured,
  allowOfflinePreview = false,
  researchContact,
  retentionNotice,
  onConsent,
  onCancel,
  researchTaskArm = null,
}: ResearchConsentScreenProps) {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [voluntaryParticipation, setVoluntaryParticipation] = useState(false);
  const [dataUseAccepted, setDataUseAccepted] = useState(false);
  const complete = ageConfirmed && voluntaryParticipation && dataUseAccepted;
  const transferAndWithdrawalNotice = endpointConfigured
    ? "When you submit, the website sends a pseudonymous contribution to its collection endpoint. Because no contact information is collected, uploaded records cannot reliably be matched back to you for later deletion."
    : "This local preview is not connected to the website contribution endpoint, so responses entered here will not be collected.";
  const resolvedRetentionNotice =
    retentionNotice ??
    "A deletion schedule for uploaded contributions is not currently published.";
  const contactNotice = researchContact
    ? `Site owner contact: ${researchContact}`
    : "No public site-owner contact was displayed.";
  const taskMode = researchTaskArm !== null;

  function continueToStudy(): void {
    if (!complete) return;
    onConsent({
      ageConfirmed: true,
      voluntaryParticipation: true,
      dataUseAccepted: true,
      consentVersion: RESEARCH_CONSENT_VERSION,
      consentedAt: new Date().toISOString(),
      disclosureSnapshot: {
        endpointConfigured,
        transferAndWithdrawalNotice,
        retentionNotice: resolvedRetentionNotice,
        contactNotice,
      },
    });
  }

  return (
    <section className="screen intro-screen">
      <div className="section-band">
        <span className="section-band-label">COMMUNITY INPUT / PRIVACY</span>
        <span className="section-band-status">NO ACCOUNT REQUIRED</span>
      </div>
      <h1>
        {taskMode ? "Optional research task" : "Optional profile contribution"}
      </h1>
      {taskMode ? (
        <>
          <p>
            You selected an opt-in {researchTaskArm} research arm. This short
            module studies a response process separately from the site’s
            ordinary profile score. It does not change your result or assign a
            probability to your political outlook.
          </p>
          <p className="muted">
            Tasks may ask for a forecast, constrained choice, allocation, or
            similarity rating. You can stop or choose an explicit nonresponse
            option at any time.
          </p>
        </>
      ) : (
        <>
          <p>
            You selected the {profileLabel.toLowerCase()}. This optional{" "}
            {administration === "retest" ? "follow-up" : "initial"} contribution
            uses that same assessment and result; it is not a separate test.
            Declining continues with the selected profile without sending a
            contribution.
          </p>
          <p className="muted">
            The selected profile contains {expectedCoreItemCount} questions,
            optional profile fields, and possibly one optional topic follow-up.
            It is long, and some political or identity questions may be
            uncomfortable. You can stop or choose “Prefer not to answer” at any
            time.
          </p>
        </>
      )}
      <p className="muted">
        The contribution contains your answers, broad optional demographic
        groups, optional ideology names, version information, elapsed time, and
        a random participant code. It does not request your name, email address,
        exact age, precise location, or contact information. Suggested names are
        reviewed manually and never alter the site automatically.
      </p>
      <p className="muted">
        {transferAndWithdrawalNotice}{" "}
        {endpointConfigured && resolvedRetentionNotice}{" "}
        {researchContact && contactNotice}
      </p>
      <p className="muted">
        Participant code: <code>{participantId}</code>
      </p>

      <fieldset className="tier-picker">
        <legend>Your choice</legend>
        <label className={`tier-option${ageConfirmed ? " selected" : ""}`}>
          <input
            type="checkbox"
            checked={ageConfirmed}
            onChange={(event) => setAgeConfirmed(event.target.checked)}
          />
          <span className="tier-option-label">I am at least 18 years old.</span>
        </label>
        <label
          className={`tier-option${voluntaryParticipation ? " selected" : ""}`}
        >
          <input
            type="checkbox"
            checked={voluntaryParticipation}
            onChange={(event) =>
              setVoluntaryParticipation(event.target.checked)
            }
          />
          <span className="tier-option-label">
            I understand this contribution is optional and I can stop before
            submitting.
          </span>
        </label>
        <label className={`tier-option${dataUseAccepted ? " selected" : ""}`}>
          <input
            type="checkbox"
            checked={dataUseAccepted}
            onChange={(event) => setDataUseAccepted(event.target.checked)}
          />
          <span className="tier-option-label">
            {endpointConfigured
              ? "I agree to send these pseudonymous responses to improve the website’s questions and label set."
              : "I understand this local preview will not send my responses to the website."}
          </span>
        </label>
      </fieldset>

      <button
        type="button"
        className="primary-button"
        disabled={!complete || (!endpointConfigured && !allowOfflinePreview)}
        onClick={continueToStudy}
      >
        {taskMode ? "Continue to research task" : `Continue to ${profileLabel}`}
      </button>
      <button type="button" className="back-link" onClick={onCancel}>
        Continue without contributing
      </button>
    </section>
  );
}
