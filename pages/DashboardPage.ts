import { BasePage } from './BasePage'

export class DashboardPage extends BasePage {
  pageRoot() { return this.testId('page-dashboard') }
  greeting() { return this.testId('dash-greeting') }
  subtitle() { return this.testId('dash-subtitle') }
  kpiCard(name: string) { return this.testId(`kpi-${name}`) }
  kpiValue(name: string) { return this.testId(`kpi-${name}-value`) }
  kpiTrend(name: string) { return this.testId(`kpi-${name}-trend`) }
  activityList() { return this.testId('activity-list') }
  activityItem(n: number) { return this.testId(`activity-item-${n}`) }
  newRunBtn() { return this.testId('btn-new-run') }
  runModal() { return this.testId('run-modal-overlay') }
  runConfirmBtn() { return this.testId('run-modal-confirm') }
  runCancelBtn() { return this.testId('run-modal-cancel') }

  async openNewRunModal() {
    const btn = await this.newRunBtn()
    await btn.click()
    const modal = await this.runModal()
    await modal.waitForDisplayed()
    return this
  }

  async confirmRun() {
    const btn = await this.runConfirmBtn()
    await btn.click()
    return this
  }

  async cancelRun() {
    const btn = await this.runCancelBtn()
    await btn.click()
    return this
  }

  async shouldBeLoaded() {
    await this.waitForPage('page-dashboard')
    return this
  }

  async shouldShowGreeting() {
    const greeting = await this.greeting()
    await greeting.waitForDisplayed()
    await expect(greeting).toHaveText(expect.stringMatching(/Good (morning|afternoon|evening),/))
    return this
  }

  async shouldHaveAllKpiCards() {
    for (const key of ['runs', 'passrate', 'members', 'issues']) {
      const card = await this.kpiCard(key)
      await card.waitForDisplayed()
      const value = await this.kpiValue(key)
      await expect(value).not.toHaveText('')
    }
    return this
  }
}
