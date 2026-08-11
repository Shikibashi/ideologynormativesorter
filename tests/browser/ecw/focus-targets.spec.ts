import { expect, test, type Locator } from '@playwright/test'
import { answerCurrentQuestion } from '../fixtures/app'
import { resultPath } from '../fixtures/states'

async function focusWithKeyboard(locator: Locator): Promise<void> {
  const page = locator.page()
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  for (let index = 0; index < 60; index += 1) {
    await page.keyboard.press('Tab')
    if (await locator.evaluate((element) => document.activeElement === element)) return
  }
  throw new Error('Control was not reachable in the keyboard focus order.')
}

async function expectTwoBandFocus(locator: Locator, moveFocus = true): Promise<void> {
  if (moveFocus) await locator.focus()
  const style = await locator.evaluate((element) => {
    const computed = getComputedStyle(element)
    return {
      outlineWidth: Number.parseFloat(computed.outlineWidth),
      outlineStyle: computed.outlineStyle,
      outlineColor: computed.outlineColor,
      boxShadow: computed.boxShadow,
      background: computed.backgroundColor,
    }
  })
  expect(style.outlineStyle).not.toBe('none')
  expect(style.outlineWidth).toBeGreaterThanOrEqual(2)
  expect(style.boxShadow).not.toBe('none')
  expect(style.outlineColor).not.toBe(style.background)
}

async function expectVisibleTargetsMeetFloor(page: import('@playwright/test').Page): Promise<void> {
  const offenders = await page.locator(
    'a.site-home-link:visible, a.site-methodology-link:visible, .results-navigator a:visible, summary:visible, button:visible',
  ).evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect()
    return {
      label: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 80) || element.tagName,
      width: rect.width,
      height: rect.height,
    }
  }).filter(({ width, height }) => width < 24 || height < 24))
  expect(offenders).toEqual([])
}

test('links, buttons, fields, and Display receive canonical two-band focus', async ({ page }) => {
  await page.goto('/')
  await expectTwoBandFocus(page.getByRole('link', { name: 'METHODOLOGY' }))
  await expectTwoBandFocus(page.getByRole('button', { name: 'Begin assessment' }))
  await expectTwoBandFocus(page.locator('.display-control > summary'))

  await page.goto(resultPath())
  await expectTwoBandFocus(page.getByRole('textbox', { name: 'Shared result link to compare' }))
  await expectTwoBandFocus(page.getByRole('link', { name: 'Profile' }))
  await expectTwoBandFocus(page.locator('details.full-label-browser > summary'))
})

test('selected answer and tier states remain visible while focused', async ({ page }) => {
  await page.goto('/')
  const tier = page.getByRole('radio', { name: /Blitz/ })
  await tier.check()
  await focusWithKeyboard(tier)
  await expect(tier).toBeFocused()
  const tierStyle = await tier.locator('..').evaluate((element) => getComputedStyle(element).boxShadow)
  expect(tierStyle).not.toBe('none')

  await page.getByRole('button', { name: 'Begin assessment' }).click()
  await answerCurrentQuestion(page)
  await page.getByRole('button', { name: 'Back' }).click()
  const selected = page.locator('[aria-pressed="true"]').first()
  await expect(selected).toBeVisible()
  await focusWithKeyboard(selected)
  await expectTwoBandFocus(selected, false)
})

test('computed ECW targets meet Compact and Comfortable geometry', async ({ page }) => {
  await page.goto('/')
  await expectVisibleTargetsMeetFloor(page)
  const compactHeight = (await page.getByRole('button', { name: 'Begin assessment' }).boundingBox())?.height ?? 0
  expect(compactHeight).toBeGreaterThanOrEqual(30)

  await page.locator('.display-control > summary').click()
  await page.getByRole('radio', { name: 'Comfortable' }).check()
  const comfortableHeight = (await page.getByRole('button', { name: 'Begin assessment' }).boundingBox())?.height ?? 0
  expect(comfortableHeight).toBeGreaterThanOrEqual(44)

  await page.goto(resultPath())
  await page.locator('details.full-label-browser > summary').click()
  await expectVisibleTargetsMeetFloor(page)
})

test('Dark mode keeps keyboard focus visible on Page and Workbench controls', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await focusWithKeyboard(page.getByRole('link', { name: 'METHODOLOGY' }))
  await expectTwoBandFocus(page.getByRole('link', { name: 'METHODOLOGY' }), false)
  const tier = page.getByRole('radio', { name: /Moderate/ })
  await focusWithKeyboard(tier)
  const tierShadow = await tier.locator('..').evaluate((element) => getComputedStyle(element).boxShadow)
  expect(tierShadow).not.toBe('none')

  await page.goto(resultPath())
  const profile = page.getByRole('link', { name: 'Profile' })
  await focusWithKeyboard(profile)
  await expectTwoBandFocus(profile, false)
})

test('forced colors preserve selected focus and structural borders', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('/')
  const tier = page.getByRole('radio', { name: /Blitz/ })
  await tier.check()
  await tier.focus()
  const style = await tier.locator('..').evaluate((element) => {
    const computed = getComputedStyle(element)
    return { outlineWidth: computed.outlineWidth, borderStyle: computed.borderStyle }
  })
  expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
  expect(style.borderStyle).not.toBe('none')
})
