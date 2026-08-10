import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SiteShell } from './SiteShell'

const THEME_STORAGE_KEY = 'political-judgment-theme-v1'

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

beforeEach(() => {
  installLocalStorage()
  document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute('data-theme')
})

describe('SiteShell theme control', () => {
  it('starts in dark mode and toggles to an accessible light mode', () => {
    render(<SiteShell><p>Application content</p></SiteShell>)

    const toggle = screen.getByRole('button', { name: 'Switch to light mode' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement.dataset.theme).toBe('dark')

    fireEvent.click(toggle)

    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('restores the persisted theme on the next render', () => {
    const store = installLocalStorage()
    store.set(THEME_STORAGE_KEY, 'light')

    render(<SiteShell><p>Application content</p></SiteShell>)

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toHaveAttribute('aria-pressed', 'true')
  })
})
