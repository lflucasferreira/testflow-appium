import { BasePage } from './BasePage'

export class SettingsPage extends BasePage {
  pageRoot() { return this.testId('page-settings') }
  displayName() { return this.testId('settings-display-name') }
  saveBtn() { return this.testId('settings-save') }
  notifyToggle() { return this.testId('settings-notify') }

  async shouldBeLoaded() {
    await this.waitForPage('page-settings')
    return this
  }

  async updateDisplayName(name: string) {
    const input = await this.displayName()
    await input.clearValue()
    await input.setValue(name)
    return this
  }

  async save() {
    const btn = await this.saveBtn()
    await btn.click()
    return this
  }
}
