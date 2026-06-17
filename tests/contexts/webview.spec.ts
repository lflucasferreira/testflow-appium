import { LoginPage } from '../../pages/LoginPage'
import { tc, TC } from '../../support/constants/testCases'
import { getCurrentContext, listContexts, switchToWebContext } from '../../support/helpers/gestures'

describe('Appium context switching @appium', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })

  it(tc(TC.APPIUM_CONTEXT, 'lists available contexts on mobile web'), async () => {
    const contexts = await listContexts()
    expect(contexts.length).toBeGreaterThan(0)
  })

  it('runs commands in current web context', async () => {
    const context = await getCurrentContext()
    expect(context).toBeTruthy()
    await expect(await login().emailInput()).toBeDisplayed()
  })

  it('switches to WEBVIEW when hybrid context exists', async () => {
    const before = await getCurrentContext()
    await switchToWebContext()
    const after = await getCurrentContext()
    expect(after).toBeTruthy()
    expect(typeof before).toBe('string')
  })

  it('executes DOM queries inside web context', async () => {
    const testIds = await browser.execute(() =>
      Array.from(document.querySelectorAll('[data-testid]'))
        .slice(0, 5)
        .map((el) => el.getAttribute('data-testid')),
    )
    expect(testIds).toContain('login-email')
  })
})
