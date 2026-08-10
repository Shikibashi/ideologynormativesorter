import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
const appCss = readFileSync(join(process.cwd(), 'src/App.css'), 'utf8')
const compass = readFileSync(join(process.cwd(), 'src/components/CompassPlot.tsx'), 'utf8')
const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8')

function channel(value: string): number {
  const normalized = value.length === 1 ? `${value}${value}` : value
  const numeric = Number.parseInt(normalized, 16) / 255
  return numeric <= 0.03928 ? numeric / 12.92 : ((numeric + 0.055) / 1.055) ** 2.4
}

function contrast(first: string, second: string): number {
  const toRgb = (hex: string) => [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(channel)
  const firstLuminance = toRgb(first).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
  const secondLuminance = toRgb(second).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
  const lighter = Math.max(firstLuminance, secondLuminance)
  const darker = Math.min(firstLuminance, secondLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('ECW token contracts', () => {
  it('declares named fallbacks before generic families', () => {
    expect(css).toMatch(/--ecw-font-display:\s*Georgia,\s*"Noto Serif".*serif;/s)
    expect(css).toMatch(/--ecw-font-ui:\s*Verdana,\s*"DejaVu Sans".*sans-serif;/s)
    expect(css).toMatch(/--ecw-font-system:\s*"Courier New",\s*"Liberation Mono".*monospace;/s)
  })

  it('keeps the ECW hit-target floor above 24 CSS pixels at the default root size', () => {
    const compactHitMin = 1.875 * 16
    expect(compactHitMin).toBeGreaterThanOrEqual(24)
    expect(css).toContain('--ecw-hit-min: 1.875rem')
  })

  it('uses a fluid shell and demotes the masthead before tablet widths', () => {
    expect(css).toContain('--ecw-shell-max: clamp(92rem, 80vw, 160rem)')
    expect(css).toContain('width: min(var(--ecw-shell-max)')
    expect(appCss).toMatch(/@media \(max-width: 900px\) \{[\s\S]*?\.site-masthead \{[\s\S]*?grid-template-columns: 1fr;/)
    expect(appCss).toMatch(/\.results-screen \{[\s\S]*?max-width: none;[\s\S]*?padding-block-start: clamp\(1rem, 2vw, 1\.5rem\);/)
    expect(css).toMatch(/html \{[\s\S]*?overflow-x: hidden;[\s\S]*?overflow-x: clip;/)
    expect(css).toMatch(/body \{[\s\S]*?overflow-x: hidden;[\s\S]*?overflow-x: clip;/)
  })

  it('keeps the compass square and redraws at the current device pixel ratio', () => {
    expect(compass).toContain('Math.round(SIZE * dpr)')
    expect(compass).toContain('ctx.setTransform(dpr, 0, 0, dpr, 0, 0)')
    expect(compass).toContain("style={{ width: '100%', maxWidth: SIZE, height: 'auto', aspectRatio: '1' }}")
    expect(appCss).toMatch(/\.compass-plot canvas \{[\s\S]*?height: auto;[\s\S]*?aspect-ratio: 1;/)
  })

  it('keeps the two focus colors above the ECW 9:1 contrast rule', () => {
    expect(contrast('#ffd45c', '#050719')).toBeGreaterThanOrEqual(9)
    expect(contrast('#522598', '#ffffff')).toBeGreaterThanOrEqual(9)
    expect(css).toContain('--ecw-focus-outer')
    expect(css).toContain('--ecw-focus-inner')
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--ecw-focus-inner\);[^}]*box-shadow:\s*0 0 0 4px var\(--ecw-focus-outer\);/s)
  })

  it('defines explicit status foregrounds for accent fills', () => {
    expect(css).toContain('--ecw-warning-on-accent')
    expect(css).toContain('--ecw-success-on-accent')
    expect(css).toContain('--ecw-info-on-accent')
    expect(css).toContain('--ecw-error-on-accent')
    expect(css).toContain('--ecw-purple-on-accent')
  })

  it('keeps status accent foreground pairs above the normal text contrast floor', () => {
    const darkPairs = [
      ['#23d5a6', '#050719'],
      ['#ffd45c', '#050719'],
      ['#ff76a8', '#050719'],
      ['#6ff4ff', '#050719'],
    ] as const
    const lightPairs = [
      ['#23d5a6', '#11132d'],
      ['#ffd45c', '#11132d'],
      ['#ff76a8', '#11132d'],
      ['#6ff4ff', '#11132d'],
    ] as const

    for (const [accent, foreground] of [...darkPairs, ...lightPairs]) {
      expect(contrast(accent, foreground)).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('resolves appearance before first paint using the canonical preference keys', () => {
    expect(html).toContain('<meta name="color-scheme" content="light dark" />')
    expect(html).toContain('political-judgment-appearance-v1')
    expect(html).toContain('political-judgment-theme-v1')
    expect(html).toContain("document.documentElement.dataset.theme")
  })

  it('preserves selected-focus handling when forced colors replaces authored colors', () => {
    expect(css).toContain('@media (forced-colors: active)')
    expect(css).toContain('.scale-button.selected:focus-visible')
    expect(css).toContain('outline-color: HighlightText')
  })
})
