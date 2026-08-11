import type { SpecialistModuleDefinition, SpecialistOutcome } from '../specialist'
import { constructSignalLabel, labelProximityLabel } from '../resultLanguage'

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
        <span className="section-band-label">COMMUNITY INPUT / EXPERIMENT</span>
        <span className="section-band-status">MAIN RESULT UNCHANGED</span>
      </div>
      <h1>Experimental follow-up result</h1>
      <p>
        This is an early result for <strong>{module.title}</strong>. Contributions help the site owner see whether these
        finer distinctions are useful. It does not alter your main ideology result.
      </p>
      <p className="muted">
        The matches below are experimental comparisons, not authoritative claims about your political identity.
      </p>

      <div className="result-block">
        <h2>Closest experimental matches</h2>
        {visibleMatches.length > 0 ? (
          <div className="label-grid">
            {visibleMatches.map((match) => (
              <article className="label-card" key={`${match.id}:${match.variant ?? ''}`}>
                <h5>{match.name}{match.variant ? ` — ${match.variant}` : ''}</h5>
                <p className="muted">{labelProximityLabel(match.fit)} · experimental candidate comparison</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">No candidate profile was a strong fit. That is useful feedback too.</p>
        )}
      </div>

      <div className="result-block">
        <h2>Measured follow-up dimensions</h2>
        <div className="axis-list">
          {constructs.map(([constructId, score]) => (
            <div className="axis-row" key={constructId}>
              <div className="axis-label">
                <span>{formatConstructName(constructId)}</span>
                <span>{constructSignalLabel(score)}</span>
              </div>
              <div className="progress-track" aria-label={`${formatConstructName(constructId)}: ${constructSignalLabel(score)}`}>
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
