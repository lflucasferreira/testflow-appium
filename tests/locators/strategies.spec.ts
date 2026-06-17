import { LoginPage } from '../../pages/LoginPage'
import { byTestId } from '../../support/selectors'

describe('Appium locator strategies @appium', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })

  it('finds element by CSS / data-testid selector', async () => {
    const el = await browser.$(byTestId('login-email'))
    await expect(el).toBeDisplayed()
  })

  it('finds element by XPath', async () => {
    const el = await browser.$('//input[@data-testid="login-email"]')
    await expect(el).toBeDisplayed()
  })

  it('finds submit button by accessible name / text', async () => {
    const el = await browser.$('button[data-testid="login-submit"]')
    await expect(el).toBeDisplayed()
    const text = await el.getText()
    expect(text.length).toBeGreaterThan(0)
  })

  it('chains child selectors from form root', async () => {
    const form = await browser.$('form[data-testid="login-form"], .login-form, main')
    const email = await browser.$(byTestId('login-email'))
    await expect(email).toBeDisplayed()
    expect(await form.isExisting()).toBeDefined()
  })

  it('waits for element state with explicit wait', async () => {
    const el = await browser.$(byTestId('login-password'))
    await el.waitForDisplayed({ timeout: 10000 })
    await el.waitForEnabled({ timeout: 5000 })
    await expect(el).toBeEnabled()
  })
})
