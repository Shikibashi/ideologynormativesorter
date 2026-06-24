import { useState } from 'react'
import type { Axis, AxisScore, Contribution, ResultProfile } from '../types'

interface AxisBarProps {
  axis: Axis
  score: AxisScore
  result?: ResultProfile
}

function salienceBucket(avgSalience: number): string {
  if (avgSalience < 2.34) return 'low'
  if (avgSalience < 3.67) return 'medium'
  return 'high'
}

export function AxisBar({ axis, score, result }: AxisBarProps) {
  const percent = ((score.normalized + 1) / 2) * 100
  const salienceLabel = axis.layer === 'descriptive' ? 'confidence' : axis.layer === 'prescriptive' ? 'priority' : null
  const [showWhy, setShowWhy] = useState(false)

  const rel = result?.axisReliabilities?.[axis.id]
  const contribs = result?.contributions?.[axis.id] || []

  return (
    <div className="axis-bar">
      <div className="axis-bar-header">
        <span>{axis.name}</span>
        <span className="muted">{score.itemCount === 0 ? 'unmeasured' : score.normalized.toFixed(2)}</span>
        {rel && <span className={`reliability ${rel.band}`}>{rel.band}</span>}
      </div>
      <div className="axis-bar-track">
        <div className="axis-bar-midline" />
        {score.itemCount > 0 && <div className="axis-bar-marker" style={{ left: `${percent}%` }} />}
      </div>
      <div className="axis-bar-poles">
        <span>{axis.negativePole}</span>
        <span>{axis.positivePole}</span>
      </div>
      {salienceLabel && score.avgSalience !== undefined && (
        <p className="axis-bar-salience muted">
          Average {salienceLabel}: {salienceBucket(score.avgSalience)}
        </p>
      )}
      {rel && (
        <p className="axis-bar-reliability muted">
          Reliability: {rel.band} — {rel.reason}
        </p>
      )}
      {contribs.length > 0 && (
        <button type="button" className="why-button" onClick={() => setShowWhy(!showWhy)}>
          {showWhy ? 'Hide' : 'Why this score?'}
        </button>
      )}
      {showWhy && contribs.length > 0 && (
        <ul className="why-list">
          {contribs.slice(0, 3).map((c: Contribution) => (
            <li key={c.questionId}>
              {c.prompt.slice(0, 80)}... → {c.contribution.toFixed(2)} ({c.layer})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}