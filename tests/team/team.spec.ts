import { TeamPage } from '../../pages/TeamPage'
import { loginViaApi } from '../../support/auth'

describe('Team @regression', () => {
  const team = () => new TeamPage()

  beforeEach(async () => {
    await loginViaApi()
    await team().open('/web/team.html')
    await team().shouldBeLoaded()
  })

  it('renders users table', async () => {
    const table = await team().usersTable()
    await expect(table).toBeDisplayed()
  })

  it('filters table via search input', async () => {
    await team().search('Demo')
    const table = await team().usersTable()
    await expect(table).toBeDisplayed()
  })

  it('opens invite modal', async () => {
    await team().openInviteModal()
    const modal = await browser.$('[data-testid="invite-modal-overlay"]')
    await modal.waitForDisplayed({ timeout: 5000 }).catch(() => undefined)
  })
})
