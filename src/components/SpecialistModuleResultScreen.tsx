import type { SpecialistModuleDefinition, SpecialistOutcome } from '../specialist'

interface SpecialistModuleResultScreenProps {
  module: SpecialistModuleDefinition
  outcome: SpecialistOutcome
  onContinue: () => void
}

function formatConstructName(value: string): string {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function SpecialistModuleResultScreen({ module, outcome, onContinue }: SpecialistModuleResultScreenProps) {
  const visibleMatches = outcome.matches.filter((match) => match.fit >= 0.35).slice(0, 5)
  const constructs = Object.entries(outcome.constructScores)
    .sort((left, right) => Math.abs(right[1]) - Math.abs(left[1]))

  return (
    <section className="screen results-screen">
      <div className="section-band">
        <span className="section-band-label">VALIDATION STUDY / EXPERIMENT</span>
        <span className="section-band-status">MAIN RESULT UNCHANGED</span>
      </div>
      <h1>Experimental follow-up result</h1>
      <p>
        This is a research-stage result for <strong>{module.title}</strong>. It is being collected to test whether these
        distinctions work with real respondents. It does not alter your main ideology result.
      </p>
      <p className="muted">
        Candidate and specialist matches below are measurement hypotheses. A close fit is evidence for future validation,
        not a claim that the test has already established your political identity.
      </p>

      <div className="result-block">
        <h2>Closest experimental matches</h2>
        {visibleMatches.length > 0 ? (
          <div className="label-grid">
            {visibleMatches.map((match) => (
              <article className="label-card" key={`${match.id}:${match.variant ?? ''}`}>
                <h5>{match.name}{match.variant ? ` — ${match.variant}` : ''}</h5>
                <p className="muted">{Math.round(match.fit * 100)}% experimental fit · {match.status.replaceAll('-', ' ')}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">No candidate profile was a strong fit. That is useful validation data too.</p>
        )}
      </div>

      <div className="result-block">
        <h2>Measured follow-up dimensions</h2>
        <div className="axis-list">
          {constructs.map(([constructId, score]) => (
            <div className="axis-row" key={constructId}>
              <div className="axis-label">
                <span>{formatConstructName(constructId)}</span>
                <span>{score > 0 ? '+' : ''}{score.toFixed(2)}</span>
              </div>
              <div className="progress-track" aria-label={`${formatConstructName(constructId)} ${score.toFixed(2)}`}>
                <div className="progress-fill" style={{ width: `${Math.abs(score) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="primary-button" onClick={onContinue}>
        Continue to main results
      </button>
    </section>
  )
}
