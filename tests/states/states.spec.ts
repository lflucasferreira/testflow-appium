import { StatesPage } from '../../pages/StatesPage'
import { loginViaApi } from '../../support/auth'

describe('UI States @regression', () => {
  const states = () => new StatesPage()

  beforeEach(async () => {
    await loginViaApi()
    await states().open('/web/states.html')
    await states().shouldBeLoaded()
  })

  it('shows skeleton loading state', async () => {
    await states().showSkeleton()
    const content = await states().contentArea()
    await expect(content).toBeDisplayed()
  })

  it('shows empty state', async () => {
    await states().showEmpty()
    const content = await states().contentArea()
    await expect(content).toBeDisplayed()
  })

  it('shows error state', async () => {
    await states().showError()
    const content = await states().contentArea()
    await expect(content).toBeDisplayed()
  })
})
