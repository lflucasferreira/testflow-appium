import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  emailInput() { return this.testId('login-email') }
  passwordInput() { return this.testId('login-password') }
  rememberCheckbox() { return this.testId('login-remember') }
  useApiCheckbox() { return this.testId('login-use-api') }
  submitBtn() { return this.testId('login-submit') }
  resultMsg() { return this.testId('login-result') }

  async visit() {
    await this.open('/web/login.html')
    return this
  }

  async fillEmail(email: string) {
    const el = await this.emailInput()
    await el.clearValue()
    await el.setValue(email)
    return this
  }

  async fillPassword(password: string) {
    const el = await this.passwordInput()
    await el.clearValue()
    await el.setValue(password)
    return this
  }

  async submit() {
    const btn = await this.submitBtn()
    await btn.click()
    return this
  }

  async loginWith(email: string, password: string) {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.submit()
    return this
  }

  async toggleUseApi() {
    const el = await this.useApiCheckbox()
    await el.click()
    return this
  }

  async toggleRememberMe() {
    const el = await this.rememberCheckbox()
    await el.click()
    return this
  }

  async shouldRedirectToDashboard() {
    await this.waitForPage('page-dashboard')
    await expect(browser).toHaveUrl(expect.stringContaining('/web/dashboard.html'))
    return this
  }

  async shouldShowError(text: string) {
    const msg = await this.resultMsg()
    await msg.waitForDisplayed()
    await expect(msg).toHaveText(expect.stringContaining(text))
    return this
  }
}
