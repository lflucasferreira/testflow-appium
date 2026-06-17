import { $, byTestId, clickTestId, fillTestId, waitForTestId } from '../support/selectors'
import { appPath } from '../support/config'

export class BasePage {
  protected testId(id: string) {
    return $(id)
  }

  protected selector(id: string) {
    return byTestId(id)
  }

  async open(path: string) {
    await browser.url(appPath(path))
    return this
  }

  async waitForPage(testId: string) {
    await waitForTestId(testId)
    return this
  }

  async getPageTitle(): Promise<string> {
    return browser.getTitle()
  }

  async currentUrl(): Promise<string> {
    return browser.getUrl()
  }
}

export { clickTestId, fillTestId, waitForTestId }
