import { describe, expect, it } from 'vitest'
import {
  readAppearance,
  readContrast,
  readDensity,
  resolveAutomaticDensity,
  resolveContrast,
  resolveTheme,
} from './displayPreferences'

function storage(values: Record<string, string>) {
  return { getItem: (key: string) => values[key] ?? null }
}

describe('display preference resolution', () => {
  it('uses safe defaults and accepts persisted explicit preferences', () => {
    expect(readAppearance(storage({}))).toBe('system')
    expect(readDensity(storage({}))).toBe('automatic')
    expect(readContrast(storage({}))).toBe('automatic')
    expect(readAppearance(storage({ 'political-judgment-appearance-v1': 'light' }))).toBe('light')
    expect(readDensity(storage({ 'political-judgment-density-v1': 'comfortable' }))).toBe('comfortable')
    expect(readContrast(storage({ 'political-judgment-contrast-v1': 'more' }))).toBe('more')
  })

  it('resolves system appearance and contrast without overriding explicit choices', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveContrast('automatic', true)).toBe('more')
    expect(resolveContrast('standard', true)).toBe('standard')
  })

  it('does not classify a wide hybrid device as touch-only', () => {
    expect(resolveAutomaticDensity({
      anyFine: true,
      anyHover: true,
      coarse: true,
      noHover: false,
      inlineSize: 1280,
    })).toBe('compact')
  })

  it('uses comfortable density for narrow containers and touch-only input', () => {
    expect(resolveAutomaticDensity({
      anyFine: true,
      anyHover: true,
      coarse: true,
      noHover: false,
      inlineSize: 640,
    })).toBe('comfortable')
    expect(resolveAutomaticDensity({
      anyFine: false,
      anyHover: false,
      coarse: true,
      noHover: true,
      inlineSize: 1280,
    })).toBe('comfortable')
  })
})
