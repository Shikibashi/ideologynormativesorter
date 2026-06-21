import type { Axis, Domain, ResultProfile } from '../types'
import { AxisBar } from './AxisBar'

interface ResultsScreenProps {
  result: ResultProfile
  axes: Axis[]
  domains: Domain[]
  onRestart: () => void
}

const LAYER_TITLES = {
  normative: 'Normative profile — what you believe is morally legitimate',
  descriptive: 'Descriptive profile — what you believe is empirically true',
  prescriptive: 'Prescriptive profile — what you think should be done now',
} as const

export function ResultsScreen({ result, axes, domains, onRestart }: ResultsScreenProps) {
  const axisById = new Map(axes.map((a) => [a.id, a]))
  const domainById = new Map(domains.map((d) => [d.id, d]))

  return (
    <section className="screen results-screen">
      <h1>Your results</h1>
      <p className="muted">
        These three profiles are the actual result. The nearest-label section further down is a secondary, approximate
        summary &mdash; most real positions don't reduce cleanly to a single label.
      </p>

      {(['normative', 'descriptive', 'prescriptive'] as const).map((layer) => (
        <div className="result-block" key={layer}>
          <h2>{LAYER_TITLES[layer]}</h2>
          <div className="axis-bar-list">
            {result.scores[layer].map((score) => {
              const axis = axisById.get(score.axisId)
              return axis ? <AxisBar key={score.axisId} axis={axis} score={score} /> : null
            })}
          </div>
        </div>
      ))}

      {result.gaps.length > 0 && (
        <div className="result-block">
          <h2>Ideal vs. non-ideal gap</h2>
          <p className="muted">
            How far your real-world-constrained answers diverge from your answers about favorable, ideal conditions, by
            domain. A large gap means your prescriptions for now look quite different from your ideal-conditions
            judgments.
          </p>
          <ul className="gap-list">
            {result.gaps.map((gap) => (
              <li key={gap.domain}>
                <strong>{domainById.get(gap.domain)?.name ?? gap.domain}</strong>: ideal {gap.ideal.toFixed(2)}, non-ideal{' '}
                {gap.nonIdeal.toFixed(2)}, gap {gap.gap.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="result-block">
        <h2>Nearest ideology labels (secondary)</h2>
        <p className="muted">
          Ranked by overall distance across all profiles. Treat this as a rough conversation-starter, not your result.
        </p>
        <ol className="label-list">
          {result.nearestLabels.map((match) => (
            <li key={match.labelId}>
              {match.name} <span className="muted">({Math.round(match.confidence * 100)}% match)</span>
            </li>
          ))}
        </ol>
      </div>

      {result.confoundedLabels.length > 0 && (
        <div className="result-block">
          <h2>Labels that would oversimplify your position</h2>
          <ul className="confounded-list">
            {result.confoundedLabels.map((flag) => (
              <li key={flag.labelId}>{flag.reason}</li>
            ))}
          </ul>
        </div>
      )}

      <button type="button" className="primary-button" onClick={onRestart}>
        Start over
      </button>
    </section>
  )
}
