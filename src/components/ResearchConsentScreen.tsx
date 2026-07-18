import { useState } from 'react'
import { RESEARCH_CONSENT_VERSION, type ResearchConsent, type ResearchAdministration } from '../research'

interface ResearchConsentScreenProps {
  participantId: string
  administration: ResearchAdministration
  onConsent: (consent: ResearchConsent) => void
  onCancel: () => void
}

export function ResearchConsentScreen({ participantId, administration, onConsent, onCancel }: ResearchConsentScreenProps) {
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [voluntaryParticipation, setVoluntaryParticipation] = useState(false)
  const [dataUseAccepted, setDataUseAccepted] = useState(false)
  const complete = ageConfirmed && voluntaryParticipation && dataUseAccepted

  function continueToStudy(): void {
    if (!complete) return
    onConsent({
      ageConfirmed: true,
      voluntaryParticipation: true,
      dataUseAccepted: true,
      consentVersion: RESEARCH_CONSENT_VERSION,
      consentedAt: new Date().toISOString(),
    })
  }

  return (
    <section className="screen intro-screen">
      <h1>Research participation</h1>
      <p>
        This is the {administration === 'retest' ? 'retest' : 'initial test'} administration of an instrument-validation study.
        Participation is optional. Declining returns you to the ordinary quiz.
      </p>
      <p className="muted">
        The study record contains your answers, broad optional demographic groups, a self-selected political label, test
        versions, and a random participant code. It does not request your name, email address, exact age, precise location,
        or contact information. A configured research server may receive the record; otherwise it remains in your browser
        until you download it.
      </p>
      <p className="muted">Participant code: <code>{participantId}</code></p>

      <fieldset className="tier-picker">
        <legend>Consent</legend>
        <label className={`tier-option${ageConfirmed ? ' selected' : ''}`}>
          <input type="checkbox" checked={ageConfirmed} onChange={(event) => setAgeConfirmed(event.target.checked)} />
          <span className="tier-option-label">I confirm that I am at least 18 years old.</span>
        </label>
        <label className={`tier-option${voluntaryParticipation ? ' selected' : ''}`}>
          <input
            type="checkbox"
            checked={voluntaryParticipation}
            onChange={(event) => setVoluntaryParticipation(event.target.checked)}
          />
          <span className="tier-option-label">I understand participation is voluntary and I may stop before submitting.</span>
        </label>
        <label className={`tier-option${dataUseAccepted ? ' selected' : ''}`}>
          <input type="checkbox" checked={dataUseAccepted} onChange={(event) => setDataUseAccepted(event.target.checked)} />
          <span className="tier-option-label">
            I consent to use of this pseudonymous record for instrument development and psychometric analysis.
          </span>
        </label>
      </fieldset>

      <button type="button" className="primary-button" disabled={!complete} onClick={continueToStudy}>
        Continue to study
      </button>
      <button type="button" className="back-link" onClick={onCancel}>Use ordinary quiz instead</button>
    </section>
  )
}
