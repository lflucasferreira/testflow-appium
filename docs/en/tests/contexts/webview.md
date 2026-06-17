# Appium Context Switching

**Source file:** [`webview.spec.ts`](../../../../tests/contexts/webview.spec.ts)

---

## Purpose

This **Appium-specific** suite validates **browser context management** on mobile web. Even in a Chrome/Safari mobile web session, Appium exposes context APIs that matter for hybrid apps. This suite checks:

1. **List contexts** — `browser.getContexts()` returns at least one context.
2. **Current context** — commands run successfully in the active web context.
3. **WEBVIEW switch** — `switchToWebContext()` finds and switches to a WEBVIEW context when present.
4. **DOM queries** — `data-testid` attributes are discoverable via in-browser JavaScript.

On pure mobile web (no native wrapper), contexts typically contain a single `CHROMIUM` or `WEBVIEW` entry, but the tests remain valid for hybrid scenarios.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | Chrome WebView context via UiAutomator2 |
| **iOS simulator** | Safari WebView context via XCUITest |
| **Appium** | Context APIs enabled in session |
| **Dependencies** | `npm install` |
| **Execution** | `npm run test:contexts` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@appium` | Entire `Appium context switching` describe block | Appium-specific grep |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`listContexts`](../../../../support/helpers/gestures.ts) | Maps `browser.getContexts()` to string array |
| [`getCurrentContext`](../../../../support/helpers/gestures.ts) | Returns `browser.getContext()` as string |
| [`switchToWebContext`](../../../../support/helpers/gestures.ts) | Finds context containing `WEBVIEW` and calls `browser.switchContext` |
| `browser.execute` | DOM query for `[data-testid]` elements inside web context |
| [`LoginPage`](../../../../pages/LoginPage.ts) | Opens login page as test fixture |
| `expect-webdriverio` | `toBeDisplayed` on email input in current context |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('Appium context switching @appium', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })
```

- **Given:** a fresh Appium session.
- **When:** the login page loads.
- **Then:** each context test starts on a known page.

---

### Block 2 — List contexts

```typescript
  it(tc(TC.APPIUM_CONTEXT, 'lists available contexts on mobile web'), async () => {
    const contexts = await listContexts()
    expect(contexts.length).toBeGreaterThan(0)
  })
```

- **Given:** an active Appium session with at least one browser context.
- **When:** `listContexts()` calls `browser.getContexts()`.
- **Then:** the array length is greater than zero.

---

### Block 3 — Current context commands

```typescript
  it('runs commands in current web context', async () => {
    const context = await getCurrentContext()
    expect(context).toBeTruthy()
    await expect(await login().emailInput()).toBeDisplayed()
  })
```

- **Given:** a web context is active.
- **When:** the current context name is read and an element is queried.
- **Then:** context is truthy and `login-email` input is displayed.

---

### Block 4 — Switch to WEBVIEW

```typescript
  it('switches to WEBVIEW when hybrid context exists', async () => {
    const before = await getCurrentContext()
    await switchToWebContext()
    const after = await getCurrentContext()
    expect(after).toBeTruthy()
    expect(typeof before).toBe('string')
  })
```

- **Given:** one or more contexts are available.
- **When:** `switchToWebContext()` looks for a context containing `WEBVIEW`.
- **Then:** the after-context is truthy — switch succeeded or remained in the same web context.

---

### Block 5 — DOM queries in web context

```typescript
  it('executes DOM queries inside web context', async () => {
    const testIds = await browser.execute(() =>
      Array.from(document.querySelectorAll('[data-testid]'))
        .slice(0, 5)
        .map((el) => el.getAttribute('data-testid')),
    )
    expect(testIds).toContain('login-email')
  })
})
```

- **Given:** the login page DOM is loaded in the web context.
- **When:** JavaScript queries the first five `[data-testid]` elements.
- **Then:** `login-email` is among the results — confirms DOM access works through Appium's web context.

---

## How to run

```bash
# Full contexts suite
npm run test:contexts

# This file only
wdio run wdio.conf.ts --spec tests/contexts/webview.spec.ts

# All @appium specs
npm run test:grep:appium
```

---

## Related references

- Context helpers: [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts)
- Locator strategies: [`tests/locators/strategies.spec.ts`](../../../../tests/locators/strategies.spec.ts)
- Device capabilities: [`tests/device/device.spec.ts`](../../../../tests/device/device.spec.ts)
