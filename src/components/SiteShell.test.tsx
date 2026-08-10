import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SiteShell } from './SiteShell'

const APPEARANCE_STORAGE_KEY = 'political-judgment-appearance-v1'

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

function installMatchMedia(initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<() => void>()
  const media = {
    get matches() {
      return matches
    },
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_event: string, listener: () => void) => listeners.delete(listener),
    addListener: (listener: () => void) => listeners.add(listener),
    removeListener: (listener: () => void) => listeners.delete(listener),
  }
  Object.defineProperty(window, 'matchMedia', { value: () => media, configurable: true })

  return {
    setMatches(next: boolean) {
      matches = next
      listeners.forEach((listener) => listener())
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
})

describe('SiteShell appearance control', () => {
  it('defaults to System and persists an explicit Light selection', () => {
    render(<SiteShell><p>Application content</p></SiteShell>)

    const appearance = screen.getByLabelText('Appearance')
    expect(appearance).toHaveValue('system')
    expect(document.documentElement.dataset.theme).toBe('dark')

    fireEvent.change(appearance, { target: { value: 'light' } })

    expect(appearance).toHaveValue('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('light')
  })

  it('restores the persisted appearance on the next render', () => {
    const store = installLocalStorage()
    store.set(APPEARANCE_STORAGE_KEY, 'light')

    render(<SiteShell><p>Application content</p></SiteShell>)

    expect(screen.getByLabelText('Appearance')).toHaveValue('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('tracks operating-system changes while System is selected', () => {
    const media = installMatchMedia(true)
    render(<SiteShell><p>Application content</p></SiteShell>)

    expect(document.documentElement.dataset.theme).toBe('dark')

    act(() => media.setMatches(false))

    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
