import { BasePage } from './BasePage'

export class AdvancedPage extends BasePage {
  pageRoot() { return this.testId('page-advanced') }
  shadowHost() { return this.testId('shadow-host') }
  iframeSection() { return this.testId('iframe-section') }

  async shouldBeLoaded() {
    await this.waitForPage('page-advanced')
    return this
  }
}
