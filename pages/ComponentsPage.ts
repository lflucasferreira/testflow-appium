import { BasePage } from './BasePage'

export class ComponentsPage extends BasePage {
  pageRoot() { return this.testId('page-components') }
  primaryBtn() { return this.testId('btn-primary') }
  loadingBtn() { return this.testId('btn-loading') }
  openModalBtn() { return this.testId('btn-open-modal') }
  modalOverlay() { return this.testId('demo-modal-overlay') }
  modalClose() { return this.testId('demo-modal-close') }

  async shouldBeLoaded() {
    await this.waitForPage('page-components')
    return this
  }

  async openModal() {
    const btn = await this.openModalBtn()
    await btn.click()
    const modal = await this.modalOverlay()
    await modal.waitForDisplayed()
    return this
  }

  async closeModal() {
    const btn = await this.modalClose()
    await btn.click()
    return this
  }
}
