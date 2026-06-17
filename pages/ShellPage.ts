import { BasePage } from './BasePage'

const NAV_ITEMS = [
  { testId: 'nav-dashboard', path: '/web/dashboard.html', pageTestId: 'page-dashboard' },
  { testId: 'nav-team', path: '/web/team.html', pageTestId: 'page-team' },
  { testId: 'nav-settings', path: '/web/settings.html', pageTestId: 'page-settings' },
  { testId: 'nav-widgets', path: '/web/widgets.html', pageTestId: 'page-widgets' },
  { testId: 'nav-components', path: '/web/components.html', pageTestId: 'page-components' },
  { testId: 'nav-activity', path: '/web/activity.html', pageTestId: 'page-activity' },
  { testId: 'nav-advanced', path: '/web/advanced.html', pageTestId: 'page-advanced' },
  { testId: 'nav-wizard', path: '/web/wizard.html', pageTestId: 'page-wizard' },
  { testId: 'nav-states', path: '/web/states.html', pageTestId: 'page-states' },
] as const

export class ShellPage extends BasePage {
  sidebar() { return this.testId('site-sidebar') }
  topbar() { return this.testId('site-topbar') }
  breadcrumb() { return this.testId('breadcrumb') }
  skipToContent() { return this.testId('skip-to-content') }
  notifBell() { return this.testId('notif-bell') }
  notifDropdown() { return this.testId('notif-dropdown') }
  notifList() { return this.testId('notif-list') }
  notifMarkAll() { return this.testId('notif-mark-all') }
  notifBadge() { return this.testId('notif-badge') }
  userName() { return this.testId('topbar-user-name') }
  themeToggle() { return this.testId('theme-toggle') }

  nav(testId: string) { return this.testId(testId) }

  static navItems() {
    return NAV_ITEMS
  }

  async openNotifications() {
    const bell = await this.notifBell()
    await bell.click()
    const dropdown = await this.notifDropdown()
    await dropdown.waitForDisplayed()
    return this
  }

  async markAllNotificationsRead() {
    const btn = await this.notifMarkAll()
    await btn.click()
    return this
  }

  async getUnreadCount(): Promise<number> {
    const badge = await this.notifBadge()
    if (!(await badge.isDisplayed())) return 0
    return parseInt(await badge.getText(), 10)
  }

  async toggleTheme() {
    const toggle = await this.themeToggle()
    await toggle.waitForDisplayed()
    await toggle.click()
    return this
  }

  async getTheme(): Promise<string> {
    return browser.execute(() => document.documentElement.getAttribute('data-theme') ?? 'dark')
  }

  async navigateViaSidebar(testId: string) {
    const nav = await this.nav(testId)
    await nav.click()
    return this
  }

  async shouldShowAppShell() {
    const sidebar = await this.sidebar()
    const topbar = await this.topbar()
    await sidebar.waitForDisplayed()
    await topbar.waitForDisplayed()
    return this
  }

  async shouldHighlightNav(testId: string) {
    const nav = await this.nav(testId)
    const className = await nav.getAttribute('class')
    expect(className).toMatch(/active/)
    return this
  }
}
