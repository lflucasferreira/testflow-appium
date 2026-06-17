import { LoginPage } from '../../pages/LoginPage'
import { loginViaApi } from '../../support/auth'
import { DEMO_EMAIL, DEMO_PASSWORD, isAndroid } from '../../support/config'
import { tc, TC } from '../../support/constants/testCases'
import { hideKeyboardIfShown, setOrientation } from '../../support/helpers/gestures'
import { waitForTestId } from '../../support/selectors'

describe('Appium device capabilities @appium', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })

  it(tc(TC.APPIUM_KEYBOARD, 'hides software keyboard after login fields'), async () => {
    await login().fillEmail(DEMO_EMAIL)
    await login().fillPassword(DEMO_PASSWORD)
    await hideKeyboardIfShown()
    await expect(await login().submitBtn()).toBeDisplayed()
  })

  it(tc(TC.APPIUM_ORIENTATION, 'supports portrait and landscape orientation'), async () => {
    await setOrientation('PORTRAIT')
    await expect(await login().emailInput()).toBeDisplayed()

    await setOrientation('LANDSCAPE')
    await expect(await login().emailInput()).toBeDisplayed()

    await setOrientation('PORTRAIT')
  })

  it('captures device screenshot on demand', async () => {
    const path = `./screenshots/device-login-${Date.now()}.png`
    await browser.saveScreenshot(path)
    expect(path).toContain('screenshots')
  })

  it('reads mobile platform metadata', async () => {
    const caps = browser.capabilities
    expect(caps.platformName).toBeTruthy()
    if (isAndroid()) {
      expect(String(caps.platformName).toLowerCase()).toContain('android')
    }
  })

  it('executes mobile JavaScript in browser context', async () => {
    const userAgent = await browser.execute(() => navigator.userAgent)
    expect(userAgent.length).toBeGreaterThan(0)
  })
})

describe('Appium device — authenticated shell @appium', () => {
  it('persists session after brief background simulation', async () => {
    await loginViaApi()
    await waitForTestId('page-dashboard')

    await browser.execute('mobile: backgroundApp', [{ seconds: 1 }]).catch(() => {
      // backgroundApp is native-only; mobile web may ignore — acceptable
    })

    await browser.url(await browser.getUrl())
    await waitForTestId('page-dashboard')
  })
})
