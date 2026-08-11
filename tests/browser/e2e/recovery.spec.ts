import { expect, test } from '@playwright/test'
import {
  acceptContributionConsent,
  answerCurrentQuestion,
  installStatusRecorder,
  mockResearchEndpoint,
  seedStorage,
} from '../fixtures/app'
import { completedContributionStorage, CONTRIBUTION_PATH, standardResumeStorage } from '../fixtures/states'

test('malformed share link identifies the object, problem, and recovery action', async ({ page }) => {
  await page.goto('/#r=%%%notbase64%%%')
  const error = page.getByRole('alert')
  await expect(error).toContainText('shared result link')
  await expect(error).toContainText('start the test below')
  await expect(page.getByRole('button', { name: 'Dismiss' })).toBeVisible()
})

test('local save failure stays visible and is announced', async ({ page }) => {
  await installStatusRecorder(page)
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function setItem(key: string, value: string) {
      if (key === 'ideology-quiz-save') throw new DOMException('Synthetic quota failure', 'QuotaExceededError')
      return original.call(this, key, value)
    }
  })
  await page.goto('/')
  await page.getByRole('radio', { name: /Balanced profile/ }).check()
  await page.getByRole('button', { name: 'Begin assessment' }).click()
  await answerCurrentQuestion(page)

  const error = page.getByRole('alert')
  await expect(error).toContainText('browser storage is full or disabled')
  await expect(error).toContainText('you can still complete the quiz')
  await expect(page.getByLabel('Application status')).toContainText('SAVE unavailable')
  await expect(page.locator('.section-band-status')).toContainText('LOCAL SAVE UNAVAILABLE')
  const messages = await page.evaluate(() => (window as unknown as { __ECW_STATUS_MESSAGES__: string[] }).__ECW_STATUS_MESSAGES__)
  expect(messages.some((message) => message.includes('storage is full or disabled'))).toBe(true)
})

test('failed contribution is retained locally and restored after reload', async ({ page }) => {
  await installStatusRecorder(page)
  await seedStorage(page, completedContributionStorage())
  await mockResearchEndpoint(page, 503)
  await page.goto(CONTRIBUTION_PATH)
  await acceptContributionConsent(page)
  await page.getByRole('button', { name: 'Submit contribution and continue' }).click()
  await expect(page.getByRole('heading', { name: 'Optional specialist follow-up' })).toBeVisible()
  const messages = await page.evaluate(() => (window as unknown as { __ECW_STATUS_MESSAGES__: string[] }).__ECW_STATUS_MESSAGES__)
  expect(messages).toContain('Contribution could not be submitted.')
  await page.getByRole('button', { name: 'Skip follow-up and view main results' }).click()

  await expect(page.getByText(/not received.*HTTP 503/i)).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible()
  await expect(page.getByText(/not received.*HTTP 503/i)).toBeVisible()
})

test('saved-session reset confirmation preserves keyboard focus', async ({ page }) => {
  await seedStorage(page, standardResumeStorage())
  await page.goto('/')
  await page.getByRole('button', { name: 'Start fresh' }).click()
  await expect(page.getByRole('button', { name: 'Clear saved session' })).toBeFocused()
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByRole('button', { name: 'Start fresh' })).toBeFocused()

  await page.getByRole('button', { name: 'Start fresh' }).click()
  await page.getByRole('button', { name: 'Clear saved session' }).click()
  await expect(page.getByRole('heading', { name: 'Session setup' })).toBeFocused()
})
