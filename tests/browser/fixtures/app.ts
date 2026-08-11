import type { Page } from '@playwright/test'

export async function seedStorage(page: Page, values: Record<string, string>): Promise<void> {
  await page.addInitScript((entries: Array<[string, string]>) => {
    for (const [key, value] of entries) localStorage.setItem(key, value)
  }, Object.entries(values))
}

export async function mockResearchEndpoint(page: Page, status = 200): Promise<void> {
  await page.route('**/__e2e/research', async (route) => {
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ accepted: status < 400 }) })
  })
}

export async function acceptContributionConsent(page: Page): Promise<void> {
  const choices = page.getByRole('checkbox')
  for (let index = 0; index < await choices.count(); index += 1) await choices.nth(index).check()
  await page.getByRole('button', { name: 'Continue to Balanced profile' }).click()
}

export async function answerCurrentQuestion(page: Page): Promise<void> {
  const statement = page.locator('.statement-button').first()
  if (await statement.isVisible().catch(() => false)) {
    await statement.click()
  } else {
    await page.locator('[data-answer-value="0"]').first().click()
  }

  const rating = page.getByRole('group', { name: /rating$/i })
  if (await rating.isVisible().catch(() => false)) await rating.getByRole('button').nth(2).click()
}

export async function installStatusRecorder(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const messages: string[] = []
    Object.defineProperty(window, '__ECW_STATUS_MESSAGES__', { value: messages, configurable: true })
    window.addEventListener('ecw:status', (event) => {
      const detail = (event as CustomEvent<string>).detail
      if (typeof detail === 'string') messages.push(detail)
    })
  })
}
