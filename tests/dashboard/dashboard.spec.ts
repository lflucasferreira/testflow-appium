import { DashboardPage } from '../../pages/DashboardPage'
import { loginViaApi } from '../../support/auth'

describe('Dashboard @regression', () => {
  const dashboard = () => new DashboardPage()

  beforeEach(async () => {
    await loginViaApi()
    await dashboard().shouldBeLoaded()
  })

  describe('Greeting', () => {
    it('shows time-based greeting with the user name', async () => {
      await dashboard().shouldShowGreeting()
      const greeting = await dashboard().greeting()
      await expect(greeting).toHaveText(expect.stringContaining('Demo User'))
    })
  })

  describe('KPI cards', () => {
    it('renders all four KPI cards', async () => {
      await dashboard().shouldHaveAllKpiCards()
    })

    it('shows a numeric value in the runs card', async () => {
      const value = await dashboard().kpiValue('runs')
      const text = await value.getText()
      expect(parseInt(text, 10)).toBeGreaterThan(0)
    })
  })

  describe('New run modal', () => {
    it('opens and closes the new run modal', async () => {
      await dashboard().openNewRunModal()
      const modal = await dashboard().runModal()
      await expect(modal).toBeDisplayed()
      await dashboard().cancelRun()
      await expect(modal).not.toBeDisplayed()
    })
  })
})
