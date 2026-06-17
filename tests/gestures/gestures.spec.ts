import { DashboardPage } from '../../pages/DashboardPage'
import { loginViaApi } from '../../support/auth'
import { tc, TC } from '../../support/constants/testCases'
import { longPress, scrollIntoView, swipeDown, swipeUp } from '../../support/helpers/gestures'
import { waitForTestId } from '../../support/selectors'

describe('Appium gestures @appium @regression', () => {
  beforeEach(async () => {
    await loginViaApi()
    await new DashboardPage().shouldBeLoaded()
  })

  it(tc(TC.APPIUM_SWIPE, 'swipe up scrolls activity feed into view'), async () => {
    const list = await waitForTestId('activity-list')
    await scrollIntoView(list)
    await swipeUp({ percent: 0.35 })
    await expect(list).toBeDisplayed()
  })

  it('swipe down returns toward top of dashboard', async () => {
    await swipeUp({ percent: 0.4 })
    await swipeDown({ percent: 0.35 })
    await expect(await waitForTestId('dash-greeting')).toBeDisplayed()
  })

  it('long press on KPI card does not crash session', async () => {
    const card = await waitForTestId('kpi-runs')
    await scrollIntoView(card)
    await longPress(card, 800)
    await expect(card).toBeDisplayed()
  })

  it('tap navigation via touch on team link', async () => {
    const nav = await waitForTestId('nav-team')
    await nav.click()
    await waitForTestId('page-team')
  })
})
