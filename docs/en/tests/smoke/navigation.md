# Smoke — Navigation and Session

**Source file:** [`navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)

---

## Purpose

This **smoke** suite verifies that the TestFlow mobile web application is operational after authentication. It covers three complementary dimensions:

1. **Page loading** — each authenticated route opens in the mobile browser without error and exposes the expected root element.
2. **Sidebar navigation** — links and active state behave according to the UI contract on a touch viewport.
3. **Logout** — session is cleared and the user is redirected to the index page.

The suite is designed to be **fast**: it uses API login (`fetchAuthToken` / `loginViaApi`) to avoid repeating UI auth in every test and checks only the root of each page, without deep flows. API health checks live in a separate Mocha suite at [`tests/api/auth.api.spec.ts`](../../../../tests/api/auth.api.spec.ts).

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Application running at `http://localhost:5050` on the host machine |
| **Android emulator** | Chrome WebView reaches TestFlow via `http://10.0.2.2:5050` (default `ANDROID_BASE_URL` loopback) |
| **iOS simulator** | Safari WebView reaches TestFlow via `http://127.0.0.1:5050` (default `IOS_BASE_URL` loopback) |
| **Appium** | Started automatically by `@wdio/appium-service` when you run WDIO |
| **Dependencies** | `npm install` executed at the project root |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` in environment variables or `.env` |
| **Execution** | `npm run test:smoke` or `wdio run wdio.conf.ts --spec tests/smoke/**/*.spec.ts` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@smoke` | Page navigation, sidebar, logout blocks | Fast post-deploy sanity checks |
| `@regression` | Page navigation block | Included in broader regression grep runs |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`fetchAuthToken`](../../../../support/auth.ts) | Axios `POST /api/auth/login` — fetches Bearer token once in `before` |
| [`visitWithToken`](../../../../support/auth.ts) | Seeds `sessionStorage` and opens a path in the mobile browser |
| [`loginViaApi`](../../../../support/auth.ts) | Full API login + dashboard visit for sidebar and logout tests |
| [`logoutViaUi`](../../../../support/auth.ts) | Taps `nav-logout` via `clickTestId` |
| [`waitForTestId`](../../../../support/selectors.ts) | Waits for `[data-testid="…"]` to exist and be displayed |
| [`browser.$`](https://webdriver.io/docs/api/browser/$) | Element lookup by CSS selector |
| `expect-webdriverio` | `toHaveUrl`, `toContain` matchers on browser and title |
| `describe` / `it` | Mocha test blocks (not Playwright `test`) |
| `browser.execute()` | Reads `sessionStorage` after logout |

---

## Step-by-step — block by block

### Block 1 — Imports and page list

```typescript
import { fetchAuthToken, loginViaApi, logoutViaUi, visitWithToken } from '../../support/auth'
import { waitForTestId } from '../../support/selectors'

const PAGES = [
  { path: '/web/dashboard.html', testId: 'page-dashboard', title: 'Dashboard' },
  // ... remaining pages
]
```

- **Given:** the project imports auth helpers and selector utilities.
- **When:** `PAGES` defines the contract for each route — path, root `testId`, and expected `<title>`.
- **Then:** adding a new page requires only one array entry, without duplicating logic.

**Pages covered:** Dashboard, Team, Settings, Components, Activity, Advanced, Wizard, UI States.

---

### Block 2 — Smoke: page navigation

```typescript
describe('Smoke — page navigation @smoke @regression', () => {
  let authToken: string

  before(async () => {
    authToken = (await fetchAuthToken()).token
  })

  for (const { path, testId, title } of PAGES) {
    it(`${title} page loads on mobile web`, async () => {
      await visitWithToken(path, authToken)
      await waitForTestId(testId)
      await expect(await browser.getTitle()).toContain(title)
    })
  }
})
```

- **Given:** a valid auth token is obtained once via API in `before`.
- **When:** each test seeds session data and navigates to a path in the mobile Chrome/Safari context.
- **Then:** the page root is visible and the browser title contains the expected page name — minimal proof of rendering on the emulator.

---

### Block 3 — Smoke: sidebar navigation

```typescript
describe('Smoke — sidebar navigation @smoke', () => {
  beforeEach(async () => {
    await loginViaApi()
    await waitForTestId('page-dashboard')
  })

  it('navigates from dashboard to team via sidebar', async () => {
    await waitForTestId('nav-team').then((el) => el.click())
    await waitForTestId('page-team')
    await expect(browser).toHaveUrl(expect.stringContaining('/web/team.html'))
  })
```

- **Given:** an authenticated user is on the dashboard with the sidebar visible.
- **When:** they tap the `nav-team` link.
- **Then:** the URL changes to `/web/team.html` and `page-team` appears.

**Active link test:**

```typescript
  it('highlights the active nav link', async () => {
    const nav = await waitForTestId('nav-dashboard')
    const className = await nav.getAttribute('class')
    expect(className).toMatch(/active/)
  })
```

- **Given:** the dashboard is the current route.
- **When:** the corresponding menu item is inspected.
- **Then:** its `class` attribute includes `active` — visual navigation feedback on mobile.

---

### Block 4 — Smoke: logout

```typescript
describe('Smoke — logout @smoke', () => {
  it('logout clears session and redirects to index', async () => {
    await loginViaApi()
    await waitForTestId('page-dashboard')

    await logoutViaUi()
    await expect(browser).toHaveUrl(expect.stringMatching(/\/web\/index\.html/))

    const auth = await browser.execute(() => sessionStorage.getItem('sandbox-auth'))
    expect(auth).toBeNull()
  })
})
```

- **Given:** an active session created via API login.
- **When:** the user taps logout.
- **Then:** they are redirected to the index page and `sandbox-auth` is removed from `sessionStorage`.

---

## How to run

```bash
# Full smoke suite (WDIO + Appium)
npm run test:smoke

# This file only
wdio run wdio.conf.ts --spec tests/smoke/navigation.spec.ts

# @smoke tag across all WDIO specs
npm run test:grep:smoke

# Android emulator explicitly
npm run test:android -- --spec tests/smoke/navigation.spec.ts

# iOS simulator
npm run test:ios -- --spec tests/smoke/navigation.spec.ts
```

---

## Related references

- Auth helpers: [`support/auth.ts`](../../../../support/auth.ts)
- Mobile base URLs: [`support/config.ts`](../../../../support/config.ts)
- Selector helpers: [`support/selectors.ts`](../../../../support/selectors.ts)
- API health suite: [`tests/api/auth.api.spec.ts`](../../../../tests/api/auth.api.spec.ts)
- WDIO config: [`wdio.conf.ts`](../../../../wdio.conf.ts)
