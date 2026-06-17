import { fetchAuthToken, loginViaApi, logoutViaUi, visitWithToken } from '../../support/auth'
import { tc, TC } from '../../support/constants/testCases'
import { waitForTestId } from '../../support/selectors'

const PAGES = [
  { path: '/web/dashboard.html', testId: 'page-dashboard', title: 'Dashboard', tcId: TC.SMOKE_DASHBOARD },
  { path: '/web/team.html', testId: 'page-team', title: 'Team', tcId: TC.SMOKE_TEAM },
  { path: '/web/settings.html', testId: 'page-settings', title: 'Settings', tcId: TC.SMOKE_SETTINGS },
  { path: '/web/components.html', testId: 'page-components', title: 'Components', tcId: TC.SMOKE_COMPONENTS },
  { path: '/web/activity.html', testId: 'page-activity', title: 'Activity', tcId: TC.SMOKE_ACTIVITY },
  { path: '/web/advanced.html', testId: 'page-advanced', title: 'Advanced', tcId: TC.SMOKE_ADVANCED },
  { path: '/web/wizard.html', testId: 'page-wizard', title: 'Wizard', tcId: TC.SMOKE_WIZARD },
  { path: '/web/states.html', testId: 'page-states', title: 'UI States', tcId: TC.SMOKE_STATES },
]

describe('Smoke — page navigation @smoke @regression', () => {
  let authToken: string

  before(async () => {
    authToken = (await fetchAuthToken()).token
  })

  for (const { path, testId, title, tcId } of PAGES) {
    it(tc(tcId, `${title} page loads on mobile web`), async () => {
      await visitWithToken(path, authToken)
      await waitForTestId(testId)
      await expect(await browser.getTitle()).toContain(title)
    })
  }
})

describe('Smoke — sidebar navigation @smoke', () => {
  beforeEach(async () => {
    await loginViaApi()
    await waitForTestId('page-dashboard')
  })

  it(tc(TC.SMOKE_NAV_TEAM, 'navigates from dashboard to team via sidebar'), async () => {
    await waitForTestId('nav-team').then((el) => el.click())
    await waitForTestId('page-team')
    await expect(browser).toHaveUrl(expect.stringContaining('/web/team.html'))
  })

  it(tc(TC.SMOKE_NAV_ACTIVE, 'highlights the active nav link'), async () => {
    const nav = await waitForTestId('nav-dashboard')
    const className = await nav.getAttribute('class')
    expect(className).toMatch(/active/)
  })
})

describe('Smoke — logout @smoke', () => {
  it(tc(TC.SMOKE_LOGOUT, 'logout clears session and redirects to index'), async () => {
    await loginViaApi()
    await waitForTestId('page-dashboard')

    await logoutViaUi()
    await expect(browser).toHaveUrl(expect.stringMatching(/\/web\/index\.html/))

    const auth = await browser.execute(() => sessionStorage.getItem('sandbox-auth'))
    expect(auth).toBeNull()
  })
})
