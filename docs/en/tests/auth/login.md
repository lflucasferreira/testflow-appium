# Authentication — Login

**Source file:** [`login.spec.ts`](../../../../tests/auth/login.spec.ts)

---

## Purpose

This suite validates the **login flow on mobile web** through the TestFlow login page. It exercises:

1. **Page structure** — form fields and submit button render correctly in the mobile browser.
2. **Valid credentials** — UI login redirects to the dashboard and persists auth data in `sessionStorage`.
3. **Invalid credentials** — error messages appear and the user stays on the login page.
4. **Smoke shortcut** — `loginViaUi` reaches the dashboard as a fast auth path.

Unlike API-based login used in most regression suites, these tests deliberately interact with the login form to verify the end-user experience on Android Chrome or iOS Safari.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Application running at `http://localhost:5050` (host) |
| **Android emulator** | `ANDROID_BASE_URL` defaults to `http://10.0.2.2:5050` |
| **iOS simulator** | `IOS_BASE_URL` defaults to `http://127.0.0.1:5050` |
| **Appium** | UiAutomator2 (Android) or XCUITest (iOS) driver installed — `npm run appium:drivers` |
| **Dependencies** | `npm install` at project root |
| **Credentials** | `DEMO_EMAIL` / `DEMO_PASSWORD` in `.env`, plus `fixtures/credentials.json` for invalid cases |
| **Execution** | `npm run test:auth` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@regression` | Main authentication block | Full login regression coverage |
| `@smoke` | "Authentication — API login shortcut" block | Quick proof that `loginViaUi` works |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`LoginPage`](../../../../pages/LoginPage.ts) | Page Object encapsulating login form selectors and actions |
| [`loginViaUi`](../../../../support/auth.ts) | Fills `login-email` / `login-password` and taps `login-submit` |
| [`getSessionAuth`](../../../../support/auth.ts) | Reads parsed `sandbox-auth` from `sessionStorage` via `browser.execute` |
| [`browser.$`](https://webdriver.io/docs/api/browser/$) | Resolves `[data-testid="page-dashboard"]` in smoke test |
| `expect-webdriverio` | `toBeDisplayed`, `toHaveAttribute`, `toHaveUrl` assertions |
| `describe` / `it` | Mocha nested blocks for structure, valid, and invalid credential groups |
| `beforeEach` | Opens login page before every test in the regression block |

---

## Step-by-step — block by block

### Block 1 — Page structure

```typescript
describe('Authentication @regression', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })

  describe('Page structure', () => {
    it('renders all form elements on mobile', async () => {
      await expect(await login().emailInput()).toBeDisplayed()
      await expect(await login().passwordInput()).toBeDisplayed()
      await expect(await login().submitBtn()).toBeDisplayed()
    })
```

- **Given:** the login page is opened in the mobile browser.
- **When:** each form element is queried through the Page Object.
- **Then:** email input, password input, and submit button are all displayed.

**Password masking:**

```typescript
    it('password field masks input', async () => {
      const input = await login().passwordInput()
      await expect(input).toHaveAttribute('type', 'password')
    })
```

- **Given:** the password field is visible.
- **When:** its `type` attribute is inspected.
- **Then:** it equals `password` — input is masked on mobile keyboards.

---

### Block 2 — Valid credentials

```typescript
  describe('Valid credentials', () => {
    it('logs in via UI and redirects to dashboard', async () => {
      await login().loginWith(DEMO_EMAIL, DEMO_PASSWORD)
      await login().shouldRedirectToDashboard()
    })

    it('sets auth data in sessionStorage after login', async () => {
      await login().loginWith(DEMO_EMAIL, DEMO_PASSWORD)
      await login().shouldRedirectToDashboard()
      const auth = await getSessionAuth()
      expect(auth).not.toBeNull()
      expect(auth?.email).toBe(DEMO_EMAIL)
    })
  })
```

- **Given:** valid demo credentials from [`support/config.ts`](../../../../support/config.ts).
- **When:** the user fills the form and submits.
- **Then:** the dashboard loads and `sessionStorage` contains an auth object with the correct email.

---

### Block 3 — Invalid credentials

```typescript
  describe('Invalid credentials', () => {
    it('shows error for wrong password', async () => {
      await login().loginWith(credentials.valid.email, credentials.invalid.password)
      await login().shouldShowError('Invalid credentials')
    })

    it('does not navigate away on failed login', async () => {
      await login().loginWith(credentials.invalid.email, credentials.invalid.password)
      await expect(browser).toHaveUrl(expect.stringContaining('/web/login.html'))
    })
  })
})
```

- **Given:** deliberately wrong email or password from `fixtures/credentials.json`.
- **When:** the user submits the form.
- **Then:** an error message appears (wrong password) or the URL remains on `/web/login.html` (fully invalid pair).

---

### Block 4 — Smoke shortcut

```typescript
describe('Authentication — API login shortcut @smoke', () => {
  it('loginViaUi reaches dashboard', async () => {
    await loginViaUi()
    await expect(await browser.$('[data-testid="page-dashboard"]')).toBeDisplayed()
  })
})
```

- **Given:** no pre-existing session.
- **When:** `loginViaUi()` performs a full UI login programmatically.
- **Then:** `page-dashboard` is displayed — confirms the helper works for downstream smoke tests.

---

## How to run

```bash
# Full auth suite
npm run test:auth

# This file only
wdio run wdio.conf.ts --spec tests/auth/login.spec.ts

# Smoke shortcut block only
wdio run wdio.conf.ts --spec tests/auth/login.spec.ts --mochaOpts.grep "API login shortcut"

# Android
PLATFORM=android npm run test:auth
```

---

## Related references

- Login Page Object: [`pages/LoginPage.ts`](../../../../pages/LoginPage.ts)
- Auth helpers: [`support/auth.ts`](../../../../support/auth.ts)
- Demo credentials: [`support/config.ts`](../../../../support/config.ts)
- Invalid credentials fixture: [`fixtures/credentials.json`](../../../../fixtures/credentials.json)
