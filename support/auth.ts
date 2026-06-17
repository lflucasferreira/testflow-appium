import axios from 'axios'
import { DEMO_EMAIL, DEMO_PASSWORD, getApiBaseUrl } from './config'
import { openAppPath, seedSessionOnOrigin } from './navigation'
import { clickTestId, fillTestId, waitForTestId } from './selectors'

export interface AuthSession {
  email: string
  name: string
  token: string
}

export async function fetchAuthToken(
  email = DEMO_EMAIL,
  password = DEMO_PASSWORD,
): Promise<AuthSession> {
  const response = await axios.post(`${getApiBaseUrl()}/api/auth/login`, { email, password })
  return {
    email,
    name: response.data.user?.name ?? 'Demo User',
    token: response.data.token,
  }
}

export async function injectAuthSession(session: AuthSession): Promise<void> {
  await browser.execute((auth) => {
    sessionStorage.setItem('sandbox-auth', JSON.stringify(auth))
    sessionStorage.setItem('sandbox-token', auth.token)
  }, session)
}

export async function loginViaApi(
  email = DEMO_EMAIL,
  password = DEMO_PASSWORD,
): Promise<AuthSession> {
  const session = await fetchAuthToken(email, password)
  await seedSessionOnOrigin(() => injectAuthSession(session))
  await openAppPath('/web/dashboard.html')
  await waitForTestId('page-dashboard')
  return session
}

export async function visitAuthenticated(path: string): Promise<void> {
  const session = await fetchAuthToken()
  await seedSessionOnOrigin(() => injectAuthSession(session))
  await openAppPath(path.startsWith('/') ? path : `/${path}`)
}

export async function loginViaUi(
  email = DEMO_EMAIL,
  password = DEMO_PASSWORD,
): Promise<void> {
  await openAppPath('/web/login.html')
  await fillTestId('login-email', email)
  await fillTestId('login-password', password)
  await clickTestId('login-submit')
  await waitForTestId('page-dashboard')
}

export async function visitWithToken(path: string, token: string, email = DEMO_EMAIL): Promise<void> {
  const session: AuthSession = { email, name: 'Demo User', token }
  await seedSessionOnOrigin(() => injectAuthSession(session))
  await openAppPath(path.startsWith('/') ? path : `/${path}`)
}

export async function logoutViaUi(): Promise<void> {
  await clickTestId('nav-logout')
}

export async function getSessionAuth(): Promise<AuthSession | null> {
  return browser.execute(() => {
    const raw = sessionStorage.getItem('sandbox-auth')
    return raw ? JSON.parse(raw) : null
  })
}
