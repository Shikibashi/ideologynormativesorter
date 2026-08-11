import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
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
  resultPath,
  standardResumeStorage,
} from '../fixtures/states'

async function expectNoAutomatedViolations(page: Page, testInfo: TestInfo): Promise<void> {
  const scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  await testInfo.attach('axe-results', {
    body: JSON.stringify(scan, null, 2),
    contentType: 'application/json',
  })
  expect(scan.violations.map((violation) => ({
    id: violation.id,
    targets: violation.nodes.map((node) => node.target),
  }))).toEqual([])
}

test('intro, methodology, consent, and standard quiz pass automated WCAG checks', async ({ page }, testInfo) => {
  await page.goto('/')
  await expectNoAutomatedViolations(page, testInfo)

  await page.goto('/?view=methodology')
  await expectNoAutomatedViolations(page, testInfo)

  await page.goto(CONTRIBUTION_PATH)
  await expectNoAutomatedViolations(page, testInfo)
  await page.getByRole('button', { name: 'Continue without contributing' }).click()
  await expect(page.getByRole('progressbar', { name: 'Assessment progress' })).toBeVisible()
  await expectNoAutomatedViolations(page, testInfo)
})

test('representative Page and Workbench stages pass automated checks in Dark mode', async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expectNoAutomatedViolations(page, testInfo)

  await page.goto(resultPath())
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible()
  await expectNoAutomatedViolations(page, testInfo)
})

test('saved resume, results, comparison, and label browser pass automated WCAG checks', async ({ page }, testInfo) => {
  await seedStorage(page, standardResumeStorage())
  await page.goto('/')
  await expectNoAutomatedViolations(page, testInfo)

  await page.goto('about:blank')
  await page.goto(resultPath())
  await expectNoAutomatedViolations(page, testInfo)
  await page.locator('details.full-label-browser > summary').click()
  await expectNoAutomatedViolations(page, testInfo)

  await page.goto('about:blank')
  await page.goto(resultPath(true))
  await expectNoAutomatedViolations(page, testInfo)
})

test('self-identification and specialist module pass automated WCAG checks', async ({ page }, testInfo) => {
  await seedStorage(page, completedContributionStorage())
  await mockResearchEndpoint(page)
  await page.goto(CONTRIBUTION_PATH)
  await acceptContributionConsent(page)
  await expectNoAutomatedViolations(page, testInfo)

  await page.getByRole('button', { name: 'Submit contribution and see result' }).click()
  await expect(page.getByRole('heading', { name: 'Optional specialist follow-up' })).toBeVisible()
  await expectNoAutomatedViolations(page, testInfo)
  await page.getByRole('button', { name: 'Start assigned follow-up' }).click()
  await expectNoAutomatedViolations(page, testInfo)
})

test('passive status and polite announcements remain separate without save chatter', async ({ page }) => {
  await installStatusRecorder(page)
  await page.goto('/')
  await page.getByRole('radio', { name: /Balanced profile/ }).check()
  await page.getByRole('button', { name: 'Begin assessment' }).click()
  for (let index = 0; index < 4; index += 1) await answerCurrentQuestion(page)

  const passive = page.getByLabel('Application status')
  await expect(passive).not.toHaveAttribute('aria-live')
  await expect(page.locator('.sr-status-announcer')).toHaveAttribute('aria-live', 'polite')
  const messages = await page.evaluate(() => (window as unknown as { __ECW_STATUS_MESSAGES__: string[] }).__ECW_STATUS_MESSAGES__)
  expect(messages.filter((message) => message === 'Assessment progress saved locally.')).toHaveLength(1)
  expect(messages.some((message) => message.includes('advanced to item'))).toBe(true)
})

test('selected controls expose state and compare errors are associated', async ({ page }) => {
  await page.goto(resultPath())
  const compareInput = page.getByRole('textbox', { name: 'Shared result link to compare' })
  await compareInput.fill('not a shared link')
  await page.getByRole('button', { name: 'Compare' }).click()
  await expect(compareInput).toHaveAttribute('aria-invalid', 'true')
  await expect(compareInput).toHaveAttribute('aria-describedby', 'compare-error')

  await page.goto('/')
  await page.getByRole('radio', { name: /Balanced profile/ }).check()
  await page.getByRole('button', { name: 'Begin assessment' }).click()
  const answer = page.locator('[data-answer-value="0"]').first()
  await answerCurrentQuestion(page)
  await page.getByRole('button', { name: 'Back' }).click()
  await expect(answer).toHaveAttribute('aria-pressed', 'true')
})
