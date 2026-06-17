import { LoginPage } from '../../pages/LoginPage'
import { loginViaApi } from '../../support/auth'
import { appPath } from '../../support/config'
import { tc, TC } from '../../support/constants/testCases'
import { assertScreenshotMatches } from '../../support/helpers/visual'
import { waitForTestId } from '../../support/selectors'

describe('Visual regression @visual @regression', () => {
  it(tc(TC.VISUAL_LOGIN, 'login screen baseline on mobile'), async () => {
    await new LoginPage().visit()
    await assertScreenshotMatches('mobile-login')
  })

  it(tc(TC.VISUAL_DASHBOARD, 'dashboard baseline when authenticated'), async () => {
    await loginViaApi()
    await assertScreenshotMatches('mobile-dashboard')
  })

  it(tc(TC.VISUAL_COMPONENTS, 'components page primary buttons baseline'), async () => {
    await loginViaApi()
    await browser.url(appPath('/web/components.html'))
    await waitForTestId('page-components')
    await assertScreenshotMatches('mobile-components')
  })
})
