import credentials from '../../fixtures/credentials.json'
import { LoginPage } from '../../pages/LoginPage'
import { getSessionAuth, loginViaUi } from '../../support/auth'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../../support/config'
import { tc, TC } from '../../support/constants/testCases'

describe('Authentication @regression', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })

  describe('Page structure', () => {
    it(tc(TC.AUTH_LOGIN_FORM, 'renders all form elements on mobile'), async () => {
      await expect(await login().emailInput()).toBeDisplayed()
      await expect(await login().passwordInput()).toBeDisplayed()
      await expect(await login().submitBtn()).toBeDisplayed()
    })

    it('password field masks input', async () => {
      const input = await login().passwordInput()
      await expect(input).toHaveAttribute('type', 'password')
    })
  })

  describe('Valid credentials', () => {
    it(tc(TC.AUTH_LOGIN_SUCCESS, 'logs in via UI and redirects to dashboard'), async () => {
      await login().loginWith(DEMO_EMAIL, DEMO_PASSWORD)
      await login().shouldRedirectToDashboard()
    })

    it(tc(TC.AUTH_SESSION, 'sets auth data in sessionStorage after login'), async () => {
      await login().loginWith(DEMO_EMAIL, DEMO_PASSWORD)
      await login().shouldRedirectToDashboard()
      const auth = await getSessionAuth()
      expect(auth).not.toBeNull()
      expect(auth?.email).toBe(DEMO_EMAIL)
    })
  })

  describe('Invalid credentials', () => {
    it(tc(TC.AUTH_WRONG_PASSWORD, 'shows error for wrong password'), async () => {
      await login().loginWith(credentials.valid.email, credentials.invalid.password)
      await login().shouldShowError('Invalid credentials')
    })

    it('does not navigate away on failed login', async () => {
      await login().loginWith(credentials.invalid.email, credentials.invalid.password)
      await expect(browser).toHaveUrl(expect.stringContaining('/web/login.html'))
    })
  })
})

describe('Authentication — API login shortcut @smoke', () => {
  it('loginViaUi reaches dashboard', async () => {
    await loginViaUi()
    await expect(await browser.$('[data-testid="page-dashboard"]')).toBeDisplayed()
  })
})
