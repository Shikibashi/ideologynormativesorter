import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SiteShell } from './SiteShell'
import { announceStatus } from '../status'
import type { ShellContext } from './SiteShell'

const APPEARANCE_STORAGE_KEY = 'political-judgment-appearance-v1'
const DENSITY_STORAGE_KEY = 'political-judgment-density-v1'
const TEST_CONTEXT: ShellContext = {
  stage: 'intro',
  composition: 'page',
  contextItems: [
    { label: 'MODE', value: 'ASSESSMENT' },
    { label: 'STORAGE', value: 'BROWSER LOCAL' },
  ],
  statusItems: [
    { label: 'STAGE', value: 'START' },
    { label: 'SAVE', value: 'LOCAL' },
  ],
}

function installLocalStorage(): Map<string, string> {
  const store = new Map<string, string>()
  const storage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    },
  }
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true })
  return store
}

function installMatchMedia(initialDark: boolean, initialCoarse = false, initialFine = false, initialHover = false) {
  let darkMatches = initialDark
  let coarseMatches = initialCoarse
  let fineMatches = initialFine
  let hoverMatches = initialHover
  const listeners = new Map<string, Set<() => void>>()
  const matchesFor = (query: string) => {
    if (query === '(prefers-color-scheme: dark)') return darkMatches
    if (query === '(any-pointer: fine)') return fineMatches
    if (query === '(any-hover: hover)') return hoverMatches
    if (query === '(pointer: coarse)') return coarseMatches
    if (query === '(hover: none)') return coarseMatches && !hoverMatches
    return false
  }
  const mediaFor = (query: string) => {
    const queryListeners = listeners.get(query) ?? new Set<() => void>()
    listeners.set(query, queryListeners)
    return {
      get matches() {
        return matchesFor(query)
      },
      media: query,
      addEventListener: (_event: string, listener: () => void) => queryListeners.add(listener),
      removeEventListener: (_event: string, listener: () => void) => queryListeners.delete(listener),
      addListener: (listener: () => void) => queryListeners.add(listener),
      removeListener: (listener: () => void) => queryListeners.delete(listener),
    }
  }
  Object.defineProperty(window, 'matchMedia', { value: (query: string) => mediaFor(query), configurable: true })

  return {
    setMatches(next: boolean) {
      darkMatches = next
      listeners.get('(prefers-color-scheme: dark)')?.forEach((listener) => listener())
    },
    setCoarse(next: boolean) {
      coarseMatches = next
      listeners.get('(pointer: coarse)')?.forEach((listener) => listener())
      listeners.get('(hover: none)')?.forEach((listener) => listener())
    },
    setHybrid(next: boolean) {
      fineMatches = next
      hoverMatches = next
      listeners.get('(any-pointer: fine)')?.forEach((listener) => listener())
      listeners.get('(any-hover: hover)')?.forEach((listener) => listener())
      listeners.get('(hover: none)')?.forEach((listener) => listener())
    },
  }
}

beforeEach(() => {
  installLocalStorage()
  installMatchMedia(true)
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.removeAttribute('data-contrast')
})

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.removeAttribute('data-density')
  document.documentElement.removeAttribute('data-contrast')
})

