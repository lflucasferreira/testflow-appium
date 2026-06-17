import { ActivityPage } from '../../pages/ActivityPage'
import { loginViaApi } from '../../support/auth'

describe('Activity @regression', () => {
  const activity = () => new ActivityPage()

  beforeEach(async () => {
    await loginViaApi()
    await activity().open('/web/activity.html')
    await activity().shouldBeLoaded()
  })

  it('renders activity counter', async () => {
    await expect(await activity().counter()).toBeDisplayed()
  })

  it('renders pipeline section', async () => {
    await expect(await activity().pipeline()).toBeDisplayed()
  })
})
