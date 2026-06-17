import { ShellPage } from '../../pages/ShellPage'
import { loginViaApi } from '../../support/auth'
import { pollUntil } from '../../support/helpers/waits'

describe('App shell — layout & notifications @regression', () => {
  const shell = () => new ShellPage()

  beforeEach(async () => {
    await loginViaApi()
    await shell().shouldShowAppShell()
  })

  describe('Layout landmarks', () => {
    it('sidebar, topbar and breadcrumb are visible', async () => {
      await shell().shouldShowAppShell()
      await expect(await shell().breadcrumb()).toBeDisplayed()
      await expect(await shell().userName()).toHaveText(expect.stringContaining('Demo User'))
    })
  })

  describe('Sidebar navigation', () => {
    for (const { testId, path, pageTestId } of ShellPage.navItems()) {
      it(`navigates to ${path} via ${testId}`, async () => {
        await shell().navigateViaSidebar(testId)
        await expect(browser).toHaveUrl(expect.stringContaining(path))
        await expect(await browser.$(`[data-testid="${pageTestId}"]`)).toBeDisplayed()
        await shell().shouldHighlightNav(testId)
      })
    }
  })

  describe('Notifications', () => {
    it('opens notification dropdown on bell tap', async () => {
      await shell().openNotifications()
      await expect(await shell().notifList()).toBeDisplayed()
    })

    it('mark all read clears badge', async () => {
      await shell().openNotifications()
      const before = await shell().getUnreadCount()
      expect(before).toBeGreaterThan(0)
      await shell().markAllNotificationsRead()
      await pollUntil(() => shell().getUnreadCount(), (count) => count === 0)
    })
  })

  describe('Theme toggle', () => {
    it('theme toggle switches data-theme', async () => {
      const before = await shell().getTheme()
      await shell().toggleTheme()
      const after = await shell().getTheme()
      expect(after).not.toBe(before)
    })
  })
})
