import { BasePage } from './BasePage'

export class StatesPage extends BasePage {
  pageRoot() { return this.testId('page-states') }
  skeletonBtn() { return this.testId('states-show-skeleton') }
  emptyBtn() { return this.testId('states-show-empty') }
  errorBtn() { return this.testId('states-show-error') }
  contentArea() { return this.testId('states-content') }

  async shouldBeLoaded() {
    await this.waitForPage('page-states')
    return this
  }

  async showSkeleton() {
    const btn = await this.skeletonBtn()
    await btn.click()
    return this
  }

  async showEmpty() {
    const btn = await this.emptyBtn()
    await btn.click()
    return this
  }

  async showError() {
    const btn = await this.errorBtn()
    await btn.click()
    return this
  }
}
