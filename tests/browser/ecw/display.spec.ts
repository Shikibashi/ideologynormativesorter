import { expect, test } from '@playwright/test'

const APPEARANCE = 'political-judgment-appearance-v1'
const DENSITY = 'political-judgment-density-v1'

async function storedPreference(page: import('@playwright/test').Page, key: string, value: string): Promise<void> {
  await page.addInitScript(({ storageKey, storageValue }) => localStorage.setItem(storageKey, storageValue), {
    storageKey: key,
    storageValue: value,
  })
}

test('System resolves Light and Dark before React content appears', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'system')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  expect(await page.evaluate(() => (window as unknown as { __ECW_PREPAINT__: { theme: string } }).__ECW_PREPAINT__.theme)).toBe('light')

  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('stored appearance overrides the OS and tracks explicit preference', async ({ page }) => {
  await storedPreference(page, APPEARANCE, 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'light')
})

test('stored Dark overrides a Light operating system before mount', async ({ page }) => {
  await storedPreference(page, APPEARANCE, 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'dark')
  expect(await page.evaluate(() => (window as unknown as { __ECW_PREPAINT__: { theme: string } }).__ECW_PREPAINT__.theme)).toBe('dark')
})

test('stored Compact density is resolved before mount', async ({ page }) => {
  await storedPreference(page, DENSITY, 'compact')
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
  expect(await page.evaluate(() => (window as unknown as { __ECW_PREPAINT__: { resolvedDensity: string } }).__ECW_PREPAINT__.resolvedDensity)).toBe('compact')
})

test('Compact and Comfortable density are resolved before mount without large layout shift', async ({ page }) => {
  await storedPreference(page, DENSITY, 'comfortable')
  await page.addInitScript(() => {
    const shifts: number[] = []
    Object.defineProperty(window, '__ECW_SHIFTS__', { value: shifts, configurable: true })
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean }
        if (!shift.hadRecentInput && typeof shift.value === 'number') shifts.push(shift.value)
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable')
  expect(await page.evaluate(() => (window as unknown as { __ECW_PREPAINT__: { resolvedDensity: string } }).__ECW_PREPAINT__.resolvedDensity)).toBe('comfortable')
  await page.waitForTimeout(100)
  const cls = await page.evaluate(() => (window as unknown as { __ECW_SHIFTS__: number[] }).__ECW_SHIFTS__.reduce((sum, value) => sum + value, 0))
  expect(cls).toBeLessThan(0.1)
})

test('Automatic density keeps a wide hybrid device compact', async ({ page }) => {
  await page.addInitScript(() => {
    const native = window.matchMedia.bind(window)
    window.matchMedia = (query: string) => {
      if (['(any-pointer: fine)', '(any-hover: hover)', '(pointer: coarse)'].includes(query)) {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent: () => true,
        } as MediaQueryList
      }
      if (query === '(hover: none)') {
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent: () => true,
        } as MediaQueryList
      }
      return native(query)
    }
  })
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
})

test('Automatic contrast follows the system while explicit Standard wins', async ({ page }) => {
  await page.emulateMedia({ contrast: 'more' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-contrast', 'more')

  await page.locator('.display-control > summary').click()
  await page.getByRole('radio', { name: 'Standard' }).check()
  await expect(page.locator('html')).toHaveAttribute('data-contrast', 'standard')
  await page.emulateMedia({ contrast: 'more' })
  await expect(page.locator('html')).toHaveAttribute('data-contrast', 'standard')
})
