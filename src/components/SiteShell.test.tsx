import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SiteShell } from './SiteShell'

const APPEARANCE_STORAGE_KEY = 'political-judgment-appearance-v1'
const DENSITY_STORAGE_KEY = 'political-judgment-density-v1'

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

function installMatchMedia(initialDark: boolean, initialCoarse = false) {
  let darkMatches = initialDark
  let coarseMatches = initialCoarse
  const listeners = new Map<string, Set<() => void>>()
  const matchesFor = (query: string) => query === '(prefers-color-scheme: dark)' ? darkMatches : coarseMatches
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
  }
}

beforeEach(() => {
  installLocalStorage()
  installMatchMedia(true)
  document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.removeAttribute('data-density')
})

describe('SiteShell appearance control', () => {
  it('defaults to System and persists an explicit Light selection', () => {
    render(<SiteShell><p>Application content</p></SiteShell>)

    const system = screen.getByRole('radio', { name: 'System' })
    expect(system).toBeChecked()
    expect(document.documentElement.dataset.theme).toBe('dark')

    fireEvent.click(screen.getByRole('radio', { name: 'Light' }))

    expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked()
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('light')
  })

  it('persists an explicit Comfortable density without changing the appearance choice', () => {
    render(<SiteShell><p>Application content</p></SiteShell>)

    expect(screen.getByRole('radio', { name: 'Automatic' })).toBeChecked()
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

    render(<SiteShell><p>Application content</p></SiteShell>)

    expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Comfortable' })).toBeChecked()
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.dataset.density).toBe('comfortable')
  })

  it('tracks operating-system changes while System is selected', () => {
    const media = installMatchMedia(true)
    render(<SiteShell><p>Application content</p></SiteShell>)

    expect(document.documentElement.dataset.theme).toBe('dark')

    act(() => media.setMatches(false))

    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('resolves Automatic density from coarse input capability', () => {
    const media = installMatchMedia(true, false)
    render(<SiteShell><p>Application content</p></SiteShell>)

    expect(document.documentElement.dataset.density).toBe('compact')

    act(() => media.setCoarse(true))

    expect(document.documentElement.dataset.density).toBe('comfortable')
  })
})