describe('SiteShell appearance control', () => {
  it('provides persistent home links in the branding and navigation', () => {
    render(<SiteShell context={TEST_CONTEXT}><p>Application content</p></SiteShell>)

    expect(screen.getByRole('link', { name: 'Political Judgment Lab' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'HOME' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'METHODOLOGY' })).toHaveAttribute('href', '/?view=methodology')
    expect(screen.getByRole('link', { name: 'HOME' })).toHaveAttribute('aria-current', 'page')
  })

  it('marks the methodology destination as the current page', () => {
    window.history.replaceState(null, '', '/?view=methodology')
    const methodologyContext = { ...TEST_CONTEXT, stage: 'methodology' }

    render(<SiteShell context={methodologyContext}><p>Application content</p></SiteShell>)

    expect(screen.getByRole('link', { name: 'METHODOLOGY' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'HOME' })).not.toHaveAttribute('aria-current')
  })

  it('does not mark Home current for a results workbench', () => {
    const resultsContext = { ...TEST_CONTEXT, stage: 'results', composition: 'workbench' as const }
    render(<SiteShell context={resultsContext}><p>Application content</p></SiteShell>)

    expect(screen.getByRole('link', { name: 'HOME' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'METHODOLOGY' })).not.toHaveAttribute('aria-current')
  })

  it('keeps result navigation in the current app when Methodology is opened from results', () => {
    window.history.replaceState(null, '', '/')
    const resultsContext = { ...TEST_CONTEXT, stage: 'results', composition: 'workbench' as const }
    render(
      <SiteShell context={resultsContext}>
        <a href="/?view=methodology">Open methodology from the result</a>
      </SiteShell>,
    )

    fireEvent.click(screen.getByRole('link', { name: 'Open methodology from the result' }))

    expect(window.location.pathname).toBe('/')
    expect(window.location.search).toBe('?view=methodology')
  })

  it('defaults to System and persists an explicit Light selection', () => {
    render(<SiteShell context={TEST_CONTEXT}><p>Application content</p></SiteShell>)

    const system = screen.getByRole('radio', { name: 'System' })
    expect(system).toBeChecked()
    expect(document.documentElement.dataset.theme).toBe('dark')

    fireEvent.click(screen.getByRole('radio', { name: 'Light' }))

    expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked()
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('light')
  })

  it('persists an explicit Comfortable density without changing the appearance choice', () => {
    render(<SiteShell context={TEST_CONTEXT}><p>Application content</p></SiteShell>)

    expect(screen.getAllByRole('radio', { name: 'Automatic' })).toHaveLength(2)
    screen.getAllByRole('radio', { name: 'Automatic' }).forEach((control) => expect(control).toBeChecked())
    expect(document.documentElement.dataset.density).toBe('compact')

    fireEvent.click(screen.getByRole('radio', { name: 'Comfortable' }))

    expect(screen.getByRole('radio', { name: 'Comfortable' })).toBeChecked()
    expect(document.documentElement.dataset.density).toBe('comfortable')
    expect(localStorage.getItem(DENSITY_STORAGE_KEY)).toBe('comfortable')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('restores the persisted appearance on the next render', () => {
    const store = installLocalStorage()
    store.set(APPEARANCE_STORAGE_KEY, 'light')
    store.set(DENSITY_STORAGE_KEY, 'comfortable')

    render(<SiteShell context={TEST_CONTEXT}><p>Application content</p></SiteShell>)

    expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Comfortable' })).toBeChecked()
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.dataset.density).toBe('comfortable')
  })

  it('persists and applies an explicit increased-contrast preference', () => {
    render(<SiteShell context={TEST_CONTEXT}><p>Application content</p></SiteShell>)

    fireEvent.click(screen.getByRole('radio', { name: 'More' }))

    expect(document.documentElement.dataset.contrast).toBe('more')
    expect(localStorage.getItem('political-judgment-contrast-v1')).toBe('more')
  })

  it('tracks operating-system changes while System is selected', () => {
    const media = installMatchMedia(true)
    render(<SiteShell context={TEST_CONTEXT}><p>Application content</p></SiteShell>)

    expect(document.documentElement.dataset.theme).toBe('dark')

    act(() => media.setMatches(false))

    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('resolves Automatic density from coarse input capability', () => {
    const media = installMatchMedia(true, false)
    render(<SiteShell context={TEST_CONTEXT}><p>Application content</p></SiteShell>)

    expect(document.documentElement.dataset.density).toBe('compact')

    act(() => media.setCoarse(true))

    expect(document.documentElement.dataset.density).toBe('comfortable')
  })

  it('keeps Automatic density compact on hybrid hardware with fine input and hover', () => {
    installMatchMedia(true, true, true, true)
    render(<SiteShell context={TEST_CONTEXT}><p>Application content</p></SiteShell>)

    expect(document.documentElement.dataset.density).toBe('compact')
  })

  it('closes DISPLAY with Escape and returns focus to the disclosure control', () => {
    render(<SiteShell context={TEST_CONTEXT}><p>Application content</p></SiteShell>)

    fireEvent.click(screen.getByText('DISPLAY', { exact: true }))
    const light = screen.getByRole('radio', { name: 'Light' })
    light.focus()

    fireEvent.keyDown(light, { key: 'Escape' })

    expect(document.querySelector('details[open]')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(screen.getByText('DISPLAY', { exact: true }))
  })

  it('keeps persistent status out of live regions and announces discrete events separately', () => {
    render(<SiteShell context={TEST_CONTEXT}><p>Application content</p></SiteShell>)

    expect(screen.getByLabelText('Application status')).not.toHaveAttribute('aria-live')
    const announcer = document.querySelector('.sr-status-announcer')
    expect(announcer).toHaveAttribute('aria-live', 'polite')

    act(() => announceStatus('Assessment progress saved locally.'))

    expect(announcer).toHaveTextContent('Assessment progress saved locally.')
  })
})
