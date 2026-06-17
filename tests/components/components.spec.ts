import { ComponentsPage } from '../../pages/ComponentsPage'
import { loginViaApi } from '../../support/auth'
import { tc, TC } from '../../support/constants/testCases'

describe('Components @regression @a11y', () => {
  const components = () => new ComponentsPage()

  beforeEach(async () => {
    await loginViaApi()
    await components().open('/web/components.html')
    await components().shouldBeLoaded()
  })

  it('renders primary action button', async () => {
    await expect(await components().primaryBtn()).toBeDisplayed()
  })

  it(tc(TC.COMP_LOADING_BUTTON, 'shows loading button'), async () => {
    await expect(await components().loadingBtn()).toBeDisplayed()
  })

  it('opens and closes demo modal', async () => {
    await components().openModal()
    await components().closeModal()
    const modal = await components().modalOverlay()
    await expect(modal).not.toBeDisplayed()
  })
})
