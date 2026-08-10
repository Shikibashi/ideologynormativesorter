import { useEffect, useRef } from 'react'
import type { ScoreBreakdown } from '../types'

const SIZE = 440
const PAD = 48
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

  const econAxes = ['property-legitimacy', 'market-process-confidence', 'regulation-vs-deregulation',
    'redistribution-vs-predistribution', 'equality-theory']
  const econScores = econAxes.map((id) => byId.get(id)?.normalized ?? 0)
  const econ = (econScores[0] - econScores[4] + econScores[1] - econScores[3] - econScores[2]) / 5

  const authAxes = ['authority-legitimacy', 'anti-domination', 'centralization-preference',
    'coercion-strategy', 'liberty-noninterference']
  const authScores = authAxes.map((id) => byId.get(id)?.normalized ?? 0)
  const auth = (authScores[0] - authScores[1] + authScores[2] + authScores[3] - authScores[4]) / 5

  return { x: clamp(econ, -1, 1), y: clamp(auth, -1, 1) }
}

function cssColor(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

/**
 * Renders a 2D compass plot: economic left/right on X, authoritarian/libertarian on Y.
 * Averages the relevant axes per layer for a single centroid marker.
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

    const draw = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.round(SIZE * dpr))
      canvas.height = Math.max(1, Math.round(SIZE * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const background = cssColor('--surface-sunken', '#fff')
    const grid = cssColor('--border', '#8b8b84')
    const strongGrid = cssColor('--border-dark', '#3f3f3a')
    const text = cssColor('--text-h', '#101010')
    const muted = cssColor('--text-m', '#66665f')
    const userColor = cssColor('--accent', '#163f91')
    const compareColor = cssColor('--danger', '#8c1d18')

    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.fillStyle = background
    ctx.fillRect(0, 0, SIZE, SIZE)

    ctx.strokeStyle = grid
    ctx.lineWidth = 1
    ctx.setLineDash([2, 4])
    for (const value of [-0.5, 0.5]) {
      const px = CX + value * (SIZE / 2 - PAD)
      const py = CY - value * (SIZE / 2 - PAD)
      ctx.beginPath()
      ctx.moveTo(px, PAD)
      ctx.lineTo(px, SIZE - PAD)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(PAD, py)
      ctx.lineTo(SIZE - PAD, py)
      ctx.stroke()
    }

    ctx.setLineDash([])
    ctx.strokeStyle = strongGrid
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(CX, PAD)
    ctx.lineTo(CX, SIZE - PAD)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(PAD, CY)
    ctx.lineTo(SIZE - PAD, CY)
    ctx.stroke()

    ctx.fillStyle = muted
    ctx.font = '12px "Segoe UI", Tahoma, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('ECONOMIC LEFT', PAD + 48, CY - 9)
    ctx.fillText('ECONOMIC RIGHT', SIZE - PAD - 50, CY - 9)
    ctx.fillText('AUTHORITARIAN', CX, PAD - 14)
    ctx.fillText('LIBERTARIAN', CX, SIZE - PAD + 24)

    ctx.font = '10px "Cascadia Mono", "Courier New", monospace'
    ctx.fillStyle = muted
    for (const value of [-1, -0.5, 0, 0.5, 1]) {
      const px = CX + value * (SIZE / 2 - PAD)
      const py = CY - value * (SIZE / 2 - PAD)
      ctx.textAlign = 'center'
      ctx.fillText(value.toFixed(value === 0 ? 0 : 1), px, CY + 16)
      if (value !== 0) {
        ctx.textAlign = 'right'
        ctx.fillText(value.toFixed(1), CX - 7, py + 3)
      }
    }

    function plotPoint(c: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) {
      const px = CX + x * (SIZE / 2 - PAD)
      const py = CY - y * (SIZE / 2 - PAD)

      c.fillStyle = color
      c.strokeStyle = text
      c.lineWidth = 1.5
      c.fillRect(px - 6, py - 6, 12, 12)
      c.strokeRect(px - 6, py - 6, 12, 12)

      c.fillStyle = text
      c.font = '700 12px "Segoe UI", Tahoma, sans-serif'
      c.textAlign = 'center'
      c.fillText(label, px, py - 12)
    }

      plotPoint(ctx, pt.x, pt.y, userColor, 'You')
      if (compareX !== undefined && compareY !== undefined) plotPoint(ctx, compareX, compareY, compareColor, 'Compare')
    }

    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [pt.x, pt.y, compareX, compareY])

  return (
    <div className="compass-plot">
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{ width: '100%', maxWidth: SIZE, height: 'auto', aspectRatio: '1' }}
        aria-label={`Economic (${pt.x.toFixed(2)}) by authority (${pt.y.toFixed(2)}) compass plot`}
      />
      <p className="muted" style={{ fontSize: '0.8rem' }}>
        X: economic left (−1) to right (+1). Y: libertarian (−1) to authoritarian (+1).
      </p>
    </div>
  )
}
