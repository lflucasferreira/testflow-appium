import { BasePage } from './BasePage'

export class ActivityPage extends BasePage {
  pageRoot() { return this.testId('page-activity') }
  counter() { return this.testId('activity-counter') }
  pipeline() { return this.testId('activity-pipeline') }

  async shouldBeLoaded() {
    await this.waitForPage('page-activity')
    return this
  }
}
