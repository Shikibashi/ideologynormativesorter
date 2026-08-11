import { useEffect, useRef } from 'react'
import type { ScoreBreakdown } from '../types'

const SIZE = 440

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

function cssLengthPx(name: string, fallback: number): number {
  const rootStyle = getComputedStyle(document.documentElement)
  const value = rootStyle.getPropertyValue(name).trim()
  const numeric = Number.parseFloat(value)
  if (!Number.isFinite(numeric)) return fallback
  if (value.endsWith('rem')) {
    return numeric * (Number.parseFloat(rootStyle.fontSize) || 16)
  }
  return value.endsWith('px') ? numeric : fallback
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

    let resolutionMedia: MediaQueryList | null = null
    const draw = () => {
      const size = Math.max(1, Math.round(canvas.getBoundingClientRect().width || SIZE))
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.round(size * dpr))
      canvas.height = Math.max(1, Math.round(size * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const pad = Math.max(42, Math.min(56, size * 0.13))
      const cx = size / 2
      const cy = size / 2
      const plotRadius = Math.max(1, size / 2 - pad)
      const background = cssColor('--ecw-surface-input', '#fff')
      const grid = cssColor('--ecw-border-structural', '#8b8b84')
      const strongGrid = cssColor('--ecw-border-strong', '#3f3f3a')
      const text = cssColor('--ecw-text-strong', '#101010')
      const muted = cssColor('--ecw-text-muted', '#66665f')
      const userColor = cssColor('--ecw-selection', '#163f91')
      const compareColor = cssColor('--ecw-status-error-accent', '#8c1d18')
      const uiFont = getComputedStyle(document.documentElement).getPropertyValue('--ecw-font-ui').trim()
        || 'Verdana, "DejaVu Sans", Tahoma, sans-serif'
      const systemFont = getComputedStyle(document.documentElement).getPropertyValue('--ecw-font-system').trim()
        || '"Courier New", "Liberation Mono", monospace'
      const microSize = Math.max(12, cssLengthPx('--ecw-font-size-micro', 12))
      canvas.dataset.ecwUiFont = uiFont
      canvas.dataset.ecwSystemFont = systemFont
      canvas.dataset.ecwDrawSize = String(size)
      canvas.dataset.ecwDrawDpr = String(dpr)
      canvas.dataset.ecwDrawCount = String(Number(canvas.dataset.ecwDrawCount ?? 0) + 1)

      ctx.clearRect(0, 0, size, size)
      ctx.fillStyle = background
      ctx.fillRect(0, 0, size, size)

      ctx.strokeStyle = grid
      ctx.lineWidth = 1
      ctx.setLineDash([2, 4])
      for (const value of [-0.5, 0.5]) {
        const px = cx + value * plotRadius
        const py = cy - value * plotRadius
        ctx.beginPath()
        ctx.moveTo(px, pad)
        ctx.lineTo(px, size - pad)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(pad, py)
        ctx.lineTo(size - pad, py)
        ctx.stroke()
      }

      ctx.setLineDash([])
      ctx.strokeStyle = strongGrid
      ctx.beginPath()
      ctx.moveTo(cx, pad)
      ctx.lineTo(cx, size - pad)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(pad, cy)
      ctx.lineTo(size - pad, cy)
      ctx.stroke()

      ctx.fillStyle = muted
      ctx.font = `${microSize}px ${uiFont}`
      ctx.textAlign = 'center'
      ctx.fillText('ECONOMIC LEFT', pad + plotRadius * 0.27, cy - microSize)
      ctx.fillText('ECONOMIC RIGHT', size - pad - plotRadius * 0.27, cy - microSize)
      ctx.fillText('AUTHORITARIAN', cx, pad - microSize * 0.75)
      ctx.fillText('LIBERTARIAN', cx, size - pad + microSize * 1.8)

      function plotPoint(c: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) {
        const px = cx + x * plotRadius
        const py = cy - y * plotRadius

        c.fillStyle = color
        c.strokeStyle = text
        c.lineWidth = 1.5
        c.fillRect(px - 6, py - 6, 12, 12)
        c.strokeRect(px - 6, py - 6, 12, 12)

        c.fillStyle = text
        c.font = `700 ${microSize}px ${uiFont}`
        c.textAlign = 'center'
        c.fillText(label, px, py - 12)
      }

      plotPoint(ctx, pt.x, pt.y, userColor, 'You')
      if (compareX !== undefined && compareY !== undefined) plotPoint(ctx, compareX, compareY, compareColor, 'Compare')
    }

    const resizeObserver = typeof ResizeObserver === 'function'
      ? new ResizeObserver(draw)
      : null
    if (canvas.parentElement) resizeObserver?.observe(canvas.parentElement)
    const attributeObserver = new MutationObserver(draw)
    attributeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-contrast'],
    })
    const watchResolution = () => {
      if (typeof window.matchMedia !== 'function') return
      resolutionMedia = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`)
      resolutionMedia.addEventListener?.('change', handleResolutionChange, { once: true })
    }
    const handleResolutionChange = () => {
      draw()
      watchResolution()
    }

    draw()
    watchResolution()
    window.addEventListener('resize', draw)
    return () => {
      resizeObserver?.disconnect()
      attributeObserver.disconnect()
      resolutionMedia?.removeEventListener?.('change', handleResolutionChange)
      window.removeEventListener('resize', draw)
    }
  }, [pt.x, pt.y, compareX, compareY])

  return (
    <div className="compass-plot">
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{ width: '100%', maxWidth: SIZE, height: 'auto', aspectRatio: '1' }}
        aria-label={`Political compass: ${pt.x < -0.12 ? 'economic left' : pt.x > 0.12 ? 'economic right' : 'economic midpoint'} and ${pt.y < -0.12 ? 'libertarian' : pt.y > 0.12 ? 'authoritarian' : 'authority midpoint'}`}
      />
      <p className="muted" style={{ fontSize: '0.8rem' }}>
        Horizontal: economic left to economic right. Vertical: libertarian to authoritarian.
      </p>
    </div>
  )
}
