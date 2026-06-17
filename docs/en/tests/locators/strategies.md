# Appium Locator Strategies

**Source file:** [`strategies.spec.ts`](../../../../tests/locators/strategies.spec.ts)

---

## Purpose

This **Appium-specific** suite demonstrates **element location strategies** on the login page. It validates five approaches:

1. **CSS / data-testid** — preferred stable selector via `byTestId` helper.
2. **XPath** — `//input[@data-testid="login-email"]` resolves the email field.
3. **Accessible name / text** — submit button found by selector and has non-empty text.
4. **Chained selectors** — form root and child email input located independently.
5. **Explicit waits** — `waitForDisplayed` and `waitForEnabled` before assertion.

The login page is used as a minimal fixture because it is unauthenticated and loads quickly on every platform.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | `http://10.0.2.2:5050` loopback |
| **iOS simulator** | `http://127.0.0.1:5050` loopback |
| **Appium** | Mobile browser session |
| **Dependencies** | `npm install` |
| **Execution** | `npm run test:locators` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@appium` | Entire `Appium locator strategies` describe block | Appium-specific grep |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`byTestId`](../../../../support/selectors.ts) | Returns `[data-testid="…"]` CSS selector string |
| [`browser.$`](https://webdriver.io/docs/api/browser/$) | Single element lookup |
| XPath selector | `//input[@data-testid="login-email"]` |
| `waitForDisplayed` / `waitForEnabled` | Explicit wait on element state |
| `getText()` | Reads visible button label |
| `isExisting()` | Checks whether form root element exists in DOM |
| `expect-webdriverio` | `toBeDisplayed`, `toBeEnabled` |
| [`LoginPage`](../../../../pages/LoginPage.ts) | Navigates to login page in `beforeEach` |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('Appium locator strategies @appium', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })
```

- **Given:** a fresh mobile browser session.
- **When:** the login page opens.
- **Then:** all locator tests share the same DOM fixture.

---

### Block 2 — CSS / data-testid

```typescript
  it('finds element by CSS / data-testid selector', async () => {
    const el = await browser.$(byTestId('login-email'))
    await expect(el).toBeDisplayed()
  })
```

- **Given:** the login page uses `data-testid` attributes.
- **When:** `browser.$(byTestId('login-email'))` resolves the selector.
- **Then:** the email input is displayed — preferred locator strategy for TestFlow.

---

### Block 3 — XPath

```typescript
  it('finds element by XPath', async () => {
    const el = await browser.$('//input[@data-testid="login-email"]')
    await expect(el).toBeDisplayed()
  })
```

- **Given:** the email input has a `data-testid` attribute.
- **When:** an XPath expression targets that attribute.
- **Then:** the same element is found — XPath works as a fallback strategy.

---

### Block 4 — Accessible name / text

```typescript
  it('finds submit button by accessible name / text', async () => {
    const el = await browser.$('button[data-testid="login-submit"]')
    await expect(el).toBeDisplayed()
    const text = await el.getText()
    expect(text.length).toBeGreaterThan(0)
  })
```

- **Given:** the submit button has a `data-testid` and visible label.
- **When:** the element is found and `getText()` is called.
- **Then:** the button is displayed and its text is non-empty.

---

### Block 5 — Chained selectors

```typescript
  it('chains child selectors from form root', async () => {
    const form = await browser.$('form[data-testid="login-form"], .login-form, main')
    const email = await browser.$(byTestId('login-email'))
    await expect(email).toBeDisplayed()
    expect(await form.isExisting()).toBeDefined()
  })
```

- **Given:** the login form has a identifiable root (`login-form`, `.login-form`, or `main`).
- **When:** the form root and email child are queried separately.
- **Then:** email is displayed and form existence check returns a defined boolean.

---

### Block 6 — Explicit waits

```typescript
  it('waits for element state with explicit wait', async () => {
    const el = await browser.$(byTestId('login-password'))
    await el.waitForDisplayed({ timeout: 10000 })
    await el.waitForEnabled({ timeout: 5000 })
    await expect(el).toBeEnabled()
  })
})
```

- **Given:** the password field may not be immediately interactive on slow emulators.
- **When:** explicit waits ensure displayed (10 s) and enabled (5 s) states.
- **Then:** `toBeEnabled()` passes — element is ready for mobile keyboard input.

---

## How to run

```bash
# Full locators suite
npm run test:locators

# This file only
wdio run wdio.conf.ts --spec tests/locators/strategies.spec.ts

# All @appium specs
npm run test:grep:appium
```

---

## Related references

- Selector helpers: [`support/selectors.ts`](../../../../support/selectors.ts)
- Login Page Object: [`pages/LoginPage.ts`](../../../../pages/LoginPage.ts)
- Context switching: [`tests/contexts/webview.spec.ts`](../../../../tests/contexts/webview.spec.ts)
- Auth login tests: [`tests/auth/login.spec.ts`](../../../../tests/auth/login.spec.ts)
