import { expect, test } from '@playwright/test'
import { resultPath } from '../fixtures/states'

test('methodology uses browser-native history and current-page semantics', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'METHODOLOGY' }).click()
  await expect(page).toHaveURL(/\?view=methodology$/)
  await expect(page.getByRole('link', { name: 'METHODOLOGY', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByTestId('instrument-version')).toContainText('2026-08-taxonomy-v7')
  await expect(page.getByTestId('instrument-version')).toContainText('2026-08-editorial-v16')

  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Political Judgment Decomposition' })).toBeVisible()
  await page.goForward()
  await expect(page).toHaveURL(/\?view=methodology$/)
  await expect(page.getByRole('heading', { name: 'How this test works' })).toBeVisible()
})

test('modified clicks remain native and are not intercepted by application routing', async ({ page }) => {
  await page.goto('/')
  const link = page.getByRole('link', { name: 'METHODOLOGY' })
  await expect(link).toHaveAttribute('href', '/?view=methodology')
  await expect(link).not.toHaveAttribute('target')

  const event = await link.evaluate((element) => {
    const modifiedClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
      view: window,
    })
    const dispatched = element.dispatchEvent(modifiedClick)
    return { dispatched, defaultPrevented: modifiedClick.defaultPrevented }
  })
  expect(event).toEqual({ dispatched: true, defaultPrevented: false })
})

test('a shared result hash loaded on the current document opens the result workbench', async ({ page }) => {
  await page.goto('/')
  await page.goto(resultPath())
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible()
})

test('result fragment links update the URL, scroll, and expose current location', async ({ page }) => {
  await page.goto(resultPath())
  const labelsLink = page.getByRole('link', { name: 'Nearest labels' })
  await labelsLink.click()

  await expect(page).toHaveURL(/#r=.+&section=labels$/)
  await expect(labelsLink).toHaveAttribute('aria-current', 'location')
  await expect(page.locator('#labels')).toBeInViewport()
  await expect(labelsLink).toHaveAccessibleName('Nearest labels')

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Nearest labels' })).toHaveAttribute('aria-current', 'location')
  await expect(page.locator('#labels')).toBeInViewport()
})
