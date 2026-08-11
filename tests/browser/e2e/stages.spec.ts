import { expect, test } from '@playwright/test'
import {
  acceptContributionConsent,
  answerCurrentQuestion,
  installStatusRecorder,
  mockResearchEndpoint,
  seedStorage,
} from '../fixtures/app'
import {
  completedContributionStorage,
  CONTRIBUTION_PATH,
  almostCompletedStandardStorage,
  resultPath,
  standardResumeStorage,
} from '../fixtures/states'

test('intro starts a standard quiz with dynamic passive status', async ({ page }) => {
  await installStatusRecorder(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Political Judgment Decomposition' })).toBeVisible()
  await expect(page.locator('.site-shell')).toHaveAttribute('data-stage', 'intro')
  await expect(page.getByLabel('Application status')).toContainText('STAGE START')
  await expect(page.getByLabel('Application status')).not.toHaveAttribute('aria-live')

  await expect(page.getByRole('radio', { name: /Blitz/ })).toHaveCount(0)
  await expect(page.getByRole('radio', { name: /Quick/ })).toHaveCount(0)
  await page.getByRole('radio', { name: /Balanced profile/ }).check()
  await expect(page.getByLabel('Application status')).toContainText('LENGTH Balanced profile')
  await page.getByRole('button', { name: 'Begin assessment' }).click()

  await expect(page.getByRole('progressbar', { name: 'Assessment progress' })).toHaveAttribute('aria-valuenow', '1')
  await expect(page.getByLabel('Application status')).toContainText('PROGRESS 1 /')
  let messages = await page.evaluate(() => (window as unknown as { __ECW_STATUS_MESSAGES__: string[] }).__ECW_STATUS_MESSAGES__)
  expect(messages).toContain('Started the balanced profile.')
  await answerCurrentQuestion(page)
  await expect(page.getByRole('progressbar', { name: 'Assessment progress' })).toHaveAttribute('aria-valuenow', '2')
  messages = await page.evaluate(() => (window as unknown as { __ECW_STATUS_MESSAGES__: string[] }).__ECW_STATUS_MESSAGES__)
  expect(messages.some((message) => message.includes('advanced to item 2'))).toBe(true)
})

test('saved session can be resumed and exposes recovery state', async ({ page }) => {
  await seedStorage(page, standardResumeStorage())
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Saved session available' })).toBeVisible()
  await expect(page.getByLabel('Application status')).toContainText('SAVE RESUMABLE')
  await page.getByRole('button', { name: 'Resume' }).click()

  await expect(page.getByRole('progressbar', { name: 'Assessment progress' })).toHaveAttribute('aria-valuenow', '3')
  await expect(page.locator('.sr-status-announcer')).toContainText('Resumed saved assessment progress.')
})

test('contribution consent reaches the research quiz without changing refusal semantics', async ({ page }) => {
  await page.goto(CONTRIBUTION_PATH)
  await expect(page.getByRole('heading', { name: 'Contribute responses' })).toBeVisible()
  await expect(page.getByLabel('Application context')).toContainText('COLLECTION community-2026')
  await expect(page.getByLabel('Application status')).toContainText('SUBMISSION NOT SENT')

  await acceptContributionConsent(page)

  await expect(page.getByRole('progressbar', { name: 'Assessment progress' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Prefer not to answer' })).toBeVisible()
  await expect(page.getByLabel('Application context')).toContainText('MODE CONTRIBUTION')
})

test('completed contribution traverses self-identification and the specialist module', async ({ page }) => {
  await installStatusRecorder(page)
  await seedStorage(page, completedContributionStorage())
  await mockResearchEndpoint(page)
  await page.goto(CONTRIBUTION_PATH)
  await acceptContributionConsent(page)

  await expect(page.getByRole('heading', { name: 'Before seeing your result' })).toBeVisible()
  await page.getByRole('button', { name: 'Submit contribution and continue' }).click()
  await expect(page.getByRole('heading', { name: 'Optional specialist follow-up' })).toBeVisible()
  let messages = await page.evaluate(() => (window as unknown as { __ECW_STATUS_MESSAGES__: string[] }).__ECW_STATUS_MESSAGES__)
  expect(messages).toContain('Contribution prepared.')

  await page.getByRole('button', { name: 'Start assigned follow-up' }).click()
  await expect(page.getByRole('progressbar', { name: 'Assessment progress' })).toBeVisible()
  for (let index = 0; index < 80; index += 1) {
    if (await page.getByRole('heading', { name: 'Before seeing the follow-up result' }).isVisible().catch(() => false)) break
    await answerCurrentQuestion(page)
  }

  await expect(page.getByRole('heading', { name: 'Before seeing the follow-up result' })).toBeVisible()
  await page.getByRole('checkbox', { name: 'None of these / I am not sure' }).check()
  await page.getByRole('button', { name: 'Submit follow-up and show result' }).click()
  await expect(page.getByRole('heading', { name: 'Experimental follow-up result' })).toBeVisible()
  messages = await page.evaluate(() => (window as unknown as { __ECW_STATUS_MESSAGES__: string[] }).__ECW_STATUS_MESSAGES__)
  expect(messages).toContain('Specialist follow-up submitted.')
  await page.getByRole('button', { name: 'Continue to main results' }).click()
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible()
})

test('completion, share-copy, and comparison events are announced discretely', async ({ page, context }) => {
  await installStatusRecorder(page)
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' })
  await seedStorage(page, almostCompletedStandardStorage())
  await page.goto('/')
  await page.getByRole('button', { name: 'Resume' }).click()
  await answerCurrentQuestion(page)
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible()

  await page.getByRole('button', { name: 'Copy link to this result' }).click()
  await expect(page.getByRole('button', { name: 'Link copied' })).toBeVisible()
  const compareUrl = new URL(resultPath(), page.url()).href
  await page.getByRole('textbox', { name: 'Shared result link to compare' }).fill(compareUrl)
  await page.getByRole('button', { name: 'Compare' }).click()
  await expect(page.getByRole('heading', { name: 'Comparison view' })).toBeVisible()

  const messages = await page.evaluate(() => (window as unknown as { __ECW_STATUS_MESSAGES__: string[] }).__ECW_STATUS_MESSAGES__)
  expect(messages).toContain('Answer recorded. Assessment complete.')
  expect(messages).toContain('Assessment complete. Results are ready.')
  expect(messages).toContain('Share link copied to the clipboard.')
  expect(messages).toContain('Comparison profile loaded.')
})

test('shared results, comparison, and the label browser are addressable', async ({ page }) => {
  await page.goto(resultPath(true))

  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Comparison view' })).toBeVisible()
  await expect(page.getByLabel('Application status')).toContainText('COMPARE ACTIVE')
  await page.locator('details.full-label-browser > summary').click()
  const labelBrowser = page.locator('details.full-label-browser')
  const search = page.getByRole('searchbox', { name: 'Search ideology labels' })
  await expect(search).toBeVisible()
  await expect(labelBrowser.getByText('Libertarian Leaning', { exact: true })).toHaveCount(0)

  await search.fill('Anarcho-Capitalist')
  await expect(labelBrowser.getByRole('heading', { name: 'Anarcho-Capitalist' })).toBeVisible()
  await expect(labelBrowser.locator('summary.family-name')).toContainText('Liberal')

  await search.fill('Socialist Feminism')
  await expect(labelBrowser.getByRole('heading', { name: 'Socialist / Marxist Feminism' })).toBeVisible()
  await expect(labelBrowser.locator('summary.family-name')).toContainText('Socialist')
  await expect(labelBrowser.getByRole('heading', { name: 'Related traditions' })).toHaveCount(0)

  await search.fill('Nyerereism')
  await expect(labelBrowser.getByRole('heading', { name: 'Ujamaa / Nyerereism' })).toBeVisible()
  await expect(labelBrowser.locator('details.family-group')).toHaveCount(0)
  await expect(labelBrowser).toContainText('not ranked by the general quiz')
})
