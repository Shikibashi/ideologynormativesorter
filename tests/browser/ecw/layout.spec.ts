import { expect, test, type Page } from '@playwright/test'
import { resultPath } from '../fixtures/states'

const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
  { width: 900, height: 256 },
]

async function expectNoConcealedOverflow(page: Page): Promise<void> {
  const result = await page.evaluate(() => {
    const root = document.documentElement
    const body = document.body
    const rootOverflow = getComputedStyle(root).overflowX
    const bodyOverflow = getComputedStyle(body).overflowX
    const clipped = [...document.querySelectorAll<HTMLElement>('h1, h2, p, button, label, .section-band')]
      .filter((element) => {
        const style = getComputedStyle(element)
        const concealed = style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflowX === 'clip'
        return concealed && (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)
      })
      .map((element) => element.outerHTML.slice(0, 160))
    return {
      horizontalOverflow: Math.max(root.scrollWidth - root.clientWidth, body.scrollWidth - body.clientWidth),
      rootOverflow,
      bodyOverflow,
      clipped,
    }
  })
  expect(result.rootOverflow).not.toMatch(/hidden|clip/)
  expect(result.bodyOverflow).not.toMatch(/hidden|clip/)
  expect(result.horizontalOverflow).toBeLessThanOrEqual(1)
  expect(result.clipped).toEqual([])
}

for (const viewport of viewports) {
  test(`reflows Page and Workbench at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Political Judgment Decomposition' })).toBeVisible()
    await expectNoConcealedOverflow(page)

    await page.goto(resultPath())
    await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible()
    await expectNoConcealedOverflow(page)
    if (viewport.height === 256) {
      const target = page.getByRole('button', { name: 'Start over' })
      await target.focus()
      await expect(target).toBeInViewport()
    }
  })
}

test('Workbench container independently demotes through three, two, and one columns', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto(resultPath())
  const screen = page.locator('.results-screen')
  const navigator = page.locator('.results-navigator')
  const primary = page.locator('#profile')
  const inspector = page.locator('#labels')
  const focusOrder = await page.locator('.results-navigator a').allTextContents()
  const semanticOrder = await page.evaluate(() => {
    const profile = document.querySelector('#profile')
    const comparison = document.querySelector('.compare-input-area, .compare-banner')
    const labels = document.querySelector('#labels')
    return {
      profileBeforeComparison: Boolean(profile && comparison && profile.compareDocumentPosition(comparison) & Node.DOCUMENT_POSITION_FOLLOWING),
      profileBeforeLabels: Boolean(profile && labels && profile.compareDocumentPosition(labels) & Node.DOCUMENT_POSITION_FOLLOWING),
    }
  })
  expect(semanticOrder).toEqual({ profileBeforeComparison: true, profileBeforeLabels: true })

  await screen.evaluate((element) => { (element as HTMLElement).style.width = '1300px' })
  let [navRect, primaryRect, inspectorRect] = await Promise.all([navigator.boundingBox(), primary.boundingBox(), inspector.boundingBox()])
  expect(navRect!.x).toBeLessThan(primaryRect!.x)
  expect(inspectorRect!.x).toBeGreaterThan(primaryRect!.x)
  const compareRect = await page.locator('.compare-input-area, .compare-banner').boundingBox()
  expect(Math.abs((compareRect?.y ?? 0) - (primaryRect?.y ?? 0))).toBeLessThan(2)

  await screen.evaluate((element) => { (element as HTMLElement).style.width = '1000px' })
  ;[navRect, primaryRect, inspectorRect] = await Promise.all([navigator.boundingBox(), primary.boundingBox(), inspector.boundingBox()])
  expect(navRect!.x).toBeLessThan(primaryRect!.x)
  expect(Math.abs(inspectorRect!.x - primaryRect!.x)).toBeLessThan(2)

  await screen.evaluate((element) => { (element as HTMLElement).style.width = '700px' })
  ;[navRect, primaryRect, inspectorRect] = await Promise.all([navigator.boundingBox(), primary.boundingBox(), inspector.boundingBox()])
  expect(Math.abs(navRect!.x - primaryRect!.x)).toBeLessThan(2)
  expect(Math.abs(inspectorRect!.x - primaryRect!.x)).toBeLessThan(2)
  expect(await page.locator('.results-navigator a').allTextContents()).toEqual(focusOrder)
  await expectNoConcealedOverflow(page)
})
