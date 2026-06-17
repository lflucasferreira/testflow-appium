import { WizardPage } from '../../pages/WizardPage'
import { loginViaApi } from '../../support/auth'

describe('Wizard @regression', () => {
  const wizard = () => new WizardPage()

  beforeEach(async () => {
    await loginViaApi()
    await wizard().open('/web/wizard.html')
    await wizard().shouldBeLoaded()
  })

  it('shows step indicator on first step', async () => {
    await expect(await wizard().stepIndicator()).toBeDisplayed()
  })

  it('advances to next step after filling project name', async () => {
    await wizard().fillProjectName('Mobile Test Project')
    await wizard().goNext()
    await expect(await wizard().stepIndicator()).toBeDisplayed()
  })
})
