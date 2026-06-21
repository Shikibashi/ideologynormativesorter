import type { Axis, AxisScore } from '../types'

interface AxisBarProps {
  axis: Axis
  score: AxisScore
}

export function AxisBar({ axis, score }: AxisBarProps) {
  const percent = ((score.normalized + 1) / 2) * 100

  return (
    <div className="axis-bar">
      <div className="axis-bar-header">
        <span>{axis.name}</span>
        <span className="muted">{score.itemCount === 0 ? 'unmeasured' : score.normalized.toFixed(2)}</span>
      </div>
      <div className="axis-bar-track">
        <div className="axis-bar-midline" />
        {score.itemCount > 0 && <div className="axis-bar-marker" style={{ left: `${percent}%` }} />}
      </div>
      <div className="axis-bar-poles">
        <span>{axis.negativePole}</span>
        <span>{axis.positivePole}</span>
      </div>
    </div>
  )
}
