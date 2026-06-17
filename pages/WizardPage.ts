import { BasePage } from './BasePage'

export class WizardPage extends BasePage {
  pageRoot() { return this.testId('page-wizard') }
  stepIndicator() { return this.testId('wizard-step') }
  nextBtn() { return this.testId('wizard-next') }
  backBtn() { return this.testId('wizard-back') }
  submitBtn() { return this.testId('wizard-submit') }
  projectName() { return this.testId('wizard-project-name') }

  async shouldBeLoaded() {
    await this.waitForPage('page-wizard')
    return this
  }

  async fillProjectName(name: string) {
    const input = await this.projectName()
    await input.clearValue()
    await input.setValue(name)
    return this
  }

  async goNext() {
    const btn = await this.nextBtn()
    await btn.click()
    return this
  }
}
