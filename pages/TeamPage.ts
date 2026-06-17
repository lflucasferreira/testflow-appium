import { BasePage } from './BasePage'

export class TeamPage extends BasePage {
  pageRoot() { return this.testId('page-team') }
  searchInput() { return this.testId('team-search') }
  usersTable() { return this.testId('users-table') }
  inviteBtn() { return this.testId('btn-invite') }

  async shouldBeLoaded() {
    await this.waitForPage('page-team')
    return this
  }

  async search(term: string) {
    const input = await this.searchInput()
    await input.clearValue()
    await input.setValue(term)
    return this
  }

  async openInviteModal() {
    const btn = await this.inviteBtn()
    await btn.click()
    return this
  }
}
