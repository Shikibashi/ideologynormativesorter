import { useEffect, useRef } from 'react'
import type { ScoreBreakdown } from '../types'

const SIZE = 300
const PAD = 30
const CX = SIZE / 2
const CY = SIZE / 2

interface CompassPlotProps {
  scores: ScoreBreakdown
  /** Optional second profile for overlay comparison. */
  compareScores?: ScoreBreakdown
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}

function composite(allScores: ScoreBreakdown): { x: number; y: number } {
  const flat = Object.values(allScores).flat()
  const byId = new Map(flat.map((s) => [s.axisId, s]))

  // Economic: positive = right (market confidence, property, deregulation)
  // Negative = left (equality, redistribution, regulation)
  const econAxes = ['property-legitimacy', 'market-process-confidence', 'regulation-vs-deregulation',
    'redistribution-vs-predistribution', 'equality-theory']
  const econScores = econAxes.map((id) => byId.get(id)?.normalized ?? 0)
  const econ = (econScores[0] - econScores[4] + econScores[1] - econScores[3] - econScores[2]) / 5

  // Authority: positive = authoritarian (authority legitimate, coercion, centralization)
  // Negative = libertarian (anti-authority, anti-domination, decentralization)
  const authAxes = ['authority-legitimacy', 'anti-domination', 'centralization-preference',
    'coercion-strategy', 'liberty-noninterference']
  const authScores = authAxes.map((id) => byId.get(id)?.normalized ?? 0)
  const auth = (authScores[0] - authScores[1] + authScores[2] + authScores[3] - authScores[4]) / 5

  return { x: clamp(econ, -1, 1), y: clamp(auth, -1, 1) }
}

/**
 * Renders a 2D compass plot: economic left/right on X, authoritarian/libertarian on Y.
 * Averages the relevant axes per layer for a single centroid dot.
 */
export function CompassPlot({ scores, compareScores }: CompassPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pt = composite(scores)
  const pt2 = compareScores ? composite(compareScores) : null
  const compareX = pt2?.x
  const compareY = pt2?.y

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    ctx.scale(dpr, dpr)

    ctx.fillStyle = '#f4f4f4'
    ctx.fillRect(0, 0, SIZE, SIZE)

    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(CX, PAD)
    ctx.lineTo(CX, SIZE - PAD)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(PAD, CY)
    ctx.lineTo(SIZE - PAD, CY)
    ctx.stroke()

    ctx.fillStyle = '#999'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Left', PAD + 5, CY - 5)
    ctx.fillText('Right', SIZE - PAD - 5, CY - 5)
    ctx.fillText('Authoritarian', CX, PAD + 12)
    ctx.fillText('Libertarian', CX, SIZE - PAD - 5)

    for (let v = -0.5; v <= 0.5; v += 0.5) {
      const px = CX + (v / 1) * (SIZE / 2 - PAD)
      const py = CY - (v / 1) * (SIZE / 2 - PAD)
      ctx.beginPath()
      ctx.arc(px, CY, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#ccc'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(CX, py, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#ccc'
      ctx.fill()
    }

    function plotPoint(c: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) {
      const px = CX + (x / 1) * (SIZE / 2 - PAD)
      const py = CY - (y / 1) * (SIZE / 2 - PAD)

      c.beginPath()
      c.arc(px, py, 6, 0, Math.PI * 2)
      c.fillStyle = color
      c.fill()
      c.strokeStyle = '#333'
      c.lineWidth = 1.5
      c.stroke()

      c.fillStyle = '#333'
      c.font = 'bold 12px sans-serif'
      c.textAlign = 'center'
      c.fillText(label, px, py - 12)
    }

    plotPoint(ctx, pt.x, pt.y, '#2563eb', 'You')
    if (compareX !== undefined && compareY !== undefined) plotPoint(ctx, compareX, compareY, '#dc2626', 'Compare')
  }, [pt.x, pt.y, compareX, compareY])


  return (
    <div className="compass-plot">
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE, maxWidth: '100%' }}
        aria-label={`Economic (${pt.x.toFixed(2)}) by authority (${pt.y.toFixed(2)}) compass plot`}
      />
      <p className="muted" style={{ fontSize: '0.8rem' }}>
        X: Economic left (–1) / right (+1). Y: Authoritarian (+1) / libertarian (–1).
      </p>
    </div>
  )
}
