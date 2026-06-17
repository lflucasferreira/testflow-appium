import { SettingsPage } from '../../pages/SettingsPage'
import { loginViaApi } from '../../support/auth'

describe('Settings @regression', () => {
  const settings = () => new SettingsPage()

  beforeEach(async () => {
    await loginViaApi()
    await settings().open('/web/settings.html')
    await settings().shouldBeLoaded()
  })

  it('loads settings form fields', async () => {
    await expect(await settings().displayName()).toBeDisplayed()
    await expect(await settings().saveBtn()).toBeDisplayed()
  })

  it('allows editing display name', async () => {
    await settings().updateDisplayName('Mobile QA')
    const input = await settings().displayName()
    await expect(input).toHaveValue('Mobile QA')
  })
})
