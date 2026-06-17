import { openAppPath } from '../support/navigation'
import { $, byTestId, clickTestId, fillTestId, waitForTestId } from '../support/selectors'

export class BasePage {
  protected testId(id: string) {
    return $(id)
  }

  protected selector(id: string) {
    return byTestId(id)
  }

  async open(path: string) {
    await openAppPath(path)
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
