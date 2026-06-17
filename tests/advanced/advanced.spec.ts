import { AdvancedPage } from '../../pages/AdvancedPage'
import { loginViaApi } from '../../support/auth'
import { scrollIntoView, swipeUp } from '../../support/helpers/gestures'

describe('Advanced @regression', () => {
  const advanced = () => new AdvancedPage()

  beforeEach(async () => {
    await loginViaApi()
    await advanced().open('/web/advanced.html')
    await advanced().shouldBeLoaded()
  })

  it('renders shadow DOM section on mobile web', async () => {
    const host = await advanced().shadowHost()
    await scrollIntoView(host)
    await expect(host).toBeDisplayed()
  })

  it('scrolls advanced page with touch swipe @appium', async () => {
    await swipeUp({ percent: 0.3 })
    await expect(await advanced().pageRoot()).toBeDisplayed()
  })
})
